/**
 * MetricLinkBadge Component
 * 
 * Displays a badge showing that a form field is linked to a metric.
 * Used in Form Builder field cards.
 * 
 * Features:
 * - Shows metric name
 * - Shows metric type (scale, numeric, boolean)
 * - Color-coded by status
 * - Hover shows details
 * - Click to edit/remove link
 */

import React from 'react';
import { Link2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { Metric } from '@/types/metrics';

// ============================================================================
// TYPES
// ============================================================================

export interface MetricLinkBadgeProps {
  metric: Metric;
  isCompatible?: boolean;
  hasWarnings?: boolean;
  warnings?: string[];
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MetricLinkBadge: React.FC<MetricLinkBadgeProps> = ({
  metric,
  isCompatible = true,
  hasWarnings = false,
  warnings = [],
  onClick,
  onRemove,
  className = '',
}) => {
  // Determine badge color based on status
  const getBadgeColor = () => {
    if (!isCompatible) {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (hasWarnings) {
      return 'bg-amber-50 border-amber-200 text-amber-700';
    }
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  // Get icon based on status
  const getIcon = () => {
    if (!isCompatible) {
      return <AlertCircle className="h-3 w-3" />;
    }
    if (hasWarnings) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return <CheckCircle className="h-3 w-3" />;
  };

  // Get metric type display
  const getMetricTypeDisplay = () => {
    switch (metric.type) {
      case 'numeric':
        return metric.unit ? `${metric.unit}` : 'Numérico';
      case 'scale':
        return `Escala (${metric.scaleMin || 0}-${metric.scaleMax || 10})`;
      case 'boolean':
        return 'Sim/Não';
      default:
        return metric.type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <button
        onClick={onClick}
        className={`
          group
          inline-flex items-center gap-2
          px-3 py-1.5
          rounded-xl
          border
          text-xs font-medium
          transition-all
          hover:shadow-md
          ${getBadgeColor()}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
        title={warnings.length > 0 ? warnings.join('\n') : undefined}
      >
        {/* Icon */}
        <span className="shrink-0">
          {getIcon()}
        </span>

        {/* Metric Info */}
        <div className="flex items-center gap-2">
          <Link2 className="h-3 w-3 opacity-60" />
          <span className="font-semibold">{metric.name}</span>
          <span className="opacity-60">•</span>
          <span className="opacity-80">{getMetricTypeDisplay()}</span>
        </div>

        {/* Category badge */}
        {metric.category && (
          <>
            <span className="opacity-60">•</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/50 text-[10px] font-semibold uppercase tracking-wide">
              {metric.category === 'performance' && '⚡'}
              {metric.category === 'wellness' && '💚'}
              {metric.category === 'load' && '📊'}
              {metric.category === 'custom' && '⚙️'}
              {metric.category}
            </span>
          </>
        )}
      </button>

      {/* Remove button */}
      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="
            shrink-0
            h-6 w-6
            rounded-full
            bg-white
            border border-slate-200
            flex items-center justify-center
            text-slate-400
            hover:text-red-600
            hover:border-red-200
            hover:bg-red-50
            transition-all
          "
          title="Remover ligação"
        >
          <span className="text-xs font-bold">×</span>
        </motion.button>
      )}
    </motion.div>
  );
};

// ============================================================================
// COMPACT VARIANT (for tight spaces)
// ============================================================================

export const MetricLinkBadgeCompact: React.FC<MetricLinkBadgeProps> = ({
  metric,
  isCompatible = true,
  hasWarnings = false,
  onClick,
  onRemove,
  className = '',
}) => {
  const getBadgeColor = () => {
    if (!isCompatible) return 'bg-red-100 text-red-700 border-red-200';
    if (hasWarnings) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5
          px-2 py-1
          rounded-lg
          border
          text-xs font-semibold
          transition-all
          hover:shadow-sm
          ${getBadgeColor()}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        <Link2 className="h-3 w-3" />
        <span>{metric.name}</span>
      </button>

      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="
            h-5 w-5
            rounded
            bg-white
            border border-slate-200
            flex items-center justify-center
            text-slate-400
            hover:text-red-600
            hover:border-red-200
            hover:bg-red-50
            transition-all
          "
          title="Remover"
        >
          <span className="text-[10px] font-bold">×</span>
        </motion.button>
      )}
    </motion.div>
  );
};

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Basic usage
<MetricLinkBadge
  metric={linkedMetric}
  onClick={() => handleEditLink()}
  onRemove={() => handleRemoveLink()}
/>

// With warnings
<MetricLinkBadge
  metric={linkedMetric}
  hasWarnings={true}
  warnings={['Range mismatch: field 0-100, metric 1-10']}
  onClick={() => handleEditLink()}
/>

// Incompatible
<MetricLinkBadge
  metric={linkedMetric}
  isCompatible={false}
  warnings={['Field type "text" cannot be mapped to metric type "numeric"']}
/>

// Compact variant (for lists)
<MetricLinkBadgeCompact
  metric={linkedMetric}
  onClick={() => handleEditLink()}
  onRemove={() => handleRemoveLink()}
/>
*/
