/**
 * HOOK: useWizardKeyboardShortcuts
 * Keyboard shortcuts for wizard navigation
 * 
 * SHORTCUTS:
 * - Arrow Left (←): Previous step
 * - Arrow Right (→): Next step
 * - Enter: Next step / Create (on last step)
 * - Escape: Close wizard (with confirmation if unsaved)
 * - Ctrl/Cmd + S: Save draft
 * - Ctrl/Cmd + E: Export config
 */

'use client';

import { useEffect, useCallback } from 'react';

interface UseWizardKeyboardShortcutsOptions {
  enabled?: boolean;
  currentStep: number;
  totalSteps: number;
  hasUnsavedChanges: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onSubmit?: () => void;
}

export function useWizardKeyboardShortcuts({
  enabled = true,
  currentStep,
  totalSteps,
  hasUnsavedChanges,
  onPrevious,
  onNext,
  onClose,
  onSave,
  onExport,
  onSubmit,
}: UseWizardKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore if user is typing in input/textarea
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Ctrl/Cmd shortcuts even in inputs
      if (!e.ctrlKey && !e.metaKey) {
        return;
      }
    }

    // Arrow Left: Previous step
    if (e.key === 'ArrowLeft' && currentStep > 1) {
      e.preventDefault();
      onPrevious();
      return;
    }

    // Arrow Right: Next step
    if (e.key === 'ArrowRight' && currentStep < totalSteps) {
      e.preventDefault();
      onNext();
      return;
    }

    // Enter: Next step or Submit
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (currentStep === totalSteps && onSubmit) {
        onSubmit();
      } else if (currentStep < totalSteps) {
        onNext();
      }
      return;
    }

    // Escape: Close wizard
    if (e.key === 'Escape') {
      e.preventDefault();
      
      if (hasUnsavedChanges) {
        const confirmed = window.confirm(
          'Tens alterações não guardadas. Queres mesmo sair?'
        );
        if (confirmed) {
          onClose();
        }
      } else {
        onClose();
      }
      return;
    }

    // Ctrl/Cmd + S: Save draft
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (onSave) {
        onSave();
      }
      return;
    }

    // Ctrl/Cmd + E: Export config
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      if (onExport) {
        onExport();
      }
      return;
    }
  }, [
    enabled,
    currentStep,
    totalSteps,
    hasUnsavedChanges,
    onPrevious,
    onNext,
    onClose,
    onSave,
    onExport,
    onSubmit,
  ]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);

  return {
    // Return keyboard shortcuts info for display
    shortcuts: [
      { keys: ['←'], description: 'Passo anterior' },
      { keys: ['→'], description: 'Próximo passo' },
      { keys: ['Enter'], description: 'Próximo / Criar' },
      { keys: ['Esc'], description: 'Fechar wizard' },
      { keys: ['Ctrl', 'S'], description: 'Guardar rascunho' },
      { keys: ['Ctrl', 'E'], description: 'Exportar config' },
    ],
  };
}
