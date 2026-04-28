import { useState } from 'react'
import type { FieldType, FieldDefinition } from '../../../domain/exercise/entities'
import { useExerciseDraftStore } from '../store/useExerciseDraftStore'
import { validateField } from '../../../domain/exercise/validators'

interface Props { onClose: () => void }

export function FieldBuilder({ onClose }: Props) {
  const addCustomField = useExerciseDraftStore(s => s.addCustomField)
  const [name, setName] = useState('')
  const [type, setType] = useState<FieldType>('number')
  const [unit, setUnit] = useState('')
  const [min, setMin] = useState<number | undefined>()
  const [max, setMax] = useState<number | undefined>()
  const [options, setOptions] = useState<string[]>([])
  const [optionInput, setOptionInput] = useState('')
  const [required, setRequired] = useState(false)
  const [defaultValue, setDefaultValue] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    const field: FieldDefinition = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      type,
      unit: unit || undefined,
      min, max,
      options: type === 'options' ? options : undefined,
      required,
      defaultValue: defaultValue || undefined,
    }
    const validation = validateField(field, field.defaultValue)
    if (!validation.isValid) return
    addCustomField(field)
    onClose()
  }

  return (
    <div className="surf-inner border border-white/10 rounded-2xl p-4 space-y-4 shadow-surf">
      <h4 className="font-label text-white text-sm">Novo Campo</h4>
      <input type="text" placeholder="Nome do campo" value={name} onChange={e => setName(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-teal-500 transition-colors" />
      <div>
        <label className="text-xs text-white/40 mb-1 block font-label">Tipo</label>
        <div className="flex flex-wrap gap-2">
          {(['number','text','percentage','options'] as FieldType[]).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-3 py-1 rounded-full text-xs font-label border ${type===t?'bg-teal-500/20 text-teal-400 border-teal-500/50':'border-white/10 text-white/50'}`}
            >{t==='number'?'Número':t==='text'?'Texto':t==='percentage'?'Percentagem':'Opções'}</button>
          ))}
        </div>
      </div>
      {(type==='number'||type==='percentage') && (
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-white/40 block mb-1 font-label">Unidade</label><input type="text" placeholder="kg,s,reps" value={unit} onChange={e=>setUnit(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none" /></div>
          <div className="flex gap-2">
            <div><label className="text-xs text-white/40 block mb-1 font-label">Min</label><input type="number" value={min??''} onChange={e=>setMin(e.target.value?Number(e.target.value):undefined)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none" /></div>
            <div><label className="text-xs text-white/40 block mb-1 font-label">Max</label><input type="number" value={max??''} onChange={e=>setMax(e.target.value?Number(e.target.value):undefined)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none" /></div>
          </div>
        </div>
      )}
      {type==='options' && (
        <div>
          <label className="text-xs text-white/40 block mb-1 font-label">Opções</label>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Adicionar opção" value={optionInput} onChange={e=>setOptionInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(optionInput.trim()){setOptions([...options,optionInput.trim()]);setOptionInput('')}}}}
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none" />
            <button onClick={()=>{if(optionInput.trim()){setOptions([...options,optionInput.trim()]);setOptionInput('')}}} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-xl text-sm font-label">+</button>
          </div>
          <div className="flex flex-wrap gap-1">{options.map(o=><span key={o} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/50 flex items-center gap-1">{o}<button onClick={()=>setOptions(options.filter(x=>x!==o))} className="text-red-400">×</button></span>)}</div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-white/50 font-label"><input type="checkbox" checked={required} onChange={e=>setRequired(e.target.checked)} className="accent-teal-500" /> Obrigatório</label>
        <input type="text" placeholder="Valor padrão" value={defaultValue} onChange={e=>setDefaultValue(e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">Cancelar</button>
        <button onClick={handleAdd} disabled={!name.trim()} className="px-4 py-2 bg-teal-500 text-white rounded-xl text-sm font-label disabled:opacity-50 transition-colors hover:bg-teal-600">Adicionar</button>
      </div>
    </div>
  )
}
