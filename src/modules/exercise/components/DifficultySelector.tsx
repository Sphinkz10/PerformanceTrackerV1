import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

export function DifficultySelector() {
  const difficulty = useExerciseDraftStore(s => s.draft.difficulty)
  const setDifficulty = useExerciseDraftStore(s => s.setDifficulty)

  return (
    <div>
      <label className="block text-sm text-white/50 mb-2 font-label">Dificuldade</label>
      <div className="flex items-center gap-4">
        <div className="flex gap-3">
          {[1,2,3,4,5].map(level => (
            <button key={level} onClick={() => setDifficulty(level)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                level <= difficulty ? 'bg-teal-500 border-teal-500' : 'bg-transparent border-white/20 hover:border-white/40'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-white/50 font-label">
          {difficulty === 1 ? 'Iniciante' : difficulty === 2 ? 'Básico' : difficulty === 3 ? 'Intermédio' : difficulty === 4 ? 'Avançado' : 'Elite'}
        </span>
      </div>
    </div>
  )
}
