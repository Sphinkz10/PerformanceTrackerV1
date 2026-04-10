export interface LunaLibraryItem {
  id: string;
  name: string;
  category: string;
  type: string;
  color: 'teal' | 'gold' | 'orange';
}

export interface LunaExerciseConfig {
  sets: number;
  reps: string;
  weight?: string;
  rpe?: number;
  rest?: string;
  notes?: string;
  cadence?: string;
}

export interface LunaWorkspaceExercise {
  id: string;
  libraryId: string;
  name: string;
  config: LunaExerciseConfig;
}

export interface LunaBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'finisher';
  duration: string;
  meta: string;
  exercises: LunaWorkspaceExercise[];
}

export interface LunaWorkout {
  id: string;
  title: string;
  description: string;
  blocks: LunaBlock[];
}

export const MOCK_LIBRARY: LunaLibraryItem[] = [
  { id: 'lib-1', name: 'Bench Press', category: 'Peito · Compostos', type: 'compound', color: 'teal' },
  { id: 'lib-2', name: 'Deadlift', category: 'Costas · Compostos', type: 'compound', color: 'teal' },
  { id: 'lib-3', name: 'Squat (Back)', category: 'Pernas · Compostos', type: 'compound', color: 'gold' },
  { id: 'lib-4', name: 'Pull-ups', category: 'Costas · Body', type: 'bodyweight', color: 'orange' },
  { id: 'lib-5', name: 'Romanian DL', category: 'Posterior · Iso', type: 'isolation', color: 'teal' },
  { id: 'lib-6', name: 'Plank Variations', category: 'Core · Iso', type: 'isolation', color: 'gold' },
];

export const MOCK_WORKSPACE: LunaWorkout = {
  id: 'wk-1',
  title: 'Força Avançada - Tronco Superior',
  description: 'Treino focado em compostos pesados com volume moderado e intensidade alta',
  blocks: [
    {
      id: 'blk-1',
      name: 'Aquecimento',
      type: 'warmup',
      duration: '8 min',
      meta: '2 exercícios · 8 min',
      exercises: [
        {
          id: 'ex-1',
          libraryId: 'lib-none-1',
          name: 'Mobilidade Dinâmica',
          config: { sets: 3, reps: 'rondas', rest: '5 min' }
        },
        {
          id: 'ex-2',
          libraryId: 'lib-none-2',
          name: 'Activation x 3',
          config: { sets: 3, reps: '10' }
        }
      ]
    },
    {
      id: 'blk-2',
      name: 'Bloco Principal',
      type: 'main',
      duration: '42 min',
      meta: '3 exercícios · 42 min · Compostos pesados',
      exercises: [
        {
          id: 'ex-3',
          libraryId: 'lib-1',
          name: 'Bench Press',
          config: { sets: 5, reps: '5', weight: '85kg', rpe: 8 }
        },
        {
          id: 'ex-4',
          libraryId: 'lib-3',
          name: 'Squat (Back)',
          config: { sets: 4, reps: '6', weight: '110kg', rpe: 7 }
        },
        {
          id: 'ex-5',
          libraryId: 'lib-2',
          name: 'Deadlift',
          config: { sets: 3, reps: '5', weight: '140kg', rpe: 8 }
        }
      ]
    },
    {
      id: 'blk-3',
      name: 'Finisher',
      type: 'finisher',
      duration: '10 min',
      meta: '1 exercício · 10 min',
      exercises: [
        {
          id: 'ex-6',
          libraryId: 'lib-6',
          name: 'Plank Variations (Tabata)',
          config: { sets: 8, reps: 'rondas', notes: '20s work · 10s rest' }
        }
      ]
    }
  ]
};
