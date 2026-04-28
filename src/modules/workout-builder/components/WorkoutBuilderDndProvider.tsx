import { useState, useRef, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { motion } from 'motion/react'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { WorkoutCanvas } from './WorkoutCanvas'
import { ExercisePicker } from './ExercisePicker'
import { MetricsPanel } from './MetricsPanel'
import { AIProgressionPanel } from './AIProgressionPanel'
import { BlockRenderer } from './BlockRenderer'

export function WorkoutBuilderDndProvider() {
  const phases = useWorkoutBuilderStore(s => s.phases)
  const moveBlock = useWorkoutBuilderStore(s => s.moveBlock)
  const setActiveBlockId = useWorkoutBuilderStore(s => s.setActiveBlockId)
  const setActiveDragType = useWorkoutBuilderStore(s => s.setActiveDragType)
  const templateName = useWorkoutBuilderStore(s => s.templateName)
  const setTemplateName = useWorkoutBuilderStore(s => s.setTemplateName)
  const isDirty = useWorkoutBuilderStore(s => s.isDirty)

  const [isDragging, setIsDragging] = useState(false)
  const [activeBlock, setActiveBlock] = useState<any>(null)
  const [showPicker, setShowPicker] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)

  useAutoScroll(isDragging, canvasRef as any)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    setIsDragging(true)
    setActiveBlockId(active.id as string)
    setActiveDragType('block')

    const data = active.data.current
    if (data?.block) {
      setActiveBlock(data.block)
    }
  }, [setActiveBlockId, setActiveDragType])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Could add placeholder insertion logic here
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false)
    setActiveBlock(null)
    setActiveBlockId(null)
    setActiveDragType(null)

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData) return

    const activePhaseId = activeData.phaseId as string
    let overPhaseId: string

    if (overData?.type === 'phase') {
      overPhaseId = overData.phaseId as string
    } else if (overData?.phaseId) {
      overPhaseId = overData.phaseId as string
    } else {
      return
    }

    if (active.id !== over.id) {
      moveBlock(active.id as string, over.id as string, activePhaseId, overPhaseId)
    }
  }, [moveBlock, setActiveBlockId, setActiveDragType])

  return (
    <div className="flex flex-col h-full">
      {/* Builder Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            placeholder="Nome do treino..."
            className="bg-transparent text-white text-lg font-display font-medium outline-none border-b border-transparent focus:border-teal-500/50 transition-colors w-full max-w-md"
          />
          {isDirty && <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" title="Não guardado" />}
        </div>
        <div className="flex items-center gap-3">
          <AIProgressionPanel />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xs font-label text-teal-400 hover:border-teal-500/40 transition-colors"
          >
            <span>{showPicker ? '◀' : '▶'}</span>
            <span>Exercícios</span>
          </motion.button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="mb-4">
        <MetricsPanel />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 overflow-x-auto overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <WorkoutCanvas />

            {/* Drag Overlay — high-fidelity ghost */}
            <DragOverlay dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
              {activeBlock && (
                <div className="opacity-90 scale-105 rotate-[1deg] pointer-events-none">
                  <BlockRenderer block={activeBlock} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Exercise Picker Sidebar */}
        <ExercisePicker isOpen={showPicker} onClose={() => setShowPicker(false)} />
      </div>
    </div>
  )
}
