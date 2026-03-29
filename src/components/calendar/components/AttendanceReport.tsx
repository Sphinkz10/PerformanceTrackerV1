/**
 * ATTENDANCE REPORT COMPONENT
 * Comprehensive attendance tracking and reporting
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';

interface AthleteAttendance {
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  totalEvents: number;
  attended: number;
  noShow: number;
  declined: number;
  pending: number;
  attendanceRate: number; // Percentage
}

interface AttendanceReportProps {
  events: CalendarEvent[];
  dateRange: { start: Date; end: Date };
  onExport?: (format: 'csv' | 'pdf') => void;
}

export function AttendanceReport({
  events,
  dateRange,
  onExport,
}: AttendanceReportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rate' | 'attended'>('rate');

  // Calculate attendance data
  const attendanceData = useMemo(() => {
    const athleteMap = new Map<string, AthleteAttendance>();

    events.forEach((event) => {
      if (!event.participants) return;

      event.participants.forEach((participant) => {
        const existing = athleteMap.get(participant.athlete_id);

        if (existing) {
          existing.totalEvents++;
          if (participant.status === 'attended') existing.attended++;
          if (participant.status === 'no_show') existing.noShow++;
          if (participant.status === 'declined') existing.declined++;
          if (participant.status === 'pending' || participant.status === 'confirmed') existing.pending++;
        } else {
          athleteMap.set(participant.athlete_id, {
            athleteId: participant.athlete_id,
            athleteName: participant.athlete_name || 'Unknown',
            athleteAvatar: participant.athlete_avatar,
            totalEvents: 1,
            attended: participant.status === 'attended' ? 1 : 0,
            noShow: participant.status === 'no_show' ? 1 : 0,
            declined: participant.status === 'declined' ? 1 : 0,
            pending: (participant.status === 'pending' || participant.status === 'confirmed') ? 1 : 0,
            attendanceRate: 0,
          });
        }
      });
    });

    // Calculate attendance rates
    const dataArray = Array.from(athleteMap.values()).map((athlete) => ({
      ...athlete,
      attendanceRate: athlete.totalEvents > 0
        ? (athlete.attended / athlete.totalEvents) * 100
        : 0,
    }));

    return dataArray;
  }, [events]);

  // Filter and sort
  const filteredData = useMemo(() => {
    let filtered = attendanceData;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((athlete) =>
        athlete.athleteName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((athlete) => {
        if (filterStatus === 'high') return athlete.attendanceRate >= 80;
        if (filterStatus === 'medium') return athlete.attendanceRate >= 50 && athlete.attendanceRate < 80;
        if (filterStatus === 'low') return athlete.attendanceRate < 50;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.athleteName.localeCompare(b.athleteName);
      if (sortBy === 'rate') return b.attendanceRate - a.attendanceRate;
      if (sortBy === 'attended') return b.attended - a.attended;
      return 0;
    });

    return filtered;
  }, [attendanceData, searchQuery, filterStatus, sortBy]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalAthletes = attendanceData.length;
    const avgAttendanceRate =
      totalAthletes > 0
        ? attendanceData.reduce((sum, a) => sum + a.attendanceRate, 0) / totalAthletes
        : 0;
    const highPerformers = attendanceData.filter((a) => a.attendanceRate >= 80).length;
    const needsAttention = attendanceData.filter((a) => a.attendanceRate < 50).length;

    return {
      totalAthletes,
      avgAttendanceRate,
      highPerformers,
      needsAttention,
    };
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">📊 Relatório de Presença</h2>
          <p className="text-sm text-slate-600">
            {format(dateRange.start, "d 'de' MMMM", { locale: pt })} até{' '}
            {format(dateRange.end, "d 'de' MMMM 'de' yyyy", { locale: pt })}
          </p>
        </div>

        {onExport && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport('csv')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Download className="h-4 w-4" />
              CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              <Download className="h-4 w-4" />
              PDF
            </motion.button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Athletes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Atletas</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summaryStats.totalAthletes}</p>
        </motion.div>

        {/* Average Attendance */}
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
            <p className="text-xs font-medium text-slate-500">Taxa Média</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summaryStats.avgAttendanceRate.toFixed(1)}%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Objetivo: 80%
          </p>
        </motion.div>

        {/* High Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Alta Presença</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summaryStats.highPerformers}</p>
          <p className="text-xs text-violet-600 font-medium mt-1">≥80% de presença</p>
        </motion.div>

        {/* Needs Attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-red-50/30 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Atenção Necessária</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summaryStats.needsAttention}</p>
          <p className="text-xs text-red-600 font-medium mt-1"><50% de presença</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Procurar atleta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative flex-1 sm:flex-none sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos os atletas</option>
            <option value="high">Alta presença (≥80%)</option>
            <option value="medium">Média presença (50-79%)</option>
            <option value="low">Baixa presença (<50%)</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative flex-1 sm:flex-none sm:w-40">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
          >
            <option value="rate">Por taxa</option>
            <option value="attended">Por presenças</option>
            <option value="name">Por nome</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-700">
          <div className="col-span-4">Atleta</div>
          <div className="col-span-2 text-center">Taxa</div>
          <div className="col-span-1 text-center">Presentes</div>
          <div className="col-span-1 text-center">Faltas</div>
          <div className="col-span-1 text-center">Recusou</div>
          <div className="col-span-1 text-center">Pendentes</div>
          <div className="col-span-2 text-center">Total</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-200">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Nenhum atleta encontrado</p>
              <p className="text-xs">Ajuste os filtros de pesquisa</p>
            </div>
          ) : (
            filteredData.map((athlete, index) => (
              <motion.div
                key={athlete.athleteId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                {/* Athlete Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {athlete.athleteAvatar ? (
                      <img src={athlete.athleteAvatar} alt={athlete.athleteName} className="h-full w-full object-cover" />
                    ) : (
                      athlete.athleteName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{athlete.athleteName}</p>
                    <p className="text-xs text-slate-600">{athlete.totalEvents} eventos</p>
                  </div>
                </div>

                {/* Attendance Rate */}
                <div className="col-span-2 flex items-center justify-center">
                  <AttendanceRateBadge rate={athlete.attendanceRate} />
                </div>

                {/* Attended */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">{athlete.attended}</span>
                  </div>
                </div>

                {/* No Show */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span className="text-xs font-semibold text-red-700">{athlete.noShow}</span>
                  </div>
                </div>

                {/* Declined */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50">
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">{athlete.declined}</span>
                  </div>
                </div>

                {/* Pending */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50">
                    <Clock className="h-3 w-3 text-slate-600" />
                    <span className="text-xs font-semibold text-slate-700">{athlete.pending}</span>
                  </div>
                </div>

                {/* Total Events */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-900">{athlete.totalEvents}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Attendance Rate Badge Component
 */
interface AttendanceRateBadgeProps {
  rate: number;
}

function AttendanceRateBadge({ rate }: AttendanceRateBadgeProps) {
  const config = rate >= 80
    ? { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', icon: TrendingUp }
    : rate >= 50
    ? { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', icon: Clock }
    : { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: TrendingDown };

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.border} ${config.bg}`}>
      <Icon className={`h-4 w-4 ${config.text}`} />
      <span className={`text-sm font-bold ${config.text}`}>{rate.toFixed(1)}%</span>
    </div>
  );
}
