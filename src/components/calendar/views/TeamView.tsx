/**
 * TEAM VIEW
 * Resource timeline showing multiple athletes side-by-side
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { format, addDays, subDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, Plus, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useCalendar } from '../core/CalendarProvider';
import { useCalendarEvents } from '@/hooks/use-api';
import { CalendarEvent } from '@/types/calendar';
import { MOCK_ATHLETES } from '../utils/mockData';
import { AthleteRow } from '../components/AthleteRow';
import { AthleteSelector } from '../components/AthleteSelector';

interface TeamViewProps {
  workspaceId: string;
}

// Mock athletes - In real app, fetch from API
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function TeamView({ workspaceId }: TeamViewProps) {
  const { 
    currentDate, 
    setCurrentDate,
    filters, 
    setIsCreateModalOpen 
  } = useCalendar();
  
  // Selected athletes state
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>(
    MOCK_ATHLETES.slice(0, 5).map(a => a.id) // Default: first 5 athletes
  );
  
  // Calculate day range (just current day for team view)
  const dayStart = format(currentDate, 'yyyy-MM-dd');
  const dayEnd = format(addDays(currentDate, 1), 'yyyy-MM-dd');
  
  // Fetch events for the day
  const { data: eventsData, isLoading } = useCalendarEvents(
    workspaceId,
    {
      start_date: dayStart,
      end_date: dayEnd,
      ...filters
    }
  );
  
  const events = eventsData?.events || [];
  
  // Filter athletes based on selection
  const displayedAthletes = useMemo(() => {
    return MOCK_ATHLETES.filter(a => selectedAthleteIds.includes(a.id));
  }, [selectedAthleteIds]);
  
  // Navigation
  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-slate-400 animate-pulse mx-auto mb-2" />
          <p className="text-sm text-slate-600">A carregar vista de equipa...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Date */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {displayedAthletes.length} {displayedAthletes.length === 1 ? 'atleta' : 'atletas'} • {events.length} {events.length === 1 ? 'evento' : 'eventos'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Athlete Selector */}
          <AthleteSelector
            athletes={MOCK_ATHLETES}
            selectedIds={selectedAthleteIds}
            onChange={setSelectedAthleteIds}
          />
          
          {/* Today button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
          >
            <Calendar className="h-4 w-4" />
            Hoje
          </motion.button>
          
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousDay}
              className="h-9 w-9 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextDay}
              className="h-9 w-9 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all"
            >
              <ChevronRight className="h-4 w-4 text-slate-700" />
            </motion.button>
          </div>
          
          {/* New Event */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo</span>
          </motion.button>
        </div>
      </div>
      
      {/* Team Timeline */}
      <div className="flex-1 overflow-auto">
        {displayedAthletes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <Users className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhum atleta selecionado
            </h3>
            <p className="text-sm text-slate-600 mb-4 max-w-md">
              Selecione atletas para visualizar os seus horários e eventos
            </p>
            <AthleteSelector
              athletes={MOCK_ATHLETES}
              selectedIds={selectedAthleteIds}
              onChange={setSelectedAthleteIds}
            />
          </div>
        ) : (
          <div className="min-w-max">
            {/* Hour Headers */}
            <div className="flex sticky top-0 z-20 bg-white border-b-2 border-slate-200">
              {/* Spacer for athlete names column */}
              <div className="w-48 sm:w-56 border-r border-slate-200 flex-shrink-0" />
              
              {/* Hour labels */}
              <div className="flex-1 flex">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 border-r border-slate-200 px-2 py-3 text-center min-w-[60px]"
                  >
                    <span className="text-xs font-semibold text-slate-700">
                      {String(hour).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Athlete Rows */}
            <div>
              {displayedAthletes.map((athlete, index) => (
                <AthleteRow
                  key={athlete.id}
                  athlete={athlete}
                  events={events}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {displayedAthletes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Ativo</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Lesionado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span>Descanso</span>
            </div>
            <div className="ml-auto text-slate-500">
              Clique numa hora vazia para criar evento
            </div>
          </div>
        </div>
      )}
    </div>
  );
}