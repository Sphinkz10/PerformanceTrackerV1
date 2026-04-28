import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

export function DescriptionArea() {
  const description = useExerciseDraftStore(s => s.draft.identity.description)
  const setIdentityField = useExerciseDraftStore(s => s.setIdentityField)

  return (
    <div>
      <label className="block text-sm text-white/50 mb-1 font-label">Descrição</label>
      <textarea
        value={description}
        onChange={e => setIdentityField('description', e.target.value)}
        placeholder="Instruções, notas técnicas..."
        rows={3}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-body focus:border-teal-500 outline-none resize-none transition-colors"
      />
    </div>
  )
}
