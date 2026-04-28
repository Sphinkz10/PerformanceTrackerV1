import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { VisualNode } from '../../../domain/workout/visual'
import { WorkoutConnection } from '../../../domain/workout/connections'
import { reorderNodes } from '../../../engines/visualCanvasEngine'
import { generateSmartConnections } from '../../../engines/aiConnectionEngine'
import { WorkoutNode } from './WorkoutNode'
import { ConnectionLayer } from './ConnectionLayer'
import { motion, AnimatePresence } from 'framer-motion'

export function WorkoutCanvas() {
  const [nodes, setNodes] = useState<VisualNode[]>([
    { id: 'phase-1', type: 'phase', order: 0, data: { label: 'Warmup' } },
    { id: 'ex-1', type: 'exercise', parentId: 'phase-1', order: 0, data: { label: 'Cat-Cow' } },
    { id: 'ss-1', type: 'superset', parentId: 'phase-1', order: 1, data: { label: 'Ativação Glúteos' } },
    { id: 'ex-2', type: 'exercise', parentId: 'ss-1', order: 0, data: { label: 'Glute Bridge' } },
    { id: 'ex-3', type: 'exercise', parentId: 'ss-1', order: 1, data: { label: 'Banded Walk' } },
  ])

  const [connections, setConnections] = useState<WorkoutConnection[]>([])
  const [activeNode, setActiveNode] = useState<VisualNode | null>(null)
  const [activeDragCoords, setActiveDragCoords] = useState<{ id: string, x: number, y: number } | null>(null)
  
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 } // Evita conflitos com cliques casuais
  }))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveNode(nodes.find(n => n.id === active.id) || null)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active } = event
    if (active) {
      const el = document.getElementById(active.id as string)
      if (el) {
        const rect = el.getBoundingClientRect()
        setActiveDragCoords({
          id: active.id as string,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        })
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNode(null)
    setActiveDragCoords(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    setNodes(prev => reorderNodes(prev, active.id as string, over.id as string))
  }

  // Filtragem hierárquica recursiva simples
  const renderNodes = (parentId?: string) => {
    const children = nodes.filter(n => n.parentId === parentId).sort((a, b) => a.order - b.order)
    if (children.length === 0) return null

    return (
      <SortableContext items={children.map(n => n.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 w-full pl-4 mt-3 border-l border-white/5">
          <AnimatePresence>
            {children.map(node => (
               <WorkoutNode key={node.id} node={node}>
                 {/* Recursão visual: nós que podem conter outros nós */}
                 {(node.type === 'phase' || node.type === 'superset' || node.type === 'circuit') && renderNodes(node.id)}
               </WorkoutNode>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    )
  }

  return (
    <div className="relative p-8 h-full overflow-y-auto bg-surf-bg w-full">
      <div className="absolute top-4 right-8 z-20">
        <button 
          onClick={() => setConnections(generateSmartConnections(nodes))}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-xl text-xs font-label text-teal-400 hover:border-teal-500/60 transition-colors shadow-lg cursor-pointer"
        >
          ✨ AI Auto-Connect
        </button>
      </div>

      <ConnectionLayer nodes={nodes} connections={connections} activeDragCoords={activeDragCoords} />

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart} 
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-3xl mx-auto relative z-10 mt-8">
           {renderNodes(undefined)} {/* Renderiza o nível raiz (normalmente Phases) */}
        </div>
        
        {/* O Ghost Preview que segue o rato */}
        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeNode ? (
            <motion.div 
               className="rotate-2 scale-105 opacity-90 shadow-2xl"
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.9 }}
            >
              <WorkoutNode node={activeNode} isOverlay />
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
