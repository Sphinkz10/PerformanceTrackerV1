/**
 * EXPORT UTILITIES
 * Funções para exportar dados em diferentes formatos
 */

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeDate: boolean;
  includeAthlete: boolean;
  includeValue: boolean;
  includeZone: boolean;
  includeChange: boolean;
  includeNotes: boolean;
  includeEntryBy: boolean;
  groupBy: 'date' | 'athlete' | 'zone';
  period: 'current' | 'all' | 'custom';
}

export interface HistoryEntry {
  id: string;
  date: string;
  time: string;
  athleteName: string;
  value: number;
  unit: string;
  zone: 'green' | 'yellow' | 'red';
  change: number;
  changeLabel: string;
  note?: string;
  noteAuthor?: string;
  entryBy?: string;
}

// ============================================================================
// CSV EXPORT
// ============================================================================

export function exportToCSV(
  data: HistoryEntry[],
  config: ExportConfig,
  metricName: string
): void {
  const headers: string[] = [];
  
  if (config.includeDate) headers.push('Data', 'Hora');
  if (config.includeAthlete) headers.push('Atleta');
  if (config.includeValue) headers.push('Valor');
  if (config.includeZone) headers.push('Zona');
  if (config.includeChange) headers.push('Variação');
  if (config.includeNotes) headers.push('Notas', 'Autor da Nota');
  if (config.includeEntryBy) headers.push('Inserido por');

  const rows = data.map(entry => {
    const row: string[] = [];
    
    if (config.includeDate) {
      row.push(entry.date);
      row.push(entry.time);
    }
    if (config.includeAthlete) row.push(entry.athleteName);
    if (config.includeValue) row.push(`${entry.value}${entry.unit}`);
    if (config.includeZone) {
      const zoneEmoji = entry.zone === 'green' ? '🟢' : entry.zone === 'yellow' ? '🟡' : '🔴';
      row.push(`${zoneEmoji} ${entry.zone}`);
    }
    if (config.includeChange) row.push(entry.changeLabel);
    if (config.includeNotes) {
      row.push(entry.note || '-');
      row.push(entry.noteAuthor || '-');
    }
    if (config.includeEntryBy) row.push(entry.entryBy || '-');
    
    return row;
  });

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Download
  downloadFile(
    csvContent,
    `${sanitizeFilename(metricName)}_historico.csv`,
    'text/csv;charset=utf-8;'
  );
}

// ============================================================================
// JSON EXPORT
// ============================================================================

export function exportToJSON(
  data: HistoryEntry[],
  config: ExportConfig,
  metricName: string
): void {
  const filtered = data.map(entry => {
    const obj: any = {};
    
    if (config.includeDate) {
      obj.date = entry.date;
      obj.time = entry.time;
    }
    if (config.includeAthlete) obj.athleteName = entry.athleteName;
    if (config.includeValue) {
      obj.value = entry.value;
      obj.unit = entry.unit;
    }
    if (config.includeZone) obj.zone = entry.zone;
    if (config.includeChange) {
      obj.change = entry.change;
      obj.changeLabel = entry.changeLabel;
    }
    if (config.includeNotes) {
      obj.note = entry.note;
      obj.noteAuthor = entry.noteAuthor;
    }
    if (config.includeEntryBy) obj.entryBy = entry.entryBy;
    
    return obj;
  });

  const jsonContent = JSON.stringify(
    {
      metric: metricName,
      exportDate: new Date().toISOString(),
      totalEntries: filtered.length,
      config: config,
      data: filtered,
    },
    null,
    2
  );

  downloadFile(
    jsonContent,
    `${sanitizeFilename(metricName)}_historico.json`,
    'application/json'
  );
}

// ============================================================================
// EXCEL EXPORT (using CSV with .xlsx extension for simplicity)
// For true Excel support, use libraries like xlsx or exceljs
// ============================================================================

export function exportToExcel(
  data: HistoryEntry[],
  config: ExportConfig,
  metricName: string
): void {
  // For now, we'll create a CSV that can be opened in Excel
  // In production, use a library like 'xlsx' for true .xlsx support
  
  const headers: string[] = [];
  
  if (config.includeDate) headers.push('Data', 'Hora');
  if (config.includeAthlete) headers.push('Atleta');
  if (config.includeValue) headers.push('Valor');
  if (config.includeZone) headers.push('Zona');
  if (config.includeChange) headers.push('Variação');
  if (config.includeNotes) headers.push('Notas', 'Autor da Nota');
  if (config.includeEntryBy) headers.push('Inserido por');

  const rows = data.map(entry => {
    const row: string[] = [];
    
    if (config.includeDate) {
      row.push(entry.date);
      row.push(entry.time);
    }
    if (config.includeAthlete) row.push(entry.athleteName);
    if (config.includeValue) row.push(`${entry.value}${entry.unit}`);
    if (config.includeZone) row.push(entry.zone);
    if (config.includeChange) row.push(entry.changeLabel);
    if (config.includeNotes) {
      row.push(entry.note || '');
      row.push(entry.noteAuthor || '');
    }
    if (config.includeEntryBy) row.push(entry.entryBy || '');
    
    return row;
  });

  // CSV content compatible with Excel
  const csvContent = [
    headers.join('\t'), // Tab-separated for better Excel compatibility
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  downloadFile(
    csvContent,
    `${sanitizeFilename(metricName)}_historico.xlsx`,
    'application/vnd.ms-excel'
  );
}

// ============================================================================
// PDF EXPORT (simple text-based - for production use jsPDF or pdfmake)
// ============================================================================

export function exportToPDF(
  data: HistoryEntry[],
  config: ExportConfig,
  metricName: string
): void {
  // For production, use jsPDF or pdfmake
  // This is a simple text-based version
  
  const lines: string[] = [
    '═══════════════════════════════════════════════════',
    `HISTÓRICO - ${metricName.toUpperCase()}`,
    `Exportado em: ${new Date().toLocaleString('pt-PT')}`,
    `Total de entradas: ${data.length}`,
    '═══════════════════════════════════════════════════',
    '',
  ];

  data.forEach((entry, index) => {
    lines.push(`[${index + 1}] ${entry.date} ${entry.time}`);
    if (config.includeAthlete) lines.push(`  Atleta: ${entry.athleteName}`);
    if (config.includeValue) lines.push(`  Valor: ${entry.value}${entry.unit}`);
    if (config.includeZone) {
      const zoneEmoji = entry.zone === 'green' ? '🟢' : entry.zone === 'yellow' ? '🟡' : '🔴';
      lines.push(`  Zona: ${zoneEmoji} ${entry.zone}`);
    }
    if (config.includeChange) lines.push(`  Variação: ${entry.changeLabel}`);
    if (config.includeNotes && entry.note) {
      lines.push(`  Nota: "${entry.note}"`);
      if (entry.noteAuthor) lines.push(`       - ${entry.noteAuthor}`);
    }
    lines.push('');
  });

  lines.push('═══════════════════════════════════════════════════');
  lines.push('Gerado por PerformTrack Data OS');
  lines.push('═══════════════════════════════════════════════════');

  const textContent = lines.join('\n');

  downloadFile(
    textContent,
    `${sanitizeFilename(metricName)}_historico.pdf`,
    'application/pdf'
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// ============================================================================
// EXPORT DISPATCHER
// ============================================================================

export function exportHistory(
  data: HistoryEntry[],
  config: ExportConfig,
  metricName: string
): void {
  switch (config.format) {
    case 'csv':
      exportToCSV(data, config, metricName);
      break;
    case 'excel':
      exportToExcel(data, config, metricName);
      break;
    case 'pdf':
      exportToPDF(data, config, metricName);
      break;
    case 'json':
      exportToJSON(data, config, metricName);
      break;
    default:
      console.error('Formato de export desconhecido:', config.format);
  }
}
