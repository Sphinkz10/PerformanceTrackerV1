/**
 * MONTH EVENT PILL
 * Small event indicator for month view
 */

import React from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';
import { CalendarEvent, EVENT_TYPE_COLORS } from '@/types/calendar';
import { MonthDay, eventStartsOnDay } from '@/utils/calendarMonthHelpers';
import { useCalendar } from '../core/CalendarProvider';

interface MonthEventPillProps {
  event: CalendarEvent;
  index: number;
  day: MonthDay;
  dayIndex: number;
  allDays: MonthDay[];
}

export function MonthEventPill({ event, index, day }: MonthEventPillProps) {
  const { setSelectedEvent, setIsDetailsModalOpen } = useCalendar();
  
  const typeColors = EVENT_TYPE_COLORS[event.type];
  
  // Check if this is the first day of the event (to show full info)
  const isFirstDay = eventStartsOnDay(event, day.date);
  
  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };
  
  // Get background color based on type
  const getBgColor = () => {
    switch (event.type) {
      case 'training':
        return 'bg-emerald-500';
      case 'match':
        return 'bg-sky-500';
      case 'competition':
        return 'bg-amber-500';
      case 'rest':
        return 'bg-red-500';
      case 'meeting':
        return 'bg-violet-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  // Get hover color
  const getHoverBgColor = () => {
    switch (event.type) {
      case 'training':
        return 'hover:bg-emerald-600';
      case 'match':
        return 'hover:bg-sky-600';
      case 'competition':
        return 'hover:bg-amber-600';
      case 'rest':
        return 'hover:bg-red-600';
      case 'meeting':
        return 'hover:bg-violet-600';
      default:
        return 'hover:bg-slate-600';
    }
  };
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.05, x: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        w-full
        text-left
        rounded
        px-1 sm:px-2
        py-0.5 sm:py-1
        text-xs
        font-medium
        text-white
        transition-all
        truncate
        ${getBgColor()}
        ${getHoverBgColor()}
        flex items-center gap-1
      `}
      title={`${event.title} - ${format(new Date(event.start_date), 'HH:mm')}`}
    >
      {/* Time (only on first day) */}
      {isFirstDay && (
        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
      )}
      
      {/* Title */}
      <span className="truncate flex-1">
        {isFirstDay && (
          <span className="hidden sm:inline">
            {format(new Date(event.start_date), 'HH:mm')} {' '}
          </span>
        )}
        {event.title}
      </span>
      
      {/* Conflict indicator */}
      {/* TODO: Add conflict detection */}
    </motion.button>
  );
}
