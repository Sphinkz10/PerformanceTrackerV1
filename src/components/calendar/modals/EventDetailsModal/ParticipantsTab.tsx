/**
 * PARTICIPANTS TAB
 * Shows event participants with confirmation status and actions
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, QrCode, UserPlus, Mail, Loader2 } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { ConfirmationStatusBadge, ConfirmationStats, ConfirmationList } from '../../components/ConfirmationStatus';
import { QRCodeModal } from '../../components/QRCodeCheckIn';
import { toast } from 'sonner@2.0.3';

interface ParticipantsTabProps {
  event: CalendarEvent;
  workspaceId: string;
}

// Mock participant data with confirmation status
interface ParticipantWithConfirmation {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  confirmation_status: 'confirmed' | 'pending' | 'declined' | 'no_response';
  confirmed_at?: string;
  notification_sent_at?: string;
}

export function ParticipantsTab({ event, workspaceId }: ParticipantsTabProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [sendingNotifications, setSendingNotifications] = useState(false);

  // Mock participants data
  const mockParticipants: ParticipantWithConfirmation[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      confirmation_status: 'confirmed',
      confirmed_at: '2026-01-19T10:00:00Z',
      notification_sent_at: '2026-01-18T14:00:00Z',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      confirmation_status: 'pending',
      notification_sent_at: '2026-01-18T14:00:00Z',
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@example.com',
      confirmation_status: 'confirmed',
      confirmed_at: '2026-01-19T12:30:00Z',
      notification_sent_at: '2026-01-18T14:00:00Z',
    },
    {
      id: '4',
      name: 'Ana Rodrigues',
      email: 'ana@example.com',
      confirmation_status: 'no_response',
      notification_sent_at: '2026-01-18T14:00:00Z',
    },
    {
      id: '5',
      name: 'Carlos Mendes',
      email: 'carlos@example.com',
      confirmation_status: 'declined',
      notification_sent_at: '2026-01-18T14:00:00Z',
    },
  ];

  // Calculate stats
  const stats = {
    confirmed: mockParticipants.filter(p => p.confirmation_status === 'confirmed').length,
    pending: mockParticipants.filter(p => p.confirmation_status === 'pending').length,
    declined: mockParticipants.filter(p => p.confirmation_status === 'declined').length,
    total: mockParticipants.length,
  };

  const handleSendConfirmations = async () => {
    setSendingNotifications(true);
    try {
      // TODO: Real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Confirmações enviadas para ${stats.pending} atleta(s)!`);
    } catch (error) {
      toast.error('Erro ao enviar confirmações');
    } finally {
      setSendingNotifications(false);
    }
  };

  const handleResendNotification = async (participantId: string) => {
    try {
      // TODO: Real API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const participant = mockParticipants.find(p => p.id === participantId);
      toast.success(`Lembrete reenviado para ${participant?.name}!`);
    } catch (error) {
      toast.error('Erro ao reenviar lembrete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
        <h3 className="font-semibold text-slate-900 mb-3">
          Resumo de Confirmações
        </h3>
        <ConfirmationStats
          confirmed={stats.confirmed}
          pending={stats.pending}
          declined={stats.declined}
          total={stats.total}
        />
      </div>

      {/* Actions Row */}
      <div className="flex gap-3 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSendConfirmations}
          disabled={sendingNotifications || stats.pending === 0}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendingNotifications ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Enviar Confirmações ({stats.pending})
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsQRModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white text-violet-700 hover:border-violet-400 hover:shadow-lg transition-all"
        >
          <QrCode className="h-4 w-4" />
          QR Code Check-In
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Adicionar Participantes
        </motion.button>
      </div>

      {/* Participants List */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">
            Participantes ({mockParticipants.length})
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Mail className="h-3 w-3" />
            <span>Última notificação: Há 2 horas</span>
          </div>
        </div>

        <ConfirmationList
          participants={mockParticipants}
          onResendNotification={handleResendNotification}
        />
      </div>

      {/* Empty State */}
      {mockParticipants.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            Nenhum participante adicionado
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Adicione atletas para começar a enviar confirmações
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors"
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            Adicionar Participantes
          </motion.button>
        </div>
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          eventId={event.id}
          eventTitle={event.title}
        />
      )}

      {/* Info Box */}
      <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-sky-900 mb-1">
              Sistema de Confirmações
            </h5>
            <ul className="text-sm text-sky-700 space-y-1">
              <li>• Confirmações são enviadas automaticamente 48h antes do evento</li>
              <li>• Atletas podem confirmar via email ou QR code</li>
              <li>• Lembretes automáticos para confirmações pendentes</li>
              <li>• Dashboard em tempo real de todas as confirmações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
