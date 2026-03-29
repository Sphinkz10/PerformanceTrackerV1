/**
 * Transformation Utilities
 * 
 * Shared transformation logic extracted from useFormSubmission hook.
 * Can be used in preview components and submission flow.
 */

import type { TransformFunction } from '@/types/metrics';
import { safeEvaluateFormula, isFormulaSafe } from '@/utils/safeFormulaEvaluator';

/**
 * Apply transformation function to value
 * 
 * IMPORTANT: This is extracted from useFormSubmission.ts to avoid duplication.
 * Any changes here should be synchronized with the hook.
 */
export function applyTransformation(
  value: any,
  transformFunction: TransformFunction,
  params?: Record<string, any>
): any {
  // Validate numeric value for numeric transforms
  const numericTransforms = ['scale', 'multiply', 'divide', 'offset', 'invert', 'round', 
                              'multiply_by_10', 'multiply_by_100', 'divide_by_10',
                              'kg_to_lbs', 'lbs_to_kg', 'cm_to_m', 'm_to_cm',
                              'minutes_to_seconds', 'seconds_to_minutes'];
  
  if (numericTransforms.includes(transformFunction)) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error(`Transform ${transformFunction} requires numeric value`);
    }
    // Use numValue for calculations below
    value = numValue;
  }

  switch (transformFunction) {
    case 'none':
      // No transformation
      return value;

    case 'scale':
      // Scale from one range to another
      if (params?.fromMin !== undefined && params?.fromMax !== undefined &&
          params?.toMin !== undefined && params?.toMax !== undefined) {
        // VALIDATE: fromMax !== fromMin (prevent division by zero)
        if (params.fromMax === params.fromMin) {
          throw new Error('Scale transform: fromMax cannot equal fromMin');
        }
        const normalized = (value - params.fromMin) / (params.fromMax - params.fromMin);
        let result = params.toMin + normalized * (params.toMax - params.toMin);
        
        // Clamp result to output range (prevent extrapolation)
        result = Math.max(params.toMin, Math.min(params.toMax, result));
        
        return result;
      }
      return value;

    case 'multiply':
      // Multiply by constant
      if (params?.factor !== undefined) {
        return value * params.factor;
      }
      return value;

    case 'divide':
      // Divide by constant
      if (params?.divisor !== undefined) {
        // VALIDATE: divisor !== 0 (prevent division by zero)
        if (params.divisor === 0) {
          throw new Error('Divide transform: divisor cannot be zero');
        }
        return value / params.divisor;
      }
      return value;

    case 'offset':
      // Add/subtract constant
      if (params?.offset !== undefined) {
        return value + params.offset;
      }
      return value;

    case 'invert':
      // Invert scale (e.g., 10 → 1, 1 → 10)
      if (params?.max !== undefined) {
        return params.max - value;
      }
      return value;

    case 'boolean':
      // Convert to boolean properly
      if (value === 'true' || value === 1 || value === true) {
        return true;
      }
      if (value === 'false' || value === 0 || value === false) {
        return false;
      }
      return Boolean(value);

    case 'round':
      // Round to decimals
      const decimals = Math.max(0, params?.decimals ?? 0);
      return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

    // ========================================================================
    // LEGACY TRANSFORMS (convenience shortcuts)
    // ========================================================================

    case 'multiply_by_10':
      return value * 10;

    case 'multiply_by_100':
      return value * 100;

    case 'divide_by_10':
      return value / 10;

    case 'kg_to_lbs':
      // 1 kg = 2.20462 lbs
      return value * 2.20462;

    case 'lbs_to_kg':
      // 1 lb = 0.453592 kg
      return value / 2.20462;

    case 'cm_to_m':
      // 100 cm = 1 m
      return value / 100;

    case 'm_to_cm':
      // 1 m = 100 cm
      return value * 100;

    case 'minutes_to_seconds':
      // 1 minute = 60 seconds
      return value * 60;

    case 'seconds_to_minutes':
      // 60 seconds = 1 minute
      return value / 60;

    // ========================================================================
    // ADVANCED TRANSFORMS
    // ========================================================================

    case 'custom':
      // Custom formula
      if (params?.formula) {
        return evaluateFormula(params.formula, value, params);
      }
      return value;

    default:
      throw new Error(`Unknown transform function: ${transformFunction}`);
  }
}

/**
 * Evaluate custom formula safely
 * 
 * @security Uses safe recursive descent parser instead of new Function() (SEC-001 fix)
 */
function evaluateFormula(formula: string, value: any, params?: Record<string, any>): any {
  try {
    // Safety check first
    if (!isFormulaSafe(formula)) {
      throw new Error('Formula contains unsafe patterns');
    }

    // Build variables from context
    const variables: Record<string, number> = {
      value: typeof value === 'number' ? value : 0,
    };

    // Add numeric params as variables
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (typeof val === 'number' && key !== 'formula') {
          variables[key] = val;
        }
      }
    }

    // Evaluate using safe parser
    const result = safeEvaluateFormula(formula, variables);

    // Validate result
    if (typeof result === 'number' && !isFinite(result)) {
      throw new Error('Formula produced invalid result (Infinity or NaN)');
    }

    return result;
  } catch (error) {
    throw new Error(`Formula evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate transformation configuration
 */
export function validateTransformation(
  transformFunction: TransformFunction,
  params?: Record<string, any>
): { isValid: boolean; error?: string } {
  try {
    // Test with a sample value
    applyTransformation(10, transformFunction, params);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
}

/**
 * Get transformation description
 */
export function getTransformationDescription(
  transformFunction: TransformFunction,
  params?: Record<string, any>
): string {
  switch (transformFunction) {
    case 'none':
      return 'Sem transformação';
    
    case 'multiply':
      return `Multiplicar por ${params?.factor || '?'}`;
    
    case 'divide':
      return `Dividir por ${params?.divisor || '?'}`;
    
    case 'offset':
      return `Adicionar ${params?.offset || '?'}`;
    
    case 'scale':
      return `Escalar ${params?.fromMin}-${params?.fromMax} → ${params?.toMin}-${params?.toMax}`;
    
    case 'invert':
      return `Inverter escala (max: ${params?.max || '?'})`;
    
    case 'round':
      return `Arredondar (${params?.decimals || 0} casas)`;
    
    case 'kg_to_lbs':
      return 'Converter kg → lbs';
    
    case 'lbs_to_kg':
      return 'Converter lbs → kg';
    
    case 'cm_to_m':
      return 'Converter cm → m';
    
    case 'm_to_cm':
      return 'Converter m → cm';
    
    case 'minutes_to_seconds':
      return 'Converter min → seg';
    
    case 'seconds_to_minutes':
      return 'Converter seg → min';
    
    case 'custom':
      return `Fórmula: ${params?.formula || 'não definida'}`;
    
    default:
      return transformFunction;
  }
}
