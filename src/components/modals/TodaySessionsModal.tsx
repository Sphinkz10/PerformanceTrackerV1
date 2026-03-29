import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Users, MapPin, Play } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TodaySessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession?: (sessionId: string) => void;
}

export function TodaySessionsModal({ isOpen, onClose, onStartSession }: TodaySessionsModalProps) {
  const sessions = [
    {
      id: "s1",
      time: "09:00",
      title: "Treino de Força - Grupo A",
      template: "Full Body Strength A",
      athletes: 8,
      location: "Sala Principal",
      status: "in-progress" as const,
      color: "emerald"
    },
    {
      id: "s2",
      time: "10:30",
      title: "HIIT Session",
      template: "HIIT Metcon Circuit",
      athletes: 12,
      location: "Studio Outdoor",
      status: "scheduled" as const,
      color: "sky"
    },
    {
      id: "s3",
      time: "14:00",
      title: "Upper Body Hypertrophy",
      template: "Upper Body Hypertrophy",
      athletes: 6,
      location: "Sala Principal",
      status: "scheduled" as const,
      color: "violet"
    },
    {
      id: "s4",
      time: "16:00",
      title: "Conditioning",
      template: "Conditioning EMOM 20min",
      athletes: 10,
      location: "Studio Outdoor",
      status: "scheduled" as const,
      color: "amber"
    },
    {
      id: "s5",
      time: "18:00",
      title: "Recovery & Mobility",
      template: "Recovery & Mobility",
      athletes: 5,
      location: "Sala Privada",
      status: "scheduled" as const,
      color: "sky"
    },
    {
      id: "s6",
      time: "19:30",
      title: "Treino de Força - Grupo B",
      template: "Full Body Strength A",
      athletes: 9,
      location: "Sala Principal",
      status: "scheduled" as const,
      color: "emerald"
    }
  ];

  // Helper function for color classes
  const getColorClasses = (color: string, status: string) => {
    const colorMap: Record<string, { bg: string, time: string, border: string, borderActive: string, shadowActive: string }> = {
      emerald: {
        bg: "bg-gradient-to-br from-emerald-50 to-white",
        time: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        border: "border-emerald-200",
        borderActive: "border-emerald-400",
        shadowActive: "shadow-lg shadow-emerald-500/20"
      },
      sky: {
        bg: "bg-gradient-to-br from-sky-50 to-white",
        time: "bg-gradient-to-br from-sky-500 to-sky-600",
        border: "border-sky-200",
        borderActive: "border-sky-400",
        shadowActive: "shadow-lg shadow-sky-500/20"
      },
      violet: {
        bg: "bg-gradient-to-br from-violet-50 to-white",
        time: "bg-gradient-to-br from-violet-500 to-violet-600",
        border: "border-violet-200",
        borderActive: "border-violet-400",
        shadowActive: "shadow-lg shadow-violet-500/20"
      },
      amber: {
        bg: "bg-gradient-to-br from-amber-50 to-white",
        time: "bg-gradient-to-br from-amber-500 to-amber-600",
        border: "border-amber-200",
        borderActive: "border-amber-400",
        shadowActive: "shadow-lg shadow-amber-500/20"
      }
    };
    const classes = colorMap[color] || colorMap.sky;
    const borderClass = status === "in-progress" ? classes.borderActive : classes.border;
    const shadowClass = status === "in-progress" ? classes.shadowActive : "";
    return { ...classes, borderClass, shadowClass };
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
          className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">📅 Sessões de Hoje</h2>
              <p className="text-sm text-slate-600">{sessions.length} sessões agendadas</p>
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
              {sessions.map((session, index) => {
                const colorClasses = getColorClasses(session.color, session.status);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl border-2 ${colorClasses.bg} p-4 hover:shadow-md transition-all ${colorClasses.borderClass} ${colorClasses.shadowClass}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Time */}
                      <div className={`h-16 w-16 rounded-xl ${colorClasses.time} flex flex-col items-center justify-center shrink-0 text-white`}>
                        <span className="text-xs font-medium opacity-90">
                          {session.time.split(':')[0] < '12' ? 'AM' : 'PM'}
                        </span>
                        <span className="font-bold">{session.time}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-0.5">{session.title}</h4>
                            <p className="text-xs text-slate-600">{session.template}</p>
                          </div>
                          {session.status === "in-progress" && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-600 text-white animate-pulse">
                              Em curso
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.athletes} atletas
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (onStartSession) {
                                onStartSession(session.id);
                                onClose();
                              }
                            }}
                            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg ${
                              session.status === "in-progress"
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                            } transition-all`}
                          >
                            <Play className="h-3 w-3" />
                            {session.status === "in-progress" ? "Continuar" : "Iniciar"}
                          </motion.button>
                          <button
                            onClick={() => toast.info("Ver detalhes - Em desenvolvimento")}
                            className="px-3 py-2 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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