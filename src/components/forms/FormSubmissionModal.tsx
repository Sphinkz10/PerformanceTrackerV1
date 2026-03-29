/**
 * FormSubmissionModal Component
 * 
 * Modal for submitting forms and sending data to metrics.
 * Shows preview of what will be submitted, validates data,
 * and provides feedback on success/failure.
 * 
 * Usage:
 * <FormSubmissionModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   formId="form-123"
 *   formName="Wellness Check-in"
 *   fields={fields}
 *   links={links}
 *   athleteId="athlete-1"
 *   workspaceId="workspace-1"
 *   onSuccess={(result) => { ... }}
 * />
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  Info,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import type {
  FormField,
  FormFieldMetricLinkWithDetails,
} from '@/types/metrics';
import type { FormSubmissionData, SubmissionResult } from '@/hooks/useFormSubmission';
import { MetricLinkBadge } from './MetricLinkBadge';

// ============================================================================
// TYPES
// ============================================================================

export interface FormSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  formName: string;
  fields: FormField[];
  links: FormFieldMetricLinkWithDetails[];
  athleteId: string;
  workspaceId: string;
  initialData?: FormSubmissionData;
  onSuccess?: (result: SubmissionResult) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const FormSubmissionModal: React.FC<FormSubmissionModalProps> = (({
  isOpen,
  onClose,
  formId,
  formName,
  fields,
  links,
  athleteId,
  workspaceId,
  initialData = {},
  onSuccess,
}) => {
  // State
  const [formData, setFormData] = useState<FormSubmissionData>(initialData);
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  
  // FIX #3: Track if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  // Submission hook
  const { submitForm, isSubmitting, error, result, reset } = useFormSubmission({
    formId,
    workspaceId,
    athleteId,
    onSuccess: (res) => {
      // FIX #3: Only update state if component is still mounted
      if (isMountedRef.current) {
        setStep('success');
        if (onSuccess) {
          onSuccess(res);
        }
      }
    },
  });

  // FIX #22: Use refs to avoid stale closure in callbacks
  const onSuccessRef = useRef(onSuccess);
  const onCloseRef = useRef(onClose);

  // Update refs when props change
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onCloseRef.current = onClose;
  }, [onSuccess, onClose]);
  
  // FIX #3: Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get only linked fields (optimized with Set for O(n) instead of O(n²))
  const linkedFields = useMemo(() => {
    // Create Set of linked field IDs for O(1) lookup
    const linkedFieldIds = new Set(
      links
        .filter(link => link.isActive)
        .map(link => link.fieldId)
    );
    
    // Filter fields using Set.has() - O(n + m) instead of O(n*m)
    return fields.filter(field => linkedFieldIds.has(field.id));
  }, [fields, links]);

  // Check if form is valid
  // CRITICAL FIX: Only validate REQUIRED fields, not all linked fields
  // Bug #20: UI was contradicting hook behavior (hook allows empty submissions)
  const isFormValid = useMemo(() => {
    // Check that all REQUIRED linked fields have values
    return linkedFields.every(field => {
      // Optional fields can be empty
      if (!field.required) {
        return true;
      }
      
      const value = formData[field.id];
      
      // For checkboxes, false is a valid value
      if (field.fieldType === 'checkbox') {
        return value !== undefined && value !== null;
      }
      
      // For other fields, check for non-empty values
      return value !== undefined && value !== null && value !== '';
    });
  }, [linkedFields, formData]);

  // Handle input change
  const handleChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  // Handle submit (memoized)
  const handleSubmit = useCallback(async () => {
    if (!isFormValid) return;

    if (step === 'input') {
      // Move to confirmation
      setStep('confirm');
    } else if (step === 'confirm') {
      // Submit data
      await submitForm(formData, links);
    }
  }, [isFormValid, step, submitForm, formData, links]);

  // Handle close (memoized)
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      reset();
      setStep('input');
      setFormData(initialData);
      onCloseRef.current();
    }
  }, [isSubmitting, reset, initialData, onCloseRef]);

  // Get field value display
  const getFieldValueDisplay = (field: FormField): string => {
    const value = formData[field.id];
    if (value === undefined || value === null || value === '') {
      return '—';
    }
    
    if (field.fieldType === 'checkbox') {
      return value === true ? 'Sim' : 'Não';
    }
    
    if (field.fieldType === 'select' && field.options) {
      const option = field.options.find(opt => opt.value === value);
      return option?.label || String(value);
    }
    
    return String(value);
  };

  // Get link for field
  const getLinkForField = (fieldId: string): FormFieldMetricLinkWithDetails | undefined => {
    return links.find(link => link.fieldId === fieldId && link.isActive);
  };

  // FIX #18: Sync formData when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // FIX #19: Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">
                {step === 'input' && '📝 Preencher Formulário'}
                {step === 'confirm' && '✅ Confirmar Submissão'}
                {step === 'success' && '🎉 Submissão Completa!'}
              </h2>
              <p className="text-sm text-slate-600">
                {formName}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5 text-slate-500" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Input */}
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {linkedFields.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600">
                      Nenhum field linkado a métricas
                    </p>
                  </div>
                ) : (
                  linkedFields.map(field => {
                    const link = getLinkForField(field.id);
                    return (
                      <FormFieldInput
                        key={field.id}
                        field={field}
                        link={link}
                        value={formData[field.id]}
                        onChange={(value) => handleChange(field.id, value)}
                      />
                    );
                  })
                )}
              </motion.div>
            )}

            {/* Step 2: Confirmation */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-sky-700">
                      <p className="font-semibold mb-1">Confirma os dados antes de submeter</p>
                      <p>Estes valores serão registados nas métricas do atleta.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {linkedFields.map(field => {
                    const link = getLinkForField(field.id);
                    if (!link) return null;

                    return (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-900 mb-1">
                              {field.fieldLabel}
                            </h4>
                            <p className="text-xs text-slate-600">
                              Valor: <span className="font-semibold">{getFieldValueDisplay(field)}</span>
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                          <div className="flex-1">
                            <MetricLinkBadge
                              metric={link.metric}
                              isCompatible={true}
                            />
                            {link.transformFunction && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-violet-600">
                                <Sparkles className="h-3 w-3" />
                                <span>Transformação aplicada</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && result && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </motion.div>

                <h3 className="font-semibold text-slate-900 mb-2">
                  Formulário Submetido!
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  {result.metricsCreated} {result.metricsCreated === 1 ? 'métrica foi registada' : 'métricas foram registadas'} com sucesso.
                </p>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                    <p className="text-2xl font-semibold text-emerald-600">
                      {result.metricsCreated}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">Sucesso</p>
                  </div>
                  {result.metricsFailed > 0 && (
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                      <p className="text-2xl font-semibold text-red-600">
                        {result.metricsFailed}
                      </p>
                      <p className="text-xs text-red-700 mt-1">Falhados</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-semibold mb-1">Erro ao submeter</p>
                  <p>{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            {step === 'input' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </motion.button>
              </>
            )}

            {step === 'confirm' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('input')}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Voltar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      A submeter...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submeter Formulário
                    </>
                  )}
                </motion.button>
              </>
            )}

            {step === 'success' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                Fechar
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// ============================================================================
// FORM FIELD INPUT COMPONENT
// ============================================================================

interface FormFieldInputProps {
  field: FormField;
  link?: FormFieldMetricLinkWithDetails;
  value: any;
  onChange: (value: any) => void;
}

const FormFieldInput: React.FC<FormFieldInputProps> = ({
  field,
  link,
  value,
  onChange,
}) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white">
      {/* Field label */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <label className="block text-sm font-semibold text-slate-900">
          {field.fieldLabel}
          {field.required && <span className="text-red-600 ml-1">*</span>}
        </label>
        {link && (
          <MetricLinkBadge
            metric={link.metric}
            isCompatible={true}
            className="shrink-0"
          />
        )}
      </div>

      {/* Input field */}
      {field.fieldType === 'number' && (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            // CRITICAL FIX #24: Make number input consistent with text inputs
            // Empty = '' (not null) for consistent validation
            if (e.target.value === '') {
              onChange(''); // Empty string like text inputs
            } else {
              const numValue = Number(e.target.value);
              // Only update if valid number (not NaN)
              if (!isNaN(numValue) && isFinite(numValue)) {
                onChange(numValue);
              }
            }
          }}
          placeholder={field.placeholder}
          required={field.required}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
      )}

      {field.fieldType === 'text' && (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
      )}

      {field.fieldType === 'textarea' && (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={3}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
        />
      )}

      {field.fieldType === 'select' && field.options && (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        >
          <option value="">Seleciona uma opção...</option>
          {field.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {field.fieldType === 'checkbox' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500/30"
          />
          <span className="text-sm text-slate-700">
            {field.placeholder || 'Ativar'}
          </span>
        </label>
      )}

      {field.fieldType === 'date' && (
        <input
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
      )}

      {/* FIX #28: Duration field type implementation */}
      {field.fieldType === 'duration' && (
        <div className="space-y-2">
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              // Accept HH:MM:SS format or number (seconds)
              if (/^\d{0,2}:?\d{0,2}:?\d{0,2}$/.test(val) || /^\d+$/.test(val)) {
                onChange(val);
              }
            }}
            placeholder="HH:MM:SS ou segundos"
            required={field.required}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
          <p className="text-xs text-slate-500">
            Formato: HH:MM:SS (ex: 01:30:45) ou segundos (ex: 5430)
          </p>
        </div>
      )}

      {/* FIX #28: Time field type implementation */}
      {field.fieldType === 'time' && (
        <div className="space-y-2">
          <input
            type="time"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
          <p className="text-xs text-slate-500">
            Formato: HH:MM (ex: 14:30)
          </p>
        </div>
      )}
    </div>
  );
});