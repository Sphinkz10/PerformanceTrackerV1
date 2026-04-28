import type { WorkoutRuntime } from '../domain/runtime/types'
import type { SemanticValue } from '../domain/semantic/registry'

interface WorkoutMetrics {
  totalVolume: number
  totalTonnage: number
  density: number
  duration: number
  muscleDistribution: Record<string, number>
  averageRPE: number
  averageIntensity: number
  fatigueScore: number
}

export function calculateWorkoutMetrics(
  runtime: WorkoutRuntime,
  muscleGroupMap?: Record<string, string[]>
): WorkoutMetrics {
  let totalSets = 0
  let totalReps = 0
  let totalTonnage = 0
  let totalRest = 0
  let totalRPE = 0
  let rpeCount = 0
  let totalIntensity = 0
  let intensityCount = 0
  let totalWorkSeconds = 0

  const muscleVolume: Record<string, number> = {}

  runtime.phases.forEach(phase => {
    phase.exercises.forEach(exercise => {
      const params = exercise.parameterValues
      const fieldMap = exercise.version.fieldMap

      const sets = getNumberParam(params, fieldMap, 'sets') ?? 1
      const reps = getNumberParam(params, fieldMap, 'reps') ?? 1
      const weight = getNumberParam(params, fieldMap, 'weight') ?? 0
      const rest = getNumberParam(params, fieldMap, 'rest') ?? 90
      const rpe = getNumberParam(params, fieldMap, 'rpe')
      const percentage = getNumberParam(params, fieldMap, 'percentage')
      const duration = getNumberParam(params, fieldMap, 'duration')

      const volume = sets * reps
      totalSets += sets
      totalReps += volume
      totalTonnage += volume * weight
      totalRest += rest * (sets - 1)

      if (rpe !== null) { totalRPE += rpe; rpeCount++ }
      if (percentage !== null) { totalIntensity += percentage; intensityCount++ }

      totalWorkSeconds += duration ? duration * sets : volume * 5

      const muscles = muscleGroupMap?.[exercise.exerciseId] ?? []
      muscles.forEach(m => {
        muscleVolume[m] = (muscleVolume[m] ?? 0) + volume
      })
    })
  })

  const totalSeconds = totalWorkSeconds + totalRest
  const durationMinutes = Math.ceil(totalSeconds / 60)
  const density = totalRest > 0 ? totalWorkSeconds / totalRest : 0

  const values = Object.values(muscleVolume)
  const maxVolume = values.length ? Math.max(...values) : 1  // Bug fix: evita divisão por zero

  const muscleDistribution: Record<string, number> = {}
  Object.entries(muscleVolume).forEach(([muscle, vol]) => {
    muscleDistribution[muscle] = vol / maxVolume
  })

  const volumeScore = Math.min(totalReps / 200, 1) * 40
  const intensityScore = intensityCount > 0 ? (totalIntensity / intensityCount) / 100 * 40 : 0
  const rpeScore = rpeCount > 0 ? (totalRPE / rpeCount) / 10 * 20 : 0
  const fatigueScore = Math.min(volumeScore + intensityScore + rpeScore, 100)

  return {
    totalVolume: totalReps,
    totalTonnage,
    density: Math.round(density * 100) / 100,
    duration: durationMinutes,
    muscleDistribution,
    averageRPE: rpeCount > 0 ? Math.round((totalRPE / rpeCount) * 10) / 10 : 0,
    averageIntensity: intensityCount > 0 ? Math.round(totalIntensity / intensityCount) : 0,
    fatigueScore: Math.round(fatigueScore),
  }
}

function getNumberParam(
  params: Record<string, SemanticValue>,
  fieldMap: Record<string, string>,
  semanticKey: string
): number | null {
  for (const [fieldId, param] of Object.entries(params)) {
    if (fieldMap[fieldId] === semanticKey && typeof param.value === 'number') {
      return param.value
    }
  }
  return null
}
