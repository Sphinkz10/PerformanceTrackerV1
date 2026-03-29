/**
 * ATHLETE ROW
 * Individual athlete timeline row in team view
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CalendarEvent } from '@/types/calendar';
import { TeamViewEvent } from './TeamViewEvent';
import { useCalendar } from '../core/CalendarProvider';
import { AthleteAvailability, AvailabilityStatus } from './AthleteAvailability';
import { format } from 'date-fns';

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  status?: 'active' | 'injured' | 'rest';
  availability?: AvailabilityStatus;
  availabilityNotes?: string;
}

interface AthleteRowProps {
  athlete: Athlete;
  events: CalendarEvent[];
  index: number;
}

export function AthleteRow({ athlete, events, index }: AthleteRowProps) {
  const { setIsCreateModalOpen, setCurrentDate } = useCalendar();
  
  // Filter events for this athlete
  const athleteEvents = useMemo(() => {
    return events.filter(event => 
      event.athlete_ids && event.athlete_ids.includes(athlete.id)
    );
  }, [events, athlete.id]);
  
  // Handle click on empty slot to create event
  const handleSlotClick = (hour: number) => {
    const newDate = new Date();
    newDate.setHours(hour, 0, 0, 0);
    setCurrentDate(newDate);
    setIsCreateModalOpen(true);
    // TODO: Pre-select this athlete in create modal
  };
  
  // Calculate utilization (hours busy / total hours)
  const utilization = useMemo(() => {
    const totalMinutes = athleteEvents.reduce((acc, event) => {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    const utilizationPercent = (totalMinutes / (24 * 60)) * 100;
    return Math.round(utilizationPercent);
  }, [athleteEvents]);
  
  // Status badge color
  const getStatusColor = () => {
    switch (athlete.status) {
      case 'injured':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'rest':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    }
  };
  
  const getStatusLabel = () => {
    switch (athlete.status) {
      case 'injured':
        return 'Lesionado';
      case 'rest':
        return 'Descanso';
      default:
        return 'Ativo';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
    >
      {/* Athlete Info Sidebar */}
      <div className="sticky left-0 z-10 w-48 sm:w-56 border-r border-slate-200 bg-white p-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              {athlete.avatar ? (
                <img src={athlete.avatar} alt={athlete.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">
                  {athlete.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            
            {/* Status indicator dot */}
            <div className={`
              absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white
              ${athlete.status === 'injured' ? 'bg-red-500' : 
                athlete.status === 'rest' ? 'bg-amber-500' : 
                'bg-emerald-500'}
            `} />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate text-sm">
              {athlete.name}
            </p>
            
            {/* Status badge */}
            <span className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border
              ${getStatusColor()}
            `}>
              {getStatusLabel()}
            </span>
            
            {/* Utilization */}
            <p className="text-xs text-slate-600 mt-1">
              {athleteEvents.length} eventos • {utilization}% ocupado
            </p>
          </div>
        </div>
      </div>
      
      {/* Timeline Grid */}
      <div className="flex-1 relative min-h-[100px]">
        {/* Hour slots (clickable background) */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 24 }, (_, hour) => (
            <button
              key={hour}
              onClick={() => handleSlotClick(hour)}
              className="flex-1 border-r border-slate-100 hover:bg-sky-50/30 transition-colors cursor-pointer"
              aria-label={`Criar evento às ${hour}:00 para ${athlete.name}`}
            />
          ))}
        </div>
        
        {/* Events */}
        <div className="relative h-full" style={{ minHeight: '96px' }}>
          {athleteEvents.map((event, idx) => (
            <TeamViewEvent
              key={event.id}
              event={event}
              index={idx}
            />
          ))}
        </div>
        
        {/* Empty state */}
        {athleteEvents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-400">
              Sem eventos agendados
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}