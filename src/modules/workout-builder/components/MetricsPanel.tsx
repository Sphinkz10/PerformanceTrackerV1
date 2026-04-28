import { motion } from 'motion/react'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'
import { buildRuntimeFromBuilder } from '../../../engines/workoutBuilderEngine'
import { calculateWorkoutMetrics } from '../../../engines/metricsEngine'

export function MetricsPanel() {
  const phases = useWorkoutBuilderStore(s => s.phases)

  const totalBlocks = phases.reduce((sum, p) => sum + p.blocks.length, 0)
  const totalExercises = phases.reduce((sum, p) => {
    return sum + p.blocks.reduce((bSum, b) => {
      if (b.type === 'exercise') return bSum + 1
      return bSum + b.exercises.length
    }, 0)
  }, 0)

  const supersetCount = phases.reduce((sum, p) => sum + p.blocks.filter(b => b.type === 'superset').length, 0)
  const circuitCount = phases.reduce((sum, p) => sum + p.blocks.filter(b => b.type === 'circuit').length, 0)

  if (totalBlocks === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 px-4 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl"
    >
      <MetricPill label="Fases" value={phases.length} color="teal" />
      <MetricPill label="Exercícios" value={totalExercises} color="blue" />
      {supersetCount > 0 && <MetricPill label="Supersets" value={supersetCount} color="amber" />}
      {circuitCount > 0 && <MetricPill label="Circuitos" value={circuitCount} color="purple" />}
    </motion.div>
  )
}

function MetricPill({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    teal: 'bg-teal-500/10 text-teal-400',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className={`px-2 py-0.5 rounded-md text-xs font-label font-semibold ${colors[color]}`}>
        {value}
      </span>
      <span className="text-[10px] text-white/30 font-label">{label}</span>
    </div>
  )
}
