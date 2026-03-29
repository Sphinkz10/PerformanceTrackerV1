/**
 * Workout Details Modal - View workout details
 * 
 * Features:
 * - View workout exercises
 * - Sets, reps, weight info
 * - Coach notes
 * - Start workout button
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Workout Details
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, Clock, User, CheckCircle } from 'lucide-react';

interface WorkoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: {
    id: string;
    title: string;
    date: string;
    time: string;
    coach: string;
  } | null;
}

export function WorkoutDetailsModal({ isOpen, onClose, workout }: WorkoutDetailsModalProps) {
  if (!workout) return null;

  // Mock exercises data
  const exercises = [
    {
      id: '1',
      name: 'Bench Press',
      sets: 4,
      reps: '8-10',
      rest: '90s',
      notes: 'Controla a descida, explosivo na subida',
    },
    {
      id: '2',
      name: 'Incline Dumbbell Press',
      sets: 3,
      reps: '10-12',
      rest: '60s',
      notes: 'Foco no pico de contração',
    },
    {
      id: '3',
      name: 'Cable Flyes',
      sets: 3,
      reps: '12-15',
      rest: '45s',
      notes: 'Manter tensão constante',
    },
    {
      id: '4',
      name: 'Tricep Pushdowns',
      sets: 3,
      reps: '12-15',
      rest: '45s',
      notes: 'Cotovelos fixos',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-emerald-50 to-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900">{workout.title}</h2>
                          <p className="text-sm text-slate-600">
                            {workout.date} às {workout.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Coach: {workout.coach}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>~60 min</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                      <X className="h-5 w-5 text-slate-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  <h3 className="font-bold text-slate-900 mb-3">Exercícios</h3>

                  {exercises.map((exercise, idx) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50/50 to-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-white">{idx + 1}</span>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-2">{exercise.name}</h4>

                          <div className="grid grid-cols-3 gap-3 mb-2">
                            <div className="text-center p-2 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-600">Sets</p>
                              <p className="font-bold text-slate-900">{exercise.sets}</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-600">Reps</p>
                              <p className="font-bold text-slate-900">{exercise.reps}</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-600">Rest</p>
                              <p className="font-bold text-slate-900">{exercise.rest}</p>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 italic">💡 {exercise.notes}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Fechar
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Começar Treino
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
