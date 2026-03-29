/**
 * BULK MOVE MODAL
 * Move multiple events to a new date/time
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, MoveRight, AlertCircle } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { CalendarEvent } from '@/types/calendar';

interface BulkMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvents: CalendarEvent[];
  workspaceId: string;
  onSuccess?: () => void;
}

export function BulkMoveModal({
  isOpen,
  onClose,
  selectedEvents,
  workspaceId,
  onSuccess,
}: BulkMoveModalProps) {
  const [targetDate, setTargetDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [targetTime, setTargetTime] = useState<string>('09:00');
  const [maintainRelativePositions, setMaintainRelativePositions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleMove = async () => {
    if (selectedEvents.length === 0) {
      toast.error('Nenhum evento selecionado');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate time difference for first event
      const firstEvent = selectedEvents[0];
      const firstEventDate = parseISO(firstEvent.start_date);
      const newDateTime = new Date(`${targetDate}T${targetTime}`);

      // If maintaining relative positions, calculate offset
      const timeOffset = maintainRelativePositions
        ? newDateTime.getTime() - firstEventDate.getTime()
        : 0;

      // Move each event
      const movePromises = selectedEvents.map(async (event) => {
        let newStartDate: Date;
        
        if (maintainRelativePositions) {
          // Maintain relative position
          const eventDate = parseISO(event.start_date);
          newStartDate = new Date(eventDate.getTime() + timeOffset);
        } else {
          // All to same date/time
          newStartDate = newDateTime;
        }

        // Calculate end date based on duration
        const originalStart = parseISO(event.start_date);
        const originalEnd = parseISO(event.end_date);
        const duration = originalEnd.getTime() - originalStart.getTime();
        const newEndDate = new Date(newStartDate.getTime() + duration);

        const response = await fetch(`/api/workspaces/${workspaceId}/calendar-events`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            start_date: newStartDate.toISOString(),
            end_date: newEndDate.toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao mover evento: ${event.title}`);
        }

        return response.json();
      });

      await Promise.all(movePromises);

      toast.success(`${selectedEvents.length} evento(s) movido(s) com sucesso!`);
      
      // Refresh calendar
      mutate((key) => typeof key === 'string' && key.includes('/calendar-events'));
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Bulk move error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao mover eventos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <MoveRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Mover Eventos
              </h2>
              <p className="text-sm text-slate-500">
                {selectedEvents.length} evento(s) selecionado(s)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected Events Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Eventos a mover:
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between text-sm bg-white rounded-lg p-2"
                >
                  <span className="font-medium text-slate-900 truncate flex-1">
                    {event.title}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    {format(parseISO(event.start_date), 'dd/MM HH:mm', { locale: pt })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Calendar className="h-4 w-4" />
              Data de Destino
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all disabled:opacity-50"
            />
          </div>

          {/* Target Time */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock className="h-4 w-4" />
              Hora de Destino
            </label>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all disabled:opacity-50"
            />
          </div>

          {/* Maintain Relative Positions */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200">
            <input
              type="checkbox"
              id="maintainRelative"
              checked={maintainRelativePositions}
              onChange={(e) => setMaintainRelativePositions(e.target.checked)}
              disabled={isSubmitting}
              className="mt-1 h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
            />
            <div className="flex-1">
              <label
                htmlFor="maintainRelative"
                className="text-sm font-semibold text-sky-900 cursor-pointer"
              >
                Manter posições relativas
              </label>
              <p className="text-xs text-sky-700 mt-1">
                Se ativo, os eventos mantêm o espaçamento entre si. 
                Se desativo, todos os eventos são movidos para a mesma data/hora.
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Atenção
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Esta ação não pode ser desfeita. Certifique-se de que a nova data/hora 
                não cria conflitos com eventos existentes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMove}
            disabled={isSubmitting || selectedEvents.length === 0}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl shadow-md hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Movendo...
              </>
            ) : (
              <>
                <MoveRight className="h-4 w-4" />
                Mover {selectedEvents.length} Evento(s)
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
