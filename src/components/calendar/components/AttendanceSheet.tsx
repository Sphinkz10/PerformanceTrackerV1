/**
 * ATTENDANCE SHEET COMPONENT
 * 
 * Mark and track event attendance
 * 
 * Features:
 * - Mark attendance (present/absent/late/excused)
 * - Bulk operations (mark all present, clear all)
 * - Attendance summary stats
 * - Visual status badges
 * - Export/print ready
 * 
 * @module calendar/components/AttendanceSheet
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  UserMinus,
  Eraser,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mutate } from 'swr';
import { useEventParticipants } from '@/hooks/use-api';

// ============================================================================
// TYPES
// ============================================================================

interface AttendanceSheetProps {
  eventId: string;
  workspaceId: string;
  canEdit?: boolean;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | null;

// Status configuration
const ATTENDANCE_CONFIG = {
  present: {
    label: 'Presente',
    icon: CheckCircle,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    button: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
  },
  absent: {
    label: 'Ausente',
    icon: XCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    button: 'bg-red-50 hover:bg-red-100 text-red-600',
  },
  late: {
    label: 'Atrasado',
    icon: Clock,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    button: 'bg-amber-50 hover:bg-amber-100 text-amber-600',
  },
  excused: {
    label: 'Justificado',
    icon: FileText,
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-200',
    button: 'bg-sky-50 hover:bg-sky-100 text-sky-600',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function AttendanceSheet({
  eventId,
  workspaceId,
  canEdit = true,
}: AttendanceSheetProps) {
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [bulkMarking, setBulkMarking] = useState(false);

  // Fetch participants
  const { participants, isLoading, error } = useEventParticipants(eventId, workspaceId);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleMarkAttendance = async (
    athleteId: string,
    athleteName: string,
    status: AttendanceStatus
  ) => {
    if (!status) return;

    setMarkingId(athleteId);

    try {
      const response = await fetch(
        `/api/calendar-events/${eventId}/participants/attendance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId,
            athleteIds: [athleteId],
            status,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to mark attendance');
      }

      // Invalidate cache
      mutate((key) => typeof key === 'string' && key.includes('/participants'));

      toast.success(`${athleteName}: ${ATTENDANCE_CONFIG[status].label}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao marcar presença');
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    setBulkMarking(true);

    try {
      const response = await fetch(
        `/api/calendar-events/${eventId}/participants/attendance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId,
            markAll: true,
            status: 'present',
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to mark all present');
      }

      const data = await response.json();

      // Invalidate cache
      mutate((key) => typeof key === 'string' && key.includes('/participants'));

      toast.success(data.message || 'Todos marcados como presentes');
    } catch (error) {
      console.error('Error marking all present:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao marcar presença');
    } finally {
      setBulkMarking(false);
    }
  };

  const handleClearAttendance = async () => {
    if (!confirm('Limpar todas as presenças?')) {
      return;
    }

    setBulkMarking(true);

    try {
      // We'll update all participants to have null attendance_status
      // by using PATCH on participants endpoint
      const response = await fetch(
        `/api/calendar-events/${eventId}/participants?workspace_id=${workspaceId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            athleteIds: participants.map(p => p.athlete_id),
            attendance_status: null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to clear attendance');
      }

      // Invalidate cache
      mutate((key) => typeof key === 'string' && key.includes('/participants'));

      toast.success('Presenças limpas');
    } catch (error) {
      console.error('Error clearing attendance:', error);
      toast.error('Erro ao limpar presenças');
    } finally {
      setBulkMarking(false);
    }
  };

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const total = participants.length;
  const present = participants.filter(p => p.attendance_status === 'present').length;
  const absent = participants.filter(p => p.attendance_status === 'absent').length;
  const late = participants.filter(p => p.attendance_status === 'late').length;
  const excused = participants.filter(p => p.attendance_status === 'excused').length;
  const notMarked = participants.filter(p => !p.attendance_status).length;

  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  // ============================================================================
  // RENDER
  // ============================================================================

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-600">Carregando presenças...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-sm text-red-700">Erro ao carregar presenças</p>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-600">Nenhum participante</p>
        <p className="text-sm text-slate-500 mt-1">
          Adicione participantes para marcar presença
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllPresent}
            disabled={bulkMarking}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkMarking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Marcando...
              </>
            ) : (
              <>
                <CheckCheck className="h-4 w-4" />
                Marcar Todos Presentes
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearAttendance}
            disabled={bulkMarking || notMarked === total}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eraser className="h-4 w-4" />
            Limpar Tudo
          </motion.button>
        </div>
      )}

      {/* Attendance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Presentes</div>
          <div className="font-bold text-emerald-600 text-xl">{present}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Ausentes</div>
          <div className="font-bold text-red-600 text-xl">{absent}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Atrasados</div>
          <div className="font-bold text-amber-600 text-xl">{late}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Justificados</div>
          <div className="font-bold text-sky-600 text-xl">{excused}</div>
        </div>
        <div className="text-center sm:col-span-1 col-span-2">
          <div className="text-xs text-slate-500 mb-1">Taxa de Presença</div>
          <div className="font-bold text-slate-900 text-xl">{attendanceRate}%</div>
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {participants.map((participant, index) => {
            const athlete = participant.athletes;
            if (!athlete) return null;

            const status = participant.attendance_status as AttendanceStatus;
            const statusConfig = status ? ATTENDANCE_CONFIG[status] : null;
            const isMarking = markingId === athlete.id;

            return (
              <motion.div
                key={participant.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200"
              >
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {athlete.avatar_url ? (
                    <img
                      src={athlete.avatar_url}
                      alt={athlete.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="h-5 w-5 text-slate-600" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h6 className="font-semibold text-slate-900 truncate">
                    {athlete.name}
                  </h6>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    {athlete.team && <span>{athlete.team}</span>}
                    {participant.attendance_marked_at && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">
                          {new Date(participant.attendance_marked_at).toLocaleTimeString('pt-PT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                {statusConfig && (
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                    {React.createElement(statusConfig.icon, { className: `h-3.5 w-3.5 ${statusConfig.text}` })}
                    <span className={`text-xs font-medium ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                {canEdit && (
                  <div className="flex items-center gap-1 shrink-0">
                    {isMarking ? (
                      <div className="h-8 w-32 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMarkAttendance(athlete.id, athlete.name, 'present')}
                          className={`h-8 w-8 rounded-lg ${ATTENDANCE_CONFIG.present.button} flex items-center justify-center transition-colors`}
                          title="Presente"
                        >
                          <UserCheck className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMarkAttendance(athlete.id, athlete.name, 'late')}
                          className={`h-8 w-8 rounded-lg ${ATTENDANCE_CONFIG.late.button} flex items-center justify-center transition-colors`}
                          title="Atrasado"
                        >
                          <Clock className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMarkAttendance(athlete.id, athlete.name, 'absent')}
                          className={`h-8 w-8 rounded-lg ${ATTENDANCE_CONFIG.absent.button} flex items-center justify-center transition-colors`}
                          title="Ausente"
                        >
                          <UserX className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMarkAttendance(athlete.id, athlete.name, 'excused')}
                          className={`h-8 w-8 rounded-lg ${ATTENDANCE_CONFIG.excused.button} flex items-center justify-center transition-colors`}
                          title="Justificado"
                        >
                          <UserMinus className="h-4 w-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}