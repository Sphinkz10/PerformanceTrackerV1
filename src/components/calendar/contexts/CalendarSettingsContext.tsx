/**
 * CALENDAR SETTINGS CONTEXT
 * 
 * Global state management for calendar settings with localStorage persistence.
 * 
 * Features:
 * - Persist settings to localStorage
 * - Load settings on mount
 * - Apply settings to calendar behavior
 * - Type-safe settings interface
 * 
 * @module calendar/contexts/CalendarSettingsContext
 * @created 18 Janeiro 2026
 * @priority CRITICAL
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarSettings {
  // General Settings
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  defaultView: 'day' | 'week' | 'month' | 'agenda' | 'team';
  workingHoursStart: string; // HH:mm format (e.g., "08:00")
  workingHoursEnd: string; // HH:mm format (e.g., "20:00")
  defaultEventDuration: number; // minutes
  timezone: string; // e.g., "Europe/Lisbon"
  timeFormat: '12h' | '24h';
  
  // Notification Settings
  emailNotifications: boolean;
  appNotifications: boolean;
  pushNotifications: boolean;
  notifyOnEventCreated: boolean;
  notifyOnEventChanged: boolean;
  notifyOnEventCancelled: boolean;
  notifyBeforeEvent: boolean;
  notifyBeforeMinutes: number; // minutes before event
  notifyBefore: number; // alias for notifyBeforeMinutes
  
  // Confirmation Settings
  requireConfirmation: boolean;
  autoConfirmAfter: string; // hours or 'never'
  sendReminders: boolean;
  
  // Appearance Settings
  showWeekends: boolean;
  compactView: boolean;
  compactMode: boolean; // alias
  showEventDetails: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  eventDisplayMode: 'full' | 'compact' | 'minimal';
  showAthletePhotos: boolean;
}

interface CalendarSettingsContextType {
  settings: CalendarSettings;
  updateSettings: (newSettings: Partial<CalendarSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

export const DEFAULT_SETTINGS: CalendarSettings = {
  // General
  weekStartsOn: 1, // Monday
  defaultView: 'week',
  workingHoursStart: '08:00',
  workingHoursEnd: '20:00',
  defaultEventDuration: 90, // 1.5 hours
  timezone: 'Europe/Lisbon',
  timeFormat: '24h',
  
  // Notifications
  emailNotifications: true,
  appNotifications: true,
  pushNotifications: true,
  notifyOnEventCreated: true,
  notifyOnEventChanged: true,
  notifyOnEventCancelled: true,
  notifyBeforeEvent: true,
  notifyBeforeMinutes: 60, // 1 hour before
  notifyBefore: 60, // alias for notifyBeforeMinutes
  
  // Confirmation
  requireConfirmation: true,
  autoConfirmAfter: '1h',
  sendReminders: true,
  
  // Appearance
  showWeekends: true,
  compactView: false,
  compactMode: false, // alias
  showEventDetails: true,
  colorScheme: 'light',
  eventDisplayMode: 'full',
  showAthletePhotos: true,
};

// ============================================================================
// CONTEXT
// ============================================================================

const CalendarSettingsContext = createContext<CalendarSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'performtrack_calendar_settings';

// ============================================================================
// PROVIDER
// ============================================================================

interface CalendarSettingsProviderProps {
  children: ReactNode;
}

export function CalendarSettingsProvider({ children }: CalendarSettingsProviderProps) {
  const [settings, setSettings] = useState<CalendarSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  
  // ============================================================================
  // LOAD SETTINGS FROM LOCALSTORAGE ON MOUNT
  // ============================================================================
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
        
        setSettings(mergedSettings);
      }
    } catch (error) {
      // Use defaults on error
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // ============================================================================
  // UPDATE SETTINGS
  // ============================================================================
  const updateSettings = (newSettings: Partial<CalendarSettings>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings,
      };
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        // Silent fail - settings will work in memory
      }
      
      return updated;
    });
  };
  
  // ============================================================================
  // RESET SETTINGS TO DEFAULTS
  // ============================================================================
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Silent fail
    }
  };
  
  const value = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };
  
  return (
    <CalendarSettingsContext.Provider value={value}>
      {children}
    </CalendarSettingsContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useCalendarSettings() {
  const context = useContext(CalendarSettingsContext);
  
  if (!context) {
    throw new Error('useCalendarSettings must be used within CalendarSettingsProvider');
  }
  
  return context;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get working hours as Date objects for a given date
 */
export function getWorkingHours(date: Date, settings: CalendarSettings): { start: Date; end: Date } {
  const [startHour, startMinute] = settings.workingHoursStart.split(':').map(Number);
  const [endHour, endMinute] = settings.workingHoursEnd.split(':').map(Number);
  
  const start = new Date(date);
  start.setHours(startHour, startMinute, 0, 0);
  
  const end = new Date(date);
  end.setHours(endHour, endMinute, 0, 0);
  
  return { start, end };
}

/**
 * Check if a time is within working hours
 */
export function isWithinWorkingHours(time: Date, settings: CalendarSettings): boolean {
  const { start, end } = getWorkingHours(time, settings);
  return time >= start && time <= end;
}

/**
 * Get default end time for an event starting at a given time
 */
export function getDefaultEventEndTime(startTime: Date, settings: CalendarSettings): Date {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + settings.defaultEventDuration);
  return endTime;
}