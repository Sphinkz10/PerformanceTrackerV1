import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  FileText,
  Play,
  CheckCircle,
  Edit,
  Trash2,
  User
} from "lucide-react";

interface EventDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    type: string;
    athlete: string;
    athleteAvatar?: string;
    date: string;
    time: string;
    duration: number;
    location?: string;
    template?: string;
    notes?: string;
    status: "scheduled" | "in-progress" | "completed" | "cancelled";
  } | null;
  onStartLive?: () => void;
  onComplete?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function EventDetailsDrawer({
  isOpen,
  onClose,
  event,
  onStartLive,
  onComplete,
  onReschedule,
  onCancel
}: EventDetailsDrawerProps) {
  if (!event) return null;

  const statusConfig = {
    scheduled: { label: "Agendado", color: "bg-sky-100 text-sky-700" },
    "in-progress": { label: "Em Progresso", color: "bg-emerald-100 text-emerald-700" },
    completed: { label: "Completo", color: "bg-slate-100 text-slate-700" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700" }
  };

  const canStartLive = event.status === "scheduled";
  const canComplete = event.status === "in-progress";
  const canEdit = event.status !== "completed" && event.status !== "cancelled";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900 mb-1">{event.title}</h2>
                  <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[event.status].color}`}>
                    {statusConfig[event.status].label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 ml-2"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Atleta */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                {event.athleteAvatar ? (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-semibold">
                    {event.athleteAvatar}
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500">Atleta</p>
                  <p className="text-sm font-medium text-slate-900">{event.athlete}</p>
                </div>
              </div>

              {/* Detalhes */}
              <div className="space-y-3">
                {/* Data */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Data</p>
                    <p className="text-sm font-medium text-slate-900">{event.date}</p>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Horário</p>
                    <p className="text-sm font-medium text-slate-900">{event.time} ({event.duration} min)</p>
                  </div>
                </div>

                {/* Tipo */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tipo de Sessão</p>
                    <p className="text-sm font-medium text-slate-900">{event.type}</p>
                  </div>
                </div>

                {/* Localização */}
                {event.location && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Localização</p>
                      <p className="text-sm font-medium text-slate-900">{event.location}</p>
                    </div>
                  </div>
                )}

                {/* Template */}
                {event.template && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Template</p>
                      <p className="text-sm font-medium text-slate-900">{event.template}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notas */}
              {event.notes && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Notas</p>
                  <p className="text-sm text-slate-700">{event.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-200 space-y-2">
              {/* Start Live */}
              {canStartLive && onStartLive && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onStartLive}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <Play className="h-4 w-4" />
                  Start Live
                </motion.button>
              )}

              {/* Complete */}
              {canComplete && onComplete && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onComplete}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar Completo
                </motion.button>
              )}

              {/* Secondary Actions */}
              {canEdit && (
                <div className="flex gap-2">
                  {onReschedule && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onReschedule}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      Reagendar
                    </motion.button>
                  )}
                  {onCancel && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancelar
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
