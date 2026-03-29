import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { AthleteAnalyticsSummary, WidgetConfig } from '@/types/athlete-profile';

interface KPICardWidgetProps {
  config: WidgetConfig;
  analytics: AthleteAnalyticsSummary | null;
  athleteId: string;
  isConfiguring: boolean;
  onUpdate: (config: WidgetConfig) => void;
  onRemove: () => void;
}

export function KPICardWidget({
  config,
  analytics,
  isConfiguring,
  onRemove
}: KPICardWidgetProps) {
  // Get value based on metric
  const getValue = (): { value: number | string; trend?: number } => {
    if (!analytics) return { value: '—' };

    switch (config.metric) {
      case 'sessions_total':
        return {
          value: analytics.sessions.total,
          trend: analytics.sessions.adherence
        };

      case 'sessions_completed':
        return {
          value: analytics.sessions.completed,
          trend: analytics.sessions.adherence
        };

      case 'adherence':
        return {
          value: `${analytics.sessions.adherence}%`,
          trend: analytics.sessions.adherence >= 80 ? 5 : -5
        };

      case 'records_total':
        return {
          value: analytics.records.total,
          trend: analytics.records.recent > 0 ? analytics.records.recent : undefined
        };

      case 'load_7d':
        return {
          value: analytics.load.avg_7d,
          trend: analytics.load.trend === 'increasing' ? 8 : analytics.load.trend === 'decreasing' ? -5 : 0
        };

      case 'load_28d':
        return {
          value: analytics.load.avg_28d,
          trend: analytics.load.trend === 'increasing' ? 8 : analytics.load.trend === 'decreasing' ? -5 : 0
        };

      default:
        return { value: config.customValue || '—' };
    }
  };

  const { value, trend } = getValue();

  // Color mapping
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600 bg-emerald-100 text-emerald-600',
    sky: 'from-sky-500 to-sky-600 bg-sky-100 text-sky-600',
    amber: 'from-amber-500 to-amber-600 bg-amber-100 text-amber-600',
    violet: 'from-violet-500 to-violet-600 bg-violet-100 text-violet-600',
    red: 'from-red-500 to-red-600 bg-red-100 text-red-600',
    slate: 'from-slate-500 to-slate-600 bg-slate-100 text-slate-600'
  };

  const color = config.color || 'violet';
  const [gradientFrom, gradientTo, bgClass, textClass] = colorClasses[color as keyof typeof colorClasses]?.split(' ') || colorClasses.violet.split(' ');

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`h-full relative rounded-xl border-2 border-slate-200 bg-gradient-to-br ${bgClass.replace('bg-', 'from-')} to-white p-4 shadow-sm hover:shadow-md transition-all overflow-hidden`}
    >
      {/* Remove Button (when configuring) */}
      {isConfiguring && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Icon (top-left gradient blob) */}
      <div className={`absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full opacity-10`} />

      <div className="relative z-10">
        {/* Title */}
        <p className="text-xs font-medium text-slate-600 mb-2">
          {config.title || 'KPI'}
        </p>

        {/* Value */}
        <p className={`text-3xl font-bold ${textClass} mb-2`}>
          {value}
          {config.unit && (
            <span className="text-lg font-medium text-slate-500 ml-1">
              {config.unit}
            </span>
          )}
        </p>

        {/* Trend */}
        {trend !== undefined && trend !== 0 && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600">
                  +{Math.abs(trend).toFixed(1)}%
                </span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-red-600">
                  {trend.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">
                  Estável
                </span>
              </>
            )}
            <span className="text-xs text-slate-500 ml-1">vs anterior</span>
          </div>
        )}

        {/* Subtitle */}
        {config.subtitle && (
          <p className="text-xs text-slate-500 mt-1">
            {config.subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
