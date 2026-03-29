import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import type { Metric } from '@/types/metrics';

export interface MetricStats {
  current: number;
  baseline: number;
  min: number;
  max: number;
  avg: number;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercent: number;
  zoneDistribution: {
    green: number;
    yellow: number;
    red: number;
  };
}

interface MetricStatsPanelProps {
  stats: MetricStats;
  metric: Metric;
}

export function MetricStatsPanel({ stats, metric }: MetricStatsPanelProps) {
  const trendIcon =
    stats.trend === 'increasing' ? (
      <TrendingUp className="h-4 w-4" />
    ) : stats.trend === 'decreasing' ? (
      <TrendingDown className="h-4 w-4" />
    ) : (
      <Minus className="h-4 w-4" />
    );

  const trendColor =
    stats.trend === 'increasing'
      ? 'text-emerald-600'
      : stats.trend === 'decreasing'
      ? 'text-red-600'
      : 'text-slate-600';

  const trendBgColor =
    stats.trend === 'increasing'
      ? 'bg-emerald-50'
      : stats.trend === 'decreasing'
      ? 'bg-red-50'
      : 'bg-slate-50';

  // Calculate zone percentages
  const total = stats.zoneDistribution.green + stats.zoneDistribution.yellow + stats.zoneDistribution.red;
  const greenPercent = total > 0 ? Math.round((stats.zoneDistribution.green / total) * 100) : 0;
  const yellowPercent = total > 0 ? Math.round((stats.zoneDistribution.yellow / total) * 100) : 0;
  const redPercent = total > 0 ? Math.round((stats.zoneDistribution.red / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Current & Baseline */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50/90 to-white/90 p-3"
        >
          <p className="text-xs font-medium text-slate-500 mb-1">Current</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.current} <span className="text-sm font-normal text-slate-500">{metric.unit}</span>
          </p>
          <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${trendColor} ${trendBgColor}`}>
            {trendIcon}
            <span>{stats.trendPercent > 0 ? '+' : ''}{stats.trendPercent.toFixed(1)}%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50/90 to-white/90 p-3"
        >
          <p className="text-xs font-medium text-slate-500 mb-1">Baseline</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.baseline} <span className="text-sm font-normal text-slate-500">{metric.unit}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Expected range</p>
        </motion.div>
      </div>

      {/* Min/Avg/Max */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-center">
          <p className="text-xs font-medium text-slate-500 mb-0.5">Min</p>
          <p className="text-lg font-bold text-slate-900">{stats.min}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-center">
          <p className="text-xs font-medium text-slate-500 mb-0.5">Avg</p>
          <p className="text-lg font-bold text-slate-900">{stats.avg.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-center">
          <p className="text-xs font-medium text-slate-500 mb-0.5">Max</p>
          <p className="text-lg font-bold text-slate-900">{stats.max}</p>
        </div>
      </motion.div>

      {/* Zone Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-slate-200 bg-white p-3"
      >
        <p className="text-xs font-semibold text-slate-700 mb-2">Zone Distribution</p>

        {/* Visual bar */}
        <div className="h-6 rounded-full overflow-hidden flex mb-3">
          {greenPercent > 0 && (
            <div
              className="bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${greenPercent}%` }}
            >
              {greenPercent > 15 && `${greenPercent}%`}
            </div>
          )}
          {yellowPercent > 0 && (
            <div
              className="bg-amber-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${yellowPercent}%` }}
            >
              {yellowPercent > 15 && `${yellowPercent}%`}
            </div>
          )}
          {redPercent > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${redPercent}%` }}
            >
              {redPercent > 15 && `${redPercent}%`}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">Normal</span>
            </div>
            <span className="font-semibold text-slate-900">
              {stats.zoneDistribution.green} ({greenPercent}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-600">Atenção</span>
            </div>
            <span className="font-semibold text-slate-900">
              {stats.zoneDistribution.yellow} ({yellowPercent}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-slate-600">Alerta</span>
            </div>
            <span className="font-semibold text-slate-900">
              {stats.zoneDistribution.red} ({redPercent}%)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Entries Count */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-xs text-slate-500">
          Based on <span className="font-semibold text-slate-700">{stats.count}</span> entries
        </p>
      </motion.div>
    </div>
  );
}
