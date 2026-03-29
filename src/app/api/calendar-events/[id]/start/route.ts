/**
 * Start Live Session from Calendar Event - FASE 3 CRITICAL ENDPOINT
 * 
 * POST /api/calendar-events/[id]/start
 * Starts a live session from a scheduled calendar event.
 * 
 * This endpoint:
 * 1. Validates the event exists and is scheduled
 * 2. Creates a session record (via /api/sessions)
 * 3. Updates event status to 'active'
 * 4. Returns all data needed to start LiveCommandContext
 * 
 * Body:
 * {
 *   coachId: string,
 *   workspaceId: string
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   session: {
 *     id: string,
 *     ...
 *   },
 *   event: {
 *     id: string,
 *     title: string,
 *     ...
 *   },
 *   workout: {
 *     id: string,
 *     name: string,
 *     exercises: [...]
 *   },
 *   athletes: [
 *     { id, name, ... }
 *   ]
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 3 - Calendar Integration (CRITICAL!)
 * @reference ARQUITETURA_DEFINITIVA_BASE_DADOS_03_JAN_2025.md - Camada 6+7
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { dispatchCalendarEvent } from '@/utils/events/dispatcher';

interface StartParams {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================================
// POST /api/calendar-events/[id]/start - Start live session
// ============================================================================
export async function POST(
  request: NextRequest,
  { params }: StartParams
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { coachId, workspaceId } = body;

    // Validate required fields
    if (!coachId || !workspaceId) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['coachId', 'workspaceId']
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ==============================================================
    // STEP 1: Fetch event with full details
    // ==============================================================
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found', details: eventError?.message },
        { status: 404 }
      );
    }

    // Validate event can be started
    if (event.status === 'completed') {
      return NextResponse.json(
        { error: 'Event already completed' },
        { status: 400 }
      );
    }

    if (event.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Event is cancelled' },
        { status: 400 }
      );
    }

    // Check if there's already an active session for this event
    const { data: existingSession, error: sessionCheckError } = await supabase
      .from('sessions')
      .select('id, status')
      .eq('calendar_event_id', eventId)
      .in('status', ['active', 'paused'])
      .maybeSingle();

    if (existingSession) {
      return NextResponse.json(
        { 
          error: 'Session already active for this event',
          sessionId: existingSession.id,
          hint: 'Use /api/sessions/[id] to continue the existing session'
        },
        { status: 400 }
      );
    }

    // ==============================================================
    // STEP 2: Fetch workout if workout_id exists
    // ==============================================================
    let workout = null;
    if (event.workout_id) {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            id,
            exercise_id,
            order_index,
            block_name,
            planned_sets,
            planned_reps,
            planned_rest_seconds,
            planned_tempo,
            planned_load,
            coaching_cues,
            exercises (
              id,
              name,
              description,
              category,
              custom_fields,
              demo_video_url,
              thumbnail_url
            )
          )
        `)
        .eq('id', event.workout_id)
        .single();

      if (workoutError) {
        return NextResponse.json(
          { error: 'Workout not found', details: workoutError.message },
          { status: 404 }
        );
      }

      // Transform to LiveWorkout format
      workout = {
        ...workoutData,
        exercises: (workoutData.workout_exercises || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((we: any) => ({
            id: we.id,
            exerciseId: we.exercise_id,
            exerciseName: we.exercises?.name,
            exerciseDescription: we.exercises?.description,
            exerciseCategory: we.exercises?.category,
            customFields: we.exercises?.custom_fields,
            demoVideoUrl: we.exercises?.demo_video_url,
            thumbnailUrl: we.exercises?.thumbnail_url,
            orderIndex: we.order_index,
            blockName: we.block_name,
            plannedSets: we.planned_sets,
            plannedReps: we.planned_reps,
            plannedRestSeconds: we.planned_rest_seconds,
            plannedTempo: we.planned_tempo,
            plannedLoad: we.planned_load,
            coachingCues: we.coaching_cues,
          })),
      };

      delete workout.workout_exercises;
    } else {
      return NextResponse.json(
        { error: 'Event has no workout assigned' },
        { status: 400 }
      );
    }

    // ==============================================================
    // STEP 3: Fetch athletes
    // ==============================================================
    let athletes = [];
    if (event.athlete_ids && event.athlete_ids.length > 0) {
      const { data: athletesData, error: athletesError } = await supabase
        .from('athletes')
        .select('id, name, email, date_of_birth, avatar_url, metadata')
        .in('id', event.athlete_ids);

      if (!athletesError && athletesData) {
        athletes = athletesData;
      }
    } else {
      return NextResponse.json(
        { error: 'Event has no athletes assigned' },
        { status: 400 }
      );
    }

    // ==============================================================
    // STEP 4: Create session via internal API call
    // ==============================================================
    const sessionCreateResponse = await fetch(
      `${request.nextUrl.origin}/api/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          calendarEventId: eventId,
          workoutId: event.workout_id,
          coachId,
          athleteIds: event.athlete_ids,
          plannedWorkout: workout, // Snapshot of planned workout
        }),
      }
    );

    if (!sessionCreateResponse.ok) {
      const errorData = await sessionCreateResponse.json();
      return NextResponse.json(
        { 
          error: 'Failed to create session', 
          details: errorData.error || errorData.message
        },
        { status: 500 }
      );
    }

    const sessionData = await sessionCreateResponse.json();

    // ==============================================================
    // STEP 5: Update event status to 'active'
    // ==============================================================
    const { error: updateError } = await supabase
      .from('calendar_events')
      .update({ status: 'active' })
      .eq('id', eventId);

    if (updateError) {
      console.error('Error updating event status:', updateError);
      // Don't fail the request, session is already created
    }

    // ==============================================================
    // DISPATCH EVENT STARTED
    // ==============================================================
    await dispatchCalendarEvent('started', {
      workspaceId: event.workspace_id,
      eventId: event.id,
      title: event.title,
      startDate: event.start_date,
      athleteIds: event.athlete_ids || [],
      userId: coachId,
    }).catch(err => {
      console.error('❌ Error dispatching calendar event:', err);
    });

    // ==============================================================
    // RETURN SUCCESS WITH ALL DATA FOR LIVE SESSION
    // ==============================================================
    return NextResponse.json({
      success: true,
      session: sessionData.session,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.start_date,
        endDate: event.end_date,
        location: event.location,
      },
      workout,
      athletes,
      message: `Live session started for "${event.title}"`,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in POST /api/calendar-events/[id]/start:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start live session',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}