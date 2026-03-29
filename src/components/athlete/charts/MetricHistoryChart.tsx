/**
 * METRIC HISTORY CHART - DAY 4 ✅
 * 
 * Drawer que mostra a evolução temporal de uma métrica específica
 * com gráficos interativos e estatísticas.
 * 
 * Features:
 * - Gráfico de linha com evolução temporal
 * - Estatísticas (min, max, média, tendência)
 * - Lista de valores históricos
 * - Filtro de período (7, 14, 30, 90 dias)
 * - Design system consistente
 * 
 * @author PerformTrack Team
 * @since Day 4 - Metric History Charts
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, TrendingUp, TrendingDown, Minus, Calendar, 
  BarChart3, Activity, ArrowUp, ArrowDown, AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useAthleteHistory } from '@/hooks/use-athlete-history';

interface MetricHistoryChartProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  metricName: string;
  metricDisplayName: string;
  metricUnit: string;
  metricColor?: string;
  currentValue?: number;
}

export function MetricHistoryChart({
  isOpen,
  onClose,
  athleteId,
  metricName,
  metricDisplayName,
  metricUnit,
  metricColor = 'sky',
  currentValue = 0
}: MetricHistoryChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30 | 90>(30);
  const { history, isLoading, getMetricHistory } = useAthleteHistory(athleteId, selectedPeriod);

  // Get metric-specific history
  const metricHistory = getMetricHistory(metricName);

  // Calculate statistics
  const values = metricHistory.map(entry => entry.value);
  const stats = values.length > 0 ? {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((acc, val) => acc + val, 0) / values.length,
    latest: values[values.length - 1],
    first: values[0]
  } : null;

  // Calculate trend
  const trend = stats ? {
    value: stats.latest - stats.first,
    percentage: ((stats.latest - stats.first) / stats.first) * 100,
    direction: stats.latest > stats.first ? 'up' : stats.latest < stats.first ? 'down' : 'stable'
  } : null;

  // Format chart data
  const chartData = metricHistory.map(entry => ({
    date: new Date(entry.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    value: entry.value,
    fullDate: new Date(entry.timestamp).toLocaleString('pt-PT')
  }));

  // Color mapping
  const colorMap = {
    emerald: { primary: '#10b981', light: '#d1fae5', dark: '#059669', bg: 'bg-emerald-500', text: 'text-emerald-600' },
    sky: { primary: '#0ea5e9', light: '#e0f2fe', dark: '#0284c7', bg: 'bg-sky-500', text: 'text-sky-600' },
    amber: { primary: '#f59e0b', light: '#fef3c7', dark: '#d97706', bg: 'bg-amber-500', text: 'text-amber-600' },
    violet: { primary: '#8b5cf6', light: '#ede9fe', dark: '#7c3aed', bg: 'bg-violet-500', text: 'text-violet-600' },
    red: { primary: '#ef4444', light: '#fee2e2', dark: '#dc2626', bg: 'bg-red-500', text: 'text-red-600' }
  };

  const colors = colorMap[metricColor as keyof typeof colorMap] || colorMap.sky;

  // Period options
  const periods = [
    { value: 7, label: '7 dias' },
    { value: 14, label: '14 dias' },
    { value: 30, label: '30 dias' },
    { value: 90, label: '90 dias' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{metricDisplayName}</h2>
                <p className="text-sm text-slate-500 mt-0.5">Evolução temporal da métrica</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Period Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {periods.map((period) => (
                  <motion.button
                    key={period.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPeriod(period.value as any)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                      selectedPeriod === period.value
                        ? `bg-gradient-to-r from-${metricColor}-500 to-${metricColor}-600 text-white shadow-lg shadow-${metricColor}-500/30`
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    {period.label}
                  </motion.button>
                ))}
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-slate-300 animate-spin" />
                  <p className="text-slate-500">A carregar dados...</p>
                </div>
              ) : metricHistory.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500">Sem dados disponíveis para este período</p>
                </div>
              ) : (
                <>
                  {/* Statistics Grid */}
                  {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* Current Value */}
                      <div className={`rounded-xl border-2 border-${metricColor}-200 bg-gradient-to-br from-${metricColor}-50 to-white p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Atual</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {stats.latest.toFixed(1)}
                          <span className="text-sm text-slate-600 font-normal ml-1">{metricUnit}</span>
                        </p>
                      </div>

                      {/* Maximum */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <ArrowUp className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Máximo</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {stats.max.toFixed(1)}
                          <span className="text-sm text-slate-600 font-normal ml-1">{metricUnit}</span>
                        </p>
                      </div>

                      {/* Minimum */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
                            <ArrowDown className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Mínimo</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {stats.min.toFixed(1)}
                          <span className="text-sm text-slate-600 font-normal ml-1">{metricUnit}</span>
                        </p>
                      </div>

                      {/* Average */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Média</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {stats.avg.toFixed(1)}
                          <span className="text-sm text-slate-600 font-normal ml-1">{metricUnit}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Trend Card */}
                  {trend && (
                    <div className={`p-4 rounded-xl border-2 ${
                      trend.direction === 'up' ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-white' :
                      trend.direction === 'down' ? 'border-red-200 bg-gradient-to-r from-red-50 to-white' :
                      'border-amber-200 bg-gradient-to-r from-amber-50 to-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl ${
                          trend.direction === 'up' ? 'bg-emerald-500' :
                          trend.direction === 'down' ? 'bg-red-500' : 'bg-amber-500'
                        } flex items-center justify-center`}>
                          {trend.direction === 'up' && <TrendingUp className="h-6 w-6 text-white" />}
                          {trend.direction === 'down' && <TrendingDown className="h-6 w-6 text-white" />}
                          {trend.direction === 'stable' && <Minus className="h-6 w-6 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-600">Tendência no Período</p>
                          <p className={`text-xl font-bold ${
                            trend.direction === 'up' ? 'text-emerald-600' :
                            trend.direction === 'down' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)} {metricUnit}
                            <span className="text-sm font-medium ml-2">
                              ({trend.percentage > 0 ? '+' : ''}{trend.percentage.toFixed(1)}%)
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chart */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-slate-600" />
                      Evolução - Últimos {selectedPeriod} dias
                    </h3>
                    <div className="h-80 rounded-xl border border-slate-200 bg-white p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id={`gradient-${metricName}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }} 
                            stroke="#64748b"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }} 
                            stroke="#64748b"
                            domain={['auto', 'auto']}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              fontSize: '12px',
                              padding: '12px'
                            }}
                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                            formatter={(value: any) => [`${value} ${metricUnit}`, metricDisplayName]}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={colors.primary}
                            strokeWidth={3}
                            fill={`url(#gradient-${metricName})`}
                            dot={{ r: 4, fill: colors.primary, strokeWidth: 2, stroke: 'white' }}
                            activeDot={{ r: 6, fill: colors.dark }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* History List */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-slate-600" />
                      Histórico de Valores
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {chartData.slice().reverse().map((entry, index) => {
                        const isLatest = index === 0;
                        const prevValue = index < chartData.length - 1 ? chartData[chartData.length - 1 - index - 1].value : entry.value;
                        const change = entry.value - prevValue;
                        const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className={`p-3 rounded-xl ${
                              isLatest
                                ? `border-2 border-${metricColor}-300 bg-${metricColor}-50`
                                : 'border border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-sm font-semibold text-slate-900">
                                    {entry.value.toFixed(1)} {metricUnit}
                                  </span>
                                  {index > 0 && change !== 0 && (
                                    <span className={`ml-2 text-xs font-medium ${
                                      change > 0 ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                      {change > 0 ? '+' : ''}{change.toFixed(1)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                                    </span>
                                  )}
                                </div>
                                {isLatest && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full bg-${metricColor}-500 text-white font-medium`}>
                                    Atual
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" />
                                {entry.date}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
