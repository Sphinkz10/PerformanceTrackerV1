/**
 * SPRINT 0: Baseline Calculation
 * Fetches pre-calculated baselines from materialized view
 * With error handling and fallbacks
 * 
 * NOTE: Supabase imports commented out - uncomment when connecting DB
 */

// import { createClient } from '@/lib/supabase/server';
import type { MetricBaseline } from '@/types/metrics';

// ============================================
// PURE FUNCTIONS (No DB required)
// ============================================

/**
 * Check if baseline is available and recent
 * 
 * @param lastUpdated - Last update timestamp
 * @param maxAgeDays - Maximum age of baseline in days (default: 7)
 * @returns True if baseline is recent
 */
export function isBaselineRecent(
  lastUpdated: string,
  maxAgeDays: number = 7
): boolean {
  const lastUpdatedDate = new Date(lastUpdated);
  const maxAge = new Date();
  maxAge.setDate(maxAge.getDate() - maxAgeDays);
  
  return lastUpdatedDate >= maxAge;
}

/**
 * Check if enough data for baseline calculation
 * 
 * @param sampleSize - Number of data points
 * @param minSamples - Minimum samples required (default: 7)
 * @returns True if enough data exists
 */
export function hasEnoughSamples(
  sampleSize: number,
  minSamples: number = 7
): boolean {
  return sampleSize >= minSamples;
}

// ============================================
// DATABASE FUNCTIONS (COMMENTED - ENABLE WHEN SUPABASE READY)
// ============================================

/**
 * Get baseline value for a metric-athlete combination
 * Returns null if no baseline available
 * 
 * UNCOMMENT when Supabase is connected!
 */
/*
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
*/

/**
 * Get full baseline details including stddev, min, max
 * Useful for displaying baseline info to user
 * 
 * UNCOMMENT when Supabase is connected!
 */
/*
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
*/

/**
 * Get baseline with absolute value fallback
 * Used by decision engine when rule has absoluteValue
 * 
 * UNCOMMENT when Supabase is connected!
 */
/*
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
*/

/**
 * Trigger baseline refresh (calls PostgreSQL function)
 * Should be called daily via cron
 * 
 * UNCOMMENT when Supabase is connected!
 */
/*
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
*/

// ============================================
// EXPORTS
// ============================================

export {
  isBaselineRecent,
  hasEnoughSamples,
  // getBaseline,  // Uncomment when Supabase ready
  // getBaselineDetails,  // Uncomment when Supabase ready
  // getBaselineOrFallback,  // Uncomment when Supabase ready
  // refreshBaselines,  // Uncomment when Supabase ready
};
