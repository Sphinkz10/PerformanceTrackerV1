# RELATÓRIO DE AUDITORIA "ENTERPRISE DATA" (ESCOPO OBRIGACIONAL)

## 1.1. Auditoria de Escalabilidade e Modelo (Schema)

**Normalização e Estrutura:**
A estrutura relacional assenta na entidade central `workspaces`. A tabela `users` representa os utilizadores do sistema (role: admin, coach, athlete), enquanto a tabela `athletes` atua como um perfil detalhado estendido (ligado por `user_id`).
A modelação das sessões baseia-se num design pseudo-híbrido. Os templates (Planos de Treino) estão contidos na tabela `workouts` (com a flag `is_template = true`) que armazena a estrutura do plano num campo `JSONB` (`structure`). Os Registos Reais (`sessions`) são independentes mas replicam uma versão imutável do evento através da coluna `snapshot_data jsonb`, evitando a mutação histórica.

**Ausência de Chaves Estrangeiras (FKs) e Índices Vitais:**
A tabela de `sessions` tem um comentário na migração que indica `workout_id uuid, -- Will reference workouts(id) when Design Studio implemented`, o que demonstra uma desconexão temporária.
Existem graves lacunas na indexação: `CREATE INDEX` não está presente de forma abrangente para as chaves estrangeiras (`workspace_id`, `athlete_id`, `session_id`), o que força *Sequential Scans* no PostgreSQL em queries de filtragem por workspace ou atleta.

**Nota de Risco (100 atletas ativos por PT):**
**ALTO.** O modelo atual não suporta eficientemente um PT com 100 atletas devido à falta de índices nas Foreign Keys principais. Um *dashboard* que agregue `metrics` e `sessions` para 100 atletas num `workspace` fará *full table scans* repetidos, resultando num N+1 query problem agressivo na camada da API (Hono/Next), degradando a performance para mais de 3-5 segundos por load no Dashboard.

---

## 1.2. Avaliação de Segurança e Integridade (Supabase RLS)

**Auditoria Estrita ao Row Level Security (RLS):**
**FALHA CRÍTICA DE ISOLAMENTO DE DADOS.**
Verificou-se que as políticas de leitura (SELECT) na tabela `athletes`, `sessions`, `metric_updates`, e outras baseiam-se quase exclusivamente num *check* de `workspace_id`:
```sql
CREATE POLICY "Enable read access for workspace members" ON athletes FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);
```
**Impacto:** Se vários Atletas pertencerem ao mesmo `workspace_id` (ex: um PT coloca todos os seus clientes num "Personal Workspace" em vez de Workspaces separados), **um Atleta pode aceder e ler os dados, sessões e métricas de outro Atleta**, já que a política apenas valida a pertença ao Workspace, e não o `auth.uid() = user_id`.

**Privilégios Excessivos:**
Nas migrações mais recentes (`20260218_fix_athletes_rls.sql` e `20260218_debug_open_rls.sql`), a frustração com RLS levou à aplicação de políticas excessivamente abertas que violam a integridade:
```sql
CREATE POLICY "Enable insert for authenticated users" ON public.athletes FOR INSERT TO authenticated WITH CHECK (true);
```
Isto permite que *qualquer* utilizador autenticado injete registos de atletas na base de dados (mesmo de outros workspaces, se descobrirem o ID).

---

## 1.3. Plano de Contingência e Migração

**Gestão de Mudanças e Histórico:**
As migrações não estão geridas de forma completamente linear num sistema clássico, sendo aplicados ficheiros incrementais em `src/supabase/migrations/`. Observam-se migrações com datas futuras (`2026...`) e scripts "debug" (`20260218_debug_open_rls.sql`), sinalizando um histórico conturbado de correções diretas ("hotfixes") no RLS em produção.

**Risco de Data Loss na Reestruturação de "Treinos":**
**MÉDIO/BAIXO.** A arquitetura adotada salvaguarda os dados históricos incrivelmente bem. Como a tabela `sessions` utiliza a coluna `snapshot_data jsonb` como core concept imutável (`-- SNAPSHOT IMUTÁVEL`), qualquer alteração à tabela de templates de `workouts` ou `exercises` **não apagará** o histórico dos utilizadores, pois o registo em `sessions` é estático após completado. No entanto, o `workout_id` perderá a referência de integridade (devido à falta de Foreign Key estrita referida no ponto 1.1).

---

## 1.4. Análise de Dependências (O Mapa da Mina)

**Mapeamento das 3 Tabelas Críticas:**
1. `users` (Centraliza Auth e Workspace)
2. `sessions` (Agrega a imutabilidade dos treinos executados)
3. `workouts` (Contém templates e esquemas de progressão)

**Matriz de Impacto (Ruptura em rotas e funcionalidades):**
Se alterarmos a estrutura destas tabelas para o novo Dashboard:
- **API `src/app/api/workouts/route.ts` e `src/app/api/athletes/[id]/route.ts`**: Quebrarão imediatamente. Estas rotas dependem altamente da estrutura atual de propriedades e do `workspace_id`.
- **API `src/app/api/athlete-portal/metrics/route.ts`**: Qualquer normalização nas tabelas de `metric_updates` vs `sessions` destruirá a página atual de métricas no Athlete Portal.
- **FormCenter / ReportBuilder**: Os endpoints `/api/reports/` e `/api/forms/[formId]/metric-links/` que dependem dos templates e do RLS atual (onde os coaches acedem a todo o workspace) irão falhar com HTTP 500 se o RLS de `users` for refatorado para isolamento estrito de atletas.

---

## 1.5. Plano de Resolução e Refatoração

**Estratégia Sugerida (Desacoplamento e Novo Dashboard "Luna Obsidian"):**
1. **Padrão de View-Based API**: Em vez de reestruturar as tabelas físicas atuais ("o esparguete") que quebrariam o Frontend antigo, devemos criar `VIEWS` seguras no PostgreSQL (ex: `vw_luna_dashboard_stats`) que agreguem os dados necessários.
2. **Nova API Hono**: A Nova UI (Luna Obsidian) deve consumir apenas endpoints "V2" do Hono que consultam estas novas Views ou usam RPCs estritos de Supabase, ignorando por completo as rotas Next.js em `src/app/api/`.

**Roteiro de Refatoração em Fases (Data/DB First):**
* **Fase 1 (Estancamento - Semana 1):** Aplicar de imediato índices nas FKs críticas (`workspace_id`, `user_id` em sessões e atletas) na BD em Produção para resolver os gargalos de *Table Scans* e viabilizar os loads da UI com dezenas de atletas. Remover as políticas `WITH CHECK (true)` perigosas.
* **Fase 2 (Isolamento RLS):** Reescrever o RLS de leitura de `athletes` e `sessions` para garantir que `auth.uid() = user_id` quando a `role = 'athlete'`, mantendo o acesso total de leitura apenas para a `role = 'coach'` no mesmo `workspace_id`.
* **Fase 3 (Views de Dados V2):** Criar `Views` ou Materialized Views específicas para o Dashboard Luna Obsidian no Supabase (ex: cálculo de volumes semanais e compliance de sessões) de forma imutável, permitindo a construção do Dashboard frontend V2 em paralelo e de forma segura.
* **Fase 4:** Depreciação final das chamadas Hono/NextJs antigas quando o *FormCenter* e o *ReportBuilder* forem passados para a V2.