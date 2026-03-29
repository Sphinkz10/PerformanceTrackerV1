/**
 * EXPORT MODAL V2
 * 
 * Modal para exportar eventos do calendário
 * Suporta: iCal (.ics), CSV, JSON
 * Com filtros e preview
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useImportExport, ExportFormat } from '@/hooks/useImportExport';

interface ExportModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  selectedEvents?: CalendarEvent[];
}

type DateRangePreset = 'all' | 'today' | 'week' | 'month' | 'selected' | 'custom';

export function ExportModalV2({
  isOpen,
  onClose,
  events,
  selectedEvents = [],
}: ExportModalV2Props) {
  const { exportEvents: doExport, isExporting } = useImportExport();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('ical');
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>(
    selectedEvents.length > 0 ? 'selected' : 'month'
  );
  const [customStartDate, setCustomStartDate] = useState(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [customEndDate, setCustomEndDate] = useState(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Calculate filtered events based on selections
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Date range filter
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (dateRangePreset) {
      case 'selected':
        if (selectedEvents.length > 0) {
          return selectedEvents;
        }
        return [];

      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;

      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;

      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;

      case 'custom':
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
        break;

      case 'all':
      default:
        return filtered.filter(applyTypeAndStatusFilters);
    }

    filtered = filtered.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate >= startDate && eventDate <= endDate;
    });

    // Apply type and status filters
    return filtered.filter(applyTypeAndStatusFilters);

    function applyTypeAndStatusFilters(event: CalendarEvent) {
      if (filterEventType !== 'all' && event.event_type !== filterEventType) {
        return false;
      }
      if (filterStatus !== 'all' && event.status !== filterStatus) {
        return false;
      }
      return true;
    }
  }, [events, selectedEvents, dateRangePreset, customStartDate, customEndDate, filterEventType, filterStatus]);

  const handleExport = () => {
    if (filteredEvents.length === 0) return;

    doExport({
      format: selectedFormat,
      events: filteredEvents,
      calendarName: 'PerformTrack Calendar',
    });

    onClose();
  };

  if (!isOpen) return null;

  const formatOptions: { value: ExportFormat; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'ical',
      label: 'iCal (.ics)',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Importar no Google Calendar, Outlook, Apple',
    },
    {
      value: 'csv',
      label: 'CSV',
      icon: <FileText className="h-5 w-5" />,
      description: 'Excel, Google Sheets, análise de dados',
    },
    {
      value: 'json',
      label: 'JSON',
      icon: <FileText className="h-5 w-5" />,
      description: 'Backup completo, integração com APIs',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Exportar Eventos
                  </h2>
                  <p className="text-sm text-slate-600">
                    Escolha formato e período
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Format Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Formato de Exportação
              </h3>
              <div className="space-y-2">
                {formatOptions.map(option => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedFormat === option.value
                        ? 'border-sky-400 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-sky-200'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={option.value}
                      checked={selectedFormat === option.value}
                      onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                      className="h-5 w-5 text-sky-600"
                    />
                    <div className={`
                      h-10 w-10 rounded-lg flex items-center justify-center
                      ${selectedFormat === option.value
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                      }
                    `}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-slate-600">
                        {option.description}
                      </p>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Período
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {selectedEvents.length > 0 && (
                  <button
                    onClick={() => setDateRangePreset('selected')}
                    className={`
                      px-4 py-2 text-sm font-semibold rounded-xl transition-all
                      ${dateRangePreset === 'selected'
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }
                    `}
                  >
                    Selecionados ({selectedEvents.length})
                  </button>
                )}
                <button
                  onClick={() => setDateRangePreset('today')}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-xl transition-all
                    ${dateRangePreset === 'today'
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setDateRangePreset('week')}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-xl transition-all
                    ${dateRangePreset === 'week'
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  Esta Semana
                </button>
                <button
                  onClick={() => setDateRangePreset('month')}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-xl transition-all
                    ${dateRangePreset === 'month'
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  Este Mês
                </button>
                <button
                  onClick={() => setDateRangePreset('all')}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-xl transition-all
                    ${dateRangePreset === 'all'
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  Todos
                </button>
                <button
                  onClick={() => setDateRangePreset('custom')}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-xl transition-all
                    ${dateRangePreset === 'custom'
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  Personalizado
                </button>
              </div>

              {/* Custom Date Range */}
              {dateRangePreset === 'custom' && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-sky-50 rounded-xl border border-sky-200">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Data Início
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Filters (Collapsible) */}
            <div className="mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    Filtros Avançados
                  </span>
                </div>
                {showFilters ? (
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-600 rotate-180" />
                )}
              </button>

              {showFilters && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-2 block">
                      Tipo de Evento
                    </label>
                    <select
                      value={filterEventType}
                      onChange={(e) => setFilterEventType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 appearance-none"
                    >
                      <option value="all">Todos</option>
                      <option value="training">Treino</option>
                      <option value="competition">Competição</option>
                      <option value="evaluation">Avaliação</option>
                      <option value="meeting">Reunião</option>
                      <option value="recovery">Recuperação</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-2 block">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 appearance-none"
                    >
                      <option value="all">Todos</option>
                      <option value="scheduled">Agendado</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Export Preview */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900 mb-1">
                  Pronto para exportar
                </p>
                <p className="text-xs text-emerald-700">
                  <strong>{filteredEvents.length}</strong> evento{filteredEvents.length !== 1 ? 's' : ''} será{filteredEvents.length !== 1 ? 'ão' : ''} exportado{filteredEvents.length !== 1 ? 's' : ''} no formato <strong>{formatOptions.find(f => f.value === selectedFormat)?.label}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isExporting}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting || filteredEvents.length === 0}
              className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Exportar {filteredEvents.length} Evento{filteredEvents.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
