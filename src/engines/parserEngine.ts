import { resolveSemanticKeyFromUnit } from '../domain/semantic/registry'
import type { SemanticKey, SemanticValue } from '../domain/semantic/registry'

export function parseParameter(raw: string, expectedKey?: SemanticKey): SemanticValue | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (expectedKey) {
    switch (expectedKey) {
      case 'reps':
      case 'sets': {
        const num = Number(trimmed)
        if (!isNaN(num)) return { key: expectedKey, value: num, unit: expectedKey === 'reps' ? 'reps' : 'sets' } as SemanticValue
        break
      }
      case 'weight': {
        const match = trimmed.match(/^(\d+\.?\d*)\s*(kg|lbs?)?$/i)
        if (match) {
          const num = parseFloat(match[1])
          return { key: 'weight', value: num, unit: 'kg' } as SemanticValue
        }
        break
      }
      case 'duration':
      case 'rest': {
        const timeMatch = trimmed.match(/^(\d+):(\d{2})$/)
        if (timeMatch) {
          const minutes = parseInt(timeMatch[1])
          const seconds = parseInt(timeMatch[2])
          return { key: expectedKey, value: minutes * 60 + seconds, unit: 's' } as SemanticValue
        }
        const num = Number(trimmed)
        if (!isNaN(num)) return { key: expectedKey, value: num, unit: 's' } as SemanticValue
        break
      }
      case 'distance': {
        const match = trimmed.match(/^(\d+\.?\d*)\s*(m|km)?$/i)
        if (match) {
          let value = parseFloat(match[1])
          if (match[2]?.toLowerCase() === 'km') value *= 1000
          return { key: 'distance', value, unit: 'm' } as SemanticValue
        }
        break
      }
      case 'percentage': {
        const pct = trimmed.match(/^(\d+\.?\d*)\s*%?$/)
        if (pct) return { key: 'percentage', value: parseFloat(pct[1]), unit: '%' } as SemanticValue
        break
      }
      default: break
    }
  }

  // Fallback sem contexto
  const timeMatch = trimmed.match(/^(\d+):(\d{2})$/)
  if (timeMatch) {
    const minutes = parseInt(timeMatch[1])
    const seconds = parseInt(timeMatch[2])
    return { key: 'duration', value: minutes * 60 + seconds, unit: 's' } as SemanticValue
  }

  const pctMatch = trimmed.match(/^(\d+\.?\d*)\s*%$/)
  if (pctMatch) {
    return { key: 'percentage', value: parseFloat(pctMatch[1]), unit: '%' } as SemanticValue
  }

  const unitMatch = trimmed.match(/^(\d+\.?\d*)\s*([a-zA-Z]+)$/)
  if (unitMatch) {
    const num = parseFloat(unitMatch[1])
    const unit = unitMatch[2].toLowerCase()
    const key = resolveSemanticKeyFromUnit(unit)
    if (key) {
      return { key, value: num, unit: key === 'distance' ? 'm' : unit } as SemanticValue
    }
  }

  const num = Number(trimmed)
  if (!isNaN(num)) return { key: 'reps', value: num, unit: 'reps' } as SemanticValue

  return null
}
