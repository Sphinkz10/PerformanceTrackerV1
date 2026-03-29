/**
 * ADD INJURY MODAL
 * Modal para registar nova lesão
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, AlertCircle, FileText } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner@2.0.3';

interface AddInjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
}

export function AddInjuryModal({ isOpen, onClose, athleteId, athleteName }: AddInjuryModalProps) {
  const [formData, setFormData] = useState({
    bodyPart: '',
    injuryType: 'Strain',
    severity: 'low',
    date: new Date().toISOString().split('T')[0],
    expectedRecoveryDays: '7',
    description: '',
    affectsTraining: true,
    loadModification: '70'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Lesão registada com sucesso!', {
      description: `${formData.bodyPart} - ${formData.injuryType}`,
      duration: 3000
    });

    setIsSubmitting(false);
    onClose();
    
    setFormData({
      bodyPart: '',
      injuryType: 'Strain',
      severity: 'low',
      date: new Date().toISOString().split('T')[0],
      expectedRecoveryDays: '7',
      description: '',
      affectsTraining: true,
      loadModification: '70'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Registar Lesão - ${athleteName}`}
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
            disabled={isSubmitting || !formData.bodyPart || !formData.description}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 transition-all shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registando...' : 'Registar Lesão'}
          </motion.button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Body Part & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Parte do Corpo *
            </label>
            <input
              type="text"
              value={formData.bodyPart}
              onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
              placeholder="Ex: Joelho Direito, Ombro Esquerdo"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipo de Lesão *
            </label>
            <select
              value={formData.injuryType}
              onChange={(e) => setFormData({ ...formData, injuryType: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
            >
              <option value="Strain">Distensão (Strain)</option>
              <option value="Sprain">Entorse (Sprain)</option>
              <option value="Overuse">Sobrecarga (Overuse)</option>
              <option value="Tendinitis">Tendinite</option>
              <option value="Fracture">Fratura</option>
              <option value="Other">Outra</option>
            </select>
          </div>
        </div>

        {/* Severity & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Severidade *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
            >
              <option value="low">Leve</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Data da Lesão *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              required
            />
          </div>
        </div>

        {/* Expected Recovery */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Recuperação Esperada (dias)
          </label>
          <input
            type="number"
            value={formData.expectedRecoveryDays}
            onChange={(e) => setFormData({ ...formData, expectedRecoveryDays: e.target.value })}
            min="1"
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Descrição *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva como ocorreu a lesão e sintomas..."
            rows={3}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
            required
          />
        </div>

        {/* Training Impact */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="affectsTraining"
              checked={formData.affectsTraining}
              onChange={(e) => setFormData({ ...formData, affectsTraining: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-2 focus:ring-sky-500/30"
            />
            <label htmlFor="affectsTraining" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Esta lesão afeta o treino
            </label>
          </div>

          {formData.affectsTraining && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Modificação de Carga (%)
              </label>
              <input
                type="number"
                value={formData.loadModification}
                onChange={(e) => setFormData({ ...formData, loadModification: e.target.value })}
                min="0"
                max="100"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">
                Carga máxima permitida durante recuperação
              </p>
            </motion.div>
          )}
        </div>

        {/* Warning Alert */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">
            <span className="font-semibold">⚠️ Importante:</span> Esta informação será usada para ajustar automaticamente os treinos do atleta.
          </p>
        </div>
      </form>
    </Modal>
  );
}
