/**
 * ========================================
 * PERFORMTRACK DATA STORE V2.0
 * ========================================
 * Sistema centralizado de dados ULTRA-REALISTA que conecta:
 * - Design Studio (Templates)
 * - DataLab (Exercícios Custom)
 * - Report Builder (Relatórios)
 * - Live Command (Sessões)
 * - Calendar (Agendamento)
 * ========================================
 */

// ===== TYPES =====

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  variables: ExerciseVariable[];
  createdAt: string;
  usedInWorkouts: number;
  totalRecords: number;
  source: "datalab" | "default";
}

export interface ExerciseVariable {
  id: string;
  name: string;
  type: "number" | "text-short" | "text-long" | "select" | "multi-select" | "scale" | "date" | "duration" | "boolean" | "url";
  unit?: string;
  options?: string[];
  min?: number;
  max?: number;
  required?: boolean;
  placeholder?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: "strength" | "cardio" | "circuit" | "hybrid" | "recovery";
  duration: number;
  blocks: WorkoutBlock[];
  difficulty: "beginner" | "intermediate" | "advanced";
  lastUsed?: string;
  timesUsed: number;
  tags: string[];
  createdAt: string;
  createdBy?: string;
  settings?: {
    targetIntensity?: number;
  };
}

export interface WorkoutBlock {
  id: string;
  name: string;
  type: "warmup" | "strength" | "conditioning" | "cooldown" | "circuit";
  exercises: BlockExercise[];
  restBetweenExercises?: number;
  rounds?: number;
  notes?: string;
}

export interface BlockExercise {
  id: string;
  exerciseId: string; // Reference to Exercise
  sets?: number;
  reps?: number | string; // Can be "AMRAP", "12-15", etc.
  tempo?: string; // "3010"
  rest?: number; // seconds
  notes?: string;
}

export interface SessionRecord {
  id: string;
  sessionId: string;
  templateId: string;
  athleteId: string;
  athleteName: string;
  date: string;
  exerciseId: string;
  exerciseName: string;
  data: Record<string, any>; // Variáveis do exercício com valores
  createdAt: string;
}

export interface Athlete {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "active" | "inactive" | "paused";
  joinedDate: string;
  tags: string[];
}

// ===== MEGA BIBLIOTECA DE EXERCÍCIOS (LabCenter) =====

const LABCENTER_EXERCISES: Exercise[] = [
  // ===== FORÇA - MEMBROS INFERIORES =====
  {
    id: "ex-squat-back",
    name: "Back Squat (Agachamento Livre)",
    description: "Agachamento com barra nas costas - movimento fundamental de força",
    category: "Força - Membros Inferiores",
    variables: [
      { id: "v1", name: "Carga", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Repetições", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Profundidade", type: "select", options: ["Paralela", "Abaixo Paralela", "ATG (Ass To Grass)"], required: false },
      { id: "v5", name: "Tipo de Barra", type: "select", options: ["Olímpica", "Safety Bar", "Buffalo Bar"], required: false },
      { id: "v6", name: "Stance", type: "select", options: ["Shoulder Width", "Wide", "Narrow"], required: false },
      { id: "v7", name: "Observações Técnicas", type: "text-long", required: false },
      { id: "v8", name: "Vídeo", type: "url", required: false }
    ],
    createdAt: "2024-01-15",
    usedInWorkouts: 48,
    totalRecords: 1247,
    source: "datalab"
  },
  {
    id: "ex-squat-front",
    name: "Front Squat (Agachamento Frontal)",
    description: "Agachamento com barra na frente dos ombros",
    category: "Força - Membros Inferiores",
    variables: [
      { id: "v1", name: "Carga", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Repetições", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Grip Type", type: "select", options: ["Clean Grip", "Cross Arm", "Straps"], required: false },
      { id: "v5", name: "Notas", type: "text-long", required: false }
    ],
    createdAt: "2024-01-16",
    usedInWorkouts: 32,
    totalRecords: 856,
    source: "datalab"
  },
  {
    id: "ex-deadlift",
    name: "Deadlift (Levantamento Terra)",
    description: "Levantamento terra convencional - rei dos exercícios",
    category: "Força - Membros Inferiores",
    variables: [
      { id: "v1", name: "Peso", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Repetições", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Tipo de Pega", type: "select", options: ["Dupla Pronada", "Mista", "Hook Grip"], required: false },
      { id: "v5", name: "Stance", type: "select", options: ["Convencional", "Sumo"], required: false },
      { id: "v6", name: "Usou Straps", type: "boolean", required: false },
      { id: "v7", name: "Observações", type: "text-long", required: false }
    ],
    createdAt: "2024-01-12",
    usedInWorkouts: 52,
    totalRecords: 1489,
    source: "datalab"
  },
  {
    id: "ex-rdl",
    name: "Romanian Deadlift (RDL)",
    description: "Levantamento terra romeno focado em posteriores",
    category: "Força - Membros Inferiores",
    variables: [
      { id: "v1", name: "Carga", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Amplitude", type: "select", options: ["Abaixo do joelho", "Mid-shin", "Floor"], required: false }
    ],
    createdAt: "2024-01-18",
    usedInWorkouts: 38,
    totalRecords: 924,
    source: "datalab"
  },
  {
    id: "ex-lunges",
    name: "Lunges (Afundos)",
    description: "Afundos com halteres ou barra",
    category: "Força - Membros Inferiores",
    variables: [
      { id: "v1", name: "Carga Total", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps por Perna", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Variação", type: "select", options: ["Walking", "Reverse", "Bulgarian Split Squat", "Lateral"], required: false }
    ],
    createdAt: "2024-01-20",
    usedInWorkouts: 29,
    totalRecords: 672,
    source: "datalab"
  },

  // ===== FORÇA - PEITO & OMBROS =====
  {
    id: "ex-bench-press",
    name: "Bench Press (Supino Reto)",
    description: "Supino com barra reta - exercício fundamental de empurrar",
    category: "Força - Peito",
    variables: [
      { id: "v1", name: "Carga", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Grip Width", type: "select", options: ["Close", "Medium", "Wide"], required: false },
      { id: "v5", name: "Pausa no Peito", type: "boolean", required: false },
      { id: "v6", name: "Touch & Go", type: "boolean", required: false },
      { id: "v7", name: "Vídeo", type: "url", required: false }
    ],
    createdAt: "2024-01-10",
    usedInWorkouts: 62,
    totalRecords: 1678,
    source: "datalab"
  },
  {
    id: "ex-incline-bench",
    name: "Incline Bench Press (Supino Inclinado)",
    description: "Supino em banco inclinado",
    category: "Força - Peito",
    variables: [
      { id: "v1", name: "Carga", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Ângulo do Banco", type: "select", options: ["30°", "45°", "60°"], required: false }
    ],
    createdAt: "2024-01-11",
    usedInWorkouts: 41,
    totalRecords: 1023,
    source: "datalab"
  },
  {
    id: "ex-ohp",
    name: "Overhead Press (Desenvolvimento)",
    description: "Desenvolvimento militar com barra",
    category: "Força - Ombros",
    variables: [
      { id: "v1", name: "Peso", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Variação", type: "select", options: ["Strict Press", "Push Press", "Jerk"], required: false },
      { id: "v5", name: "Sentado/Em Pé", type: "select", options: ["Em Pé", "Sentado"], required: false }
    ],
    createdAt: "2024-01-13",
    usedInWorkouts: 36,
    totalRecords: 894,
    source: "datalab"
  },
  {
    id: "ex-dips",
    name: "Dips (Paralelas)",
    description: "Mergulhos em paralelas",
    category: "Força - Peito/Tríceps",
    variables: [
      { id: "v1", name: "Reps", type: "number", required: true },
      { id: "v2", name: "Peso Adicional", type: "number", unit: "kg", required: false },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Ênfase", type: "select", options: ["Peito", "Tríceps"], required: false }
    ],
    createdAt: "2024-01-14",
    usedInWorkouts: 28,
    totalRecords: 743,
    source: "datalab"
  },

  // ===== FORÇA - COSTAS & PUXAR =====
  {
    id: "ex-pullups",
    name: "Pull-ups (Barra Fixa)",
    description: "Barra fixa - movimento fundamental de puxar",
    category: "Força - Costas",
    variables: [
      { id: "v1", name: "Repetições", type: "number", required: true },
      { id: "v2", name: "Peso Adicional", type: "number", unit: "kg", required: false },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Tipo de Pega", type: "select", options: ["Pronada", "Supinada", "Neutra"], required: false },
      { id: "v5", name: "Grip Width", type: "select", options: ["Narrow", "Medium", "Wide"], required: false },
      { id: "v6", name: "Notas", type: "text-long", required: false }
    ],
    createdAt: "2024-01-08",
    usedInWorkouts: 58,
    totalRecords: 1456,
    source: "datalab"
  },
  {
    id: "ex-rows-barbell",
    name: "Barbell Row (Remada com Barra)",
    description: "Remada curvada com barra",
    category: "Força - Costas",
    variables: [
      { id: "v1", name: "Carga", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Ângulo do Tronco", type: "select", options: ["Pendlay (90°)", "45°", "Yates (30°)"], required: false },
      { id: "v5", name: "Grip", type: "select", options: ["Pronada", "Supinada"], required: false }
    ],
    createdAt: "2024-01-09",
    usedInWorkouts: 44,
    totalRecords: 1167,
    source: "datalab"
  },

  // ===== CARDIO & CONDICIONAMENTO =====
  {
    id: "ex-run-5k",
    name: "Corrida 5km",
    description: "Corrida de resistência aeróbica",
    category: "Cardio - Corrida",
    variables: [
      { id: "v1", name: "Tempo Total", type: "duration", required: true },
      { id: "v2", name: "Pace Médio", type: "text-short", unit: "min/km", required: false, placeholder: "5:30" },
      { id: "v3", name: "FC Média", type: "number", unit: "bpm", required: false },
      { id: "v4", name: "FC Máxima", type: "number", unit: "bpm", required: false },
      { id: "v5", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v6", name: "Terreno", type: "select", options: ["Pista", "Estrada", "Trail", "Indoor"], required: false },
      { id: "v7", name: "Condições", type: "select", options: ["Sol", "Chuva", "Vento", "Calor Intenso"], required: false }
    ],
    createdAt: "2024-01-20",
    usedInWorkouts: 52,
    totalRecords: 1834,
    source: "datalab"
  },
  {
    id: "ex-sprint-100m",
    name: "Sprint 100m",
    description: "Corrida de velocidade máxima",
    category: "Velocidade",
    variables: [
      { id: "v1", name: "Tempo", type: "duration", required: true },
      { id: "v2", name: "FC Pico", type: "number", unit: "bpm", required: false },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Terreno", type: "select", options: ["Pista", "Relva", "Terra", "Asfalto"], required: false },
      { id: "v5", name: "Saída", type: "select", options: ["Blocos", "Em Pé", "Lançada"], required: false }
    ],
    createdAt: "2024-01-21",
    usedInWorkouts: 18,
    totalRecords: 456,
    source: "datalab"
  },
  {
    id: "ex-assault-bike",
    name: "Assault Bike",
    description: "Bike de assalto para condicionamento",
    category: "Cardio - Bike",
    variables: [
      { id: "v1", name: "Duração", type: "duration", required: true },
      { id: "v2", name: "Calorias", type: "number", unit: "kcal", required: false },
      { id: "v3", name: "RPM Média", type: "number", required: false },
      { id: "v4", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v5", name: "Tipo", type: "select", options: ["Steady State", "Intervals", "EMOM"], required: false }
    ],
    createdAt: "2024-01-22",
    usedInWorkouts: 34,
    totalRecords: 892,
    source: "datalab"
  },
  {
    id: "ex-rowing",
    name: "Rowing (Remo Indoor)",
    description: "Remo ergômetro Concept2",
    category: "Cardio - Remo",
    variables: [
      { id: "v1", name: "Distância", type: "number", unit: "m", required: false },
      { id: "v2", name: "Tempo", type: "duration", required: true },
      { id: "v3", name: "Split Médio", type: "text-short", unit: "/500m", required: false, placeholder: "2:00" },
      { id: "v4", name: "Watts Médio", type: "number", unit: "W", required: false },
      { id: "v5", name: "SPM", type: "number", required: false },
      { id: "v6", name: "RPE", type: "scale", min: 1, max: 10, required: true }
    ],
    createdAt: "2024-01-23",
    usedInWorkouts: 29,
    totalRecords: 721,
    source: "datalab"
  },

  // ===== GINÁSTICA & BODYWEIGHT =====
  {
    id: "ex-burpees",
    name: "Burpees",
    description: "Movimento funcional completo",
    category: "Bodyweight - Híbrido",
    variables: [
      { id: "v1", name: "Repetições", type: "number", required: true },
      { id: "v2", name: "Tempo Total", type: "duration", required: false },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Variação", type: "select", options: ["Standard", "Com Salto", "Box Jump Over", "Muscle-up"], required: false }
    ],
    createdAt: "2024-01-24",
    usedInWorkouts: 41,
    totalRecords: 1034,
    source: "datalab"
  },
  {
    id: "ex-hspu",
    name: "HSPU (Handstand Push-ups)",
    description: "Flexões em pino",
    category: "Bodyweight - Ombros",
    variables: [
      { id: "v1", name: "Reps", type: "number", required: true },
      { id: "v2", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v3", name: "Variação", type: "select", options: ["Strict", "Kipping", "Wall Walks"], required: false },
      { id: "v4", name: "Profundidade", type: "select", options: ["Nariz ao chão", "Abmats", "Deficit"], required: false }
    ],
    createdAt: "2024-01-25",
    usedInWorkouts: 16,
    totalRecords: 387,
    source: "datalab"
  },

  // ===== PLYOMETRICS & EXPLOSÃO =====
  {
    id: "ex-box-jump",
    name: "Box Jumps",
    description: "Saltos na caixa",
    category: "Pliometria",
    variables: [
      { id: "v1", name: "Altura", type: "number", unit: "cm", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Tipo", type: "select", options: ["Step Down", "Jump Down", "Rebounding"], required: false }
    ],
    createdAt: "2024-01-26",
    usedInWorkouts: 23,
    totalRecords: 567,
    source: "datalab"
  },

  // ===== OLYMPIC LIFTING =====
  {
    id: "ex-clean",
    name: "Clean (Arranco de Potência)",
    description: "Levantamento olímpico",
    category: "Olympic Lifting",
    variables: [
      { id: "v1", name: "Peso", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Variação", type: "select", options: ["Power Clean", "Squat Clean", "Hang Clean"], required: false },
      { id: "v5", name: "Vídeo", type: "url", required: false }
    ],
    createdAt: "2024-01-27",
    usedInWorkouts: 19,
    totalRecords: 478,
    source: "datalab"
  },
  {
    id: "ex-snatch",
    name: "Snatch (Arranque)",
    description: "Levantamento olímpico explosivo",
    category: "Olympic Lifting",
    variables: [
      { id: "v1", name: "Peso", type: "number", unit: "kg", required: true },
      { id: "v2", name: "Reps", type: "number", required: true },
      { id: "v3", name: "RPE", type: "scale", min: 1, max: 10, required: true },
      { id: "v4", name: "Variação", type: "select", options: ["Power Snatch", "Squat Snatch", "Hang Snatch"], required: false }
    ],
    createdAt: "2024-01-28",
    usedInWorkouts: 14,
    totalRecords: 356,
    source: "datalab"
  }
];

// ===== MEGA BIBLIOTECA DE TEMPLATES (Design Studio) =====

const DESIGN_STUDIO_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "tpl-fullbody-a",
    name: "Full Body Strength A",
    description: "Treino completo de força para todo o corpo focado em movimentos compostos principais",
    category: "strength",
    duration: 75,
    blocks: [
      {
        id: "blk-1",
        name: "Aquecimento Dinâmico",
        type: "warmup",
        exercises: [
          { id: "be-1", exerciseId: "ex-run-5k", reps: "5 minutos leve", rest: 0 }
        ]
      },
      {
        id: "blk-2",
        name: "Bloco Principal - Lower Body",
        type: "strength",
        exercises: [
          { id: "be-2", exerciseId: "ex-squat-back", sets: 5, reps: "5", tempo: "3010", rest: 240, notes: "75-85% 1RM" },
          { id: "be-3", exerciseId: "ex-rdl", sets: 3, reps: "8-10", tempo: "3110", rest: 120 }
        ],
        restBetweenExercises: 120
      },
      {
        id: "blk-3",
        name: "Bloco Principal - Upper Body",
        type: "strength",
        exercises: [
          { id: "be-4", exerciseId: "ex-bench-press", sets: 5, reps: "5", tempo: "3010", rest: 180, notes: "75-85% 1RM" },
          { id: "be-5", exerciseId: "ex-rows-barbell", sets: 4, reps: "8", tempo: "2010", rest: 120 }
        ],
        restBetweenExercises: 120
      },
      {
        id: "blk-4",
        name: "Accessory Work",
        type: "strength",
        exercises: [
          { id: "be-6", exerciseId: "ex-pullups", sets: 3, reps: "AMRAP", rest: 90 },
          { id: "be-7", exerciseId: "ex-dips", sets: 3, reps: "AMRAP", rest: 90 }
        ],
        restBetweenExercises: 60
      }
    ],
    difficulty: "intermediate",
    lastUsed: "Há 2 dias",
    timesUsed: 87,
    tags: ["força", "full body", "compostos", "powerlifting"],
    createdAt: "2024-01-01",
    createdBy: "Coach Admin",
    settings: { targetIntensity: 8 }
  },
  {
    id: "tpl-fullbody-b",
    name: "Full Body Strength B",
    description: "Treino full body variante B com ênfase em front squat e overhead press",
    category: "strength",
    duration: 75,
    blocks: [
      {
        id: "blk-1",
        name: "Aquecimento",
        type: "warmup",
        exercises: [
          { id: "be-1", exerciseId: "ex-assault-bike", reps: "5 minutos", rest: 0 }
        ]
      },
      {
        id: "blk-2",
        name: "Força - Lower",
        type: "strength",
        exercises: [
          { id: "be-2", exerciseId: "ex-squat-front", sets: 5, reps: "5", tempo: "2010", rest: 240 },
          { id: "be-3", exerciseId: "ex-deadlift", sets: 5, reps: "3", tempo: "1010", rest: 240, notes: "80%+ 1RM" }
        ]
      },
      {
        id: "blk-3",
        name: "Força - Upper",
        type: "strength",
        exercises: [
          { id: "be-4", exerciseId: "ex-ohp", sets: 5, reps: "5", tempo: "2010", rest: 180 },
          { id: "be-5", exerciseId: "ex-pullups", sets: 4, reps: "8", rest: 120, notes: "Weighted" }
        ]
      }
    ],
    difficulty: "advanced",
    lastUsed: "Há 5 dias",
    timesUsed: 64,
    tags: ["força", "full body", "olympic prep"],
    createdAt: "2024-01-03",
    createdBy: "Coach Admin",
    settings: { targetIntensity: 8 }
  },
  {
    id: "tpl-upper-push",
    name: "Upper Push Day",
    description: "Dia focado em empurrar - peito, ombros e tríceps",
    category: "strength",
    duration: 60,
    blocks: [
      {
        id: "blk-1",
        name: "Força Principal",
        type: "strength",
        exercises: [
          { id: "be-1", exerciseId: "ex-bench-press", sets: 5, reps: "5", rest: 240 },
          { id: "be-2", exerciseId: "ex-incline-bench", sets: 4, reps: "8", rest: 180 }
        ]
      },
      {
        id: "blk-2",
        name: "Ombros",
        type: "strength",
        exercises: [
          { id: "be-3", exerciseId: "ex-ohp", sets: 4, reps: "6", rest: 180 }
        ]
      },
      {
        id: "blk-3",
        name: "Volume Work",
        type: "strength",
        exercises: [
          { id: "be-4", exerciseId: "ex-dips", sets: 3, reps: "12-15", rest: 90 }
        ]
      }
    ],
    difficulty: "intermediate",
    lastUsed: "Ontem",
    timesUsed: 52,
    tags: ["empurrar", "peito", "ombros"],
    createdAt: "2024-01-05",
    createdBy: "Coach Admin",
    settings: { targetIntensity: 7 }
  },
  {
    id: "tpl-lower-squat",
    name: "Lower Body - Squat Focus",
    description: "Dia focado em agachamento e padrões de knee dominant",
    category: "strength",
    duration: 60,
    blocks: [
      {
        id: "blk-1",
        name: "Força Principal",
        type: "strength",
        exercises: [
          { id: "be-1", exerciseId: "ex-squat-back", sets: 5, reps: "5", rest: 300, notes: "Build to heavy 5" }
        ]
      },
      {
        id: "blk-2",
        name: "Volume Work",
        type: "strength",
        exercises: [
          { id: "be-2", exerciseId: "ex-squat-front", sets: 4, reps: "8", rest: 180 },
          { id: "be-3", exerciseId: "ex-lunges", sets: 3, reps: "10/leg", rest: 120 }
        ]
      }
    ],
    difficulty: "intermediate",
    lastUsed: "Há 3 dias",
    timesUsed: 73,
    tags: ["pernas", "agachamento", "quadríceps"],
    createdAt: "2024-01-07",
    createdBy: "Coach Admin",
    settings: { targetIntensity: 8 }
  },
  {
    id: "tpl-metcon-1",
    name: "HIIT Metcon Circuit - Death by Burpees",
    description: "Circuito metabólico de alta intensidade com burpees e cardio",
    category: "circuit",
    duration: 25,
    blocks: [
      {
        id: "blk-1",
        name: "EMOM 20min",
        type: "circuit",
        exercises: [
          { id: "be-1", exerciseId: "ex-burpees", reps: "10" },
          { id: "be-2", exerciseId: "ex-assault-bike", reps: "15 cal" },
          { id: "be-3", exerciseId: "ex-box-jump", reps: "8" }
        ],
        rounds: 20,
        notes: "Rotação: 1min burpees, 1min bike, 1min box jumps, repeat"
      }
    ],
    difficulty: "advanced",
    lastUsed: "Há 1 dia",
    timesUsed: 94,
    tags: ["hiit", "metcon", "cardio", "burpees"],
    createdAt: "2024-01-10",
    createdBy: "Coach Admin",
    settings: { targetIntensity: 9 }
  },
  {
    id: "tpl-olympic",
    name: "Olympic Lifting Session",
    description: "Sessão focada em levantamentos olímpicos",
    category: "strength",
    duration: 90,
    blocks: [
      {
        id: "blk-1",
        name: "Aquecimento Específico",
        type: "warmup",
        exercises: [
          { id: "be-1", exerciseId: "ex-rowing", reps: "500m", rest: 120 }
        ]
      },
      {
        id: "blk-2",
        name: "Skill Work",
        type: "strength",
        exercises: [
          { id: "be-2", exerciseId: "ex-snatch", sets: 8, reps: "2", rest: 180, notes: "Build to heavy double" },
          { id: "be-3", exerciseId: "ex-clean", sets: 6, reps: "3", rest: 180, notes: "Build to heavy triple" }
        ]
      },
      {
        id: "blk-3",
        name: "Strength Work",
        type: "strength",
        exercises: [
          { id: "be-4", exerciseId: "ex-squat-front", sets: 4, reps: "5", rest: 180 }
        ]
      }
    ],
    difficulty: "advanced",
    lastUsed: "Há 4 dias",
    timesUsed: 31,
    tags: ["olympic", "snatch", "clean", "explosão"],
    createdAt: "2024-01-12",
    createdBy: "Coach Elite",
    settings: { targetIntensity: 8 }
  },
  {
    id: "tpl-cardio-intervals",
    name: "Cardio Intervals - 5K Prep",
    description: "Treino intervalado para preparação de 5km",
    category: "cardio",
    duration: 45,
    blocks: [
      {
        id: "blk-1",
        name: "Warm-up",
        type: "warmup",
        exercises: [
          { id: "be-1", exerciseId: "ex-run-5k", reps: "10min easy", rest: 0 }
        ]
      },
      {
        id: "blk-2",
        name: "Intervals",
        type: "conditioning",
        exercises: [
          { id: "be-2", exerciseId: "ex-sprint-100m", reps: "400m", rest: 120, notes: "Repeat 8x" }
        ],
        rounds: 8
      },
      {
        id: "blk-3",
        name: "Cool-down",
        type: "cooldown",
        exercises: [
          { id: "be-3", exerciseId: "ex-run-5k", reps: "5min easy", rest: 0 }
        ]
      }
    ],
    difficulty: "intermediate",
    lastUsed: "Há 2 dias",
    timesUsed: 56,
    tags: ["cardio", "corrida", "intervals", "5k"],
    createdAt: "2024-01-15",
    createdBy: "Coach Cardio",
    settings: { targetIntensity: 7 }
  },
  {
    id: "tpl-bodyweight",
    name: "Bodyweight Gymnastics",
    description: "Treino avançado de ginástica corporal",
    category: "hybrid",
    duration: 50,
    blocks: [
      {
        id: "blk-1",
        name: "Skill Practice",
        type: "strength",
        exercises: [
          { id: "be-1", exerciseId: "ex-hspu", sets: 5, reps: "AMRAP", rest: 120, notes: "Max strict reps" }
        ]
      },
      {
        id: "blk-2",
        name: "Strength Circuit",
        type: "circuit",
        exercises: [
          { id: "be-2", exerciseId: "ex-pullups", reps: "10" },
          { id: "be-3", exerciseId: "ex-dips", reps: "15" },
          { id: "be-4", exerciseId: "ex-hspu", reps: "5" }
        ],
        rounds: 5,
        restBetweenExercises: 30
      }
    ],
    difficulty: "advanced",
    lastUsed: "Há 6 dias",
    timesUsed: 38,
    tags: ["bodyweight", "ginástica", "pull-ups"],
    createdAt: "2024-01-18",
    createdBy: "Coach Gymnastics",
    settings: { targetIntensity: 8 }
  },
  {
    id: "tpl-recovery",
    name: "Active Recovery Session",
    description: "Sessão leve de recuperação ativa",
    category: "recovery",
    duration: 40,
    blocks: [
      {
        id: "blk-1",
        name: "Easy Cardio",
        type: "warmup",
        exercises: [
          { id: "be-1", exerciseId: "ex-assault-bike", reps: "15min", rest: 0, notes: "Conversational pace" }
        ]
      },
      {
        id: "blk-2",
        name: "Mobility Work",
        type: "cooldown",
        exercises: [
          { id: "be-2", exerciseId: "ex-rowing", reps: "10min easy", rest: 0 }
        ]
      }
    ],
    difficulty: "beginner",
    lastUsed: "Ontem",
    timesUsed: 112,
    tags: ["recuperação", "mobilidade", "cardio leve"],
    createdAt: "2024-01-20",
    createdBy: "Coach Recovery",
    settings: { targetIntensity: 3 }
  },
  {
    id: "tpl-crossfit-wod",
    name: "CrossFit WOD - Fran Variation",
    description: "WOD clássico adaptado: Thrusters + Pull-ups",
    category: "circuit",
    duration: 15,
    blocks: [
      {
        id: "blk-1",
        name: "21-15-9 For Time",
        type: "circuit",
        exercises: [
          { id: "be-1", exerciseId: "ex-squat-front", reps: "21-15-9", notes: "Thrusters 43kg" },
          { id: "be-2", exerciseId: "ex-pullups", reps: "21-15-9" }
        ],
        notes: "Complete 21-15-9 reps o mais rápido possível"
      }
    ],
    difficulty: "advanced",
    lastUsed: "Há 8 dias",
    timesUsed: 47,
    tags: ["crossfit", "wod", "benchmark", "fran"],
    createdAt: "2024-01-22",
    createdBy: "Coach CF",
    settings: { targetIntensity: 10 }
  }
];

// ===== ATLETAS REALISTAS =====

const MOCK_ATHLETES: Athlete[] = [
  {
    id: "ath-1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+351 912 345 678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    status: "active",
    joinedDate: "2024-01-01",
    tags: ["força", "intermediário", "powerlifting"]
  },
  {
    id: "ath-2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+351 918 234 567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    status: "active",
    joinedDate: "2024-01-15",
    tags: ["hipertrofia", "avançado", "bodybuilding"]
  },
  {
    id: "ath-3",
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    phone: "+351 925 876 432",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    status: "active",
    joinedDate: "2024-02-01",
    tags: ["cardio", "iniciante", "corrida"]
  },
  {
    id: "ath-4",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    status: "active",
    joinedDate: "2024-02-10",
    tags: ["crossfit", "avançado", "competição"]
  },
  {
    id: "ath-5",
    name: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    status: "active",
    joinedDate: "2024-03-01",
    tags: ["olympic lifting", "intermediário"]
  },
  {
    id: "ath-6",
    name: "Sofia Alves",
    email: "sofia.alves@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    status: "active",
    joinedDate: "2024-03-15",
    tags: ["ginástica", "avançado", "bodyweight"]
  },
  {
    id: "ath-7",
    name: "Miguel Ferreira",
    email: "miguel.ferreira@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel",
    status: "paused",
    joinedDate: "2024-01-20",
    tags: ["força", "intermediário", "lesionado"]
  },
  {
    id: "ath-8",
    name: "Beatriz Lima",
    email: "beatriz.lima@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
    status: "active",
    joinedDate: "2024-04-01",
    tags: ["hipertrofia", "iniciante"]
  },
  {
    id: "ath-9",
    name: "Ricardo Sousa",
    email: "ricardo.sousa@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo",
    status: "active",
    joinedDate: "2024-04-10",
    tags: ["crossfit", "intermediário"]
  },
  {
    id: "ath-10",
    name: "Inês Martins",
    email: "ines.martins@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ines",
    status: "active",
    joinedDate: "2024-05-01",
    tags: ["cardio", "avançado", "maratona"]
  }
];

// ===== GERAÇÃO DE DADOS REALISTAS =====

// Mock session records (últimos 6 meses de dados)
const MOCK_SESSION_RECORDS: SessionRecord[] = [];
const months = ["2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12", "2025-01"];
let recordId = 1;

MOCK_ATHLETES.forEach(athlete => {
  months.forEach((month, monthIndex) => {
    // Simular 8-12 sessões por mês
    const sessionsInMonth = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < sessionsInMonth; i++) {
      const day = 1 + Math.floor(Math.random() * 28);
      const date = `${month}-${day.toString().padStart(2, '0')}`;
      
      // Back Squat progression
      MOCK_SESSION_RECORDS.push({
        id: `rec-${recordId++}`,
        sessionId: `sess-${recordId}`,
        templateId: "tpl-fullbody-a",
        athleteId: athlete.id,
        athleteName: athlete.name,
        date: date,
        exerciseId: "ex-squat-back",
        exerciseName: "Back Squat",
        data: {
          Carga: 80 + monthIndex * 5 + Math.floor(Math.random() * 10),
          Repetições: 5,
          RPE: 7 + Math.floor(Math.random() * 3),
          Profundidade: ["Paralela", "Abaixo Paralela"][Math.floor(Math.random() * 2)],
          Stance: "Shoulder Width"
        },
        createdAt: `${date}T09:00:00Z`
      });
      
      // Bench Press progression
      MOCK_SESSION_RECORDS.push({
        id: `rec-${recordId++}`,
        sessionId: `sess-${recordId}`,
        templateId: "tpl-fullbody-a",
        athleteId: athlete.id,
        athleteName: athlete.name,
        date: date,
        exerciseId: "ex-bench-press",
        exerciseName: "Bench Press",
        data: {
          Carga: 60 + monthIndex * 3 + Math.floor(Math.random() * 8),
          Reps: 5,
          RPE: 7 + Math.floor(Math.random() * 2),
          "Grip Width": "Medium"
        },
        createdAt: `${date}T09:20:00Z`
      });

      // Deadlift progression
      if (i % 2 === 0) {
        MOCK_SESSION_RECORDS.push({
          id: `rec-${recordId++}`,
          sessionId: `sess-${recordId}`,
          templateId: "tpl-fullbody-b",
          athleteId: athlete.id,
          athleteName: athlete.name,
          date: date,
          exerciseId: "ex-deadlift",
          exerciseName: "Deadlift",
          data: {
            Peso: 100 + monthIndex * 7 + Math.floor(Math.random() * 15),
            Repetições: 3,
            RPE: 8 + Math.floor(Math.random() * 2),
            "Tipo de Pega": "Dupla Pronada",
            Stance: "Convencional"
          },
          createdAt: `${date}T09:40:00Z`
        });
      }
    }
  });
});

// ===== DATA STORE CLASS =====

class DataStore {
  private exercises: Exercise[] = [...LABCENTER_EXERCISES];
  private templates: WorkoutTemplate[] = [...DESIGN_STUDIO_TEMPLATES];
  private athletes: Athlete[] = [...MOCK_ATHLETES];
  private sessionRecords: SessionRecord[] = [...MOCK_SESSION_RECORDS];

  // ===== EXERCISES (LabCenter) =====
  
  getExercises(): Exercise[] {
    return this.exercises;
  }

  getExercise(id: string): Exercise | undefined {
    return this.exercises.find(ex => ex.id === id);
  }

  addExercise(exercise: Exercise): void {
    this.exercises.push(exercise);
  }

  updateExercise(id: string, updates: Partial<Exercise>): void {
    const index = this.exercises.findIndex(ex => ex.id === id);
    if (index !== -1) {
      this.exercises[index] = { ...this.exercises[index], ...updates };
    }
  }

  deleteExercise(id: string): void {
    this.exercises = this.exercises.filter(ex => ex.id !== id);
  }

  // ===== TEMPLATES (Design Studio) =====
  
  getTemplates(): WorkoutTemplate[] {
    return this.templates;
  }

  getTemplate(id: string): WorkoutTemplate | undefined {
    return this.templates.find(tpl => tpl.id === id);
  }

  addTemplate(template: WorkoutTemplate): void {
    this.templates.push(template);
  }

  updateTemplate(id: string, updates: Partial<WorkoutTemplate>): void {
    const index = this.templates.findIndex(tpl => tpl.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
    }
  }

  deleteTemplate(id: string): void {
    this.templates = this.templates.filter(tpl => tpl.id !== id);
  }

  // ===== ATHLETES =====
  
  getAthletes(): Athlete[] {
    return this.athletes;
  }

  getAthlete(id: string): Athlete | undefined {
    return this.athletes.find(ath => ath.id === id);
  }

  // ===== SESSION RECORDS =====
  
  getSessionRecords(filters?: {
    athleteId?: string;
    exerciseId?: string;
    startDate?: string;
    endDate?: string;
  }): SessionRecord[] {
    let records = this.sessionRecords;

    if (filters?.athleteId) {
      records = records.filter(r => r.athleteId === filters.athleteId);
    }

    if (filters?.exerciseId) {
      records = records.filter(r => r.exerciseId === filters.exerciseId);
    }

    if (filters?.startDate) {
      records = records.filter(r => r.date >= filters.startDate!);
    }

    if (filters?.endDate) {
      records = records.filter(r => r.date <= filters.endDate!);
    }

    return records;
  }

  addSessionRecord(record: SessionRecord): void {
    this.sessionRecords.push(record);
  }

  // ===== CALENDAR DATA (Para integração com Calendar) =====
  
  get workouts() {
    // Mapear templates para formato de workout para calendário
    return this.templates.map(tpl => ({
      id: tpl.id,
      name: tpl.name,
      description: tpl.description,
      type: tpl.category,
      estimatedDuration: tpl.duration,
      intensity: tpl.settings?.targetIntensity || 7,
      exercises: tpl.blocks.flatMap(block => 
        block.exercises.map(ex => ({
          id: ex.id,
          name: this.getExercise(ex.exerciseId)?.name || 'Exercício',
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          notes: ex.notes
        }))
      )
    }));
  }

  get plans() {
    // Planos realistas para o calendário
    return [
      {
        id: 'plan_beginner_8wk',
        name: 'Plano Iniciante - 8 Semanas',
        description: 'Programa completo para iniciantes com 3 treinos semanais',
        duration: 8, // ✅ semanas (não dias)
        frequency: 3,
        sessionsPerWeek: 3, // ✅ Alias
        totalSessions: 24, // ✅ 8 semanas * 3 sessões
        category: 'strength',
        difficulty: 'beginner' as const,
        workspaceId: 'workspace-demo',
        workouts: [
          { id: 'pw1', workoutId: 'tpl-fullbody-a', workoutName: 'Full Body A', dayNumber: 1, estimatedDuration: 60 },
          { id: 'pw2', workoutId: 'tpl-cardio-intervals', workoutName: 'Cardio Intervals', dayNumber: 2, estimatedDuration: 45 },
          { id: 'pw3', workoutId: 'tpl-fullbody-b', workoutName: 'Full Body B', dayNumber: 3, estimatedDuration: 60 }
        ]
      },
      {
        id: 'plan_strength_12wk',
        name: 'Plano Força - 12 Semanas',
        description: 'Programa de força progressivo com 4 treinos semanais',
        duration: 12, // ✅ semanas
        frequency: 4,
        sessionsPerWeek: 4, // ✅ Alias
        totalSessions: 48, // ✅ 12 semanas * 4 sessões
        category: 'strength',
        difficulty: 'intermediate' as const,
        workspaceId: 'workspace-demo',
        workouts: [
          { id: 'pw4', workoutId: 'tpl-lower-squat', workoutName: 'Lower Squat', dayNumber: 1, estimatedDuration: 60 },
          { id: 'pw5', workoutId: 'tpl-upper-push', workoutName: 'Upper Push', dayNumber: 2, estimatedDuration: 60 },
          { id: 'pw6', workoutId: 'tpl-fullbody-b', workoutName: 'Full Body B (DL)', dayNumber: 3, estimatedDuration: 75 },
          { id: 'pw7', workoutId: 'tpl-olympic', workoutName: 'Olympic Lifting', dayNumber: 4, estimatedDuration: 90 }
        ]
      },
      {
        id: 'plan_crossfit_6wk',
        name: 'Plano CrossFit - 6 Semanas',
        description: 'Programa CrossFit intensivo com 5 treinos semanais',
        duration: 6, // ✅ semanas
        frequency: 5,
        sessionsPerWeek: 5, // ✅ Alias
        totalSessions: 30, // ✅ 6 semanas * 5 sessões
        category: 'conditioning',
        difficulty: 'advanced' as const,
        workspaceId: 'workspace-demo',
        workouts: [
          { id: 'pw8', workoutId: 'tpl-fullbody-a', workoutName: 'Strength A', dayNumber: 1, estimatedDuration: 75 },
          { id: 'pw9', workoutId: 'tpl-metcon-1', workoutName: 'Metcon', dayNumber: 2, estimatedDuration: 25 },
          { id: 'pw10', workoutId: 'tpl-olympic', workoutName: 'Olympic', dayNumber: 3, estimatedDuration: 90 },
          { id: 'pw11', workoutId: 'tpl-crossfit-wod', workoutName: 'WOD', dayNumber: 4, estimatedDuration: 15 },
          { id: 'pw12', workoutId: 'tpl-bodyweight', workoutName: 'Gymnastics', dayNumber: 5, estimatedDuration: 50 }
        ]
      },
      {
        id: 'plan_cardio_10wk',
        name: 'Plano Cardio - 10 Semanas (5K)',
        description: 'Programa de corrida para preparar 5km',
        duration: 10, // ✅ semanas
        frequency: 4,
        sessionsPerWeek: 4, // ✅ Alias
        totalSessions: 40, // ✅ 10 semanas * 4 sessões
        category: 'conditioning',
        difficulty: 'beginner' as const,
        workspaceId: 'workspace-demo',
        workouts: [
          { id: 'pw13', workoutId: 'tpl-cardio-intervals', workoutName: 'Intervals', dayNumber: 1, estimatedDuration: 45 },
          { id: 'pw14', workoutId: 'tpl-recovery', workoutName: 'Easy Run', dayNumber: 2, estimatedDuration: 40 },
          { id: 'pw15', workoutId: 'tpl-cardio-intervals', workoutName: 'Tempo Run', dayNumber: 3, estimatedDuration: 45 },
          { id: 'pw16', workoutId: 'tpl-recovery', workoutName: 'Recovery', dayNumber: 4, estimatedDuration: 40 }
        ]
      },
      {
        id: 'plan_hybrid_16wk',
        name: 'Plano Híbrido - 16 Semanas',
        description: 'Força + Condicionamento balanceado',
        duration: 16, // ✅ semanas
        frequency: 5,
        sessionsPerWeek: 5, // ✅ Alias
        totalSessions: 80, // ✅ 16 semanas * 5 sessões
        category: 'hypertrophy',
        difficulty: 'intermediate' as const,
        workspaceId: 'workspace-demo',
        workouts: [
          { id: 'pw17', workoutId: 'tpl-lower-squat', workoutName: 'Lower A', dayNumber: 1, estimatedDuration: 60 },
          { id: 'pw18', workoutId: 'tpl-upper-push', workoutName: 'Upper Push', dayNumber: 2, estimatedDuration: 60 },
          { id: 'pw19', workoutId: 'tpl-metcon-1', workoutName: 'Metcon', dayNumber: 3, estimatedDuration: 25 },
          { id: 'pw20', workoutId: 'tpl-fullbody-b', workoutName: 'Full Body', dayNumber: 4, estimatedDuration: 75 },
          { id: 'pw21', workoutId: 'tpl-cardio-intervals', workoutName: 'Cardio', dayNumber: 5, estimatedDuration: 45 }
        ]
      }
    ];
  }

  get groups() {
    // Grupos realistas de atletas
    return [
      {
        id: 'grp_powerlifting',
        name: 'Powerlifting Team',
        athleteIds: ['ath-1', 'ath-2', 'ath-7'],
        color: '#ef4444'
      },
      {
        id: 'grp_crossfit',
        name: 'CrossFit Squad',
        athleteIds: ['ath-4', 'ath-9'],
        color: '#8b5cf6'
      },
      {
        id: 'grp_runners',
        name: 'Runners Club',
        athleteIds: ['ath-3', 'ath-10'],
        color: '#10b981'
      },
      {
        id: 'grp_beginners',
        name: 'Iniciantes',
        athleteIds: ['ath-3', 'ath-8'],
        color: '#f59e0b'
      },
      {
        id: 'grp_advanced',
        name: 'Avançados',
        athleteIds: ['ath-2', 'ath-4', 'ath-6', 'ath-10'],
        color: '#0ea5e9'
      },
      {
        id: 'grp_olympic',
        name: 'Olympic Lifting',
        athleteIds: ['ath-5', 'ath-6'],
        color: '#ec4899'
      }
    ];
  }

  // ===== STATS & ANALYTICS =====

  getStats() {
    return {
      totalExercises: this.exercises.length,
      totalTemplates: this.templates.length,
      totalAthletes: this.athletes.length,
      totalRecords: this.sessionRecords.length,
      activeAthletes: this.athletes.filter(a => a.status === 'active').length,
      mostUsedTemplate: this.templates.sort((a, b) => b.timesUsed - a.timesUsed)[0],
      mostUsedExercise: this.exercises.sort((a, b) => b.totalRecords - a.totalRecords)[0]
    };
  }
}

// ===== SINGLETON INSTANCE =====

export const dataStore = new DataStore();

// ===== EXPORT CONVENIENTE =====

export const labCenter = {
  exercises: dataStore.getExercises(),
  categories: [...new Set(dataStore.getExercises().map(e => e.category))]
};

export const designStudio = {
  templates: dataStore.getTemplates(),
  categories: ['strength', 'cardio', 'circuit', 'hybrid', 'recovery'] as const
};