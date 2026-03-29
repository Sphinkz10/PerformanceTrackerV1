/**
 * FASE 2: Delete Metric Modal
 * Confirmação de delete com warnings se métrica está em uso
 */

'use client';

import { motion } from 'motion/react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import type { Metric } from '@/types/metrics';
import { useState } from 'react';

interface DeleteMetricModalProps {
  metric: Metric | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metric: Metric) => void;
  isInUse?: boolean; // Check if metric has data
  usageCount?: number;
}

export function DeleteMetricModal({
  metric,
  isOpen,
  onClose,
  onConfirm,
  isInUse = false,
  usageCount = 0,
}: DeleteMetricModalProps) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  if (!isOpen || !metric) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch(`/api/metrics/${metric.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setApiError(result.error || 'Failed to delete metric');
        setLoading(false);
        return;
      }
      
      // Success
      onConfirm(metric);
      onClose();
      setLoading(false);
      
    } catch (error) {
      console.error('Delete metric error:', error);
      setApiError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Delete Metric?</h2>
              <p className="text-sm text-slate-600 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Metric Info */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center text-white">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{metric.name}</div>
                <div className="text-sm text-slate-600">{metric.category}</div>
              </div>
            </div>
          </div>

          {/* Warning if in use */}
          {isInUse && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 mb-1">
                    Metric In Use
                  </h4>
                  <p className="text-sm text-amber-700">
                    This metric has <strong>{usageCount}</strong> data point{usageCount !== 1 ? 's' : ''}.
                    Deleting it will:
                  </p>
                  <ul className="text-sm text-amber-700 mt-2 space-y-1 ml-4">
                    <li>• Mark the metric as inactive (soft delete)</li>
                    <li>• Preserve existing data</li>
                    <li>• Hide metric from future selections</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Info about deletion */}
          {!isInUse && (
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <strong>{metric.name}</strong>?
              This metric will be permanently removed from your workspace.
            </p>
          )}
          
          {/* API Error */}
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-1">
                    Error
                  </h4>
                  <p className="text-sm text-red-700">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:from-red-400 hover:to-red-500 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            {isInUse ? 'Deactivate' : 'Delete'} Metric
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}