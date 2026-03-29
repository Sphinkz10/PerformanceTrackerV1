/**
 * EMPTY STATE COMPONENT
 * Displays helpful empty states with actions
 */

'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string | React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tips?: string[];
  color?: 'sky' | 'emerald' | 'purple' | 'amber' | 'slate';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  tips,
  color = 'sky',
}: EmptyStateProps) {
  const colorClasses = {
    sky: {
      bg: 'from-sky-50 to-blue-50',
      icon: 'from-sky-500 to-sky-600',
      iconText: 'text-white',
      button: 'from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-sky-500/30',
    },
    emerald: {
      bg: 'from-emerald-50 to-green-50',
      icon: 'from-emerald-500 to-emerald-600',
      iconText: 'text-white',
      button: 'from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/30',
    },
    purple: {
      bg: 'from-purple-50 to-violet-50',
      icon: 'from-purple-500 to-purple-600',
      iconText: 'text-white',
      button: 'from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 shadow-purple-500/30',
    },
    amber: {
      bg: 'from-amber-50 to-yellow-50',
      icon: 'from-amber-500 to-amber-600',
      iconText: 'text-white',
      button: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/30',
    },
    slate: {
      bg: 'from-slate-50 to-slate-100',
      icon: 'from-slate-500 to-slate-600',
      iconText: 'text-white',
      button: 'from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500 shadow-slate-500/30',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-12"
    >
      <div className="max-w-md text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.icon} mb-6 shadow-lg`}
        >
          <Icon className={`h-10 w-10 ${colors.iconText}`} />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
          <div className="text-sm text-slate-600 mb-6">
            {description}
          </div>
        </motion.div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
          >
            {action && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl bg-gradient-to-r text-white shadow-lg transition-all ${colors.button}`}
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </motion.button>
            )}
            
            {secondaryAction && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={secondaryAction.onClick}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {secondaryAction.label}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Tips */}
        {tips && tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`p-4 rounded-xl bg-gradient-to-br ${colors.bg} border border-slate-200/50 text-left`}
          >
            <p className="text-xs font-semibold text-slate-700 mb-2">💡 Dicas:</p>
            <ul className="text-xs text-slate-600 space-y-1.5">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
