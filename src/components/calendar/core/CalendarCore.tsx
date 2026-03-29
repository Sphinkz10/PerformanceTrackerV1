/**
 * CALENDAR CORE
 * Main calendar component that orchestrates everything
 */

import React from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { startOfWeek, endOfWeek } from 'date-fns';
import { CalendarProvider, useCalendar } from './CalendarProvider';
import { CalendarSettingsProvider } from '../contexts/CalendarSettingsContext';
import { CalendarHeader } from './CalendarHeader';
import { DayView } from '../views/DayView';
import { WeekView } from '../views/WeekView';
import { MonthView } from '../views/MonthView';
import { AgendaView } from '../views/AgendaView';
import { TeamView } from '../views/TeamView';
import { CreateEventModal } from '../modals/CreateEventModal/CreateEventModal';
import { EventDetailsModal } from '../modals/EventDetailsModal/EventDetailsModal';
import { CalendarSettingsModal } from '../modals/CalendarSettingsModal';
import { ExportModalV2 } from '../modals/ExportModalV2';
import { FiltersModal } from '../modals/FiltersModal';
import { ImportModal } from '../modals/ImportModal';
import { RecurringEventModal } from '../modals/RecurringEventModal';
import { ConflictResolverModal } from '../modals/ConflictResolverModal';
import { BulkEditModal } from '../modals/BulkEditModal';
import { BulkDeleteModal } from '../modals/BulkDeleteModal';
import { BulkMoveModal } from '../modals/BulkMoveModal';
import { BulkTagModal } from '../modals/BulkTagModal';
import { BulkAssignModal } from '../modals/BulkAssignModal';
import { PendingConfirmationsModal } from '../modals/PendingConfirmationsModal';
import { AthleteAvailabilityModal } from '../modals/AthleteAvailabilityModal';
import { QuickAddButton } from '../components/QuickAddButton';
import { BulkOperationsBar } from '../components/BulkOperationsBar';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { DesignStudioPanel } from '../panels/DesignStudioPanel';
import { useCalendarEvents } from '@/hooks/use-api';
import { MOCK_ATHLETES } from '../utils/mockData';

// ============================================================================
// MAIN COMPONENT

interface CalendarCoreProps {
  workspaceId: string;
}

function CalendarContent({ workspaceId }: CalendarCoreProps) {
  const { 
    view,
    currentDate,
    isCreateModalOpen, // ← ADD THIS!
    setIsCreateModalOpen,
    isSettingsModalOpen, 
    setIsSettingsModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    isFiltersModalOpen,
    setIsFiltersModalOpen,
    filters,
    setFilters,
    // NEW states
    isImportModalOpen,
    setIsImportModalOpen,
    isExportV2ModalOpen,
    setIsExportV2ModalOpen,
    isRecurringModalOpen,
    setIsRecurringModalOpen,
    isConflictResolverOpen,
    setIsConflictResolverOpen,
    isBulkEditModalOpen,
    setIsBulkEditModalOpen,
    isBulkDeleteModalOpen,
    setIsBulkDeleteModalOpen,
    isPendingConfirmationsOpen,
    setIsPendingConfirmationsOpen,
    isAnalyticsOpen,
    setIsAnalyticsOpen,
    selectedEvents,
    setSelectedEvents,
    clearSelection,
    isAthleteAvailabilityOpen,
    setIsAthleteAvailabilityOpen,
    // Design Studio
    isDesignStudioOpen,
    setIsDesignStudioOpen,
  } = useCalendar();
  
  // Fetch all events for export and analytics
  const { data: eventsData, refetch, mutate } = useCalendarEvents(workspaceId, {});
  const allEvents = eventsData?.events || [];
  
  // Date range for analytics
  const dateRange = {
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  };
  
  // State for pre-filled event data (for duplicate & import)
  const [prefilledEventData, setPrefilledEventData] = React.useState<any>(null);
  
  // State for plan import
  const [planToImport, setPlanToImport] = React.useState<any>(null);
  const [isPlanImportWizardOpen, setIsPlanImportWizardOpen] = React.useState(false);
  
  // State for bulk operation modals
  const [isBulkMoveModalOpen, setIsBulkMoveModalOpen] = React.useState(false);
  const [isBulkTagModalOpen, setIsBulkTagModalOpen] = React.useState(false);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        <CalendarHeader />
        
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 sm:p-6">
          {view === 'day' && <DayView workspaceId={workspaceId} />}
          {view === 'week' && <WeekView workspaceId={workspaceId} />}
          {view === 'month' && <MonthView workspaceId={workspaceId} />}
          {view === 'agenda' && <AgendaView workspaceId={workspaceId} />}
          {view === 'team' && <TeamView workspaceId={workspaceId} />}
        </div>
      </div>
      
      {/* Modals */}
      <EventDetailsModal workspaceId={workspaceId} />
      <CalendarSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <ExportModalV2 
        isOpen={isExportV2ModalOpen}
        onClose={() => setIsExportV2ModalOpen(false)}
        workspaceId={workspaceId}
        events={allEvents}
      />
      <FiltersModal 
        isOpen={isFiltersModalOpen} 
        onClose={() => setIsFiltersModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
      
      {/* NEW: Import/Export V2 */}
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        workspaceId={workspaceId}
        existingEvents={allEvents}
        onSuccess={() => refetch()}
      />
      
      {/* NEW: Recurring Events */}
      <RecurringEventModal 
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        workspaceId={workspaceId}
        onSuccess={() => refetch()}
      />
      
      {/* NEW: Conflicts */}
      <ConflictResolverModal 
        isOpen={isConflictResolverOpen}
        onClose={() => setIsConflictResolverOpen(false)}
        conflicts={[]} // Will be populated by conflict detection
        onResolve={() => refetch()}
      />
      
      {/* NEW: Bulk Operations */}
      <BulkEditModal 
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        selectedEvents={allEvents.filter(e => selectedEvents.includes(e.id))}
        onSuccess={() => refetch()}
      />
      <BulkDeleteModal 
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        selectedEvents={allEvents.filter(e => selectedEvents.includes(e.id))}
        onSuccess={() => refetch()}
      />
      <BulkMoveModal 
        isOpen={isBulkMoveModalOpen}
        onClose={() => setIsBulkMoveModalOpen(false)}
        selectedEvents={allEvents.filter(e => selectedEvents.includes(e.id))}
        workspaceId={workspaceId}
        onSuccess={() => refetch()}
      />
      <BulkTagModal 
        isOpen={isBulkTagModalOpen}
        onClose={() => setIsBulkTagModalOpen(false)}
        selectedEvents={allEvents.filter(e => selectedEvents.includes(e.id))}
        workspaceId={workspaceId}
        onSuccess={() => refetch()}
      />
      <BulkAssignModal 
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        selectedEvents={allEvents.filter(e => selectedEvents.includes(e.id))}
        workspaceId={workspaceId}
        onSuccess={() => refetch()}
      />
      
      {/* NEW: Confirmations */}
      <PendingConfirmationsModal 
        isOpen={isPendingConfirmationsOpen}
        onClose={() => setIsPendingConfirmationsOpen(false)}
        workspaceId={workspaceId}
      />
      
      {/* NEW: Analytics Dashboard (Modal style) */}
      {isAnalyticsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Analytics Dashboard</h2>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AnalyticsDashboard 
                events={allEvents}
                dateRange={dateRange}
                athletes={MOCK_ATHLETES}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
      
      {/* Design Studio Panel */}
      {isDesignStudioOpen && (
        <DesignStudioPanel 
          workspaceId={workspaceId}
          onImportWorkout={(workout) => {
            setIsDesignStudioOpen(false);
            // Pre-fill CreateEventModal with workout data
            setPrefilledEventData({
              title: workout.name || 'Treino Importado',
              description: workout.description || '',
              type: 'training',
              duration: workout.duration || 90,
              intensity: workout.intensity || 'moderate',
              // Map other workout fields as needed
            });
            setIsCreateModalOpen(true);
          }}
          onImportPlan={(plan) => {
            setIsDesignStudioOpen(false);
            // Show plan import wizard
            setPlanToImport(plan);
            setIsPlanImportWizardOpen(true);
          }}
          onClose={() => setIsDesignStudioOpen(false)}
        />
      )}
      
      {/* Create Event Modal */}
      <CreateEventModal 
        workspaceId={workspaceId}
        prefilledData={prefilledEventData}
        onClose={() => {
          setIsCreateModalOpen(false);
          setPrefilledEventData(null); // Clear prefilled data
        }}
      />
      
      {/* NEW: Athlete Availability Modal */}
      <AthleteAvailabilityModal 
        isOpen={isAthleteAvailabilityOpen}
        onClose={() => setIsAthleteAvailabilityOpen(false)}
        workspaceId={workspaceId}
        athletes={MOCK_ATHLETES}
      />
      
      {/* NEW: Bulk Operations Bar */}
      <BulkOperationsBar 
        selectedCount={selectedEvents.length}
        onBulkEdit={() => setIsBulkEditModalOpen(true)}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
        onBulkDuplicate={async () => {
          if (selectedEvents.length === 0) return;
          
          try {
            const eventsToDuplicate = selectedEvents.map(id => 
              allEvents.find(e => e.id === id)
            ).filter(Boolean);
            
            // Duplicate each event (create new with same data, different date)
            const duplicatePromises = eventsToDuplicate.map(async (event) => {
              if (!event) return;
              
              const newEvent = {
                ...event,
                id: undefined, // Will be generated by API
                title: `${event.title} (Cópia)`,
                status: 'scheduled',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              
              // Call API to create duplicate
              const response = await fetch(`/api/workspaces/${workspaceId}/calendar-events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent),
              });
              
              if (!response.ok) throw new Error('Erro ao duplicar evento');
              return response.json();
            });
            
            await Promise.all(duplicatePromises);
            
            toast.success(`${eventsToDuplicate.length} evento(s) duplicado(s)!`);
            clearSelection();
            mutate(); // Refresh calendar
          } catch (error) {
            console.error('Bulk duplicate error:', error);
            toast.error('Erro ao duplicar eventos');
          }
        }}
        onBulkMove={() => {
          if (selectedEvents.length === 0) return;
          setIsBulkMoveModalOpen(true);
        }}
        onBulkTag={() => {
          if (selectedEvents.length === 0) return;
          setIsBulkTagModalOpen(true);
        }}
        onBulkAssign={() => {
          if (selectedEvents.length === 0) return;
          setIsBulkAssignModalOpen(true);
        }}
        onClearSelection={clearSelection}
      />
      
      {/* Floating Quick Add Button */}
      <QuickAddButton onClick={() => {
        setIsCreateModalOpen(true);
      }} />
    </div>
  );
}

export function CalendarCore({ workspaceId }: CalendarCoreProps) {
  return (
    <CalendarProvider>
      <CalendarSettingsProvider>
        <CalendarContent workspaceId={workspaceId} />
      </CalendarSettingsProvider>
    </CalendarProvider>
  );
}