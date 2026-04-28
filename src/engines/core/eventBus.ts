export type LUNAEvent = 
  | { type: 'GRAPH_NODE_MOVED'; payload: { nodeId: string; x: number; y: number } }
  | { type: 'GRAPH_CONNECTION_CREATED'; payload: { edgeId: string; from: string; to: string } }
  | { type: 'ASSET_METRICS_STALE'; payload: { nodes: any[] } }
  | { type: 'METRICS_COMPUTED'; payload: { balance: any; overtraining: any; heatmap: any[]; forecast: any } }

class EventBus {
  private listeners: Function[] = []

  emit(event: LUNAEvent) {
    this.listeners.forEach(fn => fn(event))
  }

  subscribe(fn: (event: LUNAEvent) => void) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter(l => l !== fn) }
  }
}

export const lunaBus = new EventBus()
