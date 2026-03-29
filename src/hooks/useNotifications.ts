/**
 * USE NOTIFICATIONS HOOK
 * 
 * React hooks for managing notifications:
 * - Fetch notifications from API
 * - Mark as read
 * - Real-time updates with SWR
 * - Unread count
 * - Statistics
 * 
 * @module hooks/useNotifications
 * @created 18 Janeiro 2026
 * @version 2.0.0 (API-based)
 */

import { useState, useCallback, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import type { 
  Notification, 
  NotificationListResponse, 
  NotificationStats,
  CreateNotificationPayload,
} from '@/types/notifications';

// ============================================================================
// MAIN HOOK: useNotifications
// ============================================================================

interface UseNotificationsOptions {
  workspaceId: string;
  userId?: string;
  limit?: number;
  unreadOnly?: boolean;
  category?: string;
  enabled?: boolean;
}

export function useNotifications({
  workspaceId,
  userId,
  limit = 20,
  unreadOnly = false,
  category,
  enabled = true,
}: UseNotificationsOptions) {
  const queryParams = new URLSearchParams({
    workspaceId,
    limit: limit.toString(),
    ...(userId && { userId }),
    ...(unreadOnly && { unreadOnly: 'true' }),
    ...(category && { category }),
  });

  const { data, error, isLoading, mutate: refetch } = useSWR<NotificationListResponse>(
    enabled ? `/api/notifications?${queryParams}` : null,
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notifications');
      }
      
      return data;
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Optimistic update
      await refetch();
      
      // Also refresh stats
      mutate(`/api/notifications/stats?workspaceId=${workspaceId}`);

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, [refetch, workspaceId]);

  /**
   * Mark all as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspaceId, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      await refetch();
      mutate(`/api/notifications/stats?workspaceId=${workspaceId}`);

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }, [refetch, workspaceId, userId]);

  return {
    notifications: data?.notifications || [],
    total: data?.total || 0,
    unreadCount: data?.unreadCount || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  };
}

// ============================================================================
// HOOK: useNotificationStats
// ============================================================================

interface UseNotificationStatsOptions {
  workspaceId: string;
  userId?: string;
  enabled?: boolean;
}

export function useNotificationStats({
  workspaceId,
  userId,
  enabled = true,
}: UseNotificationStatsOptions) {
  const queryParams = new URLSearchParams({
    workspaceId,
    ...(userId && { userId }),
  });

  const { data, error, isLoading } = useSWR<NotificationStats>(
    enabled ? `/api/notifications/stats?${queryParams}` : null,
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notification stats');
      }
      
      return data;
    },
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    unreadCount: data?.unread || 0,
    totalCount: data?.total || 0,
    isLoading,
    error,
  };
}

// ============================================================================
// HOOK: useCreateNotification
// ============================================================================

export function useCreateNotification() {
  const [isCreating, setIsCreating] = useState(false);

  const createNotification = useCallback(async (payload: CreateNotificationPayload) => {
    setIsCreating(true);
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create notification');
      }

      // Refresh all notification queries
      mutate((key) => typeof key === 'string' && key.startsWith('/api/notifications'));

      return data.notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createNotification,
    isCreating,
  };
}

// ============================================================================
// HOOK: useRealtimeNotifications (WebSocket/Polling)
// ============================================================================

export function useRealtimeNotifications(workspaceId: string) {
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  useEffect(() => {
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      mutate(`/api/notifications?workspaceId=${workspaceId}`);
      mutate(`/api/notifications/stats?workspaceId=${workspaceId}`);
    }, 30000);

    return () => clearInterval(interval);
  }, [workspaceId]);

  // Listen for notification events (future: WebSocket)
  useEffect(() => {
    // Future: Set up WebSocket connection
    // For now, rely on polling
  }, [workspaceId]);

  return {
    newNotificationCount,
  };
}

// ============================================================================
// HELPER: Notification Factories
// ============================================================================

/**
 * Create pain notification payload
 */
export function createPainNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  level: number,
  location: string
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'alert',
    category: 'pain',
    priority: level >= 7 ? 'high' : 'normal',
    title: 'Dor Reportada',
    message: `${athleteName} reportou dor nível ${level}/10 em ${location}`,
    athleteId,
    relatedId: athleteId,
    relatedType: 'athlete',
    actionUrl: `/athlete/${athleteId}`,
    actionLabel: 'Ver Atleta',
    metadata: { level, location },
  };
}

/**
 * Create session completed notification payload
 */
export function createSessionCompletedNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  sessionTitle: string,
  completionRate: number
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: completionRate >= 80 ? 'success' : 'warning',
    category: 'session',
    priority: 'normal',
    title: 'Sessão Completada',
    message: `${athleteName} completou ${sessionTitle} (${completionRate}%)`,
    athleteId,
    relatedType: 'session',
    actionUrl: `/athlete/${athleteId}`,
    actionLabel: 'Ver Detalhes',
    metadata: { sessionTitle, completionRate },
  };
}

/**
 * Create form submitted notification payload
 */
export function createFormSubmittedNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  formName: string,
  formId: string
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'info',
    category: 'form',
    priority: 'normal',
    title: 'Formulário Preenchido',
    message: `${athleteName} preencheu ${formName}`,
    athleteId,
    relatedId: formId,
    relatedType: 'form',
    actionUrl: `/form-center`,
    actionLabel: 'Ver Respostas',
    metadata: { formName },
  };
}

/**
 * Create athlete joined notification payload
 */
export function createAthleteJoinedNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  team?: string
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'success',
    category: 'athlete',
    priority: 'low',
    title: 'Novo Atleta',
    message: team 
      ? `${athleteName} adicionado à ${team}`
      : `${athleteName} adicionado ao workspace`,
    athleteId,
    relatedType: 'athlete',
    actionUrl: `/athletes`,
    actionLabel: 'Ver Atletas',
    metadata: { team },
  };
}

/**
 * Create calendar event notification payload
 */
export function createCalendarEventNotification(
  workspaceId: string,
  userId: string,
  eventTitle: string,
  eventId: string,
  date: string,
  time: string,
  count?: number
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'info',
    category: 'calendar',
    priority: 'normal',
    title: count ? 'Sessões Agendadas' : 'Sessão Agendada',
    message: count 
      ? `${count} sessões agendadas para ${date}`
      : `${eventTitle} agendado para ${date} às ${time}`,
    eventId,
    relatedId: eventId,
    relatedType: 'event',
    actionUrl: `/calendar`,
    actionLabel: 'Ver Calendário',
    metadata: { date, time, count },
  };
}

/**
 * Create AI decision notification payload
 */
export function createAIDecisionNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  decisionType: string,
  decisionId: string
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'warning',
    category: 'decision',
    priority: 'high',
    title: 'Decisão AI Pendente',
    message: `${athleteName}: ${decisionType}`,
    athleteId,
    relatedId: decisionId,
    relatedType: 'athlete',
    actionUrl: `/data-os`,
    actionLabel: 'Rever Decisão',
    metadata: { decisionType },
  };
}

/**
 * Create metric threshold notification payload
 */
export function createMetricThresholdNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  metricName: string,
  value: number,
  threshold: number,
  direction: 'above' | 'below'
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'warning',
    category: 'metric',
    priority: 'high',
    title: 'Alerta de Métrica',
    message: `${athleteName}: ${metricName} ${direction === 'above' ? 'acima' : 'abaixo'} do limite (${value} vs ${threshold})`,
    athleteId,
    relatedType: 'metric',
    actionUrl: `/athlete/${athleteId}`,
    actionLabel: 'Ver Métricas',
    metadata: { metricName, value, threshold, direction },
  };
}

/**
 * Create session scheduled notification payload (for calendar)
 */
export function createSessionScheduledNotification(
  workspaceId: string,
  userId: string,
  count: number,
  date: string,
  time: string
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'info',
    category: 'calendar',
    priority: 'normal',
    title: count > 1 ? 'Sessões Agendadas' : 'Sessão Agendada',
    message: count > 1 
      ? `${count} sessões agendadas para ${date}`
      : `Sessão agendada para ${date} às ${time}`,
    relatedType: 'event',
    actionUrl: `/calendar`,
    actionLabel: 'Ver Calendário',
    metadata: { count, date, time },
  };
}

/**
 * Create high load notification payload
 */
export function createHighLoadNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  loadPercent: number
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'warning',
    category: 'metric',
    priority: loadPercent >= 95 ? 'high' : 'normal',
    title: 'Carga Elevada',
    message: `${athleteName} está com ${loadPercent}% de carga`,
    athleteId,
    relatedType: 'metric',
    actionUrl: `/athlete/${athleteId}`,
    actionLabel: 'Ver Atleta',
    metadata: { loadPercent },
  };
}

/**
 * Create low readiness notification payload
 */
export function createLowReadinessNotification(
  workspaceId: string,
  userId: string,
  athleteName: string,
  athleteId: string,
  readiness: number
): CreateNotificationPayload {
  return {
    workspaceId,
    userId,
    type: 'warning',
    category: 'metric',
    priority: readiness <= 50 ? 'high' : 'normal',
    title: 'Prontidão Baixa',
    message: `${athleteName} com ${readiness}% de prontidão`,
    athleteId,
    relatedType: 'metric',
    actionUrl: `/athlete/${athleteId}`,
    actionLabel: 'Ver Atleta',
    metadata: { readiness },
  };
}