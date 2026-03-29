/**
 * CALENDAR V2.0 - DEMO DATA SEED
 * 
 * Purpose: Populate calendar with realistic demo data
 * Removes mock data dependency from API
 * 
 * Contents:
 * - 50 calendar events (next 3 months)
 * - 20 demo athletes
 * - 15 demo workouts
 * - 100+ event participants
 * - 20 event confirmations
 * 
 * Usage:
 * psql -h <supabase-host> -U postgres -d postgres -f 001_calendar_demo_data.sql
 * 
 * @created 18 Janeiro 2026
 * @priority CRITICAL
 */

-- ============================================================================
-- CLEANUP (Development only - remove in production)
-- ============================================================================

-- Uncomment to clean existing demo data
-- DELETE FROM event_confirmations WHERE event_id IN (SELECT id FROM calendar_events WHERE workspace_id = 'workspace-demo');
-- DELETE FROM event_participants WHERE event_id IN (SELECT id FROM calendar_events WHERE workspace_id = 'workspace-demo');
-- DELETE FROM calendar_events WHERE workspace_id = 'workspace-demo';

-- ============================================================================
-- DEMO ATHLETES
-- ============================================================================

-- Insert demo athletes if not exists
INSERT INTO athletes (id, workspace_id, name, email, date_of_birth, gender, sport, created_at)
VALUES
  ('athlete-demo-01', 'workspace-demo', 'João Silva', 'joao.silva@demo.pt', '2005-03-15', 'male', 'Football', NOW()),
  ('athlete-demo-02', 'workspace-demo', 'Maria Santos', 'maria.santos@demo.pt', '2006-07-22', 'female', 'Basketball', NOW()),
  ('athlete-demo-03', 'workspace-demo', 'Pedro Costa', 'pedro.costa@demo.pt', '2004-11-10', 'male', 'Football', NOW()),
  ('athlete-demo-04', 'workspace-demo', 'Ana Rodrigues', 'ana.rodrigues@demo.pt', '2005-05-18', 'female', 'Volleyball', NOW()),
  ('athlete-demo-05', 'workspace-demo', 'Miguel Ferreira', 'miguel.ferreira@demo.pt', '2006-01-30', 'male', 'Basketball', NOW()),
  ('athlete-demo-06', 'workspace-demo', 'Sofia Almeida', 'sofia.almeida@demo.pt', '2005-09-12', 'female', 'Football', NOW()),
  ('athlete-demo-07', 'workspace-demo', 'Tiago Martins', 'tiago.martins@demo.pt', '2004-12-05', 'male', 'Football', NOW()),
  ('athlete-demo-08', 'workspace-demo', 'Beatriz Lima', 'beatriz.lima@demo.pt', '2006-04-20', 'female', 'Basketball', NOW()),
  ('athlete-demo-09', 'workspace-demo', 'Ricardo Sousa', 'ricardo.sousa@demo.pt', '2005-08-14', 'male', 'Volleyball', NOW()),
  ('athlete-demo-10', 'workspace-demo', 'Inês Carvalho', 'ines.carvalho@demo.pt', '2006-02-28', 'female', 'Football', NOW()),
  ('athlete-demo-11', 'workspace-demo', 'Bruno Pereira', 'bruno.pereira@demo.pt', '2005-06-09', 'male', 'Basketball', NOW()),
  ('athlete-demo-12', 'workspace-demo', 'Carolina Nunes', 'carolina.nunes@demo.pt', '2004-10-17', 'female', 'Volleyball', NOW()),
  ('athlete-demo-13', 'workspace-demo', 'André Oliveira', 'andre.oliveira@demo.pt', '2006-03-25', 'male', 'Football', NOW()),
  ('athlete-demo-14', 'workspace-demo', 'Mariana Gomes', 'mariana.gomes@demo.pt', '2005-07-11', 'female', 'Basketball', NOW()),
  ('athlete-demo-15', 'workspace-demo', 'Diogo Fernandes', 'diogo.fernandes@demo.pt', '2004-11-29', 'male', 'Football', NOW()),
  ('athlete-demo-16', 'workspace-demo', 'Catarina Ribeiro', 'catarina.ribeiro@demo.pt', '2006-05-06', 'female', 'Volleyball', NOW()),
  ('athlete-demo-17', 'workspace-demo', 'Rafael Correia', 'rafael.correia@demo.pt', '2005-09-23', 'male', 'Basketball', NOW()),
  ('athlete-demo-18', 'workspace-demo', 'Leonor Pinto', 'leonor.pinto@demo.pt', '2006-01-14', 'female', 'Football', NOW()),
  ('athlete-demo-19', 'workspace-demo', 'Gonçalo Mendes', 'goncalo.mendes@demo.pt', '2005-04-08', 'male', 'Football', NOW()),
  ('athlete-demo-20', 'workspace-demo', 'Marta Lopes', 'marta.lopes@demo.pt', '2004-12-21', 'female', 'Basketball', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DEMO WORKOUTS
-- ============================================================================

-- Insert demo workouts if not exists
INSERT INTO workouts (id, workspace_id, name, type, duration_minutes, description, created_at)
VALUES
  ('workout-demo-01', 'workspace-demo', 'Força - Full Body A', 'strength', 90, 'Treino completo de força para todo o corpo', NOW()),
  ('workout-demo-02', 'workspace-demo', 'Cardio - HIIT Intervals', 'cardio', 60, 'Treino intervalado de alta intensidade', NOW()),
  ('workout-demo-03', 'workspace-demo', 'Técnica - Specific Drills', 'technical', 90, 'Trabalho técnico específico por posição', NOW()),
  ('workout-demo-04', 'workspace-demo', 'Recuperação - Active Recovery', 'recovery', 60, 'Sessão de recuperação ativa e mobilidade', NOW()),
  ('workout-demo-05', 'workspace-demo', 'Força - Push Day', 'strength', 90, 'Treino de empurrão (peito, ombros, tríceps)', NOW()),
  ('workout-demo-06', 'workspace-demo', 'Tactical - Small Games', 'tactical', 75, 'Jogos reduzidos e trabalho tático', NOW()),
  ('workout-demo-07', 'workspace-demo', 'Força - Pull Day', 'strength', 90, 'Treino de puxada (costas, bíceps)', NOW()),
  ('workout-demo-08', 'workspace-demo', 'Conditioning - Aerobic Base', 'cardio', 60, 'Trabalho aeróbico de base', NOW()),
  ('workout-demo-09', 'workspace-demo', 'Força - Lower Body', 'strength', 90, 'Treino de membros inferiores', NOW()),
  ('workout-demo-10', 'workspace-demo', 'Speed - Sprint Training', 'speed', 60, 'Treino de velocidade e aceleração', NOW()),
  ('workout-demo-11', 'workspace-demo', 'Pre-Competition Activation', 'activation', 45, 'Ativação pré-competição', NOW()),
  ('workout-demo-12', 'workspace-demo', 'Match Simulation', 'tactical', 90, 'Simulação de jogo completa', NOW()),
  ('workout-demo-13', 'workspace-demo', 'Injury Prevention', 'prevention', 60, 'Prevenção de lesões e equilíbrio', NOW()),
  ('workout-demo-14', 'workspace-demo', 'Core & Stability', 'strength', 45, 'Trabalho de core e estabilidade', NOW()),
  ('workout-demo-15', 'workspace-demo', 'Outdoor Training', 'mixed', 90, 'Treino ao ar livre variado', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DEMO CALENDAR EVENTS (50 events over next 3 months)
-- ============================================================================

-- Helper: Generate dates for next 3 months
-- Week 1 (Current week)
INSERT INTO calendar_events (
  id, workspace_id, title, description, type, status, 
  start_date, end_date, workout_id, coach_id, 
  athlete_ids, location, notes, color, tags, created_at
)
VALUES
  -- MONDAY
  (
    'event-demo-001',
    'workspace-demo',
    'Força Matinal - Full Body',
    'Treino de força completo para todo o corpo',
    'training',
    'completed',
    (CURRENT_DATE + TIME '07:00:00')::timestamp,
    (CURRENT_DATE + TIME '08:30:00')::timestamp,
    'workout-demo-01',
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-03', 'athlete-demo-07', 'athlete-demo-09', 'athlete-demo-11', 'athlete-demo-13', 'athlete-demo-15', 'athlete-demo-17', 'athlete-demo-19'],
    'Ginásio Principal',
    'Foco em squats e deadlifts',
    '#10b981',
    ARRAY['strength', 'morning', 'full-body'],
    NOW()
  ),
  (
    'event-demo-002',
    'workspace-demo',
    '🔴 Técnica Individual (EM ANDAMENTO)',
    'Trabalho técnico específico - SESSÃO ATIVA AGORA',
    'training',
    'active',
    (NOW() - INTERVAL '30 minutes')::timestamp,
    (NOW() + INTERVAL '60 minutes')::timestamp,
    'workout-demo-03',
    'coach-demo-01',
    ARRAY['athlete-demo-02', 'athlete-demo-04', 'athlete-demo-06', 'athlete-demo-08', 'athlete-demo-10'],
    'Campo Exterior',
    'Esta sessão está acontecendo AGORA',
    '#f59e0b',
    ARRAY['technical', 'active-now'],
    NOW()
  ),
  (
    'event-demo-003',
    'workspace-demo',
    'Tactical Session - Small Games',
    'Jogos reduzidos e trabalho tático posicional',
    'training',
    'scheduled',
    (CURRENT_DATE + TIME '18:00:00')::timestamp,
    (CURRENT_DATE + TIME '19:15:00')::timestamp,
    'workout-demo-06',
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05', 'athlete-demo-06', 'athlete-demo-07', 'athlete-demo-08'],
    'Campo Principal',
    'Foco em transições defesa-ataque',
    '#0ea5e9',
    ARRAY['tactical', 'evening'],
    NOW()
  ),

  -- TUESDAY
  (
    'event-demo-004',
    'workspace-demo',
    'Recuperação Ativa',
    'Sessão de recuperação e mobilidade',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '1 day' + TIME '11:00:00')::timestamp,
    'workout-demo-04',
    'coach-demo-01',
    ARRAY['athlete-demo-09', 'athlete-demo-10', 'athlete-demo-11', 'athlete-demo-12'],
    'Sala de Recuperação',
    'Foam rolling e stretching',
    '#8b5cf6',
    ARRAY['recovery', 'wellness'],
    NOW()
  ),
  (
    'event-demo-005',
    'workspace-demo',
    'Speed Training - Sprints',
    'Treino de velocidade e aceleração',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '1 day' + TIME '16:30:00')::timestamp,
    (CURRENT_DATE + INTERVAL '1 day' + TIME '17:30:00')::timestamp,
    'workout-demo-10',
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-03', 'athlete-demo-05', 'athlete-demo-07', 'athlete-demo-09'],
    'Pista de Atletismo',
    'Sprints de 30m e 60m',
    '#ef4444',
    ARRAY['speed', 'explosive'],
    NOW()
  ),

  -- WEDNESDAY
  (
    'event-demo-006',
    'workspace-demo',
    'Força - Push Day',
    'Treino de empurrão (peito, ombros, tríceps)',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '2 days' + TIME '09:30:00')::timestamp,
    'workout-demo-05',
    'coach-demo-01',
    ARRAY['athlete-demo-02', 'athlete-demo-04', 'athlete-demo-06', 'athlete-demo-08', 'athlete-demo-10', 'athlete-demo-12'],
    'Ginásio Principal',
    'Bench press e overhead press',
    '#10b981',
    ARRAY['strength', 'upper-body'],
    NOW()
  ),
  (
    'event-demo-007',
    'workspace-demo',
    'Match Simulation',
    'Simulação de jogo completa 11v11',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '2 days' + TIME '17:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '2 days' + TIME '18:30:00')::timestamp,
    'workout-demo-12',
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05', 'athlete-demo-06', 'athlete-demo-07', 'athlete-demo-08', 'athlete-demo-09', 'athlete-demo-10'],
    'Campo Principal',
    'Simulação tática completa',
    '#0ea5e9',
    ARRAY['tactical', 'simulation'],
    NOW()
  ),

  -- THURSDAY
  (
    'event-demo-008',
    'workspace-demo',
    'Core & Stability',
    'Trabalho de core e estabilidade postural',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '3 days' + TIME '09:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '3 days' + TIME '09:45:00')::timestamp,
    'workout-demo-14',
    'coach-demo-01',
    ARRAY['athlete-demo-11', 'athlete-demo-12', 'athlete-demo-13', 'athlete-demo-14', 'athlete-demo-15'],
    'Sala de Treino',
    'Plank variations e anti-rotação',
    '#8b5cf6',
    ARRAY['core', 'stability'],
    NOW()
  ),
  (
    'event-demo-009',
    'workspace-demo',
    'Injury Prevention Session',
    'Prevenção de lesões e trabalho propriocetivo',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '3 days' + TIME '15:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '3 days' + TIME '16:00:00')::timestamp,
    'workout-demo-13',
    'coach-demo-01',
    ARRAY['athlete-demo-16', 'athlete-demo-17', 'athlete-demo-18', 'athlete-demo-19', 'athlete-demo-20'],
    'Ginásio',
    'Equilíbrio e proprioceção',
    '#f59e0b',
    ARRAY['prevention', 'balance'],
    NOW()
  ),

  -- FRIDAY
  (
    'event-demo-010',
    'workspace-demo',
    'Pre-Match Activation',
    'Ativação pré-jogo para o fim de semana',
    'training',
    'scheduled',
    (CURRENT_DATE + INTERVAL '4 days' + TIME '11:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '4 days' + TIME '11:45:00')::timestamp,
    'workout-demo-11',
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05', 'athlete-demo-06'],
    'Campo Principal',
    'Ativação neuromuscular',
    '#ef4444',
    ARRAY['activation', 'pre-competition'],
    NOW()
  ),

  -- SATURDAY
  (
    'event-demo-011',
    'workspace-demo',
    '🏆 JOGO OFICIAL - Casa vs FC Porto B',
    'Competição oficial - Campeonato Nacional Sub-19',
    'competition',
    'confirmed',
    (CURRENT_DATE + INTERVAL '5 days' + TIME '15:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '5 days' + TIME '17:00:00')::timestamp,
    NULL,
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05', 'athlete-demo-06', 'athlete-demo-07', 'athlete-demo-08', 'athlete-demo-09', 'athlete-demo-10', 'athlete-demo-11'],
    'Estádio Principal',
    'Jogo em casa - IMPORTANTE',
    '#ef4444',
    ARRAY['competition', 'home', 'championship'],
    NOW()
  ),

  -- SUNDAY (Rest)
  (
    'event-demo-012',
    'workspace-demo',
    'Dia de Descanso',
    'Recuperação completa',
    'rest',
    'scheduled',
    (CURRENT_DATE + INTERVAL '6 days' + TIME '00:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '6 days' + TIME '23:59:59')::timestamp,
    NULL,
    'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05'],
    'N/A',
    'Descanso obrigatório pós-jogo',
    '#94a3b8',
    ARRAY['rest', 'recovery'],
    NOW()
  );

-- Week 2 (Next week) - 10 more events
INSERT INTO calendar_events (
  id, workspace_id, title, description, type, status,
  start_date, end_date, workout_id, coach_id,
  athlete_ids, location, color, tags, created_at
)
VALUES
  ('event-demo-013', 'workspace-demo', 'Conditioning - Aerobic Base', 'Trabalho aeróbico de base', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '7 days' + TIME '08:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '7 days' + TIME '09:00:00')::timestamp,
    'workout-demo-08', 'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-03', 'athlete-demo-05', 'athlete-demo-07'], 'Pista', '#0ea5e9', ARRAY['cardio'], NOW()),

  ('event-demo-014', 'workspace-demo', 'Força - Pull Day', 'Treino de puxada', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '8 days' + TIME '16:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '8 days' + TIME '17:30:00')::timestamp,
    'workout-demo-07', 'coach-demo-01',
    ARRAY['athlete-demo-02', 'athlete-demo-04', 'athlete-demo-06', 'athlete-demo-08'], 'Ginásio', '#10b981', ARRAY['strength'], NOW()),

  ('event-demo-015', 'workspace-demo', 'Technical Drills', 'Trabalho técnico específico', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '9 days' + TIME '10:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '9 days' + TIME '11:30:00')::timestamp,
    'workout-demo-03', 'coach-demo-01',
    ARRAY['athlete-demo-09', 'athlete-demo-10', 'athlete-demo-11'], 'Campo', '#f59e0b', ARRAY['technical'], NOW()),

  ('event-demo-016', 'workspace-demo', 'Força - Lower Body', 'Membros inferiores', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '10 days' + TIME '14:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '10 days' + TIME '15:30:00')::timestamp,
    'workout-demo-09', 'coach-demo-01',
    ARRAY['athlete-demo-12', 'athlete-demo-13', 'athlete-demo-14'], 'Ginásio', '#10b981', ARRAY['strength'], NOW()),

  ('event-demo-017', 'workspace-demo', 'Match Simulation', 'Simulação de jogo', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '11 days' + TIME '17:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '11 days' + TIME '18:30:00')::timestamp,
    'workout-demo-12', 'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05'], 'Campo Principal', '#0ea5e9', ARRAY['tactical'], NOW()),

  ('event-demo-018', 'workspace-demo', 'Recovery Session', 'Recuperação ativa', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '12 days' + TIME '10:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '12 days' + TIME '11:00:00')::timestamp,
    'workout-demo-04', 'coach-demo-01',
    ARRAY['athlete-demo-15', 'athlete-demo-16', 'athlete-demo-17'], 'Sala Recuperação', '#8b5cf6', ARRAY['recovery'], NOW()),

  ('event-demo-019', 'workspace-demo', '🏆 JOGO - Fora vs Benfica B', 'Jogo fora', 'competition', 'scheduled',
    (CURRENT_DATE + INTERVAL '13 days' + TIME '16:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '13 days' + TIME '18:00:00')::timestamp,
    NULL, 'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05', 'athlete-demo-06'], 'Estádio da Luz - Anexo', '#ef4444', ARRAY['competition', 'away'], NOW());

-- Week 3-4 (More events) - 15 more events with variety
INSERT INTO calendar_events (
  id, workspace_id, title, description, type, status,
  start_date, end_date, workout_id, coach_id,
  athlete_ids, location, color, created_at
)
VALUES
  ('event-demo-020', 'workspace-demo', 'Team Meeting', 'Reunião de equipa técnica', 'meeting', 'scheduled',
    (CURRENT_DATE + INTERVAL '14 days' + TIME '09:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '14 days' + TIME '10:00:00')::timestamp,
    NULL, 'coach-demo-01', ARRAY[]::text[], 'Sala de Reuniões', '#64748b', NOW()),

  ('event-demo-021', 'workspace-demo', 'Avaliação Física', 'Testes físicos trimestrais', 'evaluation', 'scheduled',
    (CURRENT_DATE + INTERVAL '15 days' + TIME '08:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '15 days' + TIME '12:00:00')::timestamp,
    NULL, 'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05'], 'Ginásio', '#f59e0b', NOW()),

  ('event-demo-022', 'workspace-demo', 'Treino Força U17', 'Força full body', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '16 days' + TIME '15:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '16 days' + TIME '16:30:00')::timestamp,
    'workout-demo-01', 'coach-demo-01',
    ARRAY['athlete-demo-06', 'athlete-demo-07', 'athlete-demo-08'], 'Ginásio', '#10b981', NOW()),

  ('event-demo-023', 'workspace-demo', 'Outdoor Training', 'Treino ao ar livre', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '17 days' + TIME '10:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '17 days' + TIME '11:30:00')::timestamp,
    'workout-demo-15', 'coach-demo-01',
    ARRAY['athlete-demo-09', 'athlete-demo-10', 'athlete-demo-11', 'athlete-demo-12'], 'Parque da Cidade', '#10b981', NOW()),

  ('event-demo-024', 'workspace-demo', 'HIIT Intervals', 'Cardio intenso', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '18 days' + TIME '16:30:00')::timestamp,
    (CURRENT_DATE + INTERVAL '18 days' + TIME '17:30:00')::timestamp,
    'workout-demo-02', 'coach-demo-01',
    ARRAY['athlete-demo-13', 'athlete-demo-14', 'athlete-demo-15'], 'Campo', '#ef4444', NOW()),

  ('event-demo-025', 'workspace-demo', 'Tactical Session', 'Trabalho tático', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '19 days' + TIME '17:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '19 days' + TIME '18:30:00')::timestamp,
    'workout-demo-06', 'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04'], 'Campo Principal', '#0ea5e9', NOW()),

  ('event-demo-026', 'workspace-demo', 'Core Training', 'Core e estabilidade', 'training', 'scheduled',
    (CURRENT_DATE + INTERVAL '20 days' + TIME '09:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '20 days' + TIME '09:45:00')::timestamp,
    'workout-demo-14', 'coach-demo-01',
    ARRAY['athlete-demo-16', 'athlete-demo-17', 'athlete-demo-18'], 'Sala Treino', '#8b5cf6', NOW()),

  ('event-demo-027', 'workspace-demo', '🏆 Jogo Taça', 'Eliminatória da Taça', 'competition', 'scheduled',
    (CURRENT_DATE + INTERVAL '21 days' + TIME '15:00:00')::timestamp,
    (CURRENT_DATE + INTERVAL '21 days' + TIME '17:00:00')::timestamp,
    NULL, 'coach-demo-01',
    ARRAY['athlete-demo-01', 'athlete-demo-02', 'athlete-demo-03', 'athlete-demo-04', 'athlete-demo-05', 'athlete-demo-06', 'athlete-demo-07'], 'Estádio', '#ef4444', NOW());

-- More weeks (events 28-50) - Spread over next 2 months
INSERT INTO calendar_events (
  id, workspace_id, title, type, status,
  start_date, end_date, workout_id, coach_id,
  athlete_ids, location, color, created_at
)
SELECT
  'event-demo-' || LPAD((28 + gs.n)::text, 3, '0'),
  'workspace-demo',
  CASE 
    WHEN (gs.n % 7) = 0 THEN '🏆 Jogo Oficial'
    WHEN (gs.n % 5) = 0 THEN 'Avaliação Física'
    WHEN (gs.n % 4) = 0 THEN 'Recovery Session'
    WHEN (gs.n % 3) = 0 THEN 'Força - ' || (ARRAY['Push', 'Pull', 'Legs'])[1 + (gs.n % 3)]
    ELSE 'Treino Técnico'
  END,
  CASE 
    WHEN (gs.n % 7) = 0 THEN 'competition'
    WHEN (gs.n % 5) = 0 THEN 'evaluation'
    ELSE 'training'
  END,
  'scheduled',
  (CURRENT_DATE + INTERVAL '22 days' + (gs.n || ' days')::interval + TIME '15:00:00')::timestamp,
  (CURRENT_DATE + INTERVAL '22 days' + (gs.n || ' days')::interval + TIME '16:30:00')::timestamp,
  'workout-demo-' || LPAD((1 + (gs.n % 15))::text, 2, '0'),
  'coach-demo-01',
  ARRAY['athlete-demo-' || LPAD((1 + (gs.n % 20))::text, 2, '0')],
  CASE 
    WHEN (gs.n % 2) = 0 THEN 'Ginásio Principal'
    ELSE 'Campo Exterior'
  END,
  (ARRAY['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'])[1 + (gs.n % 5)],
  NOW()
FROM generate_series(0, 22) AS gs(n);

-- ============================================================================
-- EVENT PARTICIPANTS (100+ records)
-- ============================================================================

-- Create participants for all events
INSERT INTO event_participants (event_id, athlete_id, status, created_at)
SELECT
  ce.id,
  unnest(ce.athlete_ids),
  CASE 
    WHEN ce.status = 'completed' THEN 'attended'
    WHEN ce.status = 'active' THEN 'confirmed'
    WHEN ce.status = 'confirmed' THEN 'confirmed'
    ELSE 'pending'
  END,
  NOW()
FROM calendar_events ce
WHERE ce.workspace_id = 'workspace-demo'
  AND ce.athlete_ids IS NOT NULL
  AND array_length(ce.athlete_ids, 1) > 0
ON CONFLICT DO NOTHING;

-- ============================================================================
-- EVENT CONFIRMATIONS (20 records for upcoming events)
-- ============================================================================

-- Create confirmation records for scheduled events with requires_confirmation
INSERT INTO event_confirmations (
  event_id, athlete_id, status, confirmation_token, 
  token_expires_at, created_at
)
SELECT
  ce.id,
  unnest(ce.athlete_ids[1:3]), -- First 3 athletes per event
  CASE 
    WHEN random() < 0.7 THEN 'confirmed'
    WHEN random() < 0.9 THEN 'pending'
    ELSE 'declined'
  END,
  md5(random()::text || ce.id),
  NOW() + INTERVAL '48 hours',
  NOW()
FROM calendar_events ce
WHERE ce.workspace_id = 'workspace-demo'
  AND ce.status IN ('scheduled', 'confirmed')
  AND ce.type = 'competition'
  AND ce.athlete_ids IS NOT NULL
  AND array_length(ce.athlete_ids, 1) >= 3
LIMIT 20
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count inserted data
DO $$
DECLARE
  event_count INTEGER;
  participant_count INTEGER;
  confirmation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO event_count FROM calendar_events WHERE workspace_id = 'workspace-demo';
  SELECT COUNT(*) INTO participant_count FROM event_participants WHERE event_id IN (SELECT id FROM calendar_events WHERE workspace_id = 'workspace-demo');
  SELECT COUNT(*) INTO confirmation_count FROM event_confirmations WHERE event_id IN (SELECT id FROM calendar_events WHERE workspace_id = 'workspace-demo');
  
  RAISE NOTICE '✅ Seed completed successfully!';
  RAISE NOTICE '   - Events: %', event_count;
  RAISE NOTICE '   - Participants: %', participant_count;
  RAISE NOTICE '   - Confirmations: %', confirmation_count;
END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Query to verify data
/*
-- Events by status
SELECT status, COUNT(*) 
FROM calendar_events 
WHERE workspace_id = 'workspace-demo' 
GROUP BY status 
ORDER BY status;

-- Events by type
SELECT type, COUNT(*) 
FROM calendar_events 
WHERE workspace_id = 'workspace-demo' 
GROUP BY type 
ORDER BY type;

-- Events over time
SELECT 
  DATE(start_date) as date,
  COUNT(*) as events
FROM calendar_events 
WHERE workspace_id = 'workspace-demo' 
GROUP BY DATE(start_date)
ORDER BY date
LIMIT 30;

-- Participant statistics
SELECT 
  ce.title,
  COUNT(ep.id) as participant_count
FROM calendar_events ce
LEFT JOIN event_participants ep ON ep.event_id = ce.id
WHERE ce.workspace_id = 'workspace-demo'
GROUP BY ce.id, ce.title
ORDER BY participant_count DESC
LIMIT 10;
*/
