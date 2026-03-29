/**
 * CALENDAR REPORT GENERATORS
 * Generate different types of calendar reports
 * 
 * Features:
 * - Event summary reports
 * - Attendance reports
 * - Performance reports
 * - Utilization reports
 * - Export to multiple formats
 * - Workspace isolation
 * 
 * @module calendar/report-generators
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { format, parseISO, differenceInDays, eachDayOfInterval } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent, EventParticipantWithDetails } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export interface ReportOptions {
  workspaceId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeTypes?: string[];
  includeStatuses?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'type' | 'status' | 'athlete';
}

export interface EventSummaryReport {
  metadata: {
    generatedAt: Date;
    workspaceId: string;
    dateRange: { start: Date; end: Date };
    totalEvents: number;
  };
  summary: {
    totalEvents: number;
    confirmedEvents: number;
    pendingEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    confirmationRate: number;
    completionRate: number;
    cancellationRate: number;
  };
  byType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  timeline: Array<{
    date: string;
    count: number;
    confirmed: number;
    pending: number;
    completed: number;
  }>;
}

export interface AttendanceReport {
  metadata: {
    generatedAt: Date;
    workspaceId: string;
    dateRange: { start: Date; end: Date };
    totalEvents: number;
    totalParticipants: number;
  };
  overall: {
    totalParticipants: number;
    presentCount: number;
    absentCount: number;
    excusedCount: number;
    attendanceRate: number;
  };
  byEvent: Array<{
    eventId: string;
    eventTitle: string;
    eventDate: Date;
    totalParticipants: number;
    presentCount: number;
    attendanceRate: number;
  }>;
  byAthlete: Array<{
    athleteId: string;
    athleteName?: string;
    totalEvents: number;
    attendedEvents: number;
    attendanceRate: number;
  }>;
}

export interface PerformanceReport {
  metadata: {
    generatedAt: Date;
    workspaceId: string;
    dateRange: { start: Date; end: Date };
  };
  completionMetrics: {
    totalScheduled: number;
    completed: number;
    completionRate: number;
    averageDuration: number;
  };
  punctualityMetrics: {
    totalEvents: number;
    onTime: number;
    late: number;
    punctualityRate: number;
  };
  utilizationMetrics: {
    totalDays: number;
    daysWithEvents: number;
    utilizationRate: number;
    averageEventsPerDay: number;
  };
  trends: {
    period: string;
    eventsScheduled: number;
    eventsCompleted: number;
    completionRate: number;
  }[];
}

export interface UtilizationReport {
  metadata: {
    generatedAt: Date;
    workspaceId: string;
    dateRange: { start: Date; end: Date };
  };
  overall: {
    totalDays: number;
    daysWithEvents: number;
    utilizationRate: number;
    totalEvents: number;
    averageEventsPerDay: number;
  };
  byDayOfWeek: Array<{
    dayOfWeek: string;
    eventCount: number;
    percentage: number;
  }>;
  byTimeOfDay: Array<{
    timeSlot: string;
    eventCount: number;
    percentage: number;
  }>;
  peakTimes: {
    busiestDay: string;
    busiestDayCount: number;
    busiestTimeSlot: string;
    busiestTimeSlotCount: number;
  };
}

// ============================================================================
// EVENT SUMMARY REPORT
// ============================================================================

export function generateEventSummaryReport(
  events: CalendarEvent[],
  options: ReportOptions
): EventSummaryReport {
  // Filter events
  const filteredEvents = filterEvents(events, options);

  // Calculate summary
  const totalEvents = filteredEvents.length;
  const confirmedEvents = filteredEvents.filter(e => e.status === 'confirmed').length;
  const pendingEvents = filteredEvents.filter(e => e.status === 'pending').length;
  const completedEvents = filteredEvents.filter(e => e.status === 'completed').length;
  const cancelledEvents = filteredEvents.filter(e => e.status === 'cancelled').length;

  const confirmationRate = totalEvents > 0 ? (confirmedEvents / totalEvents) * 100 : 0;
  const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
  const cancellationRate = totalEvents > 0 ? (cancelledEvents / totalEvents) * 100 : 0;

  // Group by type
  const typeGroups = groupByField(filteredEvents, 'type');
  const byType = Object.entries(typeGroups).map(([type, events]) => ({
    type,
    count: events.length,
    percentage: totalEvents > 0 ? (events.length / totalEvents) * 100 : 0,
  }));

  // Group by status
  const statusGroups = groupByField(filteredEvents, 'status');
  const byStatus = Object.entries(statusGroups).map(([status, events]) => ({
    status,
    count: events.length,
    percentage: totalEvents > 0 ? (events.length / totalEvents) * 100 : 0,
  }));

  // Timeline
  const timeline = generateTimeline(filteredEvents, options.dateRange);

  return {
    metadata: {
      generatedAt: new Date(),
      workspaceId: options.workspaceId,
      dateRange: options.dateRange,
      totalEvents,
    },
    summary: {
      totalEvents,
      confirmedEvents,
      pendingEvents,
      completedEvents,
      cancelledEvents,
      confirmationRate,
      completionRate,
      cancellationRate,
    },
    byType,
    byStatus,
    timeline,
  };
}

// ============================================================================
// ATTENDANCE REPORT
// ============================================================================

export function generateAttendanceReport(
  events: CalendarEvent[],
  participants: EventParticipantWithDetails[],
  options: ReportOptions
): AttendanceReport {
  // Filter events
  const filteredEvents = filterEvents(events, options);
  const eventIds = new Set(filteredEvents.map(e => e.id));

  // Filter participants
  const filteredParticipants = participants.filter(p => eventIds.has(p.event_id));

  // Overall stats
  const totalParticipants = filteredParticipants.length;
  const presentCount = filteredParticipants.filter(p => p.attendance_status === 'present').length;
  const absentCount = filteredParticipants.filter(p => p.attendance_status === 'absent').length;
  const excusedCount = filteredParticipants.filter(p => p.attendance_status === 'excused').length;
  const attendanceRate = totalParticipants > 0 ? (presentCount / totalParticipants) * 100 : 0;

  // By event
  const byEvent = filteredEvents.map(event => {
    const eventParticipants = filteredParticipants.filter(p => p.event_id === event.id);
    const eventPresentCount = eventParticipants.filter(p => p.attendance_status === 'present').length;
    const eventTotal = eventParticipants.length;

    return {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: typeof event.start_date === 'string' ? parseISO(event.start_date) : event.start_date,
      totalParticipants: eventTotal,
      presentCount: eventPresentCount,
      attendanceRate: eventTotal > 0 ? (eventPresentCount / eventTotal) * 100 : 0,
    };
  });

  // By athlete
  const athleteMap = new Map<string, {
    total: number;
    attended: number;
    name?: string;
  }>();

  filteredParticipants.forEach(p => {
    if (!athleteMap.has(p.athlete_id)) {
      athleteMap.set(p.athlete_id, {
        total: 0,
        attended: 0,
        name: p.athlete?.name,
      });
    }

    const stats = athleteMap.get(p.athlete_id)!;
    stats.total++;
    if (p.attendance_status === 'present') {
      stats.attended++;
    }
  });

  const byAthlete = Array.from(athleteMap.entries()).map(([athleteId, stats]) => ({
    athleteId,
    athleteName: stats.name,
    totalEvents: stats.total,
    attendedEvents: stats.attended,
    attendanceRate: stats.total > 0 ? (stats.attended / stats.total) * 100 : 0,
  }));

  return {
    metadata: {
      generatedAt: new Date(),
      workspaceId: options.workspaceId,
      dateRange: options.dateRange,
      totalEvents: filteredEvents.length,
      totalParticipants,
    },
    overall: {
      totalParticipants,
      presentCount,
      absentCount,
      excusedCount,
      attendanceRate,
    },
    byEvent,
    byAthlete,
  };
}

// ============================================================================
// PERFORMANCE REPORT
// ============================================================================

export function generatePerformanceReport(
  events: CalendarEvent[],
  options: ReportOptions
): PerformanceReport {
  // Filter events
  const filteredEvents = filterEvents(events, options);

  // Completion metrics
  const totalScheduled = filteredEvents.filter(e => 
    e.status === 'confirmed' || e.status === 'completed'
  ).length;
  const completed = filteredEvents.filter(e => e.status === 'completed').length;
  const completionRate = totalScheduled > 0 ? (completed / totalScheduled) * 100 : 0;

  // Calculate average duration
  const durations = filteredEvents.map(e => {
    const start = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
    const end = typeof e.end_date === 'string' ? parseISO(e.end_date) : e.end_date;
    return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
  });
  const averageDuration = durations.length > 0 
    ? durations.reduce((a, b) => a + b, 0) / durations.length 
    : 0;

  // Punctuality (mock - would need actual start time data)
  const punctualityMetrics = {
    totalEvents: completed,
    onTime: Math.floor(completed * 0.85), // Mock: 85% on time
    late: Math.floor(completed * 0.15), // Mock: 15% late
    punctualityRate: 85, // Mock
  };

  // Utilization metrics
  const totalDays = differenceInDays(options.dateRange.end, options.dateRange.start) + 1;
  const uniqueDays = new Set(
    filteredEvents.map(e => {
      const date = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return format(date, 'yyyy-MM-dd');
    })
  );
  const daysWithEvents = uniqueDays.size;
  const utilizationRate = totalDays > 0 ? (daysWithEvents / totalDays) * 100 : 0;
  const averageEventsPerDay = daysWithEvents > 0 ? filteredEvents.length / daysWithEvents : 0;

  // Trends (weekly)
  const trends = generateWeeklyTrends(filteredEvents, options.dateRange);

  return {
    metadata: {
      generatedAt: new Date(),
      workspaceId: options.workspaceId,
      dateRange: options.dateRange,
    },
    completionMetrics: {
      totalScheduled,
      completed,
      completionRate,
      averageDuration,
    },
    punctualityMetrics,
    utilizationMetrics: {
      totalDays,
      daysWithEvents,
      utilizationRate,
      averageEventsPerDay,
    },
    trends,
  };
}

// ============================================================================
// UTILIZATION REPORT
// ============================================================================

export function generateUtilizationReport(
  events: CalendarEvent[],
  options: ReportOptions
): UtilizationReport {
  // Filter events
  const filteredEvents = filterEvents(events, options);

  // Overall metrics
  const totalDays = differenceInDays(options.dateRange.end, options.dateRange.start) + 1;
  const uniqueDays = new Set(
    filteredEvents.map(e => {
      const date = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return format(date, 'yyyy-MM-dd');
    })
  );
  const daysWithEvents = uniqueDays.size;
  const utilizationRate = totalDays > 0 ? (daysWithEvents / totalDays) * 100 : 0;
  const averageEventsPerDay = daysWithEvents > 0 ? filteredEvents.length / daysWithEvents : 0;

  // By day of week
  const dayOfWeekCounts: Record<string, number> = {};
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  filteredEvents.forEach(e => {
    const date = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
    const dayName = dayNames[date.getDay()];
    dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + 1;
  });

  const byDayOfWeek = Object.entries(dayOfWeekCounts).map(([day, count]) => ({
    dayOfWeek: day,
    eventCount: count,
    percentage: filteredEvents.length > 0 ? (count / filteredEvents.length) * 100 : 0,
  }));

  // By time of day
  const timeSlotCounts: Record<string, number> = {
    'Manhã (6h-12h)': 0,
    'Tarde (12h-18h)': 0,
    'Noite (18h-22h)': 0,
    'Madrugada (22h-6h)': 0,
  };

  filteredEvents.forEach(e => {
    const date = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
    const hour = date.getHours();
    
    if (hour >= 6 && hour < 12) {
      timeSlotCounts['Manhã (6h-12h)']++;
    } else if (hour >= 12 && hour < 18) {
      timeSlotCounts['Tarde (12h-18h)']++;
    } else if (hour >= 18 && hour < 22) {
      timeSlotCounts['Noite (18h-22h)']++;
    } else {
      timeSlotCounts['Madrugada (22h-6h)']++;
    }
  });

  const byTimeOfDay = Object.entries(timeSlotCounts).map(([slot, count]) => ({
    timeSlot: slot,
    eventCount: count,
    percentage: filteredEvents.length > 0 ? (count / filteredEvents.length) * 100 : 0,
  }));

  // Peak times
  const busiestDay = byDayOfWeek.reduce((max, curr) => 
    curr.eventCount > max.eventCount ? curr : max
  , byDayOfWeek[0] || { dayOfWeek: 'N/A', eventCount: 0 });

  const busiestTimeSlot = byTimeOfDay.reduce((max, curr) =>
    curr.eventCount > max.eventCount ? curr : max
  , byTimeOfDay[0] || { timeSlot: 'N/A', eventCount: 0 });

  return {
    metadata: {
      generatedAt: new Date(),
      workspaceId: options.workspaceId,
      dateRange: options.dateRange,
    },
    overall: {
      totalDays,
      daysWithEvents,
      utilizationRate,
      totalEvents: filteredEvents.length,
      averageEventsPerDay,
    },
    byDayOfWeek,
    byTimeOfDay,
    peakTimes: {
      busiestDay: busiestDay.dayOfWeek,
      busiestDayCount: busiestDay.eventCount,
      busiestTimeSlot: busiestTimeSlot.timeSlot,
      busiestTimeSlotCount: busiestTimeSlot.eventCount,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function filterEvents(events: CalendarEvent[], options: ReportOptions): CalendarEvent[] {
  let filtered = events.filter(e => e.workspace_id === options.workspaceId);

  // Date range
  filtered = filtered.filter(e => {
    const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
    return eventDate >= options.dateRange.start && eventDate <= options.dateRange.end;
  });

  // Type filter
  if (options.includeTypes && options.includeTypes.length > 0) {
    filtered = filtered.filter(e => options.includeTypes!.includes(e.type));
  }

  // Status filter
  if (options.includeStatuses && options.includeStatuses.length > 0) {
    filtered = filtered.filter(e => options.includeStatuses!.includes(e.status));
  }

  return filtered;
}

function groupByField(
  events: CalendarEvent[],
  field: keyof CalendarEvent
): Record<string, CalendarEvent[]> {
  const groups: Record<string, CalendarEvent[]> = {};
  
  events.forEach(event => {
    const key = String(event[field]);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
  });

  return groups;
}

function generateTimeline(
  events: CalendarEvent[],
  dateRange: { start: Date; end: Date }
): Array<{
  date: string;
  count: number;
  confirmed: number;
  pending: number;
  completed: number;
}> {
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });

  return days.map(day => {
    const dayEvents = events.filter(e => {
      const eventDate = typeof e.start_date === 'string' ? parseISO(e.start_date) : e.start_date;
      return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });

    return {
      date: format(day, 'yyyy-MM-dd'),
      count: dayEvents.length,
      confirmed: dayEvents.filter(e => e.status === 'confirmed').length,
      pending: dayEvents.filter(e => e.status === 'pending').length,
      completed: dayEvents.filter(e => e.status === 'completed').length,
    };
  });
}

function generateWeeklyTrends(
  events: CalendarEvent[],
  dateRange: { start: Date; end: Date }
): Array<{
  period: string;
  eventsScheduled: number;
  eventsCompleted: number;
  completionRate: number;
}> {
  // Group events by week
  const weeks: Record<string, CalendarEvent[]> = {};

  events.forEach(event => {
    const eventDate = typeof event.start_date === 'string' ? parseISO(event.start_date) : event.start_date;
    const weekKey = format(eventDate, "'Semana' w 'de' yyyy", { locale: pt });
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(event);
  });

  return Object.entries(weeks).map(([period, weekEvents]) => {
    const scheduled = weekEvents.filter(e => 
      e.status === 'confirmed' || e.status === 'completed'
    ).length;
    const completed = weekEvents.filter(e => e.status === 'completed').length;
    const completionRate = scheduled > 0 ? (completed / scheduled) * 100 : 0;

    return {
      period,
      eventsScheduled: scheduled,
      eventsCompleted: completed,
      completionRate,
    };
  });
}
