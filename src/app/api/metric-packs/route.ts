/**
 * Metric Packs API Endpoint - SEMANA 1
 * 
 * GET /api/metric-packs - List metric packs with metrics
 * POST /api/metric-packs - Create new metric pack
 * 
 * @author PerformTrack Team
 * @since Semana 1 - Backend Essencial
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/metric-packs - List metric packs
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const isGlobal = searchParams.get('isGlobal');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive') !== 'false';
    const includeMetrics = searchParams.get('includeMetrics') === 'true';
    const limit = parseInt(searchParams.get('limit') || '100');

    const supabase = await createClient();

    let query = supabase
      .from('metric_packs')
      .select(includeMetrics ? `
        *,
        metrics (
          id,
          name,
          display_name,
          category,
          unit,
          type,
          is_active
        )
      ` : '*')
      .order('name', { ascending: true })
      .limit(limit);

    // Apply filters
    if (workspaceId) {
      query = query.or(`workspace_id.eq.${workspaceId},is_global.eq.true`);
    }
    if (isGlobal !== null) {
      query = query.eq('is_global', isGlobal === 'true');
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (isActive) {
      query = query.eq('is_active', true);
    }

    const { data: packs, error } = await query;

    if (error) {
      console.error('Error fetching metric packs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metric packs', details: error.message },
        { status: 500 }
      );
    }

    // If workspace specified, check activations
    let activationsMap: Record<string, boolean> = {};
    if (workspaceId) {
      const { data: activations } = await supabase
        .from('metric_pack_activations')
        .select('pack_id, is_active')
        .eq('workspace_id', workspaceId);

      activationsMap = (activations || []).reduce((acc: any, act: any) => {
        acc[act.pack_id] = act.is_active;
        return acc;
      }, {});
    }

    // Enrich packs with activation status
    const enrichedPacks = (packs || []).map(pack => ({
      ...pack,
      isActivatedInWorkspace: workspaceId ? (activationsMap[pack.id] || false) : null,
      metricsCount: includeMetrics ? (pack.metrics?.length || 0) : null,
    }));

    return NextResponse.json({
      packs: enrichedPacks,
      count: enrichedPacks.length,
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/metric-packs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/metric-packs - Create new metric pack
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      workspaceId,
      name,
      description,
      category,
      isGlobal,
      icon,
      color,
      metricIds, // Array of metric IDs to include in this pack
      createdBy,
    } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['name']
        },
        { status: 400 }
      );
    }

    // If not global, workspace_id is required
    if (!isGlobal && !workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required for non-global packs' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check for duplicate name
    let duplicateQuery = supabase
      .from('metric_packs')
      .select('id')
      .eq('name', name);

    if (workspaceId) {
      duplicateQuery = duplicateQuery.eq('workspace_id', workspaceId);
    } else if (isGlobal) {
      duplicateQuery = duplicateQuery.eq('is_global', true);
    }

    const { data: existing } = await duplicateQuery.single();

    if (existing) {
      return NextResponse.json(
        { error: 'A metric pack with this name already exists' },
        { status: 409 }
      );
    }

    // Create pack
    const { data: pack, error } = await supabase
      .from('metric_packs')
      .insert({
        workspace_id: workspaceId || null,
        name,
        description: description || null,
        category: category || null,
        is_global: isGlobal || false,
        icon: icon || null,
        color: color || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating metric pack:', error);
      return NextResponse.json(
        { error: 'Failed to create metric pack', details: error.message },
        { status: 500 }
      );
    }

    // Link metrics to pack (if provided)
    let linkedMetrics = null;
    if (metricIds && metricIds.length > 0) {
      const { error: linkError } = await supabase
        .from('metrics')
        .update({ pack_id: pack.id })
        .in('id', metricIds)
        .eq('workspace_id', workspaceId || pack.workspace_id);

      if (linkError) {
        console.error('Error linking metrics to pack:', linkError);
        // Don't fail the whole operation, just log
      } else {
        linkedMetrics = metricIds.length;
      }
    }

    // If workspace-specific pack, auto-activate it
    if (workspaceId && !isGlobal) {
      await supabase
        .from('metric_pack_activations')
        .insert({
          pack_id: pack.id,
          workspace_id: workspaceId,
          is_active: true,
          activated_by: createdBy || null,
        });
    }

    return NextResponse.json({
      success: true,
      pack,
      linkedMetrics,
      autoActivated: !!workspaceId && !isGlobal,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/metric-packs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
