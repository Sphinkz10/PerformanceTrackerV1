import type { ExerciseDraft } from './entities'
import { checkFieldDependencies } from './rules'

export function validateDraft(draft: ExerciseDraft): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!draft.identity.name || draft.identity.name.trim().length < 3) {
    errors.push('Nome do exercício é obrigatório (mín. 3 caracteres).')
  }
  if (!draft.identity.category) {
    errors.push('Categoria é obrigatória.')
  }
  if (!draft.identity.primaryMuscle) {
    errors.push('Grupo muscular primário é obrigatório.')
  }

  // Regras de dependência (rule engine)
  const depErrors = checkFieldDependencies(draft.baseFields, draft.customFields)
  errors.push(...depErrors)

  return { valid: errors.length === 0, errors }
}
