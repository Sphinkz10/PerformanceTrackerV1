/**
 * Dashboard Alerts Hook - All Alert Types
 * 
 * Fetches all types of alerts for the dashboard:
 * - Pain Reports (>= 8)
 * - Orphan Sessions (active > 2h)
 * - Pending Forms
 * - Pending Assessments
 * - Metrics Threshold Violations
 * - Personal Records Pending
 * - Webhook Failures
 * 
 * @author PerformTrack Team
 * @version 1.0.0
 */

import useSWR from 'swr';
import apiClient from '@/lib/api-client';

// ============================================================================
// TYPES
// ============================================================================

export interface PainAlert {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  submissionId: string;
  painLevel: number;
  location?: string;
  createdAt: string;
  timeAgo: string;
}

export interface OrphanSessionAlert {
  id: string;
  sessionId: string;
  title: string;
  athleteCount: number;
  startedAt: string;
  hoursActive: number;
}

export interface PendingFormAlert {
  id: string;
  formId: string;
  formName: string;
  pendingCount: number;
  athleteNames: string[];
}

export interface PendingAssessmentAlert {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  lastAssessmentDate: string | null;
  daysSince: number | null;
}

export interface MetricThresholdAlert {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  metricName: string;
  value: number;
  unit: string;
  thresholdMin?: number;
  thresholdMax?: number;
  recordedAt: string;
  timeAgo: string;
}

export interface PersonalRecordAlert {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  metricName: string;
  newValue: number;
  previousValue: number;
  unit: string;
  sourceType: string;
  sourceId: string;
  createdAt: string;
  timeAgo: string;
}

export interface WebhookFailureAlert {
  id: string;
  webhookId: string;
  webhookName: string;
  url: string;
  eventType: string;
  retryCount: number;
  lastError: string;
  createdAt: string;
  timeAgo: string;
}

export interface DashboardAlerts {
  pain: PainAlert[];
  orphanSessions: OrphanSessionAlert[];
  pendingForms: PendingFormAlert[];
  pendingAssessments: PendingAssessmentAlert[];
  metricsThreshold: MetricThresholdAlert[];
  personalRecords: PersonalRecordAlert[];
  webhookFailures: WebhookFailureAlert[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    total: number;
  };
}

// ============================================================================
// FETCHER
// ============================================================================

const fetcher = async (url: string) => {
  return await apiClient(url);
};

// ============================================================================
// HOOKS
// ============================================================================

export function useDashboardAlerts(
  workspaceId: string,
  options?: {
    refreshInterval?: number;
    types?: string[]; // Filter specific alert types
  }
) {
  const params = new URLSearchParams({ 
    workspaceId,
    types: options?.types?.join(',') || 'all',
  });

  const { data, error, mutate } = useSWR(
    `/api/analytics/alerts?${params}`,
    fetcher,
    {
      refreshInterval: options?.refreshInterval || 60000, // 1 min default
      revalidateOnFocus: true,
    }
  );

  return {
    alerts: data?.alerts || {
      pain: [],
      orphanSessions: [],
      pendingForms: [],
      pendingAssessments: [],
      metricsThreshold: [],
      personalRecords: [],
      webhookFailures: [],
      summary: { critical: 0, high: 0, medium: 0, total: 0 },
    } as DashboardAlerts,
    error,
    isLoading: !data && !error,
    mutate,
  };
}

// Individual alert type hooks (if needed)

export function usePainAlerts(workspaceId: string) {
  const params = new URLSearchParams({ workspaceId });

  const { data, error, mutate } = useSWR(
    `/api/analytics/alerts/pain?${params}`,
    fetcher
  );

  return {
    alerts: data?.alerts || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function useOrphanSessions(workspaceId: string) {
  const params = new URLSearchParams({ workspaceId });

  const { data, error, mutate } = useSWR(
    `/api/analytics/alerts/orphan-sessions?${params}`,
    fetcher
  );

  return {
    sessions: data?.sessions || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function usePendingForms(workspaceId: string) {
  const params = new URLSearchParams({ workspaceId });

  const { data, error, mutate } = useSWR(
    `/api/analytics/alerts/pending-forms?${params}`,
    fetcher
  );

  return {
    forms: data?.forms || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function usePendingAssessments(workspaceId: string) {
  const params = new URLSearchParams({ workspaceId });

  const { data, error, mutate } = useSWR(
    `/api/analytics/alerts/pending-assessments?${params}`,
    fetcher
  );

  return {
    athletes: data?.athletes || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function useMetricThresholdAlerts(workspaceId: string) {
  const params = new URLSearchParams({ workspaceId });

  const { data, error, mutate } = useSWR(
    `/api/analytics/alerts/metrics-threshold?${params}`,
    fetcher
  );

  return {
    alerts: data?.alerts || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function usePersonalRecordSuggestions(workspaceId: string) {
  const params = new URLSearchParams({ workspaceId });

  const { data, error, mutate } = useSWR(
    `/api/personal-records/suggestions?${params}&status=pending`,
    fetcher
  );

  return {
    suggestions: data?.suggestions || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function useWebhookFailures(workspaceId: string) {
  const params = new URLSearchParams({ 
    workspaceId,
    status: 'failed',
    minRetries: '3',
  });

  const { data, error, mutate } = useSWR(
    `/api/webhooks/deliveries?${params}`,
    fetcher
  );

  return {
    failures: data?.deliveries || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

// ============================================================================
// TOP ANALYTICS HOOKS
// ============================================================================

export function useTopAthletes(
  workspaceId: string,
  options?: {
    dateRange?: 'week' | 'month';
    limit?: number;
  }
) {
  const params = new URLSearchParams({ 
    workspaceId,
    dateRange: options?.dateRange || 'week',
    limit: String(options?.limit || 5),
  });

  const { data, error, mutate } = useSWR(
    `/api/analytics/top-athletes?${params}`,
    fetcher
  );

  return {
    athletes: data?.athletes || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function useTopWorkouts(
  workspaceId: string,
  options?: {
    dateRange?: 'week' | 'month';
    limit?: number;
  }
) {
  const params = new URLSearchParams({ 
    workspaceId,
    dateRange: options?.dateRange || 'week',
    limit: String(options?.limit || 3),
  });

  const { data, error, mutate } = useSWR(
    `/api/analytics/top-workouts?${params}`,
    fetcher
  );

  return {
    workouts: data?.workouts || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}

export function useRecentExports(
  workspaceId: string,
  options?: {
    limit?: number;
  }
) {
  const params = new URLSearchParams({ 
    workspaceId,
    limit: String(options?.limit || 3),
    sortBy: 'createdAt',
    order: 'desc',
  });

  const { data, error, mutate } = useSWR(
    `/api/export?${params}`,
    fetcher
  );

  return {
    exports: data?.exports || [],
    error,
    isLoading: !data && !error,
    mutate,
  };
}