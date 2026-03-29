/**
 * RECURRENCE SETTINGS COMPONENT
 * 
 * Configure event recurrence patterns
 * 
 * Features:
 * - Daily, Weekly, Monthly, Yearly patterns
 * - Custom interval (every N days/weeks/months)
 * - End conditions (date, count, never)
 * - Weekday selection (for weekly)
 * - Visual preview
 * 
 * @module calendar/components/RecurrenceSettings
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Repeat,
  Calendar,
  X,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { pt } from 'date-fns/locale';

// ============================================================================
// TYPES
// ============================================================================

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
export type RecurrenceEndType = 'never' | 'date' | 'count';

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // every N days/weeks/months
  endType: RecurrenceEndType;
  endDate?: string; // ISO date
  endCount?: number; // number of occurrences
  weekdays?: number[]; // 0-6 (Sunday-Saturday) for weekly
  monthDay?: number; // 1-31 for monthly
}

interface RecurrenceSettingsProps {
  startDate: string; // ISO date
  initialPattern?: RecurrencePattern | null;
  onChange: (pattern: RecurrencePattern | null) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FREQUENCY_OPTIONS = [
  { value: 'none', label: 'Não repetir', icon: X },
  { value: 'daily', label: 'Diariamente', icon: Calendar },
  { value: 'weekly', label: 'Semanalmente', icon: Calendar },
  { value: 'monthly', label: 'Mensalmente', icon: Calendar },
  { value: 'yearly', label: 'Anualmente', icon: Calendar },
];

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Dom', fullLabel: 'Domingo' },
  { value: 1, label: 'Seg', fullLabel: 'Segunda' },
  { value: 2, label: 'Ter', fullLabel: 'Terça' },
  { value: 3, label: 'Qua', fullLabel: 'Quarta' },
  { value: 4, label: 'Qui', fullLabel: 'Quinta' },
  { value: 5, label: 'Sex', fullLabel: 'Sexta' },
  { value: 6, label: 'Sáb', fullLabel: 'Sábado' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function RecurrenceSettings({
  startDate,
  initialPattern,
  onChange,
}: RecurrenceSettingsProps) {
  // State
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(
    initialPattern?.frequency || 'none'
  );
  const [interval, setInterval] = useState(initialPattern?.interval || 1);
  const [endType, setEndType] = useState<RecurrenceEndType>(
    initialPattern?.endType || 'never'
  );
  const [endDate, setEndDate] = useState(initialPattern?.endDate || '');
  const [endCount, setEndCount] = useState(initialPattern?.endCount || 10);
  const [weekdays, setWeekdays] = useState<number[]>(
    initialPattern?.weekdays || [new Date(startDate).getDay()]
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (frequency === 'none') {
      onChange(null);
      return;
    }

    const pattern: RecurrencePattern = {
      frequency,
      interval,
      endType,
      ...(endType === 'date' && endDate ? { endDate } : {}),
      ...(endType === 'count' ? { endCount } : {}),
      ...(frequency === 'weekly' ? { weekdays } : {}),
    };

    onChange(pattern);
    // NÃO meter onChange aqui para evitar loop com callback inline do componente pai
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency, interval, endType, endDate, endCount, weekdays]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFrequencyChange = (newFrequency: RecurrenceFrequency) => {
    setFrequency(newFrequency);

    // Reset interval when changing frequency
    if (newFrequency !== frequency) {
      setInterval(1);
    }

    // Set default weekdays for weekly (current day of week)
    if (newFrequency === 'weekly' && weekdays.length === 0) {
      setWeekdays([new Date(startDate).getDay()]);
    }
  };

  const toggleWeekday = (day: number) => {
    setWeekdays(prev => {
      if (prev.includes(day)) {
        // Don't allow removing last weekday
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day].sort();
      }
    });
  };

  // ============================================================================
  // PREVIEW
  // ============================================================================

  const getPreviewText = (): string => {
    if (frequency === 'none') return 'Este evento não se repete';

    let text = 'Repete ';

    // Frequency + interval
    if (frequency === 'daily') {
      text += interval === 1 ? 'todos os dias' : `a cada ${interval} dias`;
    } else if (frequency === 'weekly') {
      text += interval === 1 ? 'todas as semanas' : `a cada ${interval} semanas`;
      if (weekdays.length > 0) {
        const dayNames = weekdays.map(d => WEEKDAY_OPTIONS[d].label).join(', ');
        text += ` (${dayNames})`;
      }
    } else if (frequency === 'monthly') {
      text += interval === 1 ? 'todos os meses' : `a cada ${interval} meses`;
    } else if (frequency === 'yearly') {
      text += interval === 1 ? 'todos os anos' : `a cada ${interval} anos`;
    }

    // End condition
    if (endType === 'never') {
      text += ', sem fim';
    } else if (endType === 'date' && endDate) {
      text += `, até ${format(new Date(endDate), "d 'de' MMMM 'de' yyyy", { locale: pt })}`;
    } else if (endType === 'count') {
      text += `, ${endCount} vezes`;
    }

    return text;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Frequency Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Repetir
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FREQUENCY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = frequency === option.value;

            return (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFrequencyChange(option.value as RecurrenceFrequency)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${isSelected
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Advanced Options (when frequency is not 'none') */}
      <AnimatePresence>
        {frequency !== 'none' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2"
          >
            {/* Interval */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Repetir a cada
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={interval}
                  onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                />
                <span className="text-sm text-slate-600">
                  {frequency === 'daily' && (interval === 1 ? 'dia' : 'dias')}
                  {frequency === 'weekly' && (interval === 1 ? 'semana' : 'semanas')}
                  {frequency === 'monthly' && (interval === 1 ? 'mês' : 'meses')}
                  {frequency === 'yearly' && (interval === 1 ? 'ano' : 'anos')}
                </span>
              </div>
            </div>

            {/* Weekday Selection (weekly only) */}
            {frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Repetir em
                </label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAY_OPTIONS.map((day) => {
                    const isSelected = weekdays.includes(day.value);

                    return (
                      <motion.button
                        key={day.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleWeekday(day.value)}
                        className={`h-10 w-10 rounded-full font-semibold text-sm transition-all ${isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        title={day.fullLabel}
                      >
                        {day.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* End Condition */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Termina
              </label>
              <div className="space-y-3">
                {/* Never */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="endType"
                    value="never"
                    checked={endType === 'never'}
                    onChange={(e) => setEndType(e.target.value as RecurrenceEndType)}
                    className="h-4 w-4 text-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Nunca</span>
                </label>

                {/* On Date */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="endType"
                    value="date"
                    checked={endType === 'date'}
                    onChange={(e) => setEndType(e.target.value as RecurrenceEndType)}
                    className="h-4 w-4 text-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Em</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setEndType('date');
                    }}
                    min={startDate}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </label>

                {/* After Count */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="endType"
                    value="count"
                    checked={endType === 'count'}
                    onChange={(e) => setEndType(e.target.value as RecurrenceEndType)}
                    className="h-4 w-4 text-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Após</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={endCount}
                    onChange={(e) => {
                      setEndCount(Math.max(1, parseInt(e.target.value) || 1));
                      setEndType('count');
                    }}
                    className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                  <span className="text-sm font-medium text-slate-700">ocorrências</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200">
              <Repeat className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-sky-900 mb-1">Resumo</p>
                <p className="text-sm text-sky-700">{getPreviewText()}</p>
              </div>
            </div>

            {/* Warning about performance */}
            {endType === 'never' && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Eventos sem fim podem gerar muitas ocorrências. Recomendamos definir uma data de término.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}