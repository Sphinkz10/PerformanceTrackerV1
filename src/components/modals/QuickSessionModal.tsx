import { useState } from "react";
import { motion } from "motion/react";
import { X, Play, Users, Clock, Dumbbell, Plus } from "lucide-react";

interface QuickSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (data: {
    athleteIds: string[];
    templateId?: string;
    duration: number;
  }) => void;
}

export function QuickSessionModal({ isOpen, onClose, onCreateSession }: QuickSessionModalProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [duration, setDuration] = useState(60);

  // Mock data
  const frequentAthletes = [
    { id: "1", name: "João Silva", avatar: "JS" },
    { id: "2", name: "Maria Santos", avatar: "MS" },
    { id: "3", name: "Pedro Costa", avatar: "PC" },
    { id: "4", name: "Ana Ferreira", avatar: "AF" },
  ];

  const quickTemplates = [
    { id: "1", name: "Treino Rápido 30min", duration: 30 },
    { id: "2", name: "Força Express", duration: 45 },
    { id: "3", name: "Condicionamento Base", duration: 60 },
    { id: "4", name: "Recuperação Ativa", duration: 30 },
  ];

  const handleSubmit = () => {
    onCreateSession({
      athleteIds: selectedAthletes,
      templateId: selectedTemplate || undefined,
      duration,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900">⚡ Sessão Rápida</h2>
            <p className="text-xs text-slate-500 mt-0.5">Para atletas walk-in</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Atletas */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Atletas
            </label>
            <div className="grid grid-cols-2 gap-2">
              {frequentAthletes.map((athlete) => (
                <motion.button
                  key={athlete.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedAthletes((prev) =>
                      prev.includes(athlete.id)
                        ? prev.filter((id) => id !== athlete.id)
                        : [...prev, athlete.id]
                    );
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    selectedAthletes.includes(athlete.id)
                      ? "border-sky-300 bg-sky-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {athlete.avatar}
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    {athlete.name}
                  </span>
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
            >
              <Plus className="h-3 w-3" />
              Novo Atleta
            </motion.button>
          </div>

          {/* Template */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              Tipo de Treino
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                const template = quickTemplates.find((t) => t.id === e.target.value);
                if (template) setDuration(template.duration);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            >
              <option value="">Selecionar template...</option>
              {quickTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duração */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Duração: {duration} minutos
            </label>
            <div className="flex gap-2">
              {[30, 45, 60, 90].map((min) => (
                <motion.button
                  key={min}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDuration(min)}
                  className={`flex-1 px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
                    duration === min
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md"
                      : "border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                  }`}
                >
                  {min}min
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-slate-200 bg-slate-50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-all"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selectedAthletes.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
            Iniciar Agora
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
