-- ============================================================================
-- CALENDAR EXTENSIONS - SISTEMA DE CONFIRMAÇÃO E BLOQUEIOS
-- ============================================================================
-- Data: 13 Janeiro 2026
-- Versão: 1.0
-- Dependências: 20250103_calendar_integration.sql
-- ============================================================================

-- ============================================================================
-- PART 1: ESTENDER calendar_events
-- ============================================================================

-- Adicionar campos de confirmação
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS requires_confirmation boolean DEFAULT false;

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS confirmation_deadline timestamptz;

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS confirmation_count integer DEFAULT 0;

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS declined_count integer DEFAULT 0;

-- Adicionar referência a plano (se evento faz parte de plano multi-semana)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS plan_id uuid;

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS plan_week integer;

-- Adicionar referência a template de classe
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS class_id uuid;

-- Adicionar capacidade máxima (para classes)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS max_capacity integer;

-- Adicionar série recorrente (ID do evento pai se for série)
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS series_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL;

-- ============================================================================
-- PART 2: TABELA event_confirmations
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relações
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL,
  
  -- Status de confirmação
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'declined', 'maybe', 'late')
  ),
  response_date timestamptz,
  
  -- Motivo de recusa
  decline_reason text,
  decline_reason_category text CHECK (
    decline_reason_category IN ('injury', 'illness', 'work', 'personal', 'other')
  ),
  
  -- Notificações
  reminder_sent_at timestamptz,
  reminder_count integer DEFAULT 0,
  last_reminder_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  
  -- Constraint: Um atleta só pode ter uma confirmação por evento
  UNIQUE(event_id, athlete_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_event_confirmations_event 
ON event_confirmations(event_id);

CREATE INDEX IF NOT EXISTS idx_event_confirmations_athlete 
ON event_confirmations(athlete_id);

CREATE INDEX IF NOT EXISTS idx_event_confirmations_status 
ON event_confirmations(status) 
WHERE status = 'pending';

-- Trigger para atualizar contadores no evento
CREATE OR REPLACE FUNCTION update_event_confirmation_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contadores de confirmação/recusa
  UPDATE calendar_events
  SET 
    confirmation_count = (
      SELECT COUNT(*) 
      FROM event_confirmations 
      WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status = 'confirmed'
    ),
    declined_count = (
      SELECT COUNT(*) 
      FROM event_confirmations 
      WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status = 'declined'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_confirmation_counts ON event_confirmations;

CREATE TRIGGER trg_update_confirmation_counts
AFTER INSERT OR UPDATE OF status OR DELETE ON event_confirmations
FOR EACH ROW
EXECUTE FUNCTION update_event_confirmation_counts();

-- ============================================================================
-- PART 3: TABELA calendar_blocks (Feriados, Manutenção, Indisponibilidades)
-- ============================================================================

CREATE TABLE IF NOT EXISTS calendar_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  
  -- Tipo de bloqueio
  block_type text NOT NULL CHECK (
    block_type IN ('holiday', 'maintenance', 'facility_closed', 
                   'coach_unavailable', 'weather', 'custom')
  ),
  
  -- Informação
  title text NOT NULL,
  description text,
  color text DEFAULT '#ef4444',
  
  -- Período
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  all_day boolean DEFAULT true,
  
  -- Âmbito do bloqueio
  scope text NOT NULL DEFAULT 'full' CHECK (
    scope IN ('full', 'partial', 'informational')
  ),
  
  -- Recursos afetados (JSONB flexível)
  affected_resources jsonb DEFAULT '{}',
  
  -- Recorrência (para feriados anuais)
  is_recurring boolean DEFAULT false,
  recurrence_rule jsonb,
  
  -- Override permissions
  allow_override boolean DEFAULT false,
  override_requires_approval boolean DEFAULT false,
  approved_by uuid,
  
  -- Metadata
  created_by uuid,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  
  -- Constraint: Datas válidas
  CHECK (start_date <= end_date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_workspace 
ON calendar_blocks(workspace_id);

CREATE INDEX IF NOT EXISTS idx_calendar_blocks_dates 
ON calendar_blocks(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_calendar_blocks_type 
ON calendar_blocks(block_type);

-- ============================================================================
-- PART 4: TABELA calendar_templates (Templates de Agendamento Rápido)
-- ============================================================================

CREATE TABLE IF NOT EXISTS calendar_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  
  -- Informação do template
  name text NOT NULL,
  description text,
  icon text DEFAULT '📅',
  color text DEFAULT '#0ea5e9',
  
  -- Categoria
  category text CHECK (
    category IN ('workout', 'class', 'meeting', 'testing', 'other')
  ),
  
  -- Configuração padrão
  default_title text,
  default_duration_minutes integer NOT NULL DEFAULT 60,
  default_location text,
  default_time time,
  default_day_of_week integer,
  
  -- Relações padrão
  default_workout_id uuid,
  default_class_id uuid,
  default_coach_id uuid,
  default_athlete_ids uuid[] DEFAULT '{}',
  
  -- Recorrência padrão
  default_recurrence_pattern jsonb,
  
  -- Confirmação padrão
  requires_confirmation boolean DEFAULT false,
  confirmation_deadline_hours integer DEFAULT 24,
  
  -- Usage tracking
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,
  is_favorite boolean DEFAULT false,
  
  -- Metadata
  created_by uuid,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_calendar_templates_workspace 
ON calendar_templates(workspace_id);

CREATE INDEX IF NOT EXISTS idx_calendar_templates_category 
ON calendar_templates(category);

CREATE INDEX IF NOT EXISTS idx_calendar_templates_favorite 
ON calendar_templates(is_favorite) 
WHERE is_favorite = true;

-- ============================================================================
-- PART 5: FUNÇÕES AUXILIARES
-- ============================================================================

-- Função: Verificar se data está bloqueada
CREATE OR REPLACE FUNCTION is_date_blocked(
  p_workspace_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
) RETURNS TABLE (
  is_blocked boolean,
  block_id uuid,
  block_title text,
  block_type text,
  can_override boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as is_blocked,
    cb.id,
    cb.title,
    cb.block_type,
    cb.allow_override
  FROM calendar_blocks cb
  WHERE cb.workspace_id = p_workspace_id
    AND cb.scope IN ('full', 'partial')
    AND (cb.start_date, cb.end_date) OVERLAPS (p_start_date, p_end_date)
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Função: Criar evento a partir de template
CREATE OR REPLACE FUNCTION create_event_from_template(
  p_template_id uuid,
  p_start_date timestamptz,
  p_athlete_ids uuid[] DEFAULT NULL,
  p_overrides jsonb DEFAULT '{}'
) RETURNS uuid AS $$
DECLARE
  v_template calendar_templates;
  v_event_id uuid;
BEGIN
  -- Buscar template
  SELECT * INTO v_template
  FROM calendar_templates
  WHERE id = p_template_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template não encontrado: %', p_template_id;
  END IF;
  
  -- Criar evento
  INSERT INTO calendar_events (
    workspace_id,
    title,
    description,
    type,
    status,
    start_date,
    end_date,
    location,
    workout_id,
    class_id,
    coach_id,
    athlete_ids,
    requires_confirmation,
    confirmation_deadline,
    created_at
  ) VALUES (
    v_template.workspace_id,
    COALESCE(p_overrides->>'title', v_template.default_title, v_template.name),
    v_template.description,
    v_template.category,
    'scheduled',
    p_start_date,
    p_start_date + (v_template.default_duration_minutes || ' minutes')::interval,
    COALESCE(p_overrides->>'location', v_template.default_location),
    v_template.default_workout_id,
    v_template.default_class_id,
    v_template.default_coach_id,
    COALESCE(p_athlete_ids, v_template.default_athlete_ids),
    v_template.requires_confirmation,
    CASE 
      WHEN v_template.requires_confirmation THEN
        p_start_date - (v_template.confirmation_deadline_hours || ' hours')::interval
      ELSE NULL
    END,
    NOW()
  ) RETURNING id INTO v_event_id;
  
  -- Atualizar usage count do template
  UPDATE calendar_templates
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = p_template_id;
  
  -- Se requer confirmação, criar registos
  IF v_template.requires_confirmation AND COALESCE(array_length(p_athlete_ids, 1), array_length(v_template.default_athlete_ids, 1), 0) > 0 THEN
    INSERT INTO event_confirmations (event_id, athlete_id, status, created_at)
    SELECT v_event_id, unnest(COALESCE(p_athlete_ids, v_template.default_athlete_ids)), 'pending', NOW();
  END IF;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Função: Gerar eventos recorrentes
CREATE OR REPLACE FUNCTION generate_recurring_events(
  p_template_event_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_recurrence_pattern jsonb
) RETURNS TABLE (event_id uuid) AS $$
DECLARE
  v_base_event calendar_events;
  v_current_date timestamptz;
  v_frequency text;
  v_interval integer;
  v_days_of_week integer[];
  v_new_event_id uuid;
  v_day_of_week integer;
BEGIN
  -- Buscar evento base
  SELECT * INTO v_base_event
  FROM calendar_events
  WHERE id = p_template_event_id;
  
  -- Parsear padrão de recorrência
  v_frequency := p_recurrence_pattern->>'frequency';
  v_interval := COALESCE((p_recurrence_pattern->>'interval')::integer, 1);
  
  -- Parse days of week se existir
  IF p_recurrence_pattern ? 'daysOfWeek' THEN
    SELECT ARRAY(SELECT jsonb_array_elements_text(p_recurrence_pattern->'daysOfWeek')::integer) INTO v_days_of_week;
  END IF;
  
  -- Loop para gerar eventos
  v_current_date := p_start_date;
  
  WHILE v_current_date <= p_end_date LOOP
    -- Verificar se dia da semana está nos dias permitidos
    IF v_frequency = 'weekly' AND v_days_of_week IS NOT NULL THEN
      v_day_of_week := EXTRACT(DOW FROM v_current_date)::integer;
      
      IF v_day_of_week = ANY(v_days_of_week) THEN
        -- Criar evento
        INSERT INTO calendar_events (
          workspace_id, title, description, type, status,
          start_date, end_date, location, workout_id, coach_id,
          athlete_ids, series_id, recurrence_pattern, created_at
        ) VALUES (
          v_base_event.workspace_id,
          v_base_event.title,
          v_base_event.description,
          v_base_event.type,
          'scheduled',
          v_current_date,
          v_current_date + (v_base_event.end_date - v_base_event.start_date),
          v_base_event.location,
          v_base_event.workout_id,
          v_base_event.coach_id,
          v_base_event.athlete_ids,
          p_template_event_id,
          p_recurrence_pattern,
          NOW()
        ) RETURNING id INTO v_new_event_id;
        
        event_id := v_new_event_id;
        RETURN NEXT;
      END IF;
    END IF;
    
    -- Incrementar data
    IF v_frequency = 'daily' THEN
      v_current_date := v_current_date + (v_interval || ' days')::interval;
    ELSIF v_frequency = 'weekly' THEN
      v_current_date := v_current_date + interval '1 day';
    ELSIF v_frequency = 'monthly' THEN
      v_current_date := v_current_date + (v_interval || ' months')::interval;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 6: RLS (Row Level Security)
-- ============================================================================

-- event_confirmations
ALTER TABLE event_confirmations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view confirmations" ON event_confirmations;
CREATE POLICY "Users can view confirmations"
  ON event_confirmations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update confirmations" ON event_confirmations;
CREATE POLICY "Users can update confirmations"
  ON event_confirmations FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Users can insert confirmations" ON event_confirmations;
CREATE POLICY "Users can insert confirmations"
  ON event_confirmations FOR INSERT
  WITH CHECK (true);

-- calendar_blocks
ALTER TABLE calendar_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view blocks" ON calendar_blocks;
CREATE POLICY "Users can view blocks"
  ON calendar_blocks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage blocks" ON calendar_blocks;
CREATE POLICY "Users can manage blocks"
  ON calendar_blocks FOR ALL
  USING (true);

-- calendar_templates
ALTER TABLE calendar_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view templates" ON calendar_templates;
CREATE POLICY "Users can view templates"
  ON calendar_templates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage templates" ON calendar_templates;
CREATE POLICY "Users can manage templates"
  ON calendar_templates FOR ALL
  USING (true);

-- ============================================================================
-- PART 7: GRANTS
-- ============================================================================

GRANT ALL ON event_confirmations TO authenticated;
GRANT ALL ON calendar_blocks TO authenticated;
GRANT ALL ON calendar_templates TO authenticated;

-- ============================================================================
-- PART 8: COMMENTS
-- ============================================================================

COMMENT ON TABLE event_confirmations IS 'Sistema de confirmação de presença em eventos';
COMMENT ON TABLE calendar_blocks IS 'Bloqueios de calendário (feriados, manutenção, indisponibilidades)';
COMMENT ON TABLE calendar_templates IS 'Templates para criação rápida de eventos';

COMMENT ON FUNCTION is_date_blocked IS 'Verifica se uma data específica está bloqueada';
COMMENT ON FUNCTION create_event_from_template IS 'Cria evento a partir de um template';
COMMENT ON FUNCTION generate_recurring_events IS 'Gera múltiplos eventos recorrentes';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
