/**
 * SPRINT 0: Metrics Type Definitions
 * Updated with new fields: tags, aggregation_method, baseline_*, source_priority
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type MetricType = 
  | 'scale'
  | 'boolean'
  | 'duration'
  | 'distance'
  | 'count'
  | 'text';

export type MetricCategory = 
  | 'performance'
  | 'wellness'
  | 'readiness'
  | 'load'
  | 'psychological'
  | 'custom';

export type MetricUpdateFrequency = 
  | 'daily'
  | 'per-session'
  | 'weekly'
  | 'on-demand';

export type MetricUpdateSourceType = 
  | 'manual_entry'
  | 'live_session'
  | 'form_submission'
  | 'sensor'
  | 'import'
  | 'calculation';

/**
 * NEW: Aggregation methods for multiple values in same day
 */
export type MetricAggregationMethod = 
  | 'latest'      // Use most recent value (default)
  | 'average'     // Average all values
  | 'sum'         // Sum all values (for load/volume)
  | 'max'         // Maximum value (for RPE, HRV)
  | 'min';        // Minimum value (for RHR)

/**
 * NEW: Baseline calculation methods
 */
export type MetricBaselineMethod = 
  | 'rolling-average'  // Rolling average over period
  | 'manual'           // Manually set baseline
  | 'percentile';      // Use median (50th percentile)

/**
 * NEW: Source priority for conflict resolution
 * Higher number = higher priority
 */
export const SOURCE_PRIORITY: Record<MetricUpdateSourceType, number> = {
  'manual_entry': 10,     // Highest - coach manually entered
  'live_session': 7,      // High - captured during session
  'calculation': 6,       // Medium-high - calculated from data
  'form_submission': 5,   // Medium - athlete self-report
  'sensor': 3,            // Low - automated sensor
  'import': 1,            // Lowest - bulk import
};

// ============================================
// METRIC DEFINITION
// ============================================

export interface Metric {
  id: string;
  workspaceId: string;
  
  // Basic info
  name: string;
  description?: string;
  type: MetricType;
  category: MetricCategory;
  
  // Configuration
  unit?: string;
  updateFrequency: MetricUpdateFrequency;
  
  // NEW: Tags for filtering/categorization
  tags: string[];  // e.g., ['dashboard', 'critical', 'hidden']
  
  // Scale configuration (if type = 'scale')
  scaleMin?: number;
  scaleMax?: number;
  
  // Zone configuration
  zones?: MetricZone[];
  
  // NEW: Aggregation for multiple values per day
  aggregationMethod: MetricAggregationMethod;
  
  // NEW: Baseline configuration
  baselineMethod: MetricBaselineMethod;
  baselinePeriodDays: number;           // Rolling period (default: 28)
  baselineManualValue?: number;         // If baseline_method = 'manual'
  
  // Pack association
  packId?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface MetricZone {
  id: string;
  name: string;
  color: string;
  min: number;
  max: number;
  description?: string;
}

// ============================================
// METRIC UPDATE
// ============================================

export interface MetricUpdate {
  id: string;
  metricId: string;
  athleteId: string;
  
  // Value (one of these based on metric type)
  valueNumeric?: number;
  valueBoolean?: boolean;
  valueText?: string;
  
  // Source tracking
  sourceType: MetricUpdateSourceType;
  sourceId?: string;  // ID of session, form, etc.
  
  // NEW: Priority for conflict resolution
  sourcePriority: number;
  
  // Context
  timestamp: string;
  notes?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  isValid: boolean;
}

// ============================================
// METRIC BASELINE (from materialized view)
// ============================================

/**
 * NEW: Pre-calculated baselines from materialized view
 * NOTE: baseline_period_days removed (see audit fix #2)
 */
export interface MetricBaseline {
  metricId: string;
  athleteId: string;
  
  // Calculated values
  baselineAvg: number;
  baselineMedian: number;
  baselineStddev: number;
  baselineMin: number;
  baselineMax: number;
  
  // Metadata
  sampleSize: number;
  lastUpdated: string;
}

// ============================================
// METRIC PACK
// ============================================

export interface MetricPack {
  id: string;
  
  // Basic info
  name: string;
  description?: string;
  category: MetricCategory;
  
  // Global vs workspace
  isGlobal: boolean;
  workspaceId?: string;  // NULL for global packs
  
  // Icon/visual
  icon?: string;
  color?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// ============================================
// METRIC PACK ACTIVATION (NEW TABLE)
// ============================================

/**
 * NEW: Tracks which packs are activated in which workspaces
 * Replaces workspace-specific pack copies
 */
export interface MetricPackActivation {
  id: string;
  packId: string;           // References global pack
  workspaceId: string;
  
  isActive: boolean;
  activatedAt: string;
  activatedBy?: string;
  deactivatedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Metric with activation status for a workspace
 */
export interface MetricPackWithActivation extends MetricPack {
  isActivated: boolean;
  activatedAt?: string;
  activation?: MetricPackActivation;
}

/**
 * Metric with latest value
 */
export interface MetricWithValue extends Metric {
  latestValue?: number | boolean | string;
  latestUpdate?: MetricUpdate;
  baseline?: number;
}

/**
 * Aggregated metric value for a day
 */
export interface AggregatedMetricValue {
  metricId: string;
  athleteId: string;
  date: string;
  value: number | boolean | string;
  count: number;  // Number of values aggregated
  method: MetricAggregationMethod;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateMetricRequest {
  workspaceId: string;
  name: string;
  description?: string;
  type: MetricType;
  category: MetricCategory;
  unit?: string;
  updateFrequency: MetricUpdateFrequency;
  tags?: string[];
  scaleMin?: number;
  scaleMax?: number;
  zones?: Omit<MetricZone, 'id'>[];
  aggregationMethod?: MetricAggregationMethod;
  baselineMethod?: MetricBaselineMethod;
  baselinePeriodDays?: number;
  packId?: string;
}

export interface UpdateMetricRequest extends Partial<CreateMetricRequest> {
  id: string;
}

export interface CreateMetricUpdateRequest {
  metricId: string;
  athleteId: string;
  value: number | boolean | string;
  sourceType: MetricUpdateSourceType;
  sourceId?: string;
  timestamp?: string;
  notes?: string;
}

export interface GetMetricUpdatesRequest {
  metricId?: string;
  athleteId?: string;
  startDate?: string;
  endDate?: string;
  sourceType?: MetricUpdateSourceType;
  limit?: number;
}

export interface ActivatePackRequest {
  packId: string;
  workspaceId: string;
}

// ============================================
// VALIDATION
// ============================================

export interface MetricValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export function validateMetric(metric: Partial<Metric>): MetricValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!metric.name) errors.push('Name is required');
  if (!metric.type) errors.push('Type is required');
  if (!metric.category) errors.push('Category is required');
  
  // Scale validation
  if (metric.type === 'scale') {
    if (metric.scaleMin === undefined) errors.push('scaleMin required for scale type');
    if (metric.scaleMax === undefined) errors.push('scaleMax required for scale type');
    if (metric.scaleMin !== undefined && metric.scaleMax !== undefined) {
      if (metric.scaleMin >= metric.scaleMax) {
        errors.push('scaleMin must be less than scaleMax');
      }
    }
  }
  
  // Baseline validation
  if (metric.baselineMethod === 'manual' && !metric.baselineManualValue) {
    warnings.push('Manual baseline method requires baselineManualValue');
  }
  
  if (metric.baselinePeriodDays && metric.baselinePeriodDays < 1) {
    errors.push('baselinePeriodDays must be at least 1');
  }
  
  // Zone validation
  if (metric.zones && metric.zones.length > 0) {
    // Check for overlaps
    for (let i = 0; i < metric.zones.length; i++) {
      for (let j = i + 1; j < metric.zones.length; j++) {
        const zone1 = metric.zones[i];
        const zone2 = metric.zones[j];
        if (zone1.max > zone2.min && zone1.min < zone2.max) {
          warnings.push(`Zones overlap: ${zone1.name} and ${zone2.name}`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get display value for metric update
 */
export function getDisplayValue(update: MetricUpdate, metric: Metric): string {
  if (update.valueNumeric !== null && update.valueNumeric !== undefined) {
    const value = update.valueNumeric.toFixed(metric.type === 'scale' ? 1 : 0);
    return metric.unit ? `${value} ${metric.unit}` : value;
  }
  
  if (update.valueBoolean !== null && update.valueBoolean !== undefined) {
    return update.valueBoolean ? 'Yes' : 'No';
  }
  
  if (update.valueText) {
    return update.valueText;
  }
  
  return 'N/A';
}

/**
 * Get zone for a value
 */
export function getZoneForValue(value: number, zones?: MetricZone[]): MetricZone | null {
  if (!zones || zones.length === 0) return null;
  
  return zones.find(zone => value >= zone.min && value <= zone.max) || null;
}

/**
 * Check if metric is ready for baseline calculation
 */
export function canCalculateBaseline(metric: Metric): boolean {
  if (metric.baselineMethod === 'manual') return false;
  if (metric.type !== 'scale') return false;
  return true;
}

/**
 * Get suggested aggregation method for metric type
 */
export function getSuggestedAggregationMethod(metric: Partial<Metric>): MetricAggregationMethod {
  const name = metric.name?.toLowerCase() || '';
  
  if (name.includes('volume') || name.includes('load') || name.includes('distance')) {
    return 'sum';
  }
  
  if (name.includes('rpe') || name.includes('pain') || name.includes('stress')) {
    return 'max';
  }
  
  if (name.includes('hrv')) {
    return 'max';  // Higher is better
  }
  
  if (name.includes('rhr') || name.includes('heart rate')) {
    return 'min';  // Lower is better for resting HR
  }
  
  if (name.includes('sleep') || name.includes('recovery') || name.includes('quality')) {
    return 'average';
  }
  
  return 'latest';
}

// ============================================
// EXPORTS
// ============================================

export type {
  Metric,
  MetricZone,
  MetricUpdate,
  MetricBaseline,
  MetricPack,
  MetricPackActivation,
  MetricPackWithActivation,
  MetricWithValue,
  AggregatedMetricValue,
  CreateMetricRequest,
  UpdateMetricRequest,
  CreateMetricUpdateRequest,
  GetMetricUpdatesRequest,
  ActivatePackRequest,
  MetricValidationResult,
};

export {
  SOURCE_PRIORITY,
  validateMetric,
  getDisplayValue,
  getZoneForValue,
  canCalculateBaseline,
  getSuggestedAggregationMethod,
};