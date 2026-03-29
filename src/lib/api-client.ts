/**
 * API Client
 *
 * Simple wrapper around fetch for API calls.
 * Previously supported mock data, now streamlined for real API usage.
 *
 * @author PerformTrack Team
 * @version 1.1.0
 */

import { supabase } from '@/lib/supabase/client';

function toIso(d: Date) {
  return d.toISOString();
}

function relTimePt(dateIso: string) {
  const d = new Date(dateIso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `há ${diffHr}h`;

  const diffDays = Math.round(diffHr / 24);
  return `há ${diffDays}d`;
}

export async function apiClient(url: string, options?: RequestInit) {
  // INTERCEPT SPECIFIC ENDPOINTS TO USE SUPABASE DIRECTLY
  // This replaces the missing Next.js API routes in the Vite SPA setup

  const cleanUrl = url.split('?')[0];
  const queryParams = new URLSearchParams(url.split('?')[1] || '');

  // 1. Calendar Events Proxy
  if (cleanUrl === '/api/calendar-events') {
    const workspaceId = queryParams.get('workspaceId');
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    const type = queryParams.get('type');
    const status = queryParams.get('status');
    const athleteId = queryParams.get('athleteId');
    const search = queryParams.get('search');

    let query = supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    if (startDate) {
      query = query.gte('start_date', startDate);
    }

    if (endDate) {
      query = query.lte('end_date', endDate);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (athleteId) {
      query = query.contains('athlete_ids', [athleteId]);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      events: data || [],
      count: data?.length || 0,
    };
  }

  // 2. Dashboard Alerts Proxy (Return empty to unblock UI for now)
  if (cleanUrl === '/api/analytics/alerts') {
    return {
      alerts: {
        pain: [],
        orphanSessions: [],
        pendingForms: [],
        pendingAssessments: [],
        metricsThreshold: [],
        personalRecords: [],
        webhookFailures: [],
        summary: { critical: 0, high: 0, medium: 0, total: 0 },
      }
    };
  }

  // 3. Dashboard Analytics Proxy
  if (cleanUrl.includes('/api/analytics/dashboard')) {
    return {
      stats: {
        activeAthletes: 0,
        completedWorkouts: 0,
        volumeLoad: 0,
        attendanceRate: 0
      },
      charts: []
    };
  }

  // 4. Athletes List Proxy
  if (cleanUrl === '/api/athletes') {
    const { data, error } = await supabase
      .from('athletes')
      .select('*');

    if (error) throw error;
    return { athletes: data || [], count: data?.length || 0 };
  }

  // 4b. Athlete Details Proxy: /api/athletes/:id
  const athleteMatch = cleanUrl.match(/^\/api\/athletes\/([^\/]+)$/);
  if (athleteMatch) {
    const athleteId = athleteMatch[1];

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', athleteId)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') {
        return { athlete: null, source: 'supabase' };
      }
      throw error;
    }

    return { athlete: data, source: 'supabase' };
  }

  // 4c. Athlete Metrics Proxy: /api/athletes/:id/metrics
  const metricsMatch = cleanUrl.match(/^\/api\/athletes\/([^\/]+)\/metrics$/);
  if (metricsMatch) {
    const athleteId = metricsMatch[1];

    const { data: athlete, error: athleteErr } = await supabase
      .from('athletes')
      .select('id, workspace_id')
      .eq('id', athleteId)
      .single();

    if (athleteErr) {
      return { metrics: [], grouped: {}, summary: {}, source: 'supabase' };
    }

    const { data: metrics, error: metricsErr } = await supabase
      .from('metrics')
      .select('*')
      .eq('workspace_id', athlete.workspace_id)
      .eq('is_active', true);

    if (metricsErr) throw metricsErr;

    const grouped: Record<string, any[]> = {};
    for (const m of metrics || []) {
      const key = (m as any).category || 'other';
      grouped[key] = grouped[key] || [];
      grouped[key].push(m);
    }

    return {
      metrics: metrics || [],
      grouped,
      summary: { total: metrics?.length || 0 },
      source: 'supabase',
    };
  }

  // ✅ 4d. Athlete Weekly Stats Proxy: /api/athletes/:id/stats/weekly
  const weeklyStatsMatch = cleanUrl.match(/^\/api\/athletes\/([^\/]+)\/stats\/weekly$/);
  if (weeklyStatsMatch) {
    const athleteId = weeklyStatsMatch[1];

    // 1) descobrir workspace do atleta
    const { data: athlete, error: athleteErr } = await supabase
      .from('athletes')
      .select('id, workspace_id')
      .eq('id', athleteId)
      .single();

    if (athleteErr || !athlete) {
      return {
        athlete_id: athleteId,
        period: { start: toIso(new Date(Date.now() - 7 * 86400000)), end: toIso(new Date()), days: 7 },
        kpis: {
          readiness_score: 0,
          weekly_load: { actual: 0, planned: 0, percentage: 0, trend: 'stable' },
          sessions: { completed: 0, scheduled: 0, compliance_rate: 0 },
          avg_rpe: 0,
          last_session: null,
          next_session: null,
          active_alerts: 0,
        }
      };
    }

    const now = new Date();
    const start = new Date(now.getTime() - 7 * 86400000);
    const startIso = toIso(start);
    const endIso = toIso(now);

    // 2) sessões concluídas (via sessions + session_athletes)
    const { data: saRows, error: saErr } = await supabase
      .from('session_athletes')
      .select('avg_rpe, volume_total, sessions!inner(id, started_at, status, calendar_event_id)')
      .eq('athlete_id', athleteId)
      .eq('sessions.status', 'completed')
      .gte('sessions.started_at', startIso)
      .lte('sessions.started_at', endIso);

    if (saErr) {
      console.warn('[apiClient] weekly stats session_athletes error:', saErr);
    }

    const completed = (saRows || []).length;

    const avgRpeValues = (saRows || [])
      .map((r: any) => (r?.avg_rpe !== null && r?.avg_rpe !== undefined) ? Number(r.avg_rpe) : null)
      .filter((v: any) => typeof v === 'number' && !Number.isNaN(v));

    const avg_rpe = avgRpeValues.length
      ? avgRpeValues.reduce((a: number, b: number) => a + b, 0) / avgRpeValues.length
      : 0;

    const actualLoad = (saRows || [])
      .map((r: any) => (r?.volume_total !== null && r?.volume_total !== undefined) ? Number(r.volume_total) : 0)
      .filter((v: any) => typeof v === 'number' && !Number.isNaN(v))
      .reduce((a: number, b: number) => a + b, 0);

    // 3) sessões agendadas (calendar_events com athlete_ids a conter o atleta)
    const { data: scheduledEvents, error: evErr } = await supabase
      .from('calendar_events')
      .select('id, title, start_date, end_date, status')
      .eq('workspace_id', athlete.workspace_id)
      .contains('athlete_ids', [athleteId])
      .gte('start_date', startIso)
      .lte('start_date', endIso);

    if (evErr) {
      console.warn('[apiClient] weekly stats calendar_events error:', evErr);
    }

    const scheduled = (scheduledEvents || [])
      .filter((e: any) => (e?.status ?? 'scheduled') !== 'cancelled')
      .length;

    const compliance_rate = scheduled > 0
      ? Math.round((completed / scheduled) * 100)
      : 0;

    // 4) last session
    let last_session = null as any;
    const lastRow = (saRows || [])
      .map((r: any) => r?.sessions)
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())[0];

    if (lastRow?.started_at) {
      let title = 'Sessão';
      if (lastRow.calendar_event_id) {
        const { data: ev } = await supabase
          .from('calendar_events')
          .select('title')
          .eq('id', lastRow.calendar_event_id)
          .maybeSingle();
        if (ev?.title) title = ev.title;
      }

      const d = new Date(lastRow.started_at);
      last_session = {
        id: lastRow.id,
        title,
        date: d.toISOString().slice(0, 10),
        time: d.toISOString().slice(11, 16),
        relativeTime: relTimePt(lastRow.started_at),
      };
    }

    // 5) next session (próximo evento agendado)
    let next_session = null as any;
    const { data: nextEv } = await supabase
      .from('calendar_events')
      .select('id, title, start_date')
      .eq('workspace_id', athlete.workspace_id)
      .contains('athlete_ids', [athleteId])
      .gte('start_date', endIso)
      .order('start_date', { ascending: true })
      .limit(1);

    if (nextEv?.[0]?.start_date) {
      const d = new Date(nextEv[0].start_date);
      next_session = {
        id: nextEv[0].id,
        title: nextEv[0].title,
        date: d.toISOString().slice(0, 10),
        time: d.toISOString().slice(11, 16),
        relativeTime: 'em breve',
      };
    }

    // 6) readiness_score (se existir uma métrica “readiness”, usa o último update)
    let readiness_score = 0;
    const { data: readinessMetric } = await supabase
      .from('metrics')
      .select('id')
      .eq('workspace_id', athlete.workspace_id)
      .ilike('name', '%readiness%')
      .limit(1);

    if (readinessMetric?.[0]?.id) {
      const { data: lastReadiness } = await supabase
        .from('metric_updates')
        .select('value')
        .eq('athlete_id', athleteId)
        .eq('metric_id', readinessMetric[0].id)
        .order('recorded_at', { ascending: false })
        .limit(1);

      const v = lastReadiness?.[0]?.value;
      if (v !== null && v !== undefined) readiness_score = Number(v) || 0;
    }

    const planned = 0;
    const percentage = planned > 0 ? Math.round((actualLoad / planned) * 100) : (scheduled > 0 ? 100 : 0);

    return {
      athlete_id: athleteId,
      period: { start: startIso, end: endIso, days: 7 },
      kpis: {
        readiness_score,
        weekly_load: {
          actual: Math.round(actualLoad),
          planned,
          percentage,
          trend: 'stable',
        },
        sessions: {
          completed,
          scheduled,
          compliance_rate,
        },
        avg_rpe: Number.isFinite(avg_rpe) ? avg_rpe : 0,
        last_session,
        next_session,
        active_alerts: 0,
      }
    };
  }

  // ✅ 4e. Athlete Metric History Proxy: /api/athletes/:id/metrics/history?days=30&metric=...
  const historyMatch = cleanUrl.match(/^\/api\/athletes\/([^\/]+)\/metrics\/history$/);
  if (historyMatch) {
    const athleteId = historyMatch[1];

    const days = Number(queryParams.get('days') || '30') || 30;
    const metricId = queryParams.get('metric') || undefined;

    const now = new Date();
    const start = new Date(now.getTime() - days * 86400000);
    const startIso = toIso(start);
    const endIso = toIso(now);

    let q = supabase
      .from('metric_updates')
      .select('metric_id, value, recorded_at, notes, metric:metrics(id, name, unit, category)')
      .eq('athlete_id', athleteId)
      .gte('recorded_at', startIso)
      .lte('recorded_at', endIso)
      .order('recorded_at', { ascending: true });

    if (metricId) q = q.eq('metric_id', metricId);

    const { data, error } = await q;
    if (error) throw error;

    const rows = (data || []) as any[];

    const grouped = new Map<string, any>();
    for (const r of rows) {
      const m = r.metric;
      if (!m?.id) continue;

      if (!grouped.has(m.id)) {
        grouped.set(m.id, {
          metric_id: m.id,
          metric_name: m.name,
          unit: m.unit || '',
          category: m.category || 'other',
          data: [] as any[],
        });
      }

      grouped.get(m.id).data.push({
        date: r.recorded_at,
        value: Number(r.value),
        notes: r.notes || undefined,
      });
    }

    const metrics = Array.from(grouped.values());

    return {
      athlete_id: athleteId,
      date_range: { start: startIso, end: endIso, days },
      metrics,
      total_updates: rows.length,
    };
  }

  // 5. Top Athletes Proxy (Analytics)
  if (cleanUrl === '/api/analytics/top-athletes') {
    return { athletes: [] };
  }

  // 6. Recent Exports Proxy
  if (cleanUrl === '/api/export') {
    return { exports: [] };
  }


  // Calendar confirmations pending proxy
  if (cleanUrl === '/api/calendar-confirmations/pending') {
    return {
      confirmations: [],
      count: 0,
    };
  }

  // Fallback for other endpoints (try fetch, but safe handle)
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.warn(`[API Mock] Missing endpoint: ${url}. returning empty object.`);
        return {};
      }

      const error = await response.json().catch(() => ({ message: 'API Error' }));
      throw new Error((error as any).error || (error as any).message || 'API Error');
    }

    return await response.json();

  } catch (error: any) {
    console.error(`API Request failed for ${url}:`, error);
    if (error.name === 'SyntaxError') return {};
    throw error;
  }
}

export default apiClient;