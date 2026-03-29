/**
 * TEAM VIEW EVENT
 * Event card for team/resource view
 */

import React from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Clock, Users, MapPin } from 'lucide-react';
import { CalendarEvent, EVENT_TYPE_COLORS } from '@/types/calendar';
import { useCalendar } from '../core/CalendarProvider';

interface TeamViewEventProps {
  event: CalendarEvent;
  index: number;
}

export function TeamViewEvent({ event, index }: TeamViewEventProps) {
  const { setSelectedEvent, setIsDetailsModalOpen } = useCalendar();
  
  const typeColors = EVENT_TYPE_COLORS[event.type];
  
  // Calculate event duration in minutes
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  
  // Calculate position and height
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const topPosition = (startHour * 60 + startMinute); // in minutes from midnight
  const heightInMinutes = Math.max(durationMinutes, 30); // Minimum 30min height
  
  // Handle click
  const handleClick = () => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };
  
  // Short event optimization (< 60 min)
  const isShortEvent = durationMinutes < 60;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      onClick={handleClick}
      className={`
        absolute
        left-1
        right-1
        rounded-lg
        p-1.5 sm:p-2
        cursor-pointer
        overflow-hidden
        ${typeColors.bg}
        ${typeColors.border}
        border-l-4
        ${typeColors.hoverBg}
        transition-all
        shadow-sm
        hover:shadow-md
      `}
      style={{
        top: `${(topPosition / 60) * 4}rem`, // 4rem per hour
        height: `${(heightInMinutes / 60) * 4}rem`,
        minHeight: isShortEvent ? '2rem' : '3rem',
      }}
    >
      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Time */}
        <div className="flex items-center gap-1 mb-0.5">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span className="text-xs font-semibold">
            {format(start, 'HH:mm')}
          </span>
        </div>
        
        {/* Title */}
        <p className={`font-bold text-slate-900 truncate ${isShortEvent ? 'text-xs' : 'text-sm'}`}>
          {event.title}
        </p>
        
        {/* Details (only if not short) */}
        {!isShortEvent && (
          <>
            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 flex-shrink-0 text-slate-600" />
                <span className="text-xs text-slate-700 truncate">
                  {event.location}
                </span>
              </div>
            )}
            
            {/* Athletes count */}
            {event.athlete_ids && event.athlete_ids.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 flex-shrink-0 text-slate-600" />
                <span className="text-xs text-slate-700">
                  {event.athlete_ids.length} {event.athlete_ids.length === 1 ? 'atleta' : 'atletas'}
                </span>
              </div>
            )}
          </>
        )}
        
        {/* Duration badge (for long events) */}
        {durationMinutes >= 120 && (
          <div className="mt-auto pt-1">
            <span className="text-xs font-medium text-slate-600">
              {Math.round(durationMinutes / 60)}h {durationMinutes % 60}min
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
