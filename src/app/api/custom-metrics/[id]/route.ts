/**
 * Custom Metric Detail API - Data OS V3
 * 
 * GET    /api/custom-metrics/[id]
 * PUT    /api/custom-metrics/[id]
 * DELETE /api/custom-metrics/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: customMetric, error } = await supabase
      .from('custom_metrics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Custom metric not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch custom metric' }, { status: 500 });
    }

    return NextResponse.json({ customMetric });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { id } = params;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = {
      name: body.name,
      description: body.description,
      unit: body.unit,
      category: body.category,
      formula: body.formula,
      formula_type: body.formula_type,
      source_metrics: body.source_metrics,
      display_config: body.display_config,
      visibility: body.visibility,
      updated_at: new Date().toISOString()
    };

    const { data: customMetric, error } = await supabase
      .from('custom_metrics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update custom metric' }, { status: 500 });
    }

    return NextResponse.json({ customMetric, message: 'Custom metric updated' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('custom_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete custom metric' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Custom metric deleted', id });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
