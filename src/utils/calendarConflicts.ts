/**
 * CALENDAR CONFLICTS UTILITY
 * Detects scheduling conflicts between events
 */

import { CalendarEvent } from '@/types/calendar';

/**
 * Check if two time ranges overlap
 */
export function doTimeRangesOverlap(
  start1: Date | string,
  end1: Date | string,
  start2: Date | string,
  end2: Date | string
): boolean {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  
  // Two ranges overlap if: start1 < end2 AND start2 < end1
  return s1 < e2 && s2 < e1;
}

/**
 * Check if two events share any athletes
 */
export function doEventsShareAthletes(
  athleteIds1: string[] | undefined,
  athleteIds2: string[] | undefined
): boolean {
  if (!athleteIds1?.length || !athleteIds2?.length) {
    return false;
  }
  
  return athleteIds1.some(id => athleteIds2.includes(id));
}

/**
 * Check if two events conflict
 * Events conflict if:
 * 1. They share at least one athlete
 * 2. Their time ranges overlap
 */
export function doEventsConflict(
  event1: CalendarEvent,
  event2: CalendarEvent
): boolean {
  // Don't conflict with cancelled events
  if (event1.status === 'cancelled' || event2.status === 'cancelled') {
    return false;
  }
  
  // Check if they share athletes
  const shareAthletes = doEventsShareAthletes(
    event1.athlete_ids,
    event2.athlete_ids
  );
  
  if (!shareAthletes) {
    return false;
  }
  
  // Check if times overlap
  return doTimeRangesOverlap(
    event1.start_date,
    event1.end_date,
    event2.start_date,
    event2.end_date
  );
}

/**
 * Find all events that conflict with a given event
 */
export function findConflictingEvents(
  targetEvent: CalendarEvent | { 
    start_date: Date | string;
    end_date: Date | string;
    athlete_ids?: string[];
  },
  allEvents: CalendarEvent[],
  excludeEventId?: string
): CalendarEvent[] {
  return allEvents.filter(event => {
    // Exclude the target event itself
    if (excludeEventId && event.id === excludeEventId) {
      return false;
    }
    
    // Don't conflict with cancelled events
    if (event.status === 'cancelled') {
      return false;
    }
    
    // Check if they share athletes
    const shareAthletes = doEventsShareAthletes(
      targetEvent.athlete_ids,
      event.athlete_ids
    );
    
    if (!shareAthletes) {
      return false;
    }
    
    // Check if times overlap
    return doTimeRangesOverlap(
      targetEvent.start_date,
      targetEvent.end_date,
      event.start_date,
      event.end_date
    );
  });
}

/**
 * Get shared athletes between two events
 */
export function getSharedAthletes(
  event1: CalendarEvent | { athlete_ids?: string[] },
  event2: CalendarEvent | { athlete_ids?: string[] }
): string[] {
  if (!event1.athlete_ids?.length || !event2.athlete_ids?.length) {
    return [];
  }
  
  return event1.athlete_ids.filter(id => event2.athlete_ids?.includes(id));
}

/**
 * Format conflict message
 */
export function formatConflictMessage(
  conflictCount: number,
  sharedAthleteCount: number
): string {
  if (conflictCount === 0) {
    return '';
  }
  
  if (conflictCount === 1) {
    return `⚠️ Conflito com 1 evento (${sharedAthleteCount} atleta${sharedAthleteCount > 1 ? 's' : ''} partilhado${sharedAthleteCount > 1 ? 's' : ''})`;
  }
  
  return `⚠️ ${conflictCount} conflitos detectados (${sharedAthleteCount} atleta${sharedAthleteCount > 1 ? 's' : ''} afetado${sharedAthleteCount > 1 ? 's' : ''})`;
}
