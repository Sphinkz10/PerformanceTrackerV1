import React from 'react';
import { motion } from 'motion/react';
import { X, TrendingUp, Clock, Users, Activity, Award, Check } from 'lucide-react';
import type { SessionSnapshot } from './types';

interface LiveCompletionModalProps {
  snapshot: SessionSnapshot;
  onClose: () => void;
}

export function LiveCompletionModal({ snapshot, onClose }: LiveCompletionModalProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const exercisesCompleted = snapshot.executedWorkout.exercises.filter(e => e.status === 'completed').length;
  const exercisesTotal = snapshot.executedWorkout.exercises.length;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-slate-700"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-b border-emerald-500/30 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Check size={24} className="text-white" />
                </div>
                <h2 className="font-bold text-2xl">🎉 Sessão Concluída!</h2>
              </div>
              <p className="text-slate-400">{snapshot.plannedWorkout.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock size={16} />
                <span className="text-xs font-medium">DURAÇÃO</span>
              </div>
              <div className="font-bold text-2xl">{formatDuration(snapshot.timestamps.activeDuration)}</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Activity size={16} />
                <span className="text-xs font-medium">EXERCÍCIOS</span>
              </div>
              <div className="font-bold text-2xl">{exercisesCompleted}/{exercisesTotal}</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Users size={16} />
                <span className="text-xs font-medium">ATLETAS</span>
              </div>
              <div className="font-bold text-2xl">{snapshot.athletes.length}</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">VOLUME</span>
              </div>
              <div className="font-bold text-2xl">{snapshot.analytics.volumeTotal.toFixed(0)}<span className="text-sm text-slate-400">kg</span></div>
            </div>
          </div>

          {/* Performance Geral */}
          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Activity size={20} className="text-sky-400" />
              Performance Geral
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-400">Volume Total</div>
                <div className="font-bold text-xl text-emerald-400">
                  {snapshot.analytics.volumeTotal.toFixed(0)}kg
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">RPE Médio</div>
                <div className="font-bold text-xl text-amber-400">
                  {snapshot.analytics.intensityAverage.toFixed(1)}/10
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Compliance</div>
                <div className="font-bold text-xl text-sky-400">
                  {snapshot.analytics.complianceRate.toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Reps</div>
                <div className="font-bold text-xl">
                  {snapshot.analytics.repsTotal}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Sets</div>
                <div className="font-bold text-xl">
                  {snapshot.analytics.setsTotal}
                </div>
              </div>
            </div>
          </div>

          {/* Destaques por Atleta */}
          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              Destaques
            </h3>
            <div className="space-y-3">
              {snapshot.athletes.map(athlete => (
                <div key={athlete.athleteId} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                        {athlete.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{athlete.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                          <span>{athlete.performanceData.setsCompleted} sets</span>
                          <span>•</span>
                          <span>{athlete.performanceData.totalVolume.toFixed(0)}kg</span>
                          <span>•</span>
                          <span>RPE: {athlete.performanceData.averageRPE.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {athlete.personalRecords.length > 0 && (
                      <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-xs font-semibold text-amber-400">
                        {athlete.personalRecords.length} PR{athlete.personalRecords.length > 1 ? 's' : ''}!
                      </div>
                    )}
                  </div>

                  {/* Personal Records */}
                  {athlete.personalRecords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="text-xs text-amber-400 font-medium mb-2">🏆 Novos Records Pessoais:</div>
                      {athlete.personalRecords.map((pr, idx) => (
                        <div key={idx} className="text-sm text-slate-300">
                          • {pr.exerciseId}: {pr.value} (+{pr.improvement.toFixed(0)}%)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modifications/Notes */}
          {(snapshot.modifications.length > 0 || snapshot.notes.length > 0) && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <h3 className="font-bold text-amber-400 mb-3">⚠️ Observações da Sessão</h3>
              <div className="space-y-2 text-sm">
                {snapshot.modifications.map(mod => (
                  <div key={mod.id} className="text-slate-300">
                    • {mod.type.replace('_', ' ')}: {mod.reason || 'Sem motivo especificado'}
                  </div>
                ))}
                {snapshot.notes.filter(n => n.includeInReport).map(note => (
                  <div key={note.id} className="text-slate-300">
                    • {note.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 bg-slate-800/50">
          <div className="space-y-3">
            <div className="text-xs text-slate-400 text-center">
              Snapshot ID: {snapshot.id}
            </div>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 rounded-xl font-semibold shadow-lg transition-all"
            >
              Voltar ao Calendário
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
