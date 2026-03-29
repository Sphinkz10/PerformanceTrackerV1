/**
 * Use Calendar Template
 * 
 * POST /api/calendar-templates/[id]/use
 * 
 * Body:
 * {
 *   startDate: string (ISO),
 *   athleteIds?: string[],
 *   overrides?: { title?, location?, ... }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: templateId } = params;
    const { startDate, athleteIds, overrides } = await request.json();
    
    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Usar função SQL create_event_from_template
    const { data: eventId, error } = await supabase
      .rpc('create_event_from_template', {
        p_template_id: templateId,
        p_start_date: startDate,
        p_athlete_ids: athleteIds || null,
        p_overrides: overrides || {}
      });
    
    if (error) throw error;
    
    // Buscar evento criado
    const { data: event } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    return NextResponse.json({
      success: true,
      event
    });
    
  } catch (error: any) {
    console.error('Error using template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create event from template' },
      { status: 500 }
    );
  }
}
