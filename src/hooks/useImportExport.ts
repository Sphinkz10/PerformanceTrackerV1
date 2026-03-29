/**
 * useImportExport Hook
 * 
 * Handles import and export of calendar events
 * Supports: iCal, CSV, JSON formats
 */

import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { toast } from 'sonner@2.0.3';
import {
  generateICalendar,
  generateCSV,
  generateJSON,
  parseiCalendar,
  parseCSV,
  parseJSON,
  detectFileFormat,
  downloadFile,
  generateFilename,
  validateImportedEvent,
  calculateImportStats,
  ImportStats,
} from '@/lib/calendar/import-export-utils';

export type ExportFormat = 'ical' | 'csv' | 'json';
export type ImportFormat = 'ical' | 'csv' | 'json';

export interface ImportPreview {
  events: Partial<CalendarEvent>[];
  stats: ImportStats;
  format: ImportFormat;
}

export interface ExportOptions {
  format: ExportFormat;
  events: CalendarEvent[];
  filename?: string;
  calendarName?: string;
}

export function useImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Read file and parse content
   */
  const readFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      
      reader.readAsText(file);
    });
  }, []);

  /**
   * Preview import before applying
   */
  const previewImport = useCallback(async (
    file: File,
    existingEvents: CalendarEvent[] = []
  ): Promise<ImportPreview | null> => {
    setIsImporting(true);
    setError(null);

    try {
      const content = await readFile(file);
      const format = detectFileFormat(content, file.name);

      if (format === 'unknown') {
        throw new Error('Formato de arquivo não reconhecido');
      }

      let parsedEvents: Partial<CalendarEvent>[] = [];

      switch (format) {
        case 'ical':
          parsedEvents = parseiCalendar(content);
          break;
        case 'csv':
          parsedEvents = parseCSV(content);
          break;
        case 'json':
          parsedEvents = parseJSON(content);
          break;
      }

      if (parsedEvents.length === 0) {
        throw new Error('Nenhum evento válido encontrado no arquivo');
      }

      const stats = calculateImportStats(parsedEvents, existingEvents);

      const preview: ImportPreview = {
        events: parsedEvents,
        stats,
        format,
      };

      setImportPreview(preview);
      toast.success(`${parsedEvents.length} evento(s) encontrado(s)! 📥`);

      return preview;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao processar arquivo';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsImporting(false);
    }
  }, [readFile]);

  /**
   * Import events to database
   */
  const importEvents = useCallback(async (
    events: Partial<CalendarEvent>[],
    workspaceId: string,
    options: {
      skipDuplicates?: boolean;
      skipConflicts?: boolean;
      defaultStatus?: string;
    } = {}
  ): Promise<{ success: boolean; count: number; errors?: string[] }> => {
    setIsImporting(true);
    setError(null);

    try {
      // Validate all events
      const validatedEvents: CalendarEvent[] = [];
      const errors: string[] = [];

      events.forEach((event, index) => {
        const validation = validateImportedEvent(event);
        
        if (validation.valid) {
          validatedEvents.push({
            ...event,
            workspace_id: workspaceId,
            status: event.status || options.defaultStatus || 'scheduled',
            event_type: event.event_type || 'other',
            duration: event.duration || 60,
            athlete_ids: event.athlete_ids || [],
          } as CalendarEvent);
        } else {
          errors.push(`Evento ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });

      if (validatedEvents.length === 0) {
        throw new Error('Nenhum evento válido para importar');
      }

      // Call API to create events
      const response = await fetch('/api/calendar-events/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: validatedEvents,
          skipDuplicates: options.skipDuplicates,
          skipConflicts: options.skipConflicts,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao importar eventos');
      }

      const result = await response.json();

      toast.success(`${result.count} evento(s) importado(s) com sucesso! 🎉`);

      setImportPreview(null);

      return {
        success: true,
        count: result.count,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao importar eventos';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsImporting(false);
    }
  }, []);

  /**
   * Export events
   */
  const exportEvents = useCallback((options: ExportOptions): void => {
    setIsExporting(true);
    setError(null);

    try {
      const { format, events, filename, calendarName } = options;

      let content: string;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'ical':
          content = generateICalendar(events, calendarName || 'PerformTrack');
          mimeType = 'text/calendar';
          extension = 'ics';
          break;

        case 'csv':
          content = generateCSV(events);
          mimeType = 'text/csv';
          extension = 'csv';
          break;

        case 'json':
          content = generateJSON(events);
          mimeType = 'application/json';
          extension = 'json';
          break;

        default:
          throw new Error('Formato não suportado');
      }

      const finalFilename = filename || generateFilename('performtrack_calendar', extension);

      downloadFile(content, finalFilename, mimeType);

      toast.success(`${events.length} evento(s) exportado(s)! 📤`);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao exportar eventos';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Quick export selected events
   */
  const quickExport = useCallback((
    events: CalendarEvent[],
    format: ExportFormat
  ): void => {
    exportEvents({ events, format });
  }, [exportEvents]);

  /**
   * Clear import preview
   */
  const clearPreview = useCallback(() => {
    setImportPreview(null);
    setError(null);
  }, []);

  return {
    // State
    isImporting,
    isExporting,
    importPreview,
    error,

    // Import
    previewImport,
    importEvents,
    clearPreview,

    // Export
    exportEvents,
    quickExport,
  };
}

/**
 * Type for the hook return value
 */
export type ImportExportState = ReturnType<typeof useImportExport>;
