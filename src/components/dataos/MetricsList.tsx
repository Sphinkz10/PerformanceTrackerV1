/**
 * FASE 2: Metrics List
 * Lista completa de métricas com filtros e ações
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Plus, Edit2, Trash2, Tag, TrendingUp, Zap, Package, BarChart3 } from 'lucide-react';
import type { Metric, MetricCategory } from '@/types/metrics';
import type { ActivePack } from '@/types/packs';
import { ActivePacksSection } from './ActivePacksSection';

interface MetricsListProps {
  metrics?: Metric[];
  onEdit?: (metric: Metric) => void;
  onDelete?: (metric: Metric) => void;
  onCreate?: () => void;
  onBrowsePacks?: () => void; // NEW: FASE 4
  onViewHistory?: (metric: Metric) => void; // NEW: FASE 5
  // FASE 4: Active Packs props
  activePacks?: ActivePack[];
  isPacksLoading?: boolean;
  onViewPackMetrics?: (packId: string, metricIds: string[]) => void;
  onDeactivatePack?: (pack: ActivePack) => void;
}

const CATEGORY_CONFIG: Record<MetricCategory, { label: string; color: string; icon: string }> = {
  performance: { label: 'Performance', color: 'red', icon: '🏃' },
  wellness: { label: 'Wellness', color: 'emerald', icon: '💚' },
  readiness: { label: 'Readiness', color: 'amber', icon: '⚡' },
  load: { label: 'Load', color: 'sky', icon: '📊' },
  psychological: { label: 'Psychological', color: 'violet', icon: '🧠' },
  custom: { label: 'Custom', color: 'slate', icon: '⚙️' },
};

export function MetricsList({
  metrics = [],
  onEdit,
  onDelete,
  onCreate,
  onBrowsePacks, // NEW: FASE 4
  onViewHistory, // NEW: FASE 5
  // FASE 4: Active Packs props
  activePacks,
  isPacksLoading,
  onViewPackMetrics,
  onDeactivatePack,
}: MetricsListProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MetricCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'created_at'>('name');

  // Filter & Sort
  const filtered = metrics
    .filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
      return matchesSearch && matchesCategory && m.isActive;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'created_at') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  // Group by category for stats
  const categoryCounts = metrics.reduce((acc, m) => {
    if (m.isActive) {
      acc[m.category] = (acc[m.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<MetricCategory, number>);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Metrics Library</h2>
          <p className="text-sm text-slate-600 mt-1">
            {filtered.length} of {metrics.filter(m => m.isActive).length} active metrics
          </p>
        </div>

        <div className="flex gap-3">
          {/* FASE 4: Browse Packs Button */}
          {onBrowsePacks && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBrowsePacks}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white text-purple-700 hover:border-purple-400 hover:shadow-lg transition-all"
            >
              <Package className="h-4 w-4" />
              Browse Packs
            </motion.button>
          )}

          {/* Create Metric Button */}
          {onCreate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreate}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              New Metric
            </motion.button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCategoryFilter('all')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${categoryFilter === 'all'
              ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-700/30'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
        >
          All
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${categoryFilter === 'all' ? 'bg-white/20' : 'bg-slate-100'
            }`}>
            {metrics.filter(m => m.isActive).length}
          </span>
        </motion.button>

        {(Object.keys(CATEGORY_CONFIG) as MetricCategory[]).map((category) => {
          const config = CATEGORY_CONFIG[category];
          const count = categoryCounts[category] || 0;

          return (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCategoryFilter(category)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${categoryFilter === category
                  ? `bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white shadow-lg shadow-${config.color}-500/30`
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
            >
              <span className="text-lg">{config.icon}</span>
              {config.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${categoryFilter === category ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search metrics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>

        {/* Sort */}
        <div className="relative flex-1 sm:flex-none sm:w-40">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="created_at">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* FASE 4: Active Packs Section */}
      {activePacks !== undefined && onViewPackMetrics && onDeactivatePack && (
        <ActivePacksSection
          packs={activePacks}
          isLoading={isPacksLoading}
          onViewMetrics={onViewPackMetrics}
          onDeactivate={onDeactivatePack}
        />
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((metric, index) => {
          const config = CATEGORY_CONFIG[metric.category] || CATEGORY_CONFIG.custom; // ✅ FIX: Fallback para custom se categoria inválida

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br from-${config.color}-500 to-${config.color}-600 flex items-center justify-center text-lg`}>
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 leading-tight">{metric.name}</h3>
                    <span className={`text-xs font-medium text-${config.color}-600`}>
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(metric)}
                      className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 text-sky-600" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(metric)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                  {onViewHistory && (
                    <button
                      onClick={() => onViewHistory(metric)}
                      className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                      title="View History"
                    >
                      <BarChart3 className="h-4 w-4 text-slate-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {metric.description && (
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {metric.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {metric.type}
                </span>
                {metric.unit && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                    {metric.unit}
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-md text-xs font-medium">
                  <Zap className="h-3 w-3" />
                  {metric.aggregationMethod}
                </span>
              </div>

              {/* Tags */}
              {metric.tags && metric.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {metric.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full text-xs font-medium"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                  {metric.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      +{metric.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Scale Range (if applicable) */}
              {metric.type === 'scale' && metric.scaleMin !== undefined && metric.scaleMax !== undefined && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Range:</span>
                    <span className="font-semibold text-slate-900">
                      {metric.scaleMin} - {metric.scaleMax}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-600`}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No metrics found</h3>
          <p className="text-sm text-slate-600 mb-6">
            {search || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first metric to get started'}
          </p>
          {onCreate && !search && categoryFilter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreate}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
            >
              <Plus className="h-4 w-4" />
              Create First Metric
            </motion.button>
          )}
          {onBrowsePacks && !search && categoryFilter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBrowsePacks}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
            >
              Browse Packs
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}