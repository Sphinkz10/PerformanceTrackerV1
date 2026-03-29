/**
 * SUBMISSIONS DASHBOARD - SEMANA 5 ✅
 * 
 * Dashboard para visualizar form submissions com:
 * - Lista de submissions
 * - Status (processed/unprocessed)
 * - Processing logs
 * - Retry failed submissions
 * - Filters
 * 
 * @since Semana 5 - Form Center
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Filter,
  RefreshCw,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useFormSubmissions } from '@/hooks/useFormSubmissions';
import type { FormSubmission } from '@/hooks/useFormSubmissions';

interface SubmissionsDashboardProps {
  workspaceId?: string;
  formId?: string;
  athleteId?: string;
}

export function SubmissionsDashboard({
  workspaceId = 'default-workspace',
  formId,
  athleteId
}: SubmissionsDashboardProps) {
  
  const {
    submissions,
    loading,
    error,
    fetchSubmissions,
    retrySubmission
  } = useFormSubmissions(workspaceId);

  const [filter, setFilter] = useState<'all' | 'processed' | 'unprocessed'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions(formId, athleteId);
  }, [formId, athleteId]);

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'processed') return sub.processed;
    if (filter === 'unprocessed') return !sub.processed;
    return true;
  });

  // Stats
  const stats = {
    total: submissions.length,
    processed: submissions.filter(s => s.processed).length,
    unprocessed: submissions.filter(s => !s.processed).length,
    metricsCreated: submissions.reduce((sum, s) => {
      return sum + (s.processing_log?.filter((l: any) => l.status === 'success').length || 0);
    }, 0)
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-2" />
          <p className="text-slate-400">Carregando submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
          <p className="text-sm text-slate-600 mt-1">
            Histórico de respostas e métricas criadas
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchSubmissions(formId, athleteId)}
          className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Processados</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.processed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.unprocessed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Métricas</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.metricsCreated}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-slate-400" />
        <div className="flex gap-2">
          {(['all', 'processed', 'unprocessed'] as const).map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'processed' ? 'Processados' : 'Pendentes'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Nenhuma submission encontrada</p>
            <p className="text-sm text-slate-500 mt-1">
              {filter !== 'all' && 'Tente mudar o filtro'}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSubmission(submission)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      submission.processed
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {submission.processed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Form Submission
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(submission.submitted_at).toLocaleDateString('pt-PT', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Processing Log Summary */}
                  {submission.processing_log && submission.processing_log.length > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-600 font-medium">
                        ✓ {submission.processing_log.filter((l: any) => l.status === 'success').length} métricas criadas
                      </span>
                      {submission.processing_log.some((l: any) => l.status === 'failed') && (
                        <span className="text-red-600 font-medium">
                          ✗ {submission.processing_log.filter((l: any) => l.status === 'failed').length} falhas
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Action */}
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal (TODO) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Submission Details</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-slate-400 rotate-90" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Responses */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Respostas</h4>
                <pre className="p-4 rounded-lg bg-slate-50 text-sm overflow-x-auto">
                  {JSON.stringify(selectedSubmission.responses, null, 2)}
                </pre>
              </div>

              {/* Processing Log */}
              {selectedSubmission.processing_log && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Processing Log</h4>
                  <div className="space-y-2">
                    {selectedSubmission.processing_log.map((log: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          log.status === 'success'
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <p className="text-sm font-medium">
                          {log.status === 'success' ? '✓' : '✗'} Field: {log.field_id}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {log.original_value} → {log.transformed_value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
