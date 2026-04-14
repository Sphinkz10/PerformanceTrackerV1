# Relatório de Saúde Estruturado - PerformanceTrackerV1 (Protocolo "Health Check")

## 1. SEGURANÇA E VULNERABILIDADES (Security)

### Secrets Expostos (Hardcoded)
Foram detetados múltiplos locais com potenciais chaves expostas ou más práticas de segurança, incluindo:
* **Senhas em Plain Text:** No ficheiro `src/AUDITORIA_PRE_PRODUCAO_COMPLETA.md` existem senhas hardcoded como `password: 'coach123'` e `password: 'athlete123'`.
* **Tokens e Chaves:** Referências a `RESEND_API_KEY` (em `src/lib/calendar/email-integration-guide.md`) e múltiplas instâncias onde `NEXT_PUBLIC_SUPABASE_ANON_KEY` é utilizado de forma mista em rotas do lado do servidor (ex: `src/app/api/notifications/route.ts`).
* **Autenticação Insegura:** Múltiplas rotas confiam no `process.env.INTERNAL_API_KEY` sem validação de timing-safe, violando as nossas diretrizes de segurança.

### Dependências Vulneráveis
Uma execução equivalente a `npm audit` revelou **2 vulnerabilidades de severidade ALTA (High)**:
1. `lodash (<=4.17.23)`: Vulnerável a Code Injection via `_.template` e Prototype Pollution.
2. `vite (<=6.4.1)`: Vulnerável a Path Traversal em Optimized Deps `.map` Handling e Arbitrary File Read via Vite Dev Server WebSocket.

### Regras de RLS (Supabase)
Foram detetados potenciais bypasses de RLS:
* Múltiplas chamadas RPC e selects em `src/app/api` e `src/lib/api` sem contexto claro do utilizador autenticado e utilizando o cliente default ou bypassando a RLS padrão.
* Chamadas em scripts do lado do cliente (ex: `src/lib/supabase/client.ts`) que poderão não estar adequadamente isoladas pelo `workspace_id`.

---

## 2. INTEGRIDADE DE TIPAGEM (TypeScript Strictness)

### Uso de `any` e `@ts-ignore`
* **Número total de usos de `any`:** 1132 ocorrências.
* **Número total de usos de `@ts-ignore`:** 19 ocorrências.
* Este é um alerta vermelho, denotando uma forte dependência de tipagem dinâmica num projeto TypeScript.

### Tipos Implícitos e Interfaces Desatualizadas
* A nossa base de dados V2 não está totalmente refletida em partes do sistema (várias referências a interfaces customizadas em vez de gerar os tipos do Supabase `src/types/supabase.ts`).

### Comparativo Semanal (Week-over-Week)
* **Há 7 dias:** `any` (1132) | `@ts-ignore` (19)
* **Hoje:** `any` (1132) | `@ts-ignore` (19)
* **Resultado:** Estagnação total. A equipa não reduziu a dívida de tipagem nesta última semana.

---

## 3. DÍVIDA TÉCNICA E CODE SMELLS (Tech Debt)

### Top 3 Funções/Ficheiros Mais Complexos (Ciclomática)
Os 3 ficheiros com maior complexidade e linhas de código:
1. `src/lib/DataStore.ts` (1311 linhas) - Objeto gigante contendo estados e métodos fortemente acoplados.
2. `src/components/pages/ReportBuilderV2.tsx` (1311 linhas) - Componente colossal com 22 funções integradas (`const .* = (.*) =>`).
3. `src/components/pages/FormCenter.tsx` (1289 linhas) - Um monolito de interface não componentizado.

### Duplicação de Código (Gritante)
* Vários componentes de wizard (`src/components/dataos/v2/wizard/` e `src/components/scheduling/`) e modais repetem blocos inteiros de layout e lógica em vez de reutilizarem abstrações.

### Ficheiros Mortos ("Dead Files")
A auditoria identificou **dezenas de ficheiros órfãos/não utilizados**, incluindo:
* `src/components/snapshots/SnapshotComparison.tsx`
* `src/components/scheduling/WizardStep1SelectAthletes.tsx`
* `src/lib/calendar/demo-data-generator.ts`
Estes ficheiros ocupam espaço, atrasam as compilações e poluem as pesquisas de código.

---

## 4. COMPARATIVO SEMANAL (Week-over-Week)

### Resumo da Saúde do Projeto
A saúde do projeto encontra-se **ESTAGNADA e EM RISCO**:
* **Progresso:** Não houve melhorias significativas na refatoração ou redução de avisos/ignorações TypeScript (`any` e `@ts-ignore`).
* **Métricas de Git:** Nos últimos 7 dias houve apenas **1 commit** registado (`feat`), sugerindo que a resolução de bugs (`fix`) não foi priorizada ou não houve deploy de correções. (0 bugs resolvidos).
* O projeto mantém as mesmas vulnerabilidades npm e a mesma dívida técnica de código estrutural complexo.

### Conclusão e Alertas Vermelhos 🚨
O repositório necessita de **intervenção imediata (Estancamento)**:
1. **🚨 Alerta Crítico:** Vulnerabilidades de `lodash` e `vite` com severidade High exigem update urgente.
2. **🚨 Alerta de Segurança:** Remover credenciais em Plain Text detetadas no audit de pré-produção.
3. **🚨 Alerta de Manutenção:** Partir ficheiros colossais (como o `ReportBuilderV2.tsx` e `DataStore.ts`) para evitar escalada na complexidade técnica e dificuldade em onboarding de novos membros.
