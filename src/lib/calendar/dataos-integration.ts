/**
 * CALENDAR ↔ DATAOS INTEGRATION
 * Bidirectional sync between calendar events and metrics
 * 
 * @module calendar/dataos-integration
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { CalendarEvent, EventParticipantWithDetails } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export interface EventMetricSync {
  eventId: string;
  workspaceId: string;
  metricType: 'attendance' | 'completion' | 'performance' | 'punctuality';
  athleteId: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface CalendarMetricsSummary {
  workspaceId: string;
  athleteId?: string;
  dateRange: { start: Date; end: Date };
  
  // Event counts
  totalEvents: number;
  attendedEvents: number;
  noShowEvents: number;
  declinedEvents: number;
  pendingEvents: number;
  
  // Rates
  attendanceRate: number; // Percentage
  punctualityRate: number; // On-time arrivals
  completionRate: number; // Events completed vs scheduled
  
  // Breakdown by type
  byType: Record<string, {
    total: number;
    attended: number;
    rate: number;
  }>;
}

export interface MetricTriggerEvent {
  eventType: 'create_event' | 'schedule_rest' | 'schedule_recovery';
  eventTemplate: Partial<CalendarEvent>;
  reason: string;
  metricData?: {
    metricType: string;
    value: number;
    threshold: number;
  };
}

// ============================================================================
// MAIN INTEGRATION CLASS
// ============================================================================

export class CalendarDataOSBridge {
  /**
   * Sync event completion to DataOS metrics
   * Called when an event is marked as completed
   */
  static async syncEventCompletion(
    event: CalendarEvent,
    participants: EventParticipantWithDetails[]
  ): Promise<EventMetricSync[]> {
    const syncs: EventMetricSync[] = [];

    // Create attendance metrics for each participant
    for (const participant of participants) {
      // Attendance metric (1 = attended, 0 = no show)
      if (participant.status === 'attended' || participant.status === 'no_show') {
        syncs.push({
          eventId: event.id,
          workspaceId: event.workspace_id,
          metricType: 'attendance',
          athleteId: participant.athlete_id,
          value: participant.status === 'attended' ? 1 : 0,
          timestamp: event.completed_at ? new Date(event.completed_at) : new Date(),
          metadata: {
            event_id: event.id,
            event_type: event.type,
            event_title: event.title,
            participant_status: participant.status,
          },
        });
      }

      // Punctuality metric (if we have check-in time)
      if (participant.status === 'attended' && participant.attended_at) {
        const eventStart = new Date(event.start_date);
        const checkinTime = new Date(participant.attended_at);
        const minutesLate = Math.round((checkinTime.getTime() - eventStart.getTime()) / 60000);
        
        // Consider on-time if within 5 minutes
        const punctual = minutesLate <= 5 ? 1 : 0;
        
        syncs.push({
          eventId: event.id,
          workspaceId: event.workspace_id,
          metricType: 'punctuality',
          athleteId: participant.athlete_id,
          value: punctual,
          timestamp: checkinTime,
          metadata: {
            event_id: event.id,
            minutes_late: minutesLate,
            check_in_time: participant.attended_at,
          },
        });
      }
    }

    // Completion metric (event was completed)
    syncs.push({
      eventId: event.id,
      workspaceId: event.workspace_id,
      metricType: 'completion',
      athleteId: 'team', // Team-level metric
      value: 1,
      timestamp: event.completed_at ? new Date(event.completed_at) : new Date(),
      metadata: {
        event_id: event.id,
        event_type: event.type,
        total_participants: participants.length,
        attended_count: participants.filter(p => p.status === 'attended').length,
      },
    });

    // TODO: Send to DataOS API
    // await this.sendMetricsToDataOS(syncs);

    return syncs;
  }

  /**
   * Get calendar-derived metrics for an athlete
   * Queryable from DataOS insights/reports
   */
  static async getCalendarMetrics(
    workspaceId: string,
    athleteId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<CalendarMetricsSummary> {
    // Default to last 30 days
    const start = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = dateRange?.end || new Date();

    // TODO: Query from Supabase
    // For now, return mock structure
    
    const mockData: CalendarMetricsSummary = {
      workspaceId,
      athleteId,
      dateRange: { start, end },
      
      totalEvents: 24,
      attendedEvents: 19,
      noShowEvents: 2,
      declinedEvents: 1,
      pendingEvents: 2,
      
      attendanceRate: 79.2, // 19/24 * 100
      punctualityRate: 84.2, // 16/19 * 100
      completionRate: 87.5, // 21/24 * 100
      
      byType: {
        workout: { total: 15, attended: 12, rate: 80.0 },
        game: { total: 5, attended: 4, rate: 80.0 },
        competition: { total: 2, attended: 2, rate: 100.0 },
        meeting: { total: 2, attended: 1, rate: 50.0 },
      },
    };

    return mockData;
  }

  /**
   * Create calendar event triggered by DataOS metric
   * E.g., Low recovery score → Auto-schedule rest day
   */
  static async createEventFromMetricTrigger(
    trigger: MetricTriggerEvent,
    workspaceId: string
  ): Promise<Partial<CalendarEvent>> {
    const eventTemplate: Partial<CalendarEvent> = {
      ...trigger.eventTemplate,
      workspace_id: workspaceId,
      metadata: {
        ...trigger.eventTemplate.metadata,
        triggered_by: 'dataos_metric',
        trigger_type: trigger.eventType,
        trigger_reason: trigger.reason,
        metric_data: trigger.metricData,
        automation: true,
      },
    };

    // TODO: Actually create the event via API
    // const createdEvent = await createCalendarEvent(eventTemplate);

    return eventTemplate;
  }

  /**
   * Check if metric conditions require calendar action
   * Called by DataOS automation rules
   */
  static checkMetricThresholds(
    metricType: string,
    value: number,
    thresholds: { low: number; high: number }
  ): MetricTriggerEvent | null {
    // Recovery score too low → Schedule rest
    if (metricType === 'recovery_score' && value < thresholds.low) {
      return {
        eventType: 'schedule_rest',
        eventTemplate: {
          title: 'Dia de Descanso (Automático)',
          description: `Descanso agendado automaticamente devido a score de recuperação baixo (${value})`,
          type: 'rest',
          status: 'scheduled',
        },
        reason: `Recovery score (${value}) below threshold (${thresholds.low})`,
        metricData: {
          metricType,
          value,
          threshold: thresholds.low,
        },
      };
    }

    // Fatigue too high → Schedule recovery session
    if (metricType === 'fatigue' && value > thresholds.high) {
      return {
        eventType: 'schedule_recovery',
        eventTemplate: {
          title: 'Sessão de Recuperação (Automático)',
          description: `Recuperação agendada automaticamente devido a fadiga elevada (${value})`,
          type: 'workout',
          status: 'scheduled',
        },
        reason: `Fatigue (${value}) above threshold (${thresholds.high})`,
        metricData: {
          metricType,
          value,
          threshold: thresholds.high,
        },
      };
    }

    return null;
  }

  /**
   * Batch sync multiple events to DataOS
   * Used for bulk operations
   */
  static async batchSyncEvents(
    events: CalendarEvent[],
    participantsMap: Map<string, EventParticipantWithDetails[]>
  ): Promise<EventMetricSync[]> {
    const allSyncs: EventMetricSync[] = [];

    for (const event of events) {
      const participants = participantsMap.get(event.id) || [];
      const syncs = await this.syncEventCompletion(event, participants);
      allSyncs.push(...syncs);
    }

    return allSyncs;
  }

  /**
   * Get athlete attendance trends over time
   * Returns data suitable for charting
   */
  static async getAttendanceTrends(
    workspaceId: string,
    athleteId: string,
    weeks: number = 12
  ): Promise<Array<{ week: string; attended: number; total: number; rate: number }>> {
    // TODO: Query from database
    
    // Mock data for now
    const trends = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      
      trends.push({
        week: `Semana ${weeks - i}`,
        attended: Math.floor(Math.random() * 4) + 1,
        total: 5,
        rate: (Math.floor(Math.random() * 30) + 70), // 70-100%
      });
    }

    return trends;
  }

  /**
   * Calculate team-wide calendar metrics
   * For dashboard/reports
   */
  static async getTeamCalendarStats(
    workspaceId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<{
    totalEvents: number;
    totalParticipants: number;
    avgAttendanceRate: number;
    mostActiveAthletes: Array<{ id: string; name: string; eventsAttended: number }>;
    leastActiveAthletes: Array<{ id: string; name: string; eventsAttended: number }>;
  }> {
    // TODO: Aggregate from database
    
    return {
      totalEvents: 156,
      totalParticipants: 32,
      avgAttendanceRate: 82.5,
      mostActiveAthletes: [
        { id: 'athlete-1', name: 'João Silva', eventsAttended: 45 },
        { id: 'athlete-2', name: 'Maria Santos', eventsAttended: 42 },
        { id: 'athlete-3', name: 'Pedro Costa', eventsAttended: 40 },
      ],
      leastActiveAthletes: [
        { id: 'athlete-30', name: 'Ana Lima', eventsAttended: 12 },
        { id: 'athlete-31', name: 'Carlos Sousa', eventsAttended: 15 },
        { id: 'athlete-32', name: 'Rita Alves', eventsAttended: 18 },
      ],
    };
  }

  /**
   * Send metrics to DataOS (internal API call)
   * @private
   */
  private static async sendMetricsToDataOS(syncs: EventMetricSync[]): Promise<void> {
    // TODO: Implement actual API call
    // await fetch('/api/metric-updates/bulk', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ updates: syncs })
    // });
    
    console.log('[DataOS Integration] Would send metrics:', syncs.length);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format metric value for display
 */
export function formatMetricValue(type: string, value: number): string {
  switch (type) {
    case 'attendance':
    case 'punctuality':
    case 'completion':
      return value === 1 ? 'Sim' : 'Não';
    case 'attendanceRate':
    case 'punctualityRate':
    case 'completionRate':
      return `${value.toFixed(1)}%`;
    default:
      return value.toString();
  }
}

/**
 * Get metric color based on type and value
 */
export function getMetricColor(type: string, value: number): string {
  if (type.includes('Rate')) {
    if (value >= 80) return 'emerald';
    if (value >= 50) return 'amber';
    return 'red';
  }
  
  if (type === 'attendance' || type === 'punctuality' || type === 'completion') {
    return value === 1 ? 'emerald' : 'red';
  }
  
  return 'sky';
}

/**
 * Export interface for external use
 */
export default CalendarDataOSBridge;
