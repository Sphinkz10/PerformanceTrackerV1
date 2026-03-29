/**
 * AthleteCompareModal - FASE 5 COMPLETE (Compare Athletes Feature)
 * 
 * Permite comparar até 4 atletas lado a lado para qualquer métrica.
 * 
 * FEATURES:
 * - Side-by-side comparison charts
 * - Stats comparison table
 * - Multi-athlete selector
 * - Export comparison to CSV/PDF
 * - Period sync across all athletes
 * 
 * DESIGN:
 * - 2-4 columns grid (responsive)
 * - Color-coded athletes
 * - Comparison metrics highlighted
 * - Design system completo
 * 
 * @author PerformTrack Team
 * @since Fase 5 - Compare Athletes
 */

import React, { useState, useEffect } from 'react';
import { X, Users, Download, TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportComparisonToPDF, type ComparisonPDFData } from '@/lib/pdfExport';
import type { Metric, MetricUpdate } from '@/types/metrics';

// ============================================================================
// TYPES
// ============================================================================

export interface AthleteCompareModalProps {
  metric: Metric;
  currentAthleteId: string;
  currentAthleteName: string;
  period: '7d' | '30d' | '90d' | 'all';
  isOpen: boolean;
  onClose: () => void;
}

interface AthleteData {
  id: string;
  name: string;
  photo?: string;
  color: string;
  history: MetricUpdate[];
  stats: {
    current: number;
    avg: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
}

// ============================================================================
// ATHLETE COLORS (Design System)
// ============================================================================

const ATHLETE_COLORS = [
  { primary: '#0ea5e9', light: '#e0f2fe', name: 'Sky' },      // Sky-500
  { primary: '#10b981', light: '#d1fae5', name: 'Emerald' },  // Emerald-500
  { primary: '#f59e0b', light: '#fef3c7', name: 'Amber' },    // Amber-500
  { primary: '#8b5cf6', light: '#ede9fe', name: 'Violet' },   // Violet-500
];

// ============================================================================
// MOCK ATHLETES (for demo)
// ============================================================================

const MOCK_ATHLETES = [
  { id: 'athlete-1', name: 'João Silva', photo: 'https://i.pravatar.cc/150?img=12' },
  { id: 'athlete-2', name: 'Maria Santos', photo: 'https://i.pravatar.cc/150?img=45' },
  { id: 'athlete-3', name: 'Pedro Costa', photo: 'https://i.pravatar.cc/150?img=33' },
  { id: 'athlete-4', name: 'Ana Rodrigues', photo: 'https://i.pravatar.cc/150?img=48' },
  { id: 'athlete-5', name: 'Carlos Ferreira', photo: 'https://i.pravatar.cc/150?img=59' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function AthleteCompareModal({
  metric,
  currentAthleteId,
  currentAthleteName,
  period,
  isOpen,
  onClose,
}: AthleteCompareModalProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([currentAthleteId]);
  const [athletesData, setAthletesData] = useState<AthleteData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data when modal opens or selection changes
  useEffect(() => {
    if (isOpen && selectedAthletes.length > 0) {
      loadAthletesData();
    }
  }, [isOpen, selectedAthletes, period]);

  const loadAthletesData = async () => {
    setLoading(true);
    try {
      // MOCK: Generate data for each athlete
      // Later: Replace with real API call
      const data: AthleteData[] = selectedAthletes.map((athleteId, index) => {
        const athlete = MOCK_ATHLETES.find(a => a.id === athleteId) || 
                       { id: currentAthleteId, name: currentAthleteName };
        
        const history = generateMockHistory(metric, period, athleteId);
        const stats = calculateStats(history);
        
        return {
          id: athleteId,
          name: athlete.name,
          photo: athlete.photo,
          color: ATHLETE_COLORS[index % ATHLETE_COLORS.length].primary,
          history,
          stats,
        };
      });

      setAthletesData(data);
    } catch (error) {
      console.error('Failed to load athletes data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAthlete = (athleteId: string) => {
    setSelectedAthletes(prev => {
      if (prev.includes(athleteId)) {
        // Don't allow removing if it's the only one
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== athleteId);
      } else {
        // Max 4 athletes
        if (prev.length >= 4) return prev;
        return [...prev, athleteId];
      }
    });
  };

  const handleExportCSV = () => {
    if (!athletesData.length) return;

    // Get all unique dates
    const allDates = new Set<string>();
    athletesData.forEach(athlete => {
      athlete.history.forEach(entry => {
        allDates.add(format(new Date(entry.timestamp), 'dd/MM/yyyy'));
      });
    });

    const sortedDates = Array.from(allDates).sort();

    // Create CSV
    const headers = ['Date', ...athletesData.map(a => a.name)];
    const rows = sortedDates.map(date => {
      const row = [date];
      athletesData.forEach(athlete => {
        const entry = athlete.history.find(h => 
          format(new Date(h.timestamp), 'dd/MM/yyyy') === date
        );
        row.push(entry ? String(entry.value) : '');
      });
      return row;
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metric.name.toLowerCase().replace(/\s+/g, '-')}-comparison-${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!athletesData.length) return;

    const pdfData: ComparisonPDFData = {
      metric,
      athletes: athletesData.map(athlete => ({
        id: athlete.id,
        name: athlete.name,
        stats: athlete.stats,
        history: athlete.history,
      })),
      period: period === '7d' ? 'Últimos 7 dias' : 
              period === '30d' ? 'Últimos 30 dias' : 
              period === '90d' ? 'Últimos 90 dias' : 
              'Todo o período',
    };

    try {
      await exportComparisonToPDF(pdfData, {
        title: `Comparação: ${metric.name}`,
        subtitle: pdfData.period,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Erro ao exportar PDF. Por favor tente novamente.');
    }
  };

  // Prepare chart data (merge all athletes' data)
  const chartData = React.useMemo(() => {
    if (!athletesData.length) return [];

    // Get all unique timestamps
    const allTimestamps = new Set<string>();
    athletesData.forEach(athlete => {
      athlete.history.forEach(entry => {
        allTimestamps.add(entry.timestamp);
      });
    });

    const sortedTimestamps = Array.from(allTimestamps).sort();

    return sortedTimestamps.map(timestamp => {
      const dataPoint: any = {
        date: format(new Date(timestamp), 'dd/MM'),
        timestamp,
      };

      athletesData.forEach(athlete => {
        const entry = athlete.history.find(h => h.timestamp === timestamp);
        dataPoint[athlete.id] = entry?.value || null;
      });

      return dataPoint;
    });
  }, [athletesData]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="font-bold text-slate-900 mb-1">
                📊 Comparar Atletas
              </h2>
              <p className="text-sm text-slate-600">
                {metric.name} • Últimos {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : period === '90d' ? '90 dias' : 'tudo'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            <div className="space-y-6">
              
              {/* Athlete Selector */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-sky-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Selecionar Atletas (máx 4)
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {MOCK_ATHLETES.map((athlete) => {
                    const isSelected = selectedAthletes.includes(athlete.id);
                    const colorIndex = selectedAthletes.indexOf(athlete.id);
                    const color = colorIndex >= 0 ? ATHLETE_COLORS[colorIndex] : null;

                    return (
                      <motion.button
                        key={athlete.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleAthlete(athlete.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-current shadow-md'
                            : 'border-slate-200 hover:border-sky-300 bg-white'
                        }`}
                        style={isSelected ? { 
                          borderColor: color?.primary, 
                          backgroundColor: color?.light 
                        } : {}}
                      >
                        <img 
                          src={athlete.photo} 
                          alt={athlete.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-slate-900 truncate">
                          {athlete.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Chart Comparison */}
              {athletesData.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    📈 Comparação Timeline
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        stroke="#64748b"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        stroke="#64748b"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      {athletesData.map((athlete) => (
                        <Line
                          key={athlete.id}
                          type="monotone"
                          dataKey={athlete.id}
                          name={athlete.name}
                          stroke={athlete.color}
                          strokeWidth={3}
                          dot={{ r: 4, fill: athlete.color }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Stats Comparison Grid */}
              {athletesData.length > 0 && (
                <div className={`grid gap-4 ${
                  athletesData.length === 1 ? 'grid-cols-1' :
                  athletesData.length === 2 ? 'grid-cols-2' :
                  athletesData.length === 3 ? 'grid-cols-3' :
                  'grid-cols-2 lg:grid-cols-4'
                }`}>
                  {athletesData.map((athlete) => (
                    <motion.div
                      key={athlete.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border-2 p-4"
                      style={{ 
                        borderColor: athlete.color,
                        backgroundColor: ATHLETE_COLORS.find(c => c.primary === athlete.color)?.light
                      }}
                    >
                      {/* Athlete Header */}
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-current/20">
                        <img 
                          src={athlete.photo || 'https://i.pravatar.cc/150?img=1'} 
                          alt={athlete.name}
                          className="h-10 w-10 rounded-full object-cover border-2"
                          style={{ borderColor: athlete.color }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{athlete.name}</h4>
                          <p className="text-xs text-slate-600">{metric.unit || 'units'}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Atual</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {athlete.stats.current.toFixed(metric.type === 'number' ? 1 : 0)}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-slate-600 mb-1">Média</p>
                            <p className="font-semibold text-slate-900">
                              {athlete.stats.avg.toFixed(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 mb-1">Min</p>
                            <p className="font-semibold text-slate-900">
                              {athlete.stats.min.toFixed(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 mb-1">Max</p>
                            <p className="font-semibold text-slate-900">
                              {athlete.stats.max.toFixed(1)}
                            </p>
                          </div>
                        </div>

                        {/* Trend */}
                        <div className="flex items-center gap-2 pt-2 border-t border-current/20">
                          {athlete.stats.trend === 'up' && (
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                          )}
                          {athlete.stats.trend === 'down' && (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          {athlete.stats.trend === 'stable' && (
                            <Minus className="h-4 w-4 text-amber-600" />
                          )}
                          <span className={`text-xs font-medium ${
                            athlete.stats.trend === 'up' ? 'text-emerald-600' :
                            athlete.stats.trend === 'down' ? 'text-red-600' :
                            'text-amber-600'
                          }`}>
                            {athlete.stats.trend === 'stable' ? 'Estável' :
                             `${athlete.stats.trendPercent > 0 ? '+' : ''}${athlete.stats.trendPercent.toFixed(1)}%`}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {athletesData.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Selecione atletas para comparar</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 p-4 bg-slate-50">
            <p className="text-xs text-slate-600">
              {athletesData.length} atleta(s) selecionado(s)
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                disabled={athletesData.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                disabled={athletesData.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4" />
                PDF
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateMockHistory(metric: Metric, period: '7d' | '30d' | '90d' | 'all', athleteId: string): MetricUpdate[] {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const history: MetricUpdate[] = [];

  // Generate variation based on athlete ID (consistent per athlete)
  const athleteVariation = parseInt(athleteId.replace(/\D/g, '')) || 1;
  const baseValue = 50 + (athleteVariation * 5);

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Add some variation
    const variation = Math.sin(i / 3) * 10 + (Math.random() - 0.5) * 5;
    const value = baseValue + variation + (athleteVariation * 2);

    history.push({
      id: `update-${athleteId}-${i}`,
      metricId: metric.id,
      athleteId,
      value: parseFloat(value.toFixed(1)),
      timestamp: date.toISOString(),
      sourceType: 'manual',
      isValid: true,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  return history;
}

function calculateStats(history: MetricUpdate[]) {
  if (!history.length) {
    return {
      current: 0,
      avg: 0,
      min: 0,
      max: 0,
      trend: 'stable' as const,
      trendPercent: 0,
    };
  }

  const values = history.map(h => h.value as number).filter(v => typeof v === 'number');
  const current = values[values.length - 1];
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calculate trend (compare first half vs second half)
  const halfPoint = Math.floor(history.length / 2);
  const firstHalf = values.slice(0, halfPoint);
  const secondHalf = values.slice(halfPoint);

  const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

  const trendPercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  const trend = Math.abs(trendPercent) < 5 ? 'stable' : trendPercent > 0 ? 'up' : 'down';

  return {
    current,
    avg,
    min,
    max,
    trend,
    trendPercent,
  };
}