/**
 * RECURRENCE SCOPE DIALOG
 * 
 * Modal para escolher scope de edição/exclusão de eventos recorrentes:
 * - "Only this event" - afeta apenas este evento
 * - "All events" - afeta toda a série
 * - "This and future events" - afeta este e todos futuros (opcional)
 * 
 * @module calendar/modals/RecurrenceScopeDialog
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Repeat,
  AlertCircle,
  Edit3,
  Trash2,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type RecurrenceScope = 'single' | 'all' | 'future';
export type RecurrenceAction = 'edit' | 'delete';

interface RecurrenceScopeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: RecurrenceScope) => void;
  action: RecurrenceAction;
  eventTitle: string;
  isParent?: boolean; // is this the parent event or an instance?
  instanceNumber?: number; // which instance (e.g., "3 of 10")
  totalInstances?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function RecurrenceScopeDialog({
  isOpen,
  onClose,
  onConfirm,
  action,
  eventTitle,
  isParent = false,
  instanceNumber,
  totalInstances,
}: RecurrenceScopeDialogProps) {
  const [selectedScope, setSelectedScope] = React.useState<RecurrenceScope>('single');

  // Reset on open
  React.useEffect(() => {
    if (isOpen) {
      setSelectedScope('single');
    }
  }, [isOpen]);

  // Action-specific text
  const actionText = action === 'edit' ? 'editar' : 'eliminar';
  const actionTextCap = action === 'edit' ? 'Editar' : 'Eliminar';
  const actionIcon = action === 'edit' ? Edit3 : Trash2;
  const actionColor = action === 'edit' ? 'sky' : 'red';
  const ActionIcon = actionIcon;

  // Scope options
  const scopeOptions = [
    {
      value: 'single' as RecurrenceScope,
      title: 'Apenas Este Evento',
      description: `${actionTextCap} somente esta ocorrência${instanceNumber ? ` (#${instanceNumber})` : ''}`,
      icon: Calendar,
      color: 'slate',
    },
    {
      value: 'all' as RecurrenceScope,
      title: 'Toda a Série',
      description: `${actionTextCap} todos os ${totalInstances || ''} eventos desta série`,
      icon: Repeat,
      color: actionColor,
    },
  ];

  // Handler
  const handleConfirm = () => {
    onConfirm(selectedScope);
    onClose();
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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r ${
            action === 'edit' 
              ? 'from-sky-500 to-sky-600' 
              : 'from-red-500 to-red-600'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <ActionIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {actionTextCap} Evento Recorrente?
                  </h3>
                  <p className="text-sm text-white/90">
                    "{eventTitle}"
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Info */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Este é um evento recorrente
                </p>
                <p className="text-sm text-amber-700">
                  Escolha o alcance da alteração que pretende fazer
                </p>
              </div>
            </div>

            {/* Scope Options */}
            <div className="space-y-3">
              {scopeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedScope === option.value;

                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedScope(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? `border-${option.color}-500 bg-${option.color}-50`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? `bg-${option.color}-500 text-white`
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${
                          isSelected ? `text-${option.color}-900` : 'text-slate-900'
                        }`}>
                          {option.title}
                        </h4>
                        <p className={`text-sm ${
                          isSelected ? `text-${option.color}-700` : 'text-slate-600'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                      {/* Radio indicator */}
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? `border-${option.color}-500 bg-${option.color}-500`
                          : 'border-slate-300'
                      }`}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-2 w-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Warning for "all" scope */}
            {selectedScope === 'all' && action === 'delete' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Atenção!
                  </p>
                  <p className="text-sm text-red-700">
                    Esta ação irá eliminar permanentemente todos os eventos desta série. 
                    Esta operação não pode ser desfeita.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r ${
                action === 'edit'
                  ? 'from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500'
                  : 'from-red-500 to-red-600 hover:from-red-400 hover:to-red-500'
              } text-white transition-all shadow-lg ${
                action === 'edit' ? 'shadow-sky-500/30' : 'shadow-red-500/30'
              }`}
            >
              {actionTextCap}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
