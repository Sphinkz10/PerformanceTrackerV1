/**
 * RESPONSIVE MODAL
 * Adaptive modal component
 * Mobile: Full screen bottom sheet
 * Desktop: Centered modal with backdrop
 */

import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  mobileStyle?: 'fullscreen' | 'bottomsheet';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full',
};

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  mobileStyle = 'fullscreen',
  className = '',
}: ResponsiveModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
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
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            {/* DESKTOP: Centered modal */}
            <div className="hidden sm:flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className={`
                  bg-white rounded-2xl shadow-2xl 
                  w-full ${SIZE_CLASSES[size]}
                  max-h-[90vh] flex flex-col
                  ${className}
                `}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between p-6 border-b border-slate-200 flex-shrink-0">
                    <div className="flex-1 mr-4">
                      {title && (
                        <h2 className="text-2xl font-bold text-slate-900">
                          {title}
                        </h2>
                      )}
                      {subtitle && (
                        <p className="text-sm text-slate-500 mt-1">
                          {subtitle}
                        </p>
                      )}
                    </div>

                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
                      >
                        <X className="h-5 w-5 text-slate-500" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
                    {footer}
                  </div>
                )}
              </motion.div>
            </div>

            {/* MOBILE: Full screen or bottom sheet */}
            <div className="sm:hidden">
              {mobileStyle === 'fullscreen' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    fixed inset-0 z-50 
                    bg-white
                    flex flex-col
                    ${className}
                  `}
                >
                  {/* Mobile Header */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                      <div className="flex-1 mr-4">
                        {title && (
                          <h2 className="text-xl font-bold text-slate-900">
                            {title}
                          </h2>
                        )}
                        {subtitle && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {subtitle}
                          </p>
                        )}
                      </div>

                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
                        >
                          <X className="h-5 w-5 text-slate-500" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mobile Content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {children}
                  </div>

                  {/* Mobile Footer */}
                  {footer && (
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0 safe-bottom">
                      {footer}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    fixed bottom-0 left-0 right-0 z-50
                    bg-white rounded-t-2xl shadow-2xl
                    max-h-[90vh] flex flex-col
                    ${className}
                  `}
                >
                  {/* Drag handle */}
                  <div className="flex justify-center py-3 border-b border-slate-200">
                    <div className="w-12 h-1 bg-slate-300 rounded-full" />
                  </div>

                  {/* Mobile Header */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                      <div className="flex-1 mr-4">
                        {title && (
                          <h2 className="text-xl font-bold text-slate-900">
                            {title}
                          </h2>
                        )}
                        {subtitle && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {subtitle}
                          </p>
                        )}
                      </div>

                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
                        >
                          <X className="h-5 w-5 text-slate-500" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mobile Content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {children}
                  </div>

                  {/* Mobile Footer */}
                  {footer && (
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0 safe-bottom">
                      {footer}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// VARIANTS

/**
 * Confirmation Dialog - Small modal for quick confirmations
 */
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'info' | 'warning' | 'danger';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'info',
  isLoading = false,
}: ConfirmationDialogProps) {
  const variantStyles = {
    info: 'from-sky-500 to-sky-600',
    warning: 'from-amber-500 to-amber-600',
    danger: 'from-red-500 to-red-600',
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      mobileStyle="bottomsheet"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              flex-1 px-4 py-2 text-sm font-semibold 
              bg-gradient-to-r ${variantStyles[variant]} 
              text-white rounded-xl shadow-md 
              hover:opacity-90 transition-all 
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                A processar...
              </span>
            ) : (
              confirmLabel
            )}
          </motion.button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
