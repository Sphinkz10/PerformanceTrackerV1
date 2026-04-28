import { motion } from 'motion/react'
import type { ExerciseBlock } from '../types/block.types'

interface Props {
  block: ExerciseBlock
  compact?: boolean
}

const paramLabels: Record<string, string> = {
  sets: 'Sets', reps: 'Reps', weight: 'Peso', percentage: '%RM',
  rpe: 'RPE', rest: 'Rest', duration: 'Dur', distance: 'Dist',
}

export function ExerciseCardBuilder({ block, compact }: Props) {
  const params = Object.entries(block.parameters || {})

  return (
    <motion.div
      layout
      className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-3.5 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center text-sm">
          🏋️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{block.exerciseName || block.exerciseId}</p>
          <p className="text-white/30 text-xs truncate">
            {block.version?.exerciseId ? `v${block.version.id.slice(0, 6)}` : 'draft'}
          </p>
        </div>
      </div>
      {!compact && params.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {params.map(([key, val]) => (
            <span
              key={key}
              className="px-2 py-0.5 bg-white/[0.06] rounded-md text-[11px] text-white/50 font-label"
            >
              {paramLabels[key] || key}: <span className="text-white/80">{String((val as any)?.value ?? val)}</span>
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
