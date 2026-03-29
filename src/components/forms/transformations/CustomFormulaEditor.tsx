/**
 * CustomFormulaEditor Component
 * 
 * Editor for creating custom transformation formulas.
 * Provides syntax validation and variable suggestions.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, Code } from 'lucide-react';
import { applyTransformation } from '@/utils/transformations';

// ============================================================================
// TYPES
// ============================================================================

export interface CustomFormulaEditorProps {
  formula: string;
  onChange: (formula: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AVAILABLE_VARIABLES = [
  { name: 'value', description: 'Valor do campo de entrada', type: 'number' },
];

const AVAILABLE_FUNCTIONS = [
  'Math.round(x)',
  'Math.floor(x)',
  'Math.ceil(x)',
  'Math.abs(x)',
  'Math.sqrt(x)',
  'Math.pow(x, y)',
  'Math.min(x, y)',
  'Math.max(x, y)',
];

const EXAMPLE_FORMULAS = [
  { label: 'Fahrenheit → Celsius', formula: '(value - 32) * 5/9' },
  { label: 'Celsius → Fahrenheit', formula: '(value * 9/5) + 32' },
  { label: 'IMC (kg/m²)', formula: 'value / Math.pow(1.75, 2)' },
  { label: 'Percentagem de max', formula: '(value / 100) * 100' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const CustomFormulaEditor: React.FC<CustomFormulaEditorProps> = ({
  formula,
  onChange,
  onValidate,
  className = '',
}) => {
  const [testValue, setTestValue] = useState(10);

  // Validate formula
  const validation = useMemo(() => {
    if (!formula.trim()) {
      return {
        isValid: false,
        error: 'Fórmula vazia',
      };
    }

    try {
      // Test with sample value
      const result = applyTransformation(testValue, 'custom', { formula });

      // Check result
      if (typeof result !== 'number') {
        return {
          isValid: false,
          error: 'Fórmula deve retornar um número',
        };
      }

      if (!isFinite(result)) {
        return {
          isValid: false,
          error: 'Fórmula produz resultado inválido (Infinity ou NaN)',
        };
      }

      return {
        isValid: true,
        result,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }, [formula, testValue]);

  // Call onValidate when validation changes
  React.useEffect(() => {
    if (onValidate) {
      onValidate(validation.isValid, validation.error);
    }
  }, [validation, onValidate]);

  // Handle example click
  const handleExampleClick = useCallback((exampleFormula: string) => {
    onChange(exampleFormula);
  }, [onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Code className="h-4 w-4 text-violet-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Editor de Fórmula Personalizada
        </h3>
      </div>

      {/* Formula Input */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Fórmula:
        </label>
        <textarea
          value={formula}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: (value - 32) * 5/9"
          rows={3}
          className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
        />
      </div>

      {/* Validation Status */}
      <div className={`p-3 rounded-xl border ${
        validation.isValid
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-2">
          {validation.isValid ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-xs font-medium ${
              validation.isValid ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {validation.isValid ? '✅ Fórmula válida' : `❌ ${validation.error}`}
            </p>
          </div>
        </div>
      </div>

      {/* Test Value */}
      {validation.isValid && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Testar com valor:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={testValue}
              onChange={(e) => setTestValue(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200">
              <span className="text-xs text-sky-600">Resultado:</span>
              <span className="text-sm font-semibold text-sky-900">
                {validation.result !== undefined ? validation.result.toFixed(2) : '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Available Variables */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-medium text-slate-700 mb-2">
          Variáveis disponíveis:
        </p>
        <div className="space-y-1">
          {AVAILABLE_VARIABLES.map(variable => (
            <div key={variable.name} className="flex items-start gap-2">
              <code className="text-xs font-mono text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                {variable.name}
              </code>
              <p className="text-xs text-slate-600 flex-1">
                {variable.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Functions */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-medium text-slate-700 mb-2">
          Funções disponíveis:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_FUNCTIONS.map(func => (
            <code key={func} className="text-xs font-mono text-sky-600 bg-sky-50 px-2 py-1 rounded">
              {func}
            </code>
          ))}
        </div>
      </div>

      {/* Example Formulas */}
      <div>
        <p className="text-xs font-medium text-slate-700 mb-2">
          Exemplos:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {EXAMPLE_FORMULAS.map(example => (
            <button
              key={example.label}
              onClick={() => handleExampleClick(example.formula)}
              className="p-2 text-left rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-sky-300 transition-all"
            >
              <p className="text-xs font-medium text-slate-900 mb-1">
                {example.label}
              </p>
              <code className="text-xs font-mono text-slate-600">
                {example.formula}
              </code>
            </button>
          ))}
        </div>
      </div>

      {/* Security Warning */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>Nota:</strong> As fórmulas são avaliadas no contexto seguro.
            Apenas operações matemáticas básicas são suportadas.
          </p>
        </div>
      </div>
    </div>
  );
};
