/**
 * UNIT TESTS - useCalendarMetrics Hook
 * 
 * Day 23: Testing calendar metrics calculation
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useCalendarMetrics } from '@/hooks/use-calendar-metrics';

// Mock fetch
global.fetch = jest.fn();

const mockEvents = [
  {
    id: '1',
    title: 'Morning Training',
    start: '2025-01-30T08:00:00Z',
    end: '2025-01-30T10:00:00Z',
    type: 'training',
    status: 'confirmed',
    participants: ['athlete1', 'athlete2'],
  },
  {
    id: '2',
    title: 'Team Meeting',
    start: '2025-01-30T14:00:00Z',
    end: '2025-01-30T15:00:00Z',
    type: 'meeting',
    status: 'pending',
    participants: ['athlete1'],
  },
  {
    id: '3',
    title: 'Evening Session',
    start: '2025-01-30T18:00:00Z',
    end: '2025-01-30T20:00:00Z',
    type: 'training',
    status: 'confirmed',
    participants: ['athlete1', 'athlete2', 'athlete3'],
  },
];

describe('useCalendarMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ events: mockEvents }),
    });
  });

  describe('Basic Metrics Calculation', () => {
    test('should calculate total events', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(3);
      });
    });

    test('should calculate events by type', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.byType.training).toBe(2);
        expect(result.current.byType.meeting).toBe(1);
      });
    });

    test('should calculate events by status', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.byStatus.confirmed).toBe(2);
        expect(result.current.byStatus.pending).toBe(1);
      });
    });

    test('should calculate total participants', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // athlete1: 3 events, athlete2: 2 events, athlete3: 1 event = 6 total participations
        expect(result.current.totalParticipations).toBe(6);
      });
    });

    test('should calculate unique athletes', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // athlete1, athlete2, athlete3 = 3 unique
        expect(result.current.uniqueAthletes).toBe(3);
      });
    });
  });

  describe('Time-based Metrics', () => {
    test('should calculate total duration', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // Event 1: 2h, Event 2: 1h, Event 3: 2h = 5h total
        expect(result.current.totalDuration).toBe(5);
      });
    });

    test('should calculate average duration', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // 5h total / 3 events = 1.67h average
        expect(result.current.averageDuration).toBeCloseTo(1.67, 1);
      });
    });

    test('should group events by day of week', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.byDayOfWeek).toBeDefined();
        // Friday (30 Jan 2025) should have 3 events
        expect(Object.values(result.current.byDayOfWeek)).toContain(3);
      });
    });

    test('should group events by hour', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.byHour).toBeDefined();
        expect(result.current.byHour['8']).toBe(1); // Morning at 8am
        expect(result.current.byHour['14']).toBe(1); // Meeting at 2pm
        expect(result.current.byHour['18']).toBe(1); // Evening at 6pm
      });
    });
  });

  describe('Advanced Metrics', () => {
    test('should calculate attendance rate', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // 2 confirmed out of 3 total = 66.7%
        expect(result.current.attendanceRate).toBeCloseTo(66.7, 1);
      });
    });

    test('should calculate average participants per event', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // 6 total participations / 3 events = 2 average
        expect(result.current.avgParticipantsPerEvent).toBe(2);
      });
    });

    test('should identify busiest day', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.busiestDay).toBe('Friday');
      });
    });

    test('should identify busiest hour', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        // All hours are equal, should return first or most logical
        expect(result.current.busiestHour).toBeGreaterThanOrEqual(0);
        expect(result.current.busiestHour).toBeLessThan(24);
      });
    });
  });

  describe('Filtering', () => {
    test('should filter by date range', async () => {
      const startDate = '2025-01-30';
      const endDate = '2025-01-30';

      const { result } = renderHook(() => 
        useCalendarMetrics({ startDate, endDate })
      );

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(3);
      });
    });

    test('should filter by athlete', async () => {
      const { result } = renderHook(() => 
        useCalendarMetrics({ athleteId: 'athlete1' })
      );

      await waitFor(() => {
        // athlete1 is in all 3 events
        expect(result.current.totalEvents).toBe(3);
      });
    });

    test('should filter by type', async () => {
      const { result } = renderHook(() => 
        useCalendarMetrics({ type: 'training' })
      );

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(2);
      });
    });

    test('should filter by status', async () => {
      const { result } = renderHook(() => 
        useCalendarMetrics({ status: 'confirmed' })
      );

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(2);
      });
    });

    test('should apply multiple filters', async () => {
      const { result } = renderHook(() => 
        useCalendarMetrics({ 
          type: 'training',
          status: 'confirmed',
          athleteId: 'athlete1'
        })
      );

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(2);
      });
    });
  });

  describe('Loading States', () => {
    test('should start with loading state', () => {
      const { result } = renderHook(() => useCalendarMetrics());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.totalEvents).toBe(0);
    });

    test('should set loading to false after fetch', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.isLoading).toBe(false);
      });
    });

    test('should handle empty events array', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [] }),
      });

      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(0);
        expect(result.current.uniqueAthletes).toBe(0);
      });
    });

    test('should handle malformed event data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [{ id: '1' }] }), // Missing required fields
      });

      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('Refetch', () => {
    test('should refetch data on demand', async () => {
      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(3);
      });

      // Mock new data
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [...mockEvents, { id: '4', /* ... */ }] }),
      });

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(4);
      });
    });
  });

  describe('Comparison Metrics', () => {
    test('should compare with previous period', async () => {
      const { result } = renderHook(() => 
        useCalendarMetrics({ 
          startDate: '2025-01-30',
          endDate: '2025-01-30',
          compareToPrevious: true
        })
      );

      await waitFor(() => {
        expect(result.current.comparison).toBeDefined();
        expect(result.current.comparison.percentageChange).toBeDefined();
      });
    });

    test('should calculate growth rate', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ events: mockEvents }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ events: [mockEvents[0]] }), // Previous: 1 event
        });

      const { result } = renderHook(() => 
        useCalendarMetrics({ compareToPrevious: true })
      );

      await waitFor(() => {
        // 3 events vs 1 event = +200% growth
        expect(result.current.comparison.percentageChange).toBe(200);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle events with no participants', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          events: [{ ...mockEvents[0], participants: [] }] 
        }),
      });

      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalParticipations).toBe(0);
        expect(result.current.uniqueAthletes).toBe(0);
      });
    });

    test('should handle events with same start and end time', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          events: [{
            ...mockEvents[0],
            start: '2025-01-30T08:00:00Z',
            end: '2025-01-30T08:00:00Z', // 0 duration
          }] 
        }),
      });

      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalDuration).toBe(0);
      });
    });

    test('should handle very large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        ...mockEvents[0],
        id: `event-${i}`,
      }));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: largeDataset }),
      });

      const { result } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(1000);
      }, { timeout: 5000 });
    });
  });

  describe('Memoization', () => {
    test('should memoize calculations', async () => {
      const { result, rerender } = renderHook(() => useCalendarMetrics());

      await waitFor(() => {
        expect(result.current.totalEvents).toBe(3);
      });

      const firstMetrics = result.current;
      
      rerender();

      // Should return same object reference (memoized)
      expect(result.current).toBe(firstMetrics);
    });
  });
});
