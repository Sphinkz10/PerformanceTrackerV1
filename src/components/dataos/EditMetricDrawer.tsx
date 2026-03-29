/**
 * FASE 2: Edit Metric Drawer
 * Drawer para editar métricas existentes
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Metric, MetricAggregationMethod, MetricBaselineMethod } from '@/types/metrics';
import { validateMetric } from '@/types/metrics';

interface EditMetricDrawerProps {
  metric: Metric | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: Metric) => void;
}

const AGGREGATION_METHODS: { value: MetricAggregationMethod; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'average', label: 'Average' },
  { value: 'sum', label: 'Sum' },
  { value: 'max', label: 'Maximum' },
  { value: 'min', label: 'Minimum' },
];

const BASELINE_METHODS: { value: MetricBaselineMethod; label: string }[] = [
  { value: 'rolling-average', label: 'Rolling Average' },
  { value: 'percentile', label: 'Median' },
  { value: 'manual', label: 'Manual' },
];

export function EditMetricDrawer({ metric, isOpen, onClose, onSave }: EditMetricDrawerProps) {
  const [editedMetric, setEditedMetric] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (metric) {
      setEditedMetric({ ...metric });
    }
  }, [metric]);

  if (!isOpen || !editedMetric) return null;

  const validation = validateMetric(editedMetric);

  const handleSave = async () => {
    if (!validation.valid) return;
    
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch(`/api/metrics/${editedMetric.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedMetric),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setApiError(result.errors?.join(', ') || result.error || 'Failed to update metric');
        setLoading(false);
        return;
      }
      
      // Success
      onSave(result.data);
      onClose();
      setLoading(false);
      
    } catch (error) {
      console.error('Update metric error:', error);
      setApiError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Metric</h2>
            <p className="text-sm text-slate-600 mt-1">{editedMetric.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Name
            </label>
            <input
              type="text"
              value={editedMetric.name}
              onChange={(e) => setEditedMetric({ ...editedMetric, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description
            </label>
            <textarea
              value={editedMetric.description || ''}
              onChange={(e) => setEditedMetric({ ...editedMetric, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 resize-none"
            />
          </div>

          {/* Unit */}
          {(editedMetric.type === 'scale' || editedMetric.type === 'duration' || editedMetric.type === 'distance' || editedMetric.type === 'count') && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Unit
              </label>
              <input
                type="text"
                value={editedMetric.unit || ''}
                onChange={(e) => setEditedMetric({ ...editedMetric, unit: e.target.value })}
                placeholder="e.g., ms, km, bpm"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
          )}

          {/* Scale Range */}
          {editedMetric.type === 'scale' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-sky-50 rounded-xl">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Min Value
                </label>
                <input
                  type="number"
                  value={editedMetric.scaleMin ?? ''}
                  onChange={(e) => setEditedMetric({ ...editedMetric, scaleMin: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Max Value
                </label>
                <input
                  type="number"
                  value={editedMetric.scaleMax ?? ''}
                  onChange={(e) => setEditedMetric({ ...editedMetric, scaleMax: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Aggregation Method */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Aggregation Method
            </label>
            <select
              value={editedMetric.aggregationMethod}
              onChange={(e) => setEditedMetric({ ...editedMetric, aggregationMethod: e.target.value as MetricAggregationMethod })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 appearance-none cursor-pointer"
            >
              {AGGREGATION_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Baseline Method */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Baseline Method
            </label>
            <select
              value={editedMetric.baselineMethod}
              onChange={(e) => setEditedMetric({ ...editedMetric, baselineMethod: e.target.value as MetricBaselineMethod })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
            >
              {BASELINE_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Baseline Period */}
          {editedMetric.baselineMethod === 'rolling-average' && (
            <div className="p-4 bg-emerald-50 rounded-xl">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Rolling Period (days)
              </label>
              <input
                type="number"
                value={editedMetric.baselinePeriodDays}
                onChange={(e) => setEditedMetric({ ...editedMetric, baselinePeriodDays: Number(e.target.value) })}
                min={7}
                max={90}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {/* Manual Baseline */}
          {editedMetric.baselineMethod === 'manual' && (
            <div className="p-4 bg-amber-50 rounded-xl">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Baseline Value
              </label>
              <input
                type="number"
                value={editedMetric.baselineManualValue || ''}
                onChange={(e) => setEditedMetric({ ...editedMetric, baselineManualValue: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={editedMetric.tags?.join(', ') || ''}
              onChange={(e) => setEditedMetric({
                ...editedMetric,
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              placeholder="dashboard, critical, recovery"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            {editedMetric.tags && editedMetric.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {editedMetric.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {!validation.valid && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Validation Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validation.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings && validation.warnings.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">Warnings:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {validation.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-2">API Error:</h4>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: validation.valid ? 1.02 : 1 }}
            whileTap={{ scale: validation.valid ? 0.98 : 1 }}
            onClick={handleSave}
            disabled={!validation.valid}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl shadow-lg transition-all ${
              validation.valid
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}