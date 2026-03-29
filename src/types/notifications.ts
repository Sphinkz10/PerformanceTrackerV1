/**
 * NOTIFICATION TYPES
 * 
 * TypeScript definitions for the Notifications System
 * Matches database schema in /database/migrations/008_notifications_system.sql
 * 
 * @module types/notifications
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type NotificationType = 'alert' | 'success' | 'info' | 'warning';

export type NotificationCategory =
  | 'pain'
  | 'session'
  | 'form'
  | 'athlete'
  | 'calendar'
  | 'decision'
  | 'system'
  | 'metric'
  | 'injury'
  | 'record';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationRelatedType =
  | 'athlete'
  | 'session'
  | 'form'
  | 'event'
  | 'metric'
  | 'injury'
  | 'record'
  | 'workout'
  | 'decision';

export type NotificationEventType =
  | 'created'
  | 'read'
  | 'unread'
  | 'archived'
  | 'deleted'
  | 'clicked'
  | 'dismissed'
  | 'email_sent'
  | 'push_sent';

export type DigestFrequency = 'hourly' | 'daily' | 'weekly';

// ============================================================================
// MAIN TYPES
// ============================================================================

/**
 * Core Notification entity
 */
export interface Notification {
  // Identity
  id: string;
  workspaceId: string;
  userId: string;

  // Classification
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;

  // Content
  title: string;
  message: string;

  // State
  read: boolean;
  archived: boolean;

  // Relations
  eventId?: string;
  athleteId?: string;
  relatedId?: string;
  relatedType?: NotificationRelatedType;

  // Navigation
  actionUrl?: string;
  actionLabel?: string;

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

/**
 * Notification creation payload
 */
export interface CreateNotificationPayload {
  workspaceId: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  priority?: NotificationPriority;
  eventId?: string;
  athleteId?: string;
  relatedId?: string;
  relatedType?: NotificationRelatedType;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

/**
 * Notification update payload
 */
export interface UpdateNotificationPayload {
  read?: boolean;
  archived?: boolean;
}

// ============================================================================
// PREFERENCES TYPES
// ============================================================================

/**
 * Quiet hours configuration
 */
export interface QuietHours {
  enabled: boolean;
  start: string; // HH:mm format
  end: string; // HH:mm format
  timezone: string;
}

/**
 * Category-specific notification settings
 */
export interface CategorySettings {
  pain: boolean;
  session: boolean;
  form: boolean;
  athlete: boolean;
  calendar: boolean;
  decision: boolean;
  system: boolean;
  metric: boolean;
  injury: boolean;
  record: boolean;
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  id: string;
  workspaceId: string;
  userId: string;

  // Global settings
  enabled: boolean;

  // Channel preferences
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;

  // Category preferences
  categorySettings: CategorySettings;

  // Quiet hours
  quietHours: QuietHours;

  // Digest settings
  digestEnabled: boolean;
  digestFrequency: DigestFrequency;
  digestTime: string; // HH:mm format

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Preferences update payload
 */
export interface UpdatePreferencesPayload {
  enabled?: boolean;
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  categorySettings?: Partial<CategorySettings>;
  quietHours?: Partial<QuietHours>;
  digestEnabled?: boolean;
  digestFrequency?: DigestFrequency;
  digestTime?: string;
}

// ============================================================================
// AUDIT TYPES
// ============================================================================

/**
 * Notification event for audit trail
 */
export interface NotificationEvent {
  id: string;
  notificationId: string;
  eventType: NotificationEventType;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Response for list notifications endpoint
 */
export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

/**
 * Response for notification stats endpoint
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  recentCount: number; // Last 24h
}

/**
 * Response for single notification
 */
export interface NotificationResponse {
  notification: Notification;
}

/**
 * Response for preferences
 */
export interface PreferencesResponse {
  preferences: NotificationPreferences;
}

// ============================================================================
// QUERY TYPES
// ============================================================================

/**
 * Query parameters for listing notifications
 */
export interface NotificationQuery {
  workspaceId: string;
  userId?: string;
  category?: NotificationCategory;
  type?: NotificationType;
  priority?: NotificationPriority;
  unreadOnly?: boolean;
  includeArchived?: boolean;
  athleteId?: string;
  eventId?: string;
  relatedId?: string;
  relatedType?: NotificationRelatedType;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Notification with icon and color helpers
 */
export interface NotificationWithUI extends Notification {
  icon: string; // Lucide icon name
  iconColor: string; // Tailwind color class
  bgColor: string; // Tailwind bg class
  borderColor: string; // Tailwind border class
}

/**
 * Grouped notifications by category
 */
export interface GroupedNotifications {
  category: NotificationCategory;
  count: number;
  unreadCount: number;
  notifications: Notification[];
  latestTimestamp: Date;
}

// ============================================================================
// HELPERS FOR NOTIFICATION CREATION
// ============================================================================

/**
 * Template for pain report notification
 */
export interface PainNotificationData {
  athleteName: string;
  athleteId: string;
  level: number;
  location: string;
}

/**
 * Template for session completed notification
 */
export interface SessionCompletedNotificationData {
  athleteName: string;
  athleteId: string;
  sessionTitle: string;
  completionRate: number;
}

/**
 * Template for form submitted notification
 */
export interface FormSubmittedNotificationData {
  athleteName: string;
  athleteId: string;
  formName: string;
  formId: string;
}

/**
 * Template for athlete joined notification
 */
export interface AthleteJoinedNotificationData {
  athleteName: string;
  athleteId: string;
  team?: string;
}

/**
 * Template for calendar event notification
 */
export interface CalendarEventNotificationData {
  eventTitle: string;
  eventId: string;
  date: string;
  time: string;
  count?: number;
}

/**
 * Template for AI decision notification
 */
export interface AIDecisionNotificationData {
  athleteName: string;
  athleteId: string;
  decisionType: string;
  decisionId: string;
}

/**
 * Template for metric threshold notification
 */
export interface MetricThresholdNotificationData {
  athleteName: string;
  athleteId: string;
  metricName: string;
  value: number;
  threshold: number;
  direction: 'above' | 'below';
}

/**
 * Template for injury reported notification
 */
export interface InjuryNotificationData {
  athleteName: string;
  athleteId: string;
  injuryType: string;
  severity: 'minor' | 'moderate' | 'severe';
}

/**
 * Template for record broken notification
 */
export interface RecordNotificationData {
  athleteName: string;
  athleteId: string;
  recordName: string;
  previousValue: number;
  newValue: number;
  improvement: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface NotificationError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export type {
  Notification as default,
};
