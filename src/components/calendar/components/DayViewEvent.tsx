/**
 * DAY VIEW EVENT
 * Event card optimized for timeline view
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, MapPin, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarEvent, EVENT_TYPE_COLORS } from '@/types/calendar';

interface DayViewEventProps {
  event: CalendarEvent;
  onClick: () => void;
  hasConflict?: boolean;
  conflictCount?: number;
}

export function DayViewEvent({ event, onClick, hasConflict = false, conflictCount = 0 }: DayViewEventProps) {
  const typeColors = EVENT_TYPE_COLORS[event.type];
  
  const startTime = format(new Date(event.start_date), 'HH:mm');
  const endTime = format(new Date(event.end_date), 'HH:mm');
  
  // Calculate duration in minutes
  const durationMinutes = Math.round(
    (new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / 60000
  );
  
  // Determine if event is small (less than 60 minutes)
  const isSmall = durationMinutes < 60;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full h-full rounded-xl p-3 text-left
        border-l-4 shadow-md
        hover:shadow-lg transition-all
        ${typeColors.background}
        ${typeColors.border}
        ${hasConflict ? 'ring-2 ring-red-300' : ''}
        relative overflow-hidden
      `}
      style={{
        borderLeftColor: typeColors.border.includes('emerald') ? '#10b981' :
                         typeColors.border.includes('sky') ? '#0ea5e9' :
                         typeColors.border.includes('amber') ? '#f59e0b' :
                         typeColors.border.includes('red') ? '#ef4444' :
                         typeColors.border.includes('violet') ? '#8b5cf6' : '#64748b'
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            currentColor 0,
            currentColor 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold ${typeColors.text} truncate ${isSmall ? 'text-sm' : 'text-base'}`}>
              {event.title}
            </h4>
          </div>
          
          {hasConflict && (
            <div className="flex-shrink-0">
              <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                <AlertTriangle className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
        
        {/* Time */}
        <div className={`flex items-center gap-1 ${typeColors.text} mb-1 ${isSmall ? 'text-xs' : 'text-sm'}`}>
          <Clock className={isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          <span className="font-semibold">
            {startTime} - {endTime}
          </span>
          <span className="text-xs opacity-75">
            ({durationMinutes}min)
          </span>
        </div>
        
        {/* Additional info - only show if not too small */}
        {!isSmall && (
          <div className="space-y-1 mt-auto">
            {/* Location */}
            {event.location && (
              <div className={`flex items-center gap-1 ${typeColors.text} text-xs`}>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
            
            {/* Athletes count */}
            {event.athlete_ids && event.athlete_ids.length > 0 && (
              <div className={`flex items-center gap-1 ${typeColors.text} text-xs`}>
                <Users className="h-3 w-3" />
                <span>{event.athlete_ids.length} atleta{event.athlete_ids.length > 1 ? 's' : ''}</span>
              </div>
            )}
            
            {/* Conflict warning */}
            {hasConflict && (
              <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                <AlertTriangle className="h-3 w-3" />
                <span>{conflictCount} conflito{conflictCount > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Small event compact view */}
        {isSmall && event.athlete_ids && event.athlete_ids.length > 0 && (
          <div className={`flex items-center gap-2 mt-auto ${typeColors.text} text-xs`}>
            <Users className="h-3 w-3" />
            <span>{event.athlete_ids.length}</span>
            
            {hasConflict && (
              <>
                <span className="mx-1">•</span>
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span className="text-red-600 font-semibold">{conflictCount}</span>
              </>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
}
