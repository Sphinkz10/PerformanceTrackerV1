/**
 * API: Check-in with QR Code
 * POST /api/calendar-confirmations/check-in
 * 
 * Body:
 * - check_in_code: string (8-char code)
 * 
 * Validates code and marks athlete as attended
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

  const { check_in_code } = req.body;

  if (!check_in_code || typeof check_in_code !== 'string') {
    return res.status(400).json({ error: 'Check-in code is required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find confirmation by check-in code
    const { data: confirmation, error: confirmationError } = await supabase
      .from('event_confirmations')
      .select(`
        *,
        athlete:athletes(id, name, email),
        event:calendar_events(id, title, start_time, end_time, location)
      `)
      .eq('check_in_code', check_in_code.toUpperCase())
      .single();

    if (confirmationError || !confirmation) {
      return res.status(404).json({ 
        error: 'Código inválido',
        message: 'Check-in code not found' 
      });
    }

    // Check if already checked in
    if (confirmation.checked_in_at) {
      return res.status(200).json({
        success: true,
        message: 'Já registrado!',
        already_checked_in: true,
        checked_in_at: confirmation.checked_in_at,
        athlete: confirmation.athlete,
        event: confirmation.event,
      });
    }

    // Validate check-in window
    const now = new Date();
    const eventStart = new Date(confirmation.event.start_time);
    const minutesUntilEvent = (eventStart.getTime() - now.getTime()) / (1000 * 60);

    // Check if within check-in window (default: 15min before to 5min after)
    const CHECK_IN_WINDOW_BEFORE = 15; // minutes
    const CHECK_IN_WINDOW_AFTER = 5;   // minutes

    if (minutesUntilEvent > CHECK_IN_WINDOW_BEFORE) {
      return res.status(400).json({
        error: 'Check-in muito cedo',
        message: `O check-in abre ${CHECK_IN_WINDOW_BEFORE} minutos antes do treino`,
        minutes_until_open: Math.ceil(minutesUntilEvent - CHECK_IN_WINDOW_BEFORE),
      });
    }

    if (minutesUntilEvent < -CHECK_IN_WINDOW_AFTER) {
      return res.status(400).json({
        error: 'Check-in fechado',
        message: 'O treino já começou há muito tempo',
      });
    }

    // Perform check-in
    const { data: updatedConfirmation, error: updateError } = await supabase
      .from('event_confirmations')
      .update({
        status: 'attended',
        checked_in_at: now.toISOString(),
        check_in_method: 'qr_code',
        updated_at: now.toISOString(),
      })
      .eq('id', confirmation.id)
      .select('*, athlete:athletes(name), event:calendar_events(title, start_time)')
      .single();

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ Check-in successful: ${confirmation.athlete.name} → ${confirmation.event.title}`);

    return res.status(200).json({
      success: true,
      message: 'Check-in realizado com sucesso!',
      confirmation: updatedConfirmation,
      athlete: confirmation.athlete,
      event: confirmation.event,
      checked_in_at: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Error during check-in:', error);
    return res.status(500).json({ 
      error: 'Failed to check in',
      details: error.message 
    });
  }
}
