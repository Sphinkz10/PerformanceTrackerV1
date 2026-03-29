/**
 * Scheduled Jobs Execution API - FASE 6 AUTOMATION
 * 
 * POST /api/jobs/[jobName]
 * Executes a scheduled job manually or via cron.
 * 
 * This endpoint should be secured in production (API key, IP whitelist, etc.)
 * 
 * @author PerformTrack Team
 * @since Fase 6 - Integration & Automation
 */

import { NextRequest, NextResponse } from 'next/server';
import { runJob, SCHEDULED_JOBS } from '@/utils/scheduled-jobs';

interface JobParams {
  params: Promise<{
    jobName: string;
  }>;
}

// ============================================================================
// POST /api/jobs/[jobName] - Execute job
// ============================================================================
export async function POST(
  request: NextRequest,
  { params }: JobParams
) {
  try {
    const { jobName } = await params;

    // Security check (in production, add API key validation)
    const authHeader = request.headers.get('Authorization');
    const expectedKey = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate job exists
    if (!SCHEDULED_JOBS[jobName as keyof typeof SCHEDULED_JOBS]) {
      return NextResponse.json(
        { 
          error: 'Job not found',
          availableJobs: Object.keys(SCHEDULED_JOBS),
        },
        { status: 404 }
      );
    }

    // Execute job
    const startTime = Date.now();
    await runJob(jobName);
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      jobName,
      duration,
      message: `Job "${jobName}" completed successfully`,
    });

  } catch (error: any) {
    console.error(`❌ Error executing job:`, error);
    return NextResponse.json(
      { 
        error: 'Job execution failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/jobs/[jobName] - Get job info
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: JobParams
) {
  try {
    const { jobName } = await params;

    const job = SCHEDULED_JOBS[jobName as keyof typeof SCHEDULED_JOBS];

    if (!job) {
      return NextResponse.json(
        { 
          error: 'Job not found',
          availableJobs: Object.keys(SCHEDULED_JOBS),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: job.name,
      schedule: job.schedule,
      jobName,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
