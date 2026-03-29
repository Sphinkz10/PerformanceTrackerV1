-- =====================================================================================
-- INITIAL SCHEMA SETUP
-- Core tables: workspaces, users, athletes, calendar_events, metrics, sessions
-- =====================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================================================
-- 1. WORKSPACES
-- =====================================================================================
CREATE TABLE IF NOT EXISTS workspaces (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('gym', 'team', 'personal')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

-- RLS: Only accessible by members (simplified for init)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspaces are viewable by everyone for now" 
ON workspaces FOR SELECT USING (true); 

CREATE POLICY "Workspaces are insertable by everyone for now" 
ON workspaces FOR INSERT WITH CHECK (true);

-- =====================================================================================
-- 2. USERS (Profiles)
-- =====================================================================================
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    name text NOT NULL,
    role text NOT NULL CHECK (role IN ('admin', 'coach', 'athlete')),
    avatar_url text,
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT USING (auth.uid() = id);

-- =====================================================================================
-- 3. ATHLETES
-- =====================================================================================
CREATE TABLE IF NOT EXISTS athletes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id),
    name text NOT NULL,
    email text,
    phone text,
    date_of_birth date,
    sport text,
    position text,
    jersey_number text,
    avatar_url text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- 4. CALENDAR EVENTS
-- =====================================================================================
CREATE TABLE IF NOT EXISTS calendar_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  all_day boolean DEFAULT false,
  location text,
  status text NOT NULL DEFAULT 'scheduled',
  type text NOT NULL DEFAULT 'event',
  athlete_ids uuid[] DEFAULT ARRAY[]::uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Note: 'sessions' table will be created in 20250103_sessions_schema.sql with full structure
-- =====================================================================================
-- 5. METRICS
-- =====================================================================================
CREATE TABLE IF NOT EXISTS metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    unit text,
    metric_type text NOT NULL,
    data_type text NOT NULL,
    category text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- 6. METRIC UPDATES
-- =====================================================================================
CREATE TABLE IF NOT EXISTS metric_updates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_id uuid NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
    athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    value numeric NOT NULL,
    recorded_at timestamptz DEFAULT now(),
    notes text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE metric_updates ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- 7. SESSIONS
-- =====================================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title text NOT NULL,
    session_type text NOT NULL,
    status text DEFAULT 'scheduled',
    scheduled_at timestamptz,
    started_at timestamptz,
    completed_at timestamptz,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- 8. WORKSPACE MEMBERS (Required for RLS in other tables)
-- =====================================================================================
CREATE TABLE IF NOT EXISTS workspace_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================================================
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- BASIC RLS POLICIES (Allow all within workspace for now to ease setup)
-- =====================================================================================

-- Users can view data in their workspaces
CREATE POLICY "Enable read access for workspace members" ON athletes FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

CREATE POLICY "Enable read access for workspace members" ON calendar_events FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

CREATE POLICY "Enable read access for workspace members" ON metrics FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

CREATE POLICY "Enable read access for workspace members" ON sessions FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);
