/**
 * SPRINT 0: Metrics Type Definitions
 * Updated with new fields: tags, aggregation_method, baseline_*, source_priority
 */

import { safeEvaluateFormula, isFormulaSafe } from '@/utils/safeFormulaEvaluator';

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
  
  // Template & Pack flags
  isTemplate?: boolean;      // TRUE if this is a template metric (in library)
  isFromPack?: boolean;      // TRUE if this metric comes from a store pack
  
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

export interface MetricValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// ============================================
// VALIDATION & HELPERS
// ============================================

/**
 * Validate a metric object
 */
export function validateMetric(metric: Partial<Metric>): MetricValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!metric.name?.trim()) errors.push('Name is required');
  if (!metric.type) errors.push('Type is required');
  if (!metric.category) errors.push('Category is required');
  if (!metric.updateFrequency) errors.push('Update frequency is required');
  if (!metric.aggregationMethod) errors.push('Aggregation method is required');
  if (!metric.baselineMethod) errors.push('Baseline method is required');
  
  // Scale validation
  if (metric.type === 'scale') {
    if (metric.scaleMin === undefined || metric.scaleMin === null) {
      errors.push('Scale minimum is required for scale type');
    }
    if (metric.scaleMax === undefined || metric.scaleMax === null) {
      errors.push('Scale maximum is required for scale type');
    }
    if (metric.scaleMin !== undefined && metric.scaleMax !== undefined && metric.scaleMin >= metric.scaleMax) {
      errors.push('Scale minimum must be less than maximum');
    }
  }
  
  // Baseline validation
  if (metric.baselineMethod === 'manual' && !metric.baselineManualValue) {
    errors.push('Manual baseline value is required when using manual baseline method');
  }
  
  if (metric.baselineMethod === 'rolling-average' && !metric.baselinePeriodDays) {
    warnings.push('Baseline period not set, defaulting to 28 days');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

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
  return '-';
}

/**
 * Get zone for a numeric value
 */
export function getZoneForValue(value: number, metric: Metric): MetricZone | undefined {
  if (!metric.zones || metric.zones.length === 0) return undefined;
  return metric.zones.find(zone => value >= zone.min && value <= zone.max);
}

/**
 * Check if baseline can be calculated for metric
 */
export function canCalculateBaseline(metric: Metric): boolean {
  return metric.type === 'scale' && metric.baselineMethod !== 'manual';
}

/**
 * Get suggested aggregation method based on metric type and category
 */
export function getSuggestedAggregationMethod(
  type: MetricType,
  category: MetricCategory
): MetricAggregationMethod {
  // RPE, pain scales → use max (worst case)
  if (type === 'scale' && (category === 'wellness' || category === 'readiness')) {
    return 'max';
  }
  
  // Load metrics → sum
  if (category === 'load') {
    return 'sum';
  }
  
  // Performance metrics → max
  if (category === 'performance') {
    return 'max';
  }
  
  // Default → latest
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

// Functions and constants are already exported inline above
// (export const SOURCE_PRIORITY, export function validateMetric, etc.)

// ============================================
// FORM FIELD METRIC LINKS (FASE 6)
// ============================================

/**
 * Form Field (from Form Builder)
 * Represents a field in a custom form
 */
export interface FormField {
  id: string;
  formId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date' | 'time' | 'email' | 'phone' | 'file';
  required: boolean;
  order: number;
  
  // Optional field configuration
  options?: Array<{ label: string; value: string }>; // For select/radio fields
  min?: number; // For number fields
  max?: number; // For number fields
  placeholder?: string;
  description?: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
}

/**
 * Type of mapping between form field and metric
 */
export type FormFieldMetricMappingType = 
  | 'direct'      // Field value → metric value (1:1)
  | 'calculated'  // Field value used in calculation
  | 'conditional'; // Only map if condition met

/**
 * Transform function for field-to-metric value conversion
 */
export type TransformFunction = 
  | 'none'
  | 'scale'           // Scale from one range to another
  | 'multiply'        // Multiply by constant
  | 'divide'          // Divide by constant
  | 'offset'          // Add/subtract constant
  | 'invert'          // Invert scale (e.g., 10 → 1)
  | 'boolean'         // Convert to boolean
  | 'round'           // Round to decimals
  | 'custom'          // Custom formula (advanced)
  // Legacy/specific transforms
  | 'multiply_by_10'
  | 'multiply_by_100'
  | 'divide_by_10'
  | 'kg_to_lbs'
  | 'lbs_to_kg'
  | 'cm_to_m'
  | 'm_to_cm'
  | 'minutes_to_seconds'
  | 'seconds_to_minutes';

/**
 * Conditional operator for conditional mapping
 */
export type ConditionalOperator = 
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'contains'
  | 'not_contains';

/**
 * Link between a form field and a metric
 */
export interface FormFieldMetricLink {
  id: string;
  
  // Foreign keys
  workspaceId: string;
  formId: string;
  fieldId: string;
  metricId: string;
  
  // Link configuration
  mappingType: FormFieldMetricMappingType;
  
  // Transformation rules (optional)
  transformFunction?: TransformFunction;
  transformParams?: Record<string, any>;
  
  // Conditional mapping (optional)
  conditionFieldId?: string;
  conditionOperator?: ConditionalOperator;
  conditionValue?: string;
  
  // Metadata
  isActive: boolean;
  autoCreateOnSubmit: boolean; // Auto-create metric update on form submit
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

/**
 * Link with metric details
 */
export interface FormFieldMetricLinkWithDetails extends FormFieldMetricLink {
  metric: Metric;
  fieldName?: string;
  fieldType?: string;
}

/**
 * Request to create a form field metric link
 */
export interface CreateFormFieldMetricLinkRequest {
  workspaceId: string;
  formId: string;
  fieldId: string;
  metricId: string;
  mappingType?: FormFieldMetricMappingType;
  transformFunction?: TransformFunction;
  transformParams?: Record<string, any>;
  autoCreateOnSubmit?: boolean;
}

/**
 * Request to update a form field metric link
 */
export interface UpdateFormFieldMetricLinkRequest {
  mappingType?: FormFieldMetricMappingType;
  transformFunction?: TransformFunction;
  transformParams?: Record<string, any>;
  isActive?: boolean;
  autoCreateOnSubmit?: boolean;
}

/**
 * Field type to metric type compatibility matrix
 */
export interface FieldMetricCompatibility {
  fieldType: string;
  compatibleMetricTypes: MetricType[];
  requiresTransform: boolean;
  suggestedTransform?: TransformFunction;
}

/**
 * Compatibility check result
 */
export interface CompatibilityCheckResult {
  compatible: boolean;
  requiresTransform: boolean;
  suggestedTransform?: TransformFunction;
  warnings?: string[];
}

// ============================================
// FIELD-METRIC COMPATIBILITY HELPERS
// ============================================

/**
 * Compatibility matrix: form field type → compatible metric types
 */
export const FIELD_METRIC_COMPATIBILITY: Record<string, FieldMetricCompatibility> = {
  // Number field → numeric or scale metrics
  'number': {
    fieldType: 'number',
    compatibleMetricTypes: ['scale'],
    requiresTransform: false,
  },
  
  // Radio/Select → scale metrics (e.g., 1-5 rating)
  'radio': {
    fieldType: 'radio',
    compatibleMetricTypes: ['scale'],
    requiresTransform: false,
  },
  
  // Checkbox → boolean metrics
  'checkbox': {
    fieldType: 'checkbox',
    compatibleMetricTypes: ['boolean'],
    requiresTransform: false,
  },
  
  // Rating (stars) → scale or numeric
  'rating': {
    fieldType: 'rating',
    compatibleMetricTypes: ['scale'],
    requiresTransform: false,
  },
  
  // Text fields generally not compatible (need transformation)
  'text': {
    fieldType: 'text',
    compatibleMetricTypes: ['text'],
    requiresTransform: true,
  },
  
  'email': {
    fieldType: 'email',
    compatibleMetricTypes: [],
    requiresTransform: true,
  },
  
  'phone': {
    fieldType: 'phone',
    compatibleMetricTypes: [],
    requiresTransform: true,
  },
  
  // Date → duration (needs calculation)
  'date': {
    fieldType: 'date',
    compatibleMetricTypes: ['duration'],
    requiresTransform: true,
  },
};

/**
 * Check if field type is compatible with metric type
 */
export function checkFieldMetricCompatibility(
  fieldType: string,
  metricType: MetricType
): CompatibilityCheckResult {
  const compatibility = FIELD_METRIC_COMPATIBILITY[fieldType];
  
  if (!compatibility) {
    return {
      compatible: false,
      requiresTransform: false,
      warnings: [`Unknown field type: ${fieldType}`],
    };
  }
  
  const compatible = compatibility.compatibleMetricTypes.includes(metricType);
  
  return {
    compatible,
    requiresTransform: compatibility.requiresTransform,
    suggestedTransform: compatibility.suggestedTransform,
    warnings: compatible ? undefined : [
      `Field type "${fieldType}" is not directly compatible with metric type "${metricType}"`
    ],
  };
}

/**
 * Get compatible metric types for a field type
 */
export function getCompatibleMetricTypes(fieldType: string): MetricType[] {
  const compatibility = FIELD_METRIC_COMPATIBILITY[fieldType];
  return compatibility?.compatibleMetricTypes || [];
}

/**
 * Apply transformation to field value
 */
export function applyTransform(
  value: any,
  transformFunction: TransformFunction,
  params?: Record<string, any>
): number | string | boolean | null {
  switch (transformFunction) {
    case 'none':
      return value;
      
    case 'scale':
      // Scale from one range to another
      const fromMin = params?.fromMin || 0;
      const fromMax = params?.fromMax || 1;
      const toMin = params?.toMin || 0;
      const toMax = params?.toMax || 1;
      return typeof value === 'number' ? 
        ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin : null;
      
    case 'multiply':
      const multiplier = params?.multiplier || 1;
      return typeof value === 'number' ? value * multiplier : null;
      
    case 'divide':
      const divisor = params?.divisor || 1;
      return typeof value === 'number' ? value / divisor : null;
      
    case 'offset':
      const offset = params?.offset || 0;
      return typeof value === 'number' ? value + offset : null;
      
    case 'invert':
      const invertMax = params?.invertMax || 10;
      return typeof value === 'number' ? invertMax - value : null;
      
    case 'boolean':
      return !!value;
      
    case 'round':
      const decimals = params?.decimals || 0;
      return typeof value === 'number' ? parseFloat(value.toFixed(decimals)) : null;
      
    case 'custom':
      const formula = params?.formula || '';
      try {
        // Safe formula evaluation — no new Function() (SEC-001 fix)
        if (!isFormulaSafe(formula)) {
          console.error('Unsafe formula rejected:', formula);
          return value;
        }
        return safeEvaluateFormula(formula, { value: typeof value === 'number' ? value : 0 });
      } catch (e) {
        console.error('Invalid custom formula:', e);
        return value;
      }
      
    case 'multiply_by_10':
      return typeof value === 'number' ? value * 10 : null;
      
    case 'multiply_by_100':
      return typeof value === 'number' ? value * 100 : null;
      
    case 'divide_by_10':
      return typeof value === 'number' ? value / 10 : null;
      
    case 'kg_to_lbs':
      return typeof value === 'number' ? value * 2.20462 : null;
      
    case 'lbs_to_kg':
      return typeof value === 'number' ? value / 2.20462 : null;
      
    case 'cm_to_m':
      return typeof value === 'number' ? value / 100 : null;
      
    case 'm_to_cm':
      return typeof value === 'number' ? value * 100 : null;
      
    case 'minutes_to_seconds':
      return typeof value === 'number' ? value * 60 : null;
      
    case 'seconds_to_minutes':
      return typeof value === 'number' ? value / 60 : null;
      
    default:
      return value;
  }
}