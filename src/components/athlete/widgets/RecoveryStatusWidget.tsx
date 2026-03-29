import { motion } from 'motion/react';
import { X, Heart, Moon, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { WidgetConfig } from '@/types/athlete-profile';

interface RecoveryStatusWidgetProps {
  config: WidgetConfig;
  isConfiguring: boolean;
  onRemove: () => void;
}

export function RecoveryStatusWidget({ config, isConfiguring, onRemove }: RecoveryStatusWidgetProps) {
  // Mock recovery data
  const recoveryData = {
    overall: 78,
    status: 'good' as const,
    metrics: [
      { name: 'HRV', value: 82, unit: 'ms', status: 'good', icon: Heart, color: 'emerald' },
      { name: 'Sono', value: 7.5, unit: 'h', status: 'good', icon: Moon, color: 'sky' },
      { name: 'Energia', value: 65, unit: '%', status: 'caution', icon: Zap, color: 'amber' }
    ]
  };

  const statusConfig = {
    good: { color: 'emerald', label: 'Bom', bgClass: 'from-emerald-50 to-white' },
    caution: { color: 'amber', label: 'Atenção', bgClass: 'from-amber-50 to-white' },
    poor: { color: 'red', label: 'Fraco', bgClass: 'from-red-50 to-white' }
  };

  const overallStatus = statusConfig[recoveryData.status];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`h-full relative rounded-xl border-2 border-${overallStatus.color}-200 bg-gradient-to-br ${overallStatus.bgClass} p-4 shadow-sm hover:shadow-md transition-all`}
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
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900">
            {config.title || 'Estado de Recuperação'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atualizado há 2h
          </p>
        </div>

        <div className={`px-3 py-1 bg-${overallStatus.color}-100 text-${overallStatus.color}-700 rounded-lg text-xs font-semibold`}>
          {overallStatus.label}
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-4">
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-4xl font-bold text-${overallStatus.color}-600`}>
            {recoveryData.overall}
          </span>
          <span className="text-lg font-medium text-slate-500 mb-1">/ 100</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${recoveryData.overall}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full bg-gradient-to-r from-${overallStatus.color}-500 to-${overallStatus.color}-600`}
          />
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-3">
        {recoveryData.metrics.map((metric, index) => {
          const Icon = metric.icon;
          const metricStatus = metric.status === 'good' ? 'emerald' : metric.status === 'caution' ? 'amber' : 'red';

          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                <Icon className={`w-4 h-4 text-${metric.color}-600`} />
              </div>

              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600">
                  {metric.name}
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {metric.value}{metric.unit}
                </p>
              </div>

              <div className={`w-2 h-2 rounded-full bg-${metricStatus}-500`} />
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-slate-900 mb-0.5">
              Recomendação
            </p>
            <p className="text-xs text-slate-600">
              Atleta está bem recuperado. Pode treinar intensidade moderada-alta.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
