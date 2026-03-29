-- ============================================================================
-- MIGRATION: Reports + Automation Schema
-- Created: 4 Janeiro 2026
-- Author: PerformTrack Team
-- Status: 🟢 SEMANA 7 - REPORTS + AUTOMATION
-- Reference: ROADMAP_TRACKER.md - Semana 7
-- ============================================================================

-- ============================================================================
-- TABLE: reports (Report templates and instances)
-- ============================================================================
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Identity
  name text NOT NULL,
  description text,
  category text, -- 'performance', 'progress', 'health', 'custom'
  
  -- Configuration
  config jsonb NOT NULL DEFAULT '{
    "sections": [],
    "charts": [],
    "tables": [],
    "filters": {},
    "styling": {}
  }'::jsonb,
  
  -- Data source
  data_source jsonb, -- { "type": "athletes", "ids": [], "date_range": {} }
  
  -- Output settings
  output_format text[] DEFAULT ARRAY['pdf', 'excel'], -- ['pdf', 'excel', 'web']
  template_id uuid, -- Reference to report template
  
  -- Scheduling
  is_scheduled boolean DEFAULT false,
  schedule_cron text, -- e.g., '0 9 * * 1' for every Monday at 9am
  recipients text[], -- email addresses
  last_generated_at timestamptz,
  next_generation_at timestamptz,
  
  -- Status
  is_template boolean DEFAULT false,
  is_active boolean DEFAULT true,
  generation_count integer DEFAULT 0,
  
  -- Metadata
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  tags text[] DEFAULT ARRAY[]::text[]
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_workspace ON reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_scheduled ON reports(is_scheduled, next_generation_at) 
  WHERE is_scheduled = true AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_reports_template ON reports(template_id);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports in own workspace"
  ON reports FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can create reports"
  ON reports FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

CREATE POLICY "Coaches can update reports"
  ON reports FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

CREATE POLICY "Coaches can delete reports"
  ON reports FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

-- ============================================================================
-- TABLE: report_generations (Generated report instances)
-- ============================================================================
CREATE TABLE IF NOT EXISTS report_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  
  -- Generation info
  generated_at timestamptz NOT NULL DEFAULT NOW(),
  generated_by uuid,
  generation_type text NOT NULL, -- 'manual', 'scheduled', 'api'
  
  -- Output
  file_url text, -- URL to generated PDF/Excel in storage
  file_format text NOT NULL, -- 'pdf', 'excel', 'web'
  file_size integer, -- bytes
  
  -- Status
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'generating', 'completed', 'failed'
  error_message text,
  processing_time integer, -- milliseconds
  
  -- Metadata
  data_snapshot jsonb, -- Snapshot of data at generation time
  config_snapshot jsonb, -- Snapshot of config at generation time
  
  created_at timestamptz NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_report_generations_report ON report_generations(report_id);
CREATE INDEX IF NOT EXISTS idx_report_generations_status ON report_generations(status);
CREATE INDEX IF NOT EXISTS idx_report_generations_date ON report_generations(generated_at DESC);

-- RLS
ALTER TABLE report_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view report generations in own workspace"
  ON report_generations FOR SELECT
  USING (
    report_id IN (
      SELECT id FROM reports 
      WHERE workspace_id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- TABLE: automation_rules (Automation rules engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Identity
  name text NOT NULL,
  description text,
  category text, -- 'notification', 'data_update', 'report', 'custom'
  
  -- Trigger configuration
  trigger_config jsonb NOT NULL DEFAULT '{
    "type": "metric_threshold",
    "conditions": [],
    "schedule": null
  }'::jsonb,
  
  -- Action configuration
  action_config jsonb NOT NULL DEFAULT '{
    "type": "send_notification",
    "params": {}
  }'::jsonb,
  
  -- Conditions & filters
  conditions jsonb, -- Complex conditional logic
  filters jsonb, -- Apply to which athletes/groups
  
  -- Execution settings
  execution_order integer DEFAULT 0,
  delay_seconds integer DEFAULT 0, -- Delay before execution
  retry_on_failure boolean DEFAULT true,
  max_retries integer DEFAULT 3,
  
  -- Status & tracking
  is_active boolean DEFAULT true,
  last_triggered_at timestamptz,
  last_execution_status text, -- 'success', 'failed', 'pending'
  execution_count integer DEFAULT 0,
  success_count integer DEFAULT 0,
  failure_count integer DEFAULT 0,
  
  -- Testing
  is_test_mode boolean DEFAULT false,
  test_results jsonb,
  
  -- Metadata
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  tags text[] DEFAULT ARRAY[]::text[]
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_automation_rules_workspace ON automation_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active) 
  WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_automation_rules_category ON automation_rules(category);
CREATE INDEX IF NOT EXISTS idx_automation_rules_order ON automation_rules(execution_order);

-- RLS
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view automation rules in own workspace"
  ON automation_rules FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can create automation rules"
  ON automation_rules FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

CREATE POLICY "Coaches can update automation rules"
  ON automation_rules FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

CREATE POLICY "Coaches can delete automation rules"
  ON automation_rules FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

-- ============================================================================
-- TABLE: automation_executions (Automation execution log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  
  -- Execution info
  executed_at timestamptz NOT NULL DEFAULT NOW(),
  execution_type text NOT NULL, -- 'auto', 'manual', 'test'
  
  -- Context
  trigger_event jsonb, -- What triggered this execution
  input_data jsonb, -- Input data snapshot
  
  -- Result
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'success', 'failed'
  output_data jsonb, -- Result of execution
  error_message text,
  execution_time integer, -- milliseconds
  
  -- Retry tracking
  retry_count integer DEFAULT 0,
  is_retry boolean DEFAULT false,
  parent_execution_id uuid, -- If this is a retry
  
  created_at timestamptz NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_automation_executions_rule ON automation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON automation_executions(status);
CREATE INDEX IF NOT EXISTS idx_automation_executions_date ON automation_executions(executed_at DESC);

-- RLS
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view automation executions in own workspace"
  ON automation_executions FOR SELECT
  USING (
    rule_id IN (
      SELECT id FROM automation_rules 
      WHERE workspace_id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- FUNCTIONS: Automation helpers
-- ============================================================================

-- Function to mark rule as triggered
CREATE OR REPLACE FUNCTION mark_rule_triggered(
  p_rule_id uuid,
  p_status text,
  p_success boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE automation_rules
  SET 
    last_triggered_at = NOW(),
    last_execution_status = p_status,
    execution_count = execution_count + 1,
    success_count = CASE WHEN p_success THEN success_count + 1 ELSE success_count END,
    failure_count = CASE WHEN NOT p_success THEN failure_count + 1 ELSE failure_count END,
    updated_at = NOW()
  WHERE id = p_rule_id;
END;
$$;

-- Function to get next scheduled reports
CREATE OR REPLACE FUNCTION get_scheduled_reports_due()
RETURNS TABLE (
  id uuid,
  name text,
  config jsonb,
  data_source jsonb,
  output_format text[],
  recipients text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.config,
    r.data_source,
    r.output_format,
    r.recipients
  FROM reports r
  WHERE 
    r.is_scheduled = true 
    AND r.is_active = true
    AND r.next_generation_at <= NOW();
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE reports IS 'Report templates and scheduled reports';
COMMENT ON TABLE report_generations IS 'Generated report instances with files';
COMMENT ON TABLE automation_rules IS 'Automation rules engine for workflows';
COMMENT ON TABLE automation_executions IS 'Log of automation rule executions';

COMMENT ON COLUMN reports.config IS 'Report configuration: sections, charts, tables, filters, styling';
COMMENT ON COLUMN reports.schedule_cron IS 'Cron expression for scheduled reports (e.g., "0 9 * * 1")';
COMMENT ON COLUMN automation_rules.trigger_config IS 'Trigger configuration: type, conditions, schedule';
COMMENT ON COLUMN automation_rules.action_config IS 'Action configuration: type, params';
COMMENT ON COLUMN automation_rules.conditions IS 'Complex conditional logic (AND/OR)';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
