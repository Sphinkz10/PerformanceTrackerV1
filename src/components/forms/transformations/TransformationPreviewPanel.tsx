/**
 * TransformationPreviewPanel Component
 * 
 * Shows real-time preview of transformation with multiple test cases.
 * Displays input → output with validation status.
 */

import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import type { TransformFunction } from '@/types/metrics';
import type { TransformPreviewTestCase, TransformPreviewResult } from '@/types/transformations';

// Import transformation logic from hook
// NOTE: We'll extract this to a shared utility
import { applyTransformation } from '@/utils/transformations';

// ============================================================================
// TYPES
// ============================================================================

export interface TransformationPreviewPanelProps {
  transformFunction: TransformFunction;
  transformParams?: Record<string, any>;
  fieldType?: string;
  metricType?: string;
  testValues?: TransformPreviewTestCase[];
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const TransformationPreviewPanel: React.FC<TransformationPreviewPanelProps> = ({
  transformFunction,
  transformParams,
  fieldType,
  metricType,
  testValues,
  className = '',
}) => {
  // Default test cases if none provided
  const defaultTestCases: TransformPreviewTestCase[] = useMemo(() => {
    if (fieldType === 'number' || metricType === 'numeric') {
      return [
        { input: 0, label: 'Zero' },
        { input: 10, label: 'Pequeno' },
        { input: 50, label: 'Médio' },
        { input: 100, label: 'Grande' },
        { input: -5, label: 'Negativo' },
      ];
    }
    
    return [
      { input: 0 },
      { input: 10 },
      { input: 50 },
      { input: 100 },
    ];
  }, [fieldType, metricType]);

  const testCases = testValues || defaultTestCases;

  // Apply transformation to all test cases
  const results: TransformPreviewResult[] = useMemo(() => {
    return testCases.map(testCase => {
      try {
        const output = applyTransformation(
          testCase.input,
          transformFunction,
          transformParams
        );

        // Check if output is valid
        const isValid = output !== null && 
                       output !== undefined && 
                       !isNaN(output) && 
                       isFinite(output);

        return {
          input: testCase.input,
          output,
          isValid,
        };
      } catch (error) {
        return {
          input: testCase.input,
          output: null,
          isValid: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      }
    });
  }, [testCases, transformFunction, transformParams]);

  // Get formula display
  const formulaDisplay = useMemo(() => {
    if (transformFunction === 'none') {
      return 'value (sem transformação)';
    }

    if (transformFunction === 'multiply' && transformParams?.factor) {
      return `value × ${transformParams.factor}`;
    }

    if (transformFunction === 'divide' && transformParams?.divisor) {
      return `value ÷ ${transformParams.divisor}`;
    }

    if (transformFunction === 'offset' && transformParams?.offset) {
      const sign = transformParams.offset >= 0 ? '+' : '';
      return `value ${sign}${transformParams.offset}`;
    }

    if (transformFunction === 'scale' && transformParams) {
      return `Escala ${transformParams.fromMin}-${transformParams.fromMax} → ${transformParams.toMin}-${transformParams.toMax}`;
    }

    if (transformFunction === 'invert' && transformParams?.max) {
      return `${transformParams.max} - value`;
    }

    if (transformFunction === 'round' && transformParams?.decimals !== undefined) {
      return `Arredondar(value, ${transformParams.decimals} casas)`;
    }

    if (transformFunction === 'kg_to_lbs') {
      return 'value × 2.20462';
    }

    if (transformFunction === 'lbs_to_kg') {
      return 'value ÷ 2.20462';
    }

    if (transformFunction === 'cm_to_m') {
      return 'value ÷ 100';
    }

    if (transformFunction === 'm_to_cm') {
      return 'value × 100';
    }

    if (transformFunction === 'minutes_to_seconds') {
      return 'value × 60';
    }

    if (transformFunction === 'seconds_to_minutes') {
      return 'value ÷ 60';
    }

    if (transformFunction === 'custom' && transformParams?.formula) {
      return transformParams.formula;
    }

    return transformFunction;
  }, [transformFunction, transformParams]);

  // Format value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '—';
    }

    if (typeof value === 'number') {
      // Round to 2 decimals for display
      return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }

    return String(value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Preview da Transformação
        </h3>
      </div>

      {/* Test Cases */}
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              result.isValid
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            {/* Input */}
            <div className="flex-1 text-right">
              <p className="text-sm font-semibold text-slate-900">
                {formatValue(result.input)}
              </p>
              {testCases[index]?.label && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {testCases[index].label}
                </p>
              )}
            </div>

            {/* Arrow */}
            <ArrowRight className={`h-4 w-4 shrink-0 ${
              result.isValid ? 'text-emerald-600' : 'text-red-600'
            }`} />

            {/* Output */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${
                  result.isValid ? 'text-emerald-900' : 'text-red-900'
                }`}>
                  {result.error ? 'ERRO' : formatValue(result.output)}
                </p>
                {result.isValid ? (
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-600" />
                )}
              </div>
              {result.error && (
                <p className="text-xs text-red-600 mt-0.5">
                  {result.error}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formula Display */}
      <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
        <p className="text-xs text-violet-600 font-medium mb-1">
          Fórmula:
        </p>
        <p className="text-sm font-mono text-violet-900">
          {formulaDisplay}
        </p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-emerald-600" />
          <span className="text-slate-600">
            {results.filter(r => r.isValid).length} válidos
          </span>
        </div>
        {results.some(r => !r.isValid) && (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-600" />
            <span className="text-slate-600">
              {results.filter(r => !r.isValid).length} erros
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
