/**
 * Mark Unavailable Modal - Athlete marks unavailable dates (vacation, travel, etc)
 * 
 * Features:
 * - Date range picker (from → to)
 * - Reason selection
 * - Optional: auto-cancel workouts in period
 * - Sends notification to coach
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Quick Actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarX, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MarkUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarkUnavailableModal({ isOpen, onClose }: MarkUnavailableModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [autoCancelWorkouts, setAutoCancelWorkouts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Férias',
    'Viagem',
    'Lesão',
    'Doença',
    'Compromisso Pessoal',
    'Outro',
  ];

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      toast.error('Preenche todos os campos obrigatórios');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('Data final deve ser depois da data inicial');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const message = autoCancelWorkouts
      ? 'Indisponibilidade marcada! Treinos cancelados automaticamente.'
      : 'Indisponibilidade marcada! O teu coach foi notificado.';

    toast.success(message);
    setIsSubmitting(false);
    onClose();

    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
    setAutoCancelWorkouts(false);
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
                  <CalendarX className="h-6 w-6 text-sky-500" />
                  Marcar Indisponibilidade
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Informa o teu coach sobre férias, viagens, etc.
                </p>
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
              {/* Data inicial */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  De <span className="text-sky-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>

              {/* Data final */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Até <span className="text-sky-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>

              {/* Razão */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Razão <span className="text-sky-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                >
                  <option value="">Seleciona a razão</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-cancelar treinos */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCancelWorkouts}
                    onChange={(e) => setAutoCancelWorkouts(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500/30"
                  />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Cancelar treinos automaticamente neste período
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Todos os treinos agendados entre estas datas serão cancelados
                    </p>
                  </div>
                </label>
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
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A marcar...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Marcar Indisponível</span>
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
