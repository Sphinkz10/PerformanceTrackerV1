-- =====================================================
-- PERFORMTRACK CALENDAR - CONFIRMATIONS SYSTEM
-- Migration: 20260115_calendar_confirmations
-- Sprint 3: Sistema de Confirmações
-- =====================================================

-- =====================================================
-- 1. EVENT_CONFIRMATIONS TABLE
-- =====================================================

-- DROP TABLE IF EXISTS because 20260114 created a simpler version
DROP TABLE IF EXISTS event_confirmations CASCADE;

CREATE TABLE IF NOT EXISTS event_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  -- 'pending' | 'confirmed' | 'declined' | 'maybe' | 'attended' | 'no_show'
  
  -- Confirmation details
  confirmed_at TIMESTAMPTZ,
  confirmation_method TEXT,
  -- 'email' | 'app' | 'whatsapp' | 'manual' | 'qr_code'
  
  -- Check-in details
  check_in_code TEXT UNIQUE,
  check_in_required BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  check_in_method TEXT,
  -- 'qr_code' | 'manual' | 'auto'
  
  -- Notifications
  confirmation_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  reminder_count INTEGER DEFAULT 0,
  
  -- Additional data
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'confirmed', 'declined', 'maybe', 'attended', 'no_show')
  ),
  CONSTRAINT valid_confirmation_method CHECK (
    confirmation_method IS NULL OR 
    confirmation_method IN ('email', 'app', 'whatsapp', 'manual', 'qr_code')
  ),
  CONSTRAINT valid_check_in_method CHECK (
    check_in_method IS NULL OR 
    check_in_method IN ('qr_code', 'manual', 'auto')
  ),
  CONSTRAINT unique_event_athlete UNIQUE (event_id, athlete_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_confirmations_event ON event_confirmations(event_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_athlete ON event_confirmations(athlete_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_workspace ON event_confirmations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_status ON event_confirmations(status);
CREATE INDEX IF NOT EXISTS idx_confirmations_check_in_code ON event_confirmations(check_in_code);
CREATE INDEX IF NOT EXISTS idx_confirmations_pending ON event_confirmations(workspace_id, status) 
  WHERE status = 'pending';

-- RLS Policies
ALTER TABLE event_confirmations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view confirmations in their workspace" ON event_confirmations;
CREATE POLICY "Users can view confirmations in their workspace"
  ON event_confirmations FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create confirmations in their workspace" ON event_confirmations;
CREATE POLICY "Users can create confirmations in their workspace"
  ON event_confirmations FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update confirmations in their workspace" ON event_confirmations;
CREATE POLICY "Users can update confirmations in their workspace"
  ON event_confirmations FOR UPDATE
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete confirmations in their workspace" ON event_confirmations;
CREATE POLICY "Users can delete confirmations in their workspace"
  ON event_confirmations FOR DELETE
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- =====================================================
-- 2. NOTIFICATION_SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS event_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  
  -- Confirmation settings
  auto_send_confirmation BOOLEAN DEFAULT true,
  confirmation_hours_before INTEGER DEFAULT 48,
  confirmation_methods TEXT[] DEFAULT ARRAY['email', 'app']::TEXT[],
  
  -- Reminder settings
  send_reminders BOOLEAN DEFAULT true,
  reminder_hours_before INTEGER[] DEFAULT ARRAY[24, 2]::INTEGER[],
  reminder_methods TEXT[] DEFAULT ARRAY['email', 'app']::TEXT[],
  
  -- Check-in settings
  require_check_in BOOLEAN DEFAULT false,
  check_in_window_before INTEGER DEFAULT 15, -- minutes
  check_in_window_after INTEGER DEFAULT 5,   -- minutes
  generate_qr_code BOOLEAN DEFAULT false,
  
  -- Email templates
  confirmation_email_template TEXT,
  reminder_email_template TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: workspace-level or event-level settings
  CONSTRAINT workspace_or_event CHECK (
    (workspace_id IS NOT NULL AND event_id IS NULL) OR
    (workspace_id IS NULL AND event_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notification_settings_workspace ON event_notification_settings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notification_settings_event ON event_notification_settings(event_id);

-- RLS
ALTER TABLE event_notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage notification settings in their workspace" ON event_notification_settings;
CREATE POLICY "Users can manage notification settings in their workspace"
  ON event_notification_settings FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- =====================================================
-- 3. NOTIFICATION_QUEUE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  confirmation_id UUID REFERENCES event_confirmations(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL,
  -- 'confirmation' | 'reminder' | 'check_in' | 'cancel'
  method TEXT NOT NULL,
  -- 'email' | 'app' | 'whatsapp' | 'sms'
  
  -- Recipients
  recipient_email TEXT,
  recipient_phone TEXT,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  
  -- Content
  subject TEXT,
  body TEXT,
  template_data JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'pending',
  -- 'pending' | 'sent' | 'failed' | 'cancelled'
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_type CHECK (
    type IN ('confirmation', 'reminder', 'check_in', 'cancel')
  ),
  CONSTRAINT valid_method CHECK (
    method IN ('email', 'app', 'whatsapp', 'sms')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'sent', 'failed', 'cancelled')
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_queue_status ON notification_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_queue_workspace ON notification_queue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_queue_confirmation ON notification_queue(confirmation_id);

-- RLS
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view notifications in their workspace" ON notification_queue;
CREATE POLICY "Users can view notifications in their workspace"
  ON notification_queue FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- =====================================================
-- 4. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Generate unique check-in code
CREATE OR REPLACE FUNCTION generate_check_in_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if exists
    SELECT EXISTS(
      SELECT 1 FROM event_confirmations WHERE check_in_code = code
    ) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate check-in code
CREATE OR REPLACE FUNCTION auto_generate_check_in_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.check_in_required = true AND NEW.check_in_code IS NULL THEN
    NEW.check_in_code := generate_check_in_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_check_in_code ON event_confirmations;
CREATE TRIGGER trigger_auto_check_in_code
  BEFORE INSERT OR UPDATE ON event_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_check_in_code();

-- Trigger: Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_confirmations_updated_at ON event_confirmations;
CREATE TRIGGER update_confirmations_updated_at
  BEFORE UPDATE ON event_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_settings_updated_at ON event_notification_settings;
CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON event_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_queue_updated_at ON notification_queue;
CREATE TRIGGER update_queue_updated_at
  BEFORE UPDATE ON notification_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. VIEWS
-- =====================================================

-- View: Pending confirmations dashboard
CREATE OR REPLACE VIEW pending_confirmations AS
SELECT 
  ec.id,
  ec.event_id,
  ec.athlete_id,
  ec.workspace_id,
  ec.status,
  ec.confirmation_sent_at,
  ec.reminder_sent_at,
  ec.reminder_count,
  ec.check_in_code,
  ec.check_in_required,
  
  -- Event details
  e.title as event_title,
  e.start_date as event_start,
  e.end_date as event_end,
  e.event_type,
  
  -- Athlete details
  a.name as athlete_name,
  a.email as athlete_email,
  a.phone as athlete_phone,
  
  -- Calculated
  EXTRACT(EPOCH FROM (e.start_date - NOW())) / 3600 as hours_until_event,
  (e.start_date < NOW()) as is_past_event
  
FROM event_confirmations ec
JOIN calendar_events e ON ec.event_id = e.id
JOIN athletes a ON ec.athlete_id = a.id
WHERE ec.status = 'pending'
ORDER BY e.start_date ASC;

-- View: Confirmation statistics
CREATE OR REPLACE VIEW confirmation_stats AS
SELECT
  workspace_id,
  DATE(created_at) as date,
  
  COUNT(*) as total_confirmations,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
  COUNT(*) FILTER (WHERE status = 'declined') as declined_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'attended') as attended_count,
  COUNT(*) FILTER (WHERE status = 'no_show') as no_show_count,
  
  -- Rates
  ROUND(
    COUNT(*) FILTER (WHERE status = 'confirmed')::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as confirmation_rate,
  
  ROUND(
    COUNT(*) FILTER (WHERE status = 'attended')::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE status = 'confirmed'), 0) * 100, 
    2
  ) as attendance_rate
  
FROM event_confirmations
GROUP BY workspace_id, DATE(created_at);

-- =====================================================
-- 6. DEFAULT NOTIFICATION SETTINGS
-- =====================================================

-- Insert default workspace-level settings
-- (Will be created per workspace via API when workspace is created)

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON TABLE event_confirmations IS 'Tracks athlete confirmations and check-ins for calendar events';
COMMENT ON TABLE event_notification_settings IS 'Workspace and event-level notification preferences';
COMMENT ON TABLE notification_queue IS 'Queue for automated email/app notifications';
COMMENT ON VIEW pending_confirmations IS 'Dashboard view of pending confirmations with event/athlete details';
COMMENT ON VIEW confirmation_stats IS 'Daily confirmation and attendance statistics';
