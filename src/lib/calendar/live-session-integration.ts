/**
 * CALENDAR ↔ LIVE SESSION INTEGRATION
 * Bidirectional sync between calendar events and live sessions
 * 
 * Features:
 * - Create event from live session
 * - Auto-sync attendance (live → calendar)
 * - Auto-complete event on session end
 * - Real-time updates
 * - Session metadata linking
 * - Workspace isolation
 * 
 * @module calendar/live-session-integration
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { CalendarEvent, EventParticipant, CreateEventFormData } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export interface LiveSession {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time?: Date;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  workout_id?: string;
  athlete_ids: string[];
  coach_id: string;
  location?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LiveSessionAttendance {
  session_id: string;
  athlete_id: string;
  check_in_time?: Date;
  check_out_time?: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface SessionEventLink {
  id: string;
  session_id: string;
  event_id: string;
  workspace_id: string;
  sync_status: 'pending' | 'synced' | 'failed';
  last_synced_at?: Date;
  created_at: Date;
}

export interface LiveSessionSyncOptions {
  autoCreateEvent?: boolean;
  autoSyncAttendance?: boolean;
  autoCompleteEvent?: boolean;
  syncInterval?: number; // milliseconds
}

// ============================================================================
// SESSION → EVENT CONVERSION
// ============================================================================

/**
 * Create a calendar event from a live session
 */
export function createEventFromSession(
  session: LiveSession,
  options: { includeWorkout?: boolean } = {}
): CreateEventFormData {
  return {
    // Source
    source: session.workout_id ? 'workout' : 'manual',
    workout_id: session.workout_id,
    
    // DateTime & Location
    title: session.title,
    description: session.description,
    start_date: session.start_time,
    end_date: session.end_time || new Date(session.start_time.getTime() + 60 * 60 * 1000), // +1h default
    type: 'training', // Default type
    location: session.location,
    color: '#0ea5e9', // Sky-500
    tags: ['live-session'],
    
    // Participants
    athlete_ids: session.athlete_ids,
    
    // Notes
    notes: session.notes,
  };
}

/**
 * Link a live session to a calendar event
 */
export async function linkSessionToEvent(
  sessionId: string,
  eventId: string,
  workspaceId: string
): Promise<SessionEventLink> {
  // TODO: Save to database
  // await supabase.from('session_event_links').insert({
  //   session_id: sessionId,
  //   event_id: eventId,
  //   workspace_id: workspaceId,
  //   sync_status: 'pending',
  // });

  return {
    id: `link_${sessionId}_${eventId}`,
    session_id: sessionId,
    event_id: eventId,
    workspace_id: workspaceId,
    sync_status: 'pending',
    created_at: new Date(),
  };
}

/**
 * Get event linked to a session
 */
export async function getEventForSession(
  sessionId: string,
  workspaceId: string
): Promise<CalendarEvent | null> {
  // TODO: Query from database
  // const { data } = await supabase
  //   .from('session_event_links')
  //   .select('event_id, calendar_events(*)')
  //   .eq('session_id', sessionId)
  //   .eq('workspace_id', workspaceId)
  //   .single();
  
  // Mock return
  return null;
}

/**
 * Get session linked to an event
 */
export async function getSessionForEvent(
  eventId: string,
  workspaceId: string
): Promise<LiveSession | null> {
  // TODO: Query from database
  // const { data } = await supabase
  //   .from('session_event_links')
  //   .select('session_id, live_sessions(*)')
  //   .eq('event_id', eventId)
  //   .eq('workspace_id', workspaceId)
  //   .single();
  
  // Mock return
  return null;
}

// ============================================================================
// ATTENDANCE SYNC
// ============================================================================

/**
 * Sync live session attendance to calendar event
 */
export async function syncSessionAttendance(
  sessionId: string,
  eventId: string,
  attendance: LiveSessionAttendance[],
  workspaceId: string
): Promise<{ success: boolean; synced: number; errors: string[] }> {
  const errors: string[] = [];
  let synced = 0;

  try {
    // Convert session attendance to event participants
    const participants: EventParticipant[] = attendance.map(att => ({
      id: `participant_${eventId}_${att.athlete_id}`,
      event_id: eventId,
      athlete_id: att.athlete_id,
      attendance_status: att.status as 'present' | 'absent' | 'excused',
      attendance_notes: att.notes,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // TODO: Batch update participants
    // await supabase.from('event_participants').upsert(participants);

    synced = participants.length;

    // Update sync status
    // await supabase
    //   .from('session_event_links')
    //   .update({
    //     sync_status: 'synced',
    //     last_synced_at: new Date(),
    //   })
    //   .eq('session_id', sessionId)
    //   .eq('event_id', eventId)
    //   .eq('workspace_id', workspaceId);

    return { success: true, synced, errors };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    errors.push(errorMsg);
    return { success: false, synced, errors };
  }
}

/**
 * Real-time attendance sync (for active sessions)
 */
export function setupRealtimeAttendanceSync(
  sessionId: string,
  eventId: string,
  workspaceId: string,
  onSync: (synced: number) => void
): () => void {
  // TODO: Setup Supabase realtime subscription
  // const channel = supabase
  //   .channel(`session_attendance_${sessionId}`)
  //   .on(
  //     'postgres_changes',
  //     {
  //       event: '*',
  //       schema: 'public',
  //       table: 'live_session_attendance',
  //       filter: `session_id=eq.${sessionId}`,
  //     },
  //     async (payload) => {
  //       // Sync on every attendance change
  //       const attendance = await getSessionAttendance(sessionId);
  //       const result = await syncSessionAttendance(sessionId, eventId, attendance, workspaceId);
  //       if (result.success) {
  //         onSync(result.synced);
  //       }
  //     }
  //   )
  //   .subscribe();

  // Return cleanup function
  return () => {
    // channel.unsubscribe();
  };
}

// ============================================================================
// AUTO-COMPLETION
// ============================================================================

/**
 * Auto-complete calendar event when session ends
 */
export async function autoCompleteEventOnSessionEnd(
  sessionId: string,
  eventId: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get final attendance
    // const attendance = await getSessionAttendance(sessionId);

    // Sync final attendance
    // await syncSessionAttendance(sessionId, eventId, attendance, workspaceId);

    // Update event status to completed
    // await supabase
    //   .from('calendar_events')
    //   .update({
    //     status: 'completed',
    //     updated_at: new Date(),
    //   })
    //   .eq('id', eventId)
    //   .eq('workspace_id', workspaceId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete event',
    };
  }
}

/**
 * Watch session status and auto-complete event
 */
export function watchSessionForCompletion(
  sessionId: string,
  eventId: string,
  workspaceId: string,
  onComplete: () => void
): () => void {
  // TODO: Setup Supabase realtime subscription
  // const channel = supabase
  //   .channel(`session_status_${sessionId}`)
  //   .on(
  //     'postgres_changes',
  //     {
  //       event: 'UPDATE',
  //       schema: 'public',
  //       table: 'live_sessions',
  //       filter: `id=eq.${sessionId}`,
  //     },
  //     async (payload) => {
  //       const session = payload.new as LiveSession;
  //       
  //       if (session.status === 'completed') {
  //         await autoCompleteEventOnSessionEnd(sessionId, eventId, workspaceId);
  //         onComplete();
  //       }
  //     }
  //   )
  //   .subscribe();

  // Return cleanup function
  return () => {
    // channel.unsubscribe();
  };
}

// ============================================================================
// SESSION CREATION FROM EVENT
// ============================================================================

/**
 * Start a live session from a calendar event
 */
export async function startSessionFromEvent(
  event: CalendarEvent,
  coachId: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const session: Partial<LiveSession> = {
      workspace_id: event.workspace_id,
      title: event.title,
      description: event.description,
      start_time: new Date(),
      status: 'active',
      workout_id: event.workout_id,
      athlete_ids: event.athlete_ids,
      coach_id: coachId,
      location: event.location,
      notes: event.notes,
    };

    // TODO: Create session in database
    // const { data } = await supabase
    //   .from('live_sessions')
    //   .insert(session)
    //   .select()
    //   .single();

    const sessionId = `session_${event.id}_${Date.now()}`;

    // Link session to event
    await linkSessionToEvent(sessionId, event.id, event.workspace_id);

    // Update event status to confirmed (session started)
    // await supabase
    //   .from('calendar_events')
    //   .update({ status: 'confirmed' })
    //   .eq('id', event.id);

    return { success: true, sessionId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start session',
    };
  }
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Sync multiple sessions to their events
 */
export async function batchSyncSessionsToEvents(
  sessionEventPairs: Array<{ sessionId: string; eventId: string }>,
  workspaceId: string
): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  errors: Array<{ sessionId: string; error: string }>;
}> {
  const errors: Array<{ sessionId: string; error: string }> = [];
  let synced = 0;
  let failed = 0;

  for (const pair of sessionEventPairs) {
    try {
      // Get session attendance
      // const attendance = await getSessionAttendance(pair.sessionId);

      // Sync to event
      // const result = await syncSessionAttendance(
      //   pair.sessionId,
      //   pair.eventId,
      //   attendance,
      //   workspaceId
      // );

      // if (result.success) {
      //   synced++;
      // } else {
      //   failed++;
      //   errors.push({
      //     sessionId: pair.sessionId,
      //     error: result.errors.join(', '),
      //   });
      // }

      synced++; // Mock
    } catch (error) {
      failed++;
      errors.push({
        sessionId: pair.sessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return {
    success: failed === 0,
    synced,
    failed,
    errors,
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get sync statistics for sessions and events
 */
export interface SessionEventSyncStats {
  totalSessions: number;
  linkedSessions: number;
  syncedSessions: number;
  pendingSessions: number;
  failedSessions: number;
  averageSyncTime: number;
  lastSyncedAt?: Date;
}

export async function getSessionEventSyncStats(
  workspaceId: string,
  dateRange?: { start: Date; end: Date }
): Promise<SessionEventSyncStats> {
  // TODO: Query from database
  // const { data: links } = await supabase
  //   .from('session_event_links')
  //   .select('*')
  //   .eq('workspace_id', workspaceId);

  // Mock stats
  return {
    totalSessions: 0,
    linkedSessions: 0,
    syncedSessions: 0,
    pendingSessions: 0,
    failedSessions: 0,
    averageSyncTime: 0,
  };
}

/**
 * Get sessions without linked events
 */
export async function getUnlinkedSessions(
  workspaceId: string,
  options: {
    status?: LiveSession['status'][];
    limit?: number;
  } = {}
): Promise<LiveSession[]> {
  // TODO: Query from database
  // const { data } = await supabase
  //   .from('live_sessions')
  //   .select('*')
  //   .eq('workspace_id', workspaceId)
  //   .not('id', 'in', (
  //     supabase
  //       .from('session_event_links')
  //       .select('session_id')
  //       .eq('workspace_id', workspaceId)
  //   ))
  //   .limit(options.limit || 100);

  return [];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get attendance for a session (helper)
 */
async function getSessionAttendance(sessionId: string): Promise<LiveSessionAttendance[]> {
  // TODO: Query from database
  // const { data } = await supabase
  //   .from('live_session_attendance')
  //   .select('*')
  //   .eq('session_id', sessionId);

  return [];
}

/**
 * Check if session can be linked to event
 */
export function canLinkSessionToEvent(session: LiveSession, event: CalendarEvent): {
  canLink: boolean;
  reason?: string;
} {
  // Workspace must match
  if (session.workspace_id !== event.workspace_id) {
    return { canLink: false, reason: 'Workspace mismatch' };
  }

  // Session must be active or completed
  if (session.status === 'cancelled') {
    return { canLink: false, reason: 'Session is cancelled' };
  }

  // Event must not be cancelled
  if (event.status === 'cancelled') {
    return { canLink: false, reason: 'Event is cancelled' };
  }

  // Athletes should match (at least some overlap)
  const sessionAthletes = new Set(session.athlete_ids);
  const eventAthletes = new Set(event.athlete_ids);
  const hasOverlap = session.athlete_ids.some(id => eventAthletes.has(id));

  if (!hasOverlap && session.athlete_ids.length > 0 && event.athlete_ids.length > 0) {
    return { canLink: false, reason: 'No athlete overlap' };
  }

  return { canLink: true };
}
