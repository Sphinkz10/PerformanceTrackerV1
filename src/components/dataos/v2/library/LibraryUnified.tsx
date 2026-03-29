/**
 * LIBRARY UNIFIED - FASE 2 DIA 4
 * Consolidates: Templates + Store (Packs) + Active Metrics
 * Quick Filters: [⭐Minhas] [🎯Templates] [🛒Store] [📦Arquivo]
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Plus,
  Grid3x3,
  List,
  Star,
  Target,
  ShoppingBag,
  Archive,
  X,
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { AdvancedFilters, type FilterState } from './AdvancedFilters';
import { MetricCardEnhanced } from './MetricCardEnhanced';
import type { Metric } from '@/types/metrics';

type LibraryFilter = 'mine' | 'templates' | 'store' | 'archived';
type ViewMode = 'grid' | 'list';

interface LibraryUnifiedProps {
  onCreateMetric: () => void;
  onEdit?: (metric: Metric) => void;
  onDelete?: (metric: Metric) => void;
  onViewHistory?: (metric: Metric) => void;
  workspaceId?: string;
  workspaceName?: string;
}

export function LibraryUnified({
  onCreateMetric,
  onEdit,
  onDelete,
  onViewHistory,
  workspaceId,
  workspaceName,
}: LibraryUnifiedProps) {
  const { isMobile, isTablet } = useResponsive();

  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('mine');
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'grid' : 'list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  // ✅ NEW: Selection state for bulk actions
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  
  // ✅ Advanced filters state (matching AdvancedFilters component)
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    status: 'all',
    category: 'all',
    source: 'all',
    usage: 'all',
    tags: [],
  });

  // Mock data - TODO: substituir por API real
  const allMetrics: Metric[] = [
    {
      id: 'metric-1',
      name: 'Squat 1RM',
      description: 'Força máxima no agachamento',
      type: 'scale',
      unit: 'kg',
      rangeMin: 0,
      rangeMax: 300,
      isActive: true,
      isTemplate: false,
      category: 'strength',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'metric-2',
      name: 'FC Repouso',
      description: 'Frequência cardíaca em repouso',
      type: 'scale',
      unit: 'bpm',
      rangeMin: 40,
      rangeMax: 100,
      isActive: true,
      isTemplate: false,
      category: 'wellness',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-16T00:00:00Z',
    },
    {
      id: 'metric-3',
      name: 'Velocidade Sprint 20m',
      description: 'Velocidade máxima em 20 metros',
      type: 'scale',
      unit: 's',
      rangeMin: 2,
      rangeMax: 5,
      isActive: true,
      isTemplate: false,
      category: 'performance',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z',
    },
    {
      id: 'metric-4',
      name: 'RPE Sessão',
      description: 'Rating of Perceived Exertion',
      type: 'scale',
      unit: 'pts',
      rangeMin: 0,
      rangeMax: 10,
      isActive: true,
      isTemplate: false,
      category: 'load',
      createdAt: '2024-01-06T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
    },
    {
      id: 'metric-5',
      name: 'Qualidade do Sono',
      description: 'Avaliação subjetiva da qualidade do sono',
      type: 'scale',
      unit: '/10',
      rangeMin: 0,
      rangeMax: 10,
      isActive: true,
      isTemplate: false,
      category: 'wellness',
      createdAt: '2024-01-07T00:00:00Z',
      updatedAt: '2024-01-21T00:00:00Z',
    },
    {
      id: 'metric-6',
      name: 'Salto Vertical',
      description: 'Altura do salto vertical',
      type: 'scale',
      unit: 'cm',
      rangeMin: 0,
      rangeMax: 100,
      isActive: true,
      isTemplate: false,
      category: 'performance',
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-22T00:00:00Z',
    },
    {
      id: 'template-1',
      name: 'Template: Força Superior',
      description: 'Template para força de trem superior',
      type: 'scale',
      unit: 'kg',
      rangeMin: 0,
      rangeMax: 200,
      isActive: false,
      isTemplate: true,
      category: 'strength',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-17T00:00:00Z',
    },
    {
      id: 'template-2',
      name: 'Template: Wellness Semanal',
      description: 'Template para monitorização wellness',
      type: 'scale',
      unit: 'pts',
      rangeMin: 0,
      rangeMax: 100,
      isActive: false,
      isTemplate: true,
      category: 'wellness',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z',
    },
    {
      id: 'pack-1',
      name: 'HRV - Variabilidade Cardíaca',
      description: 'Da Store: Recovery Monitoring Pack',
      type: 'scale',
      unit: 'ms',
      rangeMin: 0,
      rangeMax: 200,
      isActive: true,
      isFromPack: true,
      packId: 'recovery-monitoring',
      category: 'wellness',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z',
    },
    {
      id: 'pack-2',
      name: 'Hydration Level',
      description: 'Da Store: Performance Essentials',
      type: 'scale',
      unit: 'L',
      rangeMin: 0,
      rangeMax: 5,
      isActive: true,
      isFromPack: true,
      packId: 'performance-essentials',
      category: 'wellness',
      createdAt: '2024-01-09T00:00:00Z',
      updatedAt: '2024-01-23T00:00:00Z',
    },
    {
      id: 'metric-archived',
      name: 'Old Metric',
      description: 'Métrica arquivada - já não utilizada',
      type: 'scale',
      unit: 'kg',
      rangeMin: 0,
      rangeMax: 100,
      isActive: false,
      isTemplate: false,
      category: 'strength',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  // Mock usage data (would come from API)
  const metricUsageData: Record<string, { usageCount: number; lastValue?: number; lastUpdated?: string; trendDirection?: 'up' | 'down' | 'stable' }> = {
    'metric-1': { usageCount: 12, lastValue: 150, lastUpdated: '2024-01-15T10:30:00Z', trendDirection: 'up' },
    'metric-2': { usageCount: 18, lastValue: 58, lastUpdated: '2024-01-16T08:15:00Z', trendDirection: 'stable' },
    'metric-3': { usageCount: 8, lastValue: 3.2, lastUpdated: '2024-01-19T14:20:00Z', trendDirection: 'down' },
    'metric-4': { usageCount: 20, lastValue: 7.5, lastUpdated: '2024-01-20T18:45:00Z', trendDirection: 'up' },
    'metric-5': { usageCount: 15, lastValue: 8, lastUpdated: '2024-01-21T07:00:00Z', trendDirection: 'stable' },
    'metric-6': { usageCount: 10, lastValue: 52, lastUpdated: '2024-01-22T11:30:00Z', trendDirection: 'up' },
    'pack-1': { usageCount: 12, lastValue: 85, lastUpdated: '2024-01-18T09:00:00Z', trendDirection: 'stable' },
    'pack-2': { usageCount: 18, lastValue: 2.5, lastUpdated: '2024-01-23T12:00:00Z', trendDirection: 'up' },
  };

  // Filter options
  const filters = [
    { id: 'mine' as LibraryFilter, label: 'Minhas', emoji: '⭐', color: 'emerald' },
    { id: 'templates' as LibraryFilter, label: 'Templates', emoji: '🎯', color: 'sky' },
    { id: 'store' as LibraryFilter, label: 'Store', emoji: '🛒', color: 'purple' },
    { id: 'archived' as LibraryFilter, label: 'Arquivo', emoji: '📦', color: 'slate' },
  ];

  const filteredMetrics = useMemo(() => {
    return allMetrics
      .filter((m) => {
        // Aplicar filtro ativo
        if (activeFilter === 'mine') {
          return m.isActive && !m.isTemplate && !m.isFromPack;
        }
        if (activeFilter === 'templates') {
          return m.isTemplate;
        }
        if (activeFilter === 'store') {
          return m.isFromPack;
        }
        if (activeFilter === 'archived') {
          return !m.isActive && !m.isTemplate;
        }
        return true;
      })
      .filter((m) => {
        // Aplicar search
        if (searchQuery) {
          return m.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .filter((m) => {
        // Aplicar filtros avançados
        if (advancedFilters.category && m.category !== advancedFilters.category) {
          return false;
        }
        if (advancedFilters.tags.length > 0) {
          const tags = m.tags || [];
          return advancedFilters.tags.every((tag) => tags.includes(tag));
        }
        if (advancedFilters.dateRange) {
          const [startDate, endDate] = advancedFilters.dateRange;
          const createdAt = new Date(m.createdAt);
          return createdAt >= startDate && createdAt <= endDate;
        }
        return true;
      });
  }, [allMetrics, activeFilter, searchQuery, advancedFilters]);

  const getGridColumns = () => {
    if (viewMode === 'list') return 'grid-cols-1';
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Header with Quick Filters - Sticky */}
      <div className="flex-none border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Title Row */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                📚 Library
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {filteredMetrics.length} métrica{filteredMetrics.length !== 1 ? 's' : ''}
                {activeFilter === 'mine' && ' ativas'}
                {activeFilter === 'templates' && ' template'}
                {activeFilter === 'store' && ' na store'}
                {activeFilter === 'archived' && ' arquivada'}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateMetric}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Métrica</span>
              <span className="sm:hidden">Nova</span>
            </motion.button>
          </div>

          {/* Quick Filters - Horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === filter.id
                    ? `bg-gradient-to-r from-${filter.color}-500 to-${filter.color}-600 text-white shadow-lg shadow-${filter.color}-500/30`
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{filter.emoji}</span>
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Procurar métricas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* View Mode Toggle - Desktop only */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFiltersModal(true)}
              className="p-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <Filter className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable with proper spacing for mobile nav */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6">
          {filteredMetrics.length === 0 ? (
            <EmptyState
              icon={
                activeFilter === 'mine'
                  ? Star
                  : activeFilter === 'templates'
                  ? Target
                  : activeFilter === 'store'
                  ? ShoppingBag
                  : Archive
              }
              title={`Nenhuma métrica em ${filters.find((f) => f.id === activeFilter)?.label}`}
              description={
                searchQuery
                  ? 'Tenta ajustar a pesquisa.'
                  : 'Cria uma nova métrica ou importa da Store.'
              }
              action={
                activeFilter === 'mine'
                  ? {
                      label: 'Criar Nova Métrica',
                      onClick: onCreateMetric,
                      icon: Plus,
                    }
                  : undefined
              }
              color="slate"
            />
          ) : (
            <div className={`grid gap-4 ${getGridColumns()}`}>
              {filteredMetrics.map((metric, index) => {
                const usageData = metricUsageData[metric.id] || {};
                return (
                  <MetricCardEnhanced
                    key={metric.id}
                    metric={metric}
                    viewMode={viewMode}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewHistory={onViewHistory}
                    isMobile={isMobile}
                    usageCount={usageData.usageCount}
                    lastValue={usageData.lastValue}
                    lastUpdated={usageData.lastUpdated}
                    trendDirection={usageData.trendDirection}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal (Advanced - not implemented yet) */}
      {showFiltersModal && (
        <ResponsiveModal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title="Filtros Avançados"
          size={isMobile ? 'full' : 'medium'}
        >
          <div className="p-6">
            <AdvancedFilters
              filters={advancedFilters}
              onChange={setAdvancedFilters}
            />
          </div>
        </ResponsiveModal>
      )}
    </div>
  );
}