/**
 * SPRINT 0: Mock Data for Metrics System
 * Complete mock data for development WITHOUT Supabase
 * 
 * USAGE: Import and use in components
 * REPLACE: When connecting Supabase, replace with real queries
 */

import type {
  Metric,
  MetricUpdate,
  MetricPack,
  MetricPackActivation,
  MetricBaseline,
  MetricCategory,
  MetricType,
} from '@/types/metrics';

import type {
  BeliefRule,
  Decision,
  DecisionType,
  DecisionPriority,
  RuleOperator,
} from '@/types/decisions';

import type { SessionTemplate, SessionInstance } from '@/types/session';

// ============================================
// MOCK METRICS
// ============================================

export const mockMetrics: Metric[] = [
  // READINESS
  {
    id: 'metric-hrv',
    workspaceId: 'workspace-1',
    name: 'HRV (Heart Rate Variability)',
    description: 'Variabilidade da frequência cardíaca - indicador de recovery',
    type: 'scale',
    category: 'readiness',
    unit: 'ms',
    updateFrequency: 'daily',
    tags: ['dashboard', 'critical', 'recovery'],
    scaleMin: 0,
    scaleMax: 150,
    aggregationMethod: 'max', // Higher is better
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-rhr',
    workspaceId: 'workspace-1',
    name: 'RHR (Resting Heart Rate)',
    description: 'Frequência cardíaca em repouso',
    type: 'scale',
    category: 'readiness',
    unit: 'bpm',
    updateFrequency: 'daily',
    tags: ['dashboard', 'recovery'],
    scaleMin: 30,
    scaleMax: 100,
    aggregationMethod: 'min', // Lower is better
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-sleep-quality',
    workspaceId: 'workspace-1',
    name: 'Sleep Quality',
    description: 'Qualidade do sono (auto-reportado)',
    type: 'scale',
    category: 'wellness',
    updateFrequency: 'daily',
    tags: ['dashboard', 'wellness'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'average',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-sleep-hours',
    workspaceId: 'workspace-1',
    name: 'Sleep Duration',
    description: 'Horas de sono',
    type: 'duration',
    category: 'wellness',
    unit: 'hours',
    updateFrequency: 'daily',
    tags: ['wellness'],
    aggregationMethod: 'latest',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // LOAD
  {
    id: 'metric-session-rpe',
    workspaceId: 'workspace-1',
    name: 'Session RPE',
    description: 'Perceived exertion da sessão (Borg Scale)',
    type: 'scale',
    category: 'load',
    updateFrequency: 'per-session',
    tags: ['critical', 'load'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'max', // Worst case
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-training-load',
    workspaceId: 'workspace-1',
    name: 'Training Load',
    description: 'RPE × Duração',
    type: 'count',
    category: 'load',
    unit: 'AU',
    updateFrequency: 'per-session',
    tags: ['dashboard', 'critical', 'load'],
    aggregationMethod: 'sum', // Total daily load
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-distance',
    workspaceId: 'workspace-1',
    name: 'Distance Covered',
    description: 'Distância total percorrida',
    type: 'distance',
    category: 'performance',
    unit: 'km',
    updateFrequency: 'per-session',
    tags: ['performance'],
    aggregationMethod: 'sum',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // WELLNESS
  {
    id: 'metric-fatigue',
    workspaceId: 'workspace-1',
    name: 'Fatigue Level',
    description: 'Nível de fadiga percebido',
    type: 'scale',
    category: 'wellness',
    updateFrequency: 'daily',
    tags: ['dashboard', 'wellness'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'max',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-muscle-soreness',
    workspaceId: 'workspace-1',
    name: 'Muscle Soreness',
    description: 'Dor muscular',
    type: 'scale',
    category: 'wellness',
    updateFrequency: 'daily',
    tags: ['wellness'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'max',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-stress',
    workspaceId: 'workspace-1',
    name: 'Stress Level',
    description: 'Nível de stress percebido',
    type: 'scale',
    category: 'psychological',
    updateFrequency: 'daily',
    tags: ['psychological'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'max',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-mood',
    workspaceId: 'workspace-1',
    name: 'Mood Score',
    description: 'Estado de humor',
    type: 'scale',
    category: 'psychological',
    updateFrequency: 'daily',
    tags: ['psychological'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'average',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // READINESS
  {
    id: 'metric-readiness',
    workspaceId: 'workspace-1',
    name: 'Readiness to Train',
    description: 'Prontidão para treinar',
    type: 'scale',
    category: 'readiness',
    updateFrequency: 'daily',
    tags: ['dashboard', 'critical', 'readiness'],
    scaleMin: 1,
    scaleMax: 10,
    aggregationMethod: 'latest',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // PERFORMANCE
  {
    id: 'metric-sprint-speed',
    workspaceId: 'workspace-1',
    name: 'Max Sprint Speed',
    description: 'Velocidade máxima de sprint',
    type: 'scale',
    category: 'performance',
    unit: 'km/h',
    updateFrequency: 'per-session',
    tags: ['performance'],
    scaleMin: 0,
    scaleMax: 40,
    aggregationMethod: 'max',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'metric-jump-height',
    workspaceId: 'workspace-1',
    name: 'Jump Height (CMJ)',
    description: 'Altura de salto vertical',
    type: 'scale',
    category: 'performance',
    unit: 'cm',
    updateFrequency: 'weekly',
    tags: ['performance'],
    scaleMin: 0,
    scaleMax: 80,
    aggregationMethod: 'max',
    baselineMethod: 'rolling-average',
    baselinePeriodDays: 56, // 8 weeks
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // CUSTOM
  {
    id: 'metric-hydration',
    workspaceId: 'workspace-1',
    name: 'Hydration Status',
    description: 'Estado de hidratação',
    type: 'boolean',
    category: 'wellness',
    updateFrequency: 'daily',
    tags: ['wellness'],
    aggregationMethod: 'latest',
    baselineMethod: 'manual',
    baselinePeriodDays: 28,
    isActive: true,
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// MOCK METRIC UPDATES (Time Series Data)
// ============================================

export const mockMetricUpdates: MetricUpdate[] = generateMockUpdates();

function generateMockUpdates(): MetricUpdate[] {
  const updates: MetricUpdate[] = [];
  const athletes = ['athlete-1', 'athlete-2', 'athlete-3'];
  const days = 30;
  
  mockMetrics.forEach(metric => {
    athletes.forEach(athleteId => {
      // Generate time series for last 30 days
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(8, 0, 0, 0);
        
        const value = generateRealisticValue(metric, i);
        
        updates.push({
          id: `update-${metric.id}-${athleteId}-${i}`,
          metricId: metric.id,
          athleteId,
          valueNumeric: metric.type !== 'boolean' && metric.type !== 'text' ? value : undefined,
          valueBoolean: metric.type === 'boolean' ? value > 0.5 : undefined,
          valueText: metric.type === 'text' ? `Value ${value}` : undefined,
          sourceType: i % 7 === 0 ? 'live_session' : 'manual_entry',
          sourcePriority: i % 7 === 0 ? 7 : 10,
          timestamp: date.toISOString(),
          isValid: true,
          createdBy: 'user-1',
          createdAt: date.toISOString(),
        });
      }
    });
  });
  
  return updates;
}

function generateRealisticValue(metric: Metric, dayIndex: number): number {
  // Base value based on metric
  let base = 70;
  let variance = 10;
  
  if (metric.scaleMin !== undefined && metric.scaleMax !== undefined) {
    base = (metric.scaleMin + metric.scaleMax) / 2;
    variance = (metric.scaleMax - metric.scaleMin) / 10;
  }
  
  // Add weekly pattern (sine wave)
  const weeklyPattern = Math.sin(dayIndex / 7 * Math.PI) * variance * 0.3;
  
  // Add random noise
  const noise = (Math.random() - 0.5) * variance;
  
  // Add trend (slightly improving over time)
  const trend = -dayIndex * 0.1;
  
  const value = base + weeklyPattern + noise + trend;
  
  // Clamp to scale
  if (metric.scaleMin !== undefined && metric.scaleMax !== undefined) {
    return Math.max(metric.scaleMin, Math.min(metric.scaleMax, value));
  }
  
  return value;
}

// ============================================
// MOCK METRIC PACKS
// ============================================

export const mockMetricPacks: MetricPack[] = [
  {
    id: 'pack-recovery',
    name: 'Recovery Pack',
    description: '5 métricas essenciais de recuperação e prontidão',
    category: 'wellness',
    isGlobal: true,
    icon: '🔋',
    color: 'emerald',
    isActive: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pack-load',
    name: 'Load Monitoring Pack',
    description: '4 métricas de carga de treino',
    category: 'load',
    isGlobal: true,
    icon: '📊',
    color: 'sky',
    isActive: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pack-readiness',
    name: 'Readiness Pack',
    description: '6 métricas de prontidão para competição',
    category: 'readiness',
    isGlobal: true,
    icon: '⚡',
    color: 'amber',
    isActive: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pack-psychological',
    name: 'Psychological Pack',
    description: '4 métricas de bem-estar psicológico',
    category: 'psychological',
    isGlobal: true,
    icon: '🧠',
    color: 'violet',
    isActive: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pack-performance',
    name: 'Performance Pack',
    description: '5 métricas de performance física',
    category: 'performance',
    isGlobal: true,
    icon: '🏃',
    color: 'red',
    isActive: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// MOCK PACK ACTIVATIONS
// ============================================

export const mockPackActivations: MetricPackActivation[] = [
  {
    id: 'activation-1',
    packId: 'pack-recovery',
    workspaceId: 'workspace-1',
    isActive: true,
    activatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'activation-2',
    packId: 'pack-load',
    workspaceId: 'workspace-1',
    isActive: true,
    activatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'activation-3',
    packId: 'pack-psychological',
    workspaceId: 'workspace-1',
    isActive: false,
    activatedAt: '2024-01-15T00:00:00Z',
    deactivatedAt: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

// ============================================
// MOCK BASELINES
// ============================================

export const mockBaselines: MetricBaseline[] = mockMetrics.map(metric => ({
  metricId: metric.id,
  athleteId: 'athlete-1',
  baselineAvg: metric.scaleMin && metric.scaleMax 
    ? (metric.scaleMin + metric.scaleMax) / 2 
    : 70,
  baselineMedian: metric.scaleMin && metric.scaleMax 
    ? (metric.scaleMin + metric.scaleMax) / 2 
    : 70,
  baselineStddev: 5,
  baselineMin: metric.scaleMin || 50,
  baselineMax: metric.scaleMax || 90,
  sampleSize: 28,
  lastUpdated: new Date().toISOString(),
}));

// ============================================
// MOCK RULES
// ============================================

export const mockRules: BeliefRule[] = [
  {
    id: 'rule-hrv-low',
    workspaceId: 'workspace-1',
    name: 'HRV Critically Low',
    description: 'Alerta quando HRV está muito abaixo da baseline',
    conditions: [
      {
        metricId: 'metric-hrv',
        operator: 'below-baseline',
        value: 20, // 20% below baseline
        absoluteValue: 50, // Fallback if no baseline
        connector: null,
      },
    ],
    decisionType: 'review_athlete',
    decisionTemplate: 'HRV do atleta está {{metric-hrv}}% abaixo da baseline. Considerar reduzir carga.',
    priority: 180, // Critical
    cooldownHours: 24,
    isActive: true,
    triggerCount: 5,
    lastTriggered: '2024-12-28T08:00:00Z',
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-28T08:00:00Z',
  },
  {
    id: 'rule-load-high',
    workspaceId: 'workspace-1',
    name: 'Training Load Excessive',
    description: 'Carga de treino muito acima do normal',
    conditions: [
      {
        metricId: 'metric-training-load',
        operator: 'above-baseline',
        value: 30, // 30% above baseline
        absoluteValue: 500,
        connector: null,
      },
    ],
    decisionType: 'modify_load',
    decisionTemplate: 'Carga de treino {{metric-training-load}} AU está acima do normal. Reduzir volume.',
    priority: 150,
    cooldownHours: 48,
    isActive: true,
    triggerCount: 3,
    lastTriggered: '2024-12-25T08:00:00Z',
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-25T08:00:00Z',
  },
  {
    id: 'rule-poor-sleep',
    workspaceId: 'workspace-1',
    name: 'Poor Sleep Quality',
    description: 'Qualidade de sono consistentemente baixa',
    conditions: [
      {
        metricId: 'metric-sleep-quality',
        operator: 'less-than',
        value: 5,
        connector: 'AND',
      },
      {
        metricId: 'metric-sleep-hours',
        operator: 'less-than',
        value: 7,
        connector: null,
      },
    ],
    decisionType: 'review_athlete',
    decisionTemplate: 'Atleta com sono de baixa qualidade ({{metric-sleep-quality}}/10) e pouca duração ({{metric-sleep-hours}}h).',
    priority: 120,
    cooldownHours: 24,
    isActive: true,
    triggerCount: 8,
    lastTriggered: '2024-12-29T08:00:00Z',
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-29T08:00:00Z',
  },
  {
    id: 'rule-high-fatigue',
    workspaceId: 'workspace-1',
    name: 'High Fatigue Alert',
    description: 'Fadiga elevada persistente',
    conditions: [
      {
        metricId: 'metric-fatigue',
        operator: 'greater-than',
        value: 7,
        connector: null,
      },
    ],
    decisionType: 'rest',
    decisionTemplate: 'Fadiga elevada ({{metric-fatigue}}/10). Considerar dia de descanso.',
    priority: 140,
    cooldownHours: 24,
    isActive: true,
    triggerCount: 4,
    lastTriggered: '2024-12-27T08:00:00Z',
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-27T08:00:00Z',
  },
  {
    id: 'rule-excellent-readiness',
    workspaceId: 'workspace-1',
    name: 'Excellent Readiness',
    description: 'Atleta em excelente estado - oportunidade para intensificar',
    conditions: [
      {
        metricId: 'metric-hrv',
        operator: 'above-baseline',
        value: 10,
        absoluteValue: 80,
        connector: 'AND',
      },
      {
        metricId: 'metric-readiness',
        operator: 'greater-than',
        value: 8,
        connector: null,
      },
    ],
    decisionType: 'celebrate',
    decisionTemplate: 'Atleta em excelente estado! HRV {{metric-hrv}}ms, Readiness {{metric-readiness}}/10.',
    priority: 50,
    cooldownHours: 72,
    isActive: true,
    triggerCount: 2,
    lastTriggered: '2024-12-20T08:00:00Z',
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-20T08:00:00Z',
  },
];

// ============================================
// MOCK DECISIONS
// ============================================

export const mockDecisions: Decision[] = [
  {
    id: 'decision-1',
    workspaceId: 'workspace-1',
    athleteId: 'athlete-1',
    type: 'review_athlete',
    title: 'HRV Crítico - João Silva',
    description: 'HRV está 25% abaixo da baseline (52 vs 70). Considerar reduzir carga de treino.',
    priority: 'critical',
    ruleId: 'rule-hrv-low',
    triggeringMetrics: [
      {
        metricId: 'metric-hrv',
        metricName: 'HRV',
        currentValue: 52,
        threshold: 56,
        baseline: 70,
        operator: 'below-baseline',
        percentFromBaseline: -25.7,
      },
    ],
    status: 'pending',
    createdBy: 'system',
    createdAt: '2024-12-30T08:00:00Z',
    updatedAt: '2024-12-30T08:00:00Z',
  },
  {
    id: 'decision-2',
    workspaceId: 'workspace-1',
    athleteId: 'athlete-2',
    type: 'modify_load',
    title: 'Carga Excessiva - Maria Santos',
    description: 'Carga de treino 35% acima do normal (675 vs 500 AU).',
    priority: 'high',
    ruleId: 'rule-load-high',
    triggeringMetrics: [
      {
        metricId: 'metric-training-load',
        metricName: 'Training Load',
        currentValue: 675,
        threshold: 650,
        baseline: 500,
        operator: 'above-baseline',
        percentFromBaseline: 35,
      },
    ],
    status: 'pending',
    createdBy: 'system',
    createdAt: '2024-12-30T06:00:00Z',
    updatedAt: '2024-12-30T06:00:00Z',
  },
  {
    id: 'decision-3',
    workspaceId: 'workspace-1',
    athleteId: 'athlete-1',
    type: 'review_athlete',
    title: 'Sono Inadequado - João Silva',
    description: 'Qualidade de sono baixa (4/10) e duração insuficiente (5.5h).',
    priority: 'medium',
    ruleId: 'rule-poor-sleep',
    status: 'accepted',
    actionedBy: 'user-1',
    actionedAt: '2024-12-29T10:00:00Z',
    actionNotes: 'Conversei com o atleta, vai ajustar rotina de sono.',
    createdBy: 'system',
    createdAt: '2024-12-29T08:00:00Z',
    updatedAt: '2024-12-29T10:00:00Z',
  },
  {
    id: 'decision-4',
    workspaceId: 'workspace-1',
    athleteId: 'athlete-3',
    type: 'rest',
    title: 'Fadiga Elevada - Pedro Costa',
    description: 'Fadiga persistente (8/10). Recomendar descanso.',
    priority: 'high',
    ruleId: 'rule-high-fatigue',
    status: 'rejected',
    actionedBy: 'user-1',
    actionedAt: '2024-12-27T14:00:00Z',
    actionNotes: 'Atleta insistiu em treinar, monitorar de perto.',
    createdBy: 'system',
    createdAt: '2024-12-27T08:00:00Z',
    updatedAt: '2024-12-27T14:00:00Z',
  },
  {
    id: 'decision-5',
    workspaceId: 'workspace-1',
    athleteId: 'athlete-2',
    type: 'celebrate',
    title: 'Estado Excelente - Maria Santos',
    description: 'HRV 88ms (+12% vs baseline), Readiness 9/10. Oportunidade para treino intenso!',
    priority: 'low',
    ruleId: 'rule-excellent-readiness',
    status: 'accepted',
    actionedBy: 'user-1',
    actionedAt: '2024-12-20T09:00:00Z',
    actionNotes: 'Aproveitamos para fazer sessão de alta intensidade.',
    createdBy: 'system',
    createdAt: '2024-12-20T08:00:00Z',
    updatedAt: '2024-12-20T09:00:00Z',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get metric by ID
 */
export function getMockMetric(id: string): Metric | undefined {
  return mockMetrics.find(m => m.id === id);
}

/**
 * Get metrics by category
 */
export function getMockMetricsByCategory(category: MetricCategory): Metric[] {
  return mockMetrics.filter(m => m.category === category);
}

/**
 * Get updates for metric
 */
export function getMockUpdatesForMetric(
  metricId: string,
  athleteId?: string,
  limit?: number
): MetricUpdate[] {
  let updates = mockMetricUpdates.filter(u => u.metricId === metricId);
  
  if (athleteId) {
    updates = updates.filter(u => u.athleteId === athleteId);
  }
  
  // Sort by timestamp DESC
  updates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  if (limit) {
    updates = updates.slice(0, limit);
  }
  
  return updates;
}

/**
 * Get latest update for metric
 */
export function getMockLatestUpdate(
  metricId: string,
  athleteId: string
): MetricUpdate | undefined {
  const updates = getMockUpdatesForMetric(metricId, athleteId, 1);
  return updates[0];
}

/**
 * Get baseline for metric
 */
export function getMockBaseline(
  metricId: string,
  athleteId: string
): MetricBaseline | undefined {
  return mockBaselines.find(
    b => b.metricId === metricId && b.athleteId === athleteId
  );
}

/**
 * Get decisions for athlete
 */
export function getMockDecisionsForAthlete(
  athleteId: string,
  status?: string
): Decision[] {
  let decisions = mockDecisions.filter(d => d.athleteId === athleteId);
  
  if (status) {
    decisions = decisions.filter(d => d.status === status);
  }
  
  return decisions;
}

/**
 * Get active packs for workspace
 */
export function getMockActivePacks(workspaceId: string): MetricPack[] {
  const activeActivations = mockPackActivations.filter(
    a => a.workspaceId === workspaceId && a.isActive
  );
  
  const activePackIds = activeActivations.map(a => a.packId);
  
  return mockMetricPacks.filter(p => activePackIds.includes(p.id));
}

// ============================================
// MOCK SESSION TEMPLATES
// ============================================

export const mockSessionTemplates: SessionTemplate[] = [
  {
    id: 'st-1',
    name: 'Upper Body Strength',
    description: 'Treino de força para membros superiores - focado em press e pull',
    type: 'strength',
    duration: 60,
    exercises: [
      {
        id: 'se-1',
        exerciseId: 'ex-bench-press',
        order: 1,
        sets: 4,
        reps: '8-10',
        load: 80,
        loadUnit: 'kg',
        restBetweenSets: 120,
        tempo: '3-0-1-0',
        rpe: 8,
        notes: 'Manter forma estrita, evitar bounce no peito',
      },
      {
        id: 'se-2',
        exerciseId: 'ex-dumbbell-row',
        order: 2,
        sets: 3,
        reps: '12',
        load: 32,
        loadUnit: 'kg',
        restBetweenSets: 90,
        rpe: 7,
      },
      {
        id: 'se-3',
        exerciseId: 'ex-shoulder-press',
        order: 3,
        sets: 3,
        reps: '10',
        load: 25,
        loadUnit: 'kg',
        restBetweenSets: 90,
        rpe: 8,
      },
      {
        id: 'se-4',
        exerciseId: 'ex-pull-ups',
        order: 4,
        sets: 3,
        reps: 'Max',
        restBetweenSets: 120,
        rpe: 9,
      },
      {
        id: 'se-5',
        exerciseId: 'ex-tricep-dips',
        order: 5,
        sets: 3,
        reps: '12-15',
        restBetweenSets: 60,
        rpe: 7,
      },
      {
        id: 'se-6',
        exerciseId: 'ex-bicep-curl',
        order: 6,
        sets: 3,
        reps: '12',
        load: 15,
        loadUnit: 'kg',
        restBetweenSets: 60,
        rpe: 6,
      },
    ],
    restDefaults: {
      betweenSets: 90,
      betweenExercises: 180,
    },
    forms: ['form-wellness', 'form-rpe'],
    tags: ['strength', 'upper-body', 'hypertrophy'],
    category: 'Strength Training',
    createdBy: 'user-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'st-2',
    name: 'Lower Body Power',
    description: 'Treino de potência para membros inferiores',
    type: 'strength',
    duration: 75,
    exercises: [
      {
        id: 'se-7',
        exerciseId: 'ex-back-squat',
        order: 1,
        sets: 5,
        reps: '5',
        load: 100,
        loadUnit: 'kg',
        restBetweenSets: 180,
        tempo: '2-0-X-0',
        rpe: 9,
      },
      {
        id: 'se-8',
        exerciseId: 'ex-romanian-deadlift',
        order: 2,
        sets: 4,
        reps: '8',
        load: 80,
        loadUnit: 'kg',
        restBetweenSets: 120,
        rpe: 8,
      },
      {
        id: 'se-9',
        exerciseId: 'ex-box-jump',
        order: 3,
        sets: 4,
        reps: '5',
        restBetweenSets: 120,
        rpe: 8,
        notes: 'Altura da box: 60cm',
      },
      {
        id: 'se-10',
        exerciseId: 'ex-walking-lunge',
        order: 4,
        sets: 3,
        reps: '20',
        load: 20,
        loadUnit: 'kg',
        restBetweenSets: 90,
        rpe: 7,
      },
    ],
    restDefaults: {
      betweenSets: 120,
      betweenExercises: 180,
    },
    forms: ['form-rpe'],
    tags: ['strength', 'lower-body', 'power'],
    category: 'Strength Training',
    createdBy: 'user-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'st-3',
    name: 'HIIT Cardio',
    description: 'High Intensity Interval Training - queima de calorias',
    type: 'cardio',
    duration: 30,
    exercises: [
      {
        id: 'se-11',
        exerciseId: 'ex-burpees',
        order: 1,
        sets: 5,
        reps: '30s',
        restBetweenSets: 30,
        rpe: 9,
      },
      {
        id: 'se-12',
        exerciseId: 'ex-mountain-climbers',
        order: 2,
        sets: 5,
        reps: '30s',
        restBetweenSets: 30,
        rpe: 8,
      },
      {
        id: 'se-13',
        exerciseId: 'ex-jump-rope',
        order: 3,
        sets: 5,
        reps: '60s',
        restBetweenSets: 30,
        rpe: 8,
      },
      {
        id: 'se-14',
        exerciseId: 'ex-high-knees',
        order: 4,
        sets: 5,
        reps: '30s',
        restBetweenSets: 30,
        rpe: 9,
      },
    ],
    restDefaults: {
      betweenSets: 30,
      betweenExercises: 60,
    },
    forms: ['form-wellness', 'form-rpe'],
    tags: ['cardio', 'hiit', 'fat-loss'],
    category: 'Cardio',
    createdBy: 'user-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'st-4',
    name: 'Olympic Lifting',
    description: 'Técnica e potência - levantamentos olímpicos',
    type: 'skill',
    duration: 90,
    exercises: [
      {
        id: 'se-15',
        exerciseId: 'ex-clean-and-jerk',
        order: 1,
        sets: 5,
        reps: '3',
        load: 70,
        loadUnit: 'kg',
        restBetweenSets: 180,
        rpe: 8,
        notes: 'Focar na técnica, não na carga',
      },
      {
        id: 'se-16',
        exerciseId: 'ex-snatch',
        order: 2,
        sets: 5,
        reps: '3',
        load: 50,
        loadUnit: 'kg',
        restBetweenSets: 180,
        rpe: 8,
      },
      {
        id: 'se-17',
        exerciseId: 'ex-front-squat',
        order: 3,
        sets: 4,
        reps: '5',
        load: 80,
        loadUnit: 'kg',
        restBetweenSets: 150,
        rpe: 8,
      },
    ],
    restDefaults: {
      betweenSets: 180,
      betweenExercises: 240,
    },
    forms: ['form-technique-check'],
    tags: ['olympic', 'technique', 'power'],
    category: 'Olympic Lifting',
    createdBy: 'user-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'st-5',
    name: 'Recovery & Mobility',
    description: 'Sessão de recuperação ativa e mobilidade',
    type: 'recovery',
    duration: 45,
    exercises: [
      {
        id: 'se-18',
        exerciseId: 'ex-foam-rolling',
        order: 1,
        sets: 1,
        reps: '10min',
        restBetweenSets: 0,
        notes: 'Focar em áreas tensas',
      },
      {
        id: 'se-19',
        exerciseId: 'ex-yoga-flow',
        order: 2,
        sets: 3,
        reps: '5min',
        restBetweenSets: 60,
        rpe: 3,
      },
      {
        id: 'se-20',
        exerciseId: 'ex-stretching',
        order: 3,
        sets: 1,
        reps: '15min',
        restBetweenSets: 0,
        notes: 'Alongamento estático',
      },
    ],
    restDefaults: {
      betweenSets: 30,
      betweenExercises: 60,
    },
    forms: ['form-recovery-check'],
    tags: ['recovery', 'mobility', 'flexibility'],
    category: 'Recovery',
    createdBy: 'user-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

// ============================================
// MOCK SESSION INSTANCES
// ============================================

export const mockSessionInstances: SessionInstance[] = [
  {
    id: 'si-1',
    templateId: 'st-1',
    athleteId: 'athlete-1',
    coachId: 'user-1',
    status: 'completed',
    scheduledDate: new Date('2024-12-30T14:00:00'),
    startedAt: new Date('2024-12-30T14:05:00'),
    completedAt: new Date('2024-12-30T15:20:00'),
    duration: 4500, // 75 minutes in seconds
    exercises: [
      {
        id: 'ei-1',
        exerciseId: 'ex-bench-press',
        order: 1,
        status: 'completed',
        plannedSets: 4,
        plannedReps: '8-10',
        plannedLoad: 80,
        plannedLoadUnit: 'kg',
        plannedRpe: 8,
        actualSets: [
          {
            id: 'set-1',
            setNumber: 1,
            status: 'completed',
            plannedReps: 10,
            actualReps: 10,
            plannedLoad: 80,
            actualLoad: 80,
            rpe: 7,
            restAfter: 120,
            startedAt: new Date('2024-12-30T14:10:00'),
            completedAt: new Date('2024-12-30T14:11:00'),
          },
          {
            id: 'set-2',
            setNumber: 2,
            status: 'completed',
            plannedReps: 10,
            actualReps: 10,
            plannedLoad: 80,
            actualLoad: 80,
            rpe: 8,
            restAfter: 120,
            startedAt: new Date('2024-12-30T14:13:00'),
            completedAt: new Date('2024-12-30T14:14:00'),
          },
          {
            id: 'set-3',
            setNumber: 3,
            status: 'completed',
            plannedReps: 10,
            actualReps: 9,
            plannedLoad: 80,
            actualLoad: 80,
            rpe: 9,
            restAfter: 120,
            startedAt: new Date('2024-12-30T14:16:00'),
            completedAt: new Date('2024-12-30T14:17:00'),
          },
          {
            id: 'set-4',
            setNumber: 4,
            status: 'completed',
            plannedReps: 10,
            actualReps: 8,
            plannedLoad: 80,
            actualLoad: 80,
            rpe: 9,
            restAfter: 180,
            startedAt: new Date('2024-12-30T14:19:00'),
            completedAt: new Date('2024-12-30T14:20:00'),
            notes: 'Última série difícil, ficou próximo da falha',
          },
        ],
        startedAt: new Date('2024-12-30T14:10:00'),
        completedAt: new Date('2024-12-30T14:23:00'),
        duration: 780,
      },
      // More exercises would follow...
    ],
    feedback: {
      athleteRating: 5,
      athleteNotes: 'Excelente treino! Senti-me forte hoje.',
      athleteRpe: 8,
      energy: 8,
      motivation: 9,
    },
    location: 'Ginásio Principal',
    createdAt: new Date('2024-12-30T14:00:00'),
    updatedAt: new Date('2024-12-30T15:20:00'),
  },
  {
    id: 'si-2',
    templateId: 'st-2',
    athleteId: 'athlete-2',
    coachId: 'user-1',
    status: 'in_progress',
    scheduledDate: new Date('2024-12-31T10:00:00'),
    startedAt: new Date('2024-12-31T10:05:00'),
    exercises: [
      {
        id: 'ei-2',
        exerciseId: 'ex-back-squat',
        order: 1,
        status: 'in_progress',
        plannedSets: 5,
        plannedReps: '5',
        plannedLoad: 100,
        plannedLoadUnit: 'kg',
        plannedRpe: 9,
        actualSets: [
          {
            id: 'set-5',
            setNumber: 1,
            status: 'completed',
            plannedReps: 5,
            actualReps: 5,
            plannedLoad: 100,
            actualLoad: 100,
            rpe: 8,
            restAfter: 180,
            startedAt: new Date('2024-12-31T10:08:00'),
            completedAt: new Date('2024-12-31T10:09:00'),
          },
          {
            id: 'set-6',
            setNumber: 2,
            status: 'in_progress',
            plannedReps: 5,
            plannedLoad: 100,
          },
        ],
        startedAt: new Date('2024-12-31T10:08:00'),
      },
    ],
    location: 'Ginásio B',
    createdAt: new Date('2024-12-31T10:00:00'),
    updatedAt: new Date('2024-12-31T10:15:00'),
  },
];

// ============================================
// HELPER FUNCTIONS - SESSIONS
// ============================================

/**
 * Get session template by ID
 */
export function getMockSessionTemplate(id: string): SessionTemplate | undefined {
  return mockSessionTemplates.find(t => t.id === id);
}

/**
 * Get session instances for athlete
 */
export function getMockSessionsForAthlete(
  athleteId: string,
  status?: string
): SessionInstance[] {
  let sessions = mockSessionInstances.filter(s => s.athleteId === athleteId);
  
  if (status) {
    sessions = sessions.filter(s => s.status === status);
  }
  
  return sessions;
}

/**
 * Get active session for athlete
 */
export function getMockActiveSession(athleteId: string): SessionInstance | undefined {
  return mockSessionInstances.find(
    s => s.athleteId === athleteId && (s.status === 'in_progress' || s.status === 'paused')
  );
}