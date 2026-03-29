/**
 * CALENDAR PERFORMANCE OPTIMIZATIONS
 * Performance utilities for large event datasets
 * 
 * Features:
 * - Virtualization helpers
 * - Memoization patterns
 * - Lazy loading
 * - Batch operations
 * - Cache management
 * - Query optimization
 * 
 * @module calendar/performance-optimizations
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';

// ============================================================================
// VIRTUALIZATION HELPERS
// ============================================================================

/**
 * Calculate visible items for virtualized list
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);

  return {
    start: Math.max(0, visibleStart - overscan),
    end: Math.min(totalItems, visibleEnd + overscan),
  };
}

/**
 * Hook for virtualized list
 */
export function useVirtualizedList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
) {
  const scrollTop = useRef(0);

  const visibleRange = useMemo(() => {
    return calculateVisibleRange(
      scrollTop.current,
      containerHeight,
      itemHeight,
      items.length,
      overscan
    );
  }, [scrollTop.current, containerHeight, itemHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    scrollTop.current = e.currentTarget.scrollTop;
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange,
  };
}

// ============================================================================
// MEMOIZATION PATTERNS
// ============================================================================

/**
 * Memoize event filtering
 */
export function useMemoizedEventFilter(
  events: CalendarEvent[],
  filters: {
    types?: string[];
    statuses?: string[];
    athleteIds?: string[];
    search?: string;
    dateRange?: { start: Date; end: Date };
  }
) {
  return useMemo(() => {
    let filtered = events;

    // Type filter
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(e => filters.types!.includes(e.type));
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(e => filters.statuses!.includes(e.status));
    }

    // Athlete filter
    if (filters.athleteIds && filters.athleteIds.length > 0) {
      filtered = filtered.filter(e =>
        e.athlete_ids.some(id => filters.athleteIds!.includes(id))
      );
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.title.toLowerCase().includes(searchLower) ||
          e.description?.toLowerCase().includes(searchLower) ||
          e.location?.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.start_date);
        return eventDate >= filters.dateRange!.start && eventDate <= filters.dateRange!.end;
      });
    }

    return filtered;
  }, [events, filters]);
}

/**
 * Memoize event grouping
 */
export function useMemoizedEventGrouping(
  events: CalendarEvent[],
  groupBy: 'date' | 'type' | 'status' | 'athlete'
) {
  return useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};

    events.forEach(event => {
      let key: string;

      switch (groupBy) {
        case 'date':
          key = new Date(event.start_date).toISOString().split('T')[0];
          break;
        case 'type':
          key = event.type;
          break;
        case 'status':
          key = event.status;
          break;
        case 'athlete':
          // Group by each athlete (event may appear in multiple groups)
          event.athlete_ids.forEach(athleteId => {
            if (!groups[athleteId]) groups[athleteId] = [];
            groups[athleteId].push(event);
          });
          return;
        default:
          key = 'default';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });

    return groups;
  }, [events, groupBy]);
}

// ============================================================================
// LAZY LOADING
// ============================================================================

/**
 * Hook for lazy loading events
 */
export function useLazyLoadEvents(
  fetchEvents: (offset: number, limit: number) => Promise<CalendarEvent[]>,
  initialLimit: number = 50
) {
  const offset = useRef(0);
  const hasMore = useRef(true);
  const isLoading = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoading.current || !hasMore.current) return [];

    isLoading.current = true;

    try {
      const newEvents = await fetchEvents(offset.current, initialLimit);
      
      if (newEvents.length < initialLimit) {
        hasMore.current = false;
      }

      offset.current += newEvents.length;
      return newEvents;
    } finally {
      isLoading.current = false;
    }
  }, [fetchEvents, initialLimit]);

  const reset = useCallback(() => {
    offset.current = 0;
    hasMore.current = true;
    isLoading.current = false;
  }, []);

  return {
    loadMore,
    reset,
    hasMore: hasMore.current,
    isLoading: isLoading.current,
  };
}

/**
 * Intersection Observer for infinite scroll
 */
export function useInfiniteScroll(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return elementRef;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Batch process events
 */
export async function batchProcessEvents<T>(
  events: CalendarEvent[],
  processor: (event: CalendarEvent) => Promise<T>,
  batchSize: number = 10
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    }) as T,
    [func, delay]
  );
}

/**
 * Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  const lastRan = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRan.current >= limit) {
        func(...args);
        lastRan.current = now;
      }
    }) as T,
    [func, limit]
  );
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Simple LRU cache
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Evict oldest if over size
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Hook for cached data
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) {
  const cache = useRef(new Map<string, { data: T; timestamp: number }>());

  const getData = useCallback(async () => {
    const cached = cache.current.get(key);

    // Return cached if valid
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    // Fetch new data
    const data = await fetcher();
    cache.current.set(key, { data, timestamp: Date.now() });

    return data;
  }, [key, fetcher, ttl]);

  const invalidate = useCallback(() => {
    cache.current.delete(key);
  }, [key]);

  return { getData, invalidate };
}

// ============================================================================
// QUERY OPTIMIZATION
// ============================================================================

/**
 * Build optimized query filters
 */
export function buildOptimizedFilters(filters: {
  workspaceId: string;
  dateRange?: { start: Date; end: Date };
  types?: string[];
  statuses?: string[];
  athleteIds?: string[];
}): Record<string, any> {
  const query: Record<string, any> = {
    workspace_id: filters.workspaceId,
  };

  // Add date range filter (indexed)
  if (filters.dateRange) {
    query.start_date = {
      gte: filters.dateRange.start.toISOString(),
      lte: filters.dateRange.end.toISOString(),
    };
  }

  // Add type filter (indexed)
  if (filters.types && filters.types.length > 0) {
    query.type = { in: filters.types };
  }

  // Add status filter (indexed)
  if (filters.statuses && filters.statuses.length > 0) {
    query.status = { in: filters.statuses };
  }

  // Athlete filter requires join or array contains
  if (filters.athleteIds && filters.athleteIds.length > 0) {
    query.athlete_ids = { overlaps: filters.athleteIds };
  }

  return query;
}

/**
 * Batch fetch with cursor pagination
 */
export async function fetchEventsPaginated(
  workspaceId: string,
  cursor?: string,
  limit: number = 50
): Promise<{ events: CalendarEvent[]; nextCursor?: string }> {
  // TODO: Implement actual API call
  // const { data, cursor: nextCursor } = await supabase
  //   .from('calendar_events')
  //   .select('*')
  //   .eq('workspace_id', workspaceId)
  //   .order('start_date', { ascending: true })
  //   .range(cursor ? parseInt(cursor) : 0, limit - 1);

  // Mock return
  return {
    events: [],
    nextCursor: undefined,
  };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance monitor hook
 */
export function usePerformanceMonitor(name: string) {
  const startTime = useRef<number>(0);

  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const end = useCallback(() => {
    const duration = performance.now() - startTime.current;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }, [name]);

  return { start, end };
}

/**
 * Measure component render time
 */
export function useMeasureRender(componentName: string) {
  useEffect(() => {
    const renderTime = performance.now();
    
    return () => {
      const duration = performance.now() - renderTime;
      if (duration > 16) { // More than one frame (60fps)
        console.warn(`[Slow Render] ${componentName}: ${duration.toFixed(2)}ms`);
      }
    };
  });
}
