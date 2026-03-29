/**
 * AI SUGGESTION - Live Board
 * Sugestões AI para o atleta
 */

'use client';

import { motion } from 'motion/react';
import { Sparkles, Heart, TrendingUp, Target, Shield, X, Check, Clock } from 'lucide-react';
import type { AISuggestion } from '@/lib/athleteUtils';

interface AISuggestionProps {
  suggestion: AISuggestion;
  onApply?: () => void;
  onIgnore?: () => void;
  onDefer?: () => void;
  compact?: boolean;
}

export function AISuggestionComponent({
  suggestion,
  onApply,
  onIgnore,
  onDefer,
  compact = false,
}: AISuggestionProps) {
  const typeConfig = {
    health: {
      icon: Heart,
      color: 'red',
      label: 'Saúde',
      emoji: '🩺',
    },
    performance: {
      icon: TrendingUp,
      color: 'emerald',
      label: 'Performance',
      emoji: '💪',
    },
    optimization: {
      icon: Target,
      color: 'sky',
      label: 'Otimização',
      emoji: '📈',
    },
    prevention: {
      icon: Shield,
      color: 'amber',
      label: 'Prevenção',
      emoji: '⚠️',
    },
  };

  const config = typeConfig[suggestion.type];
  const Icon = config.icon;

  const colorClasses = {
    red: 'from-red-50 to-white border-red-200',
    emerald: 'from-emerald-50 to-white border-emerald-200',
    sky: 'from-sky-50 to-white border-sky-200',
    amber: 'from-amber-50 to-white border-amber-200',
  };

  const iconColors = {
    red: 'text-red-500',
    emerald: 'text-emerald-500',
    sky: 'text-sky-500',
    amber: 'text-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClasses[config.color]} p-4`}
    >
      {/* Sparkle Animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-2 right-2"
      >
        <Sparkles className={`h-4 w-4 ${iconColors[config.color]}`} />
      </motion.div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${iconColors[config.color]}`} />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {config.emoji} Sugestão AI - {config.label}
        </span>
        {!compact && (
          <span className="ml-auto text-xs text-slate-400">
            {suggestion.confidence}% confiança
          </span>
        )}
      </div>

      {/* Message */}
      <p className="text-sm font-medium text-slate-900 mb-3">
        {suggestion.message}
      </p>

      {/* Actions (if provided) */}
      {suggestion.actions && suggestion.actions.length > 0 && !compact && (
        <div className="space-y-1.5 mb-3">
          <p className="text-xs font-semibold text-slate-600 mb-1.5">Ações sugeridas:</p>
          {suggestion.actions.map((action, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${iconColors[config.color]} mt-1.5 shrink-0`} />
              <p className="text-xs text-slate-700">{action}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onApply && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApply}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white hover:from-${config.color}-400 hover:to-${config.color}-500 transition-all`}
          >
            <Check className="h-3 w-3" />
            Aplicar
          </motion.button>
        )}

        {onDefer && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDefer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Clock className="h-3 w-3" />
            Adiar
          </motion.button>
        )}

        {onIgnore && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onIgnore}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="h-3 w-3" />
            Ignorar
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
