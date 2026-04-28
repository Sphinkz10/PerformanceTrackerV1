import { useExerciseDraftStore } from '../store/useExerciseDraftStore'

const items = ['Barra', 'Halteres', 'Máquina', 'Cabo', 'Kettlebell', 'Banda', 'Peso Corporal', 'Outro']

export function EquipmentSelector() {
  const equipment = useExerciseDraftStore(s => s.draft.identity.equipment)
  const setIdentityField = useExerciseDraftStore(s => s.setIdentityField)

  const toggle = (item: string) => {
    const next = equipment.includes(item) ? equipment.filter(e => e !== item) : [...equipment, item]
    setIdentityField('equipment', next)
  }

  return (
    <div>
      <label className="block text-sm text-white/50 mb-2 font-label">Equipamento</label>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button key={item} onClick={() => toggle(item)}
            className={`px-3 py-1.5 rounded-full text-xs font-label border transition-colors ${
              equipment.includes(item) ? 'bg-teal-500/20 text-teal-400 border-teal-500/50' : 'border-white/10 text-white/50 hover:border-white/30'
            }`}
          >{item}</button>
        ))}
      </div>
    </div>
  )
}
