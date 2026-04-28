export type VisualNodeType = 'phase' | 'superset' | 'giantset' | 'circuit' | 'exercise'

export interface VisualNode {
  id: string
  type: VisualNodeType
  parentId?: string
  order: number
  data: Record<string, any>
}
