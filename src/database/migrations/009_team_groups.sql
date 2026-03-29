-- =====================================================
-- MIGRATION 009: TEAM GROUPS & COLLABORATION
-- Advanced team management and bulk operations
-- =====================================================

-- Create team_groups table
CREATE TABLE IF NOT EXISTS team_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#0ea5e9', -- Hex color
  
  -- Athletes in this group
  athlete_ids UUID[] NOT NULL DEFAULT '{}',
  
  -- Coaches assigned to this group
  coach_ids UUID[] NOT NULL DEFAULT '{}',
  
  -- Metadata
  meta JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_team_groups_workspace ON team_groups(workspace_id);
CREATE INDEX idx_team_groups_athletes ON team_groups USING GIN(athlete_ids);
CREATE INDEX idx_team_groups_coaches ON team_groups USING GIN(coach_ids);
CREATE INDEX idx_team_groups_created_at ON team_groups(created_at DESC);

-- Create coach_assignments table
CREATE TABLE IF NOT EXISTS coach_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_group_id UUID NOT NULL REFERENCES team_groups(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'assistant' CHECK (role IN ('head', 'assistant', 'specialist')),
  
  -- Permissions
  permissions JSONB NOT NULL DEFAULT '{
    "can_create_events": true,
    "can_edit_events": true,
    "can_delete_events": false,
    "can_manage_participants": true,
    "can_view_analytics": true,
    "can_export_data": true
  }',
  
  -- Timestamps
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_coach_assignments_team ON coach_assignments(team_group_id);
CREATE INDEX idx_coach_assignments_coach ON coach_assignments(coach_id);

-- Create team_analytics materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS team_analytics AS
SELECT
  tg.id AS team_group_id,
  tg.workspace_id,
  tg.name AS team_name,
  
  -- Event counts
  COUNT(DISTINCT ce.id) FILTER (WHERE ce.status != 'cancelled') AS total_events,
  COUNT(DISTINCT ce.id) FILTER (WHERE ce.status = 'completed') AS completed_events,
  COUNT(DISTINCT ce.id) FILTER (WHERE ce.status = 'cancelled') AS cancelled_events,
  
  -- Participation
  COUNT(DISTINCT ep.id) AS total_participations,
  COUNT(DISTINCT ep.athlete_id) AS unique_athletes,
  COALESCE(
    AVG(
      CASE 
        WHEN ep.attendance_status = 'present' THEN 100.0
        WHEN ep.attendance_status = 'absent' THEN 0.0
        ELSE NULL
      END
    ),
    0
  ) AS avg_attendance_rate,
  
  -- Workload
  COALESCE(SUM(ce.duration_minutes), 0) / 60.0 AS total_hours,
  CASE 
    WHEN COUNT(DISTINCT ep.athlete_id) > 0 
    THEN (COALESCE(SUM(ce.duration_minutes), 0) / 60.0) / COUNT(DISTINCT ep.athlete_id)
    ELSE 0
  END AS avg_hours_per_athlete,
  
  -- Date range
  MIN(ce.start_date) AS first_event_date,
  MAX(ce.start_date) AS last_event_date,
  
  -- Updated
  NOW() AS computed_at

FROM team_groups tg
LEFT JOIN calendar_events ce ON 
  ce.workspace_id = tg.workspace_id 
  AND ce.created_at >= NOW() - INTERVAL '90 days' -- Last 90 days
LEFT JOIN event_participants ep ON 
  ep.event_id = ce.id 
  AND ep.athlete_id = ANY(tg.athlete_ids)

GROUP BY tg.id, tg.workspace_id, tg.name;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_team_analytics_group ON team_analytics(team_group_id);
CREATE INDEX idx_team_analytics_workspace ON team_analytics(workspace_id);

-- Create function to refresh team analytics
CREATE OR REPLACE FUNCTION refresh_team_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY team_analytics;
END;
$$;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_team_groups_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER team_groups_updated_at
  BEFORE UPDATE ON team_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_team_groups_timestamp();

-- Create function to validate athlete_ids
CREATE OR REPLACE FUNCTION validate_team_group_athletes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure athlete_ids is not null
  IF NEW.athlete_ids IS NULL THEN
    NEW.athlete_ids := '{}';
  END IF;
  
  -- Ensure coach_ids is not null
  IF NEW.coach_ids IS NULL THEN
    NEW.coach_ids := '{}';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_team_group_data
  BEFORE INSERT OR UPDATE ON team_groups
  FOR EACH ROW
  EXECUTE FUNCTION validate_team_group_athletes();

-- RLS Policies for team_groups
ALTER TABLE team_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team groups in their workspace"
  ON team_groups FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create team groups in their workspace"
  ON team_groups FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update team groups in their workspace"
  ON team_groups FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete team groups in their workspace"
  ON team_groups FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for coach_assignments
ALTER TABLE coach_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view coach assignments in their workspace"
  ON coach_assignments FOR SELECT
  USING (
    team_group_id IN (
      SELECT id FROM team_groups
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create coach assignments in their workspace"
  ON coach_assignments FOR INSERT
  WITH CHECK (
    team_group_id IN (
      SELECT id FROM team_groups
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update coach assignments in their workspace"
  ON coach_assignments FOR UPDATE
  USING (
    team_group_id IN (
      SELECT id FROM team_groups
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete coach assignments in their workspace"
  ON coach_assignments FOR DELETE
  USING (
    team_group_id IN (
      SELECT id FROM team_groups
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON team_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON coach_assignments TO authenticated;
GRANT SELECT ON team_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_team_analytics() TO authenticated;

-- Create helper function for bulk event creation
CREATE OR REPLACE FUNCTION create_bulk_team_events(
  p_team_group_id UUID,
  p_event_template JSONB,
  p_dates TEXT[],
  p_skip_conflicts BOOLEAN DEFAULT true,
  p_send_notifications BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_workspace_id UUID;
  v_athlete_ids UUID[];
  v_event_date TEXT;
  v_event_id UUID;
  v_success_count INT := 0;
  v_failed_count INT := 0;
  v_conflict_count INT := 0;
  v_created_events UUID[] := '{}';
  v_has_conflict BOOLEAN;
BEGIN
  -- Get team group info
  SELECT workspace_id, athlete_ids
  INTO v_workspace_id, v_athlete_ids
  FROM team_groups
  WHERE id = p_team_group_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Team group not found';
  END IF;
  
  -- Create events for each date
  FOREACH v_event_date IN ARRAY p_dates
  LOOP
    BEGIN
      -- Check for conflicts if required
      v_has_conflict := false;
      
      IF p_skip_conflicts THEN
        SELECT EXISTS(
          SELECT 1
          FROM calendar_events ce
          JOIN event_participants ep ON ep.event_id = ce.id
          WHERE ce.start_date = v_event_date::DATE
            AND ce.start_time = (p_event_template->>'start_time')::TIME
            AND ep.athlete_id = ANY(v_athlete_ids)
            AND ce.status != 'cancelled'
        ) INTO v_has_conflict;
      END IF;
      
      IF v_has_conflict THEN
        v_conflict_count := v_conflict_count + 1;
        CONTINUE;
      END IF;
      
      -- Create event
      INSERT INTO calendar_events (
        workspace_id,
        title,
        description,
        event_type,
        start_date,
        end_date,
        start_time,
        end_time,
        duration_minutes,
        location,
        status,
        created_by
      ) VALUES (
        v_workspace_id,
        p_event_template->>'title',
        p_event_template->>'description',
        (p_event_template->>'event_type')::calendar_event_type,
        v_event_date::DATE,
        v_event_date::DATE,
        (p_event_template->>'start_time')::TIME,
        ((p_event_template->>'start_time')::TIME + 
         ((p_event_template->>'duration_minutes')::INT || ' minutes')::INTERVAL)::TIME,
        (p_event_template->>'duration_minutes')::INT,
        p_event_template->>'location',
        'scheduled',
        auth.uid()
      )
      RETURNING id INTO v_event_id;
      
      -- Add participants
      INSERT INTO event_participants (event_id, athlete_id, status)
      SELECT v_event_id, unnest(v_athlete_ids), 'pending';
      
      v_created_events := array_append(v_created_events, v_event_id);
      v_success_count := v_success_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      v_failed_count := v_failed_count + 1;
    END;
  END LOOP;
  
  -- Return results
  RETURN jsonb_build_object(
    'success', v_success_count,
    'failed', v_failed_count,
    'conflicts', v_conflict_count,
    'created_events', v_created_events
  );
END;
$$;

GRANT EXECUTE ON FUNCTION create_bulk_team_events TO authenticated;

-- Add comments
COMMENT ON TABLE team_groups IS 'Groups of athletes for team management and bulk operations';
COMMENT ON TABLE coach_assignments IS 'Coach assignments to team groups with role-based permissions';
COMMENT ON MATERIALIZED VIEW team_analytics IS 'Pre-computed analytics for team groups (refreshed periodically)';
COMMENT ON FUNCTION create_bulk_team_events IS 'Create multiple events for a team group in bulk';
