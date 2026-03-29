/**
 * RISK SCORES - AI-powered risk predictions
 * Injury risk, overtraining, performance decline
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Activity,
  Heart,
  TrendingDown,
  Shield,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface AthleteRisk {
  id: string;
  name: string;
  position: string;
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  risks: {
    injury: number;
    overtraining: number;
    performance_decline: number;
    burnout: number;
    illness: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

const RISK_CATEGORIES = [
  { key: 'injury', label: 'Injury Risk', icon: AlertTriangle, color: '#ef4444' },
  { key: 'overtraining', label: 'Overtraining', icon: Activity, color: '#f59e0b' },
  { key: 'performance_decline', label: 'Performance Decline', icon: TrendingDown, color: '#8b5cf6' },
  { key: 'burnout', label: 'Burnout', icon: Heart, color: '#ec4899' },
  { key: 'illness', label: 'Illness', icon: AlertCircle, color: '#f97316' },
];

const MOCK_ATHLETES_RISK: AthleteRisk[] = [
  {
    id: 'athlete-1',
    name: 'João Silva',
    position: 'Forward',
    overallRisk: 72,
    riskLevel: 'high',
    risks: {
      injury: 78,
      overtraining: 65,
      performance_decline: 45,
      burnout: 55,
      illness: 40,
    },
    recommendations: [
      'Reduce training load by 20% this week',
      'Focus on recovery sessions',
      'Monitor HRV daily',
      'Consider extra rest day',
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'athlete-2',
    name: 'Maria Santos',
    position: 'Midfielder',
    overallRisk: 35,
    riskLevel: 'low',
    risks: {
      injury: 30,
      overtraining: 25,
      performance_decline: 40,
      burnout: 35,
      illness: 45,
    },
    recommendations: [
      'Maintain current training volume',
      'Continue monitoring wellness',
      'Good recovery patterns',
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'athlete-3',
    name: 'Pedro Costa',
    position: 'Defender',
    overallRisk: 58,
    riskLevel: 'moderate',
    risks: {
      injury: 62,
      overtraining: 50,
      performance_decline: 55,
      burnout: 60,
      illness: 45,
    },
    recommendations: [
      'Increase recovery sessions',
      'Monitor fatigue levels closely',
      'Consider load management',
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'athlete-4',
    name: 'Ana Rodrigues',
    position: 'Forward',
    overallRisk: 88,
    riskLevel: 'critical',
    risks: {
      injury: 92,
      overtraining: 85,
      performance_decline: 75,
      burnout: 80,
      illness: 68,
    },
    recommendations: [
      '🚨 IMMEDIATE REST REQUIRED',
      'Medical evaluation recommended',
      'Reduce all training by 50%',
      'Focus on sleep and nutrition',
      'Daily monitoring essential',
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'athlete-5',
    name: 'Carlos Mendes',
    position: 'Goalkeeper',
    overallRisk: 42,
    riskLevel: 'moderate',
    risks: {
      injury: 45,
      overtraining: 38,
      performance_decline: 50,
      burnout: 40,
      illness: 35,
    },
    recommendations: [
      'Standard monitoring protocol',
      'Maintain current load',
      'Focus on technical training',
    ],
    lastUpdated: new Date().toISOString(),
  },
];

const getRiskLevelConfig = (level: AthleteRisk['riskLevel']) => {
  const configs = {
    low: {
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-900',
      label: 'Low Risk',
      icon: Shield,
    },
    moderate: {
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-900',
      label: 'Moderate Risk',
      icon: AlertCircle,
    },
    high: {
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      label: 'High Risk',
      icon: AlertTriangle,
    },
    critical: {
      color: 'red',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-400',
      textColor: 'text-red-900',
      label: 'CRITICAL',
      icon: AlertTriangle,
    },
  };
  return configs[level];
};

export function RiskScores() {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(MOCK_ATHLETES_RISK[0].id);

  const selectedAthlete = MOCK_ATHLETES_RISK.find((a) => a.id === selectedAthleteId)!;
  const riskConfig = getRiskLevelConfig(selectedAthlete.riskLevel);
  const Icon = riskConfig.icon;

  // Prepare radar data
  const radarData = RISK_CATEGORIES.map((cat) => ({
    category: cat.label,
    value: selectedAthlete.risks[cat.key as keyof typeof selectedAthlete.risks],
  }));

  // Team overview data
  const teamOverview = MOCK_ATHLETES_RISK.map((athlete) => ({
    name: athlete.name.split(' ')[0],
    risk: athlete.overallRisk,
    level: athlete.riskLevel,
  }));

  // Risk distribution
  const riskDistribution = [
    { level: 'Low', count: MOCK_ATHLETES_RISK.filter((a) => a.riskLevel === 'low').length, color: '#10b981' },
    { level: 'Moderate', count: MOCK_ATHLETES_RISK.filter((a) => a.riskLevel === 'moderate').length, color: '#f59e0b' },
    { level: 'High', count: MOCK_ATHLETES_RISK.filter((a) => a.riskLevel === 'high').length, color: '#ef4444' },
    { level: 'Critical', count: MOCK_ATHLETES_RISK.filter((a) => a.riskLevel === 'critical').length, color: '#dc2626' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Team Risk Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {riskDistribution.map((dist, index) => (
            <motion.div
              key={dist.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-white border-2 border-slate-200"
            >
              <p className="text-xs text-slate-500 mb-2">{dist.level} Risk</p>
              <p className="text-3xl font-bold" style={{ color: dist.color }}>
                {dist.count}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((dist.count / MOCK_ATHLETES_RISK.length) * 100).toFixed(0)}% of team
              </p>
            </motion.div>
          ))}
        </div>

        {/* Team Overview Chart */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Team Risk Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teamOverview}>
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
              <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                {teamOverview.map((entry, index) => {
                  const colors = {
                    low: '#10b981',
                    moderate: '#f59e0b',
                    high: '#ef4444',
                    critical: '#dc2626',
                  };
                  return <Cell key={`cell-${index}`} fill={colors[entry.level]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Athlete Selector */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Select Athlete for Details</h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {MOCK_ATHLETES_RISK.map((athlete) => {
              const isSelected = selectedAthleteId === athlete.id;
              const config = getRiskLevelConfig(athlete.riskLevel);

              return (
                <motion.button
                  key={athlete.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAthleteId(athlete.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? `${config.bgColor} border-2 ${config.borderColor} shadow-lg`
                      : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        isSelected ? config.bgColor : 'bg-slate-200'
                      } ${isSelected ? config.textColor : 'text-slate-600'}`}
                    >
                      {athlete.overallRisk}
                    </span>
                    {isSelected && <CheckCircle className="h-4 w-4" style={{ color: config.color === 'emerald' ? '#10b981' : config.color === 'amber' ? '#f59e0b' : '#ef4444' }} />}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">{athlete.name}</h4>
                  <p className="text-xs text-slate-500">{athlete.position}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Athlete Details */}
        <div className={`p-5 rounded-2xl ${riskConfig.bgColor} border-2 ${riskConfig.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${riskConfig.color}-500 to-${riskConfig.color}-600 flex items-center justify-center`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`font-bold ${riskConfig.textColor}`}>
                  {selectedAthlete.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {selectedAthlete.position} • Overall Risk: {selectedAthlete.overallRisk}/100
                </p>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-xl bg-white border-2 ${riskConfig.borderColor}`}>
              <p className={`text-sm font-bold ${riskConfig.textColor}`}>
                {riskConfig.label.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Risk Radar */}
          <div className="bg-white rounded-xl p-5 border-2 border-slate-200 mb-4">
            <h4 className="font-semibold text-slate-900 mb-4">Risk Profile</h4>

            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Radar
                  name="Risk Score"
                  dataKey="value"
                  stroke={riskConfig.color === 'emerald' ? '#10b981' : riskConfig.color === 'amber' ? '#f59e0b' : '#ef4444'}
                  fill={riskConfig.color === 'emerald' ? '#10b981' : riskConfig.color === 'amber' ? '#f59e0b' : '#ef4444'}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            {RISK_CATEGORIES.map((cat, index) => {
              const value = selectedAthlete.risks[cat.key as keyof typeof selectedAthlete.risks];
              const CategoryIcon = cat.icon;
              
              let riskLevel: 'low' | 'moderate' | 'high' = 'low';
              if (value >= 70) riskLevel = 'high';
              else if (value >= 40) riskLevel = 'moderate';

              const levelConfig = {
                low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900' },
                moderate: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
                high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900' },
              };

              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-xl ${levelConfig[riskLevel].bg} border-2 ${levelConfig[riskLevel].border}`}
                >
                  <CategoryIcon className="h-5 w-5 mb-2" style={{ color: cat.color }} />
                  <p className="text-xs text-slate-600 mb-1">{cat.label}</p>
                  <p className={`text-2xl font-bold ${levelConfig[riskLevel].text}`}>{value}</p>
                  <div className="h-1.5 bg-white rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${value}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              AI Recommendations
            </h4>

            <div className="space-y-2">
              {selectedAthlete.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    rec.includes('🚨')
                      ? 'bg-red-100 border-2 border-red-300'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <ChevronRight
                    className={`h-4 w-4 mt-0.5 shrink-0 ${
                      rec.includes('🚨') ? 'text-red-600' : 'text-violet-600'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      rec.includes('🚨') ? 'font-bold text-red-900' : 'text-slate-700'
                    }`}
                  >
                    {rec}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Last updated: {new Date(selectedAthlete.lastUpdated).toLocaleString('pt-PT')}
              </p>
            </div>
          </div>
        </div>

        {/* Global Insights */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Team Insights
          </h3>

          <div className="space-y-2">
            {riskDistribution.find((d) => d.level === 'Critical')?.count! > 0 && (
              <div className="p-3 rounded-xl bg-white border border-red-300">
                <p className="text-sm text-red-900">
                  🚨 <strong>URGENT:</strong> {riskDistribution.find((d) => d.level === 'Critical')?.count} athlete(s) at critical risk level. Immediate intervention required.
                </p>
              </div>
            )}

            {riskDistribution.find((d) => d.level === 'High')?.count! > 0 && (
              <div className="p-3 rounded-xl bg-white border border-amber-200">
                <p className="text-sm text-amber-900">
                  ⚠️ <strong>Warning:</strong> {riskDistribution.find((d) => d.level === 'High')?.count} athlete(s) at high risk. Close monitoring recommended.
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-white border border-purple-200">
              <p className="text-sm text-purple-900">
                💡 <strong>Recommendation:</strong> Review training load distribution across the team to prevent overtraining clusters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
