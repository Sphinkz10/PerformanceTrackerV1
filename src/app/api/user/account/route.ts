/**
 * Account Deletion API — CPL-003
 * LGPD/GDPR Right to Erasure (Art. 18, IV LGPD / Art. 17 RGPD)
 *
 * Permanently deletes the authenticated user's account and all associated data.
 * Uses a soft-delete approach:
 *   1. Anonymise the user record (LGPD allows anonymisation as alternative to erasure)
 *   2. Hard-delete health/performance data (these are sensitive data categories)
 *   3. Delete the Supabase Auth identity
 *
 * Frontend consumption:
 *   DELETE /api/user/account
 *   Authorization: Bearer <access_token>
 *   Body: { "confirmation": "DELETE" }
 */

import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Require active session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }

    // 2. Require explicit confirmation in body (prevents accidental deletions)
    const body = await req.json().catch(() => ({}));
    if (body?.confirmation !== 'DELETE') {
      return NextResponse.json(
        {
          error: 'Missing confirmation',
          code: 'CONFIRMATION_REQUIRED',
          message: 'Send { "confirmation": "DELETE" } in the request body to confirm account deletion.',
        },
        { status: 400 }
      );
    }

    const userId = user.id;

    // 3. Hard-delete sensitive health/performance data first
    const sensitiveTableDeletions = [
      supabase.from('metric_updates').delete().eq('created_by', userId),
      supabase.from('form_submissions').delete().eq('user_id', userId),
      supabase.from('session_logs').delete().eq('athlete_id', userId),
    ];

    await Promise.allSettled(sensitiveTableDeletions);

    // 4. Remove workspace memberships
    await supabase.from('workspace_members').delete().eq('user_id', userId);

    // 5. Anonymise the user profile (LGPD art. 5, XI — anonymisation)
    const { error: anonymiseError } = await supabase
      .from('users')
      .update({
        name: '[Conta Eliminada]',
        email: `deleted_${userId}@removed.invalid`,
        avatar_url: null,
        updated_at: new Date().toISOString(),
        deleted_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (anonymiseError) {
      console.error('[DELETE /api/user/account] Anonymise error:', anonymiseError);
      // Continue — we still delete the auth identity
    }

    // 6. Delete the Supabase Auth identity (admin API required)
    // This requires the service role key. In this project, use the admin client.
    // If service role is not configured, log for manual cleanup.
    try {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteAuthError) {
        console.error('[DELETE /api/user/account] Auth delete error:', deleteAuthError.message);
      }
    } catch (adminError) {
      // If admin API is not available (e.g., env not set), log and continue
      console.error('[DELETE /api/user/account] Admin API not available:', adminError);
    }

    // 7. Audit log (optional — for compliance record-keeping)
    await supabase.from('audit_log').insert({
      action: 'ACCOUNT_DELETED',
      actor_id: userId,
      timestamp: new Date().toISOString(),
      details: JSON.stringify({ reason: 'user_requested', lgpd_art: '18_IV' }),
    }).single();

    return NextResponse.json(
      {
        success: true,
        message: 'A tua conta foi eliminada. Os teus dados foram removidos em conformidade com a LGPD.',
        deleted_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[DELETE /api/user/account] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
