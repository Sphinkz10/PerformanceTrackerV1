/**
 * SMART ENTRY MODAL - FASE 3 DIA 8
 * Consolidates: Quick Entry (Single) + Bulk Entry (Multiple)
 * 
 * FEATURES:
 * - Toggle: Single ↔ Bulk mode
 * - Single: 1 athlete, 1 metric, responsive form (2 cols desktop, 1 col mobile)
 * - Bulk: Multiple athletes, table desktop, cards mobile
 * - Smart keyboard (number/date inputs)
 * - Inline validation
 * - Save + Continue (quick workflow)
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Users,
  Save,
  Plus,
  Trash2,
  Calendar,
  Target,
  Hash,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';
import type { Metric } from '@/types/metrics';

type EntryMode = 'single' | 'bulk';

interface SmartEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: EntryMode;
  preSelectedMetric?: Metric;
  preSelectedAthleteId?: string;
  availableMetrics?: Metric[];
  availableAthletes?: Array<{ id: string; name: string; avatar?: string }>;
  onSave?: (data: EntryData | EntryData[]) => Promise<void>;
}

interface EntryData {
  athleteId: string;
  metricId: string;
  value: number | string | boolean;
  date: string;
  notes?: string;
}

interface BulkRow {
  id: string;
  athleteId: string;
  value: string;
  error?: string;
}

export function SmartEntryModal({
  isOpen,
  onClose,
  initialMode = 'single',
  preSelectedMetric,
  preSelectedAthleteId,
  availableMetrics = [],
  availableAthletes = [],
  onSave,
}: SmartEntryModalProps) {
  const { isMobile, isTablet } = useResponsive();
  
  const [mode, setMode] = useState<EntryMode>(initialMode);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Single mode state
  const [selectedAthleteId, setSelectedAthleteId] = useState(preSelectedAthleteId || '');
  const [selectedMetricId, setSelectedMetricId] = useState(preSelectedMetric?.id || '');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Bulk mode state
  const [bulkMetricId, setBulkMetricId] = useState(preSelectedMetric?.id || '');
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>(
    availableAthletes.slice(0, 5).map((athlete) => ({
      id: athlete.id,
      athleteId: athlete.id,
      value: '',
    }))
  );

  const selectedMetric = availableMetrics.find(m => 
    mode === 'single' ? m.id === selectedMetricId : m.id === bulkMetricId
  );

  // ============================================================================
  // VALIDATION
  // ============================================================================
  
  const validateSingle = (): string | null => {
    if (!selectedAthleteId) return 'Seleciona um atleta';
    if (!selectedMetricId) return 'Seleciona uma métrica';
    if (!value.trim()) return 'Introduz um valor';
    if (!date) return 'Seleciona uma data';
    
    // Validate numeric value for scale metrics
    if (selectedMetric?.type === 'scale') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'Valor deve ser numérico';
      if (selectedMetric.scaleMin !== undefined && numValue < selectedMetric.scaleMin) {
        return `Valor mínimo: ${selectedMetric.scaleMin}`;
      }
      if (selectedMetric.scaleMax !== undefined && numValue > selectedMetric.scaleMax) {
        return `Valor máximo: ${selectedMetric.scaleMax}`;
      }
    }
    
    return null;
  };

  const validateBulk = (): boolean => {
    if (!bulkMetricId) return false;
    if (!bulkDate) return false;
    
    // At least one row must have a value
    const hasValues = bulkRows.some(row => row.value.trim() !== '');
    if (!hasValues) return false;
    
    // Validate all non-empty rows
    let allValid = true;
    const updatedRows = bulkRows.map(row => {
      if (row.value.trim() === '') return row;
      
      if (selectedMetric?.type === 'scale') {
        const numValue = parseFloat(row.value);
        if (isNaN(numValue)) {
          allValid = false;
          return { ...row, error: 'Inválido' };
        }
        if (selectedMetric.scaleMin !== undefined && numValue < selectedMetric.scaleMin) {
          allValid = false;
          return { ...row, error: `Min: ${selectedMetric.scaleMin}` };
        }
        if (selectedMetric.scaleMax !== undefined && numValue > selectedMetric.scaleMax) {
          allValid = false;
          return { ...row, error: `Max: ${selectedMetric.scaleMax}` };
        }
      }
      
      return { ...row, error: undefined };
    });
    
    setBulkRows(updatedRows);
    return allValid;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleSaveSingle = async () => {
    const error = validateSingle();
    if (error) {
      alert(error);
      return;
    }
    
    setSaving(true);
    
    try {
      const data: EntryData = {
        athleteId: selectedAthleteId,
        metricId: selectedMetricId,
        value: selectedMetric?.type === 'scale' ? parseFloat(value) : value,
        date,
        notes: notes.trim() || undefined,
      };
      
      await onSave?.([data]);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      
      // Reset form for "Save + Continue" workflow
      setValue('');
      setNotes('');
      
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Erro ao guardar. Tenta novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBulk = async () => {
    if (!validateBulk()) {
      alert('Corrige os valores inválidos');
      return;
    }
    
    setSaving(true);
    
    try {
      const validRows = bulkRows.filter(row => row.value.trim() !== '');
      const data: EntryData[] = validRows.map(row => ({
        athleteId: row.athleteId,
        metricId: bulkMetricId,
        value: selectedMetric?.type === 'scale' ? parseFloat(row.value) : row.value,
        date: bulkDate,
      }));
      
      await onSave?.(data);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving bulk entries:', error);
      alert('Erro ao guardar. Tenta novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBulkRow = () => {
    const availableAthlete = availableAthletes.find(
      athlete => !bulkRows.some(row => row.athleteId === athlete.id)
    );
    
    if (availableAthlete) {
      setBulkRows([
        ...bulkRows,
        {
          id: availableAthlete.id,
          athleteId: availableAthlete.id,
          value: '',
        },
      ]);
    }
  };

  const handleRemoveBulkRow = (id: string) => {
    setBulkRows(bulkRows.filter(row => row.id !== id));
  };

  const updateBulkRowValue = (id: string, value: string) => {
    setBulkRows(bulkRows.map(row => 
      row.id === id ? { ...row, value, error: undefined } : row
    ));
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Dados"
      size={isMobile ? 'full' : 'large'}
    >
      <div className="flex flex-col h-full">
        {/* Mode Toggle */}
        <div className="p-4 sm:p-6 pb-0">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('single')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                mode === 'single'
                  ? 'bg-white shadow-md text-sky-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Individual</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('bulk')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                mode === 'bulk'
                  ? 'bg-white shadow-md text-sky-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Múltiplos</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {mode === 'single' ? (
              <SingleEntryForm
                key="single"
                isMobile={isMobile}
                selectedAthleteId={selectedAthleteId}
                setSelectedAthleteId={setSelectedAthleteId}
                selectedMetricId={selectedMetricId}
                setSelectedMetricId={setSelectedMetricId}
                value={value}
                setValue={setValue}
                date={date}
                setDate={setDate}
                notes={notes}
                setNotes={setNotes}
                selectedMetric={selectedMetric}
                availableAthletes={availableAthletes}
                availableMetrics={availableMetrics}
                onSave={handleSaveSingle}
                saving={saving}
                saveSuccess={saveSuccess}
              />
            ) : (
              <BulkEntryForm
                key="bulk"
                isMobile={isMobile}
                bulkMetricId={bulkMetricId}
                setBulkMetricId={setBulkMetricId}
                bulkDate={bulkDate}
                setBulkDate={setBulkDate}
                bulkRows={bulkRows}
                updateBulkRowValue={updateBulkRowValue}
                handleAddBulkRow={handleAddBulkRow}
                handleRemoveBulkRow={handleRemoveBulkRow}
                selectedMetric={selectedMetric}
                availableAthletes={availableAthletes}
                availableMetrics={availableMetrics}
                onSave={handleSaveBulk}
                saving={saving}
                saveSuccess={saveSuccess}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </ResponsiveModal>
  );
}

// ============================================================================
// SINGLE ENTRY FORM
// ============================================================================

interface SingleEntryFormProps {
  isMobile: boolean;
  selectedAthleteId: string;
  setSelectedAthleteId: (id: string) => void;
  selectedMetricId: string;
  setSelectedMetricId: (id: string) => void;
  value: string;
  setValue: (v: string) => void;
  date: string;
  setDate: (d: string) => void;
  notes: string;
  setNotes: (n: string) => void;
  selectedMetric?: Metric;
  availableAthletes: Array<{ id: string; name: string; avatar?: string }>;
  availableMetrics: Metric[];
  onSave: () => void;
  saving: boolean;
  saveSuccess: boolean;
}

function SingleEntryForm({
  isMobile,
  selectedAthleteId,
  setSelectedAthleteId,
  selectedMetricId,
  setSelectedMetricId,
  value,
  setValue,
  date,
  setDate,
  notes,
  setNotes,
  selectedMetric,
  availableAthletes,
  availableMetrics,
  onSave,
  saving,
  saveSuccess,
}: SingleEntryFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`space-y-4 ${isMobile ? '' : 'grid grid-cols-2 gap-4 space-y-0'}`}
    >
      {/* Athlete Select */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <User className="h-4 w-4" />
          <span>Atleta</span>
        </label>
        <select
          value={selectedAthleteId}
          onChange={(e) => setSelectedAthleteId(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
        >
          <option value="">Seleciona...</option>
          {availableAthletes.map((athlete) => (
            <option key={athlete.id} value={athlete.id}>
              {athlete.name}
            </option>
          ))}
        </select>
      </div>

      {/* Metric Select */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Target className="h-4 w-4" />
          <span>Métrica</span>
        </label>
        <select
          value={selectedMetricId}
          onChange={(e) => setSelectedMetricId(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
        >
          <option value="">Seleciona...</option>
          {availableMetrics.map((metric) => (
            <option key={metric.id} value={metric.id}>
              {metric.name} {metric.unit && `(${metric.unit})`}
            </option>
          ))}
        </select>
      </div>

      {/* Value Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Hash className="h-4 w-4" />
          <span>Valor</span>
          {selectedMetric?.unit && (
            <span className="text-xs text-slate-500">({selectedMetric.unit})</span>
          )}
        </label>
        <input
          type={selectedMetric?.type === 'scale' ? 'number' : 'text'}
          inputMode={selectedMetric?.type === 'scale' ? 'decimal' : 'text'}
          placeholder={
            selectedMetric?.type === 'scale'
              ? `${selectedMetric.scaleMin} - ${selectedMetric.scaleMax}`
              : 'Valor...'
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={selectedMetric?.scaleMin}
          max={selectedMetric?.scaleMax}
          step={selectedMetric?.type === 'scale' ? '0.1' : undefined}
          className="w-full px-4 py-3 text-lg font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
        />
        {selectedMetric && selectedMetric.type === 'scale' && (
          <p className="text-xs text-slate-500 mt-1">
            Escala: {selectedMetric.scaleMin} a {selectedMetric.scaleMax}
          </p>
        )}
      </div>

      {/* Date Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Calendar className="h-4 w-4" />
          <span>Data</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
        />
      </div>

      {/* Notes (full width) */}
      <div className={isMobile ? '' : 'col-span-2'}>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <FileText className="h-4 w-4" />
          <span>Notas (opcional)</span>
        </label>
        <textarea
          placeholder="Observações sobre este valor..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
        />
      </div>

      {/* Save Button (full width) */}
      <div className={isMobile ? '' : 'col-span-2'}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={saving || saveSuccess}
          className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl shadow-lg transition-all min-h-[44px] ${
            saveSuccess
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>A guardar...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>Guardado!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// BULK ENTRY FORM
// ============================================================================

interface BulkEntryFormProps {
  isMobile: boolean;
  bulkMetricId: string;
  setBulkMetricId: (id: string) => void;
  bulkDate: string;
  setBulkDate: (d: string) => void;
  bulkRows: BulkRow[];
  updateBulkRowValue: (id: string, value: string) => void;
  handleAddBulkRow: () => void;
  handleRemoveBulkRow: (id: string) => void;
  selectedMetric?: Metric;
  availableAthletes: Array<{ id: string; name: string; avatar?: string }>;
  availableMetrics: Metric[];
  onSave: () => void;
  saving: boolean;
  saveSuccess: boolean;
}

function BulkEntryForm({
  isMobile,
  bulkMetricId,
  setBulkMetricId,
  bulkDate,
  setBulkDate,
  bulkRows,
  updateBulkRowValue,
  handleAddBulkRow,
  handleRemoveBulkRow,
  selectedMetric,
  availableAthletes,
  availableMetrics,
  onSave,
  saving,
  saveSuccess,
}: BulkEntryFormProps) {
  if (isMobile) {
    // Mobile: Cards layout
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
      >
        {/* Metric + Date (sticky header) */}
        <div className="sticky top-0 bg-white z-10 pb-4 space-y-3">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Target className="h-4 w-4" />
              <span>Métrica</span>
            </label>
            <select
              value={bulkMetricId}
              onChange={(e) => setBulkMetricId(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
            >
              <option value="">Seleciona...</option>
              {availableMetrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name} {metric.unit && `(${metric.unit})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Data (para todos)</span>
            </label>
            <input
              type="date"
              value={bulkDate}
              onChange={(e) => setBulkDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
            />
          </div>
        </div>

        {/* Athlete cards */}
        <div className="space-y-3">
          {bulkRows.map((row) => {
            const athlete = availableAthletes.find(a => a.id === row.athleteId);
            return (
              <div
                key={row.id}
                className={`p-4 bg-white border rounded-xl ${
                  row.error ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold">
                      {athlete?.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{athlete?.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveBulkRow(row.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type={selectedMetric?.type === 'scale' ? 'number' : 'text'}
                  inputMode={selectedMetric?.type === 'scale' ? 'decimal' : 'text'}
                  placeholder={selectedMetric ? `Valor ${selectedMetric.unit ? `(${selectedMetric.unit})` : ''}` : 'Valor...'}
                  value={row.value}
                  onChange={(e) => updateBulkRowValue(row.id, e.target.value)}
                  min={selectedMetric?.scaleMin}
                  max={selectedMetric?.scaleMax}
                  step={selectedMetric?.type === 'scale' ? '0.1' : undefined}
                  className="w-full px-3 py-2 text-lg font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
                {row.error && (
                  <p className="text-xs text-red-600 mt-1">{row.error}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Row Button */}
        {bulkRows.length < availableAthletes.length && (
          <button
            onClick={handleAddBulkRow}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Atleta</span>
          </button>
        )}

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={saving || saveSuccess}
          className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl shadow-lg transition-all min-h-[44px] ${
            saveSuccess
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>A guardar...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>Guardado!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Guardar Todos</span>
            </>
          )}
        </motion.button>
      </motion.div>
    );
  }

  // Desktop: Table layout
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      {/* Metric + Date (grid) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Target className="h-4 w-4" />
            <span>Métrica</span>
          </label>
          <select
            value={bulkMetricId}
            onChange={(e) => setBulkMetricId(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          >
            <option value="">Seleciona...</option>
            {availableMetrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.name} {metric.unit && `(${metric.unit})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="h-4 w-4" />
            <span>Data (para todos)</span>
          </label>
          <input
            type="date"
            value={bulkDate}
            onChange={(e) => setBulkDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase">
                Atleta
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase">
                Valor {selectedMetric?.unit && `(${selectedMetric.unit})`}
              </th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {bulkRows.map((row, index) => {
              const athlete = availableAthletes.find(a => a.id === row.athleteId);
              return (
                <tr
                  key={row.id}
                  className={`border-b border-slate-100 ${row.error ? 'bg-red-50' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold">
                        {athlete?.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">{athlete?.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type={selectedMetric?.type === 'scale' ? 'number' : 'text'}
                      inputMode={selectedMetric?.type === 'scale' ? 'decimal' : 'text'}
                      placeholder="Valor..."
                      value={row.value}
                      onChange={(e) => updateBulkRowValue(row.id, e.target.value)}
                      min={selectedMetric?.scaleMin}
                      max={selectedMetric?.scaleMax}
                      step={selectedMetric?.type === 'scale' ? '0.1' : undefined}
                      className={`w-full px-3 py-2 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                        row.error ? 'border-red-300 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                    {row.error && (
                      <p className="text-xs text-red-600 mt-1">{row.error}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleRemoveBulkRow(row.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Row + Save Buttons */}
      <div className="flex items-center gap-3">
        {bulkRows.length < availableAthletes.length && (
          <button
            onClick={handleAddBulkRow}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Atleta</span>
          </button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={saving || saveSuccess}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl shadow-lg transition-all ${
            saveSuccess
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>A guardar...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>Guardado!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Guardar Todos ({bulkRows.filter(r => r.value.trim()).length})</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
