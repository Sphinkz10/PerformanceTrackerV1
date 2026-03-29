import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Plus, Check } from 'lucide-react';
import { useLiveCommand } from './LiveCommandContext';
import type { LiveAthlete, LiveExercise, ExecutedSet } from './types';

interface LiveAthleteCardProps {
  athlete: LiveAthlete;
  currentExercise: LiveExercise;
}

export function LiveAthleteCard({ athlete, currentExercise }: LiveAthleteCardProps) {
  const { recordSet } = useLiveCommand();
  
  const [reps, setReps] = useState<string>(String(currentExercise.planned.reps) || '');
  const [weight, setWeight] = useState<string>(String(currentExercise.planned.weight) || '');
  const [rpe, setRPE] = useState<string>('7');

  const athleteSets = currentExercise.athleteData[athlete.id] || [];
  const completedSets = athleteSets.filter(s => s.completed).length;
  const plannedSets = currentExercise.planned.sets;

  const handleRecordSet = () => {
    if (!reps) return;

    const setData: Omit<ExecutedSet, 'setNumber' | 'timestamp'> = {
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : undefined,
      rpe: rpe ? parseFloat(rpe) : undefined,
      completed: true
    };

    recordSet(athlete.id, currentExercise.id, setData);
    
    // Reset apenas reps para próxima série (mantém peso e RPE)
    setReps(String(currentExercise.planned.reps) || '');
  };

  // Quick adjust functions
  const adjustReps = (delta: number) => {
    setReps(prev => String(Math.max(1, parseInt(prev || '0') + delta)));
  };

  const adjustWeight = (delta: number) => {
    setWeight(prev => {
      const current = parseFloat(prev || '0');
      return String(Math.max(0, current + delta));
    });
  };

  const adjustRPE = (delta: number) => {
    setRPE(prev => {
      const current = parseFloat(prev || '0');
      return String(Math.max(1, Math.min(10, current + delta)));
    });
  };

  // Histórico/Comparação (se disponível)
  const hasHistory = athlete.history?.lastSession;
  const vsLastSession = hasHistory && currentExercise.id === athlete.history?.lastSession?.exerciseId
    ? {
        reps: parseInt(reps || '0') - athlete.history.lastSession.bestSet.reps!,
        weight: parseFloat(weight || '0') - (athlete.history.lastSession.bestSet.weight || 0)
      }
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl border border-slate-700 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {athlete.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{athlete.name}</h3>
            <div className="flex items-center gap-3 text-sm text-slate-400 mt-0.5">
              <span>Set {completedSets + 1}/{plannedSets}</span>
              <span>•</span>
              <span className="text-emerald-400">
                {completedSets} completo{completedSets !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-400">Volume</div>
          <div className="font-bold text-emerald-400">
            {athlete.sessionStats.totalVolume.toFixed(0)}kg
          </div>
        </div>
      </div>

      {/* Comparison vs Last Session */}
      {vsLastSession && (
        <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
          <div className="text-xs text-slate-400 mb-2">vs Última Sessão</div>
          <div className="flex items-center gap-4 text-sm">
            {vsLastSession.weight !== 0 && (
              <div className="flex items-center gap-1">
                {vsLastSession.weight > 0 ? (
                  <TrendingUp size={14} className="text-emerald-400" />
                ) : vsLastSession.weight < 0 ? (
                  <TrendingDown size={14} className="text-red-400" />
                ) : (
                  <Minus size={14} className="text-slate-400" />
                )}
                <span className={
                  vsLastSession.weight > 0 ? 'text-emerald-400' :
                  vsLastSession.weight < 0 ? 'text-red-400' :
                  'text-slate-400'
                }>
                  {vsLastSession.weight > 0 ? '+' : ''}{vsLastSession.weight}kg
                </span>
              </div>
            )}
            {vsLastSession.reps !== 0 && (
              <div className="flex items-center gap-1">
                {vsLastSession.reps > 0 ? (
                  <TrendingUp size={14} className="text-emerald-400" />
                ) : vsLastSession.reps < 0 ? (
                  <TrendingDown size={14} className="text-red-400" />
                ) : (
                  <Minus size={14} className="text-slate-400" />
                )}
                <span className={
                  vsLastSession.reps > 0 ? 'text-emerald-400' :
                  vsLastSession.reps < 0 ? 'text-red-400' :
                  'text-slate-400'
                }>
                  {vsLastSession.reps > 0 ? '+' : ''}{vsLastSession.reps} reps
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Reps */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Reps
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => adjustReps(-1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              min="1"
            />
            <button
              onClick={() => adjustReps(1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Peso (kg)
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => adjustWeight(-2.5)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-xs"
            >
              -2.5
            </button>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              step="0.5"
              min="0"
            />
            <button
              onClick={() => adjustWeight(2.5)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-xs"
            >
              +2.5
            </button>
          </div>
        </div>

        {/* RPE */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            RPE (1-10)
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => adjustRPE(-0.5)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={rpe}
              onChange={(e) => setRPE(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              step="0.5"
              min="1"
              max="10"
            />
            <button
              onClick={() => adjustRPE(0.5)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Record Button */}
      <button
        onClick={handleRecordSet}
        disabled={!reps || completedSets >= plannedSets}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold shadow-lg transition-all"
      >
        <Check size={20} />
        Registrar Set {completedSets + 1}
      </button>

      {/* Completed Sets */}
      {athleteSets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-slate-400 mb-3">Sets Registrados</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {athleteSets.map((set) => (
              <motion.div
                key={set.setNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-700/50 rounded-lg p-3 text-center border border-slate-600"
              >
                <div className="text-xs text-slate-400 mb-1">Set {set.setNumber}</div>
                <div className="font-bold">
                  {set.reps} × {set.weight}kg
                </div>
                {set.rpe && (
                  <div className="text-xs text-sky-400 mt-1">
                    RPE: {set.rpe}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
