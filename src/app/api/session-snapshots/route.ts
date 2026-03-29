/**
 * Session Snapshots API - SEMANA 2 DIA 1
 * 
 * Snapshots são registos IMUTÁVEIS de sessões executadas.
 * Cada vez que uma live session é completada, cria-se um snapshot
 * que preserva todos os dados naquele momento.
 * 
 * GET  /api/session-snapshots - List snapshots (filtros: athlete, date range, template)
 * POST /api/session-snapshots - Create new snapshot
 * 
 * @author PerformTrack Team
 * @since Week 2 - Session Snapshots
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/session-snapshots - List snapshots with filters
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query params
    const workspaceId = searchParams.get('workspace_id');
    const athleteId = searchParams.get('athlete_id');
    const templateWorkoutId = searchParams.get('template_workout_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('session_snapshots')
      .select(`
        *,
        athlete:athletes(id, name, avatar_url),
        template:workouts(id, name, category),
        calendar_event:calendar_events(id, title, start_date)
      `)
      .eq('workspace_id', workspaceId)
      .order('executed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (athleteId) {
      query = query.eq('athlete_id', athleteId);
    }

    if (templateWorkoutId) {
      query = query.eq('template_workout_id', templateWorkoutId);
    }

    if (startDate) {
      query = query.gte('executed_at', startDate);
    }

    if (endDate) {
      query = query.lte('executed_at', endDate);
    }

    const { data: snapshots, error, count } = await query;

    if (error) {
      console.error('Error fetching snapshots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch snapshots', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      snapshots: snapshots || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/session-snapshots:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/session-snapshots - Create new snapshot
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.workspace_id) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    if (!body.athlete_id) {
      return NextResponse.json(
        { error: 'athlete_id is required' },
        { status: 400 }
      );
    }

    if (!body.snapshot_data) {
      return NextResponse.json(
        { error: 'snapshot_data is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ============================================================
    // STEP 1: Create snapshot record
    // ============================================================
    const snapshotRecord = {
      workspace_id: body.workspace_id,
      calendar_event_id: body.calendar_event_id || null,
      template_workout_id: body.template_workout_id || null,
      athlete_id: body.athlete_id,
      snapshot_data: body.snapshot_data, // JSONB - entire workout structure
      executed_at: body.executed_at || new Date().toISOString(),
      duration_minutes: body.duration_minutes || null,
      completed: body.completed || false,
      coach_notes: body.coach_notes || null,
      athlete_feedback: body.athlete_feedback || null,
      tags: body.tags || [],
      created_by: user.id,
      created_at: new Date().toISOString()
    };

    const { data: snapshot, error: insertError } = await supabase
      .from('session_snapshots')
      .insert(snapshotRecord)
      .select(`
        *,
        athlete:athletes(id, name, avatar_url),
        template:workouts(id, name, category)
      `)
      .single();

    if (insertError) {
      console.error('Error creating snapshot:', insertError);
      return NextResponse.json(
        { error: 'Failed to create snapshot', details: insertError.message },
        { status: 500 }
      );
    }

    // ============================================================
    // STEP 2: Extract and store metrics
    // ============================================================
    if (body.extract_metrics && snapshot) {
      const metrics = extractMetricsFromSnapshot(snapshot.snapshot_data);
      
      if (metrics.length > 0) {
        const metricsToInsert = metrics.map(metric => ({
          snapshot_id: snapshot.id,
          metric_key: metric.key,
          metric_value: metric.value,
          metric_unit: metric.unit,
          exercise_id: metric.exercise_id || null,
          block_id: metric.block_id || null,
          created_at: new Date().toISOString()
        }));

        const { error: metricsError } = await supabase
          .from('snapshot_metrics')
          .insert(metricsToInsert);

        if (metricsError) {
          console.error('Error inserting metrics:', metricsError);
          // Non-critical error, continue
        }
      }
    }

    // ============================================================
    // STEP 3: Update calendar event (mark as completed)
    // ============================================================
    if (body.calendar_event_id && body.completed) {
      await supabase
        .from('calendar_events')
        .update({ status: 'completed' })
        .eq('id', body.calendar_event_id);
    }

    return NextResponse.json({
      snapshot,
      message: 'Snapshot created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/session-snapshots:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER: Extract metrics from snapshot data
// ============================================================================
function extractMetricsFromSnapshot(snapshotData: any): Array<{
  key: string;
  value: number;
  unit: string;
  exercise_id?: string;
  block_id?: string;
}> {
  const metrics: any[] = [];

  if (!snapshotData || !snapshotData.blocks) {
    return metrics;
  }

  let totalVolume = 0;
  let totalReps = 0;
  let totalSets = 0;
  let rpeValues: number[] = [];
  let exerciseCount = 0;

  // Iterate through blocks
  snapshotData.blocks.forEach((block: any) => {
    if (!block.exercises) return;

    block.exercises.forEach((exercise: any) => {
      exerciseCount++;

      if (!exercise.sets) return;

      exercise.sets.forEach((set: any) => {
        totalSets++;

        // Reps
        if (set.reps) {
          totalReps += set.reps;
        }

        // Volume (weight × reps)
        if (set.weight && set.reps) {
          const volume = set.weight * set.reps;
          totalVolume += volume;

          // Per-exercise volume
          metrics.push({
            key: 'exercise_volume',
            value: volume,
            unit: 'kg',
            exercise_id: exercise.id,
            block_id: block.id
          });
        }

        // RPE
        if (set.rpe) {
          rpeValues.push(set.rpe);
        }
      });

      // Per-exercise total volume
      const exerciseTotalVolume = exercise.sets.reduce((acc: number, set: any) => {
        if (set.weight && set.reps) {
          return acc + (set.weight * set.reps);
        }
        return acc;
      }, 0);

      if (exerciseTotalVolume > 0) {
        metrics.push({
          key: 'exercise_total_volume',
          value: exerciseTotalVolume,
          unit: 'kg',
          exercise_id: exercise.id,
          block_id: block.id
        });
      }
    });
  });

  // Aggregate metrics
  metrics.push(
    { key: 'total_volume', value: totalVolume, unit: 'kg' },
    { key: 'total_reps', value: totalReps, unit: 'reps' },
    { key: 'total_sets', value: totalSets, unit: 'sets' },
    { key: 'exercise_count', value: exerciseCount, unit: 'count' }
  );

  // Average RPE
  if (rpeValues.length > 0) {
    const avgRPE = rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length;
    metrics.push({
      key: 'avg_rpe',
      value: Math.round(avgRPE * 10) / 10,
      unit: 'score'
    });
  }

  return metrics;
}
