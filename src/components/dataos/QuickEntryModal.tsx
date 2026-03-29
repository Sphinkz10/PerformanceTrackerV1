'use client';

/**
 * FASE 3 - SEMANA 4: QUICK ENTRY MODAL
 * 
 * Permite coach inserir valor de métrica rapidamente para 1 atleta
 * - Select athlete
 * - Select metric
 * - Input value (type-aware)
 * - Timestamp picker
 * - Notes (optional)
 * - Real-time validation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Target, Calendar, FileText, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Metric } from '@/types/metrics';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: MetricEntry) => void;
  workspaceId: string;
  metrics?: Metric[];
  athletes?: Athlete[];
  preselectedMetric?: Metric;
  preselectedAthlete?: Athlete;
}

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  number?: string;
}

interface MetricEntry {
  metricId: string;
  athleteId: string;
  value: number | string | boolean;
  timestamp: string;
  notes?: string;
}

interface ValidationResult {
  valid: boolean;
  warning?: string;
  status?: 'green' | 'yellow' | 'red';
  comparison?: {
    baseline?: number;
    difference?: number;
    previousValue?: number;
  };
}

export function QuickEntryModal({
  isOpen,
  onClose,
  onSave,
  workspaceId,
  metrics = [],
  athletes = [],
  preselectedMetric,
  preselectedAthlete,
}: QuickEntryModalProps) {
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(preselectedMetric || null);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(preselectedAthlete || null);
  const [value, setValue] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult>({ valid: true });
  const [showContext, setShowContext] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSelectedMetric(preselectedMetric || null);
      setSelectedAthlete(preselectedAthlete || null);
      setValue('');
      setTimestamp(new Date().toISOString().slice(0, 16));
      setNotes('');
      setValidation({ valid: true });
      setShowContext(false);
    }
  }, [isOpen, preselectedMetric, preselectedAthlete]);

  // Validate value when it changes
  useEffect(() => {
    if (selectedMetric && value) {
      validateValue(value, selectedMetric);
    }
  }, [value, selectedMetric]);

  const validateValue = (val: string, metric: Metric) => {
    if (!val) {
      setValidation({ valid: true });
      return;
    }

    // Type-specific validation
    if (metric.type === 'numeric' || metric.type === 'scale') {
      const numValue = parseFloat(val);
      
      if (isNaN(numValue)) {
        setValidation({ valid: false, warning: 'Valor deve ser um número' });
        return;
      }

      // Check scale range
      if (metric.scaleMin !== null && numValue < metric.scaleMin) {
        setValidation({ 
          valid: false, 
          warning: `Valor abaixo do mínimo (${metric.scaleMin})` 
        });
        return;
      }

      if (metric.scaleMax !== null && numValue > metric.scaleMax) {
        setValidation({ 
          valid: false, 
          warning: `Valor acima do máximo (${metric.scaleMax})` 
        });
        return;
      }

      // Calculate status based on baseline (mock - real would fetch from API)
      const mockBaseline = metric.scaleMin && metric.scaleMax 
        ? (metric.scaleMin + metric.scaleMax) / 2 
        : numValue;
      
      const difference = ((numValue - mockBaseline) / mockBaseline) * 100;
      let status: 'green' | 'yellow' | 'red' = 'green';
      
      // Simple zone logic (real would use metric zones)
      if (Math.abs(difference) > 20) {
        status = 'red';
      } else if (Math.abs(difference) > 10) {
        status = 'yellow';
      }

      setValidation({
        valid: true,
        status,
        comparison: {
          baseline: mockBaseline,
          difference,
          previousValue: mockBaseline, // Mock - would fetch real previous value
        },
      });
    } else if (metric.type === 'boolean') {
      setValidation({ valid: true, status: 'green' });
    } else {
      setValidation({ valid: true });
    }
  };

  const handleSave = () => {
    if (!selectedMetric || !selectedAthlete || !value) return;

    let finalValue: number | string | boolean = value;

    // Convert based on type
    if (selectedMetric.type === 'numeric' || selectedMetric.type === 'scale') {
      finalValue = parseFloat(value);
    } else if (selectedMetric.type === 'boolean') {
      finalValue = value === 'true' || value === '1';
    }

    const entry: MetricEntry = {
      metricId: selectedMetric.id,
      athleteId: selectedAthlete.id,
      value: finalValue,
      timestamp,
      notes: notes || undefined,
    };

    onSave(entry);
    onClose();
  };

  const renderValueInput = () => {
    if (!selectedMetric) return null;

    if (selectedMetric.type === 'boolean') {
      return (
        <div className="flex gap-3">
          <button
            onClick={() => setValue('true')}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              value === 'true'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
            <span className="block text-sm font-semibold">Sim</span>
          </button>
          <button
            onClick={() => setValue('false')}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              value === 'false'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <X className="h-5 w-5 mx-auto mb-1" />
            <span className="block text-sm font-semibold">Não</span>
          </button>
        </div>
      );
    }

    if (selectedMetric.type === 'scale') {
      return (
        <div className="space-y-3">
          <input
            type="range"
            min={selectedMetric.scaleMin || 1}
            max={selectedMetric.scaleMax || 10}
            step={1}
            value={value || selectedMetric.scaleMin || 1}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{selectedMetric.scaleMin}</span>
            <span className="text-2xl font-bold text-slate-900">{value || '—'}</span>
            <span>{selectedMetric.scaleMax}</span>
          </div>
        </div>
      );
    }

    // Numeric or text
    return (
      <div className="relative">
        <input
          type={selectedMetric.type === 'numeric' ? 'number' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Inserir ${selectedMetric.name.toLowerCase()}...`}
          className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all focus:outline-none ${
            validation.valid
              ? 'border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-500/30'
              : 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/30'
          }`}
        />
        {selectedMetric.unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
            {selectedMetric.unit}
          </span>
        )}
      </div>
    );
  };

  const renderValidationFeedback = () => {
    if (!validation.valid) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{validation.warning}</p>
        </motion.div>
      );
    }

    if (validation.status && validation.comparison) {
      const { difference, baseline, previousValue } = validation.comparison;
      const isIncrease = difference! > 0;

      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border ${
            validation.status === 'green'
              ? 'bg-emerald-50 border-emerald-200'
              : validation.status === 'yellow'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isIncrease ? (
              <TrendingUp className={`h-4 w-4 ${
                validation.status === 'green' ? 'text-emerald-600' :
                validation.status === 'yellow' ? 'text-amber-600' : 'text-red-600'
              }`} />
            ) : (
              <TrendingDown className={`h-4 w-4 ${
                validation.status === 'green' ? 'text-emerald-600' :
                validation.status === 'yellow' ? 'text-amber-600' : 'text-red-600'
              }`} />
            )}
            <p className={`text-sm font-semibold ${
              validation.status === 'green' ? 'text-emerald-700' :
              validation.status === 'yellow' ? 'text-amber-700' : 'text-red-700'
            }`}>
              {isIncrease ? '+' : ''}{difference?.toFixed(1)}% vs baseline
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-slate-500">Baseline: </span>
              <span className="font-medium text-slate-700">{baseline?.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-slate-500">Anterior: </span>
              <span className="font-medium text-slate-700">{previousValue?.toFixed(1)}</span>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-bold text-slate-900">Inserir Métrica</h2>
              <p className="text-xs text-slate-500 mt-1">Entrada rápida de valor</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Select Athlete */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4" />
                Atleta
              </label>
              <select
                value={selectedAthlete?.id || ''}
                onChange={(e) => {
                  const athlete = athletes.find(a => a.id === e.target.value);
                  setSelectedAthlete(athlete || null);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              >
                <option value="">Selecionar atleta...</option>
                {athletes.map((athlete) => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.number ? `#${athlete.number} - ` : ''}{athlete.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Metric */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Target className="h-4 w-4" />
                Métrica
              </label>
              <select
                value={selectedMetric?.id || ''}
                onChange={(e) => {
                  const metric = metrics.find(m => m.id === e.target.value);
                  setSelectedMetric(metric || null);
                  setValue('');
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              >
                <option value="">Selecionar métrica...</option>
                {metrics.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name} ({metric.unit})
                  </option>
                ))}
              </select>
              {selectedMetric && (
                <p className="text-xs text-slate-500 px-1">
                  {selectedMetric.description}
                </p>
              )}
            </div>

            {/* Value Input */}
            {selectedMetric && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Valor
                </label>
                {renderValueInput()}
              </div>
            )}

            {/* Validation Feedback */}
            {value && renderValidationFeedback()}

            {/* Timestamp */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4" />
                Data/Hora
              </label>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            {/* Notes (Optional) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="h-4 w-4" />
                Notas <span className="text-xs text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicionar contexto ou observações..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!selectedMetric || !selectedAthlete || !value || !validation.valid}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                selectedMetric && selectedAthlete && value && validation.valid
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Guardar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
