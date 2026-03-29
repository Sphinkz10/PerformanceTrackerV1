import React, { useState, useEffect } from 'react';
import { X, Download, Calendar, Filter, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { MetricChartContainer } from './MetricChartContainer';
import { MetricStatsPanel, type MetricStats } from './MetricStatsPanel';
import { AthleteCompareModal } from './AthleteCompareModal';
import { exportMetricHistoryToPDF, type MetricPDFData } from '@/lib/pdfExport';
import type { Metric, MetricUpdate } from '@/types/metrics';
import { useMetricUpdates } from '@/hooks/useMetricUpdates';

interface MetricHistoryDrawerProps {
  metric: Metric | null;
  athleteId: string | null;
  athleteName?: string;
  isOpen: boolean;
  onClose: () => void;
}

type Period = '7d' | '30d' | '90d' | 'all';

export function MetricHistoryDrawer({
  metric,
  athleteId,
  athleteName = 'Athlete',
  isOpen,
  onClose,
}: MetricHistoryDrawerProps) {
  const [period, setPeriod] = useState<Period>('30d');
  // history, stats, loading, showCompareModal declared below with hook

  // ✅ Real Data Hook
  const { updates: rawUpdates, loading: updatesLoading, fetchUpdates } = useMetricUpdates({
    metricId: metric?.id,
    athleteId: athleteId || undefined,
    autoFetch: false // fetch manually when drawer opens
  });

  const [history, setHistory] = useState<MetricUpdate[]>([]);
  const [stats, setStats] = useState<MetricStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Fetch history data when drawer opens or period changes
  useEffect(() => {
    if (isOpen && metric && athleteId) {
      if (rawUpdates.length === 0) {
        fetchUpdates();
      }
    }
  }, [isOpen, metric, athleteId, fetchUpdates, rawUpdates.length]);

  // Adapt and Filter Data when rawUpdates or period changes
  useEffect(() => {
    if (!metric) return;

    // 1. Adapt raw updates to component format
    const adaptedHistory: MetricUpdate[] = rawUpdates.map(u => {
      // Determine value
      let val: number | string | boolean = 0;
      if (metric.type === 'numeric' || metric.type === 'scale') val = u.value_numeric ?? 0;
      else if (metric.type === 'boolean') val = u.value_boolean ?? false;
      else val = u.value_text ?? '';

      const numVal = typeof val === 'number' ? val : 0; // For zone calc

      // Determine zone
      const baseline = metric.baseline || 50;
      const lowerThreshold = metric.lowerThreshold || baseline * 0.85;
      const upperThreshold = metric.upperThreshold || baseline * 1.15;
      let zone: 'green' | 'yellow' | 'red' = 'green';

      if (metric.type === 'numeric' || metric.type === 'scale') {
        if (numVal < lowerThreshold * 0.9 || numVal > upperThreshold * 1.1) zone = 'red';
        else if (numVal < lowerThreshold || numVal > upperThreshold) zone = 'yellow';
      }

      return {
        id: u.id,
        metricId: u.metric_id,
        athleteId: u.athlete_id,
        value: val,
        timestamp: u.timestamp,
        zone, // Calculated zone
        sourceType: u.source_type || 'manual',
        notes: u.notes,
      } as any; // Cast to avoid strict type mismatch if MetricUpdate defs vary
    });

    // 2. Filter by period
    const now = new Date();
    const filtered = adaptedHistory.filter(h => {
      const date = new Date(h.timestamp);
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      if (period === '7d') return diffDays <= 7;
      if (period === '30d') return diffDays <= 30;
      if (period === '90d') return diffDays <= 90;
      return true; // 'all'
    });

    // Sort by timestamp desc
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setHistory(filtered);

    // 3. Calculate stats
    const calculatedStats = calculateStats(filtered, metric);
    setStats(calculatedStats);

    setLoading(updatesLoading);

  }, [rawUpdates, period, metric, updatesLoading]);

  const handleExportCSV = () => {
    if (!history.length || !metric) return;

    // Generate CSV
    const headers = ['Date', 'Value', 'Zone', 'Baseline', 'Source', 'Notes'];
    const rows = history.map((entry) => [
      format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm'),
      entry.value,
      entry.zone || 'N/A',
      metric.baseline || 'N/A',
      entry.sourceType,
      entry.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metric.name.toLowerCase().replace(/\s+/g, '-')}-${athleteName.toLowerCase().replace(/\s+/g, '-')}-${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!history.length || !metric || !stats) return;

    const pdfData: MetricPDFData = {
      metric,
      athleteName,
      period: period === '7d' ? 'Últimos 7 dias' :
        period === '30d' ? 'Últimos 30 dias' :
          period === '90d' ? 'Últimos 90 dias' :
            'Todo o período',
      history,
      stats: {
        current: stats.current,
        avg: stats.avg,
        min: stats.min,
        max: stats.max,
        trend: stats.trend === 'increasing' ? 'up' :
          stats.trend === 'decreasing' ? 'down' : 'stable',
        trendPercent: stats.trendPercent,
      },
    };

    try {
      await exportMetricHistoryToPDF(pdfData, {
        title: `${metric.name} - ${athleteName}`,
        subtitle: pdfData.period,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Erro ao exportar PDF. Por favor tente novamente.');
    }
  };

  if (!metric) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">
                  {metric.name} History
                </h3>
                <p className="text-sm text-slate-600 truncate">{athleteName}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="ml-2 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Period Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
                      <motion.button
                        key={p}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${period === p
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                          }`}
                      >
                        {p === '7d'
                          ? 'Last 7 days'
                          : p === '30d'
                            ? 'Last 30 days'
                            : p === '90d'
                              ? 'Last 90 days'
                              : 'All time'}
                      </motion.button>
                    ))}
                  </div>

                  {/* Chart */}
                  {history.length > 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <MetricChartContainer
                        data={history}
                        metric={metric}
                        baseline={metric.baseline}
                        showZones={true}
                        height={250}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">No data for this period</p>
                    </div>
                  )}

                  {/* Stats */}
                  {stats && history.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/50 to-white p-4 shadow-sm">
                      <MetricStatsPanel stats={stats} metric={metric} />
                    </div>
                  )}

                  {/* History Table */}
                  {history.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <div className="p-3 border-b border-slate-200 bg-slate-50">
                        <h4 className="text-sm font-semibold text-slate-700">
                          History ({history.length} entries)
                        </h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                                Date
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                                Value
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">
                                Zone
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                                Source
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {history.map((entry, index) => {
                              const zoneColor =
                                entry.zone === 'green'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : entry.zone === 'yellow'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700';

                              return (
                                <tr key={entry.id || index} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 text-slate-900">
                                    <div className="text-xs">
                                      {format(new Date(entry.timestamp), 'dd/MM/yyyy')}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {format(new Date(entry.timestamp), 'HH:mm')}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-right font-semibold text-slate-900">
                                    {entry.value} {metric.unit}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${zoneColor}`}
                                    >
                                      {entry.zone === 'green'
                                        ? '🟢'
                                        : entry.zone === 'yellow'
                                          ? '🟡'
                                          : '🔴'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-xs text-slate-600">
                                    {entry.sourceType === 'manual_entry'
                                      ? 'Manual'
                                      : entry.sourceType === 'form_submission'
                                        ? 'Form'
                                        : entry.sourceType === 'live_session'
                                          ? 'Live'
                                          : 'Auto'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                disabled={!history.length}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportPDF}
                disabled={!history.length}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCompareModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
              >
                <Users className="h-4 w-4" />
                <span>Compare</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Compare Modal */}
          {showCompareModal && metric && athleteId && (
            <AthleteCompareModal
              metric={metric}
              currentAthleteId={athleteId}
              currentAthleteName={athleteName}
              period={period}
              isOpen={showCompareModal}
              onClose={() => setShowCompareModal(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

// Mock history generator removed

// Calculate stats from history
function calculateStats(history: MetricUpdate[], metric: Metric): MetricStats {
  if (history.length === 0) {
    return {
      current: 0,
      baseline: metric.baseline || 0,
      min: 0,
      max: 0,
      avg: 0,
      count: 0,
      trend: 'stable',
      trendPercent: 0,
      zoneDistribution: { green: 0, yellow: 0, red: 0 },
    };
  }

  const values = history.map((h) => h.value);
  const current = values[0]; // Most recent
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

  // Calculate trend (compare first half vs second half)
  const halfPoint = Math.floor(history.length / 2);
  const firstHalf = values.slice(0, halfPoint);
  const secondHalf = values.slice(halfPoint);
  const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
  const trendPercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  const trend =
    Math.abs(trendPercent) < 5 ? 'stable' : trendPercent > 0 ? 'increasing' : 'decreasing';

  // Zone distribution
  const zoneDistribution = {
    green: history.filter((h) => h.zone === 'green').length,
    yellow: history.filter((h) => h.zone === 'yellow').length,
    red: history.filter((h) => h.zone === 'red').length,
  };

  return {
    current,
    baseline: metric.baseline || avg,
    min,
    max,
    avg,
    count: history.length,
    trend,
    trendPercent,
    zoneDistribution,
  };
}