/**
 * Metric Packs API Endpoint - SEMANA 1 (Individual Pack Operations)
 * 
 * GET /api/metric-packs/[id] - Get pack details with metrics
 * PUT /api/metric-packs/[id] - Update metric pack
 * DELETE /api/metric-packs/[id] - Deactivate metric pack (soft delete)
 * 
 * @author PerformTrack Team
 * @since Semana 1 - Backend Essencial
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/metric-packs/[id] - Get pack details
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packId = params.id;
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!packId) {
      return NextResponse.json(
        { error: 'packId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: pack, error } = await supabase
      .from('metric_packs')
      .select(`
        *,
        metrics (
          id,
          name,
          display_name,
          description,
          category,
          unit,
          type,
          tags,
          aggregation_method,
          baseline_method,
          is_active
        )
      `)
      .eq('id', packId)
      .single();

    if (error) {
      console.error('Error fetching metric pack:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metric pack', details: error.message },
        { status: 500 }
      );
    }

    if (!pack) {
      return NextResponse.json(
        { error: 'Metric pack not found' },
        { status: 404 }
      );
    }

    // Check activation status for workspace
    let activationStatus = null;
    if (workspaceId) {
      const { data: activation } = await supabase
        .from('metric_pack_activations')
        .select('*')
        .eq('pack_id', packId)
        .eq('workspace_id', workspaceId)
        .single();

      activationStatus = activation || null;
    }

    return NextResponse.json({
      pack,
      metricsCount: pack.metrics?.length || 0,
      activeMetricsCount: pack.metrics?.filter((m: any) => m.is_active).length || 0,
      activationStatus,
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/metric-packs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/metric-packs/[id] - Update metric pack
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packId = params.id;
    const body = await request.json();

    if (!packId) {
      return NextResponse.json(
        { error: 'packId is required' },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      category,
      icon,
      color,
      addMetricIds, // Array of metric IDs to ADD to pack
      removeMetricIds, // Array of metric IDs to REMOVE from pack
      updatedBy,
    } = body;

    const supabase = await createClient();

    // Verify pack exists
    const { data: existingPack, error: fetchError } = await supabase
      .from('metric_packs')
      .select('*')
      .eq('id', packId)
      .single();

    if (fetchError || !existingPack) {
      return NextResponse.json(
        { error: 'Metric pack not found' },
        { status: 404 }
      );
    }

    // Check if this is a global pack - might need special permissions
    if (existingPack.is_global && !updatedBy) {
      return NextResponse.json(
        { error: 'Cannot modify global pack without proper authorization' },
        { status: 403 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;

    // Update pack
    const { data: updatedPack, error: updateError } = await supabase
      .from('metric_packs')
      .update(updateData)
      .eq('id', packId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating metric pack:', updateError);
      return NextResponse.json(
        { error: 'Failed to update metric pack', details: updateError.message },
        { status: 500 }
      );
    }

    // Handle metric additions
    let addedCount = 0;
    if (addMetricIds && addMetricIds.length > 0) {
      const { error: addError } = await supabase
        .from('metrics')
        .update({ pack_id: packId })
        .in('id', addMetricIds);

      if (!addError) {
        addedCount = addMetricIds.length;
      } else {
        console.error('Error adding metrics to pack:', addError);
      }
    }

    // Handle metric removals
    let removedCount = 0;
    if (removeMetricIds && removeMetricIds.length > 0) {
      const { error: removeError } = await supabase
        .from('metrics')
        .update({ pack_id: null })
        .in('id', removeMetricIds)
        .eq('pack_id', packId); // Only remove if they belong to this pack

      if (!removeError) {
        removedCount = removeMetricIds.length;
      } else {
        console.error('Error removing metrics from pack:', removeError);
      }
    }

    return NextResponse.json({
      success: true,
      pack: updatedPack,
      metrics: {
        added: addedCount,
        removed: removedCount,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in PUT /api/metric-packs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/metric-packs/[id] - Deactivate pack (soft delete)
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packId = params.id;
    const { searchParams } = new URL(request.url);
    const deletedBy = searchParams.get('deletedBy');
    const removeMetrics = searchParams.get('removeMetrics') === 'true';

    if (!packId) {
      return NextResponse.json(
        { error: 'packId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify pack exists
    const { data: existingPack, error: fetchError } = await supabase
      .from('metric_packs')
      .select('*')
      .eq('id', packId)
      .single();

    if (fetchError || !existingPack) {
      return NextResponse.json(
        { error: 'Metric pack not found' },
        { status: 404 }
      );
    }

    // Check if global pack - might need special permissions
    if (existingPack.is_global) {
      return NextResponse.json(
        { error: 'Cannot delete global pack' },
        { status: 403 }
      );
    }

    // Count metrics in pack
    const { data: metrics } = await supabase
      .from('metrics')
      .select('id', { count: 'exact', head: true })
      .eq('pack_id', packId);

    const metricsCount = metrics || 0;

    // If removeMetrics=true, unlink all metrics from pack
    if (removeMetrics && metricsCount > 0) {
      await supabase
        .from('metrics')
        .update({ pack_id: null })
        .eq('pack_id', packId);
    }

    // Soft delete: Mark as inactive
    const { data: deactivatedPack, error: updateError } = await supabase
      .from('metric_packs')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', packId)
      .select()
      .single();

    if (updateError) {
      console.error('Error deactivating metric pack:', updateError);
      return NextResponse.json(
        { error: 'Failed to deactivate metric pack', details: updateError.message },
        { status: 500 }
      );
    }

    // Deactivate all workspace activations
    await supabase
      .from('metric_pack_activations')
      .update({
        is_active: false,
        deactivated_at: new Date().toISOString(),
      })
      .eq('pack_id', packId);

    return NextResponse.json({
      success: true,
      pack: deactivatedPack,
      message: 'Metric pack deactivated successfully',
      metrics: {
        count: metricsCount,
        unlinked: removeMetrics ? metricsCount : 0,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/metric-packs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
