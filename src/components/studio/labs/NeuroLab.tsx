import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Zap, Target, Timer, Play, BarChart3 } from 'lucide-react';

export function NeuroLab() {
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const tests = [
    {
      id: 'stroop',
      name: 'Stroop Test',
      description: 'Controlo inibitório e atenção seletiva',
      duration: '5 min',
      difficulty: 'Médio',
      icon: '🎨',
      color: 'blue',
    },
    {
      id: 'reaction',
      name: 'Reaction Time',
      description: 'Velocidade de processamento visual-motor',
      duration: '3 min',
      difficulty: 'Fácil',
      icon: '⚡',
      color: 'emerald',
    },
    {
      id: 'memory',
      name: 'Working Memory',
      description: 'Capacidade de memória de trabalho',
      duration: '8 min',
      difficulty: 'Difícil',
      icon: '🧠',
      color: 'purple',
    },
    {
      id: 'dual',
      name: 'Dual Task',
      description: 'Capacidade de executar múltiplas tarefas',
      duration: '10 min',
      difficulty: 'Difícil',
      icon: '🎯',
      color: 'amber',
    },
  ];

  const recentResults = [
    {
      athlete: 'João Silva',
      test: 'Reaction Time',
      score: 287,
      unit: 'ms',
      percentile: 85,
      date: '18 Dez',
    },
    {
      athlete: 'Maria Costa',
      test: 'Stroop Test',
      score: 92,
      unit: '%',
      percentile: 78,
      date: '17 Dez',
    },
    {
      athlete: 'Pedro Santos',
      test: 'Working Memory',
      score: 7.2,
      unit: '/10',
      percentile: 71,
      date: '16 Dez',
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-20 sm:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-slate-900 truncate">Neuro Performance</h2>
            <p className="text-sm text-slate-600 truncate">
              Otimização cognitiva e neural
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-emerald-700" />
              <p className="text-xs text-emerald-700">Testes Hoje</p>
            </div>
            <p className="text-2xl text-emerald-700 mb-1">14</p>
            <p className="text-xs text-emerald-600">+6 vs ontem</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-700" />
              <p className="text-xs text-blue-700">Tempo Reação Médio</p>
            </div>
            <p className="text-2xl text-blue-700 mb-1">312ms</p>
            <p className="text-xs text-blue-600">-18ms vs mês passado</p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-700" />
              <p className="text-xs text-purple-700">Precisão Média</p>
            </div>
            <p className="text-2xl text-purple-700 mb-1">87%</p>
            <p className="text-xs text-purple-600">+3% este mês</p>
          </div>
        </div>
      </motion.div>

      {/* Available Tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Testes Disponíveis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {tests.map((test, index) => (
            <motion.button
              key={test.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={() => setActiveTest(test.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                activeTest === test.id
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 hover:border-sky-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="text-3xl shrink-0">{test.icon}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                    {test.duration}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      test.difficulty === 'Fácil'
                        ? 'bg-emerald-100 text-emerald-700'
                        : test.difficulty === 'Médio'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {test.difficulty}
                  </span>
                </div>
              </div>

              <h4 className="text-slate-900 mb-1">{test.name}</h4>
              <p className="text-sm text-slate-600 mb-3">{test.description}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
                  activeTest === test.id
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Play className="h-4 w-4" />
                <span>Iniciar Teste</span>
              </motion.button>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-slate-900">Resultados Recentes</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-sm hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            Ver Todos
          </motion.button>
        </div>

        <div className="space-y-3">
          {recentResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h4 className="text-sm text-slate-900 truncate">{result.athlete}</h4>
                  <p className="text-xs text-slate-600 truncate">
                    {result.test} • {result.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg text-slate-900">
                    {result.score}
                    <span className="text-sm text-slate-600 ml-1">
                      {result.unit}
                    </span>
                  </p>
                  <p className="text-xs text-emerald-600">
                    Top {100 - result.percentile}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                  style={{ width: `${result.percentile}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Training Programs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Programas de Treino Cognitivo</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">🧠</div>
            <h4 className="text-sm text-slate-900 mb-1">Cognitive Load</h4>
            <p className="text-xs text-slate-600 mb-3">
              Programa de 4 semanas para aumentar capacidade cognitiva
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Ver Programa
            </motion.button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="text-sm text-slate-900 mb-1">Speed Training</h4>
            <p className="text-xs text-slate-600 mb-3">
              Melhoria de velocidade de processamento e reação
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Ver Programa
            </motion.button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-sm text-slate-900 mb-1">Focus & Attention</h4>
            <p className="text-xs text-slate-600 mb-3">
              Exercícios diários de concentração e atenção
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Ver Programa
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6 text-emerald-600 shrink-0" />
          <h3 className="text-slate-900">Analytics Dashboard</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Visualize tendências de performance cognitiva ao longo do tempo,
          compare atletas e identifique padrões.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          Abrir Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}