import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, User, Clock, TrendingUp, TrendingDown, Minus,
  Dumbbell, Target, Zap, Award, ChevronDown, ChevronUp,
  BarChart3, Activity, MessageSquare
} from 'lucide-react';

interface SnapshotData {
  id: string;
  athlete: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  template?: {
    id: string;
    name: string;
    category?: string;
  };
  executed_at: string;
  duration_minutes?: number;
  completed: boolean;
  snapshot_data: {
    blocks: Array<{
      id: string;
      name: string;
      type: string;
      exercises: Array<{
        id: string;
        name: string;
        sets: Array<{
          reps?: number;
          weight?: number;
          duration?: number;
          distance?: number;
          rpe?: number;
          rest?: number;
          notes?: string;
        }>;
      }>;
    }>;
  };
  metrics?: Array<{
    metric_key: string;
    metric_value: number;
    metric_unit: string;
  }>;
  coach_notes?: string;
  athlete_feedback?: string;
}

interface SnapshotViewerProps {
  snapshot: SnapshotData;
  onClose?: () => void;
  showComparison?: boolean;
}

export function SnapshotViewer({ snapshot, onClose, showComparison = false }: SnapshotViewerProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  };

  // Calculate summary metrics
  const getMetricValue = (key: string) => {
    const metric = snapshot.metrics?.find(m => m.metric_key === key);
    return metric ? metric.metric_value : null;
  };

  const totalVolume = getMetricValue('total_volume');
  const totalReps = getMetricValue('total_reps');
  const totalSets = getMetricValue('total_sets');
  const avgRPE = getMetricValue('avg_rpe');

  const executedDate = new Date(snapshot.executed_at);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-50 to-white p-6 border-b border-slate-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Athlete Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
              {snapshot.athlete.avatar_url ? (
                <img 
                  src={snapshot.athlete.avatar_url} 
                  alt={snapshot.athlete.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-400 to-violet-600 text-white font-bold text-lg">
                  {snapshot.athlete.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-900">{snapshot.athlete.name}</h3>
              <p className="text-sm text-slate-600">
                {snapshot.template?.name || 'Treino Personalizado'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            snapshot.completed 
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {snapshot.completed ? 'Completo' : 'Parcial'}
          </div>
        </div>

        {/* Date & Duration */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {executedDate.toLocaleDateString('pt-PT', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {executedDate.toLocaleTimeString('pt-PT', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {snapshot.duration_minutes && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              {snapshot.duration_minutes}min
            </div>
          )}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-50 border-b border-slate-200">
        {/* Total Volume */}
        {totalVolume !== null && (
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">Volume</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {totalVolume.toLocaleString()}
              <span className="text-sm font-normal text-slate-600 ml-1">kg</span>
            </p>
          </div>
        )}

        {/* Total Sets */}
        {totalSets !== null && (
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">Séries</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalSets}</p>
          </div>
        )}

        {/* Total Reps */}
        {totalReps !== null && (
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-violet-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">Reps</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalReps}</p>
          </div>
        )}

        {/* Average RPE */}
        {avgRPE !== null && (
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">RPE Médio</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {avgRPE.toFixed(1)}
              <span className="text-sm font-normal text-slate-600 ml-1">/10</span>
            </p>
          </div>
        )}
      </div>

      {/* Workout Blocks */}
      <div className="p-6 space-y-4">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-600" />
          Exercícios Executados
        </h4>

        {snapshot.snapshot_data?.blocks?.map((block, blockIndex) => {
          const isExpanded = expandedBlocks.has(block.id);

          return (
            <div key={block.id} className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Block Header */}
              <button
                onClick={() => toggleBlock(block.id)}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 text-white flex items-center justify-center font-bold">
                    {blockIndex + 1}
                  </div>
                  <div className="text-left">
                    <h5 className="font-semibold text-slate-900">{block.name}</h5>
                    <p className="text-sm text-slate-600">
                      {block.exercises?.length || 0} exercício{block.exercises?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* Block Content */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 space-y-4 bg-white"
                >
                  {block.exercises?.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="border-l-4 border-sky-500 pl-4">
                      <h6 className="font-semibold text-slate-900 mb-2">
                        {exerciseIndex + 1}. {exercise.name}
                      </h6>

                      {/* Sets Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-2 px-3 text-slate-600 font-medium">Série</th>
                              {exercise.sets.some(s => s.weight) && (
                                <th className="text-left py-2 px-3 text-slate-600 font-medium">Peso</th>
                              )}
                              {exercise.sets.some(s => s.reps) && (
                                <th className="text-left py-2 px-3 text-slate-600 font-medium">Reps</th>
                              )}
                              {exercise.sets.some(s => s.duration) && (
                                <th className="text-left py-2 px-3 text-slate-600 font-medium">Duração</th>
                              )}
                              {exercise.sets.some(s => s.distance) && (
                                <th className="text-left py-2 px-3 text-slate-600 font-medium">Distância</th>
                              )}
                              {exercise.sets.some(s => s.rpe) && (
                                <th className="text-left py-2 px-3 text-slate-600 font-medium">RPE</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {exercise.sets.map((set, setIndex) => (
                              <tr key={setIndex} className="border-b border-slate-100">
                                <td className="py-2 px-3 text-slate-900 font-medium">{setIndex + 1}</td>
                                {set.weight !== undefined && (
                                  <td className="py-2 px-3 text-slate-900">{set.weight}kg</td>
                                )}
                                {set.reps !== undefined && (
                                  <td className="py-2 px-3 text-slate-900">{set.reps}</td>
                                )}
                                {set.duration !== undefined && (
                                  <td className="py-2 px-3 text-slate-900">{set.duration}s</td>
                                )}
                                {set.distance !== undefined && (
                                  <td className="py-2 px-3 text-slate-900">{set.distance}m</td>
                                )}
                                {set.rpe !== undefined && (
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      set.rpe >= 9 ? 'bg-red-100 text-red-700' :
                                      set.rpe >= 7 ? 'bg-amber-100 text-amber-700' :
                                      'bg-emerald-100 text-emerald-700'
                                    }`}>
                                      {set.rpe}
                                    </span>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {(snapshot.coach_notes || snapshot.athlete_feedback) && (
        <div className="p-6 border-t border-slate-200 space-y-4">
          {snapshot.coach_notes && (
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-sky-900">Notas do Coach</span>
              </div>
              <p className="text-sm text-slate-700">{snapshot.coach_notes}</p>
            </div>
          )}

          {snapshot.athlete_feedback && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-900">Feedback do Atleta</span>
              </div>
              <p className="text-sm text-slate-700">{snapshot.athlete_feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
