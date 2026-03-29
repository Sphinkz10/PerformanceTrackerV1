/**
 * API: Get Pending Confirmations Dashboard
 * GET /api/calendar-confirmations/pending
 * 
 * Query params:
 * - workspace_id (required)
 * - upcoming_only (optional, boolean)
 * - hours_before (optional, number - filter events within X hours)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { workspace_id, upcoming_only, hours_before } = req.query;

  if (!workspace_id || typeof workspace_id !== 'string') {
    return res.status(400).json({ error: 'Workspace ID is required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use the pending_confirmations view for optimized query
    let query = supabase
      .from('pending_confirmations')
      .select('*')
      .eq('workspace_id', workspace_id);

    // Filter only upcoming events
    if (upcoming_only === 'true') {
      query = query.eq('is_past_event', false);
    }

    // Filter by hours until event
    if (hours_before && typeof hours_before === 'string') {
      const hours = parseInt(hours_before);
      if (!isNaN(hours)) {
        query = query.lte('hours_until_event', hours);
      }
    }

    const { data: confirmations, error: confirmationsError } = await query
      .order('event_start', { ascending: true });

    if (confirmationsError) {
      throw confirmationsError;
    }

    // Calculate stats
    const now = new Date();
    const stats = {
      total: confirmations.length,
      next_24h: confirmations.filter(c => {
        const eventTime = new Date(c.event_start);
        const hoursDiff = (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 0 && hoursDiff <= 24;
      }).length,
      next_48h: confirmations.filter(c => {
        const eventTime = new Date(c.event_start);
        const hoursDiff = (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 0 && hoursDiff <= 48;
      }).length,
      overdue: confirmations.filter(c => {
        const eventTime = new Date(c.event_start);
        return eventTime.getTime() < now.getTime();
      }).length,
    };

    return res.status(200).json({
      confirmations,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching pending confirmations:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch pending confirmations',
      details: error.message 
    });
  }
}
