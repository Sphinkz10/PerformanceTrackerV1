/**
 * Bulk Participant Management
 * 
 * POST /api/calendar-events/bulk-participants
 * 
 * Add or remove participants from multiple events
 * 
 * Body:
 * {
 *   eventIds: string[],
 *   athleteIds: string[],
 *   action: 'add' | 'remove',
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventIds, athleteIds, action } = body;
    const supabase = await createClient();

    // Validation
    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: 'eventIds array is required' },
        { status: 400 }
      );
    }

    if (!athleteIds || !Array.isArray(athleteIds) || athleteIds.length === 0) {
      return NextResponse.json(
        { error: 'athleteIds array is required' },
        { status: 400 }
      );
    }

    if (!action || !['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be either "add" or "remove"' },
        { status: 400 }
      );
    }

    // Fetch all events
    const { data: events, error: fetchError } = await supabase
      .from('calendar_events')
      .select('id, athlete_ids, requires_confirmation')
      .in('id', eventIds);

    if (fetchError) throw fetchError;

    if (!events || events.length === 0) {
      return NextResponse.json(
        { error: 'No events found' },
        { status: 404 }
      );
    }

    let updatedCount = 0;
    const confirmationsToCreate: any[] = [];

    // Process each event
    for (const event of events) {
      let currentAthleteIds = event.athlete_ids || [];

      if (action === 'add') {
        // Add new athletes (avoid duplicates)
        const newAthleteIds = [...new Set([...currentAthleteIds, ...athleteIds])];
        
        if (newAthleteIds.length !== currentAthleteIds.length) {
          // Update event
          await supabase
            .from('calendar_events')
            .update({ athlete_ids: newAthleteIds })
            .eq('id', event.id);

          updatedCount++;

          // Create confirmations for new athletes if needed
          if (event.requires_confirmation) {
            const newAthletes = athleteIds.filter(
              (id) => !currentAthleteIds.includes(id)
            );

            newAthletes.forEach((athleteId) => {
              confirmationsToCreate.push({
                event_id: event.id,
                athlete_id: athleteId,
                status: 'pending',
              });
            });
          }
        }
      } else if (action === 'remove') {
        // Remove athletes
        const newAthleteIds = currentAthleteIds.filter(
          (id: string) => !athleteIds.includes(id)
        );

        if (newAthleteIds.length !== currentAthleteIds.length) {
          // Update event
          await supabase
            .from('calendar_events')
            .update({ athlete_ids: newAthleteIds })
            .eq('id', event.id);

          updatedCount++;

          // Delete confirmations for removed athletes
          await supabase
            .from('event_confirmations')
            .delete()
            .eq('event_id', event.id)
            .in('athlete_id', athleteIds);
        }
      }
    }

    // Bulk insert confirmations
    if (confirmationsToCreate.length > 0) {
      await supabase.from('event_confirmations').insert(confirmationsToCreate);
    }

    return NextResponse.json({
      success: true,
      count: updatedCount,
      action,
      athleteCount: athleteIds.length,
    });
  } catch (error: any) {
    console.error('Error managing bulk participants:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to manage participants' },
      { status: 500 }
    );
  }
}
