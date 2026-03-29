'use client';

/**
 * FASE 3 - SEMANA 4 DIA 3: BULK ENTRY MODAL
 * 
 * Permite coach inserir valores de métrica para MÚLTIPLOS atletas
 * - Select multiple athletes (checkboxes)
 * - Select ONE metric (aplicado a todos)
 * - Two input modes:
 *   1. Same value for all (quick)
 *   2. Different values per athlete (table)
 * - Batch validation
 * - Preview before save
 * - Confirmation step
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Users, 
  Target, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Eye,
  Save,
  ChevronRight,
  Search,
  Check
} from 'lucide-react';
import type { Metric } from '@/types/metrics';

interface BulkEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entries: BulkMetricEntry[]) => void;
  workspaceId: string;
  metrics?: Metric[];
  athletes?: Athlete[];
}

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  number?: string;
}

interface BulkMetricEntry {
  athleteId: string;
  metricId: string;
  value: number | string | boolean;
  timestamp: string;
  notes?: string;
}

interface AthleteValue {
  athleteId: string;
  value: string;
  status?: 'valid' | 'warning' | 'error';
  message?: string;
}

type InputMode = 'same' | 'different';
type Step = 'select' | 'input' | 'preview';

export function BulkEntryModal({
  isOpen,
  onClose,
  onSave,
  workspaceId,
  metrics = [],
  athletes = [],
}: BulkEntryModalProps) {
  // State
  const [step, setStep] = useState<Step>('select');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('same');
  const [sameValue, setSameValue] = useState<string>('');
  const [athleteValues, setAthleteValues] = useState<AthleteValue[]>([]);
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState<string>('');
  const [searchAthlete, setSearchAthlete] = useState<string>('');
  const [validationResults, setValidationResults] = useState<Map<string, any>>(new Map());

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedMetric(null);
      setSelectedAthletes([]);
      setInputMode('same');
      setSameValue('');
      setAthleteValues([]);
      setTimestamp(new Date().toISOString().slice(0, 16));
      setNotes('');
      setSearchAthlete('');
      setValidationResults(new Map());
    }
  }, [isOpen]);

  // Initialize athlete values when athletes selected
  useEffect(() => {
    if (selectedAthletes.length > 0) {
      setAthleteValues(
        selectedAthletes.map(athleteId => ({
          athleteId,
          value: '',
          status: undefined,
        }))
      );
    }
  }, [selectedAthletes]);

  // Filtered athletes for search
  const filteredAthletes = useMemo(() => {
    if (!searchAthlete) return athletes;
    const search = searchAthlete.toLowerCase();
    return athletes.filter(
      athlete =>
        athlete.name.toLowerCase().includes(search) ||
        athlete.number?.includes(search)
    );
  }, [athletes, searchAthlete]);

  // Selected athletes details
  const selectedAthletesDetails = useMemo(() => {
    return athletes.filter(a => selectedAthletes.includes(a.id));
  }, [athletes, selectedAthletes]);

  // Toggle athlete selection
  const toggleAthlete = (athleteId: string) => {
    setSelectedAthletes(prev =>
      prev.includes(athleteId)
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    );
  };

  // Select all athletes
  const selectAll = () => {
    setSelectedAthletes(filteredAthletes.map(a => a.id));
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedAthletes([]);
  };

  // Update individual athlete value
  const updateAthleteValue = (athleteId: string, value: string) => {
    setAthleteValues(prev =>
      prev.map(av =>
        av.athleteId === athleteId
          ? { ...av, value, status: undefined, message: undefined }
          : av
      )
    );
  };

  // Validate value based on metric type
  const validateValue = (value: string, metric: Metric): {
    valid: boolean;
    status: 'valid' | 'warning' | 'error';
    message?: string;
  } => {
    if (!value || value.trim() === '') {
      return { valid: false, status: 'error', message: 'Valor obrigatório' };
    }

    if (metric.type === 'numeric' || metric.type === 'scale') {
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        return { valid: false, status: 'error', message: 'Valor inválido' };
      }

      if (metric.scaleMin !== undefined && numValue < metric.scaleMin) {
        return { 
          valid: false, 
          status: 'error', 
          message: `Mínimo: ${metric.scaleMin}` 
        };
      }

      if (metric.scaleMax !== undefined && numValue > metric.scaleMax) {
        return { 
          valid: false, 
          status: 'error', 
          message: `Máximo: ${metric.scaleMax}` 
        };
      }

      // Mock baseline comparison
      const mockBaseline = metric.scaleMin !== undefined && metric.scaleMax !== undefined
        ? (metric.scaleMin + metric.scaleMax) / 2
        : 50;

      const difference = ((numValue - mockBaseline) / mockBaseline) * 100;

      if (Math.abs(difference) <= 10) {
        return { valid: true, status: 'valid', message: '🟢 Normal' };
      } else if (Math.abs(difference) <= 20) {
        return { 
          valid: true, 
          status: 'warning', 
          message: `🟡 ${difference > 0 ? '+' : ''}${difference.toFixed(0)}%` 
        };
      } else {
        return { 
          valid: true, 
          status: 'warning', 
          message: `🔴 ${difference > 0 ? '+' : ''}${difference.toFixed(0)}%` 
        };
      }
    }

    return { valid: true, status: 'valid' };
  };

  // Validate all values
  const validateAllValues = () => {
    if (!selectedMetric) return false;

    const results = new Map();

    if (inputMode === 'same') {
      const result = validateValue(sameValue, selectedMetric);
      selectedAthletes.forEach(athleteId => {
        results.set(athleteId, result);
      });
      setValidationResults(results);
      return result.valid;
    } else {
      let allValid = true;
      athleteValues.forEach(av => {
        const result = validateValue(av.value, selectedMetric);
        results.set(av.athleteId, result);
        if (!result.valid) allValid = false;
      });
      setValidationResults(results);
      return allValid;
    }
  };

  // Go to next step
  const handleNext = () => {
    if (step === 'select') {
      if (!selectedMetric || selectedAthletes.length === 0) {
        alert('Selecione uma métrica e pelo menos 1 atleta');
        return;
      }
      setStep('input');
    } else if (step === 'input') {
      if (!validateAllValues()) {
        alert('Existem valores inválidos. Corrija antes de continuar.');
        return;
      }
      setStep('preview');
    }
  };

  // Go back
  const handleBack = () => {
    if (step === 'input') {
      setStep('select');
    } else if (step === 'preview') {
      setStep('input');
    }
  };

  // Save all entries
  const handleSave = () => {
    const entries: BulkMetricEntry[] = [];

    if (inputMode === 'same') {
      selectedAthletes.forEach(athleteId => {
        entries.push({
          athleteId,
          metricId: selectedMetric!.id,
          value: selectedMetric!.type === 'boolean' 
            ? sameValue === 'true' 
            : parseFloat(sameValue),
          timestamp,
          notes: notes || undefined,
        });
      });
    } else {
      athleteValues.forEach(av => {
        if (av.value) {
          entries.push({
            athleteId: av.athleteId,
            metricId: selectedMetric!.id,
            value: selectedMetric!.type === 'boolean'
              ? av.value === 'true'
              : parseFloat(av.value),
            timestamp,
            notes: notes || undefined,
          });
        }
      });
    }

    onSave(entries);
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
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Bulk Entry</h2>
                <p className="text-sm text-slate-500">
                  Inserir valores para múltiplos atletas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-center gap-2">
              <StepIndicator
                number={1}
                label="Selecionar"
                active={step === 'select'}
                completed={step !== 'select'}
              />
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <StepIndicator
                number={2}
                label="Inserir Valores"
                active={step === 'input'}
                completed={step === 'preview'}
              />
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <StepIndicator
                number={3}
                label="Confirmar"
                active={step === 'preview'}
                completed={false}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* STEP 1: SELECT */}
            {step === 'select' && (
              <div className="space-y-6">
                {/* Select Metric */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    1. Selecionar Métrica
                  </label>
                  <select
                    value={selectedMetric?.id || ''}
                    onChange={(e) => {
                      const metric = metrics.find(m => m.id === e.target.value);
                      setSelectedMetric(metric || null);
                    }}
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                  >
                    <option value="">Selecione uma métrica...</option>
                    {metrics.map(metric => (
                      <option key={metric.id} value={metric.id}>
                        {metric.name} ({metric.unit || metric.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Athletes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">
                      2. Selecionar Atletas ({selectedAthletes.length})
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Todos
                      </button>
                      <span className="text-xs text-slate-300">|</span>
                      <button
                        onClick={deselectAll}
                        className="text-xs text-slate-600 hover:text-slate-700 font-medium"
                      >
                        Nenhum
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Procurar atleta..."
                      value={searchAthlete}
                      onChange={(e) => setSearchAthlete(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                    />
                  </div>

                  {/* Athletes List */}
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 max-h-80 overflow-y-auto">
                    {filteredAthletes.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        Nenhum atleta encontrado
                      </div>
                    ) : (
                      filteredAthletes.map(athlete => (
                        <label
                          key={athlete.id}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAthletes.includes(athlete.id)}
                            onChange={() => toggleAthlete(athlete.id)}
                            className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500/30"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 text-sm">
                              {athlete.name}
                            </div>
                            {athlete.number && (
                              <div className="text-xs text-slate-500">
                                #{athlete.number}
                              </div>
                            )}
                          </div>
                          {selectedAthletes.includes(athlete.id) && (
                            <Check className="h-4 w-4 text-purple-600" />
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: INPUT VALUES */}
            {step === 'input' && selectedMetric && (
              <div className="space-y-6">
                {/* Input Mode Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Modo de Inserção
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setInputMode('same')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        inputMode === 'same'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 text-sm mb-1">
                        Mesmo Valor
                      </div>
                      <div className="text-xs text-slate-600">
                        Valor igual para todos os atletas
                      </div>
                    </button>
                    <button
                      onClick={() => setInputMode('different')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        inputMode === 'different'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 text-sm mb-1">
                        Valores Diferentes
                      </div>
                      <div className="text-xs text-slate-600">
                        Valor individual por atleta
                      </div>
                    </button>
                  </div>
                </div>

                {/* Metric Info */}
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">
                      {selectedMetric.name}
                    </span>
                  </div>
                  <div className="text-xs text-purple-700">
                    Tipo: {selectedMetric.type} 
                    {selectedMetric.scaleMin !== undefined && selectedMetric.scaleMax !== undefined && 
                      ` | Range: ${selectedMetric.scaleMin}-${selectedMetric.scaleMax}`
                    }
                    {selectedMetric.unit && ` | Unidade: ${selectedMetric.unit}`}
                  </div>
                </div>

                {/* Same Value Input */}
                {inputMode === 'same' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Valor (para todos os {selectedAthletes.length} atletas)
                    </label>
                    {selectedMetric.type === 'scale' ? (
                      <div className="space-y-3">
                        <input
                          type="range"
                          min={selectedMetric.scaleMin || 0}
                          max={selectedMetric.scaleMax || 100}
                          value={sameValue || selectedMetric.scaleMin || 0}
                          onChange={(e) => setSameValue(e.target.value)}
                          className="w-full"
                        />
                        <input
                          type="number"
                          value={sameValue}
                          onChange={(e) => setSameValue(e.target.value)}
                          min={selectedMetric.scaleMin}
                          max={selectedMetric.scaleMax}
                          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                        />
                      </div>
                    ) : selectedMetric.type === 'boolean' ? (
                      <select
                        value={sameValue}
                        onChange={(e) => setSameValue(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                      >
                        <option value="">Selecione...</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={sameValue}
                        onChange={(e) => setSameValue(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                        placeholder="Insira o valor..."
                      />
                    )}
                  </div>
                )}

                {/* Different Values Table */}
                {inputMode === 'different' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Valores Individuais
                    </label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Atleta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Valor
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {athleteValues.map(av => {
                              const athlete = athletes.find(a => a.id === av.athleteId);
                              if (!athlete) return null;

                              return (
                                <tr key={av.athleteId} className="hover:bg-slate-50">
                                  <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-slate-900">
                                      {athlete.name}
                                    </div>
                                    {athlete.number && (
                                      <div className="text-xs text-slate-500">
                                        #{athlete.number}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <input
                                      type="number"
                                      value={av.value}
                                      onChange={(e) => updateAthleteValue(av.athleteId, e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                                      placeholder="Valor..."
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    {av.value && selectedMetric && (
                                      <span className="text-xs">
                                        {validateValue(av.value, selectedMetric).message}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamp & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Timestamp
                    </label>
                    <input
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FileText className="h-3 w-3 inline mr-1" />
                      Notas (opcional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all"
                      placeholder="Notas adicionais..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PREVIEW */}
            {step === 'preview' && selectedMetric && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1">Métrica</div>
                    <div className="text-sm font-semibold text-purple-900">
                      {selectedMetric.name}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Atletas</div>
                    <div className="text-sm font-semibold text-blue-900">
                      {selectedAthletes.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs text-emerald-600 mb-1">Total Inserções</div>
                    <div className="text-sm font-semibold text-emerald-900">
                      {selectedAthletes.length}
                    </div>
                  </div>
                </div>

                {/* Preview Table */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Preview das Inserções
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                              Atleta
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                              Valor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {selectedAthletesDetails.map(athlete => {
                            const value = inputMode === 'same' 
                              ? sameValue 
                              : athleteValues.find(av => av.athleteId === athlete.id)?.value || '';
                            const validation = validationResults.get(athlete.id);

                            return (
                              <tr key={athlete.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                  <div className="text-sm font-medium text-slate-900">
                                    {athlete.name}
                                  </div>
                                  {athlete.number && (
                                    <div className="text-xs text-slate-500">
                                      #{athlete.number}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm font-semibold text-slate-900">
                                    {value} {selectedMetric.unit}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {validation && (
                                    <span className="text-xs">
                                      {validation.message}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Confirme antes de guardar</p>
                      <p className="text-xs">
                        Serão criadas <strong>{selectedAthletes.length} inserções</strong> para a métrica <strong>{selectedMetric.name}</strong>.
                        Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={step === 'select' ? onClose : handleBack}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {step === 'select' ? 'Cancelar' : 'Voltar'}
            </button>

            <div className="flex gap-3">
              {step !== 'preview' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={
                    (step === 'select' && (!selectedMetric || selectedAthletes.length === 0))
                  }
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md hover:from-purple-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continuar</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar Tudo ({selectedAthletes.length})</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Step Indicator Component
function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          active
            ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
            : completed
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-200 text-slate-600'
        }`}
      >
        {completed ? <Check className="h-4 w-4" /> : number}
      </div>
      <span
        className={`text-xs font-medium ${
          active ? 'text-purple-600' : completed ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
