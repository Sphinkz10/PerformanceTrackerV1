/**
 * USE CALENDAR METRICS HOOK
 * Calculate calendar statistics and metrics
 * 
 * Features:
 * - Event counts by status/type
 * - Attendance rates
 * - Completion rates
 * - Trends over time
 * - Workspace isolation
 * - Performance optimized
 * 
 * @module hooks/use-calendar-metrics
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { useMemo } from 'react';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  differenceInDays,
  eachDayOfInterval,
  format,
} from 'date-fns';
import { CalendarEvent, EventParticipantWithDetails } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarMetrics {
  // Overall stats
  totalEvents: number;
  confirmedEvents: number;
  pendingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  
  // Rates
  confirmationRate: number; // % of events confirmed
  completionRate: number; // % of events completed
  cancellationRate: number; // % of events cancelled
  
  // By type
  eventsByType: Record<string, number>;
  
  // By period
  thisWeekEvents: number;
  thisMonthEvents: number;
  
  // Trends
  eventsPerDay: Array<{ date: string; count: number }>;
  
  // Participants (if available)
  totalParticipants: number;
  averageParticipantsPerEvent: number;
  
  // Attendance (if available)
  attendanceRate: number; // % of participants who attended
}

export interface CalendarMetricsOptions {
  workspaceId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeTypes?: string[];
  includeStatuses?: string[];
}

// ============================================================================
// HOOK
// ============================================================================

export function useCalendarMetrics(
  events: CalendarEvent[],
  participants?: EventParticipantWithDetails[],
  options: CalendarMetricsOptions = {}
): CalendarMetrics {
  
  const metrics = useMemo(() => {
    // Filter events
    let filteredEvents = events;

    // Workspace isolation
    if (options.workspaceId) {
      filteredEvents = filteredEvents.filter(e => e.workspace_id === options.workspaceId);
    }

    // Date range
    if (options.dateRange) {
      filteredEvents = filteredEvents.filter(e => {
        const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
        return isWithinInterval(eventDate, options.dateRange!);
      });
    }

    // Type filter
    if (options.includeTypes && options.includeTypes.length > 0) {
      filteredEvents = filteredEvents.filter(e => options.includeTypes!.includes(e.type));
    }

    // Status filter
    if (options.includeStatuses && options.includeStatuses.length > 0) {
      filteredEvents = filteredEvents.filter(e => options.includeStatuses!.includes(e.status));
    }

    // Calculate basic counts
    const totalEvents = filteredEvents.length;
    const confirmedEvents = filteredEvents.filter(e => e.status === 'confirmed').length;
    const pendingEvents = filteredEvents.filter(e => e.status === 'pending').length;
    const completedEvents = filteredEvents.filter(e => e.status === 'completed').length;
    const cancelledEvents = filteredEvents.filter(e => e.status === 'cancelled').length;

    // Calculate rates
    const confirmationRate = totalEvents > 0 ? (confirmedEvents / totalEvents) * 100 : 0;
    const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
    const cancellationRate = totalEvents > 0 ? (cancelledEvents / totalEvents) * 100 : 0;

    // Events by type
    const eventsByType: Record<string, number> = {};
    filteredEvents.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    });

    // This week/month
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const thisWeekEvents = filteredEvents.filter(e => {
      const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return isWithinInterval(eventDate, { start: thisWeekStart, end: thisWeekEnd });
    }).length;

    const thisMonthEvents = filteredEvents.filter(e => {
      const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return isWithinInterval(eventDate, { start: thisMonthStart, end: thisMonthEnd });
    }).length;

    // Events per day (for trends)
    let eventsPerDay: Array<{ date: string; count: number }> = [];
    
    if (options.dateRange) {
      const days = eachDayOfInterval({
        start: options.dateRange.start,
        end: options.dateRange.end,
      });

      eventsPerDay = days.map(day => {
        const count = filteredEvents.filter(e => {
          const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
          return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        }).length;

        return {
          date: format(day, 'yyyy-MM-dd'),
          count,
        };
      });
    } else {
      // Last 7 days
      const last7Days = eachDayOfInterval({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: now,
      });

      eventsPerDay = last7Days.map(day => {
        const count = filteredEvents.filter(e => {
          const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
          return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        }).length;

        return {
          date: format(day, 'yyyy-MM-dd'),
          count,
        };
      });
    }

    // Participant stats (if provided)
    let totalParticipants = 0;
    let averageParticipantsPerEvent = 0;
    let attendanceRate = 0;

    if (participants && participants.length > 0) {
      // Filter participants for filtered events
      const eventIds = new Set(filteredEvents.map(e => e.id));
      const filteredParticipants = participants.filter(p => eventIds.has(p.event_id));

      totalParticipants = filteredParticipants.length;
      averageParticipantsPerEvent = totalEvents > 0 ? totalParticipants / totalEvents : 0;

      // Calculate attendance rate
      const attendedCount = filteredParticipants.filter(
        p => p.attendance_status === 'present'
      ).length;
      attendanceRate = totalParticipants > 0 ? (attendedCount / totalParticipants) * 100 : 0;
    } else {
      // Use athlete_ids from events if participants not provided
      const allAthleteIds = filteredEvents.flatMap(e => e.athlete_ids || []);
      totalParticipants = allAthleteIds.length;
      averageParticipantsPerEvent = totalEvents > 0 ? totalParticipants / totalEvents : 0;
    }

    return {
      totalEvents,
      confirmedEvents,
      pendingEvents,
      completedEvents,
      cancelledEvents,
      confirmationRate,
      completionRate,
      cancellationRate,
      eventsByType,
      thisWeekEvents,
      thisMonthEvents,
      eventsPerDay,
      totalParticipants,
      averageParticipantsPerEvent,
      attendanceRate,
    };
  }, [events, participants, options]);

  return metrics;
}

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Get event counts by status
 */
export function useEventStatusCounts(events: CalendarEvent[], workspaceId?: string) {
  return useMemo(() => {
    const filtered = workspaceId 
      ? events.filter(e => e.workspace_id === workspaceId)
      : events;

    return {
      confirmed: filtered.filter(e => e.status === 'confirmed').length,
      pending: filtered.filter(e => e.status === 'pending').length,
      completed: filtered.filter(e => e.status === 'completed').length,
      cancelled: filtered.filter(e => e.status === 'cancelled').length,
      total: filtered.length,
    };
  }, [events, workspaceId]);
}

/**
 * Get event counts by type
 */
export function useEventTypeCounts(events: CalendarEvent[], workspaceId?: string) {
  return useMemo(() => {
    const filtered = workspaceId 
      ? events.filter(e => e.workspace_id === workspaceId)
      : events;

    const counts: Record<string, number> = {};
    
    filtered.forEach(event => {
      counts[event.type] = (counts[event.type] || 0) + 1;
    });

    return counts;
  }, [events, workspaceId]);
}

/**
 * Get upcoming events count
 */
export function useUpcomingEventsCount(
  events: CalendarEvent[],
  workspaceId?: string,
  days: number = 7
) {
  return useMemo(() => {
    const filtered = workspaceId 
      ? events.filter(e => e.workspace_id === workspaceId)
      : events;

    const now = new Date();
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return filtered.filter(e => {
      if (e.status === 'cancelled') return false;
      
      const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return eventDate >= now && eventDate <= futureDate;
    }).length;
  }, [events, workspaceId, days]);
}

/**
 * Get overdue events count (pending events in the past)
 */
export function useOverdueEventsCount(events: CalendarEvent[], workspaceId?: string) {
  return useMemo(() => {
    const filtered = workspaceId 
      ? events.filter(e => e.workspace_id === workspaceId)
      : events;

    const now = new Date();

    return filtered.filter(e => {
      if (e.status !== 'pending' && e.status !== 'confirmed') return false;
      
      const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return eventDate < now;
    }).length;
  }, [events, workspaceId]);
}

/**
 * Calculate event completion trend (last N days)
 */
export function useEventCompletionTrend(
  events: CalendarEvent[],
  workspaceId?: string,
  days: number = 30
) {
  return useMemo(() => {
    const filtered = workspaceId 
      ? events.filter(e => e.workspace_id === workspaceId)
      : events;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const eventsInRange = filtered.filter(e => {
      const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return isWithinInterval(eventDate, { start: startDate, end: endDate });
    });

    const completed = eventsInRange.filter(e => e.status === 'completed').length;
    const total = eventsInRange.length;

    return {
      completed,
      total,
      rate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [events, workspaceId, days]);
}
