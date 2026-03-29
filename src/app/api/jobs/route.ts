/**
 * Jobs List API - FASE 6 AUTOMATION
 * 
 * GET /api/jobs
 * Returns list of all available scheduled jobs.
 * 
 * @author PerformTrack Team
 * @since Fase 6 - Integration & Automation
 */

import { NextRequest, NextResponse } from 'next/server';
import { SCHEDULED_JOBS } from '@/utils/scheduled-jobs';

// ============================================================================
// GET /api/jobs - List all jobs
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const jobs = Object.entries(SCHEDULED_JOBS).map(([key, job]) => ({
      id: key,
      name: job.name,
      schedule: job.schedule,
      endpoint: `/api/jobs/${key}`,
    }));

    return NextResponse.json({
      jobs,
      count: jobs.length,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
