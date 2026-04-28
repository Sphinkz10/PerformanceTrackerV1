import { useState } from 'react'

const MOCK_LIBRARY = [
  { id: 'squat', name: 'Back Squat', muscle: ['quad', 'glutes'] },
  { id: 'bench_press', name: 'Bench Press', muscle: ['chest', 'triceps'] },
  { id: 'deadlift', name: 'Deadlift', muscle: ['hamstring', 'back'] },
]

export function ExerciseLibrarySidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, exerciseId: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('exerciseId', exerciseId)
    // Find exercise directly to pass label and muscle data
    const ex = MOCK_LIBRARY.find(e => e.id === exerciseId)
    if (ex) {
      event.dataTransfer.setData('exerciseName', ex.name)
      event.dataTransfer.setData('exerciseMuscle', JSON.stringify(ex.muscle))
    }
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-72 bg-surf-bg border-r border-white/10 p-4 h-full flex flex-col z-10 shrink-0">
      <h3 className="font-display text-white text-lg mb-4">Biblioteca</h3>
      <div className="flex flex-col gap-3">
        {MOCK_LIBRARY.map(ex => (
          <div
            key={ex.id}
            draggable
            onDragStart={(e) => onDragStart(e, 'exerciseNode', ex.id)}
            className="p-3 bg-surf-inner border border-white/10 rounded-xl cursor-grab active:cursor-grabbing hover:border-teal-400/50 transition-colors"
          >
            <span className="text-sm font-label text-white">{ex.name}</span>
            <div className="flex gap-1 mt-2">
              {ex.muscle.map((m, i) => (
                <span key={i} className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
