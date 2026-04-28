import { Node } from '@xyflow/react'

export type PhaseType = 'hypertrophy' | 'strength' | 'endurance' | 'deload'

export interface TrainingWeek {
  weekNumber: number
  phase: PhaseType
  volumeMultiplier: number
  intensityMultiplier: number
  projectedNodes: Node[] // O grafo alterado para esta semana específica
}

export function generatePeriodization(baseNodes: Node[], weeks: number = 4): TrainingWeek[] {
  const pattern: PhaseType[] = ['hypertrophy', 'strength', 'strength', 'deload']

  return Array.from({ length: weeks }).map((_, i) => {
    const phase = pattern[i % pattern.length]
    
    // Calcula multiplicadores com base na fase do mesociclo
    const vMult = phase === 'hypertrophy' ? 1.2 : phase === 'deload' ? 0.6 : 1.0
    const iMult = phase === 'strength' ? 1.15 : phase === 'deload' ? 0.8 : 1.0

    // Simula a evolução dos parâmetros dentro dos exercícios
    const projected = baseNodes.map(node => {
      const pNode = { ...node, data: { ...node.data, params: { ...(node.data as any)?.params } } }
      if ((pNode.data as any).params.weight) (pNode.data as any).params.weight *= iMult
      if ((pNode.data as any).params.sets) (pNode.data as any).params.sets = Math.max(1, Math.round((pNode.data as any).params.sets * vMult))
      return pNode
    })

    return { weekNumber: i + 1, phase, volumeMultiplier: vMult, intensityMultiplier: iMult, projectedNodes: projected }
  })
}
