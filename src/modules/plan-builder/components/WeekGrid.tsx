import { PlanWeek } from '../store/usePlanStore'
import { calculateWeeklyInjuryRisk } from '../../../engines/plan/injuryPreventionEngine'

interface Props {
  week: PlanWeek
  weekIndex: number
}

export function WeekGrid({ week, weekIndex }: Props) {
  const jointHealth = calculateWeeklyInjuryRisk(week.days)

  return (
    <div className="bg-surf-inner border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-display text-lg">Semana {weekIndex + 1}</h3>
          <div className="flex gap-4 mt-2 text-xs font-label">
            <span className={jointHealth.risks.knee === 'HIGH' ? 'text-red-400' : jointHealth.risks.knee === 'MEDIUM' ? 'text-amber-400' : 'text-teal-400'}>
              Joelho: {jointHealth.load.knee}
            </span>
            <span className={jointHealth.risks.shoulder === 'HIGH' ? 'text-red-400' : jointHealth.risks.shoulder === 'MEDIUM' ? 'text-amber-400' : 'text-teal-400'}>
              Ombro: {jointHealth.load.shoulder}
            </span>
            <span className={jointHealth.risks.spine === 'HIGH' ? 'text-red-400' : 'text-teal-400'}>
              Lombar: {jointHealth.load.spine}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-white/50 text-xs font-label block mb-1">Carga Sistémica</span>
          <span className="text-white font-display text-2xl">{Math.round(week.weeklyLoad)}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {week.days.map((day) => (
          <div key={day.id} className="bg-surf-bg border border-white/5 rounded-xl p-3 min-h-[120px] flex flex-col">
            <span className="text-white/40 text-[10px] font-label uppercase tracking-widest block mb-2">{day.name}</span>
            {day.workoutTemplateId ? (
              <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 p-2 rounded-lg text-xs mt-auto">
                {day.workoutTemplateId.replace(/-/g, ' ')}
              </div>
            ) : (
              <div className="text-white/20 text-xs mt-auto italic text-center">Rest</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
