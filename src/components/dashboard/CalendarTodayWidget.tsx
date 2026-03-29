/**
 * CALENDAR TODAY WIDGET
 * Dashboard widget showing today's events
 * 
 * Features:
 * - Today's events overview
 * - Quick event creation
 * - Event status indicators
 * - Navigate to full calendar
 * - Real-time updates
 * - Workspace isolation
 * 
 * @module dashboard/CalendarTodayWidget
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Circle,
  TrendingUp,
} from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { useAppContext } from '@/contexts/AppContext';

// ============================================================================
// TYPES
// ============================================================================

interface CalendarTodayWidgetProps {
  events: CalendarEvent[];
  onCreateEvent?: () => void;
  onViewCalendar?: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
      return {
        icon: CheckCircle,
        color: 'emerald',
        label: 'Confirmado',
      };
    case 'pending':
      return {
        icon: Clock,
        color: 'amber',
        label: 'Pendente',
      };
    case 'cancelled':
      return {
        icon: AlertCircle,
        color: 'red',
        label: 'Cancelado',
      };
    default:
      return {
        icon: Circle,
        color: 'slate',
        label: status,
      };
  }
};

const getEventTimeLabel = (event: CalendarEvent): string => {
  const startDate = typeof event.start_date === 'string' ? parseISO(event.start_date) : event.start_date;
  const endDate = typeof event.end_date === 'string' ? parseISO(event.end_date) : event.end_date;

  if (isToday(startDate)) {
    return format(startDate, 'HH:mm', { locale: pt });
  } else if (isTomorrow(startDate)) {
    return `Amanhã ${format(startDate, 'HH:mm', { locale: pt })}`;
  } else {
    return format(startDate, 'dd MMM HH:mm', { locale: pt });
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export function CalendarTodayWidget({
  events,
  onCreateEvent,
  onViewCalendar,
  onEventClick,
  isLoading = false,
}: CalendarTodayWidgetProps) {
  const { currentWorkspace } = useAppContext();

  // Filter events for today from current workspace
  const todayEvents = events.filter((event) => {
    if (!currentWorkspace || event.workspace_id !== currentWorkspace.id) return false;
    
    const eventDate = typeof event.start_date === 'string' 
      ? parseISO(event.start_date) 
      : event.start_date;
    
    return isToday(eventDate) && event.status !== 'cancelled';
  });

  // Sort by start time
  const sortedEvents = todayEvents.sort((a, b) => {
    const dateA = typeof a.start_date === 'string' ? parseISO(a.start_date) : a.start_date;
    const dateB = typeof b.start_date === 'string' ? parseISO(b.start_date) : b.start_date;
    return dateA.getTime() - dateB.getTime();
  });

  // Calculate stats
  const totalEvents = sortedEvents.length;
  const confirmedEvents = sortedEvents.filter(e => e.status === 'confirmed').length;
  const pendingEvents = sortedEvents.filter(e => e.status === 'pending').length;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/95 to-white/95 p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Agenda de Hoje</h3>
            <p className="text-xs text-slate-600">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })}
            </p>
          </div>
        </div>

        {onCreateEvent && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCreateEvent}
            className="h-8 w-8 rounded-xl bg-sky-100 hover:bg-sky-200 flex items-center justify-center transition-colors"
            title="Criar evento"
          >
            <Plus className="h-4 w-4 text-sky-700" />
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl bg-white border border-slate-200/80 p-3">
          <p className="text-xs text-slate-600 mb-1">Total</p>
          <p className="text-xl font-bold text-slate-900">{totalEvents}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3">
          <p className="text-xs text-emerald-700 mb-1">Confirmados</p>
          <p className="text-xl font-bold text-emerald-900">{confirmedEvents}</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3">
          <p className="text-xs text-amber-700 mb-1">Pendentes</p>
          <p className="text-xl font-bold text-amber-900">{pendingEvents}</p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Nenhum evento hoje</p>
            <p className="text-xs text-slate-500">Dia livre para descanso!</p>
          </div>
        ) : (
          <>
            {sortedEvents.slice(0, 3).map((event, index) => {
              const StatusIcon = getStatusConfig(event.status).icon;
              const statusColor = getStatusConfig(event.status).color;

              return (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEventClick?.(event)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all text-left"
                >
                  {/* Time */}
                  <div className="flex-shrink-0 text-center">
                    <p className="text-xs font-medium text-slate-600">
                      {format(
                        typeof event.start_date === 'string' ? parseISO(event.start_date) : event.start_date,
                        'HH:mm',
                        { locale: pt }
                      )}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {event.title}
                      </p>
                      <StatusIcon className={`h-4 w-4 flex-shrink-0 text-${statusColor}-600`} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      {event.type && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
                          {event.type}
                        </span>
                      )}
                      
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}

                      {event.athlete_ids && event.athlete_ids.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.athlete_ids.length}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* Show More */}
            {sortedEvents.length > 3 && (
              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  +{sortedEvents.length - 3} evento{sortedEvents.length - 3 !== 1 ? 's' : ''} adiciona
                  {sortedEvents.length - 3 !== 1 ? 'is' : 'l'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Action */}
      {onViewCalendar && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewCalendar}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
        >
          <span>Ver Calendário Completo</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      )}

      {/* Quick Stat - Next Event */}
      {sortedEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-slate-200"
        >
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-600">
              Próximo:{' '}
              <span className="font-semibold text-slate-900">
                {sortedEvents[0].title}
              </span>{' '}
              às{' '}
              <span className="font-semibold text-sky-700">
                {format(
                  typeof sortedEvents[0].start_date === 'string'
                    ? parseISO(sortedEvents[0].start_date)
                    : sortedEvents[0].start_date,
                  'HH:mm',
                  { locale: pt }
                )}
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
