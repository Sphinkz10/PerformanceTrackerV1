/**
 * EVENT CARD
 * Visual card for displaying calendar events
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, MapPin, CheckCircle, XCircle, AlertCircle, Dumbbell, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarEvent, EVENT_TYPE_COLORS } from '@/types/calendar';
import { useCalendar } from '../core/CalendarProvider';

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  hasConflict?: boolean;
  conflictCount?: number;
}

export function EventCard({ event, compact = false, hasConflict = false, conflictCount = 0 }: EventCardProps) {
  const { setSelectedEvent, setIsDetailsModalOpen } = useCalendar();
  
  const typeColors = EVENT_TYPE_COLORS[event.type];
  
  const handleClick = () => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };
  
  const startTime = format(new Date(event.start_date), 'HH:mm');
  const endTime = format(new Date(event.end_date), 'HH:mm');
  
  // Status icon
  const StatusIcon = event.status === 'completed' 
    ? CheckCircle 
    : event.status === 'cancelled'
    ? XCircle
    : AlertCircle;
  
  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`w-full text-left p-2 rounded-xl border-2 ${typeColors.border} ${typeColors.background} hover:shadow-md transition-all`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-500 mb-1">
              {startTime}
            </div>
            <div className={`text-sm font-semibold ${typeColors.text} truncate`}>
              {event.title}
            </div>
          </div>
          <StatusIcon className={`h-4 w-4 flex-shrink-0 ${typeColors.text}`} />
        </div>
        
        {event.athlete_ids && event.athlete_ids.length > 0 && (
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
            <Users className="h-3 w-3" />
            <span>{event.athlete_ids.length}</span>
          </div>
        )}
      </motion.button>
    );
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`w-full text-left p-4 rounded-xl border-2 ${typeColors.border} ${typeColors.background} hover:shadow-lg transition-all`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className={`text-lg font-bold ${typeColors.text} mb-1`}>
              {event.title}
            </div>
            {event.description && (
              <div className="text-sm text-slate-600 line-clamp-2">
                {event.description}
              </div>
            )}
          </div>
          
          <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${typeColors.background} ${typeColors.text}`}>
            {event.status === 'scheduled' && 'Agendado'}
            {event.status === 'active' && 'Ativo'}
            {event.status === 'completed' && 'Completo'}
            {event.status === 'cancelled' && 'Cancelado'}
            {event.status === 'postponed' && 'Adiado'}
          </div>
        </div>
        
        {/* Details */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{startTime} - {endTime}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.workout_id && (
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>Workout</span>
            </div>
          )}
          
          {event.athlete_ids && event.athlete_ids.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{event.athlete_ids.length} atletas</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Conflict Indicator */}
        {hasConflict && (
          <div className="flex items-center gap-1 text-xs text-red-500">
            <AlertTriangle className="h-3 w-3" />
            <span>{conflictCount} conflitos</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}