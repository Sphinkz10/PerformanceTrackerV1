/**
 * ALERT LIST - Live Board
 * Lista de alertas ativos do atleta
 */

'use client';

import { motion } from 'motion/react';
import { AlertCircle, AlertTriangle, Info, X, Check } from 'lucide-react';
import { getAlertDisplay, type Alert } from '@/lib/athleteUtils';

interface AlertListProps {
  alerts: Alert[];
  onMarkSeen?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onViewDetails?: (alertId: string) => void;
  compact?: boolean;
}

export function AlertList({
  alerts,
  onMarkSeen,
  onResolve,
  onViewDetails,
  compact = false,
}: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-slate-500">
        Sem alertas ativos 🎉
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          index={index}
          onMarkSeen={onMarkSeen}
          onResolve={onResolve}
          onViewDetails={onViewDetails}
          compact={compact}
        />
      ))}
    </div>
  );
}

// ============================================================================
// ALERT ITEM
// ============================================================================

interface AlertItemProps {
  alert: Alert;
  index: number;
  onMarkSeen?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onViewDetails?: (alertId: string) => void;
  compact: boolean;
}

function AlertItem({
  alert,
  index,
  onMarkSeen,
  onResolve,
  onViewDetails,
  compact,
}: AlertItemProps) {
  const { icon, color } = getAlertDisplay(alert.type);

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-500',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: 'text-amber-500',
    },
    sky: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-700',
      icon: 'text-sky-500',
    },
  };

  const colors = colorClasses[color];

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'critical':
        return <AlertCircle className={`h-4 w-4 ${colors.icon}`} />;
      case 'attention':
        return <AlertTriangle className={`h-4 w-4 ${colors.icon}`} />;
      case 'info':
        return <Info className={`h-4 w-4 ${colors.icon}`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group flex items-start gap-3 p-3 rounded-xl border ${colors.bg} ${colors.border}`}
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">{getAlertIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <button
          onClick={() => onViewDetails?.(alert.id)}
          className="text-left w-full"
        >
          <p className={`text-sm font-medium ${colors.text}`}>{alert.message}</p>
          
          {!compact && (
            <p className="text-xs text-slate-500 mt-1">
              {formatAlertTime(alert.timestamp)}
            </p>
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMarkSeen && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMarkSeen(alert.id)}
            className="h-6 w-6 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            title="Marcar como visto"
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
        
        {onResolve && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onResolve(alert.id)}
            className={`h-6 w-6 rounded-lg bg-white hover:bg-${color}-100 flex items-center justify-center ${colors.icon} transition-colors`}
            title="Resolver"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatAlertTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `Há ${diffMinutes}min`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Há ${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays}d`;
  
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
}
