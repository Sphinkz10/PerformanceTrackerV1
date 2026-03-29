/**
 * EVENT STATISTICS DASHBOARD
 * Comprehensive analytics and insights for calendar events
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Activity,
  BarChart3
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface EventStatisticsProps {
  events: CalendarEvent[];
  dateRange: { start: Date; end: Date };
}

export function EventStatistics({ events, dateRange }: EventStatisticsProps) {
  // Calculate core statistics
  const stats = useMemo(() => {
    const total = events.length;
    const completed = events.filter((e) => e.status === 'completed').length;
    const scheduled = events.filter((e) => e.status === 'scheduled').length;
    const cancelled = events.filter((e) => e.status === 'cancelled').length;
    const active = events.filter((e) => e.status === 'active').length;

    const byType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalParticipants = events.reduce((sum, event) => {
      return sum + (event.participants?.length || 0);
    }, 0);

    const avgParticipants = total > 0 ? totalParticipants / total : 0;

    return {
      total,
      completed,
      scheduled,
      cancelled,
      active,
      byType,
      totalParticipants,
      avgParticipants,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [events]);

  // Daily activity chart data
  const dailyActivityData = useMemo(() => {
    const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });

    return days.map((day) => {
      const dayEvents = events.filter((event) => 
        event.start_date && isSameDay(new Date(event.start_date), day)
      );

      return {
        date: format(day, 'dd/MM'),
        events: dayEvents.length,
        participants: dayEvents.reduce((sum, e) => sum + (e.participants?.length || 0), 0),
      };
    });
  }, [events, dateRange]);

  // Event type distribution
  const eventTypeData = useMemo(() => {
    const typeLabels: Record<string, string> = {
      workout: 'Treino',
      game: 'Jogo',
      competition: 'Competição',
      meeting: 'Reunião',
      testing: 'Testes',
      rest: 'Descanso',
      other: 'Outro',
    };

    return Object.entries(stats.byType).map(([type, count]) => ({
      type: typeLabels[type] || type,
      count,
      percentage: ((count / stats.total) * 100).toFixed(1),
    }));
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">📈 Estatísticas de Eventos</h2>
        <p className="text-sm text-slate-600">
          Análise completa do período selecionado
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Eventos</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
        </motion.div>

        {/* Completed */}
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
            <p className="text-xs font-medium text-slate-500">Completados</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.completed}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {stats.completionRate.toFixed(1)}% concluídos
          </p>
        </motion.div>

        {/* Scheduled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Agendados</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.scheduled}</p>
        </motion.div>

        {/* Total Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Participantes</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.totalParticipants}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">
            {stats.avgParticipants.toFixed(1)} por evento
          </p>
        </motion.div>

        {/* Cancelled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-red-50/30 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Cancelados</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.cancelled}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Atividade Diária</h3>
              <p className="text-xs text-slate-600">Eventos por dia</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
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
                dataKey="events"
                name="Eventos"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Type Distribution */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Distribuição por Tipo</h3>
              <p className="text-xs text-slate-600">Categorias de eventos</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={eventTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="#64748b" />
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
              <Bar
                dataKey="count"
                name="Eventos"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-slate-600" />
          Detalhamento por Tipo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {eventTypeData.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">{item.type}</span>
                <span className="text-xs font-bold text-sky-600 px-2 py-1 rounded-full bg-sky-100">
                  {item.percentage}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{item.count}</p>
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
