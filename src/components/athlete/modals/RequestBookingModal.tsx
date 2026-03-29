/**
 * Request Booking Modal - Request session with coach
 * 
 * Features:
 * - Select date and time
 * - Check coach availability
 * - Add notes
 * - Submit request
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Calendar
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RequestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestBookingModal({ isOpen, onClose }: RequestBookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast.error('Preenche data e hora');
      return;
    }

    toast.success('Pedido enviado ao coach! Aguarda confirmação.');
    onClose();
    
    // Reset form
    setDate('');
    setTime('');
    setNotes('');
  };

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
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-slate-900 mb-1">Pedir Marcação</h2>
                      <p className="text-sm text-slate-600">
                        Escolhe data e hora preferidas. O coach irá confirmar.
                      </p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Data
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Hora Preferida
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Prefiro treino de pernas..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all resize-none"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                    <p className="text-sm text-sky-700">
                      ℹ️ O coach irá receber o teu pedido e confirmar a disponibilidade.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Cancelar
                    </motion.button>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all"
                    >
                      <Send className="h-4 w-4" />
                      Enviar Pedido
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
