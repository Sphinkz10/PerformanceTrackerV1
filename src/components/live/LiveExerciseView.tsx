import React from 'react';
import { motion } from 'motion/react';
import { Activity, Clock, Repeat, Weight } from 'lucide-react';
import type { LiveExercise } from './types';

interface LiveExerciseViewProps {
  exercise: LiveExercise;
}

export function LiveExerciseView({ exercise }: LiveExerciseViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl mb-2">{exercise.name}</h2>
          {exercise.description && (
            <p className="text-slate-400">{exercise.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-500/50 rounded-full">
          <Activity size={16} className="text-sky-400" />
          <span className="font-semibold text-sm">ATIVO</span>
        </div>
      </div>

      {/* Planned Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Repeat size={16} />
            <span className="text-xs font-medium uppercase">Séries</span>
          </div>
          <div className="font-bold text-2xl">{exercise.planned.sets}</div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Activity size={16} />
            <span className="text-xs font-medium uppercase">Reps</span>
          </div>
          <div className="font-bold text-2xl">{exercise.planned.reps}</div>
        </div>

        {exercise.planned.weight && (
          <div className="bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Weight size={16} />
              <span className="text-xs font-medium uppercase">Peso</span>
            </div>
            <div className="font-bold text-2xl">{exercise.planned.weight}kg</div>
          </div>
        )}

        <div className="bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Clock size={16} />
            <span className="text-xs font-medium uppercase">Descanso</span>
          </div>
          <div className="font-bold text-2xl">{exercise.planned.rest}s</div>
        </div>
      </div>

      {/* Notes */}
      {exercise.planned.notes && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="font-semibold text-amber-400 mb-1 text-sm">📝 Notas do Coach</div>
          <p className="text-slate-300">{exercise.planned.notes}</p>
        </div>
      )}

      {/* Video Preview */}
      {exercise.videoUrl && (
        <div className="mt-6">
          <button className="w-full bg-slate-700 hover:bg-slate-600 rounded-xl p-4 flex items-center justify-center gap-2 font-semibold transition-colors">
            <Activity size={20} />
            Ver Demonstração do Exercício
          </button>
        </div>
      )}
    </motion.div>
  );
}
