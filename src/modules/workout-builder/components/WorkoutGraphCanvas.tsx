import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from 'zustand'

import { useGraphStore } from '../store/useGraphStore'
import { ExerciseNode } from './nodes/ExerciseNode'
import { getLayoutedElements } from '../../../engines/graphLayoutEngine'
import { calculateMuscleBalance, detectOvertraining, suggestConnections } from '../../../engines/trainingIntelligenceEngine'
import { generateMuscleHeatmap } from '../../../engines/muscleHeatmapEngine'
import { generatePeriodization, TrainingWeek } from '../../../engines/periodizationEngine'
import { simulateTrainingForecast } from '../../../engines/simulationEngine'
import { exportGraphToJSON } from '../../../engines/templateEngine'
import { validateGraphImport } from '../../core/validation/schemas'

// Regra de arquitetura: ligar o nodeType ao componente custom

const nodeTypes = {
  exerciseNode: ExerciseNode,
}

export function SimulationPanel() {
  const analytics = useGraphStore(s => s.analytics)
  if (!analytics || !analytics.forecast) return null
  
  const forecast = analytics.forecast

  return (
    <div className="absolute top-[28rem] left-4 z-50 bg-surf-inner border border-white/10 rounded-xl p-4 shadow-surf backdrop-blur-md w-64 max-h-[40vh] overflow-y-auto custom-scrollbar">
      <h3 className="font-display text-white text-sm mb-3">Previsão Performance</h3>
      <div className="text-white/60 text-xs flex mt-1 mb-2 items-center justify-between">
        <span>Tendência (4 sem):</span>
        <span className="font-bold flex items-center gap-1">
          {forecast.performanceTrend === 'declining' && <span className="text-red-400">⚠️ Declínio</span>}
          {forecast.performanceTrend === 'plateau' && <span className="text-amber-400">➖ Plateau</span>}
          {forecast.performanceTrend === 'improving' && <span className="text-teal-400">📈 Melhoria</span>}
        </span>
      </div>
      {forecast.performanceTrend === 'declining' && (
        <p className="text-red-400/80 text-[10px] mt-2 mb-2 leading-relaxed">Instabilidade fisiológica detetada. Risco de Plateaux/Declínio nas próximas 4 semanas.</p>
      )}
    </div>
  )
}


export function TimeTravelToolbar() {
  const { undo, redo, pastStates, futureStates } = useStore(useGraphStore.temporal, (state: any) => state)
  const nodes = useGraphStore(s => s.nodes)
  const edges = useGraphStore(s => s.edges)
  const setNodes = useGraphStore(s => s.setNodes)
  const setEdges = useGraphStore(s => s.setEdges)
  
  const handleExport = () => {
    const data = exportGraphToJSON('LUNA_Template_1', nodes, edges)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workout_template.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      const parsed = validateGraphImport(content)
      if (parsed) {
        setNodes(parsed.nodes)
        setEdges(parsed.edges)
      } else {
        alert('Falha ao importar: Template Corrompido ou Formato Invalido (Zod Boundary rejected).')
      }
    }
    reader.readAsText(file)
  }


  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-surf-inner border border-white/10 rounded-full px-4 py-2 shadow-surf backdrop-blur-md">
      <button 
        onClick={() => undo()} 
        disabled={pastStates.length === 0}
        className="text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-2 flex items-center gap-1 font-label text-xs"
      >
        <span className="text-sm">↩</span> Undo
      </button>
      <div className="w-px h-4 bg-white/10 mx-2" />
      <button 
        onClick={() => redo()} 
        disabled={futureStates.length === 0}
        className="text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-2 flex items-center gap-1 font-label text-xs"
      >
        Redo <span className="text-sm">↪</span>
      </button>
      <div className="w-px h-4 bg-white/10 mx-2" />
      <button 
        onClick={handleExport}
        className="text-white/70 hover:text-teal-400 transition-colors px-2 flex items-center gap-1 font-label text-xs"
      >
        Exportar ⬇️
      </button>
      <label className="text-white/70 hover:text-blue-400 cursor-pointer transition-colors px-2 flex items-center gap-1 font-label text-xs">
        Importar ⬆️
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
    </div>
  )
}



export function PeriodizationPanel() {
  const nodes = useGraphStore(s => s.nodes)
  const [weeks, setWeeks] = useState<TrainingWeek[]>([])

  if (nodes.length === 0) return null

  return (
    <div className="absolute top-4 left-4 z-50 bg-surf-inner border border-white/10 rounded-xl p-4 shadow-surf backdrop-blur-md w-64">
      <button 
        onClick={() => setWeeks(generatePeriodization(nodes, 4))}
        className="w-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-white/10 py-2 rounded-lg text-xs hover:border-white/30 transition-all font-label text-white"
      >
        📅 Gerar Mês
      </button>

      {weeks.length > 0 && (
        <div className="mt-4 space-y-3">
          {weeks.map(w => (
            <div key={w.weekNumber} className="flex flex-col gap-1 text-xs border-l-2 border-white/10 pl-3">
               <span className="text-white font-medium">Semana {w.weekNumber} <span className="text-teal-400/80 uppercase ml-1">({w.phase})</span></span>
               <span className="text-white/50">Vol: <span className="text-white">{w.volumeMultiplier}x</span> | Int: <span className="text-white">{w.intensityMultiplier}x</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Este componente deve ser injetado dentro da mesma div onde está o <ReactFlow> (como overlay z-50)
export function CanvasIntelligencePanel() {
  const analytics = useGraphStore(s => s.analytics)

  const handleAutoWire = () => {
    console.warn('Auto-Wire temporariamente desativado para refatorização de Asset normalizado.')
  }

  if (!analytics) return null
  
  const { balance, overtraining, heatmap } = analytics

  return (
    <div className="absolute top-4 right-4 z-50 bg-surf-inner border border-white/10 rounded-xl p-4 shadow-surf backdrop-blur-md w-72 max-h-[80vh] overflow-y-auto custom-scrollbar">
      <h3 className="font-display text-white text-sm mb-3 flex items-center justify-between">
        <span>Engine Analytics</span>
        <button onClick={handleAutoWire} className="bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs px-2 py-1 rounded hover:bg-teal-500/20 transition-colors opacity-50 cursor-not-allowed">
          ✨ Auto-Wire
        </button>
      </h3>
      
      <div className="space-y-3 text-xs">
        <div>
          <span className="text-white/60">Overtraining Risk:</span>
          <span className={`ml-2 font-bold uppercase ${overtraining?.riskLevel === 'high' ? 'text-red-400' : overtraining?.riskLevel === 'medium' ? 'text-amber-400' : 'text-teal-400'}`}>
            {overtraining?.riskLevel}
          </span>
          {overtraining?.warnings?.map((w: string, i: number) => <p key={i} className="text-red-400/80 mt-1">{w}</p>)}
        </div>

        <div>
          <span className="text-white/60">Muscle Balance:</span>
          <span className={`ml-2 font-bold uppercase ${balance?.status === 'HIGH_IMBALANCE' ? 'text-red-400' : 'text-teal-400'}`}>
            {balance?.status}
          </span>
        </div>
      </div>

      {heatmap && heatmap.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <span className="text-white/60 text-xs mb-3 block uppercase font-label">Heatmap Muscular</span>
          <div className="flex flex-col gap-2">
            {heatmap.map((h: any) => (
              <div key={h.muscle} className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/80 uppercase">{h.muscle}</span>
                  <span className="text-white/40">{h.rawVolume} set{h.rawVolume !== 1 ? 's' : ''}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${h.intensity * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LayoutFlow() {
  const nodes = useGraphStore(s => s.nodes)
  const edges = useGraphStore(s => s.edges)
  const onNodesChange = useGraphStore(s => s.onNodesChange)
  const onEdgesChange = useGraphStore(s => s.onEdgesChange)
  const onConnect = useGraphStore(s => s.onConnect)
  const setNodes = useGraphStore(s => s.setNodes)
  const setEdges = useGraphStore(s => s.setEdges)
  
  const { fitView, screenToFlowPosition } = useReactFlow()
  const flowWrapper = useRef<HTMLDivElement>(null)

  const onLayout = useCallback((direction: string) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    )
    setNodes([...layoutedNodes])
    setEdges([...layoutedEdges])
    
    // Fit view after layout to make it smooth
    window.requestAnimationFrame(() => {
      fitView({ duration: 800, padding: 0.2 })
    })
  }, [nodes, edges, setNodes, setEdges, fitView])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      const assetId = event.dataTransfer.getData('exerciseId')
      
      if (typeof type === 'undefined' || !type || !assetId) return

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
      
      // Store API Call replacing XYFlow direct inject:
      useGraphStore.getState().addExerciseNode(assetId, position)
    },
    [screenToFlowPosition]
  )

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: any) => {
    import('../../../core/events/eventBus').then(({ coreBus }) => {
      coreBus.emit({ 
        type: 'NODE_MOVED', 
        payload: { nodeId: node.id, x: node.position.x, y: node.position.y } 
      })
    })
  }, [])

  return (
    <div className="w-full h-full flex-1 relative group" ref={flowWrapper}>
      <PeriodizationPanel />
      <SimulationPanel />
      <CanvasIntelligencePanel />
      <TimeTravelToolbar />

      {/* Control Tools Extra */}
      <div className="absolute top-4 left-[20rem] ml-4 z-10 flex gap-2">
        <button
          onClick={() => onLayout('TB')}
          className="bg-surf-inner border border-white/10 px-4 py-2 rounded-lg text-xs font-label text-white/70 hover:text-white hover:border-white/20 transition-all backdrop-blur-md shadow-lg"
        >
          ↕ Auto-Layout (Dagre)
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background color="#ffffff" gap={20} size={1} opacity={0.05} />
        <Controls 
          className="bg-surf-inner border-white/10 fill-white/50" 
          buttonClassName="bg-transparent border-b-white/10 hover:bg-white/5" 
        />
        <MiniMap 
          nodeColor="#14b8a6" 
          maskColor="rgba(0, 0, 0, 0.6)" 
          className="bg-surf-inner border border-white/10 rounded-lg overflow-hidden" 
        />
      </ReactFlow>
    </div>
  )
}

import { useGraphEngine } from '../../../hooks/useGraphEngine'

export function WorkoutGraphCanvas() {
  useGraphEngine()
  return (
    <div className="w-full h-full bg-[#09090b]">
       <ReactFlowProvider>
         <LayoutFlow />
       </ReactFlowProvider>
    </div>
  )
}

