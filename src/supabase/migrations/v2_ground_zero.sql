-- =================================================================================
-- PROTOCOLO "GROUND ZERO" - BASE DE DADOS V2 ("Luna Obsidian")
-- =================================================================================
-- ATENÇÃO: Script para ser corrido como migração ou aplicado num ambiente fresco.
-- Cria as tabelas base, Foreign Keys e políticas de Row Level Security (RLS).
-- =================================================================================

-- ---------------------------------------------------------------------------------
-- 1. EXTENSÕES & ENUMS
-- ---------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------------
-- 2. CORE & IDENTIDADE
-- ---------------------------------------------------------------------------------

-- WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('gym', 'team', 'personal')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- USERS (Sincronizado com Auth, guarda metadata global)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Mapeia para auth.users.id
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'coach', 'athlete')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_users_workspace ON public.users(workspace_id);

-- ATHLETES PROFILES
CREATE TABLE IF NOT EXISTS public.athletes_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    date_of_birth DATE,
    sport VARCHAR(100),
    position VARCHAR(100),
    jersey_number VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_athletes_workspace ON public.athletes_profiles(workspace_id);
CREATE INDEX idx_athletes_user ON public.athletes_profiles(user_id);

-- COACHES PROFILES
CREATE TABLE IF NOT EXISTS public.coaches_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    specialty VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_coaches_workspace ON public.coaches_profiles(workspace_id);
CREATE INDEX idx_coaches_user ON public.coaches_profiles(user_id);


-- ---------------------------------------------------------------------------------
-- 3. BIBLIOTECA DE TREINO ("O PLANO")
-- ---------------------------------------------------------------------------------

-- EXERCISES
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    video_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_exercises_workspace ON public.exercises(workspace_id);

-- WORKOUT TEMPLATES
CREATE TABLE IF NOT EXISTS public.workout_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- ex: 'strength', 'recovery', 'cardio'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_workout_templates_workspace ON public.workout_templates(workspace_id);

-- WORKOUT TEMPLATE BLOCKS
CREATE TABLE IF NOT EXISTS public.workout_template_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- ex: 'Warmup', 'Main Lift'
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_workout_blocks_template ON public.workout_template_blocks(workout_template_id);

-- WORKOUT TEMPLATE EXERCISES
CREATE TABLE IF NOT EXISTS public.workout_template_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_id UUID NOT NULL REFERENCES public.workout_template_blocks(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    target_sets INTEGER,
    target_reps INTEGER,
    target_rpe NUMERIC,
    target_duration_seconds INTEGER,
    target_intensity VARCHAR(100), -- ex: "85% 1RM", "20kg"
    rest_time_seconds INTEGER,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_workout_template_exercises_block ON public.workout_template_exercises(block_id);


-- ---------------------------------------------------------------------------------
-- 4. EXECUÇÃO / LIVE SESSION ("A REALIDADE")
-- ---------------------------------------------------------------------------------

-- SCHEDULED SESSIONS
CREATE TABLE IF NOT EXISTS public.scheduled_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    workout_template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_scheduled_sessions_workspace ON public.scheduled_sessions(workspace_id);

-- SESSION ATTENDEES
CREATE TABLE IF NOT EXISTS public.session_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.scheduled_sessions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES public.athletes_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, athlete_id)
);
CREATE INDEX idx_session_attendees_session ON public.session_attendees(session_id);
CREATE INDEX idx_session_attendees_athlete ON public.session_attendees(athlete_id);

-- SESSION LOGS (Registo Efetivo)
CREATE TABLE IF NOT EXISTS public.session_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.scheduled_sessions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES public.athletes_profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    perceived_exertion NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, athlete_id)
);
CREATE INDEX idx_session_logs_session ON public.session_logs(session_id);
CREATE INDEX idx_session_logs_athlete ON public.session_logs(athlete_id);

-- SET LOGS (Séries Executadas)
CREATE TABLE IF NOT EXISTS public.set_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_log_id UUID NOT NULL REFERENCES public.session_logs(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    template_exercise_id UUID REFERENCES public.workout_template_exercises(id) ON DELETE SET NULL,
    set_number INTEGER NOT NULL,
    actual_weight NUMERIC,
    actual_reps INTEGER,
    actual_rpe NUMERIC,
    actual_duration_seconds INTEGER,
    is_skipped BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_set_logs_session_log ON public.set_logs(session_log_id);


-- ---------------------------------------------------------------------------------
-- 5. MÉTRICAS, AUTOMAÇÃO E BEM-ESTAR
-- ---------------------------------------------------------------------------------

-- METRICS DEFINITIONS
CREATE TABLE IF NOT EXISTS public.metrics_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    data_type VARCHAR(50) NOT NULL, -- 'number', 'boolean', 'enum', 'string'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_metrics_def_workspace ON public.metrics_definitions(workspace_id);

-- METRIC ENTRIES
CREATE TABLE IF NOT EXISTS public.metric_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes_profiles(id) ON DELETE CASCADE,
    metric_id UUID NOT NULL REFERENCES public.metrics_definitions(id) ON DELETE CASCADE,
    value JSONB NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source_type VARCHAR(50) DEFAULT 'manual_entry' CHECK (source_type IN ('manual_entry', 'live_session', 'calculation')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_metric_entries_athlete ON public.metric_entries(athlete_id);
CREATE INDEX idx_metric_entries_metric ON public.metric_entries(metric_id);

-- INJURIES
CREATE TABLE IF NOT EXISTS public.injuries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'recovered')),
    description TEXT NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_recovery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_injuries_athlete ON public.injuries(athlete_id);

-- DECISIONS
CREATE TABLE IF NOT EXISTS public.decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes_profiles(id) ON DELETE CASCADE,
    rule_id VARCHAR(255),
    action_type VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_decisions_athlete ON public.decisions(athlete_id);


-- ---------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) INTRANSPONÍVEL
-- ---------------------------------------------------------------------------------

-- Activar RLS em todas as tabelas
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_template_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;


-- Políticas Helpers (Baseadas na tabela users do schema public)
-- Assumindo que auth.uid() é usado para obter o UUID do utilizador logado, e validamos isso contra a public.users

-- Para evitar o anti-pattern "infinite recursion" em Postgres RLS ao consultar a própria tabela
-- usamos uma função helper baseada na JWT claim (se aplicável) ou aceitamos uma subquery limitada

-- USERS
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (id = auth.uid());

-- (Nota: Em ambientes Supabase de produção, o "same workspace se for coach" é geralmente gerido via app_metadata no JWT
-- ou views de segurança isoladas. Para esta base, focamos na leitura do próprio para evitar recursão infinita na tabela core).

-- WORKSPACES
CREATE POLICY "Users can view their own workspace" ON public.workspaces
    FOR SELECT USING (
        id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    );

-- ATHLETES PROFILES
CREATE POLICY "Athletes view own profile, Coaches view workspace athletes" ON public.athletes_profiles
    FOR SELECT USING (
        user_id = auth.uid() OR
        workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'coach'))
    );

-- COACHES PROFILES
CREATE POLICY "Everyone in workspace can view coaches" ON public.coaches_profiles
    FOR SELECT USING (
        workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid())
    );

-- EXERCISES & TEMPLATES (Leitura para todo o workspace)
CREATE POLICY "Workspace can read exercises" ON public.exercises
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Workspace can read workout templates" ON public.workout_templates
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Workspace can read workout template blocks" ON public.workout_template_blocks
    FOR SELECT USING (workout_template_id IN (SELECT id FROM public.workout_templates WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Workspace can read workout template exercises" ON public.workout_template_exercises
    FOR SELECT USING (block_id IN (SELECT id FROM public.workout_template_blocks WHERE workout_template_id IN (SELECT id FROM public.workout_templates WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid()))));

-- SCHEDULED SESSIONS
CREATE POLICY "Workspace can view sessions" ON public.scheduled_sessions
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Workspace can view session attendees" ON public.session_attendees
    FOR SELECT USING (session_id IN (SELECT id FROM public.scheduled_sessions WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid())));

-- METRICS DEFINITIONS
CREATE POLICY "Workspace can view metrics definitions" ON public.metrics_definitions
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid()));

-- SESSION LOGS (Realidade)
CREATE POLICY "Athletes view own logs, Coaches view workspace logs" ON public.session_logs
    FOR SELECT USING (
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE user_id = auth.uid()) OR
        session_id IN (SELECT id FROM public.scheduled_sessions WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'coach')))
    );

-- SET LOGS (Depende de Session Logs)
CREATE POLICY "Athletes view own sets, Coaches view workspace sets" ON public.set_logs
    FOR SELECT USING (
        session_log_id IN (SELECT id FROM public.session_logs WHERE athlete_id IN (SELECT id FROM public.athletes_profiles WHERE user_id = auth.uid())) OR
        session_log_id IN (SELECT id FROM public.session_logs WHERE session_id IN (SELECT id FROM public.scheduled_sessions WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'coach'))))
    );

-- METRIC ENTRIES (Segurança Máxima)
-- Atleta isolado, Coach lê/escreve no workspace
CREATE POLICY "Athletes view own metrics, Coaches view workspace metrics" ON public.metric_entries
    FOR SELECT USING (
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE user_id = auth.uid()) OR
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'coach')))
    );

CREATE POLICY "Athletes insert own metrics, Coaches insert workspace metrics" ON public.metric_entries
    FOR INSERT WITH CHECK (
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE user_id = auth.uid()) OR
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'coach')))
    );

-- INJURIES
CREATE POLICY "Athletes view own injuries, Coaches view workspace injuries" ON public.injuries
    FOR SELECT USING (
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE user_id = auth.uid()) OR
        athlete_id IN (SELECT id FROM public.athletes_profiles WHERE workspace_id IN (SELECT workspace_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'coach')))
    );

-- Notas adicionais sobre RLS de Escrita (INSERT, UPDATE, DELETE):
-- Por omissão, para os utilizadores finais, seria estendido criar politicas semelhantes de INSERT/UPDATE
-- para que coaches manipulem planos e atletas consigam submeter métricas e logs.
-- O exemplo foca as barreiras base requeridas para isolamento.

-- =================================================================================
-- FIM DO SCRIPT
-- =================================================================================
