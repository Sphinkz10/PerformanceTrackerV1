/**
 * LiveSubmissionPreview - FASE 7 EXCEED FEATURE
 * 
 * Lightweight inline preview showing metric changes in real-time
 * as user fills out the form.
 * 
 * Features:
 * - Compact inline design
 * - Real-time updates on field change
 * - Color-coded deltas
 * - Quick warnings
 * - Doesn't block form filling
 * 
 * Usage:
 * <LiveSubmissionPreview
 *   formData={currentFormData}
 *   links={metricLinks}
 *   compact={true}
 * />
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface LivePreviewMetric {
  metricName: string;
  currentValue?: number;
  newValue: number;
  delta?: number;
  direction?: 'up' | 'down' | 'same';
  hasWarning?: boolean;
}

export interface LiveSubmissionPreviewProps {
  metrics: LivePreviewMetric[];
  compact?: boolean;
  collapsible?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LiveSubmissionPreview: React.FC<LiveSubmissionPreviewProps> = ({
  metrics,
  compact = true,
  collapsible = true,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const summary = useMemo(() => {
    const improvements = metrics.filter(m => m.direction === 'up').length;
    const declines = metrics.filter(m => m.direction === 'down').length;
    const warnings = metrics.filter(m => m.hasWarning).length;
    return { improvements, declines, warnings, total: metrics.length };
  }, [metrics]);

  if (metrics.length === 0) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 z-10"
      >
        <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-white p-3 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-600" />
              <h4 className="text-sm font-semibold text-slate-900">
                Live Preview
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                {summary.total}
              </span>
            </div>
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 rounded hover:bg-violet-100 flex items-center justify-center transition-colors"
              >
                {isCollapsed ? (
                  <Eye className="h-3.5 w-3.5 text-violet-600" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-violet-600" />
                )}
              </button>
            )}
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                {/* Summary */}
                <div className="flex items-center gap-3 text-xs">
                  {summary.improvements > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      {summary.improvements}
                    </span>
                  )}
                  {summary.declines > 0 && (
                    <span className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="h-3 w-3" />
                      {summary.declines}
                    </span>
                  )}
                  {summary.warnings > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <AlertTriangle className="h-3 w-3" />
                      {summary.warnings}
                    </span>
                  )}
                </div>

                {/* Metrics List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                        metric.hasWarning
                          ? 'bg-amber-100 border border-amber-300'
                          : 'bg-white border border-violet-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {metric.direction === 'up' && (
                          <TrendingUp className="h-3 w-3 text-emerald-600 shrink-0" />
                        )}
                        {metric.direction === 'down' && (
                          <TrendingDown className="h-3 w-3 text-red-600 shrink-0" />
                        )}
                        {metric.direction === 'same' && (
                          <Minus className="h-3 w-3 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-700 truncate font-medium">
                          {metric.metricName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {metric.delta !== undefined && (
                          <span className={`font-semibold ${
                            metric.direction === 'up' ? 'text-emerald-600' :
                            metric.direction === 'down' ? 'text-red-600' :
                            'text-slate-500'
                          }`}>
                            {metric.delta > 0 ? '+' : ''}{metric.delta.toFixed(1)}
                          </span>
                        )}
                        {metric.hasWarning && (
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Full view (not compact)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Metric Preview</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700">
          {summary.total} metrics
        </span>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border-2 ${
              metric.hasWarning
                ? 'border-amber-300 bg-amber-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">
                {metric.metricName}
              </span>
              {metric.direction && (
                <span className={`flex items-center gap-1 text-xs font-semibold ${
                  metric.direction === 'up' ? 'text-emerald-600' :
                  metric.direction === 'down' ? 'text-red-600' :
                  'text-slate-500'
                }`}>
                  {metric.direction === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
                  {metric.direction === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
                  {metric.direction === 'same' && <Minus className="h-3.5 w-3.5" />}
                  {metric.delta !== undefined && (
                    <span>
                      {metric.delta > 0 ? '+' : ''}{metric.delta.toFixed(1)}
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-slate-500">
                {metric.currentValue !== undefined ? metric.currentValue : '—'}
              </span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold text-slate-900">{metric.newValue}</span>
            </div>

            {metric.hasWarning && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                <AlertTriangle className="h-3 w-3" />
                <span>Review recommended</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
