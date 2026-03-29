/**
 * CONFIRMATION STATUS COMPONENT
 * Shows participant confirmation status with visual indicators
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Clock, XCircle, HelpCircle, Send } from 'lucide-react';

export type ConfirmationStatus = 'confirmed' | 'pending' | 'declined' | 'no_response';

interface ConfirmationStatusProps {
  status: ConfirmationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
}

export function ConfirmationStatusBadge({ 
  status, 
  size = 'md',
  showLabel = true,
  showIcon = true,
}: ConfirmationStatusProps) {
  const config = {
    confirmed: {
      label: 'Confirmado',
      icon: CheckCircle,
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    pending: {
      label: 'Pendente',
      icon: Clock,
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      iconColor: 'text-amber-600',
    },
    declined: {
      label: 'Recusado',
      icon: XCircle,
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      iconColor: 'text-red-600',
    },
    no_response: {
      label: 'Sem resposta',
      icon: HelpCircle,
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      iconColor: 'text-slate-600',
    },
  };

  const { label, icon: Icon, bg, text, border, iconColor } = config[status];

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2',
      icon: 'h-5 w-5',
    },
  };

  const { container, icon } = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center ${container} rounded-full font-medium ${bg} ${text} border ${border}`}
    >
      {showIcon && <Icon className={`${icon} ${iconColor}`} />}
      {showLabel && <span>{label}</span>}
    </motion.div>
  );
}

interface ConfirmationStatsProps {
  confirmed: number;
  pending: number;
  declined: number;
  total: number;
}

export function ConfirmationStats({ confirmed, pending, declined, total }: ConfirmationStatsProps) {
  const confirmedPercentage = total > 0 ? (confirmed / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;
  const declinedPercentage = total > 0 ? (declined / total) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
        {confirmed > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confirmedPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-emerald-500"
          />
        )}
        {pending > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pendingPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-amber-500"
          />
        )}
        {declined > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${declinedPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-red-500"
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-2xl font-bold text-emerald-700">{confirmed}</p>
          <p className="text-xs text-emerald-600">Confirmados</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-2xl font-bold text-amber-700">{pending}</p>
          <p className="text-xs text-amber-600">Pendentes</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-2xl font-bold text-red-700">{declined}</p>
          <p className="text-xs text-red-600">Recusados</p>
        </div>
      </div>
    </div>
  );
}

interface ParticipantWithConfirmation {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  confirmation_status: ConfirmationStatus;
  confirmed_at?: string;
  notification_sent_at?: string;
}

interface ConfirmationListProps {
  participants: ParticipantWithConfirmation[];
  onResendNotification?: (participantId: string) => void;
}

export function ConfirmationList({ participants, onResendNotification }: ConfirmationListProps) {
  return (
    <div className="space-y-2">
      {participants.map((participant, index) => (
        <motion.div
          key={participant.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-colors"
        >
          {/* Avatar */}
          <div className="relative">
            {participant.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{participant.name}</p>
            {participant.email && (
              <p className="text-xs text-slate-600 truncate">{participant.email}</p>
            )}
            {participant.confirmed_at && (
              <p className="text-xs text-slate-500">
                Confirmado: {new Date(participant.confirmed_at).toLocaleDateString('pt-PT')}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <ConfirmationStatusBadge status={participant.confirmation_status} size="sm" />

          {/* Resend Button (only for pending) */}
          {participant.confirmation_status === 'pending' && onResendNotification && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onResendNotification(participant.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
            >
              <Send className="h-3 w-3" />
              Reenviar
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
