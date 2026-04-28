import type { WorkoutRuntime } from './types'

export function validateRuntime(runtime: WorkoutRuntime): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  runtime.phases.forEach((phase, phaseIndex) => {
    if (!phase.name) {
      errors.push(`Fase ${phaseIndex + 1}: nome é obrigatório.`)
    }
    phase.exercises.forEach((exercise, exIndex) => {
      const version = exercise.version
      const allFields = [...version.baseFields, ...version.customFields]
      
      allFields.forEach(field => {
        if (field.enabled && field.required) {
          const param = exercise.parameterValues[field.id]
          if (!param || param.value === undefined || param.value === '') {
            errors.push(`Fase "${phase.name}", exercício ${exIndex + 1}: campo "${'name' in field ? field.name : field.id}" é obrigatório.`)
          }
        }
      })

      for (const [fieldId, value] of Object.entries(exercise.parameterValues)) {
        const fieldDef = allFields.find(f => f.id === fieldId)
        if (!fieldDef) continue
        if (!fieldDef.enabled) continue
        
        if (fieldDef.type === 'number' || fieldDef.type === 'percentage') {
          if (typeof value.value !== 'number') {
            errors.push(`Fase "${phase.name}", exercício ${exIndex + 1}: campo "${fieldDef.id || fieldDef.name}" deve ser numérico.`)
          }
        } else if (fieldDef.type === 'options') {
          if (fieldDef.options && !fieldDef.options.includes(value.value as string)) {
            errors.push(`Fase "${phase.name}", exercício ${exIndex + 1}: valor inválido para "${fieldDef.id || fieldDef.name}".`)
          }
        }
      }
    })
  })

  return { valid: errors.length === 0, errors }
}
