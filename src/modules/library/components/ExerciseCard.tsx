export function ExerciseCard({ exercise, onSelect }: any) {
  return (
    <div onClick={onSelect} className="surf-inner shadow-surf rounded-2xl p-4 border-l-4 border-teal-500 cursor-pointer hover:scale-[1.02] transition-transform">
      <h3 className="font-display font-semibold">{exercise.name}</h3>
      <div className="flex gap-2 mt-2">
        <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded-full text-xs font-label">{exercise.category}</span>
        <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/50">{exercise.primaryMuscle}</span>
      </div>
    </div>
  )
}
