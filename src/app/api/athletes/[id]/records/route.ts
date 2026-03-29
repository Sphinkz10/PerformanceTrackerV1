/**
 * Personal Records API Endpoint - SEMANA 1
 * 
 * GET /api/athletes/[id]/records - List athlete's personal records
 * POST /api/athletes/[id]/records - Create new personal record
 * 
 * @author PerformTrack Team
 * @since Semana 1 - Backend Essencial
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/athletes/[id]/records - List athlete's personal records
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const athleteId = params.id;
    const category = searchParams.get('category'); // strength, speed, endurance, power
    const status = searchParams.get('status') || 'active'; // active, historical, invalidated
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!athleteId) {
      return NextResponse.json(
        { error: 'athleteId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let query = supabase
      .from('personal_records')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('achieved_at', { ascending: false })
      .limit(limit);

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error('Error fetching personal records:', error);
      return NextResponse.json(
        { error: 'Failed to fetch personal records', details: error.message },
        { status: 500 }
      );
    }

    // Group records by category
    const grouped = (records || []).reduce((acc: any, record: any) => {
      const cat = record.category || 'other';
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(record);
      return acc;
    }, {});

    return NextResponse.json({
      records: records || [],
      grouped,
      count: records?.length || 0,
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/athletes/[id]/records:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/athletes/[id]/records - Create new personal record
// ============================================================================
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const athleteId = params.id;
    const body = await request.json();

    const {
      workspaceId,
      metricName,
      displayName,
      category,
      value,
      unit,
      achievedAt,
      source,
      sourceId,
      notes,
      metadata,
      createdBy,
    } = body;

    // Validation
    if (!workspaceId || !metricName || !displayName || value === undefined || !unit || !achievedAt || !source) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['workspaceId', 'metricName', 'displayName', 'value', 'unit', 'achievedAt', 'source']
        },
        { status: 400 }
      );
    }

    if (!['session', 'assessment', 'manual', 'form', 'test'].includes(source)) {
      return NextResponse.json(
        { 
          error: 'Invalid source',
          validSources: ['session', 'assessment', 'manual', 'form', 'test']
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check for previous record of same metric
    const { data: previousRecords } = await supabase
      .from('personal_records')
      .select('id, value')
      .eq('athlete_id', athleteId)
      .eq('metric_name', metricName)
      .eq('status', 'active')
      .order('achieved_at', { ascending: false })
      .limit(1);

    const previousRecord = previousRecords?.[0];
    let improvement_percentage = null;

    if (previousRecord && previousRecord.value) {
      improvement_percentage = ((value - previousRecord.value) / previousRecord.value) * 100;
      
      // Mark previous record as historical
      await supabase
        .from('personal_records')
        .update({ status: 'historical' })
        .eq('id', previousRecord.id);
    }

    // Create new record
    const { data: record, error } = await supabase
      .from('personal_records')
      .insert({
        workspace_id: workspaceId,
        athlete_id: athleteId,
        metric_name: metricName,
        display_name: displayName,
        category: category || null,
        value,
        unit,
        achieved_at: achievedAt,
        source,
        source_id: sourceId || null,
        status: 'active',
        previous_record_id: previousRecord?.id || null,
        previous_value: previousRecord?.value || null,
        improvement_percentage,
        notes: notes || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating personal record:', error);
      return NextResponse.json(
        { error: 'Failed to create personal record', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      record,
      improvement: improvement_percentage ? {
        previous: previousRecord?.value,
        current: value,
        percentage: improvement_percentage,
      } : null,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/athletes/[id]/records:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
