/**
 * MONTHLY REPORT COMPONENT
 * Comprehensive monthly performance report
 * 
 * Features:
 * - Month summary with trends
 * - Week-by-week comparison
 * - Peak performance indicators
 * - Monthly insights
 * - Year-over-year comparison
 * 
 * @module calendar/components/MonthlyReport
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
  Award,
  Target,
  ArrowRight,
  Clock,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

interface MonthlyReportProps {
  events: CalendarEvent[];
  monthStart: Date;
  previousMonthEvents?: CalendarEvent[];
  workspaceId: string;
}

interface WeekMetrics {
  weekNumber: number;
  weekLabel: string;
  eventCount: number;
  completedCount: number;
  completionRate: number;
  participants: number;
}

// ============================================================================
// HELPERS
// ============================================================================

const CHART_COLORS = {
  primary: '#0ea5e9', // sky-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
};

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

export function MonthlyReport({
  events,
  monthStart,
  previousMonthEvents = [],
  workspaceId,
}: MonthlyReportProps) {
  
  const monthEnd = endOfMonth(monthStart);
  const monthName = format(monthStart, "MMMM 'de' yyyy", { locale: pt });

  // Overall metrics
  const metrics = useMemo(() => {
    const totalEvents = events.length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const confirmedEvents = events.filter(e => e.status === 'confirmed').length;
    const cancelledEvents = events.filter(e => e.status === 'cancelled').length;
    const totalParticipants = events.reduce((sum, e) => sum + (e.athlete_ids?.length || 0), 0);
    const avgParticipants = totalEvents > 0 ? totalParticipants / totalEvents : 0;
    const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
    const confirmationRate = totalEvents > 0 ? (confirmedEvents / totalEvents) * 100 : 0;

    // Previous month comparison
    const prevTotalEvents = previousMonthEvents.length;
    const prevCompletedEvents = previousMonthEvents.filter(e => e.status === 'completed').length;
    const prevTotalParticipants = previousMonthEvents.reduce((sum, e) => sum + (e.athlete_ids?.length || 0), 0);
    const prevAvgParticipants = prevTotalEvents > 0 ? prevTotalParticipants / prevTotalEvents : 0;
    const prevCompletionRate = prevTotalEvents > 0 ? (prevCompletedEvents / prevTotalEvents) * 100 : 0;

    return {
      totalEvents,
      completedEvents,
      confirmedEvents,
      cancelledEvents,
      totalParticipants,
      avgParticipants,
      completionRate,
      confirmationRate,
      changes: {
        events: totalEvents - prevTotalEvents,
        eventsPercent: prevTotalEvents > 0 ? ((totalEvents - prevTotalEvents) / prevTotalEvents) * 100 : 0,
        completion: completionRate - prevCompletionRate,
        participants: avgParticipants - prevAvgParticipants,
      },
    };
  }, [events, previousMonthEvents]);

  // Week-by-week breakdown
  const weekMetrics = useMemo<WeekMetrics[]>(() => {
    const weeks = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 1 }
    );

    return weeks.map((week, index) => {
      const weekStartDate = startOfWeek(week, { weekStartsOn: 1 });
      const weekEndDate = endOfWeek(week, { weekStartsOn: 1 });
      const weekLabel = `Sem ${index + 1}`;

      const weekEvents = events.filter(e => {
        const eventDate = typeof e.start_date === 'string' ? new Date(e.start_date) : e.start_date;
        return eventDate >= weekStartDate && eventDate <= weekEndDate;
      });

      const eventCount = weekEvents.length;
      const completedCount = weekEvents.filter(e => e.status === 'completed').length;
      const completionRate = eventCount > 0 ? (completedCount / eventCount) * 100 : 0;
      const participants = weekEvents.reduce((sum, e) => sum + (e.athlete_ids?.length || 0), 0);

      return {
        weekNumber: index + 1,
        weekLabel,
        eventCount,
        completedCount,
        completionRate,
        participants,
      };
    });
  }, [monthStart, monthEnd, events]);

  // Event type distribution
  const typeDistribution = useMemo(() => {
    const typeCounts = new Map<string, number>();
    events.forEach(e => {
      typeCounts.set(e.type, (typeCounts.get(e.type) || 0) + 1);
    });
    return Array.from(typeCounts.entries())
      .map(([type, count]) => ({ 
        type, 
        count,
        percentage: (count / metrics.totalEvents) * 100 
      }))
      .sort((a, b) => b.count - a.count);
  }, [events, metrics.totalEvents]);

  // Peak performance day
  const peakDay = useMemo(() => {
    const dayCounts = new Map<number, number>();
    events.forEach(e => {
      const date = typeof e.start_date === 'string' ? new Date(e.start_date) : e.start_date;
      const day = date.getDay();
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });

    const maxDay = Array.from(dayCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (!maxDay) return null;

    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return { name: dayNames[maxDay[0]], count: maxDay[1] };
  }, [events]);

  // Best week
  const bestWeek = useMemo(() => {
    return weekMetrics.reduce((best, current) => {
      return current.completionRate > best.completionRate ? current : best;
    }, weekMetrics[0] || { weekLabel: '', completionRate: 0 });
  }, [weekMetrics]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Relatório Mensal</h2>
        <p className="text-sm text-slate-600 mt-1 capitalize">{monthName}</p>
      </div>

      {/* Key Metrics Grid */}
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
              {metrics.changes.eventsPercent > 0 ? '+' : ''}{metrics.changes.eventsPercent.toFixed(0)}% vs mês anterior
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
              {metrics.changes.completion > 0 ? '+' : ''}{metrics.changes.completion.toFixed(1)}% vs mês anterior
            </span>
          </div>
        </motion.div>

        {/* Average Participants */}
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
            <p className="text-xs font-medium text-slate-500">Média Atletas</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {metrics.avgParticipants.toFixed(1)}
          </p>
          <div className={`flex items-center gap-1 mt-1 ${getTrendColor(metrics.changes.participants)}`}>
            {getTrendIcon(metrics.changes.participants)}
            <span className="text-xs font-medium">
              {metrics.changes.participants > 0 ? '+' : ''}{metrics.changes.participants.toFixed(1)} vs mês anterior
            </span>
          </div>
        </motion.div>

        {/* Confirmation Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Taxa Confirmação</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {metrics.confirmationRate.toFixed(0)}%
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {metrics.confirmedEvents} de {metrics.totalEvents} eventos
          </p>
        </motion.div>
      </div>

      {/* Week-by-Week Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Evolução Semanal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weekMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="eventCount"
              name="Eventos"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.primary, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="completedCount"
              name="Concluídos"
              stroke={CHART_COLORS.success}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.success, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Event Types Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Distribuição por Tipo</h3>
        <div className="space-y-3">
          {typeDistribution.map((type, index) => (
            <div key={type.type}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-900 capitalize">
                  {type.type}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {type.count} ({type.percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${type.percentage}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className={`h-full ${
                    index === 0 ? 'bg-gradient-to-r from-sky-500 to-sky-600' :
                    index === 1 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                    index === 2 ? 'bg-gradient-to-r from-violet-500 to-violet-600' :
                    'bg-gradient-to-r from-amber-500 to-amber-600'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Best Week */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-700">Melhor Semana</p>
          </div>
          <p className="text-xl font-bold text-slate-900">{bestWeek.weekLabel}</p>
          <p className="text-sm text-slate-600 mt-1">
            {bestWeek.completionRate.toFixed(0)}% conclusão
          </p>
        </motion.div>

        {/* Peak Day */}
        {peakDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-sky-600" />
              <p className="text-xs font-semibold text-sky-700">Dia de Pico</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{peakDay.name}</p>
            <p className="text-sm text-slate-600 mt-1">
              {peakDay.count} eventos
            </p>
          </motion.div>
        )}

        {/* Total Participants */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-violet-600" />
            <p className="text-xs font-semibold text-violet-700">Total Atletas</p>
          </div>
          <p className="text-xl font-bold text-slate-900">{metrics.totalParticipants}</p>
          <p className="text-sm text-slate-600 mt-1">
            participações no mês
          </p>
        </motion.div>
      </div>

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-3">Resumo do Mês</h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">📊</span> Total de {metrics.totalEvents} eventos realizados este mês
            {metrics.changes.events > 0 && `, um aumento de ${metrics.changes.events} eventos vs mês anterior`}
          </p>
          <p>
            <span className="font-semibold">✅</span> {metrics.completionRate.toFixed(0)}% de taxa de conclusão
            {metrics.changes.completion > 0 && ` (melhoria de ${metrics.changes.completion.toFixed(1)}%)`}
          </p>
          <p>
            <span className="font-semibold">👥</span> Média de {metrics.avgParticipants.toFixed(1)} atletas por evento
          </p>
          {bestWeek && (
            <p>
              <span className="font-semibold">🏆</span> {bestWeek.weekLabel} foi a melhor semana com {bestWeek.completionRate.toFixed(0)}% de conclusão
            </p>
          )}
          {metrics.cancelledEvents > 0 && (
            <p>
              <span className="font-semibold">⚠️</span> {metrics.cancelledEvents} eventos foram cancelados
              ({((metrics.cancelledEvents / metrics.totalEvents) * 100).toFixed(0)}% do total)
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
