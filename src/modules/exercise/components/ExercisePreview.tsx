import { useExerciseDraftStore } from '../store/useExerciseDraftStore'
import { buildExercisePreview } from '../../../engines/previewEngine'

export function ExercisePreview() {
  const draft = useExerciseDraftStore(s => s.draft)
  const preview = buildExercisePreview(draft)

  return (
    <div className="surf-inner shadow-surf rounded-2xl p-6 sticky top-6">
      <h3 className="font-display text-lg font-medium mb-4">Preview</h3>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 flex items-center justify-center text-3xl bg-teal-500/10 rounded-2xl border border-teal-500/20">
          {preview.icon}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">{preview.name || 'Nome do Exercício'}</h2>
          {preview.category && <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded-full text-xs font-label">{preview.category}</span>}
        </div>
      </div>
      {preview.activeFields.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-sm font-label text-white mb-3">Campos Configurados</h4>
          <div className="space-y-2">
            {preview.activeFields.map((f, i) => (
              <div key={i} className="text-sm text-white/50 flex justify-between">
                <span>{f.name}</span>
                <span className="text-white">{f.defaultValue ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
