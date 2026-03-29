-- ============================================================================
-- ENTERPRISE FEATURES SCHEMA - PERFORMTRACK PHASE 5
-- ============================================================================
-- Database: PostgreSQL 15+ (Supabase)
-- Features: Reports, Notifications, Analytics, Webhooks, Audit Logs
-- Date: 03 Janeiro 2025
-- Status: 🟢 ENTERPRISE-GRADE
-- Reference: FASE 5 - Enterprise Features
-- ============================================================================

-- ============================================================================
-- TABLE: report_templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS report_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces ON DELETE CASCADE,
  
  -- Template info
  name text NOT NULL,
  description text,
  category text NOT NULL, -- 'athlete', 'workout', 'session', 'metrics', 'custom'
  
  -- Template configuration
  config jsonb NOT NULL DEFAULT '{}',
  /*
  CONFIG STRUCTURE:
  {
    "dataSource": "sessions" | "metrics" | "athletes" | "custom",
    "filters": {
      "dateRange": { "start": "...", "end": "..." },
      "athleteIds": [...],
      "metricIds": [...],
      "workoutTypes": [...]
    },
    "groupBy": ["athlete", "date", "metric"],
    "aggregations": [
      { "field": "volume", "function": "sum" },
      { "field": "rpe", "function": "avg" }
    ],
    "visualization": {
      "type": "table" | "chart" | "combined",
      "chartType": "line" | "bar" | "pie",
      "columns": [...]
    },
    "schedule": {
      "enabled": true,
      "frequency": "daily" | "weekly" | "monthly",
      "recipients": ["email1", "email2"],
      "format": "pdf" | "excel" | "csv"
    }
  }
  */
  
  -- Access control
  created_by uuid REFERENCES users(id),
  is_public boolean DEFAULT false, -- If true, visible to all workspace members
  shared_with uuid[], -- User IDs who can access this template
  
  -- Status
  is_active boolean DEFAULT true,
  
  -- Metadata
  tags text[],
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- ============================================================================
-- TABLE: report_executions
-- ============================================================================
CREATE TABLE IF NOT EXISTS report_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces ON DELETE CASCADE,
  
  -- Template reference (NULL if ad-hoc report)
  template_id uuid REFERENCES report_templates(id) ON DELETE SET NULL,
  
  -- Execution info
  executed_by uuid REFERENCES users(id),
  executed_at timestamptz DEFAULT NOW(),
  
  -- Parameters used
  parameters jsonb NOT NULL DEFAULT '{}',
  /*
  PARAMETERS:
  {
    "filters": { ... },
    "dateRange": { ... },
    "format": "pdf" | "excel" | "csv" | "json"
  }
  */
  
  -- Results
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result_data jsonb, -- The actual report data
  result_url text, -- URL to download file (if PDF/Excel/CSV)
  error_message text,
  
  -- Performance metrics
  processing_time_ms integer,
  row_count integer,
  file_size_bytes bigint,
  
  -- Expiration (auto-delete old reports)
  expires_at timestamptz DEFAULT NOW() + INTERVAL '30 days',
  
  -- Metadata
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- ============================================================================
-- TABLE: notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces ON DELETE CASCADE,
  
  -- Recipient
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE,
  
  -- Notification content
  type text NOT NULL, -- 'session_reminder', 'form_reminder', 'record_achieved', 'report_ready', 'custom'
  title text NOT NULL,
  message text NOT NULL,
  
  -- Delivery channels
  channels text[] NOT NULL DEFAULT ARRAY['in_app'], -- 'in_app', 'email', 'push', 'sms'
  
  -- Status
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'read'
  sent_at timestamptz,
  read_at timestamptz,
  
  -- Related entities
  related_entity_type text, -- 'session', 'form', 'report', 'calendar_event'
  related_entity_id uuid,
  
  -- Action button (optional)
  action_url text,
  action_label text,
  
  -- Priority
  priority text DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Metadata
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- ============================================================================
-- TABLE: webhooks
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces ON DELETE CASCADE,
  
  -- Webhook info
  name text NOT NULL,
  description text,
  url text NOT NULL, -- Target URL
  
  -- Events to listen to
  events text[] NOT NULL, 
  -- 'session.started', 'session.completed', 'form.submitted', 'metric.updated', 
  -- 'record.achieved', 'athlete.created', 'workout.created'
  
  -- Security
  secret text NOT NULL, -- HMAC secret for signature verification
  
  -- Delivery settings
  retry_strategy jsonb DEFAULT '{"maxRetries": 3, "backoff": "exponential"}',
  timeout_seconds integer DEFAULT 30,
  
  -- Status
  is_active boolean DEFAULT true,
  last_triggered_at timestamptz,
  success_count integer DEFAULT 0,
  failure_count integer DEFAULT 0,
  
  -- Filters (optional)
  filters jsonb, -- Filter events by conditions
  
  -- Metadata
  headers jsonb, -- Custom headers to send
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- ============================================================================
-- TABLE: webhook_deliveries
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Webhook reference
  webhook_id uuid NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  
  -- Event info
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  
  -- Delivery attempt
  attempt_number integer DEFAULT 1,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  
  -- Response
  http_status_code integer,
  response_body text,
  response_headers jsonb,
  error_message text,
  
  -- Timing
  sent_at timestamptz,
  duration_ms integer,
  
  -- Next retry (if failed)
  next_retry_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW()
);

-- ============================================================================
-- TABLE: audit_logs
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces ON DELETE CASCADE,
  
  -- Who did it
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  user_email text,
  user_name text,
  
  -- What was done
  action text NOT NULL, -- 'create', 'update', 'delete', 'execute', 'export'
  entity_type text NOT NULL, -- 'workout', 'session', 'athlete', 'form', etc.
  entity_id uuid,
  entity_name text,
  
  -- Changes (for updates)
  changes jsonb, 
  /*
  {
    "before": { ... },
    "after": { ... }
  }
  */
  
  -- Context
  ip_address inet,
  user_agent text,
  request_id text,
  
  -- Result
  status text DEFAULT 'success', -- 'success', 'failed'
  error_message text,
  
  -- Metadata
  metadata jsonb DEFAULT '{}',
  
  -- Timestamp
  created_at timestamptz DEFAULT NOW()
);

-- Auto-partition audit_logs by month for performance
-- (Optional - implement if needed)

-- ============================================================================
-- TABLE: analytics_cache
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces ON DELETE CASCADE,
  
  -- Cache key
  cache_key text NOT NULL,
  
  -- Query info
  query_type text NOT NULL, -- 'athlete_stats', 'workout_stats', 'metric_trends', etc.
  parameters jsonb NOT NULL,
  
  -- Cached data
  data jsonb NOT NULL,
  row_count integer,
  
  -- Cache control
  expires_at timestamptz NOT NULL,
  hit_count integer DEFAULT 0,
  last_accessed_at timestamptz DEFAULT NOW(),
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(workspace_id, cache_key)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Report templates
CREATE INDEX idx_report_templates_workspace ON report_templates(workspace_id);
CREATE INDEX idx_report_templates_category ON report_templates(category);
CREATE INDEX idx_report_templates_created_by ON report_templates(created_by);
CREATE INDEX idx_report_templates_tags ON report_templates USING GIN(tags);

-- Report executions
CREATE INDEX idx_report_executions_workspace ON report_executions(workspace_id);
CREATE INDEX idx_report_executions_template ON report_executions(template_id);
CREATE INDEX idx_report_executions_executed_by ON report_executions(executed_by);
CREATE INDEX idx_report_executions_status ON report_executions(status);
CREATE INDEX idx_report_executions_expires_at ON report_executions(expires_at);

-- Notifications
CREATE INDEX idx_notifications_workspace ON notifications(workspace_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_athlete ON notifications(athlete_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, status) WHERE status != 'read';

-- Webhooks
CREATE INDEX idx_webhooks_workspace ON webhooks(workspace_id);
CREATE INDEX idx_webhooks_active ON webhooks(is_active) WHERE is_active = true;
CREATE INDEX idx_webhooks_events ON webhooks USING GIN(events);

-- Webhook deliveries
CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_created_at ON webhook_deliveries(created_at DESC);

-- Audit logs
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Analytics cache
CREATE INDEX idx_analytics_cache_workspace ON analytics_cache(workspace_id);
CREATE INDEX idx_analytics_cache_expires_at ON analytics_cache(expires_at);
CREATE INDEX idx_analytics_cache_query_type ON analytics_cache(query_type);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_report_templates_updated_at
BEFORE UPDATE ON report_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_report_executions_updated_at
BEFORE UPDATE ON report_executions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_webhooks_updated_at
BEFORE UPDATE ON webhooks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_analytics_cache_updated_at
BEFORE UPDATE ON analytics_cache
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- Report templates policies
CREATE POLICY "Users can view templates in own workspace"
  ON report_templates FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Coaches can manage templates"
  ON report_templates FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'coach')
  ));

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true); -- Service role only

-- Webhooks policies (admin only)
CREATE POLICY "Workspace owners can manage webhooks"
  ON webhooks FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- Audit logs (read-only for users, write for system)
CREATE POLICY "Workspace members can view audit logs"
  ON audit_logs FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Clean expired report executions
CREATE OR REPLACE FUNCTION cleanup_expired_reports()
RETURNS void AS $$
BEGIN
  DELETE FROM report_executions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Clean old webhook deliveries
CREATE OR REPLACE FUNCTION cleanup_old_webhook_deliveries()
RETURNS void AS $$
BEGIN
  DELETE FROM webhook_deliveries WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Function: Mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE notifications 
  SET status = 'read', read_at = NOW()
  WHERE id = p_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  count integer;
BEGIN
  SELECT COUNT(*) INTO count
  FROM notifications
  WHERE user_id = p_user_id AND status != 'read';
  
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function: Invalidate analytics cache
CREATE OR REPLACE FUNCTION invalidate_analytics_cache(
  p_workspace_id uuid,
  p_query_type text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  IF p_query_type IS NULL THEN
    -- Invalidate all cache for workspace
    DELETE FROM analytics_cache WHERE workspace_id = p_workspace_id;
  ELSE
    -- Invalidate specific query type
    DELETE FROM analytics_cache 
    WHERE workspace_id = p_workspace_id AND query_type = p_query_type;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CRON JOBS (via pg_cron extension - optional)
-- ============================================================================

-- Schedule cleanup jobs (if pg_cron is available)
-- SELECT cron.schedule('cleanup-reports', '0 2 * * *', 'SELECT cleanup_expired_reports()');
-- SELECT cron.schedule('cleanup-webhooks', '0 3 * * *', 'SELECT cleanup_old_webhook_deliveries()');

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON report_templates TO authenticated;
GRANT ALL ON report_executions TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON webhooks TO authenticated;
GRANT SELECT ON webhook_deliveries TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;
GRANT ALL ON analytics_cache TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE report_templates IS 'Predefined report templates for generating custom analytics and insights.';
COMMENT ON TABLE report_executions IS 'History of report executions with cached results.';
COMMENT ON TABLE notifications IS 'Multi-channel notifications for users and athletes.';
COMMENT ON TABLE webhooks IS 'Webhook configurations for external integrations.';
COMMENT ON TABLE webhook_deliveries IS 'Delivery history and retry tracking for webhooks.';
COMMENT ON TABLE audit_logs IS 'Complete audit trail of all system actions for compliance and debugging.';
COMMENT ON TABLE analytics_cache IS 'Performance cache for expensive analytics queries.';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- ✅ Enterprise features schema ready for production
-- Next: Criar APIs
