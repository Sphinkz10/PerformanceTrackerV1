/**
 * WEEKLY REPORT COMPONENT
 * Formatted weekly performance report
 * 
 * Features:
 * - Week summary with key metrics
 * - Day-by-day breakdown
 * - Top performers
 * - Insights and recommendations
 * - Export to PDF/Email
 * 
 * @module calendar/components/WeeklyReport
 * @version 2.0.0
 * @created 20 Janeiro 2026
 */

import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Users,
  Clock,
  ArrowRight,
  Award,
  AlertCircle,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

interface WeeklyReportProps {
  events: CalendarEvent[];
  weekStart: Date;
  previousWeekEvents?: CalendarEvent[];
  workspaceId: string;
}

interface DayMetrics {
  date: Date;
  eventCount: number;
  completedCount: number;
  totalParticipants: number;
  completionRate: number;
}

// ============================================================================
// HELPERS
// ============================================================================

function getTrendIcon(change: number) {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <ArrowRight className="h-4 w-4 text-slate-400" />;
}

function getTrendColor(change: number) {
  if (change > 0) return 'text-emerald-600';
  if (change < 0) return 'text-red-600';
  return 'text-slate-600';
}

// ============================================================================
// COMPONENT
// ============================================================================

export function WeeklyReport({
  events,
  weekStart,
  previousWeekEvents = [],
  workspaceId,
}: WeeklyReportProps) {
  
  // Calculate week range
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalEvents = events.length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const cancelledEvents = events.filter(e => e.status === 'cancelled').length;
    const totalParticipants = events.reduce((sum, e) => sum + (e.athlete_ids?.length || 0), 0);
    const avgParticipants = totalEvents > 0 ? totalParticipants / totalEvents : 0;
    const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

    // Previous week for comparison
    const prevTotalEvents = previousWeekEvents.length;
    const prevCompletedEvents = previousWeekEvents.filter(e => e.status === 'completed').length;
    const prevCompletionRate = prevTotalEvents > 0 
      ? (prevCompletedEvents / prevTotalEvents) * 100 
      : 0;

    return {
      totalEvents,
      completedEvents,
      cancelledEvents,
      totalParticipants,
      avgParticipants,
      completionRate,
      changes: {
        events: totalEvents - prevTotalEvents,
        completion: completionRate - prevCompletionRate,
      },
    };
  }, [events, previousWeekEvents]);

  // Day-by-day metrics
  const dayMetrics = useMemo<DayMetrics[]>(() => {
    return weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEvents = events.filter(e => {
        const eventDate = typeof e.start_date === 'string' 
          ? e.start_date 
          : format(e.start_date, 'yyyy-MM-dd');
        return eventDate === dayStr;
      });

      const eventCount = dayEvents.length;
      const completedCount = dayEvents.filter(e => e.status === 'completed').length;
      const totalParticipants = dayEvents.reduce((sum, e) => sum + (e.athlete_ids?.length || 0), 0);
      const completionRate = eventCount > 0 ? (completedCount / eventCount) * 100 : 0;

      return {
        date: day,
        eventCount,
        completedCount,
        totalParticipants,
        completionRate,
      };
    });
  }, [weekDays, events]);

  // Top event types
  const topTypes = useMemo(() => {
    const typeCounts = new Map<string, number>();
    events.forEach(e => {
      typeCounts.set(e.type, (typeCounts.get(e.type) || 0) + 1);
    });
    return Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [events]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Relatório Semanal</h2>
        <p className="text-sm text-slate-600 mt-1">
          {format(weekStart, "dd 'de' MMMM", { locale: pt })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: pt })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Eventos</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{metrics.totalEvents}</p>
          <div className={`flex items-center gap-1 mt-1 ${getTrendColor(metrics.changes.events)}`}>
            {getTrendIcon(metrics.changes.events)}
            <span className="text-xs font-medium">
              {metrics.changes.events > 0 ? '+' : ''}{metrics.changes.events} vs semana anterior
            </span>
          </div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Taxa Conclusão</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {metrics.completionRate.toFixed(0)}%
          </p>
          <div className={`flex items-center gap-1 mt-1 ${getTrendColor(metrics.changes.completion)}`}>
            {getTrendIcon(metrics.changes.completion)}
            <span className="text-xs font-medium">
              {metrics.changes.completion > 0 ? '+' : ''}{metrics.changes.completion.toFixed(1)}% vs semana anterior
            </span>
          </div>
        </motion.div>

        {/* Total Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Atletas</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{metrics.totalParticipants}</p>
          <p className="text-xs text-slate-600 mt-1">
            média de {metrics.avgParticipants.toFixed(1)} por evento
          </p>
        </motion.div>

        {/* Cancelled Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Cancelados</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{metrics.cancelledEvents}</p>
          <p className="text-xs text-slate-600 mt-1">
            {metrics.totalEvents > 0 ? ((metrics.cancelledEvents / metrics.totalEvents) * 100).toFixed(0) : 0}% do total
          </p>
        </motion.div>
      </div>

      {/* Day-by-Day Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Breakdown Diário</h3>
        <div className="space-y-3">
          {dayMetrics.map((day, index) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            
            return (
              <motion.div
                key={day.date.toISOString()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  isWeekend ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {format(day.date, "EEEE, dd 'de' MMM", { locale: pt })}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {day.eventCount} eventos • {day.totalParticipants} atletas
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Completion Rate */}
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">Conclusão</p>
                    <p className={`text-sm font-bold ${
                      day.completionRate >= 80 ? 'text-emerald-600' :
                      day.completionRate >= 50 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {day.completionRate.toFixed(0)}%
                    </p>
                  </div>

                  {/* Events Completed */}
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">Completos</p>
                    <p className="text-sm font-bold text-slate-900">
                      {day.completedCount}/{day.eventCount}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Top Event Types */}
      {topTypes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Tipos Mais Frequentes</h3>
          <div className="space-y-3">
            {topTypes.map((type, index) => {
              const percentage = (type.count / metrics.totalEvents) * 100;
              
              return (
                <div key={type.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Award className={`h-4 w-4 ${
                        index === 0 ? 'text-amber-500' :
                        index === 1 ? 'text-slate-400' :
                        'text-amber-600'
                      }`} />
                      <span className="text-sm font-semibold text-slate-900 capitalize">
                        {type.type}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {type.count} eventos ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      className={`h-full ${
                        index === 0 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                        index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                        'bg-gradient-to-r from-amber-600 to-amber-700'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Summary & Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-3">Resumo da Semana</h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">✅</span> {metrics.completedEvents} de {metrics.totalEvents} eventos foram concluídos
            ({metrics.completionRate.toFixed(0)}% taxa de conclusão)
          </p>
          <p>
            <span className="font-semibold">👥</span> {metrics.totalParticipants} participações de atletas registadas
            (média de {metrics.avgParticipants.toFixed(1)} por evento)
          </p>
          {metrics.cancelledEvents > 0 && (
            <p>
              <span className="font-semibold">⚠️</span> {metrics.cancelledEvents} eventos foram cancelados
              - considere analisar as causas
            </p>
          )}
          {metrics.changes.events > 0 && (
            <p>
              <span className="font-semibold">📈</span> Aumento de {metrics.changes.events} eventos comparado com a semana anterior
              - crescimento positivo!
            </p>
          )}
          {metrics.changes.completion > 5 && (
            <p>
              <span className="font-semibold">🎯</span> Taxa de conclusão melhorou {metrics.changes.completion.toFixed(1)}%
              - excelente performance!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
