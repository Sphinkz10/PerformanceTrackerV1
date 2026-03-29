/**
 * CONFLICT WARNING COMPONENT
 * 
 * Shows scheduling conflicts with detailed information:
 * - Athlete double-booking
 * - Coach conflicts
 * - Location conflicts
 * 
 * @module calendar/components/ConflictWarning
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Calendar,
  User,
  Users,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { ConflictEvent } from '@/hooks/useConflictDetection';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getSharedAthletes } from '@/utils/calendarConflicts';
import { ConflictBadgeCompact, calculateSeverity } from './ConflictBadge';

// ============================================================================
// TYPES
// ============================================================================

interface ConflictWarningProps {
  conflicts: ConflictEvent[];
  currentEvent?: Partial<any>;
  onDismiss?: () => void;
  onResolve?: () => void;
  onIgnore?: () => void;
  showActions?: boolean;
  className?: string;
}

// ============================================================================
// HELPER: Get conflict icon and color
// ============================================================================

function getConflictInfo(type: string) {
  switch (type) {
    case 'athlete':
      return {
        icon: Users,
        color: 'red',
        label: 'Atleta ocupado',
        description: 'Atleta já tem evento neste horário',
      };
    case 'coach':
      return {
        icon: User,
        color: 'orange',
        label: 'Treinador ocupado',
        description: 'Treinador já tem evento neste horário',
      };
    case 'location':
      return {
        icon: MapPin,
        color: 'amber',
        label: 'Local ocupado',
        description: 'Local já está reservado neste horário',
      };
    default:
      return {
        icon: AlertTriangle,
        color: 'red',
        label: 'Conflito',
        description: 'Conflito de agendamento',
      };
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ConflictWarning({
  conflicts,
  currentEvent,
  onDismiss,
  onResolve,
  onIgnore,
  showActions = true,
  className = '',
}: ConflictWarningProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!conflicts || conflicts.length === 0) return null;

  // Count by type
  const athleteConflicts = conflicts.filter(c => c.conflict_type === 'athlete').length;
  const coachConflicts = conflicts.filter(c => c.conflict_type === 'coach').length;
  const locationConflicts = conflicts.filter(c => c.conflict_type === 'location').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-2xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-orange-50 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-red-900 mb-1">
              {conflicts.length === 1 
                ? 'Conflito de Agendamento Detectado' 
                : `${conflicts.length} Conflitos de Agendamento Detectados`
              }
            </h4>
            
            <div className="flex flex-wrap gap-2 text-sm text-red-700">
              {athleteConflicts > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100">
                  <Users className="h-3 w-3" />
                  {athleteConflicts} atleta{athleteConflicts > 1 ? 's' : ''}
                </span>
              )}
              {coachConflicts > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100">
                  <User className="h-3 w-3" />
                  {coachConflicts} treinador{coachConflicts > 1 ? 'es' : ''}
                </span>
              )}
              {locationConflicts > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100">
                  <MapPin className="h-3 w-3" />
                  {locationConflicts} local{locationConflicts > 1 ? 'is' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl hover:bg-red-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-red-700" />
            ) : (
              <ChevronDown className="h-5 w-5 text-red-700" />
            )}
          </button>

          {/* Dismiss */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 rounded-xl hover:bg-red-100 transition-colors"
            >
              <X className="h-5 w-5 text-red-700" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-red-200"
          >
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {conflicts.map((conflict, index) => {
                const info = getConflictInfo(conflict.conflict_type);
                const Icon = info.icon;

                return (
                  <motion.div
                    key={conflict.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-200"
                  >
                    <div className={`h-8 w-8 rounded-lg bg-${info.color}-100 flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 text-${info.color}-600`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${info.color}-100 text-${info.color}-700`}>
                          {info.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {conflict.type}
                        </span>
                      </div>

                      <h5 className="font-semibold text-slate-900 mb-1 truncate">
                        {conflict.title}
                      </h5>

                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(conflict.start_date), 'HH:mm', { locale: pt })}
                          {' - '}
                          {format(new Date(conflict.end_date), 'HH:mm', { locale: pt })}
                        </span>

                        {conflict.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {conflict.location}
                          </span>
                        )}
                      </div>

                      {conflict.conflicting_athletes && conflict.conflicting_athletes.length > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          {conflict.conflicting_athletes.length} atleta{conflict.conflicting_athletes.length > 1 ? 's' : ''} em conflito
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {showActions && (
        <div className="p-4 bg-red-100/50 border-t border-red-200 flex gap-2">
          {onIgnore && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onIgnore}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 transition-colors"
            >
              Ignorar e Continuar
            </motion.button>
          )}

          {onResolve && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResolve}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 transition-all shadow-lg shadow-sky-500/30"
            >
              Resolver Conflitos
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Note: ConflictBadge has been removed from here.
// Use the advanced version from './ConflictBadge' instead:
// import { ConflictBadge, ConflictBadgeCompact } from './ConflictBadge';