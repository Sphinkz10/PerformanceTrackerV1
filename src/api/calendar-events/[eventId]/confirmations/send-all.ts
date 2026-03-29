/**
 * API: Bulk Send Confirmations
 * POST /api/calendar-events/:eventId/confirmations/send-all
 * 
 * Body:
 * - method: 'email' | 'app' | 'whatsapp'
 * 
 * Sends confirmation to all pending participants of an event
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId } = req.query;
  const { method = 'email' } = req.body;

  if (!eventId || typeof eventId !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  if (!['email', 'app', 'whatsapp'].includes(method)) {
    return res.status(400).json({ error: 'Invalid method' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get all pending confirmations for this event
    const { data: confirmations, error: confirmationsError } = await supabase
      .from('event_confirmations')
      .select(`
        *,
        athlete:athletes(id, name, email, phone)
      `)
      .eq('event_id', eventId)
      .eq('status', 'pending');

    if (confirmationsError) {
      throw confirmationsError;
    }

    if (!confirmations || confirmations.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending confirmations to send',
        sent_count: 0,
      });
    }

    const now = new Date().toISOString();
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each confirmation
    for (const confirmation of confirmations) {
      try {
        // Update confirmation_sent_at
        await supabase
          .from('event_confirmations')
          .update({
            confirmation_sent_at: now,
            confirmation_method: method,
            updated_at: now,
          })
          .eq('id', confirmation.id);

        // Enqueue notification
        await supabase
          .from('notification_queue')
          .insert({
            confirmation_id: confirmation.id,
            workspace_id: confirmation.workspace_id,
            type: 'confirmation',
            method: method,
            recipient_email: method === 'email' ? confirmation.athlete.email : null,
            recipient_phone: method === 'whatsapp' ? confirmation.athlete.phone : null,
            athlete_id: confirmation.athlete_id,
            subject: `Confirme sua presença - ${event.title}`,
            body: generateConfirmationEmailBody(confirmation, event),
            template_data: {
              athlete_name: confirmation.athlete.name,
              event_title: event.title,
              event_date: event.start_time,
              event_time: event.start_time,
              event_location: event.location,
              confirmation_url: `${process.env.NEXT_PUBLIC_APP_URL}/confirm/${confirmation.id}`,
            },
            scheduled_for: now,
            status: 'pending',
          });

        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${confirmation.athlete.name}: ${err.message}`);
        console.error(`Failed to send confirmation to ${confirmation.athlete.name}:`, err);
      }
    }

    console.log(`✅ Bulk send complete: ${results.success} sent, ${results.failed} failed`);

    return res.status(200).json({
      success: true,
      message: `Sent ${results.success} confirmations`,
      sent_count: results.success,
      failed_count: results.failed,
      total_pending: confirmations.length,
      method: method,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error: any) {
    console.error('Error sending bulk confirmations:', error);
    return res.status(500).json({ 
      error: 'Failed to send bulk confirmations',
      details: error.message 
    });
  }
}

/**
 * Generate email body for confirmation
 */
function generateConfirmationEmailBody(confirmation: any, event: any): string {
  const eventDate = new Date(event.start_time);
  const formattedDate = eventDate.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
Olá ${confirmation.athlete.name},

Você tem um treino agendado:

📅 Data: ${formattedDate}
🕐 Hora: ${formattedTime}
📍 Local: ${event.location || 'A definir'}
${event.event_type ? `🏋️ Tipo: ${event.event_type}` : ''}

Por favor confirme sua presença clicando em um dos botões abaixo:

[CONFIRMAR] [TALVEZ] [NÃO POSSO]

Link direto: ${process.env.NEXT_PUBLIC_APP_URL}/confirm/${confirmation.id}

Obrigado!
Equipa PerformTrack
  `.trim();
}
