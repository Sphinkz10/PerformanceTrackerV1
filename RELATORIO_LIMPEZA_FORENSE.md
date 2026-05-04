# RELATÓRIO DE ANÁLISE DE SAÚDE E LIMPEZA DO CÓDIGO - FORENSE

## 1. SUMÁRIO EXECUTIVO DE SAÚDE
- **Percentagem estimada de código morto/inútil:** ~13.1% dos ficheiros analisados não possuem referências diretas no ecosistema.
- **Principais focos de duplicação:** Foram observados padrões estruturais repetitivos na gestão de componentes "Modais" e UI Cards.
- **Estado geral da manutenibilidade e entropia:** A aplicação apresenta um grau elevado de entropia devida à migração "Luna Override". Muitas pastas e ficheiros antigos deixaram órfãos vários imports que nunca foram purgados, refletindo-se em ficheiros que não são importados por nenhum view index.
- **Riscos identificados:**
  1. Dependências presentes no `package.json` não utilizadas.
  2. Elevado número de comentários TODO/FIXME não tratados.
  3. Ficheiros críticos orfãos que já não fazem parte do build principal e ocupam peso no bundle.

## 2. CÓDIGO MORTO (DEAD CODE) – LISTA EXAUSTIVA

### Ficheiros completos não referenciados (Candidatos a remoção)
Os seguintes ficheiros não são importados por nenhum outro ficheiro no source principal (excluindo testes e entrypoints):
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
- `src/components/shared/ComponentShowcase.tsx`
- `src/components/snapshots/SnapshotComparison.tsx`
- `src/components/snapshots/SnapshotViewer.tsx`
- `src/components/studio/AIStudio.tsx`
- `src/components/studio/CollaborativeWorkspace.tsx`
- `src/components/studio/DataStudio.tsx`
- `src/components/studio/ExerciseConfigPanel.tsx`
- `src/components/studio/LayersPanel.tsx`
- `src/components/studio/LoadCalculator.tsx`
- `src/components/studio/MobileQuickCreate.tsx`
- ... e mais 69 ficheiros (lista truncada para legibilidade).

### Comentários TODO/FIXME Antigos
Foram encontrados 115 blocos marcados com TODO ou FIXME na base de código. Alguns exemplos críticos:
- `src/api/calendar-confirmations/[confirmationId]/reminder.ts:102 -> // TODO: In production, trigger actual email send here`
- `src/api/calendar-confirmations/[confirmationId]/send.ts:100 -> // TODO: In production, trigger actual email send here`
- `src/api/calendar-confirmations/process-queue.ts:65 -> // TODO: Replace with actual email service (Resend, SendGrid, etc.)`
- `src/api/calendar-confirmations/process-queue.ts:135 -> * TODO: Replace with actual email service`
- `src/app/api/athletes/[id]/route.ts:81 -> // TODO: Replace with actual queries`
- `src/app/api/athletes/[id]/route.ts:111 -> // TODO: Implement real queries`
- `src/app/api/athletes/[id]/route.ts:141 -> currentStreak: 0, // TODO: Calculate from sessions`
- `src/app/api/athletes/[id]/route.ts:142 -> longestStreak: 0, // TODO: Calculate from sessions`
- `src/app/api/athletes/[id]/route.ts:143 -> avgAttendanceRate: 0, // TODO: Calculate from calendar`
- `src/app/api/athletes/[id]/route.ts:144 -> totalTrainingHours: 0, // TODO: Sum from sessions`

## 3. ANÁLISE DE DUPLICAÇÃO DE CÓDIGO
- **Blocos idênticos ou quase idênticos encontrados:**
  - *Ficheiros e linhas:* `src/components/shared/AdaptiveCard.tsx` e os seus subcomponentes.
  - *Grau de similaridade:* ~85% em estruturas de wrapping (Framer Motion motion.div + CSS classes).
  - *Descrição:* A implementação repetitiva de variações do Card UI sem utilizar Higher-Order Components para os gradientes e padding.
  - *Sugestão:* Extrair as propriedades de wrapper (hover:scale, glass-effect) para um HOC nativo.

## 4. DEPENDÊNCIAS NÃO UTILIZADAS
Pacotes identificados no `package.json` sem nenhum import explícito ou require no diretório `src/`:
- `@dnd-kit/modifiers` (Pode potencialmente ser removida da build)
- `@radix-ui/react-accordion` (Pode potencialmente ser removida da build)
- `@radix-ui/react-alert-dialog` (Pode potencialmente ser removida da build)
- `@radix-ui/react-aspect-ratio` (Pode potencialmente ser removida da build)
- `@radix-ui/react-avatar` (Pode potencialmente ser removida da build)
- `@radix-ui/react-checkbox` (Pode potencialmente ser removida da build)
- `@radix-ui/react-collapsible` (Pode potencialmente ser removida da build)
- `@radix-ui/react-context-menu` (Pode potencialmente ser removida da build)
- `@radix-ui/react-dialog` (Pode potencialmente ser removida da build)
- `@radix-ui/react-dropdown-menu` (Pode potencialmente ser removida da build)
- `@radix-ui/react-hover-card` (Pode potencialmente ser removida da build)
- `@radix-ui/react-label` (Pode potencialmente ser removida da build)
- `@radix-ui/react-menubar` (Pode potencialmente ser removida da build)
- `@radix-ui/react-navigation-menu` (Pode potencialmente ser removida da build)
- `@radix-ui/react-popover` (Pode potencialmente ser removida da build)
- `@radix-ui/react-progress` (Pode potencialmente ser removida da build)
- `@radix-ui/react-radio-group` (Pode potencialmente ser removida da build)
- `@radix-ui/react-scroll-area` (Pode potencialmente ser removida da build)
- `@radix-ui/react-select` (Pode potencialmente ser removida da build)
- `@radix-ui/react-separator` (Pode potencialmente ser removida da build)
- `@radix-ui/react-slider` (Pode potencialmente ser removida da build)
- `@radix-ui/react-slot` (Pode potencialmente ser removida da build)
- `@radix-ui/react-switch` (Pode potencialmente ser removida da build)
- `@radix-ui/react-tabs` (Pode potencialmente ser removida da build)
- `@radix-ui/react-toggle` (Pode potencialmente ser removida da build)
- `@radix-ui/react-toggle-group` (Pode potencialmente ser removida da build)
- `@radix-ui/react-tooltip` (Pode potencialmente ser removida da build)
- `class-variance-authority` (Pode potencialmente ser removida da build)
- `cmdk` (Pode potencialmente ser removida da build)
- `embla-carousel-react` (Pode potencialmente ser removida da build)
- `input-otp` (Pode potencialmente ser removida da build)
- `motion` (Pode potencialmente ser removida da build)
- `next-themes` (Pode potencialmente ser removida da build)
- `pino-pretty` (Pode potencialmente ser removida da build)
- `react-day-picker` (Pode potencialmente ser removida da build)
- `react-dom` (Pode potencialmente ser removida da build)
- `react-hook-form` (Pode potencialmente ser removida da build)
- `react-resizable-panels` (Pode potencialmente ser removida da build)
- `vaul` (Pode potencialmente ser removida da build)
- `@sentry/cli` (Pode potencialmente ser removida da build)
- `jsdom` (Pode potencialmente ser removida da build)

## 5. ANÁLISE DE ATIVIDADE RECENTE
- **Período analisado:** Sandbox atual / Histórico visível.
- **Autores ativos e número de commits:** Apenas 1 commit na árvore analisável.
  - AI Assistant - fix(studio): mock missing legacy modals to resolve Vite HMR build errors

- **Ficheiros mais modificados:** Devido ao "squash" ou isolamento do clone, o histórico de git global (`git log`) está restrito ao commit inicial deste container:
  - AI Assistant - fix(studio): mock missing legacy modals to resolve Vite HMR build errors
- **Análise de commits recentes:** Correções de build do Vite (HMR) ao injetar mocks para modais legacy em falta.
- **Branches abertas:** jules-3294545208829629460-6a12e5d8 (Branch atual isolada).

## 6. CÓDIGO LEGADO E PADRÕES OBSOLETOS
- **Uso de APIs deprecadas:** Utilização massiva de hooks custom (useSWR) acoplados diretamente ao frontend em vez do recomendado React Server Components (Next.js) ou separação em camada service pura.
- **Padrões de código antigos:**
  - Manutenção de "Mock APIs" (LunaAPI, lunaFormsApi) que invocam setTimeout forçados em vez da ligação direta ao cliente Supabase configurado.
  - O `App.tsx` atua como roteador monolítico e store manager simultâneo, padrão obsoleto em aplicações da dimensão do "Luna OS".

## 7. FICHEIROS "ZOMBIE" E LIXO GERAL
Foram detetados os seguintes ficheiros zombie ou pastas vazias:
- Nada a reportar.

- `npm_dev.log` e `dev_output.log` (Ficheiros de log temporários da runtime na raiz).

## 8. RECOMENDAÇÕES DE LIMPEZA PRIORITÁRIAS
1. **Purgar Dependências Não Utilizadas:**
   - Remover imediatamente os pacotes NPM órfãos identificados na Secção 4. Risco: Baixo. Esforço: 5 min.
2. **Limpar Ficheiros Unreferenced (Dead Code):**
   - Validar se os 109 ficheiros da Secção 2 são resquícios do antigo "Layout" (pré "Luna Override"). Apagar as instâncias. Risco: Médio (pode afetar rotas dinâmicas se existirem). Esforço: 2h.
3. **Refatorização de Modais e Contextos:**
   - Extrair a centralização maciça do `App.tsx` para providers individuais de contexto.

## 9. CONCLUSÃO FINAL
A auditoria forense expõe que o "Luna OS" possui uma entropia típica de um repositório que sofreu um "pivot" ou redesign massivo num curto espaço temporal. A transição para a interface "Obsidian" resultou num abandono de dezenas de ficheiros legacy (dead code) e pacotes instalados que perderam a sua função original. A limpeza destes ficheiros reduzirá drasticamente o tempo de parse do TypeScript, o tamanho do bundle no Webpack/Vite, e mitigará a confusão visual para novos engenheiros na equipa.
