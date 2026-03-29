/**
 * BY DATE VIEW - FASE 5 DIA 18
 * Layouts COMPLETAMENTE diferentes por dispositivo
 * 
 * MOBILE:   Timeline vertical com cards
 * TABLET:   Grid 2 colunas com agrupamento
 * DESKTOP:  Calendar view completo
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

interface DataEntry {
  id: string;
  athleteName: string;
  athleteAvatar?: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: string;
  timeAgo: string;
  trend?: 'up' | 'down' | 'stable';
}

interface DayData {
  date: string;
  dayOfWeek: string;
  entries: DataEntry[];
  totalEntries: number;
}

interface ByDateViewProps {
  workspaceId?: string;
}

// Mock data
const mockDaysData: DayData[] = [
  {
    date: '2026-02-01',
    dayOfWeek: 'Domingo',
    totalEntries: 8,
    entries: [
      {
        id: 'e1',
        athleteName: 'João Silva',
        metricName: 'Squat 1RM',
        value: 150,
        unit: 'kg',
        timestamp: '10:30',
        timeAgo: '2h atrás',
        trend: 'up',
      },
      {
        id: 'e2',
        athleteName: 'Maria Santos',
        metricName: 'FC Repouso',
        value: 62,
        unit: 'bpm',
        timestamp: '09:15',
        timeAgo: '3h atrás',
        trend: 'stable',
      },
      {
        id: 'e3',
        athleteName: 'Pedro Costa',
        metricName: 'Peso Corporal',
        value: 82.1,
        unit: 'kg',
        timestamp: '08:00',
        timeAgo: '4h atrás',
        trend: 'down',
      },
    ],
  },
  {
    date: '2026-01-31',
    dayOfWeek: 'Sábado',
    totalEntries: 12,
    entries: [
      {
        id: 'e4',
        athleteName: 'João Silva',
        metricName: 'FC Repouso',
        value: 58,
        unit: 'bpm',
        timestamp: '18:45',
        timeAgo: 'Ontem',
        trend: 'down',
      },
      {
        id: 'e5',
        athleteName: 'Maria Santos',
        metricName: 'Squat 1RM',
        value: 120,
        unit: 'kg',
        timestamp: '17:30',
        timeAgo: 'Ontem',
        trend: 'up',
      },
    ],
  },
  {
    date: '2026-01-30',
    dayOfWeek: 'Sexta',
    totalEntries: 15,
    entries: [
      {
        id: 'e6',
        athleteName: 'Pedro Costa',
        metricName: 'Squat 1RM',
        value: 180,
        unit: 'kg',
        timestamp: '19:00',
        timeAgo: '2 dias atrás',
        trend: 'up',
      },
    ],
  },
];

export function ByDateView({ workspaceId }: ByDateViewProps) {
  const { isMobile, isTablet } = useResponsive();
  const [daysData] = useState<DayData[]>(mockDaysData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mobile: vertical timeline
  if (isMobile) {
    return <MobileTimeline daysData={daysData} />;
  }

  // Tablet: 2 column grid
  if (isTablet) {
    return <TabletGrid daysData={daysData} />;
  }

  // Desktop: calendar view
  return <DesktopCalendar daysData={daysData} />;
}

// ============================================================================
// MOBILE: VERTICAL TIMELINE
// ============================================================================

interface MobileTimelineProps {
  daysData: DayData[];
}

function MobileTimeline({ daysData }: MobileTimelineProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Timeline</h2>
          <button className="p-2 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Filter className="h-5 w-5 text-slate-600" />
          </button>
        </div>
        <p className="text-sm text-slate-600">
          {daysData.reduce((sum, day) => sum + day.totalEntries, 0)} entradas nos últimos 7 dias
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

          {/* Days */}
          <div className="space-y-6 p-4">
            {daysData.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
              >
                {/* Day Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 border-4 border-slate-50 shrink-0">
                    {new Date(day.date).getDate()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{day.dayOfWeek}</p>
                    <p className="text-xs text-slate-500">
                      {day.totalEntries} entradas
                    </p>
                  </div>
                </div>

                {/* Entries */}
                <div className="ml-14 space-y-3">
                  {day.entries.map((entry, entryIndex) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (dayIndex * 0.1) + (entryIndex * 0.05) }}
                      className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                            {entry.athleteName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {entry.athleteName}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {entry.timestamp}
                            </p>
                          </div>
                        </div>
                        {entry.trend && <TrendBadge trend={entry.trend} />}
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">{entry.metricName}</p>
                          <p className="text-xl font-bold text-slate-900">
                            {entry.value}
                            <span className="text-sm font-semibold text-slate-500 ml-1">
                              {entry.unit}
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {day.totalEntries > day.entries.length && (
                    <button className="w-full py-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                      Ver mais {day.totalEntries - day.entries.length} entradas
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="p-4">
          <button className="w-full py-3 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Carregar mais dias
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TABLET: 2 COLUMN GRID
// ============================================================================

interface TabletGridProps {
  daysData: DayData[];
}

function TabletGrid({ daysData }: TabletGridProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-5 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Por Data</h2>
            <p className="text-sm text-slate-600 mt-1">
              {daysData.reduce((sum, day) => sum + day.totalEntries, 0)} entradas • Últimos 7 dias
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-5">
          {daysData.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden"
            >
              {/* Day Header */}
              <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {new Date(day.date).getDate()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{day.dayOfWeek}</p>
                    <p className="text-xs text-slate-500">
                      {day.totalEntries} entradas
                    </p>
                  </div>
                </div>
              </div>

              {/* Entries */}
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {day.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold text-xs">
                          {entry.athleteName.charAt(0)}
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {entry.athleteName}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">{entry.timestamp}</p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">{entry.metricName}</p>
                        <p className="text-lg font-bold text-slate-900">
                          {entry.value}
                          <span className="text-xs font-semibold text-slate-500 ml-1">
                            {entry.unit}
                          </span>
                        </p>
                      </div>
                      {entry.trend && <TrendBadge trend={entry.trend} size="sm" />}
                    </div>
                  </div>
                ))}

                {day.totalEntries > day.entries.length && (
                  <button className="w-full py-2 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                    + {day.totalEntries - day.entries.length} mais
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DESKTOP: CALENDAR VIEW
// ============================================================================

interface DesktopCalendarProps {
  daysData: DayData[];
}

function DesktopCalendar({ daysData }: DesktopCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: Array<{ date: Date; isCurrentMonth: boolean; data?: DayData }> = [];

    // Previous month days
    for (let i = 0; i < startDayOfWeek; i++) {
      const date = new Date(year, month, -startDayOfWeek + i + 1);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const data = daysData.find(d => d.date === dateStr);
      days.push({ date, isCurrentMonth: true, data });
    }

    return days;
  };

  const days = getDaysInMonth();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="h-full flex bg-slate-50">
      {/* Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Calendário</h2>
              <p className="text-sm text-slate-600 mt-1">
                {daysData.reduce((sum, day) => sum + day.totalEntries, 0)} entradas este mês
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="px-6 py-2 bg-slate-100 rounded-xl">
                <p className="font-bold text-slate-900">
                  {currentMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
            {/* Week days header */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-semibold text-slate-600 text-sm"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
              {days.map((day, index) => {
                const hasData = !!day.data;
                const isSelected = selectedDay?.date === day.data?.date;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: hasData ? 1.02 : 1 }}
                    onClick={() => hasData && setSelectedDay(day.data!)}
                    className={`relative p-4 min-h-[100px] text-left transition-colors ${
                      !day.isCurrentMonth
                        ? 'bg-slate-50 text-slate-400'
                        : isSelected
                        ? 'bg-sky-50'
                        : hasData
                        ? 'hover:bg-slate-50 cursor-pointer'
                        : ''
                    }`}
                  >
                    <p className={`text-sm font-semibold mb-2 ${
                      day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {day.date.getDate()}
                    </p>

                    {hasData && (
                      <div className="space-y-1">
                        <div className="px-2 py-1 bg-sky-500 text-white rounded text-xs font-semibold">
                          {day.data!.totalEntries} entradas
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Selected Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-96 border-l border-slate-200 bg-white p-6 overflow-y-auto"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedDay.dayOfWeek}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-slate-600">
                {new Date(selectedDay.date).toLocaleDateString('pt-PT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-sm font-semibold text-sky-600 mt-1">
                {selectedDay.totalEntries} entradas
              </p>
            </div>

            <div className="space-y-3">
              {selectedDay.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold text-xs">
                        {entry.athleteName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {entry.athleteName}
                        </p>
                        <p className="text-xs text-slate-500">{entry.timestamp}</p>
                      </div>
                    </div>
                    {entry.trend && <TrendBadge trend={entry.trend} />}
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">{entry.metricName}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {entry.value}
                      <span className="text-sm font-semibold text-slate-500 ml-1">
                        {entry.unit}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// SHARED: TREND BADGE
// ============================================================================

interface TrendBadgeProps {
  trend: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md';
}

function TrendBadge({ trend, size = 'md' }: TrendBadgeProps) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  if (trend === 'up') {
    return (
      <div className={`${sizeClass} flex items-center justify-center bg-emerald-100 rounded-full`}>
        <TrendingUp className={`${iconSize} text-emerald-600`} />
      </div>
    );
  }

  if (trend === 'down') {
    return (
      <div className={`${sizeClass} flex items-center justify-center bg-red-100 rounded-full`}>
        <TrendingUp className={`${iconSize} text-red-600 rotate-180`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} flex items-center justify-center bg-slate-100 rounded-full`}>
      <span className="text-slate-600 font-bold">—</span>
    </div>
  );
}
