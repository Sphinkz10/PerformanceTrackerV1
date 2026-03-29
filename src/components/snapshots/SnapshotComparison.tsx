import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Minus, ArrowRight, Target, 
  Dumbbell, Activity, Award, Calendar, BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonData {
  snapshots: Array<{
    id: string;
    executed_at: string;
    athlete: {
      name: string;
      avatar_url?: string;
    };
    template?: {
      name: string;
    };
  }>;
  comparison: {
    total_volume?: {
      values: number[];
      dates: string[];
      change: number;
      changePercentage: number;
      unit: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    avg_rpe?: {
      values: number[];
      dates: string[];
      change: number;
      changePercentage: number;
      unit: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    total_sets?: {
      values: number[];
      dates: string[];
      change: number;
      changePercentage: number;
      unit: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    total_reps?: {
      values: number[];
      dates: string[];
      change: number;
      changePercentage: number;
      unit: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
  };
  progression: {
    trend: 'improving' | 'declining' | 'stable';
    percentage: number;
    summary: string;
  };
  exerciseComparison?: Array<{
    exerciseName: string;
    dataPoints: Array<{
      snapshotDate: string;
      totalVolume: number;
      maxWeight: number;
      totalReps: number;
    }>;
    progression: {
      volumeChange: number;
      volumeChangePercentage: number;
      maxWeightChange: number;
      maxWeightChangePercentage: number;
      trend: 'improving' | 'declining' | 'stable';
    };
  }>;
}

interface SnapshotComparisonProps {
  comparisonData: ComparisonData;
}

export function SnapshotComparison({ comparisonData }: SnapshotComparisonProps) {
  const { snapshots, comparison, progression, exerciseComparison } = comparisonData;

  // Prepare chart data
  const chartData = snapshots.map((snapshot, index) => ({
    date: new Date(snapshot.executed_at).toLocaleDateString('pt-PT', { 
      day: 'numeric', 
      month: 'short' 
    }),
    volume: comparison.total_volume?.values[index] || 0,
    rpe: comparison.avg_rpe?.values[index] || 0,
    sets: comparison.total_sets?.values[index] || 0,
    reps: comparison.total_reps?.values[index] || 0,
  }));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'decreasing':
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return 'text-emerald-600';
      case 'decreasing':
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getTrendBg = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return 'bg-emerald-50 border-emerald-200';
      case 'decreasing':
      case 'declining':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-6 border border-violet-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-xl mb-1">
              Comparação de Progresso
            </h3>
            <p className="text-sm text-slate-600">
              {snapshots[0].athlete.name} • {snapshots[0].template?.name || 'Treino Personalizado'}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-xl border-2 ${getTrendBg(progression.trend)}`}>
            <div className="flex items-center gap-2">
              {getTrendIcon(progression.trend)}
              <div>
                <p className="text-xs font-medium text-slate-600">Progressão</p>
                <p className={`font-bold ${getTrendColor(progression.trend)}`}>
                  {progression.percentage > 0 ? '+' : ''}
                  {progression.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(snapshots[0].executed_at).toLocaleDateString('pt-PT', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
          <ArrowRight className="w-4 h-4" />
          <span>
            {new Date(snapshots[snapshots.length - 1].executed_at).toLocaleDateString('pt-PT', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
          <span className="ml-auto font-semibold text-slate-900">
            {snapshots.length} sessões
          </span>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Volume */}
        {comparison.total_volume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 border-2 border-slate-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Volume Total</span>
            </div>
            
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">
                {comparison.total_volume.values[comparison.total_volume.values.length - 1]?.toLocaleString() || 0}
                <span className="text-sm font-normal text-slate-600 ml-1">kg</span>
              </p>
              {getTrendIcon(comparison.total_volume.trend)}
            </div>

            <div className={`text-sm font-semibold ${getTrendColor(comparison.total_volume.trend)}`}>
              {comparison.total_volume.change > 0 ? '+' : ''}
              {comparison.total_volume.change?.toLocaleString() || 0}kg 
              ({comparison.total_volume.changePercentage > 0 ? '+' : ''}
              {comparison.total_volume.changePercentage?.toFixed(1)}%)
            </div>
          </motion.div>
        )}

        {/* Sets */}
        {comparison.total_sets && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 border-2 border-slate-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Séries</span>
            </div>
            
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">
                {comparison.total_sets.values[comparison.total_sets.values.length - 1] || 0}
              </p>
              {getTrendIcon(comparison.total_sets.trend)}
            </div>

            <div className={`text-sm font-semibold ${getTrendColor(comparison.total_sets.trend)}`}>
              {comparison.total_sets.change > 0 ? '+' : ''}
              {comparison.total_sets.change || 0} séries 
              ({comparison.total_sets.changePercentage > 0 ? '+' : ''}
              {comparison.total_sets.changePercentage?.toFixed(1)}%)
            </div>
          </motion.div>
        )}

        {/* Reps */}
        {comparison.total_reps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 border-2 border-slate-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Repetições</span>
            </div>
            
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">
                {comparison.total_reps.values[comparison.total_reps.values.length - 1] || 0}
              </p>
              {getTrendIcon(comparison.total_reps.trend)}
            </div>

            <div className={`text-sm font-semibold ${getTrendColor(comparison.total_reps.trend)}`}>
              {comparison.total_reps.change > 0 ? '+' : ''}
              {comparison.total_reps.change || 0} reps 
              ({comparison.total_reps.changePercentage > 0 ? '+' : ''}
              {comparison.total_reps.changePercentage?.toFixed(1)}%)
            </div>
          </motion.div>
        )}

        {/* RPE */}
        {comparison.avg_rpe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border-2 border-slate-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">RPE Médio</span>
            </div>
            
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">
                {comparison.avg_rpe.values[comparison.avg_rpe.values.length - 1]?.toFixed(1) || 0}
                <span className="text-sm font-normal text-slate-600 ml-1">/10</span>
              </p>
              {getTrendIcon(comparison.avg_rpe.trend)}
            </div>

            <div className={`text-sm font-semibold ${getTrendColor(comparison.avg_rpe.trend)}`}>
              {comparison.avg_rpe.change > 0 ? '+' : ''}
              {comparison.avg_rpe.change?.toFixed(1) || 0} 
              ({comparison.avg_rpe.changePercentage > 0 ? '+' : ''}
              {comparison.avg_rpe.changePercentage?.toFixed(1)}%)
            </div>
          </motion.div>
        )}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-600" />
          Evolução ao Longo do Tempo
        </h4>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              stroke="#64748b" 
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }} 
              stroke="#64748b"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }} 
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                fontSize: '12px' 
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="volume" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              name="Volume (kg)"
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="rpe" 
              stroke="#f59e0b" 
              strokeWidth={3}
              name="RPE"
              dot={{ fill: '#f59e0b', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Exercise-Level Comparison */}
      {exerciseComparison && exerciseComparison.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4">
            Progressão por Exercício
          </h4>

          <div className="space-y-3">
            {exerciseComparison.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-slate-900">{exercise.exerciseName}</h5>
                  {getTrendIcon(exercise.progression.trend)}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Volume</p>
                    <p className={`font-semibold ${getTrendColor(exercise.progression.trend)}`}>
                      {exercise.progression.volumeChange > 0 ? '+' : ''}
                      {exercise.progression.volumeChange.toFixed(0)}kg
                      <span className="text-xs ml-1">
                        ({exercise.progression.volumeChangePercentage > 0 ? '+' : ''}
                        {exercise.progression.volumeChangePercentage.toFixed(1)}%)
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-600 mb-1">Peso Máximo</p>
                    <p className={`font-semibold ${getTrendColor(exercise.progression.trend)}`}>
                      {exercise.progression.maxWeightChange > 0 ? '+' : ''}
                      {exercise.progression.maxWeightChange.toFixed(0)}kg
                      <span className="text-xs ml-1">
                        ({exercise.progression.maxWeightChangePercentage > 0 ? '+' : ''}
                        {exercise.progression.maxWeightChangePercentage.toFixed(1)}%)
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-600 mb-1">Sessões</p>
                    <p className="font-semibold text-slate-900">
                      {exercise.dataPoints.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
