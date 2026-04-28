import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

const icons = ['🏋️', '🏃', '🚴', '🦵', '💪', '🏊', '🧘', '🤸', '🏋️‍♂️', '🧠']

export function IconPicker() {
  const icon = useExerciseDraftStore(s => s.draft.identity.icon)
  const setIdentityField = useExerciseDraftStore(s => s.setIdentityField)

  return (
    <div>
      <label className="block text-sm text-white/50 mb-2 font-label">Ícone</label>
      <div className="flex flex-wrap gap-2">
        {icons.map(i => (
          <button key={i} onClick={() => setIdentityField('icon', i)}
            className={`w-10 h-10 flex items-center justify-center text-lg rounded-xl border transition-colors ${
              icon === i ? 'bg-teal-500/20 border-teal-500/50' : 'border-white/10 hover:border-white/30'
            }`}
          >{i}</button>
        ))}
      </div>
    </div>
  )
}
