export type AssetType = 'exercise' | 'workout' | 'plan'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface LibraryAsset {
  id: string
  title: string
  type: AssetType

  tags: string[]
  muscleGroups: string[]

  lastModified: string

  // 🧠 INTELIGÊNCIA BIOMECÂNICA
  stressScore: number
  riskLevel: RiskLevel
  fatigueImpact: number

  // 🔗 RELAÇÕES NO SISTEMA
  usedInWorkouts: string[]
  usedInPlans: string[]

  // 📊 USO REAL
  usageCount: number
  lastUsedAt?: string
}
