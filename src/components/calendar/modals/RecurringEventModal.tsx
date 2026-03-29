/**
 * RECURRING EVENT MODAL
 * Create and manage recurring events with patterns
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar as CalendarIcon,
  Clock,
  Repeat,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { 
  format, 
  addDays, 
  addWeeks, 
  addMonths,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  isSameDay,
  setDay,
  getDay
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type RecurrenceEnd = 'never' | 'after' | 'on_date';

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday) for weekly
  dayOfMonth?: number; // 1-31 for monthly
  endType: RecurrenceEnd;
  endAfterOccurrences?: number;
  endOnDate?: Date;
  exceptions?: Date[]; // Dates to skip
}

export interface RecurringEventData {
  title: string;
  description?: string;
  type: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  startDate: Date;
  pattern: RecurrencePattern;
  athleteIds?: string[];
  location?: string;
  color?: string;
}

interface RecurringEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecurring: (data: RecurringEventData) => Promise<void>;
  workspaceId: string;
  initialDate?: Date;
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: '🗓️ Diário', description: 'Todos os dias' },
  { value: 'weekly', label: '📅 Semanal', description: 'Uma vez por semana' },
  { value: 'biweekly', label: '📆 Quinzenal', description: 'A cada 2 semanas' },
  { value: 'monthly', label: '📊 Mensal', description: 'Uma vez por mês' },
  { value: 'custom', label: '⚙️ Personalizado', description: 'Intervalo customizado' },
] as const;

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dom', fullLabel: 'Domingo' },
  { value: 1, label: 'Seg', fullLabel: 'Segunda' },
  { value: 2, label: 'Ter', fullLabel: 'Terça' },
  { value: 3, label: 'Qua', fullLabel: 'Quarta' },
  { value: 4, label: 'Qui', fullLabel: 'Quinta' },
  { value: 5, label: 'Sex', fullLabel: 'Sexta' },
  { value: 6, label: 'Sáb', fullLabel: 'Sábado' },
];

export function RecurringEventModal({
  isOpen,
  onClose,
  onCreateRecurring,
  workspaceId,
  initialDate = new Date(),
}: RecurringEventModalProps) {
  const [formData, setFormData] = useState<RecurringEventData>({
    title: '',
    type: 'workout',
    startTime: '09:00',
    endTime: '10:00',
    startDate: initialDate,
    pattern: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [getDay(initialDate)],
      endType: 'never',
    },
    athleteIds: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview occurrences
  const previewOccurrences = useMemo(() => 
    generateOccurrences(formData, 10), // Preview first 10
    [formData]
  );

  const totalOccurrences = useMemo(() => 
    countTotalOccurrences(formData),
    [formData]
  );

  const updateFormData = (updates: Partial<RecurringEventData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    setFormData(prev => ({
      ...prev,
      pattern: { ...prev.pattern, ...updates },
    }));
  };

  const toggleDayOfWeek = (day: number) => {
    const current = formData.pattern.daysOfWeek || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort();
    
    updatePattern({ daysOfWeek: updated });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateRecurring(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        type: 'workout',
        startTime: '09:00',
        endTime: '10:00',
        startDate: new Date(),
        pattern: {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [getDay(new Date())],
          endType: 'never',
        },
        athleteIds: [],
      });
    } catch (error) {
      console.error('Error creating recurring events:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Repeat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  🔄 Criar Evento Recorrente
                </h2>
                <p className="text-sm text-slate-600">
                  {totalOccurrences === Infinity 
                    ? 'Infinitas ocorrências'
                    : `${totalOccurrences} ocorrência${totalOccurrences > 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Event Details */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-sky-600" />
                    Detalhes do Evento
                  </h3>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
                        placeholder="Ex: Treino de Natação"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        placeholder="Detalhes adicionais..."
                        rows={3}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                      />
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Hora Início *
                        </label>
                        <input
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => updateFormData({ startTime: e.target.value })}
                          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Hora Fim *
                        </label>
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => updateFormData({ endTime: e.target.value })}
                          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Local
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => updateFormData({ location: e.target.value })}
                        placeholder="Ex: Piscina Municipal"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Recurrence Pattern */}
                <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-violet-600" />
                    Padrão de Recorrência
                  </h3>

                  <div className="space-y-4">
                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Frequência *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {FREQUENCY_OPTIONS.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updatePattern({ frequency: option.value as RecurrenceFrequency })}
                            className={`
                              p-3 rounded-xl text-left transition-all
                              ${formData.pattern.frequency === option.value
                                ? 'bg-violet-100 border-2 border-violet-400 shadow-md'
                                : 'bg-white border border-violet-200 hover:bg-violet-50'
                              }
                            `}
                          >
                            <div className="font-semibold text-sm text-slate-900">
                              {option.label}
                            </div>
                            <div className="text-xs text-slate-600">
                              {option.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Days of Week (for weekly/biweekly) */}
                    {(formData.pattern.frequency === 'weekly' || formData.pattern.frequency === 'biweekly') && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Dias da Semana *
                        </label>
                        <div className="flex gap-2">
                          {DAYS_OF_WEEK.map((day) => (
                            <motion.button
                              key={day.value}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleDayOfWeek(day.value)}
                              className={`
                                h-10 w-10 rounded-full font-semibold text-xs transition-all
                                ${formData.pattern.daysOfWeek?.includes(day.value)
                                  ? 'bg-violet-500 text-white shadow-md'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }
                              `}
                              title={day.fullLabel}
                            >
                              {day.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interval (for custom) */}
                    {formData.pattern.frequency === 'custom' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Repetir a cada
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={formData.pattern.interval}
                            onChange={(e) => updatePattern({ interval: parseInt(e.target.value) || 1 })}
                            className="w-24 px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                          />
                          <span className="text-sm text-slate-700">dias</span>
                        </div>
                      </div>
                    )}

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Data de Início *
                      </label>
                      <input
                        type="date"
                        value={format(formData.startDate, 'yyyy-MM-dd')}
                        onChange={(e) => updateFormData({ startDate: new Date(e.target.value) })}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                      />
                    </div>

                    {/* End Type */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Termina *
                      </label>
                      <div className="space-y-2">
                        {/* Never */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updatePattern({ endType: 'never' })}
                          className={`
                            w-full p-3 rounded-xl text-left transition-all flex items-center gap-3
                            ${formData.pattern.endType === 'never'
                              ? 'bg-violet-100 border-2 border-violet-400 shadow-md'
                              : 'bg-white border border-violet-200 hover:bg-violet-50'
                            }
                          `}
                        >
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            formData.pattern.endType === 'never' ? 'border-violet-500' : 'border-slate-300'
                          }`}>
                            {formData.pattern.endType === 'never' && (
                              <div className="h-3 w-3 rounded-full bg-violet-500" />
                            )}
                          </div>
                          <span className="font-semibold text-sm text-slate-900">
                            Nunca (sem data final)
                          </span>
                        </motion.button>

                        {/* After N occurrences */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updatePattern({ endType: 'after', endAfterOccurrences: 10 })}
                          className={`
                            w-full p-3 rounded-xl text-left transition-all
                            ${formData.pattern.endType === 'after'
                              ? 'bg-violet-100 border-2 border-violet-400 shadow-md'
                              : 'bg-white border border-violet-200 hover:bg-violet-50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              formData.pattern.endType === 'after' ? 'border-violet-500' : 'border-slate-300'
                            }`}>
                              {formData.pattern.endType === 'after' && (
                                <div className="h-3 w-3 rounded-full bg-violet-500" />
                              )}
                            </div>
                            <span className="font-semibold text-sm text-slate-900">
                              Após
                            </span>
                            {formData.pattern.endType === 'after' && (
                              <input
                                type="number"
                                min="1"
                                max="365"
                                value={formData.pattern.endAfterOccurrences || 10}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updatePattern({ endAfterOccurrences: parseInt(e.target.value) || 1 });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 px-3 py-1 text-sm border border-violet-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                              />
                            )}
                            {formData.pattern.endType === 'after' && (
                              <span className="text-sm text-slate-700">ocorrências</span>
                            )}
                          </div>
                        </motion.button>

                        {/* On specific date */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updatePattern({ 
                            endType: 'on_date', 
                            endOnDate: addMonths(formData.startDate, 3) 
                          })}
                          className={`
                            w-full p-3 rounded-xl text-left transition-all
                            ${formData.pattern.endType === 'on_date'
                              ? 'bg-violet-100 border-2 border-violet-400 shadow-md'
                              : 'bg-white border border-violet-200 hover:bg-violet-50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              formData.pattern.endType === 'on_date' ? 'border-violet-500' : 'border-slate-300'
                            }`}>
                              {formData.pattern.endType === 'on_date' && (
                                <div className="h-3 w-3 rounded-full bg-violet-500" />
                              )}
                            </div>
                            <span className="font-semibold text-sm text-slate-900">
                              Em
                            </span>
                            {formData.pattern.endType === 'on_date' && (
                              <input
                                type="date"
                                value={formData.pattern.endOnDate ? format(formData.pattern.endOnDate, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updatePattern({ endOnDate: new Date(e.target.value) });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 px-3 py-1 text-sm border border-violet-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                              />
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Preview */}
              <div className="space-y-6">
                {/* Preview */}
                <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Pré-visualização ({previewOccurrences.length} primeiras)
                  </h3>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {previewOccurrences.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma ocorrência gerada</p>
                        <p className="text-xs">Verifique as configurações</p>
                      </div>
                    ) : (
                      previewOccurrences.map((occurrence, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="p-3 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-slate-900">
                                {format(occurrence, "EEEE, d 'de' MMMM", { locale: pt })}
                              </div>
                              <div className="text-xs text-slate-600">
                                {formData.startTime} - {formData.endTime}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}

                    {totalOccurrences > 10 && (
                      <div className="text-center py-3 text-sm text-slate-500">
                        + {totalOccurrences - 10} mais ocorrência{totalOccurrences - 10 > 1 ? 's' : ''}...
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border-2 border-sky-200 bg-sky-50 p-4">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-600" />
                    Resumo
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Frequência:</span>
                      <span className="font-semibold text-slate-900">
                        {FREQUENCY_OPTIONS.find(f => f.value === formData.pattern.frequency)?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Início:</span>
                      <span className="font-semibold text-slate-900">
                        {format(formData.startDate, "d 'de' MMMM", { locale: pt })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Horário:</span>
                      <span className="font-semibold text-slate-900">
                        {formData.startTime} - {formData.endTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-semibold text-slate-900">
                        {totalOccurrences === Infinity ? '∞' : totalOccurrences} evento{totalOccurrences !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 p-6 border-t border-slate-200 bg-slate-50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!formData.title.trim() || isSubmitting || previewOccurrences.length === 0}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:from-violet-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Criando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Criar {totalOccurrences === Infinity ? 'Eventos' : `${totalOccurrences} Evento${totalOccurrences > 1 ? 's' : ''}`}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Generate occurrence dates based on pattern
 */
function generateOccurrences(
  data: RecurringEventData,
  maxCount: number = 100
): Date[] {
  const occurrences: Date[] = [];
  let current = startOfDay(data.startDate);
  const pattern = data.pattern;

  // Limit to prevent infinite loops
  const maxIterations = pattern.endType === 'never' ? maxCount : 1000;
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    // Check if we should add this occurrence
    let shouldAdd = false;

    switch (pattern.frequency) {
      case 'daily':
        shouldAdd = true;
        break;

      case 'weekly':
      case 'biweekly':
        const dayOfWeek = getDay(current);
        shouldAdd = pattern.daysOfWeek?.includes(dayOfWeek) || false;
        break;

      case 'monthly':
        shouldAdd = current.getDate() === (pattern.dayOfMonth || data.startDate.getDate());
        break;

      case 'custom':
        shouldAdd = true;
        break;
    }

    // Check exceptions
    if (shouldAdd && pattern.exceptions) {
      shouldAdd = !pattern.exceptions.some(ex => isSameDay(ex, current));
    }

    if (shouldAdd) {
      occurrences.push(new Date(current));
    }

    // Check end conditions
    if (pattern.endType === 'after' && occurrences.length >= (pattern.endAfterOccurrences || 1)) {
      break;
    }

    if (pattern.endType === 'on_date' && pattern.endOnDate && isAfter(current, pattern.endOnDate)) {
      break;
    }

    if (pattern.endType === 'never' && occurrences.length >= maxCount) {
      break;
    }

    // Move to next date
    switch (pattern.frequency) {
      case 'daily':
        current = addDays(current, pattern.interval || 1);
        break;

      case 'weekly':
        current = addDays(current, 1);
        break;

      case 'biweekly':
        current = addDays(current, 1);
        break;

      case 'monthly':
        current = addMonths(current, pattern.interval || 1);
        break;

      case 'custom':
        current = addDays(current, pattern.interval || 1);
        break;
    }
  }

  return occurrences;
}

/**
 * Count total occurrences
 */
function countTotalOccurrences(data: RecurringEventData): number {
  const pattern = data.pattern;

  if (pattern.endType === 'never') {
    return Infinity;
  }

  if (pattern.endType === 'after') {
    return pattern.endAfterOccurrences || 0;
  }

  if (pattern.endType === 'on_date' && pattern.endOnDate) {
    const occurrences = generateOccurrences(data, 1000);
    return occurrences.length;
  }

  return 0;
}
