import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, Users, Clock, Send } from "lucide-react";

interface SendFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendFormModal({ isOpen, onClose }: SendFormModalProps) {
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<string[]>([]);
  const [schedule, setSchedule] = useState("now");

  const forms = [
    { id: "wellness", name: "Wellness Check", description: "Sono, fadiga, stress, dor" },
    { id: "injury", name: "Relatório de Lesão", description: "Localização, intensidade, histórico" },
    { id: "readiness", name: "Readiness to Train", description: "Prontidão física e mental" },
    { id: "satisfaction", name: "Satisfação", description: "Feedback sobre treino" },
  ];

  const athletes = [
    { id: "all", name: "Todos os Atletas", count: 24 },
    { id: "group-a", name: "Grupo A - Sénior", count: 12 },
    { id: "group-b", name: "Grupo B - Sub-20", count: 8 },
    { id: "individual", name: "Seleção Individual", count: 0 },
  ];

  const handleSend = () => {
    onClose();
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <Send className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 text-sm">Enviar Questionário</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Selecione o form e destinatários</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Form Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Questionário
                  </label>
                  <div className="space-y-2">
                    {forms.map((form) => (
                      <motion.button
                        key={form.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedForm(form.id)}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                          selectedForm === form.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
                            selectedForm === form.id
                              ? 'bg-gradient-to-br from-sky-500 to-sky-600'
                              : 'bg-slate-100'
                          }`}>
                            <FileText className={`h-4 w-4 ${selectedForm === form.id ? 'text-white' : 'text-slate-600'}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{form.name}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{form.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Target Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Destinatários
                  </label>
                  <div className="space-y-2">
                    {athletes.map((target) => (
                      <motion.button
                        key={target.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          if (selectedTarget.includes(target.id)) {
                            setSelectedTarget(selectedTarget.filter(t => t !== target.id));
                          } else {
                            setSelectedTarget([...selectedTarget, target.id]);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                          selectedTarget.includes(target.id)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                              selectedTarget.includes(target.id)
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                : 'bg-slate-100'
                            }`}>
                              <Users className={`h-4 w-4 ${selectedTarget.includes(target.id) ? 'text-white' : 'text-slate-600'}`} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{target.name}</p>
                              {target.count > 0 && (
                                <p className="text-xs text-slate-600">{target.count} atletas</p>
                              )}
                            </div>
                          </div>
                          {selectedTarget.includes(target.id) && (
                            <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Agendamento
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSchedule("now")}
                      className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                        schedule === "now"
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                      }`}
                    >
                      Enviar Agora
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSchedule("later")}
                      className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                        schedule === "later"
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                      }`}
                    >
                      Agendar
                    </motion.button>
                  </div>
                  
                  {schedule === "later" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="datetime-local"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Summary */}
                {selectedForm && selectedTarget.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200"
                  >
                    <p className="text-xs font-medium text-slate-700 mb-2">Resumo</p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Form:</span> {forms.find(f => f.id === selectedForm)?.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Destinatários:</span> {selectedTarget.length} grupos
                      </p>
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Envio:</span> {schedule === "now" ? "Imediato" : "Agendado"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-200 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  disabled={!selectedForm || selectedTarget.length === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow-md transition-all ${
                    selectedForm && selectedTarget.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  <span>Enviar</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
