import { motion } from 'motion/react';
import { X, Calendar, Clock, TrendingUp, User } from 'lucide-react';

interface SessionDrawerProps {
  sessionId: string;
  onClose: () => void;
}

export function SessionDrawer({ sessionId, onClose }: SessionDrawerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Detalhes da Sessão</h2>
            <p className="text-sm text-slate-500 mt-0.5">ID: {sessionId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Session Info */}
          <div className="p-4 rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white">
            <h3 className="font-bold text-slate-900 mb-3">Informação</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">18 Dezembro 2024, 10:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">Duração: 65 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">Coach: João Silva</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Métricas</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                <p className="text-xs font-medium text-slate-600 mb-1">Carga</p>
                <p className="text-xl font-bold text-emerald-600">1,250 AU</p>
              </div>
              <div className="p-3 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                <p className="text-xs font-medium text-slate-600 mb-1">RPE</p>
                <p className="text-xl font-bold text-amber-600">7.5</p>
              </div>
              <div className="p-3 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white">
                <p className="text-xs font-medium text-slate-600 mb-1">Volume</p>
                <p className="text-xl font-bold text-violet-600">12,500kg</p>
              </div>
            </div>
          </div>

          {/* Placeholder for more content */}
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">Detalhes completos da sessão</p>
            <p className="text-xs text-slate-500 mt-1">Exercícios, séries, carga, notas (em desenvolvimento)</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
