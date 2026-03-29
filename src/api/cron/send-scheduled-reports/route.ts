import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

/**
 * CRON: Send Scheduled Reports
 * Schedule: Every Monday at 8 AM (0 8 * * 1)
 * Purpose: Send weekly/monthly scheduled reports to users
 */

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_CALLS_PER_WINDOW = 5;
let callHistory: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  callHistory = callHistory.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (callHistory.length >= MAX_CALLS_PER_WINDOW) {
    return true;
  }
  
  callHistory.push(now);
  return false;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron job attempt', {
        module: 'CronSendReports',
        ip: request.headers.get('x-forwarded-for')
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    if (isRateLimited()) {
      logger.warn('Rate limit exceeded', { module: 'CronSendReports' });
      return NextResponse.json(
        { error: 'Rate limit exceeded', maxCalls: MAX_CALLS_PER_WINDOW },
        { status: 429 }
      );
    }

    logger.info('Starting scheduled reports job', {
      module: 'CronSendReports',
      timestamp: new Date().toISOString()
    });

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    let reportsSent = 0;
    const errors: string[] = [];

    // Get all scheduled reports that should run today
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayOfMonth = today.getDate();

    const { data: scheduledReports, error: fetchError } = await supabase
      .from('report_schedules')
      .select('*, reports(*)')
      .eq('active', true)
      .or(`frequency.eq.daily,frequency.eq.weekly,frequency.eq.monthly`);

    if (fetchError) {
      logger.error('Failed to fetch scheduled reports', fetchError, {
        module: 'CronSendReports'
      });
      return NextResponse.json(
        { error: 'Failed to fetch scheduled reports', details: fetchError.message },
        { status: 500 }
      );
    }

    // Filter reports that should run today
    const reportsToSend = (scheduledReports || []).filter((schedule: any) => {
      if (schedule.frequency === 'daily') return true;
      if (schedule.frequency === 'weekly' && schedule.day_of_week === dayOfWeek) return true;
      if (schedule.frequency === 'monthly' && schedule.day_of_month === dayOfMonth) return true;
      return false;
    });

    logger.info(`Found ${reportsToSend.length} reports to send`, {
      module: 'CronSendReports'
    });

    // Send each report
    for (const schedule of reportsToSend) {
      try {
        // Get report recipients
        const { data: recipients, error: recipientsError } = await supabase
          .from('report_recipients')
          .select('email, athlete_id')
          .eq('schedule_id', schedule.id);

        if (recipientsError) {
          errors.push(`Failed to fetch recipients for schedule ${schedule.id}: ${recipientsError.message}`);
          continue;
        }

        // Generate report (this would call your report generation API)
        const reportUrl = `/api/reports/${schedule.report_id}/generate`;
        
        // In a real implementation, you would:
        // 1. Generate the report PDF
        // 2. Upload to storage
        // 3. Send email with link or attachment
        // For now, we'll just log it
        
        logger.info(`Would send report ${schedule.report_id} to ${recipients?.length || 0} recipients`, {
          module: 'CronSendReports',
          reportId: schedule.report_id,
          scheduleId: schedule.id
        });

        // Update last_sent timestamp
        await supabase
          .from('report_schedules')
          .update({ 
            last_sent: new Date().toISOString(),
            total_sends: schedule.total_sends + 1
          })
          .eq('id', schedule.id);

        reportsSent++;

      } catch (error: any) {
        logger.error(`Error sending report for schedule ${schedule.id}`, error, {
          module: 'CronSendReports'
        });
        errors.push(`Schedule ${schedule.id}: ${error.message}`);
      }
    }

    const duration = Date.now() - startTime;
    
    const result = {
      success: true,
      reportsSent,
      totalSchedules: reportsToSend.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
      duration_ms: duration
    };

    logger.info('Scheduled reports job completed', {
      module: 'CronSendReports',
      result
    });

    return NextResponse.json(result);

  } catch (error: any) {
    logger.error('Error in scheduled reports cron job', error, {
      module: 'CronSendReports'
    });

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Manual trigger not allowed in production' },
      { status: 403 }
    );
  }
  return GET(request);
}