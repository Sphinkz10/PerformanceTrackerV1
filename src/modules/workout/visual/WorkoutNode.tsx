import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { VisualNode } from '../../../domain/workout/visual'
import { motion } from 'framer-motion'

interface Props {
  node: VisualNode
  children?: React.ReactNode
  isOverlay?: boolean
}

export function WorkoutNode({ node, children, isOverlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: node.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const colors: Record<string, string> = {
    exercise: 'border-white/10 bg-surf-inner',
    superset: 'border-teal-500/40 bg-teal-500/10',
    giantset: 'border-orange-500/40 bg-orange-500/10',
    circuit: 'border-purple-500/40 bg-purple-500/10',
    phase: 'border-white/20 bg-white/5 shadow-lg',
  }

  return (
    <motion.div
      id={node.id}
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging && !isOverlay ? 0.3 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={!isDragging && !isOverlay ? { scale: 1.01 } : {}}
      className={`relative z-10 p-4 rounded-xl border flex flex-col ${colors[node.type]} ${isOverlay ? 'cursor-grabbing shadow-surf' : 'cursor-grab'}`}
    >
      <div 
         className="flex items-center justify-between outline-none"
         {...attributes}
         {...listeners}
      >
        <div className="flex items-center gap-3">
           {node.type !== 'exercise' && <span className="text-white/50 text-xs">▼</span>}
           <span className={`font-label text-sm ${node.type === 'exercise' ? 'text-white' : 'text-teal-400 font-semibold'}`}>
             {node.data.label || node.type.toUpperCase()}
           </span>
        </div>

        <span className="text-[10px] uppercase tracking-wider text-secondary px-2 py-1 bg-black/20 rounded-md">
          {node.type}
        </span>
      </div>
      
      {/* Onde os nós filhos (Exercícios dentro de Fases/Supersets) são renderizados */}
      {children}
    </motion.div>
  )
}
