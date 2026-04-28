import { calculateMuscleBalance, detectOvertraining } from '../trainingIntelligenceEngine'
import { generateMuscleHeatmap } from '../muscleHeatmapEngine'
import { eventBus, EventTypes } from '../core/eventBus'
import { simulateTrainingForecast } from '../simulationEngine'

// Esta classe atua como proxy do Pseudo-Worker que alivia bloqueios Main Thread.
// Podia ser implementado como `new Worker()` real associado ao Vite se escalasse pesado.

class BiomechanicsWorkerManager {
  constructor() {
    this.listen()
  }

  private listen() {
    eventBus.subscribe(EventTypes.METRICS_UPDATE_REQUIRED, (payload: any) => {
      this.processBackgroundJob(payload.nodes)
    })
    
    // Processamento desencadeado após drag estabilizado no caso real-world
    eventBus.subscribe(EventTypes.NODE_DRAG_FINISHED, (payload: any) => {
      this.processBackgroundJob(payload.nodes)
    })
  }

  private processBackgroundJob(nodes: any[]) {
    // Escapa The Main Thread Event Loop usando setTimeout a 0
    setTimeout(() => {
       try {
           const balance = calculateMuscleBalance(nodes)
           const overtraining = detectOvertraining(nodes)
           const heatmap = generateMuscleHeatmap(nodes)
           const forecast = simulateTrainingForecast(nodes, 4)

           const resultPayload = { balance, overtraining, heatmap, forecast }

           // Disparamos o setAnalytics de volta à store ou UI assíncrona
           eventBus.dispatch('WORKER_METRICS_CALCULATED', resultPayload)
       } catch (e) {
           console.error("Worker Computation Error", e)
       }
    }, 0)
  }
}

export const biomechanicsWorker = new BiomechanicsWorkerManager()
