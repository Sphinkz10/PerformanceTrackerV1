import type { ExerciseDraft } from '../domain/exercise/entities'

export function buildExercisePreview(draft: ExerciseDraft) {
  const activeFields: { name: string; defaultValue: any }[] = []

  draft.baseFields.forEach(f => {
    if (f.enabled) activeFields.push({ name: f.id, defaultValue: f.defaultValue })
  })
  draft.customFields.forEach(f => {
    activeFields.push({ name: f.name, defaultValue: f.defaultValue })
  })

  return {
    name: draft.identity.name,
    category: draft.identity.category,
    primaryMuscle: draft.identity.primaryMuscle,
    difficulty: draft.difficulty,
    icon: draft.identity.icon,
    activeFields,
  }
}
