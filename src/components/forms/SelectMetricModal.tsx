/**
 * SelectMetricModal Component
 * 
 * Modal for selecting an existing metric to link to a form field.
 * 
 * Features:
 * - Fetch and display all workspace metrics
 * - Filter by category (performance, wellness, load, custom)
 * - Search by name
 * - Visual compatibility validation
 * - Transformation configuration
 * - Preview of data flow
 * 
 * Usage:
 * <SelectMetricModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   field={formField}
 *   onSelect={(metricId, config) => handleLinkCreated(metricId, config)}
 * />
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Link2,
  TrendingUp,
  Activity,
  Heart,
  Zap,
  Settings,
  ArrowRight,
  Info,
} from 'lucide-react';
import type {
  Metric,
  MetricType,
  FormField,
  FormFieldMetricMappingType,
  TransformFunction,
} from '@/types/metrics';
import { 
  getCompatibleMetricTypes, 
  checkFieldMetricCompatibility 
} from '@/types/metrics';
import { mockMetrics } from '@/lib/mockDataSprint0';

// ============================================================================
// TYPES
// ============================================================================

export interface TransformConfig {
  mappingType: FormFieldMetricMappingType;
  transformFunction?: TransformFunction;
  transformParams?: Record<string, any>;
}

export interface SelectMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FormField;
  workspaceId: string;
  existingLinkMetricIds?: string[]; // Already linked metrics (to hide)
  onSelect: (metricId: string, config: TransformConfig) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SelectMetricModal: React.FC<SelectMetricModalProps> = ({
  isOpen,
  onClose,
  field,
  workspaceId,
  existingLinkMetricIds = [],
  onSelect,
}) => {
  // State
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [transformConfig, setTransformConfig] = useState<TransformConfig>({
    mappingType: 'direct',
  });

  // Fetch metrics
  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
    }
  }, [isOpen, workspaceId]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // USE MOCK DATA INSTEAD OF API
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get compatible metric types for this field
  const compatibleTypes = useMemo(() => {
    return getCompatibleMetricTypes(field.fieldType);
  }, [field.fieldType]);

  // Filter metrics
  const filteredMetrics = useMemo(() => {
    let result = metrics.filter(m => !existingLinkMetricIds.includes(m.id));

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.category?.toLowerCase().includes(query)
      );
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(m => m.category === categoryFilter);
    }

    return result;
  }, [metrics, searchQuery, categoryFilter, existingLinkMetricIds]);

  // Group metrics by compatibility
  const groupedMetrics = useMemo(() => {
    const compatible: Metric[] = [];
    const incompatible: Metric[] = [];

    filteredMetrics.forEach(metric => {
      const compat = checkFieldMetricCompatibility(field.fieldType, metric.type);
      if (compat.compatible) {
        compatible.push(metric);
      } else {
        incompatible.push(metric);
      }
    });

    return { compatible, incompatible };
  }, [filteredMetrics, field.fieldType]);

  // Handle metric selection
  const handleSelectMetric = (metric: Metric) => {
    setSelectedMetric(metric);
    
    // Auto-detect if transformation needed
    const compat = checkFieldMetricCompatibility(field.fieldType, metric.type);
    if (compat.requiresTransform) {
      // Suggest transform based on field type
      const suggestedTransform = getSuggestedTransform(field, metric);
      setTransformConfig({
        mappingType: 'direct',
        transformFunction: suggestedTransform,
      });
    }
  };

  // Confirm link creation
  const handleConfirm = () => {
    if (!selectedMetric) return;
    onSelect(selectedMetric.id, transformConfig);
    onClose();
  };

  // Get category icon
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'performance':
        return <Zap className="h-4 w-4 text-amber-600" />;
      case 'wellness':
        return <Heart className="h-4 w-4 text-emerald-600" />;
      case 'load':
        return <Activity className="h-4 w-4 text-sky-600" />;
      case 'custom':
        return <Settings className="h-4 w-4 text-violet-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-slate-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50/95 to-white/95">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">
                Ligar Campo a Métrica
              </h2>
              <p className="text-sm text-slate-600">
                Campo: <span className="font-semibold">{field.fieldLabel}</span> ({field.fieldType})
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 p-4 border-b border-slate-200 bg-white">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Procurar métrica..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative w-40">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Todas</option>
                <option value="performance">⚡ Performance</option>
                <option value="wellness">💚 Wellness</option>
                <option value="load">📊 Load</option>
                <option value="custom">⚙️ Custom</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Compatible Metrics */}
                {groupedMetrics.compatible.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Compatíveis ({groupedMetrics.compatible.length})
                      </h3>
                    </div>
                    <div className="grid gap-3">
                      {groupedMetrics.compatible.map(metric => (
                        <MetricCard
                          key={metric.id}
                          metric={metric}
                          field={field}
                          isSelected={selectedMetric?.id === metric.id}
                          isCompatible={true}
                          onClick={() => handleSelectMetric(metric)}
                          getCategoryIcon={getCategoryIcon}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Incompatible Metrics */}
                {groupedMetrics.incompatible.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Incompatíveis ({groupedMetrics.incompatible.length})
                      </h3>
                      <span className="text-xs text-slate-500">
                        (requer transformação manual)
                      </span>
                    </div>
                    <div className="grid gap-3 opacity-50">
                      {groupedMetrics.incompatible.map(metric => (
                        <MetricCard
                          key={metric.id}
                          metric={metric}
                          field={field}
                          isSelected={false}
                          isCompatible={false}
                          onClick={() => {}}
                          getCategoryIcon={getCategoryIcon}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {groupedMetrics.compatible.length === 0 && groupedMetrics.incompatible.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-2">Nenhuma métrica encontrada</p>
                    <p className="text-xs text-slate-500">
                      {searchQuery || categoryFilter !== 'all'
                        ? 'Tenta ajustar os filtros'
                        : 'Cria uma nova métrica para começar'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with selected metric details */}
          {selectedMetric && (
            <div className="border-t border-slate-200 p-6 bg-gradient-to-br from-sky-50/50 to-white">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      Métrica Selecionada
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{selectedMetric.name}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {selectedMetric.type === 'scale' && `Escala ${selectedMetric.scaleMin}-${selectedMetric.scaleMax}`}
                      {selectedMetric.type === 'numeric' && `Numérico ${selectedMetric.unit ? `(${selectedMetric.unit})` : ''}`}
                      {selectedMetric.type === 'boolean' && 'Sim/Não'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Ligar Métrica
                  </span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Footer without selection */}
          {!selectedMetric && !loading && (
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Info className="h-4 w-4" />
                <span>Seleciona uma métrica compatível para continuar</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

interface MetricCardProps {
  metric: Metric;
  field: FormField;
  isSelected: boolean;
  isCompatible: boolean;
  onClick: () => void;
  getCategoryIcon: (category?: string) => React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  field,
  isSelected,
  isCompatible,
  onClick,
  getCategoryIcon,
}) => {
  const compat = checkFieldMetricCompatibility(field.fieldType, metric.type);

  return (
    <motion.button
      whileHover={isCompatible ? { scale: 1.01 } : undefined}
      whileTap={isCompatible ? { scale: 0.99 } : undefined}
      onClick={isCompatible ? onClick : undefined}
      disabled={!isCompatible}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${isSelected
          ? 'border-emerald-400 bg-emerald-50 shadow-md'
          : isCompatible
          ? 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm'
          : 'border-slate-200 bg-slate-50 cursor-not-allowed'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          shrink-0 h-10 w-10 rounded-xl flex items-center justify-center
          ${isSelected ? 'bg-emerald-500' : 'bg-gradient-to-br from-slate-100 to-white'}
        `}>
          {isSelected ? (
            <CheckCircle className="h-5 w-5 text-white" />
          ) : (
            getCategoryIcon(metric.category)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">{metric.name}</h4>
            {isCompatible && compat.requiresTransform && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold uppercase tracking-wide">
                Transform
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
            <span>
              {metric.type === 'scale' && `Escala ${metric.scaleMin || 0}-${metric.scaleMax || 10}`}
              {metric.type === 'numeric' && `Numérico${metric.unit ? ` (${metric.unit})` : ''}`}
              {metric.type === 'boolean' && 'Sim/Não'}
            </span>
            {metric.category && (
              <>
                <span>•</span>
                <span className="capitalize">{metric.category}</span>
              </>
            )}
          </div>

          {!isCompatible && compat.warnings && compat.warnings.length > 0 && (
            <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
              <AlertCircle className="h-3 w-3 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                {compat.warnings[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSuggestedTransform(field: FormField, metric: Metric): TransformFunction {
  // Auto-suggest transforms based on common patterns
  if (field.fieldType === 'number' && metric.type === 'scale') {
    // Check if range needs scaling
    return 'none'; // Can be extended with smart detection
  }
  
  return 'none';
}