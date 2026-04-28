import { usePlanStore } from '../store/usePlanStore'
import { WeekGrid } from '../components/WeekGrid'

export default function PlanBuilderPage() {
  const { plan, autoMode, toggleAutoMode, coachLogs } = usePlanStore()

  return (
    <div className="h-[calc(100vh-140px)] flex bg-[#09090b]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display text-white mb-2">Digital Twin</h1>
            <p className="text-white/50 text-sm">Projeção da macro-estrutura do teu ciclo de treino.</p>
          </div>
          
          <div>
            <button
              onClick={() => toggleAutoMode('hypertrophy')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
                autoMode 
                  ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' 
                  : 'bg-surf-inner border-white/10 text-white/50 hover:bg-white/5'
              }`}
            >
              <span>🤖 Auto-Pilot (Hypertrophy)</span>
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${autoMode ? 'bg-teal-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {plan.weeks.map((week, index) => (
            <WeekGrid key={week.id} week={week} weekIndex={index} />
          ))}
        </div>
      </div>

      {/* Explanability Dashboard / Coach Logs */}
      {autoMode && (
        <div className="w-80 bg-surf-inner border-l border-white/10 p-6 flex flex-col h-full shrink-0 animate-in slide-in-from-right">
          <h3 className="font-display text-lg text-white mb-6 flex items-center gap-2">
            <span>🧠</span> Lógica da AI
          </h3>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {coachLogs.map(log => (
              <div key={log.id} className="bg-surf-bg border border-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-teal-400 font-label text-xs uppercase tracking-wider">{log.action}</span>
                  <span className="text-white/40 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">SEM {log.weekAffected}</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                  {log.reason}
                </p>
              </div>
            ))}
            
            {coachLogs.length === 0 && (
               <div className="text-center text-white/30 text-sm mt-10">
                 Nenhuma modificação detetada pelo motor de periodização base.
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
