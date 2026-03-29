/**
 * RECURRING EVENT EDITOR
 * Editor para criar eventos recorrentes
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Repeat, Calendar, X, Plus, Trash2 } from 'lucide-react';
import { RecurrencePattern, RecurrenceFrequency } from '@/types/calendar';

interface RecurringEventEditorProps {
  pattern?: RecurrencePattern;
  onChange: (pattern: RecurrencePattern | undefined) => void;
}

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string; icon: string }[] = [
  { value: 'daily', label: 'Diariamente', icon: '📅' },
  { value: 'weekly', label: 'Semanalmente', icon: '📆' },
  { value: 'monthly', label: 'Mensalmente', icon: '🗓️' },
  { value: 'yearly', label: 'Anualmente', icon: '📊' },
];

const WEEKDAYS = [
  { value: 0, label: 'Dom', full: 'Domingo' },
  { value: 1, label: 'Seg', full: 'Segunda' },
  { value: 2, label: 'Ter', full: 'Terça' },
  { value: 3, label: 'Qua', full: 'Quarta' },
  { value: 4, label: 'Qui', full: 'Quinta' },
  { value: 5, label: 'Sex', full: 'Sexta' },
  { value: 6, label: 'Sáb', full: 'Sábado' },
];

export function RecurringEventEditor({ pattern, onChange }: RecurringEventEditorProps) {
  const [isEnabled, setIsEnabled] = useState(!!pattern);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(pattern?.frequency || 'weekly');
  const [interval, setInterval] = useState(pattern?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(pattern?.daysOfWeek || []);
  const [endType, setEndType] = useState<'never' | 'date' | 'count'>(
    pattern?.endDate ? 'date' : pattern?.count ? 'count' : 'never'
  );
  const [endDate, setEndDate] = useState(pattern?.endDate || '');
  const [count, setCount] = useState(pattern?.count || 10);

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (!newEnabled) {
      onChange(undefined);
    } else {
      updatePattern();
    }
  };

  const updatePattern = () => {
    const newPattern: RecurrencePattern = {
      frequency,
      interval,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      endDate: endType === 'date' ? endDate : undefined,
      count: endType === 'count' ? count : undefined,
    };
    
    onChange(newPattern);
  };

  const toggleWeekday = (day: number) => {
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day].sort((a, b) => a - b);
    
    setDaysOfWeek(newDays);
    
    if (isEnabled) {
      const newPattern: RecurrencePattern = {
        frequency,
        interval,
        daysOfWeek: newDays,
        endDate: endType === 'date' ? endDate : undefined,
        count: endType === 'count' ? count : undefined,
      };
      onChange(newPattern);
    }
  };

  const handleFrequencyChange = (newFreq: RecurrenceFrequency) => {
    setFrequency(newFreq);
    if (isEnabled) {
      const newPattern: RecurrencePattern = {
        frequency: newFreq,
        interval,
        daysOfWeek: newFreq === 'weekly' ? daysOfWeek : undefined,
        endDate: endType === 'date' ? endDate : undefined,
        count: endType === 'count' ? count : undefined,
      };
      onChange(newPattern);
    }
  };

  const handleIntervalChange = (newInterval: number) => {
    setInterval(newInterval);
    if (isEnabled) updatePattern();
  };

  return (
    <div className="space-y-4">
      {/* Toggle Recurring */}
      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <Repeat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Evento Recorrente</h4>
            <p className="text-xs text-slate-600">Criar múltiplos eventos automaticamente</p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-violet-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Recurring Options */}
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Frequency */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Frequência
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FREQUENCY_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFrequencyChange(option.value)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    frequency === option.value
                      ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300'
                  }`}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interval */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Repetir a cada
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="30"
                value={interval}
                onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
              />
              <span className="text-sm text-slate-600">
                {frequency === 'daily' && (interval === 1 ? 'dia' : 'dias')}
                {frequency === 'weekly' && (interval === 1 ? 'semana' : 'semanas')}
                {frequency === 'monthly' && (interval === 1 ? 'mês' : 'meses')}
                {frequency === 'yearly' && (interval === 1 ? 'ano' : 'anos')}
              </span>
            </div>
          </div>

          {/* Days of Week (only for weekly) */}
          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Dias da semana
              </label>
              <div className="flex gap-2">
                {WEEKDAYS.map((day) => (
                  <motion.button
                    key={day.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleWeekday(day.value)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      daysOfWeek.includes(day.value)
                        ? 'bg-violet-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={day.full}
                  >
                    {day.label}
                  </motion.button>
                ))}
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
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-violet-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'never'}
                  onChange={() => setEndType('never')}
                  className="h-4 w-4 text-violet-500"
                />
                <span className="text-sm font-medium text-slate-700">Nunca</span>
              </label>

              {/* On Date */}
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-violet-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'date'}
                  onChange={() => setEndType('date')}
                  className="h-4 w-4 text-violet-500"
                />
                <span className="text-sm font-medium text-slate-700 flex-1">Em</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={endType !== 'date'}
                  className="px-3 py-1 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all disabled:opacity-50"
                />
              </label>

              {/* After Count */}
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-violet-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'count'}
                  onChange={() => setEndType('count')}
                  className="h-4 w-4 text-violet-500"
                />
                <span className="text-sm font-medium text-slate-700 flex-1">Após</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                  disabled={endType !== 'count'}
                  className="w-16 px-3 py-1 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all disabled:opacity-50"
                />
                <span className="text-sm text-slate-600">ocorrências</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-violet-900 mb-1">Resumo</h5>
                <p className="text-sm text-violet-700">
                  {interval === 1 ? '' : `A cada ${interval} `}
                  {frequency === 'daily' && `${interval === 1 ? 'Todos os dias' : 'dias'}`}
                  {frequency === 'weekly' && `${interval === 1 ? 'Toda semana' : 'semanas'}`}
                  {frequency === 'monthly' && `${interval === 1 ? 'Todo mês' : 'meses'}`}
                  {frequency === 'yearly' && `${interval === 1 ? 'Todo ano' : 'anos'}`}
                  {frequency === 'weekly' && daysOfWeek.length > 0 && (
                    <>, às {WEEKDAYS.filter(d => daysOfWeek.includes(d.value)).map(d => d.label).join(', ')}</>
                  )}
                  {endType === 'never' && ', para sempre'}
                  {endType === 'date' && `, até ${new Date(endDate).toLocaleDateString('pt-PT')}`}
                  {endType === 'count' && `, por ${count} vezes`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
