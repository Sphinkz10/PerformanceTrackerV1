import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

const categories = [
  { value: 'strength', label: 'Força' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Mobilidade' },
  { value: 'power', label: 'Potência' },
  { value: 'other', label: 'Outro' },
]

export function CategorySelector() {
  const category = useExerciseDraftStore(s => s.draft.identity.category)
  const setIdentityField = useExerciseDraftStore(s => s.setIdentityField)

  return (
    <div>
      <label className="block text-sm text-white/50 mb-2 font-label">Categoria</label>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setIdentityField('category', cat.value as any)}
            className={`px-4 py-2 rounded-full border font-label text-sm transition-all ${
              category === cat.value
                ? 'bg-teal-500/20 text-teal-400 border-teal-500/50'
                : 'border-white/10 text-white/50 hover:border-white/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
