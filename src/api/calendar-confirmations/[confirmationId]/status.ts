/**
 * API: Update Confirmation Status
 * PATCH /api/calendar-confirmations/:confirmationId/status
 * 
 * Body:
 * - status: 'confirmed' | 'declined' | 'maybe' | 'attended' | 'no_show'
 * - notes?: string (optional)
 * 
 * Updates the confirmation status and timestamps
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const VALID_STATUSES = ['confirmed', 'declined', 'maybe', 'attended', 'no_show'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { confirmationId } = req.query;
  const { status, notes } = req.body;

  if (!confirmationId || typeof confirmationId !== 'string') {
    return res.status(400).json({ error: 'Confirmation ID is required' });
  }

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status',
      valid_statuses: VALID_STATUSES 
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current confirmation
    const { data: currentConfirmation, error: fetchError } = await supabase
      .from('event_confirmations')
      .select('*, athlete:athletes(name), event:calendar_events(title)')
      .eq('id', confirmationId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!currentConfirmation) {
      return res.status(404).json({ error: 'Confirmation not found' });
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    // Set confirmed_at if confirming
    if (status === 'confirmed' && currentConfirmation.status !== 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
      updateData.confirmation_method = updateData.confirmation_method || 'manual';
    }

    // Set checked_in_at if marking attended
    if (status === 'attended' && !currentConfirmation.checked_in_at) {
      updateData.checked_in_at = new Date().toISOString();
      updateData.check_in_method = 'manual';
    }

    // Update confirmation
    const { data: updatedConfirmation, error: updateError } = await supabase
      .from('event_confirmations')
      .update(updateData)
      .eq('id', confirmationId)
      .select('*, athlete:athletes(name), event:calendar_events(title)')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log status change
    console.log(`✅ Confirmation ${confirmationId} updated: ${currentConfirmation.status} → ${status}`);

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      confirmation: updatedConfirmation,
      previous_status: currentConfirmation.status,
    });
  } catch (error: any) {
    console.error('Error updating confirmation status:', error);
    return res.status(500).json({ 
      error: 'Failed to update status',
      details: error.message 
    });
  }
}
