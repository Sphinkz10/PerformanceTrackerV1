export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface AthleteProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  workspace_id: string;
}

export interface ScheduledSession {
  id: string;
  workspace_id: string;
  athlete_id: string;
  coach_id: string;
  scheduled_at: string;
  status: SessionStatus;
  template_id?: string;
}

export interface SessionWithAthlete extends ScheduledSession {
  athlete: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface DbTables {
  athletes_profiles: AthleteProfile;
  scheduled_sessions: ScheduledSession;
  workspaces: {
    id: string;
    name: string;
  };
}
