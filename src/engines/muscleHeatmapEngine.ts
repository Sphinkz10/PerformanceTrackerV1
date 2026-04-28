import { Node } from '@xyflow/react'

export function generateMuscleHeatmap(nodes: Node[]) {
  const heat: Record<string, number> = {}
  
  nodes.forEach(n => {
    const muscles = (n.data as any)?.muscle || []
    muscles.forEach((m: string) => { heat[m] = (heat[m] || 0) + 1 })
  })

  // Evita max ser zero se não houver nodes/musculos
  const max = Math.max(...Object.values(heat), 1)
  
  return Object.entries(heat).map(([muscle, value]) => ({
    muscle, intensity: value / max, rawVolume: value
  })).sort((a, b) => b.intensity - a.intensity)
}
