/**
 * HOOK: useWizardAutoSave
 * Auto-save wizard data to localStorage + backend
 * 
 * FEATURES:
 * - Auto-save every 10s
 * - Save to localStorage (instant)
 * - Save to backend (debounced)
 * - Recovery on mount
 * - Clear on success
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface WizardDraft {
  id: string;
  timestamp: number;
  data: any;
  step: number;
  mode: 'quick' | 'full';
}

interface UseWizardAutoSaveOptions {
  workspaceId?: string;
  enabled?: boolean;
  autoSaveInterval?: number; // ms
}

export function useWizardAutoSave(
  data: any,
  currentStep: number,
  mode: 'quick' | 'full',
  options: UseWizardAutoSaveOptions = {}
) {
  const {
    workspaceId = 'default',
    enabled = true,
    autoSaveInterval = 10000, // 10s
  } = options;

  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const STORAGE_KEY = `wizard-draft-${workspaceId}`;

  // Save to localStorage
  const saveToLocalStorage = useCallback((draft: WizardDraft) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }, [STORAGE_KEY]);

  // Save to backend (simulated - replace with actual API call)
  const saveToBackend = useCallback(async (draft: WizardDraft) => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/wizard-drafts', {
      //   method: 'POST',
      //   body: JSON.stringify(draft),
      // });
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Failed to save to backend:', error);
      return false;
    }
  }, []);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!enabled || !hasUnsavedChanges) return;

    setIsSaving(true);

    const draft: WizardDraft = {
      id: `draft-${Date.now()}`,
      timestamp: Date.now(),
      data,
      step: currentStep,
      mode,
    };

    // Save to localStorage first (instant)
    const localSuccess = saveToLocalStorage(draft);

    // Then save to backend (async)
    if (localSuccess) {
      await saveToBackend(draft);
    }

    setLastSavedAt(Date.now());
    setIsSaving(false);
    setHasUnsavedChanges(false);
  }, [enabled, hasUnsavedChanges, data, currentStep, mode, saveToLocalStorage, saveToBackend]);

  // Load draft from localStorage
  const loadDraft = useCallback((): WizardDraft | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const draft = JSON.parse(stored) as WizardDraft;
      
      // Check if draft is not too old (24 hours)
      const age = Date.now() - draft.timestamp;
      const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
      
      if (age > MAX_AGE) {
        clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, [STORAGE_KEY]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSavedAt(null);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [STORAGE_KEY]);

  // Mark as changed when data changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [data, currentStep]);

  // Auto-save interval
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      autoSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [enabled, autoSaveInterval, autoSave]);

  // Save before unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        autoSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, hasUnsavedChanges, autoSave]);

  // Format last saved time
  const getLastSavedText = useCallback((): string | null => {
    if (!lastSavedAt) return null;

    const secondsAgo = Math.floor((Date.now() - lastSavedAt) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s atrás`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m atrás`;
    return `${Math.floor(secondsAgo / 3600)}h atrás`;
  }, [lastSavedAt]);

  return {
    // State
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
    lastSavedText: getLastSavedText(),

    // Actions
    autoSave,
    loadDraft,
    clearDraft,
    saveNow: autoSave,
  };
}
