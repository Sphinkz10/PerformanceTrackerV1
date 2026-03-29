/**
 * DELETE CONFIRMATION
 * Confirm deletion or cancellation of event
 */

import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, XCircle, Trash2, Info } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface DeleteConfirmationProps {
  event: CalendarEvent;
}

export function DeleteConfirmation({ event }: DeleteConfirmationProps) {
  const participantCount = event.athlete_ids?.length || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Warning Header */}
      <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-red-900 mb-2">
              Tem a certeza?
            </h4>
            <p className="text-sm text-red-700">
              Está prestes a eliminar ou cancelar este evento. Esta ação pode ter impacto nos participantes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Event Summary */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
        <h5 className="font-bold text-slate-900 mb-4">Evento a Eliminar:</h5>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-500 mb-1">Título</div>
            <div className="font-semibold text-slate-900">{event.title}</div>
          </div>
          
          {event.description && (
            <div>
              <div className="text-xs text-slate-500 mb-1">Descrição</div>
              <div className="text-sm text-slate-700">{event.description}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Data</div>
              <div className="text-sm font-semibold text-slate-900">
                {event.start_date ? format(new Date(event.start_date), "d 'de' MMMM", { locale: pt }) : '-'}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-slate-500 mb-1">Horário</div>
              <div className="text-sm font-semibold text-slate-900">
                {event.start_date && event.end_date ? (
                  <>
                    {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                  </>
                ) : '-'}
              </div>
            </div>
          </div>
          
          {participantCount > 0 && (
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-semibold">
                  {participantCount} {participantCount === 1 ? 'participante' : 'participantes'} serão afetados
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Options Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cancel Option */}
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <XCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h6 className="font-semibold text-amber-900 mb-1">
                Cancelar Evento
              </h6>
              <p className="text-xs text-amber-700">
                O evento fica marcado como "Cancelado" mas mantém-se no histórico. Recomendado na maioria dos casos.
              </p>
            </div>
          </div>
        </div>
        
        {/* Delete Option */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h6 className="font-semibold text-red-900 mb-1">
                Eliminar Permanentemente
              </h6>
              <p className="text-xs text-red-700">
                O evento é removido completamente da base de dados. Esta ação não pode ser revertida.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Warning */}
      {participantCount > 0 && (
        <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-sm text-sky-800">
              <p className="font-semibold mb-1">Nota Importante</p>
              <p>
                {participantCount === 1 
                  ? 'O participante será notificado sobre a alteração.'
                  : `Os ${participantCount} participantes serão notificados sobre a alteração.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Final Warning */}
      <div className="rounded-xl bg-slate-100 border border-slate-300 p-4">
        <p className="text-sm text-slate-700 text-center">
          Escolha a opção que melhor se adequa à situação.
        </p>
      </div>
    </motion.div>
  );
}
