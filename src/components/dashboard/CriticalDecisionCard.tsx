/**
 * Critical Decision Card
 * 
 * Displays a single critical decision with quick actions
 * Used in Dashboard "Atenções" tab
 */

import { motion } from "motion/react";
import { 
  AlertTriangle, 
  Brain, 
  CheckCircle, 
  X,
  TrendingDown,
  Moon,
  AlertCircle,
  Heart,
  Info
} from "lucide-react";
import type { Decision } from "../../lib/decision-engine/types";
import { PRIORITY_CONFIGS, DECISION_TYPE_CONFIGS } from "../../lib/decision-engine/types";

interface CriticalDecisionCardProps {
  decision: Decision;
  onApply: (decisionId: string) => void;
  onDismiss: (decisionId: string) => void;
  onViewDetails: (decisionId: string) => void;
  index?: number;
}

export function CriticalDecisionCard({
  decision,
  onApply,
  onDismiss,
  onViewDetails,
  index = 0
}: CriticalDecisionCardProps) {
  
  // Get icon for decision type
  const getDecisionIcon = () => {
    switch (decision.type) {
      case 'reduce-load':
        return TrendingDown;
      case 'rest-day':
        return Moon;
      case 'alert':
        return AlertCircle;
      case 'medical-evaluation':
        return Heart;
      default:
        return Info;
    }
  };

  // Get colors based on priority
  const getPriorityColors = () => {
    switch (decision.priority) {
      case 'critical':
        return {
          bg: 'from-red-50/90 to-orange-50/90',
          border: 'border-red-200/80',
          iconBg: 'from-red-500 to-red-600',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800 border-red-300',
        };
      case 'high':
        return {
          bg: 'from-amber-50/90 to-orange-50/90',
          border: 'border-amber-200/80',
          iconBg: 'from-amber-500 to-amber-600',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'medium':
        return {
          bg: 'from-sky-50/90 to-blue-50/90',
          border: 'border-sky-200/80',
          iconBg: 'from-sky-500 to-sky-600',
          text: 'text-sky-700',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
        };
      default:
        return {
          bg: 'from-slate-50/90 to-white/90',
          border: 'border-slate-200/80',
          iconBg: 'from-slate-500 to-slate-600',
          text: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
        };
    }
  };

  const colors = getPriorityColors();
  const DecisionIcon = getDecisionIcon();
  const priorityConfig = PRIORITY_CONFIGS[decision.priority];
  const typeConfig = DECISION_TYPE_CONFIGS[decision.type];

  // Safety check: if configs are undefined, provide defaults
  if (!priorityConfig || !typeConfig) {
    console.error('Missing config for decision:', { priority: decision.priority, type: decision.type });
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-4 shadow-sm hover:shadow-md transition-all`}
    >
      {/* Header: Icon + Athlete + Badge */}
      <div className="flex items-start gap-3 mb-3">
        {/* AI Brain Icon + Decision Type Icon */}
        <div className="relative shrink-0">
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center`}>
            <DecisionIcon className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center border-2 border-white">
            <Brain className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Athlete Name + Decision Type */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 mb-0.5 truncate">
            {decision.athleteName || 'Atleta Desconhecido'}
          </h4>
          <p className={`text-xs ${colors.text} font-medium`}>
            {typeConfig.label}
          </p>
        </div>

        {/* Priority Badge */}
        <div className={`shrink-0 px-2 py-1 rounded-lg border ${colors.badge} text-xs font-bold`}>
          {priorityConfig.label.toUpperCase()}
        </div>
      </div>

      {/* Recommendation (Main Action) */}
      <div className="mb-3">
        <p className="font-semibold text-slate-900 text-sm mb-1">
          📋 {decision.recommendation}
        </p>
        <p className={`text-xs ${colors.text} leading-relaxed`}>
          {decision.reasoning}
        </p>
      </div>

      {/* Metrics Used */}
      {decision.metricsUsed && decision.metricsUsed.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-600 mb-1.5">📊 Métricas Analisadas:</p>
          <div className="space-y-1">
            {decision.metricsUsed.slice(0, 2).map((metric, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between text-xs bg-white/60 rounded-lg px-2 py-1.5 border border-slate-200/50"
              >
                <span className="text-slate-700 font-medium">{metric.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{metric.value}</span>
                  {metric.baseline && (
                    <span className="text-slate-500">(baseline: {metric.baseline})</span>
                  )}
                  <div className={`h-2 w-2 rounded-full ${
                    metric.status === 'red' ? 'bg-red-500' :
                    metric.status === 'yellow' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-600 font-medium">Confiança da IA:</span>
          <span className="font-bold text-slate-900">{Math.round(decision.confidence * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${decision.confidence * 100}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            className={`h-full rounded-full bg-gradient-to-r ${colors.iconBg}`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onApply(decision.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-md transition-all"
        >
          <CheckCircle className="h-4 w-4" />
          Aplicar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails(decision.id)}
          className="px-3 py-2.5 text-sm font-medium rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
        >
          <Info className="h-4 w-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onDismiss(decision.id)}
          className="px-3 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Timestamp */}
      <div className="mt-2 text-xs text-slate-500 text-center">
        Gerado há {getTimeAgo(decision.createdAt)}
      </div>
    </motion.div>
  );
}

// Helper: Get relative time
function getTimeAgo(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffHours >= 24) {
    const days = Math.floor(diffHours / 24);
    return `${days} dia${days > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else if (diffMins > 0) {
    return `${diffMins}min`;
  } else {
    return 'agora mesmo';
  }
}