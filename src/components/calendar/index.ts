/**
 * CALENDAR V2.0 - EXPORTS
 * Central export point for all calendar components
 */

// Core
export { CalendarCore } from './core/CalendarCore';
export { CalendarProvider, useCalendar } from './core/CalendarProvider';
export { CalendarHeader } from './core/CalendarHeader';

// Views
export { DayView } from './views/DayView';
export { WeekView } from './views/WeekView';
export { MonthView } from './views/MonthView';
export { AgendaView } from './views/AgendaView';
export { TeamView } from './views/TeamView';

// Modals
export { CalendarSettingsModal } from './modals/CalendarSettingsModal';
export { FiltersModal } from './modals/FiltersModal';
export { TeamGroupModal } from './modals/TeamGroupModal';
export { BulkTeamScheduleModal } from './modals/BulkTeamScheduleModal';

// Panels
export { TeamAnalyticsPanel } from './panels/TeamAnalyticsPanel';

// Components
export { EventCard } from './components/EventCard';
export { EmptyState } from './components/EmptyState';
export { ConflictWarning } from './components/ConflictWarning';
export { DayViewEvent } from './components/DayViewEvent';
export { MonthDayCell } from './components/MonthDayCell';
export { MonthEventPill } from './components/MonthEventPill';
export { TeamViewEvent } from './components/TeamViewEvent';
export { AthleteRow } from './components/AthleteRow';
export { AthleteSelector } from './components/AthleteSelector';
export { TeamGroupManager } from './components/TeamGroupManager';

// Types (re-export from types/calendar.ts)
export type {
  CalendarEvent,
  CalendarView,
  CalendarFilters,
  EventParticipant,
  EventConfirmation,
  CreateEventFormData,
} from '@/types/calendar';

// Types (re-export from types/team.ts)
export type {
  TeamGroup,
  CoachAssignment,
  CoachPermissions,
  TeamAnalytics,
  BulkTeamOperation,
  TeamScheduleConflict,
  TeamCalendarShare,
} from '@/types/team';