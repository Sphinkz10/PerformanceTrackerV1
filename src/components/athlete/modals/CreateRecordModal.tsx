/**
 * CREATE RECORD MODAL - DAY 5 ✅
 * 
 * Modal para criar ou editar recordes pessoais manualmente.
 * 
 * Features:
 * - Create/Edit mode
 * - Category selection
 * - Value input with unit
 * - Date selection
 * - Conditions (bodyweight, equipment, location)
 * - Validation notes
 * - Form validation
 * 
 * @author PerformTrack Team
 * @since Day 5 - Personal Records Management
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Trophy, Calendar, Weight, MapPin, Package, 
  Save, AlertCircle, Info, TrendingUp, Plus
} from 'lucide-react';
import { PersonalRecord, RecordSource, RECORD_CATEGORY_LABELS } from '@/types/athlete-profile';
import { toast } from 'sonner@2.0.3';

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  record?: PersonalRecord | null; // For edit mode
  onSave: (data: RecordFormData) => Promise<void>;
}

export interface RecordFormData {
  metric_name: string;
  display_name: string;
  category: string;
  value: number;
  unit: string;
  achieved_at: string;
  source: RecordSource;
  conditions?: {
    bodyweight?: number;
    equipment?: string;
    location?: string;
    notes?: string;
  };
  validation_notes?: string;
}

export function CreateRecordModal({
  isOpen,
  onClose,
  athleteId,
  athleteName,
  record = null,
  onSave
}: CreateRecordModalProps) {
  const isEditMode = !!record;

  // Form state
  const [formData, setFormData] = useState<RecordFormData>({
    metric_name: '',
    display_name: '',
    category: 'strength',
    value: 0,
    unit: 'kg',
    achieved_at: new Date().toISOString().split('T')[0],
    source: 'manual',
    conditions: {},
    validation_notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categories
  const categories = [
    { id: 'strength', label: 'Força', icon: '💪', color: 'violet' },
    { id: 'speed', label: 'Velocidade', icon: '⚡', color: 'sky' },
    { id: 'endurance', label: 'Resistência', icon: '🏃', color: 'emerald' },
    { id: 'power', label: 'Potência', icon: '🔥', color: 'amber' },
    { id: 'skill', label: 'Técnica', icon: '🎯', color: 'indigo' },
    { id: 'mobility', label: 'Mobilidade', icon: '🧘', color: 'pink' }
  ];

  // Common units
  const units = [
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'reps', label: 'Repetições' },
    { value: 's', label: 'Segundos' },
    { value: 'm', label: 'Metros' },
    { value: 'cm', label: 'Centímetros' },
    { value: 'km', label: 'Quilómetros' },
    { value: 'km/h', label: 'Km/h' },
    { value: 'watts', label: 'Watts' },
    { value: '%', label: 'Percentagem (%)' }
  ];

  // Load record data in edit mode
  useEffect(() => {
    if (isEditMode && record) {
      setFormData({
        metric_name: record.metric_name,
        display_name: record.display_name,
        category: record.category || 'strength',
        value: record.value,
        unit: record.unit,
        achieved_at: record.achieved_at.split('T')[0],
        source: record.source,
        conditions: record.conditions || {},
        validation_notes: record.validation_notes || ''
      });
    } else {
      // Reset form for create mode
      setFormData({
        metric_name: '',
        display_name: '',
        category: 'strength',
        value: 0,
        unit: 'kg',
        achieved_at: new Date().toISOString().split('T')[0],
        source: 'manual',
        conditions: {},
        validation_notes: ''
      });
    }
    setErrors({});
  }, [isEditMode, record, isOpen]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Nome do recorde é obrigatório';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (!formData.achieved_at) {
      newErrors.achieved_at = 'Data é obrigatória';
    }

    // Check if date is not in the future
    if (new Date(formData.achieved_at) > new Date()) {
      newErrors.achieved_at = 'Data não pode ser no futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) {
      toast.error('❌ Erro de validação', {
        description: 'Por favor, corrija os erros no formulário.'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Generate metric_name from display_name if not set
      const data = {
        ...formData,
        metric_name: formData.metric_name || formData.display_name.toLowerCase().replace(/\s+/g, '_')
      };

      await onSave(data);
      
      toast.success(isEditMode ? '✅ Recorde atualizado!' : '🏆 Recorde criado!', {
        description: `${formData.display_name} registado com sucesso.`
      });
      
      onClose();
    } catch (error) {
      toast.error('❌ Erro ao guardar', {
        description: 'Não foi possível guardar o recorde.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change
  const handleChange = (field: keyof RecordFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle condition change
  const handleConditionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditMode ? 'Editar Recorde' : 'Criar Novo Recorde'}
                  </h2>
                  <p className="text-amber-100 text-sm mt-0.5">{athleteName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nome do Recorde *
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                placeholder="Ex: Agachamento Máximo, Sprint 100m, etc."
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all ${
                  errors.display_name ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.display_name && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.display_name}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Categoria
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('category', cat.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.category === cat.id
                        ? `border-${cat.color}-400 bg-${cat.color}-50`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{cat.icon}</span>
                    <span className="text-xs font-medium text-slate-700">{cat.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Value and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value || ''}
                  onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all ${
                    errors.value ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.value && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.value}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Unidade
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all appearance-none cursor-pointer"
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Achieved */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data de Conquista *
              </label>
              <input
                type="date"
                value={formData.achieved_at}
                onChange={(e) => handleChange('achieved_at', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all ${
                  errors.achieved_at ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.achieved_at && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.achieved_at}
                </p>
              )}
            </div>

            {/* Conditions (Optional) */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500" />
                Condições (Opcional)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Bodyweight */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    <Weight className="inline h-3 w-3 mr-1" />
                    Peso Corporal (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.conditions?.bodyweight || ''}
                    onChange={(e) => handleConditionChange('bodyweight', parseFloat(e.target.value) || undefined)}
                    placeholder="Ex: 75.5"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all"
                  />
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    <Package className="inline h-3 w-3 mr-1" />
                    Equipamento
                  </label>
                  <input
                    type="text"
                    value={formData.conditions?.equipment || ''}
                    onChange={(e) => handleConditionChange('equipment', e.target.value || undefined)}
                    placeholder="Ex: Sapatilhas Nike"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    Local
                  </label>
                  <input
                    type="text"
                    value={formData.conditions?.location || ''}
                    onChange={(e) => handleConditionChange('location', e.target.value || undefined)}
                    placeholder="Ex: Pista Coberta"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all"
                  />
                </div>
              </div>

              {/* Conditions Notes */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Notas sobre Condições
                </label>
                <textarea
                  value={formData.conditions?.notes || ''}
                  onChange={(e) => handleConditionChange('notes', e.target.value || undefined)}
                  placeholder="Ex: Clima favorável, pista seca, sem vento..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all resize-none"
                />
              </div>
            </div>

            {/* Validation Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notas de Validação (Opcional)
              </label>
              <textarea
                value={formData.validation_notes || ''}
                onChange={(e) => handleChange('validation_notes', e.target.value)}
                placeholder="Ex: Validado em competição oficial, com cronometragem eletrónica..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all resize-none"
              />
            </div>

            {/* Info Box */}
            {!isEditMode && (
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-sky-900">Dica Profissional</p>
                    <p className="text-xs text-sky-700 mt-1">
                      Recordes criados manualmente podem ser editados a qualquer momento. 
                      Recordes detetados automaticamente durante sessões são imutáveis após validação.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditMode ? 'Atualizar' : 'Criar'} Recorde</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
