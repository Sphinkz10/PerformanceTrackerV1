import { supabase } from '@/lib/supabase';
import { addDays, addWeeks, addMonths, addYears, isBefore, isAfter, format } from 'date-fns';

export interface RecurrencePattern {
  id?: string;
  workspace_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  days_of_week?: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  day_of_month?: number;
  end_type: 'never' | 'after' | 'on_date';
  end_after_occurrences?: number;
  end_date?: string;
}

export interface RecurringEventData {
  // Dados base do evento
  title: string;
  description?: string;
  type: string;
  start_date: string;
  end_date: string;
  location?: string;
  athlete_ids?: string[];
  workout_id?: string;
  requires_confirmation?: boolean;
  confirmation_deadline?: string;
  // Recorrência
  recurrence: RecurrencePattern;
}

// =====================================================================================
// CREATE - Criar série de eventos recorrentes
// =====================================================================================

export async function createRecurringSeries(
  workspaceId: string,
  eventData: RecurringEventData
): Promise<any[]> {
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Criar o padrão de recorrência
  const { data: recurrencePattern, error: recurrenceError } = await supabase
    .from('calendar_event_recurrence')
    .insert({
      workspace_id: workspaceId,
      frequency: eventData.recurrence.frequency,
      interval: eventData.recurrence.interval,
      days_of_week: eventData.recurrence.days_of_week || [],
      day_of_month: eventData.recurrence.day_of_month,
      end_type: eventData.recurrence.end_type,
      end_after_occurrences: eventData.recurrence.end_after_occurrences,
      end_date: eventData.recurrence.end_date
    })
    .select()
    .single();

  if (recurrenceError) {
    console.error('Error creating recurrence pattern:', recurrenceError);
    throw recurrenceError;
  }

  // 2. Gerar as ocorrências
  const occurrences = generateOccurrences(
    new Date(eventData.start_date),
    new Date(eventData.end_date),
    eventData.recurrence
  );

  // 3. Criar evento pai
  const duration = new Date(eventData.end_date).getTime() - new Date(eventData.start_date).getTime();
  
  const firstOccurrence = occurrences[0];
  const { data: parentEvent, error: parentError } = await supabase
    .from('calendar_events')
    .insert({
      workspace_id: workspaceId,
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      start_date: firstOccurrence.toISOString(),
      end_date: new Date(firstOccurrence.getTime() + duration).toISOString(),
      location: eventData.location,
      athlete_ids: eventData.athlete_ids || [],
      workout_id: eventData.workout_id,
      requires_confirmation: eventData.requires_confirmation || false,
      confirmation_deadline: eventData.confirmation_deadline,
      recurrence_id: recurrencePattern.id,
      is_recurrence_parent: true,
      status: 'scheduled',
      created_by: user?.id
    })
    .select()
    .single();

  if (parentError) {
    console.error('Error creating parent event:', parentError);
    throw parentError;
  }

  // 4. Criar eventos filhos (pular primeira ocorrência que já é o pai)
  const childEvents = occurrences.slice(1).map(occurrence => ({
    workspace_id: workspaceId,
    title: eventData.title,
    description: eventData.description,
    type: eventData.type,
    start_date: occurrence.toISOString(),
    end_date: new Date(occurrence.getTime() + duration).toISOString(),
    location: eventData.location,
    athlete_ids: eventData.athlete_ids || [],
    workout_id: eventData.workout_id,
    requires_confirmation: eventData.requires_confirmation || false,
    confirmation_deadline: eventData.confirmation_deadline,
    recurrence_id: recurrencePattern.id,
    recurrence_parent_id: parentEvent.id,
    is_recurrence_parent: false,
    is_exception: false,
    status: 'scheduled',
    created_by: user?.id
  }));

  if (childEvents.length > 0) {
    const { data: children, error: childrenError } = await supabase
      .from('calendar_events')
      .insert(childEvents)
      .select();

    if (childrenError) {
      console.error('Error creating child events:', childrenError);
      throw childrenError;
    }

    return [parentEvent, ...children];
  }

  return [parentEvent];
}

// =====================================================================================
// GENERATE - Gerar datas de ocorrências
// =====================================================================================

function generateOccurrences(
  startDate: Date,
  endDate: Date,
  pattern: RecurrencePattern,
  maxOccurrences: number = 365 // Limite de segurança
): Date[] {
  const occurrences: Date[] = [];
  let currentDate = new Date(startDate);
  const eventDuration = endDate.getTime() - startDate.getTime();

  // Determinar data limite
  let limitDate: Date | null = null;
  if (pattern.end_type === 'on_date' && pattern.end_date) {
    limitDate = new Date(pattern.end_date);
  }

  const maxCount = pattern.end_type === 'after' && pattern.end_after_occurrences
    ? pattern.end_after_occurrences
    : maxOccurrences;

  while (occurrences.length < maxCount) {
    // Verificar se passou da data limite
    if (limitDate && isAfter(currentDate, limitDate)) {
      break;
    }

    // Adicionar ocorrência atual
    if (shouldIncludeDate(currentDate, startDate, pattern)) {
      occurrences.push(new Date(currentDate));
    }

    // Avançar para próxima data
    currentDate = getNextDate(currentDate, pattern);

    // Segurança: parar se já passou 2 anos no futuro
    const twoYearsFromNow = addYears(new Date(), 2);
    if (isAfter(currentDate, twoYearsFromNow)) {
      break;
    }
  }

  return occurrences;
}

function shouldIncludeDate(date: Date, startDate: Date, pattern: RecurrencePattern): boolean {
  // Para weekly, verificar se o dia da semana está incluso
  if (pattern.frequency === 'weekly' && pattern.days_of_week && pattern.days_of_week.length > 0) {
    const dayOfWeek = date.getDay();
    return pattern.days_of_week.includes(dayOfWeek);
  }

  // Para monthly com dia específico
  if (pattern.frequency === 'monthly' && pattern.day_of_month) {
    return date.getDate() === pattern.day_of_month;
  }

  return true;
}

function getNextDate(currentDate: Date, pattern: RecurrencePattern): Date {
  switch (pattern.frequency) {
    case 'daily':
      return addDays(currentDate, pattern.interval);
    case 'weekly':
      // Se tem dias específicos, avançar 1 dia para encontrar próximo dia válido
      if (pattern.days_of_week && pattern.days_of_week.length > 0) {
        return addDays(currentDate, 1);
      }
      return addWeeks(currentDate, pattern.interval);
    case 'monthly':
      return addMonths(currentDate, pattern.interval);
    case 'yearly':
      return addYears(currentDate, pattern.interval);
    default:
      return addDays(currentDate, 1);
  }
}

// =====================================================================================
// GET - Buscar informações de recorrência
// =====================================================================================

export async function getRecurrencePattern(recurrenceId: string) {
  const { data, error } = await supabase
    .from('calendar_event_recurrence')
    .select('*')
    .eq('id', recurrenceId)
    .single();

  if (error) {
    console.error('Error fetching recurrence pattern:', error);
    throw error;
  }

  return data as RecurrencePattern;
}

export async function getRecurrenceDescription(recurrenceId: string): Promise<string> {
  const { data, error } = await supabase
    .rpc('get_recurrence_description', {
      p_frequency: '',
      p_interval: 1,
      p_days_of_week: [],
      p_day_of_month: null,
      p_end_type: 'never',
      p_end_after_occurrences: null,
      p_end_date: null
    });

  if (error) {
    console.error('Error getting recurrence description:', error);
    return 'Evento recorrente';
  }

  return data || 'Evento recorrente';
}

// =====================================================================================
// UPDATE - Atualizar evento recorrente
// =====================================================================================

export async function updateRecurrenceOccurrence(
  eventId: string,
  updates: any,
  updateType: 'this' | 'future' | 'all'
) {
  // Buscar evento
  const { data: event } = await supabase
    .from('calendar_events')
    .select('*, recurrence_parent_id, is_recurrence_parent')
    .eq('id', eventId)
    .single();

  if (!event) {
    throw new Error('Event not found');
  }

  if (updateType === 'this') {
    // Atualizar apenas este evento e marcá-lo como exceção
    const { data, error } = await supabase
      .from('calendar_events')
      .update({ ...updates, is_exception: true })
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return [data];
  }

  if (updateType === 'all') {
    // Atualizar todos os eventos da série
    const parentId = event.is_recurrence_parent ? event.id : event.recurrence_parent_id;
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .or(`id.eq.${parentId},recurrence_parent_id.eq.${parentId}`)
      .select();

    if (error) throw error;
    return data;
  }

  if (updateType === 'future') {
    // Atualizar este e futuros
    const parentId = event.is_recurrence_parent ? event.id : event.recurrence_parent_id;
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .or(`id.eq.${parentId},recurrence_parent_id.eq.${parentId}`)
      .gte('start_date', event.start_date)
      .select();

    if (error) throw error;
    return data;
  }

  return [];
}

// =====================================================================================
// DELETE - Deletar evento recorrente
// =====================================================================================

export async function deleteRecurrenceOccurrence(
  eventId: string,
  deleteType: 'this' | 'future' | 'all'
) {
  // Buscar evento
  const { data: event } = await supabase
    .from('calendar_events')
    .select('*, recurrence_parent_id, is_recurrence_parent')
    .eq('id', eventId)
    .single();

  if (!event) {
    throw new Error('Event not found');
  }

  if (deleteType === 'this') {
    // Deletar apenas este evento
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  }

  if (deleteType === 'all') {
    // Deletar série completa
    const parentId = event.is_recurrence_parent ? event.id : event.recurrence_parent_id;
    
    const { error } = await supabase.rpc('delete_recurring_series', {
      p_parent_event_id: parentId
    });

    if (error) throw error;
    return true;
  }

  if (deleteType === 'future') {
    // Deletar este e futuros
    const parentId = event.is_recurrence_parent ? event.id : event.recurrence_parent_id;
    
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .or(`id.eq.${eventId},recurrence_parent_id.eq.${parentId}`)
      .gte('start_date', event.start_date);

    if (error) throw error;
    return true;
  }

  return false;
}

// =====================================================================================
// UTILITY - Gerar texto de descrição local
// =====================================================================================

export function generateRecurrenceText(pattern: RecurrencePattern): string {
  let text = '';

  // Frequência
  if (pattern.frequency === 'daily') {
    text = pattern.interval === 1 ? 'Todos os dias' : `A cada ${pattern.interval} dias`;
  } else if (pattern.frequency === 'weekly') {
    text = pattern.interval === 1 ? 'Todas as semanas' : `A cada ${pattern.interval} semanas`;
    
    if (pattern.days_of_week && pattern.days_of_week.length > 0) {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const days = pattern.days_of_week.map(d => dayNames[d]).join(', ');
      text += ` em ${days}`;
    }
  } else if (pattern.frequency === 'monthly') {
    text = pattern.interval === 1 ? 'Todo mês' : `A cada ${pattern.interval} meses`;
    
    if (pattern.day_of_month) {
      text += ` no dia ${pattern.day_of_month}`;
    }
  } else if (pattern.frequency === 'yearly') {
    text = pattern.interval === 1 ? 'Todo ano' : `A cada ${pattern.interval} anos`;
  }

  // Término
  if (pattern.end_type === 'after' && pattern.end_after_occurrences) {
    text += `, ${pattern.end_after_occurrences} vezes`;
  } else if (pattern.end_type === 'on_date' && pattern.end_date) {
    text += `, até ${format(new Date(pattern.end_date), 'dd/MM/yyyy')}`;
  }

  return text;
}
