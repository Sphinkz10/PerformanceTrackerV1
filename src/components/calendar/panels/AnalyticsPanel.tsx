/**
 * CALENDAR ANALYTICS PANEL
 * Advanced analytics and visualizations
 * 
 * Features:
 * - Trend charts (Recharts)
 * - Event distribution
 * - Attendance heatmap
 * - Performance metrics
 * - Custom date ranges
 * - Export capabilities
 * - Comparative analytics
 * - Predictive insights
 * 
 * @module calendar/panels/AnalyticsPanel
 * @version 2.0.0
 * @updated 20 Janeiro 2026
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  BarChart3,
  PieChart,
  Download,
  Filter,
  FileText,
  Lightbulb,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { useCalendarMetrics } from '@/hooks/use-calendar-metrics';
import { DateRangePicker, DateRange } from '../components/DateRangePicker';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsPanelProps {
  events: CalendarEvent[];
  workspaceId: string;
  onExport?: (data: any) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CHART_COLORS = {
  primary: '#0ea5e9', // sky-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  purple: '#8b5cf6', // violet-500
  slate: '#64748b', // slate-500
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.purple,
  CHART_COLORS.danger,
  CHART_COLORS.slate,
];

// ============================================================================
// COMPONENT
// ============================================================================

export function AnalyticsPanel({ events, workspaceId, onExport }: AnalyticsPanelProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const [selectedChart, setSelectedChart] = useState<'trends' | 'distribution' | 'performance'>('trends');

  // Get metrics
  const metrics = useCalendarMetrics(events, undefined, {
    workspaceId,
    dateRange,
  });

  // Prepare chart data
  const trendData = useMemo(() => {
    return metrics.eventsPerDay.map(item => ({
      date: format(new Date(item.date), 'dd/MM', { locale: pt }),
      eventos: item.count,
    }));
  }, [metrics.eventsPerDay]);

  const typeDistributionData = useMemo(() => {
    return Object.entries(metrics.eventsByType).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [metrics.eventsByType]);

  const statusData = useMemo(() => {
    return [
      { name: 'Confirmados', value: metrics.confirmedEvents },
      { name: 'Pendentes', value: metrics.pendingEvents },
      { name: 'Completados', value: metrics.completedEvents },
      { name: 'Cancelados', value: metrics.cancelledEvents },
    ].filter(item => item.value > 0);
  }, [metrics]);

  const performanceData = useMemo(() => {
    return [
      { metric: 'Confirmação', rate: metrics.confirmationRate },
      { metric: 'Conclusão', rate: metrics.completionRate },
      { metric: 'Presença', rate: metrics.attendanceRate },
    ];
  }, [metrics]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Análises</h2>
          <p className="text-sm text-slate-600 mt-1">
            Estatísticas e tendências do calendário
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Date Range Picker */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="flex-1 sm:flex-none"
          />

          {/* Export Button */}
          {onExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport(metrics)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </motion.button>
          )}
        </div>
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
            {metrics.averageParticipantsPerEvent.toFixed(1)}
          </p>
        </motion.div>

        {/* Attendance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Taxa Presença</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {metrics.attendanceRate.toFixed(0)}%
          </p>
        </motion.div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'trends' as const, label: 'Tendências', icon: TrendingUp },
          { id: 'distribution' as const, label: 'Distribuição', icon: PieChart },
          { id: 'performance' as const, label: 'Performance', icon: BarChart3 },
        ].map((chart) => {
          const Icon = chart.icon;
          const isSelected = selectedChart === chart.id;

          return (
            <motion.button
              key={chart.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChart(chart.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {chart.label}
            </motion.button>
          );
        })}
      </div>

      {/* Charts */}
      <motion.div
        key={selectedChart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        {/* Trends Chart */}
        {selectedChart === 'trends' && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Eventos ao Longo do Tempo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
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
                  dataKey="eventos"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distribution Chart */}
        {selectedChart === 'distribution' && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Distribuição por Tipo e Status
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* By Type */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Por Tipo</p>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={typeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* By Status */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Por Status</p>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Performance Chart */}
        {selectedChart === 'performance' && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Taxas de Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Bar dataKey="rate" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* This Week */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <p className="text-sm font-semibold text-slate-700 mb-2">Esta Semana</p>
          <p className="text-3xl font-bold text-sky-600">{metrics.thisWeekEvents}</p>
          <p className="text-xs text-slate-600 mt-1">eventos agendados</p>
        </motion.div>

        {/* This Month */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <p className="text-sm font-semibold text-slate-700 mb-2">Este Mês</p>
          <p className="text-3xl font-bold text-emerald-600">{metrics.thisMonthEvents}</p>
          <p className="text-xs text-slate-600 mt-1">eventos agendados</p>
        </motion.div>
      </div>
    </div>
  );
}