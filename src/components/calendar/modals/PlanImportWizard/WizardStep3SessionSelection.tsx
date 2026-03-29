/**
 * STEP 3: SESSION SELECTION
 * Choose which sessions to import
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Square, Dumbbell, Clock, CheckCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  sessions?: PlanSession[];
}

interface PlanSession {
  id: string;
  week_number: number;
  day_of_week: number;
  workout_id?: string;
  workout_name?: string;
  duration_minutes?: number;
  order_index: number;
}

interface WizardStep3Props {
  plan: Plan;
  selectedSessions: Set<string>;
  onToggleSession: (sessionId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function WizardStep3SessionSelection({
  plan,
  selectedSessions,
  onToggleSession,
  onSelectAll,
  onDeselectAll,
}: WizardStep3Props) {
  const sessions = plan.sessions || [];
  
  // Group sessions by week
  const sessionsByWeek = sessions.reduce((acc, session) => {
    const week = session.week_number;
    if (!acc[week]) acc[week] = [];
    acc[week].push(session);
    return acc;
  }, {} as Record<number, PlanSession[]>);
  
  const totalSessions = sessions.length;
  const selectedCount = selectedSessions.size;
  
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
          Selecionar Sessões
        </h3>
        <p className="text-sm text-slate-600">
          Escolha quais sessões do plano deseja importar
        </p>
      </div>
      
      {/* Selection Controls */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-violet-500" />
          <span className="text-sm font-semibold text-slate-700">
            {selectedCount} de {totalSessions} sessões selecionadas
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
          >
            Selecionar Todas
          </button>
          <button
            onClick={onDeselectAll}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
      
      {/* Sessions by Week */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(sessionsByWeek)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([weekNum, weekSessions]) => (
            <div key={weekNum} className="space-y-2">
              {/* Week Header */}
              <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-violet-50 border border-violet-200">
                <h4 className="font-bold text-violet-900">
                  Semana {weekNum}
                </h4>
                <span className="text-xs font-medium text-violet-700">
                  {weekSessions.filter(s => selectedSessions.has(s.id)).length} / {weekSessions.length} selecionadas
                </span>
              </div>
              
              {/* Week Sessions */}
              <div className="space-y-2">
                {weekSessions
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((session, index) => {
                    const isSelected = selectedSessions.has(session.id);
                    
                    return (
                      <motion.button
                        key={session.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onToggleSession(session.id)}
                        className={`group w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-violet-500 bg-violet-500'
                            : 'border-slate-300 bg-white group-hover:border-violet-400'
                        }`}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-white" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-br from-violet-500 to-violet-600'
                            : 'bg-violet-100'
                        }`}>
                          <Dumbbell className={`h-5 w-5 ${
                            isSelected ? 'text-white' : 'text-violet-600'
                          }`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 text-left min-w-0">
                          <h5 className="font-semibold text-slate-900 truncate">
                            {session.workout_name || `Sessão ${session.order_index + 1}`}
                          </h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-600">
                              {DAY_NAMES[session.day_of_week - 1]}
                            </span>
                            {session.duration_minutes && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Clock className="h-3 w-3" />
                                {session.duration_minutes} min
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
      
      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            Nenhuma sessão encontrada
          </p>
          <p className="text-xs text-slate-500">
            Este plan não tem sessões definidas
          </p>
        </div>
      )}
    </motion.div>
  );
}
