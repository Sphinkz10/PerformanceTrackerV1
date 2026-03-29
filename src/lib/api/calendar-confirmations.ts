import { supabase } from '@/lib/supabase';

export interface EventConfirmation {
  id: string;
  workspace_id: string;
  event_id: string;
  athlete_id: string;
  status: 'pending' | 'confirmed' | 'declined' | 'maybe';
  response_note?: string;
  responded_at?: string;
  reminded_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Enriched data
  athlete_name?: string;
  athlete_email?: string;
  athlete_avatar?: string;
  event_title?: string;
  event_start?: string;
}

export interface CreateConfirmationData {
  workspace_id: string;
  event_id: string;
  athlete_id: string;
  status?: 'pending' | 'confirmed' | 'declined' | 'maybe';
  response_note?: string;
}

export interface UpdateConfirmationData {
  status?: 'pending' | 'confirmed' | 'declined' | 'maybe';
  response_note?: string;
  responded_at?: string;
}

// =====================================================================================
// GET - Buscar confirmações
// =====================================================================================

export async function getEventConfirmations(eventId: string) {
  const { data, error } = await supabase
    .from('calendar_event_confirmations_view')
    .select('*')
    .eq('event_id', eventId)
    .order('athlete_name', { ascending: true });

  if (error) {
    console.error('Error fetching event confirmations:', error);
    throw error;
  }

  return data as EventConfirmation[];
}

export async function getAthleteConfirmations(athleteId: string, options?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  let query = supabase
    .from('calendar_event_confirmations_view')
    .select('*')
    .eq('athlete_id', athleteId);

  if (options?.startDate) {
    query = query.gte('event_start', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('event_start', options.endDate);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query.order('event_start', { ascending: true });

  if (error) {
    console.error('Error fetching athlete confirmations:', error);
    throw error;
  }

  return data as EventConfirmation[];
}

// =====================================================================================
// POST - Criar confirmação
// =====================================================================================

export async function createConfirmation(confirmationData: CreateConfirmationData) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('calendar_event_confirmations')
    .insert({
      ...confirmationData,
      created_by: user?.id,
      status: confirmationData.status || 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating confirmation:', error);
    throw error;
  }

  return data as EventConfirmation;
}

// =====================================================================================
// PATCH - Atualizar confirmação
// =====================================================================================

export async function updateConfirmation(
  confirmationId: string,
  updates: UpdateConfirmationData
) {
  const updateData: any = { ...updates };
  
  // Se está mudando status, marcar responded_at
  if (updates.status && updates.status !== 'pending') {
    updateData.responded_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('calendar_event_confirmations')
    .update(updateData)
    .eq('id', confirmationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating confirmation:', error);
    throw error;
  }

  return data as EventConfirmation;
}

// =====================================================================================
// PATCH - Atualizar status (atalho)
// =====================================================================================

export async function updateConfirmationStatus(
  confirmationId: string,
  status: 'pending' | 'confirmed' | 'declined' | 'maybe',
  note?: string
) {
  return updateConfirmation(confirmationId, {
    status,
    response_note: note,
    responded_at: new Date().toISOString()
  });
}

// =====================================================================================
// DELETE - Remover confirmação
// =====================================================================================

export async function deleteConfirmation(confirmationId: string) {
  const { error } = await supabase
    .from('calendar_event_confirmations')
    .delete()
    .eq('id', confirmationId);

  if (error) {
    console.error('Error deleting confirmation:', error);
    throw error;
  }

  return true;
}

// =====================================================================================
// BULK - Criar múltiplas confirmações
// =====================================================================================

export async function createBulkConfirmations(
  eventId: string,
  workspaceId: string,
  athleteIds: string[]
) {
  const { data: { user } } = await supabase.auth.getUser();

  const confirmations = athleteIds.map(athleteId => ({
    workspace_id: workspaceId,
    event_id: eventId,
    athlete_id: athleteId,
    status: 'pending' as const,
    created_by: user?.id
  }));

  const { data, error } = await supabase
    .from('calendar_event_confirmations')
    .insert(confirmations)
    .select();

  if (error) {
    console.error('Error creating bulk confirmations:', error);
    throw error;
  }

  return data as EventConfirmation[];
}

// =====================================================================================
// UTILITY - Marcar lembrete enviado
// =====================================================================================

export async function markReminderSent(confirmationId: string) {
  const { data, error } = await supabase
    .from('calendar_event_confirmations')
    .update({ reminded_at: new Date().toISOString() })
    .eq('id', confirmationId)
    .select()
    .single();

  if (error) {
    console.error('Error marking reminder sent:', error);
    throw error;
  }

  return data as EventConfirmation;
}

// =====================================================================================
// UTILITY - Estatísticas de confirmação
// =====================================================================================

export interface ConfirmationStats {
  total: number;
  pending: number;
  confirmed: number;
  declined: number;
  maybe: number;
  responseRate: number;
}

export async function getEventConfirmationStats(eventId: string): Promise<ConfirmationStats> {
  const confirmations = await getEventConfirmations(eventId);
  
  const stats: ConfirmationStats = {
    total: confirmations.length,
    pending: confirmations.filter(c => c.status === 'pending').length,
    confirmed: confirmations.filter(c => c.status === 'confirmed').length,
    declined: confirmations.filter(c => c.status === 'declined').length,
    maybe: confirmations.filter(c => c.status === 'maybe').length,
    responseRate: 0
  };

  const responded = stats.confirmed + stats.declined + stats.maybe;
  stats.responseRate = stats.total > 0 ? (responded / stats.total) * 100 : 0;

  return stats;
}
