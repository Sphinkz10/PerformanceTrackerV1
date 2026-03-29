/**
 * WEEK VIEW
 * Grid 7 colunas (Seg-Dom) com eventos posicionados
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isToday,
  addDays 
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { useCalendar } from '../core/CalendarProvider';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useCalendarEvents } from '@/hooks/use-api';
import { CalendarEvent, CALENDAR_CONSTANTS } from '@/types/calendar';
import { findConflictingEvents } from '@/utils/calendarConflicts';

interface WeekViewProps {
  workspaceId: string;
}

export function WeekView({ workspaceId }: WeekViewProps) {
  const { currentDate, filters, setIsCreateModalOpen } = useCalendar();
  
  // Get week days
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);
  
  // Fetch events for this week
  const startDate = format(weekDays[0], 'yyyy-MM-dd');
  const endDate = format(addDays(weekDays[6], 1), 'yyyy-MM-dd'); // Include end of Sunday
  
  const { data: eventsData, isLoading } = useCalendarEvents(
    workspaceId,
    {
      start_date: startDate,
      end_date: endDate,
      ...filters
    }
  );
  
  const events = eventsData?.events || [];
  
  // Detect conflicts for each event
  const eventConflicts = useMemo(() => {
    const conflicts: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      conflicts[event.id] = findConflictingEvents(event, events, event.id);
    });
    
    return conflicts;
  }, [events]);
  
  // Group events by day
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = [];
    });
    
    events.forEach(event => {
      const eventDate = format(new Date(event.start_date), 'yyyy-MM-dd');
      if (grouped[eventDate]) {
        grouped[eventDate].push(event);
      }
    });
    
    return grouped;
  }, [events, weekDays]);
  
  if (isLoading) {
    return (
      <LoadingState />
    );
  }
  
  if (events.length === 0) {
    return (
      <EmptyState
        title="Sem eventos esta semana"
        description="Crie o seu primeiro evento ou importe do Design Studio"
        onAction={() => setIsCreateModalOpen(true)}
        actionLabel="Criar Evento"
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Week grid - ✅ Day 12: Horizontal scroll on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-7 gap-2 min-w-[800px] sm:min-w-0">
          {weekDays.map((day, index) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay[dayKey] || [];
            const isTodayDay = isToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <motion.div
                key={dayKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border-2 p-2 sm:p-3 min-h-[300px] sm:min-h-[400px] ${
                  isTodayDay
                    ? 'border-sky-300 bg-sky-50/50'
                    : isWeekend
                    ? 'border-slate-200 bg-slate-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Day header */}
                <div className="mb-2 sm:mb-3 pb-2 border-b border-slate-200">
                  <div className={`text-xs font-medium uppercase tracking-wide ${
                    isTodayDay ? 'text-sky-600' : 'text-slate-500'
                  }`}>
                    {format(day, 'EEE', { locale: pt })}
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold ${
                    isTodayDay 
                      ? 'text-sky-600' 
                      : 'text-slate-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                {/* Events */}
                <div className="space-y-2">
                  {dayEvents.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-slate-400 text-xs sm:text-sm">
                      Sem eventos
                    </div>
                  ) : (
                    dayEvents.map((event, eventIndex) => {
                      const conflicts = eventConflicts[event.id] || [];
                      const hasConflict = conflicts.length > 0;
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: eventIndex * 0.05 }}
                        >
                          <EventCard 
                            event={event} 
                            compact 
                            hasConflict={hasConflict}
                            conflictCount={conflicts.length}
                          />
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-200">
        <div>
          <span className="font-semibold text-slate-900">{events.length}</span> eventos esta semana
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-sky-500" />
            <span>Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Pendente</span>
          </div>
        </div>
      </div>
    </div>
  );
}