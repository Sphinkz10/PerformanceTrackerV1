/**
 * Forms API Endpoint - FASE 1.2 FORMS BACKEND
 * 
 * GET /api/forms
 * Returns forms for the current workspace.
 * 
 * Query params:
 * - workspaceId: string (required)
 * - type?: 'wellness' | 'readiness' | 'injury' | 'satisfaction' | 'custom'
 * - isActive?: boolean
 * - includeStats?: boolean (include submission stats)
 * 
 * POST /api/forms
 * Creates a new form.
 * 
 * Body:
 * {
 *   workspaceId: string,
 *   name: string,
 *   description?: string,
 *   type: 'wellness' | 'readiness' | 'injury' | 'satisfaction' | 'custom',
 *   fields: FormField[],
 *   targetAudience?: 'all_athletes' | 'specific_athletes' | 'specific_teams',
 *   targetAthleteIds?: string[],
 *   frequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'on-demand',
 *   sendTime?: string (HH:MM),
 *   activeDays?: number[],
 *   isActive?: boolean
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 1.2 - Forms Backend
 * @reference ARQUITETURA_DEFINITIVA_BASE_DADOS_03_JAN_2025.md - Camada 8
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/forms - List forms
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract params
    const workspaceId = searchParams.get('workspaceId');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');
    const includeStats = searchParams.get('includeStats') === 'true';

    // Validate required params
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Build query
    const tableName = includeStats ? 'forms_with_stats' : 'forms';
    
    let query = supabase
      .from(tableName)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    // Execute query
    const { data: forms, error } = await query;

    if (error) {
      console.error('Error fetching forms:', error);
      return NextResponse.json(
        { error: 'Failed to fetch forms', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      forms: forms || [],
      count: forms?.length || 0,
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/forms:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/forms - Create new form
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { workspaceId, name, fields, createdBy } = body;

    if (!workspaceId || !name || !fields || !createdBy) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['workspaceId', 'name', 'fields', 'createdBy']
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { error: 'fields must be a non-empty array' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Insert form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .insert({
        workspace_id: workspaceId,
        name,
        description: body.description || null,
        type: body.type || 'custom',
        fields,
        target_audience: body.targetAudience || 'all_athletes',
        target_athlete_ids: body.targetAthleteIds || null,
        frequency: body.frequency || 'on-demand',
        send_time: body.sendTime || null,
        active_days: body.activeDays || null,
        is_active: body.isActive !== undefined ? body.isActive : true,
        created_by: createdBy,
      })
      .select()
      .single();

    if (formError) {
      console.error('Error creating form:', formError);
      return NextResponse.json(
        { error: 'Failed to create form', details: formError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      form,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/forms:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/forms - Update form
// ============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, ...updateData } = body;

    if (!formId) {
      return NextResponse.json(
        { error: 'formId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Prepare update data
    const allowedFields = [
      'name', 'description', 'type', 'fields', 
      'target_audience', 'target_athlete_ids',
      'frequency', 'send_time', 'active_days', 'is_active'
    ];

    const filteredData: any = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        // Convert camelCase to snake_case
        const snakeField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        filteredData[snakeField] = updateData[field];
      }
    });

    // Update form
    const { data: form, error } = await supabase
      .from('forms')
      .update(filteredData)
      .eq('id', formId)
      .select()
      .single();

    if (error) {
      console.error('Error updating form:', error);
      return NextResponse.json(
        { error: 'Failed to update form', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      form,
    });

  } catch (error: any) {
    console.error('Unexpected error in PUT /api/forms:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/forms - Delete form
// ============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    if (!formId) {
      return NextResponse.json(
        { error: 'formId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Delete form (cascade will delete submissions)
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId);

    if (error) {
      console.error('Error deleting form:', error);
      return NextResponse.json(
        { error: 'Failed to delete form', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Form deleted successfully',
    });

  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/forms:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
