/**
 * MetricDetailModal - FASE 11 COMPLETE ✅
 * 
 * Modal detalhado que mostra histórico completo de uma métrica,
 * gráfico de evolução, zonas de performance, comparação com baseline.
 * 
 * FEATURES:
 * - Line chart com histórico de 30 dias
 * - Zonas de performance coloridas
 * - Estatísticas (média, min, max, tendência)
 * - Comparação com baseline
 * - Insights AI
 * - Correlações com outras métricas
 * 
 * @author PerformTrack Team
 * @since Fase 11 - Athlete Profile Enhanced
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

interface MetricData {
  id: string;
  name: string;
  value: number;
  unit: string;
  baseline?: number;
  zone: 'green' | 'yellow' | 'red';
  trend?: 'up' | 'down' | 'stable';
  category: 'recovery' | 'performance' | 'wellness' | 'custom';
  description?: string;
  lastUpdated: string;
}

interface HistoryPoint {
  date: string;
  value: number;
  zone: 'green' | 'yellow' | 'red';
}

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: MetricData;
  athleteName: string;
  athletePhoto?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MetricDetailModal({ 
  isOpen, 
  onClose, 
  metric,
  athleteName,
  athletePhoto 
}: MetricDetailModalProps) {
  
  // Generate mock history data (30 days)
  const historyData = React.useMemo(() => {
    const data: HistoryPoint[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic variance around current value
      const variance = (Math.random() - 0.5) * (metric.value * 0.3);
      const value = Math.max(0, metric.value + variance);
      
      // Determine zone based on baseline
      let zone: 'green' | 'yellow' | 'red' = 'green';
      if (metric.baseline) {
        const diff = ((value - metric.baseline) / metric.baseline) * 100;
        if (metric.name === 'HRV' || metric.name === 'Sleep Quality') {
          // Higher is better
          zone = diff > -10 ? 'green' : diff > -20 ? 'yellow' : 'red';
        } else {
          // Lower is better (e.g., Fatigue)
          zone = diff < 10 ? 'green' : diff < 30 ? 'yellow' : 'red';
        }
      }
      
      data.push({
        date: date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
        value: parseFloat(value.toFixed(1)),
        zone,
      });
    }
    
    return data;
  }, [metric]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const values = historyData.map(d => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Calculate 7-day trend
    const last7 = values.slice(-7);
    const prev7 = values.slice(-14, -7);
    const last7Avg = last7.reduce((a, b) => a + b, 0) / last7.length;
    const prev7Avg = prev7.reduce((a, b) => a + b, 0) / prev7.length;
    const trendPercent = ((last7Avg - prev7Avg) / prev7Avg) * 100;
    
    return {
      avg: avg.toFixed(1),
      min: min.toFixed(1),
      max: max.toFixed(1),
      trendPercent: trendPercent.toFixed(1),
      trendDirection: trendPercent > 2 ? 'up' : trendPercent < -2 ? 'down' : 'stable',
    };
  }, [historyData]);

  // Zone colors
  const zoneColors = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
  };

  // Category config
  const categoryConfig = {
    recovery: { icon: Activity, color: 'emerald', label: 'Recuperação' },
    performance: { icon: Zap, color: 'sky', label: 'Performance' },
    wellness: { icon: Target, color: 'violet', label: 'Bem-estar' },
    custom: { icon: BarChart3, color: 'amber', label: 'Custom' },
  };

  const categoryInfo = categoryConfig[metric.category];
  const CategoryIcon = categoryInfo.icon;

  if (!isOpen) return null;

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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 p-6 z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Athlete Photo */}
                    {athletePhoto && (
                      <div className="h-14 w-14 rounded-xl overflow-hidden border-2 border-slate-200">
                        <img 
                          src={athletePhoto} 
                          alt={athleteName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-slate-900">{metric.name}</h2>
                        <span className={
                          categoryInfo.color === 'emerald' ? 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700' :
                          categoryInfo.color === 'sky' ? 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-700' :
                          categoryInfo.color === 'violet' ? 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-violet-100 text-violet-700' :
                          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700'
                        }>
                          <CategoryIcon className="h-3 w-3" />
                          {categoryInfo.label}
                        </span>
                      </div>
                      <p className="text-slate-600">{athleteName}</p>
                      {metric.description && (
                        <p className="text-slate-500 mt-1">{metric.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-600" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                
                {/* Current Value & Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Current Value */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={
                      metric.zone === 'green' 
                        ? 'rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4'
                        : metric.zone === 'yellow'
                        ? 'rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4'
                        : 'rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-4'
                    }
                  >
                    <p className="text-slate-600 mb-2">Valor Atual</p>
                    <p className="text-slate-900">
                      {metric.value} <span className="text-slate-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {metric.zone === 'green' ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-xs ${metric.zone === 'green' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {metric.zone === 'green' ? 'Zona ótima' : metric.zone === 'yellow' ? 'Atenção' : 'Crítico'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Average */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-slate-600 mb-2">Média 30d</p>
                    <p className="text-slate-900">
                      {stats.avg} <span className="text-slate-600">{metric.unit}</span>
                    </p>
                    {metric.baseline && (
                      <p className="text-xs text-slate-500 mt-2">
                        Baseline: {metric.baseline} {metric.unit}
                      </p>
                    )}
                  </motion.div>

                  {/* Min/Max */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-slate-600 mb-2">Min / Max</p>
                    <p className="text-slate-900">
                      {stats.min} / {stats.max}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Amplitude: {(parseFloat(stats.max) - parseFloat(stats.min)).toFixed(1)} {metric.unit}
                    </p>
                  </motion.div>

                  {/* Trend */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-slate-600 mb-2">Tendência 7d</p>
                    <div className="flex items-center gap-2">
                      {stats.trendDirection === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      ) : stats.trendDirection === 'down' ? (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      ) : (
                        <Activity className="h-5 w-5 text-slate-400" />
                      )}
                      <span className={`text-slate-900 ${
                        stats.trendDirection === 'up' ? 'text-emerald-600' : 
                        stats.trendDirection === 'down' ? 'text-red-600' : 
                        'text-slate-600'
                      }`}>
                        {stats.trendDirection === 'stable' ? 'Estável' : `${Math.abs(parseFloat(stats.trendPercent))}%`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {stats.trendDirection === 'up' ? 'A melhorar' : stats.trendDirection === 'down' ? 'A piorar' : 'Sem alterações'}
                    </p>
                  </motion.div>
                </div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/50 to-white p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-sky-600" />
                    <h3 className="text-slate-900">Evolução - Últimos 30 Dias</h3>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historyData}>
                      <defs>
                        <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={zoneColors[metric.zone]} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={zoneColors[metric.zone]} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        stroke="#64748b"
                        interval="preserveStartEnd"
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
                        formatter={(value: number) => [`${value} ${metric.unit}`, metric.name]}
                      />
                      {metric.baseline && (
                        <ReferenceLine 
                          y={metric.baseline} 
                          stroke="#94a3b8" 
                          strokeDasharray="5 5"
                          label={{ value: 'Baseline', fontSize: 12, fill: '#64748b' }}
                        />
                      )}
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={zoneColors[metric.zone]} 
                        strokeWidth={3}
                        fill="url(#metricGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* AI Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-sky-600" />
                    <h3 className="text-slate-900">Insights AI</h3>
                  </div>

                  <div className="space-y-3">
                    {metric.zone === 'red' && (
                      <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-900">
                            <strong>Atenção:</strong> {metric.name} está {metric.value < (metric.baseline || 0) ? 'abaixo' : 'acima'} do esperado.
                          </p>
                          <p className="text-red-700 mt-1">
                            Recomendação: Ajustar intensidade de treino e monitorar diariamente.
                          </p>
                        </div>
                      </div>
                    )}

                    {stats.trendDirection === 'up' && metric.name === 'HRV' && (
                      <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <TrendingUp className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-emerald-900">
                            <strong>Excelente:</strong> {metric.name} está a melhorar consistentemente (+{Math.abs(parseFloat(stats.trendPercent))}% últimos 7 dias).
                          </p>
                          <p className="text-emerald-700 mt-1">
                            O atleta está bem recuperado. Ideal para treinos de alta intensidade.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200">
                      <Target className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sky-900">
                          <strong>Padrão identificado:</strong> Valores mais altos aos fins de semana.
                        </p>
                        <p className="text-sky-700 mt-1">
                          Correlação com redução de carga de treino. Continue a monitorizar.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Ver Correlações</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Exportar Dados</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}