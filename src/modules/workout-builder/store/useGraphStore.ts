import { create } from 'zustand'
import { temporal } from 'zundo'
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from '@xyflow/react'
import { useLibraryStore } from '../../library/store/useLibraryStore'
import { lunaBus, LUNAEvent } from '../../../engines/core/eventBus'
import { workerManager } from '../../../engines/workers/workerManager'

// Bootstrap Worker Lifecycle ao iniciar a store global
workerManager.init()

interface AnalyticsState {
  balance: any
  overtraining: any
  heatmap: any[]
  forecast: any
}

interface GraphState {
  nodes: Node[]
  edges: Edge[]
  analytics: AnalyticsState | null
  
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addExerciseNode: (assetId: string, position: { x: number, y: number }) => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setAnalytics: (analytics: AnalyticsState) => void
}

export const useGraphStore = create<GraphState>()(
  temporal(
    (set, get) => {
      // Registrar escuta do Worker assíncrono para os resultados
      lunaBus.subscribe((event: LUNAEvent) => {
        if (event.type === 'METRICS_COMPUTED') {
          set({ analytics: event.payload })
        }
      })

      return {
        nodes: [],
        edges: [],
        analytics: null,

        // Apenas disparamos a gravação intensiva se for o final de um DRAG (Time-Travel Rule)
        onNodesChange: (changes) => {
          set({ nodes: applyNodeChanges(changes, get().nodes) })
          
          changes.forEach(c => {
             if (c.type === 'position' && !c.dragging) {
               // Nós posicionados fixos: recalcular lógica de ligações passivas se existirem.
               lunaBus.emit({ type: 'GRAPH_NODE_MOVED', payload: { nodeId: c.id, x: (c.position as any)?.x || 0, y: (c.position as any)?.y || 0 } })
             }
          })

          if (changes.some(c => c.type === 'remove' || c.type === 'add' || (c.type === 'position' && !c.dragging))) {
            lunaBus.emit({ type: 'ASSET_METRICS_STALE', payload: { nodes: get().nodes } })
          }
        },
        
        onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
        onConnect: (connection) => {
          set({ 
            edges: addEdge({ ...connection, type: 'smoothstep', animated: true, style: { stroke: '#14b8a6', strokeWidth: 2 } }, get().edges) 
          })
          
          if (connection.source && connection.target) {
            lunaBus.emit({ 
              type: 'GRAPH_CONNECTION_CREATED', 
              payload: { edgeId: crypto.randomUUID(), from: connection.source, to: connection.target } 
            })
          }
          lunaBus.emit({ type: 'ASSET_METRICS_STALE', payload: { nodes: get().nodes } })
        },

        // CONTRAÇÃO DE SOURCE OF TRUTH: Node usa SOMENTE assetId
        addExerciseNode: (assetId, position) => {
          const newNode: Node = {
            id: crypto.randomUUID(),
            type: 'exerciseNode',
            position,
            data: { assetId } // O Segredo da V1 Final. Propriedade única biológica removida.
          }
          const newNodes = [...get().nodes, newNode]
          set({ nodes: newNodes })
          lunaBus.emit({ type: 'ASSET_METRICS_STALE', payload: { nodes: newNodes } })
        },

        setNodes: (nodes) => {
          set({ nodes })
          lunaBus.emit({ type: 'ASSET_METRICS_STALE', payload: { nodes } })
        },
        setEdges: (edges) => set({ edges }),
        setAnalytics: (analytics) => set({ analytics }),
      }
    },
    {
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      limit: 50 // Limit zundo memoria para 50 jumps de buffer
    }
  )
)

export function useNodeData(nodeId: string) {
  const node = useGraphStore(s => s.nodes.find(n => n.id === nodeId))
  const assetId = (node?.data as any)?.assetId
  
  const libraryAsset = useLibraryStore(s => s.assets.find(a => a.id === assetId))
  
  if (!node || !libraryAsset) return null

  return {
    ...libraryAsset,
    nodePosition: node.position
  }
}
