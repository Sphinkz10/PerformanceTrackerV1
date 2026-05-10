# 🚨 PROTOCOLO DE AUDITORIA ABSOLUTA — EDIÇÃO EVOLUÍDA (DEEP SCAN ULTRA) 🚨

**Alvo:** Módulo Legado “Página de Atletas / Diretório de Clientes”
**Modo:** READ-ONLY (Apenas Leitura e Análise Estática/Dinâmica). Nenhuma linha de código será alterada.
**Contexto:** Transição para Domain-Driven Design (DDD) rigoroso no ecossistema LUNA.OS, com separação estrita entre UI (React/Tailwind), Estado (Zustand/TanStack Query) e Motores de Domínio (Engines Puras).
**Objetivo:** Raio‑X microscópico, preditivo e forense, que servirá de Single Source of Truth para a futura refatoração.

---

## 1. 🧬 Mapeamento de Dados e Tipagem (ADN Profundo)

### 1.1 Tipos e Interfaces Base
| Nome do Tipo / Interface | Localização (ficheiro:linha) | Propriedades principais | Usado em Stores? | Usado em props de componente? | Exportado? | Notas |
|---------------------------|------------------------------|-------------------------|------------------|-------------------------------|------------|-------|
| `Athlete` | `src/types/athlete-profile.ts:37` | `id`, `name`, `email`, `status`, etc. | Não explícito no código atual | Sim (`AthletesPage`, etc) | ✅ | Modelo principal da BD. |
| `PersonalRecord` | `src/types/athlete-profile.ts:79` | `id`, `metric_name`, `value`, `unit` | Não | Não | ✅ | Usado em histórico. |
| `RecordConditions` | `src/types/athlete-profile.ts:123` | `bodyweight`, `fatigue_level` | Não | Não | ✅ | Possui `[key: string]: any;` (Risco). |
| `RecordSuggestion` | `src/types/athlete-profile.ts:132` | `id`, `metric_name`, `new_value` | Não | Não | ✅ | ... |
| `AthleteDashboardConfig` | `src/types/athlete-profile.ts:165` | `widgets`, `visible_physical_metrics` | Não | Não | ✅ | ... |
| `DashboardWidget` | `src/types/athlete-profile.ts:187` | `id`, `type`, `position`, `config` | Não | Não | ✅ | ... |
| `WidgetConfig` | `src/types/athlete-profile.ts:203` | `title`, `metric`, `threshold` | Não | Não | ✅ | Possui `[key: string]: any;` (Risco). |
| `AthleteAuditLog` | `src/types/athlete-profile.ts:283` | `action`, `actor_id`, `before_data` | Não | Não | ✅ | `before_data` e `after_data` usam `any`. |
| `AthleteAnalyticsSummary` | `src/types/athlete-profile.ts:313` | `sessions`, `records`, `load` | Não | Não | ✅ | ... |
| `CreateRecordPayload` | `src/types/athlete-profile.ts:418` | `athlete_id`, `metric_name` | Não | Não | ✅ | ... |
| `Athlete` (Local) | `src/components/pages/Athletes.tsx:17` | `id`, `name`, `sport`, `risk` | Não | Sim | Não | Interface local duplicada, conflita com a global. |

**Notas obrigatórias:**
- Existem extensões de Record como `[key: string]: any;` em interfaces importantes como `WidgetConfig` e `RecordConditions`.
- O tipo `any` é explicitamente utilizado em `AthleteAuditLog` para `before_data`, `after_data` e `metadata`.
- Os componentes (ex: `Athletes.tsx`) definem versões simplificadas e locais de `Athlete`, quebrando a single source of truth.

### 1.2 Inventário de Uso Explícito e Implícito de `any`
| Ficheiro | Ocorrência | Risco de Dados | Descrição |
|----------|------------|----------------|-----------|
| `src/types/athlete-profile.ts:123` | `[key: string]: any;` | 🟠 Alto | Condições dos recordes - quebra tipagem de domínios específicos. |
| `src/types/athlete-profile.ts:203` | `[key: string]: any;` | 🟠 Alto | Configurações do dashboard, perda de inferência de tipos. |
| `src/types/athlete-profile.ts:283` | `before_data?: any;`, `after_data?: any;`, `metadata?: any;` | 🔴 Crítico | Perda de integridade da auditoria de dados no sistema. |
| `src/components/pages/Athletes.tsx:43` | `rawAthletes.map((a: any) => ({` | 🔴 Crítico | Parsing da resposta de API faz casting para `any` perigoso, bypassando completamente a tipagem `Athlete`. |

### 1.3 Estrutura de Dados Biométricos e Histórico
- **Tabela/coleção principal:** `athletes` gerida via API Supabase (`useAvailableAthletes` em `src/hooks/use-api.ts`).
- **Campos biométricos:** Existe uma interface `AthletePhysicalData` separada (age, height_cm, weight_kg, body_fat_percentage, lean_mass_kg, wingspan_cm). Estão separados da interface principal `Athlete`, sugerindo normalização JSON na BD ou colunas em tabela 1:1.
- **Histórico:** Os `PersonalRecord` registam os dados históricos de métricas através da tabela/entidade de métricas. Não existem tabelas explícitas de histórico para peso ou altura a não ser que sejam tratados como records.
- **Multidesporto:** O objeto `Athlete` mockado na UI apenas define `sport: string` genérico e `level: 'Amador'` em fallback (`a.sport || 'Geral'`), o que significa que o modelo atual *não suporta* realidade multidesportiva robusta onde o atleta tem métricas por desporto.

---

## 2. 🧠 Gestão de Estado, Fetching e Cache (Cérebro Distribuído)

### 2.1 Mapa dos Mecanismos de Estado
| Estado | Localização | Tecnologia | Inicialização | Sincronização com BD |
|--------|-------------|------------|---------------|----------------------|
| Lista de atletas | `Athletes.tsx:32` | SWR (`useAvailableAthletes`) | `[]` via hook | Sincronizada via cache global do SWR. |
| Pesquisa | `Athletes.tsx:28` | React `useState` | `""` | Estado estritamente local da view. |
| Filtro de categoria | `Athletes.tsx:29` | React `useState` | `"all"` | Estado estritamente local da view. |
| Seleção bulk | `Athletes.tsx:30` | React `useState` | `[]` | Estado estritamente local da view. |

### 2.2 Padrões de Fetching e Gestão de Cache
- O módulo usa **SWR** encapsulado no hook `/api/use-athlete-api.ts` e exportado em `use-api.ts`.
- **Cache invalidation:** SWR providencia a função `mutate` no retorno do hook para revalidação manual após ações.
- **Optimistic update:** Inexistente nesta view.
- **Tratamento de Erros:** Não há tratamento explícito (toasts/fallbacks) visível no componente de listagem, apenas um silencioso `isLoading`. Falta tratamento de rede.

### 2.3 Paginação, Pesquisa e Filtragem
- A **pesquisa é estritamente local**. Não há debounce. Filtra em memória.
- A **filtragem é estritamente local** através de renderização condicional/mapeamento de `athletes.filter`.
- **Paginação é inexistente**. A listagem carrega tudo num só array e itera, um risco crónico para N > 500 atletas.

---

## 3. ⚙️ Acoplamento de Lógica de Negócio (Exame Oncológico)

### 3.1 Identificação de Cálculos de Domínio em Ficheiros UI
| Ficheiro | Linhas | Descrição do cálculo | Tipo | Criticidade |
|----------|--------|----------------------|------|-------------|
| `Athletes.tsx` | 34-40 | Lógica de cálculo de Iniciais do nome (`getInitials`) | String UI | ⚪ Baixo |
| `Athletes.tsx` | 42-56 | Construção do domínio do atleta (adaptação de `any` para fallback) | Adaptação Domínio | 🔴 Crítico |
| `Athletes.tsx` | 58-64 | Cálculos analíticos para filtros (`count: athletes.filter(...)`) | Cálculo Arrays | 🟡 Médio |

### 3.2 Mapeamento das Funções Puras Existentes
Não existem motores/engines puros importados no ficheiro `Athletes.tsx`. Toda a transformação dos dados brutos recebidos da rede é efetuada in-loco (ex: definição de estado de `attendance`, `risk` em hardcode).

### 3.3 “Engenharia Reversa” das Máquinas de Estado Implícitas
Não existem complexas state machines nesta vista; é puramente reativa às propriedades SWR (`isLoading`) e ao array local de filtragem.

---

## 4. 🕸️ Matriz de Dependências e Impacto (Cartografia do Caos)

### 4.1 Ligações Directas com Outros Módulos
| Módulo Origem (Atletas) | Módulo Destino | Natureza da Ligação | Intensidade (1‑10) |
|-------------------------|----------------|---------------------|-------------------|
| `Athletes.tsx` | `useAvailableAthletes` | Fetch de dados SWR | 9 (Criticamente acoplado) |
| `Athletes.tsx` | `useApp` (AppContext) | Acesso ao `workspaceId` | 8 |

### 4.2 Fluxo de Submissão de Dados pelo Atleta
A página atual é essencialmente **Read-Only** do ponto de vista do domínio. As ações (Novo Atleta, Editar) são delegadas a callbacks passados por prop (`onCreateAthlete`, `onViewProfile`), o que é na verdade um bom design para Desacoplamento de UI em relação a Modais.

### 4.3 Análise de Impacto de Remoção (Blast Radius)
A remoção da página `Athletes.tsx` afetaria apenas a view principal do diretório de clientes. Por outro lado, o hook SWR subjacente (`useAvailableAthletes`) é crítico e partilhado por variados módulos (Dashboard, Calendário, DataOS).

---

## 5. 🎨 Dívida Técnica Visual e Arquitetura de UI (A Pele e os Ossos)

### 5.1 Anatomia dos Contentores Pesados
| Ficheiro | Linhas (aprox.) | Responsabilidade | Tipo | Observações de Dívida |
|----------|-----------------|------------------|------|------------------------|
| `Athletes.tsx` | ~250 | Gestão de Estado + Layout + Grelha + Row de Atleta | Page | Monólito Visual. O cartão/row do atleta está inline no `map`. |

### 5.2 Dívida Específica de UI
- **CSS:** Uso pesadíssimo de utility classes no JSX (`className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5"`).
- **Componentização:** Falta de um `<AthleteCard />` ou `<AthleteRow />` separado. Todo o HTML do cartão (avatar, tags de risco, ações) está escrito a partir da linha 150.
- **Responsividade:** O grid usa classes Tailwind (`lg:grid-cols-12`, `col-span-12`), que se ajustam, mas o layout do filtro lateral foi removido em favor de pílulas no topo, denotando dívida no tracking de protótipos de design.
- **Empty States:** Não existem explicitamente programados estados "vazio", apenas arrays vazios renderizados no ecrã.

### 5.3 Aderência ao Design System LUNA.OS
Os componentes usam estilos baseados em `.glass` noutras páginas, mas aqui os botões baseiam-se em clássicos degradês tailwind (`bg-gradient-to-r from-emerald-500`), alinhando com a LUNA.OS, mas carecendo da abstração dos componentes UI Core.

---

## 6. 🧪 Cobertura de Testes e Qualidade Interna

### 6.1 Mapa de Testes Existentes
| Ficheiro de Teste | Tipo | Cobre que funcionalidade? | Estado |
|-------------------|------|----------------------------|--------|
| `src/tests/e2e/athletes.spec.ts` | E2E | Criação e listagem de atletas na view | Desconhecido (não foi executado neste ambiente estrito) |

### 6.2 Lacunas Críticas de Cobertura
- Ausência total de testes unitários para a página. Se o SWR falhar ou a estrutura de `rawAthletes` alterar (como frequentemente acontece com o uso de `any`), o fallback local na UI falhará e a tabela explodirá em runtime. Não há um adapter isolado testável.

---

## 7. ⚡ Análise de Performance e Re-renderização

### 7.1 Perfil de Re-renderizações
- O hook `useAvailableAthletes` retorna dados, mas a interface força o recálculo do array `athletes` (`rawAthletes.map`) a cada renderização desencadeada pela pesquisa ou troca de filtro. Não há uso de `useMemo()`. Isto bloqueia o thread com N grandes.

### 7.2 Cascatas de Efeitos (useEffect Hell)
Felizmente, não existe um `useEffect` chain (inferno de efeitos). O estado é puramente reativo às props de topo.

---

## 8. ♿ Acessibilidade e Internacionalização (A11y & i18n)

### 8.1 Checklist Rápida de A11y
- [ ] Tabela navegável por teclado: Não existe `role="grid"` ou `role="table"`.
- [ ] Inputs com label: O `input` de Search não tem tag `<label>`, violando preceitos de leitores de ecrã.
- [ ] O `Checkbox` tem `onClick={(e) => e.stopPropagation()}`, mas toda a row tem clique para o ViewProfile.

### 8.2 Internacionalização
100% hardcoded em português na view. Textos como `"Novo Atleta"`, `"Procurar atleta..."`, `"Em Risco"` e `"Futebol"`.

---

## 9. 🔒 Segurança, Privacidade e Regras de Negócio Críticas

### 9.1 Regras de Autorização (RLS e Políticas)
O front-end envia apenas o `workspaceId` vindo do `useApp()` ao API/SWR. A segurança fundamental reside no RLS da Base de Dados de que apenas dados do seu próprio Workspace são retornados.

### 9.2 Tratamento de Dados Pessoais (GDPR)
O componente lida com Email, Telefone, Avatar. Como tudo é feito on-the-fly sem localStorage caching local a longo prazo na aplicação (exceto session do SWR), os riscos residem na subscrição de rede e exposição via UI excessiva, mas que atualmente parece controlada à view do treinador.

---

## 10. 📊 Veredito Multidimensional e Matriz de Prioridades

### 10.1 Scorecard Global do Módulo
| Dimensão | Nota (1‑10) | Justificação Breve |
|----------|-------------|--------------------|
| Pureza Tipográfica (Types) | 2 | Tipos duplicados locais, contágio severo de `any` em arrays críticos. |
| Gestão de Estado e Cache | 6 | SWR lida com a carga, mas estados de loading/error estão não tratados. |
| Separação de Lógica de Negócio | 3 | Lógica mapeada e injetada no próprio Render (fallback properties). |
| Acoplamento e Dependências | 5 | Aceitável, mas preso a React Context estrito e hooks API antigos. |
| Qualidade e Componentização UI | 4 | "Monólito" UI. Cartões de lista não componentizados. |
| Cobertura de Testes | 1 | Nenhuma cobertura de unidade detetada para o componente UI. |
| Performance | 4 | Faltam `useMemo` na contagem e mapeamento O(N) nas renderizações. |
| Acessibilidade | 3 | Sem labels semânticos ou suporte correto a readers no grid. |
| Segurança e Privacidade | 8 | Delega segurança corretamente ao token global do back-end. |
| **Média Ponderada** | **4.0** | **Risco Elevado. Necessita Refatoração Arquitetural DDD.** |

### 10.2 Matriz de Achados e Prioridades de Refatoração
| ID | Achado | Vetor | Severidade | Esforço | Acção |
|----|--------|-------|------------|---------|-------|
| A01 | Mapeamento destrutivo de Payload API com `any` | 1 | P0 | 4h | Eliminar `any`. Usar Zod / interface estrita e isolar o adapter (`athleteAdapter`). |
| A02 | Falta de abstração em UI `AthleteRow` | 5 | P1 | 6h | Mover a lógica de cartão para um `<AthleteCard />` e limpar o Monólito. |
| A03 | O(N) Repetitivo sem `useMemo` | 7 | P1 | 2h | Memoizar os contadores de risco, desporto e o parsing de listas. |
| A04 | Ausência de estado de Vazio (Empty State) | 5 | P2 | 2h | Implementar visual para quando o SWR retorna `[]` ou filtro fica a `0`. |

### 10.3 Veredito Final de Acoplamento
**Grau de Acoplamento: 7/10 (Elevado)**
A View não é puramente representacional. Está agarrada a "adivinhar" e construir o seu próprio domínio localmente, ignorando os Types Globais e lidando com dados brutos da API na mesma layer onde desenha Divs Tailwind. A refatoração deverá quebrar o `Athletes.tsx` em Contentores Inteligentes (Estado/API) e Componentes de Apresentação Burros (UI Pura).
