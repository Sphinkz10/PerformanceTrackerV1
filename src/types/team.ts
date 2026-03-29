/**
 * TEAM TYPES
 * Types for team management, grouping, and collaboration
 */

export interface TeamGroup {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  color: string; // Hex color for visual identification
  athlete_ids: string[];
  coach_ids: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Metadata
  meta?: {
    category?: string; // e.g., "U21", "Senior", "Elite"
    sport?: string;
    season?: string;
  };
}

export interface CoachAssignment {
  id: string;
  team_group_id: string;
  coach_id: string;
  role: 'head' | 'assistant' | 'specialist';
  permissions: CoachPermissions;
  assigned_at: string;
  assigned_by: string;
}

export interface CoachPermissions {
  can_create_events: boolean;
  can_edit_events: boolean;
  can_delete_events: boolean;
  can_manage_participants: boolean;
  can_view_analytics: boolean;
  can_export_data: boolean;
}

export interface TeamAnalytics {
  team_group_id: string;
  date_range: {
    start: string;
    end: string;
  };
  
  // Event stats
  total_events: number;
  completed_events: number;
  cancelled_events: number;
  
  // Participation
  total_participants: number;
  unique_athletes: number;
  avg_attendance_rate: number;
  
  // Workload
  total_hours: number;
  avg_hours_per_athlete: number;
  
  // By type
  by_event_type: {
    [key: string]: {
      count: number;
      hours: number;
    };
  };
  
  // Trends
  trend_participation: 'increasing' | 'stable' | 'decreasing';
  trend_completion: 'increasing' | 'stable' | 'decreasing';
}

export interface BulkTeamOperation {
  operation: 'create' | 'update' | 'delete' | 'duplicate';
  team_group_id: string;
  event_template?: Partial<CalendarEvent>;
  dates?: string[];
  athlete_ids?: string[];
  
  // Scheduling options
  options?: {
    skip_conflicts?: boolean;
    auto_resolve?: boolean;
    send_notifications?: boolean;
  };
}

export interface TeamScheduleConflict {
  team_group_id: string;
  athlete_id: string;
  athlete_name: string;
  date: string;
  conflicting_events: {
    event_id: string;
    title: string;
    start_time: string;
    end_time: string;
  }[];
  severity: 'error' | 'warning' | 'info';
}

export interface TeamCalendarShare {
  id: string;
  team_group_id: string;
  shared_with: 'coach' | 'athlete' | 'external';
  user_id?: string;
  email?: string;
  permissions: 'view' | 'edit';
  expires_at?: string;
  created_at: string;
  created_by: string;
}

// Import type from calendar
import type { CalendarEvent } from './calendar';
