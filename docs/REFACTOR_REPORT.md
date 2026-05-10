# 📋 PLANO DE REFATORAÇÃO & RELATÓRIO DE INTEGRIDADE FUNCIONAL (TEMPLATE)

**Objetivo:** Eliminar dívida técnica, remover código morto, estabilizar a arquitetura e garantir que **nenhuma funcionalidade existente é perdida ou degradada**.

---

## 📅 FASE 0 – PREPARAÇÃO DO AMBIENTE DE VERIFICAÇÃO

Antes de qualquer refactor, monta a rede de segurança:

- [ ] **Testes de regressão end‑to‑end** (pelo menos das jornadas críticas: criar treino, arrastar nó, gerar PDF, etc.)
- [ ] **Gravação de snapshots de estado** (Zustand store inicial + após ações chave) para comparação posterior
- [ ] **Feature flags** para isolar código novo vs. antigo (opcional, mas potente)
- [ ] **Pipeline de CI** com validação de tipo (TypeScript), linting e testes automáticos
- [ ] **Ramo `refactor/core‑stabilization`** isolado, com deployments de staging

---

## 📦 FASE 1 – INVENTÁRIO TOTAL DO SISTEMA (THE SINGLE SOURCE OF TRUTH)

### 1.1 Tabela de Ficheiros (Obrigatório)
Para cada ficheiro do repositório, preencher:

| Caminho completo | Responsabilidade | Estado vital | Utilizado por (imports) | Dependências internas | Side effects | Risco de crash (0-10) | Performance (0-10) | Notas / Ação sugerida |
|---|---|---|---|---|---|---|---|---|
| `src/App.tsx` | Ponto de entrada da aplicação, rotas base e providers context | ✅ Vivo | - | `src/contexts/AppContext`, `src/components/luna-obsidian/*` | - | 8 | 5 | Remover imports antigos das pastas eliminadas (`layout`, etc) |
| `src/components/luna-obsidian/LunaDashboardPage.tsx` | Dashboard LUNA.OS principal | ✅ Vivo | `src/App.tsx` | - | Context mutations | 5 | 7 | - |
| `src/components/studio/luna/forms/LunaFormsCenter.tsx` | Gestor central de formulários LUNA | ✅ Vivo | - | `lunaFormsApi`, `LunaFormsContext` | API mutations | 7 | 6 | - |
| `src/components/dataos/DataGrid.tsx` | Tabela principal do DataOS | ✅ Vivo | - | `DataOSContext` | - | 6 | 4 | Otimização de renderização necessária para muitos dados |
| `src/components/layout/*` | Arquitetura de UI antiga | 🗑️ Lixo | `src/App.tsx` | - | - | 0 | 0 | **Fisicamente removido**, confirmar ausência |
| `src/components/modals/*` | Arquitetura de UI antiga | 🗑️ Lixo | `src/App.tsx` | - | - | 0 | 0 | **Fisicamente removido**, confirmar ausência |
| `src/components/dashboard/*` | Arquitetura de UI antiga | 🗑️ Lixo | `src/App.tsx` | - | - | 0 | 0 | **Fisicamente removido**, confirmar ausência |
| `src/components/wizards/*` | Arquitetura de UI antiga | 🗑️ Lixo | `src/App.tsx` | - | - | 0 | 0 | **Fisicamente removido**, confirmar ausência |
| `src/services/lunaApi.ts` | Mock do LUNA API | ✅ Vivo | Vários | - | Mocks | 2 | 9 | Migrar para endpoints reais do supabase |
| `src/utils/calendarConflicts.ts` | Lógica de cálculo de sobreposição | ✅ Vivo | Calendar events | - | - | 3 | 9 | Refatorar para remover logs e comentários reduntantes |

**Ferramentas auxiliares:**
- `npx knip` para exports não utilizados
- `npx unimported` para ficheiros órfãos
- `npx depcheck` para dependências de pacotes

### 1.2 Tabela de Tabelas / Coleções (Base de Dados)
Cada tabela, coluna, índice, migração deve ser inspecionada:

| Tabela | Coluna | Tipo | Em uso no código? | Última migração | Ação |
|---|---|---|---|---|---|
| `metric_updates` | `timestamp` | TIMESTAMP | Sim | `00000000000000_init_schema.sql` | Falta `workspace_id`, isolar dependências |
| `metric_updates` | `value` | NUMERIC | Sim | `00000000000000_init_schema.sql` | - |
| `session_athletes` | `session_id`, `athlete_id` | UUID | Sim | `20250103_sessions_schema.sql` | Manter |
| `users` | `rls_policy` | TEXT | Debug | `20260218_debug_open_rls.sql` | ⛔ Revogar imediatamente - Crítico de Segurança |

**Extra:** verificar RLS ativo, índices duplicados, stored procedures não usadas.

---

## 🗺️ FASE 2 – MAPA DE FUNCIONALIDADES (IMPLEMENTADO VS. NÃO IMPLEMENTADO)

Construir uma tabela de features do ponto de vista do utilizador, com rastreabilidade ao código.

| ID | Funcionalidade | Estado | Componentes / Stores envolvidos | Cobertura de testes | Observações |
|---|---|---|---|---|---|
| F01 | Autenticação Luna | ✅ Implementado | `LunaLogin`, `useApp()` | A Verificar | Ocorre inteiramente via `/luna-login` |
| F02 | Dashboard LUNA.OS | ✅ Implementado | `LunaDashboardPage`, `MainLayout`, `LunaSidebar`, `LunaHeader` | A Verificar | Componentes legacy (modals, wizards) foram descartados |
| F03 | Luna Forms Center | ✅ Implementado | `src/components/studio/luna/forms/*`, `LunaFormsContext` | A Verificar | Operações transform (`kg_to_lbs`, `percentage`, etc) |
| F04 | Gestão de Treinos (SWR) | ✅ Implementado | `useWorkouts`, `useExercises` | A Verificar | Depende fortemente de `mutate` para refresh manual |
| F05 | Visualização de Analytics | ✅ Implementado | `useAnalyticsDashboard`, fetcher `./core` | A Verificar | Usa SWR e URLSearchParams |
| F06 | Live Session / Coaching | ✅ Implementado | `LiveSessionConfig`, App context (`userId`, `workspaceId`) | A Verificar | - |
| F07 | Motor de Relatórios / Jobs | ✅ Implementado | `src/utils/scheduled-jobs/index.ts` | A Verificar | Necessita conversão para `Promise.all` |
| F08 | Design Studio de Planos | ✅ Implementado | `DesignStudio.tsx` | A Verificar | - |
| F09 | DataOS (Listagem / Grid) | ✅ Implementado | `DataGrid.tsx`, `DataOSContext.tsx` | A Verificar | Não usa SWR para estado local |
| F10 | Criação de Eventos no Calendário | ✅ Implementado | `CalendarProvider`, `CreateEventModal` | A Verificar | Usa `prefilledData` por contexto para preenchimento |

**Legenda dos Estados:**
- ✅ Implementado e testado
- 🟡 Implementado mas sem interface (engine interno)
- 🔶 Parcialmente implementado (alguns casos falham)
- ❌ Não implementado (placeholder)
- 💀 Obsoleto (removível)

**Regra:** para cada feature com estado ✅, deve existir pelo menos um teste automático (unitário, integração ou E2E) que comprove o seu funcionamento.

---

## 🔗 FASE 3 – MAPA DE DEPENDÊNCIAS E GRAFO DE IMPACTO

Cria uma matriz de dependências de alto nível (ou grafo) que mostre:

- Quais módulos dependem de quais ficheiros
- Aglomerados de alto acoplamento
- Zonas mortas (ilhas sem conexão ao entry point)

| Módulo / Ficheiro | Depende de | Impacto se alterado |
|---|---|---|
| `src/contexts/AppContext.tsx` | `react` | Toda a aplicação LUNA - Global state de Auth/Workspace |
| `src/components/luna-obsidian/*` | `src/contexts/AppContext.tsx` | O LUNA.OS. Funcionalidades base de visualização de conteúdo |
| `src/App.tsx` | Pastas legacy (erros atuais de compilação) | Quebra no arranque (`npm run dev`) |
| `src/components/studio/luna/forms/*` | `lunaFormsApi.ts`, `LunaFormsContext` | Motor de formulários e processamento de transformações numéricas |
| `src/components/dataos/*` | `DataOSContext.tsx` | Gestão local (sem SWR) do layout complexo do Data OS |
| `src/utils/scheduled-jobs/index.ts` | DB, `fetch` endpoints | Execuções periódicas e de notificações/bulk-updates |

Este mapa permite identificar exatamente **quais os ficheiros que, se alterados, exigem re‑teste obrigatório**.

---

## 🔄 FASE 4 – PLANO DE REFATORAÇÃO INCREMENTAL (COM GARANTIA DE 100% DE FUNCIONALIDADE)

O refactor é executado em **iterações pequenas**. Cada iteração segue o ciclo:

1. **Isolar:** escolher um alvo (ex: remover a pasta `/sprint0-package`).
2. **Verificar dependências:** garantir que nenhum código vivo importa qualquer ficheiro desse alvo (usar `knip` e busca global).
3. **Criar testes de regressão adicionais** se a área for sensível.
4. **Executar a alteração** (remoção, extração, reescrita).
5. **Correr bateria de testes completa** + verificações manuais das funcionalidades da matriz (FASE 2).
6. **Validar snapshot de estado:** comparar estado da store antes/depois, se aplicável.
7. **Registar no relatório** com evidência (hash do commit, testes passados, funcionalidades verificadas).

### 4.1 Template de Registo de Iteração de Refactor

| Iteração | Alvo | Tipo de mudança | Funcionalidades verificadas (IDs) | Testes executados (passaram/total) | Snapshot de estado conforme? | Assinatura |
|---|---|---|---|---|---|---|
| R01 | `src/App.tsx` | Limpeza | F01, F02 | A Verificar | A Verificar | - |
| R02 | `src/utils/scheduled-jobs/index.ts` | Otimização | F07 | A Verificar | A Verificar | - |
| R03 | `src/supabase/migrations/20260218_debug_open_rls.sql` | Segurança | Todos | A Verificar | N/A | - |

---

## ✅ FASE 5 – VERIFICAÇÃO DE INTEGRIDADE FUNCIONAL (100% PARIDADE)

Ao final de cada ciclo, e sobretudo antes de fundir com a branch principal, realiza:

- [ ] **Execução completa da suíte de testes** (unitários, integração, E2E) com 100% de aprovação.
- [ ] **Testes exploratórios manuais** sobre as funcionalidades ✅ da matriz (FASE 2), com check‑list.
- [ ] **Comparação de cobertura de código:** o refactor não deve reduzir a cobertura; idealmente aumenta‑a.
- [ ] **Validação de performance:** medir tempo de carregamento, FPS do canvas, uso de memória, e comparar com linha base registada antes do refactor.
- [ ] **Verificação de acessibilidade:** executar Lighthouse ou axe‑core, garantir que a pontuação não piorou.

### Template de Verificação Final (Checklist por Funcionalidade)

| ID | Funcionalidade | Check manual (Pass/Fail) | Teste automático associado | Responsável | Data |
|---|---|---|---|---|---|
| F01 | Autenticação Luna | A Testar | TBD | - | - |
| F02 | Dashboard LUNA.OS | A Testar | TBD | - | - |

---

## 📊 RELATÓRIO DE DÍVIDA TÉCNICA E LIXO (ANEXO VIVO)

Mantém uma lista priorizada de itens a eliminar, actualizada a cada iteração.

| Prioridade | Item | Tipo | Estimativa de esforço | Impacto se não removido |
|---|---|---|---|---|
| P0 (Crítico) | `20260218_debug_open_rls.sql` ativo | Segurança | 1h | Acesso indevido a dados (RLS aberto) |
| P0 (Crítico) | `src/App.tsx` legacy imports | UI/Build | 1h | Vite fails to compile (`npm run dev` crash) |
| P1 (Alto) | `src/utils/scheduled-jobs/index.ts` | Performance | 2h | Loops assíncronos lentos prejudicam jobs |
| P2 (Médio) | `src/utils/calendarConflicts.ts` | Código morto | 1h | Comentários e logs desnecessários |

---

## 🧭 FECHO DO TEMPLATE

Este relatório deve ser mantido como **documento vivo no repositório** (`docs/REFACTOR_REPORT.md`), actualizado a cada sprint.
A meta é que, no final, a coluna “Lixo” esteja a zeros, a cobertura de testes acima de 80% e todas as funcionalidades verificadas com teste automático.
