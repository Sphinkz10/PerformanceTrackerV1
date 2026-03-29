/**
 * API: Send Reminder
 * POST /api/calendar-confirmations/:confirmationId/reminder
 * 
 * Sends a reminder to athlete about pending confirmation
 * Increments reminder_count
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

  if (!confirmationId || typeof confirmationId !== 'string') {
    return res.status(400).json({ error: 'Confirmation ID is required' });
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

    // Check if already confirmed
    if (confirmation.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Cannot send reminder',
        message: `Status is already ${confirmation.status}`,
      });
    }

    // Increment reminder count and update timestamp
    const { error: updateError } = await supabase
      .from('event_confirmations')
      .update({
        reminder_sent_at: new Date().toISOString(),
        reminder_count: (confirmation.reminder_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', confirmationId);

    if (updateError) {
      throw updateError;
    }

    // Enqueue reminder notification
    const { error: queueError } = await supabase
      .from('notification_queue')
      .insert({
        confirmation_id: confirmationId,
        workspace_id: confirmation.workspace_id,
        type: 'reminder',
        method: 'email', // Default to email
        recipient_email: confirmation.athlete.email,
        athlete_id: confirmation.athlete_id,
        subject: `Lembrete - ${confirmation.event.title}`,
        body: generateReminderEmailBody(confirmation),
        template_data: {
          athlete_name: confirmation.athlete.name,
          event_title: confirmation.event.title,
          event_date: confirmation.event.start_time,
          event_time: confirmation.event.start_time,
          event_location: confirmation.event.location,
          confirmation_url: `${process.env.NEXT_PUBLIC_APP_URL}/confirm/${confirmation.id}`,
          reminder_count: (confirmation.reminder_count || 0) + 1,
        },
        scheduled_for: new Date().toISOString(),
        status: 'pending',
      });

    if (queueError) {
      throw queueError;
    }

    // TODO: In production, trigger actual email send here
    // await sendEmail(confirmation.athlete.email, subject, body);

    console.log(`📬 Reminder sent: ${confirmation.athlete.name} → ${confirmation.event.title} (count: ${(confirmation.reminder_count || 0) + 1})`);

    return res.status(200).json({
      success: true,
      message: 'Reminder sent successfully',
      confirmation: {
        id: confirmation.id,
        athlete_name: confirmation.athlete.name,
        event_title: confirmation.event.title,
        reminder_count: (confirmation.reminder_count || 0) + 1,
      },
    });
  } catch (error: any) {
    console.error('Error sending reminder:', error);
    return res.status(500).json({ 
      error: 'Failed to send reminder',
      details: error.message 
    });
  }
}

/**
 * Generate email body for reminder
 */
function generateReminderEmailBody(confirmation: any): string {
  const eventDate = new Date(confirmation.event.start_time);
  const now = new Date();
  const hoursUntil = Math.round((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  const formattedDate = eventDate.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let timeMessage = '';
  if (hoursUntil <= 2) {
    timeMessage = '⚠️ O treino é HOJE em poucas horas!';
  } else if (hoursUntil <= 24) {
    timeMessage = '📅 O treino é AMANHÃ!';
  } else {
    timeMessage = `📅 Faltam ${Math.round(hoursUntil / 24)} dias para o treino`;
  }

  return `
Olá ${confirmation.athlete.name},

${timeMessage}

Lembrete do seu treino:
📅 Data: ${formattedDate}
🕐 Hora: ${formattedTime}
📍 Local: ${confirmation.event.location || 'A definir'}

Você ainda não confirmou sua presença. Por favor confirme agora:

[CONFIRMAR] [TALVEZ] [NÃO POSSO]

Link direto: ${process.env.NEXT_PUBLIC_APP_URL}/confirm/${confirmation.id}

Até breve!
Equipa PerformTrack
  `.trim();
}
