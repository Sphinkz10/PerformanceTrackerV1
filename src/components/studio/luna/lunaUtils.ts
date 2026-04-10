import { LunaWorkout } from './types';
import { MOCK_LIBRARY } from './types';

export const calculateTotalVolume = (workout: LunaWorkout | null): number => {
  if (!workout || !workout.blocks) return 0;

  let totalVolume = 0;

  workout.blocks.forEach((block) => {
    if (!block.exercises) return;

    block.exercises.forEach((ex) => {
      const config = ex.config;
      if (!config) return;

      const sets = Number(config.sets) || 0;

      // Extract numeric reps
      let reps = 0;
      if (typeof config.reps === 'string') {
        const repMatch = config.reps.match(/\d+/);
        if (repMatch) {
          reps = Number(repMatch[0]);
        }
      } else if (typeof config.reps === 'number') {
        reps = config.reps;
      }

      // Extract numeric weight
      let weight = 0;
      if (typeof config.weight === 'string') {
        const weightMatch = config.weight.match(/[\d.]+/);
        if (weightMatch) {
          weight = Number(weightMatch[0]);
        }
      } else if (typeof config.weight === 'number') {
        weight = config.weight;
      }

      totalVolume += sets * reps * weight;
    });
  });

  return totalVolume;
};

export const calculateIntensity = (workout: LunaWorkout | null): string => {
  if (!workout || !workout.blocks) return 'N/A';

  let totalRPE = 0;
  let count = 0;

  workout.blocks.forEach((block) => {
    if (!block.exercises) return;

    block.exercises.forEach((ex) => {
      const config = ex.config;
      if (config && config.rpe !== undefined && config.rpe > 0) {
        totalRPE += config.rpe;
        count++;
      }
    });
  });

  if (count === 0) return 'N/A';

  const avgRPE = totalRPE / count;

  if (avgRPE > 8) return 'Alta';
  if (avgRPE >= 6) return 'Moderada';
  return 'Baixa';
};

export const calculateMuscleDistribution = (workout: LunaWorkout | null): { name: string; percentage: number }[] => {
  if (!workout || !workout.blocks) return [];

  const muscleCounts: Record<string, number> = {};
  let totalExercises = 0;

  workout.blocks.forEach((block) => {
    if (!block.exercises) return;

    block.exercises.forEach((ex) => {
      totalExercises++;
      let muscle = 'Outros';

      const libItem = MOCK_LIBRARY.find((lib) => lib.id === ex.libraryId);

      if (libItem && libItem.category) {
        // Splitting e.g. "Peito · Compostos"
        const parts = libItem.category.split('·');
        if (parts.length > 0) {
          muscle = parts[0].trim();
        }
      } else {
        // Fallback by name
        const nameLower = ex.name.toLowerCase();
        if (nameLower.includes('bench') || nameLower.includes('peito')) {
          muscle = 'Peito';
        } else if (nameLower.includes('squat') || nameLower.includes('perna') || nameLower.includes('leg') || nameLower.includes('deadlift')) {
          muscle = 'Pernas';
        } else if (nameLower.includes('pull') || nameLower.includes('row') || nameLower.includes('costas')) {
          muscle = 'Costas';
        } else if (nameLower.includes('plank') || nameLower.includes('core') || nameLower.includes('abs')) {
          muscle = 'Core';
        }
      }

      muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
    });
  });

  if (totalExercises === 0) return [];

  const distribution = Object.entries(muscleCounts).map(([name, count]) => {
    return {
      name,
      percentage: Math.round((count / totalExercises) * 100),
    };
  });

  // Sort by percentage descending
  distribution.sort((a, b) => b.percentage - a.percentage);

  return distribution;
};

import { Workout } from '@/hooks/useWorkouts';

export const mapLunaWorkoutToPayload = (workout: LunaWorkout | null): Partial<Workout> => {
  if (!workout) return {};

  return {
    title: workout.title || 'Untitled Workout',
    description: workout.description || '',
    blocks: workout.blocks.map(block => ({
      id: block.id,
      name: block.name,
      type: block.type,
      exercises: block.exercises.map(ex => ({
        id: ex.id,
        libraryId: ex.libraryId,
        name: ex.name,
        sets: ex.config?.sets || 0,
        reps: ex.config?.reps || '',
        weight: ex.config?.weight || '',
        rest: ex.config?.rest || '',
        notes: ex.config?.notes || ''
      }))
    })) as any // Casting since the exact structure of blocks in Workout type might vary or be JSON
  };
};
