/**
 * HOOK: useFieldValidation
 * Real-time field validation with visual feedback
 * 
 * FEATURES:
 * - Validates on change/blur
 * - Visual states: valid (green), warning (yellow), invalid (red)
 * - Tooltip messages
 * - Custom validation rules
 */

'use client';

import { useState, useCallback, useMemo } from 'react';

export type ValidationState = 'valid' | 'warning' | 'invalid' | 'idle';

export interface ValidationResult {
  state: ValidationState;
  message?: string;
}

export type ValidationRule = (value: any) => ValidationResult;

interface UseFieldValidationOptions {
  initialValue?: any;
  rules?: ValidationRule[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFieldValidation({
  initialValue = '',
  rules = [],
  validateOnChange = true,
  validateOnBlur = true,
}: UseFieldValidationOptions = {}) {
  const [value, setValue] = useState<any>(initialValue);
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    state: 'idle',
  });

  // Run validation
  const validate = useCallback((val: any): ValidationResult => {
    // Run all validation rules
    for (const rule of rules) {
      const result = rule(val);
      if (result.state !== 'valid' && result.state !== 'idle') {
        return result;
      }
    }

    // If all rules pass, return valid
    return { state: 'valid' };
  }, [rules]);

  // Handle value change
  const handleChange = useCallback((newValue: any) => {
    setValue(newValue);

    if (validateOnChange && touched) {
      const result = validate(newValue);
      setValidationResult(result);
    }
  }, [validateOnChange, touched, validate]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setTouched(true);

    if (validateOnBlur) {
      const result = validate(value);
      setValidationResult(result);
    }
  }, [validateOnBlur, value, validate]);

  // Force validation (useful for form submit)
  const forceValidate = useCallback(() => {
    setTouched(true);
    const result = validate(value);
    setValidationResult(result);
    return result;
  }, [value, validate]);

  // Reset validation
  const reset = useCallback(() => {
    setValue(initialValue);
    setTouched(false);
    setValidationResult({ state: 'idle' });
  }, [initialValue]);

  // Get border class based on state
  const borderClass = useMemo(() => {
    if (!touched || validationResult.state === 'idle') {
      return 'border-slate-200 focus:border-sky-300 focus:ring-sky-500/30';
    }

    switch (validationResult.state) {
      case 'valid':
        return 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-500/30';
      case 'warning':
        return 'border-amber-300 focus:border-amber-400 focus:ring-amber-500/30';
      case 'invalid':
        return 'border-red-300 focus:border-red-400 focus:ring-red-500/30';
      default:
        return 'border-slate-200 focus:border-sky-300 focus:ring-sky-500/30';
    }
  }, [touched, validationResult.state]);

  // Get icon based on state
  const icon = useMemo(() => {
    if (!touched || validationResult.state === 'idle') {
      return null;
    }

    switch (validationResult.state) {
      case 'valid':
        return '✓';
      case 'warning':
        return '⚠';
      case 'invalid':
        return '✗';
      default:
        return null;
    }
  }, [touched, validationResult.state]);

  // Get icon color class
  const iconColorClass = useMemo(() => {
    switch (validationResult.state) {
      case 'valid':
        return 'text-emerald-500';
      case 'warning':
        return 'text-amber-500';
      case 'invalid':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  }, [validationResult.state]);

  return {
    // Value
    value,
    setValue: handleChange,

    // Validation
    validationResult,
    isValid: validationResult.state === 'valid',
    isInvalid: validationResult.state === 'invalid',
    hasWarning: validationResult.state === 'warning',
    touched,
    
    // Handlers
    handleChange,
    handleBlur,
    forceValidate,
    reset,

    // Styling helpers
    borderClass,
    icon,
    iconColorClass,
  };
}

// ============================================================================
// COMMON VALIDATION RULES
// ============================================================================

export const ValidationRules = {
  required: (message = 'Campo obrigatório'): ValidationRule => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { state: 'invalid', message };
    }
    return { state: 'valid' };
  },

  minLength: (min: number, message?: string): ValidationRule => (value) => {
    if (typeof value === 'string' && value.length < min) {
      return {
        state: 'invalid',
        message: message || `Mínimo de ${min} caracteres`,
      };
    }
    return { state: 'valid' };
  },

  maxLength: (max: number, message?: string): ValidationRule => (value) => {
    if (typeof value === 'string' && value.length > max) {
      return {
        state: 'invalid',
        message: message || `Máximo de ${max} caracteres`,
      };
    }
    return { state: 'valid' };
  },

  min: (min: number, message?: string): ValidationRule => (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num < min) {
      return {
        state: 'invalid',
        message: message || `Valor mínimo: ${min}`,
      };
    }
    return { state: 'valid' };
  },

  max: (max: number, message?: string): ValidationRule => (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > max) {
      return {
        state: 'invalid',
        message: message || `Valor máximo: ${max}`,
      };
    }
    return { state: 'valid' };
  },

  number: (message = 'Deve ser um número'): ValidationRule => (value) => {
    if (value && isNaN(parseFloat(value))) {
      return { state: 'invalid', message };
    }
    return { state: 'valid' };
  },

  email: (message = 'Email inválido'): ValidationRule => (value) => {
    if (value && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { state: 'invalid', message };
      }
    }
    return { state: 'valid' };
  },

  url: (message = 'URL inválida'): ValidationRule => (value) => {
    if (value && typeof value === 'string') {
      try {
        new URL(value);
      } catch {
        return { state: 'invalid', message };
      }
    }
    return { state: 'valid' };
  },

  pattern: (regex: RegExp, message = 'Formato inválido'): ValidationRule => (value) => {
    if (value && typeof value === 'string' && !regex.test(value)) {
      return { state: 'invalid', message };
    }
    return { state: 'valid' };
  },

  custom: (validator: (value: any) => boolean, message: string): ValidationRule => (value) => {
    if (!validator(value)) {
      return { state: 'invalid', message };
    }
    return { state: 'valid' };
  },

  warning: (condition: (value: any) => boolean, message: string): ValidationRule => (value) => {
    if (condition(value)) {
      return { state: 'warning', message };
    }
    return { state: 'valid' };
  },
};
