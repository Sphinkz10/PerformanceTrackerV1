import { useState } from 'react';
import { motion } from 'motion/react';
import { Dna, Users, TrendingUp, Beaker, FileText, Shield } from 'lucide-react';

export function GeneticLab() {
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

  const athletes = [
    {
      id: '1',
      name: 'João Silva',
      status: 'Perfil completo',
      genes: {
        actn3: 'RR (Power)',
        ace: 'II (Endurance)',
        ppara: 'GG (Fat metabolism)',
      },
      recommendations: [
        'Explosividade favorecida geneticamente',
        'Treino de potência otimizado',
        'Metabolismo lipídico eficiente',
      ],
      color: 'emerald',
    },
    {
      id: '2',
      name: 'Maria Costa',
      status: 'Análise pendente',
      genes: {
        actn3: 'RX (Mixed)',
        ace: 'DD (Power)',
        ppara: 'CG (Mixed)',
      },
      recommendations: [
        'Perfil misto força/resistência',
        'Periodização variada recomendada',
      ],
      color: 'blue',
    },
    {
      id: '3',
      name: 'Pedro Santos',
      status: 'Amostra recolhida',
      genes: null,
      recommendations: [],
      color: 'amber',
    },
  ];

  const markers = [
    {
      gene: 'ACTN3',
      name: 'Alpha-Actinin-3',
      trait: 'Fibras musculares rápidas',
      variants: ['RR (Power)', 'RX (Mixed)', 'XX (Endurance)'],
    },
    {
      gene: 'ACE',
      name: 'Angiotensin-Converting Enzyme',
      trait: 'Capacidade cardiovascular',
      variants: ['II (Endurance)', 'ID (Mixed)', 'DD (Power)'],
    },
    {
      gene: 'PPARA',
      name: 'Peroxisome Proliferator',
      trait: 'Metabolismo de gorduras',
      variants: ['GG (Efficient)', 'CG (Mixed)', 'CC (Less efficient)'],
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-20 sm:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-purple-50/90 to-white/90 p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <Dna className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-slate-900 truncate">Genetic Profiling</h2>
            <p className="text-sm text-slate-600 truncate">
              Análise genética para personalização de treino
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-700" />
              <p className="text-xs text-purple-700">Atletas Perfilados</p>
            </div>
            <p className="text-2xl text-purple-700 mb-1">18</p>
            <p className="text-xs text-purple-600">75% do squad</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Beaker className="h-4 w-4 text-emerald-700" />
              <p className="text-xs text-emerald-700">Marcadores Analisados</p>
            </div>
            <p className="text-2xl text-emerald-700 mb-1">24</p>
            <p className="text-xs text-emerald-600">3 categorias principais</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-700" />
              <p className="text-xs text-blue-700">Precisão Preditiva</p>
            </div>
            <p className="text-2xl text-blue-700 mb-1">89%</p>
            <p className="text-xs text-blue-600">Validado cientificamente</p>
          </div>
        </div>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4"
      >
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm text-purple-900 mb-1">
              Privacidade e Conformidade GDPR
            </h4>
            <p className="text-xs text-purple-700">
              Todos os dados genéticos são armazenados de forma criptografada e
              anónima. Consentimento informado obrigatório. Conformidade total com
              GDPR e regulamentos de dados de saúde.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Athletes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-slate-900">Perfis Genéticos</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm hover:from-purple-400 hover:to-pink-400 transition-all w-full sm:w-auto"
          >
            + Novo Perfil
          </motion.button>
        </div>

        <div className="space-y-3">
          {athletes.map((athlete, index) => (
            <motion.button
              key={athlete.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => setSelectedAthlete(athlete.id)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                selectedAthlete === athlete.id
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 hover:border-sky-300 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h4 className="text-slate-900 mb-1 truncate">{athlete.name}</h4>
                  <p
                    className={`text-sm ${
                      athlete.status === 'Perfil completo'
                        ? 'text-emerald-600'
                        : athlete.status === 'Análise pendente'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {athlete.status}
                  </p>
                </div>
                {athlete.genes && (
                  <div className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs shrink-0 w-fit">
                    Perfil ativo
                  </div>
                )}
              </div>

              {athlete.genes && (
                <div className="space-y-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                      ACTN3: {athlete.genes.actn3}
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                      ACE: {athlete.genes.ace}
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                      PPARA: {athlete.genes.ppara}
                    </span>
                  </div>
                </div>
              )}

              {athlete.recommendations.length > 0 && (
                <div className="space-y-1">
                  {athlete.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-600"
                    >
                      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Genetic Markers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Marcadores Genéticos</h3>

        <div className="space-y-4">
          {markers.map((marker, index) => (
            <motion.div
              key={marker.gene}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h4 className="text-sm text-slate-900 mb-1">
                    {marker.gene} - {marker.name}
                  </h4>
                  <p className="text-xs text-slate-600">{marker.trait}</p>
                </div>
                <div className="text-2xl shrink-0">🧬</div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {marker.variants.map((variant) => (
                  <span
                    key={variant}
                    className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
      >
        <h3 className="text-slate-900 mb-4">Recursos e Documentação</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all text-left"
          >
            <FileText className="h-5 w-5 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-slate-900 truncate">Guia de Interpretação</p>
              <p className="text-xs text-slate-600">Como ler resultados</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all text-left"
          >
            <Shield className="h-5 w-5 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-slate-900 truncate">Consentimento GDPR</p>
              <p className="text-xs text-slate-600">Templates legais</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}