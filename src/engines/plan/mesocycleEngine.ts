export type MesocycleGoal = 'hypertrophy' | 'strength' | 'recovery'

export interface CoachDecision {
  id: string
  action: string
  reason: string
  weekAffected: number
}

export function applyMesocycleProgression(baseWeeks: any[], goal: MesocycleGoal): { weeks: any[], logs: CoachDecision[] } {
  const logs: CoachDecision[] = []
  const newWeeks = JSON.parse(JSON.stringify(baseWeeks)) // Deep copy

  newWeeks.forEach((week: any, index: number) => {
    if (goal === 'hypertrophy' && index > 0) {
      week.weeklyLoad = (week.weeklyLoad || 100) * 1.05 // +5% volume
      logs.push({ 
        id: crypto.randomUUID(), 
        action: 'Aumento de Volume (5%)', 
        reason: `Progressão padrão de Hipertrofia na Semana ${index + 1}.`, 
        weekAffected: index + 1 
      })
    } 
    else if (index === 3) { // Regra dura: 4ª semana é sempre Deload
      week.weeklyLoad = (week.weeklyLoad || 100) * 0.7 
      logs.push({ 
        id: crypto.randomUUID(), 
        action: 'Deload Aplicado (-30%)', 
        reason: 'Prevenção de overtraining sistémico na 4ª semana do bloco.', 
        weekAffected: index + 1 
      })
    }
  })

  return { weeks: newWeeks, logs }
}
