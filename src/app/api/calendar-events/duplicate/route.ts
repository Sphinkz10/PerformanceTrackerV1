/**
 * Duplicate Calendar Events
 * 
 * POST /api/calendar-events/duplicate
 * 
 * Duplicates events with a time offset
 * 
 * Body:
 * {
 *   eventIds: string[],
 *   offsetDays: number,  // Days to add to the dates (can be negative)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { addDays } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventIds, offsetDays = 7 } = body;
    const supabase = await createClient();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: 'eventIds array is required' },
        { status: 400 }
      );
    }

    // Fetch original events
    const { data: originalEvents, error: fetchError } = await supabase
      .from('calendar_events')
      .select('*')
      .in('id', eventIds);

    if (fetchError) throw fetchError;

    if (!originalEvents || originalEvents.length === 0) {
      return NextResponse.json(
        { error: 'No events found to duplicate' },
        { status: 404 }
      );
    }

    // Create duplicates with offset dates
    const duplicatedEvents = originalEvents.map((event) => {
      const { id, created_at, updated_at, ...eventData } = event;

      // Calculate new dates
      const newStartTime = addDays(new Date(event.start_time), offsetDays);
      const newEndTime = event.end_time
        ? addDays(new Date(event.end_time), offsetDays)
        : null;

      return {
        ...eventData,
        start_time: newStartTime.toISOString(),
        end_time: newEndTime ? newEndTime.toISOString() : null,
        status: 'scheduled', // Reset status to scheduled
        title: `${event.title} (Cópia)`,
      };
    });

    // Insert duplicated events
    const { data: createdEvents, error: createError } = await supabase
      .from('calendar_events')
      .insert(duplicatedEvents)
      .select();

    if (createError) throw createError;

    // Create confirmations for duplicated events if needed
    for (const event of createdEvents) {
      if (event.requires_confirmation && event.athlete_ids?.length > 0) {
        const confirmations = event.athlete_ids.map((athleteId: string) => ({
          event_id: event.id,
          athlete_id: athleteId,
          status: 'pending',
        }));

        await supabase.from('event_confirmations').insert(confirmations);
      }
    }

    return NextResponse.json({
      success: true,
      events: createdEvents,
      count: createdEvents.length,
    });
  } catch (error: any) {
    console.error('Error duplicating events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to duplicate events' },
      { status: 500 }
    );
  }
}
