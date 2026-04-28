import { lunaBus } from '../core/eventBus'

// Single singleton de Gestão de Worker
class BiomechanicsWorkerManager {
  private worker: Worker | null = null
  private debounceTimer: number | null = null

  init() {
    if (this.worker) return

    // Setup do Vite de Worker Modules Nativos
    this.worker = new Worker(new URL('./biomechanics.worker.ts', import.meta.url), { type: 'module' })

    this.worker.onmessage = (e) => {
      const { type, payload } = e.data
      if (type === 'METRICS_COMPUTED') {
        // Recebemos resultados e informamos a App
        lunaBus.emit({ type: 'METRICS_COMPUTED', payload })
      }
    }

    this.listenToBus()
  }

  private listenToBus() {
    lunaBus.subscribe((event) => {
      // Debounce the call so fast drags don't queue 100 worker calls
      if (event.type === 'ASSET_METRICS_STALE') {
        if (this.debounceTimer) clearTimeout(this.debounceTimer)
        
        this.debounceTimer = window.setTimeout(() => {
          this.worker?.postMessage({
            type: 'COMPUTE_METRICS',
            payload: { nodes: event.payload.nodes }
          })
        }, 150) // 150ms throttle poupa bateria e CPU.
      }
    })
  }
}

export const workerManager = new BiomechanicsWorkerManager()
