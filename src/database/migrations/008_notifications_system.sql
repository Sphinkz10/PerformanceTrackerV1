-- ============================================================================
-- MIGRATION 008: NOTIFICATIONS SYSTEM
-- ============================================================================
-- Description: Sistema completo de notificações para eventos da aplicação
-- Created: 18 Janeiro 2026
-- Version: 1.0.0
-- ============================================================================

-- ============================================================================
-- 1. NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  
  -- Classification
  type TEXT NOT NULL CHECK (type IN ('alert', 'success', 'info', 'warning')),
  category TEXT NOT NULL CHECK (category IN (
    'pain', 'session', 'form', 'athlete', 'calendar', 
    'decision', 'system', 'metric', 'injury', 'record'
  )),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- State
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  
  -- Relations
  event_id TEXT, -- calendar_event_id if calendar-related
  athlete_id TEXT,
  related_id TEXT, -- Generic ID for any related entity
  related_type TEXT, -- 'athlete' | 'session' | 'form' | 'event' | 'metric' | etc
  
  -- Navigation
  action_url TEXT, -- Where to navigate when clicked
  action_label TEXT, -- Label for action button (e.g., "View Athlete")
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- Additional data
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Auto-delete after this date
  
  -- Indexes
  CONSTRAINT fk_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- ============================================================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary query patterns
CREATE INDEX IF NOT EXISTS idx_notifications_workspace_user 
  ON notifications(workspace_id, user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_workspace_unread 
  ON notifications(workspace_id, user_id, read) 
  WHERE read = FALSE;

CREATE INDEX IF NOT EXISTS idx_notifications_category 
  ON notifications(workspace_id, category);

CREATE INDEX IF NOT EXISTS idx_notifications_created 
  ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_event 
  ON notifications(event_id) 
  WHERE event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_athlete 
  ON notifications(athlete_id) 
  WHERE athlete_id IS NOT NULL;

-- Cleanup queries
CREATE INDEX IF NOT EXISTS idx_notifications_expires 
  ON notifications(expires_at) 
  WHERE expires_at IS NOT NULL;

-- ============================================================================
-- 3. NOTIFICATION PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  
  -- Global settings
  enabled BOOLEAN DEFAULT TRUE,
  
  -- Channel preferences
  in_app_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT FALSE,
  
  -- Category preferences (JSON object with category -> enabled mapping)
  category_settings JSONB DEFAULT '{
    "pain": true,
    "session": true,
    "form": true,
    "athlete": true,
    "calendar": true,
    "decision": true,
    "system": true,
    "metric": true,
    "injury": true,
    "record": true
  }',
  
  -- Quiet hours (JSON object)
  quiet_hours JSONB DEFAULT '{
    "enabled": false,
    "start": "22:00",
    "end": "08:00",
    "timezone": "Europe/Lisbon"
  }',
  
  -- Digest settings
  digest_enabled BOOLEAN DEFAULT FALSE,
  digest_frequency TEXT DEFAULT 'daily' CHECK (digest_frequency IN ('hourly', 'daily', 'weekly')),
  digest_time TEXT DEFAULT '09:00', -- Time to send digest
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_workspace_prefs FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_workspace_prefs UNIQUE (workspace_id, user_id)
);

-- Index for preferences lookup
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user 
  ON notification_preferences(workspace_id, user_id);

-- ============================================================================
-- 4. NOTIFICATION EVENTS LOG (Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created', 'read', 'unread', 'archived', 'deleted', 
    'clicked', 'dismissed', 'email_sent', 'push_sent'
  )),
  
  -- Context
  user_id TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_notification_events_notification 
  ON notification_events(notification_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_events_type 
  ON notification_events(event_type, created_at DESC);

-- ============================================================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update notification read timestamp
CREATE OR REPLACE FUNCTION update_notification_read_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = TRUE AND OLD.read = FALSE THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Set read_at when notification is marked as read
DROP TRIGGER IF EXISTS trigger_notification_read_timestamp ON notifications;
CREATE TRIGGER trigger_notification_read_timestamp
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_read_timestamp();

-- Function: Auto-delete expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Update preferences updated_at
CREATE OR REPLACE FUNCTION update_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update preferences timestamp
DROP TRIGGER IF EXISTS trigger_preferences_updated ON notification_preferences;
CREATE TRIGGER trigger_preferences_updated
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_preferences_timestamp();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY notifications_workspace_isolation ON notifications
  FOR ALL
  USING (workspace_id = current_setting('app.current_workspace_id', TRUE));

-- Policies for preferences
CREATE POLICY preferences_workspace_isolation ON notification_preferences
  FOR ALL
  USING (workspace_id = current_setting('app.current_workspace_id', TRUE));

-- Policies for events (read-only for auditing)
CREATE POLICY events_workspace_isolation ON notification_events
  FOR SELECT
  USING (
    notification_id IN (
      SELECT id FROM notifications 
      WHERE workspace_id = current_setting('app.current_workspace_id', TRUE)
    )
  );

-- ============================================================================
-- 7. HELPER VIEWS
-- ============================================================================

-- View: Unread notifications count by category
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
  workspace_id,
  user_id,
  category,
  COUNT(*) FILTER (WHERE read = FALSE) as unread_count,
  COUNT(*) as total_count,
  MAX(created_at) as latest_notification
FROM notifications
WHERE archived = FALSE
GROUP BY workspace_id, user_id, category;

-- View: Recent notifications (last 30 days, unarchived)
CREATE OR REPLACE VIEW recent_notifications AS
SELECT *
FROM notifications
WHERE archived = FALSE
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- ============================================================================
-- 8. SEED DATA (Default preferences for demo)
-- ============================================================================

-- Insert default preferences for demo workspace
INSERT INTO notification_preferences (workspace_id, user_id, enabled)
VALUES ('workspace-demo', 'user-demo', TRUE)
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- ============================================================================
-- 9. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE notifications IS 'Sistema central de notificações da aplicação';
COMMENT ON TABLE notification_preferences IS 'Preferências de notificações por usuário';
COMMENT ON TABLE notification_events IS 'Log de eventos de notificações para auditoria';

COMMENT ON COLUMN notifications.priority IS 'Prioridade: low, normal, high, urgent';
COMMENT ON COLUMN notifications.category IS 'Categoria para filtros e agrupamento';
COMMENT ON COLUMN notifications.metadata IS 'Dados adicionais em formato JSON';
COMMENT ON COLUMN notifications.expires_at IS 'Data de expiração automática';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
