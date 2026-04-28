import type { ExerciseVersion } from '../exercise/entities'
import type { SemanticValue } from '../semantic/registry'

export interface WorkoutRuntimeExercise {
  instanceId: string
  exerciseId: string
  version: ExerciseVersion
  parameterValues: Record<string, SemanticValue>
}

export interface WorkoutRuntime {
  workoutId: string
  versionId: string
  phases: {
    id: string
    name: string
    order: number
    exercises: WorkoutRuntimeExercise[]
  }[]
  notes?: string
  metadata: {
    createdAt: Date
    hasOverrides: boolean
  }
}
