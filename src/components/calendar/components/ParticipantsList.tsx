/**
 * PARTICIPANTS LIST COMPONENT
 * 
 * Display and manage event participants
 * 
 * Features:
 * - List participants with status
 * - Add participants (opens modal)
 * - Remove participants (with confirmation)
 * - Status badges (pending, confirmed, declined)
 * - Capacity tracking
 * - Empty state
 * 
 * @module calendar/components/ParticipantsList
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  MessageCircle,
  AlertCircle,
  Loader2,
  Send,
  Check,
  Ban,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mutate } from 'swr';
import { useEventParticipants } from '@/hooks/use-api';
import { AddParticipantsModal } from '../modals/AddParticipantsModal';
import { EventParticipant } from '@/types/calendar';
import { PARTICIPANT_STATUS_CONFIG, ParticipantStatus } from '../utils/statusConfigs';

// ============================================================================
// TYPES
// ============================================================================

interface ParticipantsListProps {
  eventId: string;
  workspaceId: string;
  canEdit?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ParticipantsList({
  eventId,
  workspaceId,
  canEdit = true,
}: ParticipantsListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [sendingConfirmation, setSendingConfirmation] = useState(false);

  // Fetch participants
  const { participants, isLoading, error } = useEventParticipants(eventId, workspaceId);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleRemoveParticipant = async (athleteId: string, athleteName: string) => {
    if (!confirm(`Remover ${athleteName} do evento?`)) {
      return;
    }

    setRemovingId(athleteId);

    try {
      const response = await fetch(
        `/api/calendar-events/${eventId}/participants?workspace_id=${workspaceId}&athlete_ids=${athleteId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove participant');
      }

      // Invalidate cache
      mutate((key) => typeof key === 'string' && key.includes('/participants'));

      toast.success(`${athleteName} removido`);
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao remover participante');
    } finally {
      setRemovingId(null);
    }
  };

  const handleConfirmParticipant = async (athleteId: string, athleteName: string) => {
    setConfirmingId(athleteId);
    setSendingConfirmation(true);

    try {
      const response = await fetch(
        `/api/calendar-events/${eventId}/participants?workspace_id=${workspaceId}&athlete_ids=${athleteId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'confirmed' }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to confirm participant');
      }

      // Invalidate cache
      mutate((key) => typeof key === 'string' && key.includes('/participants'));

      toast.success(`${athleteName} confirmado`);
    } catch (error) {
      console.error('Error confirming participant:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao confirmar participante');
    } finally {
      setConfirmingId(null);
      setSendingConfirmation(false);
    }
  };

  const handleSendConfirmationRequest = async () => {
    // Get all pending participants
    const pendingParticipants = participants.filter(p => p.status === 'pending' || !p.status);
    
    if (pendingParticipants.length === 0) {
      toast.error('Não há participantes pendentes');
      return;
    }

    setSendingConfirmation(true);

    try {
      const response = await fetch(
        `/api/calendar-events/${eventId}/participants/request-confirmation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId,
            sendAll: true,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send confirmation request');
      }

      const data = await response.json();

      // Invalidate cache
      mutate((key) => typeof key === 'string' && key.includes('/participants'));

      toast.success(data.message || `Pedido enviado para ${data.sent} participante${data.sent !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error sending confirmation request:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar pedido');
    } finally {
      setSendingConfirmation(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-600">Carregando participantes...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-sm text-red-700">Erro ao carregar participantes</p>
      </div>
    );
  }

  const currentCount = participants.length;
  const remainingCapacity = maxParticipants ? maxParticipants - currentCount : Infinity;
  const isAtCapacity = maxParticipants && currentCount >= maxParticipants;
  
  // Count pending participants
  const pendingCount = participants.filter(p => p.status === 'pending' || !p.status).length;
  const confirmedCount = participants.filter(p => p.status === 'confirmed').length;
  const declinedCount = participants.filter(p => p.status === 'declined').length;

  return (
    <>
      <div className="space-y-3">
        {/* Add Button */}
        {canEdit && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            disabled={isAtCapacity}
            className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all ${
              isAtCapacity
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-400'
            }`}
          >
            <UserPlus className="h-5 w-5" />
            <span className="font-semibold text-sm">
              {isAtCapacity ? 'Capacidade Máxima Atingida' : 'Adicionar Participantes'}
            </span>
          </motion.button>
        )}
        
        {/* Send Confirmation Request Button */}
        {canEdit && pendingCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendConfirmationRequest}
            disabled={sendingConfirmation}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingConfirmation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-semibold text-sm">Enviando pedidos...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="font-semibold text-sm">
                  Pedir Confirmação ({pendingCount})
                </span>
              </>
            )}
          </motion.button>
        )}

        {/* Capacity Info */}
        {maxParticipants && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {currentCount} / {maxParticipants} participantes
            </span>
            {remainingCapacity <= 3 && remainingCapacity > 0 && (
              <span className="text-amber-600 font-medium">
                {remainingCapacity} vaga{remainingCapacity !== 1 ? 's' : ''} restante{remainingCapacity !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
        
        {/* Confirmation Stats */}
        {participants.length > 0 && (confirmedCount > 0 || declinedCount > 0 || pendingCount > 0) && (
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Confirmados</div>
              <div className="font-bold text-emerald-600">{confirmedCount}</div>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Pendentes</div>
              <div className="font-bold text-amber-600">{pendingCount}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Recusados</div>
              <div className="font-bold text-red-600">{declinedCount}</div>
            </div>
          </div>
        )}

        {/* Participants List */}
        {participants.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-600">Nenhum participante</p>
            <p className="text-sm text-slate-500 mt-1">
              {canEdit ? 'Clique acima para adicionar' : 'Sem participantes registados'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {participants.map((participant, index) => {
                const athlete = participant.athletes;
                if (!athlete) return null;

                const status = participant.status as ParticipantStatus;
                const statusConfig = PARTICIPANT_STATUS_CONFIG[status] || PARTICIPANT_STATUS_CONFIG.pending;
                const StatusIcon = statusConfig.icon;
                const isRemoving = removingId === athlete.id;
                const isConfirming = confirmingId === athlete.id;

                return (
                  <motion.div
                    key={participant.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                      {athlete.avatar_url ? (
                        <img
                          src={athlete.avatar_url}
                          alt={athlete.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-sky-600" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h6 className="font-semibold text-slate-900 truncate">
                        {athlete.name}
                      </h6>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        {athlete.email && (
                          <span className="truncate">{athlete.email}</span>
                        )}
                        {athlete.team && (
                          <>
                            <span>•</span>
                            <span>{athlete.team}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                      <StatusIcon className={`h-3 w-3 ${statusConfig.text}`} />
                      <span className={`text-xs font-medium ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Remove Button */}
                    {canEdit && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveParticipant(athlete.id, athlete.name)}
                        disabled={isRemoving}
                        className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        title="Remover participante"
                      >
                        {isRemoving ? (
                          <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </motion.button>
                    )}

                    {/* Confirm Button */}
                    {canEdit && status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleConfirmParticipant(athlete.id, athlete.name)}
                        disabled={isConfirming || sendingConfirmation}
                        className="h-8 w-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        title="Confirmar participante"
                      >
                        {isConfirming || sendingConfirmation ? (
                          <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Participants Modal */}
      {canEdit && (
        <AddParticipantsModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          eventId={eventId}
          workspaceId={workspaceId}
        />
      )}
    </>
  );
}