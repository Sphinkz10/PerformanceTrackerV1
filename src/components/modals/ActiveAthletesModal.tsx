import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, Calendar, Activity } from "lucide-react";

interface ActiveAthletesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActiveAthletesModal({ isOpen, onClose }: ActiveAthletesModalProps) {
  const athletes = [
    { 
      id: "1", 
      name: "João Silva", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
      lastSession: "Hoje, 09:00",
      sessionsLast30Days: 12,
      trend: "up"
    },
    { 
      id: "2", 
      name: "Maria Santos", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      lastSession: "Hoje, 10:30",
      sessionsLast30Days: 15,
      trend: "up"
    },
    { 
      id: "3", 
      name: "Pedro Costa", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
      lastSession: "Ontem, 18:00",
      sessionsLast30Days: 10,
      trend: "stable"
    },
    { 
      id: "4", 
      name: "Ana Rodrigues", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      lastSession: "Há 2 dias",
      sessionsLast30Days: 14,
      trend: "up"
    },
    { 
      id: "5", 
      name: "Carlos Mendes", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      lastSession: "Há 3 dias",
      sessionsLast30Days: 8,
      trend: "down"
    },
    { 
      id: "6", 
      name: "Sofia Almeida", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
      lastSession: "Há 5 dias",
      sessionsLast30Days: 11,
      trend: "stable"
    },
    { 
      id: "7", 
      name: "Miguel Ferreira", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miguel",
      lastSession: "Há 1 semana",
      sessionsLast30Days: 6,
      trend: "down"
    },
    { 
      id: "8", 
      name: "Beatriz Lima", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatriz",
      lastSession: "Há 1 semana",
      sessionsLast30Days: 9,
      trend: "stable"
    }
  ];

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
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-white">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">👥 Atletas Ativos</h2>
              <p className="text-sm text-slate-600">Últimos 30 dias • {athletes.length} atletas</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {athletes.map((athlete, index) => (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-200 shrink-0">
                    <img src={athlete.avatar} alt={athlete.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{athlete.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {athlete.lastSession}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {athlete.sessionsLast30Days} sessões
                      </p>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    athlete.trend === "up" 
                      ? "bg-emerald-100" 
                      : athlete.trend === "down"
                      ? "bg-red-100"
                      : "bg-slate-100"
                  }`}>
                    {athlete.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    )}
                    {athlete.trend === "down" && (
                      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                    )}
                    {athlete.trend === "stable" && (
                      <div className="h-0.5 w-3 bg-slate-600 rounded-full" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
