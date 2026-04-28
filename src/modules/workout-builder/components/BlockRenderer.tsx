import { motion } from 'motion/react'
import type { WorkoutBlock, SupersetBlock, CircuitBlock } from '../types/block.types'
import { ExerciseCardBuilder } from './ExerciseCardBuilder'

interface Props {
  block: WorkoutBlock
  onUngroup?: () => void
}

export function BlockRenderer({ block, onUngroup }: Props) {
  switch (block.type) {
    case 'superset':
      return (
        <motion.div
          layout
          className="border border-amber-500/25 rounded-xl p-3 bg-gradient-to-br from-amber-500/[0.04] to-transparent space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-amber-500/60" />
              <span className="text-amber-400/80 font-label font-semibold text-xs tracking-wider uppercase">Superset</span>
            </div>
            {onUngroup && (
              <button onClick={onUngroup} className="text-[10px] text-white/30 hover:text-amber-400 transition-colors font-label">
                Desagrupar
              </button>
            )}
          </div>
          <div className="space-y-1.5 pl-3 border-l-2 border-amber-500/15">
            {(block as SupersetBlock).exercises.map((ex) => (
              <ExerciseCardBuilder key={ex.id} block={ex} compact />
            ))}
          </div>
        </motion.div>
      )

    case 'circuit':
      return (
        <motion.div
          layout
          className="border border-purple-500/25 rounded-xl p-3 bg-gradient-to-br from-purple-500/[0.04] to-transparent space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-purple-500/60" />
              <span className="text-purple-400/80 font-label font-semibold text-xs tracking-wider uppercase">Circuit</span>
              <span className="px-1.5 py-0.5 bg-purple-500/15 rounded text-purple-300/80 text-[10px] font-label">
                {(block as CircuitBlock).rounds}x
              </span>
            </div>
            {onUngroup && (
              <button onClick={onUngroup} className="text-[10px] text-white/30 hover:text-purple-400 transition-colors font-label">
                Desagrupar
              </button>
            )}
          </div>
          <div className="space-y-1.5 pl-3 border-l-2 border-purple-500/15">
            {(block as CircuitBlock).exercises.map((ex) => (
              <ExerciseCardBuilder key={ex.id} block={ex} compact />
            ))}
          </div>
        </motion.div>
      )

    case 'exercise':
    default:
      return <ExerciseCardBuilder block={block} />
  }
}
