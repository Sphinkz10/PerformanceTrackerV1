import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'motion/react'
import type { WorkoutBlock } from '../types/block.types'
import { BlockRenderer } from './BlockRenderer'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'

interface Props {
  block: WorkoutBlock
  phaseId: string
}

export function SortableBlock({ block, phaseId }: Props) {
  const removeBlock = useWorkoutBuilderStore(s => s.removeBlock)
  const ungroupBlock = useWorkoutBuilderStore(s => s.ungroupBlock)
  const activeBlockId = useWorkoutBuilderStore(s => s.activeBlockId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      phaseId,
      block,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.4 : 1,
        scale: isDragging ? 0.97 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`group relative ${isDragging ? 'z-50' : ''} ${
        activeBlockId === block.id ? 'ring-1 ring-teal-500/40 rounded-xl' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <div className="flex flex-col gap-[2px]">
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => removeBlock(phaseId, block.id)}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
      >
        ×
      </button>

      <BlockRenderer
        block={block}
        onUngroup={block.type !== 'exercise' ? () => ungroupBlock(phaseId, block.id) : undefined}
      />
    </motion.div>
  )
}
