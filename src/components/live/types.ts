// ============================================
// LIVE COMMAND TYPES
// ============================================

import { CalendarEvent } from '../calendar/types';

export interface LiveSessionConfig {
  sessionId: string;
  workspaceId: string;  // Added for backend integration
  calendarEvent: CalendarEvent;
  coachId: string;
}

export interface LiveWorkout {
  id: string;
  name: string;
  description?: string;
  exercises: LiveExercise[];
  estimatedDuration: number;
  intensity: number;
}

export interface LiveExercise {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  
  // Configuração planejada
  planned: {
    sets: number;
    reps: number | string; // "8-10" ou 8
    weight?: number;
    duration?: number; // segundos
    rest: number; // segundos
    notes?: string;
  };
  
  // Status de execução
  status: 'pending' | 'active' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  
  // Dados executados por atleta
  athleteData: {
    [athleteId: string]: ExecutedSet[];
  };
}

export interface ExecutedSet {
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number; // segundos
  distance?: number; // metros
  rpe?: number; // 1-10
  restAfter?: number; // segundos
  completed: boolean;
  notes?: string;
  timestamp: Date;
}

export interface LiveAthlete {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  
  // Presença
  attendance: 'present' | 'absent' | 'late';
  arrivalTime?: Date;
  
  // Estado atual
  currentExerciseIndex: number;
  currentSetNumber: number;
  
  // Histórico/Comparação
  history?: {
    lastSession?: {
      exerciseId: string;
      date: Date;
      bestSet: ExecutedSet;
    };
    personalRecords: {
      exerciseId: string;
      type: '1RM' | 'max_reps' | 'max_volume' | 'fastest_time';
      value: number;
      date: Date;
    }[];
  };
  
  // Performance da sessão atual
  sessionStats: {
    setsCompleted: number;
    totalVolume: number; // kg
    totalReps: number;
    averageRPE: number;
  };
}

export interface LiveSessionState {
  // Config
  config: LiveSessionConfig;
  
  // Workout
  workout: LiveWorkout;
  currentExerciseIndex: number;
  
  // Atletas
  athletes: LiveAthlete[];
  
  // Controle
  status: 'idle' | 'active' | 'paused' | 'completed';
  
  // Timestamps
  timestamps: {
    scheduled?: Date;
    started?: Date;
    pausedAt?: Date;
    resumedAt?: Date;
    completedAt?: Date;
  };
  
  // Timer
  timer: {
    elapsed: number; // milissegundos
    active: number; // milissegundos (excluindo pausas)
    pauses: number; // milissegundos total em pausa
    currentRest?: {
      exerciseId: string;
      startedAt: Date;
      duration: number; // segundos planejados
    };
  };
  
  // Modificações durante sessão
  modifications: SessionModification[];
  
  // Notas gerais
  notes: SessionNote[];
}

export interface SessionModification {
  id: string;
  type: 'exercise_skipped' | 'exercise_added' | 'reps_adjusted' | 'weight_adjusted' | 'exercise_substituted';
  timestamp: Date;
  exerciseId: string;
  athleteId?: string;
  reason?: string;
  previousValue?: any;
  newValue?: any;
  coachNotes?: string;
}

export interface SessionNote {
  id: string;
  timestamp: Date;
  exerciseId?: string;
  athleteId?: string;
  type: 'observation' | 'adjustment' | 'concern' | 'achievement';
  content: string;
  tags?: string[];
  includeInReport: boolean;
}

// SNAPSHOT IMUTÁVEL
export interface SessionSnapshot {
  id: string;
  version: '1.0';
  immutable: true;
  
  // Referências
  sessionId: string;
  calendarEventId: string;
  workoutId: string;
  coachId: string;
  
  // Planejado (cópia do workout original)
  plannedWorkout: LiveWorkout;
  
  // Executado (dados reais)
  executedWorkout: {
    exercises: LiveExercise[];
    actualDuration: number; // milissegundos
    actualIntensity: number;
  };
  
  // Atletas
  athletes: {
    athleteId: string;
    name: string;
    attendance: LiveAthlete['attendance'];
    arrivalTime?: Date;
    performanceData: LiveAthlete['sessionStats'];
    personalRecords: {
      exerciseId: string;
      type: string;
      value: number;
      previousRecord?: number;
      improvement: number;
    }[];
  }[];
  
  // Timestamps
  timestamps: {
    scheduled: Date;
    started: Date;
    ended: Date;
    pauseDurations: number[]; // milissegundos
    totalDuration: number;
    activeDuration: number;
  };
  
  // Modificações
  modifications: SessionModification[];
  notes: SessionNote[];
  
  // Analytics
  analytics: {
    volumeTotal: number;
    repsTotal: number;
    setsTotal: number;
    intensityAverage: number;
    complianceRate: number; // % do planejado executado
    
    // Por exercício
    byExercise: {
      [exerciseId: string]: {
        volumeTotal: number;
        averageRPE: number;
        completionRate: number;
      };
    };
    
    // Comparações
    comparisons: {
      vsLastSession?: {
        volumeDelta: number;
        rpeDelta: number;
      };
    };
  };
  
  // Integridade
  createdAt: Date;
  snapshotHash: string;
}

// CONTEXT
export interface LiveCommandContextValue {
  session: LiveSessionState | null;
  isActive: boolean;
  
  // Actions
  startSession: (config: LiveSessionConfig, workout: LiveWorkout) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => Promise<SessionSnapshot>;
  
  // Exercise navigation
  nextExercise: () => void;
  previousExercise: () => void;
  goToExercise: (index: number) => void;
  
  // Set recording
  recordSet: (athleteId: string, exerciseId: string, setData: Omit<ExecutedSet, 'setNumber' | 'timestamp'>) => void;
  
  // Modifications
  skipExercise: (exerciseId: string, reason?: string) => void;
  substituteExercise: (exerciseId: string, newExerciseId: string, reason?: string) => void;
  adjustExercise: (exerciseId: string, adjustments: Partial<LiveExercise['planned']>) => void;
  
  // Notes
  addNote: (note: Omit<SessionNote, 'id' | 'timestamp'>) => void;
  
  // Athletes
  updateAthleteAttendance: (athleteId: string, attendance: LiveAthlete['attendance']) => void;
}