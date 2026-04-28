import { Node, Edge } from '@xyflow/react'

export interface WorkoutTemplate {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
  version: number
}

export function exportGraphToJSON(name: string, nodes: Node[], edges: Edge[]): string {
  const template: WorkoutTemplate = { id: crypto.randomUUID(), name, nodes, edges, version: 1 }
  return JSON.stringify(template, null, 2)
}

export function parseGraphFromJSON(jsonString: string): WorkoutTemplate | null {
  try {
    const parsed = JSON.parse(jsonString)
    if (parsed.nodes && parsed.edges) return parsed
    return null
  } catch (e) {
    console.error('Erro ao importar template', e)
    return null
  }
}
