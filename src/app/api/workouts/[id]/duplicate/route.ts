/**
 * Duplicate Workout API - FASE 2 DESIGN STUDIO
 * 
 * POST /api/workouts/[id]/duplicate
 * Clones a workout template with all its exercises.
 * 
 * Body:
 * {
 *   newName: string,
 *   createdBy: string,
 *   keepExercises?: boolean (default: true)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   workout: Workout,
 *   exercisesCloned: number
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 2 - Design Studio Backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface DuplicateParams {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================================
// POST /api/workouts/[id]/duplicate - Clone workout
// ============================================================================
export async function POST(
  request: NextRequest,
  { params }: DuplicateParams
) {
  try {
    const { id: workoutId } = await params;
    const body = await request.json();
    const { newName, createdBy, keepExercises = true } = body;

    // Validate required fields
    if (!newName || !createdBy) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['newName', 'createdBy']
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ==============================================================
    // STEP 1: Use clone_workout function (if keepExercises=true)
    // ==============================================================
    if (keepExercises) {
      const { data: newWorkoutId, error: cloneError } = await supabase
        .rpc('clone_workout', {
          p_workout_id: workoutId,
          p_new_name: newName,
          p_created_by: createdBy,
        });

      if (cloneError) {
        console.error('Error cloning workout:', cloneError);
        return NextResponse.json(
          { error: 'Failed to clone workout', details: cloneError.message },
          { status: 500 }
        );
      }

      // Fetch the cloned workout
      const { data: workout, error: fetchError } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            id,
            exercise_id,
            order_index,
            block_name,
            planned_sets,
            planned_reps
          )
        `)
        .eq('id', newWorkoutId)
        .single();

      if (fetchError) {
        console.error('Error fetching cloned workout:', fetchError);
        return NextResponse.json(
          { error: 'Workout cloned but failed to fetch', details: fetchError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        workout,
        exercisesCloned: workout.workout_exercises?.length || 0,
        message: `Workout "${newName}" cloned successfully`,
      }, { status: 201 });
    }

    // ==============================================================
    // STEP 2: Clone only workout metadata (no exercises)
    // ==============================================================
    const { data: originalWorkout, error: fetchError } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();

    if (fetchError || !originalWorkout) {
      return NextResponse.json(
        { error: 'Original workout not found', details: fetchError?.message },
        { status: 404 }
      );
    }

    const { data: newWorkout, error: createError } = await supabase
      .from('workouts')
      .insert({
        workspace_id: originalWorkout.workspace_id,
        name: newName,
        description: originalWorkout.description,
        type: originalWorkout.type,
        difficulty: originalWorkout.difficulty,
        tags: originalWorkout.tags,
        estimated_duration_minutes: originalWorkout.estimated_duration_minutes,
        is_template: originalWorkout.is_template,
        parent_workout_id: workoutId,
        structure: originalWorkout.structure,
        created_by: createdBy,
        is_active: true,
        version: 1,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating workout clone:', createError);
      return NextResponse.json(
        { error: 'Failed to create workout clone', details: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workout: newWorkout,
      exercisesCloned: 0,
      message: `Workout "${newName}" created (no exercises copied)`,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in POST /api/workouts/[id]/duplicate:', error);
    return NextResponse.json(
      { 
        error: 'Failed to duplicate workout',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
