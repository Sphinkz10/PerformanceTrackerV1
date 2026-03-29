/**
 * DAY VIEW
 * Timeline view showing 24 hours with events positioned by time
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { format, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, Clock, Plus } from 'lucide-react';
import { useCalendar } from '../core/CalendarProvider';
import { useCalendarEvents } from '@/hooks/use-api';
import { DayViewEvent } from '../components/DayViewEvent';
import { CalendarEvent } from '@/types/calendar';
import { findConflictingEvents } from '@/utils/calendarConflicts';

interface DayViewProps {
  workspaceId: string;
}

// Generate 24 hours (00:00 to 23:00)
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 80; // px per hour
const TOTAL_HEIGHT = HOUR_HEIGHT * 24; // 1920px

export function DayView({ workspaceId }: DayViewProps) {
  const { currentDate, filters, setIsCreateModalOpen, setSelectedEvent, setIsDetailsModalOpen } = useCalendar();
  const timelineRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);
  
  // Fetch events for this day
  const startDate = format(startOfDay(currentDate), 'yyyy-MM-dd');
  const endDate = format(endOfDay(currentDate), 'yyyy-MM-dd');
  
  const { data: eventsData, isLoading } = useCalendarEvents(
    workspaceId,
    {
      start_date: startDate,
      end_date: endDate,
      ...filters
    }
  );
  
  const events = eventsData?.events || [];
  
  // Filter events for exactly this day
  const dayEvents = useMemo(() => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), currentDate)
    );
  }, [events, currentDate]);
  
  // Detect conflicts
  const eventConflicts = useMemo(() => {
    const conflicts: Record<string, CalendarEvent[]> = {};
    
    dayEvents.forEach(event => {
      conflicts[event.id] = findConflictingEvents(event, dayEvents, event.id);
    });
    
    return conflicts;
  }, [dayEvents]);
  
  // Get current time position
  const currentTime = new Date();
  const isToday = isSameDay(currentDate, currentTime);
  const currentTimePosition = useMemo(() => {
    if (!isToday) return null;
    
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percentage = (totalMinutes / 1440) * 100; // 1440 = 24 * 60
    
    return percentage;
  }, [isToday, currentTime]);
  
  // Auto-scroll to current time on mount
  useEffect(() => {
    if (isToday && currentTimeRef.current) {
      setTimeout(() => {
        currentTimeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [isToday]);
  
  // Handle click on empty time slot
  const handleTimeSlotClick = (hour: number) => {
    setIsCreateModalOpen(true);
    // TODO: Pre-fill with clicked time
  };
  
  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };
  
  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent) => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();
    const startTotalMinutes = startHours * 60 + startMinutes;
    
    const endHours = end.getHours();
    const endMinutes = end.getMinutes();
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    // Position from top (in pixels)
    const top = (startTotalMinutes / 60) * HOUR_HEIGHT;
    
    // Height (in pixels)
    const height = (durationMinutes / 60) * HOUR_HEIGHT;
    
    return {
      top: `${top}px`,
      height: `${Math.max(height, 40)}px`, // Minimum 40px
      minHeight: '40px'
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-8 w-8 text-slate-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-600">A carregar eventos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {format(currentDate, "EEEE, d 'de' MMMM", { locale: pt })}
          </h3>
          <p className="text-sm text-slate-600">
            {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'} agendados
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Evento</span>
        </motion.button>
      </div>
      
      {/* Timeline Container */}
      <div 
        ref={timelineRef}
        className="flex-1 overflow-y-auto relative"
      >
        <div className="relative" style={{ height: `${TOTAL_HEIGHT}px` }}>
          {/* Time labels and grid */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-slate-200"
              style={{ top: `${hour * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
            >
              <div className="flex">
                {/* Time label */}
                <div className="w-16 flex-shrink-0 pr-4 text-right">
                  <span className="text-xs font-medium text-slate-500">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                
                {/* Empty slot - clickable */}
                <button
                  onClick={() => handleTimeSlotClick(hour)}
                  className="flex-1 group hover:bg-sky-50/50 transition-colors relative"
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      Criar evento às {hour.toString().padStart(2, '0')}:00
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ))}
          
          {/* Current time indicator */}
          {isToday && currentTimePosition !== null && (
            <motion.div
              ref={currentTimeRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute left-0 right-0 z-20 pointer-events-none"
              style={{ top: `${(currentTimePosition / 100) * TOTAL_HEIGHT}px` }}
            >
              <div className="flex items-center">
                <div className="w-16 flex-shrink-0 pr-4 text-right">
                  <span className="text-xs font-bold text-red-600">
                    {format(currentTime, 'HH:mm')}
                  </span>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 -ml-1" />
                  <div className="flex-1 h-0.5 bg-red-500" />
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Events */}
          <div className="absolute left-16 right-0 top-0 bottom-0">
            {dayEvents.map((event, index) => {
              const style = getEventStyle(event);
              const conflicts = eventConflicts[event.id] || [];
              const hasConflict = conflicts.length > 0;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute left-2 right-2 z-10"
                  style={style}
                >
                  <DayViewEvent
                    event={event}
                    onClick={() => handleEventClick(event)}
                    hasConflict={hasConflict}
                    conflictCount={conflicts.length}
                  />
                </motion.div>
              );
            })}
          </div>
          
          {/* Empty state */}
          {dayEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center max-w-md px-4">
                <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  Sem eventos agendados
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Clique numa hora para criar um novo evento
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}