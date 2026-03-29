import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

/**
 * CRON: Cleanup Expired Data
 * Schedule: Every Sunday at 3 AM (0 3 * * 0)
 * Purpose: Clean up old reports, expired tokens, and temporary data
 */

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_CALLS_PER_WINDOW = 3;
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
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron job attempt', {
        module: 'CronCleanup',
        ip: request.headers.get('x-forwarded-for')
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    if (isRateLimited()) {
      logger.warn('Rate limit exceeded', { module: 'CronCleanup' });
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    logger.info('Starting cleanup job', {
      module: 'CronCleanup',
      timestamp: new Date().toISOString()
    });

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const stats = {
      reportsDeleted: 0,
      tokensExpired: 0,
      tempFilesRemoved: 0,
      oldSubmissionsArchived: 0,
      orphanedRecordsDeleted: 0
    };

    // 1. Delete generated reports older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { count: deletedReports, error: reportsError } = await supabase
      .from('generated_reports')
      .delete({ count: 'exact' })
      .lt('created_at', ninetyDaysAgo.toISOString());

    if (reportsError) {
      logger.error('Failed to delete old reports', reportsError, { module: 'CronCleanup' });
    } else {
      stats.reportsDeleted = deletedReports || 0;
      logger.info(`Deleted ${stats.reportsDeleted} old reports`, { module: 'CronCleanup' });
    }

    // 2. Clean up expired session tokens
    const { count: expiredTokens, error: tokensError } = await supabase
      .from('session_tokens')
      .delete({ count: 'exact' })
      .lt('expires_at', new Date().toISOString());

    if (tokensError) {
      logger.error('Failed to delete expired tokens', tokensError, { module: 'CronCleanup' });
    } else {
      stats.tokensExpired = expiredTokens || 0;
      logger.info(`Deleted ${stats.tokensExpired} expired tokens`, { module: 'CronCleanup' });
    }

    // 3. Archive old form submissions (older than 180 days)
    const oneEightyDaysAgo = new Date();
    oneEightyDaysAgo.setDate(oneEightyDaysAgo.getDate() - 180);

    const { count: archivedSubmissions, error: submissionsError } = await supabase
      .from('form_submissions')
      .update({ archived: true })
      .eq('archived', false)
      .lt('submitted_at', oneEightyDaysAgo.toISOString());

    if (submissionsError) {
      logger.error('Failed to archive submissions', submissionsError, { module: 'CronCleanup' });
    } else {
      stats.oldSubmissionsArchived = archivedSubmissions || 0;
      logger.info(`Archived ${stats.oldSubmissionsArchived} old submissions`, { module: 'CronCleanup' });
    }

    // 4. Delete orphaned metric_updates (no athlete reference)
    const { data: orphanedMetrics, error: orphanedError } = await supabase
      .from('metric_updates')
      .select('id')
      .is('athlete_id', null);

    if (!orphanedError && orphanedMetrics) {
      const { count: deletedOrphans } = await supabase
        .from('metric_updates')
        .delete({ count: 'exact' })
        .is('athlete_id', null);

      stats.orphanedRecordsDeleted = deletedOrphans || 0;
      logger.info(`Deleted ${stats.orphanedRecordsDeleted} orphaned records`, { module: 'CronCleanup' });
    }

    // 5. Clean up temporary uploaded files (would require storage integration)
    // This would typically involve:
    // - List files in temp storage bucket
    // - Check if created > 7 days ago
    // - Delete old temp files
    // stats.tempFilesRemoved = await cleanupTempFiles();

    const duration = Date.now() - startTime;
    
    const result = {
      success: true,
      stats,
      timestamp: new Date().toISOString(),
      duration_ms: duration
    };

    logger.info('Cleanup job completed', {
      module: 'CronCleanup',
      result
    });

    return NextResponse.json(result);

  } catch (error: any) {
    logger.error('Error in cleanup cron job', error, {
      module: 'CronCleanup'
    });

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Manual trigger not allowed in production' },
      { status: 403 }
    );
  }
  return GET(request);
}