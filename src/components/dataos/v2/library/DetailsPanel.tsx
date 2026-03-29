/**
 * 🎨 DETAILS PANEL - ENHANCED
 * Painel lateral direito
 * Mostra stats, dependencies, automations da métrica selecionada
 * 
 * MUDANÇAS VISUAIS:
 * ✅ Responsive width (full mobile, 480px desktop)
 * ✅ Touch targets 44×44px
 * ✅ Padding responsivo
 * ✅ Botões com texto escondido em mobile
 * ✅ Spacing adaptativo
 */

'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Link2,
  Zap,
  AlertTriangle,
  BarChart3,
  Clock,
  Edit2,
  Trash2,
  History,
  Copy,
  Share2,
  ExternalLink,
} from 'lucide-react';
import type { Metric } from '@/types/metrics';
import { mockMetrics } from '@/lib/mockDataSprint0';
import { useResponsive } from '@/hooks/useResponsive'; // 🎨 ENHANCED

interface DetailsPanelProps {
  metric: Metric | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (metric: Metric) => void;
  onDelete?: (metric: Metric) => void;
  onDuplicate?: (metric: Metric) => void;
  onViewHistory?: (metric: Metric) => void;
}

// Mock data for dependencies and automations
const getMockDependencies = (metricId: string) => {
  return [
    { id: 'calc-1', type: 'calculation', name: 'Weekly Average Load', usedIn: 'formula' },
    { id: 'report-1', type: 'report', name: 'Monthly Performance Report', usedIn: 'visualization' },
    { id: 'form-1', type: 'form', name: 'Daily Wellness Check', usedIn: 'data_source' },
  ];
};

const getMockAutomations = (metricId: string) => {
  return [
    {
      id: 'auto-1',
      name: 'Overtraining Alert',
      trigger: 'Value < 60ms for 3 days',
      actions: ['Email coach', 'Flag athlete'],
      isActive: true,
    },
    {
      id: 'auto-2',
      name: 'Weekly Report',
      trigger: 'Every Monday 9AM',
      actions: ['Generate report', 'Send email'],
      isActive: true,
    },
  ];
};

const getMockUsageStats = (metricId: string) => {
  return {
    totalAthletes: 24,
    activeAthletes: 18,
    dataPoints: 432,
    lastUpdate: '2 horas atrás',
    avgValue: 65.4,
    trend: '+12%',
    completionRate: 75,
  };
};

export function DetailsPanel({
  metric,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onViewHistory,
}: DetailsPanelProps) {
  if (!metric) return null;

  const dependencies = getMockDependencies(metric.id);
  const automations = getMockAutomations(metric.id);
  const stats = getMockUsageStats(metric.id);

  const { isMobile } = useResponsive(); // 🎨 ENHANCED

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* 🎨 ENHANCED: Header with responsive padding */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 z-10">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate mb-1">
                    {metric.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    {metric.description || 'Sem descrição'}
                  </p>
                </div>
                {/* 🎨 ENHANCED: Close button with touch target */}
                <button
                  onClick={onClose}
                  className="shrink-0 p-2 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              {/* 🎨 ENHANCED: Quick Actions with responsive layout */}
              <div className={`grid gap-2 mt-3 sm:mt-4 ${isMobile ? 'grid-cols-3' : 'flex'}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(metric)}
                  className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all min-h-[44px] ${
                    isMobile ? 'px-2 flex-col' : 'flex-1 px-3 py-2'
                  }`}
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4 shrink-0" />
                  {!isMobile && <span>Editar</span>}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDuplicate?.(metric)}
                  className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all min-h-[44px] ${
                    isMobile ? 'px-2 flex-col' : 'flex-1 px-3 py-2'
                  }`}
                  title="Duplicar"
                >
                  <Copy className="h-4 w-4 shrink-0" />
                  {!isMobile && <span>Duplicar</span>}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(metric)}
                  className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-xl border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all min-h-[44px] ${
                    isMobile ? 'px-2 flex-col' : 'flex-1 px-3 py-2'
                  }`}
                  title="Deletar"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  {!isMobile && <span>Deletar</span>}
                </motion.button>
              </div>
            </div>

            {/* 🎨 ENHANCED: Content with responsive padding and spacing */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Stats Overview */}
              <section>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-sky-500" />
                  Estatísticas de Uso
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
                    <p className="text-xs text-slate-500 mb-1">Atletas</p>
                    <p className="text-2xl font-semibold text-slate-900">{stats.activeAthletes}</p>
                    <p className="text-xs text-sky-600">de {stats.totalAthletes}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
                    <p className="text-xs text-slate-500 mb-1">Data Points</p>
                    <p className="text-2xl font-semibold text-slate-900">{stats.dataPoints}</p>
                    <p className="text-xs text-emerald-600">{stats.trend} vs anterior</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
                    <p className="text-xs text-slate-500 mb-1">Média Atual</p>
                    <p className="text-2xl font-semibold text-slate-900">{stats.avgValue}</p>
                    <p className="text-xs text-amber-600">{metric.unit || 'units'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-200">
                    <p className="text-xs text-slate-500 mb-1">Completude</p>
                    <p className="text-2xl font-semibold text-slate-900">{stats.completionRate}%</p>
                    <p className="text-xs text-violet-600">últimos 30 dias</p>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">Última atualização:</span>
                    <span className="text-slate-900 font-medium">{stats.lastUpdate}</span>
                  </div>
                </div>
              </section>

              {/* Metadata */}
              <section>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-500" />
                  Metadados
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Tipo</span>
                    <span className="text-sm font-medium text-slate-900">{metric.type}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Categoria</span>
                    <span className="text-sm font-medium text-slate-900">{metric.category}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Agregação</span>
                    <span className="text-sm font-medium text-slate-900">{metric.aggregationMethod}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Baseline</span>
                    <span className="text-sm font-medium text-slate-900">
                      {metric.baselineMethod || 'rolling-average'}
                    </span>
                  </div>

                  {metric.tags && metric.tags.length > 0 && (
                    <div className="flex items-start justify-between py-2">
                      <span className="text-sm text-slate-500">Tags</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                        {metric.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Dependencies */}
              <section>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-violet-500" />
                  Dependências ({dependencies.length})
                </h3>

                {dependencies.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-sm text-slate-500">Nenhuma dependência encontrada</p>
                    <p className="text-xs text-slate-400 mt-1">Esta métrica não é usada em outros locais</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dependencies.map((dep) => (
                      <motion.div
                        key={dep.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-violet-50 border border-violet-200 hover:border-violet-300 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {dep.name}
                            </p>
                            <p className="text-xs text-violet-600 mt-0.5">
                              Usado em: {dep.usedIn}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Automations */}
              <section>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Automações ({automations.length})
                </h3>

                {automations.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-sm text-slate-500">Nenhuma automação configurada</p>
                    <p className="text-xs text-slate-400 mt-1">Cria regras automáticas na aba Automation</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {automations.map((auto) => (
                      <motion.div
                        key={auto.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-sm font-medium text-slate-900 flex-1">
                            {auto.name}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${
                              auto.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {auto.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-700 mb-2">
                          <strong>Trigger:</strong> {auto.trigger}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {auto.actions.map((action, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full bg-amber-100 text-xs text-amber-800"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Warning if dependencies exist */}
              {dependencies.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-1">
                        Atenção ao deletar
                      </p>
                      <p className="text-xs text-red-700">
                        Esta métrica tem {dependencies.length} dependência(s). 
                        Deletar pode quebrar relatórios, cálculos ou formulários.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewHistory?.(metric)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <History className="h-4 w-4" />
                  Ver Histórico Completo
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}