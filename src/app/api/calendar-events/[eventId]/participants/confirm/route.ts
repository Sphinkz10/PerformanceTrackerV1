/**
 * PARTICIPANT CONFIRMATION API
 * 
 * Endpoints:
 * - POST /api/calendar-events/[eventId]/participants/confirm - Confirm attendance
 * - POST /api/calendar-events/[eventId]/participants/decline - Decline attendance
 * 
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// POST - Confirm Attendance
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();
    const { eventId } = params;
    const body = await request.json();
    
    const { athleteId, workspaceId, action = 'confirm' } = body;
    
    // Validation
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }
    
    if (!athleteId) {
      return NextResponse.json(
        { error: 'athleteId is required' },
        { status: 400 }
      );
    }
    
    // Verify event exists and belongs to workspace
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('workspace_id, title, start_date')
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
    
    // Verify participant exists
    const { data: participant, error: participantError } = await supabase
      .from('event_participants')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('athlete_id', athleteId)
      .single();
    
    if (participantError || !participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    // Update status
    const newStatus = action === 'confirm' ? 'confirmed' : 'declined';
    const now = new Date().toISOString();
    
    const { data: updated, error: updateError } = await supabase
      .from('event_participants')
      .update({
        status: newStatus,
        confirmed_at: now,
      })
      .eq('id', participant.id)
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
      `)
      .single();
    
    if (updateError) {
      console.error('Error updating participant:', updateError);
      return NextResponse.json(
        { error: 'Failed to update participant' },
        { status: 500 }
      );
    }
    
    // TODO: Send notification to coach
    // TODO: Log activity
    
    return NextResponse.json({
      participant: updated,
      message: action === 'confirm' 
        ? 'Attendance confirmed successfully' 
        : 'Attendance declined',
    });
    
  } catch (error) {
    console.error('Error in confirm/decline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
