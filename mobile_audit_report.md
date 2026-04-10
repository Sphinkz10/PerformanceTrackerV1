# Relatório de Auditoria de Responsividade Mobile

**Objetivo:** Este relatório detalha a análise do estado da arte do repositório atual em relação à responsividade para dispositivos móveis, com foco especial nos componentes localizados na pasta `src/components/`. A análise foi realizada de forma estritamente leitura (read-only), focada na arquitetura CSS e escolhas de design.

---

## 1. Uso de Media Queries

### Análise:
O repositório baseia a sua responsividade **essencialmente em classes utilitárias do Tailwind CSS** em vez de declarações clássicas de `@media` em ficheiros `.css`.

*   **Media Queries Tradicionais:** Foram encontradas cerca de 20 declarações `@media` em todo o código fonte. A vasta maioria é utilizada para cenários específicos como:
    *   `@media print` para layouts de impressão e geração de PDFs.
    *   `@media (prefers-reduced-motion: reduce)` para acessibilidade em animações.
    *   Em emails (onde o Tailwind não é processado de igual forma, `max-width: 600px`).
*   **Tailwind Breakpoints:** Existe um forte uso das prefixes responsivas do Tailwind. Foram identificados:
    *   `sm:` (para pequenos ecrãs/mobile-first overrides) -> mais de **640 ocorrências**.
    *   `md:` e `lg:` -> várias centenas de ocorrências.

### Veredicto:
O CSS não é baseado apenas em pixels fixos, sendo que utiliza um modelo responsivo nativo do Tailwind. No entanto, a quantidade massiva de regras `sm:` (que no Tailwind ativam-se *a partir* do breakpoint, tipicamente 640px) indica uma abordagem onde o base case (mobile) necessitou de constantes substituições, o que é característico de uma adaptação "desktop-first" onde se foi "colando" responsividade.

---

## 2. Componentes dos Atletas

### Análise:
Os componentes que os atletas utilizam com mais frequência (visualização de planos e submissão de dados) apresentam um comportamento misto:

*   **Inputs e Flexibilidade:** Muitos formulários e componentes, tal como o `FormSubmissionModal.tsx`, utilizam classes como `w-full`, `mx-4` e `max-w-2xl`. No ecrã do telemóvel, estes elementos ocupam de facto os 100% da largura disponíveis e adaptam-se aos cantos.
*   **Problemas de Layout:** Foram encontradas mais de **100 ocorrências** de larguras mínimas fixas agressivas, como `min-w-[200px]`, `min-w-[800px]` (no calendário) e cerca de 74 ocorrências de `w-[xxxpx]`. Estas restrições quebram rapidamente o `flex-wrap` natural e forçam o aparecimento de barras de scroll horizontal desnecessárias em ecrãs de menor dimensão, prejudicando a UX (Safe Areas em iOS/Android não resolvem overflow horizontal imposto por código).

### Veredicto:
Estão "semi-preparados". A casca (o Modal) adapta-se, mas o conteúdo interior em tabelas ou grids pode estourar as margens por causa do uso de `min-w` e designs fixos em grelhas.

---

## 3. Modais e Tabelas Antigas

### Análise:
Existem componentes legados que claramente não foram desenhados para mobile, causando potenciais problemas estruturais na grelha:

*   **Tabelas HTML Legadas (`<table>`):** A tag HTML nativa `<table>` é utilizada em cerca de 17 componentes chave (ex: `WorkflowsList.tsx`, `PrintTemplates.tsx`, `SmartEntryModal.tsx`, `ByAthleteView.tsx`). Muitas vezes são forçadas a ter `w-full` mas com cabeçalhos de largura mínima fixa (`min-w-[150px]`). Numa view mobile, uma tabela sem um invólucro de scroll (`overflow-x-auto`) irá invariavelmente empurrar e quebrar a viewport da app.
*   **SessionDetailsDrawer.tsx:** O drawer lateral define a largura baseada na expressão `w-full sm:w-[600px] lg:w-[800px]`. Em mobile (abaixo de `sm`), cai nativamente para `w-full`, o que é uma boa prática. No entanto, o seu conteúdo interno possui constrangimentos que podem criar conflitos de leitura.
*   **FormSubmissionModal.tsx:** Não utiliza larguras fixas de forma explícita no invólucro (utiliza `max-w-2xl w-full mx-4`), garantindo que se adapta razoavelmente, embora dependa do facto do que é injetado lá dentro também ser fluido.

### Veredicto:
As tabelas e as views de visualização complexa (como listagens e liveboards) são os principais pontos de fricção. As tabelas em particular são os maiores criadores de bugs de responsividade e necessitam de ser convertidas para listas ou cards (`grid-cols-1`) em vistas mobile.

---

## 4. Resumo da Dívida Técnica Mobile

### Veredicto Técnico:
**A aplicação atual NÃO é Mobile-First.**

O código revela um estado de "Adaptação sob Pressão". A arquitetura subjacente denota ter sido concebida inicialmente para resoluções Desktop/Tablet (painéis densos, calendários alargados, uso extensivo de Data Grids e `<table>`).

A responsividade mobile que existe foi implementada *a posteriori* recorrendo de forma massiva aos modificadores do Tailwind (`sm:`, `md:`, `lg:`), resultando num design fluido mas com componentes que muitas vezes falham na experiência tátil devido a:

1.  Uso frequente de `min-w-[XXXpx]` que anula o comportamento flexível.
2.  Falta de views alternativas em "Cards" para tabelas de dados.
3.  Interfaces concebidas para cliques de rato em vez de tap targets adequados para toque em ecrãs pequenos.

**Recomendação de Arquitetura:**
É necessária uma fase de refatoração estrutural que implemente componentes adaptativos (ex: o componente detetar se está em mobile e renderizar uma `<List>` em vez de uma `<table>`) em vez de simplesmente esmagar e esconder (através de `hidden md:block`) o UI desenhado para ecrãs de grande formato.