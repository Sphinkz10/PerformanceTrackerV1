import { motion } from 'motion/react';

interface ExerciseCreatorProps {
  exercise: any;
  onUpdate: (updates: any) => void;
}

export function ExerciseCreator({ exercise, onUpdate }: ExerciseCreatorProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-4xl">🏋️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Exercise Creator</h2>
          <p className="text-slate-600 mb-6">
            Criação avançada de exercícios em desenvolvimento
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do exercício"
              value={exercise?.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
            />
            
            <textarea
              placeholder="Descrição do exercício"
              value={exercise?.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={exercise?.category || 'strength'}
                onChange={(e) => onUpdate({ category: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:outline-none transition-all"
              >
                <option value="strength">Força</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidade</option>
                <option value="mobility">Mobilidade</option>
              </select>

              <select
                value={exercise?.difficulty || 'intermediate'}
                onChange={(e) => onUpdate({ difficulty: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:outline-none transition-all"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
                <option value="elite">Elite</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
