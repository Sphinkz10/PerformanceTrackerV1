-- ============================================================================
-- CALENDAR INTEGRATION SCHEMA - PERFORMTRACK PHASE 3
-- ============================================================================
-- Database: PostgreSQL 15+ (Supabase)
-- Features: Calendar events with workout integration
-- Date: 03 Janeiro 2025
-- Status: 🟡 EXTENDING EXISTING TABLE
-- Reference: ARQUITETURA_DEFINITIVA_BASE_DADOS_03_JAN_2025.md - Camada 6
-- ============================================================================

-- ============================================================================
-- TABLE: calendar_events (EXTEND EXISTING)
-- ============================================================================

-- Assumindo que a tabela já existe com:
-- - id, workspace_id, title, description
-- - start_date, end_date, type, status
-- - athlete_ids, metadata

-- Add workout_id column if it doesn't exist
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL;

-- Add location column (useful for training location)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS location text;

-- Add coach_id column (who created/leads the event)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS coach_id uuid REFERENCES users(id);

-- Add recurrence pattern (for recurring events)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS recurrence_pattern jsonb;
/*
RECURRENCE PATTERN STRUCTURE:
{
  "frequency": "weekly",
  "interval": 1,
  "daysOfWeek": [1, 3, 5],  // Mon, Wed, Fri
  "endDate": "2025-12-31",
  "exceptions": ["2025-01-15"]  // Skip these dates
}
*/

-- Add completion metadata
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS completed_by uuid REFERENCES users(id);

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Add notes field
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS notes text;

-- Add metadata field (Found missing in audit)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Ensure timestamps exist
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW();

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT NOW();

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index on workout_id for joining
CREATE INDEX IF NOT EXISTS idx_calendar_events_workout 
ON calendar_events(workout_id);

-- Index on coach_id
CREATE INDEX IF NOT EXISTS idx_calendar_events_coach 
ON calendar_events(coach_id);

-- Index on date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_date_range 
ON calendar_events(start_date, end_date);

-- Index on workspace + date for efficient queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_workspace_date 
ON calendar_events(workspace_id, start_date DESC);

-- Index on status for filtering active events
CREATE INDEX IF NOT EXISTS idx_calendar_events_status 
ON calendar_events(status) 
WHERE status IN ('scheduled', 'active');

-- GIN index on athlete_ids for array queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_athletes 
ON calendar_events USING GIN(athlete_ids);

-- ============================================================================
-- CONSTRAINTS
-- ============================================================================

-- Ensure type is valid
DO $$ BEGIN
  ALTER TABLE calendar_events ADD CONSTRAINT calendar_events_type_check CHECK (type IN ('workout', 'game', 'competition', 'rest', 'meeting', 'testing', 'other', 'event'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Ensure status is valid
DO $$ BEGIN
  ALTER TABLE calendar_events ADD CONSTRAINT calendar_events_status_check CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled', 'postponed'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Ensure start_date is before end_date
DO $$ BEGIN
  ALTER TABLE calendar_events ADD CONSTRAINT calendar_events_dates_check CHECK (start_date <= end_date);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trg_calendar_events_updated_at ON calendar_events;

CREATE TRIGGER trg_calendar_events_updated_at
BEFORE UPDATE ON calendar_events
FOR EACH ROW
EXECUTE FUNCTION update_calendar_events_updated_at();

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view events in own workspace" ON calendar_events;
DROP POLICY IF EXISTS "Coaches can manage events" ON calendar_events;
DROP POLICY IF EXISTS "Athletes can view own events" ON calendar_events;

-- Policy: Users can view events in their workspace
CREATE POLICY "Users can view events in own workspace"
  ON calendar_events FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Policy: Coaches can manage events
CREATE POLICY "Coaches can manage events"
  ON calendar_events FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'coach')
  ));

-- Policy: Athletes can view events they're assigned to
CREATE POLICY "Athletes can view own events"
  ON calendar_events FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM athletes WHERE id = ANY(athlete_ids)
    )
  );

-- ============================================================================
-- VIEWS (Useful queries)
-- ============================================================================

-- View: Events with workout and athlete details
CREATE OR REPLACE VIEW calendar_events_with_details AS
SELECT 
  ce.*,
  w.name as workout_name,
  w.type as workout_type,
  w.difficulty as workout_difficulty,
  w.estimated_duration_minutes,
  u.name as coach_name,
  (
    SELECT COUNT(*) 
    FROM unnest(ce.athlete_ids) AS athlete_id
  ) as athlete_count,
  (
    SELECT json_agg(
      json_build_object(
        'id', a.id,
        'name', a.name,
        'avatar_url', a.avatar_url
      )
    )
    FROM athletes a
    WHERE a.id = ANY(ce.athlete_ids)
  ) as athletes_details
FROM calendar_events ce
LEFT JOIN workouts w ON w.id = ce.workout_id
LEFT JOIN users u ON u.id = ce.coach_id;

-- View: Today's events by workspace
CREATE OR REPLACE VIEW todays_events AS
SELECT 
  ce.*,
  w.name as workout_name,
  (
    SELECT COUNT(*) 
    FROM unnest(ce.athlete_ids) AS athlete_id
  ) as athlete_count
FROM calendar_events ce
LEFT JOIN workouts w ON w.id = ce.workout_id
WHERE DATE(ce.start_date) = CURRENT_DATE
  AND ce.status IN ('scheduled', 'active')
ORDER BY ce.start_date;

-- View: Upcoming events (next 7 days)
CREATE OR REPLACE VIEW upcoming_events AS
SELECT 
  ce.*,
  w.name as workout_name,
  u.name as coach_name,
  (
    SELECT COUNT(*) 
    FROM unnest(ce.athlete_ids) AS athlete_id
  ) as athlete_count
FROM calendar_events ce
LEFT JOIN workouts w ON w.id = ce.workout_id
LEFT JOIN users u ON u.id = ce.coach_id
WHERE ce.start_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND ce.status = 'scheduled'
ORDER BY ce.start_date;

-- ============================================================================
-- FUNCTIONS (Utility functions)
-- ============================================================================

-- Function: Get athlete schedule for a date range
CREATE OR REPLACE FUNCTION get_athlete_schedule(
  p_athlete_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
) RETURNS TABLE (
  event_id uuid,
  title text,
  start_date timestamptz,
  end_date timestamptz,
  type text,
  status text,
  workout_name text,
  coach_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.title,
    ce.start_date,
    ce.end_date,
    ce.type,
    ce.status,
    w.name as workout_name,
    u.name as coach_name
  FROM calendar_events ce
  LEFT JOIN workouts w ON w.id = ce.workout_id
  LEFT JOIN users u ON u.id = ce.coach_id
  WHERE p_athlete_id = ANY(ce.athlete_ids)
    AND ce.start_date >= p_start_date
    AND ce.start_date <= p_end_date
  ORDER BY ce.start_date;
END;
$$ LANGUAGE plpgsql;

-- Function: Check availability conflicts
CREATE OR REPLACE FUNCTION check_event_conflicts(
  p_workspace_id uuid,
  p_athlete_ids uuid[],
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_exclude_event_id uuid DEFAULT NULL
) RETURNS TABLE (
  conflicting_event_id uuid,
  conflicting_event_title text,
  conflict_start timestamptz,
  conflict_end timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.title,
    ce.start_date,
    ce.end_date
  FROM calendar_events ce
  WHERE ce.workspace_id = p_workspace_id
    AND ce.athlete_ids && p_athlete_ids  -- Array overlap operator
    AND ce.status IN ('scheduled', 'active')
    AND (
      (ce.start_date, ce.end_date) OVERLAPS (p_start_date, p_end_date)
    )
    AND (p_exclude_event_id IS NULL OR ce.id != p_exclude_event_id)
  ORDER BY ce.start_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON calendar_events TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE calendar_events IS 'Eventos de calendário incluindo workouts agendados, jogos, testes e descansos.';

COMMENT ON COLUMN calendar_events.workout_id IS 'Referência ao workout template. NULL para eventos que não são workouts.';
COMMENT ON COLUMN calendar_events.recurrence_pattern IS 'JSONB com padrão de recorrência para eventos repetidos.';
COMMENT ON COLUMN calendar_events.athlete_ids IS 'Array de athlete IDs atribuídos a este evento.';
COMMENT ON COLUMN calendar_events.metadata IS 'JSONB com metadata adicional específica do tipo de evento.';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Note: Don't insert sample data in production migrations
-- This is just for reference/testing

-- INSERT INTO calendar_events (
--   workspace_id,
--   title,
--   description,
--   type,
--   status,
--   start_date,
--   end_date,
--   workout_id,
--   coach_id,
--   athlete_ids,
--   location
-- ) VALUES (
--   'your-workspace-id',
--   'Upper Body Strength',
--   'Focus on compound movements',
--   'workout',
--   'scheduled',
--   NOW() + INTERVAL '1 day',
--   NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
--   'your-workout-id',
--   'your-coach-id',
--   ARRAY['athlete-id-1', 'athlete-id-2']::uuid[],
--   'Main Gym'
-- );

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Execução:
-- psql -U postgres -d performtrack < 20250103_calendar_integration.sql
-- Ou no Supabase Dashboard → SQL Editor → copiar e executar

-- ✅ Calendar events pronto para integração com workouts
-- Next: Criar APIs /api/calendar-events
