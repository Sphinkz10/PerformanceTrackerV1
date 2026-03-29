/**
 * Import Calendar Events
 * 
 * POST /api/calendar-events/import
 * 
 * Import events from external sources (iCal, CSV, JSON)
 * With duplicate and conflict detection
 * 
 * Body:
 * {
 *   events: Partial<CalendarEvent>[],
 *   skipDuplicates?: boolean,
 *   skipConflicts?: boolean,
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { format } from 'date-fns';

interface ImportEventData {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  location?: string;
  event_type?: string;
  status?: string;
  workspace_id: string;
  athlete_ids?: string[];
  requires_confirmation?: boolean;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      events, 
      skipDuplicates = true,
      skipConflicts = false
    } = body;
    const supabase = await createClient();

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'events array is required' },
        { status: 400 }
      );
    }

    // Fetch existing events for duplicate/conflict detection
    const { data: existingEvents, error: fetchError } = await supabase
      .from('calendar_events')
      .select('id, title, start_time, workspace_id')
      .eq('workspace_id', events[0]?.workspace_id);

    if (fetchError) throw fetchError;

    const existingEventsMap = new Map(
      (existingEvents || []).map(e => [
        `${e.title}-${format(new Date(e.start_time), 'yyyy-MM-dd-HH:mm')}`,
        e
      ])
    );

    // Filter events based on options
    const eventsToImport: ImportEventData[] = [];
    const skippedDuplicates: string[] = [];
    const skippedConflicts: string[] = [];

    events.forEach((event: ImportEventData) => {
      // Check for duplicates
      const eventKey = `${event.title}-${format(new Date(event.start_time), 'yyyy-MM-dd-HH:mm')}`;
      
      if (skipDuplicates && existingEventsMap.has(eventKey)) {
        skippedDuplicates.push(event.title);
        return;
      }

      // Check for conflicts (same time window)
      if (skipConflicts) {
        const eventStart = new Date(event.start_time).getTime();
        const hasConflict = (existingEvents || []).some(existing => {
          const existingStart = new Date(existing.start_time).getTime();
          const timeDiff = Math.abs(existingStart - eventStart);
          return timeDiff < 60000; // Within 1 minute
        });

        if (hasConflict) {
          skippedConflicts.push(event.title);
          return;
        }
      }

      eventsToImport.push(event);
    });

    if (eventsToImport.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No events to import after applying filters',
        skipped: {
          duplicates: skippedDuplicates.length,
          conflicts: skippedConflicts.length,
        },
      });
    }

    // Insert events
    const { data: createdEvents, error: createError } = await supabase
      .from('calendar_events')
      .insert(eventsToImport)
      .select();

    if (createError) throw createError;

    // Create confirmations for events that require it
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
      count: createdEvents.length,
      events: createdEvents,
      skipped: {
        duplicates: skippedDuplicates.length,
        conflicts: skippedConflicts.length,
      },
    });
  } catch (error: any) {
    console.error('Error importing events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import events' },
      { status: 500 }
    );
  }
}
