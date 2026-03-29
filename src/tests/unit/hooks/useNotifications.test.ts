/**
 * UNIT TESTS - useNotifications Hook
 * 
 * Day 23: Testing notifications hook
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

// Mock fetch
global.fetch = jest.fn();

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ notifications: [], unreadCount: 0 }),
    });
  });

  describe('Initial State', () => {
    test('should initialize with empty notifications', () => {
      const { result } = renderHook(() => useNotifications());
      
      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
      expect(result.current.loading).toBe(true);
    });

    test('should fetch notifications on mount', async () => {
      const mockNotifications = [
        { id: '1', message: 'Test', read: false, created_at: new Date().toISOString() },
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notifications: mockNotifications, unreadCount: 1 }),
      });
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.notifications).toEqual(mockNotifications);
      expect(result.current.unreadCount).toBe(1);
    });
  });

  describe('Mark as Read', () => {
    test('should mark notification as read', async () => {
      const mockNotification = {
        id: '1',
        message: 'Test',
        read: false,
        created_at: new Date().toISOString(),
      };
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ notifications: [mockNotification], unreadCount: 1 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      act(() => {
        result.current.markAsRead('1');
      });
      
      await waitFor(() => {
        expect(result.current.notifications[0].read).toBe(true);
      });
    });

    test('should decrease unread count when marking as read', async () => {
      const mockNotifications = [
        { id: '1', message: 'Test 1', read: false, created_at: new Date().toISOString() },
        { id: '2', message: 'Test 2', read: false, created_at: new Date().toISOString() },
      ];
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ notifications: mockNotifications, unreadCount: 2 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.unreadCount).toBe(2);
      });
      
      act(() => {
        result.current.markAsRead('1');
      });
      
      await waitFor(() => {
        expect(result.current.unreadCount).toBe(1);
      });
    });
  });

  describe('Mark All as Read', () => {
    test('should mark all notifications as read', async () => {
      const mockNotifications = [
        { id: '1', message: 'Test 1', read: false, created_at: new Date().toISOString() },
        { id: '2', message: 'Test 2', read: false, created_at: new Date().toISOString() },
      ];
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ notifications: mockNotifications, unreadCount: 2 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.unreadCount).toBe(2);
      });
      
      act(() => {
        result.current.markAllAsRead();
      });
      
      await waitFor(() => {
        expect(result.current.unreadCount).toBe(0);
        expect(result.current.notifications.every(n => n.read)).toBe(true);
      });
    });
  });

  describe('Delete Notification', () => {
    test('should delete notification', async () => {
      const mockNotifications = [
        { id: '1', message: 'Test 1', read: false, created_at: new Date().toISOString() },
        { id: '2', message: 'Test 2', read: false, created_at: new Date().toISOString() },
      ];
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ notifications: mockNotifications, unreadCount: 2 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.notifications.length).toBe(2);
      });
      
      act(() => {
        result.current.deleteNotification('1');
      });
      
      await waitFor(() => {
        expect(result.current.notifications.length).toBe(1);
        expect(result.current.notifications[0].id).toBe('2');
      });
    });
  });

  describe('Polling', () => {
    test('should poll for new notifications', async () => {
      jest.useFakeTimers();
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      // Clear initial fetch
      (global.fetch as jest.Mock).mockClear();
      
      // Mock new notification
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notifications: [
            { id: '3', message: 'New', read: false, created_at: new Date().toISOString() },
          ],
          unreadCount: 1,
        }),
      });
      
      // Fast-forward polling interval (30s)
      act(() => {
        jest.advanceTimersByTime(30000);
      });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
      
      jest.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    test('should handle fetch errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBeTruthy();
      expect(result.current.notifications).toEqual([]);
    });

    test('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });
      
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Cleanup', () => {
    test('should clear polling interval on unmount', () => {
      jest.useFakeTimers();
      
      const { unmount } = renderHook(() => useNotifications());
      
      unmount();
      
      // Verify no more polling happens
      const fetchCallsBefore = (global.fetch as jest.Mock).mock.calls.length;
      
      act(() => {
        jest.advanceTimersByTime(60000);
      });
      
      const fetchCallsAfter = (global.fetch as jest.Mock).mock.calls.length;
      expect(fetchCallsAfter).toBe(fetchCallsBefore);
      
      jest.useRealTimers();
    });
  });
});
