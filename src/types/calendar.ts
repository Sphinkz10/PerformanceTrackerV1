/**
 * CALENDAR V2.0 - TYPE DEFINITIONS
 * Complete TypeScript types for the calendar system
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type CalendarEventType = 
  | 'workout' 
  | 'game' 
  | 'competition' 
  | 'rest' 
  | 'meeting' 
  | 'testing' 
  | 'other';

export type CalendarEventStatus = 
  | 'scheduled' 
  | 'active' 
  | 'completed' 
  | 'cancelled' 
  | 'postponed';

export type ParticipantStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'declined' 
  | 'attended' 
  | 'no_show' 
  | 'cancelled';

export type ConfirmationMethod = 
  | 'email' 
  | 'app' 
  | 'sms' 
  | 'qr_code' 
  | 'manual';

export type CalendarView = 
  | 'week' 
  | 'day' 
  | 'month' 
  | 'agenda' 
  | 'team';

// ============================================================================
// DATABASE MODELS
// ============================================================================

export interface CalendarEvent {
  id: string;
  workspace_id: string;
  
  // Basic info
  title: string;
  description?: string;
  
  // Timing
  start_date: string; // ISO 8601
  end_date: string;   // ISO 8601
  
  // Classification
  type: CalendarEventType;
  status: CalendarEventStatus;
  
  // Relations to other entities
  workout_id?: string;
  plan_id?: string;
  class_id?: string;
  coach_id?: string;
  
  // Details
  location?: string;
  notes?: string;
  color?: string;
  tags?: string[];
  
  // Participants
  athlete_ids?: string[]; // Legacy support
  max_participants?: number;
  
  // Recurrence (future feature)
  recurrence_pattern?: RecurrencePattern;
  
  // Completion
  completed_at?: string;
  completed_by?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Audit
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  athlete_id: string;
  
  // Status
  status: ParticipantStatus;
  
  // Timestamps
  confirmed_at?: string;
  attended_at?: string;
  declined_at?: string;
  
  // Additional
  notes?: string;
  metadata?: Record<string, any>;
  
  // Audit
  created_at: string;
  updated_at: string;
}

export interface EventConfirmation {
  id: string;
  participant_id: string;
  
  // Confirmation mechanism
  token: string;
  method: ConfirmationMethod;
  
  // Timing
  sent_at: string;
  expires_at: string;
  confirmed_at?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Audit
  created_at: string;
}

// Event Templates
export interface EventTemplate {
  id: string;
  workspace_id: string;
  
  // Basic info
  name: string;
  description?: string;
  
  // Event defaults
  type: CalendarEventType;
  duration_minutes: number;
  location?: string;
  color?: string;
  tags?: string[];
  
  // Default participants
  default_athlete_ids?: string[];
  
  // System vs Custom
  is_system: boolean;
  
  // Usage tracking
  use_count?: number;
  last_used_at?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Audit
  created_at: string;
  updated_at: string;
}

// ============================================================================
// EXTENDED TYPES (with relations)
// ============================================================================

export interface CalendarEventWithParticipants extends CalendarEvent {
  participants?: EventParticipantWithDetails[];
  participant_count?: ParticipantCount;
}

export interface EventParticipantWithDetails extends EventParticipant {
  athlete?: {
    id: string;
    name: string;
    photo?: string;
    email?: string;
  };
  confirmations?: EventConfirmation[];
}

export interface ParticipantCount {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  attended: number;
  no_show: number;
}

// ============================================================================
// RECURRENCE PATTERN (future)
// ============================================================================

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // 0-6 (Sun-Sat) for weekly
  daysOfMonth?: number[]; // 1-31 for monthly
  endDate?: string; // When to stop
  count?: number; // Or stop after N occurrences
  exceptions?: string[]; // Dates to skip
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface CalendarFilters {
  athleteIds?: string[];
  types?: CalendarEventType[];
  statuses?: CalendarEventStatus[];
  coachIds?: string[];
  locations?: string[];
  tags?: string[];
  hasWorkout?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface CalendarViewState {
  view: CalendarView;
  currentDate: Date;
  filters: CalendarFilters;
  selectedEventId?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  events: CalendarEvent[];
  isCurrentTime?: boolean;
  isPast?: boolean;
}

export interface WeekDay {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateEventFormData {
  // Step 1: Source
  source: 'manual' | 'workout' | 'plan' | 'class';
  workout_id?: string;
  plan_id?: string;
  class_id?: string;
  
  // Step 2: DateTime & Location
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  type: CalendarEventType;
  location?: string;
  color?: string;
  tags?: string[];
  
  // Step 3: Participants
  athlete_ids: string[];
  max_participants?: number;
  
  // Step 4: Confirmation Settings
  confirmation_settings?: {
    auto_send: boolean;
    hours_before: number; // 24, 48, 72, 168
    require_check_in: boolean;
    enable_reminders: boolean;
    reminder_hours_before: number; // 1, 2, 4, 6
  };
  
  // Additional
  notes?: string;
}

export interface UpdateEventFormData extends Partial<CreateEventFormData> {
  id: string;
  status?: CalendarEventStatus;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface GetEventsParams {
  workspace_id: string;
  start_date?: string;
  end_date?: string;
  athlete_ids?: string[];
  types?: CalendarEventType[];
  statuses?: CalendarEventStatus[];
  limit?: number;
  offset?: number;
}

export interface GetEventsResponse {
  events: CalendarEventWithParticipants[];
  total: number;
  hasMore: boolean;
}

export interface CreateEventParams {
  workspace_id: string;
  event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>;
  participant_ids?: string[];
}

export interface UpdateEventParams {
  id: string;
  updates: Partial<CalendarEvent>;
}

export interface BulkCreateEventsParams {
  workspace_id: string;
  events: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>[];
}

// ============================================================================
// CONFLICT DETECTION (future)
// ============================================================================

export type ConflictType = 
  | 'athlete_double_booked' 
  | 'location_occupied' 
  | 'coach_overloaded'
  | 'recovery_low';

export interface EventConflict {
  type: ConflictType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  conflicting_event_id?: string;
  athlete_id?: string;
  suggestions?: string[];
}

// ============================================================================
// DESIGN STUDIO IMPORT
// ============================================================================

export interface WorkoutImportData {
  workout_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  type: CalendarEventType;
}

export interface PlanImportData {
  plan_id: string;
  title: string;
  description?: string;
  total_weeks: number;
  sessions_per_week: number;
  sessions: {
    week: number;
    day: number;
    workout_id: string;
    title: string;
  }[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface DateRange {
  start: Date;
  end: Date;
}

export interface EventColor {
  background: string;
  border: string;
  text: string;
  bg: string; // Hex color for templates
  icon: string; // Emoji icon
}

// Event type color mapping
export const EVENT_TYPE_COLORS: Record<CalendarEventType, EventColor> = {
  workout: {
    background: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    bg: '#0ea5e9',
    icon: '💪'
  },
  game: {
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    bg: '#10b981',
    icon: '⚽'
  },
  competition: {
    background: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    bg: '#8b5cf6',
    icon: '🏆'
  },
  rest: {
    background: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    bg: '#64748b',
    icon: '💤'
  },
  meeting: {
    background: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    bg: '#f59e0b',
    icon: '📋'
  },
  testing: {
    background: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    bg: '#ef4444',
    icon: '📊'
  },
  other: {
    background: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    bg: '#6b7280',
    icon: '📌'
  }
};

// Status color mapping
export const EVENT_STATUS_COLORS: Record<CalendarEventStatus, EventColor> = {
  scheduled: {
    background: 'bg-sky-100',
    border: 'border-sky-300',
    text: 'text-sky-700',
    bg: '#0ea5e9',
    icon: '📅'
  },
  active: {
    background: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    bg: '#10b981',
    icon: '▶️'
  },
  completed: {
    background: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-600',
    bg: '#64748b',
    icon: '✅'
  },
  cancelled: {
    background: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-700',
    bg: '#ef4444',
    icon: '❌'
  },
  postponed: {
    background: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-700',
    bg: '#f59e0b',
    icon: '⏸️'
  }
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const CALENDAR_CONSTANTS = {
  // Time
  WEEK_DAYS: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  WEEK_DAYS_FULL: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  MONTHS: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  MONTHS_FULL: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  
  // Hours
  START_HOUR: 6,  // 6 AM
  END_HOUR: 23,   // 11 PM
  HOUR_HEIGHT: 60, // pixels
  
  // Defaults
  DEFAULT_EVENT_DURATION: 60, // minutes
  DEFAULT_SLOT_DURATION: 30,  // minutes
  
  // Limits
  MAX_EVENTS_PER_DAY: 50,
  MAX_PARTICIPANTS_PER_EVENT: 100,
  CONFIRMATION_EXPIRES_HOURS: 48,
} as const;