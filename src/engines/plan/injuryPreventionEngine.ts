export interface JointLoadProfile { knee: number; shoulder: number; spine: number }

// Mock de stress biomecânico gerado por um treino (num cenário real viria do Graph JSON)
export function getWorkoutJointStress(templateId: string): JointLoadProfile {
  if (templateId.includes('Lower')) return { knee: 40, shoulder: 0, spine: 30 }
  if (templateId.includes('Upper')) return { knee: 0, shoulder: 45, spine: 10 }
  return { knee: 20, shoulder: 20, spine: 20 } // Full Body
}

export function calculateWeeklyInjuryRisk(days: any[]) {
  const load: JointLoadProfile = { knee: 0, shoulder: 0, spine: 0 }
  
  days.forEach(day => {
    if (day.workoutTemplateId) {
      const stress = getWorkoutJointStress(day.workoutTemplateId)
      load.knee += stress.knee
      load.shoulder += stress.shoulder
      load.spine += stress.spine
    }
  })

  return {
    load,
    risks: {
      knee: load.knee > 100 ? 'HIGH' : load.knee > 70 ? 'MEDIUM' : 'OK',
      shoulder: load.shoulder > 100 ? 'HIGH' : load.shoulder > 70 ? 'MEDIUM' : 'OK',
      spine: load.spine > 80 ? 'HIGH' : 'OK'
    }
  }
}
