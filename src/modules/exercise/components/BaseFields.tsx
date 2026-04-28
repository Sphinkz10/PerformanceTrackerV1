import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

const baseLabels: Record<string, string> = {
  sets: 'Sets', reps: 'Repetições', weight: 'Peso', percentage: '%RM',
  rpe: 'RPE', rest: 'Descanso', duration: 'Duração', distance: 'Distância',
  heart_rate: 'FC Alvo', hold: 'Tempo de Pausa',
}

export function BaseFields() {
  const baseFields = useExerciseDraftStore(s => s.draft.baseFields)
  const toggleBaseField = useExerciseDraftStore(s => s.toggleBaseField)
  const updateBaseFieldDefault = useExerciseDraftStore(s => s.updateBaseFieldDefault)

  return (
    <div className="space-y-3">
      {baseFields.map(field => (
        <div key={field.id} className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3 border border-white/5">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{baseLabels[field.id] || field.id}</p>
            <p className="text-xs text-white/40">{field.semanticKey ?? 'Número'}</p>
          </div>
          <div className="flex items-center gap-3">
            {field.enabled && (
              <input
                type="text"
                value={field.defaultValue ?? ''}
                onChange={e => updateBaseFieldDefault(field.id, e.target.value)}
                className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center"
              />
            )}
            <button onClick={() => toggleBaseField(field.id)}
              className={`w-10 h-5 rounded-full relative transition-colors ${field.enabled ? 'bg-teal-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${field.enabled ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
