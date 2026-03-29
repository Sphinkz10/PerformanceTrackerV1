/**
 * Athlete Schedule API - FASE 3 CALENDAR INTEGRATION
 * 
 * GET /api/athletes/[id]/schedule
 * Returns scheduled events for a specific athlete.
 * 
 * Query params:
 * - startDate?: string (ISO 8601) - default: today
 * - endDate?: string (ISO 8601) - default: +30 days
 * - status?: string - filter by status
 * - type?: string - filter by type
 * 
 * Response:
 * {
 *   athlete: { id, name, ... },
 *   events: [
 *     {
 *       id: string,
 *       title: string,
 *       startDate: string,
 *       endDate: string,
 *       type: string,
 *       status: string,
 *       workout: { name, type, difficulty },
 *       coach: { name }
 *     }
 *   ],
 *   stats: {
 *     total: number,
 *     upcoming: number,
 *     completed: number
 *   }
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 3 - Calendar Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface ScheduleParams {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================================
// GET /api/athletes/[id]/schedule - Get athlete schedule
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: ScheduleParams
) {
  try {
    const { id: athleteId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get query params with defaults
    const startDate = searchParams.get('startDate') || new Date().toISOString();
    const endDate = searchParams.get('endDate') || 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // +30 days
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const supabase = await createClient();

    // ==============================================================
    // STEP 1: Fetch athlete
    // ==============================================================
    const { data: athlete, error: athleteError } = await supabase
      .from('athletes')
      .select('id, name, email, avatar_url')
      .eq('id', athleteId)
      .single();

    if (athleteError || !athlete) {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }

    // ==============================================================
    // STEP 2: Use get_athlete_schedule function
    // ==============================================================
    const { data: events, error: eventsError } = await supabase
      .rpc('get_athlete_schedule', {
        p_athlete_id: athleteId,
        p_start_date: startDate,
        p_end_date: endDate,
      });

    if (eventsError) {
      console.error('Error fetching schedule:', eventsError);
      return NextResponse.json(
        { error: 'Failed to fetch schedule', details: eventsError.message },
        { status: 500 }
      );
    }

    // Filter by status/type if provided
    let filteredEvents = events || [];
    
    if (status) {
      filteredEvents = filteredEvents.filter((e: any) => e.status === status);
    }
    
    if (type) {
      filteredEvents = filteredEvents.filter((e: any) => e.type === type);
    }

    // ==============================================================
    // STEP 3: Calculate stats
    // ==============================================================
    const now = new Date();
    const stats = {
      total: filteredEvents.length,
      upcoming: filteredEvents.filter((e: any) => 
        new Date(e.start_date) > now && e.status === 'scheduled'
      ).length,
      completed: filteredEvents.filter((e: any) => 
        e.status === 'completed'
      ).length,
      cancelled: filteredEvents.filter((e: any) => 
        e.status === 'cancelled'
      ).length,
    };

    // ==============================================================
    // RETURN SCHEDULE
    // ==============================================================
    return NextResponse.json({
      athlete,
      events: filteredEvents.map((e: any) => ({
        id: e.event_id,
        title: e.title,
        startDate: e.start_date,
        endDate: e.end_date,
        type: e.type,
        status: e.status,
        workoutName: e.workout_name,
        coachName: e.coach_name,
      })),
      stats,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/athletes/[id]/schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
