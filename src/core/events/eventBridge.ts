import { coreBus, AppEvent } from './eventBus'
import { useGraphStore } from '../../modules/workout-builder/store/useGraphStore'
import { engineClient } from '../workers/engineClient'

/**
 * A Ponte do Estado: escuta o Event Bus, delega trabalho pesado ao Worker 
 * e consolida o resultado na interface, preservando zero overhead bloqueante.
 */
class EventBridge {
  init() {
    coreBus.on('NODE_MOVED', this.handleGraphStaleState)
    coreBus.on('NODE_ADDED', this.handleGraphStaleState)
    coreBus.on('NODE_REMOVED', this.handleGraphStaleState)
    coreBus.on('EDGE_CREATED', this.handleGraphStaleState)
  }

  private async handleGraphStaleState(event: AppEvent) {
    const nodes = useGraphStore.getState().nodes
    
    // Deixa o worker processar em promessa sem pendurar a UI
    try {
      const result = await engineClient.computeMetrics(nodes)
      
      // Quando a "verdade" determinística retorna, guardamos localmente.
      useGraphStore.getState().setAnalytics(result)
    } catch (e) {
      console.error('Falha na Computação Biomecânica:', e)
    }
  }
}

export const eventBridge = new EventBridge()
