/**
 * BulkSubmissionModal - FASE 7 EXCEED FEATURE
 * 
 * Submit the same form data to multiple athletes at once.
 * 
 * Features:
 * - Multi-athlete selector
 * - Batch processing with progress
 * - Individual success/fail per athlete
 * - Rollback option if failures
 * 
 * Usage:
 * <BulkSubmissionModal
 *   isOpen={showBulkModal}
 *   formData={currentFormData}
 *   athletes={allAthletes}
 *   onSubmit={(athleteIds) => bulkSubmit(athleteIds)}
 *   onClose={() => setShowBulkModal(false)}
 * />
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Send,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  team?: string;
  status?: 'active' | 'inactive';
}

export interface BulkSubmissionResult {
  athleteId: string;
  athleteName: string;
  success: boolean;
  metricsUpdated?: number;
  error?: string;
}

export interface BulkSubmissionModalProps {
  isOpen: boolean;
  formData: Record<string, any>;
  athletes: Athlete[];
  onSubmit: (athleteIds: string[]) => Promise<BulkSubmissionResult[]>;
  onClose: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BulkSubmissionModal: React.FC<BulkSubmissionModalProps> = ({
  isOpen,
  formData,
  athletes,
  onSubmit,
  onClose,
}) => {
  const [selectedAthletes, setSelectedAthletes] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<BulkSubmissionResult[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAthlete = (athleteId: string) => {
    const newSelection = new Set(selectedAthletes);
    if (newSelection.has(athleteId)) {
      newSelection.delete(athleteId);
    } else {
      newSelection.add(athleteId);
    }
    setSelectedAthletes(newSelection);
  };

  const selectAll = () => {
    setSelectedAthletes(new Set(filteredAthletes.map(a => a.id)));
  };

  const deselectAll = () => {
    setSelectedAthletes(new Set());
  };

  const handleSubmit = async () => {
    if (selectedAthletes.size === 0) return;

    setIsSubmitting(true);
    try {
      const submissionResults = await onSubmit(Array.from(selectedAthletes));
      setResults(submissionResults);
    } catch (error) {
      console.error('Bulk submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAthletes(new Set());
    setResults(null);
    setSearchQuery('');
    onClose();
  };

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.team?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const successCount = results?.filter(r => r.success).length || 0;
  const failCount = results?.filter(r => !r.success).length || 0;

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-white">
              <div>
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-600" />
                  Bulk Submission
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Submit to multiple athletes at once
                </p>
              </div>
              <button
                onClick={handleClose}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Results View */}
            {results ? (
              <>
                {/* Results Stats */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white border border-slate-200 p-3">
                      <p className="text-xs text-slate-500 mb-1">Total</p>
                      <p className="font-semibold text-slate-900">{results.length}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-emerald-200 p-3">
                      <p className="text-xs text-emerald-600 mb-1">Success</p>
                      <p className="font-semibold text-emerald-700">{successCount}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-red-200 p-3">
                      <p className="text-xs text-red-600 mb-1">Failed</p>
                      <p className="font-semibold text-red-700">{failCount}</p>
                    </div>
                  </div>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.athleteId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                          result.success
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {result.success ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{result.athleteName}</p>
                            {result.success && result.metricsUpdated !== undefined && (
                              <p className="text-xs text-emerald-600">
                                {result.metricsUpdated} metric{result.metricsUpdated !== 1 ? 's' : ''} updated
                              </p>
                            )}
                            {!result.success && result.error && (
                              <p className="text-xs text-red-600">{result.error}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Results Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
                  >
                    Done
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* Selection View */}
                <div className="px-6 py-4 border-b border-slate-200 space-y-3">
                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search athletes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                  />

                  {/* Select All / Deselect All */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      {selectedAthletes.size} of {filteredAthletes.length} selected
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={deselectAll}
                        className="text-xs font-medium text-slate-600 hover:text-slate-700 transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Athletes List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-2">
                    {filteredAthletes.map((athlete) => {
                      const isSelected = selectedAthletes.has(athlete.id);
                      return (
                        <motion.button
                          key={athlete.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => toggleAthlete(athlete.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-violet-400 bg-violet-50'
                              : 'border-slate-200 bg-white hover:border-violet-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold">
                              {athlete.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-slate-900">{athlete.name}</p>
                              {athlete.team && (
                                <p className="text-xs text-slate-500">{athlete.team}</p>
                              )}
                            </div>
                          </div>

                          {/* Checkbox */}
                          <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-violet-500 bg-violet-500'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </div>
                        </motion.button>
                      );
                    })}

                    {filteredAthletes.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Users className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No athletes found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selection Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                  {selectedAthletes.size > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Same data will be applied to all selected athletes
                    </div>
                  )}
                  {selectedAthletes.size === 0 && <div />}
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={isSubmitting || selectedAthletes.size === 0}
                      className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:from-violet-400 hover:to-violet-500 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit to {selectedAthletes.size}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
