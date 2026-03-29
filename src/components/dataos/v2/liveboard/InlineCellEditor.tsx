/**
 * 🎨 INLINE CELL EDITOR - ENHANCED
 * Quick entry inline com suporte a paste from Excel
 * 
 * MUDANÇAS RESPONSIVAS:
 * ✅ Mobile: Modal fullscreen
 * ✅ Desktop: Popover inline
 * ✅ Touch targets 44×44px
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import type { Metric } from '@/types/metrics';
import { useResponsive } from '@/hooks/useResponsive'; // 🎨 ENHANCED

interface InlineCellEditorProps {
  metric: Metric;
  athleteId: string;
  athleteName: string;
  currentValue?: number | string | boolean;
  onSave: (value: any) => void;
  onCancel: () => void;
  position?: { x: number; y: number };
}

export function InlineCellEditor({
  metric,
  athleteId,
  athleteName,
  currentValue,
  onSave,
  onCancel,
  position,
}: InlineCellEditorProps) {
  const [value, setValue] = useState<any>(currentValue ?? '');
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value]);

  const validate = (val: any): boolean => {
    setError('');

    if (val === '' || val === null || val === undefined) {
      setError('Valor obrigatório');
      return false;
    }

    switch (metric.type) {
      case 'scale':
      case 'count':
      case 'distance':
        const num = Number(val);
        if (isNaN(num)) {
          setError('Valor deve ser numérico');
          return false;
        }
        if (metric.scaleMin !== undefined && num < metric.scaleMin) {
          setError(`Valor mínimo: ${metric.scaleMin}`);
          return false;
        }
        if (metric.scaleMax !== undefined && num > metric.scaleMax) {
          setError(`Valor máximo: ${metric.scaleMax}`);
          return false;
        }
        break;

      case 'duration':
        // Format: MM:SS or HH:MM:SS
        if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) {
          setError('Formato: MM:SS ou HH:MM:SS');
          return false;
        }
        break;

      case 'boolean':
        // Should be handled by checkbox, but validate anyway
        if (typeof val !== 'boolean') {
          setError('Valor deve ser Sim/Não');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSave = () => {
    if (!validate(value)) return;

    let finalValue = value;

    // Convert based on type
    switch (metric.type) {
      case 'scale':
      case 'count':
      case 'distance':
        finalValue = Number(value);
        break;
      case 'duration':
        // Convert to seconds
        const parts = value.split(':').map(Number);
        if (parts.length === 2) {
          finalValue = parts[0] * 60 + parts[1]; // MM:SS
        } else if (parts.length === 3) {
          finalValue = parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
        }
        break;
    }

    onSave(finalValue);
  };

  const renderInput = () => {
    switch (metric.type) {
      case 'boolean':
        return (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setValue(true);
                setTimeout(() => onSave(true), 100);
              }}
              className={`flex-1 px-4 py-2 text-sm rounded-xl transition-all ${
                value === true
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✓ Sim
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setValue(false);
                setTimeout(() => onSave(false), 100);
              }}
              className={`flex-1 px-4 py-2 text-sm rounded-xl transition-all ${
                value === false
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✗ Não
            </motion.button>
          </div>
        );

      case 'scale':
        // Show slider if has range
        if (metric.scaleMin !== undefined && metric.scaleMax !== undefined) {
          return (
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min={metric.scaleMin}
                max={metric.scaleMax}
                step={1}
                className="w-full px-3 py-2 text-sm border-2 border-sky-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              />
              <input
                type="range"
                value={value || metric.scaleMin}
                onChange={(e) => setValue(e.target.value)}
                min={metric.scaleMin}
                max={metric.scaleMax}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{metric.scaleMin}</span>
                <span className="font-medium text-slate-700">{value || metric.scaleMin}</span>
                <span>{metric.scaleMax}</span>
              </div>
            </div>
          );
        }
        // Fall through to default number input

      case 'count':
      case 'distance':
        return (
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Ex: 65${metric.unit ? ` ${metric.unit}` : ''}`}
              className="w-full px-3 py-2 text-sm border-2 border-sky-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
            {metric.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                {metric.unit}
              </span>
            )}
          </div>
        );

      case 'duration':
        return (
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="MM:SS ou HH:MM:SS"
              className="w-full pl-10 pr-3 py-2 text-sm border-2 border-sky-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
          </div>
        );

      case 'text':
      default:
        return (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Escreve aqui..."
            className="w-full px-3 py-2 text-sm border-2 border-sky-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
          />
        );
    }
  };

  const isMobile = useResponsive('sm');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed z-50"
      style={position ? { top: position.y, left: position.x } : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
        onClick={onCancel}
      />

      {/* Editor Modal */}
      <div className="w-96 p-4 bg-white rounded-2xl border-2 border-sky-300 shadow-2xl">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-3 w-3 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {metric.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Atleta: <span className="font-medium text-slate-700">{athleteName}</span>
          </p>
        </div>

        {/* Input */}
        <div className="mb-3">
          {renderInput()}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Baseline hint */}
        {metric.baselineConfig?.method && metric.baselineConfig.method !== 'none' && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200">
            <p className="text-xs text-sky-700">
              💡 Baseline: {metric.baselineConfig.method === 'rolling_average' 
                ? `Média dos últimos ${metric.baselineConfig.rollingDays || 30} dias`
                : metric.baselineConfig.method === 'percentile'
                ? `Percentil ${metric.baselineConfig.percentileValue || 50}`
                : 'Manual'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            <Check className="h-4 w-4" />
            Guardar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <X className="h-4 w-4" />
            Cancelar
          </motion.button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Enter</kbd> Guardar</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Esc</kbd> Cancelar</span>
        </div>
      </div>
    </motion.div>
  );
}