/**
 * SubmissionHistory - FASE 7 EXCEED FEATURE
 * 
 * Timeline of all form submissions with rollback capability.
 * 
 * Features:
 * - Chronological timeline
 * - Filter by form/athlete/date
 * - Rollback button (undo submission)
 * - View submission details
 * 
 * Usage:
 * <SubmissionHistory
 *   submissions={allSubmissions}
 *   onRollback={(submissionId) => undoSubmission(submissionId)}
 *   onViewDetails={(submission) => showDetails(submission)}
 * />
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  User,
  FileText,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface SubmissionHistoryEntry {
  id: string;
  formId: string;
  formName: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  submittedAt: string;
  submittedBy: string; // Coach/trainer name
  metricsUpdated: number;
  metricsCreated: number;
  metricsFailed: number;
  canRollback: boolean;
  rolledBack: boolean;
  success: boolean;
}

export interface SubmissionHistoryProps {
  submissions: SubmissionHistoryEntry[];
  onRollback?: (submissionId: string) => void;
  onViewDetails?: (submission: SubmissionHistoryEntry) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  submissions,
  onRollback,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.athleteName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'success' && sub.success) ||
      (filterStatus === 'failed' && !sub.success);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>
        <div className="relative flex-1 sm:flex-none sm:w-40">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-200">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No submissions found</p>
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border-2 p-4 ${
                submission.rolledBack 
                  ? 'border-amber-200 bg-amber-50'
                  : submission.success
                  ? 'border-slate-200 bg-white'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-semibold shrink-0">
                    {submission.athleteName.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{submission.athleteName}</h3>
                      {submission.success ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {submission.rolledBack && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          Rolled Back
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-2 mt-0.5">
                      <FileText className="h-3.5 w-3.5" />
                      {submission.formName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatDate(submission.submittedAt)} by {submission.submittedBy}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {onViewDetails && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewDetails(submission)}
                      className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-slate-600" />
                    </motion.button>
                  )}
                  {onRollback && submission.canRollback && !submission.rolledBack && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm('Rollback this submission? Metrics will be reverted.')) {
                          onRollback(submission.id);
                        }
                      }}
                      className="h-8 w-8 rounded-lg hover:bg-amber-50 flex items-center justify-center transition-colors"
                      title="Rollback"
                    >
                      <RotateCcw className="h-4 w-4 text-amber-600" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {submission.metricsUpdated} updated
                </span>
                {submission.metricsCreated > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                    {submission.metricsCreated} created
                  </span>
                )}
                {submission.metricsFailed > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    {submission.metricsFailed} failed
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
