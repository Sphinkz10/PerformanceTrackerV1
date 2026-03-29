/**
 * TOAST NOTIFICATIONS - Beautiful toast system
 * Success, error, warning, info notifications
 */

'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ============================================================
// Toast Provider
// ============================================================

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast('success', title, message),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => showToast('error', title, message),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => showToast('warning', title, message),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => showToast('info', title, message),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ============================================================
// Toast Container
// ============================================================

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Toast Item
// ============================================================

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto p-4 rounded-xl shadow-2xl border-2 ${config.bgColor} ${config.borderColor} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${config.titleColor}`}>{toast.title}</h4>
          {toast.message && (
            <p className={`text-xs mt-1 ${config.messageColor}`}>{toast.message}</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${config.closeBg} ${config.closeHover}`}
        >
          <X className={`h-3 w-3 ${config.closeColor}`} />
        </button>
      </div>

      {/* Progress bar (optional) */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={`h-1 ${config.progressBg} rounded-full mt-3`}
        />
      )}
    </motion.div>
  );
}

// ============================================================
// Toast Configurations
// ============================================================

function getToastConfig(type: ToastType) {
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50/95',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-900',
      messageColor: 'text-emerald-700',
      closeBg: 'bg-emerald-100',
      closeHover: 'hover:bg-emerald-200',
      closeColor: 'text-emerald-600',
      progressBg: 'bg-emerald-300',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50/95',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
      closeBg: 'bg-red-100',
      closeHover: 'hover:bg-red-200',
      closeColor: 'text-red-600',
      progressBg: 'bg-red-300',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50/95',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-700',
      closeBg: 'bg-amber-100',
      closeHover: 'hover:bg-amber-200',
      closeColor: 'text-amber-600',
      progressBg: 'bg-amber-300',
    },
    info: {
      icon: Info,
      bgColor: 'bg-sky-50/95',
      borderColor: 'border-sky-200',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      titleColor: 'text-sky-900',
      messageColor: 'text-sky-700',
      closeBg: 'bg-sky-100',
      closeHover: 'hover:bg-sky-200',
      closeColor: 'text-sky-600',
      progressBg: 'bg-sky-300',
    },
  };

  return configs[type];
}

// ============================================================
// Usage Example
// ============================================================

/*
// In your component:
import { useToast } from '@/components/shared/Toast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Success!', 'Your changes have been saved.');
  };

  const handleError = () => {
    toast.error('Error!', 'Something went wrong.');
  };

  const handleWarning = () => {
    toast.warning('Warning!', 'Please review your input.');
  };

  const handleInfo = () => {
    toast.info('Info', 'This is informational.');
  };

  // Custom toast
  const handleCustom = () => {
    toast.showToast('success', 'Custom Toast', 'Custom message', 3000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
*/
