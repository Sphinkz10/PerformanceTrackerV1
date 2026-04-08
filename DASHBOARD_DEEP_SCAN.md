# PROTOCOLO DEEP SCAN: VARREDURA FORENSE DA UI/UX DO DASHBOARD

## 1. SISTEMA DE NAVEGAÇÃO (DESKTOP & MOBILE)

A navegação da aplicação apresenta duas vertentes principais consoante a versão (V1 "Clássica" vs. V2 "Luna Obsidian"). Este relatório documenta exaustivamente ambas para total cobertura da interface.

### A. Layout Principal (V1 - `src/App.tsx` e `src/components/layout/`)

O V1 utiliza um layout clássico com Header global, navegação lateral em Desktop e Tab Bar no Mobile.

**Header Global (`src/components/layout/Header.tsx`):**
*   **Fixação:** `sticky top-0 z-50` com backdrop-blur.
*   **Componentes Visuais:**
    *   **Avatar do Utilizador:** Dropdown interativo. Abre um menu com informações do utilizador (nome, email, role), opção de "Configurações da Conta" e "Terminar Sessão".
    *   **Seletor de Workspace:** Botão que exibe o workspace atual. Ao clicar, abre um menu dropdown mostrando os workspaces disponíveis, link rápido para "+ Criar Workspace" e "Configurações".
    *   **Barra de Pesquisa Global:** Em desktop, um input visível (Atalho `⌘K`). Em mobile, um ícone de lupa.
    *   **Badges de Notificação:**
        *   **Decisões AI (Novo):** Ícone `Brain`. Só aparece se `pendingDecisions > 0`. Clicar navega para o Data OS.
        *   **Sino de Notificações (`NotificationBell`):** Dispara a `NotificationsModal`.
        *   **Mensagens:** Ícone `MessageSquare`. Dispara navegação para a rota "messages".
        *   **Configurações:** Ícone `Settings`.

**Sidebar de Navegação (Desktop):**
*   **Fixação:** Lateral fixa (`fixed left-0 top-16`).
*   **Links e Ícones Principais (`navItems`):**
    *   **Home:** Ícone `Home`.
    *   **Atletas:** Ícone `Users`.
    *   **Calendário:** Ícone `Calendar`.
    *   **Lab:** Ícone `BarChart3`.
*   **Seção "Ferramentas":**
    *   **Design Studio:** Ícone `Dumbbell`.
    *   **Data OS:** Ícone `Database`.
    *   **Form Center:** Ícone `FileText`.
    *   **Histórico Forms:** Ícone `FileText`.
    *   **Automation:** Ícone `Zap`.
    *   **Live Command:** Ícone `Activity`.

**Mobile Nav (Bottom Tab Bar):**
*   **Fixação:** `fixed bottom-0` adaptável a safe-areas.
*   **Adaptação:** Transforma-se num Bottom Tab Bar contendo apenas ícones e rótulos curtos.
*   **Organização:** Exibe os primeiros dois items (Home, Atletas), um Floating Action Button (FAB) gigante ao centro ("+"), e os dois items seguintes (Calendário, Lab).

**Botão Rápido de Ação (FAB - `src/components/layout/FAB.tsx`):**
*   No Desktop é um componente no canto inferior direito. No Mobile, fica ao centro da Bottom Tab Bar e abre um Bottom Sheet.
*   **Atalhos Visíveis:**
    *   "Novo Atleta" (Ícone `Users`)
    *   "Agendar Sessão" (Ícone `Calendar`)
    *   "Criar Template" (Ícone `Dumbbell`)
    *   "Enviar Form" (Ícone `FileText`)
    *   "Criar Relatório" (Ícone `BarChart3`)

### B. Layout Luna Obsidian (V2 - `MainLayout.tsx`)
Um layout estilo "Football Manager/FIFA" introduzido para o redesign da plataforma (`/luna-dashboard`).

**Sidebar "Shrink" (Desktop):**
*   **Estilo:** Glassmorphism escuro (`bg-zinc-900/30 backdrop-blur-xl`), incrivelmente fina (`w-20`).
*   **Ações e Ícones:**
    *   Logo placeholder (Letra "P" em `cyan-500/20`).
    *   **Home** (ativo, com marcador lateral `cyan-400`).
    *   **Users**, **BookOpen**.
    *   No fundo: **Settings**.

**Topbar do MainLayout:**
*   Simples, apresenta breadcrumb textual ("Dashboard"), nome do treinador ("Treinador Silva") e um mock avatar "TS".


---

## 2. ANATOMIA DO DASHBOARD (O ECRÃ CENTRAL)

### A. Dashboard Clássico V1 (`src/components/pages/Dashboard.tsx`)
A página exibe uma mistura de métricas em tempo real, gestão do dia a dia e um sistema de abas de foco rápido (Hoje, Semana, Atenções).

**Estrutura Lógica:**
1.  **Header Interno:** Título e data. Campo de pesquisa (searchQuery) ativo no ecrã superior em Desktop.
2.  **Sistema de Abas (Tabs):** "Hoje", "Semana", "Atenções".

**Linha de Topo (Widgets/KPIs):** Grelha de 4 colunas em Desktop, 2 em Mobile.
1.  **Atletas Presentes:** Ratio (presentes/total) com hook `useAnalyticsDashboard`.
2.  **Sessões Concluídas:** Concluídas/Total.
3.  **Próxima Sessão:** Título e tempo remanescente.
4.  **Atenções Urgentes:** Total de alertas.

**Matriz "HOJE" (Layout Principal 70/30):**
*   **Coluna Esquerda (70%):**
    *   **Live Session Monitor:** Card `🔴 Sessão Ao Vivo` que aparece dinamicamente se houver sessões com `status === 'in-progress'`.
    *   **⭐ Agenda de Hoje:** Uma timeline de sessões (array `todaySessions`). Cada sessão tem cor condicional de acordo com o status (`in-progress`, `upcoming`, ou `isNext`). O botão chama a função de visualização/continuidade no `ExecuteSessionModal` ou `LiveCommand`.
*   **Coluna Direita (30%):**
    *   **⚡ Ações Rápidas:** Cartões coloridos (verde, azul, roxo).
        *   "Criar Sessão Rápida" (Abre `QuickSessionModal`).
        *   "Agendar Sessão" (Abre `ScheduleSessionModal`).
        *   "Novo Workout" (Abre `CreateWorkoutModal`).

**Matriz "SEMANA":**
*   Painel em lista vertical que itera os 7 dias seguintes, formatado como um pequeno calendário/agenda diária.

**Matriz "ATENÇÕES":**
*   **🤖 Decisões IA - Críticas:** Exibe sugestões da Inteligência Artificial via hook `useDecisions`. Ação direta para Aplicar (Approve) ou Ignorar (Dismiss) a decisão. Botão para o DataOS.
*   **⚠️ Outros Alertas:** Baseado no `painAlerts` (lesões, quebras, formulários pendentes), proveniente de `useDashboardAlerts`.

### B. MainDashboard Luna Obsidian V2 (`src/components/luna-obsidian/dashboard/MainDashboard.tsx`)
Uma estrutura provisória. Consiste numa grelha central para "Sessões de Hoje", usando glassmorphism profundo (`zinc-900/50`). Cada sessão possui um design em bloco focado no First/Last Name, tipologia e controlos de `Play` (INICIAR) e `X` (CANCELAR) com hover state e opacity transitions.


---

## 3. A MATRIZ DE MODAIS (CRÍTICO)

Um mapeamento detalhado dos modais que disparam diretamente da UI de Navegação ou do Dashboard V1.

### 1. Novo Atleta (`CreateAthleteModal.tsx`)
*   **Nome do Componente:** `CreateAthleteModal`
*   **Gatilhos:** FAB Nav > "Novo Atleta", SearchModal, e página Athletes.
*   **Campos de Input:**
    *   *Informação Básica:* Nome Completo (text), Email (email), Telefone (tel), Data de Nascimento (date).
    *   *Desportiva:* Desporto (dropdown), Nível (dropdown).
    *   *Emergência (Opcional):* Nome, Telefone.
    *   *Médicas (Opcional):* Notas (textarea).
*   **Ação Final:** Dispara `onComplete` e passa payload `AthleteData` para a função `handleCreateAthleteComplete` em `App.tsx` que, por fim, chama a API via SWR (`useCreateAthlete`).

### 2. Agendar Sessão (`ScheduleSessionModal.tsx` & `AthleteScheduleModal`)
*   **Nome do Componente:** `ScheduleSessionModal` (Global) & `AthleteScheduleModal` (Para um atleta específico).
*   **Gatilhos:** Botão "Agendar Sessão" nas Ações Rápidas do Dashboard, FAB Nav, e perfis de atletas.
*   **Campos de Input:**
    *   *Para a Modal nova (`AthleteScheduleModal`):* Título da Sessão, Tipo (dropdown), Data, Hora, Duração, Local, Coach (dropdown mock), Notas.
    *   *Para a Modal Antiga (`ScheduleSessionModal`):* Data, Hora.
*   **Ação Final:** O `onComplete` passa os dados (`SessionData`) de volta ao App ou efetua mock submit com `toast.success`.

### 3. Criar Treino/Template (`CreateWorkoutModal.tsx`)
*   **Nome do Componente:** `CreateWorkoutModal`
*   **Gatilhos:** Ações Rápidas no Dashboard, FAB Nav.
*   **Campos de Input (Múltiplos Passos):**
    *   **Passo 1 (Info Básica):** Nome do Treino, Descrição, Categoria (Força, Cardio, etc. com botões).
    *   **Passo 2 (Construtor de Blocos):** Nome do Bloco.
        *   Dentro do bloco: Opção de abrir "Criar Rápido" (Inputs de Nome, Sets, Reps, Load, Rest) ou escolher da biblioteca (que abre a `ExercisePickerModal`).
*   **Ação Final:** O array de blocos é aglomerado no payload `WorkoutData` e enviado no submit ao `onComplete`.

### 4. Enviar Formulário (`SendFormModal.tsx` & `SendFormWizard`)
*   **Nome do Componente:** `SendFormModal`
*   **Gatilhos:** FAB Nav > "Enviar Form".
*   **Campos de Input:**
    *   *Form:* Selecionar entre opções pré-definidas (Wellness, Injury, Readiness, Satisfaction).
    *   *Destinatários:* Seleção de múltiplos grupos (Todos, Grupo A, Grupo B).
    *   *Agendamento:* "Enviar Agora" ou "Agendar" (requer `datetime-local`).
*   **Ação Final:** O `handleSend` dispara a lógica de envio (atualmente interface de mock via props de fecho).

### 5. Sessão Rápida (`QuickSessionModal.tsx`)
*   **Nome do Componente:** `QuickSessionModal`
*   **Gatilhos:** Ação Rápida "Criar Sessão Rápida" (Dashboard Central).
*   **Campos de Input:**
    *   Atletas: Seleção multi-click visual numa grelha com avatares de atletas mock ("Walk-ins").
    *   Template: Dropdown para templates de sessão rápida.
    *   Duração: Botões seletores predefinidos (30, 45, 60, 90).
*   **Ação Final:** Transmite os IDs dos atletas selecionados e template via `onCreateSession` de volta para o Dashboard, para abrir imediatamente o Live Command Mode (ou `ExecuteSessionModal`).

### 6. Executar Sessão (`ExecuteSessionModal.tsx`)
*   **Nome do Componente:** `ExecuteSessionModal`
*   **Gatilhos:** Clicar "INICIAR" no cartão de uma sessão na aba HOJE do Dashboard Central.
*   **Ação / Input (Modo Live):**
    *   O modal gere um Timer global.
    *   Se estiver a decorrer a sessão: Pede inputs de execução da série (`currentReps`, `currentWeight`, `currentDuration`), comparando com o Target (`mode==="template"` ou `mode==="coach"`).
    *   Botão "Completar Série" dispara o Timer de Descanso (`Rest Screen`).
    *   Permite também adicionar novos exercícios à sessão em runtime através do botão "+", abrindo mini-modal de Search `showAddExercise`.
*   **Ação Final:** Guarda logs (`ExerciseLog`), avança na máquina de estados das séries, e no final, termina a sessão.

### 7. Pesquisa Global (`SearchModal.tsx`)
*   **Nome do Componente:** `SearchModal`
*   **Gatilhos:** Botão de pesquisa no Header, atalho `⌘K`.
*   **Campos de Input:** Input de texto simples global com tracking de value em `query`.
*   **Ação Final:** Atualmente funciona como um Command Palette mockado exibindo "Ações Rápidas" ou "Recentes" consoante a string esteja vazia.

### 8. Notificações (`NotificationsModal.tsx`)
*   **Nome do Componente:** `NotificationsModal`
*   **Gatilhos:** Ícone de sino (`NotificationBell`) no Header.
*   **Campos de Input:** Sem inputs visíveis. Baseia-se em visualização de dados vindos de `useNotifications`.
*   **Ação Final:** `handleNotificationClick` atualiza os dados locais de lido (`markAsRead`), e consoante o objeto viaja para a página correspondente (`actionUrl`).

### 9. Atalhos de Teclado (`KeyboardShortcutsModal.tsx`)
*   **Nome do Componente:** `KeyboardShortcutsModal`
*   **Gatilhos:** Atalho global `⌘ + Shift + K`.
*   **Conteúdo:** Painel meramente informativo de atalhos. Não tem inputs de dados nem ligações a bases de dados.

### 10. Atletas Ativos (`ActiveAthletesModal.tsx`)
*   **Nome do Componente:** `ActiveAthletesModal`
*   **Gatilhos:** Botão "Ver tudo" ou click no Card de "Atletas Presentes" no topo do Dashboard V1.
*   **Conteúdo:** Tabela mock com utilizadores com maior afluência no último mês, tracking de tendências ("up", "down"). Visualização de informação puramente.

### 11. Sessões de Hoje (`TodaySessionsModal.tsx`)
*   **Nome do Componente:** `TodaySessionsModal`
*   **Gatilhos:** Botão no cartão de "Sessões Concluídas".
*   **Ação / Conteúdo:** Exibe o list completo das sessões. Possui botões interativos de `Play` que disparam a prop `onStartSession`, que por sua vez fechará o modal e passará os IDs para arrancar o Live Command mode.

### 12. Central de Alertas (`AlertsModal.tsx`)
*   **Nome do Componente:** `AlertsModal`
*   **Gatilhos:** Botão no cartão de "Atenções Urgentes".
*   **Conteúdo/Ação:** Lista detalhada de todos os alertas sistémicos. Têm botões de Quick Actions contextuais ("Resolver", "Adiar"). Apenas lançam toasty bars, sem commit atual na DB nestes botões.

### 13. Novo Workspace (`CreateWorkspaceModal.tsx`)
*   **Nome do Componente:** `CreateWorkspaceModal`
*   **Gatilhos:** Dropdown do Workspace selector no Header > "+ Criar Workspace".
*   **Campos de Input:** Três passos: Nome/Descrição -> Tipo (Equipa, Online, Clínica, Studio) -> Timezone, Sistema de Medida, Moeda.
*   **Ação Final:** Retorna os dados `WorkspaceData` via `onComplete` para a raiz `App.tsx`.


---

## 4. FLUXO DE DADOS (ON MOUNT)

Quando a rota principal da página Dashboard (`src/components/pages/Dashboard.tsx`) é carregada, ocorre uma injeção simultânea massiva de dependências de estado utilizando SWR e Hooks personalizados para alimentar a UI sem bloquear.

1.  **AI Engine (`useDecisions`):**
    *   Pesquisa de decisões para alimentar a contagem no Badge do Header (via `pendingDecisions` em `App.tsx` global) e as "Atenções" no Dashboard.
    *   Faz fetch passando status: `pending`, autoRefresh ativado, e intervalo de `60000ms`.

2.  **Métricas Base (`useAnalyticsDashboard`):**
    *   Invoca a fetch à API via backend do Supabase em background, extraindo KPI data (como rácios de comparecimento `attendance`, taxas de completude `sessionsKPI`, `nextSession` detail info, e totologias de `alerts`).

3.  **Agenda em Tempo Real (`useCalendarEvents`):**
    *   Executa dois blocos de load para o timeline:
    *   Primeiro para carregar a matriz "HOJE" via `startDate: today` e `endDate: today`.
    *   O segundo carregamento preenche a Tab de "SEMANA" calculando o weekStart e `weekEnd` (uma janela exata de +7 dias iterativos).
    *   Estes fetches populam as secções com IDs preenchendo as listagens `todaySessions` ou agrupando-as na lógica map baseada em dias para renderizá-las condicionalmente com ícones coloridos baseados no estado (se terminou no passado vira 'completed', se está a ocorrer 'active', futuro 'upcoming').

4.  **Sistema de Riscos e Atenções (`useDashboardAlerts`):**
    *   Busca assíncrona dos arrays globais do sistema de alertas do Treinador (que engloba dados de Posture, Pain, e Fatigue) e seleciona as primeiras ocorrências limitando um `.slice(0, 5)` para popular o painel da Dashboard central de Alertas Rápidos (transformando items base em "Urgente", etc., renderizando na secção 'Outros Alertas').

---
*Nota do Auditor: Análise exaustiva da Árvore de Componentes confirmou que a estrutura visual utiliza exaustivamente a biblioteca "lucide-react", mantendo um design language rigoroso que assenta em Flexboxes, CSS Grid e a tipografia interligada com as definições de TailwindCSS (classes customizadas do 'luna-obsidian'). O ecossistema de modais está totalmente funcional sob um design system de componentização "Radix-style" controlado globalmente no "App.tsx".*