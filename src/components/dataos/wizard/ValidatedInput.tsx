/**
 * VALIDATED INPUT
 * Input with real-time validation and visual feedback
 * 
 * FEATURES:
 * - Border colors (green/yellow/red)
 * - Validation icon
 * - Tooltip with error/warning message
 * - Smooth transitions
 */

'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';
import { useFieldValidation, ValidationRule } from '@/hooks/useFieldValidation';

interface ValidatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'url';
  rules?: ValidationRule[];
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ValidatedInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  rules = [],
  helpText,
  disabled = false,
  required = false,
}: ValidatedInputProps) {
  const {
    validationResult,
    touched,
    handleBlur,
    borderClass,
    icon,
    iconColorClass,
  } = useFieldValidation({
    initialValue: value,
    rules,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const showValidation = touched && validationResult.state !== 'idle';

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-semibold text-slate-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-12
            text-sm
            border-2 rounded-xl
            bg-white
            transition-all
            focus:outline-none focus:ring-2
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${borderClass}
          `}
        />

        {/* Validation Icon */}
        <AnimatePresence>
          {showValidation && icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {validationResult.state === 'valid' && (
                <CheckCircle className={`h-5 w-5 ${iconColorClass}`} />
              )}
              {validationResult.state === 'warning' && (
                <AlertCircle className={`h-5 w-5 ${iconColorClass}`} />
              )}
              {validationResult.state === 'invalid' && (
                <XCircle className={`h-5 w-5 ${iconColorClass}`} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Text / Validation Message */}
      <AnimatePresence mode="wait">
        {showValidation && validationResult.message ? (
          <motion.div
            key="validation"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`
              flex items-start gap-2 p-2 rounded-lg text-xs
              ${validationResult.state === 'valid' ? 'bg-emerald-50 text-emerald-700' : ''}
              ${validationResult.state === 'warning' ? 'bg-amber-50 text-amber-700' : ''}
              ${validationResult.state === 'invalid' ? 'bg-red-50 text-red-700' : ''}
            `}
          >
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{validationResult.message}</span>
          </motion.div>
        ) : helpText ? (
          <motion.p
            key="help"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-slate-600"
          >
            {helpText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
