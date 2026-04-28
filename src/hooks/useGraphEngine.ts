import { useEffect } from 'react'
import { eventBridge } from '../core/events/eventBridge'

/**
 * Interface simples para ligarmos o Sistema Nervoso do EventBridge
 * aos componentes React no arranque do Core Architecture, sem acoplar
 * state handlers ao DOM ou aos Hooks da Flow UI.
 */
export function useGraphEngine() {
  useEffect(() => {
    // Inicialização do Bridge App-wide
    eventBridge.init()
    
    // Future cleanup handlers se necessários...
    return () => {}
  }, [])
}
