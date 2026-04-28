import type { VisualNode } from '../domain/workout/visual'
import type { WorkoutConnection } from '../domain/workout/connections'

function areAntagonists(muscleA: string[], muscleB: string[]): boolean {
  const antagonistPairs = [
    ['chest', 'back'], ['biceps', 'triceps'], ['quad', 'hamstring']
  ]
  
  return antagonistPairs.some(pair => 
    (muscleA.includes(pair[0]) && muscleB.includes(pair[1])) ||
    (muscleA.includes(pair[1]) && muscleB.includes(pair[0]))
  )
}

export function recommendEdges(nodes: VisualNode[]): WorkoutConnection[] {
  const edges: WorkoutConnection[] = []
  
  // Ordenar pela posição X ou Y assumindo um fluxo da esquerda para a direita ou cima para baixo
  const sortedNodes = [...nodes].sort((a, b) => a.order - b.order)

  for (let i = 0; i < sortedNodes.length - 1; i++) {
    const a = sortedNodes[i]
    const b = sortedNodes[i + 1]

    const musclesA = a.data.muscle || []
    const musclesB = b.data.muscle || []

    let relationType: 'sequence' | 'superset' = 'sequence'

    // Se os músculos são antagonistas ou não partilham sobreposição, sugere Superset
    if (areAntagonists(musclesA, musclesB)) {
      relationType = 'superset'
    } else if (!musclesA.some((m: string) => musclesB.includes(m))) {
      // Upper / Lower split
      relationType = 'superset'
    }

    edges.push({
      id: `ai-edge-${a.id}-${b.id}`,
      from: a.id,
      to: b.id,
      type: relationType
    })
  }

  return edges
}
