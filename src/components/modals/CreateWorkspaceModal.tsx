import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Building2, Users, MapPin, Globe, Check, Activity, Building } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: WorkspaceData) => void;
}

export interface WorkspaceData {
  name: string;
  description: string;
  type: "team" | "online" | "clinic" | "studio";
  timezone: string;
  measurementSystem: "metric" | "imperial";
  currency: "EUR" | "USD" | "GBP";
}

export function CreateWorkspaceModal({ isOpen, onClose, onComplete }: CreateWorkspaceModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WorkspaceData>({
    name: "",
    description: "",
    type: "team",
    timezone: "Europe/Lisbon",
    measurementSystem: "metric",
    currency: "EUR"
  });

  const workspaceTypes = [
    { id: "team", name: "Equipa Desportiva", icon: Users, color: "emerald", description: "Para clubes e equipas competitivas" },
    { id: "online", name: "Treino Online", icon: Globe, color: "sky", description: "Atletas remotos e coaching digital" },
    { id: "clinic", name: "Clínica/PT", icon: Activity, color: "violet", description: "Treino personalizado e reabilitação" },
    { id: "studio", name: "Studio/Box", icon: Building, color: "amber", description: "Ginásios, CrossFit e studios" }
  ];

  // Helper function for color classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, icon: string, border: string, borderActive: string }> = {
      emerald: {
        bg: "bg-gradient-to-br from-emerald-50 to-white",
        icon: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        border: "border-slate-200",
        borderActive: "border-emerald-400"
      },
      sky: {
        bg: "bg-gradient-to-br from-sky-50 to-white",
        icon: "bg-gradient-to-br from-sky-500 to-sky-600",
        border: "border-slate-200",
        borderActive: "border-sky-400"
      },
      violet: {
        bg: "bg-gradient-to-br from-violet-50 to-white",
        icon: "bg-gradient-to-br from-violet-500 to-violet-600",
        border: "border-slate-200",
        borderActive: "border-violet-400"
      },
      amber: {
        bg: "bg-gradient-to-br from-amber-50 to-white",
        icon: "bg-gradient-to-br from-amber-500 to-amber-600",
        border: "border-slate-200",
        borderActive: "border-amber-400"
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name) {
        toast.error("Nome do workspace é obrigatório");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    onComplete(formData);
    toast.success(`Workspace "${formData.name}" criado com sucesso!`);
    onClose();
    
    // Reset
    setStep(1);
    setFormData({
      name: "",
      description: "",
      type: "team",
      timezone: "Europe/Lisbon",
      measurementSystem: "metric",
      currency: "EUR"
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-semibold text-slate-900">Criar Novo Workspace</h2>
              <p className="text-sm text-slate-600">Passo {step} de 3</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 pt-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s <= step ? "bg-sky-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Workspace *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Equipa A, Atletas Online..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o propósito deste workspace..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Type */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tipo de Workspace
                </label>
                {workspaceTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.id;
                  
                  return (
                    <motion.button
                      key={type.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-12 w-12 rounded-lg ${getColorClasses(type.color).icon} flex items-center justify-center shrink-0`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-slate-900">{type.name}</h3>
                            {isSelected && (
                              <div className={`h-6 w-6 rounded-full bg-${type.color}-500 flex items-center justify-center`}>
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  >
                    <option value="Europe/Lisbon">Europe/Lisbon (GMT+0)</option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="America/New_York">America/New York (GMT-5)</option>
                    <option value="America/Los_Angeles">America/Los Angeles (GMT-8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sistema de Medida
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, measurementSystem: "metric" })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.measurementSystem === "metric"
                          ? "border-sky-500 bg-sky-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-slate-900 text-sm">Métrico</p>
                      <p className="text-xs text-slate-600">kg, cm, km</p>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, measurementSystem: "imperial" })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.measurementSystem === "imperial"
                          ? "border-sky-500 bg-sky-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-slate-900 text-sm">Imperial</p>
                      <p className="text-xs text-slate-600">lbs, inches, miles</p>
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Moeda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
              {step > 1 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Voltar
                </motion.button>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                {step === 3 ? "Criar Workspace" : "Continuar"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}