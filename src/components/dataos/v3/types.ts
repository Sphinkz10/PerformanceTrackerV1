/**
 * Data OS V3 - Custom Metrics Types
 * 
 * IMPORTANTE: V3 ESTENDE V2, não substitui!
 * Todas as features V2 continuam funcionando.
 * 
 * @author PerformTrack Team
 * @since Week 2 Day 3-4 - Data OS V3
 */

// ============================================================================
// CUSTOM METRIC TYPES
// ============================================================================

export type FormulaType = 'simple' | 'aggregate' | 'composite' | 'conditional';

export type AggregationFunction = 
  | 'sum' 
  | 'avg' 
  | 'max' 
  | 'min' 
  | 'count' 
  | 'stdev'
  | 'median'
  | 'percentile';

export type TimeUnit = 'hours' | 'days' | 'weeks' | 'months';

export interface TimeWindow {
  value: number;
  unit: TimeUnit;
}

export interface FormulaFunction {
  name: string;
  description: string;
  syntax: string;
  examples: string[];
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

export interface CustomMetric {
  id: string;
  workspaceId: string;
  
  // Metadata
  name: string;
  description?: string;
  unit?: string;
  category?: string;
  tags?: string[];
  
  // Formula
  formulaType: FormulaType;
  formula: string;
  sourceMetrics: string[]; // IDs of metrics used in formula
  
  // Display
  displayConfig: {
    chartType?: 'line' | 'bar' | 'area' | 'pie' | 'scatter';
    colorScheme?: string;
    showBaseline?: boolean;
    showTrend?: boolean;
    decimals?: number;
  };
  
  // Aggregation (se type = 'aggregate')
  aggregation?: {
    function: AggregationFunction;
    timeWindow?: TimeWindow;
    groupBy?: 'day' | 'week' | 'month';
  };
  
  // Permissions
  visibility: 'workspace' | 'private' | 'public';
  createdBy: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CustomMetricValue {
  id: string;
  customMetricId: string;
  athleteId: string;
  
  value: number;
  computedAt: string;
  
  // Context (dados usados no cálculo)
  sourceData: Record<string, any>;
}

// ============================================================================
// FORMULA VALIDATION
// ============================================================================

export interface FormulaValidationResult {
  isValid: boolean;
  errors: Array<{
    type: 'syntax' | 'reference' | 'circular' | 'type';
    message: string;
    position?: number;
  }>;
  warnings: Array<{
    type: 'deprecated' | 'performance' | 'precision';
    message: string;
  }>;
  dependencies: string[]; // Metric IDs this formula depends on
}

// ============================================================================
// BUILDER STATES
// ============================================================================

export interface BuilderStep {
  id: 'info' | 'formula' | 'preview' | 'display';
  label: string;
  description: string;
  completed: boolean;
}

export interface BuilderState {
  currentStep: number;
  steps: BuilderStep[];
  metric: Partial<CustomMetric>;
  validation: FormulaValidationResult | null;
}

// ============================================================================
// FORMULA TOKENS (for visual builder)
// ============================================================================

export type TokenType = 'metric' | 'operator' | 'function' | 'number' | 'parenthesis';

export interface FormulaToken {
  type: TokenType;
  value: string;
  position: number;
  metadata?: {
    metricId?: string;
    metricName?: string;
    functionParams?: string[];
  };
}

// ============================================================================
// CALCULATION CONTEXT
// ============================================================================

export interface CalculationContext {
  athleteId: string;
  metricValues: Record<string, number>; // metricId -> value
  timestamp: string;
  timeWindow?: TimeWindow;
}

export interface CalculationResult {
  value: number;
  success: boolean;
  error?: string;
  computationTime?: number; // ms
  sourceData: Record<string, any>;
}

// ============================================================================
// PRESET TEMPLATES
// ============================================================================

export interface MetricTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  formula: string;
  formulaType: FormulaType;
  requiredMetrics: Array<{
    id: string;
    name: string;
    unit: string;
  }>;
  displayConfig: CustomMetric['displayConfig'];
}

// ============================================================================
// EXPORT CONFIG
// ============================================================================

export interface ExportConfig {
  format: 'json' | 'csv' | 'excel';
  includeSourceData: boolean;
  includeFormula: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  athletes?: string[];
}
