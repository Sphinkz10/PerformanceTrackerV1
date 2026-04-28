export type EventType = 
  | 'NODE_MOVED'
  | 'NODE_ADDED'
  | 'NODE_REMOVED'
  | 'EDGE_CREATED'
  | 'ASSET_UPDATED'
  | 'GRAPH_UPDATED'
  | 'PLAN_ASSIGNED'

export interface AppEvent {
  type: EventType
  payload?: any
}

type EventCallback = (event: AppEvent) => void

class EventBus {
  private listeners: Record<string, EventCallback[]> = {}

  emit(event: AppEvent) {
    if (!this.listeners[event.type]) return
    this.listeners[event.type].forEach(fn => fn(event))
  }

  on(type: EventType, fn: EventCallback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(fn)
  }

  off(type: EventType, fn: EventCallback) {
    if (!this.listeners[type]) return
    this.listeners[type] = this.listeners[type].filter(l => l !== fn)
  }
}

export const coreBus = new EventBus()
