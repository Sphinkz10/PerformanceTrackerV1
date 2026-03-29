/**
 * SPRINT 0: Metric Aggregation
 * Handles multiple values per day using configured aggregation method
 */

import { createClient } from '@/lib/supabase/server';
import type { MetricAggregationMethod } from '@/types/metrics';

// ============================================
// GET AGGREGATED VALUE
// ============================================

/**
 * Get aggregated metric value for a specific day
 * Uses metric's configured aggregation_method
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param date - Date to aggregate (defaults to today)
 * @returns Aggregated value or null
 */
export async function getAggregatedValue(
  metricId: string,
  athleteId: string,
  date: Date = new Date()
): Promise<number | null> {
  try {
    const supabase = createClient();
    
    // Get metric definition
    const { data: metric, error: metricError } = await supabase
      .from('metrics')
      .select('aggregation_method, type')
      .eq('id', metricId)
      .single();
    
    if (metricError || !metric) {
      console.error('[getAggregatedValue] Error fetching metric:', metricError);
      return null;
    }
    
    // Only aggregate numeric values
    if (metric.type !== 'scale' && metric.type !== 'count' && metric.type !== 'duration') {
      console.warn('[getAggregatedValue] Cannot aggregate non-numeric metric:', metric.type);
      return null;
    }
    
    // Get all values for that day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: updates, error: updatesError } = await supabase
      .from('metric_updates')
      .select('value_numeric, timestamp')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString())
      .order('timestamp', { ascending: false });
    
    if (updatesError) {
      console.error('[getAggregatedValue] Error fetching updates:', updatesError);
      return null;
    }
    
    if (!updates || updates.length === 0) {
      return null;
    }
    
    // Filter out nulls
    const values = updates
      .map(u => u.value_numeric)
      .filter((v): v is number => v !== null && v !== undefined);
    
    if (values.length === 0) {
      return null;
    }
    
    // Single value - no aggregation needed
    if (values.length === 1) {
      return values[0];
    }
    
    // Aggregate based on method
    const method = metric.aggregation_method as MetricAggregationMethod;
    
    return aggregateValues(values, method);
    
  } catch (error) {
    console.error('[getAggregatedValue] Unexpected error:', error);
    return null;
  }
}

// ============================================
// AGGREGATE VALUES
// ============================================

/**
 * Apply aggregation method to array of values
 * 
 * @param values - Array of numeric values
 * @param method - Aggregation method
 * @returns Aggregated value
 */
export function aggregateValues(
  values: number[],
  method: MetricAggregationMethod
): number {
  if (values.length === 0) {
    throw new Error('Cannot aggregate empty array');
  }
  
  switch (method) {
    case 'latest':
      return values[0];  // Already ordered by timestamp DESC
    
    case 'average':
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    
    case 'sum':
      return values.reduce((sum, val) => sum + val, 0);
    
    case 'max':
      return Math.max(...values);
    
    case 'min':
      return Math.min(...values);
    
    default:
      console.warn('[aggregateValues] Unknown method:', method);
      return values[0];
  }
}

// ============================================
// GET AGGREGATED VALUES FOR PERIOD
// ============================================

/**
 * Get aggregated values for each day in a date range
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Array of { date, value } objects
 */
export async function getAggregatedValuesForPeriod(
  metricId: string,
  athleteId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; value: number; count: number }>> {
  try {
    const results: Array<{ date: string; value: number; count: number }> = [];
    
    // Iterate through each day
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const value = await getAggregatedValue(metricId, athleteId, currentDate);
      
      if (value !== null) {
        results.push({
          date: currentDate.toISOString().split('T')[0],
          value,
          count: 1,  // TODO: Could track actual count if needed
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return results;
    
  } catch (error) {
    console.error('[getAggregatedValuesForPeriod] Unexpected error:', error);
    return [];
  }
}

// ============================================
// GET RAW VALUES FOR DAY
// ============================================

/**
 * Get all raw (non-aggregated) values for a day
 * Useful for displaying breakdown to user
 * 
 * @param metricId - Metric UUID
 * @param athleteId - Athlete UUID
 * @param date - Date to fetch
 * @returns Array of raw values with timestamps
 */
export async function getRawValuesForDay(
  metricId: string,
  athleteId: string,
  date: Date = new Date()
): Promise<Array<{ value: number; timestamp: string; sourceType: string }>> {
  try {
    const supabase = createClient();
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: updates, error } = await supabase
      .from('metric_updates')
      .select('value_numeric, timestamp, source_type')
      .eq('metric_id', metricId)
      .eq('athlete_id', athleteId)
      .eq('is_valid', true)
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString())
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('[getRawValuesForDay] Error:', error);
      return [];
    }
    
    if (!updates) return [];
    
    return updates
      .filter(u => u.value_numeric !== null)
      .map(u => ({
        value: u.value_numeric!,
        timestamp: u.timestamp,
        sourceType: u.source_type,
      }));
    
  } catch (error) {
    console.error('[getRawValuesForDay] Unexpected error:', error);
    return [];
  }
}

// ============================================
// PREVIEW AGGREGATION
// ============================================

/**
 * Preview what aggregated value would be with different methods
 * Useful for UI to show user different aggregation options
 * 
 * @param values - Array of values to aggregate
 * @returns Object with all aggregation results
 */
export function previewAllAggregations(values: number[]): Record<MetricAggregationMethod, number> {
  if (values.length === 0) {
    return {
      latest: 0,
      average: 0,
      sum: 0,
      max: 0,
      min: 0,
    };
  }
  
  return {
    latest: values[values.length - 1],  // Assume sorted by time
    average: aggregateValues(values, 'average'),
    sum: aggregateValues(values, 'sum'),
    max: aggregateValues(values, 'max'),
    min: aggregateValues(values, 'min'),
  };
}

// ============================================
// DETECT BEST AGGREGATION METHOD
// ============================================

/**
 * Suggest best aggregation method based on metric characteristics
 * 
 * @param metricName - Name of metric
 * @param values - Sample values (to detect patterns)
 * @returns Suggested aggregation method
 */
export function detectBestAggregationMethod(
  metricName: string,
  values: number[]
): MetricAggregationMethod {
  const name = metricName.toLowerCase();
  
  // Load/volume metrics should sum
  if (name.includes('volume') || name.includes('load') || name.includes('distance')) {
    return 'sum';
  }
  
  // Intensity/effort metrics should use max (worst case)
  if (name.includes('rpe') || name.includes('pain') || name.includes('stress')) {
    return 'max';
  }
  
  // HRV should use max (higher is better)
  if (name.includes('hrv')) {
    return 'max';
  }
  
  // Resting HR should use min (lower is better)
  if (name.includes('rhr') || name.includes('resting heart')) {
    return 'min';
  }
  
  // Quality/recovery metrics should average
  if (name.includes('quality') || name.includes('recovery') || name.includes('sleep')) {
    return 'average';
  }
  
  // If values don't vary much, use latest
  if (values.length > 1) {
    const variance = calculateVariance(values);
    if (variance < 0.1) {
      return 'latest';
    }
  }
  
  // Default: use latest (most conservative)
  return 'latest';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return variance;
}

// ============================================
// EXPORTS
// ============================================

export {
  getAggregatedValue,
  aggregateValues,
  getAggregatedValuesForPeriod,
  getRawValuesForDay,
  previewAllAggregations,
  detectBestAggregationMethod,
};