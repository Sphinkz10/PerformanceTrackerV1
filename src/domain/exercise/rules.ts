import type { BaseFieldConfig, FieldDefinition } from './entities'

type Rule = (baseFields: BaseFieldConfig[], customFields: FieldDefinition[]) => string | null

const rules: Rule[] = [
  // sets → reps
  (baseFields) => {
    const sets = baseFields.find(f => f.id === 'sets')
    const reps = baseFields.find(f => f.id === 'reps')
    if (sets?.enabled && !reps?.enabled) return '"sets" requer "reps" ativo.'
    return null
  },
  // weight e percentage mutuamente exclusivos
  (baseFields) => {
    const weight = baseFields.find(f => f.id === 'weight')
    const percentage = baseFields.find(f => f.id === 'percentage')
    if (weight?.enabled && percentage?.enabled) return '"weight" e "percentage" não podem estar ambos ativos.'
    return null
  },
  // distance implica duration ou reps
  (baseFields) => {
    const distance = baseFields.find(f => f.id === 'distance')
    const duration = baseFields.find(f => f.id === 'duration')
    const reps = baseFields.find(f => f.id === 'reps')
    if (distance?.enabled && !duration?.enabled && !reps?.enabled) return '"distance" requer "duration" ou "reps" ativo.'
    return null
  },
]

export function checkFieldDependencies(
  baseFields: BaseFieldConfig[],
  customFields: FieldDefinition[]
): string[] {
  const errors: string[] = []
  for (const rule of rules) {
    const error = rule(baseFields, customFields)
    if (error) errors.push(error)
  }
  return errors
}
