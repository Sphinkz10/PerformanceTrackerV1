/**
 * Central Event Dispatcher - FASE 6 INTEGRATION & AUTOMATION
 * 
 * This is the HEART of the automation system.
 * All major actions dispatch events through here, which then:
 * - Trigger webhooks
 * - Send notifications
 * - Invalidate caches
 * - Create audit logs
 * 
 * Usage:
 * ```
 * import { EventDispatcher } from '@/utils/events/dispatcher';
 * 
 * await EventDispatcher.dispatch({
 *   workspaceId: '...',
 *   eventType: 'session.completed',
 *   eventData: { sessionId, athleteIds, ... },
 *   userId: '...',
 * });
 * ```
 * 
 * @author PerformTrack Team
 * @since Fase 6 - Integration & Automation
 * @version 1.0.0
 */

import { getApiUrl } from '@/utils/config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type EventType =
  // Session events
  | 'session.started'
  | 'session.completed'
  | 'session.cancelled'
  | 'session.paused'
  | 'session.resumed'
  
  // Form events
  | 'form.submitted'
  | 'form.created'
  
  // Metric events
  | 'metric.updated'
  | 'metric.created'
  
  // Record events
  | 'record.achieved'
  | 'record.suggestion_created'
  
  // Athlete events
  | 'athlete.created'
  | 'athlete.updated'
  | 'athlete.deactivated'
  
  // Workout events
  | 'workout.created'
  | 'workout.updated'
  | 'workout.duplicated'
  
  // Calendar events
  | 'calendar_event.created'
  | 'calendar_event.updated'
  | 'calendar_event.cancelled'
  | 'calendar_event.started'
  
  // Report events
  | 'report.executed'
  | 'report.template_created'
  
  // Notification events
  | 'notification.sent'
  
  // Export events
  | 'export.completed';

export interface Event {
  workspaceId: string;
  eventType: EventType;
  eventData: any;
  userId?: string;
  timestamp?: string;
  metadata?: any;
}

// ============================================================================
// EVENT DISPATCHER
// ============================================================================

export class EventDispatcher {
  /**
   * Dispatch an event to all listeners
   */
  static async dispatch(event: Event): Promise<void> {
    // Set timestamp if not provided
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
    }

    console.log(`📡 EVENT DISPATCHED: ${event.eventType}`, {
      workspaceId: event.workspaceId,
      userId: event.userId,
      timestamp: event.timestamp,
    });

    // Run all handlers in parallel
    await Promise.allSettled([
      this.triggerWebhooks(event),
      this.sendNotifications(event),
      this.invalidateCache(event),
      this.createAuditLog(event),
    ]);
  }

  /**
   * Trigger webhooks for this event
   */
  private static async triggerWebhooks(event: Event): Promise<void> {
    try {
      const response = await fetch(`${getApiUrl()}/api/webhooks/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: event.workspaceId,
          eventType: event.eventType,
          eventData: event.eventData,
        }),
      });

      if (!response.ok) {
        console.error('❌ Failed to trigger webhooks:', await response.text());
      } else {
        const result = await response.json();
        console.log(`✅ Webhooks triggered: ${result.triggered || 0}`);
      }
    } catch (error: any) {
      console.error('❌ Error triggering webhooks:', error.message);
    }
  }

  /**
   * Send notifications based on event type
   */
  private static async sendNotifications(event: Event): Promise<void> {
    const notificationConfig = this.getNotificationConfig(event);

    if (!notificationConfig) {
      return; // No notifications for this event type
    }

    try {
      // Get recipients based on event
      const recipients = await this.getRecipients(event);

      // Send notification to each recipient
      await Promise.all(
        recipients.map(recipient =>
          fetch(`${getApiUrl()}/api/notifications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              workspaceId: event.workspaceId,
              userId: recipient.userId,
              athleteId: recipient.athleteId,
              type: notificationConfig.type,
              title: notificationConfig.title(event.eventData),
              message: notificationConfig.message(event.eventData),
              channels: notificationConfig.channels,
              priority: notificationConfig.priority,
              relatedEntityType: this.getEntityType(event.eventType),
              relatedEntityId: this.getEntityId(event.eventData),
              actionUrl: notificationConfig.actionUrl?.(event.eventData),
              actionLabel: notificationConfig.actionLabel,
            }),
          })
        )
      );

      console.log(`✅ Notifications sent: ${recipients.length}`);
    } catch (error: any) {
      console.error('❌ Error sending notifications:', error.message);
    }
  }

  /**
   * Invalidate analytics cache
   */
  private static async invalidateCache(event: Event): Promise<void> {
    // Determine which cache to invalidate based on event type
    const cacheTypes = this.getCacheTypesToInvalidate(event.eventType);

    if (cacheTypes.length === 0) {
      return;
    }

    try {
      // In production, call Supabase function
      // For now, just log
      console.log(`🗑️ Invalidating cache types:`, cacheTypes);
      
      // Example call:
      // await supabase.rpc('invalidate_analytics_cache', {
      //   p_workspace_id: event.workspaceId,
      //   p_query_type: cacheType,
      // });
    } catch (error: any) {
      console.error('❌ Error invalidating cache:', error.message);
    }
  }

  /**
   * Create audit log
   */
  private static async createAuditLog(event: Event): Promise<void> {
    // Only log certain event types
    if (!this.shouldAuditLog(event.eventType)) {
      return;
    }

    try {
      await fetch(`${getApiUrl()}/api/audit-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: event.workspaceId,
          userId: event.userId,
          action: this.getAuditAction(event.eventType),
          entityType: this.getEntityType(event.eventType),
          entityId: this.getEntityId(event.eventData),
          entityName: this.getEntityName(event.eventData),
          metadata: {
            eventType: event.eventType,
            eventData: event.eventData,
          },
        }),
      });

      console.log(`📝 Audit log created`);
    } catch (error: any) {
      console.error('❌ Error creating audit log:', error.message);
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Get notification config for event type
   */
  private static getNotificationConfig(event: Event): any | null {
    const configs: { [key in EventType]?: any } = {
      'session.completed': {
        type: 'session_completed',
        title: (data: any) => `Session Completed: ${data.workoutName || 'Workout'}`,
        message: (data: any) => `Great job! ${data.athleteCount || 0} athletes completed the session.`,
        channels: ['in_app', 'email'],
        priority: 'normal',
        actionUrl: (data: any) => `/sessions/${data.sessionId}`,
        actionLabel: 'View Session',
      },
      'form.submitted': {
        type: 'form_submitted',
        title: (data: any) => `Form Submitted: ${data.formName}`,
        message: (data: any) => `${data.athleteName} submitted ${data.formName}.`,
        channels: ['in_app'],
        priority: 'low',
        actionUrl: (data: any) => `/forms/${data.formId}/submissions`,
        actionLabel: 'View Submission',
      },
      'record.achieved': {
        type: 'record_achieved',
        title: (data: any) => `🏆 New Personal Record!`,
        message: (data: any) => `${data.athleteName} achieved a new PR in ${data.metricName}!`,
        channels: ['in_app', 'push', 'email'],
        priority: 'high',
        actionUrl: (data: any) => `/athletes/${data.athleteId}/records`,
        actionLabel: 'View Records',
      },
      'calendar_event.created': {
        type: 'event_scheduled',
        title: (data: any) => `New Event Scheduled: ${data.title}`,
        message: (data: any) => `You have been scheduled for ${data.title} on ${new Date(data.startDate).toLocaleDateString()}.`,
        channels: ['in_app', 'email'],
        priority: 'normal',
        actionUrl: (data: any) => `/calendar?event=${data.eventId}`,
        actionLabel: 'View Calendar',
      },
    };

    return configs[event.eventType] || null;
  }

  /**
   * Get recipients for notifications
   */
  private static async getRecipients(event: Event): Promise<Array<{ userId?: string; athleteId?: string }>> {
    // This would query the database to get relevant users/athletes
    // For now, return empty array (implement based on event type)
    
    // Example logic:
    switch (event.eventType) {
      case 'session.completed':
        // Notify coach who created the workout
        return [{ userId: event.userId }];
      
      case 'record.achieved':
        // Notify the athlete
        return [{ athleteId: event.eventData.athleteId }];
      
      case 'calendar_event.created':
        // Notify all athletes in the event
        return (event.eventData.athleteIds || []).map((id: string) => ({ athleteId: id }));
      
      default:
        return [];
    }
  }

  /**
   * Get cache types to invalidate
   */
  private static getCacheTypesToInvalidate(eventType: EventType): string[] {
    const cacheMap: { [key in EventType]?: string[] } = {
      'session.completed': ['dashboard', 'athlete_stats'],
      'session.started': ['dashboard'],
      'metric.updated': ['dashboard', 'athlete_stats', 'metric_trends'],
      'record.achieved': ['athlete_stats'],
      'athlete.created': ['dashboard'],
      'calendar_event.created': ['dashboard'],
    };

    return cacheMap[eventType] || [];
  }

  /**
   * Should create audit log for this event
   */
  private static shouldAuditLog(eventType: EventType): boolean {
    const auditEvents: EventType[] = [
      'session.completed',
      'form.submitted',
      'athlete.created',
      'athlete.updated',
      'workout.created',
      'workout.updated',
      'calendar_event.created',
      'report.executed',
      'export.completed',
    ];

    return auditEvents.includes(eventType);
  }

  /**
   * Get audit action from event type
   */
  private static getAuditAction(eventType: EventType): string {
    if (eventType.includes('.created')) return 'create';
    if (eventType.includes('.updated')) return 'update';
    if (eventType.includes('.deleted') || eventType.includes('.cancelled')) return 'delete';
    if (eventType.includes('.executed') || eventType.includes('.completed')) return 'execute';
    return 'custom';
  }

  /**
   * Get entity type from event type
   */
  private static getEntityType(eventType: EventType): string {
    return eventType.split('.')[0];
  }

  /**
   * Get entity ID from event data
   */
  private static getEntityId(eventData: any): string | null {
    return eventData.id || 
           eventData.sessionId || 
           eventData.formId || 
           eventData.athleteId || 
           eventData.workoutId || 
           eventData.eventId ||
           null;
  }

  /**
   * Get entity name from event data
   */
  private static getEntityName(eventData: any): string | null {
    return eventData.name || 
           eventData.title || 
           eventData.workoutName || 
           eventData.formName || 
           eventData.athleteName ||
           null;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Dispatch a session event
 */
export async function dispatchSessionEvent(
  type: 'started' | 'completed' | 'cancelled' | 'paused' | 'resumed',
  data: {
    workspaceId: string;
    sessionId: string;
    workoutId?: string;
    workoutName?: string;
    athleteCount?: number;
    userId?: string;
  }
): Promise<void> {
  await EventDispatcher.dispatch({
    workspaceId: data.workspaceId,
    eventType: `session.${type}` as EventType,
    eventData: data,
    userId: data.userId,
  });
}

/**
 * Dispatch a form event
 */
export async function dispatchFormEvent(
  type: 'submitted' | 'created',
  data: {
    workspaceId: string;
    formId: string;
    formName: string;
    athleteId?: string;
    athleteName?: string;
    userId?: string;
  }
): Promise<void> {
  await EventDispatcher.dispatch({
    workspaceId: data.workspaceId,
    eventType: `form.${type}` as EventType,
    eventData: data,
    userId: data.userId,
  });
}

/**
 * Dispatch a record event
 */
export async function dispatchRecordEvent(
  data: {
    workspaceId: string;
    recordId: string;
    athleteId: string;
    athleteName: string;
    metricId: string;
    metricName: string;
    value: number;
    userId?: string;
  }
): Promise<void> {
  await EventDispatcher.dispatch({
    workspaceId: data.workspaceId,
    eventType: 'record.achieved',
    eventData: data,
    userId: data.userId,
  });
}

/**
 * Dispatch a calendar event
 */
export async function dispatchCalendarEvent(
  type: 'created' | 'updated' | 'cancelled' | 'started',
  data: {
    workspaceId: string;
    eventId: string;
    title: string;
    startDate: string;
    athleteIds?: string[];
    userId?: string;
  }
): Promise<void> {
  await EventDispatcher.dispatch({
    workspaceId: data.workspaceId,
    eventType: `calendar_event.${type}` as EventType,
    eventData: data,
    userId: data.userId,
  });
}