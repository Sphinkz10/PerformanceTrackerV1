import { useState, lazy, Suspense } from 'react'
import { StudioNav } from './StudioNav'

const ExerciseCreatorPage = lazy(() => import('../exercise/pages/ExerciseCreatorPage'))
const LibraryPage = lazy(() => import('../library/pages/LibraryPage'))
const WorkoutBuilderPage = lazy(() => import('../workout-builder/pages/WorkoutBuilderPage'))

interface Props {
  onBack?: () => void
}

export function StudioShell({ onBack }: Props) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercise-creator' | 'library' | 'workout-builder'>('dashboard')

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="text-white/50 hover:text-white font-label transition-colors">
              ← Voltar
            </button>
          )}
          <span className="font-display text-xl font-semibold">LUNA.OS Studio</span>
        </div>
      </header>
      <StudioNav currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 p-6">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          </div>
        }>
          {currentView === 'dashboard' && (
            <div className="surf-inner shadow-surf rounded-2xl p-8 text-center">
              <p className="text-white/50 font-label">Studio Dashboard — em construção</p>
              <p className="text-white/30 text-sm mt-2">Use as tabs acima para criar exercícios, construir treinos ou navegar na biblioteca.</p>
            </div>
          )}
          {currentView === 'exercise-creator' && <ExerciseCreatorPage />}
          {currentView === 'library' && <LibraryPage />}
          {currentView === 'workout-builder' && <WorkoutBuilderPage />}
        </Suspense>
      </main>
    </div>
  )
}
