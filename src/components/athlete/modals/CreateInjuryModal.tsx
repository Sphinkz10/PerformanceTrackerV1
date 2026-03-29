/**
 * CREATE INJURY MODAL - DAY 6 ✅
 * 
 * Modal profissional para criar ou editar lesões.
 * 
 * Features:
 * - Create/Edit mode
 * - Body part selection com mapa visual (futuro)
 * - Injury type categories
 * - Severity levels
 * - Recovery timeline
 * - Training restrictions
 * - Photo upload support
 * - Treatment plan notes
 * - Medical clearance tracking
 * 
 * @author PerformTrack Team
 * @since Day 6 - Injury Tracking Enhancement
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertCircle, Calendar, Clock, Activity, 
  Save, FileText, Percent, Shield, Stethoscope,
  Image as ImageIcon, Info, Plus
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreateInjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  injury?: Injury | null; // For edit mode
  onSave: (data: InjuryFormData) => Promise<void>;
}

export interface Injury {
  id: string;
  athleteId: string;
  bodyPart: string;
  injuryType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  injuryDate: string;
  description: string;
  expectedRecoveryDays?: number;
  actualRecoveryDays?: number;
  recoveryStatus: 'active' | 'recovering' | 'recovered' | 'chronic';
  affectsTraining: boolean;
  loadModificationPercentage?: number;
  treatmentPlan?: string;
  medicalClearance?: boolean;
  medicalClearanceDate?: string;
  notes?: string;
  photoUrls?: string[];
}

export interface InjuryFormData {
  bodyPart: string;
  injuryType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  injuryDate: string;
  description: string;
  expectedRecoveryDays: number;
  recoveryStatus: 'active' | 'recovering' | 'recovered' | 'chronic';
  affectsTraining: boolean;
  loadModificationPercentage?: number;
  treatmentPlan?: string;
  medicalClearance?: boolean;
  medicalClearanceDate?: string;
  notes?: string;
}

export function CreateInjuryModal({
  isOpen,
  onClose,
  athleteId,
  athleteName,
  injury = null,
  onSave
}: CreateInjuryModalProps) {
  const isEditMode = !!injury;

  // Form state
  const [formData, setFormData] = useState<InjuryFormData>({
    bodyPart: '',
    injuryType: 'strain',
    severity: 'low',
    injuryDate: new Date().toISOString().split('T')[0],
    description: '',
    expectedRecoveryDays: 7,
    recoveryStatus: 'active',
    affectsTraining: true,
    loadModificationPercentage: 70,
    treatmentPlan: '',
    medicalClearance: false,
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Body parts (principais áreas)
  const bodyParts = [
    { id: 'ankle', label: 'Tornozelo', icon: '🦶' },
    { id: 'knee', label: 'Joelho', icon: '🦵' },
    { id: 'thigh', label: 'Coxa', icon: '🦵' },
    { id: 'hip', label: 'Anca', icon: '🏃' },
    { id: 'back', label: 'Costas', icon: '🧍' },
    { id: 'shoulder', label: 'Ombro', icon: '💪' },
    { id: 'elbow', label: 'Cotovelo', icon: '💪' },
    { id: 'wrist', label: 'Pulso', icon: '✋' },
    { id: 'neck', label: 'Pescoço', icon: '👤' },
    { id: 'other', label: 'Outro', icon: '🏥' }
  ];

  // Injury types
  const injuryTypes = [
    { value: 'strain', label: 'Distensão (Strain)', category: 'muscular' },
    { value: 'sprain', label: 'Entorse (Sprain)', category: 'ligamentar' },
    { value: 'tendinitis', label: 'Tendinite', category: 'tendão' },
    { value: 'overuse', label: 'Sobrecarga (Overuse)', category: 'crónica' },
    { value: 'fracture', label: 'Fratura', category: 'óssea' },
    { value: 'contusion', label: 'Contusão', category: 'tecido' },
    { value: 'inflammation', label: 'Inflamação', category: 'tecido' },
    { value: 'tear', label: 'Rotura', category: 'muscular' },
    { value: 'dislocation', label: 'Luxação', category: 'articular' },
    { value: 'other', label: 'Outra', category: 'geral' }
  ];

  // Severity levels
  const severityLevels = [
    { value: 'low', label: 'Leve', color: 'emerald', description: 'Desconforto leve, recuperação rápida' },
    { value: 'medium', label: 'Média', color: 'amber', description: 'Dor moderada, requer atenção' },
    { value: 'high', label: 'Alta', color: 'red', description: 'Dor significativa, limitação funcional' },
    { value: 'critical', label: 'Crítica', color: 'purple', description: 'Lesão grave, requer intervenção médica' }
  ];

  // Load form data in edit mode
  useEffect(() => {
    if (isEditMode && injury) {
      setFormData({
        bodyPart: injury.bodyPart,
        injuryType: injury.injuryType,
        severity: injury.severity,
        injuryDate: injury.injuryDate,
        description: injury.description,
        expectedRecoveryDays: injury.expectedRecoveryDays || 7,
        recoveryStatus: injury.recoveryStatus,
        affectsTraining: injury.affectsTraining,
        loadModificationPercentage: injury.loadModificationPercentage,
        treatmentPlan: injury.treatmentPlan,
        medicalClearance: injury.medicalClearance,
        medicalClearanceDate: injury.medicalClearanceDate,
        notes: injury.notes
      });
    } else {
      // Reset for create mode
      setFormData({
        bodyPart: '',
        injuryType: 'strain',
        severity: 'low',
        injuryDate: new Date().toISOString().split('T')[0],
        description: '',
        expectedRecoveryDays: 7,
        recoveryStatus: 'active',
        affectsTraining: true,
        loadModificationPercentage: 70,
        treatmentPlan: '',
        medicalClearance: false,
        notes: ''
      });
    }
    setErrors({});
  }, [isEditMode, injury, isOpen]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.bodyPart.trim()) {
      newErrors.bodyPart = 'Parte do corpo é obrigatória';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.expectedRecoveryDays < 1) {
      newErrors.expectedRecoveryDays = 'Período de recuperação deve ser maior que zero';
    }

    if (!formData.injuryDate) {
      newErrors.injuryDate = 'Data da lesão é obrigatória';
    }

    // Check if date is not in the future
    if (new Date(formData.injuryDate) > new Date()) {
      newErrors.injuryDate = 'Data não pode ser no futuro';
    }

    if (formData.affectsTraining && !formData.loadModificationPercentage) {
      newErrors.loadModificationPercentage = 'Especifique a modificação de carga';
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
      await onSave(formData);
      
      toast.success(isEditMode ? '✅ Lesão atualizada!' : '🏥 Lesão registada!', {
        description: `${formData.bodyPart} - ${formData.injuryType}`
      });
      
      onClose();
    } catch (error) {
      toast.error('❌ Erro ao guardar', {
        description: 'Não foi possível guardar a lesão.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change
  const handleChange = (field: keyof InjuryFormData, value: any) => {
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
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditMode ? 'Editar Lesão' : 'Registar Nova Lesão'}
                  </h2>
                  <p className="text-red-100 text-sm mt-0.5">{athleteName}</p>
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
            
            {/* Body Part Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Parte do Corpo Afetada *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {bodyParts.map((part) => (
                  <motion.button
                    key={part.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('bodyPart', part.label)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.bodyPart === part.label
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{part.icon}</span>
                    <span className="text-xs font-medium text-slate-700 block">{part.label}</span>
                  </motion.button>
                ))}
              </div>
              {errors.bodyPart && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.bodyPart}
                </p>
              )}
              
              {/* Custom body part input */}
              {formData.bodyPart === 'Outro' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  placeholder="Especifique a parte do corpo..."
                  value={formData.bodyPart === 'Outro' ? '' : formData.bodyPart}
                  onChange={(e) => handleChange('bodyPart', e.target.value)}
                  className="w-full mt-2 px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all"
                />
              )}
            </div>

            {/* Injury Type & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo de Lesão *
                </label>
                <select
                  value={formData.injuryType}
                  onChange={(e) => handleChange('injuryType', e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all appearance-none cursor-pointer"
                >
                  {injuryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Severidade *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {severityLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChange('severity', level.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-semibold transition-all ${
                        formData.severity === level.value
                          ? `border-${level.color}-400 bg-${level.color}-50 text-${level.color}-700`
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                      title={level.description}
                    >
                      {level.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date & Recovery Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Data da Lesão *
                </label>
                <input
                  type="date"
                  value={formData.injuryDate}
                  onChange={(e) => handleChange('injuryDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all ${
                    errors.injuryDate ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.injuryDate && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.injuryDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Recuperação Esperada (dias) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.expectedRecoveryDays}
                  onChange={(e) => handleChange('expectedRecoveryDays', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all ${
                    errors.expectedRecoveryDays ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.expectedRecoveryDays && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.expectedRecoveryDays}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Descrição da Lesão *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva como ocorreu a lesão, sintomas, circunstâncias..."
                rows={3}
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all resize-none ${
                  errors.description ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Training Impact */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                Impacto no Treino
              </h3>
              
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="affectsTraining"
                  checked={formData.affectsTraining}
                  onChange={(e) => handleChange('affectsTraining', e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-2 focus:ring-red-500/30"
                />
                <label htmlFor="affectsTraining" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Esta lesão afeta a capacidade de treino
                </label>
              </div>

              {formData.affectsTraining && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      <Percent className="inline h-3 w-3 mr-1" />
                      Carga Máxima Permitida (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.loadModificationPercentage || 0}
                        onChange={(e) => handleChange('loadModificationPercentage', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-red-600 w-16 text-right">
                        {formData.loadModificationPercentage}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Percentagem da carga normal que o atleta pode suportar durante recuperação
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Treatment Plan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Stethoscope className="inline h-4 w-4 mr-1" />
                Plano de Tratamento (Opcional)
              </label>
              <textarea
                value={formData.treatmentPlan || ''}
                onChange={(e) => handleChange('treatmentPlan', e.target.value)}
                placeholder="Ex: Fisioterapia 3x semana, gelo 15min após treino, anti-inflamatórios..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all resize-none"
              />
            </div>

            {/* Medical Clearance */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="medicalClearance"
                  checked={formData.medicalClearance || false}
                  onChange={(e) => handleChange('medicalClearance', e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                />
                <label htmlFor="medicalClearance" className="text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Clearance Médico Obtido
                </label>
              </div>

              {formData.medicalClearance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Data do Clearance
                  </label>
                  <input
                    type="date"
                    value={formData.medicalClearanceDate || ''}
                    onChange={(e) => handleChange('medicalClearanceDate', e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                  />
                </motion.div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notas Adicionais (Opcional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Qualquer informação adicional relevante..."
                rows={2}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all resize-none"
              />
            </div>

            {/* Warning Alert */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Importante</p>
                  <p className="text-xs text-red-700 mt-1">
                    Esta informação será usada para ajustar automaticamente os treinos e monitorizar a recuperação do atleta.
                    Certifique-se de que todos os dados estão corretos.
                  </p>
                </div>
              </div>
            </div>
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditMode ? 'Atualizar' : 'Registar'} Lesão</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
