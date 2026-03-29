/**
 * Decision Engine - Metric Aggregator
 * 
 * FASE 8 DAY 3: Metric aggregation and context building
 * 
 * Responsible for:
 * - Fetching athlete metrics from various sources
 * - Computing baselines, averages, trends
 * - Calculating derived metrics (ACWR, streaks, etc)
 * - Building complete MetricContext for rule evaluation
 * 
 * Current Implementation: MOCK DATA
 * - Generates realistic metric patterns
 * - Covers all rule requirements
 * - Production: Replace with real Supabase queries
 */

import type { MetricContext, MetricValue, MetricStats, ACWRData } from './types';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate realistic HRV pattern
 * 
 * Simulates different athlete states:
 * - Good recovery: HRV ~60ms, stable
 * - Poor recovery: HRV <50ms, declining
 * - Overtraining: HRV <40ms, highly variable
 */
function generateHRVPattern(athleteId: string): number[] {
  const seed = parseInt(athleteId.slice(-3)) || 1;
  const baseHRV = 60 + (seed % 20) - 10; // 50-70 range
  
  const pattern: number[] = [];
  let current = baseHRV;
  
  for (let i = 0; i < 30; i++) {
    // Simulate declining trend for some athletes
    if (seed % 3 === 0) {
      current = current - 0.5 - Math.random() * 1;
    } else {
      current = current + (Math.random() - 0.5) * 2;
    }
    
    // Keep in realistic range
    current = Math.max(35, Math.min(80, current));
    pattern.push(Math.round(current));
  }
  
  return pattern;
}

/**
 * Generate realistic sleep quality pattern
 * 
 * Scale: 1-5
 * - 5: Excellent sleep
 * - 4: Good sleep
 * - 3: Average sleep
 * - 2: Poor sleep
 * - 1: Very poor sleep
 */
function generateSleepPattern(athleteId: string): number[] {
  const seed = parseInt(athleteId.slice(-3)) || 1;
  const baseQuality = 3.5;
  
  const pattern: number[] = [];
  let current = baseQuality;
  
  for (let i = 0; i < 30; i++) {
    // Some athletes have declining sleep
    if (seed % 4 === 0) {
      current = current - 0.05 - Math.random() * 0.1;
    } else {
      current = current + (Math.random() - 0.5) * 0.5;
    }
    
    // Keep in valid range (1-5)
    current = Math.max(1, Math.min(5, current));
    pattern.push(Math.round(current * 10) / 10); // 1 decimal
  }
  
  return pattern;
}

/**
 * Generate realistic training volume pattern
 * 
 * Simulates different scenarios:
 * - Stable training: Volume around 1000 ± 100
 * - Volume spike: Sudden increase to 1300-1400
 * - Taper: Gradual decrease
 */
function generateVolumePattern(athleteId: string): number[] {
  const seed = parseInt(athleteId.slice(-3)) || 1;
  const baseVolume = 900 + (seed % 200); // 900-1100 range
  
  const pattern: number[] = [];
  let current = baseVolume;
  
  for (let i = 0; i < 30; i++) {
    // Simulate volume spike for some athletes
    if (seed % 3 === 0 && i >= 23) {
      // Last week spike
      current = current * 1.3;
    } else {
      current = current + (Math.random() - 0.5) * 100;
    }
    
    // Keep realistic
    current = Math.max(500, Math.min(2000, current));
    pattern.push(Math.round(current));
  }
  
  return pattern;
}

/**
 * Generate realistic RPE pattern
 * 
 * Scale: 1-10 (Borg CR-10)
 * - 1-3: Very light
 * - 4-6: Moderate
 * - 7-8: Hard
 * - 9-10: Maximal
 */
function generateRPEPattern(athleteId: string): number[] {
  const seed = parseInt(athleteId.slice(-3)) || 1;
  const baseRPE = 6 + (seed % 3);
  
  const pattern: number[] = [];
  let current = baseRPE;
  
  for (let i = 0; i < 30; i++) {
    // Some athletes have sustained high RPE
    if (seed % 5 === 0 && i >= 20) {
      current = 8.5 + Math.random() * 1;
    } else {
      current = current + (Math.random() - 0.5) * 1.5;
    }
    
    // Keep in range
    current = Math.max(1, Math.min(10, current));
    pattern.push(Math.round(current * 10) / 10);
  }
  
  return pattern;
}

/**
 * Generate realistic pain level pattern
 * 
 * Scale: 0-10 (VAS - Visual Analog Scale)
 * - 0: No pain
 * - 1-3: Mild pain
 * - 4-6: Moderate pain
 * - 7-10: Severe pain
 */
function generatePainPattern(athleteId: string): number[] {
  const seed = parseInt(athleteId.slice(-3)) || 1;
  const basePain = seed % 4; // Most athletes have low pain
  
  const pattern: number[] = [];
  let current = basePain;
  
  for (let i = 0; i < 30; i++) {
    // Some athletes develop pain
    if (seed % 6 === 0 && i >= 25) {
      current = current + 0.3;
    } else {
      current = current + (Math.random() - 0.6) * 1; // Bias toward decrease
    }
    
    // Keep in range
    current = Math.max(0, Math.min(10, current));
    pattern.push(Math.round(current * 10) / 10);
  }
  
  return pattern;
}

// ============================================================================
// BASELINE CALCULATIONS
// ============================================================================

/**
 * Calculate baseline (4-week average) for a metric
 */
function calculateBaseline(values: number[]): number {
  if (values.length === 0) return 0;
  
  // Use last 28 days (4 weeks)
  const last28 = values.slice(-28);
  const sum = last28.reduce((acc, val) => acc + val, 0);
  return sum / last28.length;
}

/**
 * Calculate last 7 days average
 */
function calculateLast7DaysAvg(values: number[]): number {
  if (values.length === 0) return 0;
  
  const last7 = values.slice(-7);
  const sum = last7.reduce((acc, val) => acc + val, 0);
  return sum / last7.length;
}

/**
 * Calculate ACWR (Acute:Chronic Workload Ratio)
 * 
 * Acute = 7-day average
 * Chronic = 28-day average
 * ACWR = Acute / Chronic
 * 
 * Interpretation:
 * - < 0.8: Detraining risk
 * - 0.8 - 1.3: Safe zone (optimal)
 * - 1.3 - 1.5: Warning zone
 * - > 1.5: Danger zone (high injury risk)
 */
function calculateACWR(volumePattern: number[]): ACWRData {
  const last7 = volumePattern.slice(-7);
  const last28 = volumePattern.slice(-28);
  
  const acute = last7.reduce((sum, v) => sum + v, 0) / 7;
  const chronic = last28.reduce((sum, v) => sum + v, 0) / 28;
  
  const ratio = chronic > 0 ? acute / chronic : 1.0;
  
  let status: 'green' | 'yellow' | 'red';
  let recommendation: string;
  
  if (ratio > 1.5) {
    status = 'red';
    recommendation = 'CRÍTICO: Reduzir carga imediatamente';
  } else if (ratio > 1.3) {
    status = 'yellow';
    recommendation = 'ATENÇÃO: Monitorizar e estabilizar carga';
  } else if (ratio < 0.8) {
    status = 'yellow';
    recommendation = 'ATENÇÃO: Aumentar carga progressivamente';
  } else {
    status = 'green';
    recommendation = 'ÓTIMO: Zona segura de treino';
  }
  
  return {
    athleteId: '', // Will be filled by caller
    acute: Math.round(acute),
    chronic: Math.round(chronic),
    ratio: Math.round(ratio * 100) / 100,
    status,
    recommendation,
    computedAt: new Date().toISOString(),
  };
}

/**
 * Count consecutive days meeting a condition
 * 
 * Example: Count how many consecutive days RPE > 8
 */
function countStreak(values: number[], condition: (value: number) => boolean): number {
  let streak = 0;
  
  for (let i = values.length - 1; i >= 0; i--) {
    if (condition(values[i])) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// ============================================================================
// METRIC STATISTICS
// ============================================================================

/**
 * Calculate comprehensive statistics for a metric
 */
export function calculateMetricStats(
  metricId: string,
  athleteId: string,
  values: number[]
): MetricStats {
  if (values.length === 0) {
    return {
      metricId,
      athleteId,
      current: 0,
      min: 0,
      max: 0,
      avg: 0,
      median: 0,
      stdDev: 0,
      trend: 'stable',
      changePercent: 0,
      last7dAvg: 0,
      last30dAvg: 0,
      baseline: 0,
      computedAt: new Date().toISOString(),
    };
  }
  
  // Basic stats
  const current = values[values.length - 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  
  // Median
  const sorted = [...values].sort((a, b) => a - b);
  const median = values.length % 2 === 0
    ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
    : sorted[Math.floor(values.length / 2)];
  
  // Standard deviation
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Trend analysis (last 7 days vs previous 7 days)
  const last7 = values.slice(-7);
  const prev7 = values.slice(-14, -7);
  
  const last7Avg = last7.reduce((sum, v) => sum + v, 0) / last7.length;
  const prev7Avg = prev7.length > 0
    ? prev7.reduce((sum, v) => sum + v, 0) / prev7.length
    : last7Avg;
  
  let trend: 'increasing' | 'decreasing' | 'stable';
  const trendThreshold = stdDev * 0.5; // Use std dev to determine significance
  
  if (last7Avg > prev7Avg + trendThreshold) {
    trend = 'increasing';
  } else if (last7Avg < prev7Avg - trendThreshold) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }
  
  // Change percent vs baseline
  const baseline = calculateBaseline(values);
  const changePercent = baseline > 0 ? ((current - baseline) / baseline) * 100 : 0;
  
  // Time windows
  const last30dAvg = values.slice(-30).reduce((sum, v) => sum + v, 0) / Math.min(values.length, 30);
  
  return {
    metricId,
    athleteId,
    current: Math.round(current * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    avg: Math.round(avg * 100) / 100,
    median: Math.round(median * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    trend,
    changePercent: Math.round(changePercent * 10) / 10,
    last7dAvg: Math.round(last7Avg * 100) / 100,
    last30dAvg: Math.round(last30dAvg * 100) / 100,
    baseline: Math.round(baseline * 100) / 100,
    computedAt: new Date().toISOString(),
  };
}

// ============================================================================
// CONTEXT BUILDER (MAIN FUNCTION)
// ============================================================================

/**
 * Build complete metric context for an athlete
 * 
 * This is the main function that gathers all metrics and prepares
 * them for rule evaluation.
 * 
 * MOCK IMPLEMENTATION:
 * - Generates realistic patterns
 * - Covers all metrics needed by rules
 * 
 * PRODUCTION:
 * - Query Supabase for real metric_values
 * - Aggregate by metric type
 * - Calculate same statistics
 */
export async function buildMetricContext(
  athleteId: string,
  workspaceId: string
): Promise<MetricContext> {
  // Generate 30-day patterns for each metric
  const hrvPattern = generateHRVPattern(athleteId);
  const sleepPattern = generateSleepPattern(athleteId);
  const volumePattern = generateVolumePattern(athleteId);
  const rpePattern = generateRPEPattern(athleteId);
  const painPattern = generatePainPattern(athleteId);
  
  // Calculate ACWR
  const acwrData = calculateACWR(volumePattern);
  acwrData.athleteId = athleteId;
  
  // Current values (most recent)
  const currentMetrics: Record<string, number> = {
    'hrv': hrvPattern[hrvPattern.length - 1],
    'sleep-quality': sleepPattern[sleepPattern.length - 1],
    'total-volume': volumePattern[volumePattern.length - 1],
    'rpe': rpePattern[rpePattern.length - 1],
    'acwr': acwrData.ratio,
    'pain-level': painPattern[painPattern.length - 1],
  };
  
  // Historical data
  const historicalMetrics = {
    last7d: {
      'hrv': hrvPattern.slice(-7),
      'sleep-quality': sleepPattern.slice(-7),
      'total-volume': volumePattern.slice(-7),
      'rpe': rpePattern.slice(-7),
      'pain-level': painPattern.slice(-7),
    },
    last30d: {
      'hrv': hrvPattern,
      'sleep-quality': sleepPattern,
      'total-volume': volumePattern,
      'rpe': rpePattern,
      'pain-level': painPattern,
    },
    baseline: {
      'hrv': calculateBaseline(hrvPattern),
      'sleep-quality': calculateBaseline(sleepPattern),
      'total-volume': calculateBaseline(volumePattern),
      'rpe': calculateBaseline(rpePattern),
      'pain-level': calculateBaseline(painPattern),
    },
  };
  
  // Athlete profile (mock - in production, fetch from athletes table)
  const athleteProfile = {
    name: `Athlete ${athleteId.slice(-4)}`,
    sport: 'Football',
    age: 20 + (parseInt(athleteId.slice(-2)) % 15), // 20-35 range
    gender: parseInt(athleteId.slice(-1)) % 2 === 0 ? 'M' : 'F',
    position: 'Midfielder',
  };
  
  return {
    athleteId,
    workspaceId,
    currentMetrics,
    historicalMetrics,
    athleteProfile,
    contextBuiltAt: new Date().toISOString(),
  };
}

/**
 * Build contexts for multiple athletes (batch)
 * 
 * More efficient than calling buildMetricContext individually
 */
export async function buildMetricContextBatch(
  athleteIds: string[],
  workspaceId: string
): Promise<Map<string, MetricContext>> {
  const contexts = new Map<string, MetricContext>();
  
  // In production, this would be a single optimized query
  // For now, process sequentially (fast enough with mock data)
  for (const athleteId of athleteIds) {
    const context = await buildMetricContext(athleteId, workspaceId);
    contexts.set(athleteId, context);
  }
  
  return contexts;
}

// ============================================================================
// SPECIFIC METRIC HELPERS
// ============================================================================

/**
 * Get baseline value for a specific metric
 * 
 * Helper for rules that need quick baseline access
 */
export async function getMetricBaseline(
  metricId: string,
  athleteId: string,
  workspaceId: string
): Promise<number | undefined> {
  const context = await buildMetricContext(athleteId, workspaceId);
  return context.historicalMetrics.baseline[metricId];
}

/**
 * Get last 7 days for a specific metric
 */
export async function getMetricLast7Days(
  metricId: string,
  athleteId: string,
  workspaceId: string
): Promise<number[]> {
  const context = await buildMetricContext(athleteId, workspaceId);
  return context.historicalMetrics.last7d[metricId] || [];
}

/**
 * Get current value for a specific metric
 */
export async function getMetricCurrent(
  metricId: string,
  athleteId: string,
  workspaceId: string
): Promise<number | undefined> {
  const context = await buildMetricContext(athleteId, workspaceId);
  return context.currentMetrics[metricId];
}

/**
 * Calculate ACWR for an athlete
 */
export async function getACWR(
  athleteId: string,
  workspaceId: string
): Promise<ACWRData> {
  const volumePattern = generateVolumePattern(athleteId);
  const acwrData = calculateACWR(volumePattern);
  acwrData.athleteId = athleteId;
  return acwrData;
}

/**
 * Count consecutive days a metric meets a condition
 * 
 * Example: countMetricStreak('rpe', athleteId, (v) => v > 8)
 * Returns: Number of consecutive days with RPE > 8
 */
export async function countMetricStreak(
  metricId: string,
  athleteId: string,
  workspaceId: string,
  condition: (value: number) => boolean
): Promise<number> {
  const last7d = await getMetricLast7Days(metricId, athleteId, workspaceId);
  return countStreak(last7d, condition);
}

// ============================================================================
// PRODUCTION MIGRATION HELPERS
// ============================================================================

/**
 * PRODUCTION: Fetch metric values from Supabase
 * 
 * This function will replace the mock generators when integrating with Supabase.
 * 
 * Usage:
 * const values = await fetchMetricValues('hrv', 'athlete-001', 'workspace-1', 30);
 */
export async function fetchMetricValues(
  metricId: string,
  athleteId: string,
  workspaceId: string,
  days: number = 30
): Promise<MetricValue[]> {
  // TODO: Replace with real Supabase query
  // 
  // const supabase = createClient();
  // const cutoffDate = new Date();
  // cutoffDate.setDate(cutoffDate.getDate() - days);
  // 
  // const { data, error } = await supabase
  //   .from('metric_values')
  //   .select('value, timestamp, source')
  //   .eq('metric_id', metricId)
  //   .eq('athlete_id', athleteId)
  //   .eq('workspace_id', workspaceId)
  //   .gte('timestamp', cutoffDate.toISOString())
  //   .order('timestamp', { ascending: true });
  // 
  // if (error) throw error;
  // return data || [];
  
  // MOCK: Return empty array (not used in mock mode)
  return [];
}

/**
 * PRODUCTION: Batch fetch metrics for multiple athletes
 */
export async function fetchMetricValuesBatch(
  athleteIds: string[],
  workspaceId: string,
  days: number = 30
): Promise<Map<string, MetricValue[]>> {
  // TODO: Implement efficient batch query
  return new Map();
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  calculateBaseline,
  calculateLast7DaysAvg,
  calculateACWR,
  countStreak,
};

export default buildMetricContext;
