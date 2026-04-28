import type { SemanticKey, DefaultValue } from '../semantic/registry'

export type ExerciseCategory = 'strength' | 'cardio' | 'mobility' | 'power' | 'other'
export type FieldType = 'number' | 'text' | 'percentage' | 'options'

export interface BaseFieldConfig {
  id: string
  enabled: boolean
  required?: boolean
  defaultValue?: DefaultValue
  semanticKey?: SemanticKey
}

export interface FieldDefinition {
  id: string
  name: string
  type: FieldType
  unit?: string
  min?: number
  max?: number
  options?: string[]
  required: boolean
  defaultValue?: DefaultValue
  semanticKey?: SemanticKey
}

export interface ExerciseIdentity {
  name: string
  category?: ExerciseCategory
  primaryMuscle: string
  secondaryMuscles: string[]
  equipment: string[]
  icon: string
  description: string
}

export interface ExerciseDraft {
  id?: string
  identity: ExerciseIdentity
  difficulty: number
  baseFields: BaseFieldConfig[]
  customFields: FieldDefinition[]
}

export interface ExerciseVersion {
  id: string
  exerciseId: string
  baseFields: BaseFieldConfig[]
  customFields: FieldDefinition[]
  fieldMap: Record<string, SemanticKey>
  createdAt: Date
}
