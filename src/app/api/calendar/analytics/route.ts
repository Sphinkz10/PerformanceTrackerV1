/**
 * CALENDAR ANALYTICS API
 * Advanced analytics and reporting endpoints
 * 
 * Features:
 * - Weekly/Monthly metrics
 * - Comparative analytics
 * - Trend analysis
 * - Performance insights
 * - Export data
 * 
 * @module api/calendar/analytics
 * @version 2.0.0
 * @created 20 Janeiro 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  format,
  parseISO,
  isWithinInterval,
  differenceInDays,
} from 'date-fns';
import { pt } from 'date-fns/locale';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsParams {
  workspaceId: string;
  startDate?: string;
  endDate?: string;
  period?: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  compareWith?: 'previous' | 'lastYear' | 'none';
  includeTypes?: string[];
  includeStatuses?: string[];
}

interface CalendarMetrics {
  totalEvents: number;
  confirmedEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  averageParticipants: number;
  attendanceRate: number;
  completionRate: number;
  confirmationRate: number;
  eventsByType: Record<string, number>;
  eventsByDay: Array<{ date: string; count: number }>;
  topAthletes: Array<{ id: string; name: string; eventCount: number }>;
  peakHours: Array<{ hour: number; count: number }>;
  revenueData?: {
    total: number;
    byType: Record<string, number>;
  };
}

interface ComparativeMetrics {
  current: CalendarMetrics;
  previous: CalendarMetrics;
  changes: {
    totalEventsChange: number;
    completionRateChange: number;
    attendanceRateChange: number;
    participantsChange: number;
  };
  insights: string[];
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get date range based on period
 */
function getDateRange(period: string, customStart?: string, customEnd?: string) {
  const now = new Date();
  
  switch (period) {
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case 'quarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      const startMonth = quarter * 3;
      const start = new Date(now.getFullYear(), startMonth, 1);
      const end = new Date(now.getFullYear(), startMonth + 3, 0);
      return { start, end };
    }
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
      };
    case 'custom':
      return {
        start: customStart ? parseISO(customStart) : startOfMonth(now),
        end: customEnd ? parseISO(customEnd) : endOfMonth(now),
      };
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}

/**
 * Get previous period date range for comparison
 */
function getPreviousRange(currentStart: Date, currentEnd: Date, compareWith: string) {
  const daysDiff = differenceInDays(currentEnd, currentStart) + 1;
  
  switch (compareWith) {
    case 'previous':
      return {
        start: new Date(currentStart.getTime() - daysDiff * 24 * 60 * 60 * 1000),
        end: new Date(currentStart.getTime() - 24 * 60 * 60 * 1000),
      };
    case 'lastYear':
      return {
        start: new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), currentStart.getDate()),
        end: new Date(currentEnd.getFullYear() - 1, currentEnd.getMonth(), currentEnd.getDate()),
      };
    default:
      return { start: currentStart, end: currentEnd };
  }
}

/**
 * Calculate metrics from events
 */
function calculateMetrics(
  events: any[],
  participants: any[],
  dateRange: { start: Date; end: Date }
): CalendarMetrics {
  // Filter events by date range
  const filteredEvents = events.filter(e => {
    const eventDate = parseISO(e.start_date);
    return isWithinInterval(eventDate, dateRange);
  });

  const totalEvents = filteredEvents.length;
  const confirmedEvents = filteredEvents.filter(e => e.status === 'confirmed').length;
  const completedEvents = filteredEvents.filter(e => e.status === 'completed').length;
  const cancelledEvents = filteredEvents.filter(e => e.status === 'cancelled').length;

  // Participants stats
  const eventIds = new Set(filteredEvents.map(e => e.id));
  const filteredParticipants = participants.filter(p => eventIds.has(p.event_id));
  const totalParticipants = filteredParticipants.length;
  const averageParticipants = totalEvents > 0 ? totalParticipants / totalEvents : 0;

  // Attendance
  const attendedCount = filteredParticipants.filter(p => p.attendance_status === 'present').length;
  const attendanceRate = totalParticipants > 0 ? (attendedCount / totalParticipants) * 100 : 0;

  // Rates
  const completionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
  const confirmationRate = totalEvents > 0 ? (confirmedEvents / totalEvents) * 100 : 0;

  // By type
  const eventsByType: Record<string, number> = {};
  filteredEvents.forEach(e => {
    eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
  });

  // By day
  const eventsByDay: Array<{ date: string; count: number }> = [];
  const dayMap = new Map<string, number>();
  
  filteredEvents.forEach(e => {
    const dateStr = format(parseISO(e.start_date), 'yyyy-MM-dd');
    dayMap.set(dateStr, (dayMap.get(dateStr) || 0) + 1);
  });

  dayMap.forEach((count, date) => {
    eventsByDay.push({ date, count });
  });
  eventsByDay.sort((a, b) => a.date.localeCompare(b.date));

  // Top athletes
  const athleteCounts = new Map<string, { name: string; count: number }>();
  filteredParticipants.forEach(p => {
    if (p.athlete) {
      const current = athleteCounts.get(p.athlete_id) || { name: p.athlete.name, count: 0 };
      athleteCounts.set(p.athlete_id, { ...current, count: current.count + 1 });
    }
  });

  const topAthletes = Array.from(athleteCounts.entries())
    .map(([id, data]) => ({ id, name: data.name, eventCount: data.count }))
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 10);

  // Peak hours
  const hourCounts = new Map<number, number>();
  filteredEvents.forEach(e => {
    const hour = parseInt(e.start_time.split(':')[0]);
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });

  const peakHours = Array.from(hourCounts.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalEvents,
    confirmedEvents,
    completedEvents,
    cancelledEvents,
    averageParticipants,
    attendanceRate,
    completionRate,
    confirmationRate,
    eventsByType,
    eventsByDay,
    topAthletes,
    peakHours,
  };
}

/**
 * Generate insights from comparative metrics
 */
function generateInsights(current: CalendarMetrics, previous: CalendarMetrics): string[] {
  const insights: string[] = [];

  // Total events trend
  const eventsDiff = current.totalEvents - previous.totalEvents;
  const eventsChange = previous.totalEvents > 0 
    ? ((eventsDiff / previous.totalEvents) * 100).toFixed(0)
    : '0';
  
  if (eventsDiff > 0) {
    insights.push(`📈 Aumento de ${eventsChange}% em eventos agendados (${eventsDiff} eventos a mais)`);
  } else if (eventsDiff < 0) {
    insights.push(`📉 Redução de ${eventsChange}% em eventos agendados (${Math.abs(eventsDiff)} eventos a menos)`);
  }

  // Completion rate
  const completionDiff = current.completionRate - previous.completionRate;
  if (completionDiff > 5) {
    insights.push(`✅ Taxa de conclusão melhorou ${completionDiff.toFixed(0)}% - excelente!`);
  } else if (completionDiff < -5) {
    insights.push(`⚠️ Taxa de conclusão caiu ${Math.abs(completionDiff).toFixed(0)}% - atenção necessária`);
  }

  // Attendance rate
  const attendanceDiff = current.attendanceRate - previous.attendanceRate;
  if (attendanceDiff > 5) {
    insights.push(`🎯 Taxa de presença subiu ${attendanceDiff.toFixed(0)}% - atletas mais engajados!`);
  } else if (attendanceDiff < -5) {
    insights.push(`📊 Taxa de presença caiu ${Math.abs(attendanceDiff).toFixed(0)}% - verificar motivação`);
  }

  // Average participants
  const participantsDiff = current.averageParticipants - previous.averageParticipants;
  if (participantsDiff > 1) {
    insights.push(`👥 Média de ${participantsDiff.toFixed(1)} atletas a mais por evento`);
  } else if (participantsDiff < -1) {
    insights.push(`👥 Média de ${Math.abs(participantsDiff).toFixed(1)} atletas a menos por evento`);
  }

  // Peak hours insight
  if (current.peakHours.length > 0) {
    const topHour = current.peakHours[0];
    insights.push(`⏰ Horário de pico: ${topHour.hour}:00 com ${topHour.count} eventos`);
  }

  // Top athlete
  if (current.topAthletes.length > 0) {
    const top = current.topAthletes[0];
    insights.push(`🏆 Atleta mais ativo: ${top.name} (${top.eventCount} eventos)`);
  }

  return insights;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const period = searchParams.get('period') || 'month';
    const compareWith = searchParams.get('compareWith') || 'previous';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId é obrigatório' }, { status: 400 });
    }

    // Get date ranges
    const currentRange = getDateRange(period, startDate, endDate);
    const previousRange = compareWith !== 'none' 
      ? getPreviousRange(currentRange.start, currentRange.end, compareWith)
      : currentRange;

    // Fetch events
    const { data: events, error: eventsError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('start_date', format(previousRange.start, 'yyyy-MM-dd'))
      .lte('start_date', format(currentRange.end, 'yyyy-MM-dd'))
      .order('start_date', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
    }

    // Fetch participants with athlete info
    const eventIds = events?.map(e => e.id) || [];
    const { data: participants, error: participantsError } = await supabase
      .from('event_participants')
      .select(`
        *,
        athlete:athletes(id, name, email)
      `)
      .in('event_id', eventIds);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
    }

    // Calculate metrics
    const currentMetrics = calculateMetrics(events || [], participants || [], currentRange);
    
    const previousMetrics = compareWith !== 'none'
      ? calculateMetrics(events || [], participants || [], previousRange)
      : currentMetrics;

    // Calculate changes
    const changes = {
      totalEventsChange: currentMetrics.totalEvents - previousMetrics.totalEvents,
      completionRateChange: currentMetrics.completionRate - previousMetrics.completionRate,
      attendanceRateChange: currentMetrics.attendanceRate - previousMetrics.attendanceRate,
      participantsChange: currentMetrics.averageParticipants - previousMetrics.averageParticipants,
    };

    // Generate insights
    const insights = compareWith !== 'none' 
      ? generateInsights(currentMetrics, previousMetrics)
      : [];

    // Response
    const response: ComparativeMetrics = {
      current: currentMetrics,
      previous: previousMetrics,
      changes,
      insights,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
