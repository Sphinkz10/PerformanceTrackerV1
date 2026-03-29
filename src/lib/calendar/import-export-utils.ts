/**
 * IMPORT/EXPORT UTILITIES
 * 
 * Utilities for importing and exporting calendar events
 * Supports: iCal (.ics), CSV, JSON formats
 */

import { CalendarEvent } from '@/types/calendar';
import { format, parse, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

/**
 * iCal (ICS) Generation
 * RFC 5545 compliant
 */
export function generateICalendar(events: CalendarEvent[], calendarName: string = 'PerformTrack'): string {
  const now = new Date();
  const timestamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PerformTrack//Calendar Export//PT',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:Europe/Lisbon',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ].join('\r\n');

  events.forEach(event => {
    const start = new Date(event.start_time);
    const end = event.end_time 
      ? new Date(event.end_time)
      : new Date(start.getTime() + (event.duration || 60) * 60000);

    const startStr = format(start, "yyyyMMdd'T'HHmmss");
    const endStr = format(end, "yyyyMMdd'T'HHmmss");

    ical += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:${event.id}@performtrack.app`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${escapeiCalText(event.title)}`,
      event.description ? `DESCRIPTION:${escapeiCalText(event.description)}` : '',
      event.location ? `LOCATION:${escapeiCalText(event.location)}` : '',
      `STATUS:${mapStatusToiCal(event.status)}`,
      event.event_type ? `CATEGORIES:${event.event_type.toUpperCase()}` : '',
      'END:VEVENT',
    ].filter(Boolean).join('\r\n');
  });

  ical += '\r\nEND:VCALENDAR';
  return ical;
}

/**
 * Parse iCal (ICS) file
 */
export function parseiCalendar(icsContent: string): Partial<CalendarEvent>[] {
  const events: Partial<CalendarEvent>[] = [];
  
  // Split by VEVENT blocks
  const veventBlocks = icsContent.split('BEGIN:VEVENT');
  
  veventBlocks.slice(1).forEach(block => {
    const lines = block.split('\r\n').filter(line => line.trim());
    const event: any = {};
    
    lines.forEach(line => {
      if (line.startsWith('SUMMARY:')) {
        event.title = unescapeiCalText(line.substring(8));
      } else if (line.startsWith('DESCRIPTION:')) {
        event.description = unescapeiCalText(line.substring(12));
      } else if (line.startsWith('LOCATION:')) {
        event.location = unescapeiCalText(line.substring(9));
      } else if (line.startsWith('DTSTART:')) {
        event.start_time = parseiCalDate(line.substring(8));
      } else if (line.startsWith('DTEND:')) {
        const endTime = parseiCalDate(line.substring(6));
        const startTime = new Date(event.start_time);
        event.duration = Math.round((new Date(endTime).getTime() - startTime.getTime()) / 60000);
      } else if (line.startsWith('STATUS:')) {
        event.status = mapiCalStatusToStatus(line.substring(7));
      } else if (line.startsWith('CATEGORIES:')) {
        event.event_type = line.substring(11).toLowerCase();
      }
    });
    
    if (event.title && event.start_time) {
      events.push(event);
    }
  });
  
  return events;
}

/**
 * Generate CSV
 */
export function generateCSV(events: CalendarEvent[]): string {
  const headers = [
    'ID',
    'Título',
    'Descrição',
    'Data Início',
    'Hora Início',
    'Duração (min)',
    'Local',
    'Tipo',
    'Status',
    'Participantes',
    'Notas',
  ];

  const rows = events.map(event => [
    event.id,
    escapeCSV(event.title),
    escapeCSV(event.description || ''),
    format(new Date(event.start_time), 'yyyy-MM-dd'),
    format(new Date(event.start_time), 'HH:mm'),
    event.duration || '',
    escapeCSV(event.location || ''),
    event.event_type || '',
    event.status,
    (event.athlete_ids?.length || 0).toString(),
    escapeCSV(event.notes || ''),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csv;
}

/**
 * Parse CSV
 */
export function parseCSV(csvContent: string): Partial<CalendarEvent>[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const events: Partial<CalendarEvent>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const event: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      
      switch (header.toLowerCase()) {
        case 'título':
        case 'title':
          event.title = value;
          break;
        case 'descrição':
        case 'description':
          event.description = value;
          break;
        case 'data início':
        case 'start date':
          event._startDate = value;
          break;
        case 'hora início':
        case 'start time':
          event._startTime = value;
          break;
        case 'duração (min)':
        case 'duration':
          event.duration = parseInt(value) || 60;
          break;
        case 'local':
        case 'location':
          event.location = value;
          break;
        case 'tipo':
        case 'type':
          event.event_type = value;
          break;
        case 'status':
          event.status = value;
          break;
        case 'notas':
        case 'notes':
          event.notes = value;
          break;
      }
    });

    // Combine date and time
    if (event._startDate && event._startTime) {
      try {
        const dateTime = `${event._startDate} ${event._startTime}`;
        event.start_time = parse(dateTime, 'yyyy-MM-dd HH:mm', new Date()).toISOString();
        delete event._startDate;
        delete event._startTime;
      } catch (err) {
        console.error('Error parsing date:', err);
        continue;
      }
    }

    if (event.title && event.start_time) {
      events.push(event);
    }
  }

  return events;
}

/**
 * Generate JSON export
 */
export function generateJSON(events: CalendarEvent[]): string {
  return JSON.stringify(events, null, 2);
}

/**
 * Parse JSON import
 */
export function parseJSON(jsonContent: string): Partial<CalendarEvent>[] {
  try {
    const data = JSON.parse(jsonContent);
    if (Array.isArray(data)) {
      return data;
    } else if (data.events && Array.isArray(data.events)) {
      return data.events;
    }
    return [];
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return [];
  }
}

/**
 * Validate imported event
 */
export function validateImportedEvent(event: Partial<CalendarEvent>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!event.title || event.title.trim() === '') {
    errors.push('Título é obrigatório');
  }

  if (!event.start_time) {
    errors.push('Data/hora de início é obrigatória');
  } else {
    const date = new Date(event.start_time);
    if (isNaN(date.getTime())) {
      errors.push('Data/hora de início inválida');
    }
  }

  if (event.duration && (event.duration < 1 || event.duration > 1440)) {
    errors.push('Duração deve estar entre 1 e 1440 minutos');
  }

  if (event.status && !['scheduled', 'confirmed', 'completed', 'cancelled'].includes(event.status as string)) {
    errors.push('Status inválido');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Detect file format
 */
export function detectFileFormat(content: string, filename: string): 'ical' | 'csv' | 'json' | 'unknown' {
  // By extension
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'ics') return 'ical';
  if (ext === 'csv') return 'csv';
  if (ext === 'json') return 'json';

  // By content
  if (content.includes('BEGIN:VCALENDAR')) return 'ical';
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) return 'json';
  if (content.includes(',') && content.split('\n').length > 1) return 'csv';

  return 'unknown';
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper functions
 */
function escapeiCalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function unescapeiCalText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function escapeCSV(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function parseiCalDate(dateStr: string): string {
  // Remove timezone indicator if present
  const clean = dateStr.replace(/[TZ]/g, '');
  
  // Parse YYYYMMDDHHMMSS format
  const year = clean.substring(0, 4);
  const month = clean.substring(4, 6);
  const day = clean.substring(6, 8);
  const hour = clean.substring(8, 10) || '00';
  const minute = clean.substring(10, 12) || '00';
  const second = clean.substring(12, 14) || '00';
  
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString();
}

function mapStatusToiCal(status: string): string {
  const map: Record<string, string> = {
    'scheduled': 'TENTATIVE',
    'confirmed': 'CONFIRMED',
    'completed': 'CONFIRMED',
    'cancelled': 'CANCELLED',
  };
  return map[status] || 'TENTATIVE';
}

function mapiCalStatusToStatus(icalStatus: string): string {
  const map: Record<string, string> = {
    'TENTATIVE': 'scheduled',
    'CONFIRMED': 'confirmed',
    'CANCELLED': 'cancelled',
  };
  return map[icalStatus] || 'scheduled';
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HHmm');
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Calculate import statistics
 */
export interface ImportStats {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  conflicts: number;
}

export function calculateImportStats(
  events: Partial<CalendarEvent>[],
  existingEvents: CalendarEvent[]
): ImportStats {
  const stats: ImportStats = {
    total: events.length,
    valid: 0,
    invalid: 0,
    duplicates: 0,
    conflicts: 0,
  };

  const existingTitles = new Set(existingEvents.map(e => 
    `${e.title}-${format(new Date(e.start_time), 'yyyy-MM-dd-HH:mm')}`
  ));

  events.forEach(event => {
    const validation = validateImportedEvent(event);
    
    if (validation.valid) {
      stats.valid++;
      
      // Check for duplicates
      const key = `${event.title}-${format(new Date(event.start_time!), 'yyyy-MM-dd-HH:mm')}`;
      if (existingTitles.has(key)) {
        stats.duplicates++;
      }
      
      // Check for conflicts (same time)
      const hasConflict = existingEvents.some(existing => {
        const existingStart = new Date(existing.start_time).getTime();
        const importStart = new Date(event.start_time!).getTime();
        const timeDiff = Math.abs(existingStart - importStart);
        return timeDiff < 60000; // Within 1 minute
      });
      
      if (hasConflict) {
        stats.conflicts++;
      }
    } else {
      stats.invalid++;
    }
  });

  return stats;
}
