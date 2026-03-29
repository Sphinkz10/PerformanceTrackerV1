/**
 * ATHLETE KPIs
 * 6 KPIs universais sempre visíveis no topo
 */

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Target, Zap, Calendar } from 'lucide-react';
import type { AthleteMetrics } from '@/lib/mockData';

interface AthleteKPIsProps {
  metrics: AthleteMetrics;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'sky' | 'emerald' | 'amber' | 'violet' | 'red';
  index: number;
}

function KPICard({ title, value, subtitle, progress, trend, trendValue, color = 'sky', index }: KPICardProps) {
  const colorClasses = {
    sky: {
      gradient: 'from-sky-50/90 to-white/90',
      icon: 'from-sky-500 to-sky-600',
      text: 'text-sky-600',
      progress: 'bg-sky-500'
    },
    emerald: {
      gradient: 'from-emerald-50/90 to-white/90',
      icon: 'from-emerald-500 to-emerald-600',
      text: 'text-emerald-600',
      progress: 'bg-emerald-500'
    },
    amber: {
      gradient: 'from-amber-50/90 to-white/90',
      icon: 'from-amber-500 to-amber-600',
      text: 'text-amber-600',
      progress: 'bg-amber-500'
    },
    violet: {
      gradient: 'from-violet-50/90 to-white/90',
      icon: 'from-violet-500 to-violet-600',
      text: 'text-violet-600',
      progress: 'bg-violet-500'
    },
    red: {
      gradient: 'from-red-50/30 to-white/90',
      icon: 'from-red-500 to-red-600',
      text: 'text-red-600',
      progress: 'bg-red-500'
    }
  };

  const classes = colorClasses[color];

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border border-slate-200/80 bg-gradient-to-br ${classes.gradient} p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        {trend && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            {trendValue && <span className="text-xs font-bold">{trendValue}</span>}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900">{value}</span>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
              className={`h-full ${classes.progress} rounded-full`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function AthleteKPIs({ metrics }: AthleteKPIsProps) {
  // ✅ FASE 2: Support both old format (AthleteMetrics) and new format (array of metrics)
  const isNewFormat = Array.isArray(metrics);
  
  // Extract values from new format or use defaults
  const readinessMetric = isNewFormat ? metrics.find((m: any) => m.metric_id === 'readiness') : null;
  const fatigueMetric = isNewFormat ? metrics.find((m: any) => m.metric_id === 'fatigue') : null;
  
  const readinessScore = readinessMetric?.current_value || (isNewFormat ? 75 : metrics.readinessScore);
  const weeklyLoadActual = isNewFormat ? 85 : metrics.weeklyLoadActual;
  const weeklyLoadPlanned = isNewFormat ? 90 : metrics.weeklyLoadPlanned;
  const sessionsThisWeek = isNewFormat ? 4 : metrics.sessionsThisWeek;
  const avgRpe7d = isNewFormat ? 6.5 : metrics.avgRpe7d;
  
  const loadTrend = weeklyLoadActual > weeklyLoadPlanned ? 'up' : 
                    weeklyLoadActual < weeklyLoadPlanned ? 'down' : 'stable';
  
  const loadPercentage = ((weeklyLoadActual / weeklyLoadPlanned) * 100).toFixed(0);

  const kpis: Omit<KPICardProps, 'index'>[] = [
    {
      title: 'Carga Semanal',
      value: `${weeklyLoadActual}%`,
      subtitle: `Planejado: ${weeklyLoadPlanned}%`,
      progress: weeklyLoadActual,
      trend: loadTrend,
      trendValue: `${loadPercentage}%`,
      color: loadTrend === 'up' ? 'amber' : loadTrend === 'down' ? 'red' : 'emerald'
    },
    {
      title: 'Readiness Hoje',
      value: `${readinessScore}%`,
      progress: readinessScore,
      trend: readinessMetric?.trend || 'stable',
      color: readinessScore >= 80 ? 'emerald' : readinessScore >= 60 ? 'amber' : 'red'
    },
    {
      title: 'Sessões/Semana',
      value: `${sessionsThisWeek}/6`,
      subtitle: `${sessionsThisWeek} completadas`,
      progress: (sessionsThisWeek / 6) * 100,
      trend: 'up',
      trendValue: '+2',
      color: 'sky'
    },
    {
      title: 'RPE Médio',
      value: avgRpe7d.toFixed(1),
      subtitle: 'Últimos 7 dias',
      trend: 'stable',
      color: avgRpe7d >= 7 ? 'amber' : 'emerald'
    },
    {
      title: 'Última Sessão',
      value: 'Ontem',
      subtitle: '16:00 - Treino Força',
      color: 'violet'
    },
    {
      title: 'Próxima Sessão',
      value: 'Hoje',
      subtitle: '18:00 - Metcon',
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={kpi.title} {...kpi} index={index} />
      ))}
    </div>
  );
}