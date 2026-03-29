/**
 * CENTRALIZED DATE HELPERS
 * 
 * Eliminates 15 different date formatting patterns
 * Single source of truth for all date operations
 * 
 * @module calendar/utils/dateHelpers
 * @created 20 Janeiro 2026
 */

import { format, parseISO, isValid } from 'date-fns';
import { pt } from 'date-fns/locale';

/**
 * Parse date from string or Date object
 * Handles ISO strings, Date objects, and invalid dates gracefully
 */
export function parseDate(date: Date | string | null | undefined): Date {
  if (!date) return new Date();
  
  if (date instanceof Date) {
    return isValid(date) ? date : new Date();
  }
  
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(parsed) ? parsed : new Date();
  } catch {
    return new Date();
  }
}

/**
 * Format full event date
 * Example: "20 de Janeiro de 2026"
 */
export function formatEventDate(date: Date | string): string {
  const parsed = parseDate(date);
  return format(parsed, "dd 'de' MMMM 'de' yyyy", { locale: pt });
}

/**
 * Format event date and time
 * Example: "20 de Janeiro de 2026 às 14:30"
 */
export function formatEventDateTime(date: Date | string): string {
  const parsed = parseDate(date);
  return format(parsed, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt });
}

/**
 * Format short date
 * Example: "20/01/2026"
 */
export function formatShortDate(date: Date | string): string {
  const parsed = parseDate(date);
  return format(parsed, 'dd/MM/yyyy');
}

/**
 * Format short date with time
 * Example: "20/01/2026 às 14:30"
 */
export function formatShortDateTime(date: Date | string): string {
  const parsed = parseDate(date);
  return format(parsed, "dd/MM/yyyy 'às' HH:mm");
}

/**
 * Format time only
 * Example: "14:30"
 */
export function formatEventTime(date: Date | string): string {
  const parsed = parseDate(date);
  return format(parsed, 'HH:mm');
}

/**
 * Format day name
 * Example: "Segunda-feira"
 */
export function formatDayName(date: Date | string, short = false): string {
  const parsed = parseDate(date);
  return format(parsed, short ? 'EEE' : 'EEEE', { locale: pt });
}

/**
 * Format month name
 * Example: "Janeiro"
 */
export function formatMonthName(date: Date | string, short = false): string {
  const parsed = parseDate(date);
  return format(parsed, short ? 'MMM' : 'MMMM', { locale: pt });
}

/**
 * Format API date (ISO format for backend)
 * Example: "2026-01-20"
 */
export function formatAPIDate(date: Date | string): string {
  const parsed = parseDate(date);
  return format(parsed, 'yyyy-MM-dd');
}

/**
 * Format API datetime (ISO format with time for backend)
 * Example: "2026-01-20T14:30:00Z"
 */
export function formatAPIDateTime(date: Date | string): string {
  const parsed = parseDate(date);
  return parsed.toISOString();
}

/**
 * Format relative date
 * Example: "Hoje", "Amanhã", "Ontem", "20/01/2026"
 */
export function formatRelativeDate(date: Date | string): string {
  const parsed = parseDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(parsed);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays === -1) return 'Ontem';
  if (diffDays > 1 && diffDays <= 7) return `Em ${diffDays} dias`;
  if (diffDays < -1 && diffDays >= -7) return `Há ${Math.abs(diffDays)} dias`;
  
  return formatShortDate(parsed);
}

/**
 * Format date range
 * Example: "20-25 de Janeiro de 2026"
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  const startDay = format(start, 'dd');
  const endDay = format(end, 'dd');
  const month = format(end, 'MMMM', { locale: pt });
  const year = format(end, 'yyyy');
  
  // Same day
  if (startDay === endDay) {
    return `${startDay} de ${month} de ${year}`;
  }
  
  // Same month
  if (format(start, 'MM-yyyy') === format(end, 'MM-yyyy')) {
    return `${startDay}-${endDay} de ${month} de ${year}`;
  }
  
  // Different months
  return `${formatShortDate(start)} - ${formatShortDate(end)}`;
}

/**
 * Format duration in human readable format
 * Example: "1h 30min", "45min", "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const parsed = parseDate(date);
  const today = new Date();
  
  return (
    parsed.getDate() === today.getDate() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const parsed = parseDate(date);
  return parsed < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const parsed = parseDate(date);
  return parsed > new Date();
}

/**
 * Get time of day label
 * Example: "Manhã", "Tarde", "Noite"
 */
export function getTimeOfDay(date: Date | string): 'Manhã' | 'Tarde' | 'Noite' {
  const parsed = parseDate(date);
  const hour = parsed.getHours();
  
  if (hour < 12) return 'Manhã';
  if (hour < 18) return 'Tarde';
  return 'Noite';
}

/**
 * Format time range
 * Example: "14:30 - 16:00"
 */
export function formatTimeRange(
  startDate: Date | string,
  endDate: Date | string
): string {
  return `${formatEventTime(startDate)} - ${formatEventTime(endDate)}`;
}

/**
 * Calculate duration between two dates in minutes
 */
export function calculateDuration(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Format for calendar header
 * Example: "Janeiro 2026", "20 Janeiro 2026"
 */
export function formatCalendarHeader(
  date: Date | string,
  view: 'day' | 'week' | 'month'
): string {
  const parsed = parseDate(date);
  
  switch (view) {
    case 'day':
      return format(parsed, "dd 'de' MMMM 'de' yyyy", { locale: pt });
    case 'week':
      return format(parsed, "MMMM 'de' yyyy", { locale: pt });
    case 'month':
      return format(parsed, "MMMM 'de' yyyy", { locale: pt });
    default:
      return formatEventDate(parsed);
  }
}
