import { create } from 'zustand'
import { LibraryAsset, AssetType } from '../types'

interface LibraryState {
  assets: LibraryAsset[]

  search: string
  activeTab: AssetType | 'all'

  sortBy: 'recent' | 'stress' | 'usage'

  setSearch: (v: string) => void
  setTab: (t: AssetType | 'all') => void
  setSort: (s: LibraryState['sortBy']) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  assets: [
    // Mock inicial para visualização do ecossistema vivo
    {
      id: 'ex-1', title: 'Squat Dinâmico', type: 'exercise', tags: ['força', 'power'], muscleGroups: ['quads', 'glutes'], lastModified: new Date().toISOString(), stressScore: 85, riskLevel: 'high', fatigueImpact: 90, usedInWorkouts: ['w-1'], usedInPlans: ['p-1'], usageCount: 42
    },
    {
      id: 'w-1', title: 'Lower Body Titan', type: 'workout', tags: ['hipertrofia'], muscleGroups: ['quads', 'hamstrings'], lastModified: new Date().toISOString(), stressScore: 60, riskLevel: 'medium', fatigueImpact: 65, usedInWorkouts: [], usedInPlans: ['p-1'], usageCount: 12
    }
  ],

  search: '',
  activeTab: 'all',
  sortBy: 'recent',

  setSearch: (v) => set({ search: v }),
  setTab: (t) => set({ activeTab: t }),
  setSort: (s) => set({ sortBy: s })
}))
