import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, TrendingUp, Heart, Wind, Flame } from 'lucide-react';

export function EnergyLab() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  const protocols = [
    {
      id: 'vo2max',
      name: 'VO2 Max Test',
      description: 'Consumo máximo de oxigénio',
      duration: '12-15 min',
      equipment: 'Tapete rolante + Analisador de gases',
      icon: '🔋',
      color: 'blue',
    },
    {
      id: 'lactate',
      name: 'Lactate Threshold',
      description: 'Limiares metabólicos',
      duration: '20-30 min',
      equipment: 'Ergómetro + Lactímetro',
      icon: '📈',
      color: 'emerald',
    },
    {
      id: 'resting',
      name: 'Resting Metabolic Rate',
      description: 'Taxa metabólica basal',
      duration: '30 min',
      equipment: 'Calorímetro indireto',
      icon: '💤',
      color: 'purple',
    },
    {
      id: 'efficiency',
      name: 'Mechanical Efficiency',
      description: 'Economia de movimento',
      duration: '15-20 min',
      equipment: 'Análise de gases + Plataforma',
      icon: '⚙️',
      color: 'amber',
    },
  ];

  const recentTests = [
    {
      athlete: 'João Silva',
      test: 'VO2 Max',
      value: 58.2,
      unit: 'ml/kg/min',
      percentile: 92,
      date: '18 Dez',
      trend: 'up',
    },
    {
      athlete: 'Maria Costa',
      test: 'Limiar Anaeróbio',
      value: 4.2,
      unit: 'mmol/L',
      percentile: 85,
      date: '17 Dez',
      trend: 'stable',
    },
    {
      athlete: 'Pedro Santos',
      test: 'RMR',
      value: 1850,
      unit: 'kcal/dia',
      percentile: 78,
      date: '16 Dez',
      trend: 'down',
    },
  ];

  const energySystems = [
    {
      name: 'Sistema Fosfagénico (ATP-PC)',
      duration: '0-10 segundos',
      characteristics: 'Explosivo, anaeróbio alático',
      examples: ['Sprint 100m', 'Salto vertical', 'Powerlifting'],
      color: 'red',
    },
    {
      name: 'Sistema Glicolítico (Anaeróbio)',
      duration: '10 seg - 2 min',
      characteristics: 'Alta intensidade, produção de lactato',
      examples: ['Sprint 400m', '800m', 'HIIT'],
      color: 'amber',
    },
    {
      name: 'Sistema Oxidativo (Aeróbio)',
      duration: '> 2 minutos',
      characteristics: 'Uso de oxigénio, sustentável',
      examples: ['Maratona', 'Ciclismo longa dist.', 'Natação'],
      color: 'blue',
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-20 sm:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-slate-900 truncate">Energy Systems Lab</h2>
            <p className="text-sm text-slate-600 truncate">
              Análise de metabolismo e sistemas energéticos
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="h-4 w-4 text-blue-700" />
              <p className="text-xs text-blue-700">VO2 Max Médio</p>
            </div>
            <p className="text-2xl text-blue-700 mb-1">52.8</p>
            <p className="text-xs text-blue-600">ml/kg/min</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-emerald-700" />
              <p className="text-xs text-emerald-700">FC Máxima Média</p>
            </div>
            <p className="text-2xl text-emerald-700 mb-1">186</p>
            <p className="text-xs text-emerald-600">bpm</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-amber-700" />
              <p className="text-xs text-amber-700">Testes Este Mês</p>
            </div>
            <p className="text-2xl text-amber-700 mb-1">24</p>
            <p className="text-xs text-amber-600">+8 vs mês passado</p>
          </div>
        </div>
      </motion.div>

      {/* Test Protocols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Protocolos de Teste</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {protocols.map((protocol, index) => (
            <motion.button
              key={protocol.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={() => setSelectedProtocol(protocol.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                selectedProtocol === protocol.id
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 hover:border-sky-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="text-3xl shrink-0">{protocol.icon}</div>
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs shrink-0">
                  {protocol.duration}
                </span>
              </div>

              <h4 className="text-slate-900 mb-1">{protocol.name}</h4>
              <p className="text-sm text-slate-600 mb-2">
                {protocol.description}
              </p>
              <p className="text-xs text-slate-500 mb-3 truncate">
                📦 {protocol.equipment}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedProtocol === protocol.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Configurar Teste
              </motion.button>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-slate-900">Testes Recentes</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-sm hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            Ver Histórico
          </motion.button>
        </div>

        <div className="space-y-3">
          {recentTests.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h4 className="text-sm text-slate-900 truncate">{test.athlete}</h4>
                  <p className="text-xs text-slate-600 truncate">
                    {test.test} • {test.date}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-lg text-slate-900">
                      {test.value}
                      <span className="text-sm text-slate-600 ml-1">
                        {test.unit}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-600">
                      Top {100 - test.percentile}%
                    </p>
                  </div>
                  <div>
                    {test.trend === 'up' && (
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    )}
                    {test.trend === 'down' && (
                      <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
                    )}
                    {test.trend === 'stable' && (
                      <div className="h-5 w-5 flex items-center justify-center">
                        <div className="h-0.5 w-4 bg-slate-400 rounded" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    test.percentile >= 85
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : test.percentile >= 70
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600'
                  }`}
                  style={{ width: `${test.percentile}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Energy Systems Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Sistemas Energéticos</h3>

        <div className="space-y-4">
          {energySystems.map((system, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className={`rounded-xl border p-4 ${
                system.color === 'red'
                  ? 'border-red-200 bg-red-50'
                  : system.color === 'amber'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h4
                    className={`text-sm mb-1 ${
                      system.color === 'red'
                        ? 'text-red-900'
                        : system.color === 'amber'
                        ? 'text-amber-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {system.name}
                  </h4>
                  <p
                    className={`text-xs ${
                      system.color === 'red'
                        ? 'text-red-700'
                        : system.color === 'amber'
                        ? 'text-amber-700'
                        : 'text-blue-700'
                    }`}
                  >
                    {system.duration} • {system.characteristics}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {system.examples.map((example) => (
                  <span
                    key={example}
                    className={`px-2 py-1 rounded text-xs ${
                      system.color === 'red'
                        ? 'bg-red-100 text-red-700'
                        : system.color === 'amber'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {example}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Training Zones Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 sm:p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-6 w-6 text-amber-600 shrink-0" />
          <h3 className="text-slate-900">Calculadora de Zonas de Treino</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Calcule zonas de treino personalizadas baseadas em FC máxima, limiar
          anaeróbio e VO2 max.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm hover:from-amber-400 hover:to-orange-400 transition-all"
        >
          Abrir Calculadora
        </motion.button>
      </motion.div>
    </div>
  );
}