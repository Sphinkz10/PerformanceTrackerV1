import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Moon, Activity, Zap, Brain, Shield, 
  Check, Plus, FileText, BarChart3, Lightbulb,
  TrendingUp, Calendar, Users, Target, AlertCircle
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface MetricDetail {
  name: string;
  fullName: string;
  description: string;
  type: 'numeric' | 'scale';
  unit: string;
  updateFrequency: string;
  normalRange?: string;
  interpretation?: {
    higherIsBetter: boolean;
    zones: {
      green: { description: string };
      yellow: { description: string };
      red: { description: string };
    };
  };
}

interface FormSuggestion {
  name: string;
  description: string;
  fields: Array<{
    name: string;
    type: string;
    hint?: string;
  }>;
  frequency: string;
  target: string;
}

interface ReportTemplate {
  name: string;
  description: string;
  sections: Array<{
    title: string;
    description: string;
  }>;
}

interface DecisionRule {
  name: string;
  condition: string;
  action: string;
  severity: 'low' | 'medium' | 'high';
}

interface PackDetail {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  description: string;
  longDescription: string;
  targetUsers: string;
  updateFrequency: string;
  metrics: MetricDetail[];
  formSuggestion?: FormSuggestion;
  reportTemplate?: ReportTemplate;
  decisionRules?: DecisionRule[];
}

interface PackDetailModalProps {
  packId: string | null;
  open: boolean;
  onClose: () => void;
  onActivate: (packId: string) => void;
  isActivated: boolean;
}

// ============================================================
// MOCK DATA - PACK DETAILS
// ============================================================

const PACK_DETAILS: Record<string, PackDetail> = {
  'recovery-pack': {
    id: 'recovery-pack',
    name: 'Recovery Pack',
    category: 'recovery',
    icon: Moon,
    color: 'emerald',
    description: 'Monitoriza recuperação física e qualidade de sono para otimizar performance.',
    longDescription: 'O Recovery Pack é essencial para todos os coaches que querem monitorizar a recuperação dos seus atletas. Inclui métricas fisiológicas (HRV, RHR) e subjetivas (sono, dor muscular) que trabalham em conjunto para dar uma visão completa do estado de recuperação.',
    targetUsers: 'Todos os coaches',
    updateFrequency: 'Diário (idealmente de manhã)',
    metrics: [
      {
        name: 'HRV',
        fullName: 'Heart Rate Variability',
        description: 'Variabilidade da frequência cardíaca medida em ms. Indicador de stress do sistema nervoso.',
        type: 'numeric',
        unit: 'ms',
        updateFrequency: 'Diário',
        normalRange: '40-100ms (varia por indivíduo)',
        interpretation: {
          higherIsBetter: true,
          zones: {
            green: { description: 'HRV normal ou acima da baseline - boa recuperação' },
            yellow: { description: 'HRV 10-25% abaixo baseline - recuperação moderada' },
            red: { description: 'HRV >25% abaixo baseline - stress elevado, má recuperação' },
          },
        },
      },
      {
        name: 'RHR',
        fullName: 'Resting Heart Rate',
        description: 'Frequência cardíaca em repouso medida ao acordar. Indicador de fadiga e recuperação.',
        type: 'numeric',
        unit: 'bpm',
        updateFrequency: 'Diário',
        normalRange: '50-70 bpm (atletas)',
        interpretation: {
          higherIsBetter: false,
          zones: {
            green: { description: 'RHR normal ou abaixo baseline - boa recuperação' },
            yellow: { description: 'RHR 5-10 bpm acima baseline - fadiga moderada' },
            red: { description: 'RHR >10 bpm acima baseline - fadiga elevada' },
          },
        },
      },
      {
        name: 'Sleep Quality',
        fullName: 'Sleep Quality Score',
        description: 'Qualidade de sono reportada pelo atleta numa escala 1-5.',
        type: 'scale',
        unit: '1-5',
        updateFrequency: 'Diário',
        normalRange: '3-5 é bom, 1-2 é mau',
        interpretation: {
          higherIsBetter: true,
          zones: {
            green: { description: '4-5: Sono de boa qualidade' },
            yellow: { description: '3: Sono razoável' },
            red: { description: '1-2: Sono de má qualidade' },
          },
        },
      },
      {
        name: 'Subjective Recovery',
        fullName: 'Subjective Recovery Score',
        description: 'Perceção subjetiva de recuperação numa escala 1-10.',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
        normalRange: '7-10 é bom',
        interpretation: {
          higherIsBetter: true,
          zones: {
            green: { description: '7-10: Bem recuperado' },
            yellow: { description: '4-6: Recuperação moderada' },
            red: { description: '1-3: Mal recuperado' },
          },
        },
      },
      {
        name: 'Muscle Soreness',
        fullName: 'Muscle Soreness Level',
        description: 'Nível de dor muscular reportado numa escala 1-5.',
        type: 'scale',
        unit: '1-5',
        updateFrequency: 'Diário',
        normalRange: '1-2 normal, 3-4 após treino intenso',
        interpretation: {
          higherIsBetter: false,
          zones: {
            green: { description: '1-2: Sem dor ou dor leve' },
            yellow: { description: '3: Dor moderada' },
            red: { description: '4-5: Dor severa' },
          },
        },
      },
    ],
    formSuggestion: {
      name: 'Daily Recovery Check',
      description: 'Form matinal para atletas reportarem métricas de recuperação',
      fields: [
        { name: 'HRV', type: 'numeric', hint: 'ms' },
        { name: 'RHR', type: 'numeric', hint: 'bpm' },
        { name: 'Sleep Quality', type: 'radio', hint: '1-5' },
        { name: 'Subjective Recovery', type: 'slider', hint: '1-10' },
        { name: 'Muscle Soreness', type: 'radio', hint: '1-5' },
      ],
      frequency: 'Daily (morning)',
      target: 'All athletes',
    },
    reportTemplate: {
      name: 'Recovery Report',
      description: 'Análise completa do estado de recuperação da equipa',
      sections: [
        { title: 'HRV Timeline', description: 'Evolução do HRV nos últimos 30 dias' },
        { title: 'Sleep Quality Trend', description: 'Tendência de qualidade de sono' },
        { title: 'Recovery Score', description: 'Score global de recuperação (média normalizada)' },
        { title: 'Athletes at Risk', description: 'Atletas com métricas na zona vermelha' },
      ],
    },
    decisionRules: [
      {
        name: 'Low Recovery Alert',
        condition: 'HRV < baseline -15% AND Sleep Quality < 3',
        action: 'Reduzir carga de treino',
        severity: 'medium',
      },
      {
        name: 'Overtraining Risk',
        condition: 'Subjective Recovery < 4 for 3 days AND RHR > baseline +10%',
        action: 'Descanso obrigatório',
        severity: 'high',
      },
      {
        name: 'High Soreness',
        condition: 'Muscle Soreness > 4',
        action: 'Sessão de recovery (stretching, foam rolling)',
        severity: 'low',
      },
    ],
  },
  
  'load-fatigue-pack': {
    id: 'load-fatigue-pack',
    name: 'Load & Fatigue Pack',
    category: 'load',
    icon: Activity,
    color: 'sky',
    description: 'Monitoriza carga de treino e fadiga acumulada para prevenir overtraining.',
    longDescription: 'Pack avançado para coaches que querem gerir carga de treino de forma científica. Inclui métricas objetivas (volume, intensidade) e calculadas (ACWR, monotonia, strain) que permitem detectar padrões de overtraining antes que aconteçam lesões.',
    targetUsers: 'Coaches intermédios/avançados',
    updateFrequency: 'Por sessão + agregação semanal',
    metrics: [
      {
        name: 'Total Volume',
        fullName: 'Total Training Volume',
        description: 'Volume total de treino (reps × sets × load ou distância total).',
        type: 'numeric',
        unit: 'kg/km',
        updateFrequency: 'Por sessão',
        normalRange: 'Depende do desporto',
      },
      {
        name: 'ACWR',
        fullName: 'Acute:Chronic Workload Ratio',
        description: 'Rácio entre carga aguda (7 dias) e crónica (28 dias). Métrica chave para prevenção de lesões.',
        type: 'numeric',
        unit: 'ratio',
        updateFrequency: 'Calculado automaticamente',
        normalRange: '0.8-1.3 é seguro',
        interpretation: {
          higherIsBetter: false,
          zones: {
            green: { description: '0.8-1.3: Sweet spot - carga adequada' },
            yellow: { description: '1.3-1.5 ou 0.5-0.8: Moderado risco' },
            red: { description: '>1.5 ou <0.5: Alto risco de lesão' },
          },
        },
      },
      {
        name: 'Training Monotony',
        fullName: 'Training Monotony Index',
        description: 'Variabilidade do treino. Alta monotonia = treino muito repetitivo.',
        type: 'numeric',
        unit: 'index',
        updateFrequency: 'Semanal',
        normalRange: '1.5-2.0',
      },
      {
        name: 'Training Strain',
        fullName: 'Training Strain Score',
        description: 'Load semanal × Monotonia. Indicador de risco de overtraining.',
        type: 'numeric',
        unit: 'AU',
        updateFrequency: 'Semanal',
        normalRange: '<6000 é seguro',
      },
      {
        name: 'RPE',
        fullName: 'Rate of Perceived Exertion',
        description: 'Perceção de esforço numa escala 1-10 (Borg CR10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Por sessão',
        normalRange: '6-8 para treino de qualidade',
      },
    ],
    formSuggestion: {
      name: 'Post-Session Load',
      description: 'Form para atletas reportarem carga e esforço pós-treino',
      fields: [
        { name: 'RPE', type: 'slider', hint: '1-10' },
        { name: 'Session Duration', type: 'numeric', hint: 'min' },
        { name: 'High-Intensity Minutes', type: 'numeric', hint: 'min (optional)' },
      ],
      frequency: 'After each session',
      target: 'All athletes',
    },
    reportTemplate: {
      name: 'Load Management Report',
      description: 'Dashboard completo de gestão de carga',
      sections: [
        { title: 'ACWR Trend', description: '30 dias de ACWR com zona de risco' },
        { title: 'Weekly Load vs Baseline', description: 'Comparação da carga semanal' },
        { title: 'Monotony & Strain', description: 'Análise de variabilidade e strain' },
        { title: 'Overtraining Alerts', description: 'Atletas em risco de overtraining' },
      ],
    },
    decisionRules: [
      {
        name: 'ACWR High Risk',
        condition: 'ACWR > 1.5',
        action: 'Risco de lesão elevado - reduzir carga 20%',
        severity: 'high',
      },
      {
        name: 'High Strain',
        condition: 'Training Strain > 8000',
        action: 'Overtraining risk - descanso obrigatório',
        severity: 'high',
      },
    ],
  },
  
  'readiness-pack': {
    id: 'readiness-pack',
    name: 'Readiness Pack',
    category: 'readiness',
    icon: Zap,
    color: 'amber',
    description: 'Avalia prontidão mental e física para treinar/competir.',
    longDescription: 'Pack focado em métricas subjetivas que avaliam se o atleta está pronto para treinar. Ideal para usar antes de sessões importantes ou competições.',
    targetUsers: 'Todos os coaches',
    updateFrequency: 'Diário (idealmente antes de treino)',
    metrics: [
      {
        name: 'Mental Readiness',
        fullName: 'Mental Readiness Score',
        description: 'Prontidão mental para treinar/competir (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
      },
      {
        name: 'Physical Energy',
        fullName: 'Physical Energy Level',
        description: 'Nível de energia física percebida (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
      },
      {
        name: 'Motivation',
        fullName: 'Motivation Level',
        description: 'Nível de motivação para treinar (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
      },
    ],
    formSuggestion: {
      name: 'Pre-Training Readiness',
      description: 'Check rápido de prontidão antes de treinar',
      fields: [
        { name: 'Mental Readiness', type: 'slider', hint: '1-10' },
        { name: 'Physical Energy', type: 'slider', hint: '1-10' },
        { name: 'Motivation', type: 'slider', hint: '1-10' },
      ],
      frequency: 'Daily (before training)',
      target: 'All athletes',
    },
  },
  
  'psychological-pack': {
    id: 'psychological-pack',
    name: 'Psychological Pack',
    category: 'psychological',
    icon: Brain,
    color: 'violet',
    description: 'Monitoriza bem-estar psicológico e saúde mental.',
    longDescription: 'Pack avançado para equipas com psicólogo desportivo. Monitoriza aspectos de saúde mental que impactam performance.',
    targetUsers: 'Coaches avançados, equipas com psicólogo',
    updateFrequency: 'Diário ou semanal',
    metrics: [
      {
        name: 'Overall Mood',
        fullName: 'Overall Mood State',
        description: 'Estado de humor geral diário (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
      },
      {
        name: 'Anxiety Level',
        fullName: 'Anxiety Level',
        description: 'Nível de ansiedade percebida (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
      },
      {
        name: 'Confidence',
        fullName: 'Self-Confidence Level',
        description: 'Nível de confiança/auto-eficácia (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Semanal',
      },
    ],
  },
  
  'injury-risk-pack': {
    id: 'injury-risk-pack',
    name: 'Injury Risk Pack',
    category: 'injury',
    icon: Shield,
    color: 'red',
    description: 'Detecta sinais precoces de lesão e factores de risco.',
    longDescription: 'Pack de prevenção que combina métricas de dor, movimento e historial para prever risco de lesão.',
    targetUsers: 'Todos os coaches',
    updateFrequency: 'Diário/Semanal',
    metrics: [
      {
        name: 'Pain Level',
        fullName: 'Overall Pain Level',
        description: 'Nível de dor geral reportado (1-10).',
        type: 'scale',
        unit: '1-10',
        updateFrequency: 'Diário',
        interpretation: {
          higherIsBetter: false,
          zones: {
            green: { description: '1-3: Sem dor ou desconforto leve' },
            yellow: { description: '4-6: Dor moderada - monitorizar' },
            red: { description: '7-10: Dor severa - intervenção necessária' },
          },
        },
      },
      {
        name: 'Movement Quality',
        fullName: 'Movement Quality Assessment',
        description: 'Qualidade de movimento avaliada (1-5).',
        type: 'scale',
        unit: '1-5',
        updateFrequency: 'Semanal',
      },
    ],
  },
};

// ============================================================
// COLOR CONFIGS
// ============================================================

const colorConfig = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  violet: {
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
  },
};

const severityConfig = {
  low: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle },
  medium: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertCircle },
  high: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const PackDetailModal: React.FC<PackDetailModalProps> = ({
  packId,
  open,
  onClose,
  onActivate,
  isActivated,
}) => {
  const [activeSection, setActiveSection] = useState<'metrics' | 'form' | 'report' | 'decisions'>('metrics');

  if (!open || !packId) return null;

  const pack = PACK_DETAILS[packId];
  if (!pack) return null;

  const colors = colorConfig[pack.color];
  const Icon = pack.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className={`p-6 border-b border-slate-200 ${colors.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-bold text-slate-900">{pack.name}</h2>
                    {isActivated && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                        <Check className="h-3 w-3" />
                        Ativado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{pack.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                      {pack.metrics.length} métricas
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {pack.targetUsers}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pack.updateFrequency}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Long Description */}
            <p className="text-sm text-slate-600 bg-white/50 p-3 rounded-xl">
              {pack.longDescription}
            </p>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 px-6 py-3 border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
            {[
              { id: 'metrics', label: 'Métricas', icon: Target, count: pack.metrics.length },
              { id: 'form', label: 'Form Sugerido', icon: FileText, available: !!pack.formSuggestion },
              { id: 'report', label: 'Report Template', icon: BarChart3, available: !!pack.reportTemplate },
              { id: 'decisions', label: 'Decisões', icon: Lightbulb, count: pack.decisionRules?.length },
            ].map((section) => {
              if (section.available === false) return null;
              
              const SectionIcon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <SectionIcon className="h-4 w-4" />
                  <span>{section.label}</span>
                  {section.count !== undefined && (
                    <span className={`text-xs ${activeSection === section.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {section.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'metrics' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Métricas Incluídas</h3>
                  <span className="text-sm text-slate-500">{pack.metrics.length} métricas</span>
                </div>

                {pack.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{metric.fullName}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {metric.name} · {metric.type === 'numeric' ? 'Numérica' : 'Escala'} · {metric.unit}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${colors.badge} whitespace-nowrap`}>
                        {metric.updateFrequency}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{metric.description}</p>

                    {metric.normalRange && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>Range normal: {metric.normalRange}</span>
                      </div>
                    )}

                    {metric.interpretation && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-700">Interpretação:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              <span className="text-xs font-medium text-emerald-700">Verde</span>
                            </div>
                            <p className="text-xs text-emerald-600">{metric.interpretation.zones.green.description}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span className="text-xs font-medium text-amber-700">Amarelo</span>
                            </div>
                            <p className="text-xs text-amber-600">{metric.interpretation.zones.yellow.description}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span className="text-xs font-medium text-red-700">Vermelho</span>
                            </div>
                            <p className="text-xs text-red-600">{metric.interpretation.zones.red.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {activeSection === 'form' && pack.formSuggestion && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">{pack.formSuggestion.name}</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">{pack.formSuggestion.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-900">{pack.formSuggestion.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-900">{pack.formSuggestion.target}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <p className="text-xs font-medium text-slate-700 mb-3">Fields ({pack.formSuggestion.fields.length}):</p>
                    <div className="space-y-2">
                      {pack.formSuggestion.fields.map((field, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-sm text-slate-900">{field.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{field.type}</span>
                            {field.hint && (
                              <span className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-600">{field.hint}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-blue-100 border border-blue-300">
                    <p className="text-xs text-blue-800">
                      ✨ <strong>Auto-criado:</strong> Este form será automaticamente criado quando ativares o pack, com todos os fields já linked às métricas correspondentes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'report' && pack.reportTemplate && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-purple-900">{pack.reportTemplate.name}</h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-4">{pack.reportTemplate.description}</p>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-purple-900">Sections ({pack.reportTemplate.sections.length}):</p>
                    {pack.reportTemplate.sections.map((section, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-white border border-purple-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">{section.title}</h4>
                        <p className="text-sm text-slate-600">{section.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-purple-100 border border-purple-300">
                    <p className="text-xs text-purple-800">
                      ✨ <strong>Auto-criado:</strong> Este report template será automaticamente criado com visualizações pré-configuradas para estas métricas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'decisions' && pack.decisionRules && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900 mb-1">Regras de Decisão</h3>
                  <p className="text-sm text-slate-600">Decisões automáticas que serão ativadas com este pack</p>
                </div>

                {pack.decisionRules.map((rule, index) => {
                  const severityStyle = severityConfig[rule.severity];
                  const SeverityIcon = severityStyle.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border ${severityStyle.border} ${severityStyle.bg}`}
                    >
                      <div className="flex items-start gap-3">
                        <SeverityIcon className={`h-5 w-5 ${severityStyle.color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900">{rule.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${severityStyle.bg} ${severityStyle.color} border ${severityStyle.border}`}>
                              {rule.severity === 'low' ? 'Baixa' : rule.severity === 'medium' ? 'Média' : 'Alta'} severidade
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-slate-700 mb-1">SE:</p>
                              <p className="text-sm text-slate-600 bg-white/50 p-2 rounded font-mono">{rule.condition}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-700 mb-1">ENTÃO:</p>
                              <p className="text-sm font-medium text-slate-900 bg-white p-2 rounded">{rule.action}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <p className="text-sm text-sky-800">
                    💡 <strong>Nota:</strong> Estas decisões serão automaticamente configuradas no Decision Engine quando ativares o pack. Podes editá-las ou desativá-las depois.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500 flex-1">
              {isActivated 
                ? '✅ Este pack já está ativado. Podes desativá-lo na gestão de packs.'
                : '💡 Ativar este pack irá criar todas as métricas, form sugerido e report template automaticamente.'
              }
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Fechar
              </button>
              
              {!isActivated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onActivate(pack.id);
                    onClose();
                  }}
                  className={`flex items-center gap-2 px-6 py-2 text-sm rounded-xl bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:shadow-lg transition-all`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Ativar Pack</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PackDetailModal;
