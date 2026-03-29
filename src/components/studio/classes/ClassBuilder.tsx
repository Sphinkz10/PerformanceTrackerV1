import { motion } from 'motion/react';

interface ClassBuilderProps {
  classData: any;
  onUpdate: (updates: any) => void;
}

export function ClassBuilder({ classData, onUpdate }: ClassBuilderProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-4xl">👥</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Class Builder</h2>
          <p className="text-slate-600 mb-6">
            Criação de aulas em grupo em desenvolvimento
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome da aula"
              value={classData?.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
            />
            
            <textarea
              placeholder="Descrição da aula"
              value={classData?.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
