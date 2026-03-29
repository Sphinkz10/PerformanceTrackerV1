-- =====================================================================================
-- RECURRING EVENTS (EVENTOS RECORRENTES)
-- Sistema completo de eventos que se repetem
-- =====================================================================================

-- Tabela de padrões de recorrência
CREATE TABLE IF NOT EXISTS calendar_event_recurrence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Padrão de recorrência
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  interval int NOT NULL DEFAULT 1 CHECK (interval > 0), -- A cada X dias/semanas/meses
  
  -- Dias da semana (para weekly)
  days_of_week int[] DEFAULT ARRAY[]::int[], -- 0=Domingo, 1=Segunda, ..., 6=Sábado
  
  -- Dia do mês (para monthly)
  day_of_month int CHECK (day_of_month >= 1 AND day_of_month <= 31),
  
  -- Opções de fim
  end_type text NOT NULL DEFAULT 'never' CHECK (end_type IN ('never', 'after', 'on_date')),
  end_after_occurrences int CHECK (end_after_occurrences > 0),
  end_date date,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Validação: se end_type='after', end_after_occurrences deve existir
  CONSTRAINT valid_end_after CHECK (
    end_type != 'after' OR end_after_occurrences IS NOT NULL
  ),
  
  -- Validação: se end_type='on_date', end_date deve existir
  CONSTRAINT valid_end_date CHECK (
    end_type != 'on_date' OR end_date IS NOT NULL
  )
);

-- Adicionar campos de recorrência na tabela de eventos
ALTER TABLE calendar_events 
  ADD COLUMN IF NOT EXISTS recurrence_id uuid REFERENCES calendar_event_recurrence(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS recurrence_parent_id uuid REFERENCES calendar_events(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_recurrence_parent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_exception boolean DEFAULT false; -- Instância editada individualmente

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recurrence_workspace ON calendar_event_recurrence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_recurrence_id ON calendar_events(recurrence_id);
CREATE INDEX IF NOT EXISTS idx_events_recurrence_parent ON calendar_events(recurrence_parent_id);
CREATE INDEX IF NOT EXISTS idx_events_is_parent ON calendar_events(is_recurrence_parent) WHERE is_recurrence_parent = true;

-- RLS Policies para recurrence
ALTER TABLE calendar_event_recurrence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recurrence in their workspace"
  ON calendar_event_recurrence FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create recurrence in their workspace"
  ON calendar_event_recurrence FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update recurrence in their workspace"
  ON calendar_event_recurrence FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete recurrence in their workspace"
  ON calendar_event_recurrence FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger para updated_at
CREATE TRIGGER set_recurrence_updated_at
  BEFORE UPDATE ON calendar_event_recurrence
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View com informações enriquecidas de recorrência
CREATE OR REPLACE VIEW calendar_events_with_recurrence AS
SELECT 
  e.*,
  r.frequency,
  r.interval,
  r.days_of_week,
  r.day_of_month,
  r.end_type,
  r.end_after_occurrences,
  r.end_date as recurrence_end_date,
  CASE 
    WHEN e.is_recurrence_parent THEN 'parent'
    WHEN e.recurrence_parent_id IS NOT NULL AND e.is_exception THEN 'exception'
    WHEN e.recurrence_parent_id IS NOT NULL THEN 'occurrence'
    ELSE 'single'
  END as recurrence_type
FROM calendar_events e
LEFT JOIN calendar_event_recurrence r ON e.recurrence_id = r.id;

-- Função para gerar descrição textual da recorrência
CREATE OR REPLACE FUNCTION get_recurrence_description(
  p_frequency text,
  p_interval int,
  p_days_of_week int[],
  p_day_of_month int,
  p_end_type text,
  p_end_after_occurrences int,
  p_end_date date
) RETURNS text AS $$
DECLARE
  description text;
  days_text text;
BEGIN
  -- Frequência base
  IF p_frequency = 'daily' THEN
    IF p_interval = 1 THEN
      description := 'Todos os dias';
    ELSE
      description := 'A cada ' || p_interval || ' dias';
    END IF;
  ELSIF p_frequency = 'weekly' THEN
    IF p_interval = 1 THEN
      description := 'Todas as semanas';
    ELSE
      description := 'A cada ' || p_interval || ' semanas';
    END IF;
    
    -- Adicionar dias da semana
    IF array_length(p_days_of_week, 1) > 0 THEN
      SELECT string_agg(
        CASE day
          WHEN 0 THEN 'Dom'
          WHEN 1 THEN 'Seg'
          WHEN 2 THEN 'Ter'
          WHEN 3 THEN 'Qua'
          WHEN 4 THEN 'Qui'
          WHEN 5 THEN 'Sex'
          WHEN 6 THEN 'Sáb'
        END,
        ', '
      ) INTO days_text
      FROM unnest(p_days_of_week) AS day;
      
      description := description || ' em ' || days_text;
    END IF;
  ELSIF p_frequency = 'monthly' THEN
    IF p_interval = 1 THEN
      description := 'Todo mês';
    ELSE
      description := 'A cada ' || p_interval || ' meses';
    END IF;
    
    IF p_day_of_month IS NOT NULL THEN
      description := description || ' no dia ' || p_day_of_month;
    END IF;
  ELSIF p_frequency = 'yearly' THEN
    IF p_interval = 1 THEN
      description := 'Todo ano';
    ELSE
      description := 'A cada ' || p_interval || ' anos';
    END IF;
  END IF;
  
  -- Adicionar término
  IF p_end_type = 'after' AND p_end_after_occurrences IS NOT NULL THEN
    description := description || ', ' || p_end_after_occurrences || ' vezes';
  ELSIF p_end_type = 'on_date' AND p_end_date IS NOT NULL THEN
    description := description || ', até ' || to_char(p_end_date, 'DD/MM/YYYY');
  END IF;
  
  RETURN description;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função para deletar série completa de eventos recorrentes
CREATE OR REPLACE FUNCTION delete_recurring_series(p_parent_event_id uuid)
RETURNS void AS $$
BEGIN
  -- Deletar todos os eventos filhos
  DELETE FROM calendar_events 
  WHERE recurrence_parent_id = p_parent_event_id;
  
  -- Deletar o evento pai
  DELETE FROM calendar_events 
  WHERE id = p_parent_event_id;
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON TABLE calendar_event_recurrence IS 'Padrões de recorrência para eventos que se repetem';
COMMENT ON COLUMN calendar_event_recurrence.frequency IS 'Frequência: daily, weekly, monthly, yearly';
COMMENT ON COLUMN calendar_event_recurrence.interval IS 'Intervalo: a cada X dias/semanas/meses';
COMMENT ON COLUMN calendar_event_recurrence.days_of_week IS 'Array de dias da semana (0=Dom, 6=Sáb)';
COMMENT ON COLUMN calendar_event_recurrence.end_type IS 'Tipo de fim: never, after (N occorrências), on_date';
COMMENT ON COLUMN calendar_events.is_recurrence_parent IS 'Se é o evento pai de uma série';
COMMENT ON COLUMN calendar_events.recurrence_parent_id IS 'ID do evento pai (se for ocorrência)';
COMMENT ON COLUMN calendar_events.is_exception IS 'Se foi editado individualmente (exceção da regra)';
