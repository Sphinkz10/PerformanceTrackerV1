-- ============================================================================
-- SESSIONS SCHEMA - PERFORMTRACK PHASE 1.1
-- ============================================================================
-- Database: PostgreSQL 15+ (Supabase)
-- Features: Session tracking, athlete participation, exercise data
-- Date: 03 Janeiro 2025
-- Status: 🔴 CRITICAL - ECOSSISTEMA BLOCKER
-- Reference: ARQUITETURA_DEFINITIVA_BASE_DADOS_03_JAN_2025.md
-- ============================================================================

-- ============================================================================
-- TABLE: sessions (Sessões executadas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Links
  calendar_event_id uuid REFERENCES calendar_events(id),
  workout_id uuid,  -- Will reference workouts(id) when Design Studio implemented
  coach_id uuid NOT NULL REFERENCES users(id),
  
  -- Timing
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  paused_duration_seconds integer DEFAULT 0,
  
  -- Status
  status text NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  
  -- SNAPSHOT IMUTÁVEL (core concept!)
  snapshot_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  /*
  SNAPSHOT STRUCTURE:
  {
    "version": "1.0",
    "immutable": true,
    "sessionId": "uuid",
    "plannedWorkout": { ... },
    "executedWorkout": {
      "exercises": [
        {
          "id": "ex-1",
          "name": "Back Squat",
          "athleteData": {
            "athlete-1": [
              { "set": 1, "reps": 10, "weight": 80, "rpe": 7, "completed": true, "timestamp": "..." }
            ]
          }
        }
      ],
      "actualDuration": 3600000,
      "actualIntensity": 7.5
    },
    "athletes": [
      {
        "athleteId": "athlete-1",
        "name": "João Silva",
        "attendance": "present",
        "arrivalTime": "2025-01-03T10:00:00Z",
        "performanceData": {
          "volumeTotal": 1600,
          "repsTotal": 18,
          "setsTotal": 2,
          "avgRPE": 7.5
        }
      }
    ],
    "modifications": [],
    "notes": [],
    "analytics": {
      "volumeTotal": 1600,
      "complianceRate": 95
    }
  }
  */
  
  -- Metadata
  notes text,
  metadata jsonb,
  
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_workspace ON sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_sessions_calendar_event ON sessions(calendar_event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach ON sessions(coach_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(started_at DESC);

-- RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sessions in own workspace"
  ON sessions FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Coaches can manage sessions"
  ON sessions FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'coach')
  ));

-- ============================================================================
-- TABLE: session_athletes (Participação de atletas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS session_athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  
  -- Attendance
  attendance text NOT NULL CHECK (attendance IN ('present', 'absent', 'late', 'left_early')),
  arrival_time timestamptz,
  departure_time timestamptz,
  
  -- Performance summary (extracted from snapshot)
  volume_total numeric,  -- kg
  reps_total integer,
  sets_completed integer,
  avg_rpe numeric,
  
  -- Notes
  coach_notes text,
  athlete_feedback text,
  
  created_at timestamptz DEFAULT NOW(),
  
  UNIQUE(session_id, athlete_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_athletes_session ON session_athletes(session_id);
CREATE INDEX IF NOT EXISTS idx_session_athletes_athlete ON session_athletes(athlete_id);

-- RLS
ALTER TABLE session_athletes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view session_athletes in own workspace"
  ON session_athletes FOR SELECT
  USING (session_id IN (
    SELECT id FROM sessions WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Coaches can manage session_athletes"
  ON session_athletes FOR ALL
  USING (session_id IN (
    SELECT id FROM sessions WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  ));

-- ============================================================================
-- TABLE: session_exercise_data (Dados por exercício por atleta)
-- ============================================================================
CREATE TABLE IF NOT EXISTS session_exercise_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  exercise_id uuid,  -- Will reference exercises(id) when Design Studio implemented
  
  -- Exercise info (denormalized for immutability)
  exercise_name text NOT NULL,
  
  -- Sets data (array of sets)
  sets_data jsonb NOT NULL,
  /*
  [
    {
      "set": 1,
      "reps": 10,
      "weight": 80,
      "rpe": 7,
      "tempo": "3-0-1-0",
      "rest": 90,
      "completed": true,
      "timestamp": "2025-01-03T10:15:00Z"
    }
  ]
  */
  
  -- Aggregates (for quick queries)
  total_volume numeric,
  total_reps integer,
  total_sets integer,
  avg_rpe numeric,
  max_weight numeric,
  
  -- Notes
  notes text,
  
  created_at timestamptz DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_exercise_session ON session_exercise_data(session_id);
CREATE INDEX IF NOT EXISTS idx_session_exercise_athlete ON session_exercise_data(athlete_id);
CREATE INDEX IF NOT EXISTS idx_session_exercise_exercise ON session_exercise_data(exercise_id);

-- RLS
ALTER TABLE session_exercise_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view session_exercise_data in own workspace"
  ON session_exercise_data FOR SELECT
  USING (session_id IN (
    SELECT id FROM sessions WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Coaches can manage session_exercise_data"
  ON session_exercise_data FOR ALL
  USING (session_id IN (
    SELECT id FROM sessions WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  ));

-- ============================================================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================================================

-- Auto-update updated_at on sessions
CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_sessions_updated_at();

-- ============================================================================
-- VIEWS (Useful queries)
-- ============================================================================

-- View: Sessions with athlete participation summary
CREATE OR REPLACE VIEW sessions_with_athletes AS
SELECT 
  s.*,
  COUNT(DISTINCT sa.athlete_id) as athlete_count,
  COUNT(DISTINCT sa.athlete_id) FILTER (WHERE sa.attendance = 'present') as present_count,
  AVG(sa.volume_total) as avg_volume,
  AVG(sa.avg_rpe) as avg_rpe
FROM sessions s
LEFT JOIN session_athletes sa ON sa.session_id = s.id
GROUP BY s.id;

-- View: Exercise usage stats (Moved from design_studio_schema)
CREATE OR REPLACE VIEW exercise_usage_stats AS
SELECT 
  e.id,
  e.name,
  e.category,
  e.workspace_id,
  COUNT(DISTINCT we.workout_id) as workout_count,
  COUNT(DISTINCT sed.session_id) as session_count,
  MAX(sed.created_at) as last_used_at
FROM exercises e
LEFT JOIN workout_exercises we ON we.exercise_id = e.id
LEFT JOIN session_exercise_data sed ON sed.exercise_id = e.id
GROUP BY e.id;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON sessions TO authenticated;
GRANT ALL ON session_athletes TO authenticated;
GRANT ALL ON session_exercise_data TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessões de treino executadas (Live Session). snapshot_data é IMUTÁVEL após completed.';
COMMENT ON TABLE session_athletes IS 'Participação de atletas em sessões. Performance summary extraído do snapshot.';
COMMENT ON TABLE session_exercise_data IS 'Dados detalhados de exercícios por atleta por sessão.';

COMMENT ON COLUMN sessions.snapshot_data IS 'IMUTÁVEL! Snapshot completo da sessão. Nunca modificar após status=completed.';
COMMENT ON COLUMN session_athletes.volume_total IS 'Volume total em kg (extraído do snapshot).';
COMMENT ON COLUMN session_exercise_data.sets_data IS 'Array JSONB com todos os sets executados.';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Execução:
-- psql -U postgres -d performtrack < 20250103_sessions_schema.sql
-- Ou no Supabase Dashboard → SQL Editor → copiar e executar

-- ✅ Schema pronto para produção
-- Next: Criar APIs /api/sessions e /api/sessions/[id]/snapshot
