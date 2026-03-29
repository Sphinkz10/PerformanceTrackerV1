/**
 * useAthleteHistory Hook - PERFORMTRACK
 *
 * Fetches historical metrics data for an athlete
 * Used by: TrendsCard, WidgetDashboard, charts
 *
 * @param athleteId - Athlete ID
 * @param days - Number of days of history (default: 30)
 * @param metricId - Optional: filter by specific metric
 */

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export interface MetricHistoryData {
  date: string;
  value: number;
  zone?: 'green' | 'yellow' | 'red';
  notes?: string;
}

export interface MetricHistory {
  metric_id: string;
  metric_name: string;
  unit: string;
  category: string;
  data: MetricHistoryData[];
}

export interface AthleteHistoryResponse {
  athlete_id: string;
  date_range: {
    start: string;
    end: string;
    days: number;
  };
  metrics: MetricHistory[];
  total_updates: number;
}

export function useAthleteHistory(
  athleteId: string,
  days: number = 30,
  metricId?: string
) {
  const [history, setHistory] = useState<MetricHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({ days: days.toString() });
        if (metricId) params.append('metric', metricId);

        const url = `/api/athletes/${athleteId}/metrics/history?${params.toString()}`;
        const data = await apiClient(url) as AthleteHistoryResponse;

        setHistory(data?.metrics ?? []);
      } catch (err: any) {
        console.error('❌ Error fetching athlete history:', err);
        setError(err.message || 'Erro ao carregar histórico');
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (athleteId) fetchHistory();
  }, [athleteId, days, metricId]);

  const getMetricHistory = (metricId: string): MetricHistoryData[] => {
    const metric = history.find(m => m.metric_id === metricId);
    return metric?.data || [];
  };

  const getLatestValue = (metricId: string): number | null => {
    const metricData = getMetricHistory(metricId);
    if (metricData.length === 0) return null;
    return metricData[metricData.length - 1].value;
  };

  const getAverage = (metricId: string): number | null => {
    const metricData = getMetricHistory(metricId);
    if (metricData.length === 0) return null;

    const sum = metricData.reduce((acc, d) => acc + d.value, 0);
    return sum / metricData.length;
  };

  return {
    history,
    isLoading,
    error,
    getMetricHistory,
    getLatestValue,
    getAverage
  };
}
