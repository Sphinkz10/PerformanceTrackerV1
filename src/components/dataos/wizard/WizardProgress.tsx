/**
 * WIZARD PROGRESS - FASE 4 DIA 12
 * Responsive Progress Bar Component
 * 
 * FEATURES:
 * - Desktop: horizontal bar + step names
 * - Mobile: simplified bar (numbers only)
 * - Animated transitions (Motion)
 * - Color adapts to mode (emerald/sky)
 * - Clickable steps (optional navigation)
 */

'use client';

import { motion } from 'motion/react';

type WizardMode = 'quick' | 'full';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  mode: WizardMode;
  stepNames?: string[];
  onStepClick?: (step: number) => void;
  allowStepNavigation?: boolean;
  isMobile: boolean;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  mode,
  stepNames = [],
  onStepClick,
  allowStepNavigation = false,
  isMobile,
}: WizardProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  const getStepName = (step: number): string => {
    if (stepNames[step - 1]) return stepNames[step - 1];
    return `Passo ${step}`;
  };

  const handleStepClick = (step: number) => {
    if (allowStepNavigation && onStepClick && step <= currentStep) {
      onStepClick(step);
    }
  };

  const isStepClickable = (step: number): boolean => {
    return allowStepNavigation && step <= currentStep;
  };

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`h-full rounded-full ${
            mode === 'quick'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-r from-sky-500 to-sky-600'
          }`}
        />
      </div>

      {/* Step Indicators */}
      {mode === 'full' && (
        <div className={`flex ${isMobile ? 'justify-between' : 'justify-start gap-6'}`}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isFuture = step > currentStep;
            const clickable = isStepClickable(step);

            return (
              <motion.div
                key={step}
                whileHover={clickable ? { scale: 1.05 } : {}}
                whileTap={clickable ? { scale: 0.95 } : {}}
                onClick={() => handleStepClick(step)}
                className={`flex items-center gap-2 ${
                  isMobile ? 'flex-col' : 'flex-row'
                } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center rounded-full transition-all ${
                    isMobile ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
                  } font-bold ${
                    isCompleted
                      ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : step}
                </div>

                {/* Step Name (Desktop only) */}
                {!isMobile && (
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      isCurrent
                        ? 'text-sky-600'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {getStepName(step)}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Mode - Simple text */}
      {mode === 'quick' && !isMobile && (
        <div className="text-center">
          <span className="text-xs font-semibold text-emerald-600">
            Modo Rápido - 3 Campos Essenciais
          </span>
        </div>
      )}
    </div>
  );
}
