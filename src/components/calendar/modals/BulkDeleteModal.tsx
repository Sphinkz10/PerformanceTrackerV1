/**
 * BULK DELETE CONFIRMATION MODAL
 * 
 * Modal de confirmação para deletar múltiplos eventos
 * Com preview dos eventos e opção de cancelar
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useBulkOperations } from '@/hooks/useBulkOperations';

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvents: CalendarEvent[];
  onSuccess: () => void;
}

export function BulkDeleteModal({
  isOpen,
  onClose,
  selectedEvents,
  onSuccess,
}: BulkDeleteModalProps) {
  const { bulkDelete, isLoading } = useBulkOperations();
  const [confirmText, setConfirmText] = useState('');

  const eventIds = selectedEvents.map(e => e.id);
  const eventCount = selectedEvents.length;
  
  // Count events with participants
  const eventsWithParticipants = selectedEvents.filter(
    e => e.athlete_ids && e.athlete_ids.length > 0
  ).length;

  // Count total participants affected
  const totalParticipants = selectedEvents.reduce(
    (sum, e) => sum + (e.athlete_ids?.length || 0),
    0
  );

  const confirmationWord = 'EXCLUIR';
  const isConfirmed = confirmText === confirmationWord;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    const result = await bulkDelete(eventIds);

    if (result.success) {
      onSuccess();
      onClose();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center animate-pulse">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Excluir Eventos em Massa
                  </h2>
                  <p className="text-sm text-slate-600">
                    Ação permanente e irreversível
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Warning Banner */}
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 shrink-0 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900 mb-2">
                  ⚠️ ATENÇÃO: Esta ação não pode ser desfeita!
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• <strong>{eventCount}</strong> evento{eventCount > 1 ? 's' : ''} será{eventCount > 1 ? 'ão' : ''} permanentemente excluído{eventCount > 1 ? 's' : ''}</li>
                  {eventsWithParticipants > 0 && (
                    <li>• <strong>{totalParticipants}</strong> participante{totalParticipants > 1 ? 's' : ''} será{totalParticipants > 1 ? 'ão' : ''} removido{totalParticipants > 1 ? 's' : ''}</li>
                  )}
                  <li>• Todas as confirmações e check-ins associados serão perdidos</li>
                  <li>• O histórico destes eventos será apagado</li>
                </ul>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                <Calendar className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900">{eventCount}</p>
                <p className="text-xs text-red-700">Evento{eventCount > 1 ? 's' : ''}</p>
              </div>

              {eventsWithParticipants > 0 && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
                  <Users className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-900">{totalParticipants}</p>
                  <p className="text-xs text-amber-700">Participante{totalParticipants > 1 ? 's' : ''}</p>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Clock className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Período</p>
                <p className="text-xs text-slate-600 mt-1">
                  {format(new Date(Math.min(...selectedEvents.map(e => new Date(e.start_time).getTime()))), 'dd MMM', { locale: pt })}
                  {' - '}
                  {format(new Date(Math.max(...selectedEvents.map(e => new Date(e.start_time).getTime()))), 'dd MMM', { locale: pt })}
                </p>
              </div>
            </div>

            {/* Events Preview */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                Eventos que serão excluídos:
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 rounded-xl p-4 border border-slate-200">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-600">
                          {format(new Date(event.start_time), "dd MMM, HH:mm", { locale: pt })}
                        </span>
                        {event.athlete_ids && event.athlete_ids.length > 0 && (
                          <>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.athlete_ids.length} participante{event.athlete_ids.length > 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <p className="text-sm font-semibold text-amber-900 mb-3">
                Digite "{confirmationWord}" para confirmar a exclusão:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder={confirmationWord}
                className="w-full px-4 py-3 text-sm font-bold border-2 border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all uppercase text-center"
                disabled={isLoading}
              />
              {confirmText.length > 0 && !isConfirmed && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  Texto não corresponde. Digite exatamente: {confirmationWord}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </motion.button>
            
            <motion.button
              whileHover={isConfirmed && !isLoading ? { scale: 1.02 } : undefined}
              whileTap={isConfirmed && !isLoading ? { scale: 0.98 } : undefined}
              onClick={handleDelete}
              disabled={!isConfirmed || isLoading}
              className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:from-red-400 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Excluindo...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir {eventCount} Evento{eventCount > 1 ? 's' : ''}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
