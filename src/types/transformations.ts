/**
 * Transformation System Types
 * 
 * Defines types for transformation templates, configurations,
 * and preview functionality.
 */

import type { TransformFunction } from './metrics';

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface TransformTemplate {
  id: string;
  name: string;
  description: string;
  category: TransformCategory;
  icon: string;
  transformFunction: TransformFunction;
  transformParams?: Record<string, any>;
  compatibleFieldTypes?: string[];
  compatibleMetricTypes?: string[];
  example?: {
    input: any;
    output: any;
  };
}

export type TransformCategory = 
  | 'weight'
  | 'distance'
  | 'time'
  | 'temperature'
  | 'scale'
  | 'custom'
  | 'other';

// ============================================================================
// PREVIEW TYPES
// ============================================================================

export interface TransformPreviewTestCase {
  input: any;
  expectedOutput?: any;
  label?: string;
}

export interface TransformPreviewResult {
  input: any;
  output: any;
  isValid: boolean;
  error?: string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface TransformationConfig {
  transformFunction: TransformFunction;
  transformParams?: Record<string, any>;
}

export interface UnitConversionConfig {
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
  factor: number;
  formula?: string;
}

export type UnitCategory = 
  | 'weight'
  | 'distance'
  | 'time'
  | 'temperature';

// ============================================================================
// UNIT DEFINITIONS
// ============================================================================

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
}

export interface UnitConversion {
  from: string;
  to: string;
  factor: number;
  formula?: string;
}

// ============================================================================
// FORMULA EDITOR TYPES
// ============================================================================

export interface FormulaValidationResult {
  isValid: boolean;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

export interface FormulaVariable {
  name: string;
  description: string;
  type: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  TransformTemplate,
  TransformCategory,
  TransformPreviewTestCase,
  TransformPreviewResult,
  TransformationConfig,
  UnitConversionConfig,
  UnitCategory,
  UnitDefinition,
  UnitConversion,
  FormulaValidationResult,
  FormulaVariable,
};
