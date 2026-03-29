/**
 * SCHEDULE SESSION MODAL
 * Modal para agendar nova sessão de treino
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner@2.0.3';

// For App.tsx compatibility (old modal interface)
export interface SessionData {
  athleteId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  notes?: string;
}

// New modal for AthleteHeader
interface AthleteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
}

export function AthleteScheduleModal({ isOpen, onClose, athleteId, athleteName }: AthleteScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'training',
    date: '',
    time: '',
    duration: '60',
    location: 'Box Principal',
    coach: 'coach-1',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Sessão agendada com sucesso!', {
      description: `${formData.title} para ${athleteName}`,
      duration: 3000
    });

    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      type: 'training',
      date: '',
      time: '',
      duration: '60',
      location: 'Box Principal',
      coach: 'coach-1',
      notes: ''
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agendar Sessão - ${athleteName}`}
      size="lg"
      footer={
        <>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-semibold"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.date || !formData.time}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Agendando...' : 'Agendar Sessão'}
          </motion.button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Título da Sessão *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Treino de Força - Upper Body"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipo de Sessão *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
            >
              <option value="training">Treino</option>
              <option value="game">Jogo</option>
              <option value="rehabilitation">Reabilitação</option>
              <option value="assessment">Avaliação</option>
            </select>
          </div>
        </div>

        {/* Date, Time & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Data *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Hora *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Duração (min)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              min="15"
              step="15"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>
        </div>

        {/* Location & Coach */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Local
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Box Principal"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Coach
            </label>
            <select
              value={formData.coach}
              onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
            >
              <option value="coach-1">Coach João</option>
              <option value="coach-2">Coach Maria</option>
              <option value="coach-3">Coach Pedro</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Notas (opcional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Adicione observações sobre a sessão..."
            rows={3}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
          />
        </div>

        {/* Info Alert */}
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
          <p className="text-sm text-sky-700">
            <span className="font-semibold">💡 Dica:</span> O atleta receberá uma notificação sobre esta sessão agendada.
          </p>
        </div>
      </form>
    </Modal>
  );
}

// Legacy modal for App.tsx compatibility
interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: SessionData) => void;
}

export function ScheduleSessionModal({ isOpen, onClose, onComplete }: ScheduleSessionModalProps) {
  const [formData, setFormData] = useState<SessionData>({
    athleteId: '',
    date: '',
    time: '',
    duration: 60,
    type: 'training',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) {
      onComplete(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Sessão"
      size="lg"
      footer={
        <>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-semibold"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md text-sm font-semibold"
          >
            Agendar
          </motion.button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hora</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}