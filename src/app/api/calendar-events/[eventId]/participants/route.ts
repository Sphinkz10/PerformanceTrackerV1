/**
 * CALENDAR EVENT PARTICIPANTS API
 * 
 * Endpoints:
 * - GET    /api/calendar-events/[eventId]/participants - List participants
 * - POST   /api/calendar-events/[eventId]/participants - Add participants
 * - DELETE /api/calendar-events/[eventId]/participants - Remove participants
 * - PATCH  /api/calendar-events/[eventId]/participants - Update participant status (bulk)
 * 
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET - List Event Participants
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();
    const { eventId } = params;
    
    // Get workspace_id from query
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspace_id');
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }
    
    // Fetch event to verify workspace
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('workspace_id')
      .eq('id', eventId)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (event.workspace_id !== workspaceId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Fetch participants with athlete details
    const { data: participants, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        athlete_id,
        status,
        confirmed_at,
        created_at,
        athletes:athlete_id (
          id,
          name,
          email,
          avatar_url,
          team
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching participants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch participants' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      participants: participants || [],
      count: participants?.length || 0,
    });
    
  } catch (error) {
    console.error('Error in GET participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Add Participants
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();
    const { eventId } = params;
    const body = await request.json();
    
    const { athleteIds, workspaceId } = body;
    
    // Validation
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }
    
    if (!athleteIds || !Array.isArray(athleteIds) || athleteIds.length === 0) {
      return NextResponse.json(
        { error: 'athleteIds must be a non-empty array' },
        { status: 400 }
      );
    }
    
    // Fetch event to verify workspace and get details
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('workspace_id, max_participants, start_date, end_date')
      .eq('id', eventId)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (event.workspace_id !== workspaceId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Check current participant count
    const { count: currentCount, error: countError } = await supabase
      .from('event_participants')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId);
    
    if (countError) {
      console.error('Error counting participants:', countError);
      return NextResponse.json(
        { error: 'Failed to check capacity' },
        { status: 500 }
      );
    }
    
    // Check capacity
    if (event.max_participants) {
      const totalAfterAdd = (currentCount || 0) + athleteIds.length;
      if (totalAfterAdd > event.max_participants) {
        return NextResponse.json(
          { 
            error: `Capacity exceeded. Maximum ${event.max_participants} participants.`,
            current: currentCount,
            max: event.max_participants,
          },
          { status: 400 }
        );
      }
    }
    
    // Check for existing participants (avoid duplicates)
    const { data: existing, error: existingError } = await supabase
      .from('event_participants')
      .select('athlete_id')
      .eq('event_id', eventId)
      .in('athlete_id', athleteIds);
    
    if (existingError) {
      console.error('Error checking existing participants:', existingError);
    }
    
    const existingIds = new Set(existing?.map(p => p.athlete_id) || []);
    const newAthleteIds = athleteIds.filter(id => !existingIds.has(id));
    
    if (newAthleteIds.length === 0) {
      return NextResponse.json(
        { error: 'All selected athletes are already participants' },
        { status: 400 }
      );
    }
    
    // Check for conflicts (optional - can be done client-side for better UX)
    // TODO: Implement conflict detection
    
    // Insert participants
    const participantsToInsert = newAthleteIds.map(athleteId => ({
      event_id: eventId,
      athlete_id: athleteId,
      status: 'pending', // pending, confirmed, declined
      workspace_id: workspaceId,
    }));
    
    const { data: inserted, error: insertError } = await supabase
      .from('event_participants')
      .insert(participantsToInsert)
      .select(`
        id,
        athlete_id,
        status,
        confirmed_at,
        created_at,
        athletes:athlete_id (
          id,
          name,
          email,
          avatar_url,
          team
        )
      `);
    
    if (insertError) {
      console.error('Error inserting participants:', insertError);
      return NextResponse.json(
        { error: 'Failed to add participants' },
        { status: 500 }
      );
    }
    
    // TODO: Send notifications to athletes
    
    return NextResponse.json({
      participants: inserted || [],
      count: inserted?.length || 0,
      skipped: athleteIds.length - newAthleteIds.length,
    });
    
  } catch (error) {
    console.error('Error in POST participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Remove Participants
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();
    const { eventId } = params;
    
    // Get athleteIds from query params or body
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspace_id');
    const athleteIdsParam = searchParams.get('athlete_ids');
    
    let athleteIds: string[] = [];
    
    if (athleteIdsParam) {
      athleteIds = athleteIdsParam.split(',');
    } else {
      // Try body
      const body = await request.json().catch(() => ({}));
      athleteIds = body.athleteIds || [];
    }
    
    // Validation
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }
    
    if (!athleteIds || athleteIds.length === 0) {
      return NextResponse.json(
        { error: 'athlete_ids is required' },
        { status: 400 }
      );
    }
    
    // Verify event exists and belongs to workspace
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('workspace_id')
      .eq('id', eventId)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (event.workspace_id !== workspaceId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete participants
    const { error: deleteError, count } = await supabase
      .from('event_participants')
      .delete({ count: 'exact' })
      .eq('event_id', eventId)
      .in('athlete_id', athleteIds);
    
    if (deleteError) {
      console.error('Error deleting participants:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove participants' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      removed: count || 0,
    });
    
  } catch (error) {
    console.error('Error in DELETE participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH - Update Participant Status (Bulk)
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();
    const { eventId } = params;
    
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspace_id');
    const athleteIdsParam = searchParams.get('athlete_ids');
    
    const body = await request.json();
    const { status } = body;
    
    let athleteIds: string[] = [];
    
    if (athleteIdsParam) {
      athleteIds = athleteIdsParam.split(',');
    } else if (body.athleteIds) {
      athleteIds = body.athleteIds;
    }
    
    // Validation
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }
    
    if (!status || !['pending', 'confirmed', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be one of: pending, confirmed, declined' },
        { status: 400 }
      );
    }
    
    if (!athleteIds || athleteIds.length === 0) {
      return NextResponse.json(
        { error: 'athlete_ids is required' },
        { status: 400 }
      );
    }
    
    // Verify event
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('workspace_id')
      .eq('id', eventId)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (event.workspace_id !== workspaceId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update participants
    const updateData: any = { status };
    if (status === 'confirmed' || status === 'declined') {
      updateData.confirmed_at = new Date().toISOString();
    }
    
    const { data: updated, error: updateError } = await supabase
      .from('event_participants')
      .update(updateData)
      .eq('event_id', eventId)
      .in('athlete_id', athleteIds)
      .select(`
        id,
        athlete_id,
        status,
        confirmed_at,
        athletes:athlete_id (
          id,
          name,
          email,
          avatar_url,
          team
        )
      `);
    
    if (updateError) {
      console.error('Error updating participants:', updateError);
      return NextResponse.json(
        { error: 'Failed to update participants' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      participants: updated || [],
      count: updated?.length || 0,
    });
    
  } catch (error) {
    console.error('Error in PATCH participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}