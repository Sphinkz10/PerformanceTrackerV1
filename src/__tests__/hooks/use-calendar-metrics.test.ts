/**
 * USE CALENDAR METRICS HOOK - UNIT TESTS
 * Comprehensive test suite for calendar metrics calculations
 * 
 * @module tests/hooks/use-calendar-metrics
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { renderHook } from '@testing-library/react';
import {
  useCalendarMetrics,
  useEventStatusCounts,
  useEventTypeCounts,
  useUpcomingEventsCount,
  useOverdueEventsCount,
  useEventCompletionTrend,
} from '@/hooks/use-calendar-metrics';
import { CalendarEvent } from '@/types/calendar';

// ============================================================================
// MOCK DATA
// ============================================================================

const createMockEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'event_1',
  workspace_id: 'workspace_1',
  title: 'Test Event',
  description: 'Test Description',
  start_date: new Date('2026-01-20T10:00:00'),
  end_date: new Date('2026-01-20T11:00:00'),
  type: 'training',
  status: 'confirmed',
  location: 'Test Location',
  color: '#0ea5e9',
  athlete_ids: ['athlete_1', 'athlete_2'],
  tags: ['test'],
  source: 'manual',
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

const mockEvents: CalendarEvent[] = [
  // Confirmed events
  createMockEvent({
    id: 'event_1',
    status: 'confirmed',
    type: 'training',
    start_date: new Date('2026-01-15T10:00:00'),
  }),
  createMockEvent({
    id: 'event_2',
    status: 'confirmed',
    type: 'competition',
    start_date: new Date('2026-01-16T10:00:00'),
  }),
  
  // Pending events
  createMockEvent({
    id: 'event_3',
    status: 'pending',
    type: 'training',
    start_date: new Date('2026-01-17T10:00:00'),
  }),
  
  // Completed events
  createMockEvent({
    id: 'event_4',
    status: 'completed',
    type: 'training',
    start_date: new Date('2026-01-10T10:00:00'),
  }),
  createMockEvent({
    id: 'event_5',
    status: 'completed',
    type: 'competition',
    start_date: new Date('2026-01-11T10:00:00'),
  }),
  createMockEvent({
    id: 'event_6',
    status: 'completed',
    type: 'meeting',
    start_date: new Date('2026-01-12T10:00:00'),
  }),
  
  // Cancelled events
  createMockEvent({
    id: 'event_7',
    status: 'cancelled',
    type: 'training',
    start_date: new Date('2026-01-13T10:00:00'),
  }),

  // Future events
  createMockEvent({
    id: 'event_8',
    status: 'confirmed',
    type: 'training',
    start_date: new Date('2026-01-25T10:00:00'),
  }),
  
  // Different workspace
  createMockEvent({
    id: 'event_9',
    workspace_id: 'workspace_2',
    status: 'confirmed',
    type: 'training',
    start_date: new Date('2026-01-20T10:00:00'),
  }),
];

// ============================================================================
// TESTS: useCalendarMetrics
// ============================================================================

describe('useCalendarMetrics', () => {
  it('should calculate total events correctly', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
      })
    );

    expect(result.current.totalEvents).toBe(8); // Excludes workspace_2
  });

  it('should calculate event counts by status', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
      })
    );

    expect(result.current.confirmedEvents).toBe(3);
    expect(result.current.pendingEvents).toBe(1);
    expect(result.current.completedEvents).toBe(3);
    expect(result.current.cancelledEvents).toBe(1);
  });

  it('should calculate rates correctly', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
      })
    );

    // 3 confirmed out of 8 total = 37.5%
    expect(result.current.confirmationRate).toBeCloseTo(37.5);
    
    // 3 completed out of 8 total = 37.5%
    expect(result.current.completionRate).toBeCloseTo(37.5);
    
    // 1 cancelled out of 8 total = 12.5%
    expect(result.current.cancellationRate).toBeCloseTo(12.5);
  });

  it('should group events by type', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
      })
    );

    expect(result.current.eventsByType.training).toBe(5);
    expect(result.current.eventsByType.competition).toBe(2);
    expect(result.current.eventsByType.meeting).toBe(1);
  });

  it('should filter by date range', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
        dateRange: {
          start: new Date('2026-01-10T00:00:00'),
          end: new Date('2026-01-15T23:59:59'),
        },
      })
    );

    // Should include events from 10th to 15th only
    expect(result.current.totalEvents).toBe(4);
  });

  it('should filter by types', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
        includeTypes: ['training'],
      })
    );

    // Only training events
    expect(result.current.totalEvents).toBe(5);
  });

  it('should filter by statuses', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
        includeStatuses: ['completed'],
      })
    );

    // Only completed events
    expect(result.current.totalEvents).toBe(3);
  });

  it('should calculate average participants per event', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_1',
      })
    );

    // Each event has 2 athletes, 8 events = 16 total / 8 = 2.0 average
    expect(result.current.averageParticipantsPerEvent).toBe(2.0);
  });

  it('should handle empty events array', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics([], undefined, {
        workspaceId: 'workspace_1',
      })
    );

    expect(result.current.totalEvents).toBe(0);
    expect(result.current.confirmationRate).toBe(0);
    expect(result.current.completionRate).toBe(0);
    expect(result.current.averageParticipantsPerEvent).toBe(0);
  });

  it('should isolate by workspace', () => {
    const { result } = renderHook(() =>
      useCalendarMetrics(mockEvents, undefined, {
        workspaceId: 'workspace_2',
      })
    );

    // Only 1 event in workspace_2
    expect(result.current.totalEvents).toBe(1);
  });
});

// ============================================================================
// TESTS: useEventStatusCounts
// ============================================================================

describe('useEventStatusCounts', () => {
  it('should count events by status', () => {
    const { result } = renderHook(() =>
      useEventStatusCounts(mockEvents, 'workspace_1')
    );

    expect(result.current.confirmed).toBe(3);
    expect(result.current.pending).toBe(1);
    expect(result.current.completed).toBe(3);
    expect(result.current.cancelled).toBe(1);
    expect(result.current.total).toBe(8);
  });

  it('should work without workspace filter', () => {
    const { result } = renderHook(() =>
      useEventStatusCounts(mockEvents)
    );

    expect(result.current.total).toBe(9); // Includes all workspaces
  });
});

// ============================================================================
// TESTS: useEventTypeCounts
// ============================================================================

describe('useEventTypeCounts', () => {
  it('should count events by type', () => {
    const { result } = renderHook(() =>
      useEventTypeCounts(mockEvents, 'workspace_1')
    );

    expect(result.current.training).toBe(5);
    expect(result.current.competition).toBe(2);
    expect(result.current.meeting).toBe(1);
  });

  it('should work without workspace filter', () => {
    const { result } = renderHook(() =>
      useEventTypeCounts(mockEvents)
    );

    expect(result.current.training).toBe(6); // Includes workspace_2
  });
});

// ============================================================================
// TESTS: useUpcomingEventsCount
// ============================================================================

describe('useUpcomingEventsCount', () => {
  it('should count upcoming events within default 7 days', () => {
    // Mock current date to 2026-01-18
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-18T12:00:00'));

    const { result } = renderHook(() =>
      useUpcomingEventsCount(mockEvents, 'workspace_1')
    );

    // Events on 25th are within 7 days from 18th
    expect(result.current).toBeGreaterThan(0);

    jest.useRealTimers();
  });

  it('should count upcoming events within custom days', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-18T12:00:00'));

    const { result } = renderHook(() =>
      useUpcomingEventsCount(mockEvents, 'workspace_1', 30)
    );

    // Should include events within 30 days
    expect(result.current).toBeGreaterThan(0);

    jest.useRealTimers();
  });

  it('should exclude cancelled events', () => {
    const eventsWithCancelled = [
      ...mockEvents,
      createMockEvent({
        id: 'event_future_cancelled',
        status: 'cancelled',
        start_date: new Date('2026-02-01T10:00:00'),
      }),
    ];

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-18T12:00:00'));

    const { result } = renderHook(() =>
      useUpcomingEventsCount(eventsWithCancelled, 'workspace_1', 30)
    );

    // Cancelled event should not be counted
    const withoutCancelled = renderHook(() =>
      useUpcomingEventsCount(mockEvents, 'workspace_1', 30)
    );

    expect(result.current).toBe(withoutCancelled.result.current);

    jest.useRealTimers();
  });
});

// ============================================================================
// TESTS: useOverdueEventsCount
// ============================================================================

describe('useOverdueEventsCount', () => {
  it('should count overdue pending/confirmed events', () => {
    const eventsWithOverdue = [
      ...mockEvents,
      createMockEvent({
        id: 'event_overdue',
        status: 'pending',
        start_date: new Date('2026-01-01T10:00:00'), // Past date
      }),
    ];

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-18T12:00:00'));

    const { result } = renderHook(() =>
      useOverdueEventsCount(eventsWithOverdue, 'workspace_1')
    );

    expect(result.current).toBeGreaterThan(0);

    jest.useRealTimers();
  });

  it('should not count completed or cancelled as overdue', () => {
    const events = [
      createMockEvent({
        id: 'past_completed',
        status: 'completed',
        start_date: new Date('2026-01-01T10:00:00'),
      }),
      createMockEvent({
        id: 'past_cancelled',
        status: 'cancelled',
        start_date: new Date('2026-01-01T10:00:00'),
      }),
    ];

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-18T12:00:00'));

    const { result } = renderHook(() =>
      useOverdueEventsCount(events, 'workspace_1')
    );

    expect(result.current).toBe(0);

    jest.useRealTimers();
  });
});

// ============================================================================
// TESTS: useEventCompletionTrend
// ============================================================================

describe('useEventCompletionTrend', () => {
  it('should calculate completion trend correctly', () => {
    const events = [
      createMockEvent({
        id: 'completed_1',
        status: 'completed',
        start_date: new Date('2026-01-10T10:00:00'),
      }),
      createMockEvent({
        id: 'completed_2',
        status: 'completed',
        start_date: new Date('2026-01-11T10:00:00'),
      }),
      createMockEvent({
        id: 'confirmed_1',
        status: 'confirmed',
        start_date: new Date('2026-01-12T10:00:00'),
      }),
    ];

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-18T12:00:00'));

    const { result } = renderHook(() =>
      useEventCompletionTrend(events, 'workspace_1', 30)
    );

    // 2 completed out of 3 total = 66.67%
    expect(result.current.completed).toBe(2);
    expect(result.current.total).toBe(3);
    expect(result.current.rate).toBeCloseTo(66.67, 1);

    jest.useRealTimers();
  });

  it('should handle zero events', () => {
    const { result } = renderHook(() =>
      useEventCompletionTrend([], 'workspace_1', 30)
    );

    expect(result.current.completed).toBe(0);
    expect(result.current.total).toBe(0);
    expect(result.current.rate).toBe(0);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('useCalendarMetrics - Integration', () => {
  it('should recalculate when events change', () => {
    const { result, rerender } = renderHook(
      ({ events }) => useCalendarMetrics(events, undefined, {
        workspaceId: 'workspace_1',
      }),
      { initialProps: { events: mockEvents } }
    );

    const initialTotal = result.current.totalEvents;

    // Add new event
    const newEvents = [
      ...mockEvents,
      createMockEvent({
        id: 'new_event',
        status: 'confirmed',
      }),
    ];

    rerender({ events: newEvents });

    expect(result.current.totalEvents).toBe(initialTotal + 1);
  });

  it('should recalculate when filters change', () => {
    const { result, rerender } = renderHook(
      ({ filters }) => useCalendarMetrics(mockEvents, undefined, filters),
      {
        initialProps: {
          filters: {
            workspaceId: 'workspace_1',
            includeTypes: [] as string[],
          },
        },
      }
    );

    const totalWithoutFilter = result.current.totalEvents;

    rerender({
      filters: {
        workspaceId: 'workspace_1',
        includeTypes: ['training'],
      },
    });

    expect(result.current.totalEvents).toBeLessThan(totalWithoutFilter);
  });
});
