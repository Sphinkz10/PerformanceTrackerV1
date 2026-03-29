/**
 * SubmissionPreviewModal - FASE 7 EXCEED FEATURE
 * 
 * Shows real-time preview of metric changes BEFORE submitting form.
 * 
 * Features:
 * - Old → New values with visual delta
 * - Percentage changes color-coded
 * - Zone changes (if applicable)
 * - Critical warnings
 * - Cancel or Confirm submission
 * 
 * Usage:
 * <SubmissionPreviewModal
 *   previews={metricPreviews}
 *   onConfirm={() => submitForm()}
 *   onCancel={() => setShowPreview(false)}
 * />
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Heart,
  Zap,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface MetricPreview {
  metricId: string;
  metricName: string;
  metricType: string;
  metricCategory?: 'performance' | 'wellness' | 'load' | 'custom';
  currentValue?: number | string | boolean;
  newValue: number | string | boolean;
  change?: {
    delta: number;
    percentage: number;
    direction: 'up' | 'down' | 'same';
  };
  zoneChange?: {
    from: string;
    to: string;
    severity: 'good' | 'neutral' | 'bad';
  };
  warning?: string;
}

export interface SubmissionPreviewModalProps {
  isOpen: boolean;
  previews: MetricPreview[];
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SubmissionPreviewModal: React.FC<SubmissionPreviewModalProps> = ({
  isOpen,
  previews,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const criticalWarnings = previews.filter(p => p.warning).length;
  const totalChanges = previews.length;
  const improvements = previews.filter(p => 
    p.change?.direction === 'up' || p.zoneChange?.severity === 'good'
  ).length;
  const declines = previews.filter(p => 
    p.change?.direction === 'down' || p.zoneChange?.severity === 'bad'
  ).length;

  // FIX BUG #2: Dynamic Tailwind classes mapping
  const categoryStyles = {
    performance: {
      bgClass: 'bg-sky-100',
      textClass: 'text-sky-600',
      Icon: Activity,
    },
    wellness: {
      bgClass: 'bg-emerald-100',
      textClass: 'text-emerald-600',
      Icon: Heart,
    },
    load: {
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-600',
      Icon: Zap,
    },
    custom: {
      bgClass: 'bg-violet-100',
      textClass: 'text-violet-600',
      Icon: Activity,
    },
  } as const;

  const getCategoryStyles = (category?: string) => {
    const key = (category as keyof typeof categoryStyles) || 'custom';
    return categoryStyles[key] || categoryStyles.custom;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
              <div>
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-sky-600" />
                  Preview Metric Updates
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Review changes before submitting
                </p>
              </div>
              <button
                onClick={onCancel}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="rounded-lg bg-white border border-slate-200 p-3">
                <p className="text-xs text-slate-500 mb-1">Total Changes</p>
                <p className="font-semibold text-slate-900">{totalChanges}</p>
              </div>
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <p className="text-xs text-emerald-600 mb-1">Improvements</p>
                <p className="font-semibold text-emerald-700">{improvements}</p>
              </div>
              <div className="rounded-lg bg-white border border-red-200 p-3">
                <p className="text-xs text-red-600 mb-1">Declines</p>
                <p className="font-semibold text-red-700">{declines}</p>
              </div>
              <div className="rounded-lg bg-white border border-amber-200 p-3">
                <p className="text-xs text-amber-600 mb-1">Warnings</p>
                <p className="font-semibold text-amber-700">{criticalWarnings}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {previews.map((preview, index) => {
                  const { Icon, bgClass, textClass } = getCategoryStyles(preview.metricCategory);
                  
                  return (
                    <motion.div
                      key={preview.metricId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-xl border-2 p-4 ${
                        preview.warning 
                          ? 'border-amber-300 bg-amber-50' 
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Metric Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`h-10 w-10 rounded-lg ${bgClass} flex items-center justify-center shrink-0`}>
                          <Icon className={`h-5 w-5 ${textClass}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{preview.metricName}</h3>
                          <p className="text-xs text-slate-500 capitalize">{preview.metricType}</p>
                        </div>
                        
                        {/* Change Indicator */}
                        {preview.change && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            preview.change.direction === 'up' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : preview.change.direction === 'down'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {preview.change.direction === 'up' && <TrendingUp className="h-3 w-3" />}
                            {preview.change.direction === 'down' && <TrendingDown className="h-3 w-3" />}
                            {preview.change.direction === 'same' && <Minus className="h-3 w-3" />}
                            {preview.change.percentage > 0 ? '+' : ''}{preview.change.percentage.toFixed(1)}%
                          </div>
                        )}
                      </div>

                      {/* Value Change */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">Current</p>
                          <p className="font-medium text-slate-700">
                            {preview.currentValue !== undefined ? String(preview.currentValue) : '—'}
                          </p>
                        </div>
                        <div className="text-slate-400">→</div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">New</p>
                          <p className="font-semibold text-slate-900">{String(preview.newValue)}</p>
                        </div>
                        {preview.change && (
                          <div className="flex-1 text-right">
                            <p className="text-xs text-slate-500 mb-1">Delta</p>
                            <p className={`font-semibold ${
                              preview.change.delta > 0 ? 'text-emerald-600' :
                              preview.change.delta < 0 ? 'text-red-600' :
                              'text-slate-600'
                            }`}>
                              {preview.change.delta > 0 ? '+' : ''}{preview.change.delta.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Zone Change */}
                      {preview.zoneChange && (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          preview.zoneChange.severity === 'good' ? 'bg-emerald-100 text-emerald-700' :
                          preview.zoneChange.severity === 'bad' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          <span className="font-medium">Zone:</span>
                          <span>{preview.zoneChange.from}</span>
                          <span>→</span>
                          <span className="font-semibold">{preview.zoneChange.to}</span>
                        </div>
                      )}

                      {/* Warning */}
                      {preview.warning && (
                        <div className="flex items-start gap-2 mt-3 px-3 py-2 rounded-lg bg-amber-100 border border-amber-300">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800">{preview.warning}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                {criticalWarnings > 0 && (
                  <span className="flex items-center gap-2 text-amber-700 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    {criticalWarnings} warning{criticalWarnings > 1 ? 's' : ''} detected
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm & Submit
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};