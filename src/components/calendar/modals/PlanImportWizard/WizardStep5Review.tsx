/**
 * STEP 5: REVIEW & CONFIRM
 * Final review before bulk creating events
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Dumbbell, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Plan {
  id: string;
  name: string;
  description?: string;
  weeks_count?: number;
}

interface EventToCreate {
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  workout_id?: string;
  athlete_ids: string[];
  week_number: number;
  day_of_week: number;
}

interface WizardStep5Props {
  plan: Plan;
  eventsToCreate: EventToCreate[];
  selectedAthletes: string[];
  startDate: Date;
}

export function WizardStep5Review({
  plan,
  eventsToCreate,
  selectedAthletes,
  startDate,
}: WizardStep5Props) {
  // Calculate stats
  const totalEvents = eventsToCreate.length;
  const totalHours = eventsToCreate.reduce((sum, event) => {
    const duration = (event.end_time.getTime() - event.start_time.getTime()) / (1000 * 60 * 60);
    return sum + duration;
  }, 0);
  
  const firstEvent = eventsToCreate[0];
  const lastEvent = eventsToCreate[eventsToCreate.length - 1];
  
  // Group events by week
  const eventsByWeek = eventsToCreate.reduce((acc, event) => {
    const week = event.week_number;
    if (!acc[week]) acc[week] = [];
    acc[week].push(event);
    return acc;
  }, {} as Record<number, EventToCreate[]>);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Confirmar Importação
        </h3>
        <p className="text-sm text-slate-600">
          Reveja os detalhes antes de criar os eventos
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Events */}
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Eventos</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalEvents}</p>
        </div>
        
        {/* Total Athletes */}
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Atletas</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{selectedAthletes.length}</p>
        </div>
        
        {/* Total Weeks */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Semanas</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{plan.weeks_count || 0}</p>
        </div>
        
        {/* Total Hours */}
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Horas</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalHours.toFixed(1)}</p>
        </div>
      </div>
      
      {/* Plan Details */}
      <div className="rounded-xl bg-violet-50 border border-violet-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h5 className="font-bold text-violet-900 mb-2">
              {plan.name}
            </h5>
            {plan.description && (
              <p className="text-sm text-violet-700 mb-3">
                {plan.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-semibold text-violet-900">Início:</span>{' '}
                <span className="text-violet-700">
                  {format(startDate, "d 'de' MMM", { locale: pt })}
                </span>
              </div>
              {firstEvent && lastEvent && (
                <div>
                  <span className="font-semibold text-violet-900">Período:</span>{' '}
                  <span className="text-violet-700">
                    {format(firstEvent.start_time, "d 'de' MMM", { locale: pt })} - {format(lastEvent.start_time, "d 'de' MMM", { locale: pt })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Events Preview */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-900">
          Eventos a Criar ({totalEvents})
        </h4>
        
        <div className="max-h-64 overflow-y-auto space-y-3">
          {Object.entries(eventsByWeek)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([weekNum, weekEvents]) => (
              <div key={weekNum} className="space-y-2">
                {/* Week Header */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                  <CalendarIcon className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    Semana {weekNum} - {weekEvents.length} eventos
                  </span>
                </div>
                
                {/* Week Events */}
                <div className="space-y-1.5 pl-4">
                  {weekEvents
                    .sort((a, b) => a.start_time.getTime() - b.start_time.getTime())
                    .slice(0, 3) // Show only first 3 per week
                    .map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                        <span className="font-medium">
                          {format(event.start_time, "EEE d/M", { locale: pt })}
                        </span>
                        <span>às {format(event.start_time, 'HH:mm')}</span>
                        <span className="text-slate-400">•</span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                  {weekEvents.length > 3 && (
                    <p className="text-xs text-slate-500 pl-4">
                      + {weekEvents.length - 3} eventos...
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-amber-900 mb-1">
              Atenção
            </h5>
            <p className="text-sm text-amber-700">
              Serão criados {totalEvents} eventos no calendário. Esta ação não pode ser desfeita em massa. Certifique-se de que todas as informações estão corretas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Success Preview */}
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-emerald-900 mb-1">
              Pronto para Importar!
            </h5>
            <p className="text-sm text-emerald-700">
              Clique em "Criar {totalEvents} Eventos" para completar a importação. Todos os atletas selecionados serão automaticamente adicionados aos eventos.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
