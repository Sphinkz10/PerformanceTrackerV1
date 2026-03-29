/**
 * CONFLICT RESOLVER MODAL
 * Interactive modal to resolve scheduling conflicts
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  AlertTriangle, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lightbulb,
  Zap,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { getSharedAthletes } from '@/utils/calendarConflicts';
import { ConflictBadge, calculateSeverity } from '../components/ConflictBadge';
import { MOCK_ATHLETES, getMockAthleteById } from '../utils/mockData';

interface ConflictResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEvent: Partial<CalendarEvent> & {
    title?: string;
    start_date: Date | string;
    end_date: Date | string;
    athlete_ids?: string[];
  };
  conflicts: CalendarEvent[];
  onResolve: (resolution: ConflictResolution) => void;
  workspaceId: string;
}

export type ResolutionStrategy = 
  | 'keep_both'        // Manter ambos (ignorar conflito)
  | 'reschedule_new'   // Reagendar novo evento
  | 'reschedule_old'   // Reagendar evento existente
  | 'cancel_old'       // Cancelar evento existente
  | 'remove_athletes'  // Remover atletas conflitantes
  | 'smart_suggest';   // Usar sugestão inteligente

export interface ConflictResolution {
  strategy: ResolutionStrategy;
  newStartDate?: Date;
  newEndDate?: Date;
  eventsToCancel?: string[];
  athletesToRemove?: string[];
  smartSuggestion?: SmartSuggestion;
}

export interface SmartSuggestion {
  id: string;
  type: 'time_shift' | 'athlete_split' | 'duration_adjust' | 'day_change';
  description: string;
  impact: 'low' | 'medium' | 'high';
  newStartDate?: Date;
  newEndDate?: Date;
  athleteGroups?: {
    group1: string[];
    group2: string[];
  };
}

export function ConflictResolverModal({
  isOpen,
  onClose,
  targetEvent,
  conflicts,
  onResolve,
  workspaceId,
}: ConflictResolverModalProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<ResolutionStrategy>('smart_suggest');
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(
    conflicts[0]?.id || null
  );

  // Generate smart suggestions (only if targetEvent exists)
  const smartSuggestions = useMemo(() => {
    if (!targetEvent || conflicts.length === 0) return [];
    return generateSmartSuggestions(targetEvent, conflicts);
  }, [targetEvent, conflicts]);

  const [selectedSuggestion, setSelectedSuggestion] = useState<SmartSuggestion | null>(
    smartSuggestions[0] || null
  );

  const selectedConflict = conflicts.find(c => c.id === selectedConflictId);
  const sharedAthletes = selectedConflict && targetEvent
    ? getSharedAthletes(targetEvent, selectedConflict)
    : [];

  const severity = calculateSeverity(conflicts.length);

  const handleResolve = () => {
    const resolution: ConflictResolution = {
      strategy: selectedStrategy,
      smartSuggestion: selectedSuggestion || undefined,
    };

    if (selectedStrategy === 'reschedule_new' && selectedSuggestion?.newStartDate) {
      resolution.newStartDate = selectedSuggestion.newStartDate;
      resolution.newEndDate = selectedSuggestion.newEndDate;
    }

    if (selectedStrategy === 'cancel_old' && selectedConflictId) {
      resolution.eventsToCancel = [selectedConflictId];
    }

    if (selectedStrategy === 'remove_athletes') {
      resolution.athletesToRemove = sharedAthletes;
    }

    onResolve(resolution);
    onClose();
  };

  if (!isOpen) return null;
  
  // Don't render if no conflicts or no target event
  if (conflicts.length === 0 || !targetEvent) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  ⚠️ Resolução de Conflitos
                </h2>
                <p className="text-sm text-slate-600">
                  {conflicts.length} conflito{conflicts.length > 1 ? 's' : ''} detectado{conflicts.length > 1 ? 's' : ''} • {sharedAthletes.length} atleta{sharedAthletes.length > 1 ? 's' : ''} afetado{sharedAthletes.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ConflictBadge 
                severity={severity}
                conflictCount={conflicts.length}
                sharedAthletes={sharedAthletes.length}
                size="lg"
              />
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Event Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* New Event */}
              <div className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900">Novo Evento</h3>
                </div>
                <EventCard event={targetEvent as CalendarEvent} isNew />
              </div>

              {/* Conflicting Event */}
              {selectedConflict && (
                <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900">Conflito</h3>
                  </div>
                  <EventCard event={selectedConflict} />
                </div>
              )}
            </div>

            {/* Conflict List (if multiple) */}
            {conflicts.length > 1 && (
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Todos os Conflitos ({conflicts.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {conflicts.map((conflict) => (
                    <motion.button
                      key={conflict.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedConflictId(conflict.id)}
                      className={`
                        p-3 rounded-xl text-left transition-all
                        ${selectedConflictId === conflict.id
                          ? 'bg-white border-2 border-amber-400 shadow-md'
                          : 'bg-white/60 border border-amber-200 hover:bg-white'
                        }
                      `}
                    >
                      <div className="font-semibold text-sm text-slate-900 mb-1">
                        {conflict.title}
                      </div>
                      <div className="text-xs text-slate-600">
                        {format(new Date(conflict.start_date), 'HH:mm')} - {format(new Date(conflict.end_date), 'HH:mm')}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {smartSuggestions.length > 0 && (
              <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
                  💡 Sugestões Inteligentes
                </h4>
                <div className="space-y-3">
                  {smartSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      isSelected={selectedSuggestion?.id === suggestion.id}
                      onClick={() => {
                        setSelectedSuggestion(suggestion);
                        setSelectedStrategy('smart_suggest');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Manual Resolution Options */}
            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
              <h4 className="font-bold text-slate-900 mb-4">Opções de Resolução</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ResolutionOption
                  strategy="keep_both"
                  title="Manter Ambos"
                  description="Ignorar conflito (não recomendado)"
                  icon={CheckCircle}
                  color="slate"
                  selected={selectedStrategy === 'keep_both'}
                  onClick={() => setSelectedStrategy('keep_both')}
                />
                <ResolutionOption
                  strategy="cancel_old"
                  title="Cancelar Existente"
                  description="Cancelar evento conflitante"
                  icon={XCircle}
                  color="red"
                  selected={selectedStrategy === 'cancel_old'}
                  onClick={() => setSelectedStrategy('cancel_old')}
                />
                <ResolutionOption
                  strategy="remove_athletes"
                  title="Remover Atletas"
                  description={`Remover ${sharedAthletes.length} atleta${sharedAthletes.length > 1 ? 's' : ''} do novo evento`}
                  icon={Users}
                  color="amber"
                  selected={selectedStrategy === 'remove_athletes'}
                  onClick={() => setSelectedStrategy('remove_athletes')}
                  disabled={!sharedAthletes.length}
                />
                <ResolutionOption
                  strategy="reschedule_new"
                  title="Reagendar Novo"
                  description="Escolher novo horário"
                  icon={RefreshCw}
                  color="sky"
                  selected={selectedStrategy === 'reschedule_new'}
                  onClick={() => setSelectedStrategy('reschedule_new')}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 p-6 border-t border-slate-200 bg-slate-50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </motion.button>
            
            <div className="flex items-center gap-3">
              {selectedStrategy === 'keep_both' && (
                <div className="text-sm text-amber-600 font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Conflito não será resolvido
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResolve}
                disabled={!selectedStrategy}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                Aplicar Resolução
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Event Card Component
 */
function EventCard({ 
  event, 
  isNew = false 
}: { 
  event: Partial<CalendarEvent>; 
  isNew?: boolean;
}) {
  const athletes = MOCK_ATHLETES.filter(a => event.athlete_ids?.includes(a.id));

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-bold text-slate-900 mb-1">
          {event.title || 'Sem título'}
        </h4>
        {event.description && (
          <p className="text-xs text-slate-600">{event.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-slate-400" />
          <span className="text-slate-700">
            {event.start_date && format(new Date(event.start_date), "d 'de' MMMM", { locale: pt })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-slate-700">
            {event.start_date && format(new Date(event.start_date), 'HH:mm')} - {event.end_date && format(new Date(event.end_date), 'HH:mm')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="text-slate-700">
            {athletes.length} atleta{athletes.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {athletes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {athletes.slice(0, 3).map((athlete) => (
            <span
              key={athlete.id}
              className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
            >
              {athlete.name.split(' ')[0]}
            </span>
          ))}
          {athletes.length > 3 && (
            <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full font-semibold">
              +{athletes.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Suggestion Card Component
 */
function SuggestionCard({
  suggestion,
  isSelected,
  onClick,
}: {
  suggestion: SmartSuggestion;
  isSelected: boolean;
  onClick: () => void;
}) {
  const impactColors = {
    low: 'text-emerald-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl text-left transition-all
        ${isSelected
          ? 'bg-emerald-100 border-2 border-emerald-400 shadow-md'
          : 'bg-white border border-emerald-200 hover:bg-emerald-50'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-semibold text-slate-900 mb-1">
            {suggestion.description}
          </div>
          {suggestion.newStartDate && (
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {format(suggestion.newStartDate, "d/MM 'às' HH:mm", { locale: pt })}
              {suggestion.newEndDate && ` - ${format(suggestion.newEndDate, 'HH:mm')}`}
            </div>
          )}
        </div>
        <span className={`text-xs font-medium ${impactColors[suggestion.impact]}`}>
          {suggestion.impact === 'low' && '✅ Baixo impacto'}
          {suggestion.impact === 'medium' && '⚠️ Médio impacto'}
          {suggestion.impact === 'high' && '❗ Alto impacto'}
        </span>
      </div>
    </motion.button>
  );
}

/**
 * Resolution Option Component
 */
function ResolutionOption({
  strategy,
  title,
  description,
  icon: Icon,
  color,
  selected,
  onClick,
  disabled = false,
}: {
  strategy: ResolutionStrategy;
  title: string;
  description: string;
  icon: React.ElementType;
  color: 'slate' | 'red' | 'amber' | 'sky' | 'emerald';
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const colors = {
    slate: 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700',
    red: 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700',
    amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700',
    sky: 'border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700',
    emerald: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`
        p-4 rounded-xl text-left transition-all
        ${selected
          ? 'border-2 border-emerald-400 bg-emerald-50 shadow-md'
          : `border ${colors[color]}`
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${selected ? 'text-emerald-600' : ''}`} />
        <div>
          <div className="font-semibold text-slate-900 mb-1">{title}</div>
          <div className="text-xs text-slate-600">{description}</div>
        </div>
      </div>
    </motion.button>
  );
}

/**
 * Generate smart suggestions based on conflicts
 */
function generateSmartSuggestions(
  targetEvent: Partial<CalendarEvent> & {
    start_date: Date | string;
    end_date: Date | string;
  },
  conflicts: CalendarEvent[]
): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const start = new Date(targetEvent.start_date);
  const end = new Date(targetEvent.end_date);
  const duration = end.getTime() - start.getTime();

  // Suggestion 1: Move to next available slot (30min after conflict ends)
  if (conflicts.length > 0) {
    const latestConflictEnd = new Date(
      Math.max(...conflicts.map(c => new Date(c.end_date).getTime()))
    );
    const newStart = addMinutes(latestConflictEnd, 30);
    const newEnd = new Date(newStart.getTime() + duration);

    suggestions.push({
      id: 'time-shift-after',
      type: 'time_shift',
      description: `Mover para ${format(newStart, 'HH:mm')} (30min após conflito)`,
      impact: 'low',
      newStartDate: newStart,
      newEndDate: newEnd,
    });
  }

  // Suggestion 2: Move to 1 hour before first conflict
  if (conflicts.length > 0) {
    const earliestConflictStart = new Date(
      Math.min(...conflicts.map(c => new Date(c.start_date).getTime()))
    );
    const newStart = addHours(earliestConflictStart, -2);
    const newEnd = new Date(newStart.getTime() + duration);

    if (newStart > new Date()) {
      suggestions.push({
        id: 'time-shift-before',
        type: 'time_shift',
        description: `Antecipar para ${format(newStart, 'HH:mm')}`,
        impact: 'medium',
        newStartDate: newStart,
        newEndDate: newEnd,
      });
    }
  }

  // Suggestion 3: Move to next day, same time
  const nextDay = addDays(start, 1);
  const nextDayEnd = new Date(nextDay.getTime() + duration);
  suggestions.push({
    id: 'day-change',
    type: 'day_change',
    description: `Mover para amanhã (${format(nextDay, "d 'de' MMMM", { locale: pt })})`,
    impact: 'high',
    newStartDate: nextDay,
    newEndDate: nextDayEnd,
  });

  return suggestions.slice(0, 3); // Max 3 suggestions
}