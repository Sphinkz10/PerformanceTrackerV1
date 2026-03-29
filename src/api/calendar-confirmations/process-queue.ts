/**
 * API: Process Notification Queue (Worker)
 * POST /api/calendar-confirmations/process-queue
 * 
 * Background worker that processes pending notifications
 * Should be called by a CRON job every 5 minutes
 * 
 * Auth: Requires CRON_SECRET for security
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security: Verify CRON secret
  const cronSecret = req.headers['x-cron-secret'];
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get pending notifications that are ready to send
    const { data: notifications, error: fetchError } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .lt('retry_count', 3) // Max 3 retries
      .order('scheduled_for', { ascending: true })
      .limit(50); // Process max 50 per run

    if (fetchError) {
      throw fetchError;
    }

    if (!notifications || notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending notifications',
        processed: 0,
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each notification
    for (const notification of notifications) {
      try {
        // TODO: Replace with actual email service (Resend, SendGrid, etc.)
        const emailSent = await mockSendEmail(notification);

        if (emailSent) {
          // Mark as sent
          await supabase
            .from('notification_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', notification.id);

          results.sent++;
          console.log(`✅ Notification sent: ${notification.id}`);
        } else {
          throw new Error('Email service returned false');
        }
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Notification ${notification.id}: ${err.message}`);

        // Mark as failed or increment retry
        if (notification.retry_count >= 2) {
          // Max retries reached, mark as failed
          await supabase
            .from('notification_queue')
            .update({
              status: 'failed',
              failed_at: new Date().toISOString(),
              error_message: err.message,
              updated_at: new Date().toISOString(),
            })
            .eq('id', notification.id);
        } else {
          // Increment retry count
          await supabase
            .from('notification_queue')
            .update({
              retry_count: notification.retry_count + 1,
              error_message: err.message,
              updated_at: new Date().toISOString(),
            })
            .eq('id', notification.id);
        }

        console.error(`❌ Failed to send notification ${notification.id}:`, err);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${notifications.length} notifications`,
      processed: notifications.length,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error: any) {
    console.error('Error processing notification queue:', error);
    return res.status(500).json({ 
      error: 'Failed to process queue',
      details: error.message 
    });
  }
}

/**
 * Mock email send function
 * TODO: Replace with actual email service
 */
async function mockSendEmail(notification: any): Promise<boolean> {
  // In production, use Resend, SendGrid, or similar:
  // 
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // 
  // await resend.emails.send({
  //   from: 'PerformTrack <noreply@performtrack.app>',
  //   to: notification.recipient_email,
  //   subject: notification.subject,
  //   html: notification.body,
  // });

  console.log(`📧 [MOCK] Sending email to ${notification.recipient_email}`);
  console.log(`   Subject: ${notification.subject}`);
  console.log(`   Type: ${notification.type}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock success (95% success rate for testing)
  return Math.random() > 0.05;
}
