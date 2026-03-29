import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Target,
  TrendingUp,
  Camera,
  Zap,
  AlertCircle,
  Play,
  Upload,
} from 'lucide-react';

export function BiomechanicsLab() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const analyses = [
    {
      id: 'squat-1',
      exercise: 'Back Squat',
      athlete: 'João Silva',
      date: '18 Dez 2024',
      efficiency: 87,
      issues: ['Joelho valgo esquerdo', 'Assimetria 12%'],
      color: 'emerald',
    },
    {
      id: 'deadlift-1',
      exercise: 'Deadlift',
      athlete: 'Maria Costa',
      date: '17 Dez 2024',
      efficiency: 92,
      issues: [],
      color: 'blue',
    },
    {
      id: 'snatch-1',
      exercise: 'Snatch',
      athlete: 'Pedro Santos',
      date: '16 Dez 2024',
      efficiency: 74,
      issues: ['Catch position alta', 'Ombro esquerdo antecipado'],
      color: 'amber',
    },
  ];

  const metrics = [
    {
      label: 'Análises Hoje',
      value: '8',
      trend: '+3 vs ontem',
      icon: Camera,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Eficiência Média',
      value: '84%',
      trend: '+5% este mês',
      icon: Target,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Assimetrias Detectadas',
      value: '12',
      trend: '-3 vs semana passada',
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-20 sm:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-blue-50/90 to-white/90 p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-slate-900 truncate">Biomechanics Lab</h2>
            <p className="text-sm text-slate-600 truncate">
              Análise avançada de movimento e eficiência mecânica
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`rounded-xl border ${metric.color} p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" />
                  <p className="text-xs">{metric.label}</p>
                </div>
                <p className="text-2xl mb-1">{metric.value}</p>
                <p className="text-xs opacity-75">{metric.trend}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 hover:border-blue-400 hover:shadow-xl transition-all text-left"
        >
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
            <Camera className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <h3 className="text-slate-900 mb-2">Nova Captura de Movimento</h3>
          <p className="text-sm text-slate-600">
            Iniciar análise 3D com múltiplas câmaras
          </p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-6 hover:border-emerald-400 hover:shadow-xl transition-all text-left"
        >
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
            <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <h3 className="text-slate-900 mb-2">Upload de Vídeo</h3>
          <p className="text-sm text-slate-600">
            Análise de vídeos já gravados
          </p>
        </motion.button>
      </div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900">Análises Recentes</h3>
          <span className="text-sm text-slate-600">
            {analyses.length} análises
          </span>
        </div>

        <div className="space-y-3">
          {analyses.map((analysis, index) => (
            <motion.button
              key={analysis.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => setSelectedAnalysis(analysis.id)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                selectedAnalysis === analysis.id
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 hover:border-sky-300 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h4 className="text-slate-900 mb-1 truncate">{analysis.exercise}</h4>
                  <p className="text-sm text-slate-600 truncate">
                    {analysis.athlete} • {analysis.date}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-sm shrink-0 w-fit ${
                    analysis.efficiency >= 85
                      ? 'bg-emerald-100 text-emerald-700'
                      : analysis.efficiency >= 75
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {analysis.efficiency}% eficiência
                </div>
              </div>

              {analysis.issues.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {analysis.issues.map((issue) => (
                    <span
                      key={issue}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs"
                    >
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{issue}</span>
                    </span>
                  ))}
                </div>
              )}

              {analysis.issues.length === 0 && (
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <TrendingUp className="h-4 w-4 shrink-0" />
                  <span>Sem issues detectadas</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Available Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Ferramentas Disponíveis</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="text-sm text-slate-900 mb-1">Motion Capture</h4>
            <p className="text-xs text-slate-600 mb-3">
              Análise cinemática 3D de movimentos complexos
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Iniciar Captura
            </motion.button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="text-sm text-slate-900 mb-1">Force Plates</h4>
            <p className="text-xs text-slate-600 mb-3">
              Medição de forças de reação do solo
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Configurar Placas
            </motion.button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-sm text-slate-900 mb-1">Efficiency Score</h4>
            <p className="text-xs text-slate-600 mb-3">
              Cálculo de métricas de eficiência
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Ver Algoritmos
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}