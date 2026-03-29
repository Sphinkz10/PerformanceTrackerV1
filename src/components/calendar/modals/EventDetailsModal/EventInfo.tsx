/**
 * EVENT INFO - Display Mode
 * Show event details in read-only mode with tabs
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users,
  Tag,
  Palette,
  FileText,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardCheck,
  Info,
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent, EVENT_TYPE_COLORS } from '@/types/calendar';
import { ParticipantsList } from '../../components/ParticipantsList';
import { AttendanceSheet } from '../../components/AttendanceSheet';
import { ParticipantsTab } from './ParticipantsTab';
import { MOCK_ATHLETES, getMockAthletesByIds } from '../../utils/mockData';
import { EVENT_STATUS_CONFIG } from '../../utils/statusConfigs';

interface EventInfoProps {
  event: CalendarEvent;
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

export function EventInfo({ event, workspaceId }: EventInfoProps) {
  const typeColors = EVENT_TYPE_COLORS[event.type];
  const statusConfig = EVENT_STATUS_CONFIG[event.status || 'scheduled'];
  
  const participants = getMockAthletesByIds(event.athlete_ids || []);
  
  const duration = event.start_date && event.end_date
    ? Math.round((new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / 60000)
    : 0;
  
  const [activeTab, setActiveTab] = useState('details');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Title & Type */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-slate-600">
                {event.description}
              </p>
            )}
          </div>
          {event.color && (
            <div
              className="h-16 w-16 rounded-2xl shadow-lg flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${typeColors.background} border ${typeColors.border} ${typeColors.text} text-sm font-semibold rounded-full`}>
            {EVENT_TYPE_LABELS[event.type]}
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-${statusConfig.color}-100 text-${statusConfig.color}-700 text-sm font-semibold rounded-full`}>
            {React.createElement(statusConfig.icon, { className: 'h-3.5 w-3.5' })}
            {statusConfig.label}
          </div>
        </div>
      </div>
      
      <div className="h-px bg-slate-200" />
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'details'
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
          }`}
        >
          <Info className="h-4 w-4" />
          Detalhes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('participants')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'participants'
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
          }`}
        >
          <Users className="h-4 w-4" />
          Participantes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          Presenças
        </motion.button>
      </div>
      
      {/* Details Grid */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Date */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Data</div>
              <div className="font-semibold text-slate-900">
                {event.start_date ? format(new Date(event.start_date), "EEEE, d 'de' MMMM", { locale: pt }) : '-'}
              </div>
              <div className="text-sm text-slate-600">
                {event.start_date ? format(new Date(event.start_date), 'yyyy', { locale: pt }) : ''}
              </div>
            </div>
          </div>
          
          {/* Time */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Horário</div>
              <div className="font-semibold text-slate-900">
                {event.start_date && event.end_date ? (
                  <>
                    {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                  </>
                ) : '-'}
              </div>
              <div className="text-sm text-slate-600">
                {duration} minutos
              </div>
            </div>
          </div>
          
          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">Localização</div>
                <div className="font-semibold text-slate-900">{event.location}</div>
              </div>
            </div>
          )}
          
          {/* Coach */}
          {event.coach_id && (
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">Treinador</div>
                <div className="font-semibold text-slate-900">Coach {event.coach_id.slice(0, 8)}</div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Tags */}
      {activeTab === 'details' && event.tags && event.tags.length > 0 && (
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Tag className="h-6 w-6 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-500 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
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
      
      {/* Notes */}
      {activeTab === 'details' && event.notes && (
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-sky-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-500 mb-2">Notas</div>
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {event.notes}
            </div>
          </div>
        </div>
      )}
      
      <div className="h-px bg-slate-200" />
      
      {/* Participants */}
      {activeTab === 'participants' && (
        <ParticipantsTab event={event} workspaceId={workspaceId} />
      )}
      
      <div className="h-px bg-slate-200" />
      
      {/* Attendance Tracking */}
      {activeTab === 'attendance' && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900">Registo de Presenças</h5>
              <p className="text-sm text-slate-600">
                Marcar presenças dos participantes
              </p>
            </div>
          </div>
          
          <AttendanceSheet
            eventId={event.id}
            workspaceId={workspaceId}
            canEdit={true}
          />
        </div>
      )}
      
      {/* Metadata */}
      {event.workout_id && (
        <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm text-sky-800">
              <p className="font-semibold mb-1">Workout Associado</p>
              <p>ID: {event.workout_id}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}