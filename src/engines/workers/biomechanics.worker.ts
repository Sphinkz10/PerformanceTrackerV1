import { calculateMuscleBalance, detectOvertraining } from '../trainingIntelligenceEngine'
import { generateMuscleHeatmap } from '../muscleHeatmapEngine'
import { simulateTrainingForecast } from '../simulationEngine'

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  if (type === 'COMPUTE_METRICS') {
    // Calculo pesado em total isolamento O(N)
    const balance = calculateMuscleBalance(payload.nodes)
    const overtraining = detectOvertraining(payload.nodes)
    const heatmap = generateMuscleHeatmap(payload.nodes)
    const forecast = simulateTrainingForecast(payload.nodes, 4)

    // Envio limpo de volta para a Main Thread
    self.postMessage({
      type: 'METRICS_COMPUTED',
      payload: { balance, overtraining, heatmap, forecast }
    })
  }
}
