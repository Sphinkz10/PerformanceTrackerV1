/**
 * CreateMetricFromFieldModal Component
 * 
 * Modal for creating a new metric directly from a form field.
 * Auto-fills metric properties based on field configuration.
 * 
 * Features:
 * - Smart auto-fill based on field type
 * - Category detection from field name
 * - Range mapping (field range → metric scale)
 * - Unit detection
 * - Auto-link after creation
 * - Validation
 * 
 * Usage:
 * <CreateMetricFromFieldModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   field={formField}
 *   workspaceId={workspaceId}
 *   onCreate={(metric) => handleMetricCreated(metric)}
 * />
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Heart,
  Activity,
  Settings,
  Info,
} from 'lucide-react';
import type { Metric, MetricType, MetricCategory } from '@/types/metrics';

// ============================================================================
// TYPES
// ============================================================================

export interface FormField {
  id: string;
  name: string;
  label?: string;
  type: string;
  required: boolean;
  options?: any;
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
}

export interface CreateMetricFromFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FormField;
  workspaceId: string;
  onCreate: (metric: Metric) => void;
}

interface MetricFormData {
  name: string;
  type: MetricType;
  category: MetricCategory;
  unit?: string;
  scaleMin?: number;
  scaleMax?: number;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
  tags: string[];
  description?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateMetricFromFieldModal: React.FC<CreateMetricFromFieldModalProps> = ({
  isOpen,
  onClose,
  field,
  workspaceId,
  onCreate,
}) => {
  const [formData, setFormData] = useState<MetricFormData>(getInitialFormData(field));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when field changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(field));
      setErrors({});
    }
  }, [field, isOpen]);

  // Handle form field change
  const handleChange = (key: keyof MetricFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.type === 'scale') {
      if (formData.scaleMin === undefined || formData.scaleMax === undefined) {
        newErrors.scale = 'Escala min/max é obrigatória';
      } else if (formData.scaleMin >= formData.scaleMax) {
        newErrors.scale = 'Min deve ser menor que Max';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          ...formData,
          aggregationMethod: 'latest',
          baselineMethod: 'rolling-average',
          baselinePeriodDays: 28,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        onCreate(data.data);
        onClose();
      } else {
        setErrors({ submit: data.error || 'Erro ao criar métrica' });
      }
    } catch (error) {
      console.error('Error creating metric:', error);
      setErrors({ submit: 'Erro ao criar métrica' });
    } finally {
      setLoading(false);
    }
  };

  // Get category icon
  const getCategoryIcon = (category: MetricCategory) => {
    switch (category) {
      case 'performance':
        return <Zap className="h-4 w-4" />;
      case 'wellness':
        return <Heart className="h-4 w-4" />;
      case 'load':
        return <Activity className="h-4 w-4" />;
      case 'custom':
        return <Settings className="h-4 w-4" />;
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
          className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-br from-violet-50/95 to-white/95">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 mb-1">
                  Criar Nova Métrica
                </h2>
                <p className="text-sm text-slate-600">
                  A partir do campo: <span className="font-semibold">{field.name}</span>
                </p>
              </div>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Auto-fill Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200">
              <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-sky-900 mb-1">
                  ✨ Auto-preenchido com inteligência
                </p>
                <p className="text-xs text-sky-700">
                  Detetámos automaticamente tipo, categoria e configurações baseadas no teu campo.
                  Podes ajustar conforme necessário.
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nome da Métrica *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`
                  w-full px-4 py-2 text-sm border rounded-xl bg-white
                  focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300
                  transition-all
                  ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}
                `}
                placeholder="ex: Peso Corporal"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value as MetricType)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
                >
                  <option value="scale">📊 Escala</option>
                  <option value="numeric">🔢 Numérico</option>
                  <option value="boolean">✓ Sim/Não</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value as MetricCategory)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
                >
                  <option value="performance">⚡ Performance</option>
                  <option value="wellness">💚 Wellness</option>
                  <option value="load">📊 Load</option>
                  <option value="custom">⚙️ Custom</option>
                </select>
              </div>
            </div>

            {/* Scale Range (only if type is scale) */}
            {formData.type === 'scale' && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Escala (Min - Max) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={formData.scaleMin ?? ''}
                    onChange={(e) => handleChange('scaleMin', parseFloat(e.target.value))}
                    className={`
                      w-full px-4 py-2 text-sm border rounded-xl bg-white
                      focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300
                      transition-all
                      ${errors.scale ? 'border-red-300 bg-red-50' : 'border-slate-200'}
                    `}
                    placeholder="Min (ex: 0)"
                  />
                  <input
                    type="number"
                    value={formData.scaleMax ?? ''}
                    onChange={(e) => handleChange('scaleMax', parseFloat(e.target.value))}
                    className={`
                      w-full px-4 py-2 text-sm border rounded-xl bg-white
                      focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300
                      transition-all
                      ${errors.scale ? 'border-red-300 bg-red-50' : 'border-slate-200'}
                    `}
                    placeholder="Max (ex: 10)"
                  />
                </div>
                {errors.scale && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.scale}
                  </p>
                )}
              </div>
            )}

            {/* Unit (only if type is numeric) */}
            {formData.type === 'numeric' && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Unidade (opcional)
                </label>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                  placeholder="ex: kg, km, min"
                />
              </div>
            )}

            {/* Update Frequency */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Frequência de Atualização
              </label>
              <select
                value={formData.updateFrequency}
                onChange={(e) => handleChange('updateFrequency', e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
              >
                <option value="daily">📅 Diária</option>
                <option value="weekly">📆 Semanal</option>
                <option value="monthly">🗓️ Mensal</option>
                <option value="on-demand">🎯 On-demand</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                placeholder="Descreve o que esta métrica mede..."
              />
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6 bg-gradient-to-br from-slate-50/50 to-white">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:from-violet-400 hover:to-violet-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Criando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Criar e Ligar
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate initial form data based on field properties
 */
function getInitialFormData(field: FormField): MetricFormData {
  // Detect type
  const type = detectMetricType(field);
  
  // Detect category from field name
  const category = detectCategory(field.name || field.label || '');
  
  // Detect unit
  const unit = detectUnit(field);
  
  // Auto-fill scale range if available
  const scaleMin = field.min ?? (type === 'scale' ? 0 : undefined);
  const scaleMax = field.max ?? (type === 'scale' ? 10 : undefined);

  return {
    name: field.label || field.name || 'Nova Métrica',
    type,
    category,
    unit,
    scaleMin,
    scaleMax,
    updateFrequency: 'daily',
    tags: [],
    description: field.description || '',
  };
}

/**
 * Detect metric type from field type
 */
function detectMetricType(field: FormField): MetricType {
  switch (field.type) {
    case 'number':
    case 'range':
    case 'rating':
      return 'scale';
    case 'checkbox':
      return 'boolean';
    default:
      return 'numeric';
  }
}

/**
 * Detect category from field name using keywords
 */
function detectCategory(name: string): MetricCategory {
  const lowerName = name.toLowerCase();
  
  // Performance keywords
  if (lowerName.match(/velocidade|sprint|salto|força|potência|performance|tempo|speed|power/)) {
    return 'performance';
  }
  
  // Wellness keywords
  if (lowerName.match(/sono|stress|fadiga|dor|wellness|sleep|pain|fatigue|peso|weight|frequência cardíaca|heart rate/)) {
    return 'wellness';
  }
  
  // Load keywords
  if (lowerName.match(/carga|volume|intensidade|load|volume|rpe|sessão|session/)) {
    return 'load';
  }
  
  return 'custom';
}

/**
 * Detect unit from field properties
 */
function detectUnit(field: FormField): string | undefined {
  const name = (field.name || field.label || '').toLowerCase();
  
  if (name.match(/kg|kgs|quilos/)) return 'kg';
  if (name.match(/\blbs?\b/)) return 'lbs';
  if (name.match(/\bkm\b|quilómetros/)) return 'km';
  if (name.match(/\bm\b|metros/)) return 'm';
  if (name.match(/min|minutos/)) return 'min';
  if (name.match(/seg|segundos/)) return 's';
  if (name.match(/\bbpm\b/)) return 'bpm';
  if (name.match(/\bcm\b|centímetros/)) return 'cm';
  
  return undefined;
}
