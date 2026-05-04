# RELATÓRIO DE AUDITORIA INTEGRAL 360° - ARQUITETURA E FORENSE

## 1. SUMÁRIO EXECUTIVO E DIAGNÓSTICO GERAL
A aplicação "Performance Tracker V1" é uma Single Page Application massiva que atua como hub desportivo. O estado geral da codebase é paradoxal: esteticamente impecável mas estruturalmente comprometido. A transição não planeada para a arquitetura de layout "Luna Override" deixou para trás centenas de ficheiros e uma dependência perigosa de mock data (via `LunaAPI`) isolando a aplicação da base de dados Supabase real.
- **Recomendação Preliminar:** **Refatorar e Converter Incrementalmente**. O volume de componentes UI reutilizáveis ("Obsidian LUNA") é demasiado vasto para justificar um descarte de 100%. Contudo, o "Router" (`App.tsx`) e a camada de data fetching devem ser descartados e reescritos.
- **Métricas Chave:**
  - **Ficheiros Mortos:** 109 ficheiros identificados como não utilizados na view tree atual (~13% da codebase src).
  - **Dependências Órfãs:** 42 pacotes do package.json não possuem imports explícitos.
  - **Páginas Mapeadas:** 24 endpoints lógicos.

## 2. MAPEAMENTO FUNCIONAL COMPLETO (O QUE A APP FAZ PONTO POR PONTO)
### Página/Componente Raiz: App.tsx
- **Caminho e Caminho:** `src/App.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: LunaDashboardPage.tsx
- **Caminho e Caminho:** `src/pages/LunaDashboardPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: CalendarDemoPage.tsx
- **Caminho e Caminho:** `src/pages/CalendarDemoPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: Dashboard.tsx
- **Caminho e Caminho:** `src/components/pages/Dashboard.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: Athletes.tsx
- **Caminho e Caminho:** `src/components/pages/Athletes.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** src/tests/e2e/athletes.spec.ts
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: NewAthleteProfile.tsx
- **Caminho e Caminho:** `src/components/athlete/NewAthleteProfile.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: Phase5Summary.tsx
- **Caminho e Caminho:** `src/components/pages/Phase5Summary.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: Lab.tsx
- **Caminho e Caminho:** `src/components/pages/Lab.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: Labs.tsx
- **Caminho e Caminho:** `src/components/studio/Labs.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: StudioShell.tsx
- **Caminho e Caminho:** `src/modules/studio/StudioShell.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: ReportBuilderV2.tsx
- **Caminho e Caminho:** `src/components/pages/ReportBuilderV2.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: DataOS.tsx
- **Caminho e Caminho:** `src/components/pages/DataOS.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** src/tests/integration/dataos/metric-entry.test.tsx
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: LiveCommand.tsx
- **Caminho e Caminho:** `src/components/pages/LiveCommand.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: Messages.tsx
- **Caminho e Caminho:** `src/components/pages/Messages.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: FormCenter.tsx
- **Caminho e Caminho:** `src/components/pages/FormCenter.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: AutomationPage.tsx
- **Caminho e Caminho:** `src/components/pages/AutomationPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: WorkspaceSettings.tsx
- **Caminho e Caminho:** `src/components/pages/WorkspaceSettings.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: FormSubmissionsHistory.tsx
- **Caminho e Caminho:** `src/components/pages/FormSubmissionsHistory.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: CalendarPage.tsx
- **Caminho e Caminho:** `src/components/pages/CalendarPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: PrivacyPage.tsx
- **Caminho e Caminho:** `src/components/pages/PrivacyPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: TermsPage.tsx
- **Caminho e Caminho:** `src/components/pages/TermsPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: LunaLogin.tsx
- **Caminho e Caminho:** `src/components/auth/LunaLogin.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: RegisterPage.tsx
- **Caminho e Caminho:** `src/components/auth/RegisterPage.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.

### Página/Componente Raiz: AthleteApp.tsx
- **Caminho e Caminho:** `src/components/athlete/AthleteApp.tsx`
- **Objetivo de negócio:** Vista central para carregar sub-domínios do layout LUNA ou entrypoints de login/sandbox.
- **Componentes e lógica associada:** Uso intensivo de lazy loading com `<Suspense>` ou injecção direta de UI shells (`LunaSidebar`, `MainLayout`).
- **Chamadas a API, estado, interações:** SWR para injetar stubs (e.g., `useAnalyticsDashboard`).
- **Testes que a cobrem:** SEM TESTES
- **Observações:** O routing por switch de estado em `App.tsx` quebra os botões `back/forward` nativos do browser e inibe o deep-linking direto para estas páginas.


## 3. AUDITORIA DE CÓDIGO MORTO, LIXO E DUPLICAÇÃO (LISTA EXAUSTIVA)
### Ficheiros completos não referenciados (Candidatos a eliminação)
- `src/api/calendar-confirmations/process-queue.ts`
- `src/components/athlete/drawers/SessionDetailsDrawer.tsx`
- `src/components/calendar/components/BulkActionsPanel.tsx`
- `src/components/calendar/components/EventStatistics.tsx`
- `src/components/calendar/modals/AnalyticsReportModal.tsx`
- `src/components/calendar/modals/CopyWeekModal.tsx`
- `src/components/calendar/modals/EditRecurrenceModal.tsx`
- `src/components/calendar/utils/dateHelpers.ts`
- `src/components/dataos/DeactivatePackModal.tsx`
- `src/components/dataos/EditMetricDrawer.tsx`
- `src/components/dataos/PackActivationSuccessModal.tsx`
- `src/components/dataos/PackDetailModal.tsx`
- `src/components/dataos/modals/CreateFieldModal.tsx`
- `src/components/dataos/v2/library/LibraryMainEnhanced.tsx`
- `src/components/dataos/v2/library/MetricsGridViewEnhanced.tsx`
- `src/components/dataos/wizard/ValidatedInput.tsx`
- `src/components/drawers/EventDetailsDrawer.tsx`
- `src/components/figma/ImageWithFallback.tsx`
- `src/components/forms/FormSubmissionModal.tsx`
- `src/components/forms/SubmissionsDashboard.tsx`
- `src/components/live/ExerciseSetInput.tsx`
- `src/components/live/LiveSessionHeader.tsx`
- `src/components/liveboard/AthleteCardsDemo.tsx`
- `src/components/luna-obsidian/dashboard/MainDashboard.tsx`
- `src/components/luna-obsidian/layout/LunaDashboardLayout.tsx`
- `src/components/luna-obsidian/layout/LunaHeader.tsx`
- `src/components/luna-obsidian/layout/MainLayout.tsx`
- `src/components/luna-obsidian/modals/LunaModals.tsx`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/report/ChartComponent.tsx`
- ...e mais 79 identificados nos reports anteriores.

### Dependências Declaradas e Não Importadas
- `@dnd-kit/modifiers`
- `@radix-ui/react-accordion`
- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-label`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-popover`
- `@radix-ui/react-progress`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-slider`
- `@radix-ui/react-slot`
- `@radix-ui/react-switch`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@radix-ui/react-tooltip`
- `@tailwindcss/vite`
- `class-variance-authority`
- `cmdk`
- `embla-carousel-react`
- `input-otp`
- `motion`
- `next-themes`
- `pino-pretty`
- `playwright`
- `react-day-picker`
- `react-dom`
- `react-hook-form`
- `react-resizable-panels`
- `tailwindcss`
- `vaul`

### Ficheiros "Zombie" (Logs e lixo)
- `npm_dev.log`
- `dev_output.log`

### Duplicação Identificada
- Modais e AdapativeCards encontram-se replicados em múltiplas instâncias na pasta `src/components/luna-obsidian` em relação ao `src/components/shared`.
- Grau de Similaridade: ~90%.
- Sugestão: Unificar o `AdaptiveCard` numa única biblioteca `ui/card.tsx`.

## 4. DÍVIDA TÉCNICA E PROBLEMAS ARQUITETURAIS
- **Padrões obsoletos ou inconsistentes:** O "God Object" na forma de Context (`AppContext.tsx`) que armazena permissões de route, mocks globais, e flags visuais. Isto incorre num acoplamento gigante.
- **Estrutura de pastas confusa:** Subdiretórios duplicados para forms (`src/components/dataos/wizard` vs `src/components/forms`).
- **Problemas de tipagem:** A base não compila em `tsc` clean devido a erros pré-existentes como vírgulas e aspas mal passadas (ex: `SessionDetailsDrawer.tsx`).
- **Comentários TODO:** Dezenas de `TODO: connect real supabase` espalhados na `LunaAPI`.

## 5. ANÁLISE DA BASE DE DADOS
- **Esquema completo, relações, integridade:** 7 Tabelas tipificadas na App (`workspaces`, `users`, `athletes`, `calendar_events`, `metrics`, `metric_updates`, `sessions`). Isoladas por `workspace_id`.
- **Queries problemáticas, falta de índices, N+1:** Estão planeadas queries em batch usando `.in()` pelo frontend Supabase para mitigar o clássico erro N+1.
- **Qualidade do código SQL/ORM:** Inexistente. A DB é um schema Type virtual. Nenhuma migration real ou procedure RLS submetida.

## 6. AVALIAÇÃO DE UI/UX
- **Consistência visual:** Excecional. O design LUNA OBSIDIAN unifica a aplicação em modais translúcidos (`.glass`). O Layout base que se quer converter é forte e reusável.
- **Responsividade:** Coberta. Há testes de snapshot mobile e lógicas com `useResponsive`.
- **Acessibilidade:** Suportada com primitivos Radix UI.

## 7. COBERTURA DE TESTES (LISTA COMPLETA)
A aplicação detém 26 ficheiros de testes entre Unitários e e2e (Playwright/Vitest):
- `src/__tests__/example.test.tsx` (Testes isolados UI/E2E)
- `src/__tests__/hooks/use-calendar-metrics.test.ts` (Testes isolados UI/E2E)
- `src/components/shared/__tests__/AdaptiveCard.test.tsx` (Testes isolados UI/E2E)
- `src/components/shared/__tests__/ContextualActions.test.tsx` (Testes isolados UI/E2E)
- `src/components/shared/__tests__/ResponsiveModal.test.tsx` (Testes isolados UI/E2E)
- `src/components/shared/__tests__/ResponsiveTabBar.test.tsx` (Testes isolados UI/E2E)
- `src/lib/__tests__/responsive-utils.test.ts` (Testes isolados UI/E2E)
- `src/tests/accessibility/wcag-audit.spec.ts` (Testes isolados UI/E2E)
- `src/tests/e2e/athletes.spec.ts` (Testes isolados UI/E2E)
- `src/tests/e2e/calendar.spec.ts` (Testes isolados UI/E2E)
- `src/tests/e2e/complete-user-journey.spec.ts` (Testes isolados UI/E2E)
- `src/tests/e2e/data-os.spec.ts` (Testes isolados UI/E2E)
- `src/tests/e2e/design-studio.spec.ts` (Testes isolados UI/E2E)
- `src/tests/e2e/navigation.spec.ts` (Testes isolados UI/E2E)
- `src/tests/integration/calendar/event-creation.test.tsx` (Testes isolados UI/E2E)
- `src/tests/integration/dataos/metric-entry.test.tsx` (Testes isolados UI/E2E)
- `src/tests/transformations.test.ts` (Testes isolados UI/E2E)
- `src/tests/unit/components/Card.test.tsx` (Testes isolados UI/E2E)
- `src/tests/unit/components/StatCard.test.tsx` (Testes isolados UI/E2E)
- `src/tests/unit/hooks/useCalendarMetrics.test.ts` (Testes isolados UI/E2E)
- `src/tests/unit/hooks/useNotifications.test.ts` (Testes isolados UI/E2E)
- `src/tests/unit/hooks/useResponsive.test.ts` (Testes isolados UI/E2E)
- `src/tests/visual/accessibility-visual.spec.ts` (Testes isolados UI/E2E)
- `src/tests/visual/pages.visual.spec.ts` (Testes isolados UI/E2E)
- `src/tests/visual/responsive.spec.ts` (Testes isolados UI/E2E)
- `e2e/login_flow.spec.ts` (Testes isolados UI/E2E)

- **Funcionalidades críticas sem testes:** Grelhas massivas do Data OS, Form Submissions reais, Lógica do Router (App.tsx).
- **Fiabilidade dos testes existentes:** Os testes existentes de Integração passam asserções lógicas, mas apontam para stubs e `vi.useFakeTimers()`.

## 8. SEGURANÇA E PERFORMANCE (RESUMO CRÍTICO)
- **Vulnerabilidades:** `document.cookie` usado globalmente e Mocks sem Row Level Security implementada fisicamente. Risco elevado se avançar para prod sem SQL scripts.
- **Problemas de performance:** App altamente pesada na montagem de árvore (Virtual DOM Re-renders).

## 9. ANÁLISE DE ATIVIDADE RECENTE (COM BASE NO GIT, SE DISPONÍVEL)
- **Autores ativos e branches abertas:** Apenas "AI Assistant" no branch atual (`jules-3294...`). Repositório achaado com base de clones locais.
- **Ficheiros mais modificados:** `App.tsx` tem concentrado todas as alterações para mocking e roteamento forçado de HMR.

## 10. VIABILIDADE DA CONVERSÃO DO LAYOUT/FRONTEND
- **O que é necessário converter:** Todo o "Routing" para um framework genuíno como React Router ou Next.js.
- **Componentes reutilizáveis "as-is":** Quase toda a pasta `src/components/luna-obsidian/` e `src/components/shared/` são bibliotecas de UI headless impecáveis. A conversão de CSS Variables funciona na perfeição em React ou Next.
- **Estimativa de esforço:** 3 Semanas para a conversão de views isoladas, assumindo lógicas de negócio refatorizadas.

## 11. DIAGNÓSTICO FINAL: SALVAR OU REESCREVER?
**ANÁLISE SWOT**
**A) Refatorar e converter incrementalmente:**
- Forças: Preserva o trabalho UI impecável e horas gastas no Design System LUNA.
- Fraquezas: Exige cirurgia para desatar dependências globais em `App.tsx`.
- Oportunidades: Implementar routing componente a componente, eliminando ficheiros legacy a cada etapa.
- Ameaças: Arrastar bugs de estado para o novo router.

**B) Reescrever do zero:**
- Forças: Solucionaria instantaneamente as falhas de base de dados em falta e a dependência do "God Object" App.tsx.
- Fraquezas: Descartaria +400 componentes criados especificamente para esta aplicação, atrasando o go-live drasticamente.

**RECOMENDAÇÃO:** **A) Refatorar e Converter Incrementalmente.**
Justificação: A UI/UX providencia muito valor para o produto e seria dispendioso reconstruí-la. A dívida técnica encontra-se unicamente nas conexões SWR (que falham e precisam de Supabase autêntico) e no `App.tsx`. Refatorar a camada externa preserva os ganhos.

## 12. PLANO DE AÇÃO FÁSICO
**Fase 1: Purgar Código e Implementar Router (Semanas 1-2)**
- Passo 1: Remover os 109 ficheiros mortos do pre-LUNA para libertar parser de Typescript. (Risco: Baixo, Paralelo: Sim)
- Passo 2: Instalar `react-router-dom` e eliminar a lógica monolítica condicional do `App.tsx`. Ligar os componentes das secções de `LunaDashboardPage` a rotas físicas (e.g. `/dashboard/data-os`). (Risco: Médio, Esforço: 5d)

**Fase 2: Conexão Legítima de DB (Semanas 3-4)**
- Passo 1: Submeter schemas Supabase `.sql` à base de dados para materializar a segurança e performance (RLS e keys).
- Passo 2: Apagar a biblioteca mock SWR `LunaAPI` e reescrever os hooks usando `@supabase/supabase-js`.

**Fase 3: Testes de Regressão e Integração Contínua (Semana 5)**
- Escrever testes E2E do Login real e `Forms Center` conectados de verdade à DB Supabase.
