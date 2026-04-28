import { Handle, Position } from '@xyflow/react'
import { useNodeData } from '../../store/useGraphStore'

export function ExerciseNode({ id, data }: any) {
  // O Node não lê de "data.muscle" localmente mais. Puxa ativo da library!
  const asset = useNodeData(id)

  return (
    <div className="w-[240px] p-4 rounded-xl bg-surf-inner border border-white/10 shadow-surf backdrop-blur-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-teal-400 border-none" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
           <span className="text-white/50 text-sm">🏋️</span>
           <span className="text-white font-display text-sm font-medium">
             {asset ? asset.title : (data.label || 'Asset Inexistente')}
           </span>
        </div>
        <div className="mt-2 flex gap-2">
           <span className="text-[10px] text-teal-400/80 bg-teal-500/10 px-2 py-1 rounded">Risc: {asset?.riskLevel || 'N/A'}</span>
           <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">Stress: {asset?.stressScore || 0}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-400 border-none" />
    </div>
  )
}

