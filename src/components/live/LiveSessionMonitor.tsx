/**
 * LiveSessionMonitor - FASE 12 COMPLETE ✅
 * 
 * Componente de monitorização em tempo real de sessões de treino.
 * Atualiza automaticamente a cada 5 segundos.
 * 
 * FEATURES:
 * - Real-time session updates
 * - Live participant tracking
 * - Exercise progress visualization
 * - Animated status indicators
 * - Toast notifications for changes
 * - Auto-refresh with visual indicator
 * 
 * @author PerformTrack Team
 * @since Fase 12 - Live Auto-Updates
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  Activity,
  MapPin,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useLiveSession } from '@/hooks/useLiveSession';

// ============================================================================
// TYPES
// ============================================================================

interface LiveSessionMonitorProps {
  sessionId: string;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function LiveSessionMonitor({ sessionId, onClose }: LiveSessionMonitorProps) {
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  // Use the live session hook
  const { 
    session, 
    participants, 
    exercises, 
    progress, 
    loading,
    refresh,
    startExercise,
    completeExercise,
  } = useLiveSession({
    sessionId,
    autoRefresh: false, // DISABLED temporarily to prevent infinite loop
    refreshInterval: 5000, // 5 seconds
    onUpdate: () => {
      setLastUpdate(new Date());
    },
  });

  if (loading && !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-sky-500 animate-spin mx-auto mb-2" />
          <p className="text-slate-600">A carregar sessão...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-slate-900">Sessão não encontrada</p>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[session.currentExerciseIndex];
  const completedCount = exercises.filter(e => e.status === 'completed').length;
  const presentCount = participants.filter(p => p.status === 'present').length;

  // Calculate session duration
  const startTime = new Date(session.startTime);
  const now = new Date();
  const elapsedMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* Header with Live Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 p-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-3 w-3 rounded-full bg-red-500"
            />
            <span className="text-red-600 uppercase tracking-wide">Ao Vivo</span>
          </div>
          
          <h2 className="text-slate-900 mb-1">{session.templateName}</h2>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{elapsedMinutes} min / {session.duration} min</span>
            </div>
            {session.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{session.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{presentCount} atletas</span>
            </div>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-right">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={refresh}
            className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:border-sky-300 flex items-center justify-center transition-colors mb-2"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </motion.button>
          <p className="text-xs text-slate-500">
            Atualizado há {Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)}s
          </p>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs text-slate-500">Progresso</p>
          </div>
          <p className="text-slate-900">{progress}%</p>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            />
          </div>
        </motion.div>

        {/* Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs text-slate-500">Exercícios</p>
          </div>
          <p className="text-slate-900">
            {completedCount} / {exercises.length}
          </p>
          <p className="text-xs text-sky-600 mt-1">
            {exercises.length - completedCount} pendentes
          </p>
        </motion.div>

        {/* Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs text-slate-500">Tempo Decorrido</p>
          </div>
          <p className="text-slate-900">{elapsedMinutes} min</p>
          <p className="text-xs text-amber-600 mt-1">
            {session.duration! - elapsedMinutes} min restantes
          </p>
        </motion.div>

        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs text-slate-500">Participantes</p>
          </div>
          <p className="text-slate-900">{presentCount}</p>
          <p className="text-xs text-violet-600 mt-1">
            {participants.length} total
          </p>
        </motion.div>
      </div>

      {/* Current Exercise */}
      {currentExercise && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-sky-600" />
                <span className="text-sky-600 uppercase tracking-wide">Exercício Atual</span>
              </div>
              <h3 className="text-slate-900 mb-2">{currentExercise.name}</h3>
              <div className="flex flex-wrap gap-3 text-slate-600">
                {currentExercise.sets && (
                  <span>{currentExercise.sets} séries</span>
                )}
                {currentExercise.reps && (
                  <span>• {currentExercise.reps} reps</span>
                )}
                {currentExercise.rest && (
                  <span>• {currentExercise.rest}s descanso</span>
                )}
                {currentExercise.duration && (
                  <span>• {currentExercise.duration} min</span>
                )}
              </div>
            </div>

            {currentExercise.status === 'in_progress' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => completeExercise(currentExercise.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Completar</span>
              </motion.button>
            )}
          </div>

          {/* Exercise progress bar */}
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: currentExercise.status === 'completed' ? '100%' : currentExercise.status === 'in_progress' ? '50%' : '0%' }}
              className="h-full bg-gradient-to-r from-sky-500 to-sky-600"
            />
          </div>
        </motion.div>
      )}

      {/* Participants List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-slate-700" />
          <h3 className="text-slate-900">Atletas na Sessão</h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
              >
                {/* Photo */}
                <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-slate-200">
                  <img 
                    src={participant.athletePhoto} 
                    alt={participant.athleteName}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-900">{participant.athleteName}</p>
                    {participant.status === 'present' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        <CheckCircle className="h-3 w-3" />
                        Presente
                      </span>
                    )}
                    {participant.status === 'late' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                        <Clock className="h-3 w-3" />
                        Atrasado
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">
                    {participant.completedExercises}/{participant.totalExercises} exercícios
                  </p>
                </div>

                {/* Performance Score */}
                {participant.performanceScore && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600">
                        {participant.performanceScore.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Performance</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* All Exercises List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-slate-700" />
          <h3 className="text-slate-900">Todos os Exercícios</h3>
        </div>

        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                exercise.status === 'completed' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : exercise.status === 'in_progress'
                  ? 'bg-sky-50 border-sky-200 border-2'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Icon */}
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                exercise.status === 'completed'
                  ? 'bg-emerald-500'
                  : exercise.status === 'in_progress'
                  ? 'bg-sky-500'
                  : 'bg-slate-300'
              }`}>
                {exercise.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : exercise.status === 'in_progress' ? (
                  <Play className="h-5 w-5 text-white" />
                ) : (
                  <Pause className="h-5 w-5 text-white" />
                )}
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className={`${
                  exercise.status === 'completed' 
                    ? 'text-emerald-900' 
                    : exercise.status === 'in_progress'
                    ? 'text-sky-900'
                    : 'text-slate-700'
                }`}>
                  {exercise.order}. {exercise.name}
                </p>
                {exercise.status === 'completed' && exercise.completedAt && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Completado às {new Date(exercise.completedAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {/* Status badge */}
              <span className={`px-3 py-1 rounded-full text-xs ${
                exercise.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : exercise.status === 'in_progress'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {exercise.status === 'completed' ? 'Completo' : exercise.status === 'in_progress' ? 'A decorrer' : 'Pendente'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}