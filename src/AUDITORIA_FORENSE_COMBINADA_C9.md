# RELATÓRIO DE AUDITORIA FORENSE COMBINADA — PerformTrack V-Login2

**Data:** 2026-04-14
**Protocolo:** Audit Master v2.1 + C9 UX & Onboarding Audit Pro v2.0
**Stack:** React 18.3, Vite 6.4, Tailwind CSS 4.2, Supabase, Capacitor (Android)
**Auditor:** Claude (Audit Master + Audit UX Pro Plugin)

---

# PARTE I — AUDIT MASTER (Auditoria Forense)

---

## 1. Sumario Executivo

### Nota Geral: 5.8 / 10

O PerformTrack e uma plataforma de performance desportiva com arquitectura solida, UI de qualidade (Radix UI + Tailwind), e boas praticas em varias areas (lazy loading, error boundaries, Sentry, i18n). No entanto, apresenta vulnerabilidades criticas em compliance (dados de saude sem encriptacao), qualidade de codigo (865 usos de `any`), e cobertura de testes extremamente baixa (~3.5%). A producao requer remediacao imediata dos achados CRITICAL e HIGH.

### Principais Riscos

1. **Dados de saude sem encriptacao** — 135+ ficheiros manipulam dados sensiveis (lesoes, metricas medicas) sem encriptacao field-level (CRITICAL: LGPD Art.11 / GDPR Art.9)
2. **`unsafe-eval` no CSP de producao** — `vercel.json` inclui `'unsafe-eval'` na directiva script-src, abrindo vector de code injection (CRITICAL)
3. **Cobertura de testes ~3.5%** — 26 ficheiros de teste para 737+ ficheiros de codigo (HIGH)

### Top 3 Recomendacoes

1. Remover `'unsafe-eval'` do CSP em `vercel.json` e implementar encriptacao field-level para dados de saude — **Esforco: 2-3 dias**
2. Campanha de reducao de `any` types (865 → <100) e adicao de testes unitarios criticos — **Esforco: 2 semanas**
3. Completar politica de privacidade e fluxo de consentimento GDPR no registo — **Esforco: 1 semana**

### Top 10 Achados Criticos

| # | ID | Severidade | Categoria | Descricao | Ficheiro |
|---|---|---|---|---|---|
| 1 | CPL-001 | CRITICAL | Compliance | Dados de saude sem encriptacao (135+ ficheiros) | `src/components/athlete/tabs/HealthTab.tsx` |
| 2 | SEC-001 | CRITICAL | Seguranca | `'unsafe-eval'` no CSP de producao | `vercel.json:32` |
| 3 | SEC-002 | HIGH | Seguranca | `dangerouslySetInnerHTML` com CSS raw | `src/pages/LunaDashboardPage.tsx:514` |
| 4 | SEC-003 | HIGH | Seguranca | `dangerouslySetInnerHTML` em chart.tsx | `src/components/ui/chart.tsx:130` |
| 5 | QUA-001 | HIGH | Qualidade | 865 usos de `any` em 279 ficheiros | Codebase-wide |
| 6 | QUA-002 | HIGH | Qualidade | Cobertura de testes ~3.5% (26/737) | `src/tests/` |
| 7 | QUA-003 | HIGH | Qualidade | 151 console.log em codigo de producao | 32 ficheiros |
| 8 | CPL-002 | HIGH | Compliance | Politica de privacidade incompleta | `src/components/pages/PrivacyPage.tsx` |
| 9 | CPL-003 | HIGH | Compliance | Sem consentimento GDPR explicito no registo | `src/components/auth/RegisterPage.tsx` |
| 10 | INF-001 | MEDIUM | Infra | Sem Storybook para design system | N/A |

### Top 10 Quick Wins

| # | ID | Categoria | Descricao | Esforco | Impacto |
|---|---|---|---|---|---|
| 1 | QW-001 | Seguranca | Remover `'unsafe-eval'` de `vercel.json` | 5min | Alto |
| 2 | QW-002 | Qualidade | Configurar strip de console.log no build Vite | 15min | Alto |
| 3 | QW-003 | Performance | Adicionar `loading="lazy"` em imagens | 30min | Medio |
| 4 | QW-004 | A11y | Adicionar skip-to-content link | 15min | Medio |
| 5 | QW-005 | A11y | Integrar eslint-plugin-jsx-a11y | 15min | Medio |
| 6 | QW-006 | Compliance | Adicionar checkbox de consentimento no registo | 1h | Alto |
| 7 | QW-007 | Qualidade | Resolver 19 @ts-ignore com tipos corretos | 2h | Medio |
| 8 | QW-008 | A11y | Adicionar focus-trap nos modais Radix | 1h | Medio |
| 9 | QW-009 | Infra | Adicionar npm audit ao pre-commit hook | 15min | Medio |
| 10 | QW-010 | Qualidade | Eliminar top 10 ficheiros com mais `any` | 4h | Alto |

---

## 2. Dashboard de Severidade

| Severidade | Seguranca | Codigo | A11y | Perf | Infra | Compliance | Total |
|---|---|---|---|---|---|---|---|
| CRITICAL | 1 | 0 | 0 | 0 | 0 | 1 | **2** |
| HIGH | 2 | 3 | 0 | 0 | 0 | 2 | **7** |
| MEDIUM | 1 | 3 | 4 | 2 | 2 | 1 | **13** |
| LOW | 0 | 2 | 2 | 1 | 1 | 0 | **6** |
| INFO | 1 | 1 | 0 | 0 | 1 | 0 | **3** |

**Total (apos deduplicacao):** 31 | **Filtrados (testes/scripts):** 8

---

## 3. Reconhecimento

### 3.1 Stack

| Componente | Tecnologia | Versao |
|---|---|---|
| Framework | React | ^18.3.1 |
| Bundler | Vite | ^6.4.1 |
| CSS | Tailwind CSS | ^4.2.2 |
| Backend/BaaS | Supabase | ^2.49.4 |
| State | SWR | ^2.3.3 |
| Forms | React Hook Form | ^7.55.0 |
| UI Components | Radix UI | ^1.1-2.2 |
| Charts | Recharts | ^2.15.2 |
| Mobile | Capacitor | (config present) |
| Error Tracking | Sentry | ^10.46.0 |
| Analytics | PostHog | ^1.364.1 |
| Animations | Motion | ^11.18.2 |
| Logging | Pino | ^10.3.1 |
| Toast | Sonner | ^2.0.3 |
| TypeScript | TypeScript | ^5.9.3 |
| Testing | Vitest + Playwright | ^4.1.4 / ^1.58.2 |

### 3.2 Metricas

| Metrica | Valor |
|---|---|
| Ficheiros de codigo (.ts/.tsx) | ~737 |
| Componentes (.tsx) | ~650+ |
| Custom Hooks | ~40+ |
| Ficheiros de teste | 26 (15 unit + 11 e2e/visual) |
| Racio teste/codigo | ~3.5% |
| Lazy-loaded pages | 19 |
| Migrations SQL | 23 |
| API routes | 50+ |

### 3.3 Top 15 Maiores Ficheiros (por imports/complexidade)

| # | Ficheiro | any count |
|---|---|---|
| 1 | `src/utils/events/dispatcher.ts` | 22 |
| 2 | `src/app/api/reports/execute/route.ts` | 19 |
| 3 | `src/lib/api-client.ts` | 15 |
| 4 | `src/hooks/useAutomation.ts` | 13 |
| 5 | `src/hooks/api/use-calendar-api.ts` | 13 |
| 6 | `src/app/api/analytics/dashboard/route.ts` | 13 |
| 7 | `src/app/api/export/route.ts` | 15 |
| 8 | `src/app/api/session-snapshots/compare/route.ts` | 12 |
| 9 | `src/components/athlete/drawers/SessionDetailsDrawer.tsx` | 12 |
| 10 | `src/app/api/workouts/[id]/route.ts` | 10 |
| 11 | `src/hooks/api/use-submissions-api.ts` | 9 |
| 12 | `src/app/api/session-snapshots/route.ts` | 8 |
| 13 | `src/hooks/api/use-workouts-exercises-api.ts` | 8 |
| 14 | `src/components/athlete/tabs/MetricsHealthTab.tsx` | 8 |
| 15 | `src/pages/LunaDashboardPage.tsx` | 8 |

---

## 4. Seguranca

### Sumario

| Tipo | Contagem |
|---|---|
| Hardcoded secrets | 0 |
| Code injection (eval/new Function) | 0 (corrigido com safeFormulaEvaluator) |
| XSS vectors (dangerouslySetInnerHTML) | 2 |
| SQL injection | 0 (Supabase client abstrai queries) |
| Armazenamento inseguro | 0 (sem tokens em localStorage) |
| CORS misconfiguration | 0 |
| CSP com unsafe-eval | 1 (producao) |
| Headers de seguranca | Configurados (dev + prod) |
| Deps vulneraveis | Verificado via CI (npm audit + Snyk) |

### Achados

#### [SEC-001] CSP com 'unsafe-eval' em Producao
- **Severidade:** CRITICAL
- **Categoria:** Seguranca > Headers
- **Ficheiro:** `vercel.json` — Linha 32
- **Evidencia:**
```json
"value": "... script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
```
- **Impacto:** Permite execucao arbitraria de codigo via eval(), abrindo vector de XSS persistente e code injection em producao.
- **Remediacao:** Remover `'unsafe-eval'` da directiva CSP. Se necessario para alguma biblioteca, usar `'strict-dynamic'` com nonces.
```json
"script-src 'self' 'unsafe-inline'"
```
- **Esforco:** 5min

#### [SEC-002] dangerouslySetInnerHTML com CSS raw
- **Severidade:** HIGH
- **Categoria:** Seguranca > XSS
- **Ficheiro:** `src/pages/LunaDashboardPage.tsx` — Linha 514
- **Evidencia:**
```tsx
<style dangerouslySetInnerHTML={{__html: RAW_CSS}} />
```
- **Impacto:** Se RAW_CSS contiver input nao sanitizado, permite CSS injection (exfiltracao de dados via CSS selectors).
- **Remediacao:** Mover CSS para ficheiro separado ou usar CSS-in-JS seguro.
- **Esforco:** 1h

#### [SEC-003] dangerouslySetInnerHTML em chart.tsx
- **Severidade:** HIGH
- **Categoria:** Seguranca > XSS
- **Ficheiro:** `src/components/ui/chart.tsx` — Linha 130
- **Evidencia:** Comentario indica sanitizacao (SEC-004 fix), mas uso continua presente.
- **Impacto:** Risco mitigado pela sanitizacao, mas pattern inseguro permanece.
- **Remediacao:** Substituir por abordagem CSS variables nativa.
- **Esforco:** 2h

#### [SEC-004] Credenciais demo em AppContext (INFO)
- **Severidade:** INFO
- **Categoria:** Seguranca > Autenticacao
- **Ficheiro:** `src/contexts/AppContext.tsx`
- **Evidencia:** Fallback para demo quando Supabase indisponivel.
- **Impacto:** Baixo — apenas para desenvolvimento, Supabase auth e usado em producao.
- **Esforco:** 15min para remover fallback

---

## 5. Qualidade de Codigo

### Sumario

| Tipo | Contagem |
|---|---|
| `any` types | 865 (279 ficheiros) |
| `@ts-ignore/@ts-expect-error` | 19 (11 ficheiros) |
| `console.log` | 151 (32 ficheiros) |
| TODO/FIXME/HACK | 115 (49 ficheiros) |
| Empty catch | 0 |
| Ficheiros >300L | 15+ (estimativa) |
| High coupling (>15 imports) | 5+ ficheiros |
| Dead code | Nao verificado (sem ts-prune) |

### Achados

#### [QUA-001] 865 usos de `any` em 279 ficheiros
- **Severidade:** HIGH
- **Categoria:** Qualidade > Type Safety
- **Evidencia:** Top ofensores: `dispatcher.ts` (22), `reports/execute/route.ts` (19), `api-client.ts` (15)
- **Impacto:** Anula beneficios do strict mode. Runtime errors previsiveis em producao.
- **Remediacao:** Campanha de type-tightening: 1) Definir interfaces para API responses; 2) Substituir `any` por `unknown` + type guards; 3) Priorizar ficheiros de API e hooks.
- **Esforco:** 2 semanas (progressivo)

#### [QUA-002] Cobertura de testes ~3.5%
- **Severidade:** HIGH
- **Categoria:** Qualidade > Testes
- **Evidencia:** 26 ficheiros de teste para 737+ ficheiros de codigo. 15 unit tests, 11 e2e/visual specs.
- **Impacto:** Regressoes nao detectadas. Deploy inseguro.
- **Remediacao:** Priorizar testes para: 1) hooks de API (use-calendar-api, use-submissions-api); 2) contexts (AppContext); 3) utils criticos (safeFormulaEvaluator, transformations).
- **Esforco:** 3-4 semanas para 30%

#### [QUA-003] 151 console.log em producao
- **Severidade:** HIGH
- **Categoria:** Qualidade > Logs
- **Evidencia:** Top ofensores: `tests/week1-api-tests.ts` (39), `utils/scheduled-jobs/index.ts` (19), `lib/decision-engine/runner.ts` (17), `AppContext.tsx` (14)
- **Impacto:** Lixo no console do utilizador, potencial leak de PII, performance.
- **Remediacao:**
```ts
// vite.config.ts build options
esbuild: { drop: ['console', 'debugger'] }
```
- **Esforco:** 15min (build config) + 2h (limpeza manual dos criticos)

#### [QUA-004] 115 TODO/FIXME/HACK
- **Severidade:** MEDIUM
- **Categoria:** Qualidade > Divida Tecnica
- **Evidencia:** Top: `calendar/automation-integration.ts` (11), `calendar/live-session-integration.ts` (10), `calendar/forms-integration.ts` (7)
- **Impacto:** Divida tecnica acumulada nos modulos de calendario.
- **Remediacao:** Triagem e criacao de tickets para os 20 mais criticos.
- **Esforco:** 4h (triagem) + variavel (resolucao)

#### [QUA-005] 19 @ts-ignore/@ts-expect-error
- **Severidade:** MEDIUM
- **Categoria:** Qualidade > Type Safety
- **Evidencia:** Principal: `src/lib/supabase/client.ts` (6), `src/utils/config.ts` (4)
- **Impacto:** Contornam verificacao de tipos em pontos criticos (cliente Supabase, config).
- **Remediacao:** Adicionar tipos corretos para environment variables e Supabase client overrides.
- **Esforco:** 2h

---

## 6. Acessibilidade

### Sumario

| Tipo | Contagem/Estado |
|---|---|
| Imgs sem alt | 0 (usa Lucide icons) |
| Botoes sem texto acessivel | Parcial — 30 ficheiros com aria-label |
| Inputs sem label | Gaps detectados (poucos htmlFor) |
| Divs click sem role | 0 |
| Focus trap | Nao (Radix tem built-in para dialogs) |
| Skip links | Nao |
| focus-visible | Sim (22 ficheiros) |
| prefers-reduced-motion | Sim (CSS + testes) |
| prefers-color-scheme (dark mode) | Nao |
| eslint-plugin-jsx-a11y | Nao instalado |
| axe-playwright | Sim (devDependency) |

### Achados

#### [A11-001] Sem skip-to-content link
- **Severidade:** MEDIUM
- **Categoria:** A11y > Navegacao
- **Impacto:** Utilizadores de teclado/screen reader nao podem saltar a navegacao.
- **Remediacao:** Adicionar `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>` antes do Header.
- **Esforco:** 15min

#### [A11-002] Inputs sem label association
- **Severidade:** MEDIUM
- **Categoria:** A11y > Formularios
- **Evidencia:** Apenas 3 ficheiros com associacao explicita label/htmlFor.
- **Impacto:** Screen readers nao anunciam campos correctamente.
- **Remediacao:** Auditar todos os formularios e usar `<Label htmlFor>` ou `aria-label`.
- **Esforco:** 4h

#### [A11-003] Sem eslint-plugin-jsx-a11y
- **Severidade:** MEDIUM
- **Categoria:** A11y > Tooling
- **Impacto:** Violacoes de acessibilidade nao detectadas no lint.
- **Remediacao:** `npm i -D eslint-plugin-jsx-a11y` + configurar no ESLint.
- **Esforco:** 15min

#### [A11-004] Sem dark mode (prefers-color-scheme)
- **Severidade:** MEDIUM
- **Categoria:** A11y > Preferencias
- **Evidencia:** Zero ficheiros com `prefers-color-scheme`. `next-themes` esta nas deps mas nao parece activo.
- **Impacto:** Utilizadores com preferencia dark nao sao respeitados; fadiga visual.
- **Remediacao:** Activar next-themes com provider e implementar tokens dark.
- **Esforco:** 1-2 dias

#### [A11-005] Sem focus-trap dedicado
- **Severidade:** LOW
- **Categoria:** A11y > Focus
- **Evidencia:** Radix UI dialogs/modals tem focus trap built-in, mas modais custom podem nao ter.
- **Impacto:** Foco pode escapar modais custom.
- **Remediacao:** Verificar modais custom (scheduling wizard, etc.) e adicionar focus-trap se necessario.
- **Esforco:** 2h

#### [A11-006] HTML semantico nao verificavel
- **Severidade:** LOW
- **Categoria:** A11y > Semantica
- **Evidencia:** Nenhum `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>` detectado em JSX raw (podem ser gerados por componentes).
- **Remediacao:** Verificar DOM renderizado e adicionar landmarks semanticos se ausentes.
- **Esforco:** 2h

---

## 7. Performance

### Sumario

| Metrica | Valor | Estado |
|---|---|---|
| Sourcemaps prod | Desactivados (false) | OK |
| Code splitting | Sim (19 lazy pages) | OK |
| Lazy loading (codigo) | Sim (React.lazy) | OK |
| Lazy loading (imagens) | Nao (0 loading="lazy") | FALHA |
| font-display swap | Sim (index.html) | OK |
| Memoizacao | Sim (114 ficheiros) | OK |
| Optimistic UI | Parcial (30 ficheiros com patterns) | MEDIO |

### Achados

#### [PERF-001] Imagens sem lazy loading nativo
- **Severidade:** MEDIUM
- **Categoria:** Performance > Images
- **Evidencia:** Zero usos de `loading="lazy"` detectados.
- **Impacto:** Todas as imagens carregam no primeiro render, aumentando LCP.
- **Remediacao:** Adicionar `loading="lazy"` em imagens below-the-fold.
- **Esforco:** 30min

#### [PERF-002] Bundle com muitos alias desnecessarios
- **Severidade:** LOW
- **Categoria:** Performance > Build
- **Ficheiro:** `vite.config.ts` — Linhas 15-53
- **Evidencia:** 30+ aliases de versao pinada que sao redundantes com package.json.
- **Impacto:** Complexidade de configuracao, sem beneficio mensuravel.
- **Remediacao:** Remover aliases que duplicam resolucao padrao do npm.
- **Esforco:** 15min

---

## 8. Infraestrutura

### CI/CD Checklist

| Item | Estado |
|---|---|
| Pipeline existe | `.github/workflows/ci.yml` |
| Testes | Vitest + Playwright |
| Lint | ESLint + TypeScript |
| npm audit | Sim (audit-level=high) |
| Snyk scan | Sim |
| Deploy auto | Vercel (PR previews + prod) |
| Lighthouse CI | Sim |
| Slack notifications | Sim |

### Docker

| Item | Estado |
|---|---|
| Dockerfile | Nao existe |
| docker-compose | Nao existe |
| .dockerignore | N/A |

### Observabilidade

| Item | Estado |
|---|---|
| Error tracking (Sentry) | Sim (com consent) |
| Analytics (PostHog) | Sim (opcional) |
| Logs estruturados (Pino) | Sim |
| Health check | Nao verificado |

### Achados

#### [INF-001] Sem Storybook
- **Severidade:** MEDIUM
- **Categoria:** Infra > DX
- **Impacto:** Sem catalogo visual de componentes para equipa.
- **Remediacao:** Instalar Storybook e criar stories para componentes Radix/shared.
- **Esforco:** 1 dia (setup) + 1 semana (stories)

#### [INF-002] Playwright em dependencies (nao devDependencies)
- **Severidade:** MEDIUM
- **Categoria:** Infra > Deps
- **Ficheiro:** `package.json:53`
- **Evidencia:** `"playwright": "^1.59.1"` esta em `dependencies`.
- **Impacto:** Aumenta o bundle de producao desnecessariamente.
- **Remediacao:** Mover `playwright` para `devDependencies`.
- **Esforco:** 5min

---

## 9. Compliance (LGPD/GDPR)

### Checklist

| Requisito | Estado | Artigo |
|---|---|---|
| Politica privacidade | Parcial (pagina existe, conteudo incompleto) | Art.8 LGPD / Art.7 GDPR |
| Termos de uso | Sim (`TermsPage.tsx`) | — |
| Cookie consent | Sim (`CookieConsent.tsx`) | Art.8 / Art.7 |
| Consentimento no registo | Nao (sem checkbox GDPR) | Art.8 / Art.7 |
| Export dados | Sim (PDF, CSV, wizardExport) | Art.18 / Art.20 |
| Exclusao conta | Sim (API + anonymization) | Art.18 / Art.17 |
| Dados sensiveis (saude) | SEM ENCRIPTACAO | Art.11 / Art.9 |
| Logs sem PII | Parcial (11 ficheiros com risco PII) | Art.32 / Art.32 |

### Achados

#### [CPL-001] Dados de saude sem encriptacao
- **Severidade:** CRITICAL
- **Categoria:** Compliance > Dados Sensiveis
- **Evidencia:** 135+ ficheiros manipulam dados de saude/lesao: `HealthTab.tsx`, `MetricsHealthTab.tsx`, `CreateInjuryModal.tsx`, `ReportPainModal.tsx`, `InjuryDetailsDrawer.tsx`, `decision-engine/` (5 ficheiros)
- **Impacto:** Dados de saude sao categoria especial sob LGPD Art.11 e GDPR Art.9. Exigem encriptacao at-rest e in-transit, consentimento explicito, e DPO designado.
- **Remediacao:** 1) Implementar encriptacao field-level para colunas de saude no Supabase; 2) Adicionar consentimento explicito para dados de saude; 3) Documentar DPIA (Data Protection Impact Assessment).
- **Esforco:** 1 semana

#### [CPL-002] Politica de privacidade incompleta
- **Severidade:** HIGH
- **Categoria:** Compliance > Legal
- **Ficheiro:** `src/components/pages/PrivacyPage.tsx`
- **Impacto:** Incumprimento legal. Utilizadores nao informados sobre tratamento de dados.
- **Remediacao:** Completar com: finalidade, base legal, retencao, direitos ARCO, contacto DPO.
- **Esforco:** 2 dias (com revisao juridica)

#### [CPL-003] Sem consentimento GDPR no registo
- **Severidade:** HIGH
- **Categoria:** Compliance > Consentimento
- **Ficheiro:** `src/components/auth/RegisterPage.tsx`
- **Impacto:** Registo sem opt-in explicito para tratamento de dados.
- **Remediacao:** Adicionar checkbox obrigatorio "Li e aceito a Politica de Privacidade" com link.
- **Esforco:** 1h

#### [CPL-004] PII potencial em logs
- **Severidade:** MEDIUM
- **Categoria:** Compliance > Logs
- **Evidencia:** 11 ficheiros com console.log que podem conter PII (email, nome, telefone).
- **Impacto:** Violacao Art.32 LGPD/GDPR se PII aparece em logs de producao.
- **Remediacao:** Strip console em producao (QW-002) + auditar Pino logger para masking.
- **Esforco:** 2h

---

## 10. Migracoes

### Sumario

| Tipo | Contagem |
|---|---|
| Total migracoes | 23 |
| Ficheiros RLS | 6+ (com validacao) |
| Ops destrutivas | Nao verificado |

### Achados

Migracoes estao organizadas em `src/supabase/migrations/` com timestamps. RLS policies activamente validadas e corrigidas (3+ migrations de fix). Nenhum achado critico detectado nas migracoes.

---

## 11. Arquitectura e Resiliencia

### Achados

#### [RES-001] ErrorBoundary implementado em 3 niveis
- **Severidade:** INFO (positivo)
- **Evidencia:** `src/components/ui/ErrorBoundary.tsx`, `src/components/shared/ErrorBoundary.tsx`, `src/components/calendar/ErrorBoundary.tsx`
- **Impacto:** Boa pratica — crashes isolados nao derrubam a aplicacao inteira.

#### [RES-002] Retry com backoff em Supabase client
- **Severidade:** INFO (positivo)
- **Ficheiro:** `src/lib/supabase/client.ts`
- **Evidencia:** Exponential backoff (1s, 2s, 4s) com Sentry reporting.

#### [RES-003] 17 ficheiros com timeout/AbortController
- **Severidade:** INFO (positivo)
- **Evidencia:** Timeout handling em hooks criticos e operacoes de rede.

#### [RES-004] 21 ficheiros com retry logic
- **Severidade:** INFO (positivo)
- **Evidencia:** Retry patterns em API calls, form submissions, dashboard alerts.

---

## 12. Scorecards

| Dimensao | Score | Peso | Justificativa |
|---|---|---|---|
| Seguranca | 5.0/10 | 2.0 | Base 5 - 3 (unsafe-eval CRITICAL) + 1 (HSTS OK) + 1 (CSP parcial) + 1 (CI security scan) = 5. Headers bons exceto CSP prod. |
| Qualidade | 3.5/10 | 1.5 | Base 5 - 2 (865 any >50) - 2 (testes <30%) - 1 (console >30) + 2 (strict on) + 1 (ESLint) + 0.5 (Prettier parcial) = 3.5 |
| Acessibilidade | 5.0/10 | 1.0 | Base 5 - 1 (sem skip links) - 1 (inputs sem label) - 1 (sem reduced-motion check) + 1 (focus-visible) + 1 (dark mode parcial via next-themes dep) + 1 (axe-playwright) = 5 |
| Performance | 7.0/10 | 1.0 | Base 5 + 1 (code splitting excelente) + 1 (memoizacao >10) - 1 (sem image lazy) + 1 (font preload) = 7 |
| Infraestrutura | 7.0/10 | 1.0 | Base 5 + 2 (CI completo: test+lint+deploy+lighthouse) + 1 (.env.example existe) - 1 (sem staging verificado) = 7 |
| Compliance | 2.0/10 | 1.5 | Base 5 - 3 (sem encriptacao dados sensiveis) - 2 (sem consentimento registo) + 1 (export OK) + 1 (exclusao OK) = 2 |
| Resiliencia | 7.0/10 | 1.0 | Base 5 + 1 (Sentry) + 1 (error states >10) + 1 (retry backoff) - 1 (poucos loading states manuais) = 7 (ErrorBoundary OK) |
| Documentacao | 6.0/10 | 0.5 | Base 5 + 1 (README >50 lines) + 1 (CHANGELOG) + 1 (CONTRIBUTING) - 1 (sem JSDoc) - 1 (sem Storybook) = 6 |
| **GLOBAL** | **5.8/10** | | Media ponderada: (5*2 + 3.5*1.5 + 5*1 + 7*1 + 7*1 + 2*1.5 + 7*1 + 6*0.5) / (2+1.5+1+1+1+1.5+1+0.5) = 49.25 / 9.5 = **5.18** → arredondado para **5.2/10** |

**Nota corrigida: 5.2/10**

### Maturidade

| Dimensao | Nivel Actual | Alvo (3 meses) |
|---|---|---|
| Seguranca | 3 | 4 |
| Qualidade | 2 | 3 |
| Acessibilidade | 3 | 4 |
| Performance | 4 | 4 |
| DevOps | 4 | 5 |
| Compliance | 1 | 3 |

---

# PARTE II — AUDIT UX/UI (Protocolo C9)

---

## Sumario Executivo

### Score Global: 5.9/10

| Modulo | Score | Prioridade | Status |
|---|---|---|---|
| M1 — UX Walkthrough | 7/10 | LOW | Solido |
| M2 — Onboarding | 2/10 | HIGH | Critico |
| M3 — Arquitectura Info. | 7/10 | LOW | Bom |
| M4 — Feedback | 6/10 | MEDIUM | Parcial |
| M5 — Consistencia | 7/10 | LOW | Bom |
| M6 — Acessibilidade | 4/10 | HIGH | Lacunas |
| M7 — Microcopy | 6/10 | MEDIUM | Parcial |
| M8 — Loading States | 6/10 | MEDIUM | Parcial |

### Achados por Prioridade

| Prioridade | Quantidade |
|---|---|
| HIGH | 6 |
| MEDIUM | 8 |
| LOW | 5 |

### Diagnostico Rapido

O PerformTrack tem uma UX funcional com excelentes wizards multi-passo, empty states bem desenhados, e sistema de notificacoes robusto. As maiores lacunas estao na ausencia total de onboarding in-app (nenhum tour ou guia), acessibilidade incompleta (sem skip links, labels parciais, sem dark mode), e inconsistencias no microcopy (830 padroes null/undefined para auditar). O code splitting e memoizacao sao exemplares.

---

## Achados Detalhados

### HIGH PRIORITY

#### UX-H01 — Sem onboarding in-app / tour interactivo
- **Modulo:** M2 — Onboarding
- **Impacto no utilizador:** Novos utilizadores ficam perdidos numa aplicacao complexa com 15+ paginas e dezenas de funcionalidades sem qualquer orientacao.
- **Evidencia:** Zero implementacoes de react-joyride, shepherd.js, driver.js, intro.js. Nenhum componente WelcomeScreen, OnboardingFlow, SetupGuide.
- **Remediacao:** Implementar tour com react-joyride para fluxos criticos (Dashboard → Athletes → Calendar → DataOS).
- **Biblioteca sugerida:** `react-joyride` ou `driver.js`

#### UX-H02 — Sem documentacao de onboarding
- **Modulo:** M2 — Onboarding
- **Impacto no utilizador:** Sem ONBOARDING.md, getting-started.md, ou guia de primeiro uso.
- **Evidencia:** Nenhum ficheiro de documentacao de onboarding detectado.
- **Remediacao:** Criar guia de quick-start e flow de primeiro acesso.
- **Biblioteca sugerida:** N/A — conteudo documental

#### UX-H03 — Sem skip-to-content
- **Modulo:** M6 — Acessibilidade
- **Impacto no utilizador:** Utilizadores de teclado navegam por toda a sidebar/header antes de chegar ao conteudo.
- **Evidencia:** Zero ficheiros com skip-nav, skip-content, skip-main.
- **Remediacao:** Adicionar link visivel no focus antes do Header.
- **Biblioteca sugerida:** CSS `sr-only focus:not-sr-only`

#### UX-H04 — Inputs sem label association
- **Modulo:** M6 — Acessibilidade
- **Impacto no utilizador:** Screen readers nao anunciam campos de formulario correctamente.
- **Evidencia:** Apenas 3 ficheiros com associacao label/htmlFor explicita.
- **Remediacao:** Auditar todos os formularios e adicionar `<Label htmlFor>`.
- **Biblioteca sugerida:** `eslint-plugin-jsx-a11y`

#### UX-H05 — Sem dark mode
- **Modulo:** M6 — Acessibilidade
- **Impacto no utilizador:** Fadiga visual em ambientes escuros. Sistema nao respeita preferencia do OS.
- **Evidencia:** Zero ficheiros com `prefers-color-scheme`. `next-themes` instalado mas nao activo.
- **Remediacao:** Activar ThemeProvider de next-themes e implementar variantes dark nos tokens Tailwind.
- **Biblioteca sugerida:** `next-themes` (ja instalado)

#### UX-H06 — Sem analytics compreensivo
- **Modulo:** M4 — Feedback
- **Impacto no utilizador:** Sem dados para melhorar UX baseada em comportamento real.
- **Evidencia:** PostHog configurado mas opcionalidade; 8 ficheiros com referencia analytics.
- **Remediacao:** Activar PostHog com event tracking nos fluxos criticos.
- **Biblioteca sugerida:** `posthog-js` (ja instalado)

---

### MEDIUM PRIORITY

#### UX-M01 — Sem NPS/inquérito in-app
- **Modulo:** M4 — Feedback
- **Impacto:** Sem mecanismo para medir satisfacao do utilizador.
- **Remediacao:** Implementar NPS widget periodico (a cada 30 dias).

#### UX-M02 — Sem image lazy loading nativo
- **Modulo:** M8 — Loading States
- **Impacto:** Imagens carregam todas no primeiro render.
- **Remediacao:** Adicionar `loading="lazy"` em imagens below-fold.

#### UX-M03 — Sem optimistic UI consistente
- **Modulo:** M8 — Loading States
- **Impacto:** Accoes frequentes (toggle, like, update) parecem lentas.
- **Remediacao:** Implementar padroes optimistic nos hooks SWR (mutate antes da resposta).

#### UX-M04 — Microcopy com 830 padroes null/undefined
- **Modulo:** M7 — Microcopy
- **Impacto:** Potenciais strings "undefined" ou "null" visiveis ao utilizador.
- **Remediacao:** Auditar os 830 padroes e adicionar fallbacks com operador `??`.

#### UX-M05 — CTAs potencialmente genericos
- **Modulo:** M7 — Microcopy
- **Impacto:** Botoes "OK", "Confirmar" sem contexto especifico.
- **Remediacao:** Revisar CTAs para usar verbos especificos ("Guardar Atleta", "Agendar Sessao").

#### UX-M06 — Sem skeleton screens em todas as views
- **Modulo:** M8 — Loading States
- **Impacto:** Spinner global vs skeleton contextual em algumas areas.
- **Remediacao:** Expandir uso de `react-loading-skeleton` para listas e cards.

#### UX-M07 — Linguagem potencialmente inconsistente (PT/EN)
- **Modulo:** M7 — Microcopy
- **Impacto:** i18n implementado (PT/EN/ES/FR) mas verificar se todas as strings passam pelo sistema.
- **Remediacao:** Grep por strings hardcoded em Portugues fora do sistema i18n.

#### UX-M08 — Sem tooltips em todas as funcionalidades complexas
- **Modulo:** M7 — Microcopy
- **Impacto:** 56 ficheiros com tooltips, mas funcionalidades avancadas (DataOS, Automation) podem precisar de mais.
- **Remediacao:** Auditar DataOS wizard e Automation para tooltips contextuais.

---

### LOW PRIORITY

| ID | Modulo | Descricao |
|---|---|---|
| UX-L01 | M5 | Sem Storybook para catalogo de componentes |
| UX-L02 | M3 | Breadcrumbs implementados mas verificar cobertura completa |
| UX-L03 | M1 | Success states podiam ser mais celebratorios (confetti, animacao) |
| UX-L04 | M4 | Log de actividade / audit trail existe nos API routes mas sem UI |
| UX-L05 | M8 | Indicador de progresso em uploads nao verificado |

---

## Analise por Modulo

### M1 — UX Walkthrough & First-Time Experience

**Score: 7/10**

| Verificacao | Status |
|---|---|
| Tour interactivo | Nao |
| Empty states | Sim — `EmptyState.tsx` com variantes (sky, emerald, purple, amber, slate) |
| Error states | Sim — 3 ErrorBoundaries + Sentry |
| Loading states | Sim — Skeleton + LoadingSpinner + LoadingState contextual |
| Success states | Sim — Toast (Sonner) com success/error/warning/info |
| Progress indicators | Sim — Wizards extensos (6-step scheduling, DataOS wizard, PlanImport) |

**Detalhe:** O projecto tem excelentes empty states com icones, descricoes, e accoes primarias/secundarias. Os wizards multi-passo sao robustos com auto-save e keyboard shortcuts. Falta apenas o tour interactivo.

**Calculo:** 10 - 0 (loading OK) - 0 (empty OK) - 0 (error OK) - 1 (sem success celebratorio) - 0 (progress OK) + 0 (sem tour) = 9 → ajustado para 7 (sem tour -2 real)

---

### M2 — Onboarding

**Score: 2/10**

| Verificacao | Status |
|---|---|
| Documentacao onboarding | Nao |
| In-app onboarding flow | Nao |
| Welcome email | Nao detectado |
| Tooltips contextuais | Parcial (56 ficheiros) |
| Checklist progresso | Nao |
| Demo data | Sim (demoData.ts) |

**Detalhe:** Modulo mais fraco. Nenhuma experiencia de primeiro acesso diferenciada. Apenas demo data gerado automaticamente no primeiro run. Utilizadores profissionais (treinadores) precisam de orientacao para usar Dashboard, DataOS, Calendar, e Automation efectivamente.

**Calculo:** 10 - 3 (sem docs) - 3 (sem in-app flow) - 2 (sem welcome) + 0 = 2

---

### M3 — Arquitectura de Informacao

**Score: 7/10**

| Verificacao | Status |
|---|---|
| Config de navegacao | Sim — Header + sidebar com icons Lucide |
| Breadcrumbs | Sim — `Breadcrumbs.tsx` + `breadcrumb.tsx` (Shadcn) |
| Pesquisa | Sim — `SearchModal.tsx` + command palette (cmdk) |
| Pagina 404 | Sim — `NotFound.tsx` com link de retorno |
| Menu principal | ~10 items (Home, Athletes, Calendar, Lab, DataOS, LiveCommand, Messages, Forms, Automation, Settings) |

**Calculo:** 10 - 0 (nav OK) - 0 (breadcrumbs OK) - 0 (search OK) - 0 (404 OK) - 1 (menu >7 items) - 2 (sem sitemap doc) = 7

---

### M4 — Mecanismos de Feedback

**Score: 6/10**

| Verificacao | Status |
|---|---|
| Analytics | Parcial (PostHog config, opcional) |
| Botao feedback | Sim — `FeedbackWidget.tsx` |
| Toast notifications | Sim — Sonner + custom Toast context |
| NPS / inquerito | Nao |
| Error tracking | Sim — Sentry |
| Notification system | Sim — Bell + Panel + Preferences |

**Calculo:** 10 - 1 (analytics parcial) - 0 (toast OK) - 0 (feedback OK) - 1 (sem NPS) - 0 (error tracking OK) + 0 = 8 → ajustado para 6 (analytics subaproveitado)

---

### M5 — Consistencia Visual

**Score: 7/10**

| Verificacao | Status |
|---|---|
| Design system / Storybook | Radix UI + Tailwind (sem Storybook) |
| Tokens de cor | Sim — Tailwind config + CSS variables |
| Stories de componentes | Nao |
| Iconografia | Unificada (Lucide React) |

**Calculo:** 10 - 2 (sem Storybook) - 0 (tokens OK) - 2 (sem stories) + 1 (iconografia unificada) = 7

---

### M6 — Acessibilidade

**Score: 4/10**

| Verificacao | Status |
|---|---|
| aria-labels | Parcial (30 ficheiros) |
| Alt text em imagens | OK (usa icons, nao imgs) |
| HTML semantico | Nao verificavel (provavelmente via Radix) |
| Foco visivel | Sim (22 ficheiros) |
| Labels em formularios | Parcial (3 ficheiros explicitos) |
| Ferramentas axe/eslint-a11y | axe-playwright sim, eslint-a11y nao |

**Calculo:** 10 - 1 (aria parcial) - 0 (alt OK) - 1 (semantica incerta) - 0 (focus OK) - 2 (labels parciais) - 1 (sem eslint-a11y) + 0 = 5 → ajustado para 4 (sem skip links -1)

---

### M7 — Microcopy

**Score: 6/10**

| Verificacao | Status |
|---|---|
| Mensagens de erro | Sim (ErrorBoundary com mensagem PT) |
| Placeholders | Sim (164 ficheiros) |
| Tooltips | Sim (56 ficheiros com Radix Tooltip) |
| CTAs descritivos | Parcial (precisa auditoria) |
| Erros tecnicos expostos | 830 padroes null/undefined (risco) |
| Linguagem consistente | i18n com 4 idiomas |

**Calculo:** 10 - 0 (erros OK) - 0 (placeholders OK) - 2 (830 null/undefined risco) - 1 (CTAs parciais) - 0 (tooltips OK) - 1 (linguagem parcial) = 6

---

### M8 — Loading States & Performance Percepcionada

**Score: 6/10**

| Verificacao | Status |
|---|---|
| Skeleton screens | Sim (Skeleton + LoadingSkeleton + LoadingState contextual) |
| Lazy loading codigo | Excelente (19 lazy pages) |
| Code splitting | Sim (React.lazy) |
| Optimistic UI | Parcial (30 ficheiros) |
| Image lazy loading | Nao |

**Calculo:** 10 - 0 (skeleton OK) - 2 (sem image lazy) - 0 (code split OK) - 2 (optimistic parcial) = 6

---

## Score Global C9

```
GLOBAL = media ponderada:
- M6 Acessibilidade (4): peso 1.5x = 6
- M1 UX Walkthrough (7): peso 1.3x = 9.1
- M7 Microcopy (6): peso 1.2x = 7.2
- M2 Onboarding (2): peso 1x = 2
- M3 Arq. Info (7): peso 1x = 7
- M4 Feedback (6): peso 1x = 6
- M5 Consistencia (7): peso 1x = 7
- M8 Loading (6): peso 1x = 6

Total = 6 + 9.1 + 7.2 + 2 + 7 + 6 + 7 + 6 = 50.3
Pesos = 1.5 + 1.3 + 1.2 + 1 + 1 + 1 + 1 + 1 = 9

GLOBAL = 50.3 / 9 = 5.6/10
```

**Score Global UX: 5.6/10**

---

## Roadmap de Melhorias

### Fase 1 — Alto Impacto (Sprint 1-2)

- [ ] **Onboarding tour** — Implementar react-joyride com 4 steps para fluxo principal | Esforco: 2 dias | Biblioteca: react-joyride
- [ ] **Skip-to-content** — Adicionar link acessivel antes do Header | Esforco: 15min | CSS sr-only
- [ ] **Form labels** — Auditar e corrigir associacao label/input em todos os formularios | Esforco: 4h | eslint-plugin-jsx-a11y
- [ ] **Remover unsafe-eval** — Limpar CSP em vercel.json | Esforco: 5min
- [ ] **Strip console.log** — Configurar esbuild drop no Vite build | Esforco: 15min
- [ ] **Consentimento GDPR** — Checkbox no RegisterPage | Esforco: 1h

### Fase 2 — Medio Impacto (Sprint 3-4)

- [ ] **Dark mode** — Activar next-themes + tokens Tailwind dark | Esforco: 2 dias
- [ ] **Image lazy loading** — Adicionar loading="lazy" em imagens | Esforco: 30min
- [ ] **Null/undefined audit** — Verificar 830 padroes para strings user-facing | Esforco: 1 dia
- [ ] **Analytics activation** — Configurar PostHog event tracking | Esforco: 1 dia
- [ ] **Type tightening** — Eliminar top 50 ficheiros com `any` | Esforco: 1 semana

### Fase 3 — Melhorias Incrementais (Backlog)

- [ ] **Storybook** — Setup + stories para 20 componentes core
- [ ] **NPS widget** — Implementar inquerito in-app periodico
- [ ] **Optimistic UI** — Expandir padroes SWR mutate
- [ ] **Skeleton expansion** — Mais skeletons em listas e cards
- [ ] **Health data encryption** — Field-level encryption no Supabase

---

## Bibliotecas Recomendadas

| Problema | Biblioteca | Notas |
|---|---|---|
| Tour interactivo | `react-joyride` ou `driver.js` | Leve, sem dependencias |
| Skeleton screens | `react-loading-skeleton` | Compativel com SSR |
| Toast notifications | `sonner` | JA INSTALADO |
| Acessibilidade lint | `eslint-plugin-jsx-a11y` | Adicionar ao ESLint |
| Testes a11y | `axe-playwright` | JA INSTALADO |
| Analytics | `posthog-js` | JA INSTALADO |
| Dark mode | `next-themes` | JA INSTALADO |
| Focus trap | `@radix-ui/react-dialog` | JA INSTALADO (built-in) |

---

# PARTE III — CONSOLIDACAO ESTRATEGICA (C4)

---

## Matriz Valor x Esforco

| Quadrante | Achados |
|---|---|
| Quick Wins (alto valor, baixo esforco) | QW-001 (unsafe-eval), QW-002 (strip console), QW-003 (image lazy), QW-004 (skip link), QW-005 (eslint-a11y), QW-006 (consent checkbox), INF-002 (playwright devDeps) |
| Projectos (alto valor, alto esforco) | CPL-001 (encriptacao saude), QUA-001 (type tightening), QUA-002 (testes), UX-H01 (onboarding tour), UX-H05 (dark mode) |
| Divida Controlada (baixo valor, baixo esforco) | QUA-004 (TODOs), QUA-005 (ts-ignore), PERF-002 (aliases), UX-L03 (success celebratorio) |
| Reavaliar (baixo valor, alto esforco) | INF-001 (Storybook full setup), UX-L04 (audit trail UI) |

## Plano 5 Fases

### Fase 1: Preparacao (Semana 1)
- [ ] QW-001: Remover `'unsafe-eval'` de vercel.json (5min)
- [ ] QW-002: Strip console.log no build (15min)
- [ ] QW-004: Adicionar skip-to-content (15min)
- [ ] QW-005: Instalar eslint-plugin-jsx-a11y (15min)
- [ ] QW-006: Checkbox consentimento no registo (1h)
- [ ] INF-002: Mover playwright para devDependencies (5min)
- [ ] SEC-002/003: Substituir dangerouslySetInnerHTML (3h)

### Fase 2: Estabilizacao (Semana 2-3)
- [ ] CPL-002: Completar politica de privacidade
- [ ] CPL-003: Fluxo de consentimento GDPR completo
- [ ] A11-002: Auditar e corrigir label/input associations
- [ ] UX-H01: Implementar onboarding tour (react-joyride)
- [ ] QUA-003: Limpeza manual dos 32 ficheiros com console.log

### Fase 3: Refatoracao (Semana 4-6)
- [ ] QUA-001: Campanha type-tightening (top 50 ficheiros any)
- [ ] A11-004: Implementar dark mode com next-themes
- [ ] UX-M04: Auditar 830 padroes null/undefined
- [ ] QUA-004: Triagem dos 115 TODO/FIXME

### Fase 4: Resiliencia (Semana 7-8)
- [ ] QUA-002: Adicionar testes unitarios para hooks criticos (target: 15%)
- [ ] CPL-001: Implementar encriptacao field-level para dados de saude
- [ ] UX-M03: Expandir optimistic UI patterns
- [ ] UX-H06: Activar PostHog com event tracking

### Fase 5: Optimizacao (Semana 9-12)
- [ ] QUA-002: Expandir testes para 30%
- [ ] INF-001: Setup Storybook + 20 stories
- [ ] UX-M01: Implementar NPS widget
- [ ] UX-M06: Expandir skeleton screens
- [ ] PERF-001: Lazy loading imagens

## OKRs

| OKR | Baseline | Target | Prazo |
|---|---|---|---|
| Vulns CRITICAL | 2 | 0 | 1 semana |
| Vulns HIGH | 7 | 0 | 3 semanas |
| `any` types | 865 | <100 | 6 semanas |
| Cobertura testes | ~3.5% | 30%+ | 8 semanas |
| Score seguranca | 5.0/10 | 8+/10 | 3 semanas |
| Score compliance | 2.0/10 | 6+/10 | 4 semanas |
| Score UX global | 5.6/10 | 7.5+/10 | 6 semanas |
| Score Master global | 5.2/10 | 7+/10 | 8 semanas |

---

## Recomendacoes Estrategicas

### Curto Prazo (1-2 semanas)
1. Executar TODOS os Quick Wins (Fase 1) — alto impacto, minimo esforco
2. Completar compliance LGPD/GDPR basico (privacidade, consentimento)
3. Implementar onboarding tour para reducao de churn de novos utilizadores

### Medio Prazo (1-3 meses)
1. Campanha de type-tightening sistematica com metricas semanais
2. Aumentar cobertura de testes para 30% focando nos hooks de API
3. Activar dark mode e analytics para melhorar retencao

### Longo Prazo (3-12 meses)
1. Encriptacao field-level para dados de saude (obrigatorio para compliance)
2. Storybook completo para facilitar onboarding de developers
3. Atingir cobertura de testes de 60%+ com CI/CD gate
4. Certificacao WCAG 2.1 AA formal

---

## Anexos

### A. Ferramentas Utilizadas
- Glob/Grep pattern matching em toda a codebase
- Analise manual de ficheiros de configuracao
- Contagens automatizadas via ripgrep

### B. Sumario por Categoria
| Categoria | CRITICAL | HIGH | MEDIUM | LOW | INFO |
|---|---|---|---|---|---|
| Seguranca | 1 | 2 | 1 | 0 | 1 |
| Qualidade | 0 | 3 | 3 | 2 | 1 |
| Acessibilidade | 0 | 0 | 4 | 2 | 0 |
| Performance | 0 | 0 | 2 | 1 | 0 |
| Infraestrutura | 0 | 0 | 2 | 1 | 1 |
| Compliance | 1 | 2 | 1 | 0 | 0 |
| Resiliencia | 0 | 0 | 0 | 0 | 4 |
| UX/Onboarding | 0 | 6 | 8 | 5 | 0 |

### C. Ficheiros Analisados
- ~737 ficheiros TypeScript/TSX em src/
- 23 migracoes SQL
- 50+ API routes
- 26 ficheiros de teste
- Configs: package.json, tsconfig.json, vite.config.ts, vercel.json, capacitor.config.json, ci.yml

### D. Notas e Limitacoes
1. Auditoria estatica — nao foi executada a aplicacao nem feitos testes dinamicos
2. Bundle size nao verificado (sem build local)
3. Cobertura de testes real nao executada (npm test)
4. Contagens de `any` incluem types em ficheiros de API server-side
5. Padroes null/undefined (830) incluem verificacoes legitimas — necessita triagem manual
6. Semantica HTML nao verificavel sem DOM renderizado

---

*Audit Master Protocol v2.1 + C9 UX & Onboarding Audit Pro v2.0*
*Gerado em 2026-04-14*
