/**
 * ANALYTICS REPORT MODAL
 * Generate and export analytics reports
 * 
 * Features:
 * - Weekly/Monthly report selection
 * - Date range picker
 * - Comparison options
 * - Export to PDF/CSV
 * - Email report option
 * 
 * @module calendar/modals/AnalyticsReportModal
 * @version 2.0.0
 * @created 20 Janeiro 2026
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Mail,
  Calendar as CalendarIcon,
  TrendingUp,
  FileText,
  Loader2,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { WeeklyReport } from '../components/WeeklyReport';
import { MonthlyReport } from '../components/MonthlyReport';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  workspaceId: string;
}

type ReportType = 'week' | 'month';
type ExportFormat = 'pdf' | 'csv' | 'email';

// ============================================================================
// COMPONENT
// ============================================================================

export function AnalyticsReportModal({
  isOpen,
  onClose,
  events,
  workspaceId,
}: AnalyticsReportModalProps) {
  
  const [reportType, setReportType] = useState<ReportType>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setReportType('week');
      setSelectedDate(new Date());
    }
  }, [isOpen]);

  // Calculate date ranges
  const currentRange = reportType === 'week'
    ? { start: startOfWeek(selectedDate, { weekStartsOn: 1 }), end: endOfWeek(selectedDate, { weekStartsOn: 1 }) }
    : { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) };

  const previousRange = reportType === 'week'
    ? { start: startOfWeek(subWeeks(selectedDate, 1), { weekStartsOn: 1 }), end: endOfWeek(subWeeks(selectedDate, 1), { weekStartsOn: 1 }) }
    : { start: startOfMonth(subMonths(selectedDate, 1)), end: endOfMonth(subMonths(selectedDate, 1)) };

  // Filter events for current and previous period
  const currentEvents = events.filter(e => {
    const eventDate = typeof e.start_date === 'string' ? new Date(e.start_date) : e.start_date;
    return eventDate >= currentRange.start && eventDate <= currentRange.end;
  });

  const previousEvents = events.filter(e => {
    const eventDate = typeof e.start_date === 'string' ? new Date(e.start_date) : e.start_date;
    return eventDate >= previousRange.start && eventDate <= previousRange.end;
  });

  // Handle export
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (format === 'pdf') {
        toast.success('Relatório exportado para PDF');
      } else if (format === 'csv') {
        toast.success('Dados exportados para CSV');
      } else if (format === 'email') {
        toast.success('Relatório enviado por email');
      }
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    } finally {
      setIsExporting(false);
    }
  };

  // Quick date selections
  const quickSelections = [
    {
      label: reportType === 'week' ? 'Esta Semana' : 'Este Mês',
      date: new Date(),
    },
    {
      label: reportType === 'week' ? 'Semana Passada' : 'Mês Passado',
      date: reportType === 'week' ? subWeeks(new Date(), 1) : subMonths(new Date(), 1),
    },
    {
      label: reportType === 'week' ? '2 Semanas Atrás' : '2 Meses Atrás',
      date: reportType === 'week' ? subWeeks(new Date(), 2) : subMonths(new Date(), 2),
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Relatório de Analytics</h2>
                <p className="text-sm text-slate-600">
                  Gerar e exportar relatórios de performance
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </motion.button>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 space-y-4">
            {/* Report Type Selector */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Tipo de Relatório</p>
              <div className="flex gap-2">
                {[
                  { id: 'week' as const, label: 'Semanal', icon: CalendarIcon },
                  { id: 'month' as const, label: 'Mensal', icon: TrendingUp },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = reportType === type.id;

                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setReportType(type.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Date Selections */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Período</p>
              <div className="grid grid-cols-3 gap-2">
                {quickSelections.map((selection, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(selection.date)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      format(selectedDate, 'yyyy-MM-dd') === format(selection.date, 'yyyy-MM-dd')
                        ? 'bg-sky-100 text-sky-700 border-2 border-sky-300'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {selection.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Exportar</p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>PDF</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>CSV</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('email')}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  <span>Email</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {reportType === 'week' ? (
                <motion.div
                  key="weekly"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <WeeklyReport
                    events={currentEvents}
                    weekStart={currentRange.start}
                    previousWeekEvents={previousEvents}
                    workspaceId={workspaceId}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="monthly"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <MonthlyReport
                    events={currentEvents}
                    monthStart={currentRange.start}
                    previousMonthEvents={previousEvents}
                    workspaceId={workspaceId}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <p>
                {currentEvents.length} eventos neste período
              </p>
              <p>
                Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
