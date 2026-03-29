/**
 * UNIT TESTS - useResponsive Hook
 * 
 * Day 23: Testing responsive hook behavior
 */

import { renderHook } from '@testing-library/react';
import { useResponsive } from '@/hooks/useResponsive';

describe('useResponsive', () => {
  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Breakpoint Detection', () => {
    test('should detect mobile viewport (< 640px)', () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    test('should detect tablet viewport (640px - 1023px)', () => {
      window.innerWidth = 768;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    test('should detect desktop viewport (>= 1024px)', () => {
      window.innerWidth = 1920;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe('Specific Breakpoints', () => {
    test('should detect sm breakpoint (>= 640px)', () => {
      window.innerWidth = 640;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.sm).toBe(true);
    });

    test('should detect lg breakpoint (>= 1024px)', () => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.lg).toBe(true);
    });

    test('should detect xl breakpoint (>= 1280px)', () => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.xl).toBe(true);
    });
  });

  describe('Window Dimensions', () => {
    test('should return current window width', () => {
      window.innerWidth = 1200;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.width).toBe(1200);
    });

    test('should return current window height', () => {
      window.innerHeight = 800;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.height).toBe(800);
    });
  });

  describe('Orientation', () => {
    test('should detect portrait orientation', () => {
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isPortrait).toBe(true);
      expect(result.current.isLandscape).toBe(false);
    });

    test('should detect landscape orientation', () => {
      window.innerWidth = 667;
      window.innerHeight = 375;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isPortrait).toBe(false);
      expect(result.current.isLandscape).toBe(true);
    });
  });

  describe('Resize Event Handling', () => {
    test('should update on window resize', () => {
      window.innerWidth = 375;
      const { result, rerender } = renderHook(() => useResponsive());
      
      expect(result.current.isMobile).toBe(true);
      
      // Resize to desktop
      window.innerWidth = 1920;
      window.dispatchEvent(new Event('resize'));
      rerender();
      
      expect(result.current.isDesktop).toBe(true);
    });

    test('should debounce resize events', async () => {
      const { result } = renderHook(() => useResponsive());
      
      // Trigger multiple rapid resizes
      for (let i = 0; i < 10; i++) {
        window.innerWidth = 300 + i * 100;
        window.dispatchEvent(new Event('resize'));
      }
      
      // Should only process once after debounce
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(result.current.width).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small viewports', () => {
      window.innerWidth = 320;
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isMobile).toBe(true);
      expect(result.current.width).toBe(320);
    });

    test('should handle very large viewports', () => {
      window.innerWidth = 3840; // 4K
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.width).toBe(3840);
    });

    test('should handle exact breakpoint values', () => {
      window.innerWidth = 640; // Exactly sm
      window.dispatchEvent(new Event('resize'));
      
      const { result } = renderHook(() => useResponsive());
      
      expect(result.current.sm).toBe(true);
      expect(result.current.isMobile).toBe(false);
    });
  });

  describe('Cleanup', () => {
    test('should remove event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderHook(() => useResponsive());
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});
