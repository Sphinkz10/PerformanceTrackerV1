/**
 * Audit Logs API - FASE 5 ENTERPRISE FEATURES
 * 
 * GET /api/audit-logs
 * Returns audit logs for compliance and debugging.
 * 
 * Query params:
 * - workspaceId: string (required)
 * - userId?: string - filter by user
 * - action?: 'create' | 'update' | 'delete' | 'execute' | 'export'
 * - entityType?: string - filter by entity type
 * - entityId?: string - filter by specific entity
 * - startDate?: string (ISO 8601)
 * - endDate?: string (ISO 8601)
 * - limit?: number (default: 100)
 * - offset?: number (default: 0)
 * 
 * Response:
 * {
 *   logs: [
 *     {
 *       id: string,
 *       userId: string,
 *       userName: string,
 *       action: string,
 *       entityType: string,
 *       entityName: string,
 *       changes: object,
 *       ipAddress: string,
 *       timestamp: string
 *     }
 *   ],
 *   pagination: {
 *     total: number,
 *     limit: number,
 *     offset: number,
 *     hasMore: boolean
 *   }
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 5 - Enterprise Features
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ============================================================================
// GET /api/audit-logs - List audit logs
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const workspaceId = searchParams.get('workspaceId');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (action) {
      query = query.eq('action', action);
    }

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Get count for pagination
    const { count: totalCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch logs', details: error.message },
        { status: 500 }
      );
    }

    // Format logs
    const formattedLogs = (logs || []).map(log => ({
      id: log.id,
      userId: log.user_id,
      userName: log.user_name,
      userEmail: log.user_email,
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      entityName: log.entity_name,
      changes: log.changes,
      status: log.status,
      errorMessage: log.error_message,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      requestId: log.request_id,
      timestamp: log.created_at,
      metadata: log.metadata,
    }));

    // Calculate stats
    const stats = {
      byAction: {} as { [key: string]: number },
      byEntityType: {} as { [key: string]: number },
      byStatus: {} as { [key: string]: number },
    };

    (logs || []).forEach((log: any) => {
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      stats.byEntityType[log.entity_type] = (stats.byEntityType[log.entity_type] || 0) + 1;
      stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
    });

    return NextResponse.json({
      logs: formattedLogs,
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: offset + limit < (totalCount || 0),
      },
      stats,
    });

  } catch (error: any) {
    console.error('Unexpected error in GET /api/audit-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/audit-logs - Create audit log (internal use)
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { 
      workspaceId, 
      userId, 
      action, 
      entityType, 
      entityId, 
      entityName 
    } = body;

    if (!workspaceId || !action || !entityType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['workspaceId', 'action', 'entityType']
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user details if userId provided
    let userName = null;
    let userEmail = null;

    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', userId)
        .single();

      if (user) {
        userName = user.name;
        userEmail = user.email;
      }
    }

    // Get IP and User-Agent from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create audit log
    const { data: log, error: logError } = await supabase
      .from('audit_logs')
      .insert({
        workspace_id: workspaceId,
        user_id: userId || null,
        user_name: userName,
        user_email: userEmail,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        entity_name: entityName || null,
        changes: body.changes || null,
        status: body.status || 'success',
        error_message: body.errorMessage || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        request_id: body.requestId || null,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating audit log:', logError);
      return NextResponse.json(
        { error: 'Failed to create log', details: logError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      log,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/audit-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
