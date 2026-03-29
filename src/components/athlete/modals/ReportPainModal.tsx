/**
 * Report Pain Modal - Athlete reports injury or discomfort
 * 
 * Features:
 * - Body region selection
 * - Pain level slider (1-10)
 * - Description textarea
 * - Date picker (when it started)
 * - Sends notification to coach
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Quick Actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReportPainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportPainModal({ isOpen, onClose }: ReportPainModalProps) {
  const [region, setRegion] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bodyRegions = [
    'Ombro Direito',
    'Ombro Esquerdo',
    'Joelho Direito',
    'Joelho Esquerdo',
    'Lombar',
    'Pescoço',
    'Cotovelo Direito',
    'Cotovelo Esquerdo',
    'Punho Direito',
    'Punho Esquerdo',
    'Anca',
    'Tornozelo Direito',
    'Tornozelo Esquerdo',
    'Outro',
  ];

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'emerald';
    if (level <= 6) return 'amber';
    return 'red';
  };

  const handleSubmit = async () => {
    if (!region || !description || !startDate) {
      toast.error('Preenche todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success('Relatório enviado ao teu coach com sucesso!');
    setIsSubmitting(false);
    onClose();

    // Reset form
    setRegion('');
    setPainLevel(5);
    setDescription('');
    setStartDate('');
  };

  const painColor = getPainLevelColor(painLevel);

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
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  Reportar Dor/Lesão
                </h3>
                <p className="text-sm text-slate-600 mt-1">O teu coach será notificado imediatamente</p>
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
              {/* Região do corpo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Região do corpo <span className="text-red-500">*</span>
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all"
                >
                  <option value="">Seleciona a região</option>
                  {bodyRegions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nível de dor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nível de dor (1-10)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span
                    className={`text-2xl font-bold ${
                      painColor === 'emerald'
                        ? 'text-emerald-600'
                        : painColor === 'amber'
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {painLevel}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Leve</span>
                  <span>Moderada</span>
                  <span>Severa</span>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Quando começou? O que estavas a fazer? Como é a dor?"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all resize-none"
                />
              </div>

              {/* Quando começou */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quando começou? <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 transition-all"
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
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:from-red-400 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A enviar...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar ao Coach</span>
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
