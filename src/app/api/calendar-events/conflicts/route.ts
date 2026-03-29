/**
 * Calendar Events Conflicts API Endpoint
 * 
 * GET /api/calendar-events/conflicts
 * Checks for scheduling conflicts
 * 
 * Query params:
 * - workspaceId: string (required)
 * - athleteIds: string (comma-separated)
 * - coachId: string
 * - location: string
 * - startDate: string (ISO 8601)
 * - endDate: string (ISO 8601)
 * - excludeEventId: string (exclude from check)
 * - eventId: string (check conflicts for existing event)
 * 
 * @author PerformTrack Team
 * @since Fase 2 - Advanced Features
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/calendar-events/conflicts - Check for conflicts
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract params
    const workspaceId = searchParams.get('workspaceId');
    const athleteIdsParam = searchParams.get('athleteIds');
    const coachId = searchParams.get('coachId');
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const excludeEventId = searchParams.get('excludeEventId');
    const eventId = searchParams.get('eventId');

    // Validate required params
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ==============================================================
    // If eventId provided, get event details first
    // ==============================================================
    let checkParams = {
      athleteIds: athleteIdsParam ? athleteIdsParam.split(',') : [],
      coachId,
      location,
      startDate,
      endDate,
      excludeEventId,
    };

    if (eventId) {
      const { data: event, error: eventError } = await supabase
        .from('calendar_events')
        .select('athlete_ids, coach_id, location, start_date, end_date')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }

      checkParams = {
        athleteIds: event.athlete_ids || [],
        coachId: event.coach_id,
        location: event.location,
        startDate: event.start_date,
        endDate: event.end_date,
        excludeEventId: eventId,
      };
    }

    // Validate dates if provided
    if (!checkParams.startDate || !checkParams.endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    // ==============================================================
    // Find conflicts
    // ==============================================================
    const conflicts: any[] = [];

    // 1. ATHLETE CONFLICTS
    if (checkParams.athleteIds && checkParams.athleteIds.length > 0) {
      let athleteQuery = supabase
        .from('calendar_events')
        .select('id, title, start_date, end_date, type, athlete_ids, coach_id, location')
        .eq('workspace_id', workspaceId)
        .neq('status', 'cancelled')
        .overlaps('athlete_ids', checkParams.athleteIds)
        .or(`start_date.lte.${checkParams.endDate},end_date.gte.${checkParams.startDate}`);

      if (checkParams.excludeEventId) {
        athleteQuery = athleteQuery.neq('id', checkParams.excludeEventId);
      }

      const { data: athleteConflicts } = await athleteQuery;

      if (athleteConflicts && athleteConflicts.length > 0) {
        athleteConflicts.forEach(conflict => {
          // Find which athletes are conflicting
          const conflictingAthletes = conflict.athlete_ids.filter((id: string) => 
            checkParams.athleteIds.includes(id)
          );

          conflicts.push({
            ...conflict,
            conflict_type: 'athlete',
            conflicting_athletes: conflictingAthletes,
          });
        });
      }
    }

    // 2. COACH CONFLICTS
    if (checkParams.coachId) {
      let coachQuery = supabase
        .from('calendar_events')
        .select('id, title, start_date, end_date, type, athlete_ids, coach_id, location')
        .eq('workspace_id', workspaceId)
        .eq('coach_id', checkParams.coachId)
        .neq('status', 'cancelled')
        .or(`start_date.lte.${checkParams.endDate},end_date.gte.${checkParams.startDate}`);

      if (checkParams.excludeEventId) {
        coachQuery = coachQuery.neq('id', checkParams.excludeEventId);
      }

      const { data: coachConflicts } = await coachQuery;

      if (coachConflicts && coachConflicts.length > 0) {
        coachConflicts.forEach(conflict => {
          // Avoid duplicates (if already added as athlete conflict)
          if (!conflicts.find(c => c.id === conflict.id)) {
            conflicts.push({
              ...conflict,
              conflict_type: 'coach',
            });
          }
        });
      }
    }

    // 3. LOCATION CONFLICTS
    if (checkParams.location && checkParams.location.trim() !== '') {
      let locationQuery = supabase
        .from('calendar_events')
        .select('id, title, start_date, end_date, type, athlete_ids, coach_id, location')
        .eq('workspace_id', workspaceId)
        .eq('location', checkParams.location)
        .neq('status', 'cancelled')
        .or(`start_date.lte.${checkParams.endDate},end_date.gte.${checkParams.startDate}`);

      if (checkParams.excludeEventId) {
        locationQuery = locationQuery.neq('id', checkParams.excludeEventId);
      }

      const { data: locationConflicts } = await locationQuery;

      if (locationConflicts && locationConflicts.length > 0) {
        locationConflicts.forEach(conflict => {
          // Avoid duplicates
          if (!conflicts.find(c => c.id === conflict.id)) {
            conflicts.push({
              ...conflict,
              conflict_type: 'location',
            });
          }
        });
      }
    }

    // ==============================================================
    // Return conflicts
    // ==============================================================
    return NextResponse.json({
      hasConflicts: conflicts.length > 0,
      conflicts,
      conflictCount: conflicts.length,
      summary: {
        athleteConflicts: conflicts.filter(c => c.conflict_type === 'athlete').length,
        coachConflicts: conflicts.filter(c => c.conflict_type === 'coach').length,
        locationConflicts: conflicts.filter(c => c.conflict_type === 'location').length,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/calendar-events/conflicts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
