import type { WorkoutConnection } from '../domain/workout/connections'

export function addConnection(connections: WorkoutConnection[], from: string, to: string, type: WorkoutConnection['type'] = 'sequence'): WorkoutConnection[] {
  if (connections.some(c => (c.from === from && c.to === to) || (c.from === to && c.to === from))) return connections
  return [...connections, { id: `${from}-${to}`, from, to, type }]
}
