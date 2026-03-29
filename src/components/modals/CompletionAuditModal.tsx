import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X, Clock, AlertCircle, Star } from "lucide-react";

interface CompletionAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: CompletionData) => void;
  sessionName: string;
  plannedDuration: number; // em minutos
  hasModifications?: boolean;
}

export interface CompletionData {
  actualDuration: number;
  quality: number; // 1-5
  notes: string;
  modifications: string;
}

export function CompletionAuditModal({
  isOpen,
  onClose,
  onComplete,
  sessionName,
  plannedDuration,
  hasModifications = false
}: CompletionAuditModalProps) {
  const [actualDuration, setActualDuration] = useState(plannedDuration.toString());
  const [quality, setQuality] = useState(0);
  const [notes, setNotes] = useState("");
  const [modifications, setModifications] = useState("");

  const handleSubmit = () => {
    if (quality === 0) {
      return; // Qualidade é obrigatória
    }

    onComplete({
      actualDuration: parseInt(actualDuration) || plannedDuration,
      quality,
      notes,
      modifications
    });
    
    // Reset
    setActualDuration(plannedDuration.toString());
    setQuality(0);
    setNotes("");
    setModifications("");
  };

  const isValid = quality > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 my-8"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 mb-1">Completar Sessão</h3>
                  <p className="text-sm text-slate-600">{sessionName}</p>
                  {hasModifications && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg w-fit">
                      <AlertCircle className="h-3 w-3" />
                      <span>Esta sessão teve modificações</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Duração */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duração Efetiva (minutos) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={actualDuration}
                      onChange={(e) => setActualDuration(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      placeholder="60"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Planeado: {plannedDuration} minutos</p>
                </div>

                {/* Qualidade da Sessão */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Qualidade da Sessão *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuality(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= quality
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {quality === 0 && "Selecione uma avaliação"}
                    {quality === 1 && "Muito Fraca"}
                    {quality === 2 && "Fraca"}
                    {quality === 3 && "Aceitável"}
                    {quality === 4 && "Boa"}
                    {quality === 5 && "Excelente"}
                  </p>
                </div>

                {/* Modificações (se aplicável) */}
                {hasModifications && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Modificações Realizadas
                    </label>
                    <textarea
                      value={modifications}
                      onChange={(e) => setModifications(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                      placeholder="Descreva as alterações feitas ao plano original..."
                    />
                  </div>
                )}

                {/* Notas Finais */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notas Finais
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                    placeholder="Performance do atleta, observações, próximos passos..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: isValid ? 1.02 : 1 }}
                  whileTap={{ scale: isValid ? 0.98 : 1 }}
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl text-white shadow-md transition-all ${
                    isValid
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  Completar Sessão
                </motion.button>
              </div>

              {/* Aviso */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-600">
                  ⚠️ Esta ação não pode ser desfeita. A sessão será marcada como completa e bloqueada.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
