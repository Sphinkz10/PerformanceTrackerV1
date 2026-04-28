import type { VisualNode } from '../domain/workout/visual'
import type { WorkoutConnection } from '../domain/workout/connections'

export function generateSmartConnections(nodes: VisualNode[]): WorkoutConnection[] {
  const connections: WorkoutConnection[] = []
  const sortedNodes = [...nodes].sort((a, b) => a.order - b.order)

  for (let i = 0; i < sortedNodes.length - 1; i++) {
    const current = sortedNodes[i]
    const next = sortedNodes[i + 1]

    // Regra 1: Se ambos são exercícios na mesma fase, avalia Superset vs Sequence
    if (current.type === 'exercise' && next.type === 'exercise' && current.parentId === next.parentId) {
      // Mock de lógica de IA (num cenário real, leria os grupos musculares via SemanticEngine)
      const isPushPull = current.data.label?.includes('Press') && next.data.label?.includes('Row')
      
      if (isPushPull) {
        connections.push({ id: `ai-ss-${current.id}-${next.id}`, from: current.id, to: next.id, type: 'superset', label: 'AI Superset' })
      } else {
        connections.push({ id: `ai-seq-${current.id}-${next.id}`, from: current.id, to: next.id, type: 'sequence' })
      }
    }
  }
  return connections
}
