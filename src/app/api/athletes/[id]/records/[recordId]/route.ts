/**
 * Personal Records API Endpoint - SEMANA 1 (Individual Record Operations)
 * 
 * PUT /api/athletes/[id]/records/[recordId] - Update personal record
 * DELETE /api/athletes/[id]/records/[recordId] - Invalidate personal record (soft delete)
 * 
 * @author PerformTrack Team
 * @since Semana 1 - Backend Essencial
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// PUT /api/athletes/[id]/records/[recordId] - Update personal record
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; recordId: string } }
) {
  try {
    const { id: athleteId, recordId } = params;
    const body = await request.json();

    if (!athleteId || !recordId) {
      return NextResponse.json(
        { error: 'athleteId and recordId are required' },
        { status: 400 }
      );
    }

    const {
      displayName,
      category,
      value,
      unit,
      achievedAt,
      notes,
      validatedBy,
      validationNotes,
      metadata,
      updatedBy,
    } = body;

    const supabase = await createClient();

    // Verify record exists and belongs to athlete
    const { data: existingRecord, error: fetchError } = await supabase
      .from('personal_records')
      .select('*')
      .eq('id', recordId)
      .eq('athlete_id', athleteId)
      .single();

    if (fetchError || !existingRecord) {
      return NextResponse.json(
        { error: 'Record not found or does not belong to this athlete' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (displayName !== undefined) updateData.display_name = displayName;
    if (category !== undefined) updateData.category = category;
    if (value !== undefined) updateData.value = value;
    if (unit !== undefined) updateData.unit = unit;
    if (achievedAt !== undefined) updateData.achieved_at = achievedAt;
    if (notes !== undefined) updateData.notes = notes;
    if (metadata !== undefined) updateData.metadata = metadata;

    // Handle validation
    if (validatedBy) {
      updateData.validated_by = validatedBy;
      updateData.validated_at = new Date().toISOString();
      if (validationNotes) {
        updateData.validation_notes = validationNotes;
      }
    }

    // Update record
    const { data: updatedRecord, error: updateError } = await supabase
      .from('personal_records')
      .update(updateData)
      .eq('id', recordId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating personal record:', updateError);
      return NextResponse.json(
        { error: 'Failed to update personal record', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      record: updatedRecord,
    });

  } catch (error: any) {
    console.error('Unexpected error in PUT /api/athletes/[id]/records/[recordId]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/athletes/[id]/records/[recordId] - Invalidate record (soft delete)
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; recordId: string } }
) {
  try {
    const { id: athleteId, recordId } = params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Manual invalidation';
    const deletedBy = searchParams.get('deletedBy');

    if (!athleteId || !recordId) {
      return NextResponse.json(
        { error: 'athleteId and recordId are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify record exists and belongs to athlete
    const { data: existingRecord, error: fetchError } = await supabase
      .from('personal_records')
      .select('*')
      .eq('id', recordId)
      .eq('athlete_id', athleteId)
      .single();

    if (fetchError || !existingRecord) {
      return NextResponse.json(
        { error: 'Record not found or does not belong to this athlete' },
        { status: 404 }
      );
    }

    // Soft delete: Mark as invalidated
    const { data: invalidatedRecord, error: updateError } = await supabase
      .from('personal_records')
      .update({
        status: 'invalidated',
        validation_notes: reason,
        validated_by: deletedBy || null,
        validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', recordId)
      .select()
      .single();

    if (updateError) {
      console.error('Error invalidating personal record:', updateError);
      return NextResponse.json(
        { error: 'Failed to invalidate personal record', details: updateError.message },
        { status: 500 }
      );
    }

    // If this was an active record, promote the previous record (if exists)
    if (existingRecord.status === 'active' && existingRecord.previous_record_id) {
      await supabase
        .from('personal_records')
        .update({ status: 'active' })
        .eq('id', existingRecord.previous_record_id);
    }

    return NextResponse.json({
      success: true,
      record: invalidatedRecord,
      message: 'Personal record invalidated successfully',
    });

  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/athletes/[id]/records/[recordId]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
