import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger"
}: ConfirmModalProps) {
  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-gradient-to-r from-red-500 to-red-600",
      buttonHover: "hover:from-red-400 hover:to-red-500"
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonBg: "bg-gradient-to-r from-amber-500 to-amber-600",
      buttonHover: "hover:from-amber-400 hover:to-amber-500"
    },
    info: {
      icon: AlertTriangle,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      buttonBg: "bg-gradient-to-r from-sky-500 to-sky-600",
      buttonHover: "hover:from-sky-400 hover:to-sky-500"
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`h-12 w-12 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600">{description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl ${config.buttonBg} ${config.buttonHover} text-white shadow-md transition-all`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
