/**
 * DATA OS V2 - WIZARD TYPES
 * Complete type definitions for the metric creation wizard
 */

import type { Metric, MetricType, MetricCategory, MetricUpdateFrequency, MetricAggregationMethod, MetricBaselineMethod } from './metrics';

// ============================================================
// METRIC SOURCE TYPES
// ============================================================

export type MetricSourceType = 
  | 'exercise'
  | 'form'
  | 'session'
  | 'existing-metric'
  | 'external'
  | 'manual';

export interface MetricSource {
  type: MetricSourceType;
  id?: string;
  name: string;
  description: string;
  icon: string;
  config?: Record<string, any>;
}

// Exercise Source
export interface ExerciseSource extends MetricSource {
  type: 'exercise';
  exerciseId: string;
  exerciseName: string;
  dataField: 'max-load' | 'volume' | 'reps' | 'rpe' | 'technique' | 'time-under-tension' | 'velocity' | 'custom';
  customField?: string;
}

// Form Source
export interface FormSource extends MetricSource {
  type: 'form';
  formId: string;
  formName: string;
  fieldId: string;
  fieldName: string;
  fieldType: string;
}

// Session Source
export interface SessionSource extends MetricSource {
  type: 'session';
  dataField: 'duration' | 'rpe' | 'load' | 'exercises-completed' | 'completion-rate' | 'intensity' | 'custom';
  customField?: string;
}

// Existing Metric Source
export interface ExistingMetricSource extends MetricSource {
  type: 'existing-metric';
  metricId: string;
  metricName: string;
  transformation?: 'direct' | 'average-7d' | 'trend' | 'normalize' | 'vs-baseline' | 'combine';
  combineWithMetricId?: string;
  combineOperation?: 'add' | 'subtract' | 'multiply' | 'divide';
}

// External Source
export interface ExternalSource extends MetricSource {
  type: 'external';
  provider: 'apple-health' | 'garmin' | 'whoop' | 'strava' | 'fitbit' | 'polar' | 'custom';
  dataType: string;
  syncFrequency?: 'realtime' | 'hourly' | 'daily';
}

// Manual Source
export interface ManualSource extends MetricSource {
  type: 'manual';
  metricType: MetricType;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  category: MetricCategory;
}

export type AnyMetricSource = 
  | ExerciseSource 
  | FormSource 
  | SessionSource 
  | ExistingMetricSource 
  | ExternalSource 
  | ManualSource;

// ============================================================
// CONDITION TYPES
// ============================================================

export type ConditionOperator = '>' | '<' | '>=' | '<=' | '==' | '!=' | 'in' | 'not-in';
export type ConditionLogic = 'AND' | 'OR';

export interface Condition {
  id: string;
  metricId?: string;
  field: string;
  operator: ConditionOperator;
  value: any;
  unit?: string;
}

export interface ConditionGroup {
  logic: ConditionLogic;
  conditions: Condition[];
  subGroups?: ConditionGroup[];
}

export type TriggerType = 
  | 'always' 
  | 'value-threshold' 
  | 'change-threshold' 
  | 'outside-average' 
  | 'other-metric' 
  | 'complex';

export interface TriggerConfig {
  type: TriggerType;
  conditionGroup?: ConditionGroup;
  consecutiveDays?: number;
}

// ============================================================
// ACTION TYPES
// ============================================================

export type ActionType = 
  | 'calculate-statistic'
  | 'transform'
  | 'create-alert'
  | 'visualize';

// Calculate Statistic
export type StatisticType = 
  | 'average'
  | 'sum'
  | 'max'
  | 'min'
  | 'trend'
  | 'vs-baseline';

export interface CalculateStatisticAction {
  type: 'calculate-statistic';
  statistic: StatisticType;
  periodDays?: number;
  baselineMethod?: MetricBaselineMethod;
  baselinePeriodDays?: number;
  outputType?: 'absolute' | 'percentage' | 'z-score';
}

// Transform
export type TransformationType = 
  | 'normalize'
  | 'convert-units'
  | 'percentage-of-max'
  | 'composite-score'
  | 'custom-formula';

export interface CompositeScoreComponent {
  metricId: string;
  metricName: string;
  weight: number; // 0-1
  inverse?: boolean; // For negative metrics (e.g., fatigue)
}

export interface TransformAction {
  type: 'transform';
  transformation: TransformationType;
  targetScale?: [number, number]; // For normalize
  fromUnit?: string;
  toUnit?: string;
  components?: CompositeScoreComponent[]; // For composite score
  formula?: string; // For custom formula
  normalizeOutput?: boolean;
}

// Create Alert
export interface CreateAlertAction {
  type: 'create-alert';
  highThreshold?: number;
  lowThreshold?: number;
  notifyEmail?: string;
  notifyPush?: boolean;
  notifySlack?: string;
  autoSuggestAction?: boolean;
}

// Visualize
export type ChartType = 'line' | 'bar' | 'area' | 'gauge' | 'scatter';

export interface VisualizeAction {
  type: 'visualize';
  chartType: ChartType;
  color?: string;
  showBaseline?: boolean;
  showZones?: boolean;
  greenThreshold?: number;
  yellowThreshold?: number;
  redThreshold?: number;
}

export type AnyAction = 
  | CalculateStatisticAction 
  | TransformAction 
  | CreateAlertAction 
  | VisualizeAction;

// ============================================================
// TEMPLATE & DEPLOYMENT TYPES
// ============================================================

export interface TemplateConfig {
  saveAsTemplate: boolean;
  templateName?: string;
  templateDescription?: string;
  tags?: string[];
  isPublic?: boolean;
}

export type DeploymentTarget = 
  | 'all-athletes'
  | 'specific-group'
  | 'specific-athletes'
  | 'test-only';

export interface DeploymentConfig {
  target: DeploymentTarget;
  groupId?: string;
  athleteIds?: string[];
  automationEnabled?: boolean;
  automationSchedule?: 'after-session' | 'daily' | 'weekly' | 'custom';
  automationTime?: string; // HH:MM
  notifyOnMissingData?: boolean;
  includeInReports?: boolean;
}

// ============================================================
// WIZARD STATE
// ============================================================

export interface WizardState {
  // Current step (1-4)
  currentStep: 1 | 2 | 3 | 4;
  
  // Step 1: Source
  source: AnyMetricSource | null;
  
  // Step 2: Conditions
  trigger: TriggerConfig;
  
  // Step 3: Actions
  actions: AnyAction[];
  
  // Step 4: Template & Deployment
  metricName: string;
  metricDescription?: string;
  template: TemplateConfig;
  deployment: DeploymentConfig;
  
  // Metadata
  workspaceId: string;
  createdBy?: string;
}

// ============================================================
// WIZARD VALIDATION
// ============================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface StepValidation {
  step1: ValidationResult;
  step2: ValidationResult;
  step3: ValidationResult;
  step4: ValidationResult;
}

// ============================================================
// AI ASSISTANT TYPES
// ============================================================

export interface AIRequest {
  prompt: string;
  context: {
    currentStep: number;
    source?: AnyMetricSource;
    trigger?: TriggerConfig;
    actions?: AnyAction[];
  };
}

export interface AISuggestion {
  id: string;
  type: 'source' | 'condition' | 'action' | 'formula' | 'complete-config';
  suggestion: any;
  reasoning: string;
  confidence: number; // 0-1
  canApplyAutomatically: boolean;
}

export interface AIResponse {
  understood: boolean;
  suggestions: AISuggestion[];
  clarificationNeeded?: string;
}

// ============================================================
// HELPER TYPES
// ============================================================

export interface MetricPreview {
  name: string;
  type: MetricType;
  unit?: string;
  category: MetricCategory;
  source: string;
  formula?: string;
  exampleValue?: string;
}

export interface HistoricalTestResult {
  totalDataPoints: number;
  wouldTrigger: number;
  wouldNotTrigger: number;
  missedCases: number;
  falsePositives: number;
  accuracy: number;
  examples: Array<{
    date: string;
    athleteName: string;
    value: number;
    triggered: boolean;
    wasCorrect: boolean;
  }>;
}

// ============================================================
// EXPORT ALL
// ============================================================

export type {
  MetricSource,
  ExerciseSource,
  FormSource,
  SessionSource,
  ExistingMetricSource,
  ExternalSource,
  ManualSource,
  Condition,
  ConditionGroup,
  TriggerConfig,
  CalculateStatisticAction,
  TransformAction,
  CreateAlertAction,
  VisualizeAction,
  TemplateConfig,
  DeploymentConfig,
  WizardState,
  ValidationResult,
  StepValidation,
  AIRequest,
  AISuggestion,
  AIResponse,
  MetricPreview,
  HistoricalTestResult,
};
