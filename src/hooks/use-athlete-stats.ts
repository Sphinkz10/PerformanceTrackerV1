/**
 * useAthleteStats Hook - PERFORMTRACK
 *
 * Fetches aggregated weekly statistics for an athlete
 * Used by: SmartKPIStrip component
 *
 * @param athleteId - Athlete ID
 */

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export interface SessionInfo {
  id: string;
  title: string;
  date: string;
  time: string;
  relativeTime: string;
}

export interface WeeklyLoad {
  actual: number;
  planned: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SessionStats {
  completed: number;
  scheduled: number;
  compliance_rate: number;
}

export interface AthleteKPIs {
  readiness_score: number;
  weekly_load: WeeklyLoad;
  sessions: SessionStats;
  avg_rpe: number;
  last_session: SessionInfo | null;
  next_session: SessionInfo | null;
  active_alerts: number;
}

export interface AthleteStatsResponse {
  athlete_id: string;
  period: {
    start: string;
    end: string;
    days: number;
  };
  kpis: AthleteKPIs;
}

export function useAthleteStats(athleteId: string) {
  const [stats, setStats] = useState<AthleteKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        const url = `/api/athletes/${athleteId}/stats/weekly`;
        const data = await apiClient(url) as AthleteStatsResponse;

        // garante estrutura
        setStats(data?.kpis ?? null);
      } catch (err: any) {
        console.error('❌ Error fetching athlete stats:', err);
        setError(err.message || 'Erro ao carregar stats');
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (athleteId) fetchStats();
  }, [athleteId]);

  return { stats, isLoading, error };
}
