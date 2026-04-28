class EngineClient {
  private worker: Worker
  private pendingPromises: Map<string, { resolve: Function, reject: Function }> = new Map()

  constructor() {
    this.worker = new Worker(new URL('../../workers/engine.worker.ts', import.meta.url), { type: 'module' })
    
    this.worker.onmessage = (e) => {
      const { type, payload, messageId } = e.data
      
      const handlers = this.pendingPromises.get(messageId)
      if (handlers) {
        handlers.resolve(payload)
        this.pendingPromises.delete(messageId)
      }
    }

    this.worker.onerror = (err) => {
      console.error('Falha no Engine Worker:', err)
    }
  }

  // Wrapper Asíncrono de promessa limpa sobre sistema IPC
  async computeMetrics(nodes: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = crypto.randomUUID()
      this.pendingPromises.set(messageId, { resolve, reject })

      this.worker.postMessage({
        type: 'COMPUTE_METRICS',
        payload: { nodes },
        messageId
      })
    })
  }
}

export const engineClient = new EngineClient()
