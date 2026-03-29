/**
 * Session Types
 * 
 * Type definitions for session templates, instances, and live execution.
 */

// ============================================================================
// SESSION TEMPLATE TYPES
// ============================================================================

export type SessionType = 'strength' | 'cardio' | 'hybrid' | 'skill' | 'recovery';

export interface SessionTemplate {
  id: string;
  name: string;
  description?: string;
  type: SessionType;
  duration: number; // minutes (estimated)
  
  exercises: SessionExercise[];
  
  restDefaults?: {
    betweenSets: number; // seconds
    betweenExercises: number; // seconds
  };
  
  // Form integration (from Fase 6)
  forms?: string[]; // Form IDs to collect during/after session
  
  notes?: string;
  tags?: string[];
  category?: string;
  
  // Metadata
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionExercise {
  id: string;
  exerciseId: string; // Reference to Exercise Library
  order: number;
  
  // Planned values
  sets: number;
  reps?: number | string; // "10" or "10-12" or "AMRAP" or "Max"
  load?: number;
  loadUnit?: string; // "kg", "lbs", "%1RM"
  
  // Rest
  restBetweenSets?: number; // seconds (overrides template default)
  
  // Advanced
  tempo?: string; // "3-0-1-0" (eccentric-pause-concentric-pause)
  rpe?: number; // 1-10 (target RPE)
  notes?: string;
  
  // Special sets
  supersetWith?: string; // Exercise ID (if part of superset)
  dropSets?: boolean;
  clusters?: boolean;
  
  // Instructions
  cues?: string[];
  videoUrl?: string;
}

// ============================================================================
// SESSION INSTANCE TYPES (Live Session)
// ============================================================================

export type SessionStatus = 
  | 'scheduled'
  | 'ready'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface SessionInstance {
  id: string;
  templateId?: string; // Can be null for ad-hoc sessions
  
  // Participants
  athleteId: string;
  coachId: string;
  
  // Status
  status: SessionStatus;
  
  // Timing
  scheduledDate?: Date;
  startedAt?: Date;
  pausedAt?: Date;
  resumedAt?: Date;
  completedAt?: Date;
  duration?: number; // actual duration in seconds
  
  // Content
  exercises: SessionExerciseInstance[];
  
  // Data collection
  formSubmissions?: string[]; // Form submission IDs
  
  // Feedback
  feedback?: SessionFeedback;
  
  // Context
  location?: string;
  weather?: string;
  equipment?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionExerciseInstance {
  id: string;
  exerciseId: string;
  order: number;
  
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  
  // Planned (from template)
  plannedSets: number;
  plannedReps?: number | string;
  plannedLoad?: number;
  plannedLoadUnit?: string;
  plannedRpe?: number;
  plannedTempo?: string;
  
  // Actual (executed)
  actualSets: SetInstance[];
  
  // Timing
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // seconds
  
  // Notes
  notes?: string;
  
  // Media
  videos?: string[]; // URLs
  photos?: string[]; // URLs
}

export interface SetInstance {
  id: string;
  setNumber: number;
  
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  
  // Planned
  plannedReps?: number;
  plannedLoad?: number;
  
  // Actual
  actualReps?: number;
  actualLoad?: number;
  
  // Performance
  rpe?: number; // 1-10
  tempo?: string;
  
  // Rest
  restAfter?: number; // seconds (prescribed)
  restActual?: number; // seconds (actual time rested)
  restStartedAt?: Date;
  restCompletedAt?: Date;
  
  // Timing
  startedAt?: Date;
  completedAt?: Date;
  
  // Notes
  notes?: string;
  
  // Media
  video?: string;
}

export interface SessionFeedback {
  // Athlete feedback
  athleteRating?: number; // 1-5 stars
  athleteNotes?: string;
  athleteRpe?: number; // Overall session RPE
  
  // Coach feedback
  coachNotes?: string;
  coachRating?: number; // 1-5 stars
  
  // Wellness
  energy?: number; // 1-10
  motivation?: number; // 1-10
  soreness?: number; // 1-10
  sleep?: number; // hours
  sleepQuality?: number; // 1-10
}

// ============================================================================
// SESSION STATISTICS
// ============================================================================

export interface SessionStats {
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  totalReps: number;
  totalVolume: number; // kg or lbs
  averageRpe: number;
  duration: number; // seconds
  totalRestTime: number; // seconds
  totalWorkTime: number; // seconds
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface SessionFilter {
  athleteId?: string;
  coachId?: string;
  status?: SessionStatus[];
  type?: SessionType[];
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
}

export interface SessionSortOption {
  field: 'date' | 'duration' | 'volume' | 'rpe';
  direction: 'asc' | 'desc';
}
