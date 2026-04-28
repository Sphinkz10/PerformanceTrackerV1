import { create } from 'zustand'
import type { WorkoutBlock, WorkoutPhase, ExerciseBlock } from '../types/block.types'

interface WorkoutBuilderState {
  // State
  templateName: string
  templateDescription: string
  phases: WorkoutPhase[]
  activeBlockId: string | null
  activeDragType: 'block' | 'phase' | null
  isDirty: boolean

  // Template metadata
  setTemplateName: (name: string) => void
  setTemplateDescription: (desc: string) => void

  // Active element tracking
  setActiveBlockId: (id: string | null) => void
  setActiveDragType: (type: 'block' | 'phase' | null) => void

  // Phase CRUD
  addPhase: (name: string) => void
  removePhase: (phaseId: string) => void
  renamePhase: (phaseId: string, name: string) => void
  reorderPhases: (phases: WorkoutPhase[]) => void

  // Block CRUD
  addBlock: (phaseId: string, block: WorkoutBlock) => void
  removeBlock: (phaseId: string, blockId: string) => void
  updateBlockParameters: (phaseId: string, blockId: string, exerciseId: string, params: Record<string, any>) => void
  moveBlock: (activeId: string, overId: string, activePhaseId: string, overPhaseId: string) => void

  // Superset/Circuit operations
  groupAsSuperset: (phaseId: string, blockIds: string[]) => void
  groupAsCircuit: (phaseId: string, blockIds: string[], rounds: number) => void
  ungroupBlock: (phaseId: string, blockId: string) => void

  // Reset
  reset: () => void
}

const createPhase = (name: string, order: number): WorkoutPhase => ({
  id: crypto.randomUUID(),
  name,
  order,
  blocks: [],
})

export const useWorkoutBuilderStore = create<WorkoutBuilderState>((set, get) => ({
  templateName: '',
  templateDescription: '',
  phases: [],
  activeBlockId: null,
  activeDragType: null,
  isDirty: false,

  setTemplateName: (name) => set({ templateName: name, isDirty: true }),
  setTemplateDescription: (desc) => set({ templateDescription: desc, isDirty: true }),
  setActiveBlockId: (id) => set({ activeBlockId: id }),
  setActiveDragType: (type) => set({ activeDragType: type }),

  addPhase: (name) => set((state) => ({
    phases: [...state.phases, createPhase(name, state.phases.length)],
    isDirty: true,
  })),

  removePhase: (phaseId) => set((state) => ({
    phases: state.phases
      .filter(p => p.id !== phaseId)
      .map((p, i) => ({ ...p, order: i })),
    isDirty: true,
  })),

  renamePhase: (phaseId, name) => set((state) => ({
    phases: state.phases.map(p => p.id === phaseId ? { ...p, name } : p),
    isDirty: true,
  })),

  reorderPhases: (phases) => set({
    phases: phases.map((p, i) => ({ ...p, order: i })),
    isDirty: true,
  }),

  addBlock: (phaseId, block) => set((state) => ({
    phases: state.phases.map(p =>
      p.id === phaseId ? { ...p, blocks: [...p.blocks, block] } : p
    ),
    isDirty: true,
  })),

  removeBlock: (phaseId, blockId) => set((state) => ({
    phases: state.phases.map(p =>
      p.id === phaseId ? { ...p, blocks: p.blocks.filter(b => b.id !== blockId) } : p
    ),
    isDirty: true,
  })),

  updateBlockParameters: (phaseId, blockId, exerciseId, params) => set((state) => ({
    phases: state.phases.map(p => {
      if (p.id !== phaseId) return p
      return {
        ...p,
        blocks: p.blocks.map(b => {
          if (b.id !== blockId) return b
          if (b.type === 'exercise' && b.exerciseId === exerciseId) {
            return { ...b, parameters: { ...b.parameters, ...params } }
          }
          if (b.type === 'superset' || b.type === 'circuit') {
            return {
              ...b,
              exercises: b.exercises.map(ex =>
                ex.exerciseId === exerciseId ? { ...ex, parameters: { ...ex.parameters, ...params } } : ex
              ),
            }
          }
          return b
        }),
      }
    }),
    isDirty: true,
  })),

  moveBlock: (activeId, overId, activePhaseId, overPhaseId) => set((state) => {
    const phases = [...state.phases]
    const activePhaseIdx = phases.findIndex(p => p.id === activePhaseId)
    const overPhaseIdx = phases.findIndex(p => p.id === overPhaseId)
    if (activePhaseIdx === -1 || overPhaseIdx === -1) return state

    const activePhase = { ...phases[activePhaseIdx], blocks: [...phases[activePhaseIdx].blocks] }
    const activeBlockIdx = activePhase.blocks.findIndex(b => b.id === activeId)
    if (activeBlockIdx === -1) return state
    const activeBlock = activePhase.blocks[activeBlockIdx]

    if (activePhaseId === overPhaseId) {
      const overBlockIdx = activePhase.blocks.findIndex(b => b.id === overId)
      if (overBlockIdx === -1) return state
      activePhase.blocks.splice(activeBlockIdx, 1)
      activePhase.blocks.splice(overBlockIdx, 0, activeBlock)
      phases[activePhaseIdx] = activePhase
    } else {
      const overPhase = { ...phases[overPhaseIdx], blocks: [...phases[overPhaseIdx].blocks] }
      let overBlockIdx = overPhase.blocks.findIndex(b => b.id === overId)
      if (overBlockIdx === -1) overBlockIdx = overPhase.blocks.length
      activePhase.blocks.splice(activeBlockIdx, 1)
      overPhase.blocks.splice(overBlockIdx, 0, activeBlock)
      phases[activePhaseIdx] = activePhase
      phases[overPhaseIdx] = overPhase
    }

    return { phases, isDirty: true }
  }),

  groupAsSuperset: (phaseId, blockIds) => set((state) => ({
    phases: state.phases.map(p => {
      if (p.id !== phaseId) return p
      const exerciseBlocks = p.blocks.filter(
        b => blockIds.includes(b.id) && b.type === 'exercise'
      ) as ExerciseBlock[]
      if (exerciseBlocks.length < 2) return p
      const remaining = p.blocks.filter(b => !blockIds.includes(b.id))
      const insertIdx = p.blocks.findIndex(b => b.id === blockIds[0])
      remaining.splice(Math.min(insertIdx, remaining.length), 0, {
        id: crypto.randomUUID(),
        type: 'superset',
        exercises: exerciseBlocks,
      })
      return { ...p, blocks: remaining }
    }),
    isDirty: true,
  })),

  groupAsCircuit: (phaseId, blockIds, rounds) => set((state) => ({
    phases: state.phases.map(p => {
      if (p.id !== phaseId) return p
      const exerciseBlocks = p.blocks.filter(
        b => blockIds.includes(b.id) && b.type === 'exercise'
      ) as ExerciseBlock[]
      if (exerciseBlocks.length < 1) return p
      const remaining = p.blocks.filter(b => !blockIds.includes(b.id))
      const insertIdx = p.blocks.findIndex(b => b.id === blockIds[0])
      remaining.splice(Math.min(insertIdx, remaining.length), 0, {
        id: crypto.randomUUID(),
        type: 'circuit',
        rounds,
        restBetweenRounds: 60,
        exercises: exerciseBlocks,
      })
      return { ...p, blocks: remaining }
    }),
    isDirty: true,
  })),

  ungroupBlock: (phaseId, blockId) => set((state) => ({
    phases: state.phases.map(p => {
      if (p.id !== phaseId) return p
      const block = p.blocks.find(b => b.id === blockId)
      if (!block || block.type === 'exercise') return p
      const idx = p.blocks.indexOf(block)
      const newBlocks = [...p.blocks]
      newBlocks.splice(idx, 1, ...block.exercises)
      return { ...p, blocks: newBlocks }
    }),
    isDirty: true,
  })),

  reset: () => set({
    templateName: '',
    templateDescription: '',
    phases: [],
    activeBlockId: null,
    activeDragType: null,
    isDirty: false,
  }),
}))
