import type { VisualNode } from '../domain/workout/visual'

export function calculateMuscleLoad(nodes: VisualNode[]) {
  const load: Record<string, number> = {}
  
  nodes.forEach(n => {
    // Assumimos que o node.data.muscle contém um array de strings (ex: ['chest', 'triceps'])
    const muscles = n.data.muscle || []
    muscles.forEach((m: string) => {
      load[m] = (load[m] || 0) + 1
    })
  })
  return load
}

export function detectImbalance(load: Record<string, number>) {
  const values = Object.values(load)
  if (values.length === 0) return { score: 0, status: 'OK' as const, warning: null }
  
  const max = Math.max(...values)
  const min = Math.min(...values)
  const score = max - min

  return {
    imbalanceScore: score,
    status: score > 3 ? 'HIGH_IMBALANCE' as const : 'OK' as const,
    warning: score > 3 ? 'Risco de assimetria. Considere adicionar exercícios para os músculos menos solicitados.' : null
  }
}

export function detectOvertraining(nodes: VisualNode[]) {
  let volume = nodes.length
  let intensityPoints = 0

  nodes.forEach(n => {
    const muscles = n.data.muscle || []
    // Exercícios compostos pesados (pernas/costas) geram mais fadiga no SNC
    if (muscles.includes('quad') || muscles.includes('hamstring') || muscles.includes('back')) {
      intensityPoints += 2
    } else {
      intensityPoints += 1
    }
  })

  // Fórmula baseada em Carga de Trabalho Aguda
  const score = (volume * 0.6) + (intensityPoints * 0.4)

  return {
    fatigueScore: score,
    risk: score > 15 ? 'HIGH' as const : score > 10 ? 'MEDIUM' as const : 'LOW' as const
  }
}
