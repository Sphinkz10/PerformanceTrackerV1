/**
 * 🎨 METRICS GRID VIEW - ENHANCED
 * Visualização em grid/cards das métricas
 * 
 * MUDANÇAS VISUAIS:
 * ✅ Responsive grid dinâmico (1/2/3/4 cols)
 * ✅ Touch targets 44×44px
 * ✅ Category badges com gradiente
 * ✅ Stats grid 2×2 com ícones coloridos
 * ✅ Actions no top-right com hover
 * ✅ Footer com "Ver detalhes" animado
 * ✅ Enhanced empty state
 */

'use client';

import { motion } from 'motion/react';
import {
  Edit2,
  Trash2,
  History,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  BarChart3,
  Copy,
  ChevronRight,
} from 'lucide-react';
import type { Metric, MetricCategory } from '@/types/metrics';

interface MetricsGridViewProps {
  metrics: Metric[];
  onEdit?: (metric: Metric) => void;
  onDelete?: (metric: Metric) => void;
  onViewHistory?: (metric: Metric) => void;
  onDuplicate?: (metric: Metric) => void;
  onCardClick?: (metric: Metric) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  columns?: number; // 🎨 Dynamic columns
}

// 🎨 ENHANCED: Added gradients
const CATEGORY_CONFIG: Record<MetricCategory, { label: string; color: string; emoji: string; gradient: string }> = {
  performance: { 
    label: 'Performance', 
    color: 'red', 
    emoji: '🏃',
    gradient: 'from-red-500 to-red-600'
  },
  wellness: { 
    label: 'Wellness', 
    color: 'emerald', 
    emoji: '💚',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  readiness: { 
    label: 'Readiness', 
    color: 'amber', 
    emoji: '⚡',
    gradient: 'from-amber-500 to-amber-600'
  },
  load: { 
    label: 'Load', 
    color: 'sky', 
    emoji: '📊',
    gradient: 'from-sky-500 to-sky-600'
  },
  psychological: { 
    label: 'Psychological', 
    color: 'violet', 
    emoji: '🧠',
    gradient: 'from-violet-500 to-violet-600'
  },
  custom: { 
    label: 'Custom', 
    color: 'slate', 
    emoji: '⚙️',
    gradient: 'from-slate-500 to-slate-600'
  },
};

// Mock usage stats
const getMockStats = (metricId: string) => {
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    athletes: random(8, 24),
    dataPoints: random(50, 500),
    avgValue: random(40, 90),
    trend: random(-15, 25),
    lastUpdate: random(1, 48),
  };
};

export function MetricsGridView({
  metrics,
  onEdit,
  onDelete,
  onViewHistory,
  onDuplicate,
  onCardClick,
  isMobile = false,
  isTablet = false,
  columns = 3, // Default 3 columns
}: MetricsGridViewProps) {
  // 🎨 ENHANCED: Empty state with animations
  if (metrics.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 shadow-lg"
        >
          <BarChart3 className="h-10 w-10 text-slate-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Nenhuma métrica encontrada
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Ajusta os filtros ou cria uma nova métrica para começar.
        </p>
      </motion.div>
    );
  }

  // 🎨 ENHANCED: Dynamic grid classes based on columns prop
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridClasses} gap-4 sm:gap-5`}>
      {metrics.map((metric, index) => {
        const category = CATEGORY_CONFIG[metric.category || 'custom'];
        const stats = getMockStats(metric.id);
        const trendPositive = stats.trend >= 0;

        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onCardClick?.(metric)}
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer"
          >
            
            {/* 🎨 ENHANCED: Header with category badge + actions */}
            <div className="flex items-start justify-between mb-3 gap-2">
              {/* Category Badge with Gradient */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${category.gradient} text-white shadow-sm`}>
                <span>{category.emoji}</span>
                <span className="hidden sm:inline">{category.label}</span>
              </div>

              {/* 🎨 ENHANCED: Actions in top-right with larger touch targets */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(metric);
                    }}
                    className="p-2 rounded-lg hover:bg-sky-100 text-slate-400 hover:text-sky-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </motion.button>
                )}
                {onDuplicate && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(metric);
                    }}
                    className="p-2 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Duplicar"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                )}
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(metric);
                    }}
                    className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* 🎨 ENHANCED: Title + Description */}
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
                {metric.name}
              </h3>
              {metric.description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {metric.description}
                </p>
              )}
            </div>

            {/* 🎨 ENHANCED: Stats Grid 2×2 with colored icons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Athletes Count */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-sky-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Atletas</p>
                  <p className="text-sm font-bold text-slate-900">{stats.athletes}</p>
                </div>
              </div>

              {/* Data Points */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-4 w-4 text-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Registos</p>
                  <p className="text-sm font-bold text-slate-900">{stats.dataPoints}</p>
                </div>
              </div>

              {/* Average Value */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  trendPositive ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {trendPositive ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Média</p>
                  <p className="text-sm font-bold text-slate-900">{stats.avgValue}</p>
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Trend</p>
                  <p className={`text-sm font-bold ${
                    trendPositive ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {trendPositive ? '+' : ''}{stats.trend}%
                  </p>
                </div>
              </div>
            </div>

            {/* 🎨 ENHANCED: Footer with "Ver detalhes" CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>há {stats.lastUpdate}h</span>
              </div>

              <motion.div 
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:text-sky-700"
                whileHover={{ x: 2 }}
              >
                <span>Ver detalhes</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.div>
            </div>

            {/* 🎨 Status Indicator - Bottom left */}
            <div className="absolute bottom-4 left-4">
              <div className={`h-2 w-2 rounded-full ${metric.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}