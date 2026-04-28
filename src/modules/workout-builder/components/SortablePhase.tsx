import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'motion/react'
import type { WorkoutPhase } from '../types/block.types'
import { SortableBlock } from './SortableBlock'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'

interface Props {
  phase: WorkoutPhase
}

export function SortablePhase({ phase }: Props) {
  const renamePhase = useWorkoutBuilderStore(s => s.renamePhase)
  const removePhase = useWorkoutBuilderStore(s => s.removePhase)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(phase.name)

  const { setNodeRef, isOver } = useDroppable({
    id: `phase-${phase.id}`,
    data: { type: 'phase', phaseId: phase.id },
  })

  const handleRename = () => {
    if (tempName.trim()) renamePhase(phase.id, tempName.trim())
    setIsEditing(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className={`w-72 flex-shrink-0 flex flex-col rounded-2xl border transition-all duration-200 ${
        isOver
          ? 'border-teal-500/40 bg-teal-500/[0.03] shadow-[0_0_20px_rgba(20,184,166,0.08)]'
          : 'border-white/[0.06] bg-white/[0.02]'
      }`}
    >
      {/* Phase Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-2 h-2 rounded-full bg-teal-500/60" />
          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => { if (e.key === 'Enter') handleRename() }}
              className="bg-transparent border-b border-teal-500 text-white text-sm font-medium outline-none flex-1"
            />
          ) : (
            <button
              onClick={() => { setTempName(phase.name); setIsEditing(true) }}
              className="text-white text-sm font-medium truncate hover:text-teal-400 transition-colors text-left"
            >
              {phase.name}
            </button>
          )}
          <span className="text-[10px] text-white/25 font-label">
            {phase.blocks.length}
          </span>
        </div>
        <button
          onClick={() => removePhase(phase.id)}
          className="text-white/20 hover:text-red-400 transition-colors text-sm ml-2"
        >
          ✕
        </button>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-2 min-h-[120px] overflow-y-auto"
      >
        <SortableContext items={phase.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {phase.blocks.map(block => (
              <SortableBlock key={block.id} block={block} phaseId={phase.id} />
            ))}
          </AnimatePresence>
        </SortableContext>

        {phase.blocks.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/15 text-xs font-label">
            Arrasta exercícios aqui
          </div>
        )}
      </div>
    </motion.div>
  )
}
