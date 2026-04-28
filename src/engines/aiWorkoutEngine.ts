export interface TrainingGoal {
  type: 'hypertrophy' | 'strength' | 'fat_loss'
  timeframeWeeks: number
}

export function generateProgression(baseValue: number, week: number, goal: TrainingGoal): number {
  if (goal.type === 'strength') return baseValue * (1 + week * 0.025) // +2.5% carga por semana
  if (goal.type === 'hypertrophy') return baseValue + week * 1 // +1 rep por semana
  return baseValue
}

export function adjustByRPE(plannedLoad: number, actualRPE: number, targetRPE: number): number {
  const diff = actualRPE - targetRPE
  if (diff >= 2) return plannedLoad * 0.9 // Baixar carga 10%
  if (diff <= -2) return plannedLoad * 1.1 // Subir carga 10%
  return plannedLoad
}
