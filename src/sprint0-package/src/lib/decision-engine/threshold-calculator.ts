/**
 * SPRINT 0: Threshold Calculator
 * Calculates athlete-specific thresholds using baselines
 * FIXED: Proper handling of outside-range operator with min/max thresholds
 */

import { getBaselineOrFallback } from '@/lib/metrics/baselines';
import type { RuleCondition, RuleOperator, ThresholdResult } from '@/types/decisions';

// ============================================
// CALCULATE THRESHOLD
// ============================================

/**
 * Calculate threshold for a rule condition
 * Supports both absolute and baseline-relative operators
 * 
 * @param condition - Rule condition with operator and value
 * @param athleteId - Athlete UUID (for baseline lookup)
 * @param currentValue - Current metric value
 * @returns Threshold result with exceeded status
 */
export async function calculateThreshold(
  condition: RuleCondition,
  athleteId: string,
  currentValue: number
): Promise<ThresholdResult | null> {
  try {
    // Check if operator requires baseline
    const isBaselineOperator = ['below-baseline', 'above-baseline', 'outside-range'].includes(
      condition.operator
    );
    
    let baseline = 0;
    
    if (isBaselineOperator) {
      // Try to get baseline
      const baselineValue = await getBaselineOrFallback(
        condition.metricId,
        athleteId,
        condition.absoluteValue
      );
      
      if (baselineValue === null) {
        console.warn('[calculateThreshold] No baseline or fallback available');
        return null;
      }
      
      baseline = baselineValue;
    }
    
    // Calculate threshold based on operator
    let threshold: number | undefined;
    let thresholdMin: number | undefined;
    let thresholdMax: number | undefined;
    let exceeded: boolean;
    
    switch (condition.operator) {
      case 'below-baseline': {
        // Example: value=20 means 20% below baseline
        // If baseline=70, threshold=56 (70 * 0.8)
        threshold = baseline * (1 - condition.value / 100);
        exceeded = currentValue < threshold;
        break;
      }
      
      case 'above-baseline': {
        // Example: value=20 means 20% above baseline
        // If baseline=70, threshold=84 (70 * 1.2)
        threshold = baseline * (1 + condition.value / 100);
        exceeded = currentValue > threshold;
        break;
      }
      
      case 'outside-range': {
        // Example: value=15 means ±15% of baseline
        // If baseline=70, range=[59.5, 80.5]
        const deviation = baseline * (condition.value / 100);
        thresholdMin = baseline - deviation;
        thresholdMax = baseline + deviation;
        exceeded = currentValue < thresholdMin || currentValue > thresholdMax;
        break;
      }
      
      case 'less-than': {
        threshold = condition.value;
        exceeded = currentValue < threshold;
        break;
      }
      
      case 'greater-than': {
        threshold = condition.value;
        exceeded = currentValue > threshold;
        break;
      }
      
      case 'equals': {
        threshold = condition.value;
        exceeded = currentValue === threshold;
        break;
      }
      
      default: {
        console.error('[calculateThreshold] Unknown operator:', condition.operator);
        return null;
      }
    }
    
    // Calculate percent from baseline
    const percentFromBaseline = baseline > 0
      ? ((currentValue - baseline) / baseline) * 100
      : 0;
    
    return {
      threshold,
      thresholdMin,
      thresholdMax,
      baseline,
      currentValue,
      percentFromBaseline: parseFloat(percentFromBaseline.toFixed(1)),
      exceeded,
      operator: condition.operator,
      rawConditionValue: condition.value,
    };
    
  } catch (error) {
    console.error('[calculateThreshold] Unexpected error:', error);
    return null;
  }
}

// ============================================
// EVALUATE CONDITION
// ============================================

/**
 * Evaluate if a condition is met (simplified, no baseline lookup)
 * Used when you already have the threshold calculated
 * 
 * @param value - Current value
 * @param operator - Rule operator
 * @param threshold - Threshold value (or min for range)
 * @param thresholdMax - Max threshold (for range operator)
 * @returns True if condition is met
 */
export function evaluateCondition(
  value: number,
  operator: RuleOperator,
  threshold: number,
  thresholdMax?: number
): boolean {
  switch (operator) {
    case 'below-baseline':
    case 'less-than':
      return value < threshold;
    
    case 'above-baseline':
    case 'greater-than':
      return value > threshold;
    
    case 'outside-range':
      if (thresholdMax === undefined) {
        console.error('[evaluateCondition] outside-range requires thresholdMax');
        return false;
      }
      return value < threshold || value > thresholdMax;
    
    case 'equals':
      return value === threshold;
    
    default:
      return false;
  }
}

// ============================================
// BATCH CALCULATE THRESHOLDS
// ============================================

/**
 * Calculate thresholds for multiple conditions at once
 * More efficient than individual calls
 * 
 * @param conditions - Array of rule conditions
 * @param athleteId - Athlete UUID
 * @param metricValues - Map of metricId -> current value
 * @returns Array of threshold results
 */
export async function calculateThresholds(
  conditions: RuleCondition[],
  athleteId: string,
  metricValues: Record<string, number>
): Promise<Array<ThresholdResult | null>> {
  return Promise.all(
    conditions.map(async (condition) => {
      const currentValue = metricValues[condition.metricId];
      
      if (currentValue === undefined) {
        console.warn('[calculateThresholds] No value for metric:', condition.metricId);
        return null;
      }
      
      return calculateThreshold(condition, athleteId, currentValue);
    })
  );
}

// ============================================
// EXPLAIN THRESHOLD
// ============================================

/**
 * Generate human-readable explanation of threshold
 * For UI display and debugging
 * 
 * @param result - Threshold calculation result
 * @param metricName - Name of metric (for display)
 * @returns Explanation string
 */
export function explainThreshold(
  result: ThresholdResult,
  metricName: string
): string {
  const { operator, currentValue, threshold, thresholdMin, thresholdMax, baseline, percentFromBaseline } = result;
  
  switch (operator) {
    case 'below-baseline':
      return `${metricName} is ${currentValue.toFixed(1)} (${percentFromBaseline.toFixed(1)}% from baseline). ` +
             `Threshold: below ${threshold!.toFixed(1)} (${result.rawConditionValue}% below baseline of ${baseline.toFixed(1)})`;
    
    case 'above-baseline':
      return `${metricName} is ${currentValue.toFixed(1)} (${percentFromBaseline.toFixed(1)}% from baseline). ` +
             `Threshold: above ${threshold!.toFixed(1)} (${result.rawConditionValue}% above baseline of ${baseline.toFixed(1)})`;
    
    case 'outside-range':
      return `${metricName} is ${currentValue.toFixed(1)} (${percentFromBaseline.toFixed(1)}% from baseline). ` +
             `Acceptable range: ${thresholdMin!.toFixed(1)} - ${thresholdMax!.toFixed(1)} ` +
             `(±${result.rawConditionValue}% of baseline ${baseline.toFixed(1)})`;
    
    case 'less-than':
      return `${metricName} is ${currentValue.toFixed(1)}. Threshold: less than ${threshold!.toFixed(1)}`;
    
    case 'greater-than':
      return `${metricName} is ${currentValue.toFixed(1)}. Threshold: greater than ${threshold!.toFixed(1)}`;
    
    case 'equals':
      return `${metricName} is ${currentValue.toFixed(1)}. Threshold: equals ${threshold!.toFixed(1)}`;
    
    default:
      return `${metricName}: ${currentValue.toFixed(1)}`;
  }
}

// ============================================
// VALIDATE CONDITION
// ============================================

/**
 * Validate that a condition is properly configured
 * 
 * @param condition - Rule condition to validate
 * @returns Validation result with errors
 */
export function validateCondition(condition: RuleCondition): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!condition.metricId) {
    errors.push('Metric ID is required');
  }
  
  if (!condition.operator) {
    errors.push('Operator is required');
  }
  
  if (condition.value === undefined || condition.value === null) {
    errors.push('Value is required');
  }
  
  // Baseline operators should have fallback
  const isBaselineOperator = ['below-baseline', 'above-baseline', 'outside-range'].includes(
    condition.operator
  );
  
  if (isBaselineOperator && condition.absoluteValue === undefined) {
    // Warning, not error - will just skip if no baseline
    console.warn('[validateCondition] Baseline operator without fallback - will skip if baseline unavailable');
  }
  
  // Percentage values should be positive
  if (isBaselineOperator && condition.value < 0) {
    errors.push('Percentage value must be positive');
  }
  
  if (isBaselineOperator && condition.value > 100) {
    console.warn('[validateCondition] Percentage > 100% - unusual but allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// GET THRESHOLD DISPLAY
// ============================================

/**
 * Get display-friendly threshold value(s)
 * Handles both single thresholds and ranges
 * 
 * @param result - Threshold calculation result
 * @param decimals - Number of decimal places (default: 1)
 * @returns Display string
 */
export function getThresholdDisplay(
  result: ThresholdResult,
  decimals: number = 1
): string {
  if (result.thresholdMin !== undefined && result.thresholdMax !== undefined) {
    return `${result.thresholdMin.toFixed(decimals)} - ${result.thresholdMax.toFixed(decimals)}`;
  }
  
  if (result.threshold !== undefined) {
    return result.threshold.toFixed(decimals);
  }
  
  return 'N/A';
}

// ============================================
// EXPORTS
// ============================================

export {
  calculateThreshold,
  evaluateCondition,
  calculateThresholds,
  explainThreshold,
  validateCondition,
  getThresholdDisplay,
};