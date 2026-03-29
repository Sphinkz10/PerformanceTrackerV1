/**
 * STEP 2: DATE RANGE
 * Choose start date and default time
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Plan {
  id: string;
  name: string;
  weeks_count?: number;
  total_sessions?: number;
}

interface WizardStep2Props {
  plan: Plan;
  startDate: Date;
  defaultTime: string;
  onStartDateChange: (date: Date) => void;
  onDefaultTimeChange: (time: string) => void;
}

export function WizardStep2DateRange({
  plan,
  startDate,
  defaultTime,
  onStartDateChange,
  onDefaultTimeChange,
}: WizardStep2Props) {
  const endDate = plan.weeks_count 
    ? addWeeks(startDate, plan.weeks_count) 
    : null;
  
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
          Definir Datas
        </h3>
        <p className="text-sm text-slate-600">
          Escolha quando o plano deve começar e o horário padrão das sessões
        </p>
      </div>
      
      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Data de Início
        </label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => onStartDateChange(new Date(e.target.value))}
            className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
          />
        </div>
      </div>
      
      {/* Default Time */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Horário Padrão
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="time"
            value={defaultTime}
            onChange={(e) => onDefaultTimeChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
          />
        </div>
        <p className="text-xs text-slate-500">
          Todas as sessões serão agendadas para este horário por defeito
        </p>
      </div>
      
      {/* Date Range Preview */}
      <div className="rounded-xl bg-violet-50 border border-violet-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-violet-900 mb-2">
              Período do Plan
            </h5>
            <div className="space-y-1 text-sm text-violet-700">
              <p>
                <span className="font-semibold">Início:</span>{' '}
                {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}
              </p>
              {endDate && (
                <p>
                  <span className="font-semibold">Fim:</span>{' '}
                  {format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}
                </p>
              )}
              {plan.weeks_count && (
                <p>
                  <span className="font-semibold">Duração:</span>{' '}
                  {plan.weeks_count} semanas
                </p>
              )}
              {plan.total_sessions && (
                <p>
                  <span className="font-semibold">Total:</span>{' '}
                  {plan.total_sessions} sessões
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Atalhos Rápidos
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onStartDateChange(new Date())}
            className="px-3 py-2 text-xs font-medium rounded-lg border-2 border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all"
          >
            Hoje
          </button>
          <button
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              onStartDateChange(tomorrow);
            }}
            className="px-3 py-2 text-xs font-medium rounded-lg border-2 border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all"
          >
            Amanhã
          </button>
          <button
            onClick={() => {
              const nextMonday = new Date();
              const day = nextMonday.getDay();
              const daysUntilMonday = day === 0 ? 1 : 8 - day;
              nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
              onStartDateChange(nextMonday);
            }}
            className="px-3 py-2 text-xs font-medium rounded-lg border-2 border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all"
          >
            Próx. Segunda
          </button>
          <button
            onClick={() => {
              const nextMonth = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              nextMonth.setDate(1);
              onStartDateChange(nextMonth);
            }}
            className="px-3 py-2 text-xs font-medium rounded-lg border-2 border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all"
          >
            Próx. Mês
          </button>
        </div>
      </div>
    </motion.div>
  );
}
