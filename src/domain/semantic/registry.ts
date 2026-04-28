export type SemanticKey =
  | 'weight' | 'reps' | 'sets' | 'rpe'
  | 'distance' | 'duration' | 'heart_rate'
  | 'rest' | 'resistance' | 'tempo' | 'speed'
  | 'percentage'

export type SemanticValue =
  | { key: 'weight' | 'distance' | 'speed'; value: number; unit: 'kg' | 'm' | 'km/h' }
  | { key: 'duration' | 'rest'; value: number; unit: 's' }
  | { key: 'percentage'; value: number; unit: '%' }
  | { key: 'tempo'; value: string; unit: '' }
  | { key: 'reps' | 'sets' | 'rpe' | 'heart_rate'; value: number; unit: 'reps' | 'sets' | '' | 'bpm' }

export type DefaultValue = number | string | undefined

export function toSemanticValue(
  key: SemanticKey,
  rawValue: DefaultValue
): SemanticValue | null {
  if (rawValue === undefined || rawValue === null) return null
  const unit = getUnit(key)
  switch (key) {
    case 'weight':
    case 'distance':
    case 'speed':
      if (typeof rawValue !== 'number') return null
      return { key, value: rawValue, unit: unit as any } as SemanticValue
    case 'duration':
    case 'rest':
      if (typeof rawValue !== 'number') return null
      return { key, value: rawValue, unit: 's' } as SemanticValue
    case 'percentage':
      if (typeof rawValue !== 'number') return null
      return { key, value: rawValue, unit: '%' } as SemanticValue
    case 'tempo':
      if (typeof rawValue !== 'string') return null
      return { key, value: rawValue, unit: '' } as SemanticValue
    case 'reps':
    case 'sets':
    case 'rpe':
    case 'heart_rate':
      if (typeof rawValue !== 'number') return null
      return { key, value: rawValue, unit: unit as any } as SemanticValue
    default:
      return null
  }
}

interface SemanticEntry {
  key: SemanticKey
  aliases: string[]
  unit: string
  valueType: 'number' | 'time' | 'percentage' | 'text'
}

const registry: SemanticEntry[] = [
  { key: 'weight', aliases: ['peso', 'carga', 'load', 'kg'], unit: 'kg', valueType: 'number' },
  { key: 'reps', aliases: ['reps', 'repetições', 'rep'], unit: 'reps', valueType: 'number' },
  { key: 'sets', aliases: ['sets', 'séries', 'series'], unit: 'sets', valueType: 'number' },
  { key: 'rpe', aliases: ['rpe', 'esforço', 'perceção'], unit: '', valueType: 'number' },
  { key: 'percentage', aliases: ['%rm', 'percentagem', 'percentage', '%'], unit: '%', valueType: 'percentage' },
  { key: 'distance', aliases: ['distância', 'distancia', 'km', 'metros', 'm'], unit: 'm', valueType: 'number' },
  { key: 'duration', aliases: ['duração', 'tempo', 'minutos', 'min', 's'], unit: 's', valueType: 'time' },
  { key: 'heart_rate', aliases: ['fc', 'heart rate', 'pulsação', 'bpm'], unit: 'bpm', valueType: 'number' },
  { key: 'rest', aliases: ['descanso', 'rest', 'pausa'], unit: 's', valueType: 'time' },
  { key: 'resistance', aliases: ['resistência', 'banda', 'band', 'elástico'], unit: '', valueType: 'number' },
  { key: 'tempo', aliases: ['tempo', 'cadência', 'cadencia'], unit: '', valueType: 'text' },
  { key: 'speed', aliases: ['velocidade', 'speed'], unit: 'km/h', valueType: 'number' },
]

const aliasMap = new Map<string, SemanticKey>()
registry.forEach(entry => {
  entry.aliases.forEach(alias => {
    const key = alias.toLowerCase()
    if (!aliasMap.has(key)) aliasMap.set(key, entry.key)
  })
})

export function resolveSemanticKey(name: string): SemanticKey | null {
  const lower = name.toLowerCase().trim()
  if (!lower) return null
  if (aliasMap.has(lower)) return aliasMap.get(lower)!

  for (const [alias, key] of aliasMap) {
    const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i')
    if (regex.test(lower)) return key
  }
  return null
}

export function resolveSemanticKeyFromUnit(unit: string): SemanticKey | null {
  const lower = unit.toLowerCase().trim()
  for (const entry of registry) {
    if (entry.unit.toLowerCase() === lower) return entry.key
  }
  return resolveSemanticKey(lower)
}

export function getUnit(key: SemanticKey): string {
  return registry.find(e => e.key === key)?.unit ?? ''
}

export function buildFieldMap(
  baseFields: { id: string; semanticKey?: SemanticKey }[],
  customFields: { id: string; semanticKey?: SemanticKey }[]
): Record<string, SemanticKey> {
  const map: Record<string, SemanticKey> = {}
  baseFields.forEach(f => { if (f.semanticKey) map[f.id] = f.semanticKey })
  customFields.forEach(f => { if (f.semanticKey) map[f.id] = f.semanticKey })
  return Object.freeze(map)  // Imutável após criação
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
