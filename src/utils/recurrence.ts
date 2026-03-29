/**
 * RECURRENCE UTILITIES
 * 
 * Convert recurrence patterns to/from RRULE format (RFC 5545)
 * Generate recurrence instances
 * 
 * @module calendar/utils/recurrence
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { addDays, addWeeks, addMonths, addYears, isBefore, isAfter, isSameDay } from 'date-fns';
import type { RecurrencePattern } from '@/components/calendar/components/RecurrenceSettings';

// ============================================================================
// TYPES
// ============================================================================

export interface RecurrenceInstance {
  start_date: string;
  end_date: string;
  instance_number: number;
}

// ============================================================================
// RRULE GENERATION
// ============================================================================

/**
 * Convert RecurrencePattern to RRULE string (RFC 5545)
 * 
 * Examples:
 * - Daily: "FREQ=DAILY;INTERVAL=1"
 * - Weekly (Mon,Wed,Fri): "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR"
 * - Monthly: "FREQ=MONTHLY;INTERVAL=1"
 * - Until date: "FREQ=DAILY;UNTIL=20260601T000000Z"
 * - Count: "FREQ=WEEKLY;COUNT=10"
 */
export function patternToRRule(pattern: RecurrencePattern): string {
  if (!pattern || pattern.frequency === 'none') {
    return '';
  }

  const parts: string[] = [];

  // Frequency
  parts.push(`FREQ=${pattern.frequency.toUpperCase()}`);

  // Interval
  if (pattern.interval && pattern.interval > 1) {
    parts.push(`INTERVAL=${pattern.interval}`);
  }

  // Weekdays (for weekly recurrence)
  if (pattern.frequency === 'weekly' && pattern.weekdays && pattern.weekdays.length > 0) {
    const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const days = pattern.weekdays.map(d => dayMap[d]).join(',');
    parts.push(`BYDAY=${days}`);
  }

  // End condition
  if (pattern.endType === 'date' && pattern.endDate) {
    // Convert to UTC format: YYYYMMDDTHHMMSSZ
    const date = new Date(pattern.endDate);
    const until = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    parts.push(`UNTIL=${until}`);
  } else if (pattern.endType === 'count' && pattern.endCount) {
    parts.push(`COUNT=${pattern.endCount}`);
  }

  return parts.join(';');
}

/**
 * Parse RRULE string back to RecurrencePattern
 */
export function rruleToPattern(rrule: string): RecurrencePattern | null {
  if (!rrule) return null;

  const parts = rrule.split(';');
  const pattern: Partial<RecurrencePattern> = {
    interval: 1,
    endType: 'never',
  };

  for (const part of parts) {
    const [key, value] = part.split('=');

    if (key === 'FREQ') {
      pattern.frequency = value.toLowerCase() as RecurrencePattern['frequency'];
    } else if (key === 'INTERVAL') {
      pattern.interval = parseInt(value);
    } else if (key === 'BYDAY') {
      const dayMap: Record<string, number> = {
        SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6
      };
      pattern.weekdays = value.split(',').map(d => dayMap[d]);
    } else if (key === 'UNTIL') {
      pattern.endType = 'date';
      // Parse YYYYMMDDTHHMMSSZ to ISO date
      const year = value.slice(0, 4);
      const month = value.slice(4, 6);
      const day = value.slice(6, 8);
      pattern.endDate = `${year}-${month}-${day}`;
    } else if (key === 'COUNT') {
      pattern.endType = 'count';
      pattern.endCount = parseInt(value);
    }
  }

  return pattern as RecurrencePattern;
}

// ============================================================================
// INSTANCE GENERATION
// ============================================================================

/**
 * Generate recurrence instances from pattern
 * 
 * @param startDate - ISO date string
 * @param endDate - ISO date string  
 * @param pattern - Recurrence pattern
 * @param maxInstances - Maximum instances to generate (default 365)
 * @returns Array of instance dates
 */
export function generateInstances(
  startDate: string,
  endDate: string,
  pattern: RecurrencePattern,
  maxInstances = 365
): RecurrenceInstance[] {
  const instances: RecurrenceInstance[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end.getTime() - start.getTime();

  let currentDate = new Date(start);
  let instanceNumber = 0;

  // Calculate max date
  let maxDate: Date | null = null;
  if (pattern.endType === 'date' && pattern.endDate) {
    maxDate = new Date(pattern.endDate);
  }

  // Calculate max count
  const maxCount = pattern.endType === 'count' && pattern.endCount
    ? pattern.endCount
    : maxInstances;

  while (instanceNumber < maxCount && instanceNumber < maxInstances) {
    // Check if we've passed the end date
    if (maxDate && isAfter(currentDate, maxDate)) {
      break;
    }

    // For weekly recurrence, check if current day matches selected weekdays
    if (pattern.frequency === 'weekly' && pattern.weekdays) {
      const dayOfWeek = currentDate.getDay();
      
      if (pattern.weekdays.includes(dayOfWeek)) {
        const instanceEnd = new Date(currentDate.getTime() + duration);
        instances.push({
          start_date: currentDate.toISOString(),
          end_date: instanceEnd.toISOString(),
          instance_number: instanceNumber,
        });
        instanceNumber++;
      }

      // Move to next day
      currentDate = addDays(currentDate, 1);
      
      // Skip ahead if we're past the current week
      if (instanceNumber > 0 && instanceNumber % pattern.weekdays.length === 0) {
        // Move to start of next interval
        const weeksToAdd = pattern.interval - 1;
        if (weeksToAdd > 0) {
          currentDate = addWeeks(currentDate, weeksToAdd);
        }
      }
    } else {
      // For other frequencies, add instance and move to next occurrence
      const instanceEnd = new Date(currentDate.getTime() + duration);
      instances.push({
        start_date: currentDate.toISOString(),
        end_date: instanceEnd.toISOString(),
        instance_number: instanceNumber,
      });
      instanceNumber++;

      // Move to next occurrence
      if (pattern.frequency === 'daily') {
        currentDate = addDays(currentDate, pattern.interval);
      } else if (pattern.frequency === 'monthly') {
        currentDate = addMonths(currentDate, pattern.interval);
      } else if (pattern.frequency === 'yearly') {
        currentDate = addYears(currentDate, pattern.interval);
      } else {
        // Shouldn't happen, but break to avoid infinite loop
        break;
      }
    }

    // Safety check to prevent infinite loops
    if (instanceNumber > maxInstances) {
      console.warn('Max instances limit reached');
      break;
    }
  }

  return instances;
}

// ============================================================================
// RECURRENCE HELPERS
// ============================================================================

/**
 * Check if a date falls on a recurrence instance
 */
export function isRecurrenceInstance(
  date: Date,
  startDate: Date,
  pattern: RecurrencePattern
): boolean {
  if (pattern.frequency === 'none') return false;

  const instances = generateInstances(
    startDate.toISOString(),
    startDate.toISOString(), // Same start/end for check
    pattern,
    100 // Check up to 100 instances
  );

  return instances.some(instance => 
    isSameDay(new Date(instance.start_date), date)
  );
}

/**
 * Get next recurrence instance after given date
 */
export function getNextInstance(
  afterDate: Date,
  startDate: Date,
  endDate: Date,
  pattern: RecurrencePattern
): RecurrenceInstance | null {
  const instances = generateInstances(
    startDate.toISOString(),
    endDate.toISOString(),
    pattern,
    365
  );

  const nextInstance = instances.find(instance =>
    isAfter(new Date(instance.start_date), afterDate)
  );

  return nextInstance || null;
}

/**
 * Get human-readable description of recurrence pattern
 */
export function getRecurrenceDescription(pattern: RecurrencePattern): string {
  if (!pattern || pattern.frequency === 'none') {
    return 'Não se repete';
  }

  let description = 'Repete ';

  // Frequency
  if (pattern.frequency === 'daily') {
    description += pattern.interval === 1 ? 'todos os dias' : `a cada ${pattern.interval} dias`;
  } else if (pattern.frequency === 'weekly') {
    description += pattern.interval === 1 ? 'todas as semanas' : `a cada ${pattern.interval} semanas`;
  } else if (pattern.frequency === 'monthly') {
    description += pattern.interval === 1 ? 'todos os meses' : `a cada ${pattern.interval} meses`;
  } else if (pattern.frequency === 'yearly') {
    description += pattern.interval === 1 ? 'todos os anos' : `a cada ${pattern.interval} anos`;
  }

  // End condition
  if (pattern.endType === 'count' && pattern.endCount) {
    description += `, ${pattern.endCount} vezes`;
  } else if (pattern.endType === 'never') {
    description += ', indefinidamente';
  }

  return description;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate recurrence pattern
 */
export function validatePattern(pattern: RecurrencePattern): string[] {
  const errors: string[] = [];

  if (!pattern.frequency || pattern.frequency === 'none') {
    return errors; // Valid non-recurring event
  }

  if (!pattern.interval || pattern.interval < 1) {
    errors.push('Intervalo deve ser maior que 0');
  }

  if (pattern.interval > 365) {
    errors.push('Intervalo muito grande (máximo 365)');
  }

  if (pattern.frequency === 'weekly') {
    if (!pattern.weekdays || pattern.weekdays.length === 0) {
      errors.push('Selecione pelo menos um dia da semana');
    }
  }

  if (pattern.endType === 'date' && pattern.endDate) {
    const endDate = new Date(pattern.endDate);
    if (isNaN(endDate.getTime())) {
      errors.push('Data de término inválida');
    }
  }

  if (pattern.endType === 'count') {
    if (!pattern.endCount || pattern.endCount < 1) {
      errors.push('Número de ocorrências deve ser maior que 0');
    }
    if (pattern.endCount > 365) {
      errors.push('Número de ocorrências muito grande (máximo 365)');
    }
  }

  return errors;
}
