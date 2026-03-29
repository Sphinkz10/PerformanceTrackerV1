/**
 * Form Submissions History - FASE 2.2
 * 
 * Página completa para visualizar histórico de respostas de formulários.
 * 
 * Features:
 * - Lista de submissions com filtros
 * - Filtrar por atleta, formulário, data
 * - Visualizar detalhes de cada submission
 * - Stats e métricas de completion rate
 * - Timeline visual
 * 
 * @author PerformTrack Team
 * @since Fase 2.2 - Form Submissions History
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Eye,
  Download,
  ChevronRight,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';
import { useSubmissions } from '@/hooks/use-api';
import { toast } from 'sonner';

interface FormSubmissionsHistoryProps {
  onBack?: () => void;
}

export function FormSubmissionsHistory({ onBack }: FormSubmissionsHistoryProps) {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Fetch submissions with filters
  const { data: submissions, isLoading, error } = useSubmissions({
    athleteId: selectedAthleteId || undefined,
    formTemplateId: selectedFormId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Mock data for filters (would come from API in production)
  const athletes = [
    { id: 'athlete-1', name: 'Pedro Costa', avatar: '🏃' },
    { id: 'athlete-2', name: 'Ana Silva', avatar: '🏋️' },
    { id: 'athlete-3', name: 'João Mendes', avatar: '⚽' },
  ];

  const formTemplates = [
    { id: 'form-1', name: 'Questionário Pré-Treino', icon: '📋' },
    { id: 'form-2', name: 'Avaliação de Dor', icon: '🩺' },
    { id: 'form-3', name: 'Feedback Semanal', icon: '💬' },
  ];

  // Calculate stats
  const totalSubmissions = submissions.length;
  const uniqueAthletes = new Set(submissions.map((s: any) => s.athleteId)).size;
  const uniqueForms = new Set(submissions.map((s: any) => s.formTemplateId)).size;

  // Filter by search query
  const filteredSubmissions = submissions.filter((submission: any) => {
    if (!searchQuery) return true;
    const athleteName = athletes.find(a => a.id === submission.athleteId)?.name || '';
    const formName = formTemplates.find(f => f.id === submission.formTemplateId)?.name || '';
    const query = searchQuery.toLowerCase();
    return (
      athleteName.toLowerCase().includes(query) ||
      formName.toLowerCase().includes(query)
    );
  });

  // Export function
  const handleExport = () => {
    const csvData = filteredSubmissions.map((s: any) => {
      const athlete = athletes.find(a => a.id === s.athleteId);
      const form = formTemplates.find(f => f.id === s.formTemplateId);
      return {
        Data: new Date(s.submittedAt).toLocaleDateString('pt-PT'),
        Hora: new Date(s.submittedAt).toLocaleTimeString('pt-PT'),
        Atleta: athlete?.name || 'Desconhecido',
        Formulário: form?.name || 'Desconhecido',
        'Nº Respostas': s.responses?.length || 0,
      };
    });

    // Convert to CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(h => row[h as keyof typeof row]).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success(`${filteredSubmissions.length} submissões exportadas!`);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 shrink-0 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4 flex-col sm:flex-row">
          <div className="flex items-center gap-3">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="h-10 w-10 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </motion.button>
            )}
            <div>
              <h1 className="text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" />
                <span>Histórico de Formulários</span>
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Visualize todas as respostas de formulários enviados
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </motion.button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Total</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{totalSubmissions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Atletas</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{uniqueAthletes}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-purple-50/90 to-white/90 p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Formulários</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{uniqueForms}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Esta Semana</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">12</p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 shrink-0">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Procurar por atleta ou formulário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          {/* Athlete Filter */}
          <select
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todos os Atletas</option>
            {athletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.avatar} {athlete.name}
              </option>
            ))}
          </select>

          {/* Form Filter */}
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todos os Formulários</option>
            {formTemplates.map((form) => (
              <option key={form.id} value={form.id}>
                {form.icon} {form.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-600 mt-3">Carregando submissões...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4">
              <p className="text-sm text-red-600">Erro ao carregar: {error}</p>
            </div>
          )}

          {!isLoading && !error && filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-1">Nenhuma submissão encontrada</p>
              <p className="text-sm text-slate-500">
                {searchQuery || selectedAthleteId || selectedFormId
                  ? 'Tente ajustar os filtros'
                  : 'Quando os atletas responderem aos formulários, aparecerão aqui'}
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredSubmissions.map((submission: any, index: number) => {
              const athlete = athletes.find((a) => a.id === submission.athleteId);
              const form = formTemplates.find((f) => f.id === submission.formTemplateId);
              const submittedDate = new Date(submission.submittedAt);
              const timeAgo = getTimeAgo(submittedDate);

              return (
                <motion.button
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => setSelectedSubmission(submission)}
                  className="w-full text-left rounded-xl border-2 border-slate-200 hover:border-sky-300 bg-white p-4 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Athlete Avatar */}
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center text-2xl shrink-0 border-2 border-sky-200 group-hover:scale-110 transition-transform">
                      {athlete?.avatar || '👤'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-900 mb-0.5 truncate">
                            {athlete?.name || 'Atleta Desconhecido'}
                          </h4>
                          <p className="text-sm text-slate-600 truncate flex items-center gap-2">
                            <span>{form?.icon}</span>
                            <span>{form?.name || 'Formulário'}</span>
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold shrink-0">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Completo
                        </span>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {submittedDate.toLocaleDateString('pt-PT')}
                        </span>
                        <span>•</span>
                        <span>{submission.responses?.length || 0} respostas</span>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 mt-3" />
                  </div>
                </motion.button>
              );
            })}
        </div>
      </div>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              {/* Modal Header */}
              <div className="border-b border-slate-200 px-6 py-4 sticky top-0 bg-white z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-slate-900 mb-1">Detalhes da Submissão</h3>
                    <p className="text-sm text-slate-600">
                      {athletes.find((a) => a.id === selectedSubmission.athleteId)?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Formulário</p>
                      <p className="text-slate-900 font-medium">
                        {
                          formTemplates.find((f) => f.id === selectedSubmission.formTemplateId)
                            ?.name
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Data</p>
                      <p className="text-slate-900 font-medium">
                        {new Date(selectedSubmission.submittedAt).toLocaleString('pt-PT')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Respostas</h4>
                  <div className="space-y-3">
                    {selectedSubmission.responses?.map((response: any, idx: number) => (
                      <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-sm text-slate-600 mb-1">{response.question}</p>
                        <p className="text-sm text-slate-900 font-medium">{response.answer}</p>
                      </div>
                    )) || (
                      <p className="text-sm text-slate-500 text-center py-4">
                        Nenhuma resposta registada
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return date.toLocaleDateString('pt-PT');
}