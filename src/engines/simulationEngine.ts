import { Node } from '@xyflow/react'

export interface SimulationResult {
  fatigueCurve: number[]
  muscleLoadForecast: Record<string, number>
  performanceTrend: 'improving' | 'plateau' | 'declining'
}

export function simulateTrainingForecast(nodes: Node[], weeks: number = 4): SimulationResult {
  let systemicFatigue = 0
  const curve: number[] = []
  const muscleLoad: Record<string, number> = {}

  for (let w = 0; w < weeks; w++) {
    nodes.forEach(n => {
      // Simula o stress gerado (1 base + 1 se for músculo grande)
      const muscles = (n.data as any)?.muscle || []
      const stress = muscles.some((m: string) => ['quads', 'back', 'hamstrings'].includes(m)) ? 2 : 1
      
      systemicFatigue += stress * 0.1
      muscles.forEach((m: string) => { muscleLoad[m] = (muscleLoad[m] || 0) + stress })
    })

    // Adaptação fisiológica: O corpo recupera 15% entre microciclos
    systemicFatigue *= 0.85 
    curve.push(systemicFatigue)
  }

  const trend = curve[curve.length - 1] > curve[0] * 1.2 ? 'declining' // Muita fadiga acumulada
              : curve[curve.length - 1] < curve[0] * 0.8 ? 'improving' // Supercompensação
              : 'plateau'

  return { fatigueCurve: curve, muscleLoadForecast: muscleLoad, performanceTrend: trend }
}
