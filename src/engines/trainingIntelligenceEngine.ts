import { Node, Edge } from '@xyflow/react'

const TARGET_DISTRIBUTION: Record<string, number> = {
  chest: 1, back: 1, quads: 1.2, hamstrings: 1, shoulders: 0.8, arms: 0.6, core: 0.7,
}

// 1. Muscle Balance
export function calculateMuscleBalance(nodes: Node[]) {
  const distribution: Record<string, number> = {}
  
  nodes.forEach(node => {
    const muscles = node.data?.muscle || [] // Fixed to use 'muscle' directly as it is mapped in the store payload
    muscles.forEach((m: string) => {
      distribution[m] = (distribution[m] || 0) + 1 // Assumindo 1 de volume base por node
    })
  })

  let imbalanceScore = 0
  Object.entries(TARGET_DISTRIBUTION).forEach(([muscle, target]) => {
    const actual = distribution[muscle] || 0
    if (actual > 0) {
      imbalanceScore += Math.abs(1 - (actual / target))
    }
  })

  return {
    distribution,
    imbalanceScore,
    status: imbalanceScore > 2.5 ? 'HIGH_IMBALANCE' : imbalanceScore > 1.5 ? 'MEDIUM' : 'OPTIMAL'
  }
}

// 2. Overtraining Detector
export function detectOvertraining(nodes: Node[]) {
  let systemicFatigue = 0
  const warnings: string[] = []

  nodes.forEach(node => {
    const muscles = node.data?.muscle || []
    if (muscles.includes('quads') || muscles.includes('back')) systemicFatigue += 2
    else systemicFatigue += 1
  })

  if (systemicFatigue > 12) warnings.push('Risco de fadiga no Sistema Nervoso Central (SNC).')
  if (nodes.length > 8) warnings.push('Volume excessivo para uma única sessão.')

  return {
    score: systemicFatigue,
    riskLevel: systemicFatigue > 12 ? 'high' : systemicFatigue > 8 ? 'medium' : 'low',
    warnings
  }
}

// 3. Smart Edge Recommender (Supersets e Fluxo)
export function suggestConnections(nodes: Node[]): Edge[] {
  const edges: Edge[] = []
  // Ordena os nós visualmente de cima para baixo (Y) para assumir o fluxo de tempo
  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y)

  for (let i = 0; i < sortedNodes.length - 1; i++) {
    const a = sortedNodes[i]
    const b = sortedNodes[i + 1]

    const musclesA = a.data?.muscle || []
    const musclesB = b.data?.muscle || []

    // Lógica Antagonista para Superset
    const isAntagonist = 
      (musclesA.includes('chest') && musclesB.includes('back')) ||
      (musclesA.includes('quads') && musclesB.includes('hamstrings'))

    const isSuperset = isAntagonist || (!musclesA.some((m: string) => musclesB.includes(m)))

    edges.push({
      id: `ai-edge-${a.id}-${b.id}`,
      source: a.id,
      target: b.id,
      type: 'smoothstep',
      animated: isSuperset,
      style: { stroke: isSuperset ? '#d4af37' : '#14b8a6', strokeWidth: 2, strokeDasharray: isSuperset ? '5 5' : 'none' },
      label: isSuperset ? 'Superset' : ''
    })
  }
  return edges
}
