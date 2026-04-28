import type { WorkoutBlock, ExerciseBlock, WorkoutPhase } from '../modules/workout-builder/types/block.types'
import type { WorkoutRuntime, WorkoutRuntimeExercise } from '../domain/runtime/types'
import type { ExerciseVersion } from '../domain/exercise/entities'

/**
 * flattenBlocks — Extracts all atomic ExerciseBlocks from compound blocks
 * (supersets/circuits) for metrics calculation purposes.
 */
export const flattenBlocks = (blocks: WorkoutBlock[]): ExerciseBlock[] => {
  return blocks.reduce<ExerciseBlock[]>((acc, block) => {
    if (block.type === 'exercise') {
      return [...acc, block]
    } else if (block.type === 'superset' || block.type === 'circuit') {
      return [...acc, ...block.exercises]
    }
    return acc
  }, [])
}

/**
 * buildRuntimeFromBuilder — Converts the visual Workout Builder state
 * into a strict WorkoutRuntime compatible with metricsEngine and snapshotEngine.
 * 
 * This is the critical bridge between the drag-and-drop UI (Slice 2)
 * and the domain-driven runtime (Slice 1).
 */
export const buildRuntimeFromBuilder = (
  builderState: { phases: WorkoutPhase[] },
  versionOverride?: (exerciseId: string) => ExerciseVersion | undefined
): WorkoutRuntime => {
  const runtimePhases: WorkoutRuntime['phases'] = []

  builderState.phases.forEach((phase, phaseIndex) => {
    const runtimeExercises: WorkoutRuntimeExercise[] = []

    const processExercise = (ex: ExerciseBlock) => {
      // Use existing version from block, or look up an override
      const version = versionOverride?.(ex.exerciseId) ?? ex.version
      if (!version) return

      runtimeExercises.push({
        instanceId: crypto.randomUUID(),
        exerciseId: ex.exerciseId,
        version,
        parameterValues: ex.parameters || {},
      })
    }

    phase.blocks.forEach(block => {
      if (block.type === 'exercise') {
        processExercise(block)
      } else if (block.type === 'superset') {
        block.exercises.forEach(processExercise)
      } else if (block.type === 'circuit') {
        for (let round = 1; round <= block.rounds; round++) {
          block.exercises.forEach(processExercise)
        }
      }
    })

    runtimePhases.push({
      id: phase.id,
      name: phase.name,
      order: phaseIndex,
      exercises: runtimeExercises,
    })
  })

  return {
    workoutId: crypto.randomUUID(),
    versionId: crypto.randomUUID(),
    phases: runtimePhases,
    metadata: {
      createdAt: new Date(),
      hasOverrides: false,
    },
  }
}

/**
 * countExercises — Returns the total count of atomic exercises including
 * those nested inside supersets and circuits.
 */
export const countExercises = (phases: WorkoutPhase[]): number => {
  return phases.reduce((sum, phase) => {
    return sum + phase.blocks.reduce((blockSum, block) => {
      if (block.type === 'exercise') return blockSum + 1
      return blockSum + block.exercises.length
    }, 0)
  }, 0)
}
