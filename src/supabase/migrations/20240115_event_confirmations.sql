-- =====================================================================================
-- CALENDAR EVENT CONFIRMATIONS
-- Sistema de confirmações de presença de atletas em eventos
-- =====================================================================================

-- Tabela de confirmações
CREATE TABLE IF NOT EXISTS calendar_event_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  
  -- Status da confirmação
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'maybe')),
  
  -- Dados adicionais
  response_note text,
  responded_at timestamptz,
  reminded_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  
  -- Constraints
  UNIQUE(event_id, athlete_id)
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_confirmations_event ON calendar_event_confirmations(event_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_athlete ON calendar_event_confirmations(athlete_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_workspace ON calendar_event_confirmations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_status ON calendar_event_confirmations(status);

-- RLS Policies
ALTER TABLE calendar_event_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view confirmations in their workspace"
  ON calendar_event_confirmations FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create confirmations in their workspace"
  ON calendar_event_confirmations FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update confirmations in their workspace"
  ON calendar_event_confirmations FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete confirmations in their workspace"
  ON calendar_event_confirmations FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger para updated_at
CREATE TRIGGER set_confirmations_updated_at
  BEFORE UPDATE ON calendar_event_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View com dados enriquecidos
CREATE OR REPLACE VIEW calendar_event_confirmations_view AS
SELECT 
  c.*,
  a.name as athlete_name,
  a.email as athlete_email,
  a.avatar_url as athlete_avatar,
  e.title as event_title,
  e.start_date as event_start
FROM calendar_event_confirmations c
LEFT JOIN athletes a ON c.athlete_id = a.id
LEFT JOIN calendar_events e ON c.event_id = e.id;

-- Função para criar confirmações automaticamente quando atletas são adicionados
CREATE OR REPLACE FUNCTION create_event_confirmations()
RETURNS TRIGGER AS $$
BEGIN
  -- Se athlete_ids foi modificado
  IF (TG_OP = 'INSERT' OR NEW.athlete_ids IS DISTINCT FROM OLD.athlete_ids) THEN
    -- Criar confirmações para novos atletas
    INSERT INTO calendar_event_confirmations (workspace_id, event_id, athlete_id, created_by)
    SELECT NEW.workspace_id, NEW.id, unnest(NEW.athlete_ids), NEW.created_by
    ON CONFLICT (event_id, athlete_id) DO NOTHING;
    
    -- Remover confirmações de atletas removidos
    IF TG_OP = 'UPDATE' THEN
      DELETE FROM calendar_event_confirmations
      WHERE event_id = NEW.id
      AND athlete_id = ANY(
        SELECT unnest(OLD.athlete_ids)
        EXCEPT
        SELECT unnest(NEW.athlete_ids)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_event_confirmations
  AFTER INSERT OR UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION create_event_confirmations();

-- Comentários
COMMENT ON TABLE calendar_event_confirmations IS 'Sistema de confirmações de presença de atletas em eventos do calendário';
COMMENT ON COLUMN calendar_event_confirmations.status IS 'Status: pending, confirmed, declined, maybe';
COMMENT ON COLUMN calendar_event_confirmations.response_note IS 'Nota opcional do atleta ao responder';
COMMENT ON COLUMN calendar_event_confirmations.responded_at IS 'Timestamp de quando respondeu';
COMMENT ON COLUMN calendar_event_confirmations.reminded_at IS 'Timestamp do último lembrete enviado';
