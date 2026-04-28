import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

const muscles = [
  'Peito', 'Dorsal', 'Ombros', 'Bíceps', 'Tríceps',
  'Core', 'Quadricípites', 'Isquiotibiais', 'Glúteos', 'Gémeos', 'Full Body'
]

export function MuscleGroupGrid() {
  const primary = useExerciseDraftStore(s => s.draft.identity.primaryMuscle)
  const secondary = useExerciseDraftStore(s => s.draft.identity.secondaryMuscles)
  const setIdentityField = useExerciseDraftStore(s => s.setIdentityField)

  const togglePrimary = (muscle: string) => {
    if (muscle === 'Full Body') {
      setIdentityField('primaryMuscle', muscle)
      setIdentityField('secondaryMuscles', [])
    } else {
      setIdentityField('primaryMuscle', primary === muscle ? '' : muscle)
    }
  }

  const toggleSecondary = (muscle: string) => {
    if (primary === 'Full Body' || muscle === 'Full Body') return
    const next = secondary.includes(muscle)
      ? secondary.filter(m => m !== muscle)
      : [...secondary, muscle]
    setIdentityField('secondaryMuscles', next)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm text-white/50 font-label">Grupo Muscular Primário</label>
      <div className="flex flex-wrap gap-2">
        {muscles.map(m => (
          <button key={m} onClick={() => togglePrimary(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-label border transition-colors ${
              primary === m ? 'bg-teal-500/20 text-teal-400 border-teal-500/50' : 'border-white/10 text-white/50 hover:border-white/30'
            }`}
          >{m}</button>
        ))}
      </div>
      {primary !== 'Full Body' && (
        <>
          <label className="block text-sm text-white/50 mt-3 font-label">Secundário</label>
          <div className="flex flex-wrap gap-2">
            {muscles.filter(m => m !== 'Full Body').map(m => (
              <button key={m} onClick={() => toggleSecondary(m)} disabled={m === primary}
                className={`px-3 py-1.5 rounded-full text-xs font-label border transition-colors ${
                  secondary.includes(m)
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                    : m === primary ? 'opacity-30 cursor-not-allowed border-white/5 text-gray-600' : 'border-white/10 text-white/50 hover:border-white/30'
                }`}
              >{m}</button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
