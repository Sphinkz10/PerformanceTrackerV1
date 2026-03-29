import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Folder, FileText, Database, BarChart3, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ProjectData) => void;
}

export interface ProjectData {
  name: string;
  description: string;
  type: "analysis" | "dashboard" | "report" | "experiment";
  template?: string;
}

export function CreateProjectModal({ isOpen, onClose, onComplete }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: "",
    description: "",
    type: "analysis",
    template: undefined
  });

  const projectTypes = [
    { 
      id: "analysis" as const, 
      name: "Análise de Dados", 
      icon: Database, 
      description: "Explorar e analisar datasets",
      color: "emerald"
    },
    { 
      id: "dashboard" as const, 
      name: "Dashboard", 
      icon: BarChart3, 
      description: "Visualizar métricas em tempo real",
      color: "sky"
    },
    { 
      id: "prediction" as const, 
      name: "Modelo Preditivo", 
      icon: TrendingUp, 
      description: "Machine learning e previsões",
      color: "violet"
    },
    { 
      id: "report" as const, 
      name: "Relatório Automático", 
      icon: FileText, 
      description: "Gerar reports automatizados",
      color: "amber"
    }
  ];

  // Helper function for color classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, icon: string }> = {
      emerald: {
        bg: "bg-gradient-to-br from-emerald-50 to-white",
        icon: "bg-gradient-to-br from-emerald-500 to-emerald-600"
      },
      sky: {
        bg: "bg-gradient-to-br from-sky-50 to-white",
        icon: "bg-gradient-to-br from-sky-500 to-sky-600"
      },
      violet: {
        bg: "bg-gradient-to-br from-violet-50 to-white",
        icon: "bg-gradient-to-br from-violet-500 to-violet-600"
      },
      amber: {
        bg: "bg-gradient-to-br from-amber-50 to-white",
        icon: "bg-gradient-to-br from-amber-500 to-amber-600"
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  const templates = {
    analysis: [
      "Blank Notebook",
      "Player Performance Analysis",
      "Injury Risk Assessment",
      "Training Load Analysis"
    ],
    dashboard: [
      "Team Overview",
      "Individual Progress",
      "Session Analytics",
      "Custom KPIs"
    ],
    report: [
      "Weekly Summary",
      "Monthly Performance",
      "Season Review",
      "Custom Report"
    ],
    experiment: [
      "A/B Test Template",
      "Intervention Study",
      "Correlation Analysis",
      "Predictive Model"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Nome do projeto é obrigatório");
      return;
    }

    onComplete(formData);
    toast.success(`Projeto "${formData.name}" criado com sucesso!`);
    onClose();
    
    // Reset
    setFormData({
      name: "",
      description: "",
      type: "analysis",
      template: undefined
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
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-semibold text-slate-900">🧪 Novo Projeto</h2>
              <p className="text-sm text-slate-600">Criar projeto de análise ou dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do Projeto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Análise Performance Q1 2024"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Objetivo e contexto do projeto..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Tipo de Projeto *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: type.id, template: undefined })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg ${getColorClasses(type.color).icon} flex items-center justify-center shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm mb-0.5">{type.name}</p>
                          <p className="text-xs text-slate-600">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Template (opcional)
              </label>
              <select
                value={formData.template || ""}
                onChange={(e) => setFormData({ ...formData, template: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
              >
                <option value="">Começar do zero</option>
                {templates[formData.type].map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
              <p className="text-sm text-sky-900 font-medium mb-1">💡 Dica</p>
              <p className="text-xs text-sky-700">
                Pode sempre mudar o tipo e template depois de criar o projeto. Escolha o que melhor se adequa ao seu objetivo inicial.
              </p>
            </div>

          </form>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Criar Projeto
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}