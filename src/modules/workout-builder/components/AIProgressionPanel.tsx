import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useWorkoutBuilderStore } from '../store/useWorkoutBuilderStore'

/** 
 * AI Progression Engine — calculates smart progression recommendations
 * based on workout structure, volume, and intensity patterns.
 *
 * Note: This is a local heuristic engine. In the future,
 * integrate with a server-side ML model for athlete-specific recommendations.
 */

interface Recommendation {
  id: string
  type: 'volume' | 'intensity' | 'deload' | 'balance'
  title: string
  description: string
  confidence: number
  action?: () => void
}

export function AIProgressionPanel() {
  const phases = useWorkoutBuilderStore(s => s.phases)
  const [isOpen, setIsOpen] = useState(false)

  const totalExercises = phases.reduce((sum, p) => {
    return sum + p.blocks.reduce((bSum, b) => {
      if (b.type === 'exercise') return bSum + 1
      return bSum + b.exercises.length
    }, 0)
  }, 0)

  const recommendations = generateRecommendations(phases, totalExercises)

  if (phases.length === 0) return null

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl text-xs font-label text-violet-300 hover:border-violet-500/40 transition-colors"
      >
        <span className="text-sm">🧠</span>
        <span>IA</span>
        {recommendations.length > 0 && (
          <span className="w-4 h-4 bg-violet-500 rounded-full text-[9px] text-white flex items-center justify-center font-semibold">
            {recommendations.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#111114] border border-white/[0.08] rounded-2xl p-4 shadow-2xl z-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧠</span>
              <h3 className="font-label text-sm text-white font-medium">Motor de Progressão</h3>
            </div>
            {recommendations.length === 0 ? (
              <p className="text-white/30 text-xs font-label">Sem recomendações por agora. Adiciona mais exercícios.</p>
            ) : (
              <div className="space-y-2">
                {recommendations.map(rec => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TypeBadge type={rec.type} />
                      <span className="text-white text-xs font-medium">{rec.title}</span>
                      <span className="ml-auto text-[10px] text-white/20 font-label">
                        {Math.round(rec.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-white/40 text-[11px] leading-relaxed">{rec.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TypeBadge({ type }: { type: Recommendation['type'] }) {
  const styles: Record<string, string> = {
    volume: 'bg-blue-500/15 text-blue-400',
    intensity: 'bg-orange-500/15 text-orange-400',
    deload: 'bg-green-500/15 text-green-400',
    balance: 'bg-amber-500/15 text-amber-400',
  }
  const labels: Record<string, string> = {
    volume: 'Volume',
    intensity: 'Intensidade',
    deload: 'Deload',
    balance: 'Equilíbrio',
  }

  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-label font-semibold ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

function generateRecommendations(phases: any[], totalExercises: number): Recommendation[] {
  const recs: Recommendation[] = []

  // Volume check
  if (totalExercises > 12) {
    recs.push({
      id: 'high-volume',
      type: 'volume',
      title: 'Volume Elevado',
      description: `${totalExercises} exercícios é um volume alto. Considera dividir em sessões separadas ou reduzir para 8-10 exercícios.`,
      confidence: 0.85,
    })
  } else if (totalExercises < 4 && totalExercises > 0) {
    recs.push({
      id: 'low-volume',
      type: 'volume',
      title: 'Volume Baixo',
      description: 'Apenas ' + totalExercises + ' exercícios. Adiciona 2-3 exercícios acessórios para maior estímulo muscular.',
      confidence: 0.7,
    })
  }

  // Phase balance check
  if (phases.length >= 2) {
    const blockCounts = phases.map(p => p.blocks.length)
    const maxBlocks = Math.max(...blockCounts)
    const minBlocks = Math.min(...blockCounts)
    if (maxBlocks > 0 && minBlocks === 0) {
      recs.push({
        id: 'empty-phase',
        type: 'balance',
        title: 'Fase Vazia',
        description: 'Existem fases sem exercícios. Remove as fases vazias ou redistribui os exercícios.',
        confidence: 0.9,
      })
    }
    if (maxBlocks > minBlocks * 3 && minBlocks > 0) {
      recs.push({
        id: 'unbalanced',
        type: 'balance',
        title: 'Fases Desbalanceadas',
        description: 'Grande diferença de volume entre fases. Equilibra o número de exercícios para melhor gestão de fadiga.',
        confidence: 0.6,
      })
    }
  }

  // Deload suggestion
  if (phases.length >= 3 && totalExercises >= 10) {
    recs.push({
      id: 'deload-hint',
      type: 'deload',
      title: 'Considerar Deload',
      description: 'Treino de alta complexidade. Se aplicado 3-4x/semana, planeia uma semana de deload a cada 4 semanas.',
      confidence: 0.55,
    })
  }

  return recs
}
