/**
 * STEP 5: REVIEW
 * Revisão final antes de criar o evento
 */

import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users,
  Tag,
  Palette,
  CheckCircle,
  Edit,
  AlertTriangle,
  Mail,
  Bell,
  QrCode
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CreateEventFormData, EVENT_TYPE_COLORS } from '@/types/calendar';
import { useConflictDetection } from '@/hooks/useConflictDetection';
import { ConflictWarning } from '../../components/ConflictWarning';
import { MOCK_ATHLETES, getMockAthletesByIds } from '../../utils/mockData';

interface Step5Props {
  formData: Partial<CreateEventFormData>;
  workspaceId: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  workout: 'Treino',
  game: 'Jogo',
  competition: 'Competição',
  rest: 'Descanso',
  meeting: 'Reunião',
  testing: 'Avaliação',
  other: 'Outro',
};

export function Step5Review({ formData, workspaceId }: Step5Props) {
  const selectedAthletes = getMockAthletesByIds(formData.athlete_ids || []);
  
  const typeColors = formData.type ? EVENT_TYPE_COLORS[formData.type] : EVENT_TYPE_COLORS.workout;
  
  const hasAllRequired = !!(
    formData.title &&
    formData.start_date &&
    formData.end_date &&
    formData.athlete_ids &&
    formData.athlete_ids.length > 0
  );
  
  // Detect conflicts
  const { conflictingEvents } = useConflictDetection(workspaceId, formData);
  
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
          Revisão Final
        </h3>
        <p className="text-sm text-slate-600">
          Confirme todos os detalhes antes de criar o evento
        </p>
      </div>
      
      {/* Validation Status */}
      {hasAllRequired ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h5 className="font-bold text-emerald-900">Tudo Pronto!</h5>
              <p className="text-sm text-emerald-700">
                O evento está configurado e pronto para ser criado
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <div>
              <h5 className="font-bold text-amber-900">Informação Incompleta</h5>
              <p className="text-sm text-amber-700">
                Volte atrás e preencha todos os campos obrigatórios
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Event Preview Card */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 space-y-6">
        {/* Title & Type */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">
                {formData.title || 'Sem título'}
              </h4>
              {formData.description && (
                <p className="text-sm text-slate-600">
                  {formData.description}
                </p>
              )}
            </div>
            {formData.color && (
              <div
                className="h-12 w-12 rounded-xl shadow-md flex-shrink-0"
                style={{ backgroundColor: formData.color }}
              />
            )}
          </div>
          
          {formData.type && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${typeColors.background} border ${typeColors.border} ${typeColors.text} text-sm font-semibold rounded-full`}>
              {EVENT_TYPE_LABELS[formData.type]}
            </div>
          )}
        </div>
        
        <div className="h-px bg-slate-200" />
        
        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Data</div>
              <div className="font-semibold text-slate-900">
                {formData.start_date ? format(formData.start_date, "EEEE, d 'de' MMMM", { locale: pt }) : '-'}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Horário</div>
              <div className="font-semibold text-slate-900">
                {formData.start_date && formData.end_date ? (
                  <>
                    {format(formData.start_date, 'HH:mm')} - {format(formData.end_date, 'HH:mm')}
                    <span className="text-sm text-slate-600 ml-2">
                      ({Math.round((formData.end_date.getTime() - formData.start_date.getTime()) / 60000)} min)
                    </span>
                  </>
                ) : '-'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Location */}
        {formData.location && (
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Localização</div>
              <div className="font-semibold text-slate-900">{formData.location}</div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Tag className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Participants */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h5 className="font-bold text-slate-900">Participantes</h5>
            <p className="text-sm text-slate-600">
              {selectedAthletes.length} {selectedAthletes.length === 1 ? 'atleta' : 'atletas'} selecionados
            </p>
          </div>
        </div>
        
        {selectedAthletes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedAthletes.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                  {athlete.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">
                    {athlete.name}
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">Nenhum participante selecionado</p>
          </div>
        )}
      </div>
      
      {/* Confirmation Settings */}
      {formData.confirmation_settings && selectedAthletes.length > 0 && (
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900">Configurações de Confirmação</h5>
              <p className="text-sm text-slate-600">
                Sistema de notificações configurado
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Auto Send */}
            {formData.confirmation_settings.auto_send && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-sky-200">
                <Mail className="h-5 w-5 text-sky-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Envio Automático Ativado
                  </div>
                  <div className="text-xs text-slate-600">
                    Confirmações enviadas {formData.confirmation_settings.hours_before}h antes do evento
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            )}
            
            {/* QR Check-in */}
            {formData.confirmation_settings.require_check_in && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-violet-200">
                <QrCode className="h-5 w-5 text-violet-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Check-in com QR Code
                  </div>
                  <div className="text-xs text-slate-600">
                    Participantes devem escanear QR code ao chegar
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            )}
            
            {/* Reminders */}
            {formData.confirmation_settings.enable_reminders && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200">
                <Bell className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Lembretes Automáticos
                  </div>
                  <div className="text-xs text-slate-600">
                    Lembretes enviados {formData.confirmation_settings.reminder_hours_before}h antes
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            )}
            
            {/* No settings active */}
            {!formData.confirmation_settings.auto_send && 
             !formData.confirmation_settings.require_check_in && 
             !formData.confirmation_settings.enable_reminders && (
              <div className="text-center py-4 text-slate-500">
                <p className="text-sm">Nenhuma configuração ativa</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">
            {selectedAthletes.length}
          </div>
          <div className="text-xs text-slate-600 mt-1">Atletas</div>
        </div>
        
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">
            {formData.start_date && formData.end_date
              ? Math.round((formData.end_date.getTime() - formData.start_date.getTime()) / 60000)
              : 0}
          </div>
          <div className="text-xs text-slate-600 mt-1">Minutos</div>
        </div>
        
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">
            {formData.tags?.length || 0}
          </div>
          <div className="text-xs text-slate-600 mt-1">Tags</div>
        </div>
      </div>
      
      {/* Conflict Warning */}
      {conflictingEvents.length > 0 && (
        <ConflictWarning 
          conflicts={conflictingEvents}
          currentEvent={formData}
        />
      )}
      
      {/* Final Note */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
        <p className="text-sm text-slate-700">
          <span className="font-semibold">Nota:</span> Após criar o evento, pode editá-lo ou adicionar mais participantes a qualquer momento.
        </p>
      </div>
    </motion.div>
  );
}