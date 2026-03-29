/**
 * DEMO DATA GENERATOR
 * 
 * Generates realistic demo data for calendar testing and demos
 * Useful for presentations, testing, and onboarding
 * 
 * @version 1.0.0
 * @created 20 Janeiro 2026
 */

import { CalendarEvent } from '@/types/calendar';
import { addDays, addHours, addMinutes, startOfDay, format, setHours, setMinutes } from 'date-fns';

const EVENT_TYPES = ['training', 'competition', 'evaluation', 'meeting', 'recovery', 'other'] as const;
const STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled'] as const;

const TRAINING_TITLES = [
  'Treino de Força',
  'Treino de Resistência',
  'Treino Técnico',
  'Treino Tático',
  'Sessão de Velocidade',
  'Treino de Coordenação',
  'Trabalho Aeróbico',
  'Circuito Funcional',
  'Treino de Potência',
  'Sessão de Agilidade',
];

const COMPETITION_TITLES = [
  'Campeonato Regional',
  'Torneio Amigável',
  'Liga Principal - Jornada',
  'Final da Taça',
  'Qualificação Europeia',
  'Jogo da Taça',
  'Playoff',
  'Derby Local',
];

const EVALUATION_TITLES = [
  'Avaliação Física',
  'Testes de Velocidade',
  'Avaliação Técnica',
  'Medições Antropométricas',
  'Teste VO2 Max',
  'Avaliação Postural',
  'Força Máxima',
  'Testes de Salto',
];

const MEETING_TITLES = [
  'Reunião Técnica',
  'Análise de Vídeo',
  'Briefing Pré-Jogo',
  'Debriefing Pós-Jogo',
  'Reunião com Atletas',
  'Planeamento Semanal',
  'Análise de Performance',
  'Reunião com Staff',
];

const RECOVERY_TITLES = [
  'Sessão de Recuperação',
  'Massagem Desportiva',
  'Crioterapia',
  'Banhos de Contraste',
  'Yoga e Alongamentos',
  'Fisioterapia',
  'Treino Regenerativo',
  'Piscina - Recuperação',
];

const LOCATIONS = [
  'Campo Principal',
  'Campo 2',
  'Ginásio A',
  'Ginásio B',
  'Sala de Reuniões',
  'Piscina',
  'Pista de Atletismo',
  'Centro de Treino',
  'Estádio Municipal',
  'Pavilhão Desportivo',
];

const DESCRIPTIONS = [
  'Foco em trabalho de base e condicionamento físico.',
  'Sessão intensa com ênfase na técnica individual.',
  'Preparação táctica para o próximo jogo.',
  'Trabalho específico de posição com grupos reduzidos.',
  'Sessão de manutenção e prevenção de lesões.',
  'Análise detalhada do adversário e ajustes estratégicos.',
  'Trabalho de alta intensidade com intervalos curtos.',
  'Desenvolvimento de capacidades coordenativas.',
];

/**
 * Generate random event
 */
function generateRandomEvent(
  workspaceId: string,
  baseDate: Date,
  athleteIds: string[]
): Partial<CalendarEvent> {
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];

  let title: string;
  let duration: number;

  switch (eventType) {
    case 'training':
      title = TRAINING_TITLES[Math.floor(Math.random() * TRAINING_TITLES.length)];
      duration = 60 + Math.floor(Math.random() * 60); // 60-120 min
      break;
    case 'competition':
      title = COMPETITION_TITLES[Math.floor(Math.random() * COMPETITION_TITLES.length)];
      duration = 90 + Math.floor(Math.random() * 30); // 90-120 min
      break;
    case 'evaluation':
      title = EVALUATION_TITLES[Math.floor(Math.random() * EVALUATION_TITLES.length)];
      duration = 30 + Math.floor(Math.random() * 30); // 30-60 min
      break;
    case 'meeting':
      title = MEETING_TITLES[Math.floor(Math.random() * MEETING_TITLES.length)];
      duration = 30 + Math.floor(Math.random() * 60); // 30-90 min
      break;
    case 'recovery':
      title = RECOVERY_TITLES[Math.floor(Math.random() * RECOVERY_TITLES.length)];
      duration = 45 + Math.floor(Math.random() * 45); // 45-90 min
      break;
    default:
      title = 'Evento Especial';
      duration = 60;
  }

  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const description = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];

  // Random time (between 8:00 and 20:00)
  const hour = 8 + Math.floor(Math.random() * 12);
  const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  const startTime = setMinutes(setHours(baseDate, hour), minute);

  // Random athlete selection (2-8 athletes)
  const numAthletes = 2 + Math.floor(Math.random() * 7);
  const selectedAthletes = athleteIds
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(numAthletes, athleteIds.length));

  return {
    workspace_id: workspaceId,
    title,
    description,
    start_time: startTime.toISOString(),
    duration,
    location,
    event_type: eventType,
    status,
    athlete_ids: selectedAthletes,
    requires_confirmation: eventType === 'competition' || Math.random() > 0.7,
    notes: Math.random() > 0.5 ? 'Atenção: ' + description : undefined,
  };
}

/**
 * Generate demo events for a date range
 */
export function generateDemoEvents(
  workspaceId: string,
  athleteIds: string[],
  options: {
    startDate?: Date;
    days?: number;
    eventsPerDay?: { min: number; max: number };
  } = {}
): Partial<CalendarEvent>[] {
  const {
    startDate = new Date(),
    days = 30,
    eventsPerDay = { min: 2, max: 5 },
  } = options;

  const events: Partial<CalendarEvent>[] = [];

  for (let day = 0; day < days; day++) {
    const currentDate = startOfDay(addDays(startDate, day));
    
    // Random number of events per day
    const numEvents =
      eventsPerDay.min +
      Math.floor(Math.random() * (eventsPerDay.max - eventsPerDay.min + 1));

    for (let i = 0; i < numEvents; i++) {
      const event = generateRandomEvent(workspaceId, currentDate, athleteIds);
      events.push(event);
    }
  }

  return events;
}

/**
 * Generate realistic weekly schedule
 */
export function generateWeeklySchedule(
  workspaceId: string,
  athleteIds: string[],
  startDate: Date = new Date()
): Partial<CalendarEvent>[] {
  const events: Partial<CalendarEvent>[] = [];
  const weekStart = startOfDay(startDate);

  // Monday: Morning training + Tactical meeting
  events.push({
    workspace_id: workspaceId,
    title: 'Treino Técnico-Tático',
    description: 'Foco em movimentos ofensivos e transições',
    start_time: setMinutes(setHours(weekStart, 10), 0).toISOString(),
    duration: 90,
    location: 'Campo Principal',
    event_type: 'training',
    status: 'confirmed',
    athlete_ids: athleteIds,
  });

  events.push({
    workspace_id: workspaceId,
    title: 'Análise de Vídeo',
    description: 'Revisão do último jogo e preparação',
    start_time: setMinutes(setHours(weekStart, 15), 0).toISOString(),
    duration: 60,
    location: 'Sala de Reuniões',
    event_type: 'meeting',
    status: 'confirmed',
    athlete_ids: athleteIds.slice(0, Math.floor(athleteIds.length / 2)),
  });

  // Tuesday: High intensity + Recovery
  events.push({
    workspace_id: workspaceId,
    title: 'Treino de Alta Intensidade',
    description: 'Trabalho intervalado e sprints',
    start_time: setMinutes(setHours(addDays(weekStart, 1), 9), 30).toISOString(),
    duration: 75,
    location: 'Pista de Atletismo',
    event_type: 'training',
    status: 'confirmed',
    athlete_ids: athleteIds,
  });

  events.push({
    workspace_id: workspaceId,
    title: 'Sessão de Recuperação',
    description: 'Alongamentos e trabalho regenerativo',
    start_time: setMinutes(setHours(addDays(weekStart, 1), 16), 0).toISOString(),
    duration: 45,
    location: 'Ginásio A',
    event_type: 'recovery',
    status: 'scheduled',
    athlete_ids: athleteIds,
  });

  // Wednesday: Strength + Evaluations
  events.push({
    workspace_id: workspaceId,
    title: 'Treino de Força',
    description: 'Trabalho de potência e força máxima',
    start_time: setMinutes(setHours(addDays(weekStart, 2), 10), 0).toISOString(),
    duration: 60,
    location: 'Ginásio B',
    event_type: 'training',
    status: 'confirmed',
    athlete_ids: athleteIds,
  });

  events.push({
    workspace_id: workspaceId,
    title: 'Avaliações Físicas',
    description: 'Testes de força e potência',
    start_time: setMinutes(setHours(addDays(weekStart, 2), 14), 0).toISOString(),
    duration: 90,
    location: 'Centro de Treino',
    event_type: 'evaluation',
    status: 'scheduled',
    athlete_ids: athleteIds.slice(0, 5),
    requires_confirmation: true,
  });

  // Thursday: Technical training
  events.push({
    workspace_id: workspaceId,
    title: 'Treino Técnico Individual',
    description: 'Trabalho específico por posição',
    start_time: setMinutes(setHours(addDays(weekStart, 3), 10), 30).toISOString(),
    duration: 90,
    location: 'Campo Principal',
    event_type: 'training',
    status: 'confirmed',
    athlete_ids: athleteIds,
  });

  // Friday: Light training + Pre-match briefing
  events.push({
    workspace_id: workspaceId,
    title: 'Treino Leve de Ativação',
    description: 'Preparação para o jogo de amanhã',
    start_time: setMinutes(setHours(addDays(weekStart, 4), 11), 0).toISOString(),
    duration: 60,
    location: 'Campo 2',
    event_type: 'training',
    status: 'confirmed',
    athlete_ids: athleteIds,
  });

  events.push({
    workspace_id: workspaceId,
    title: 'Briefing Pré-Jogo',
    description: 'Estratégia e motivação para o jogo',
    start_time: setMinutes(setHours(addDays(weekStart, 4), 16), 0).toISOString(),
    duration: 45,
    location: 'Sala de Reuniões',
    event_type: 'meeting',
    status: 'confirmed',
    athlete_ids: athleteIds,
    requires_confirmation: true,
  });

  // Saturday: Competition
  events.push({
    workspace_id: workspaceId,
    title: 'Campeonato Regional - Jornada 15',
    description: 'Jogo em casa vs. Rival FC',
    start_time: setMinutes(setHours(addDays(weekStart, 5), 15), 0).toISOString(),
    duration: 120,
    location: 'Estádio Municipal',
    event_type: 'competition',
    status: 'confirmed',
    athlete_ids: athleteIds,
    requires_confirmation: true,
  });

  // Sunday: Recovery
  events.push({
    workspace_id: workspaceId,
    title: 'Recuperação Pós-Jogo',
    description: 'Crioterapia e massagem',
    start_time: setMinutes(setHours(addDays(weekStart, 6), 10), 0).toISOString(),
    duration: 60,
    location: 'Centro de Recuperação',
    event_type: 'recovery',
    status: 'scheduled',
    athlete_ids: athleteIds.slice(0, Math.floor(athleteIds.length * 0.7)),
  });

  return events;
}

/**
 * Generate athlete IDs for demo
 */
export function generateDemoAthletes(count: number = 20): string[] {
  return Array.from({ length: count }, (_, i) => `athlete-demo-${i + 1}`);
}

/**
 * Generate complete demo dataset
 */
export function generateCompleteDemoDataset(
  workspaceId: string,
  options: {
    athleteCount?: number;
    weeks?: number;
  } = {}
): {
  athletes: string[];
  events: Partial<CalendarEvent>[];
} {
  const { athleteCount = 20, weeks = 4 } = options;

  const athletes = generateDemoAthletes(athleteCount);
  const events: Partial<CalendarEvent>[] = [];

  // Generate weekly schedules for each week
  for (let week = 0; week < weeks; week++) {
    const weekStart = addDays(new Date(), week * 7);
    const weeklyEvents = generateWeeklySchedule(workspaceId, athletes, weekStart);
    events.push(...weeklyEvents);
  }

  // Add some random events between scheduled ones
  const randomEvents = generateDemoEvents(workspaceId, athletes, {
    startDate: new Date(),
    days: weeks * 7,
    eventsPerDay: { min: 0, max: 2 },
  });

  events.push(...randomEvents);

  return {
    athletes,
    events,
  };
}

/**
 * Export demo data to JSON file
 */
export function exportDemoDataToJSON(
  workspaceId: string,
  options?: { athleteCount?: number; weeks?: number }
): string {
  const dataset = generateCompleteDemoDataset(workspaceId, options);
  return JSON.stringify(dataset, null, 2);
}
