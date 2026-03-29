/**
 * EDIT RECURRENCE MODAL
 * Choose between editing single occurrence or entire series
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar,
  Repeat,
  Edit3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';

export type EditRecurrenceChoice = 'this_event' | 'this_and_following' | 'all_events';

interface EditRecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
  onChoose: (choice: EditRecurrenceChoice) => void;
  action: 'edit' | 'delete';
}

export function EditRecurrenceModal({
  isOpen,
  onClose,
  event,
  onChoose,
  action = 'edit',
}: EditRecurrenceModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<EditRecurrenceChoice>('this_event');

  const handleConfirm = () => {
    onChoose(selectedChoice);
    onClose();
  };

  if (!isOpen) return null;

  const actionText = {
    edit: {
      title: 'Editar',
      verb: 'editar',
      icon: Edit3,
      color: 'sky',
    },
    delete: {
      title: 'Excluir',
      verb: 'excluir',
      icon: AlertTriangle,
      color: 'red',
    },
  }[action];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b border-slate-200 ${
            action === 'edit' 
              ? 'bg-gradient-to-r from-sky-50 to-blue-50' 
              : 'bg-gradient-to-r from-red-50 to-orange-50'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${
                action === 'edit'
                  ? 'from-sky-500 to-blue-600'
                  : 'from-red-500 to-orange-600'
              } flex items-center justify-center`}>
                <actionText.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {actionText.title} Evento Recorrente
                </h2>
                <p className="text-sm text-slate-600">
                  {event.title}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 border border-violet-200">
                <Repeat className="h-5 w-5 text-violet-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Este é um evento recorrente
                  </p>
                  <p className="text-xs text-slate-600">
                    Ocorrência de {event.start_date && format(new Date(event.start_date), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-6">
              Como deseja {actionText.verb} este evento?
            </p>

            <div className="space-y-3">
              {/* This Event Only */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedChoice('this_event')}
                className={`
                  w-full p-5 rounded-xl text-left transition-all
                  ${selectedChoice === 'this_event'
                    ? action === 'edit'
                      ? 'bg-sky-100 border-2 border-sky-400 shadow-md'
                      : 'bg-red-100 border-2 border-red-400 shadow-md'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedChoice === 'this_event' 
                      ? action === 'edit'
                        ? 'border-sky-500'
                        : 'border-red-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedChoice === 'this_event' && (
                      <div className={`h-4 w-4 rounded-full ${action === 'edit' ? 'bg-sky-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      <h4 className="font-bold text-slate-900">
                        Apenas este evento
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      {actionText.verb.charAt(0).toUpperCase() + actionText.verb.slice(1)} apenas a ocorrência de{' '}
                      {event.start_date && format(new Date(event.start_date), "d 'de' MMMM", { locale: pt })}.
                      {action === 'edit' && ' As outras ocorrências permanecem inalteradas.'}
                    </p>
                    {action === 'edit' && (
                      <div className="mt-3 p-3 rounded-lg bg-sky-50 border border-sky-200">
                        <p className="text-xs text-sky-700 font-medium">
                          💡 Dica: Será criada uma exceção na série
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* This and Following */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedChoice('this_and_following')}
                className={`
                  w-full p-5 rounded-xl text-left transition-all
                  ${selectedChoice === 'this_and_following'
                    ? action === 'edit'
                      ? 'bg-sky-100 border-2 border-sky-400 shadow-md'
                      : 'bg-red-100 border-2 border-red-400 shadow-md'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedChoice === 'this_and_following'
                      ? action === 'edit'
                        ? 'border-sky-500'
                        : 'border-red-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedChoice === 'this_and_following' && (
                      <div className={`h-4 w-4 rounded-full ${action === 'edit' ? 'bg-sky-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Repeat className="h-4 w-4 text-slate-600" />
                      <h4 className="font-bold text-slate-900">
                        Este e próximos eventos
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      {actionText.verb.charAt(0).toUpperCase() + actionText.verb.slice(1)} esta ocorrência e todas as seguintes.
                      {action === 'edit' && ' As ocorrências anteriores permanecem inalteradas.'}
                    </p>
                    {action === 'delete' && (
                      <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-xs text-amber-700 font-medium">
                          ⚠️ Atenção: Eventos futuros serão removidos
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* All Events */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedChoice('all_events')}
                className={`
                  w-full p-5 rounded-xl text-left transition-all
                  ${selectedChoice === 'all_events'
                    ? action === 'edit'
                      ? 'bg-sky-100 border-2 border-sky-400 shadow-md'
                      : 'bg-red-100 border-2 border-red-400 shadow-md'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedChoice === 'all_events'
                      ? action === 'edit'
                        ? 'border-sky-500'
                        : 'border-red-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedChoice === 'all_events' && (
                      <div className={`h-4 w-4 rounded-full ${action === 'edit' ? 'bg-sky-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Repeat className="h-4 w-4 text-slate-600" />
                      <h4 className="font-bold text-slate-900">
                        Todos os eventos da série
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      {actionText.verb.charAt(0).toUpperCase() + actionText.verb.slice(1)} todas as ocorrências desta série, incluindo passadas e futuras.
                    </p>
                    {action === 'delete' && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs text-red-700 font-medium">
                          🚨 Cuidado: Todos os eventos serão permanentemente removidos
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Nota Importante
                  </p>
                  <p className="text-xs text-slate-600">
                    {action === 'edit' 
                      ? 'Esta ação afetará apenas os eventos selecionados. Você poderá desfazer esta operação através do histórico.'
                      : 'Esta ação não pode ser desfeita. Os eventos excluídos serão removidos permanentemente do sistema.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 p-6 border-t border-slate-200 bg-slate-50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white shadow-lg transition-all ${
                action === 'edit'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500'
                  : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Confirmar {actionText.title}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}