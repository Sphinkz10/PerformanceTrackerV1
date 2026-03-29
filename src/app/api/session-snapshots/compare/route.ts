/**
 * Session Snapshots Compare API - SEMANA 2 DIA 1
 * 
 * POST /api/session-snapshots/compare
 * Compara dois ou mais snapshots para análise de progressão
 * 
 * Body:
 * {
 *   snapshot_ids: string[], // 2 ou mais IDs
 *   comparison_metrics?: string[] // Métricas específicas para comparar
 * }
 * 
 * Response:
 * {
 *   snapshots: Array<Snapshot>,
 *   comparison: {
 *     total_volume: { values: [...], change: {...} },
 *     avg_rpe: { values: [...], change: {...} },
 *     ...
 *   },
 *   progression: {
 *     trend: 'improving' | 'declining' | 'stable',
 *     percentage: number
 *   }
 * }
 * 
 * @author PerformTrack Team
 * @since Week 2 - Session Snapshots
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface CompareBody {
  snapshot_ids: string[];
  comparison_metrics?: string[];
}

// ============================================================================
// POST /api/session-snapshots/compare - Compare snapshots
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body: CompareBody = await request.json();

    // Validate
    if (!body.snapshot_ids || !Array.isArray(body.snapshot_ids)) {
      return NextResponse.json(
        { error: 'snapshot_ids array is required' },
        { status: 400 }
      );
    }

    if (body.snapshot_ids.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 snapshots are required for comparison' },
        { status: 400 }
      );
    }

    if (body.snapshot_ids.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 snapshots can be compared at once' },
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
    // STEP 1: Fetch all snapshots
    // ============================================================
    const { data: snapshots, error: snapshotsError } = await supabase
      .from('session_snapshots')
      .select(`
        *,
        athlete:athletes(id, name, avatar_url),
        template:workouts(id, name, category),
        metrics:snapshot_metrics(*)
      `)
      .in('id', body.snapshot_ids)
      .order('executed_at', { ascending: true });

    if (snapshotsError) {
      console.error('Error fetching snapshots:', snapshotsError);
      return NextResponse.json(
        { error: 'Failed to fetch snapshots', details: snapshotsError.message },
        { status: 500 }
      );
    }

    if (!snapshots || snapshots.length !== body.snapshot_ids.length) {
      return NextResponse.json(
        { error: 'One or more snapshots not found' },
        { status: 404 }
      );
    }

    // ============================================================
    // STEP 2: Verify all snapshots are from same athlete & template
    // ============================================================
    const athleteId = snapshots[0].athlete_id;
    const templateId = snapshots[0].template_workout_id;

    const allSameAthlete = snapshots.every(s => s.athlete_id === athleteId);
    const allSameTemplate = snapshots.every(s => s.template_workout_id === templateId);

    if (!allSameAthlete) {
      return NextResponse.json(
        { 
          error: 'All snapshots must be from the same athlete',
          warning: true 
        },
        { status: 400 }
      );
    }

    // ============================================================
    // STEP 3: Extract and compare metrics
    // ============================================================
    const metricsToCompare = body.comparison_metrics || [
      'total_volume',
      'total_reps',
      'total_sets',
      'avg_rpe',
      'exercise_count'
    ];

    const comparison: any = {};

    metricsToCompare.forEach(metricKey => {
      const values = snapshots.map(snapshot => {
        const metric = snapshot.metrics?.find((m: any) => m.metric_key === metricKey);
        return metric ? parseFloat(metric.metric_value) : null;
      });

      // Calculate change from first to last
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      let change = null;
      let changePercentage = null;

      if (firstValue !== null && lastValue !== null && firstValue !== 0) {
        change = lastValue - firstValue;
        changePercentage = ((lastValue - firstValue) / firstValue) * 100;
      }

      comparison[metricKey] = {
        values,
        dates: snapshots.map(s => s.executed_at),
        change,
        changePercentage: changePercentage ? Math.round(changePercentage * 10) / 10 : null,
        unit: snapshots[0].metrics?.find((m: any) => m.metric_key === metricKey)?.metric_unit || '',
        trend: change === null ? 'unknown' : (change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable')
      };
    });

    // ============================================================
    // STEP 4: Calculate overall progression
    // ============================================================
    const volumeComparison = comparison['total_volume'];
    let progression: any = {
      trend: 'stable',
      percentage: 0,
      summary: ''
    };

    if (volumeComparison && volumeComparison.changePercentage !== null) {
      const pct = volumeComparison.changePercentage;
      
      if (pct > 10) {
        progression.trend = 'improving';
        progression.summary = `Volume aumentou ${pct.toFixed(1)}%`;
      } else if (pct < -10) {
        progression.trend = 'declining';
        progression.summary = `Volume diminuiu ${Math.abs(pct).toFixed(1)}%`;
      } else {
        progression.trend = 'stable';
        progression.summary = `Volume estável (${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)`;
      }
      
      progression.percentage = pct;
    }

    // ============================================================
    // STEP 5: Exercise-level comparison (bonus)
    // ============================================================
    const exerciseComparison = compareExercisesAcrossSnapshots(snapshots);

    return NextResponse.json({
      snapshots,
      comparison,
      progression,
      exerciseComparison,
      metadata: {
        athlete: snapshots[0].athlete,
        template: snapshots[0].template,
        comparedCount: snapshots.length,
        dateRange: {
          start: snapshots[0].executed_at,
          end: snapshots[snapshots.length - 1].executed_at
        }
      }
    });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/session-snapshots/compare:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER: Compare exercises across snapshots
// ============================================================================
function compareExercisesAcrossSnapshots(snapshots: any[]): any {
  const exerciseMap = new Map<string, any[]>();

  // Group exercises by name across snapshots
  snapshots.forEach((snapshot, snapshotIndex) => {
    const snapshotData = snapshot.snapshot_data;
    
    if (!snapshotData || !snapshotData.blocks) return;

    snapshotData.blocks.forEach((block: any) => {
      if (!block.exercises) return;

      block.exercises.forEach((exercise: any) => {
        const exerciseName = exercise.name || 'Unknown';
        
        if (!exerciseMap.has(exerciseName)) {
          exerciseMap.set(exerciseName, []);
        }

        // Calculate exercise metrics
        const sets = exercise.sets || [];
        const totalVolume = sets.reduce((acc: number, set: any) => {
          if (set.weight && set.reps) {
            return acc + (set.weight * set.reps);
          }
          return acc;
        }, 0);

        const maxWeight = sets.reduce((max: number, set: any) => {
          return set.weight > max ? set.weight : max;
        }, 0);

        const totalReps = sets.reduce((acc: number, set: any) => {
          return acc + (set.reps || 0);
        }, 0);

        exerciseMap.get(exerciseName)!.push({
          snapshotIndex,
          snapshotDate: snapshot.executed_at,
          totalVolume,
          maxWeight,
          totalReps,
          setsCount: sets.length
        });
      });
    });
  });

  // Convert map to array with progression analysis
  const exerciseComparisons: any[] = [];

  exerciseMap.forEach((data, exerciseName) => {
    if (data.length < 2) return; // Need at least 2 snapshots

    const firstData = data[0];
    const lastData = data[data.length - 1];

    const volumeChange = lastData.totalVolume - firstData.totalVolume;
    const volumeChangePercentage = firstData.totalVolume > 0
      ? ((volumeChange / firstData.totalVolume) * 100)
      : 0;

    const maxWeightChange = lastData.maxWeight - firstData.maxWeight;
    const maxWeightChangePercentage = firstData.maxWeight > 0
      ? ((maxWeightChange / firstData.maxWeight) * 100)
      : 0;

    exerciseComparisons.push({
      exerciseName,
      dataPoints: data,
      progression: {
        volumeChange,
        volumeChangePercentage: Math.round(volumeChangePercentage * 10) / 10,
        maxWeightChange,
        maxWeightChangePercentage: Math.round(maxWeightChangePercentage * 10) / 10,
        trend: volumeChangePercentage > 5 ? 'improving' : volumeChangePercentage < -5 ? 'declining' : 'stable'
      }
    });
  });

  return exerciseComparisons;
}
