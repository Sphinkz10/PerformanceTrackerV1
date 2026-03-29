import { motion } from 'motion/react';

interface WorkoutBuilderProps {
  workout: any;
  onUpdate: (updates: any) => void;
}

export function WorkoutBuilder({ workout, onUpdate }: WorkoutBuilderProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-4xl">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Workout Builder</h2>
          <p className="text-slate-600 mb-6">
            Construtor avançado de treinos em desenvolvimento
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do treino"
              value={workout?.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
            />
            
            <textarea
              placeholder="Descrição do treino"
              value={workout?.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
            />

            <div className="grid grid-cols-3 gap-4">
              <select
                value={workout?.difficulty || 'intermediate'}
                onChange={(e) => onUpdate({ difficulty: e.target.value })}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none transition-all"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
                <option value="elite">Elite</option>
              </select>

              <input
                type="number"
                placeholder="Duração (min)"
                value={workout?.duration || 60}
                onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none transition-all"
              />

              <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={workout?.tags?.join(', ') || ''}
                onChange={(e) => onUpdate({ tags: e.target.value.split(',').map(t => t.trim()) })}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
