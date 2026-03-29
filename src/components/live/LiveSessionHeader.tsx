/**
 * LIVE SESSION HEADER - SEMANA 3 ENHANCED ✅
 * 
 * Header melhorado para LiveSession com:
 * - Timer visual grande
 * - Pause/Resume controls
 * - Session progress
 * - Quick stats
 * 
 * @since Semana 3 - Live Session UX
 */

import { motion } from 'motion/react';
import { 
  Play, Pause, X, Clock, Activity, Users, 
  TrendingUp, Award, ChevronRight 
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface LiveSessionHeaderProps {
  sessionId: string;
  workoutName: string;
  isActive: boolean;
  isPaused: boolean;
  startTime: Date;
  athleteCount: number;
  currentExerciseIndex: number;
  totalExercises: number;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
}

export function LiveSessionHeader({
  sessionId,
  workoutName,
  isActive,
  isPaused,
  startTime,
  athleteCount,
  currentExerciseIndex,
  totalExercises,
  onPause,
  onResume,
  onExit
}: LiveSessionHeaderProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      setElapsedTime(now - start);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  // Format time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const progressPercentage = ((currentExerciseIndex + 1) / totalExercises) * 100;

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-lg">
      {/* Main Header */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: isPaused ? 1 : [1, 1.2, 1] }}
                transition={{ repeat: isPaused ? 0 : Infinity, duration: 2 }}
                className={`h-3 w-3 rounded-full ${
                  isPaused ? 'bg-amber-500' : 'bg-emerald-500'
                } shadow-lg ${isPaused ? 'shadow-amber-500/50' : 'shadow-emerald-500/50'}`}
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  {workoutName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isPaused ? 'Pausado' : 'Em Progresso'} • Sessão #{sessionId.slice(0, 8)}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex flex-col items-center px-6 py-3 rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 border border-sky-500/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-medium text-sky-300">Tempo Decorrido</span>
            </div>
            <div className={`text-3xl font-bold ${isPaused ? 'text-amber-400' : 'text-sky-400'} tabular-nums`}>
              {formatTime(elapsedTime)}
            </div>
          </motion.div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Pause/Resume */}
            {isActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isPaused ? onResume : onPause}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  isPaused
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/30'
                }`}
              >
                {isPaused ? (
                  <Play className="h-5 w-5" />
                ) : (
                  <Pause className="h-5 w-5" />
                )}
              </motion.button>
            )}

            {/* Exit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExit}
              className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 transition-all"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Timer */}
        <div className="sm:hidden mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
          <Clock className="h-4 w-4 text-sky-400" />
          <span className={`text-xl font-bold tabular-nums ${isPaused ? 'text-amber-400' : 'text-sky-400'}`}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30"
        />
      </div>

      {/* Quick Stats Bar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-800/50 border-b border-slate-700/30">
        <div className="flex items-center justify-between gap-4 text-sm">
          {/* Athletes */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20">
              <Users className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Atletas</p>
              <p className="font-bold text-white">{athleteCount}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20">
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Progresso</p>
              <p className="font-bold text-white">
                {currentExerciseIndex + 1}/{totalExercises}
              </p>
            </div>
          </div>

          {/* Completion */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-500/20">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Completo</p>
              <p className="font-bold text-white">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 top-full mt-2 mx-4 sm:mx-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Pause className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-300">Sessão Pausada</p>
              <p className="text-sm text-amber-400/80">Clique em Play para continuar</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Retomar
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
