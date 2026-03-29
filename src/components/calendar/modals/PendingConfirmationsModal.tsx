/**
 * PendingConfirmationsModal - Dashboard de Confirmações Pendentes
 * Sprint 3: Confirmations System
 * 
 * Features:
 * - Lista de confirmações pendentes
 * - Filtros (upcoming, próximas 24h, próximas 48h)
 * - Send reminder button
 * - Bulk actions
 * - Real-time updates (refresh every 60s)
 * - Stats dashboard
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Calendar as CalendarIcon,
  Mail,
  Smartphone,
  Loader2,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { usePendingConfirmations, useSendReminder, useBulkSendConfirmations } from '@/hooks/use-api';
import { toast } from 'sonner@2.0.3';

interface PendingConfirmationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function PendingConfirmationsModal({
  isOpen,
  onClose,
  workspaceId,
}: PendingConfirmationsModalProps) {
  const [filter, setFilter] = useState<'all' | '24h' | '48h'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Fetch pending confirmations
  const { confirmations, stats, isLoading, mutate } = usePendingConfirmations(workspaceId, {
    upcoming_only: true,
    hours_before: filter === '24h' ? 24 : filter === '48h' ? 48 : undefined,
  });

  const { execute: sendReminder, isLoading: sendingReminder } = useSendReminder();
  const { execute: bulkSend, isLoading: sendingBulk } = useBulkSendConfirmations();

  // Handle send reminder
  const handleSendReminder = async (confirmationId: string, athleteName: string) => {
    try {
      await sendReminder(confirmationId);
      toast.success(`Lembrete enviado para ${athleteName}!`);
      mutate(); // Refresh list
    } catch (error: any) {
      toast.error(`Erro ao enviar lembrete: ${error.message}`);
    }
  };

  // Handle bulk send
  const handleBulkSend = async () => {
    if (selectedIds.size === 0) {
      toast.error('Selecione pelo menos uma confirmação');
      return;
    }

    try {
      // Group by event
      const eventIds = new Set(
        confirmations
          .filter((c: any) => selectedIds.has(c.id))
          .map((c: any) => c.event_id)
      );

      for (const eventId of eventIds) {
        await bulkSend(eventId, 'email');
      }

      toast.success(`Lembretes enviados para ${selectedIds.size} atletas!`);
      setSelectedIds(new Set());
      mutate();
    } catch (error: any) {
      toast.error(`Erro ao enviar lembretes: ${error.message}`);
    }
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedIds.size === confirmations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(confirmations.map((c: any) => c.id)));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Confirmações Pendentes</h2>
                <p className="text-xs text-slate-600">
                  {stats?.total || 0} atleta(s) aguardam confirmação
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              <X className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          {/* Stats Row */}
          {stats && (
            <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{stats.total || 0}</p>
                <p className="text-xs text-slate-600">Total Pendentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.next_24h || 0}</p>
                <p className="text-xs text-slate-600">Próximas 24h</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">{stats.next_48h || 0}</p>
                <p className="text-xs text-slate-600">Próximas 48h</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.overdue || 0}</p>
                <p className="text-xs text-slate-600">Atrasadas</p>
              </div>
            </div>
          )}

          {/* Filters & Actions */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 gap-3">
            {/* Filters */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                Todas
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter('24h')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === '24h'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-amber-300'
                }`}
              >
                24 Horas
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter('48h')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === '48h'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                48 Horas
              </motion.button>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBulkSend}
                disabled={sendingBulk}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50"
              >
                {sendingBulk ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Enviar {selectedIds.size} Lembrete(s)
              </motion.button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : confirmations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-1">
                  Todas as confirmações enviadas!
                </h3>
                <p className="text-sm text-slate-600">
                  Não há confirmações pendentes neste momento
                </p>
              </div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === confirmations.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-600">
                    Selecionar todos ({confirmations.length})
                  </span>
                </div>

                {/* Confirmations List */}
                {confirmations.map((confirmation: any, index: number) => (
                  <motion.div
                    key={confirmation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(confirmation.id)}
                      onChange={() => toggleSelection(confirmation.id)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Event Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="h-4 w-4 text-sky-600" />
                        <h4 className="font-semibold text-slate-900 truncate">
                          {confirmation.event_title}
                        </h4>
                      </div>

                      {/* Athlete Info */}
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <Users className="h-3 w-3" />
                        <span>{confirmation.athlete_name}</span>
                        {confirmation.athlete_email && (
                          <>
                            <Mail className="h-3 w-3 ml-2" />
                            <span className="truncate">{confirmation.athlete_email}</span>
                          </>
                        )}
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">
                          {format(new Date(confirmation.event_start), "d 'de' MMMM 'às' HH:mm", { locale: pt })}
                        </span>
                        <span className="text-amber-600 font-medium">
                          ({formatDistanceToNow(new Date(confirmation.event_start), { locale: pt, addSuffix: true })})
                        </span>
                      </div>

                      {/* Reminder Info */}
                      {confirmation.reminder_count > 0 && (
                        <div className="mt-2 text-xs text-slate-500">
                          {confirmation.reminder_count} lembrete(s) já enviado(s)
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendReminder(confirmation.id, confirmation.athlete_name)}
                      disabled={sendingReminder}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 transition-all disabled:opacity-50"
                    >
                      {sendingReminder ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Lembrar
                    </motion.button>
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-600">
              Auto-refresh a cada 60 segundos
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => mutate()}
                className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
              >
                Atualizar Agora
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                Fechar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
