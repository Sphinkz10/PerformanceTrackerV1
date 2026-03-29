/**
 * BIOLOGICAL STATE CARD - REAL DATA ONLY ✅
 * Estado biológico atual do atleta com system checks
 */

import { motion } from 'motion/react';
import { Activity, Brain, Zap, Check, X } from 'lucide-react';

interface BiologicalStateProps {
  metrics: any; // old format (object) or new format (array)
}

export function BiologicalState({ metrics }: BiologicalStateProps) {
  const isNewFormat = Array.isArray(metrics);

  const stressMetric = isNewFormat ? metrics.find((m: any) => m.metric_id === 'stress') : null;
  const motivationMetric = isNewFormat ? metrics.find((m: any) => m.metric_id === 'motivation') : null;
  const readinessMetric = isNewFormat ? metrics.find((m: any) => m.metric_id === 'readiness') : null;
  const sleepMetric = isNewFormat ? metrics.find((m: any) => m.metric_id === 'sleep_quality') : null;

  const hasStress = stressMetric?.current_value !== null && stressMetric?.current_value !== undefined;
  const hasReadiness = readinessMetric?.current_value !== null && readinessMetric?.current_value !== undefined;
  const hasMotivation = motivationMetric?.current_value !== null && motivationMetric?.current_value !== undefined;
  const hasSleep = sleepMetric?.current_value !== null && sleepMetric?.current_value !== undefined;

  const autonomicStress = hasStress
    ? Math.max(0, Math.min(100, Number(stressMetric.current_value) * 10))
    : (!isNewFormat && metrics?.autonomicStress !== undefined && metrics?.autonomicStress !== null
      ? Number(metrics.autonomicStress)
      : null);

  const neuromuscularEfficiency = hasReadiness
    ? Math.max(0, Math.min(100, Number(readinessMetric.current_value)))
    : (!isNewFormat && metrics?.neuromuscularEfficiency !== undefined && metrics?.neuromuscularEfficiency !== null
      ? Number(metrics.neuromuscularEfficiency)
      : null);

  const determineEnergySystem = () => {
    if (!isNewFormat) return metrics?.energySystem || 'unknown';

    if (!hasReadiness) return 'unknown';

    const avgReadiness = Number(readinessMetric.current_value);
    if (avgReadiness >= 80) return 'balanced';
    if (avgReadiness >= 60) return 'aerobic';
    return 'anaerobic';
  };

  const energySystem = determineEnergySystem();

  const systemChecks = [
    {
      label: 'Sono Adequado',
      value: hasSleep
        ? Number(sleepMetric.current_value) >= 7
        : (!isNewFormat ? (metrics?.sleepAdequate ?? null) : null),
      icon: '😴'
    },
    {
      label: 'Nutrição OK',
      value: !isNewFormat ? (metrics?.nutritionAdequate ?? null) : null,
      icon: '🍎'
    },
    {
      label: 'Ambiente Ideal',
      value: !isNewFormat ? (metrics?.environmentOptimal ?? null) : null,
      icon: '🌡️'
    },
    {
      label: 'Motivação Alta',
      value: hasMotivation
        ? Number(motivationMetric.current_value) >= 7
        : (!isNewFormat ? (metrics?.motivationHigh ?? null) : null),
      icon: '💪'
    }
  ];

  const getEnergySystemColor = (system: string) => {
    switch (system) {
      case 'balanced':
        return 'text-emerald-600 bg-emerald-50';
      case 'anaerobic':
        return 'text-red-600 bg-red-50';
      case 'aerobic':
        return 'text-sky-600 bg-sky-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getEnergySystemLabel = (system: string) => {
    switch (system) {
      case 'balanced':
        return 'Equilibrado';
      case 'anaerobic':
        return 'Anaeróbico';
      case 'aerobic':
        return 'Aeróbico';
      default:
        return 'Desconhecido';
    }
  };

  const renderPercent = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return '—';
    return `${Math.round(value)}%`;
  };

  const renderBarWidth = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return '0%';
    return `${Math.max(0, Math.min(100, value))}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Estado Biológico</h3>
            <p className="text-xs text-slate-500">Agora</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEnergySystemColor(energySystem)}`}>
          {getEnergySystemLabel(energySystem)}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-sky-500" />
              <span className="text-sm font-medium text-slate-700">Stress Autonómico</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{renderPercent(autonomicStress)}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: renderBarWidth(autonomicStress) }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`h-full rounded-full ${autonomicStress === null
                  ? 'bg-slate-300'
                  : autonomicStress < 40
                    ? 'bg-emerald-500'
                    : autonomicStress < 70
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-slate-700">Eficiência Neuromuscular</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{renderPercent(neuromuscularEfficiency)}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: renderBarWidth(neuromuscularEfficiency) }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`h-full rounded-full ${neuromuscularEfficiency === null
                  ? 'bg-slate-300'
                  : 'bg-gradient-to-r from-violet-500 to-violet-600'
                }`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">System Checks</h4>
        <div className="grid grid-cols-2 gap-3">
          {systemChecks.map((check, index) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`flex items-center gap-2 p-3 rounded-xl ${check.value === null
                  ? 'bg-slate-50 border border-slate-200'
                  : check.value
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
                }`}
            >
              <span className="text-lg">{check.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{check.label}</p>
              </div>

              {check.value === null ? (
                <span className="text-xs font-semibold text-slate-400">—</span>
              ) : check.value ? (
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-600 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}