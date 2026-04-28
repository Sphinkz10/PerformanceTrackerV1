export function ExerciseDetailPanel({ exercise, onClose }: any) {
  if (!exercise) return null
  return (
    <div className="fixed inset-y-0 right-0 w-96 surf-inner border-l border-white/10 p-6 shadow-surf z-50">
      <button onClick={onClose} className="text-white/50 hover:text-white mb-4 transition-colors">← Fechar</button>
      <h2 className="font-display text-2xl">{exercise.name}</h2>
      <div className="mt-6 flex gap-3">
        <button className="bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors">Editar</button>
        <button className="border border-white/20 px-4 py-2 rounded-xl text-white hover:bg-white/5 transition-colors">Duplicar</button>
      </div>
    </div>
  )
}
