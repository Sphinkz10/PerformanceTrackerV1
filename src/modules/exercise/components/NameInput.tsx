import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

export function NameInput() {
  const name = useExerciseDraftStore(s => s.draft.identity.name)
  const setIdentityField = useExerciseDraftStore(s => s.setIdentityField)

  return (
    <div>
      <label className="block text-sm text-white/50 mb-1 font-label">Nome do Exercício</label>
      <input
        type="text"
        value={name}
        onChange={e => setIdentityField('name', e.target.value)}
        placeholder="Ex: Back Squat, Corrida Intervalada..."
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-body focus:border-accent-teal outline-none transition-colors"
      />
      {name && name.length < 3 && <p className="text-xs text-red-400 mt-1">Mínimo 3 caracteres.</p>}
    </div>
  )
}
