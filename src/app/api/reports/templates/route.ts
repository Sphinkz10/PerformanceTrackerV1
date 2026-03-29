/**
 * Report Templates API - FASE 5 ENTERPRISE FEATURES
 * 
 * GET /api/reports/templates
 * Returns available report templates.
 * 
 * POST /api/reports/templates
 * Creates a new report template.
 * 
 * Query params (GET):
 * - workspaceId: string (required)
 * - category?: 'athlete' | 'workout' | 'session' | 'metrics' | 'custom'
 * - tags?: string (comma-separated)
 * 
 * Body (POST):
 * {
 *   workspaceId: string,
 *   name: string,
 *   description?: string,
 *   category: string,
 *   config: {
 *     dataSource: string,
 *     filters: object,
 *     groupBy: string[],
 *     aggregations: array,
 *     visualization: object,
 *     schedule?: object
 *   },
 *   isPublic?: boolean,
 *   tags?: string[]
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 5 - Enterprise Features
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ReportConfig {
  dataSource: 'sessions' | 'metrics' | 'athletes' | 'custom';
  filters?: {
    dateRange?: { start: string; end: string };
    athleteIds?: string[];
    metricIds?: string[];
    workoutTypes?: string[];
  };
  groupBy?: string[];
  aggregations?: Array<{
    field: string;
    function: 'sum' | 'avg' | 'min' | 'max' | 'count';
  }>;
  visualization?: {
    type: 'table' | 'chart' | 'combined';
    chartType?: 'line' | 'bar' | 'pie';
    columns?: string[];
  };
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel' | 'csv';
  };
}

// ============================================================================
// GET /api/reports/templates - List report templates
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const workspaceId = searchParams.get('workspaceId');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');

    // Validate
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('report_templates')
      .select(`
        id,
        name,
        description,
        category,
        config,
        is_public,
        tags,
        created_by,
        created_at,
        updated_at,
        users:created_by (
          name,
          email
        )
      `)
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query = query.overlaps('tags', tagArray);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching report templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
        { status: 500 }
      );
    }

    // Count by category
    const { data: categoryCounts } = await supabase
      .from('report_templates')
      .select('category')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true);

    const categoryStats: { [key: string]: number } = {};
    (categoryCounts || []).forEach((item: any) => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
    });

    return NextResponse.json({
      templates: templates || [],
      stats: {
        total: templates?.length || 0,
        byCategory: categoryStats,
      },
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/reports/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/reports/templates - Create report template
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { workspaceId, name, category, config, createdBy } = body;

    if (!workspaceId || !name || !category || !config) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['workspaceId', 'name', 'category', 'config']
        },
        { status: 400 }
      );
    }

    // Validate config structure
    if (!config.dataSource) {
      return NextResponse.json(
        { error: 'config.dataSource is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create template
    const { data: template, error: templateError } = await supabase
      .from('report_templates')
      .insert({
        workspace_id: workspaceId,
        name,
        description: body.description || null,
        category,
        config,
        is_public: body.isPublic || false,
        tags: body.tags || [],
        created_by: createdBy || null,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (templateError) {
      console.error('Error creating report template:', templateError);
      return NextResponse.json(
        { error: 'Failed to create template', details: templateError.message },
        { status: 500 }
      );
    }

    // Log audit
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: createdBy,
      action: 'create',
      entity_type: 'report_template',
      entity_id: template.id,
      entity_name: name,
      metadata: {
        category,
        isPublic: body.isPublic,
      },
    });

    return NextResponse.json({
      success: true,
      template,
      message: `Report template "${name}" created successfully`,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/reports/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/reports/templates - Update template
// ============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, userId, ...updateData } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current template for audit
    const { data: currentTemplate } = await supabase
      .from('report_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    // Prepare update data
    const allowedFields = ['name', 'description', 'config', 'isPublic', 'tags', 'metadata'];
    const filteredData: any = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        const snakeField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        filteredData[snakeField] = updateData[field];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update
    const { data: template, error } = await supabase
      .from('report_templates')
      .update(filteredData)
      .eq('id', templateId)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return NextResponse.json(
        { error: 'Failed to update template', details: error.message },
        { status: 500 }
      );
    }

    // Log audit
    if (currentTemplate) {
      await supabase.from('audit_logs').insert({
        workspace_id: template.workspace_id,
        user_id: userId,
        action: 'update',
        entity_type: 'report_template',
        entity_id: templateId,
        entity_name: template.name,
        changes: {
          before: currentTemplate,
          after: template,
        },
      });
    }

    return NextResponse.json({
      success: true,
      template,
      message: 'Template updated successfully',
    });

  } catch (error: any) {
    console.error('Unexpected error in PUT /api/reports/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/reports/templates - Delete template
// ============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');
    const userId = searchParams.get('userId');

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get template for audit
    const { data: template } = await supabase
      .from('report_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    // Soft delete (mark as inactive)
    const { error } = await supabase
      .from('report_templates')
      .update({ is_active: false })
      .eq('id', templateId);

    if (error) {
      console.error('Error deleting template:', error);
      return NextResponse.json(
        { error: 'Failed to delete template', details: error.message },
        { status: 500 }
      );
    }

    // Log audit
    if (template) {
      await supabase.from('audit_logs').insert({
        workspace_id: template.workspace_id,
        user_id: userId,
        action: 'delete',
        entity_type: 'report_template',
        entity_id: templateId,
        entity_name: template.name,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });

  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/reports/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
