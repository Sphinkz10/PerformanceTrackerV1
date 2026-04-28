import type { ExerciseVersion } from '../../../domain/exercise/entities'
import type { SemanticValue } from '../../../domain/semantic/registry'

export type BlockType = 'exercise' | 'superset' | 'circuit'

export interface BaseBlock {
  id: string
  type: BlockType
}

export interface ExerciseBlock extends BaseBlock {
  type: 'exercise'
  exerciseId: string
  exerciseName: string
  version: ExerciseVersion
  parameters: Record<string, SemanticValue>
}

export interface SupersetBlock extends BaseBlock {
  type: 'superset'
  exercises: ExerciseBlock[]
}

export interface CircuitBlock extends BaseBlock {
  type: 'circuit'
  rounds: number
  restBetweenRounds: number
  exercises: ExerciseBlock[]
}

export type WorkoutBlock = ExerciseBlock | SupersetBlock | CircuitBlock

export interface WorkoutPhase {
  id: string
  name: string
  order: number
  blocks: WorkoutBlock[]
}

export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  phases: WorkoutPhase[]
  createdAt: Date
  updatedAt: Date
}
