/**
 * Bulk Calendar Events Operations
 * 
 * POST   /api/calendar-events/bulk - Create multiple events
 * PATCH  /api/calendar-events/bulk - Update multiple events
 * DELETE /api/calendar-events/bulk - Delete multiple events
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // CASO 1: Array direto de eventos
    if (body.events && Array.isArray(body.events)) {
      const { data: createdEvents, error } = await supabase
        .from('calendar_events')
        .insert(body.events)
        .select();
      
      if (error) throw error;
      
      // Se eventos requerem confirmação, criar registos
      for (const event of createdEvents) {
        if (event.requires_confirmation && event.athlete_ids?.length > 0) {
          const confirmations = event.athlete_ids.map((athleteId: string) => ({
            event_id: event.id,
            athlete_id: athleteId,
            status: 'pending'
          }));
          
          await supabase
            .from('event_confirmations')
            .insert(confirmations);
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        events: createdEvents,
        count: createdEvents.length
      });
    }
    
    // CASO 2: Template + Recorrência (gerar eventos automaticamente)
    if (body.template && body.recurrence) {
      // Criar evento base primeiro
      const { data: baseEvent, error: baseError } = await supabase
        .from('calendar_events')
        .insert({
          ...body.template,
          recurrence_pattern: body.recurrence
        })
        .select()
        .single();
      
      if (baseError) throw baseError;
      
      // Usar função SQL para gerar eventos recorrentes
      const { data: generatedEvents, error: genError } = await supabase
        .rpc('generate_recurring_events', {
          p_template_event_id: baseEvent.id,
          p_start_date: body.dateRange.start,
          p_end_date: body.dateRange.end,
          p_recurrence_pattern: body.recurrence
        });
      
      if (genError) throw genError;
      
      return NextResponse.json({
        success: true,
        baseEvent,
        generatedEvents,
        count: generatedEvents.length + 1
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid request body. Provide either "events" array or "template" + "recurrence"' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('Error creating bulk events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create events' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Bulk Update Events
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventIds, updates } = body;
    const supabase = await createClient();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: 'eventIds array is required' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'updates object is required' },
        { status: 400 }
      );
    }

    // Update all events
    const { data: updatedEvents, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .in('id', eventIds)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      events: updatedEvents,
      count: updatedEvents.length,
    });
  } catch (error: any) {
    console.error('Error updating bulk events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update events' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Bulk Delete Events
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventIds } = body;
    const supabase = await createClient();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: 'eventIds array is required' },
        { status: 400 }
      );
    }

    // Delete confirmations first (cascade might handle this, but being explicit)
    await supabase
      .from('event_confirmations')
      .delete()
      .in('event_id', eventIds);

    // Delete all events
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .in('id', eventIds);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: eventIds.length,
    });
  } catch (error: any) {
    console.error('Error deleting bulk events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete events' },
      { status: 500 }
    );
  }
}