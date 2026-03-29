import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, Calendar, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ContextSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  onGenerate: (context: ReportContext) => void;
}

interface ReportContext {
  athletes: string[];
  metrics: string[];
  period: string;
  goal?: string;
}

const ATHLETES = [
  { id: "1", name: "João Silva", avatar: "JS", status: "active" },
  { id: "2", name: "Maria Santos", avatar: "MS", status: "active" },
  { id: "3", name: "Pedro Costa", avatar: "PC", status: "active" },
  { id: "4", name: "Ana Rodrigues", avatar: "AR", status: "recovering" },
  { id: "5", name: "Carlos Mendes", avatar: "CM", status: "active" }
];

const METRICS = [
  { id: "força", label: "Força", icon: "💪" },
  { id: "velocidade", label: "Velocidade", icon: "⚡" },
  { id: "potência", label: "Potência", icon: "🚀" },
  { id: "resistência", label: "Resistência", icon: "🏃" },
  { id: "wellness", label: "Wellness", icon: "❤️" },
  { id: "aderência", label: "Aderência", icon: "✅" }
];

const PERIODS = [
  { id: "1w", label: "Última semana", desc: "7 dias" },
  { id: "2w", label: "Últimas 2 semanas", desc: "14 dias" },
  { id: "1m", label: "Último mês", desc: "30 dias" },
  { id: "3m", label: "Últimos 3 meses", desc: "90 dias", recommended: true },
  { id: "6m", label: "Últimos 6 meses", desc: "180 dias" },
  { id: "custom", label: "Personalizado", desc: "Escolher datas" }
];

const GOALS = [
  { id: "competition", label: "Preparação para Competição", icon: "🏆" },
  { id: "recovery", label: "Recuperação de Lesão", icon: "🩹" },
  { id: "maintenance", label: "Manutenção", icon: "📊" },
  { id: "peaking", label: "Pico de Performance", icon: "📈" }
];

export function ContextSelectionModal({ isOpen, onClose, question, onGenerate }: ContextSelectionModalProps) {
  const [step, setStep] = useState(1);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("3m");
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const handleAthleteToggle = (id: string) => {
    setSelectedAthletes(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleMetricToggle = (id: string) => {
    setSelectedMetrics(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedAthletes.length === 0) {
      toast.error("Selecione pelo menos um atleta");
      return;
    }

    const context: ReportContext = {
      athletes: selectedAthletes,
      metrics: selectedMetrics.length > 0 ? selectedMetrics : ["força", "velocidade", "potência"],
      period: selectedPeriod,
      goal: selectedGoal
    };

    toast.success("Gerando relatório personalizado...");
    onGenerate(context);
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return selectedAthletes.length > 0;
    if (step === 2) return true; // Métricas são opcionais
    if (step === 3) return selectedPeriod !== "";
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-sky-50 to-emerald-50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="font-bold text-slate-900 text-lg mb-1">{question}</h2>
                <p className="text-sm text-slate-600">Configure o contexto para análise personalizada</p>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2">
              {[
                { num: 1, label: "Atletas" },
                { num: 2, label: "Métricas" },
                { num: 3, label: "Período" },
                { num: 4, label: "Objetivo" }
              ].map((s) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className={`flex items-center gap-2 flex-1 ${step >= s.num ? "opacity-100" : "opacity-40"}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step === s.num
                        ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white scale-110"
                        : step > s.num
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {step > s.num ? <CheckCircle className="h-4 w-4" /> : s.num}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{s.label}</span>
                  </div>
                  {s.num < 4 && <div className="h-0.5 w-8 bg-slate-200 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-250px)]">
            <AnimatePresence mode="wait">
              {/* STEP 1: Atletas */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Quem deseja analisar?</h3>
                    <button
                      onClick={() => {
                        if (selectedAthletes.length === ATHLETES.length) {
                          setSelectedAthletes([]);
                        } else {
                          setSelectedAthletes(ATHLETES.map(a => a.id));
                        }
                      }}
                      className="text-sm font-medium text-sky-600 hover:text-sky-700"
                    >
                      {selectedAthletes.length === ATHLETES.length ? "Desmarcar todos" : "Selecionar todos"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ATHLETES.map((athlete) => (
                      <motion.button
                        key={athlete.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAthleteToggle(athlete.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedAthletes.includes(athlete.id)
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-sky-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold">
                            {athlete.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{athlete.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{athlete.status}</p>
                          </div>
                          {selectedAthletes.includes(athlete.id) && (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Métricas */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Quais métricas analisar?</h3>
                    <p className="text-sm text-slate-600">Deixe vazio para incluir todas automaticamente</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {METRICS.map((metric) => (
                      <motion.button
                        key={metric.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMetricToggle(metric.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMetrics.includes(metric.id)
                            ? "border-sky-300 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-sky-200"
                        }`}
                      >
                        <div className="text-3xl mb-2">{metric.icon}</div>
                        <p className="font-semibold text-sm text-slate-900">{metric.label}</p>
                        {selectedMetrics.includes(metric.id) && (
                          <CheckCircle className="h-4 w-4 text-sky-600 mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Período */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-slate-900">Qual período analisar?</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PERIODS.map((period) => (
                      <motion.button
                        key={period.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPeriod(period.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                          selectedPeriod === period.id
                            ? "border-violet-300 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-200"
                        }`}
                      >
                        {period.recommended && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                            Recomendado
                          </div>
                        )}
                        <p className="font-semibold text-slate-900 mb-1">{period.label}</p>
                        <p className="text-xs text-slate-500">{period.desc}</p>
                        {selectedPeriod === period.id && (
                          <CheckCircle className="h-4 w-4 text-violet-600 mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Objetivo */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Qual o objetivo? (Opcional)</h3>
                    <p className="text-sm text-slate-600">Ajuda a personalizar insights e sugestões</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GOALS.map((goal) => (
                      <motion.button
                        key={goal.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedGoal === goal.id
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-emerald-200"
                        }`}
                      >
                        <div className="text-3xl mb-2">{goal.icon}</div>
                        <p className="font-semibold text-sm text-slate-900">{goal.label}</p>
                        {selectedGoal === goal.id && (
                          <CheckCircle className="h-4 w-4 text-emerald-600 mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedGoal("")}
                    className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 text-sm font-medium text-slate-600 hover:text-slate-700 transition-all"
                  >
                    Pular esta etapa (objetivo geral)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Passo {step} de 4
            </div>
            <div className="flex gap-2">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Voltar
                </motion.button>
              )}
              {step < 4 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  Gerar Relatório Inteligente
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
