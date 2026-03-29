/**
 * MONTH VIEW
 * Traditional calendar grid showing full month
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { format, addMonths, isToday, isSameMonth } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../core/CalendarProvider';
import { useCalendarEvents } from '@/hooks/use-api';
import { generateMonthDays, WEEKDAY_LABELS } from '@/utils/calendarMonthHelpers';
import { MonthDayCell } from '../components/MonthDayCell';

interface MonthViewProps {
  workspaceId: string;
}

export function MonthView({ workspaceId }: MonthViewProps) {
  const { 
    currentDate, 
    setCurrentDate,
    filters, 
    setIsCreateModalOpen 
  } = useCalendar();
  
  // Calculate month range
  const monthStart = format(currentDate, 'yyyy-MM-01');
  const monthEnd = format(addMonths(new Date(monthStart), 1), 'yyyy-MM-dd');
  
  // Fetch events for entire month (+ overflow)
  const { data: eventsData, isLoading } = useCalendarEvents(
    workspaceId,
    {
      start_date: format(addMonths(new Date(monthStart), -1), 'yyyy-MM-dd'), // Previous month
      end_date: format(addMonths(new Date(monthStart), 2), 'yyyy-MM-dd'), // Next month
      ...filters
    }
  );
  
  const events = eventsData?.events || [];
  
  // Generate 42 days (6 weeks) with events
  const monthDays = useMemo(() => {
    return generateMonthDays(currentDate, events);
  }, [currentDate, events]);
  
  // Split into weeks for rendering
  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeksArray.push(monthDays.slice(i, i + 7));
    }
    return weeksArray;
  }, [monthDays]);
  
  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-slate-400 animate-pulse mx-auto mb-2" />
          <p className="text-sm text-slate-600">A carregar calendário...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Calendar Grid */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
        {/* Weekday headers - ✅ Day 12: Already responsive with hidden/inline */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
            <div 
              key={day} 
              className={`p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold ${
                index >= 5 ? 'text-slate-500' : 'text-slate-700'
              }`}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((dayData, dayIndex) => (
              <MonthDayCell
                key={dayData.date.toISOString()}
                day={dayData}
                dayIndex={weekIndex * 7 + dayIndex}
                allDays={monthDays}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Treino</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-sky-500" />
            <span>Jogo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Competição</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Descanso</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-violet-500" />
            <span>Reunião</span>
          </div>
        </div>
      </div>
    </div>
  );
}