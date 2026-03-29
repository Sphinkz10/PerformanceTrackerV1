/**
 * ARCHIVED METRICS PAGE
 * Página para visualizar e restaurar métricas arquivadas
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Archive, 
  RotateCcw, 
  Trash2, 
  Search, 
  Filter,
  Users,
  Database,
  Calendar,
  ArrowLeft,
  Info
} from 'lucide-react';

interface ArchivedMetric {
  id: string;
  name: string;
  archivedDate: string;
  historicalEntries: number;
  affectedAthletes: number;
  category: string;
}

// Mock data
const MOCK_ARCHIVED: ArchivedMetric[] = [
  {
    id: '1',
    name: 'Força Máxima Squat',
    archivedDate: '15 Jan 2026',
    historicalEntries: 47,
    affectedAthletes: 15,
    category: 'Força',
  },
  {
    id: '2',
    name: 'Velocidade 100m',
    archivedDate: '10 Jan 2026',
    historicalEntries: 32,
    affectedAthletes: 8,
    category: 'Velocidade',
  },
  {
    id: '3',
    name: 'Sleep Quality (Old)',
    archivedDate: '5 Jan 2026',
    historicalEntries: 156,
    affectedAthletes: 25,
    category: 'Wellness',
  },
];

interface ArchivedMetricsPageProps {
  onBack: () => void;
  onRestore: (metricId: string) => void;
  onDeletePermanently: (metricId: string) => void;
}

export function ArchivedMetricsPage({ onBack, onRestore, onDeletePermanently }: ArchivedMetricsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [archivedMetrics] = useState(MOCK_ARCHIVED);

  // Filter
  const filteredMetrics = archivedMetrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(archivedMetrics.map(m => m.category))];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header - NUNCA ESCONDE */}
      <div className="flex-shrink-0 space-y-4 p-6 border-b border-slate-200 bg-slate-50">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Library
        </motion.button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Archive className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">🗃️ Métricas Arquivadas</h1>
              <p className="text-sm text-slate-600">
                Mostrando {filteredMetrics.length} de {archivedMetrics.length} métricas arquivadas
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-sky-900 font-medium mb-1">
                Sobre métricas arquivadas
              </p>
              <p className="text-xs text-sky-700">
                Métricas arquivadas mantêm todos os dados históricos e podem ser restauradas 
                a qualquer momento. Para libertar espaço, pode apagar permanentemente métricas 
                que não precisa mais.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Procurar métrica arquivada..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          <div className="relative w-full sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas categorias' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content - SCROLL SE NECESSÁRIO */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {filteredMetrics.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Nenhuma métrica arquivada encontrada</p>
            <p className="text-sm text-slate-500">
              {searchQuery ? 'Tente ajustar os filtros' : 'Todas as suas métricas estão ativas'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-300 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Metric Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shrink-0">
                          <Archive className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {metric.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            <span>Arquivada: {metric.archivedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-sky-600" />
                          <span className="text-sm text-slate-700">
                            <strong>{metric.historicalEntries}</strong> entradas históricas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-slate-700">
                            <strong>{metric.affectedAthletes}</strong> atletas afetados
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRestore(metric.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restaurar
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDeletePermanently(metric.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Apagar Permanentemente
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
