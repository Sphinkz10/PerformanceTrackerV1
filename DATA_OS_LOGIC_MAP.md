# DATA_OS_LOGIC_MAP

## 1. MAPA DE BOTÕES E INTERAÇÕES (FUNCTIONAL INVENTORY)

*   **Smart Entry (SmartEntryModal.tsx)**:
    *   **Toggle Single/Bulk**: Alterna o modo de entrada (Single para 1 atleta, Bulk para múltiplos atletas) alterando o estado local `mode`.
    *   **Single - Save / Bulk - Save**: Dispara o callback `onSave`, que envia os dados para serem processados (os dados recolhidos passam pelo `onSave(entries)` mas o processamento para gravação/actualização de estado global aparenta estar fora deste modal - é passado ao pai via callback).
*   **Quick Entry (QuickEntryModal.tsx)**:
    *   **Save**: Recolhe dados de 1 métrica para 1 atleta, efetua a validação inline e dispara o callback `onSave(entry)` passando `metricId`, `athleteId`, `value`, `timestamp` e `notes`.
*   **Bulk Entry (BulkEntryModal.tsx)**:
    *   **Save**: Dispara o callback `onSave(entries)`. Permite modo de valor idêntico para todos ou tabela por atleta.
*   **Export (HistoryExportModal.tsx)**:
    *   **Export**: Fecha o modal (`onClose()`) e dispara `onExport(config)` que passa os parâmetros escolhidos (formato CSV/Excel/PDF/JSON, agrupar por data/atleta/zone, campos a incluir).
*   **Create Metric / Field (CreateFieldModal.tsx / CreateMetricWizard)**:
    *   **Wizard Navigation (Next/Back)**: Atualiza o estado `step` (1 a 5).
    *   **Save / Deploy**: Dispara callback ou ação para adicionar um novo `DataField` ao sistema.
*   **Liveboard View Toggle (LiveBoardMain.tsx)**:
    *   **Por Atleta / Por Data**: Atualiza o estado local `activeView` para renderizar o componente `<ByAthleteView />` ou `<ByDateView />`.
*   **Delete / Restore Metric**:
    *   **Confirm Delete/Restore**: Realiza soft/hard delete das métricas via modais de confirmação (`DeleteMetricModal`, `RestoreMetricModal`, `BulkDeleteModal`), disparando os respetivos callbacks.
*   **Library / Packs**:
    *   **Activate Pack**: Dispara acção de ativação do template `onActivate` a partir do `PacksLibraryModal`.
*   **Comparação (AthleteCompareModal.tsx)**:
    *   **Toggle Athlete**: Adiciona/remove IDs de atletas do estado local para comparar.
    *   **Export CSV/PDF**: Dispara as funções de exportação `handleExportCSV` ou `handleExportPDF`.

## 2. LOGIC & DATA FLOW (A TUBAGEM)

*   **Live Session / Liveboard**:
    *   **LiveboardMain**: Atua como o shell/container para o modo Live, controlando o toggle (Athlete vs Date).
    *   **ByAthleteView / ByDateView**: Contêm a lógica de visualização, adaptando o layout consoante o ecrã (Mobile = Cards empilhados, Tablet/Desktop = Tabela).
*   **Cálculos e Processamento**:
    *   A lógica de cálculo de estatísticas (como visto em `MetricStatsPanel` ou `ByAthleteView` como médias, máximos/mínimos, distribuição de zonas) e determinação da "trend" (Up/Down) está fortemente implementada no **Frontend**, dentro dos componentes (ou com dados preparados localmente antes de renderizar).
    *   A `MetricStatsPanel.tsx` recebe as métricas (trend, percentagens, zonas) já como `props` `stats`, indicando que os cálculos ocorrem no componente pai, possivelmente no momento em que a informação é processada antes do render.
*   **Data Hooks / Alimentação**:
    *   **Sem SWR ou Hooks globais de fetch observáveis dentro dos componentes de view**: A diretoria não utiliza SWR nem tem muitas dependências locais de fetching de dados que acedam à API. Os dados chegam aos componentes de Liveboard via **props** das páginas parent ou através do **DataOSContext**.
    *   **DataOSContext**: Fornece um state via `useReducer` que geria a configuração de campos/métricas (DataField, validações, cálculos de fórmulas visuais no Custom Metrics Builder). Mas os dados transacionais parecem ser injetados por containers externos.
    *   **DataGrid (v2/DataGrid.tsx)**: Utiliza `useState` / `useMemo` para sort, pesquisa e paginação de dados **em memória**.

## 3. ANÁLISE DE INPUTS (ENTRY SYSTEM)

*   **Entrada e Validação**:
    *   Os modais (`SmartEntryModal`, `QuickEntryModal`, `BulkEntryModal`) contêm "inline validation". Eles são "type-aware" em relação à métrica selecionada.
    *   A validação (regras de `min`/`max`, `required`, tipos esperados) é feita no Frontend durante a escrita, bloqueando o `Save` se houver erro (ou mostrando mensagens `AlertCircle`).
*   **Transformação (Type-aware e Conversão)**:
    *   Existem configurações de `FieldType` (em `DataOSContext` -> number, time, load, rpe, etc). O sistema adapta o input ao tipo.
    *   Embora a engine de transformação (`kg_to_lbs` etc) esteja definida noutros locais do projeto, os dados neste contexto são validados contra as *ValidationRules* antes de serem enviados. No `SmartEntryModal` utiliza-se smart keyboard e o modo bulk aceita a propagação de valores.

## 4. DIAGNÓSTICO DE FRICÇÃO (TECH DEBT)

1.  **Lógica Misturada com UI**:
    *   Os modais (`SmartEntryModal`, `BulkEntryModal`) gerem não só a Interface e Responsividade (diferentes layouts desktop/mobile) mas também o complexo estado do formulário, validações em tempo real e preparação do payload de submissão (mistura de UI e Form Engine Business Logic num só componente grande).
    *   `DataGrid.tsx` implementa filtros, sorting, hidden columns, paginação, e seleção, tudo num só ficheiro massivo focado na Virtualização (performance) mas com forte acoplamento às regras de UI.
2.  **3 Pontos de Fragilidade/Erros TypeScript**:
    *   **A - Modais de Bulk/Smart Entry**: A complexidade de ter modos 'single' e 'bulk' e os inputs dinâmicos dependendo do `FieldType` podem criar vulnerabilidades na inferência de tipos.
    *   **B - Componentes Liveboard (ByAthleteView)**: Diferentes visualizações para Mobile (Cards), Tablet (Scroll) e Desktop (Grid) dentro do mesmo contexto, forçando lógicas complexas de render e possíveis inconsistências de performance ou quebras de tipo nos dados passados.
    *   **C - Prop Drilling Massivo vs Contexto**: Dados transacionais chegam muitas vezes em `props` não tipadas rigidamente (ou como `<T> / any` em `DataGrid.tsx` -> `any` accessor). Isto diminui a eficácia do TypeScript na cadeia, especialmente onde a tipagem dos resultados de fetch deveria ser fortemente aplicada.
