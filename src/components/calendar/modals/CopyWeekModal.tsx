/**
 * COPY WEEK MODAL
 * 
 * Modal para copiar todos os eventos de uma semana para outra
 * Permite copiar participantes e configurações de confirmação
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Calendar,
  ArrowRight,
  Users,
  CheckCircle,
  AlertCircle,
  CalendarClock,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useBulkOperations } from '@/hooks/useBulkOperations';

interface CopyWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  initialSourceWeek?: Date;
  onSuccess: () => void;
}

export function CopyWeekModal({
  isOpen,
  onClose,
  workspaceId,
  initialSourceWeek,
  onSuccess,
}: CopyWeekModalProps) {
  const { copyWeek, isLoading } = useBulkOperations();

  const [sourceWeek, setSourceWeek] = useState<Date>(
    initialSourceWeek || startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [targetWeek, setTargetWeek] = useState<Date>(
    startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 })
  );
  const [includeParticipants, setIncludeParticipants] = useState(true);
  const [includeConfirmations, setIncludeConfirmations] = useState(true);

  const sourceWeekStart = startOfWeek(sourceWeek, { weekStartsOn: 1 });
  const sourceWeekEnd = endOfWeek(sourceWeek, { weekStartsOn: 1 });
  const targetWeekStart = startOfWeek(targetWeek, { weekStartsOn: 1 });
  const targetWeekEnd = endOfWeek(targetWeek, { weekStartsOn: 1 });

  const handlePreviousSourceWeek = () => {
    setSourceWeek(prev => subWeeks(prev, 1));
  };

  const handleNextSourceWeek = () => {
    setSourceWeek(prev => addWeeks(prev, 1));
  };

  const handlePreviousTargetWeek = () => {
    setTargetWeek(prev => subWeeks(prev, 1));
  };

  const handleNextTargetWeek = () => {
    setTargetWeek(prev => addWeeks(prev, 1));
  };

  const handleSubmit = async () => {
    const result = await copyWeek({
      sourceWeekStart,
      targetWeekStart,
      workspaceId,
      includeParticipants,
      includeConfirmations,
    });

    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  // Check if source and target are the same week
  const isSameWeek = 
    sourceWeekStart.getTime() === targetWeekStart.getTime();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Copy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Copiar Semana
                  </h2>
                  <p className="text-sm text-slate-600">
                    Copiar todos os eventos de uma semana para outra
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
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning if same week */}
            {isSameWeek && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Atenção
                  </p>
                  <p className="text-xs text-amber-700">
                    A semana de origem e destino são iguais. Por favor, selecione semanas diferentes.
                  </p>
                </div>
              </div>
            )}

            {/* Week Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-6">
              {/* Source Week */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-violet-600" />
                  Semana de Origem
                </label>
                
                <div className="p-4 border-2 border-violet-200 bg-violet-50/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePreviousSourceWeek}
                      className="h-8 w-8 rounded-lg bg-white border border-violet-200 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                    </motion.button>

                    <div className="text-center">
                      <p className="text-xs font-medium text-violet-600 mb-1">
                        {format(sourceWeek, 'MMMM yyyy', { locale: pt })}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Semana {format(sourceWeek, 'w', { locale: pt })}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNextSourceWeek}
                      className="h-8 w-8 rounded-lg bg-white border border-violet-200 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="text-xs text-center text-slate-600">
                    <p>{format(sourceWeekStart, "dd MMM", { locale: pt })} - {format(sourceWeekEnd, "dd MMM yyyy", { locale: pt })}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Target Week */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Semana de Destino
                </label>
                
                <div className="p-4 border-2 border-emerald-200 bg-emerald-50/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePreviousTargetWeek}
                      className="h-8 w-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                    </motion.button>

                    <div className="text-center">
                      <p className="text-xs font-medium text-emerald-600 mb-1">
                        {format(targetWeek, 'MMMM yyyy', { locale: pt })}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Semana {format(targetWeek, 'w', { locale: pt })}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNextTargetWeek}
                      className="h-8 w-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="text-xs text-center text-slate-600">
                    <p>{format(targetWeekStart, "dd MMM", { locale: pt })} - {format(targetWeekEnd, "dd MMM yyyy", { locale: pt })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Opções de Cópia
              </h3>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={includeParticipants}
                  onChange={(e) => setIncludeParticipants(e.target.checked)}
                  className="h-5 w-5 text-violet-600 rounded focus:ring-violet-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      Copiar Participantes
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Manter os mesmos atletas nos eventos copiados
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={includeConfirmations}
                  onChange={(e) => setIncludeConfirmations(e.target.checked)}
                  className="h-5 w-5 text-violet-600 rounded focus:ring-violet-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      Requerer Confirmações
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Manter as configurações de confirmação dos eventos
                  </p>
                </div>
              </label>
            </div>

            {/* Info */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-sky-900">
                  <strong>Nota:</strong> Todos os eventos da semana de origem serão copiados para a semana de destino, 
                  mantendo os mesmos dias da semana e horários. Os eventos copiados terão status "agendado".
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading || isSameWeek}
              className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Copiando...</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar Semana</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
