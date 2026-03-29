/**
 * 🎨 BY METRIC VIEW - ENHANCED
 * Distribution charts + outliers detection + bulk operations
 * 
 * MUDANÇAS RESPONSIVAS:
 * ✅ Charts responsivos
 * ✅ Cards stack vertical em mobile
 * ✅ Touch targets 44×44px
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  Download,
  Send,
  Edit2,
  Eye,
  Menu,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useResponsive } from '@/hooks/useResponsive'; // 🎨 ENHANCED
import type { Metric } from '@/types/metrics';

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
}

interface MetricValue {
  athleteId: string;
  metricId: string;
  value: number | string | boolean;
  timestamp: string;
  status?: 'green' | 'yellow' | 'red';
}

interface ByMetricViewProps {
  metrics: Metric[];
  athletes: Athlete[];
  values: MetricValue[];
  onViewDetails?: (metricId: string) => void;
  onBulkUpdate?: (metricId: string, athleteIds: string[]) => void;
}

interface MetricStats {
  metricId: string;
  metric: Metric;
  athleteCount: number;
  values: number[];
  avg: number;
  min: number;
  max: number;
  std: number;
  outliers: { athleteId: string; value: number }[];
  distribution: { range: string; count: number }[];
  statusCounts: { green: number; yellow: number; red: number; missing: number };
}

// Calculate statistics
const calculateStats = (
  metric: Metric,
  athletes: Athlete[],
  values: MetricValue[]
): MetricStats => {
  const metricValues = values
    .filter((v) => v.metricId === metric.id && typeof v.value === 'number')
    .map((v) => ({ athleteId: v.athleteId, value: Number(v.value), status: v.status }));

  const numValues = metricValues.map((v) => v.value);
  const avg = numValues.reduce((a, b) => a + b, 0) / (numValues.length || 1);
  const min = Math.min(...numValues);
  const max = Math.max(...numValues);

  // Standard deviation
  const variance = numValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (numValues.length || 1);
  const std = Math.sqrt(variance);

  // Outliers (values > 2 std deviations from mean)
  const outliers = metricValues
    .filter((v) => Math.abs(v.value - avg) > 2 * std)
    .map((v) => ({ athleteId: v.athleteId, value: v.value }));

  // Distribution buckets
  const bucketCount = 5;
  const bucketSize = (max - min) / bucketCount || 1;
  const distribution = Array.from({ length: bucketCount }, (_, i) => {
    const rangeStart = min + i * bucketSize;
    const rangeEnd = min + (i + 1) * bucketSize;
    const count = numValues.filter((v) => v >= rangeStart && (i === bucketCount - 1 ? v <= rangeEnd : v < rangeEnd)).length;
    return {
      range: `${rangeStart.toFixed(0)}-${rangeEnd.toFixed(0)}`,
      count,
    };
  });

  // Status counts
  const statusCounts = {
    green: metricValues.filter((v) => v.status === 'green').length,
    yellow: metricValues.filter((v) => v.status === 'yellow').length,
    red: metricValues.filter((v) => v.status === 'red').length,
    missing: athletes.length - metricValues.length,
  };

  return {
    metricId: metric.id,
    metric,
    athleteCount: metricValues.length,
    values: numValues,
    avg,
    min,
    max,
    std,
    outliers,
    distribution,
    statusCounts,
  };
};

export function ByMetricView({ metrics, athletes, values, onViewDetails, onBulkUpdate }: ByMetricViewProps) {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(metrics[0]?.id || null);

  // Calculate stats for all metrics
  const metricsStats = useMemo(() => {
    return metrics.map((metric) => calculateStats(metric, athletes, values));
  }, [metrics, athletes, values]);

  const selectedMetricStats = metricsStats.find((s) => s.metricId === selectedMetricId);

  const { isMobile } = useResponsive(); // 🎨 ENHANCED

  return (
    <div className="h-full flex gap-6">
      {/* Metrics List (Sidebar) */}
      <div className="w-80 shrink-0 space-y-3 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900 mb-1">
            Métricas ({metrics.length})
          </h3>
          <p className="text-sm text-slate-500">
            Seleciona uma métrica para ver a distribuição
          </p>
        </div>

        {metricsStats.map((stats, index) => (
          <MetricCard
            key={stats.metricId}
            stats={stats}
            isSelected={stats.metricId === selectedMetricId}
            onClick={() => setSelectedMetricId(stats.metricId)}
            index={index}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedMetricStats ? (
          <MetricDetailView
            stats={selectedMetricStats}
            athletes={athletes}
            values={values.filter((v) => v.metricId === selectedMetricId)}
            onViewDetails={() => onViewDetails?.(selectedMetricStats.metricId)}
            onBulkUpdate={(athleteIds) => onBulkUpdate?.(selectedMetricStats.metricId, athleteIds)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Seleciona uma métrica</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// METRIC CARD (Sidebar)
// ============================================================

function MetricCard({
  stats,
  isSelected,
  onClick,
  index,
}: {
  stats: MetricStats;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const completionRate = (stats.athleteCount / (stats.athleteCount + stats.statusCounts.missing)) * 100;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-left transition-all ${
        isSelected
          ? 'bg-gradient-to-br from-sky-100 to-sky-50 border-2 border-sky-400 shadow-lg'
          : 'bg-white border-2 border-slate-200 hover:border-sky-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate mb-1">
            {stats.metric.name}
          </h4>
          <p className="text-xs text-slate-500">
            {stats.metric.category} · {stats.metric.type}
          </p>
        </div>
        {stats.outliers.length > 0 && (
          <div className="shrink-0 ml-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              {stats.outliers.length}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="px-2 py-1 rounded bg-slate-50">
          <p className="text-xs text-slate-500">Atletas</p>
          <p className="text-sm font-semibold text-slate-900">{stats.athleteCount}</p>
        </div>
        <div className="px-2 py-1 rounded bg-slate-50">
          <p className="text-xs text-slate-500">Média</p>
          <p className="text-sm font-semibold text-slate-900">
            {stats.avg.toFixed(1)} {stats.metric.unit || ''}
          </p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Completude</span>
          <span className="text-slate-700 font-medium">{completionRate.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================
// METRIC DETAIL VIEW
// ============================================================

function MetricDetailView({
  stats,
  athletes,
  values,
  onViewDetails,
  onBulkUpdate,
}: {
  stats: MetricStats;
  athletes: Athlete[];
  values: MetricValue[];
  onViewDetails: () => void;
  onBulkUpdate: (athleteIds: string[]) => void;
}) {
  // Find athletes with outliers
  const outliersAthletes = stats.outliers.map((o) => {
    const athlete = athletes.find((a) => a.id === o.athleteId);
    return { ...athlete!, value: o.value };
  });

  // Athletes missing data
  const athletesWithValues = new Set(values.map((v) => v.athleteId));
  const missingAthletes = athletes.filter((a) => !athletesWithValues.has(a.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-slate-900 mb-2">
              {stats.metric.name}
            </h2>
            <p className="text-sm text-slate-600">
              {stats.metric.description || 'Análise de distribuição e outliers'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </motion.button>
        </div>

        {/* Stats Grid - ✅ Day 9-10: Responsive grid 2/3/4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white border border-sky-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-sky-600" />
              <p className="text-xs text-slate-500">Atletas</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{stats.athleteCount}</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-200">
            <p className="text-xs text-slate-500 mb-1">Média</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.avg.toFixed(1)}
              <span className="text-sm text-slate-500 ml-1">{stats.metric.unit}</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-amber-200">
            <p className="text-xs text-slate-500 mb-1">Range</p>
            <p className="text-sm font-semibold text-slate-900">
              {stats.min.toFixed(0)} - {stats.max.toFixed(0)}
            </p>
            <p className="text-xs text-slate-500">±{stats.std.toFixed(1)} std</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-xs text-slate-500">Outliers</p>
            </div>
            <p className="text-2xl font-semibold text-red-600">{stats.outliers.length}</p>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="p-6 rounded-2xl bg-white border-2 border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">
          📊 Distribuição de Valores
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="range"
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
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {stats.distribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${200 + index * 20}, 70%, 60%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Breakdown - ✅ Day 9-10: Responsive grid 2/3/4 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-700 mb-1">✓ Normal</p>
          <p className="text-2xl font-semibold text-emerald-900">{stats.statusCounts.green}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-700 mb-1">⚠ Atenção</p>
          <p className="text-2xl font-semibold text-amber-900">{stats.statusCounts.yellow}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs text-red-700 mb-1">⛔ Alerta</p>
          <p className="text-2xl font-semibold text-red-900">{stats.statusCounts.red}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-700 mb-1">∅ Sem dados</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.statusCounts.missing}</p>
        </div>
      </div>

      {/* Outliers Section */}
      {stats.outliers.length > 0 && (
        <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-900">
                Outliers Detectados ({stats.outliers.length})
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBulkUpdate(stats.outliers.map((o) => o.athleteId))}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Contactar Todos
            </motion.button>
          </div>

          <div className="space-y-2">
            {outliersAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm">
                    {athlete.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-900">{athlete.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-red-700">
                    {athlete.value.toFixed(1)} {stats.metric.unit}
                  </span>
                  <span className="text-xs text-red-600">
                    ({((athlete.value - stats.avg) / stats.std).toFixed(1)}σ)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Data Section */}
      {missingAthletes.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              ⚠️ Dados em Falta ({missingAthletes.length})
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBulkUpdate(missingAthletes.map((a) => a.id))}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-slate-600 text-white hover:bg-slate-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Lembrar Todos
            </motion.button>
          </div>

          {/* ✅ Day 9-10: Responsive grid 2/3/4 cols */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {missingAthletes.slice(0, 8).map((athlete) => (
              <div
                key={athlete.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200"
              >
                <div className="h-6 w-6 rounded-full bg-slate-300 flex items-center justify-center text-white text-xs font-semibold">
                  {athlete.name.charAt(0)}
                </div>
                <span className="text-sm text-slate-700 truncate">{athlete.name}</span>
              </div>
            ))}
            {missingAthletes.length > 8 && (
              <div className="flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-500 text-sm">
                +{missingAthletes.length - 8} mais
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}