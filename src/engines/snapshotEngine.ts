import type { WorkoutRuntime, WorkoutRuntimeExercise } from '../domain/runtime/types'
import type { ExerciseVersion } from '../domain/exercise/entities'

interface WorkoutSnapshot {
  base: { workoutId: string; versionId: string }
  overrides: {
    exercises?: Record<string, Partial<WorkoutRuntimeExercise>>
    phases?: Partial<WorkoutRuntime['phases'][0]>[]
    notes?: string
  }
}

export function resolveWorkoutSnapshot(
  snapshot: WorkoutSnapshot,
  sourceWorkout: WorkoutRuntime
): WorkoutRuntime {
  const { overrides } = snapshot

  const resolvedPhases = sourceWorkout.phases.map(phase => {
    const phaseOverride = overrides.phases?.find(p => p.id === phase.id)
    const exercises = phase.exercises.map(exercise => {
      const override = overrides.exercises?.[exercise.instanceId]
      if (!override && !phaseOverride) return exercise

      if (override?.parameterValues) {
        validateOverride(override.parameterValues, exercise.version)
      }

      return {
        ...exercise,
        ...sanitizeOverride(override || {}),
        parameterValues: {
          ...exercise.parameterValues,
          ...(override?.parameterValues || {}),
        },
      } as WorkoutRuntimeExercise
    })

    return { ...phase, ...(phaseOverride || {}), exercises }
  })

  return {
    ...sourceWorkout,
    phases: resolvedPhases,
    notes: overrides.notes ?? sourceWorkout.notes,
    metadata: { ...sourceWorkout.metadata, hasOverrides: true },
  }
}

function sanitizeOverride(override: Partial<WorkoutRuntimeExercise>) {
  if (!override) return {}
  const { instanceId, exerciseId, version, ...safe } = override
  return safe
}

function validateOverride(
  values: Record<string, any>,
  version: ExerciseVersion
): void {
  const allFields = [...version.baseFields, ...version.customFields]
  for (const [fieldId, value] of Object.entries(values)) {
    const fieldDef = allFields.find(f => f.id === fieldId)
    if (!fieldDef) throw new Error(`Campo "${fieldId}" não existe na versão do exercício.`)
    if (!fieldDef.enabled) throw new Error(`Campo "${fieldId}" está desativado.`)
    
    const incomingType = typeof value.value
    const expectedType = fieldDef.type === 'number' || fieldDef.type === 'percentage' ? 'number' : 'string'
    if (incomingType !== expectedType && fieldDef.type !== 'options') {
      throw new Error(`Tipo inválido para "${fieldId}": esperado ${expectedType}, recebido ${incomingType}.`)
    }
  }
}
