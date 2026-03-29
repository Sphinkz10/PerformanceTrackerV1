-- ============================================================================
-- DESIGN STUDIO SCHEMA - PERFORMTRACK PHASE 2
-- ============================================================================
-- Database: PostgreSQL 15+ (Supabase)
-- Features: Workouts, exercises, workout builder
-- Date: 03 Janeiro 2025
-- Status: 🔴 CRITICAL - TEMPLATE SYSTEM
-- Reference: ARQUITETURA_DEFINITIVA_BASE_DADOS_03_JAN_2025.md - Camada 5
-- ============================================================================

-- ============================================================================
-- TABLE: exercises (Biblioteca de exercícios)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Identity
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('strength', 'plyometric', 'cardio', 'mobility', 'sport-specific', 'rehab')),
  target_muscles text[],  -- ['quadriceps', 'glutes', 'hamstrings']
  equipment text[],  -- ['barbell', 'bench', 'rack']
  
  -- Biomechanics
  movement_pattern text CHECK (movement_pattern IN ('squat', 'hinge', 'push', 'pull', 'carry', 'rotation', 'locomotion')),
  complexity text CHECK (complexity IN ('basic', 'intermediate', 'advanced', 'elite')),
  
  -- Custom fields (métricas que podem ser registadas no Live Session)
  custom_fields jsonb,
  /*
  CUSTOM FIELDS STRUCTURE:
  [
    {
      "key": "weight",
      "label": "Weight",
      "type": "number",
      "unit": "kg",
      "required": true,
      "defaultValue": null
    },
    {
      "key": "reps",
      "label": "Reps",
      "type": "number",
      "required": true
    },
    {
      "key": "rpe",
      "label": "RPE",
      "type": "scale",
      "min": 1,
      "max": 10,
      "required": false
    },
    {
      "key": "tempo",
      "label": "Tempo",
      "type": "text",
      "placeholder": "3-0-1-0",
      "required": false
    }
  ]
  */
  
  -- Media
  demo_video_url text,
  thumbnail_url text,
  
  -- Global vs Workspace
  is_global boolean DEFAULT FALSE,  -- Global exercise library (shared across workspaces)
  
  -- Audit
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  is_active boolean DEFAULT TRUE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exercises_workspace ON exercises(workspace_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_global ON exercises(is_global);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON exercises(is_active) WHERE is_active = TRUE;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_exercises_search ON exercises 
  USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view exercises in own workspace or global"
  ON exercises FOR SELECT
  USING (
    is_global = TRUE 
    OR workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can manage workspace exercises"
  ON exercises FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  );

-- ============================================================================
-- TABLE: workouts (Templates de treino)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Identity
  name text NOT NULL,
  description text,
  type text CHECK (type IN ('strength', 'conditioning', 'sport-specific', 'rehab', 'recovery', 'testing', 'mixed')),
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'elite')),
  
  -- Metadata
  tags text[],  -- ['upper-body', 'hypertrophy', 'pre-season']
  estimated_duration_minutes integer,
  
  -- Template vs Instance
  is_template boolean DEFAULT TRUE,
  parent_workout_id uuid REFERENCES workouts(id),  -- If cloned from template
  
  -- Structure (JSONB for flexibility)
  structure jsonb,
  /*
  STRUCTURE EXAMPLE:
  {
    "warmup": {
      "duration": 10,
      "exercises": ["dynamic-stretch", "mobility"]
    },
    "main": {
      "blocks": [
        {
          "type": "superset",
          "name": "Block A",
          "exercises": ["squat", "bench"]
        }
      ]
    },
    "cooldown": {
      "duration": 5
    }
  }
  */
  
  -- Audit
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  is_active boolean DEFAULT TRUE,
  
  -- Versioning
  version integer DEFAULT 1,
  previous_version_id uuid REFERENCES workouts(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_workspace ON workouts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(type);
CREATE INDEX IF NOT EXISTS idx_workouts_tags ON workouts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_workouts_template ON workouts(is_template) WHERE is_template = TRUE;
CREATE INDEX IF NOT EXISTS idx_workouts_active ON workouts(is_active) WHERE is_active = TRUE;

-- RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workouts in own workspace"
  ON workouts FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Coaches can manage workouts"
  ON workouts FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'coach')
  ));

-- ============================================================================
-- TABLE: workout_exercises (Relação many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  
  -- Position
  order_index integer NOT NULL,  -- Order in workout (0-based)
  block_name text,  -- 'A', 'B', 'Superset 1', 'Circuit 1', etc.
  
  -- Prescription (planned values)
  planned_sets integer,
  planned_reps text,  -- Can be range: '8-12', 'AMRAP', '30s', '5-5-3-3-1'
  planned_rest_seconds integer,
  planned_tempo text,  -- '3-1-2-0' (eccentric-pause-concentric-pause)
  planned_load text,   -- '70% 1RM', 'RPE 8', 'bodyweight', '80kg'
  
  -- Progression rules
  progression_scheme jsonb,
  /*
  PROGRESSION SCHEME EXAMPLE:
  {
    "type": "linear",
    "increment": 2.5,
    "unit": "kg",
    "frequency": "weekly",
    "condition": "if_all_sets_completed"
  }
  OR:
  {
    "type": "percentage",
    "baseMetric": "1rm_squat",
    "percentage": 70
  }
  */
  
  -- Notes
  coaching_cues text,
  modifications jsonb,  -- Alternative exercises, regressions, progressions
  /*
  MODIFICATIONS EXAMPLE:
  {
    "alternatives": ["leg-press", "goblet-squat"],
    "regression": "box-squat",
    "progression": "pause-squat"
  }
  */
  
  created_at timestamptz NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise ON workout_exercises(exercise_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workout_exercise_order ON workout_exercises(workout_id, order_index);

-- RLS
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workout_exercises in own workspace"
  ON workout_exercises FOR SELECT
  USING (workout_id IN (
    SELECT id FROM workouts WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Coaches can manage workout_exercises"
  ON workout_exercises FOR ALL
  USING (workout_id IN (
    SELECT id FROM workouts WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'coach')
    )
  ));

-- ============================================================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================================================

-- Auto-update updated_at on exercises
CREATE OR REPLACE FUNCTION update_exercises_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_exercises_updated_at
BEFORE UPDATE ON exercises
FOR EACH ROW
EXECUTE FUNCTION update_exercises_updated_at();

-- Auto-update updated_at on workouts
CREATE OR REPLACE FUNCTION update_workouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workouts_updated_at
BEFORE UPDATE ON workouts
FOR EACH ROW
EXECUTE FUNCTION update_workouts_updated_at();

-- ============================================================================
-- VIEWS (Useful queries)
-- ============================================================================

-- View: Workouts with exercise count
CREATE OR REPLACE VIEW workouts_with_details AS
SELECT 
  w.*,
  COUNT(we.id) as exercise_count,
  COALESCE(
    json_agg(
      json_build_object(
        'exercise_id', e.id,
        'exercise_name', e.name,
        'order_index', we.order_index,
        'block_name', we.block_name,
        'planned_sets', we.planned_sets,
        'planned_reps', we.planned_reps
      ) ORDER BY we.order_index
    ) FILTER (WHERE e.id IS NOT NULL),
    '[]'::json
  ) as exercises
FROM workouts w
LEFT JOIN workout_exercises we ON we.workout_id = w.id
LEFT JOIN exercises e ON e.id = we.exercise_id
GROUP BY w.id;

-- View: Exercise usage stats (MOVED TO 20250103_sessions_schema.sql to avoid circular dependency)
-- The original definition referenced session_exercise_data which hadn't been created yet.

-- ============================================================================
-- FUNCTIONS (Utility functions)
-- ============================================================================

-- Function: Clone workout (duplicate template)
CREATE OR REPLACE FUNCTION clone_workout(
  p_workout_id uuid,
  p_new_name text,
  p_created_by uuid
) RETURNS uuid AS $$
DECLARE
  v_new_workout_id uuid;
  v_exercise_record RECORD;
BEGIN
  -- Create new workout as clone
  INSERT INTO workouts (
    workspace_id,
    name,
    description,
    type,
    difficulty,
    tags,
    estimated_duration_minutes,
    is_template,
    parent_workout_id,
    structure,
    created_by,
    is_active,
    version
  )
  SELECT 
    workspace_id,
    p_new_name,
    description,
    type,
    difficulty,
    tags,
    estimated_duration_minutes,
    is_template,
    p_workout_id,  -- Set parent
    structure,
    p_created_by,
    TRUE,
    1  -- Reset version to 1
  FROM workouts
  WHERE id = p_workout_id
  RETURNING id INTO v_new_workout_id;

  -- Clone workout_exercises
  FOR v_exercise_record IN
    SELECT * FROM workout_exercises WHERE workout_id = p_workout_id ORDER BY order_index
  LOOP
    INSERT INTO workout_exercises (
      workout_id,
      exercise_id,
      order_index,
      block_name,
      planned_sets,
      planned_reps,
      planned_rest_seconds,
      planned_tempo,
      planned_load,
      progression_scheme,
      coaching_cues,
      modifications
    ) VALUES (
      v_new_workout_id,
      v_exercise_record.exercise_id,
      v_exercise_record.order_index,
      v_exercise_record.block_name,
      v_exercise_record.planned_sets,
      v_exercise_record.planned_reps,
      v_exercise_record.planned_rest_seconds,
      v_exercise_record.planned_tempo,
      v_exercise_record.planned_load,
      v_exercise_record.progression_scheme,
      v_exercise_record.coaching_cues,
      v_exercise_record.modifications
    );
  END LOOP;

  RETURN v_new_workout_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON exercises TO authenticated;
GRANT ALL ON workouts TO authenticated;
GRANT ALL ON workout_exercises TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE exercises IS 'Biblioteca de exercícios. is_global=TRUE para exercícios partilhados entre workspaces.';
COMMENT ON TABLE workouts IS 'Templates de treino. is_template=TRUE para templates reutilizáveis.';
COMMENT ON TABLE workout_exercises IS 'Relação many-to-many entre workouts e exercises com prescrição detalhada.';

COMMENT ON COLUMN exercises.custom_fields IS 'Array JSONB com campos customizáveis registáveis no Live Session (weight, reps, RPE, etc).';
COMMENT ON COLUMN workouts.structure IS 'JSONB com estrutura do treino (warmup, main blocks, cooldown).';
COMMENT ON COLUMN workout_exercises.planned_reps IS 'Pode ser número, range (8-12), AMRAP, ou tempo (30s).';
COMMENT ON COLUMN workout_exercises.progression_scheme IS 'JSONB com regras de progressão automática.';

-- ============================================================================
-- SEED DATA (Global exercises library - optional)
-- ============================================================================

-- Insert some basic global exercises as examples
-- Note: workspace_id is NULL for global exercises
INSERT INTO exercises (name, description, category, movement_pattern, complexity, custom_fields, is_global, created_by) VALUES
  ('Back Squat', 'Barbell back squat', 'strength', 'squat', 'intermediate', 
   '[{"key":"weight","label":"Weight","type":"number","unit":"kg","required":true},{"key":"reps","label":"Reps","type":"number","required":true},{"key":"rpe","label":"RPE","type":"scale","min":1,"max":10,"required":false}]'::jsonb,
   TRUE, NULL),
   
  ('Bench Press', 'Barbell bench press', 'strength', 'push', 'basic',
   '[{"key":"weight","label":"Weight","type":"number","unit":"kg","required":true},{"key":"reps","label":"Reps","type":"number","required":true},{"key":"rpe","label":"RPE","type":"scale","min":1,"max":10,"required":false}]'::jsonb,
   TRUE, NULL),
   
  ('Deadlift', 'Conventional deadlift', 'strength', 'hinge', 'intermediate',
   '[{"key":"weight","label":"Weight","type":"number","unit":"kg","required":true},{"key":"reps","label":"Reps","type":"number","required":true},{"key":"rpe","label":"RPE","type":"scale","min":1,"max":10,"required":false}]'::jsonb,
   TRUE, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Execução:
-- psql -U postgres -d performtrack < 20250103_design_studio_schema.sql
-- Ou no Supabase Dashboard → SQL Editor → copiar e executar

-- ✅ Schema pronto para produção
-- Next: Criar APIs /api/exercises e /api/workouts
