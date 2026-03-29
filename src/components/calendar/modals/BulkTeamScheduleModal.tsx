/**
 * BULK TEAM SCHEDULE MODAL
 * Create multiple events for a team in one operation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { TeamGroup } from '@/types/team';
import type { CalendarEvent } from '@/types/calendar';

interface BulkTeamScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (operation: BulkScheduleOperation) => Promise<BulkScheduleResult>;
  teamGroup: TeamGroup;
}

interface BulkScheduleOperation {
  team_group_id: string;
  event_template: Partial<CalendarEvent>;
  dates: string[];
  options: {
    skip_conflicts: boolean;
    auto_resolve: boolean;
    send_notifications: boolean;
  };
}

interface BulkScheduleResult {
  success: number;
  failed: number;
  conflicts: number;
  created_events: string[];
}

const WEEKDAYS = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

export function BulkTeamScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  teamGroup
}: BulkTeamScheduleModalProps) {
  const [step, setStep] = useState<'setup' | 'preview' | 'result'>('setup');
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Event template
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CalendarEvent['event_type']>('training');
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  
  // Scheduling
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri
  
  // Options
  const [skipConflicts, setSkipConflicts] = useState(true);
  const [autoResolve, setAutoResolve] = useState(false);
  const [sendNotifications, setSendNotifications] = useState(true);
  
  // Result
  const [result, setResult] = useState<BulkScheduleResult | null>(null);
  
  // Calculate dates
  const generatedDates = React.useMemo(() => {
    const dates: string[] = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      if (selectedWeekdays.includes(current.getDay())) {
        dates.push(format(current, 'yyyy-MM-dd'));
      }
      current = addDays(current, 1);
    }
    
    return dates;
  }, [startDate, endDate, selectedWeekdays]);
  
  const toggleWeekday = (day: number) => {
    setSelectedWeekdays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };
  
  const handlePreview = () => {
    if (!title.trim() || generatedDates.length === 0) return;
    setStep('preview');
  };
  
  const handleSchedule = async () => {
    setIsScheduling(true);
    
    try {
      const operation: BulkScheduleOperation = {
        team_group_id: teamGroup.id,
        event_template: {
          title,
          event_type: eventType,
          start_time: startTime,
          duration_minutes: duration,
          location: location || undefined,
        },
        dates: generatedDates,
        options: {
          skip_conflicts: skipConflicts,
          auto_resolve: autoResolve,
          send_notifications: sendNotifications,
        }
      };
      
      const scheduleResult = await onSchedule(operation);
      setResult(scheduleResult);
      setStep('result');
    } catch (error) {
      console.error('Error scheduling events:', error);
    } finally {
      setIsScheduling(false);
    }
  };
  
  const handleClose = () => {
    setStep('setup');
    setResult(null);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-slate-200 bg-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: teamGroup.color + '20' }}
              >
                <Zap className="h-5 w-5" style={{ color: teamGroup.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Agendamento em Massa
                </h2>
                <p className="text-sm text-slate-600">{teamGroup.name}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="h-8 w-8 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all"
            >
              <X className="h-4 w-4 text-slate-700" />
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="p-5">
            {step === 'setup' && (
              <div className="space-y-5">
                {/* Event Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Detalhes do Evento</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Treino de Força"
                      className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as CalendarEvent['event_type'])}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      >
                        <option value="training">Treino</option>
                        <option value="competition">Competição</option>
                        <option value="meeting">Reunião</option>
                        <option value="recovery">Recuperação</option>
                        <option value="assessment">Avaliação</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Local
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ginásio"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Hora Início
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Duração (min)
                      </label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                        min={15}
                        step={15}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Schedule Pattern */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Padrão de Agendamento</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Data Início
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Data Fim
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Dias da Semana
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map(({ value, label }) => (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleWeekday(value)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            selectedWeekdays.includes(value)
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                    <p className="text-sm text-sky-900">
                      <span className="font-semibold">{generatedDates.length}</span> eventos serão criados
                    </p>
                  </div>
                </div>
                
                {/* Options */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Opções</h3>
                  
                  <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipConflicts}
                      onChange={(e) => setSkipConflicts(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900">Ignorar conflitos</span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Não criar eventos com conflitos de horário
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendNotifications}
                      onChange={(e) => setSendNotifications(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900">Enviar notificações</span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Notificar atletas sobre os novos eventos
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
            
            {step === 'preview' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        Confirme a operação
                      </p>
                      <p className="text-xs text-amber-800">
                        Serão criados {generatedDates.length} eventos para {teamGroup.athlete_ids.length} atletas.
                        Esta operação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Resumo:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Evento:</span>
                      <span className="font-medium text-slate-900">{title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tipo:</span>
                      <span className="font-medium text-slate-900 capitalize">{eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Horário:</span>
                      <span className="font-medium text-slate-900">{startTime} ({duration} min)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Período:</span>
                      <span className="font-medium text-slate-900">
                        {format(new Date(startDate), 'dd/MM/yyyy')} - {format(new Date(endDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total de Eventos:</span>
                      <span className="font-bold text-sky-600">{generatedDates.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 'result' && result && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900 mb-1">
                        Agendamento Concluído
                      </p>
                      <p className="text-xs text-emerald-800">
                        {result.success} eventos foram criados com sucesso
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{result.success}</p>
                    <p className="text-xs text-emerald-800 font-medium">Sucesso</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <p className="text-2xl font-bold text-amber-600">{result.conflicts}</p>
                    <p className="text-xs text-amber-800 font-medium">Conflitos</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
                    <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                    <p className="text-xs text-red-800 font-medium">Falhas</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-2 p-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            {step === 'setup' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePreview}
                  disabled={!title.trim() || generatedDates.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pré-visualizar ({generatedDates.length})
                </motion.button>
              </>
            )}
            
            {step === 'preview' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('setup')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Voltar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSchedule}
                  disabled={isScheduling}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="h-4 w-4" />
                  {isScheduling ? 'A criar...' : 'Confirmar e Criar'}
                </motion.button>
              </>
            )}
            
            {step === 'result' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                Concluir
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
