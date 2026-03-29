/**
 * Copy Week Calendar Events
 * 
 * POST /api/calendar-events/copy-week
 * 
 * Copies all events from one week to another
 * 
 * Body:
 * {
 *   sourceWeekStart: Date,     // Start of source week (Monday)
 *   targetWeekStart: Date,     // Start of target week (Monday)
 *   workspaceId: string,
 *   includeParticipants?: boolean,
 *   includeConfirmations?: boolean,
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { 
  startOfWeek, 
  endOfWeek, 
  differenceInDays,
  addDays,
} from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sourceWeekStart,
      targetWeekStart,
      workspaceId,
      includeParticipants = true,
      includeConfirmations = true,
    } = body;
    const supabase = await createClient();

    // Validate required fields
    if (!sourceWeekStart || !targetWeekStart || !workspaceId) {
      return NextResponse.json(
        { error: 'sourceWeekStart, targetWeekStart, and workspaceId are required' },
        { status: 400 }
      );
    }

    const sourceStart = startOfWeek(new Date(sourceWeekStart), { weekStartsOn: 1 });
    const sourceEnd = endOfWeek(new Date(sourceWeekStart), { weekStartsOn: 1 });
    const targetStart = new Date(targetWeekStart);

    // Calculate day offset between weeks
    const dayOffset = differenceInDays(targetStart, sourceStart);

    // Check if same week
    if (dayOffset === 0) {
      return NextResponse.json(
        { error: 'Source and target weeks cannot be the same' },
        { status: 400 }
      );
    }

    // Fetch all events from source week
    const { data: sourceEvents, error: fetchError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('start_time', sourceStart.toISOString())
      .lte('start_time', sourceEnd.toISOString());

    if (fetchError) throw fetchError;

    if (!sourceEvents || sourceEvents.length === 0) {
      return NextResponse.json({
        success: true,
        events: [],
        count: 0,
        message: 'No events found in source week',
      });
    }

    // Create copied events with adjusted dates
    const copiedEvents = sourceEvents.map((event) => {
      const { id, created_at, updated_at, ...eventData } = event;

      // Calculate new dates
      const newStartTime = addDays(new Date(event.start_time), dayOffset);
      const newEndTime = event.end_time
        ? addDays(new Date(event.end_time), dayOffset)
        : null;

      const copiedEvent: any = {
        ...eventData,
        start_time: newStartTime.toISOString(),
        end_time: newEndTime ? newEndTime.toISOString() : null,
        status: 'scheduled', // Reset to scheduled
      };

      // Optionally exclude participants
      if (!includeParticipants) {
        copiedEvent.athlete_ids = [];
      }

      // Optionally exclude confirmation settings
      if (!includeConfirmations) {
        copiedEvent.requires_confirmation = false;
        copiedEvent.confirmation_deadline = null;
      }

      return copiedEvent;
    });

    // Insert copied events
    const { data: createdEvents, error: createError } = await supabase
      .from('calendar_events')
      .insert(copiedEvents)
      .select();

    if (createError) throw createError;

    // Create confirmations if included
    if (includeParticipants && includeConfirmations) {
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
    }

    return NextResponse.json({
      success: true,
      events: createdEvents,
      count: createdEvents.length,
      sourceWeek: {
        start: sourceStart.toISOString(),
        end: sourceEnd.toISOString(),
      },
      targetWeek: {
        start: startOfWeek(targetStart, { weekStartsOn: 1 }).toISOString(),
        end: endOfWeek(targetStart, { weekStartsOn: 1 }).toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error copying week:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to copy week' },
      { status: 500 }
    );
  }
}
