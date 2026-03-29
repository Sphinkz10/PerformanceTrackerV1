-- ============================================================================
-- FORMS SCHEMA - PERFORMTRACK PHASE 1.2
-- ============================================================================
-- Database: PostgreSQL 15+ (Supabase)
-- Features: Forms, form submissions, metric integration
-- Date: 03 Janeiro 2025
-- Status: 🔴 CRITICAL - ECOSSISTEMA INTEGRATION
-- Reference: ARQUITETURA_DEFINITIVA_BASE_DADOS_03_JAN_2025.md - Camada 8
-- ============================================================================

-- ============================================================================
-- TABLE: forms (Questionários)
-- ============================================================================
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Identity
  name text NOT NULL,
  description text,
  type text CHECK (type IN ('wellness', 'readiness', 'injury', 'satisfaction', 'custom')),
  
  -- Configuration
  fields jsonb NOT NULL,
  /*
  FIELDS STRUCTURE:
  [
    {
      "id": "field-1",
      "key": "sleep_quality",
      "label": "Qualidade do Sono",
      "type": "scale",
      "required": true,
      "min": 1,
      "max": 10,
      "order": 1
    },
    {
      "id": "field-2",
      "key": "muscle_soreness",
      "label": "Dor Muscular",
      "type": "scale",
      "required": false,
      "min": 1,
      "max": 10,
      "order": 2
    }
  ]
  */
  
  -- Distribution
  target_audience text DEFAULT 'all_athletes' CHECK (target_audience IN ('all_athletes', 'specific_athletes', 'specific_teams')),
  target_athlete_ids uuid[],
  
  -- Schedule
  frequency text CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'on-demand')),
  send_time time,
  active_days integer[],  -- [1,2,3,4,5] = Mon-Fri, [0,6] = Weekend
  
  -- Status
  is_active boolean DEFAULT TRUE,
  
  -- Audit
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_forms_workspace ON forms(workspace_id);
CREATE INDEX IF NOT EXISTS idx_forms_type ON forms(type);
CREATE INDEX IF NOT EXISTS idx_forms_active ON forms(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_forms_target_athletes ON forms USING GIN(target_athlete_ids);

-- RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view forms in own workspace"
  ON forms FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Coaches can manage forms"
  ON forms FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'coach')
  ));

-- ============================================================================
-- TABLE: form_submissions (Respostas de atletas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  
  -- Response data
  submission_data jsonb NOT NULL,
  /*
  SUBMISSION DATA STRUCTURE:
  {
    "sleep_quality": 8,
    "fatigue_level": 4,
    "muscle_soreness": 2,
    "mood": "good",
    "notes": "Senti-me bem hoje"
  }
  */
  
  -- Timing
  submitted_at timestamptz NOT NULL DEFAULT NOW(),
  
  -- Processing status (CRITICAL for SubmissionProcessor integration)
  processed boolean DEFAULT FALSE,
  metrics_created integer DEFAULT 0,  -- Count of metric_updates created
  processing_error text,
  processed_at timestamptz,
  
  -- Metadata
  device_info jsonb,
  ip_address inet,
  
  created_at timestamptz NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_form ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_athlete ON form_submissions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_date ON form_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_processed ON form_submissions(processed);

-- Composite index for querying unprocessed submissions
CREATE INDEX IF NOT EXISTS idx_form_submissions_pending ON form_submissions(form_id, processed) 
  WHERE processed = FALSE;

-- RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view submissions in own workspace"
  ON form_submissions FOR SELECT
  USING (form_id IN (
    SELECT id FROM forms WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Athletes can create own submissions"
  ON form_submissions FOR INSERT
  WITH CHECK (athlete_id IN (
    SELECT id FROM athletes WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Coaches can manage submissions"
  ON form_submissions FOR ALL
  USING (form_id IN (
    SELECT id FROM forms WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  ));

-- ============================================================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================================================

-- Auto-update updated_at on forms
CREATE OR REPLACE FUNCTION update_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_forms_updated_at
BEFORE UPDATE ON forms
FOR EACH ROW
EXECUTE FUNCTION update_forms_updated_at();

-- ============================================================================
-- VIEWS (Useful queries)
-- ============================================================================

-- View: Forms with submission stats
CREATE OR REPLACE VIEW forms_with_stats AS
SELECT 
  f.*,
  COUNT(fs.id) as total_submissions,
  COUNT(fs.id) FILTER (WHERE fs.processed = FALSE) as pending_submissions,
  COUNT(DISTINCT fs.athlete_id) as unique_respondents,
  MAX(fs.submitted_at) as last_submission_at
FROM forms f
LEFT JOIN form_submissions fs ON fs.form_id = f.id
GROUP BY f.id;

-- View: Athlete pending forms
CREATE OR REPLACE VIEW athlete_pending_forms AS
SELECT 
  f.id as form_id,
  f.name as form_name,
  f.type as form_type,
  a.id as athlete_id,
  a.name as athlete_name,
  f.workspace_id,
  COALESCE(
    (SELECT MAX(submitted_at) 
     FROM form_submissions 
     WHERE form_id = f.id AND athlete_id = a.id),
    NULL
  ) as last_submission_at,
  CASE 
    WHEN f.frequency = 'daily' THEN 
      COALESCE(
        (SELECT submitted_at FROM form_submissions 
         WHERE form_id = f.id AND athlete_id = a.id 
         ORDER BY submitted_at DESC LIMIT 1) < CURRENT_DATE,
        TRUE
      )
    WHEN f.frequency = 'weekly' THEN
      COALESCE(
        (SELECT submitted_at FROM form_submissions 
         WHERE form_id = f.id AND athlete_id = a.id 
         ORDER BY submitted_at DESC LIMIT 1) < CURRENT_DATE - INTERVAL '7 days',
        TRUE
      )
    ELSE FALSE
  END as is_due
FROM forms f
CROSS JOIN athletes a
WHERE f.is_active = TRUE
  AND a.workspace_id = f.workspace_id
  AND (
    f.target_audience = 'all_athletes'
    OR (f.target_audience = 'specific_athletes' AND a.id = ANY(f.target_athlete_ids))
  );

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON forms TO authenticated;
GRANT ALL ON form_submissions TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE forms IS 'Questionários criados por coaches para recolher dados dos atletas.';
COMMENT ON TABLE form_submissions IS 'Respostas de atletas aos questionários. processed=TRUE após SubmissionProcessor criar metric_updates.';

COMMENT ON COLUMN forms.fields IS 'Array JSONB com definição dos campos do formulário.';
COMMENT ON COLUMN forms.target_athlete_ids IS 'Array de athlete IDs se target_audience=specific_athletes.';
COMMENT ON COLUMN forms.active_days IS 'Array de dias da semana (0=Domingo, 6=Sábado) quando form está ativo.';

COMMENT ON COLUMN form_submissions.submission_data IS 'JSONB com respostas do atleta. Keys correspondem a field.key em forms.fields.';
COMMENT ON COLUMN form_submissions.processed IS 'TRUE após SubmissionProcessor criar metric_updates a partir desta submission.';
COMMENT ON COLUMN form_submissions.metrics_created IS 'Contador de metric_updates criados a partir desta submission.';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Execução:
-- psql -U postgres -d performtrack < 20250103_forms_schema.sql
-- Ou no Supabase Dashboard → SQL Editor → copiar e executar

-- ✅ Schema pronto para produção
-- Next: Criar APIs /api/forms e /api/form-submissions (com SubmissionProcessor!)
