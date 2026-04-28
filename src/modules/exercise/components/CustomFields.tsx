import { useState } from 'react'
import { useExerciseDraftStore } from '../store/useExerciseDraftStore'
import { FieldBuilder } from './FieldBuilder'

export function CustomFields() {
  const fields = useExerciseDraftStore(s => s.draft.customFields)
  const removeCustomField = useExerciseDraftStore(s => s.removeCustomField)
  const [showBuilder, setShowBuilder] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-white/50 font-label">Campos Personalizados</h3>
        <button onClick={() => setShowBuilder(!showBuilder)} className="text-teal-400 text-sm font-label hover:underline">
          + Adicionar Campo
        </button>
      </div>
      {fields.length > 0 && (
        <div className="space-y-2 mb-4">
          {fields.map(field => (
            <div key={field.id} className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3 border border-white/5">
              <div>
                <p className="text-white text-sm">{field.name}</p>
                <p className="text-xs text-white/40">{field.type} {field.unit && `· ${field.unit}`}</p>
              </div>
              <button onClick={() => removeCustomField(field.id)} className="text-red-400 text-sm hover:text-red-300 transition-colors">Remover</button>
            </div>
          ))}
        </div>
      )}
      {showBuilder && <FieldBuilder onClose={() => setShowBuilder(false)} />}
    </div>
  )
}
