import { AnimatePresence } from 'motion/react'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'
import { SortablePhase } from './SortablePhase'

export function WorkoutCanvas() {
  const phases = useWorkoutBuilderStore(s => s.phases)
  const addPhase = useWorkoutBuilderStore(s => s.addPhase)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pr-8 min-h-[400px] items-start">
      <AnimatePresence mode="popLayout">
        {phases.map(phase => (
          <SortablePhase key={phase.id} phase={phase} />
        ))}
      </AnimatePresence>

      {/* Add Phase Button */}
      <button
        onClick={() => addPhase(`Fase ${phases.length + 1}`)}
        className="w-72 flex-shrink-0 min-h-[120px] rounded-2xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-2 text-white/20 hover:text-teal-400 hover:border-teal-500/30 transition-all group"
      >
        <div className="w-10 h-10 rounded-xl border border-white/[0.08] group-hover:border-teal-500/30 flex items-center justify-center text-xl transition-colors">
          +
        </div>
        <span className="text-xs font-label">Nova Fase</span>
      </button>
    </div>
  )
}
