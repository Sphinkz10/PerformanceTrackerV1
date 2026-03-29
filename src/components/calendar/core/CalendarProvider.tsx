/**
 * CALENDAR PROVIDER
 * Global state management for calendar
 */

import React, { createContext, useContext, useState } from 'react';
import { CalendarView, CalendarFilters, CalendarEvent } from '@/types/calendar';
import { addDays, addWeeks, addMonths, startOfWeek, startOfMonth } from 'date-fns';

interface CalendarContextType {
  // View state
  view: CalendarView;
  setView: (view: CalendarView) => void;
  
  // Date navigation
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  
  // Filters
  filters: CalendarFilters;
  setFilters: (filters: CalendarFilters) => void;
  
  // Modals
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  
  isFiltersModalOpen: boolean;
  setIsFiltersModalOpen: (open: boolean) => void;
  
  // NEW: Import/Export V2
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  
  isExportV2ModalOpen: boolean;
  setIsExportV2ModalOpen: (open: boolean) => void;
  
  // NEW: Recurring Events
  isRecurringModalOpen: boolean;
  setIsRecurringModalOpen: (open: boolean) => void;
  
  // NEW: Conflicts
  isConflictResolverOpen: boolean;
  setIsConflictResolverOpen: (open: boolean) => void;
  
  // NEW: Bulk Operations
  isBulkEditModalOpen: boolean;
  setIsBulkEditModalOpen: (open: boolean) => void;
  
  isBulkDeleteModalOpen: boolean;
  setIsBulkDeleteModalOpen: (open: boolean) => void;
  
  selectedEvents: string[];
  setSelectedEvents: (events: string[]) => void;
  clearSelection: () => void;
  
  // NEW: Confirmations
  isPendingConfirmationsOpen: boolean;
  setIsPendingConfirmationsOpen: (open: boolean) => void;
  
  // NEW: Analytics
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  
  // NEW: Athlete Availability
  isAthleteAvailabilityOpen: boolean;
  setIsAthleteAvailabilityOpen: (open: boolean) => void;
  
  // Design Studio Panel
  isDesignStudioOpen: boolean;
  setIsDesignStudioOpen: (open: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<CalendarFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  
  // NEW: Import/Export V2
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportV2ModalOpen, setIsExportV2ModalOpen] = useState(false);
  
  // NEW: Recurring Events
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  
  // NEW: Conflicts
  const [isConflictResolverOpen, setIsConflictResolverOpen] = useState(false);
  
  // NEW: Bulk Operations
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  
  // NEW: Confirmations
  const [isPendingConfirmationsOpen, setIsPendingConfirmationsOpen] = useState(false);
  
  // NEW: Analytics
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  // NEW: Athlete Availability
  const [isAthleteAvailabilityOpen, setIsAthleteAvailabilityOpen] = useState(false);
  
  // Design Studio Panel
  const [isDesignStudioOpen, setIsDesignStudioOpen] = useState(false);
  
  const clearSelection = () => {
    setSelectedEvents([]);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const goToPrevious = () => {
    switch (view) {
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, -1));
        break;
      default:
        break;
    }
  };
  
  const goToNext = () => {
    switch (view) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      default:
        break;
    }
  };
  
  const value = {
    view,
    setView,
    currentDate,
    setCurrentDate,
    goToToday,
    goToPrevious,
    goToNext,
    filters,
    setFilters,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedEvent,
    setSelectedEvent,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    isFiltersModalOpen,
    setIsFiltersModalOpen,
    
    // NEW: Import/Export V2
    isImportModalOpen,
    setIsImportModalOpen,
    
    isExportV2ModalOpen,
    setIsExportV2ModalOpen,
    
    // NEW: Recurring Events
    isRecurringModalOpen,
    setIsRecurringModalOpen,
    
    // NEW: Conflicts
    isConflictResolverOpen,
    setIsConflictResolverOpen,
    
    // NEW: Bulk Operations
    isBulkEditModalOpen,
    setIsBulkEditModalOpen,
    
    isBulkDeleteModalOpen,
    setIsBulkDeleteModalOpen,
    
    selectedEvents,
    setSelectedEvents,
    clearSelection,
    
    // NEW: Confirmations
    isPendingConfirmationsOpen,
    setIsPendingConfirmationsOpen,
    
    // NEW: Analytics
    isAnalyticsOpen,
    setIsAnalyticsOpen,
    
    // NEW: Athlete Availability
    isAthleteAvailabilityOpen,
    setIsAthleteAvailabilityOpen,
    
    // Design Studio Panel
    isDesignStudioOpen,
    setIsDesignStudioOpen,
  };
  
  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
}