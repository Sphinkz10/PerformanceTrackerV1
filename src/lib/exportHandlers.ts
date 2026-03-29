/**
 * CALENDAR EXPORT HANDLERS
 * 
 * Real implementation for exporting calendar events to multiple formats.
 * 
 * Supported Formats:
 * - CSV (comma-separated values)
 * - Excel (.xlsx)
 * - PDF (printable document)
 * - JSON (structured data)
 * - iCal (.ics for calendar import)
 * 
 * @module lib/exportHandlers
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { CalendarEvent } from '@/types/calendar';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

// ============================================================================
// TYPES
// ============================================================================

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'ical';
  includeFields: {
    title: boolean;
    date: boolean;
    time: boolean;
    type: boolean;
    status: boolean;
    location: boolean;
    participants: boolean;
    description: boolean;
    notes: boolean;
  };
}

// ============================================================================
// CSV EXPORT
// ============================================================================

/**
 * Export events to CSV format
 */
export function exportToCSV(events: CalendarEvent[], options: ExportOptions): void {
  const { includeFields } = options;
  
  // Build CSV header
  const headers: string[] = [];
  if (includeFields.title) headers.push('Título');
  if (includeFields.date) headers.push('Data');
  if (includeFields.time) headers.push('Hora Início', 'Hora Fim');
  if (includeFields.type) headers.push('Tipo');
  if (includeFields.status) headers.push('Status');
  if (includeFields.location) headers.push('Localização');
  if (includeFields.participants) headers.push('Participantes');
  if (includeFields.description) headers.push('Descrição');
  if (includeFields.notes) headers.push('Notas');
  
  // Build CSV rows
  const rows = events.map(event => {
    const row: string[] = [];
    
    if (includeFields.title) row.push(escapeCsvValue(event.title));
    if (includeFields.date) row.push(format(parseISO(event.start_date), 'dd/MM/yyyy', { locale: pt }));
    if (includeFields.time) {
      row.push(format(parseISO(event.start_date), 'HH:mm'));
      row.push(format(parseISO(event.end_date), 'HH:mm'));
    }
    if (includeFields.type) row.push(escapeCsvValue(event.type));
    if (includeFields.status) row.push(escapeCsvValue(event.status));
    if (includeFields.location) row.push(escapeCsvValue(event.location || ''));
    if (includeFields.participants) {
      const count = event.participants?.length || 0;
      row.push(String(count));
    }
    if (includeFields.description) row.push(escapeCsvValue(event.description || ''));
    if (includeFields.notes) row.push(escapeCsvValue(event.notes || ''));
    
    return row.join(',');
  });
  
  // Combine header and rows
  const csv = [headers.join(','), ...rows].join('\n');
  
  // Download file
  downloadFile(csv, `calendar_export_${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCsvValue(value: string): string {
  if (!value) return '';
  
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
}

// ============================================================================
// JSON EXPORT
// ============================================================================

/**
 * Export events to JSON format
 */
export function exportToJSON(events: CalendarEvent[], options: ExportOptions): void {
  const { includeFields } = options;
  
  // Filter fields based on options
  const filteredEvents = events.map(event => {
    const filtered: any = {
      id: event.id,
    };
    
    if (includeFields.title) filtered.title = event.title;
    if (includeFields.date) {
      filtered.start_date = event.start_date;
      filtered.end_date = event.end_date;
    }
    if (includeFields.type) filtered.type = event.type;
    if (includeFields.status) filtered.status = event.status;
    if (includeFields.location) filtered.location = event.location;
    if (includeFields.participants) filtered.participants = event.participants;
    if (includeFields.description) filtered.description = event.description;
    if (includeFields.notes) filtered.notes = event.notes;
    
    return filtered;
  });
  
  const json = JSON.stringify({
    exported_at: new Date().toISOString(),
    count: events.length,
    events: filteredEvents,
  }, null, 2);
  
  downloadFile(json, `calendar_export_${format(new Date(), 'yyyy-MM-dd')}.json`, 'application/json');
}

// ============================================================================
// ICAL EXPORT
// ============================================================================

/**
 * Export events to iCal (.ics) format
 * Compatible with Google Calendar, Outlook, Apple Calendar, etc.
 */
export function exportToICAL(events: CalendarEvent[], options: ExportOptions): void {
  const lines: string[] = [];
  
  // iCal header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//PerformTrack//Calendar Export//PT');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push('X-WR-CALNAME:PerformTrack Calendar');
  lines.push('X-WR-TIMEZONE:Europe/Lisbon');
  
  // Add each event
  events.forEach(event => {
    lines.push('BEGIN:VEVENT');
    
    // UID (unique identifier)
    lines.push(`UID:${event.id}@performtrack.app`);
    
    // Timestamps
    const dtstart = formatICalDate(event.start_date);
    const dtend = formatICalDate(event.end_date);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    
    // Event details
    if (options.includeFields.title) {
      lines.push(`SUMMARY:${escapeICalValue(event.title)}`);
    }
    
    if (options.includeFields.description && event.description) {
      lines.push(`DESCRIPTION:${escapeICalValue(event.description)}`);
    }
    
    if (options.includeFields.location && event.location) {
      lines.push(`LOCATION:${escapeICalValue(event.location)}`);
    }
    
    if (options.includeFields.status) {
      // Map our status to iCal status
      const icalStatus = event.status === 'confirmed' ? 'CONFIRMED' : 
                        event.status === 'cancelled' ? 'CANCELLED' : 
                        'TENTATIVE';
      lines.push(`STATUS:${icalStatus}`);
    }
    
    // Timestamps (created, last modified)
    const now = formatICalDate(new Date().toISOString());
    lines.push(`DTSTAMP:${now}`);
    lines.push(`CREATED:${formatICalDate(event.created_at)}`);
    lines.push(`LAST-MODIFIED:${formatICalDate(event.updated_at)}`);
    
    // Categories (event type)
    if (options.includeFields.type) {
      lines.push(`CATEGORIES:${event.type}`);
    }
    
    lines.push('END:VEVENT');
  });
  
  // iCal footer
  lines.push('END:VCALENDAR');
  
  const ical = lines.join('\r\n');
  
  downloadFile(ical, `calendar_export_${format(new Date(), 'yyyy-MM-dd')}.ics`, 'text/calendar');
}

/**
 * Format date for iCal (YYYYMMDDTHHMMSSZ)
 */
function formatICalDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape iCal value (commas, semicolons, newlines)
 */
function escapeICalValue(value: string): string {
  if (!value) return '';
  
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// ============================================================================
// EXCEL EXPORT (using CSV as Excel can open CSV)
// ============================================================================

/**
 * Export events to Excel format
 * Note: This creates a CSV with UTF-8 BOM that Excel recognizes
 */
export function exportToExcel(events: CalendarEvent[], options: ExportOptions): void {
  const { includeFields } = options;
  
  // Build header
  const headers: string[] = [];
  if (includeFields.title) headers.push('Título');
  if (includeFields.date) headers.push('Data');
  if (includeFields.time) headers.push('Hora Início', 'Hora Fim', 'Duração');
  if (includeFields.type) headers.push('Tipo');
  if (includeFields.status) headers.push('Status');
  if (includeFields.location) headers.push('Localização');
  if (includeFields.participants) headers.push('Nº Participantes');
  if (includeFields.description) headers.push('Descrição');
  if (includeFields.notes) headers.push('Notas');
  
  // Build rows
  const rows = events.map(event => {
    const row: string[] = [];
    
    if (includeFields.title) row.push(escapeCsvValue(event.title));
    if (includeFields.date) row.push(format(parseISO(event.start_date), 'dd/MM/yyyy', { locale: pt }));
    if (includeFields.time) {
      const start = parseISO(event.start_date);
      const end = parseISO(event.end_date);
      row.push(format(start, 'HH:mm'));
      row.push(format(end, 'HH:mm'));
      
      // Calculate duration
      const durationMs = end.getTime() - start.getTime();
      const durationMin = Math.round(durationMs / 60000);
      row.push(`${durationMin} min`);
    }
    if (includeFields.type) row.push(escapeCsvValue(event.type));
    if (includeFields.status) row.push(escapeCsvValue(event.status));
    if (includeFields.location) row.push(escapeCsvValue(event.location || '-'));
    if (includeFields.participants) {
      const count = event.participants?.length || 0;
      row.push(String(count));
    }
    if (includeFields.description) row.push(escapeCsvValue(event.description || '-'));
    if (includeFields.notes) row.push(escapeCsvValue(event.notes || '-'));
    
    return row.join('\t'); // Tab-separated for Excel
  });
  
  // Combine
  const excel = [headers.join('\t'), ...rows].join('\n');
  
  // Add UTF-8 BOM for Excel to recognize encoding
  const BOM = '\uFEFF';
  
  downloadFile(BOM + excel, `calendar_export_${format(new Date(), 'yyyy-MM-dd')}.xls`, 'application/vnd.ms-excel');
}

// ============================================================================
// PDF EXPORT (simplified HTML-based)
// ============================================================================

/**
 * Export events to PDF format
 * Creates an HTML document that can be printed to PDF
 */
export function exportToPDF(events: CalendarEvent[], options: ExportOptions): void {
  const { includeFields } = options;
  
  // Build HTML
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Calendário PerformTrack - ${format(new Date(), 'dd/MM/yyyy')}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 40px;
      color: #1e293b;
    }
    h1 {
      color: #0ea5e9;
      border-bottom: 3px solid #0ea5e9;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    .meta {
      color: #64748b;
      margin-bottom: 40px;
      font-size: 14px;
    }
    .event {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .event-title {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }
    .event-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge-training { background: #dbeafe; color: #1e40af; }
    .badge-competition { background: #fee2e2; color: #991b1b; }
    .badge-assessment { background: #fef3c7; color: #92400e; }
    .badge-meeting { background: #e9d5ff; color: #6b21a8; }
    .event-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
    }
    .detail {
      font-size: 14px;
      color: #475569;
    }
    .detail-label {
      font-weight: 600;
      color: #334155;
    }
    .status-confirmed { color: #059669; }
    .status-scheduled { color: #0891b2; }
    .status-cancelled { color: #dc2626; }
    @media print {
      body { padding: 20px; }
      .event { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>📅 Calendário PerformTrack</h1>
  <div class="meta">
    <div>Exportado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</div>
    <div>Total de eventos: ${events.length}</div>
  </div>
`;
  
  // Add each event
  events.forEach(event => {
    const startDate = parseISO(event.start_date);
    const endDate = parseISO(event.end_date);
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
    
    html += `
  <div class="event">
    <div class="event-header">
      <div class="event-title">${escapeHtml(event.title)}</div>
      ${includeFields.type ? `<span class="event-badge badge-${event.type}">${event.type}</span>` : ''}
    </div>
    <div class="event-details">
`;
    
    if (includeFields.date) {
      html += `
      <div class="detail">
        <span class="detail-label">Data:</span> ${format(startDate, "dd/MM/yyyy (EEEE)", { locale: pt })}
      </div>
`;
    }
    
    if (includeFields.time) {
      html += `
      <div class="detail">
        <span class="detail-label">Horário:</span> ${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')} (${duration} min)
      </div>
`;
    }
    
    if (includeFields.status) {
      html += `
      <div class="detail">
        <span class="detail-label">Status:</span> <span class="status-${event.status}">${event.status}</span>
      </div>
`;
    }
    
    if (includeFields.location && event.location) {
      html += `
      <div class="detail">
        <span class="detail-label">Local:</span> ${escapeHtml(event.location)}
      </div>
`;
    }
    
    if (includeFields.participants) {
      const count = event.participants?.length || 0;
      html += `
      <div class="detail">
        <span class="detail-label">Participantes:</span> ${count}
      </div>
`;
    }
    
    html += `
    </div>
`;
    
    if (includeFields.description && event.description) {
      html += `
    <div class="detail" style="margin-top: 12px; grid-column: 1 / -1;">
      <span class="detail-label">Descrição:</span><br>
      ${escapeHtml(event.description)}
    </div>
`;
    }
    
    html += `
  </div>
`;
  });
  
  html += `
</body>
</html>
`;
  
  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } else {
    alert('Pop-up bloqueado. Por favor permita pop-ups para exportar PDF.');
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(value: string): string {
  if (!value) return '';
  
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// DOWNLOAD HELPER
// ============================================================================

/**
 * Trigger file download in browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Export events to specified format
 */
export function exportEvents(
  events: CalendarEvent[],
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'ical',
  options: ExportOptions
): void {
  switch (format) {
    case 'csv':
      exportToCSV(events, options);
      break;
    case 'excel':
      exportToExcel(events, options);
      break;
    case 'pdf':
      exportToPDF(events, options);
      break;
    case 'json':
      exportToJSON(events, options);
      break;
    case 'ical':
      exportToICAL(events, options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
