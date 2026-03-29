// ============================================================================
// DESIGN STUDIO TYPES - Sistema Universal de Criação de Treinos
// ============================================================================

// ============================================================================
// MÓDULO 1: CRIADOR DE EXERCÍCIOS
// ============================================================================

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  type: ExerciseType;
  description?: string;
  
  // Visualização
  visualization: {
    video?: string[];
    images?: string[];
    model3D?: string;
    hotspots?: Array<{
      x: number;
      y: number;
      label: string;
      description: string;
    }>;
  };
  
  // Propriedades
  properties: {
    muscleGroups: MuscleGroup[];
    equipment: Equipment[];
    difficulty: 1 | 2 | 3 | 4 | 5;
    estimatedDuration: number; // seconds
    tags: string[];
  };
  
  // Dados coletáveis
  dataFields: ExerciseDataFields;
  
  // Execução
  execution: {
    phases: Array<{
      name: string;
      duration?: number;
      instructions: string;
    }>;
    checklist: string[];
    commonMistakes: Array<{
      mistake: string;
      correction: string;
    }>;
  };
  
  // Segurança
  safety: {
    maxVolume?: number;
    fatigueIndicators: string[];
    contraindications: string[];
  };
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  usageCount: number;
}

export type ExerciseCategory = 
  | 'strength' 
  | 'cardio' 
  | 'flexibility' 
  | 'balance' 
  | 'power' 
  | 'endurance'
  | 'mobility'
  | 'rehab';

export type ExerciseType = 
  | 'compound' 
  | 'isolation' 
  | 'plyometric' 
  | 'isometric' 
  | 'dynamic';

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'hip-flexors'
  | 'full-body';

export type Equipment = 
  | 'barbell' 
  | 'dumbbell' 
  | 'kettlebell' 
  | 'resistance-band'
  | 'bodyweight'
  | 'machine'
  | 'cable'
  | 'bench'
  | 'box'
  | 'ball'
  | 'trx'
  | 'none';

export interface ExerciseDataFields {
  // Métricas padrão
  metrics: {
    weight?: { enabled: boolean; unit: 'kg' | 'lb'; precision: number };
    reps?: { enabled: boolean; max?: number };
    sets?: { enabled: boolean; max?: number };
    rpe?: { enabled: boolean; scale: '1-10' | '6-20' };
    tempo?: { 
      enabled: boolean; 
      components: Array<'eccentric' | 'pause-bottom' | 'concentric' | 'pause-top'>;
    };
    rest?: { enabled: boolean; unit: 'seconds' | 'minutes' };
    distance?: { enabled: boolean; unit: 'meters' | 'km' | 'miles' };
    duration?: { enabled: boolean; unit: 'seconds' | 'minutes' };
    speed?: { enabled: boolean; unit: 'km/h' | 'mph' | 'm/s' };
    power?: { enabled: boolean; unit: 'watts' };
    heartRate?: { enabled: boolean };
  };
  
  // Métricas customizadas
  custom: Array<{
    id: string;
    name: string;
    type: 'number' | 'text' | 'select' | 'rating' | 'boolean';
    unit?: string;
    options?: string[];
    required: boolean;
  }>;
}

// ============================================================================
// MÓDULO 2: CRIADOR DE SESSÕES
// ============================================================================

export interface Session {
  id: string;
  name: string;
  description?: string;
  type: SessionType;
  
  // Estrutura
  blocks: SessionBlock[];
  totalDuration: number; // minutes
  
  // Configurações
  settings: SessionSettings;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
  tags: string[];
  usageCount: number;
}

export type SessionType = 
  | 'strength' 
  | 'cardio' 
  | 'hybrid' 
  | 'skill' 
  | 'recovery'
  | 'assessment'
  | 'education';

export interface SessionBlock {
  id: string;
  name: string;
  type: BlockType;
  duration: number; // minutes
  order: number;
  
  // Exercícios
  exercises: BlockExercise[];
  
  // Configurações do bloco
  settings: {
    autoProgress: boolean;
    failureProtocol: 'stop' | 'reduce' | 'continue';
    supersetWith?: string; // ID de outro bloco
    circuit: boolean;
    restBetweenExercises: number; // seconds
  };
  
  // Coleta de dados
  dataCollection: {
    enabled: boolean;
    requiredFields: string[];
    autoCapture: Array<'video' | 'velocity' | 'power' | 'heartRate'>;
  };
  
  // UI
  color: string;
  icon: string;
  collapsed?: boolean;
}

export type BlockType = 
  | 'warmup' 
  | 'main' 
  | 'accessory' 
  | 'cool-down' 
  | 'education'
  | 'assessment'
  | 'skill';

export interface BlockExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  order: number;
  
  // Prescrição
  prescription: {
    sets: number | string; // e.g., 4 or "AMRAP"
    reps: number | string; // e.g., 8 or "8-10" or "RIR-2"
    intensity: number | string; // e.g., 80 (%) or "RPE 8"
    rest: number; // seconds
    tempo?: string; // e.g., "3010"
    notes?: string;
  };
  
  // Progressão
  progression?: {
    rule: 'linear' | 'wave' | 'autoregulated';
    increment: number;
  };
}

export interface SessionSettings {
  warmupRequired: boolean;
  coolDownRequired: boolean;
  minRestBetweenBlocks: number; // seconds
  maxDuration?: number; // minutes
  allowModifications: boolean;
  trackReadiness: boolean;
}

// ============================================================================
// MÓDULO 3: CRIADOR DE PLANOS
// ============================================================================

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  goal: string;
  
  // Duração
  duration: {
    weeks: number;
    daysPerWeek: number;
    startDate?: Date;
    endDate?: Date;
  };
  
  // Estrutura semanal
  weeklyTemplate: WeeklyTemplate;
  
  // Progressão
  progression: ProgressionConfig;
  
  // Metas e checkpoints
  milestones: Milestone[];
  
  // Adaptação individual
  individualization: IndividualizationConfig;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  targetAudience: string[];
  tags: string[];
}

export interface WeeklyTemplate {
  days: Array<{
    dayOfWeek: number; // 1 = Monday, 7 = Sunday
    sessionId?: string;
    sessionType: SessionType;
    optional: boolean;
    alternativeSessionId?: string;
  }>;
}

export interface ProgressionConfig {
  type: 'linear' | 'wave' | 'block' | 'daily-undulating' | 'custom';
  
  // Regras de progressão
  rules: Array<{
    week: number;
    adjustments: {
      intensity?: number; // % increase
      volume?: number; // % increase
      exerciseVariation?: Array<{
        from: string; // exercise ID
        to: string; // exercise ID
      }>;
    };
  }>;
  
  // Auto-ajuste baseado em performance
  autoAdjust: boolean;
  autoAdjustRules?: Array<{
    if: string; // e.g., "readiness < 60%"
    then: string; // e.g., "reduce volume by 30%"
    else?: string; // e.g., "proceed as planned"
  }>;
}

export interface Milestone {
  id: string;
  week: number;
  name: string;
  target: string; // e.g., "1RM Back Squat > 150kg"
  testProtocol?: string; // ID do teste/assessment
  required: boolean;
}

export interface IndividualizationConfig {
  enabled: boolean;
  basedOn: Array<'performance' | 'fatigue' | 'readiness' | 'rpe' | 'velocity'>;
  rules: Array<{
    condition: string;
    action: string;
  }>;
}

// ============================================================================
// UI STATE & WORKSPACE
// ============================================================================

export interface DesignStudioState {
  // Active module
  activeModule: 'exercises' | 'sessions' | 'plans' | 'templates';
  
  // Current editing context
  currentExercise?: Exercise;
  currentSession?: Session;
  currentPlan?: TrainingPlan;
  
  // UI state
  selectedLayer?: {
    type: 'exercise' | 'block' | 'session' | 'plan';
    id: string;
  };
  
  // Panels
  panels: {
    left: { visible: boolean; width: number };
    right: { visible: boolean; width: number };
    bottom: { visible: boolean; height: number };
  };
  
  // Canvas
  canvas: {
    zoom: number;
    gridEnabled: boolean;
    snapEnabled: boolean;
  };
}

export interface DragItem {
  type: 'exercise' | 'block' | 'blockType' | 'session';
  id?: string;
  data: Exercise | SessionBlock | BlockType | Session;
}

// ============================================================================
// PRESETS & TEMPLATES
// ============================================================================

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: 'exercise' | 'block' | 'session' | 'plan';
  data: Exercise | SessionBlock | Session | TrainingPlan;
  icon: string;
  color: string;
  tags: string[];
}

export const BLOCK_TYPE_PRESETS: Array<{
  id: BlockType;
  name: string;
  color: string;
  icon: string;
  description: string;
}> = [
  {
    id: 'warmup',
    name: 'Aquecimento',
    color: 'bg-blue-100',
    icon: '🔥',
    description: 'Preparação física e ativação'
  },
  {
    id: 'main',
    name: 'Principal',
    color: 'bg-red-100',
    icon: '🏋️',
    description: 'Trabalho principal da sessão'
  },
  {
    id: 'accessory',
    name: 'Acessório',
    color: 'bg-green-100',
    icon: '💪',
    description: 'Trabalho complementar'
  },
  {
    id: 'skill',
    name: 'Técnica',
    color: 'bg-purple-100',
    icon: '🎯',
    description: 'Desenvolvimento técnico'
  },
  {
    id: 'cool-down',
    name: 'Volta à Calma',
    color: 'bg-teal-100',
    icon: '🧘',
    description: 'Recuperação ativa'
  },
  {
    id: 'assessment',
    name: 'Avaliação',
    color: 'bg-amber-100',
    icon: '📊',
    description: 'Testes e medições'
  },
  {
    id: 'education',
    name: 'Educação',
    color: 'bg-violet-100',
    icon: '📚',
    description: 'Ensino e feedback'
  },
];

// ============================================================================
// FORM & VALIDATION
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface SaveResult {
  success: boolean;
  id?: string;
  errors?: ValidationError[];
}
