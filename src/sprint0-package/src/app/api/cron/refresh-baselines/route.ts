/**
 * SPRINT 0: Baseline Refresh Cron Endpoint
 * Called daily by Vercel Cron to refresh materialized view
 * With rate limiting and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { refreshBaselines } from '@/lib/metrics/baselines';

// ============================================
// RATE LIMITING
// ============================================

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_CALLS_PER_WINDOW = 3; // Allow max 3 calls per hour

// In-memory store (replace with Redis in production if multiple instances)
let callHistory: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  
  // Remove old calls outside window
  callHistory = callHistory.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // Check if limit exceeded
  if (callHistory.length >= MAX_CALLS_PER_WINDOW) {
    return true;
  }
  
  // Add current call
  callHistory.push(now);
  
  return false;
}

// ============================================
// CRON ENDPOINT
// ============================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // ============================================
    // AUTHENTICATION
    // ============================================
    
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (!process.env.CRON_SECRET) {
      console.error('[refresh-baselines] CRON_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    if (authHeader !== expectedAuth) {
      console.warn('[refresh-baselines] Unauthorized request attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // ============================================
    // RATE LIMITING
    // ============================================
    
    if (isRateLimited()) {
      console.warn('[refresh-baselines] Rate limit exceeded');
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: `Maximum ${MAX_CALLS_PER_WINDOW} calls per hour`,
        },
        { status: 429 }
      );
    }
    
    // ============================================
    // REFRESH BASELINES
    // ============================================
    
    console.log('[refresh-baselines] Starting baseline refresh...');
    
    const success = await refreshBaselines();
    
    if (!success) {
      console.error('[refresh-baselines] Baseline refresh failed');
      return NextResponse.json(
        { 
          error: 'Baseline refresh failed',
          message: 'Check server logs for details',
        },
        { status: 500 }
      );
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`[refresh-baselines] ✓ Success in ${duration}ms`);
    
    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      message: 'Baselines refreshed successfully',
    });
    
  } catch (error: any) {
    console.error('[refresh-baselines] Unexpected error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================
// MANUAL TRIGGER (for testing)
// ============================================

/**
 * POST endpoint for manual trigger (only in development)
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Manual trigger not allowed in production' },
      { status: 403 }
    );
  }
  
  console.log('[refresh-baselines] Manual trigger in development mode');
  
  // Call GET handler
  return GET(request);
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * OPTIONS endpoint for health check
 */
export async function OPTIONS() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/cron/refresh-baselines',
    methods: ['GET', 'POST (dev only)', 'OPTIONS'],
    authentication: 'Bearer token required',
    rate_limit: `${MAX_CALLS_PER_WINDOW} calls per hour`,
  });
}