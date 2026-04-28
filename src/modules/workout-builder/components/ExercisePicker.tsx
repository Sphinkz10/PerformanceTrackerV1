import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'
import { exerciseService } from '../../../services/exercise.service'
import type { ExerciseDraft } from '../../../domain/exercise/entities'
import type { ExerciseBlock } from '../types/block.types'

const systemExercises = [
  { id: 'sys-squat', name: 'Back Squat', category: 'strength', muscle: 'Quadricípites' },
  { id: 'sys-bench', name: 'Bench Press', category: 'strength', muscle: 'Peito' },
  { id: 'sys-deadlift', name: 'Deadlift', category: 'strength', muscle: 'Dorsal' },
  { id: 'sys-ohp', name: 'Overhead Press', category: 'strength', muscle: 'Ombros' },
  { id: 'sys-row', name: 'Barbell Row', category: 'strength', muscle: 'Dorsal' },
  { id: 'sys-pullup', name: 'Pull-Up', category: 'strength', muscle: 'Dorsal' },
  { id: 'sys-lunge', name: 'Walking Lunge', category: 'strength', muscle: 'Quadricípites' },
  { id: 'sys-rdl', name: 'Romanian Deadlift', category: 'strength', muscle: 'Isquiotibiais' },
  { id: 'sys-dip', name: 'Dips', category: 'strength', muscle: 'Peito' },
  { id: 'sys-curl', name: 'Barbell Curl', category: 'strength', muscle: 'Bíceps' },
  { id: 'sys-run', name: 'Running Intervals', category: 'cardio', muscle: 'Full Body' },
  { id: 'sys-hip', name: 'Hip Mobility Flow', category: 'mobility', muscle: 'Glúteos' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ExercisePicker({ isOpen, onClose }: Props) {
  const addBlock = useWorkoutBuilderStore(s => s.addBlock)
  const phases = useWorkoutBuilderStore(s => s.phases)
  const [search, setSearch] = useState('')
  const [userDrafts, setUserDrafts] = useState<ExerciseDraft[]>([])
  const [targetPhase, setTargetPhase] = useState<string | null>(null)

  useEffect(() => {
    exerciseService.listDrafts().then(setUserDrafts).catch(() => {})
  }, [isOpen])

  useEffect(() => {
    if (phases.length > 0 && !targetPhase) setTargetPhase(phases[0].id)
  }, [phases, targetPhase])

  const allExercises = [
    ...systemExercises,
    ...userDrafts.map(d => ({
      id: d.id || crypto.randomUUID(),
      name: d.identity.name,
      category: d.identity.category || 'other',
      muscle: d.identity.primaryMuscle,
    })),
  ]

  const filtered = allExercises.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = (exercise: typeof allExercises[0]) => {
    if (!targetPhase) return
    const block: ExerciseBlock = {
      id: crypto.randomUUID(),
      type: 'exercise',
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      version: {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        baseFields: [
          { id: 'sets', enabled: true, required: true, defaultValue: 4, semanticKey: 'sets' },
          { id: 'reps', enabled: true, required: true, defaultValue: 8, semanticKey: 'reps' },
          { id: 'rpe', enabled: true, defaultValue: 7, semanticKey: 'rpe' },
          { id: 'rest', enabled: true, defaultValue: 120, semanticKey: 'rest' },
        ],
        customFields: [],
        fieldMap: { sets: 'sets', reps: 'reps', rpe: 'rpe', rest: 'rest' },
        createdAt: new Date(),
      },
      parameters: {},
    }
    addBlock(targetPhase, block)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 flex-shrink-0 border-l border-white/[0.06] bg-[#0c0c0f] flex flex-col h-full"
        >
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-label text-sm text-white font-medium">Exercícios</h3>
              <button onClick={onClose} className="text-white/30 hover:text-white text-sm transition-colors">✕</button>
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-teal-500/50 transition-colors"
            />
            {phases.length > 1 && (
              <select
                value={targetPhase || ''}
                onChange={e => setTargetPhase(e.target.value)}
                className="w-full mt-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs outline-none"
              >
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {filtered.map(ex => (
              <motion.button
                key={ex.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAdd(ex)}
                className="w-full text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] rounded-xl p-3 transition-all"
              >
                <p className="text-white text-sm font-medium">{ex.name}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-1.5 py-0.5 bg-teal-500/10 text-teal-400/70 rounded text-[10px] font-label">{ex.category}</span>
                  <span className="px-1.5 py-0.5 bg-white/5 text-white/30 rounded text-[10px]">{ex.muscle}</span>
                </div>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <div className="text-white/20 text-xs text-center py-8 font-label">Nenhum exercício encontrado</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
