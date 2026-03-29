import { motion } from 'motion/react';
import { X, Trophy, TrendingUp, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { RecordSuggestion } from '@/types/athlete-profile';

interface RecordSuggestionDrawerProps {
  suggestion: RecordSuggestion;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  onClose: () => void;
}

export function RecordSuggestionDrawer({
  suggestion,
  onAccept,
  onReject,
  onClose
}: RecordSuggestionDrawerProps) {
  const handleAccept = () => {
    onAccept(suggestion.id);
    onClose();
  };

  const handleReject = () => {
    onReject(suggestion.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Novo Recorde!</h2>
                <p className="text-emerald-100 text-sm mt-0.5">
                  Detetado automaticamente
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* New vs Old */}
          <div className="grid grid-cols-2 gap-4">
            {/* Old Record */}
            {suggestion.current_pb_value && (
              <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                <p className="text-xs font-medium text-slate-600 mb-2">Anterior</p>
                <p className="text-2xl font-bold text-slate-900">
                  {suggestion.current_pb_value}
                  <span className="text-sm text-slate-500 ml-1">{suggestion.unit}</span>
                </p>
              </div>
            )}

            {/* New Record */}
            <div className="p-4 rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
              <p className="text-xs font-medium text-emerald-700 mb-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Novo
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {suggestion.new_value}
                <span className="text-sm text-emerald-500 ml-1">{suggestion.unit}</span>
              </p>
            </div>
          </div>

          {/* Improvement */}
          {suggestion.improvement_percentage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-medium text-emerald-700">Melhoria</p>
                  <p className="text-xl font-bold text-emerald-600">
                    +{suggestion.improvement_percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metric Name */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-1">Métrica</p>
            <p className="text-lg font-bold text-slate-900">{suggestion.metric_name}</p>
          </div>

          {/* Source */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-1">Origem</p>
            <p className="text-sm text-slate-700 capitalize">{suggestion.source_type}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date(suggestion.detected_at).toLocaleString('pt-PT')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReject}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Rejeitar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
