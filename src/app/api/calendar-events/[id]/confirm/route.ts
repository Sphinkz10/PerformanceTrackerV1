/**
 * Confirm/Decline Event Attendance
 * 
 * POST /api/calendar-events/[id]/confirm
 * 
 * Body:
 * {
 *   athleteId: string,
 *   status: 'confirmed' | 'declined' | 'maybe',
 *   reason?: string,
 *   reasonCategory?: 'injury' | 'illness' | 'work' | 'personal' | 'other'
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: eventId } = params;
    const { athleteId, status, reason, reasonCategory } = await request.json();
    
    // Validar
    if (!athleteId || !status) {
      return NextResponse.json(
        { error: 'athleteId and status are required' },
        { status: 400 }
      );
    }
    
    if (!['confirmed', 'declined', 'maybe'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Verificar se evento existe e atleta está incluído
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('id, title, athlete_ids, coach_id, requires_confirmation, workspace_id')
      .eq('id', eventId)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (!event.athlete_ids?.includes(athleteId)) {
      return NextResponse.json(
        { error: 'Athlete not assigned to this event' },
        { status: 403 }
      );
    }
    
    // Upsert confirmação
    const { data: confirmation, error: confirmError } = await supabase
      .from('event_confirmations')
      .upsert({
        event_id: eventId,
        athlete_id: athleteId,
        status,
        response_date: new Date().toISOString(),
        decline_reason: status === 'declined' ? reason : null,
        decline_reason_category: status === 'declined' ? reasonCategory : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'event_id,athlete_id'
      })
      .select()
      .single();
    
    if (confirmError) throw confirmError;
    
    // Trigger atualiza contadores automaticamente (via trigger SQL)
    
    // Se declinou, notificar coach
    if (status === 'declined' && event.coach_id) {
      await supabase
        .from('notifications')
        .insert({
          workspace_id: event.workspace_id,
          user_id: event.coach_id,
          type: 'event_declined',
          title: 'Atleta declinou evento',
          message: `Um atleta declinou presença em "${event.title}"`,
          metadata: {
            event_id: eventId,
            athlete_id: athleteId,
            reason: reason
          }
        });
    }
    
    return NextResponse.json({
      success: true,
      confirmation
    });
    
  } catch (error: any) {
    console.error('Error confirming event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to confirm event' },
      { status: 500 }
    );
  }
}
