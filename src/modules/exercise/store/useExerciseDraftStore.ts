import { create } from 'zustand'
import type { ExerciseDraft, ExerciseIdentity, BaseFieldConfig, FieldDefinition } from '../../../domain/exercise/entities'
import { validateField } from '../../../domain/exercise/validators'
import { validateDraft } from '../../../domain/exercise/invariants'

interface DraftMeta {
  isDirty: boolean
  lastSavedAt?: Date
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

interface ExerciseDraftState {
  draft: ExerciseDraft
  meta: DraftMeta
  setIdentityField: <K extends keyof ExerciseIdentity>(key: K, value: ExerciseIdentity[K]) => void
  setDifficulty: (level: number) => void
  toggleBaseField: (fieldId: string) => void
  updateBaseFieldDefault: (fieldId: string, value: any) => void
  addCustomField: (field: FieldDefinition) => void
  removeCustomField: (fieldId: string) => void
  reorderCustomFields: (newFields: FieldDefinition[]) => void
  reset: () => void
  markSaved: () => void
  setSaveStatus: (status: DraftMeta['saveStatus']) => void
  validateDraft: () => { valid: boolean; errors: string[] }
}

const initialIdentity: ExerciseIdentity = {
  name: '',
  category: undefined,
  primaryMuscle: '',
  secondaryMuscles: [],
  equipment: [],
  icon: '🏋️',
  description: '',
}

const initialBaseFields: BaseFieldConfig[] = [
  { id: 'sets', enabled: true, required: true, defaultValue: 4, semanticKey: 'sets' },
  { id: 'reps', enabled: true, required: true, defaultValue: 8, semanticKey: 'reps' },
  { id: 'weight', enabled: false, semanticKey: 'weight' },
  { id: 'percentage', enabled: true, defaultValue: 80, semanticKey: 'percentage' },
  { id: 'rpe', enabled: true, defaultValue: 7, semanticKey: 'rpe' },
  { id: 'rest', enabled: true, defaultValue: 120, semanticKey: 'rest' },
]

export const useExerciseDraftStore = create<ExerciseDraftState>((set, get) => ({
  draft: {
    identity: { ...initialIdentity },
    difficulty: 3,
    baseFields: initialBaseFields.map(f => ({ ...f })),
    customFields: [],
  },
  meta: { isDirty: false, saveStatus: 'idle' },

  setIdentityField: (key, value) =>
    set(state => ({
      draft: { ...state.draft, identity: { ...state.draft.identity, [key]: value } },
      meta: { ...state.meta, isDirty: true },
    })),

  setDifficulty: (level) =>
    set(state => ({
      draft: { ...state.draft, difficulty: level },
      meta: { ...state.meta, isDirty: true },
    })),

  toggleBaseField: (fieldId) =>
    set(state => ({
      draft: {
        ...state.draft,
        baseFields: state.draft.baseFields.map(f =>
          f.id === fieldId ? { ...f, enabled: !f.enabled } : f
        ),
      },
      meta: { ...state.meta, isDirty: true },
    })),

  updateBaseFieldDefault: (fieldId, value) =>
    set(state => {
      const field = state.draft.baseFields.find(f => f.id === fieldId)
      if (!field) return state
      const validation = validateField(field, value)
      if (!validation.isValid) return state
      return {
        draft: {
          ...state.draft,
          baseFields: state.draft.baseFields.map(f =>
            f.id === fieldId ? { ...f, defaultValue: value } : f
          ),
        },
        meta: { ...state.meta, isDirty: true },
      }
    }),

  addCustomField: (field) => {
    if (field.defaultValue !== undefined) {
      const validation = validateField(field, field.defaultValue)
      if (!validation.isValid) return
    }
    set(state => ({
      draft: { ...state.draft, customFields: [...state.draft.customFields, field] },
      meta: { ...state.meta, isDirty: true },
    }))
  },

  removeCustomField: (fieldId) =>
    set(state => ({
      draft: { ...state.draft, customFields: state.draft.customFields.filter(f => f.id !== fieldId) },
      meta: { ...state.meta, isDirty: true },
    })),

  reorderCustomFields: (newFields) =>
    set(state => ({
      draft: { ...state.draft, customFields: newFields },
      meta: { ...state.meta, isDirty: true },
    })),

  reset: () =>
    set({
      draft: {
        identity: { ...initialIdentity },
        difficulty: 3,
        baseFields: initialBaseFields.map(f => ({ ...f })),
        customFields: [],
      },
      meta: { isDirty: false, saveStatus: 'idle' },
    }),

  markSaved: () =>
    set(state => ({
      meta: { ...state.meta, isDirty: false, saveStatus: 'saved', lastSavedAt: new Date() },
    })),

  setSaveStatus: (status) =>
    set(state => ({ meta: { ...state.meta, saveStatus: status } })),

  validateDraft: () => validateDraft(get().draft),
}))
