/**
 * CALENDAR MONTH HELPERS
 * Utility functions for month view calculations
 */

import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  format
} from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

export interface MonthDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

/**
 * Generate array of 42 days for month view (6 weeks)
 * Includes overflow days from previous/next month
 */
export function generateMonthDays(date: Date, events: CalendarEvent[]): MonthDay[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  // Get the start and end of the calendar view (including overflow)
  // Start from Sunday of the week containing the 1st of the month
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  
  // End on Saturday of the week containing the last day of the month
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  // Generate all days in the range
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const today = new Date();
  
  // Map each day with its metadata
  return allDays.map(day => {
    // Filter events that occur on this day
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      
      // Check if this day falls within the event's date range
      return isWithinInterval(day, { start: eventStart, end: eventEnd });
    });
    
    return {
      date: day,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isSameDay(day, today),
      events: dayEvents
    };
  });
}

/**
 * Get days of week headers
 */
export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEKDAY_LABELS_LONG = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];

/**
 * Check if an event starts on a given day
 */
export function eventStartsOnDay(event: CalendarEvent, day: Date): boolean {
  return isSameDay(new Date(event.start_date), day);
}

/**
 * Check if an event ends on a given day
 */
export function eventEndsOnDay(event: CalendarEvent, day: Date): boolean {
  return isSameDay(new Date(event.end_date), day);
}

/**
 * Check if an event continues from previous day
 */
export function eventContinuesFromBefore(event: CalendarEvent, day: Date): boolean {
  const eventStart = new Date(event.start_date);
  return day > eventStart && !eventStartsOnDay(event, day);
}

/**
 * Get the number of days an event spans in the visible week
 * (for rendering multi-day pills)
 */
export function getEventSpanInWeek(
  event: CalendarEvent,
  dayIndex: number,
  monthDays: MonthDay[]
): number {
  const eventStart = new Date(event.start_date);
  const eventEnd = new Date(event.end_date);
  
  // Calculate start of this week (row)
  const weekStartIndex = Math.floor(dayIndex / 7) * 7;
  const weekEndIndex = weekStartIndex + 6;
  
  let span = 0;
  
  // Count consecutive days in this week
  for (let i = dayIndex; i <= weekEndIndex && i < monthDays.length; i++) {
    const day = monthDays[i].date;
    
    if (isWithinInterval(day, { start: eventStart, end: eventEnd })) {
      span++;
    } else {
      break;
    }
  }
  
  return span;
}
