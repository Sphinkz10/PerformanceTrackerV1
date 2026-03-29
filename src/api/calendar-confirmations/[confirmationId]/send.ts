/**
 * API: Send Confirmation Notification
 * POST /api/calendar-confirmations/:confirmationId/send
 * 
 * Body:
 * - method: 'email' | 'app' | 'whatsapp'
 * 
 * Sends initial confirmation request to athlete
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

  const { confirmationId } = req.query;
  const { method = 'email' } = req.body;

  if (!confirmationId || typeof confirmationId !== 'string') {
    return res.status(400).json({ error: 'Confirmation ID is required' });
  }

  if (!['email', 'app', 'whatsapp'].includes(method)) {
    return res.status(400).json({ error: 'Invalid method' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get confirmation with athlete and event details
    const { data: confirmation, error: confirmationError } = await supabase
      .from('event_confirmations')
      .select(`
        *,
        athlete:athletes(id, name, email, phone),
        event:calendar_events(id, title, start_time, end_time, location, event_type)
      `)
      .eq('id', confirmationId)
      .single();

    if (confirmationError) {
      throw confirmationError;
    }

    if (!confirmation) {
      return res.status(404).json({ error: 'Confirmation not found' });
    }

    // Update confirmation_sent_at
    const { error: updateError } = await supabase
      .from('event_confirmations')
      .update({
        confirmation_sent_at: new Date().toISOString(),
        confirmation_method: method,
      })
      .eq('id', confirmationId);

    if (updateError) {
      throw updateError;
    }

    // Enqueue notification
    const { error: queueError } = await supabase
      .from('notification_queue')
      .insert({
        confirmation_id: confirmationId,
        workspace_id: confirmation.workspace_id,
        type: 'confirmation',
        method: method,
        recipient_email: method === 'email' ? confirmation.athlete.email : null,
        recipient_phone: method === 'whatsapp' ? confirmation.athlete.phone : null,
        athlete_id: confirmation.athlete_id,
        subject: `Confirme sua presença - ${confirmation.event.title}`,
        body: generateConfirmationEmailBody(confirmation),
        template_data: {
          athlete_name: confirmation.athlete.name,
          event_title: confirmation.event.title,
          event_date: confirmation.event.start_time,
          event_time: confirmation.event.start_time,
          event_location: confirmation.event.location,
          confirmation_url: `${process.env.NEXT_PUBLIC_APP_URL}/confirm/${confirmation.id}`,
        },
        scheduled_for: new Date().toISOString(),
        status: 'pending',
      });

    if (queueError) {
      throw queueError;
    }

    // TODO: In production, trigger actual email send here
    // For now, we just enqueue it
    // await sendEmail(confirmation.athlete.email, subject, body);

    return res.status(200).json({
      success: true,
      message: `Confirmation sent via ${method}`,
      confirmation: {
        id: confirmation.id,
        athlete_name: confirmation.athlete.name,
        event_title: confirmation.event.title,
        method: method,
      },
    });
  } catch (error: any) {
    console.error('Error sending confirmation:', error);
    return res.status(500).json({ 
      error: 'Failed to send confirmation',
      details: error.message 
    });
  }
}

/**
 * Generate email body for confirmation
 */
function generateConfirmationEmailBody(confirmation: any): string {
  const eventDate = new Date(confirmation.event.start_time);
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
📍 Local: ${confirmation.event.location || 'A definir'}

Por favor confirme sua presença clicando em um dos botões abaixo:

[CONFIRMAR] [TALVEZ] [NÃO POSSO]

Link direto: ${process.env.NEXT_PUBLIC_APP_URL}/confirm/${confirmation.id}

Obrigado!
Equipa PerformTrack
  `.trim();
}
