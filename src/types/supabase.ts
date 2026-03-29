/**
 * Supabase Database Types
 * 
 * Auto-generated types based on database schema.
 * Update these when schema changes.
 * 
 * To regenerate: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          type: 'gym' | 'team' | 'personal'
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          type: 'gym' | 'team' | 'personal'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          type?: 'gym' | 'team' | 'personal'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'coach' | 'athlete'
          avatar_url: string | null
          workspace_id: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'coach' | 'athlete'
          avatar_url?: string | null
          workspace_id: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'coach' | 'athlete'
          avatar_url?: string | null
          workspace_id?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      athletes: {
        Row: {
          id: string
          workspace_id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          sport: string | null
          position: string | null
          jersey_number: string | null
          avatar_url: string | null
          status: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          sport?: string | null
          position?: string | null
          jersey_number?: string | null
          avatar_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          sport?: string | null
          position?: string | null
          jersey_number?: string | null
          avatar_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      calendar_events: {
        Row: {
          id: string
          workspace_id: string
          title: string
          description: string | null
          event_type: string
          start_time: string
          end_time: string
          location: string | null
          created_by: string
          created_at: string
          updated_at: string
          is_cancelled: boolean
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          description?: string | null
          event_type: string
          start_time: string
          end_time: string
          location?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          is_cancelled?: boolean
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          description?: string | null
          event_type?: string
          start_time?: string
          end_time?: string
          location?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_cancelled?: boolean
        }
      }
      metrics: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          unit: string | null
          metric_type: string
          data_type: string
          category: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          unit?: string | null
          metric_type: string
          data_type: string
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          unit?: string | null
          metric_type?: string
          data_type?: string
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      metric_updates: {
        Row: {
          id: string
          metric_id: string
          athlete_id: string
          value: number
          recorded_at: string
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          metric_id: string
          athlete_id: string
          value: number
          recorded_at?: string
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          metric_id?: string
          athlete_id?: string
          value?: number
          recorded_at?: string
          notes?: string | null
          created_by?: string
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          workspace_id: string
          title: string
          session_type: string
          status: string
          scheduled_at: string | null
          started_at: string | null
          completed_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          session_type: string
          status?: string
          scheduled_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          session_type?: string
          status?: string
          scheduled_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
