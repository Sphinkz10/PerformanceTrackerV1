/**
 * PERFORMANCE OPTIMIZATION UTILITIES
 * 
 * Utilities for optimizing calendar performance
 * Includes: memoization, debouncing, throttling, lazy loading
 * 
 * @version 1.0.0
 * @created 20 Janeiro 2026
 */

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * React hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React hook for throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useRef<T>();
  const lastRun = useRef(Date.now());

  useEffect(() => {
    throttledCallback.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => {
      const timeElapsed = Date.now() - lastRun.current;

      if (timeElapsed >= delay) {
        throttledCallback.current?.(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [delay]
  );
}

/**
 * Filter events by date range efficiently
 */
export function filterEventsByDateRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  return events.filter(event => {
    const eventDate = new Date(event.start_time);
    return isWithinInterval(eventDate, { start, end });
  });
}

/**
 * Group events by date for efficient rendering
 */
export function groupEventsByDate(
  events: CalendarEvent[]
): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  events.forEach(event => {
    const dateKey = startOfDay(new Date(event.start_time)).toISOString();
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    
    grouped.get(dateKey)!.push(event);
  });

  return grouped;
}

/**
 * Virtual scrolling helper - calculate visible items
 */
export function calculateVisibleRange(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);

  return { start, end };
}

/**
 * Lazy load images - intersection observer
 */
export function useLazyLoad(
  ref: React.RefObject<HTMLElement>,
  onIntersect: () => void
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, onIntersect]);
}

/**
 * Batch updates to reduce re-renders
 */
export function batchUpdates<T>(
  updates: T[],
  batchSize: number,
  onBatch: (batch: T[]) => void,
  delay: number = 0
): void {
  let currentBatch: T[] = [];
  let timer: NodeJS.Timeout | null = null;

  updates.forEach((update, index) => {
    currentBatch.push(update);

    if (currentBatch.length >= batchSize || index === updates.length - 1) {
      const batchToProcess = [...currentBatch];
      currentBatch = [];

      if (timer) clearTimeout(timer);
      
      timer = setTimeout(() => {
        onBatch(batchToProcess);
      }, delay);
    }
  });
}

/**
 * Memoized event sorting
 */
export const sortEventsByDate = memoize(
  (events: CalendarEvent[], ascending: boolean = true): CalendarEvent[] => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
);

/**
 * Memoized event filtering
 */
export const filterEvents = memoize(
  (
    events: CalendarEvent[],
    filters: {
      types?: string[];
      statuses?: string[];
      athleteIds?: string[];
      searchTerm?: string;
    }
  ): CalendarEvent[] => {
    return events.filter(event => {
      // Type filter
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(event.event_type)) return false;
      }

      // Status filter
      if (filters.statuses && filters.statuses.length > 0) {
        if (!filters.statuses.includes(event.status)) return false;
      }

      // Athlete filter
      if (filters.athleteIds && filters.athleteIds.length > 0) {
        const hasAthlete = event.athlete_ids?.some(id =>
          filters.athleteIds!.includes(id)
        );
        if (!hasAthlete) return false;
      }

      // Search term
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const term = filters.searchTerm.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(term);
        const matchesDescription = event.description?.toLowerCase().includes(term);
        const matchesLocation = event.location?.toLowerCase().includes(term);
        
        if (!matchesTitle && !matchesDescription && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }
);

/**
 * Calculate statistics efficiently
 */
export const calculateEventStats = memoize(
  (events: CalendarEvent[]) => {
    const stats = {
      total: events.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalAthletes: new Set<string>(),
      averageDuration: 0,
    };

    let totalDuration = 0;

    events.forEach(event => {
      // By type
      stats.byType[event.event_type] = (stats.byType[event.event_type] || 0) + 1;

      // By status
      stats.byStatus[event.status] = (stats.byStatus[event.status] || 0) + 1;

      // Unique athletes
      event.athlete_ids?.forEach(id => stats.totalAthletes.add(id));

      // Duration
      totalDuration += event.duration || 0;
    });

    stats.averageDuration = events.length > 0 ? totalDuration / events.length : 0;

    return {
      ...stats,
      totalAthletes: stats.totalAthletes.size,
    };
  }
);

/**
 * React hook for window resize with debounce
 */
export function useWindowSize(debounceMs: number = 150) {
  const [size, setSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, debounceMs);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [debounceMs]);

  return size;
}

/**
 * React hook for intersection observer (lazy loading)
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Performance measurement utility
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string) {
    this.marks.set(label, performance.now());
  }

  end(label: string): number | null {
    const startTime = this.marks.get(label);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    // Safe check for development mode
    const isDev = (() => {
      try {
        // @ts-ignore
        return process.env.NODE_ENV === 'development';
      } catch {
        return typeof window !== 'undefined';
      }
    })();

    if (isDev) {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label) || 0;
  }

  async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    await fn();
    return this.end(label) || 0;
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor() {
  const monitor = useRef(new PerformanceMonitor());
  return monitor.current;
}

// Import React for hooks
import * as React from 'react';