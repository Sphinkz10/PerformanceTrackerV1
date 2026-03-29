/**
 * REPORTS TAB - FASE 4 INTEGRATED ✅
 * Relatórios favoritos e personalizados do atleta
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Star, Download, Share2, Eye, MoreVertical,
  TrendingUp, Calendar, Activity, BarChart3, Clock, Pin
} from 'lucide-react';
import { useAthleteReports } from '@/hooks/use-api';
import { toast } from 'sonner@2.0.3';
import { ReportViewerDrawer } from '../drawers/ReportViewerDrawer';

interface ReportsTabProps {
  athleteId: string;
}

export function ReportsTab({ athleteId }: ReportsTabProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'performance' | 'health' | 'progress'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  // ✅ FASE 4: Fetch real reports from API
  const { reports, grouped, summary, isLoading } = useAthleteReports(
    athleteId, 
    activeFilter === 'all' ? undefined : activeFilter
  );

  // Convert API data to display format
  const displayReports = reports.map((report: any) => ({
    id: report.id,
    title: report.title,
    type: report.type,
    description: report.summary,
    createdAt: report.created_at,
    isPinned: false, // TODO: Add pinning functionality
    isFavorite: false, // TODO: Add favorites functionality
    generatedBy: report.created_by,
    metrics: report.insights?.slice(0, 3).reduce((acc: any, insight: string, idx: number) => {
      acc[`metric${idx + 1}`] = insight;
      return acc;
    }, {}),
    tags: report.metrics_included || [],
    insights: report.insights || [],
    recommendations: report.recommendations || []
  }));

  // Filter reports
  const filteredReports = displayReports.filter(report => {
    if (activeFilter === 'performance') return report.tags.includes('performance');
    if (activeFilter === 'health') return report.tags.includes('health');
    if (activeFilter === 'progress') return report.tags.includes('progress');
    return true;
  });

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'weekly':
        return { icon: Calendar, color: 'bg-sky-500', label: 'Semanal' };
      case 'monthly':
        return { icon: BarChart3, color: 'bg-emerald-500', label: 'Mensal' };
      case 'quarterly':
        return { icon: TrendingUp, color: 'bg-violet-500', label: 'Trimestral' };
      case 'post_game':
        return { icon: Activity, color: 'bg-amber-500', label: 'Pós-Jogo' };
      case 'performance':
        return { icon: TrendingUp, color: 'bg-red-500', label: 'Performance' };
      default:
        return { icon: FileText, color: 'bg-slate-500', label: 'Relatório' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-sky-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Relatórios
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{reports.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Pin className="h-5 w-5 text-amber-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Fixados
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {reports.filter(r => r.isPinned).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-emerald-500" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Favoritos
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {reports.filter(r => r.isFavorite).length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2 overflow-x-auto"
      >
        {(['all', 'performance', 'health', 'progress'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          const labels = {
            all: 'Todos',
            performance: 'Performance',
            health: 'Saúde',
            progress: 'Progresso'
          };

          return (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              {labels[filter]}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center"
        >
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">Nenhum relatório encontrado</h3>
          <p className="text-sm text-slate-600">
            Ajuste os filtros ou crie um novo relatório
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReports.map((report, index) => {
            const config = getTypeConfig(report.type);
            const ReportIcon = config.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all group relative"
              >
                {/* Pin Icon */}
                {report.isPinned && (
                  <div className="absolute top-4 right-4">
                    <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <ReportIcon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">
                        {report.title}
                      </h4>
                      {report.isFavorite && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {report.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(report.createdAt)}</span>
                  </div>
                  <span>•</span>
                  <span>por {report.generatedBy}</span>
                </div>

                {/* Metrics Preview */}
                {report.metrics && (
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                    {Object.entries(report.metrics).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-slate-500 mb-1 capitalize">
                          {key}
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedReportId(report.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/30 text-sm font-semibold"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toast.success('📥 Download iniciado!', {
                      description: `${report.title}.pdf`
                    })}
                    className="h-9 w-9 rounded-xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 flex items-center justify-center transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-slate-600" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toast.success('🔗 Link copiado!', {
                      description: 'Partilha este relatório com a tua equipa'
                    })}
                    className="h-9 w-9 rounded-xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 flex items-center justify-center transition-colors"
                    title="Partilhar"
                  >
                    <Share2 className="h-4 w-4 text-slate-600" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toast.info('⚙️ Menu de opções', {
                      description: 'Editar, Duplicar, Fixar, Eliminar...'
                    })}
                    className="h-9 w-9 rounded-xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 flex items-center justify-center transition-colors"
                    title="Mais opções"
                  >
                    <MoreVertical className="h-4 w-4 text-slate-600" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create New Report Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => toast.info('🚀 Report Builder será implementado em breve!', {
          description: 'Cria relatórios personalizados com o nosso builder visual'
        })}
        className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-sky-300 hover:bg-sky-50 rounded-2xl text-sm font-semibold text-slate-600 hover:text-sky-600 transition-all flex items-center justify-center gap-2"
      >
        <FileText className="h-5 w-5" />
        Criar Novo Relatório
      </motion.button>

      {/* Report Viewer Drawer */}
      <AnimatePresence>
        {selectedReportId && (
          <ReportViewerDrawer
            reportId={selectedReportId}
            onClose={() => setSelectedReportId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}