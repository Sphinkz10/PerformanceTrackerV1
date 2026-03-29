/**
 * AGENDA VIEW
 * Lista cronológica de eventos
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { format, addDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useCalendar } from '../core/CalendarProvider';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useCalendarEvents } from '@/hooks/use-api';
import { CalendarEvent } from '@/types/calendar';

interface AgendaViewProps {
  workspaceId: string;
}

export function AgendaView({ workspaceId }: AgendaViewProps) {
  const { currentDate, filters, setIsCreateModalOpen } = useCalendar();
  
  // Fetch events for next 30 days
  const startDate = format(currentDate, 'yyyy-MM-dd');
  const endDate = format(addDays(currentDate, 30), 'yyyy-MM-dd');
  
  const { data: eventsData, isLoading } = useCalendarEvents(
    workspaceId,
    {
      start_date: startDate,
      end_date: endDate,
      ...filters
    }
  );
  
  const events = eventsData?.events || [];
  
  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      const dateKey = format(new Date(event.start_date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Sort each day's events by time
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
    });
    
    return grouped;
  }, [events]);
  
  const sortedDates = Object.keys(eventsByDate).sort();
  
  if (isLoading) {
    return (
      <LoadingState />
    );
  }
  
  if (events.length === 0) {
    return (
      <EmptyState
        title="Sem eventos agendados"
        description="Crie o seu primeiro evento ou importe do Design Studio"
        onAction={() => setIsCreateModalOpen(true)}
        actionLabel="Criar Evento"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey, index) => {
        const dayEvents = eventsByDate[dateKey];
        const date = new Date(dateKey);
        
        return (
          <motion.div
            key={dateKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-3"
          >
            {/* Date header */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 text-center">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {format(date, 'EEE', { locale: pt })}
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {format(date, 'd')}
                </div>
                <div className="text-xs text-slate-500">
                  {format(date, 'MMM', { locale: pt })}
                </div>
              </div>
              
              <div className="flex-1 h-px bg-slate-200" />
              
              <div className="text-sm font-medium text-slate-600">
                {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'}
              </div>
            </div>
            
            {/* Events list */}
            <div className="space-y-2 pl-16">
              {dayEvents.map((event, eventIndex) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: eventIndex * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
      
      {/* Summary footer */}
      <div className="pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
        A mostrar <span className="font-semibold text-slate-900">{events.length}</span> eventos 
        dos próximos 30 dias
      </div>
    </div>
  );
}