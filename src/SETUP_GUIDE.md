# 🚀 SETUP GUIDE - PERFORMTRACK

**Status:** ✅ Day 1 Infrastructure Complete  
**Next:** Configure Supabase

---

## ✅ O QUE FOI FEITO (Day 1 - Parte 1)

### Ficheiros Criados:

1. ✅ `/lib/supabase/client.ts` - Supabase client (browser + server)
2. ✅ `/types/supabase.ts` - Database types
3. ✅ `/.env.local.example` - Template de environment variables
4. ✅ `/contexts/AppContext.tsx` - **MIGRADO para Supabase Auth**
5. ✅ `/lib/api-client.ts` - **Agora controlado por env var**

### Mudanças Importantes:

#### AppContext.tsx
- ✅ Suporte para Supabase Auth real
- ✅ Fallback para mock se Supabase não configurado
- ✅ Session management automático
- ✅ Auto-refresh tokens
- ✅ Auth state subscription

#### api-client.ts
- ✅ Mocks agora controlados por `NEXT_PUBLIC_USE_REAL_DATA`
- ✅ Debug logging controlado por `NEXT_PUBLIC_DEBUG`
- ✅ Fácil toggle entre mock e real data

---

## 🎯 PRÓXIMOS PASSOS (HOJE)

### STEP 1: Criar Projeto Supabase (15 min)

1. Ir para https://supabase.com
2. Sign up / Login
3. **Create New Project**
   - Nome: `performtrack`
   - Database Password: **GUARDA ISTO!**
   - Region: Europe (Frankfurt)
   - Pricing: Free tier

4. Esperar ~2 minutos (database provisioning)

---

### STEP 2: Copiar Credentials (5 min)

1. No Supabase Dashboard, ir para **Settings** > **API**

2. Copiar:
   - **Project URL** (ex: `https://abcdefg.supabase.co`)
   - **anon public** key (começa com `eyJ...`)
   - **service_role** key (também começa com `eyJ...` mas é diferente)

---

### STEP 3: Criar .env.local (2 min)

Na raiz do projeto:

```bash
# Copiar template
cp .env.local.example .env.local

# Editar
code .env.local
```

Preencher:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...SEU-ANON-KEY
SUPABASE_SERVICE_KEY=eyJhbGciOi...SEU-SERVICE-KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_USE_REAL_DATA=false  # Manter false por agora
```

---

### STEP 4: Executar Migrations (15 min)

#### Opção A: Via Supabase Dashboard (Mais fácil)

1. No Supabase Dashboard > **SQL Editor**
2. Copiar conteúdo de cada migration:
   - `/supabase/migrations/20250103_design_studio_schema.sql`
   - `/supabase/migrations/20250103_forms_schema.sql`
   - `/supabase/migrations/20250103_sessions_schema.sql`
   - `/supabase/migrations/20260114_calendar_v2_mvp.sql`
   - (etc...)

3. Colar no SQL Editor
4. **Run** cada uma

#### Opção B: Via CLI (Requer setup)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref SEU-PROJECT-REF

# Push migrations
supabase db push
```

---

### STEP 5: Seed Data Inicial (10 min)

No Supabase Dashboard > **SQL Editor**, executar:

```sql
-- ========================================
-- SEED DATA: Initial Setup
-- ========================================

-- 1. Create Workspace
INSERT INTO workspaces (id, name, type, created_at, updated_at, is_active)
VALUES 
  ('workspace-1', 'Academia Premium', 'gym', NOW(), NOW(), true);

-- 2. Create Coach User (NOTA: Usar ID do auth.users)
-- IMPORTANTE: Criar user primeiro via Supabase Auth!
-- Dashboard > Authentication > Users > Add User
-- Email: coach@demo.com
-- Password: (escolher password)
-- Depois copiar o UUID e usar aqui:

INSERT INTO users (id, email, name, role, workspace_id, avatar_url, created_at, updated_at, is_active)
VALUES 
  ('UUID-DO-COACH', 'coach@demo.com', 'João Silva', 'coach', 'workspace-1', 
   'https://api.dicebear.com/7.x/avataaars/svg?seed=coach1', 
   NOW(), NOW(), true);

-- 3. Create Athlete User
-- Repetir processo acima para atleta@demo.com

INSERT INTO users (id, email, name, role, workspace_id, avatar_url, created_at, updated_at, is_active)
VALUES 
  ('UUID-DO-ATLETA', 'atleta@demo.com', 'Maria Santos', 'athlete', 'workspace-1',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=athlete1',
   NOW(), NOW(), true);

-- 4. Create Athlete Record
INSERT INTO athletes (id, workspace_id, user_id, name, email, status, created_at, updated_at, is_active)
VALUES 
  (gen_random_uuid(), 'workspace-1', 'UUID-DO-ATLETA', 'Maria Santos', 'atleta@demo.com', 
   'active', NOW(), NOW(), true);

-- 5. Create Demo Metrics
INSERT INTO metrics (workspace_id, name, description, unit, metric_type, data_type, category, is_active)
VALUES 
  ('workspace-1', 'Peso Corporal', 'Peso do atleta', 'kg', 'physical', 'number', 'body_composition', true),
  ('workspace-1', 'Altura', 'Altura do atleta', 'cm', 'physical', 'number', 'body_composition', true),
  ('workspace-1', 'RPE', 'Rating of Perceived Exertion', 'points', 'training', 'number', 'load', true);
```

---

### STEP 6: Criar Users via Auth (IMPORTANTE!)

1. Supabase Dashboard > **Authentication** > **Users**
2. **Add User** (fazer 2x):

**Coach:**
- Email: `coach@demo.com`
- Password: `Coach123!` (ou o que quiseres)
- Auto Confirm: ✅ YES

**Atleta:**
- Email: `atleta@demo.com`
- Password: `Atleta123!`
- Auto Confirm: ✅ YES

3. **COPIAR os UUIDs** gerados
4. Usar esses UUIDs no SQL de seed data acima

---

### STEP 7: Testar Conexão (5 min)

```bash
# Restart dev server
npm run dev

# Abrir browser
# http://localhost:3000
```

**Verificar:**
1. ✅ Console não mostra erro "Missing Supabase environment variables"
2. ✅ Console mostra "Auth state changed" quando carregar
3. ✅ Login page aparece

---

### STEP 8: Testar Login (2 min)

1. Ir para login page
2. Tentar login com:
   - Email: `coach@demo.com`
   - Password: (o que definiste)

**Expected:**
- ✅ Login sucede
- ✅ Redirect para dashboard
- ✅ Toast: "Bem-vindo, coach@demo.com!"
- ✅ User data aparece no header

---

## 🐛 TROUBLESHOOTING

### Erro: "Missing Supabase environment variables"

**Causa:** `.env.local` não existe ou está mal configurado

**Fix:**
1. Verificar que `.env.local` existe na raiz
2. Verificar que tem todas as vars
3. Reiniciar dev server (`Ctrl+C` e `npm run dev`)

---

### Erro: "Invalid login credentials"

**Causa:** User não existe ou password errado

**Fix:**
1. Verificar users em Supabase Dashboard > Authentication
2. Criar user se não existir
3. Reset password se necessário

---

### Erro: "Failed to load user profile"

**Causa:** User existe em auth mas não em `users` table

**Fix:**
1. Executar seed SQL novamente
2. Usar UUID correto do auth.users

---

### Console: "⚠️ Supabase not configured - using mock authentication"

**Causa:** Supabase não configurado ou env vars erradas

**Status:** ✅ OK - App funciona em modo mock

**Fix (para usar real):**
1. Configurar .env.local
2. Restart server

---

## 🎯 VALIDATION CHECKLIST

Depois de completar setup:

- [ ] Supabase project criado
- [ ] .env.local configurado
- [ ] Migrations executadas
- [ ] Users criados (auth + table)
- [ ] Seed data inserido
- [ ] Dev server roda sem erros
- [ ] Login funciona
- [ ] User profile carrega
- [ ] Workspace aparece no header

---

## 📊 STATUS DASHBOARD

```
┌────────────────────────────────────────┐
│ PERFORMTRACK - MIGRATION STATUS       │
├────────────────────────────────────────┤
│ ✅ Infrastructure Setup (Day 1)       │
│ ✅ Supabase Client                    │
│ ✅ Types                              │
│ ✅ AppContext Migration               │
│ ✅ API Client Prepared                │
│ ⏸️  Supabase Configuration (YOU)      │
│ ⏸️  Data Hooks (Day 3-5)              │
│ ⏸️  Component Migration (Day 6-14)    │
└────────────────────────────────────────┘
```

---

## 📞 NEXT STEPS

### HOJE (continuar):
1. ✅ Complete Supabase setup (acima)
2. ✅ Test login
3. ✅ Verify data loads

### AMANHÃ (Day 2):
1. 🎯 Create data hooks (useAthletes, useCalendar, useMetrics)
2. 🎯 Migrate first component (Athletes list)
3. 🎯 Test CRUD operations

---

## 💡 TIPS

### Desenvolvimento:

```bash
# Manter mocks enquanto desenvolve
NEXT_PUBLIC_USE_REAL_DATA=false

# Ativar debug logging
NEXT_PUBLIC_DEBUG=true

# Ver logs Supabase
# Console browser > Network tab > Filter: supabase
```

### Testing:

```bash
# Test mock mode (sem Supabase)
# Remover/renomear .env.local temporariamente
mv .env.local .env.local.bak
npm run dev
# App funciona em mock mode

# Restore
mv .env.local.bak .env.local
```

### Database:

```bash
# Reset database (CUIDADO!)
# Supabase Dashboard > SQL Editor:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
# Depois re-executar migrations
```

---

## 🎓 LEARNING RESOURCES

### Supabase Docs:
- Auth: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database
- RLS: https://supabase.com/docs/guides/auth/row-level-security

### Videos:
- Supabase Crash Course: https://www.youtube.com/watch?v=7uKQBl9uZ00
- Next.js + Supabase: https://www.youtube.com/watch?v=w3h1JLLGNHc

---

**TEMPO ESTIMADO TOTAL:** ~1 hora  
**DIFICULDADE:** ⭐⭐ (Fácil-Médio)  
**PRÓXIMO MILESTONE:** Login funcional com dados reais

**🚀 VAMOS LÁ! Qualquer problema, consulta este guia.**
