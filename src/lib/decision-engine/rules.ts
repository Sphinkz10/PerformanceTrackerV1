/**
 * Decision Engine - Hard-coded Rules
 * 
 * FASE 8 DAY 2: Core decision-making rules
 * 
 * These 5 rules form the foundation of our automated decision engine.
 * Each rule evaluates athlete metrics and generates actionable recommendations.
 * 
 * Design Philosophy:
 * - Evidence-based thresholds (sports science research)
 * - Conservative approach (prioritize athlete safety)
 * - Clear explanations (coaches must understand WHY)
 * - Configurable cooldowns (prevent spam)
 * 
 * Rules:
 * 1. HRV & Sleep Recovery Check → Detects poor recovery
 * 2. Training Volume Spike → Detects dangerous load increases
 * 3. Sustained High RPE → Detects cumulative fatigue
 * 4. ACWR Out of Safe Zone → Detects injury risk zones
 * 5. Pain Detection → Detects potential injuries
 */

import type { DecisionRule, MetricContext, Decision } from './types';

// ============================================================================
// RULE 1: HRV & SLEEP RECOVERY CHECK
// ============================================================================

/**
 * RULE 1: HRV & Sleep Recovery Check
 * 
 * **Objective:** Detect poor recovery from training stress
 * 
 * **Triggers when BOTH:**
 * - HRV < 50ms (significantly below typical baseline of 60ms)
 * - Sleep Quality ≤ 2/5 (poor subjective sleep quality)
 * 
 * **Scientific Basis:**
 * - HRV is a validated marker of autonomic nervous system recovery
 * - Combined with poor sleep = high overtraining risk
 * - Studies show HRV drop of >20% from baseline indicates need for load reduction
 * 
 * **Action:** Recommend reduced training load or active recovery
 * 
 * **Priority:** CRITICAL (immediate risk of overtraining/illness)
 * 
 * **Cooldown:** 24 hours (can trigger daily if recovery remains poor)
 */
export const RULE_HRV_SLEEP: DecisionRule = {
  id: 'rule-hrv-sleep',
  name: 'HRV & Sleep Recovery Check',
  description: 'Detecta recuperação insuficiente através de HRV e qualidade de sono',
  priority: 'critical',
  enabled: true,
  cooldown: 24,
  category: 'recovery',
  version: '1.0.0',
  
  conditions: (context: MetricContext): boolean => {
    const hrv = context.currentMetrics['hrv'];
    const sleepQuality = context.currentMetrics['sleep-quality'];
    
    // Both metrics must be available
    if (hrv === undefined || sleepQuality === undefined) {
      return false;
    }
    
    // Trigger if BOTH conditions met
    const hrvLow = hrv < 50;
    const sleepPoor = sleepQuality <= 2;
    
    return hrvLow && sleepPoor;
  },
  
  generate: (context: MetricContext): Omit<Decision, 'id' | 'workspaceId' | 'status' | 'createdAt'> => {
    const hrv = context.currentMetrics['hrv'];
    const sleepQuality = context.currentMetrics['sleep-quality'];
    const baseline = context.historicalMetrics.baseline['hrv'] || 60;
    
    // Calculate deviation from baseline
    const deviationPercent = Math.round(((baseline - hrv) / baseline) * 100);
    
    // Determine severity for reasoning
    const severity = deviationPercent > 30 ? 'significativo' : 'moderado';
    
    return {
      athleteId: context.athleteId,
      athleteName: context.athleteProfile?.name,
      type: 'reduce-load',
      priority: 'critical',
      recommendation: 'Reduzir carga de treino hoje',
      reasoning: 
        `HRV está em ${hrv}ms (${deviationPercent}% abaixo da baseline de ${baseline}ms) ` +
        `e qualidade de sono reportada como ${sleepQuality}/5. ` +
        `Desvio ${severity} da baseline indica recuperação inadequada. ` +
        `Risco elevado de overtraining, supressão imunológica e lesão. ` +
        `Recomenda-se treino leve (< 60% capacidade) ou descanso ativo (yoga, caminhada leve).`,
      metricsUsed: [
        {
          metricId: 'hrv',
          name: 'HRV (Variabilidade da Frequência Cardíaca)',
          value: hrv,
          weight: 0.6,
          status: 'red',
          threshold: 50,
          baseline: baseline,
        },
        {
          metricId: 'sleep-quality',
          name: 'Qualidade do Sono',
          value: sleepQuality,
          weight: 0.4,
          status: 'red',
          threshold: 2,
          baseline: context.historicalMetrics.baseline['sleep-quality'] || 3.5,
        },
      ],
      ruleId: 'rule-hrv-sleep',
      confidence: deviationPercent > 30 ? 0.95 : 0.88,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },
};

// ============================================================================
// RULE 2: TRAINING VOLUME SPIKE
// ============================================================================

/**
 * RULE 2: Training Volume Spike Detection
 * 
 * **Objective:** Detect sudden increases in training load
 * 
 * **Triggers when:**
 * - Current week volume > 120% of 4-week baseline
 * 
 * **Scientific Basis:**
 * - Sudden load spikes are #1 predictor of injury in team sports
 * - 10% rule: Don't increase volume by more than 10% per week
 * - 20% spike = moderate risk, requires close monitoring
 * - 30%+ spike = high risk, requires immediate action
 * 
 * **Action:** Monitor athlete closely, consider load adjustment
 * 
 * **Priority:** HIGH (injury risk, but not immediate)
 * 
 * **Cooldown:** 48 hours (allow time for load adjustment)
 */
export const RULE_VOLUME_SPIKE: DecisionRule = {
  id: 'rule-volume-spike',
  name: 'Training Volume Spike Detection',
  description: 'Detecta aumentos abruptos no volume de treino que aumentam risco de lesão',
  priority: 'high',
  enabled: true,
  cooldown: 48,
  category: 'load',
  version: '1.0.0',
  
  conditions: (context: MetricContext): boolean => {
    const currentVolume = context.currentMetrics['total-volume'];
    const baseline = context.historicalMetrics.baseline['total-volume'];
    
    if (currentVolume === undefined || baseline === undefined || baseline === 0) {
      return false;
    }
    
    // Trigger if 20%+ above baseline
    const ratio = currentVolume / baseline;
    return ratio > 1.2;
  },
  
  generate: (context: MetricContext): Omit<Decision, 'id' | 'workspaceId' | 'status' | 'createdAt'> => {
    const currentVolume = context.currentMetrics['total-volume'];
    const baseline = context.historicalMetrics.baseline['total-volume'];
    const increasePercent = Math.round(((currentVolume - baseline) / baseline) * 100);
    
    // Severity assessment
    const isCritical = increasePercent >= 40;
    const isHigh = increasePercent >= 30;
    
    let recommendation: string;
    let priority: 'critical' | 'high';
    let confidence: number;
    
    if (isCritical) {
      recommendation = 'Reduzir volume imediatamente - risco crítico de lesão';
      priority = 'critical';
      confidence = 0.9;
    } else if (isHigh) {
      recommendation = 'Estabilizar volume ou reduzir - monitorizar sinais de overload';
      priority = 'high';
      confidence = 0.85;
    } else {
      recommendation = 'Monitorizar atleta de perto nos próximos dias';
      priority = 'high';
      confidence = 0.75;
    }
    
    return {
      athleteId: context.athleteId,
      athleteName: context.athleteProfile?.name,
      type: 'alert',
      priority: priority,
      recommendation: recommendation,
      reasoning:
        `Volume de treino semanal (${Math.round(currentVolume)} unidades) está ${increasePercent}% acima ` +
        `da baseline de 4 semanas (${Math.round(baseline)} unidades). ` +
        `Aumentos abruptos de carga violam o "10% rule" e aumentam significativamente ` +
        `o risco de lesões por sobrecarga (estudos mostram +20% = 2-4x risco). ` +
        `Recomenda-se estabilizar ou reduzir carga, aumentar foco em recuperação, ` +
        `e monitorizar métricas de wellness (HRV, sono, RPE) diariamente.`,
      metricsUsed: [
        {
          metricId: 'total-volume',
          name: 'Volume Total Semanal',
          value: Math.round(currentVolume),
          weight: 0.8,
          status: increasePercent >= 40 ? 'red' : 'yellow',
          baseline: Math.round(baseline),
        },
      ],
      ruleId: 'rule-volume-spike',
      confidence: confidence,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    };
  },
};

// ============================================================================
// RULE 3: SUSTAINED HIGH RPE
// ============================================================================

/**
 * RULE 3: Sustained High RPE (Rate of Perceived Exertion)
 * 
 * **Objective:** Detect cumulative fatigue from sustained high-intensity training
 * 
 * **Triggers when:**
 * - RPE > 8/10 for 3+ consecutive days
 * 
 * **Scientific Basis:**
 * - RPE is a validated marker of training stress (Borg Scale)
 * - Sustained RPE > 8 indicates insufficient recovery between sessions
 * - 3+ days = cumulative fatigue, risk of burnout and injury
 * - Studies show RPE monitoring reduces overtraining syndrome by 30%
 * 
 * **Action:** Schedule rest day or active recovery session
 * 
 * **Priority:** HIGH (fatigue accumulation, injury risk)
 * 
 * **Cooldown:** 24 hours (re-evaluate daily)
 */
export const RULE_HIGH_RPE: DecisionRule = {
  id: 'rule-high-rpe',
  name: 'Sustained High RPE',
  description: 'Detecta fadiga acumulada através de RPE elevado sustentado',
  priority: 'high',
  enabled: true,
  cooldown: 24,
  category: 'recovery',
  version: '1.0.0',
  
  conditions: (context: MetricContext): boolean => {
    const last7d = context.historicalMetrics.last7d['rpe'] || [];
    
    if (last7d.length < 3) {
      return false; // Need at least 3 days of data
    }
    
    // Check for 3+ consecutive days of RPE > 8
    let streak = 0;
    for (let i = last7d.length - 1; i >= 0; i--) {
      if (last7d[i] > 8) {
        streak++;
        if (streak >= 3) return true;
      } else {
        break; // Streak broken
      }
    }
    
    return false;
  },
  
  generate: (context: MetricContext): Omit<Decision, 'id' | 'workspaceId' | 'status' | 'createdAt'> => {
    const last7d = context.historicalMetrics.last7d['rpe'] || [];
    const currentRPE = last7d[last7d.length - 1];
    
    // Count consecutive streak
    let streak = 0;
    for (let i = last7d.length - 1; i >= 0; i--) {
      if (last7d[i] > 8) {
        streak++;
      } else {
        break;
      }
    }
    
    // Calculate average RPE over streak
    const avgRPE = last7d.slice(-streak).reduce((sum, v) => sum + v, 0) / streak;
    
    return {
      athleteId: context.athleteId,
      athleteName: context.athleteProfile?.name,
      type: 'rest-day',
      priority: 'high',
      recommendation: 'Agendar dia de descanso ou treino regenerativo',
      reasoning:
        `${streak} dias consecutivos com RPE acima de 8/10 (atual: ${currentRPE}/10, média: ${avgRPE.toFixed(1)}/10). ` +
        `RPE sustentado elevado indica fadiga neuromuscular acumulada e stress psicológico. ` +
        `Fadiga acumulada aumenta risco de burnout, supressão imunológica e lesões de overuse. ` +
        `Recomenda-se descanso completo (24-48h) ou treino regenerativo de baixa intensidade ` +
        `(caminhada, natação leve, yoga). Evitar treinos de força ou alta intensidade até RPE < 7.`,
      metricsUsed: [
        {
          metricId: 'rpe',
          name: 'RPE da Sessão',
          value: currentRPE,
          weight: 0.7,
          status: currentRPE >= 9 ? 'red' : 'yellow',
          threshold: 8,
          baseline: context.historicalMetrics.baseline['rpe'] || 6.5,
        },
      ],
      ruleId: 'rule-high-rpe',
      confidence: streak >= 5 ? 0.95 : (streak >= 4 ? 0.90 : 0.85),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },
};

// ============================================================================
// RULE 4: ACWR OUT OF SAFE ZONE
// ============================================================================

/**
 * RULE 4: ACWR Out of Safe Zone
 * 
 * **Objective:** Monitor Acute:Chronic Workload Ratio for injury risk
 * 
 * **Triggers when:**
 * - ACWR > 1.5 (high acute load relative to chronic)
 * - OR ACWR < 0.8 (low acute load, detraining risk)
 * 
 * **Scientific Basis:**
 * - ACWR is the gold-standard load monitoring metric in elite sports
 * - Acute = 7-day rolling average
 * - Chronic = 28-day rolling average
 * - Safe zone: 0.8 - 1.3 (optimal: ~1.0)
 * - ACWR > 1.5 = 2-4x injury risk (Gabbett et al., 2016)
 * - ACWR < 0.8 = detraining, increased injury risk when load returns
 * 
 * **Action:** Adjust training load (increase or decrease)
 * 
 * **Priority:** CRITICAL (validated injury predictor)
 * 
 * **Cooldown:** 48 hours (allow time for load stabilization)
 */
export const RULE_ACWR: DecisionRule = {
  id: 'rule-acwr',
  name: 'ACWR Out of Safe Zone',
  description: 'Detecta quando ratio agudo:crónico sai da zona segura (0.8-1.3)',
  priority: 'critical',
  enabled: true,
  cooldown: 48,
  category: 'load',
  version: '1.0.0',
  
  conditions: (context: MetricContext): boolean => {
    const acwr = context.currentMetrics['acwr'];
    
    if (acwr === undefined) {
      return false;
    }
    
    // Safe zone: 0.8 - 1.3
    // Danger zone: > 1.5 or < 0.8
    const isHigh = acwr > 1.5;
    const isLow = acwr < 0.8;
    
    return isHigh || isLow;
  },
  
  generate: (context: MetricContext): Omit<Decision, 'id' | 'workspaceId' | 'status' | 'createdAt'> => {
    const acwr = context.currentMetrics['acwr'];
    
    const isTooHigh = acwr > 1.5;
    const isCritical = acwr > 1.8;
    const isLow = acwr < 0.8;
    
    let type: Decision['type'];
    let recommendation: string;
    let reasoning: string;
    let status: 'red' | 'yellow';
    let confidence: number;
    
    if (isTooHigh) {
      type = 'reduce-load';
      status = isCritical ? 'red' : 'yellow';
      confidence = isCritical ? 0.95 : 0.90;
      recommendation = isCritical 
        ? 'Reduzir carga de treino imediatamente - risco crítico'
        : 'Reduzir carga de treino para evitar lesão';
      reasoning = 
        `ACWR de ${acwr.toFixed(2)} indica carga aguda (últimos 7 dias) muito superior ` +
        `à carga crónica (últimos 28 dias). Zona de ${isCritical ? 'RISCO CRÍTICO' : 'alto risco'} de lesão (>1.5). ` +
        `Estudos mostram que ACWR > 1.5 aumenta risco de lesão em 2-4x. ` +
        `Recomenda-se reduzir volume em 20-30% ou baixar intensidade significativamente. ` +
        `Evitar sessões de alta intensidade até ACWR voltar à zona 0.8-1.3.`;
    } else {
      type = 'adjust-program';
      status = 'yellow';
      confidence = 0.85;
      recommendation = 'Aumentar carga gradualmente para evitar destreino';
      reasoning = 
        `ACWR de ${acwr.toFixed(2)} indica carga aguda muito inferior à carga crónica. ` +
        `Zona de risco de destreino (<0.8). Carga insuficiente pode levar a perda de ` +
        `adaptações e paradoxalmente aumentar risco de lesão quando carga retornar. ` +
        `Recomenda-se aumentar carga progressivamente (regra dos 10% por semana) ` +
        `até atingir zona ótima (ACWR ~1.0-1.2).`;
    }
    
    return {
      athleteId: context.athleteId,
      athleteName: context.athleteProfile?.name,
      type: type,
      priority: 'critical',
      recommendation: recommendation,
      reasoning: reasoning,
      metricsUsed: [
        {
          metricId: 'acwr',
          name: 'ACWR (Acute:Chronic Workload Ratio)',
          value: parseFloat(acwr.toFixed(2)),
          weight: 0.9,
          status: status,
          threshold: isTooHigh ? 1.5 : 0.8,
          baseline: 1.0,
        },
      ],
      ruleId: 'rule-acwr',
      confidence: confidence,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    };
  },
};

// ============================================================================
// RULE 5: PAIN DETECTION
// ============================================================================

/**
 * RULE 5: Pain Detection
 * 
 * **Objective:** Identify potential injuries through pain reporting
 * 
 * **Triggers when:**
 * - Pain Level ≥ 6/10
 * 
 * **Scientific Basis:**
 * - Pain is the body's warning system
 * - Pain ≥ 6/10 = moderate to severe, not normal training soreness
 * - Training through pain increases risk of chronic injury
 * - VAS (Visual Analog Scale) pain > 6 = requires medical evaluation
 * 
 * **Action:** Avoid high-intensity exercise, consider medical evaluation
 * 
 * **Priority:** CRITICAL (injury prevention/management)
 * 
 * **Cooldown:** 12 hours (can re-trigger if pain persists)
 */
export const RULE_PAIN: DecisionRule = {
  id: 'rule-pain',
  name: 'Pain Detection',
  description: 'Detecta níveis de dor que requerem atenção médica ou modificação de treino',
  priority: 'critical',
  enabled: true,
  cooldown: 12,
  category: 'injury',
  version: '1.0.0',
  
  conditions: (context: MetricContext): boolean => {
    const painLevel = context.currentMetrics['pain-level'];
    
    if (painLevel === undefined) {
      return false;
    }
    
    // Trigger if pain >= 6/10
    return painLevel >= 6;
  },
  
  generate: (context: MetricContext): Omit<Decision, 'id' | 'workspaceId' | 'status' | 'createdAt'> => {
    const painLevel = context.currentMetrics['pain-level'];
    
    // Severity classification
    const isSevere = painLevel >= 8;
    const isModerate = painLevel >= 6;
    
    let recommendation: string;
    let reasoning: string;
    let confidence: number;
    
    if (isSevere) {
      recommendation = 'PAUSAR treino imediatamente e procurar avaliação médica urgente';
      confidence = 0.98;
      reasoning = 
        `Nível de dor SEVERO reportado: ${painLevel}/10. ` +
        `Dor acima de 8/10 indica lesão aguda ou agravamento significativo de lesão existente. ` +
        `RISCO ELEVADO de dano permanente se continuar a treinar. ` +
        `AÇÃO IMEDIATA NECESSÁRIA: ` +
        `1) Parar todas as atividades de treino ` +
        `2) Aplicar protocolo RICE (Rest, Ice, Compression, Elevation) ` +
        `3) Marcar consulta médica/fisioterapia nas próximas 24h ` +
        `4) Não retomar treino até avaliação profissional`;
    } else {
      recommendation = 'Evitar exercícios de alta intensidade e considerar avaliação médica';
      confidence = 0.92;
      reasoning = 
        `Nível de dor MODERADO reportado: ${painLevel}/10. ` +
        `Dor entre 6-7/10 NÃO é normal após treino e pode indicar lesão em desenvolvimento. ` +
        `Treinar através da dor aumenta risco de lesão crónica. ` +
        `RECOMENDAÇÕES: ` +
        `1) Evitar movimentos/exercícios que causam dor ` +
        `2) Substituir por atividades sem impacto (natação, bike) ` +
        `3) Considerar consulta de fisioterapia se dor persistir >48h ` +
        `4) Monitorizar dor diariamente - se aumentar, parar completamente`;
    }
    
    return {
      athleteId: context.athleteId,
      athleteName: context.athleteProfile?.name,
      type: 'medical-evaluation',
      priority: 'critical',
      recommendation: recommendation,
      reasoning: reasoning,
      metricsUsed: [
        {
          metricId: 'pain-level',
          name: 'Nível de Dor (Escala Visual Analógica)',
          value: painLevel,
          weight: 0.95,
          status: 'red',
          threshold: 6,
          baseline: context.historicalMetrics.baseline['pain-level'] || 2,
        },
      ],
      ruleId: 'rule-pain',
      confidence: confidence,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    };
  },
};

// ============================================================================
// RULE REGISTRY
// ============================================================================

/**
 * All hard-coded rules in order of evaluation
 * 
 * Rules are evaluated in this order:
 * 1. Pain (most critical - immediate safety)
 * 2. HRV & Sleep (critical - overtraining risk)
 * 3. ACWR (critical - validated injury predictor)
 * 4. High RPE (high - cumulative fatigue)
 * 5. Volume Spike (high - load management)
 */
export const HARDCODED_RULES: DecisionRule[] = [
  RULE_PAIN,           // Most critical - immediate risk
  RULE_HRV_SLEEP,      // Critical - overtraining
  RULE_ACWR,           // Critical - injury prediction
  RULE_HIGH_RPE,       // High - fatigue accumulation
  RULE_VOLUME_SPIKE,   // High - load spike
];

// ============================================================================
// RULE UTILITIES
// ============================================================================

/**
 * Get rule by ID
 */
export function getRuleById(ruleId: string): DecisionRule | undefined {
  return HARDCODED_RULES.find(rule => rule.id === ruleId);
}

/**
 * Get rules by category
 */
export function getRulesByCategory(category: DecisionRule['category']): DecisionRule[] {
  return HARDCODED_RULES.filter(rule => rule.category === category);
}

/**
 * Get enabled rules only
 */
export function getEnabledRules(): DecisionRule[] {
  return HARDCODED_RULES.filter(rule => rule.enabled);
}

/**
 * Get critical rules only
 */
export function getCriticalRules(): DecisionRule[] {
  return HARDCODED_RULES.filter(rule => rule.priority === 'critical');
}

/**
 * Get rules by priority
 */
export function getRulesByPriority(priority: DecisionRule['priority']): DecisionRule[] {
  return HARDCODED_RULES.filter(rule => rule.priority === priority);
}

/**
 * Validate rule structure (development helper)
 */
export function validateRule(rule: DecisionRule): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!rule.id) errors.push('Missing rule ID');
  if (!rule.name) errors.push('Missing rule name');
  if (!rule.description) errors.push('Missing rule description');
  if (typeof rule.conditions !== 'function') errors.push('Invalid conditions function');
  if (typeof rule.generate !== 'function') errors.push('Invalid generate function');
  if (!rule.priority) errors.push('Missing priority');
  if (typeof rule.enabled !== 'boolean') errors.push('Missing enabled flag');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get rule statistics
 */
export function getRuleStats() {
  return {
    total: HARDCODED_RULES.length,
    enabled: getEnabledRules().length,
    byPriority: {
      critical: getRulesByPriority('critical').length,
      high: getRulesByPriority('high').length,
      medium: getRulesByPriority('medium').length,
      low: getRulesByPriority('low').length,
    },
    byCategory: {
      recovery: getRulesByCategory('recovery').length,
      load: getRulesByCategory('load').length,
      injury: getRulesByCategory('injury').length,
      performance: getRulesByCategory('performance').length,
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RULE_HRV_SLEEP,
  RULE_VOLUME_SPIKE,
  RULE_HIGH_RPE,
  RULE_ACWR,
  RULE_PAIN,
};

export default HARDCODED_RULES;
