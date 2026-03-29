/**
 * SMART SCHEDULING ENGINE
 * Intelligent scheduling suggestions to avoid conflicts
 */

import { CalendarEvent } from '@/types/calendar';
import { 
  addMinutes, 
  addHours, 
  addDays, 
  startOfDay,
  endOfDay,
  isWithinInterval,
  format,
  isSameDay,
  setHours,
  setMinutes
} from 'date-fns';
import { findConflictingEvents } from './calendarConflicts';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  score: number; // 0-100, higher is better
  reason?: string;
}

export interface SchedulingSuggestion {
  id: string;
  slot: TimeSlot;
  description: string;
  pros: string[];
  cons: string[];
  priority: 'high' | 'medium' | 'low';
  conflictFree: boolean;
}

export interface SchedulingPreferences {
  preferredTimeRanges?: Array<{ start: string; end: string }>; // e.g., ["09:00", "12:00"]
  avoidWeekends?: boolean;
  minBreakBetweenEvents?: number; // minutes
  maxEventsPerDay?: number;
  preferredDays?: number[]; // 0-6 (Sunday-Saturday)
}

const DEFAULT_PREFERENCES: SchedulingPreferences = {
  preferredTimeRanges: [
    { start: '09:00', end: '12:00' }, // Morning
    { start: '14:00', end: '18:00' }, // Afternoon
  ],
  avoidWeekends: false,
  minBreakBetweenEvents: 30, // 30 minutes
  maxEventsPerDay: 4,
  preferredDays: [1, 2, 3, 4, 5], // Monday-Friday
};

/**
 * Find available time slots for a given date range
 */
export function findAvailableSlots(
  startDate: Date,
  endDate: Date,
  duration: number, // minutes
  existingEvents: CalendarEvent[],
  athleteIds: string[],
  preferences: Partial<SchedulingPreferences> = {}
): TimeSlot[] {
  const prefs = { ...DEFAULT_PREFERENCES, ...preferences };
  const slots: TimeSlot[] = [];
  
  let currentDay = startOfDay(startDate);
  const lastDay = endOfDay(endDate);
  
  while (currentDay <= lastDay) {
    // Skip weekends if needed
    if (prefs.avoidWeekends && (currentDay.getDay() === 0 || currentDay.getDay() === 6)) {
      currentDay = addDays(currentDay, 1);
      continue;
    }
    
    // Check each preferred time range
    prefs.preferredTimeRanges?.forEach(range => {
      const [startHour, startMin] = range.start.split(':').map(Number);
      const [endHour, endMin] = range.end.split(':').map(Number);
      
      let slotStart = setMinutes(setHours(currentDay, startHour), startMin);
      const rangeEnd = setMinutes(setHours(currentDay, endHour), endMin);
      
      // Generate 30-minute slots within the range
      while (slotStart < rangeEnd) {
        const slotEnd = addMinutes(slotStart, duration);
        
        if (slotEnd <= rangeEnd) {
          const slot = evaluateTimeSlot(
            slotStart,
            slotEnd,
            existingEvents,
            athleteIds,
            prefs
          );
          slots.push(slot);
        }
        
        slotStart = addMinutes(slotStart, 30); // Move to next 30-min slot
      }
    });
    
    currentDay = addDays(currentDay, 1);
  }
  
  // Sort by score (best first)
  return slots.sort((a, b) => b.score - a.score);
}

/**
 * Evaluate a specific time slot
 */
function evaluateTimeSlot(
  start: Date,
  end: Date,
  existingEvents: CalendarEvent[],
  athleteIds: string[],
  preferences: SchedulingPreferences
): TimeSlot {
  let score = 100;
  let available = true;
  const reasons: string[] = [];
  
  // Check for conflicts
  const conflicts = findConflictingEvents(
    { start_date: start, end_date: end, athlete_ids: athleteIds },
    existingEvents
  );
  
  if (conflicts.length > 0) {
    available = false;
    score = 0;
    reasons.push(`${conflicts.length} conflito(s)`);
    return { start, end, available, score, reason: reasons.join(', ') };
  }
  
  // Check break time before/after other events
  const eventsOnSameDay = existingEvents.filter(e => 
    isSameDay(new Date(e.start_date), start) &&
    e.athlete_ids?.some(id => athleteIds.includes(id))
  );
  
  eventsOnSameDay.forEach(event => {
    const eventStart = new Date(event.start_date);
    const eventEnd = new Date(event.end_date);
    const timeBefore = (start.getTime() - eventEnd.getTime()) / 60000;
    const timeAfter = (eventStart.getTime() - end.getTime()) / 60000;
    
    if (timeBefore > 0 && timeBefore < (preferences.minBreakBetweenEvents || 30)) {
      score -= 20;
      reasons.push(`Pouco descanso após evento (${Math.round(timeBefore)}min)`);
    }
    
    if (timeAfter > 0 && timeAfter < (preferences.minBreakBetweenEvents || 30)) {
      score -= 20;
      reasons.push(`Pouco descanso antes evento (${Math.round(timeAfter)}min)`);
    }
  });
  
  // Check max events per day
  if (preferences.maxEventsPerDay && eventsOnSameDay.length >= preferences.maxEventsPerDay) {
    score -= 30;
    reasons.push(`Dia sobrecarregado (${eventsOnSameDay.length} eventos)`);
  }
  
  // Bonus for preferred days
  if (preferences.preferredDays && !preferences.preferredDays.includes(start.getDay())) {
    score -= 15;
    reasons.push('Fora dos dias preferidos');
  }
  
  // Bonus for morning slots
  const hour = start.getHours();
  if (hour >= 9 && hour < 12) {
    score += 10;
  }
  
  // Penalty for very early or late
  if (hour < 7) {
    score -= 25;
    reasons.push('Muito cedo');
  }
  if (hour >= 20) {
    score -= 20;
    reasons.push('Muito tarde');
  }
  
  return {
    start,
    end,
    available,
    score: Math.max(0, Math.min(100, score)),
    reason: reasons.length > 0 ? reasons.join(', ') : undefined,
  };
}

/**
 * Generate smart scheduling suggestions
 */
export function generateSchedulingSuggestions(
  desiredDate: Date,
  duration: number,
  athleteIds: string[],
  existingEvents: CalendarEvent[],
  preferences: Partial<SchedulingPreferences> = {}
): SchedulingSuggestion[] {
  // Search for slots within 7 days
  const searchStart = startOfDay(desiredDate);
  const searchEnd = addDays(searchStart, 7);
  
  const availableSlots = findAvailableSlots(
    searchStart,
    searchEnd,
    duration,
    existingEvents,
    athleteIds,
    preferences
  );
  
  // Filter only conflict-free slots
  const conflictFreeSlots = availableSlots.filter(s => s.available && s.score > 50);
  
  const suggestions: SchedulingSuggestion[] = [];
  
  // Suggestion 1: Best score on same day
  const sameDaySlots = conflictFreeSlots.filter(s => isSameDay(s.start, desiredDate));
  if (sameDaySlots.length > 0) {
    const best = sameDaySlots[0];
    suggestions.push({
      id: 'same-day-best',
      slot: best,
      description: `Mesmo dia às ${format(best.start, 'HH:mm')}`,
      pros: [
        'Mantém a data desejada',
        'Sem conflitos',
        best.score > 80 ? 'Horário ideal' : 'Horário adequado',
      ],
      cons: best.reason ? [best.reason] : [],
      priority: 'high',
      conflictFree: true,
    });
  }
  
  // Suggestion 2: Next day, similar time
  const nextDayTime = addDays(desiredDate, 1);
  const nextDaySlots = conflictFreeSlots.filter(s => 
    isSameDay(s.start, nextDayTime) &&
    Math.abs(s.start.getHours() - desiredDate.getHours()) <= 2
  );
  if (nextDaySlots.length > 0) {
    const best = nextDaySlots[0];
    suggestions.push({
      id: 'next-day-similar',
      slot: best,
      description: `Dia seguinte às ${format(best.start, 'HH:mm')}`,
      pros: [
        'Horário similar',
        'Sem conflitos',
        'Apenas 1 dia de diferença',
      ],
      cons: ['Data alterada'],
      priority: 'medium',
      conflictFree: true,
    });
  }
  
  // Suggestion 3: Best overall slot within 3 days
  const nearFutureSlots = conflictFreeSlots.filter(s => 
    s.start <= addDays(desiredDate, 3)
  );
  if (nearFutureSlots.length > 0 && nearFutureSlots[0].id !== suggestions[0]?.id) {
    const best = nearFutureSlots[0];
    const daysAway = Math.ceil((best.start.getTime() - desiredDate.getTime()) / (1000 * 60 * 60 * 24));
    suggestions.push({
      id: 'best-nearby',
      slot: best,
      description: `${format(best.start, "EEEE 'às' HH:mm", { locale: require('date-fns/locale/pt') })}`,
      pros: [
        `Melhor horário disponível (score: ${best.score})`,
        'Sem conflitos',
        `Apenas ${daysAway} dia(s) depois`,
      ],
      cons: daysAway > 1 ? [`${daysAway} dias de diferença`] : [],
      priority: 'medium',
      conflictFree: true,
    });
  }
  
  // Suggestion 4: Alternative time on same day (even if not perfect)
  const alternativeSameDay = availableSlots.filter(s => 
    isSameDay(s.start, desiredDate) && 
    s.available &&
    !suggestions.some(sug => sug.slot.start.getTime() === s.start.getTime())
  );
  if (alternativeSameDay.length > 0) {
    const alternative = alternativeSameDay[0];
    suggestions.push({
      id: 'same-day-alternative',
      slot: alternative,
      description: `Alternativa: ${format(alternative.start, 'HH:mm')}`,
      pros: [
        'Mantém a data',
        'Disponível',
      ],
      cons: [
        alternative.reason || 'Horário menos ideal',
        alternative.score < 70 ? 'Score baixo' : '',
      ].filter(Boolean),
      priority: 'low',
      conflictFree: true,
    });
  }
  
  return suggestions.slice(0, 4); // Max 4 suggestions
}

/**
 * Find optimal time for recurring events
 */
export function findOptimalRecurringSlot(
  startDate: Date,
  endDate: Date,
  duration: number,
  recurrencePattern: 'daily' | 'weekly' | 'biweekly',
  athleteIds: string[],
  existingEvents: CalendarEvent[],
  preferences: Partial<SchedulingPreferences> = {}
): TimeSlot | null {
  const prefs = { ...DEFAULT_PREFERENCES, ...preferences };
  
  // For recurring events, find a slot that works for ALL occurrences
  const occurrences: Date[] = [];
  let current = startDate;
  
  while (current <= endDate) {
    occurrences.push(current);
    
    if (recurrencePattern === 'daily') {
      current = addDays(current, 1);
    } else if (recurrencePattern === 'weekly') {
      current = addDays(current, 7);
    } else if (recurrencePattern === 'biweekly') {
      current = addDays(current, 14);
    }
  }
  
  // Find slots that work for the first occurrence
  const firstDaySlots = findAvailableSlots(
    occurrences[0],
    addDays(occurrences[0], 1),
    duration,
    existingEvents,
    athleteIds,
    prefs
  );
  
  // Check each slot against all occurrences
  for (const slot of firstDaySlots) {
    if (!slot.available) continue;
    
    let worksForAll = true;
    const hour = slot.start.getHours();
    const minute = slot.start.getMinutes();
    
    for (let i = 1; i < occurrences.length; i++) {
      const occurrenceStart = setMinutes(setHours(occurrences[i], hour), minute);
      const occurrenceEnd = addMinutes(occurrenceStart, duration);
      
      const conflicts = findConflictingEvents(
        { start_date: occurrenceStart, end_date: occurrenceEnd, athlete_ids: athleteIds },
        existingEvents
      );
      
      if (conflicts.length > 0) {
        worksForAll = false;
        break;
      }
    }
    
    if (worksForAll) {
      return slot;
    }
  }
  
  return null;
}

/**
 * Calculate athlete availability score
 */
export function calculateAthleteAvailability(
  athleteId: string,
  date: Date,
  existingEvents: CalendarEvent[]
): number {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  const athleteEvents = existingEvents.filter(e =>
    e.athlete_ids?.includes(athleteId) &&
    isWithinInterval(new Date(e.start_date), { start: dayStart, end: dayEnd })
  );
  
  // Calculate total scheduled time
  const totalMinutes = athleteEvents.reduce((sum, event) => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return sum + (end.getTime() - start.getTime()) / 60000;
  }, 0);
  
  // Max reasonable time per day: 6 hours = 360 minutes
  const maxMinutes = 360;
  const availability = Math.max(0, 100 - (totalMinutes / maxMinutes) * 100);
  
  return Math.round(availability);
}

/**
 * Get workload distribution for athletes
 */
export function getWorkloadDistribution(
  athleteIds: string[],
  startDate: Date,
  endDate: Date,
  existingEvents: CalendarEvent[]
): Record<string, { totalEvents: number; totalMinutes: number; availability: number }> {
  const distribution: Record<string, { totalEvents: number; totalMinutes: number; availability: number }> = {};
  
  athleteIds.forEach(athleteId => {
    const athleteEvents = existingEvents.filter(e =>
      e.athlete_ids?.includes(athleteId) &&
      new Date(e.start_date) >= startDate &&
      new Date(e.end_date) <= endDate
    );
    
    const totalMinutes = athleteEvents.reduce((sum, event) => {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      return sum + (end.getTime() - start.getTime()) / 60000;
    }, 0);
    
    distribution[athleteId] = {
      totalEvents: athleteEvents.length,
      totalMinutes,
      availability: calculateAthleteAvailability(athleteId, new Date(), existingEvents),
    };
  });
  
  return distribution;
}
