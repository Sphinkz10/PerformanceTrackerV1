/**
 * Cancel Workout Modal - Athlete cancels an upcoming workout
 * 
 * Features:
 * - Select workout to cancel
 * - Optional reason
 * - Sends notification to coach
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Quick Actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, XCircle, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CancelWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CancelWorkoutModal({ isOpen, onClose }: CancelWorkoutModalProps) {
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock upcoming workouts
  const upcomingWorkouts = [
    { id: '1', title: 'Upper Body Strength - Hoje 18:00' },
    { id: '2', title: 'Lower Body + Core - Amanhã 10:00' },
    { id: '3', title: 'Full Body Strength - 15 Fev 18:00' },
  ];

  const handleSubmit = async () => {
    if (!selectedWorkout) {
      toast.error('Seleciona o treino que queres cancelar');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success('Treino cancelado! O teu coach foi notificado.');
    setIsSubmitting(false);
    onClose();

    // Reset form
    setSelectedWorkout('');
    setReason('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-amber-500" />
                  Cancelar Treino
                </h3>
                <p className="text-sm text-slate-600 mt-1">O teu coach será notificado</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Selecionar treino */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Qual treino queres cancelar? <span className="text-amber-500">*</span>
                </label>
                <select
                  value={selectedWorkout}
                  onChange={(e) => setSelectedWorkout(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all"
                >
                  <option value="">Seleciona um treino</option>
                  {upcomingWorkouts.map((workout) => (
                    <option key={workout.id} value={workout.id}>
                      {workout.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Razão (opcional) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Razão (opcional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Doente, compromisso inesperado, etc..."
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A cancelar...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Cancelamento</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
