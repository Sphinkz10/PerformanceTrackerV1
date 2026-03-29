/**
 * API: Get Event Confirmations
 * GET /api/calendar-events/:eventId/confirmations
 * 
 * Returns all confirmations for a specific event with stats
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

  const { eventId } = req.query;

  if (!eventId || typeof eventId !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all confirmations for event
    const { data: confirmations, error: confirmationsError } = await supabase
      .from('event_confirmations')
      .select(`
        *,
        athlete:athletes(id, name, email, phone, avatar_url),
        event:calendar_events(id, title, start_time, end_time, event_type)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (confirmationsError) {
      throw confirmationsError;
    }

    // Calculate stats
    const stats = {
      total: confirmations.length,
      confirmed: confirmations.filter(c => c.status === 'confirmed').length,
      declined: confirmations.filter(c => c.status === 'declined').length,
      pending: confirmations.filter(c => c.status === 'pending').length,
      maybe: confirmations.filter(c => c.status === 'maybe').length,
      attended: confirmations.filter(c => c.status === 'attended').length,
      no_show: confirmations.filter(c => c.status === 'no_show').length,
      confirmation_rate: 0,
      attendance_rate: 0,
    };

    // Calculate rates
    if (stats.total > 0) {
      stats.confirmation_rate = Math.round(
        (stats.confirmed / stats.total) * 100
      );
    }

    if (stats.confirmed > 0) {
      stats.attendance_rate = Math.round(
        (stats.attended / stats.confirmed) * 100
      );
    }

    return res.status(200).json({
      confirmations,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching event confirmations:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch confirmations',
      details: error.message 
    });
  }
}
