import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        >
          {/* Icon */}
          <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-slate-900 text-lg mb-2">{title}</h2>
            <p className="text-sm text-slate-600 mb-3">
              {message}
            </p>
            {itemName && (
              <div className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-medium text-slate-900">{itemName}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:from-red-400 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deletando...
                </span>
              ) : (
                "Sim, Deletar"
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
