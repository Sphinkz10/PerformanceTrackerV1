/**
 * SPRINT 0: Baseline Calculation
 * Fetches pre-calculated baselines from materialized view
 * With error handling and fallbacks
 */

import { createClient } from '@/lib/supabase/server';
import type { MetricBaseline } from '@/types/metrics';

// ============================================
// GET BASELINE
// ============================================

/**
 * Get baseline value for a metric-athlete combination
 * Returns null if no baseline available
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @returns Baseline value or null
 */
export async function getBaseline(
  metricId: string,
  athleteId: string
): Promise<number | null> {
  try {
    const supabase = createClient();
    
    // Get metric configuration
    const { data: metric, error: metricError } = await supabase
      .from('metrics')
      .select('baseline_method, baseline_manual_value')
      .eq('id', metricId)
      .single();
    
    if (metricError) {
      console.error('[getBaseline] Error fetching metric:', metricError);
      return null;
    }
    
    if (!metric) {
      console.warn('[getBaseline] Metric not found:', metricId);
      return null;
    }
    
    // Manual baseline - use configured value
    if (metric.baseline_method === 'manual') {
      return metric.baseline_manual_value || null;
    }
    
    // Rolling average or percentile - query materialized view
    const { data: baseline, error: baselineError } = await supabase
      .from('metric_baselines')
      .select('*')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .single();
    
    if (baselineError) {
      // Not found is expected for new metrics/athletes
      if (baselineError.code === 'PGRST116') {
        console.debug('[getBaseline] No baseline data yet:', { metricId, athleteId });
        return null;
      }
      
      console.error('[getBaseline] Error fetching baseline:', baselineError);
      return null;
    }
    
    if (!baseline) {
      return null;
    }
    
    // Return appropriate value based on method
    if (metric.baseline_method === 'rolling-average') {
      return baseline.baseline_avg;
    }
    
    if (metric.baseline_method === 'percentile') {
      return baseline.baseline_median;
    }
    
    // Fallback to average
    return baseline.baseline_avg;
    
  } catch (error) {
    console.error('[getBaseline] Unexpected error:', error);
    return null;
  }
}

// ============================================
// GET BASELINE DETAILS
// ============================================

/**
 * Get full baseline details including stddev, min, max
 * Useful for displaying baseline info to user
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @returns Full baseline object or null
 */
export async function getBaselineDetails(
  metricId: string,
  athleteId: string
): Promise<MetricBaseline | null> {
  try {
    const supabase = createClient();
    
    const { data: baseline, error } = await supabase
      .from('metric_baselines')
      .select('*')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getBaselineDetails] Error:', error);
      return null;
    }
    
    return baseline;
    
  } catch (error) {
    console.error('[getBaselineDetails] Unexpected error:', error);
    return null;
  }
}

// ============================================
// GET BASELINES FOR ATHLETE
// ============================================

/**
 * Get all baselines for an athlete
 * 
 * @param athleteId - Athlete UUID
 * @returns Array of baselines
 */
export async function getBaselinesForAthlete(
  athleteId: string
): Promise<MetricBaseline[]> {
  try {
    const supabase = createClient();
    
    const { data: baselines, error } = await supabase
      .from('metric_baselines')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('last_updated', { ascending: false });
    
    if (error) {
      console.error('[getBaselinesForAthlete] Error:', error);
      return [];
    }
    
    return baselines || [];
    
  } catch (error) {
    console.error('[getBaselinesForAthlete] Unexpected error:', error);
    return [];
  }
}

// ============================================
// CHECK BASELINE AVAILABILITY
// ============================================

/**
 * Check if baseline is available and recent
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param maxAgeDays - Maximum age of baseline in days (default: 7)
 * @returns True if baseline exists and is recent
 */
export async function hasRecentBaseline(
  metricId: string,
  athleteId: string,
  maxAgeDays: number = 7
): Promise<boolean> {
  try {
    const baseline = await getBaselineDetails(metricId, athleteId);
    
    if (!baseline) return false;
    
    const lastUpdated = new Date(baseline.lastUpdated);
    const maxAge = new Date();
    maxAge.setDate(maxAge.getDate() - maxAgeDays);
    
    return lastUpdated >= maxAge;
    
  } catch (error) {
    console.error('[hasRecentBaseline] Unexpected error:', error);
    return false;
  }
}

// ============================================
// REFRESH BASELINES (trigger)
// ============================================

/**
 * Trigger baseline refresh (calls PostgreSQL function)
 * Should be called daily via cron
 * 
 * @returns True if successful
 */
export async function refreshBaselines(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase.rpc('refresh_metric_baselines');
    
    if (error) {
      console.error('[refreshBaselines] Error:', error);
      return false;
    }
    
    console.log('[refreshBaselines] Success');
    return true;
    
  } catch (error) {
    console.error('[refreshBaselines] Unexpected error:', error);
    return false;
  }
}

// ============================================
// GET BASELINE WITH FALLBACK
// ============================================

/**
 * Get baseline with absolute value fallback
 * Used by decision engine when rule has absoluteValue
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param fallbackValue - Value to use if no baseline
 * @returns Baseline or fallback value
 */
export async function getBaselineOrFallback(
  metricId: string,
  athleteId: string,
  fallbackValue?: number
): Promise<number | null> {
  const baseline = await getBaseline(metricId, athleteId);
  
  if (baseline !== null) {
    return baseline;
  }
  
  if (fallbackValue !== undefined) {
    console.debug('[getBaselineOrFallback] Using fallback:', fallbackValue);
    return fallbackValue;
  }
  
  return null;
}

// ============================================
// VALIDATE BASELINE REQUIREMENTS
// ============================================

/**
 * Check if metric has enough data for baseline calculation
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param minSamples - Minimum samples required (default: 7)
 * @returns True if enough data exists
 */
export async function hasEnoughDataForBaseline(
  metricId: string,
  athleteId: string,
  minSamples: number = 7
): Promise<boolean> {
  try {
    const baseline = await getBaselineDetails(metricId, athleteId);
    
    if (!baseline) return false;
    
    return baseline.sampleSize >= minSamples;
    
  } catch (error) {
    console.error('[hasEnoughDataForBaseline] Unexpected error:', error);
    return false;
  }
}

// ============================================
// EXPORTS
// ============================================

export {
  getBaseline,
  getBaselineDetails,
  getBaselinesForAthlete,
  hasRecentBaseline,
  refreshBaselines,
  getBaselineOrFallback,
  hasEnoughDataForBaseline,
};