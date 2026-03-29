import { motion } from 'motion/react';
import { X, Target, TrendingUp } from 'lucide-react';
import { WidgetConfig, AthleteAnalyticsSummary } from '@/types/athlete-profile';

interface AdherenceGaugeWidgetProps {
  config: WidgetConfig;
  analytics: AthleteAnalyticsSummary | null;
  isConfiguring: boolean;
  onRemove: () => void;
}

export function AdherenceGaugeWidget({
  config,
  analytics,
  isConfiguring,
  onRemove
}: AdherenceGaugeWidgetProps) {
  const adherence = analytics?.sessions.adherence || 0;

  // Status based on adherence
  const getStatus = (value: number) => {
    if (value >= 90) return { color: 'emerald', label: 'Excelente', emoji: '🔥' };
    if (value >= 80) return { color: 'sky', label: 'Bom', emoji: '👍' };
    if (value >= 70) return { color: 'amber', label: 'Aceitável', emoji: '⚠️' };
    return { color: 'red', label: 'Baixo', emoji: '❌' };
  };

  const status = getStatus(adherence);

  // Gauge SVG
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (adherence / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`h-full relative rounded-xl border-2 border-${status.color}-200 bg-gradient-to-br from-${status.color}-50/50 to-white p-4 shadow-sm hover:shadow-md transition-all`}
    >
      {isConfiguring && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-2">
        <h3 className="font-bold text-slate-900">
          {config.title || 'Aderência ao Plano'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Últimos 28 dias
        </p>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <svg height={radius * 2} width={radius * 2}>
            {/* Background circle */}
            <circle
              stroke="#e2e8f0"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <motion.circle
              stroke={`var(--${status.color}-500, #8b5cf6)`}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{
                strokeDashoffset,
                strokeLinecap: 'round',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">
              {adherence.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 mt-0.5">aderência</span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className={`px-3 py-1.5 bg-${status.color}-100 text-${status.color}-700 rounded-lg text-sm font-semibold`}>
          {status.emoji} {status.label}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
          <p className="text-xs text-slate-600 mb-1">Completas</p>
          <p className="text-lg font-bold text-emerald-600">
            {analytics?.sessions.completed || 0}
          </p>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
          <p className="text-xs text-slate-600 mb-1">Total</p>
          <p className="text-lg font-bold text-slate-900">
            {analytics?.sessions.total || 0}
          </p>
        </div>
      </div>

      {/* Trend */}
      {adherence >= 80 && (
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-600 font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>Acima da meta (80%)</span>
        </div>
      )}
    </motion.div>
  );
}
