import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/notifications/preferences
 * Fetch user notification preferences
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const userId = searchParams.get('userId');

    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: 'workspaceId and userId are required' },
        { status: 400 }
      );
    }

    // Mock response - In production, fetch from Supabase
    const preferences = {
      id: `pref-${userId}`,
      workspace_id: workspaceId,
      user_id: userId,
      
      // Global settings
      enabled: true,
      
      // Channel preferences
      in_app_enabled: true,
      email_enabled: false,
      push_enabled: false,
      
      // Category settings
      category_settings: {
        pain: true,
        session: true,
        form: true,
        athlete: true,
        calendar: true,
        decision: true,
        system: true,
        metric: true,
        injury: true,
        record: true,
      },
      
      // Quiet hours
      quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'Europe/Lisbon',
      },
      
      // Digest settings
      digest_enabled: false,
      digest_frequency: 'daily' as const,
      digest_time: '09:00',
      
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications/preferences
 * Update user notification preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, userId, ...updates } = body;

    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: 'workspaceId and userId are required' },
        { status: 400 }
      );
    }

    // Validate updates
    const validFields = [
      'enabled',
      'in_app_enabled',
      'email_enabled',
      'push_enabled',
      'category_settings',
      'quiet_hours',
      'digest_enabled',
      'digest_frequency',
      'digest_time',
    ];

    const invalidFields = Object.keys(updates).filter(
      (key) => !validFields.includes(key)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Mock response - In production, update in Supabase
    const updatedPreferences = {
      id: `pref-${userId}`,
      workspace_id: workspaceId,
      user_id: userId,
      
      // Apply updates
      enabled: updates.enabled ?? true,
      in_app_enabled: updates.in_app_enabled ?? true,
      email_enabled: updates.email_enabled ?? false,
      push_enabled: updates.push_enabled ?? false,
      category_settings: updates.category_settings ?? {},
      quiet_hours: updates.quiet_hours ?? {},
      digest_enabled: updates.digest_enabled ?? false,
      digest_frequency: updates.digest_frequency ?? 'daily',
      digest_time: updates.digest_time ?? '09:00',
      
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
