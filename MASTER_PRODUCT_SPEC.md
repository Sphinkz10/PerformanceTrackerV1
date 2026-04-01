# MASTER PRODUCT SPEC - JULES V2.0

## (Football Manager / FIFA Design Style Blueprint)

Este documento contém a extração genética completa do frontend atual.

## 1. Inventário de Modais e Interações

### DashboardConfigModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, sessions, injuries, records

### AddEventModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Submit/Save, Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### CancelWorkoutModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, workouts

### CreateInjuryModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, injuries, records

### CreateRecordModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, metrics, records

### MarkUnavailableModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, workouts

### ReportPainModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, injuries

### RequestBookingModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Submit/Save, Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, sessions, calendar_events

### RequestChangeModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, workouts

### WorkoutDetailsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, workouts

### ExportReportsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, workouts

### AddParticipantsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### AnalyticsReportModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** calendar_events

### AthleteAvailabilityModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### BulkAssignModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** calendar_events

### BulkDeleteModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Delete
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### BulkEditModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### BulkMoveModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** calendar_events

### BulkTagModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** records, calendar_events

### BulkTeamScheduleModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### CalendarSettingsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### ConflictResolverModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### CopyWeekModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** calendar_events

### CreateEventModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, workouts, calendar_events, Direct Supabase Call

### Step1ImportSource.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Next Step, Create/Save
- **Domínio/Tabelas inferidas:** workouts, calendar_events

### Step2DateTime.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** workouts, calendar_events

### Step3Participants.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### Step4ConfirmationSettings.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### Step5Review.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save
- **Domínio/Tabelas inferidas:** athletes, workouts, records, calendar_events

### EditRecurrenceModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### DeleteConfirmation.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Delete
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### EditEventForm.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** workouts, calendar_events

### EventDetailsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### EventInfo.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save
- **Domínio/Tabelas inferidas:** athletes, workouts, records, calendar_events

### ParticipantsTab.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save
- **Domínio/Tabelas inferidas:** calendar_events

### ExportModalV2.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** calendar_events

### FiltersModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### ImportModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** calendar_events

### PendingConfirmationsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### RecurringEventModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** athletes, workouts, calendar_events

### TeamGroupModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes

### CreateTemplateModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** workouts, calendar_events

### AthleteCompareModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, metrics

### BulkEntryModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** athletes, metrics

### DeactivatePackModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Delete
- **Domínio/Tabelas inferidas:** metrics

### DeleteMetricModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Delete
- **Domínio/Tabelas inferidas:** metrics

### PackActivationSuccessModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** metrics, calendar_events

### PackDetailModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, sessions, injuries, metrics, records

### PacksLibraryModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** sessions, injuries, metrics

### QuickEntryModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, metrics

### BlockedDeleteModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Delete
- **Domínio/Tabelas inferidas:** metrics

### BulkDeleteModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Delete
- **Domínio/Tabelas inferidas:** athletes, metrics

### CreateFieldModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** sessions

### DeleteMetricModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Delete
- **Domínio/Tabelas inferidas:** athletes, metrics

### HistoryExportModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, metrics

### RestoreMetricModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, metrics

### SmartEntryModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, metrics

### LibraryUnifiedWithModals.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, injuries, metrics, records

### CreateMetricFromFieldModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** sessions, metrics, records

### FormSubmissionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** athletes, metrics, calendar_events

### SelectMetricModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** metrics, records, calendar_events

### LiveCompletionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, workouts, sessions, records

### AIAssistantModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** records

### ActiveAthletesModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, sessions

### AddInjuryModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, injuries, calendar_events

### AdvancedConfigModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Custom/Icon buttons apenas
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### AlertsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step
- **Domínio/Tabelas inferidas:** injuries, records

### BulkScheduleModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** athletes, workouts, sessions, calendar_events

### BulkSubmissionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, metrics, records

### CompletionAuditModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step
- **Domínio/Tabelas inferidas:** sessions

### ConditionalLogicModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### ConfirmDeleteModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Delete
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### ConfirmModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### ContextSelectionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step
- **Domínio/Tabelas inferidas:** athletes, metrics

### CreateAthleteModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, calendar_events

### CreateClassModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### CreatePlanModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** workouts, sessions, calendar_events

### CreateProjectModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** sessions, injuries, records, calendar_events

### CreateWorkoutModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** workouts, calendar_events

### CreateWorkspaceModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Submit/Save, Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** metrics, records, calendar_events

### EmailTemplateModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### ExecuteSessionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** athletes, sessions, records

### ExerciseBuilderModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### ExercisePickerModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### FieldQuickConfigModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### FormAnalyticsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### KeyboardShortcutsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### MetricDetailModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, metrics

### NotificationsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, sessions

### QuickSessionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** athletes, sessions

### ScheduleSessionModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, sessions, calendar_events

### ScheduleWorkoutModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step, Create/Save
- **Domínio/Tabelas inferidas:** athletes, workouts, calendar_events

### SearchModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, sessions, calendar_events

### SendFormModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** athletes, injuries, calendar_events

### SeriesConfigModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### SubmissionPreviewModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** metrics

### TodaySessionsModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Next Step
- **Domínio/Tabelas inferidas:** athletes, sessions, records, calendar_events

### WorkoutPickerModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save
- **Domínio/Tabelas inferidas:** workouts

### NotificationPreferencesModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** athletes, sessions, injuries, metrics, records, calendar_events

### Modal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel
- **Domínio/Tabelas inferidas:** UI estática ou domínio desconhecido

### ResponsiveModal.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Close/Cancel, Create/Save, Delete
- **Domínio/Tabelas inferidas:** calendar_events

### ResponsiveModal.test.tsx
- **Gatilho (Típico):** Props `isOpen`, `onClose`
- **Botões de Ação inferidos:** Custom/Icon buttons apenas
- **Domínio/Tabelas inferidas:** calendar_events

## 2. Dicionário de Ações e Lógica Oculta

### Página: CalendarDemoPage.tsx
- **Tipos de Interação:** Interactive Clicks
- **Rotas/Links:** Nenhum
- **Operações de Dados:** Nenhuma call explícita

## 3. Auditoria de UX (Teste de Stress e Fluxos)

### Caminhos Críticos e Fricções Identificadas:

1. **Criação de Atleta (CreateAthleteModal):**
   - *Fluxo:* Clica no dashboard -> preenche formulário multi-step -> envia convite.
   - *Cliques estimados:* ~4-5 cliques obrigatórios.
   - *Fricção:* Muitos inputs dependentes. Falta de feedback visual síncrono antes da gravação final.

2. **Execução de Sessão (ExecuteSessionModal):**
   - *Fluxo:* Treinador ou Atleta abre modal -> Regista carga/RPE -> Grava.
   - *Fricção:* Risco de perda de contexto se o modal for fechado (fecho no backdrop não avisa de perda de dados).

3. **Gestão de Liveboard (DataOS):**
   - *Fluxo:* Abre tabela -> Inline edit -> Save.
   - *Fricção:* O atalho 'Esc' fecha a notificação/edição mas pode entrar em conflito com o fecho do modal global, criando becos sem saída de UX.

## 4. DNA de Personalização (Candidatos a Templates)

- **PhysicalMetricsStrip (`src/components/athlete/PhysicalMetricsStrip.tsx`):** Atualmente fixo no topo do perfil. Candidato ideal a widget drag-and-drop de resumo métrico.

- **MetricHistoryChart (`src/components/athlete/charts/MetricHistoryChart.tsx`):** Os dados injetados estão acoplados às props estáticas. Deveria suportar configuração de 'Eixos' via template do Manager.

- **Activity Feed (`src/components/athlete/ActivityFeed.tsx`):** A listagem de timeline é linear; deveria ser um widget destacável.

- **Dashboard Views (`src/components/dashboard/`):** A grelha atual tem colunas fixas (1 ou 2/3). Candidato a layout grid flexível (estilo Notion/FIFA dashboard).

## 5. Forense Visual e Acessibilidade (A11y)

### Sistema Visual

- **Cores Base (Amostra):** #10b981, #d1fae5, #059669, #0ea5e9, #e0f2fe, #0284c7, #f59e0b, #fef3c7, #d97706, #8b5cf6, #ede9fe, #7c3aed, #ef4444, #fee2e2, #dc2626, #e2e8f0, #64748b, #6366f1, #e0e7ff, #4f46e5
- **Sombras e Elevação (Tailwind):** shadow-lg, shadow-sm, shadow-2xl, shadow-md, shadow-xl, shadow-[0_8px_30px_rgb(0,0,0,0.04)], shadow-[0_8px_30px_rgb(0,0,0,0.08)], shadow-[0_4px_20px_rgb(0,0,0,0.02)], shadow-none, shadow-[0_0_0_1px_hsl(var(--sidebar-border))], shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]
- **Iconografia Mapeada (Amostra Lucide):** Settings, Plus, Loader2, LayoutGrid, Eye, EyeOff, X, Calendar, FileText, BarChart3, MessageCircle, MoreVertical, User, Activity, AlertCircle, CheckCircle, Clock, ArrowLeft, Play, TrendingUp, Zap, Brain, Heart, History, Ruler, Weight, Droplet, Dumbbell, Move, Edit2

### Falhas de Acessibilidade (A11y)

- **Botões Críticos sem `aria-label` (Exemplos):** AnalyticsDashboard.tsx, DashboardConfigModal.tsx, PhysicalMetricsStrip.tsx, MetricHistoryChart.tsx, ChatWithCoach.tsx, AthleteDashboard.tsx, EditPhysicalDrawer.tsx, InjuryDetailsDrawer.tsx
- **Modais sem `FocusTrap` (Exemplos):** DashboardConfigModal.tsx, AddEventModal.tsx, CancelWorkoutModal.tsx, CreateInjuryModal.tsx, CreateRecordModal.tsx, MarkUnavailableModal.tsx, ReportPainModal.tsx, RequestBookingModal.tsx
- **Inputs de Formulário sem `label` (Exemplos):** ChatWithCoach.tsx, HistoryTab.tsx, SessionsTab.tsx, WorkflowsList.tsx, AttendanceReport.tsx, BulkOperationsBar.tsx, AddParticipantsModal.tsx, BulkDeleteModal.tsx
