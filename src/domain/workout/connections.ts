export type ConnectionType = 'sequence' | 'superset' | 'dependency' | 'loop'

export interface WorkoutConnection {
  id: string
  from: string   // nodeId
  to: string     // nodeId
  type: ConnectionType
  label?: string
}
