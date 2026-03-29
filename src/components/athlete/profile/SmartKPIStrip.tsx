/**
 * SMART KPI STRIP - PERFORMTRACK ✨
 *
 * 6 KPIs universais sempre visíveis no topo do perfil
 * 100% DADOS REAIS da API /athletes/[id]/stats/weekly
 *
 * MANTÉM ESTILO ORIGINAL - SÓ MELHORA OS DADOS
 */

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAthleteStats } from '@/hooks/use-athlete-stats';

interface SmartKPIStripProps {
  athleteId: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'sky' | 'emerald' | 'amber' | 'violet' | 'red' | 'slate'; // ✅ added slate
  index: number;
}

function KPICard({
  title,
  value,
  subtitle,
  progress,
  trend,
  trendValue,
  color = 'sky',
  index
}: KPICardProps) {
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
    },
    // ✅ added slate (fallback/neutral)
    slate: {
      gradient: 'from-slate-50/90 to-white/90',
      icon: 'from-slate-600 to-slate-700',
      text: 'text-slate-600',
      progress: 'bg-slate-500'
    }
  } as const;

  // ✅ extra safety: never crash even if color is unexpected
  const classes = colorClasses[color] ?? colorClasses.sky;

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

      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}

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

export function SmartKPIStrip({ athleteId }: SmartKPIStripProps) {
  const { stats, isLoading, error } = useAthleteStats(athleteId);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white/90 p-4 shadow-sm animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  // Error state (show fallback)
  if (error || !stats) {
    console.error('SmartKPIStrip error:', error);
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white/90 p-4 shadow-sm opacity-50"
          >
            <p className="text-xs font-medium text-slate-500">Sem dados</p>
          </div>
        ))}
      </div>
    );
  }

  // ✅ DADOS REAIS da API (com defaults seguros)
  const readiness_score = Number.isFinite(stats.readiness_score) ? stats.readiness_score : 0;
  const weekly_load = stats.weekly_load ?? { actual: 0, planned: 0, percentage: 0, trend: 'stable' as const };
  const sessions = stats.sessions ?? { completed: 0, scheduled: 0, compliance_rate: 0 };
  const avg_rpe_num = Number.isFinite(stats.avg_rpe) ? stats.avg_rpe : 0;
  const avg_rpe = avg_rpe_num.toFixed(1);

  const last_session = stats.last_session ?? null;
  const next_session = stats.next_session ?? null;
  const active_alerts = Number.isFinite(stats.active_alerts) ? stats.active_alerts : 0;

  // Determinar cor da carga baseado no trend
  const loadColor =
    weekly_load.trend === 'up' && weekly_load.percentage > 100 ? 'amber' :
      weekly_load.trend === 'down' ? 'red' :
        'emerald';

  // Determinar cor do readiness
  const readinessColor = readiness_score >= 80 ? 'emerald' : readiness_score >= 60 ? 'amber' : 'red';

  // Determinar cor da compliance
  const complianceColor = sessions.compliance_rate >= 90 ? 'emerald' : sessions.compliance_rate >= 70 ? 'amber' : 'red';

  // Determinar cor dos alertas (por agora não está a ser usado nos 6 cards, mas deixo pronto)
  const alertsColor = active_alerts === 0 ? 'emerald' : active_alerts <= 2 ? 'amber' : 'red';
  void alertsColor;

  const kpis: Omit<KPICardProps, 'index'>[] = [
    {
      title: 'Readiness',
      value: `${Math.round(readiness_score)}%`,
      progress: readiness_score,
      trend: 'stable',
      color: readinessColor
    },
    {
      title: 'Carga Semanal',
      value: `${weekly_load.actual} AU`,
      subtitle: `Planeado: ${weekly_load.planned} AU`,
      progress: Math.min(100, weekly_load.percentage),
      trend: weekly_load.trend,
      trendValue: `${weekly_load.percentage}%`,
      color: loadColor
    },
    {
      title: 'Compliance',
      value: `${sessions.compliance_rate}%`,
      subtitle: `${sessions.completed}/${sessions.scheduled} sessões`,
      progress: sessions.compliance_rate,
      trend: sessions.compliance_rate >= 90 ? 'up' : 'down',
      color: complianceColor
    },
    {
      title: 'RPE Médio',
      value: avg_rpe,
      subtitle: 'Últimos 7 dias',
      trend: 'stable',
      color: avg_rpe_num >= 7 ? 'amber' : 'emerald'
    },
    {
      title: 'Última Sessão',
      value: last_session?.relativeTime || 'Nenhuma',
      subtitle: last_session ? `${last_session.time} - ${last_session.title}` : 'Sem dados',
      color: 'violet'
    },
    {
      title: next_session ? 'Próxima Sessão' : 'Sem Sessões',
      value: next_session?.relativeTime || '-',
      subtitle: next_session ? `${next_session.time} - ${next_session.title}` : 'Nenhuma agendada',
      color: next_session ? 'emerald' : 'slate' // ✅ no more "as any"
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
