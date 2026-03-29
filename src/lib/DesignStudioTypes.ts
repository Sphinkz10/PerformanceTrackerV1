// DesignStudioTypes.ts - TypeScript interfaces for Design Studio
// Comprehensive type definitions for exercises, workouts, plans, and classes

// =============================================================================
// EXERCISE TYPES
// =============================================================================

export type VariableType = 
  | 'number'
  | 'text-short'
  | 'text-long'
  | 'select'
  | 'multi-select'
  | 'scale'
  | 'date'
  | 'duration'
  | 'boolean'
  | 'url';

export interface Variable {
  id: string;
  name: string;
  type: VariableType;
  required: boolean;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue?: any;
  placeholder?: string;
  description?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscleGroups?: string[];
  equipment?: string[];
  variables: Variable[];
  tags?: string[];
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// =============================================================================
// WORKOUT TYPES
// =============================================================================

export type WorkoutCategory = 
  | 'strength' 
  | 'cardio' 
  | 'mobility' 
  | 'sport' 
  | 'recovery';

export interface WorkoutExercise {
  id: string;
  exerciseId?: string; // Reference to Exercise in library
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: number;
  tempo: string;
  notes: string;
  order: number;
}

export interface WorkoutBlock {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  rest: number;
  rounds?: number;
  notes?: string;
  order: number;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration?: number; // in minutes
  blocks: WorkoutBlock[];
  tags: string[];
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// =============================================================================
// PLAN TYPES
// =============================================================================

export type PlanType = 
  | 'strength' 
  | 'hypertrophy' 
  | 'endurance' 
  | 'weight-loss' 
  | 'sport-specific' 
  | 'general-fitness';

export type PlanDuration = 
  | '4-weeks' 
  | '6-weeks' 
  | '8-weeks' 
  | '12-weeks' 
  | 'custom';

export interface PlanWeek {
  id: string;
  weekNumber: number;
  name: string;
  description?: string;
  sessions: PlanSession[];
}

export interface PlanSession {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  name: string;
  workoutId?: string; // Reference to Workout
  workout?: Workout; // Embedded workout data
  notes?: string;
  duration?: number; // in minutes
  isRestDay: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  duration: PlanDuration;
  durationWeeks: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  weeks: PlanWeek[];
  tags: string[];
  objectives?: string[];
  prerequisites?: string[];
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// =============================================================================
// CLASS TYPES
// =============================================================================

export type ClassType = 
  | 'group-fitness' 
  | 'bootcamp' 
  | 'yoga' 
  | 'pilates' 
  | 'spinning' 
  | 'hiit' 
  | 'dance' 
  | 'martial-arts' 
  | 'crossfit'
  | 'other';

export type ClassIntensity = 
  | 'low' 
  | 'moderate' 
  | 'high' 
  | 'variable';

export interface ClassSegment {
  id: string;
  name: string;
  duration: number; // in minutes
  type: 'warmup' | 'main' | 'cooldown' | 'stretch' | 'other';
  description?: string;
  exercises?: WorkoutExercise[];
  music?: string;
  notes?: string;
  order: number;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  type: ClassType;
  intensity: ClassIntensity;
  duration: number; // in minutes
  maxParticipants?: number;
  minParticipants?: number;
  segments: ClassSegment[];
  equipment?: string[];
  musicPlaylist?: string;
  tags: string[];
  objectives?: string[];
  targetAudience?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// =============================================================================
// COMMON TYPES
// =============================================================================

export interface Tag {
  id: string;
  name: string;
  color: string;
  category?: 'exercise' | 'workout' | 'plan' | 'class';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// =============================================================================
// FORM DATA TYPES (for modals/builders)
// =============================================================================

export interface ExerciseFormData {
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  variables: Variable[];
  tags: string[];
}

export interface WorkoutFormData {
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration?: number;
  blocks: WorkoutBlock[];
  tags: string[];
}

export interface PlanFormData {
  name: string;
  description: string;
  type: PlanType;
  duration: PlanDuration;
  durationWeeks: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  weeks: PlanWeek[];
  tags: string[];
  objectives: string[];
}

export interface ClassFormData {
  name: string;
  description: string;
  type: ClassType;
  intensity: ClassIntensity;
  duration: number;
  maxParticipants?: number;
  segments: ClassSegment[];
  equipment: string[];
  tags: string[];
  objectives: string[];
}
