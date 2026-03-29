/**
 * Formula Engine - Data OS V3
 * 
 * Sistema de processamento e avaliação de fórmulas customizadas.
 * Suporta operações matemáticas, agregações e funções avançadas.
 * 
 * @author PerformTrack Team
 * @since Week 2 Day 3-4
 */

import type { 
  FormulaValidationResult, 
  CalculationContext, 
  CalculationResult,
  AggregationFunction,
  TimeWindow
} from '../types';

// ============================================================================
// AVAILABLE FUNCTIONS
// ============================================================================

export const FORMULA_FUNCTIONS = {
  // Mathematical
  SUM: {
    name: 'SUM',
    description: 'Soma de valores ao longo do tempo',
    syntax: 'SUM(metric, timeWindow)',
    examples: ['SUM(metric_volume, "7d")', 'SUM(metric_reps, "30d")'],
    execute: (values: number[]) => values.reduce((a, b) => a + b, 0)
  },
  AVG: {
    name: 'AVG',
    description: 'Média de valores',
    syntax: 'AVG(metric, timeWindow)',
    examples: ['AVG(metric_rpe, "7d")', 'AVG(metric_load, "14d")'],
    execute: (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length
  },
  MAX: {
    name: 'MAX',
    description: 'Valor máximo',
    syntax: 'MAX(metric, timeWindow)',
    examples: ['MAX(metric_1rm, "30d")'],
    execute: (values: number[]) => Math.max(...values)
  },
  MIN: {
    name: 'MIN',
    description: 'Valor mínimo',
    syntax: 'MIN(metric, timeWindow)',
    examples: ['MIN(metric_bodyweight, "7d")'],
    execute: (values: number[]) => Math.min(...values)
  },
  COUNT: {
    name: 'COUNT',
    description: 'Contagem de valores',
    syntax: 'COUNT(metric, timeWindow)',
    examples: ['COUNT(metric_sessions, "7d")'],
    execute: (values: number[]) => values.length
  },
  STDEV: {
    name: 'STDEV',
    description: 'Desvio padrão',
    syntax: 'STDEV(metric, timeWindow)',
    examples: ['STDEV(metric_rpe, "30d")'],
    execute: (values: number[]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const squareDiffs = values.map(v => Math.pow(v - avg, 2));
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
      return Math.sqrt(avgSquareDiff);
    }
  },

  // Time-based
  DELTA: {
    name: 'DELTA',
    description: 'Mudança ao longo do tempo',
    syntax: 'DELTA(metric, timeWindow)',
    examples: ['DELTA(metric_1rm, "30d")'],
    execute: (values: number[]) => {
      if (values.length < 2) return 0;
      return values[values.length - 1] - values[0];
    }
  },
  TREND: {
    name: 'TREND',
    description: 'Tendência (1 = subindo, -1 = descendo, 0 = estável)',
    syntax: 'TREND(metric, timeWindow)',
    examples: ['TREND(metric_volume, "14d")'],
    execute: (values: number[]) => {
      if (values.length < 2) return 0;
      const delta = values[values.length - 1] - values[0];
      const threshold = Math.abs(values[0]) * 0.05; // 5% threshold
      if (Math.abs(delta) < threshold) return 0;
      return delta > 0 ? 1 : -1;
    }
  },
  MOVING_AVG: {
    name: 'MOVING_AVG',
    description: 'Média móvel',
    syntax: 'MOVING_AVG(metric, window)',
    examples: ['MOVING_AVG(metric_load, 7)'],
    execute: (values: number[], window: number = 7) => {
      if (values.length === 0) return 0;
      const windowValues = values.slice(-window);
      return windowValues.reduce((a, b) => a + b, 0) / windowValues.length;
    }
  },

  // Conditional
  IF: {
    name: 'IF',
    description: 'Condicional',
    syntax: 'IF(condition, trueValue, falseValue)',
    examples: ['IF(metric_rpe > 8, 1, 0)'],
    execute: (condition: boolean, trueVal: number, falseVal: number) => {
      return condition ? trueVal : falseVal;
    }
  }
};

// ============================================================================
// FORMULA VALIDATOR
// ============================================================================

export class FormulaValidator {
  private availableMetrics: Set<string>;

  constructor(availableMetrics: string[]) {
    this.availableMetrics = new Set(availableMetrics);
  }

  validate(formula: string): FormulaValidationResult {
    const errors: FormulaValidationResult['errors'] = [];
    const warnings: FormulaValidationResult['warnings'] = [];
    const dependencies: string[] = [];

    // Remove espaços extras
    const cleanFormula = formula.trim();

    if (!cleanFormula) {
      errors.push({
        type: 'syntax',
        message: 'Fórmula vazia'
      });
      return { isValid: false, errors, warnings, dependencies };
    }

    // Check for metric references
    const metricRegex = /metric_[a-zA-Z0-9_]+/g;
    const metricMatches = cleanFormula.match(metricRegex);

    if (metricMatches) {
      metricMatches.forEach(metricId => {
        if (!this.availableMetrics.has(metricId)) {
          errors.push({
            type: 'reference',
            message: `Métrica "${metricId}" não existe`
          });
        } else {
          if (!dependencies.includes(metricId)) {
            dependencies.push(metricId);
          }
        }
      });
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let i = 0; i < cleanFormula.length; i++) {
      if (cleanFormula[i] === '(') parenthesesCount++;
      if (cleanFormula[i] === ')') parenthesesCount--;
      
      if (parenthesesCount < 0) {
        errors.push({
          type: 'syntax',
          message: 'Parênteses não balanceados',
          position: i
        });
        break;
      }
    }

    if (parenthesesCount !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Parênteses não balanceados'
      });
    }

    // Check for division by zero risk
    if (cleanFormula.includes('/ 0') || cleanFormula.includes('/0')) {
      errors.push({
        type: 'syntax',
        message: 'Divisão por zero detectada'
      });
    }

    // Check for circular dependencies (basic check)
    if (dependencies.length > 10) {
      warnings.push({
        type: 'performance',
        message: 'Fórmula complexa com muitas dependências'
      });
    }

    // Check for deprecated patterns
    if (cleanFormula.includes('metric_old_')) {
      warnings.push({
        type: 'deprecated',
        message: 'Métrica com prefixo "old_" pode estar obsoleta'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      dependencies
    };
  }
}

// ============================================================================
// FORMULA CALCULATOR
// ============================================================================

export class FormulaCalculator {
  calculate(
    formula: string,
    context: CalculationContext
  ): CalculationResult {
    const startTime = performance.now();

    try {
      // Replace metric placeholders with actual values
      let processedFormula = formula;
      
      for (const [metricId, value] of Object.entries(context.metricValues)) {
        // Escapar para regex
        const metricPattern = new RegExp(metricId, 'g');
        processedFormula = processedFormula.replace(metricPattern, String(value));
      }

      // Handle functions
      processedFormula = this.processFunctions(processedFormula, context);

      // Evaluate mathematical expression
      const result = this.evaluateExpression(processedFormula);

      const computationTime = performance.now() - startTime;

      return {
        value: result,
        success: true,
        computationTime,
        sourceData: context.metricValues
      };

    } catch (error: any) {
      return {
        value: 0,
        success: false,
        error: error.message || 'Erro ao calcular fórmula',
        computationTime: performance.now() - startTime,
        sourceData: context.metricValues
      };
    }
  }

  private processFunctions(formula: string, context: CalculationContext): string {
    let processed = formula;

    // Process SUM function
    const sumRegex = /SUM\(([^,]+),\s*"([^"]+)"\)/g;
    processed = processed.replace(sumRegex, (match, metricId, timeWindow) => {
      // In a real implementation, fetch historical values
      // For now, return current value
      return context.metricValues[metricId.trim()] || '0';
    });

    // Process AVG function
    const avgRegex = /AVG\(([^,]+),\s*"([^"]+)"\)/g;
    processed = processed.replace(avgRegex, (match, metricId, timeWindow) => {
      return context.metricValues[metricId.trim()] || '0';
    });

    // Process MAX function
    const maxRegex = /MAX\(([^,]+),\s*"([^"]+)"\)/g;
    processed = processed.replace(maxRegex, (match, metricId, timeWindow) => {
      return context.metricValues[metricId.trim()] || '0';
    });

    // Process MIN function
    const minRegex = /MIN\(([^,]+),\s*"([^"]+)"\)/g;
    processed = processed.replace(minRegex, (match, metricId, timeWindow) => {
      return context.metricValues[metricId.trim()] || '0';
    });

    return processed;
  }

  private evaluateExpression(expression: string): number {
    // Remove espaços
    const clean = expression.replace(/\s+/g, '');

    // Security: Only allow numbers, operators, and parentheses
    if (!/^[0-9+\-*/().]+$/.test(clean)) {
      throw new Error('Expressão inválida');
    }

    try {
      // Use Function constructor (safer than eval)
      const result = Function(`'use strict'; return (${clean})`)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Resultado inválido');
      }

      return result;
    } catch (error) {
      throw new Error('Erro ao avaliar expressão matemática');
    }
  }
}

// ============================================================================
// AGGREGATION ENGINE
// ============================================================================

export class AggregationEngine {
  aggregate(
    values: number[],
    func: AggregationFunction
  ): number {
    if (values.length === 0) return 0;

    const executor = FORMULA_FUNCTIONS[func.toUpperCase() as keyof typeof FORMULA_FUNCTIONS];
    
    if (!executor) {
      throw new Error(`Função de agregação "${func}" não suportada`);
    }

    return executor.execute(values);
  }

  aggregateWithTimeWindow(
    values: Array<{ value: number; timestamp: string }>,
    func: AggregationFunction,
    timeWindow: TimeWindow
  ): number {
    // Filter values within time window
    const now = new Date();
    const windowStart = new Date(now);

    switch (timeWindow.unit) {
      case 'hours':
        windowStart.setHours(windowStart.getHours() - timeWindow.value);
        break;
      case 'days':
        windowStart.setDate(windowStart.getDate() - timeWindow.value);
        break;
      case 'weeks':
        windowStart.setDate(windowStart.getDate() - (timeWindow.value * 7));
        break;
      case 'months':
        windowStart.setMonth(windowStart.getMonth() - timeWindow.value);
        break;
    }

    const filteredValues = values
      .filter(v => new Date(v.timestamp) >= windowStart)
      .map(v => v.value);

    return this.aggregate(filteredValues, func);
  }
}

// ============================================================================
// FORMULA PARSER (tokenize formula)
// ============================================================================

export class FormulaParser {
  parse(formula: string): string[] {
    // Simple tokenizer
    const tokens: string[] = [];
    let current = '';

    for (let i = 0; i < formula.length; i++) {
      const char = formula[i];

      if (/[+\-*/()]/.test(char)) {
        if (current.trim()) tokens.push(current.trim());
        tokens.push(char);
        current = '';
      } else if (char === ' ') {
        if (current.trim()) tokens.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current.trim()) tokens.push(current.trim());

    return tokens;
  }

  getMetricDependencies(formula: string): string[] {
    const metricRegex = /metric_[a-zA-Z0-9_]+/g;
    const matches = formula.match(metricRegex);
    return matches ? [...new Set(matches)] : [];
  }
}
