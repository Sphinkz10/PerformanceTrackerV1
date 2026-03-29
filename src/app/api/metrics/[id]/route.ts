/**
 * Metrics API Endpoint - SEMANA 1 (Individual Metric Operations)
 * 
 * GET /api/metrics/[id] - Get metric details
 * PUT /api/metrics/[id] - Update metric
 * DELETE /api/metrics/[id] - Deactivate metric (soft delete)
 * 
 * @author PerformTrack Team
 * @since Semana 1 - Backend Essencial
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/metrics/[id] - Get metric details
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const metricId = params.id;

    if (!metricId) {
      return NextResponse.json(
        { error: 'metricId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: metric, error } = await supabase
      .from('metrics')
      .select(`
        *,
        metric_packs (
          id,
          name,
          category,
          description,
          is_global
        )
      `)
      .eq('id', metricId)
      .single();

    if (error) {
      console.error('Error fetching metric:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metric', details: error.message },
        { status: 500 }
      );
    }

    if (!metric) {
      return NextResponse.json(
        { error: 'Metric not found' },
        { status: 404 }
      );
    }

    // Get usage statistics
    const { data: usageStats } = await supabase
      .from('metric_updates')
      .select('id', { count: 'exact', head: true })
      .eq('metric_id', metricId);

    return NextResponse.json({
      metric,
      usage: {
        totalUpdates: usageStats || 0,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/metrics/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/metrics/[id] - Update metric
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const metricId = params.id;
    const body = await request.json();

    if (!metricId) {
      return NextResponse.json(
        { error: 'metricId is required' },
        { status: 400 }
      );
    }

    const {
      packId,
      displayName,
      description,
      category,
      unit,
      type,
      tags,
      aggregationMethod,
      baselineMethod,
      baselinePeriodDays,
      baselineManualValue,
      validationRules,
      updatedBy,
    } = body;

    // Validate aggregation method
    const validAggregationMethods = ['latest', 'average', 'sum', 'max', 'min'];
    if (aggregationMethod && !validAggregationMethods.includes(aggregationMethod)) {
      return NextResponse.json(
        { 
          error: 'Invalid aggregation method',
          validMethods: validAggregationMethods
        },
        { status: 400 }
      );
    }

    // Validate baseline method
    const validBaselineMethods = ['rolling-average', 'manual', 'percentile'];
    if (baselineMethod && !validBaselineMethods.includes(baselineMethod)) {
      return NextResponse.json(
        { 
          error: 'Invalid baseline method',
          validMethods: validBaselineMethods
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify metric exists
    const { data: existingMetric, error: fetchError } = await supabase
      .from('metrics')
      .select('*')
      .eq('id', metricId)
      .single();

    if (fetchError || !existingMetric) {
      return NextResponse.json(
        { error: 'Metric not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (packId !== undefined) updateData.pack_id = packId;
    if (displayName !== undefined) updateData.display_name = displayName;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (unit !== undefined) updateData.unit = unit;
    if (type !== undefined) updateData.type = type;
    if (tags !== undefined) updateData.tags = tags;
    if (aggregationMethod !== undefined) updateData.aggregation_method = aggregationMethod;
    if (baselineMethod !== undefined) updateData.baseline_method = baselineMethod;
    if (baselinePeriodDays !== undefined) updateData.baseline_period_days = baselinePeriodDays;
    if (baselineManualValue !== undefined) updateData.baseline_manual_value = baselineManualValue;
    if (validationRules !== undefined) updateData.validation_rules = validationRules;

    // Update metric
    const { data: updatedMetric, error: updateError } = await supabase
      .from('metrics')
      .update(updateData)
      .eq('id', metricId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating metric:', updateError);
      return NextResponse.json(
        { error: 'Failed to update metric', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      metric: updatedMetric,
    });

  } catch (error: any) {
    console.error('Unexpected error in PUT /api/metrics/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/metrics/[id] - Deactivate metric (soft delete)
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const metricId = params.id;
    const { searchParams } = new URL(request.url);
    const deletedBy = searchParams.get('deletedBy');

    if (!metricId) {
      return NextResponse.json(
        { error: 'metricId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify metric exists
    const { data: existingMetric, error: fetchError } = await supabase
      .from('metrics')
      .select('*')
      .eq('id', metricId)
      .single();

    if (fetchError || !existingMetric) {
      return NextResponse.json(
        { error: 'Metric not found' },
        { status: 404 }
      );
    }

    // Check if metric has active updates
    const { data: updates, error: updatesError } = await supabase
      .from('metric_updates')
      .select('id', { count: 'exact', head: true })
      .eq('metric_id', metricId);

    const hasUpdates = (updates || 0) > 0;

    // Soft delete: Mark as inactive
    const { data: deactivatedMetric, error: updateError } = await supabase
      .from('metrics')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', metricId)
      .select()
      .single();

    if (updateError) {
      console.error('Error deactivating metric:', updateError);
      return NextResponse.json(
        { error: 'Failed to deactivate metric', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      metric: deactivatedMetric,
      message: hasUpdates
        ? 'Metric deactivated successfully. Historical data preserved.'
        : 'Metric deactivated successfully.',
      warning: hasUpdates
        ? `This metric has ${updates} updates. Data will be preserved but metric is no longer active.`
        : null,
    });

  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/metrics/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
