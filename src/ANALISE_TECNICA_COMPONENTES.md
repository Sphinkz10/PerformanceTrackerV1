# 🔬 ANÁLISE TÉCNICA DETALHADA - COMPONENTES PERFORMTRACK

**Data:** 02 Fevereiro 2026  
**Objetivo:** Mapear EXATAMENTE o que precisa ser mudado  
**Status:** Reference Document para Migration

---

## 📁 ESTRUTURA DE FICHEIROS

```
/
├── contexts/
│   └── AppContext.tsx ⚠️ CRÍTICO - Mudar para Supabase Auth
├── lib/
│   ├── api-client.ts ⚠️ CRÍTICO - USE_MOCKS = true
│   ├── mockData.ts ⚠️ Remover após migration
│   ├── mockDataSprint0.ts ⚠️ Remover após migration
│   └── supabase.ts ✅ CRIAR NOVO
├── hooks/
│   ├── use-api.ts ⏸️ Parcialmente funcional
│   ├── useAthletes.ts ❌ NÃO EXISTE - CRIAR
│   ├── useCalendar.ts ❌ NÃO EXISTE - CRIAR
│   ├── useMetrics.ts ❌ NÃO EXISTE - CRIAR
│   ├── useForms.ts ❌ NÃO EXISTE - CRIAR
│   └── useSessions.ts ❌ NÃO EXISTE - CRIAR
├── components/
│   ├── athlete/ ⚠️ TODO - 90% mock
│   ├── pages/ ⚠️ TODO - 70% mock
│   └── dataos/ ⚠️ TODO - 100% mock
└── app/api/ ⚠️ APIs existem mas não são usadas
```

---

## 🎯 COMPONENTES POR PRIORIDADE

### 🔴 PRIORIDADE CRÍTICA (Semana 1)

#### 1. `/contexts/AppContext.tsx`

**Status Atual:** 100% Mock  
**LOC:** 219 linhas  
**Complexidade:** ⭐⭐⭐⭐ (Alta)

**O que faz:**
- Login mock com passwords hardcoded
- Guarda user/workspace em localStorage
- Fornece context para toda a app

**O que precisa mudar:**
```typescript
// ❌ REMOVER:
const mockUsers = {
  'coach@demo.com': { password: 'coach123', ... }
};

// ✅ ADICIONAR:
import { supabase } from '@/lib/supabase';

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Get user profile from database
  const { data: profile } = await supabase
    .from('users')
    .select('*, workspace:workspaces(*)')
    .eq('id', data.user.id)
    .single();
    
  setUser(profile);
  setWorkspace(profile.workspace);
};
```

**Estimativa:** 4-6 horas  
**Dependências:** Supabase configurado  
**Risco:** Alto (quebra tudo se falhar)

---

#### 2. `/lib/api-client.ts`

**Status Atual:** Mock Fallback Ativo  
**LOC:** 180 linhas  
**Complexidade:** ⭐⭐⭐ (Média-Alta)

**O que faz:**
- Wrapper para fetch
- Tenta API real primeiro
- Fallback para mock se falhar

**O que precisa mudar:**
```typescript
// ❌ LINHA 27:
const USE_MOCKS = true;

// ✅ MUDAR PARA:
const USE_MOCKS = false;

// OU MELHOR: Remover sistema de mocks completamente
// e fazer error handling real
```

**Estimativa:** 2 horas (apenas toggle)  
**Estimativa (refactor completo):** 8 horas  
**Dependências:** APIs funcionais  
**Risco:** Médio

---

#### 3. `/components/pages/DataOS.tsx`

**Status Atual:** 100% Mock  
**LOC:** 500+ linhas  
**Complexidade:** ⭐⭐⭐⭐⭐ (Muito Alta)

**Mock Data:**
```typescript
// Linha 28-30
import { mockMetrics } from '@/lib/mockDataSprint0';
const mockAthletes = [
  { id: 'athlete-1', name: 'João Silva', ... },
  ...
];
```

**O que precisa mudar:**

```typescript
// ❌ REMOVER:
const mockAthletes = [...];
setMetrics(mockMetrics);

// ✅ ADICIONAR:
import { useAthletes } from '@/hooks/useAthletes';
import { useMetrics } from '@/hooks/useMetrics';

function DataOS() {
  const { workspaceId } = useWorkspace();
  const { athletes, isLoading: athletesLoading } = useAthletes(workspaceId);
  const { metrics, isLoading: metricsLoading } = useMetrics(workspaceId);
  
  if (athletesLoading || metricsLoading) return <LoadingState />;
  
  // Use real data
}
```

**Componentes Afetados:**
- QuickEntryModal (linha 453)
- BulkEntryModal (linha 463)
- MetricHistoryDrawer (linha 442)

**Estimativa:** 12-16 horas  
**Dependências:** useAthletes, useMetrics hooks  
**Risco:** Alto

---

#### 4. `/components/athlete/calendar/AthleteCalendar.tsx`

**Status Atual:** 100% Mock  
**LOC:** 400+ linhas  
**Complexidade:** ⭐⭐⭐⭐ (Alta)

**Mock Data:**
```typescript
// Linhas 39-60
const events = [
  { id: '1', date: new Date(2026, 1, 3), type: 'workout', ... },
  ...
];

const coachUnavailableDates = [
  new Date(2026, 1, 8),
  ...
];
```

**O que precisa mudar:**

```typescript
// ✅ ADICIONAR:
import { useCalendarEvents } from '@/hooks/useCalendar';
import { useCoachAvailability } from '@/hooks/useCoachAvailability';

function AthleteCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfMonth = startOfMonth(currentDate);
  const endOfMonth = endOfMonth(currentDate);
  
  const { events, isLoading } = useCalendarEvents(
    workspaceId,
    startOfMonth,
    endOfMonth
  );
  
  const { unavailableDates } = useCoachAvailability(
    coachId,
    startOfMonth,
    endOfMonth
  );
  
  // Rest of component uses real data
}
```

**Modais Afetados:**
- RequestBookingModal (linha 452)
- AddEventModal (linha 457)

**Estimativa:** 10-12 horas  
**Dependências:** useCalendarEvents hook  
**Risco:** Médio-Alto

---

#### 5. `/components/athlete/dashboard/AthleteDashboard.tsx`

**Status Atual:** 95% Mock  
**LOC:** 400+ linhas  
**Complexidade:** ⭐⭐⭐⭐ (Alta)

**Mock Data:**
```typescript
// Stats hardcoded (linhas 30-40)
const stats = [
  { label: 'Treinos Completos', value: '12', change: '+3', ... },
  ...
];

// Próximos treinos mock (linhas 50-70)
const upcomingWorkouts = [
  { id: '1', title: 'Upper Body A', date: 'Hoje', ... },
  ...
];
```

**O que precisa mudar:**

```typescript
// ✅ ADICIONAR:
import { useAthleteStats } from '@/hooks/useAthleteStats';
import { useUpcomingWorkouts } from '@/hooks/useCalendar';

function AthleteDashboard() {
  const { user } = useApp();
  const athleteId = user?.id;
  
  const { stats, isLoading: statsLoading } = useAthleteStats(athleteId);
  const { workouts, isLoading: workoutsLoading } = useUpcomingWorkouts(athleteId);
  
  // Quick actions já têm modais, só precisam de API calls
  const handleReportPain = async (data) => {
    await supabase.from('pain_reports').insert({ ...data, athlete_id: athleteId });
    toast.success('Dor reportada!');
  };
}
```

**Estimativa:** 8-10 horas  
**Dependências:** useAthleteStats, useUpcomingWorkouts  
**Risco:** Médio

---

### 🟡 PRIORIDADE ALTA (Semana 2)

#### 6. `/components/athlete/NewAthleteProfile.tsx`

**Status Atual:** 60% Real, 40% Mock  
**LOC:** 400+ linhas  
**Complexidade:** ⭐⭐⭐⭐ (Alta)

**Mock Data:**
```typescript
// Comentário linha 5: "NO MORE MOCK FALLBACKS!"
// MAS ainda há fallbacks em vários lugares
```

**O que faz bem:**
- Já usa API para buscar athlete data
- Tem error handling
- Loading states

**O que precisa melhorar:**
- Remover fallbacks mock
- Implementar mutations (update athlete)
- Cache invalidation

**Estimativa:** 6-8 horas  
**Dependências:** useAthlete hook melhorado  
**Risco:** Baixo-Médio

---

#### 7. `/components/pages/FormCenter.tsx`

**Status Atual:** 90% Mock  
**LOC:** 1000+ linhas  
**Complexidade:** ⭐⭐⭐⭐⭐ (Muito Alta)

**Mock Data:**
```typescript
// Linha 51
import { mockMetrics } from '@/lib/mockDataSprint0';

// Linha 882
const linkedMetric = mockMetrics.find(m => m.id === field.linkedMetricId);

// Linha 1004
existingMetrics={mockMetrics}

// Linha 1026
const mockForm = { ... };
```

**O que precisa mudar:**

```typescript
// ✅ ADICIONAR:
import { useForms } from '@/hooks/useForms';
import { useMetrics } from '@/hooks/useMetrics';
import { useCreateForm } from '@/hooks/useForms';

function FormCenter() {
  const { workspaceId } = useWorkspace();
  const { forms, isLoading } = useForms(workspaceId);
  const { metrics } = useMetrics(workspaceId);
  const { execute: createForm } = useCreateForm();
  
  const handleSaveForm = async () => {
    const formData = {
      workspace_id: workspaceId,
      name: formName,
      description,
      fields: formFields,
      settings: formSettings
    };
    
    await createForm(formData);
    toast.success('Formulário criado!');
  };
}
```

**Componentes Afetados:**
- LinkedMetricsPreview
- SmartMetricSuggestion
- SelectMetricModal

**Estimativa:** 16-20 horas  
**Dependências:** useForms, useMetrics, useSubmissions  
**Risco:** Alto (complexo)

---

#### 8. `/components/pages/LiveCommand.tsx`

**Status Atual:** 100% Mock  
**LOC:** 50 linhas (mas usa LiveSession component)  
**Complexidade:** ⭐⭐⭐ (Média)

**Mock Data:**
```typescript
// Linhas 8-30
const DEMO_WORKOUT: LiveWorkout = {
  id: 'workout_demo_1',
  title: 'Demo Upper Body',
  exercises: [...],
  ...
};
```

**O que precisa mudar:**

```typescript
// ✅ SUBSTITUIR por:
import { useWorkouts } from '@/hooks/useWorkouts';
import { useStartLiveSession } from '@/hooks/useLiveSession';

function LiveCommand() {
  const { workouts } = useWorkouts(workspaceId);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { execute: startSession } = useStartLiveSession();
  
  const handleStart = async () => {
    const session = await startSession({
      workout_id: selectedWorkout.id,
      athlete_ids: selectedAthletes.map(a => a.id),
      started_at: new Date().toISOString()
    });
    
    // Redirect to live session
    router.push(`/live-session/${session.id}`);
  };
}
```

**Estimativa:** 8-10 horas  
**Dependências:** useWorkouts, useStartLiveSession  
**Risco:** Médio

---

#### 9. `/components/pages/Messages.tsx`

**Status Atual:** 100% Mock  
**LOC:** 200+ linhas  
**Complexidade:** ⭐⭐⭐ (Média)

**Mock Data:**
```typescript
// Mock conversations array (linha ~50)
// Mock messages array (linha ~80)
// Mock reply after delay (linha 86-90)
```

**O que precisa mudar:**

```typescript
// ✅ ADICIONAR:
import { useMessages } from '@/hooks/useMessages';
import { useCreateMessage } from '@/hooks/useMessages';

function Messages() {
  const { conversations, isLoading } = useMessages(userId);
  const { execute: sendMessage } = useCreateMessage();
  
  const handleSend = async (text: string) => {
    await sendMessage({
      conversation_id: activeConversation.id,
      sender_id: userId,
      content: text,
      sent_at: new Date().toISOString()
    });
  };
  
  // Supabase Realtime para novos mensagens
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, [activeConversation]);
}
```

**Estimativa:** 10-12 horas  
**Dependências:** useMessages, Supabase Realtime  
**Risco:** Médio (Realtime pode ser tricky)

---

#### 10. `/components/pages/ReportBuilderV2.tsx`

**Status Atual:** 100% Mock  
**LOC:** 800+ linhas  
**Complexidade:** ⭐⭐⭐⭐⭐ (Muito Alta)

**Mock Data:**
```typescript
// Linhas 224+
const generateProgressData = () => { ... }
const generateAttendanceData = () => { ... }
const generatePerformanceData = () => { ... }
// + mais 10 generators
```

**O que precisa mudar:**

```typescript
// ✅ SUBSTITUIR generators por queries reais:
import { useReportData } from '@/hooks/useReports';

function ReportBuilderV2() {
  const { data, isLoading } = useReportData({
    type: selectedReportType,
    athleteIds: selectedAthletes,
    startDate,
    endDate,
    metrics: selectedMetrics
  });
  
  // data já vem formatado do backend
  // Apenas render charts
}
```

**Estimativa:** 20-24 horas (complexo!)  
**Dependências:** useReports com queries complexas  
**Risco:** Muito Alto

---

### 🟢 PRIORIDADE MÉDIA (Semana 2-3)

#### 11-20. Athlete Portal Tabs

Todos em `/components/athlete/tabs/`:

| Tab | LOC | Mock Data | Estimativa |
|-----|-----|-----------|------------|
| `AgendaTab.tsx` | 150 | Upcoming events | 4-6h |
| `SessionsTab.tsx` | 200 | Sessions history | 6-8h |
| `HealthTab.tsx` | 300 | Injuries | 8-10h |
| `MetricsHealthTab.tsx` | 600 | Physical data, forms | 10-12h |
| `HistoryTab.tsx` | 200 | Audit logs | 6-8h |
| `AuditTab.tsx` | 100 | Audit events | 4-6h |
| `CockpitTab.tsx` | 200 | KPI summary | 6-8h |
| `RecoveryTab.tsx` | 150 | Recovery data | 4-6h |
| `TrainingsTab.tsx` | 200 | Training plans | 6-8h |
| `ReportsTab.tsx` | 150 | Reports list | 4-6h |

**Total Estimado:** 60-80 horas  
**Risco:** Médio (todos similares)

---

#### 21-25. Athlete Widgets

Todos em `/components/athlete/widgets/`:

| Widget | LOC | Mock Data | Estimativa |
|--------|-----|-----------|------------|
| `LineChartWidget.tsx` | 100 | Time series | 4-6h |
| `BarChartWidget.tsx` | 100 | Category data | 4-6h |
| `KPICardWidget.tsx` | 80 | Single metric | 2-4h |
| `RecoveryStatusWidget.tsx` | 120 | Recovery score | 4-6h |
| `LoadReadinessWidget.tsx` | 120 | Load/readiness | 4-6h |

**Total Estimado:** 20-30 horas  
**Risco:** Baixo-Médio

---

#### 26-30. Athlete Modais

Todos em `/components/athlete/modals/`:

| Modal | LOC | Mock Data | Estimativa |
|-------|-----|-----------|------------|
| `CancelWorkoutModal.tsx` | 80 | Workouts list | 2-3h |
| `RequestChangeModal.tsx` | 100 | Workouts list | 3-4h |
| `ReportPainModal.tsx` | 80 | Form only | 2-3h |
| `MarkUnavailableModal.tsx` | 80 | Calendar data | 2-3h |
| `WorkoutDetailsModal.tsx` | 150 | Exercises | 4-6h |

**Total Estimado:** 15-20 horas  
**Risco:** Baixo

---

## 📊 SUMMARY ESTATÍSTICO

### Por Complexidade:

| Complexidade | Componentes | Horas | % Total |
|--------------|-------------|-------|---------|
| ⭐⭐⭐⭐⭐ (Muito Alta) | 3 | 50-60h | 25% |
| ⭐⭐⭐⭐ (Alta) | 8 | 80-100h | 42% |
| ⭐⭐⭐ (Média) | 12 | 50-60h | 25% |
| ⭐⭐ (Baixa) | 7 | 15-20h | 8% |

**TOTAL:** 195-240 horas

### Por Prioridade:

| Prioridade | Componentes | Horas | Semana |
|------------|-------------|-------|--------|
| 🔴 Crítica | 5 | 50-60h | 1 |
| 🟡 Alta | 5 | 70-85h | 2 |
| 🟢 Média | 20 | 75-95h | 2-3 |

---

## 🔗 DEPENDÊNCIAS CRÍTICAS

### 1. CRIAR: `/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper para server-side
export const createServerClient = () => {
  // Use service key para admin operations
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
};
```

### 2. CRIAR: `/hooks/useSupabase.ts`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';

export function useSupabase() {
  const { user } = useApp();
  
  // Set auth token
  useEffect(() => {
    if (user?.token) {
      supabase.auth.setSession({
        access_token: user.token,
        refresh_token: user.refreshToken
      });
    }
  }, [user]);
  
  return supabase;
}
```

### 3. CRIAR: Todos os hooks de dados

Prioridade de criação:

1. `useAthletes.ts` (Dia 3)
2. `useCalendar.ts` (Dia 4)
3. `useMetrics.ts` (Dia 5)
4. `useForms.ts` (Dia 6)
5. `useSessions.ts` (Dia 6)
6. `useMessages.ts` (Dia 8)
7. `useReports.ts` (Dia 9)
8. `useWorkouts.ts` (Dia 12)
9. `useAutomation.ts` (Dia 13)

---

## 🧪 TESTING STRATEGY

### Por Componente:

**Críticos (100% coverage):**
- AppContext.tsx
- DataOS.tsx
- AthleteCalendar.tsx
- AthleteDashboard.tsx
- FormCenter.tsx

**Altos (80% coverage):**
- NewAthleteProfile.tsx
- LiveCommand.tsx
- Messages.tsx
- ReportBuilderV2.tsx

**Médios (60% coverage):**
- All tabs
- All widgets
- All modals

### Tipos de Testes:

**Unit Tests:**
- Hooks individuais
- Utility functions
- Transformations

**Integration Tests:**
- Component + Hook
- API calls
- Data flow

**E2E Tests:**
- User journeys completos
- Critical paths
- Error scenarios

---

## 💡 MIGRATION TIPS

### 1. Start Small
```typescript
// ❌ NÃO fazer:
// Mudar tudo de uma vez

// ✅ FAZER:
// 1 componente de cada vez
// Test thoroughly
// Commit
// Next component
```

### 2. Keep Mock Fallback Temporariamente
```typescript
// Durante migration, manter fallback:
const { athletes, error } = useAthletes(workspaceId);

// Fallback temporário
const displayAthletes = error ? mockAthletes : athletes;

// Remover fallback após confirmar que funciona
```

### 3. Use Feature Flags
```typescript
const USE_REAL_DATA = process.env.NEXT_PUBLIC_USE_REAL_DATA === 'true';

if (USE_REAL_DATA) {
  // Use real data
} else {
  // Use mock data
}

// Permite testar gradualmente
```

### 4. Log Everything During Migration
```typescript
console.log('[MIGRATION] Loading athletes from API');
const { athletes } = useAthletes(workspaceId);
console.log('[MIGRATION] Got athletes:', athletes.length);

// Remove logs após migration
```

---

## 📋 CHECKLIST POR COMPONENTE

### Template:

```markdown
## [Component Name]

- [ ] Identificar mock data
- [ ] Criar hook necessário
- [ ] Substituir mock por hook
- [ ] Implementar loading state
- [ ] Implementar error handling
- [ ] Add optimistic updates (se aplicável)
- [ ] Remover código mock
- [ ] Test manually
- [ ] Write unit test
- [ ] Write integration test
- [ ] Update documentation
- [ ] Code review
- [ ] Deploy to staging
- [ ] Test in staging
- [ ] ✅ DONE
```

---

## 🎯 SUCCESS CRITERIA

### Por Componente:

- [ ] Zero mock data
- [ ] Loading states funcionando
- [ ] Error handling robusto
- [ ] Performance acceptable (< 2s)
- [ ] Tests passing
- [ ] No console errors
- [ ] Works em staging

### Global:

- [ ] Auth 100% real
- [ ] Todas as features funcionais
- [ ] Data persistence 100%
- [ ] Security hardened
- [ ] Performance optimized
- [ ] Production ready

---

**ÚLTIMA ATUALIZAÇÃO:** 02 Fevereiro 2026  
**VERSÃO:** 1.0  
**OBJETIVO:** Reference para Migration Sprint

🚀 **USE THIS AS YOUR BIBLE DURING MIGRATION!**
