import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

interface Props {
  onSave: () => void
  errors: string[]
}

export function ExerciseFormHeader({ onSave, errors }: Props) {
  const meta = useExerciseDraftStore(s => s.meta)
  const name = useExerciseDraftStore(s => s.draft.identity.name)

  return (
    <>
      <div className="flex items-center justify-between py-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl font-semibold">{name || 'Novo Exercício'}</h1>
          {meta.isDirty && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Não guardado" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 font-label">
            {meta.saveStatus === 'saving' ? 'A guardar...' :
             meta.saveStatus === 'saved' ? '✓ Guardado' :
             meta.saveStatus === 'error' ? '✗ Erro' : ''}
          </span>
          <button onClick={onSave} disabled={meta.saveStatus === 'saving'}
            className="bg-teal-500 text-white px-6 py-2 rounded-xl font-label font-medium hover:bg-teal-600 disabled:opacity-50 transition-colors">
            Guardar Rascunho
          </button>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          {errors.map((err, i) => <p key={i} className="text-sm text-red-400">{err}</p>)}
        </div>
      )}
    </>
  )
}
