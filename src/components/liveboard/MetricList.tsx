/**
 * METRIC LIST - Live Board
 * Lista de métricas do atleta com status e ações
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, TrendingUp, TrendingDown, Minus, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import {
  type AthleteMetric,
  getCategoryEmoji,
  getCategoryLabel,
  getMetricsByCategory,
  getCategoryStatus,
} from '@/lib/athleteUtils';

interface MetricListProps {
  metrics: AthleteMetric[];
  limit?: number;
  onAddValue?: (metricId: string) => void;
  onViewHistory?: (metricId: string) => void;
  groupByCategory?: boolean;
  collapsible?: boolean;
}

export function MetricList({
  metrics,
  limit,
  onAddValue,
  onViewHistory,
  groupByCategory = true,
  collapsible = true,
}: MetricListProps) {
  const displayedMetrics = limit ? metrics.slice(0, limit) : metrics;

  if (!groupByCategory) {
    return (
      <div className="space-y-2">
        {displayedMetrics.map((metric, index) => (
          <MetricItem
            key={metric.id}
            metric={metric}
            index={index}
            onAddValue={onAddValue}
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    );
  }

  // Group by category
  const categories = Array.from(new Set(metrics.map((m) => m.category)));

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const categoryMetrics = getMetricsByCategory(metrics, category);
        const categoryStatus = getCategoryStatus(metrics, category);
        
        return (
          <CategorySection
            key={category}
            category={category}
            metrics={categoryMetrics}
            status={categoryStatus}
            collapsible={collapsible}
            onAddValue={onAddValue}
            onViewHistory={onViewHistory}
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// CATEGORY SECTION
// ============================================================================

interface CategorySectionProps {
  category: string;
  metrics: AthleteMetric[];
  status: 'green' | 'yellow' | 'red';
  collapsible: boolean;
  onAddValue?: (metricId: string) => void;
  onViewHistory?: (metricId: string) => void;
}

function CategorySection({
  category,
  metrics,
  status,
  collapsible,
  onAddValue,
  onViewHistory,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const emoji = getCategoryEmoji(category);
  const label = getCategoryLabel(category);

  const statusColors = {
    green: 'text-emerald-600',
    yellow: 'text-amber-600',
    red: 'text-red-600',
  };

  const statusEmoji = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-2.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors ${
          !collapsible ? 'cursor-default' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </motion.div>
          )}
          <span className="text-base">{emoji}</span>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500">{metrics.length}</span>
          <span className={statusColors[status]}>{statusEmoji[status]}</span>
        </div>
      </button>

      {/* Metrics List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2">
              {metrics.map((metric, index) => (
                <MetricItem
                  key={metric.id}
                  metric={metric}
                  index={index}
                  onAddValue={onAddValue}
                  onViewHistory={onViewHistory}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// METRIC ITEM
// ============================================================================

interface MetricItemProps {
  metric: AthleteMetric;
  index: number;
  onAddValue?: (metricId: string) => void;
  onViewHistory?: (metricId: string) => void;
}

function MetricItem({ metric, index, onAddValue, onViewHistory }: MetricItemProps) {
  const statusColors = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusEmoji = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴',
  };

  const getTrendIcon = () => {
    if (metric.change > 0) {
      return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    } else if (metric.change < 0) {
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    } else {
      return <Minus className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
    >
      {/* Metric Info */}
      <button
        onClick={() => onViewHistory?.(metric.id)}
        className="flex-1 text-left min-w-0"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-900 truncate">
            {metric.name}
          </span>
          {metric.status === 'red' && (
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Value */}
          <span className="text-xs font-semibold text-slate-700">
            {metric.value}
            {metric.unit}
          </span>

          {/* Status */}
          <span className="text-xs">{statusEmoji[metric.status]}</span>

          {/* Change */}
          {metric.change !== 0 && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${
                metric.change > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metric.changeLabel}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Add Value Button */}
      {onAddValue && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddValue(metric.id)}
          className="shrink-0 h-7 w-7 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          title="Adicionar valor"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
