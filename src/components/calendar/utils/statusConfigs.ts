/**
 * CENTRALIZED STATUS CONFIGURATIONS
 * 
 * Eliminates 3 different STATUS_CONFIG duplications
 * Each domain has its own clearly named config
 * 
 * @module calendar/utils/statusConfigs
 * @created 20 Janeiro 2026
 */

import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Heart,
  Moon,
} from 'lucide-react';

/**
 * PARTICIPANT STATUS CONFIGURATION
 * 
 * Used by: ParticipantsList.tsx
 * For event participation confirmation status
 */
export const PARTICIPANT_STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    color: 'amber',
    icon: Clock,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
  },
  confirmed: {
    label: 'Confirmado',
    color: 'emerald',
    icon: CheckCircle,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
  declined: {
    label: 'Recusado',
    color: 'red',
    icon: XCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
  },
} as const;

export type ParticipantStatus = keyof typeof PARTICIPANT_STATUS_CONFIG;

/**
 * ATHLETE AVAILABILITY STATUS CONFIGURATION
 * 
 * Used by: AthleteAvailability.tsx
 * For athlete availability and physical condition
 */
export const AVAILABILITY_STATUS_CONFIG = {
  available: {
    label: 'Disponível',
    color: 'emerald',
    icon: CheckCircle,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    description: 'Atleta disponível para treino',
  },
  unavailable: {
    label: 'Indisponível',
    color: 'red',
    icon: XCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    description: 'Atleta não disponível',
  },
  limited: {
    label: 'Limitado',
    color: 'amber',
    icon: AlertCircle,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
    description: 'Atleta com restrições',
  },
  injured: {
    label: 'Lesionado',
    color: 'red',
    icon: Heart,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    description: 'Atleta lesionado',
  },
  rest: {
    label: 'Descanso',
    color: 'violet',
    icon: Moon,
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-300',
    description: 'Atleta em descanso',
  },
} as const;

export type AvailabilityStatus = keyof typeof AVAILABILITY_STATUS_CONFIG;

/**
 * EVENT STATUS CONFIGURATION
 * 
 * Used by: EventInfo.tsx, EventDetailsModal.tsx
 * For calendar event lifecycle status
 */
export const EVENT_STATUS_CONFIG = {
  scheduled: {
    label: 'Agendado',
    color: 'sky',
    icon: CalendarIcon,
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-300',
  },
  active: {
    label: 'Em Curso',
    color: 'emerald',
    icon: CheckCircle,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
  completed: {
    label: 'Concluído',
    color: 'emerald',
    icon: CheckCircle,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'red',
    icon: XCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
  },
  postponed: {
    label: 'Adiado',
    color: 'amber',
    icon: AlertCircle,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
  },
} as const;

export type EventStatus = keyof typeof EVENT_STATUS_CONFIG;

/**
 * Helper: Get status config by type and value
 */
export function getStatusConfig(
  type: 'participant',
  status: ParticipantStatus
): typeof PARTICIPANT_STATUS_CONFIG[ParticipantStatus];
export function getStatusConfig(
  type: 'availability',
  status: AvailabilityStatus
): typeof AVAILABILITY_STATUS_CONFIG[AvailabilityStatus];
export function getStatusConfig(
  type: 'event',
  status: EventStatus
): typeof EVENT_STATUS_CONFIG[EventStatus];
export function getStatusConfig(
  type: 'participant' | 'availability' | 'event',
  status: string
): any {
  switch (type) {
    case 'participant':
      return PARTICIPANT_STATUS_CONFIG[status as ParticipantStatus];
    case 'availability':
      return AVAILABILITY_STATUS_CONFIG[status as AvailabilityStatus];
    case 'event':
      return EVENT_STATUS_CONFIG[status as EventStatus];
    default:
      return null;
  }
}
