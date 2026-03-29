/**
 * ATHLETE COMPARE - Multi-athlete side-by-side comparison
 * Radar charts, metric tables, performance gaps
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';

interface Athlete {
  id: string;
  name: string;
  avatar: string;
  position: string;
  age: number;
  metrics: {
    [key: string]: number;
  };
}

const MOCK_ATHLETES: Athlete[] = [
  {
    id: 'athlete-1',
    name: 'João Silva',
    avatar: '',
    position: 'Forward',
    age: 24,
    metrics: {
      speed: 85,
      strength: 72,
      endurance: 88,
      agility: 90,
      technical: 82,
      tactical: 78,
    },
  },
  {
    id: 'athlete-2',
    name: 'Maria Santos',
    avatar: '',
    position: 'Midfielder',
    age: 22,
    metrics: {
      speed: 78,
      strength: 68,
      endurance: 92,
      agility: 85,
      technical: 88,
      tactical: 90,
    },
  },
  {
    id: 'athlete-3',
    name: 'Pedro Costa',
    avatar: '',
    position: 'Defender',
    age: 26,
    metrics: {
      speed: 70,
      strength: 88,
      endurance: 85,
      agility: 75,
      technical: 72,
      tactical: 85,
    },
  },
  {
    id: 'athlete-4',
    name: 'Ana Rodrigues',
    avatar: '',
    position: 'Forward',
    age: 23,
    metrics: {
      speed: 92,
      strength: 70,
      endurance: 80,
      agility: 88,
      technical: 85,
      tactical: 75,
    },
  },
  {
    id: 'athlete-5',
    name: 'Carlos Mendes',
    avatar: '',
    position: 'Goalkeeper',
    age: 28,
    metrics: {
      speed: 65,
      strength: 85,
      endurance: 75,
      agility: 82,
      technical: 90,
      tactical: 88,
    },
  },
];

const METRIC_DEFINITIONS = [
  { key: 'speed', label: 'Speed', unit: '', color: '#0ea5e9' },
  { key: 'strength', label: 'Strength', unit: '', color: '#f59e0b' },
  { key: 'endurance', label: 'Endurance', unit: '', color: '#10b981' },
  { key: 'agility', label: 'Agility', unit: '', color: '#8b5cf6' },
  { key: 'technical', label: 'Technical', unit: '', color: '#ec4899' },
  { key: 'tactical', label: 'Tactical', unit: '', color: '#6366f1' },
];

const ATHLETE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AthleteCompare() {
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([
    'athlete-1',
    'athlete-2',
  ]);

  const handleToggleAthlete = (athleteId: string) => {
    if (selectedAthletes.includes(athleteId)) {
      setSelectedAthletes((prev) => prev.filter((id) => id !== athleteId));
    } else {
      if (selectedAthletes.length >= 5) {
        alert('⚠️ Máximo 5 atletas para comparação');
        return;
      }
      setSelectedAthletes((prev) => [...prev, athleteId]);
    }
  };

  const athletes = selectedAthletes
    .map((id) => MOCK_ATHLETES.find((a) => a.id === id))
    .filter(Boolean) as Athlete[];

  // Prepare radar data
  const radarData = METRIC_DEFINITIONS.map((metric) => {
    const dataPoint: any = { metric: metric.label };
    athletes.forEach((athlete, index) => {
      dataPoint[athlete.name] = athlete.metrics[metric.key];
    });
    return dataPoint;
  });

  // Calculate performance gaps
  const performanceGaps = METRIC_DEFINITIONS.map((metric) => {
    const values = athletes.map((a) => a.metrics[metric.key]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const gap = max - min;
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

    return {
      metric: metric.label,
      gap,
      max,
      min,
      avg: Math.round(avg),
    };
  });

  // Calculate overall scores
  const overallScores = athletes.map((athlete) => {
    const metricValues = Object.values(athlete.metrics);
    const avg = metricValues.reduce((sum, v) => sum + v, 0) / metricValues.length;
    return {
      name: athlete.name,
      score: Math.round(avg),
      color: ATHLETE_COLORS[selectedAthletes.indexOf(athlete.id)],
    };
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Athlete Selector */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">
            Select Athletes to Compare (max 5)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {MOCK_ATHLETES.map((athlete) => {
              const isSelected = selectedAthletes.includes(athlete.id);
              const colorIndex = selectedAthletes.indexOf(athlete.id);
              const color = isSelected ? ATHLETE_COLORS[colorIndex] : '#64748b';

              return (
                <motion.button
                  key={athlete.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleAthlete(athlete.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-sky-50 to-white border-2 border-sky-400 shadow-lg'
                      : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                  style={isSelected ? { borderColor: color } : undefined}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {athlete.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    {isSelected && <CheckCircle className="h-4 w-4 ml-auto" style={{ color }} />}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">{athlete.name}</h4>
                  <p className="text-xs text-slate-500">
                    {athlete.position} • {athlete.age}y
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {athletes.length >= 2 ? (
          <>
            {/* Overall Scores */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Overall Performance Scores</h3>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={overallScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {overallScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {overallScores.map((score, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border-2"
                    style={{ borderColor: score.color + '40', backgroundColor: score.color + '10' }}
                  >
                    <p className="text-xs text-slate-600 mb-1">{score.name}</p>
                    <p className="text-2xl font-bold" style={{ color: score.color }}>
                      {score.score}
                    </p>
                    <p className="text-xs text-slate-500">/ 100</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Radar</h3>

              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {athletes.map((athlete, index) => (
                    <Radar
                      key={athlete.id}
                      name={athlete.name}
                      dataKey={athlete.name}
                      stroke={ATHLETE_COLORS[index]}
                      fill={ATHLETE_COLORS[index]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Metrics Table */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Detailed Comparison</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Metric
                      </th>
                      {athletes.map((athlete, index) => (
                        <th
                          key={athlete.id}
                          className="text-center py-3 px-4 text-sm font-semibold"
                          style={{ color: ATHLETE_COLORS[index] }}
                        >
                          {athlete.name}
                        </th>
                      ))}
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                        Best
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {METRIC_DEFINITIONS.map((metric) => {
                      const values = athletes.map((a) => a.metrics[metric.key]);
                      const maxValue = Math.max(...values);
                      const bestAthleteIndex = values.indexOf(maxValue);

                      return (
                        <tr key={metric.key} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm font-medium text-slate-900">
                            {metric.label}
                          </td>
                          {athletes.map((athlete, index) => {
                            const value = athlete.metrics[metric.key];
                            const isBest = index === bestAthleteIndex;
                            const diff = value - maxValue;

                            return (
                              <td key={athlete.id} className="text-center py-3 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <span
                                    className={`text-sm font-semibold ${
                                      isBest ? 'text-emerald-600' : 'text-slate-900'
                                    }`}
                                  >
                                    {value}
                                  </span>
                                  {isBest && <Award className="h-4 w-4 text-amber-500" />}
                                  {!isBest && diff !== 0 && (
                                    <span className="text-xs text-red-600">({diff})</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          <td className="text-center py-3 px-4">
                            <span className="text-sm font-bold text-emerald-600">{maxValue}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Gaps Analysis */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Gaps Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performanceGaps.map((gap, index) => {
                  const gapPercentage = (gap.gap / gap.max) * 100;
                  let gapColor = 'emerald';
                  let gapIcon = CheckCircle;

                  if (gapPercentage > 30) {
                    gapColor = 'red';
                    gapIcon = AlertCircle;
                  } else if (gapPercentage > 15) {
                    gapColor = 'amber';
                    gapIcon = AlertCircle;
                  }

                  const Icon = gapIcon;

                  return (
                    <motion.div
                      key={gap.metric}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl bg-gradient-to-br from-${gapColor}-50 to-white border-2 border-${gapColor}-200`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">{gap.metric}</h4>
                        <Icon className={`h-5 w-5 text-${gapColor}-600`} />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Gap:</span>
                          <span className={`font-bold text-${gapColor}-700`}>{gap.gap} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Range:</span>
                          <span className="font-medium text-slate-900">
                            {gap.min} - {gap.max}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Average:</span>
                          <span className="font-medium text-slate-900">{gap.avg}</span>
                        </div>
                      </div>

                      {/* Gap visual */}
                      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-${gapColor}-400 to-${gapColor}-600`}
                          style={{ width: `${gapPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {gapPercentage.toFixed(0)}% variation
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Insights & Recommendations */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Insights & Recommendations
              </h3>

              <div className="space-y-2">
                {performanceGaps
                  .filter((gap) => (gap.gap / gap.max) * 100 > 20)
                  .map((gap, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-white border border-purple-200"
                    >
                      <p className="text-sm text-purple-900">
                        💡 <strong>{gap.metric}:</strong> Large performance gap detected ({gap.gap}{' '}
                        pts). Consider targeted training for lower-performing athletes.
                      </p>
                    </div>
                  ))}

                {overallScores.length > 0 && (
                  <div className="p-3 rounded-xl bg-white border border-emerald-200">
                    <p className="text-sm text-emerald-900">
                      ⭐ <strong>Top Performer:</strong>{' '}
                      {overallScores.reduce((prev, curr) => (prev.score > curr.score ? prev : curr)).name}{' '}
                      leads with overall score of{' '}
                      {overallScores.reduce((prev, curr) => (prev.score > curr.score ? prev : curr)).score}
                      /100
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 mb-2">Select at least 2 athletes</h3>
            <p className="text-sm text-slate-500">
              Choose 2-5 athletes from the list above to start comparing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
