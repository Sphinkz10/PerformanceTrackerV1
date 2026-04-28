import { create } from 'zustand'
import { applyMesocycleProgression, CoachDecision, MesocycleGoal } from '../../../engines/plan/mesocycleEngine'

export interface PlanDay {
  id: string
  name: string
  workoutTemplateId: string | null
}

export interface PlanWeek {
  id: string
  weeklyLoad: number
  days: PlanDay[]
}

export interface PlanData {
  weeks: PlanWeek[]
}

interface PlanState {
  plan: PlanData
  autoMode: boolean
  coachLogs: CoachDecision[]
  toggleAutoMode: (goal: MesocycleGoal) => void
}

const mockInitialWeeks: PlanWeek[] = [
  { 
    id: 'w1', weeklyLoad: 100, days: [
      { id: 'd1', name: 'Segunda', workoutTemplateId: 'Lower-Body-Power' },
      { id: 'd2', name: 'Terça', workoutTemplateId: 'Upper-Body-Power' },
      { id: 'd3', name: 'Quarta', workoutTemplateId: null },
      { id: 'd4', name: 'Quinta', workoutTemplateId: 'Lower-Body-Hyper' },
      { id: 'd5', name: 'Sexta', workoutTemplateId: 'Upper-Body-Hyper' },
      { id: 'd6', name: 'Sábado', workoutTemplateId: null },
      { id: 'd7', name: 'Domingo', workoutTemplateId: null },
    ]
  },
  { 
    id: 'w2', weeklyLoad: 100, days: [
      { id: 'w2-d1', name: 'Segunda', workoutTemplateId: 'Lower-Body-Power' },
      { id: 'w2-d2', name: 'Terça', workoutTemplateId: 'Upper-Body-Power' },
      { id: 'w2-d3', name: 'Quarta', workoutTemplateId: null },
      { id: 'w2-d4', name: 'Quinta', workoutTemplateId: 'Lower-Body-Hyper' },
      { id: 'w2-d5', name: 'Sexta', workoutTemplateId: 'Upper-Body-Hyper' },
      { id: 'w2-d6', name: 'Sábado', workoutTemplateId: null },
      { id: 'w2-d7', name: 'Domingo', workoutTemplateId: null },
    ]
  },
  { 
    id: 'w3', weeklyLoad: 100, days: [
      { id: 'w3-d1', name: 'Segunda', workoutTemplateId: 'Lower-Body-Power' },
      { id: 'w3-d2', name: 'Terça', workoutTemplateId: 'Upper-Body-Power' },
      { id: 'w3-d3', name: 'Quarta', workoutTemplateId: null },
      { id: 'w3-d4', name: 'Quinta', workoutTemplateId: 'Lower-Body-Hyper' },
      { id: 'w3-d5', name: 'Sexta', workoutTemplateId: 'Upper-Body-Hyper' },
      { id: 'w3-d6', name: 'Sábado', workoutTemplateId: null },
      { id: 'w3-d7', name: 'Domingo', workoutTemplateId: null },
    ]
  },
  { 
    id: 'w4', weeklyLoad: 100, days: [
      { id: 'w4-d1', name: 'Segunda', workoutTemplateId: 'Lower-Body-Power' },
      { id: 'w4-d2', name: 'Terça', workoutTemplateId: 'Upper-Body-Power' },
      { id: 'w4-d3', name: 'Quarta', workoutTemplateId: null },
      { id: 'w4-d4', name: 'Quinta', workoutTemplateId: 'Lower-Body-Hyper' },
      { id: 'w4-d5', name: 'Sexta', workoutTemplateId: 'Upper-Body-Hyper' },
      { id: 'w4-d6', name: 'Sábado', workoutTemplateId: null },
      { id: 'w4-d7', name: 'Domingo', workoutTemplateId: null },
    ]
  }
]

export const usePlanStore = create<PlanState>((set) => ({
  plan: { weeks: JSON.parse(JSON.stringify(mockInitialWeeks)) },
  autoMode: false,
  coachLogs: [],
  toggleAutoMode: (goal) => set(state => {
    if (state.autoMode) {
      // Reverte se desligar
      return { autoMode: false, plan: { weeks: JSON.parse(JSON.stringify(mockInitialWeeks)) }, coachLogs: [] } 
    }
    const { weeks, logs } = applyMesocycleProgression(state.plan.weeks, goal)
    return { autoMode: true, plan: { ...state.plan, weeks }, coachLogs: logs }
  }),
}))
