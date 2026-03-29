/**
 * Add Event Modal - Add vacation, competition, or exam
 * 
 * Features:
 * - Add different event types
 * - Date range for vacations
 * - Details and notes
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Calendar
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Trophy, BookOpen, Plane, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: 'vacation' | 'competition' | 'exam' | null;
}

export function AddEventModal({ isOpen, onClose, eventType }: AddEventModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const eventConfig = {
    vacation: {
      icon: Plane,
      title: 'Marcar Férias',
      color: 'sky',
      placeholder: 'Ex: Férias de Verão',
    },
    competition: {
      icon: Trophy,
      title: 'Adicionar Competição',
      color: 'violet',
      placeholder: 'Ex: Campeonato Nacional',
    },
    exam: {
      icon: BookOpen,
      title: 'Marcar Exame',
      color: 'amber',
      placeholder: 'Ex: Exame de Física',
    },
  };

  const config = eventType ? eventConfig[eventType] : null;
  const Icon = config?.icon || Calendar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !title) {
      toast.error('Preenche data e título');
      return;
    }

    const eventTypeLabel = eventType === 'vacation' ? 'Férias' : eventType === 'competition' ? 'Competição' : 'Exame';
    toast.success(`${eventTypeLabel} adicionado com sucesso!`);
    onClose();
    
    // Reset form
    setStartDate('');
    setEndDate('');
    setTitle('');
    setNotes('');
  };

  if (!config) return null;

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
                <div className={`p-6 border-b border-slate-200 bg-gradient-to-br from-${config.color}-50 to-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-${config.color}-500 to-${config.color}-600 flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900">{config.title}</h2>
                        <p className="text-sm text-slate-600">
                          Adiciona ao teu calendário
                        </p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={config.placeholder}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                      required
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {eventType === 'vacation' ? 'Data de Início' : 'Data'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* End Date (only for vacations) */}
                  {eventType === 'vacation' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Data de Fim (opcional)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Detalhes adicionais..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all resize-none"
                    />
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
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white shadow-lg shadow-${config.color}-500/30 hover:from-${config.color}-400 hover:to-${config.color}-500 transition-all`}
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
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
