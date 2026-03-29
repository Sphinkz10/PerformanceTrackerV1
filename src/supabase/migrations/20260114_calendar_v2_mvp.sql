-- ============================================================================
-- CALENDAR V2.0 MVP - DATABASE MIGRATION
-- ============================================================================
-- Date: 14 Janeiro 2026
-- Version: 2.0 MVP
-- Purpose: Extend calendar system with participants and confirmations
-- ============================================================================

-- ============================================================================
-- EXTEND: calendar_events (add missing columns)
-- ============================================================================

-- Add plan_id and class_id references (for future Design Studio import)
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES plans(id) ON DELETE SET NULL;

ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES classes(id) ON DELETE SET NULL;

-- Add color for visual customization
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS color text;

-- Add capacity for group events
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS max_participants integer;

-- Add tags for categorization
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS tags text[];

-- ============================================================================
-- CREATE: event_participants
-- ============================================================================
-- Purpose: Many-to-many relationship between events and athletes
-- Features: Status tracking, confirmations, attendance, notes

CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  
  -- Status tracking
  status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'declined', 'attended', 'no_show', 'cancelled')),
  
  -- Timestamps
  confirmed_at timestamptz,
  attended_at timestamptz,
  declined_at timestamptz,
  
  -- Additional info
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Audit
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(event_id, athlete_id)
);

COMMENT ON TABLE event_participants IS 'Tracks which athletes are participating in which events';
COMMENT ON COLUMN event_participants.status IS 'Current participation status';
COMMENT ON COLUMN event_participants.metadata IS 'Additional flexible data (e.g., special requirements, dietary needs)';

-- ============================================================================
-- CREATE: event_confirmations
-- ============================================================================
-- Purpose: Track confirmation requests sent to participants
-- Features: Multi-channel (email/app/sms/qr), expiration, tokens

-- DROP old version from v1 (calendar_extensions) to allow V2 schema
DROP TABLE IF EXISTS event_confirmations CASCADE;

CREATE TABLE IF NOT EXISTS event_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES event_participants(id) ON DELETE CASCADE,
  
  -- Confirmation mechanism
  token text UNIQUE NOT NULL,
  method text NOT NULL CHECK (method IN ('email', 'app', 'sms', 'qr_code', 'manual')),
  
  -- Timing
  sent_at timestamptz NOT NULL DEFAULT NOW(),
  expires_at timestamptz NOT NULL,
  confirmed_at timestamptz,
  
  -- Additional data
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Audit
  created_at timestamptz NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE event_confirmations IS 'Tracks confirmation requests sent to participants';
COMMENT ON COLUMN event_confirmations.token IS 'Unique token for confirmation link/QR code';
COMMENT ON COLUMN event_confirmations.method IS 'How the confirmation was sent';
COMMENT ON COLUMN event_confirmations.expires_at IS 'When the confirmation token expires';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- event_participants indexes
CREATE INDEX IF NOT EXISTS idx_event_participants_event 
  ON event_participants(event_id);

CREATE INDEX IF NOT EXISTS idx_event_participants_athlete 
  ON event_participants(athlete_id);

CREATE INDEX IF NOT EXISTS idx_event_participants_status 
  ON event_participants(status);

CREATE INDEX IF NOT EXISTS idx_event_participants_event_status 
  ON event_participants(event_id, status);

-- event_confirmations indexes
CREATE INDEX IF NOT EXISTS idx_event_confirmations_participant 
  ON event_confirmations(participant_id);

CREATE INDEX IF NOT EXISTS idx_event_confirmations_token 
  ON event_confirmations(token);

CREATE INDEX IF NOT EXISTS idx_event_confirmations_expires 
  ON event_confirmations(expires_at) 
  WHERE confirmed_at IS NULL;

-- calendar_events new columns indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_plan 
  ON calendar_events(plan_id) 
  WHERE plan_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_calendar_events_class 
  ON calendar_events(class_id) 
  WHERE class_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_calendar_events_tags 
  ON calendar_events USING GIN(tags);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at on event_participants
CREATE OR REPLACE FUNCTION update_event_participants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_event_participants_updated_at ON event_participants;
CREATE TRIGGER trg_event_participants_updated_at
  BEFORE UPDATE ON event_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_event_participants_updated_at();

-- Auto-update participant status when confirmation is received
CREATE OR REPLACE FUNCTION update_participant_on_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmed_at IS NOT NULL AND OLD.confirmed_at IS NULL THEN
    UPDATE event_participants
    SET 
      status = 'confirmed',
      confirmed_at = NEW.confirmed_at
    WHERE id = NEW.participant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_participant_on_confirmation ON event_confirmations;
CREATE TRIGGER trg_update_participant_on_confirmation
  AFTER UPDATE ON event_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_participant_on_confirmation();

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

-- Enable RLS
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_confirmations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS event_participants_select ON event_participants;
DROP POLICY IF EXISTS event_participants_insert ON event_participants;
DROP POLICY IF EXISTS event_participants_update ON event_participants;
DROP POLICY IF EXISTS event_participants_delete ON event_participants;
DROP POLICY IF EXISTS event_confirmations_select ON event_confirmations;
DROP POLICY IF EXISTS event_confirmations_insert ON event_confirmations;
DROP POLICY IF EXISTS event_confirmations_update ON event_confirmations;

-- event_participants policies
-- Users can view participants of events in their workspace
CREATE POLICY event_participants_select ON event_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM calendar_events e
      WHERE e.id = event_participants.event_id
      AND e.workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can insert participants to events in their workspace
CREATE POLICY event_participants_insert ON event_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM calendar_events e
      WHERE e.id = event_participants.event_id
      AND e.workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update participants of events in their workspace
CREATE POLICY event_participants_update ON event_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM calendar_events e
      WHERE e.id = event_participants.event_id
      AND e.workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can delete participants from events in their workspace
CREATE POLICY event_participants_delete ON event_participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM calendar_events e
      WHERE e.id = event_participants.event_id
      AND e.workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- event_confirmations policies
-- Users can view confirmations for participants in their workspace
CREATE POLICY event_confirmations_select ON event_confirmations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM event_participants ep
      JOIN calendar_events e ON e.id = ep.event_id
      WHERE ep.id = event_confirmations.participant_id
      AND e.workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can insert confirmations for participants in their workspace
CREATE POLICY event_confirmations_insert ON event_confirmations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_participants ep
      JOIN calendar_events e ON e.id = ep.event_id
      WHERE ep.id = event_confirmations.participant_id
      AND e.workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Anyone with token can update (for public confirmation links)
CREATE POLICY event_confirmations_update ON event_confirmations
  FOR UPDATE USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get event with participant count
CREATE OR REPLACE FUNCTION get_event_participant_count(event_uuid uuid)
RETURNS TABLE (
  total bigint,
  confirmed bigint,
  pending bigint,
  declined bigint,
  attended bigint,
  no_show bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total,
    COUNT(*) FILTER (WHERE status = 'confirmed')::bigint as confirmed,
    COUNT(*) FILTER (WHERE status = 'pending')::bigint as pending,
    COUNT(*) FILTER (WHERE status = 'declined')::bigint as declined,
    COUNT(*) FILTER (WHERE status = 'attended')::bigint as attended,
    COUNT(*) FILTER (WHERE status = 'no_show')::bigint as no_show
  FROM event_participants
  WHERE event_id = event_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_event_participant_count IS 'Get participant statistics for an event';

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================
-- Run these to verify migration success:

DO $$
BEGIN
  RAISE NOTICE '✅ Checking event_participants table...';
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'event_participants') THEN
    RAISE NOTICE '   ✓ event_participants exists';
  ELSE
    RAISE EXCEPTION '   ✗ event_participants missing!';
  END IF;

  RAISE NOTICE '✅ Checking event_confirmations table...';
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'event_confirmations') THEN
    RAISE NOTICE '   ✓ event_confirmations exists';
  ELSE
    RAISE EXCEPTION '   ✗ event_confirmations missing!';
  END IF;

  RAISE NOTICE '✅ Checking calendar_events extensions...';
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'calendar_events' 
    AND column_name = 'plan_id'
  ) THEN
    RAISE NOTICE '   ✓ plan_id column exists';
  ELSE
    RAISE EXCEPTION '   ✗ plan_id column missing!';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '   ✅ CALENDAR V2.0 MVP MIGRATION COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;
