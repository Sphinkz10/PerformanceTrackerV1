interface Props {
  currentView: 'dashboard' | 'exercise-creator' | 'library' | 'workout-builder'
  onNavigate: (view: 'dashboard' | 'exercise-creator' | 'library' | 'workout-builder') => void
}

export function StudioNav({ currentView, onNavigate }: Props) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: '🏠' },
    { id: 'exercise-creator' as const, label: 'Criador', icon: '🔧' },
    { id: 'workout-builder' as const, label: 'Builder', icon: '🏗️' },
    { id: 'library' as const, label: 'Biblioteca', icon: '📚' },
  ]

  return (
    <nav className="flex gap-1 px-6 py-2 border-b border-white/5 bg-black/20">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`font-label text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            currentView === tab.id
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
          }`}
        >
          <span className="text-xs">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
