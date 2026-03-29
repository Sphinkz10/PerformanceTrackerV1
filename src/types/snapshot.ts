/**
 * SNAPSHOT TYPES - SEMANA 3 ✅
 * 
 * TypeScript definitions for immutable session snapshots
 * 
 * @author PerformTrack Team
 * @since Semana 3 - Live Session Integration
 */

// ============================================================================
// CORE SNAPSHOT TYPE
// ============================================================================

export interface SessionSnapshot {
  // Metadata
  version: string;
  sessionId: string;
  workoutId: string;
  completedAt: string;
  savedAt: string;

  // Workout structure (immutable copy)
  workout: WorkoutSnapshot;

  // Executed data
  executedWorkout: ExecutedWorkout;

  // Athletes who participated
  athletes: AthleteSnapshot[];

  // Session-level metadata
  notes?: string;
  environment?: EnvironmentData;
  duration?: number; // Total duration in minutes
}

// ============================================================================
// WORKOUT SNAPSHOT (Template at time of execution)
// ============================================================================

export interface WorkoutSnapshot {
  id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  exercises: ExerciseTemplate[];
  createdBy?: string;
  createdAt?: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'skill' | 'other';
  targetedMuscles?: string[];
  equipment?: string[];
  
  // Prescribed structure
  sets?: number;
  reps?: number | string; // Can be "8-12" or fixed number
  weight?: number;
  rest?: number; // Rest in seconds
  tempo?: string; // e.g., "3-1-2-1"
  notes?: string;
}

// ============================================================================
// EXECUTED WORKOUT (What actually happened)
// ============================================================================

export interface ExecutedWorkout {
  exercises: ExecutedExercise[];
  totalDuration?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface ExecutedExercise {
  id: string;
  templateId: string; // Link to ExerciseTemplate
  name: string;
  order: number;
  
  // Athlete-specific data
  athleteData: Record<string, ExecutedSet[]>; // athleteId → sets
  
  // Exercise-level notes
  notes?: string;
  videoUrl?: string;
}

export interface ExecutedSet {
  setNumber: number;
  
  // Actual performance
  reps?: number;
  weight?: number;
  distance?: number; // For cardio (meters)
  duration?: number; // For timed exercises (seconds)
  
  // Intensity markers
  rpe?: number; // 1-10
  heartRate?: number;
  
  // Quality markers
  isPR?: boolean;
  formRating?: number; // 1-5
  completed?: boolean;
  
  // Metadata
  timestamp?: string;
  notes?: string;
}

// ============================================================================
// ATHLETE SNAPSHOT
// ============================================================================

export interface AthleteSnapshot {
  athleteId: string;
  name: string;
  
  // Aggregated stats
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  avgRPE?: number;
  maxHeartRate?: number;
  avgHeartRate?: number;
  
  // Records achieved
  personalRecordsAchieved?: PersonalRecordAchieved[];
  
  // Pre-session state (for context)
  preSessionMetrics?: PreSessionMetrics;
  
  // Post-session feedback
  postSessionFeedback?: PostSessionFeedback;
}

export interface PersonalRecordAchieved {
  exerciseName: string;
  exerciseId: string;
  value: number;
  unit: string;
  reps?: number;
  achievedAt: string;
  previousBest?: number;
  improvement?: number; // Percentage
}

export interface PreSessionMetrics {
  readiness?: number;
  fatigue?: number;
  soreness?: number;
  stress?: number;
  sleep?: number;
  weight?: number;
  timestamp: string;
}

export interface PostSessionFeedback {
  overallFeeling?: number; // 1-10
  difficultyRating?: number; // 1-10
  enjoymentRating?: number; // 1-10
  notes?: string;
  timestamp: string;
}

// ============================================================================
// ENVIRONMENT DATA
// ============================================================================

export interface EnvironmentData {
  location?: string;
  temperature?: number;
  humidity?: number;
  altitude?: number;
  surface?: string; // 'grass', 'track', 'gym', etc.
  weather?: string;
}

// ============================================================================
// SNAPSHOT VALIDATION
// ============================================================================

export interface SnapshotValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSnapshot(snapshot: Partial<SessionSnapshot>): SnapshotValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!snapshot.version) errors.push('Missing version');
  if (!snapshot.sessionId) errors.push('Missing sessionId');
  if (!snapshot.workoutId) errors.push('Missing workoutId');
  if (!snapshot.completedAt) errors.push('Missing completedAt');
  if (!snapshot.savedAt) errors.push('Missing savedAt');

  // Structure validation
  if (!snapshot.workout) {
    errors.push('Missing workout snapshot');
  } else {
    if (!snapshot.workout.exercises || snapshot.workout.exercises.length === 0) {
      warnings.push('Workout has no exercises');
    }
  }

  if (!snapshot.executedWorkout) {
    errors.push('Missing executedWorkout');
  } else {
    if (!snapshot.executedWorkout.exercises || snapshot.executedWorkout.exercises.length === 0) {
      warnings.push('No exercises were executed');
    }
  }

  if (!snapshot.athletes || snapshot.athletes.length === 0) {
    errors.push('No athletes in snapshot');
  }

  // Data consistency
  if (snapshot.executedWorkout && snapshot.athletes) {
    snapshot.executedWorkout.exercises?.forEach((exercise, idx) => {
      if (!exercise.athleteData || Object.keys(exercise.athleteData).length === 0) {
        warnings.push(`Exercise ${idx} (${exercise.name}) has no athlete data`);
      }

      // Check if all athletes have data for all exercises
      snapshot.athletes!.forEach(athlete => {
        if (!exercise.athleteData[athlete.athleteId]) {
          warnings.push(`Athlete ${athlete.name} missing data for ${exercise.name}`);
        }
      });
    });
  }

  // Version check
  if (snapshot.version && snapshot.version !== '1.0') {
    warnings.push(`Unknown snapshot version: ${snapshot.version}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================================
// SNAPSHOT UTILITIES
// ============================================================================

export function calculateAthleteAggregates(
  athleteId: string,
  executedWorkout: ExecutedWorkout
): Partial<AthleteSnapshot> {
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  const rpeValues: number[] = [];
  const hrValues: number[] = [];
  const prsAchieved: PersonalRecordAchieved[] = [];

  executedWorkout.exercises.forEach(exercise => {
    const athleteData = exercise.athleteData[athleteId] || [];

    athleteData.forEach(set => {
      totalSets++;
      totalReps += set.reps || 0;
      totalVolume += (set.reps || 0) * (set.weight || 0);

      if (set.rpe) rpeValues.push(set.rpe);
      if (set.heartRate) hrValues.push(set.heartRate);

      if (set.isPR) {
        prsAchieved.push({
          exerciseName: exercise.name,
          exerciseId: exercise.id,
          value: set.weight || set.distance || set.duration || 0,
          unit: set.weight ? 'kg' : (set.distance ? 'm' : 's'),
          reps: set.reps,
          achievedAt: set.timestamp || new Date().toISOString()
        });
      }
    });
  });

  return {
    athleteId,
    totalVolume: Math.round(totalVolume),
    totalSets,
    totalReps,
    avgRPE: rpeValues.length > 0
      ? Math.round((rpeValues.reduce((sum, v) => sum + v, 0) / rpeValues.length) * 10) / 10
      : undefined,
    maxHeartRate: hrValues.length > 0 ? Math.max(...hrValues) : undefined,
    avgHeartRate: hrValues.length > 0
      ? Math.round(hrValues.reduce((sum, v) => sum + v, 0) / hrValues.length)
      : undefined,
    personalRecordsAchieved: prsAchieved.length > 0 ? prsAchieved : undefined
  };
}

export function snapshotToJSON(snapshot: SessionSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export function snapshotFromJSON(json: string): SessionSnapshot {
  return JSON.parse(json);
}

// ============================================================================
// SNAPSHOT SUMMARY (for quick views)
// ============================================================================

export interface SnapshotSummary {
  sessionId: string;
  workoutName: string;
  completedAt: string;
  duration?: number;
  athleteCount: number;
  exerciseCount: number;
  totalVolume: number;
  avgRPE?: number;
  prsAchieved: number;
}

export function generateSnapshotSummary(snapshot: SessionSnapshot): SnapshotSummary {
  const totalVolume = snapshot.athletes.reduce((sum, a) => sum + a.totalVolume, 0);
  const rpeValues = snapshot.athletes.map(a => a.avgRPE).filter(Boolean) as number[];
  const avgRPE = rpeValues.length > 0
    ? rpeValues.reduce((sum, v) => sum + v, 0) / rpeValues.length
    : undefined;
  const prsAchieved = snapshot.athletes.reduce(
    (sum, a) => sum + (a.personalRecordsAchieved?.length || 0),
    0
  );

  return {
    sessionId: snapshot.sessionId,
    workoutName: snapshot.workout.name,
    completedAt: snapshot.completedAt,
    duration: snapshot.duration,
    athleteCount: snapshot.athletes.length,
    exerciseCount: snapshot.executedWorkout.exercises.length,
    totalVolume: Math.round(totalVolume),
    avgRPE: avgRPE ? Math.round(avgRPE * 10) / 10 : undefined,
    prsAchieved
  };
}
