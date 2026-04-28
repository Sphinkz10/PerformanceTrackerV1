import type { BaseFieldConfig, FieldDefinition } from './entities'

export function validateField(
  field: BaseFieldConfig | FieldDefinition,
  value: any
): { isValid: boolean; message?: string } {
  if ('enabled' in field && !field.enabled) {
    if (field.required) {
      return { isValid: false, message: `"${'name' in field ? field.name : field.id}" está desativado mas é obrigatório.` }
    }
    return { isValid: true }
  }

  if (field.required && (value === undefined || value === null || value === '')) {
    return { isValid: false, message: `"${'name' in field ? field.name : field.id}" é obrigatório.` }
  }
  if (value === undefined || value === null || value === '') return { isValid: true }

  const type = 'type' in field ? field.type : 'number'

  if (type === 'number' || type === 'percentage') {
    const num = Number(value)
    if (isNaN(num)) return { isValid: false, message: 'Deve ser um número.' }
    if ('min' in field && field.min !== undefined && num < field.min) return { isValid: false, message: `Mínimo: ${field.min}.` }
    if ('max' in field && field.max !== undefined && num > field.max) return { isValid: false, message: `Máximo: ${field.max}.` }
    return { isValid: true }
  }
  if (type === 'text') {
    if ('max' in field && field.max && String(value).length > field.max) return { isValid: false, message: `Máx. ${field.max} caracteres.` }
    return { isValid: true }
  }
  if (type === 'options') {
    if ('options' in field && field.options && !field.options.includes(value)) return { isValid: false, message: 'Valor inválido.' }
    return { isValid: true }
  }
  return { isValid: true }
}
