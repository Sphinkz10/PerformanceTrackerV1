/**
 * LinkedMetricsPreview Component
 * 
 * Visual indicator showing which form fields are linked to metrics.
 * Displays compact badge with metric info on hover.
 * 
 * Features:
 * - Compact link badge next to field name
 * - Hover tooltip with metric details
 * - Color-coded by metric category
 * - Click to go to Metrics tab
 * - Unlink option
 * 
 * Usage:
 * <LinkedMetricsPreview
 *   fieldId="field-123"
 *   metricId="metric-hrv"
 *   metricName="HRV (Heart Rate Variability)"
 *   metricCategory="performance"
 *   onUnlink={() => handleUnlink()}
 *   onViewDetails={() => switchToMetricsTab()}
 * />
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Link2,
  X,
  ExternalLink,
  Activity,
  Heart,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface LinkedMetricsPreviewProps {
  fieldId: string;
  metricId: string;
  metricName: string;
  metricCategory: 'performance' | 'wellness' | 'load' | 'custom';
  metricType?: 'numeric' | 'scale' | 'boolean';
  metricUnit?: string;
  onUnlink: () => void;
  onViewDetails: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LinkedMetricsPreview: React.FC<LinkedMetricsPreviewProps> = ({
  fieldId,
  metricId,
  metricName,
  metricCategory,
  metricType,
  metricUnit,
  onUnlink,
  onViewDetails,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getCategoryConfig = () => {
    switch (metricCategory) {
      case 'performance':
        return {
          icon: Activity,
          bg: 'bg-sky-100',
          text: 'text-sky-700',
          border: 'border-sky-300',
          label: 'Performance',
        };
      case 'wellness':
        return {
          icon: Heart,
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          border: 'border-emerald-300',
          label: 'Wellness',
        };
      case 'load':
        return {
          icon: Zap,
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          border: 'border-amber-300',
          label: 'Load',
        };
      default:
        return {
          icon: Target,
          bg: 'bg-violet-100',
          text: 'text-violet-700',
          border: 'border-violet-300',
          label: 'Custom',
        };
    }
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Compact Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        onClick={onViewDetails}
      >
        <Link2 className="h-3 w-3" />
        <span>Linked</span>
      </motion.div>

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">{metricName}</h4>
                <p className="text-xs text-slate-500">{config.label}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 mb-3 text-xs">
              {metricType && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="font-medium text-slate-900 capitalize">{metricType}</span>
                </div>
              )}
              {metricUnit && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Unit:</span>
                  <span className="font-medium text-slate-900">{metricUnit}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Metric ID:</span>
                <span className="font-mono text-[10px] text-slate-700">{metricId.slice(0, 12)}...</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <BarChart3 className="h-3 w-3" />
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Desvincular campo desta métrica?`)) {
                    onUnlink();
                    setShowTooltip(false);
                  }
                }}
                className="flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                title="Unlink"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPACT VARIANT (inline, no tooltip)
// ============================================================================

export const LinkedMetricsPreviewCompact: React.FC<LinkedMetricsPreviewProps> = ({
  metricName,
  metricCategory,
  onViewDetails,
}) => {
  const getCategoryConfig = () => {
    switch (metricCategory) {
      case 'performance':
        return { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300' };
      case 'wellness':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
      case 'load':
        return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
      default:
        return { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' };
    }
  };

  const config = getCategoryConfig();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={onViewDetails}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${config.bg} ${config.text} border ${config.border}`}
      title={`Linked to: ${metricName}`}
    >
      <Link2 className="h-2.5 w-2.5" />
      <span className="max-w-[100px] truncate">{metricName}</span>
    </motion.button>
  );
};
