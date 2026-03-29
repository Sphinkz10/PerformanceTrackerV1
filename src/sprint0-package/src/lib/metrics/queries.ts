/**
 * SPRINT 0: Metric Queries
 * Query functions with source priority and tie-breaker
 */

import { createClient } from '@/lib/supabase/server';
import type { MetricUpdate } from '@/types/metrics';

// ============================================
// GET LATEST METRIC VALUE
// ============================================

/**
 * Get latest metric value for athlete
 * Uses source_priority for conflict resolution
 * Includes tie-breaker on created_at
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @returns Latest metric update or null
 */
export async function getLatestMetricValue(
  metricId: string,
  athleteId: string
): Promise<MetricUpdate | null> {
  try {
    const supabase = createClient();
    
    // Priority order: source_priority DESC, timestamp DESC, created_at DESC (tie-breaker)
    const { data, error } = await supabase
      .from('metric_updates')
      .select('*')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .order('source_priority', { ascending: false })
      .order('timestamp', { ascending: false })
      .order('created_at', { ascending: false })  // Tie-breaker
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found - expected for new metrics
        return null;
      }
      console.error('[getLatestMetricValue] Error:', error);
      return null;
    }
    
    return data;
    
  } catch (error) {
    console.error('[getLatestMetricValue] Unexpected error:', error);
    return null;
  }
}

// ============================================
// GET LATEST METRIC VALUES (Multiple metrics)
// ============================================

/**
 * Get latest values for multiple metrics at once
 * More efficient than calling getLatestMetricValue in loop
 * 
 * @param metricIds - Array of metric UUIDs
 * @param athleteId - Athlete UUID
 * @returns Map of metricId -> MetricUpdate
 */
export async function getLatestMetricValues(
  metricIds: string[],
  athleteId: string
): Promise<Record<string, MetricUpdate>> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('metric_updates')
      .select('*')
      .in('metric_id', metricIds)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .order('source_priority', { ascending: false })
      .order('timestamp', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[getLatestMetricValues] Error:', error);
      return {};
    }
    
    if (!data) return {};
    
    // Group by metric_id and take first (highest priority/latest)
    const result: Record<string, MetricUpdate> = {};
    
    data.forEach(update => {
      if (!result[update.metric_id]) {
        result[update.metric_id] = update;
      }
    });
    
    return result;
    
  } catch (error) {
    console.error('[getLatestMetricValues] Unexpected error:', error);
    return {};
  }
}

// ============================================
// GET METRIC VALUES FOR PERIOD
// ============================================

/**
 * Get all metric values within a date range
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @param limit - Max results (default: 1000)
 * @returns Array of metric updates
 */
export async function getMetricValuesForPeriod(
  metricId: string,
  athleteId: string,
  startDate: string,
  endDate: string,
  limit: number = 1000
): Promise<MetricUpdate[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('metric_updates')
      .select('*')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('[getMetricValuesForPeriod] Error:', error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('[getMetricValuesForPeriod] Unexpected error:', error);
    return [];
  }
}

// ============================================
// GET METRIC VALUE AT TIMESTAMP
// ============================================

/**
 * Get metric value closest to a specific timestamp
 * Useful for "what was HRV on session day?"
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param timestamp - Target timestamp (ISO string)
 * @param maxHoursDiff - Max hours before/after timestamp (default: 24)
 * @returns Closest metric update or null
 */
export async function getMetricValueAtTimestamp(
  metricId: string,
  athleteId: string,
  timestamp: string,
  maxHoursDiff: number = 24
): Promise<MetricUpdate | null> {
  try {
    const supabase = createClient();
    
    const targetDate = new Date(timestamp);
    const minDate = new Date(targetDate);
    minDate.setHours(minDate.getHours() - maxHoursDiff);
    const maxDate = new Date(targetDate);
    maxDate.setHours(maxDate.getHours() + maxHoursDiff);
    
    const { data, error } = await supabase
      .from('metric_updates')
      .select('*')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .gte('timestamp', minDate.toISOString())
      .lte('timestamp', maxDate.toISOString())
      .order('source_priority', { ascending: false })
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('[getMetricValueAtTimestamp] Error:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Find closest to target timestamp
    let closest = data[0];
    let minDiff = Math.abs(new Date(data[0].timestamp).getTime() - targetDate.getTime());
    
    for (const update of data) {
      const diff = Math.abs(new Date(update.timestamp).getTime() - targetDate.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = update;
      }
    }
    
    return closest;
    
  } catch (error) {
    console.error('[getMetricValueAtTimestamp] Unexpected error:', error);
    return null;
  }
}

// ============================================
// GET ALL ATHLETE LATEST VALUES
// ============================================

/**
 * Get latest value for ALL metrics for an athlete
 * Useful for dashboard/overview
 * 
 * @param athleteId - Athlete UUID
 * @param workspaceId - Workspace UUID (for filtering metrics)
 * @returns Map of metricId -> value
 */
export async function getAllLatestValuesForAthlete(
  athleteId: string,
  workspaceId: string
): Promise<Record<string, number | boolean | string>> {
  try {
    const supabase = createClient();
    
    // Get all metrics for workspace
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('id, type')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true);
    
    if (metricsError || !metrics) {
      console.error('[getAllLatestValuesForAthlete] Error fetching metrics:', metricsError);
      return {};
    }
    
    const metricIds = metrics.map(m => m.id);
    
    // Get latest updates
    const updates = await getLatestMetricValues(metricIds, athleteId);
    
    // Extract values
    const result: Record<string, number | boolean | string> = {};
    
    Object.entries(updates).forEach(([metricId, update]) => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return;
      
      if (update.value_numeric !== null && update.value_numeric !== undefined) {
        result[metricId] = update.value_numeric;
      } else if (update.value_boolean !== null && update.value_boolean !== undefined) {
        result[metricId] = update.value_boolean;
      } else if (update.value_text !== null && update.value_text !== undefined) {
        result[metricId] = update.value_text;
      }
    });
    
    return result;
    
  } catch (error) {
    console.error('[getAllLatestValuesForAthlete] Unexpected error:', error);
    return {};
  }
}

// ============================================
// CHECK IF METRIC HAS DATA
// ============================================

/**
 * Check if athlete has any data for a metric
 * Useful before showing metric in UI
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @returns True if data exists
 */
export async function hasMetricData(
  metricId: string,
  athleteId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('metric_updates')
      .select('id')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return false;
      console.error('[hasMetricData] Error:', error);
      return false;
    }
    
    return !!data;
    
  } catch (error) {
    console.error('[hasMetricData] Unexpected error:', error);
    return false;
  }
}

// ============================================
// GET METRIC UPDATE COUNT
// ============================================

/**
 * Count total updates for a metric-athlete combination
 * Useful for data quality checks
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Count of updates
 */
export async function getMetricUpdateCount(
  metricId: string,
  athleteId: string,
  startDate?: string,
  endDate?: string
): Promise<number> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('metric_updates')
      .select('id', { count: 'exact', head: true })
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true);
    
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('[getMetricUpdateCount] Error:', error);
      return 0;
    }
    
    return count || 0;
    
  } catch (error) {
    console.error('[getMetricUpdateCount] Unexpected error:', error);
    return 0;
  }
}

// ============================================
// EXPORTS
// ============================================

export {
  getLatestMetricValue,
  getLatestMetricValues,
  getMetricValuesForPeriod,
  getMetricValueAtTimestamp,
  getAllLatestValuesForAthlete,
  hasMetricData,
  getMetricUpdateCount,
};