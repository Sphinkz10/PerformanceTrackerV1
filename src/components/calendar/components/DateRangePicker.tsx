/**
 * DATE RANGE PICKER
 * Reusable date range selector with presets
 * 
 * Features:
 * - Quick presets (This week, This month, etc.)
 * - Custom date range
 * - Calendar popup
 * - Mobile responsive
 * - Design System compliant
 * 
 * @module calendar/components/DateRangePicker
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
} from 'date-fns';
import { pt } from 'date-fns/locale';

// ============================================================================
// TYPES
// ============================================================================

export interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Array<{
    label: string;
    getValue: () => DateRange;
  }>;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// DEFAULT PRESETS
// ============================================================================

const DEFAULT_PRESETS = [
  {
    label: 'Hoje',
    getValue: () => ({
      start: new Date(),
      end: new Date(),
    }),
  },
  {
    label: 'Esta Semana',
    getValue: () => ({
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: 'Este Mês',
    getValue: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Próximos 7 dias',
    getValue: () => ({
      start: new Date(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }),
  },
  {
    label: 'Próximos 30 dias',
    getValue: () => ({
      start: new Date(),
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
  },
  {
    label: 'Últimos 7 dias',
    getValue: () => ({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }),
  },
  {
    label: 'Últimos 30 dias',
    getValue: () => ({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }),
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function DateRangePicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  placeholder = 'Selecionar período',
  className = '',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Update temp range when value changes
  useEffect(() => {
    setTempRange(value);
  }, [value]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePresetClick = (preset: typeof DEFAULT_PRESETS[0]) => {
    const newRange = preset.getValue();
    onChange(newRange);
    setTempRange(newRange);
    setIsOpen(false);
  };

  const handleDayClick = (day: Date) => {
    if (selectionMode === 'start') {
      setTempRange({ start: day, end: day });
      setSelectionMode('end');
    } else {
      if (day < tempRange.start) {
        setTempRange({ start: day, end: tempRange.start });
      } else {
        setTempRange({ ...tempRange, end: day });
      }
      setSelectionMode('start');
    }
  };

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const handleClear = () => {
    const today = new Date();
    const newRange = { start: today, end: today };
    onChange(newRange);
    setTempRange(newRange);
    setSelectionMode('start');
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // ============================================================================
  // CALENDAR GRID
  // ============================================================================

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const days = getDaysInMonth();
  const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
      >
        <CalendarIcon className="h-4 w-4 text-slate-400" />
        <span className="text-slate-700">
          {value.start && value.end
            ? `${format(value.start, 'd MMM', { locale: pt })} - ${format(value.end, 'd MMM yyyy', { locale: pt })}`
            : placeholder}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-full sm:w-auto min-w-[320px] z-50 rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            {/* Presets */}
            <div className="p-4 border-b border-slate-200">
              <label className="text-xs font-medium text-slate-600 mb-2 block">
                Períodos Rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <motion.button
                    key={preset.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePresetClick(preset)}
                    className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-700 transition-all"
                  >
                    {preset.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToPreviousMonth}
                  className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </motion.button>

                <span className="text-sm font-semibold text-slate-900">
                  {format(currentMonth, 'MMMM yyyy', { locale: pt })}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToNextMonth}
                  className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </motion.button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, i) => (
                  <div
                    key={i}
                    className="h-8 flex items-center justify-center text-xs font-medium text-slate-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isStart = isSameDay(day, tempRange.start);
                  const isEnd = isSameDay(day, tempRange.end);
                  const isInRange =
                    tempRange.start &&
                    tempRange.end &&
                    isWithinInterval(day, { start: tempRange.start, end: tempRange.end });
                  const isToday = isSameDay(day, new Date());

                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: isCurrentMonth ? 1.1 : 1 }}
                      whileTap={{ scale: isCurrentMonth ? 0.9 : 1 }}
                      onClick={() => isCurrentMonth && handleDayClick(day)}
                      disabled={!isCurrentMonth}
                      className={`h-8 rounded-lg text-xs font-medium transition-all ${
                        isStart || isEnd
                          ? 'bg-sky-500 text-white'
                          : isInRange
                          ? 'bg-sky-100 text-sky-900'
                          : isToday
                          ? 'bg-emerald-100 text-emerald-900'
                          : isCurrentMonth
                          ? 'bg-white hover:bg-slate-100 text-slate-900'
                          : 'bg-white text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {format(day, 'd')}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selection Info */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-600 mb-3">
                  <span className="font-medium">
                    {selectionMode === 'start' ? 'Selecione data de início' : 'Selecione data de fim'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600">Início:</span>{' '}
                    <span className="font-semibold text-slate-900">
                      {format(tempRange.start, 'd MMM yyyy', { locale: pt })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Fim:</span>{' '}
                    <span className="font-semibold text-slate-900">
                      {format(tempRange.end, 'd MMM yyyy', { locale: pt })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center justify-between gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClear}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all"
                >
                  <X className="h-3 w-3" />
                  Limpar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
                >
                  Aplicar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
