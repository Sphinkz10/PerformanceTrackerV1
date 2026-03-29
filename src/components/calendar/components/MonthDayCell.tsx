/**
 * MONTH DAY CELL
 * Individual day cell in month view grid
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ChevronDown } from 'lucide-react';
import { MonthDay } from '@/utils/calendarMonthHelpers';
import { useCalendar } from '../core/CalendarProvider';
import { MonthEventPill } from './MonthEventPill';

interface MonthDayCellProps {
  day: MonthDay;
  dayIndex: number;
  allDays: MonthDay[];
  workspaceId: string;
}

const MAX_VISIBLE_EVENTS = 3;

export function MonthDayCell({ day, dayIndex, allDays }: MonthDayCellProps) {
  const { setCurrentDate, setView, setIsCreateModalOpen } = useCalendar();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleEvents = isExpanded 
    ? day.events 
    : day.events.slice(0, MAX_VISIBLE_EVENTS);
  const hiddenCount = day.events.length - MAX_VISIBLE_EVENTS;
  
  // Handle day click - switch to day view
  const handleDayClick = () => {
    setCurrentDate(day.date);
    setView('day');
  };
  
  // Handle quick create
  const handleQuickCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(day.date);
    setIsCreateModalOpen(true);
  };
  
  // Toggle expanded state
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        relative
        rounded-xl
        border-2
        transition-all
        min-h-[80px] sm:min-h-[120px]
        p-1 sm:p-2
        cursor-pointer
        group
        ${day.isCurrentMonth 
          ? 'bg-white border-slate-200 hover:border-sky-300' 
          : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
        }
        ${day.isToday 
          ? 'ring-2 ring-sky-500 ring-offset-2 border-sky-400' 
          : ''
        }
      `}
      onClick={handleDayClick}
    >
      {/* Day number */}
      <div className="flex items-start justify-between mb-1">
        <div
          className={`
            text-sm sm:text-base font-bold
            h-6 w-6 sm:h-7 sm:w-7
            rounded-full
            flex items-center justify-center
            transition-all
            ${day.isToday 
              ? 'bg-sky-500 text-white' 
              : day.isCurrentMonth
                ? 'text-slate-900 group-hover:bg-sky-50'
                : 'text-slate-400'
            }
          `}
        >
          {format(day.date, 'd')}
        </div>
        
        {/* Quick create button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickCreate}
          className="
            opacity-0 group-hover:opacity-100
            transition-opacity
            h-5 w-5 sm:h-6 sm:w-6
            rounded-full
            bg-sky-500
            hover:bg-sky-600
            text-white
            flex items-center justify-center
          "
        >
          <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </motion.button>
      </div>
      
      {/* Events */}
      <div className="space-y-0.5 sm:space-y-1">
        <AnimatePresence mode="popLayout">
          {visibleEvents.map((event, index) => (
            <MonthEventPill
              key={event.id}
              event={event}
              index={index}
              day={day}
              dayIndex={dayIndex}
              allDays={allDays}
            />
          ))}
        </AnimatePresence>
        
        {/* Show more button */}
        {!isExpanded && hiddenCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleExpand}
            className="
              w-full
              text-xs font-medium
              text-sky-600
              hover:text-sky-700
              py-0.5 sm:py-1
              rounded
              hover:bg-sky-50
              transition-colors
              flex items-center justify-center gap-1
            "
          >
            <ChevronDown className="h-3 w-3" />
            +{hiddenCount} mais
          </motion.button>
        )}
        
        {/* Show less button */}
        {isExpanded && day.events.length > MAX_VISIBLE_EVENTS && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleExpand}
            className="
              w-full
              text-xs font-medium
              text-slate-600
              hover:text-slate-700
              py-0.5 sm:py-1
              rounded
              hover:bg-slate-50
              transition-colors
              flex items-center justify-center gap-1
            "
          >
            <ChevronDown className="h-3 w-3 rotate-180" />
            Ver menos
          </motion.button>
        )}
      </div>
      
      {/* Today indicator */}
      {day.isToday && (
        <div className="absolute top-1 right-1">
          <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
        </div>
      )}
      
      {/* Event count badge (mobile only) */}
      {day.events.length > 0 && (
        <div className="sm:hidden absolute bottom-1 right-1">
          <div className="h-5 w-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
            {day.events.length}
          </div>
        </div>
      )}
    </motion.div>
  );
}
