/**
 * SPRINT 0: Metric Updates API
 * Create and fetch metric updates
 * With automatic source_priority assignment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SOURCE_PRIORITY } from '@/types/metrics';
import type { CreateMetricUpdateRequest, MetricUpdateSourceType } from '@/types/metrics';

// ============================================
// GET METRIC UPDATES
// ============================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const metricId = searchParams.get('metricId');
    const athleteId = searchParams.get('athleteId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sourceType = searchParams.get('sourceType');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Build query
    let query = supabase
      .from('metric_updates')
      .select(`
        *,
        metrics:metric_id (
          name,
          type,
          unit
        )
      `)
      .eq('is_valid', true);
    
    if (metricId) {
      query = query.eq('metric_id', metricId);
    }
    
    if (athleteId) {
      query = query.eq('athlete_id', athleteId);
    }
    
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    
    if (sourceType) {
      query = query.eq('source_type', sourceType);
    }
    
    // Order by priority, then timestamp (with tie-breaker)
    query = query
      .order('source_priority', { ascending: false })
      .order('timestamp', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[GET /api/metric-updates] Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data,
      count: data?.length || 0,
    });
    
  } catch (error: any) {
    console.error('[GET /api/metric-updates] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// CREATE METRIC UPDATE
// ============================================

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body: CreateMetricUpdateRequest = await request.json();
    
    const {
      metricId,
      athleteId,
      value,
      sourceType,
      sourceId,
      timestamp,
      notes,
    } = body;
    
    // Validate required fields
    if (!metricId || !athleteId || value === undefined) {
      return NextResponse.json(
        { error: 'metricId, athleteId, and value are required' },
        { status: 400 }
      );
    }
    
    // Get metric to determine value type
    const { data: metric, error: metricError } = await supabase
      .from('metrics')
      .select('type')
      .eq('id', metricId)
      .single();
    
    if (metricError || !metric) {
      return NextResponse.json(
        { error: 'Metric not found' },
        { status: 404 }
      );
    }
    
    // Determine source priority
    const sourcePriority = SOURCE_PRIORITY[sourceType as MetricUpdateSourceType] || 5;
    
    // Prepare value fields based on metric type
    let valueNumeric: number | null = null;
    let valueBoolean: boolean | null = null;
    let valueText: string | null = null;
    
    switch (metric.type) {
      case 'scale':
      case 'count':
      case 'duration':
      case 'distance':
        if (typeof value !== 'number') {
          return NextResponse.json(
            { error: `Expected number for ${metric.type} metric` },
            { status: 400 }
          );
        }
        valueNumeric = value;
        break;
      
      case 'boolean':
        if (typeof value !== 'boolean') {
          return NextResponse.json(
            { error: 'Expected boolean for boolean metric' },
            { status: 400 }
          );
        }
        valueBoolean = value;
        break;
      
      case 'text':
        if (typeof value !== 'string') {
          return NextResponse.json(
            { error: 'Expected string for text metric' },
            { status: 400 }
          );
        }
        valueText = value;
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown metric type: ${metric.type}` },
          { status: 400 }
        );
    }
    
    // Create update
    const { data: update, error: insertError } = await supabase
      .from('metric_updates')
      .insert([{
        metric_id: metricId,
        athlete_id: athleteId,
        value_numeric: valueNumeric,
        value_boolean: valueBoolean,
        value_text: valueText,
        source_type: sourceType,
        source_id: sourceId,
        source_priority: sourcePriority,  // Set priority based on source
        timestamp: timestamp || new Date().toISOString(),
        notes: notes,
        created_by: user.id,
        is_valid: true,
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('[POST /api/metric-updates] Insert error:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
    
    // Log success
    console.log('[POST /api/metric-updates] Created update:', {
      id: update.id,
      metricId,
      athleteId,
      sourceType,
      sourcePriority,
    });
    
    return NextResponse.json({
      data: update,
      message: 'Metric update created successfully',
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('[POST /api/metric-updates] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// UPDATE METRIC UPDATE (invalidate)
// ============================================

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { id, isValid } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Update ID is required' },
        { status: 400 }
      );
    }
    
    // Update validity (common use case: invalidate incorrect entry)
    const { data, error } = await supabase
      .from('metric_updates')
      .update({ is_valid: isValid ?? false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[PATCH /api/metric-updates] Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data,
      message: 'Metric update updated successfully',
    });
    
  } catch (error: any) {
    console.error('[PATCH /api/metric-updates] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE METRIC UPDATE
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Update ID is required' },
        { status: 400 }
      );
    }
    
    // Soft delete by setting is_valid = false
    // (Prefer this over hard delete for audit trail)
    const { error } = await supabase
      .from('metric_updates')
      .update({ is_valid: false })
      .eq('id', id);
    
    if (error) {
      console.error('[DELETE /api/metric-updates] Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Metric update deleted successfully',
    });
    
  } catch (error: any) {
    console.error('[DELETE /api/metric-updates] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}