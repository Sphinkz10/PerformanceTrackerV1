# DATA_OS_LOGIC_MAP

## 1. MAPA DE BOTÕES E INTERAÇÕES (FUNCTIONAL INVENTORY)

O Data OS possui múltiplos modais e pontos de entrada de dados, bem como interações num DataGrid virtualizado.

### Modais de Entrada de Dados (Entry System)

*   **SmartEntryModal (`src/components/dataos/modals/SmartEntryModal.tsx`)**
    *   **Função:** Modal híbrido que consolida "Quick Entry" (um atleta, uma métrica) e "Bulk Entry" (múltiplos atletas, uma métrica).
    *   **Botão "Modo Single/Bulk":** Altera o estado local `mode` ('single' | 'bulk'), alternando condicionalmente as views de UI.
    *   **Botão "Guardar" (Single):** Dispara `handleSave()`. Valida os inputs localmente (`validateSingle()`) e, se válido, invoca a prop `onSave(entryData)`. Altera estados de `saving` e `saveSuccess`.
    *   **Botão "Adicionar Atleta" (Bulk):** Modifica o estado local `bulkRows` adicionando uma nova entrada em branco.
    *   **Botão "Guardar Todos" (Bulk):** Dispara a validação em massa (`validateBulk()`), mapia os dados e invoca `onSave(bulkData)`.

*   **BulkEntryModal (`src/components/dataos/BulkEntryModal.tsx`)**
    *   **Função:** Componente legado ou alternativo focado em entrada em massa com assistente passo a passo (Step 1: Select, Step 2: Input, Step 3: Preview).
    *   **Botão "Continuar" (Step 1 -> 2):** Verifica se `selectedMetric` e `selectedAthletes.length > 0` existem. Altera o estado `step`.
    *   **Radio "Mesmo Valor / Valores Diferentes" (Step 2):** Alterna o estado `inputMode` ('same' | 'different'), mudando a renderização de um input único para uma tabela de inputs.
    *   **Botão "Continuar" (Step 2 -> 3):** Executa `validateAllValues()`. Itera sobre `athleteValues` validando com `validateValue()`. Atualiza o estado `validationResults` (Map). Avança apenas se todos válidos.
    *   **Botão "Guardar Tudo" (Step 3):** Reúne as entries (mesmo valor ou valores iterados), fecha o modal (`onClose()`) e dispara `onSave(entries)`.

### Grid e Ações de Tabela

*   **DataGrid V2 (`src/components/shared/v2/DataGrid.tsx`)**
    *   **Função:** Tabela de alta performance para 100+ rows com seleção, pesquisa e ordenação.
    *   **Search Input:** Altera o estado `searchQuery`. A filtragem (`filteredData`) é feita num `useMemo` com base em todos os valores das colunas ativas.
    *   **Column Headers:** Ao clicar, altera o estado `sortConfig` ({key, direction}). A ordenação (`sortedData`) é recálculada num `useMemo`.
    *   **Checkboxes (Selection):** Atualiza um `Set` no estado local `selectedRows`.
    *   **Settings/Column Toggle:** Abre um menu dropdown (estado `columnSettingsOpen`). Checkboxes modificam um `Set` local `hiddenColumns`.
    *   **Bulk Actions Buttons:** Disparam funções passadas na prop `bulkActions`, entregando-lhes as rows selecionadas obtidas via `getSelectedRowsData()`.

## 2. LOGIC & DATA FLOW (A TUBAGEM)

Os componentes de visualização de dados principais ('Live Session' e 'Liveboard') parecem ser estáticos ou estar num estado transitório/desligado das fontes de dados reais.

*   **LiveBoardMain (`src/components/dataos/liveboard/LiveBoardMain.tsx`)**
    *   **Estado:** Usa um `useState` simples para alternar entre as views 'by-athlete' e 'by-date'. Não gere dados, apenas delegar o `workspaceId`.
*   **ByAthleteView / ByDateView (`src/components/dataos/liveboard/...`)**
    *   **Dados:** Atualmente, os ficheiros utilizam **MOCK DATA** hardcoded (e.g., `mockAthletes`, `mockDaysData`). Os dados não estão a ser obtidos de uma API no mount.
    *   **Hooks:** Não existem instâncias de `useSWR`, `useQuery`, ou qualquer Contexto global de dados a ser consumido diretamente nestes ficheiros para alimentar as tabelas principais.
    *   **Cálculos:** O frontend possui lógica de cálculo pesada noutros contextos (e.g., `FormulaEngine` para custom metrics, `calculateStats` em Históricos), mas as listagens e métricas de baseline destas views estão estáticas.
*   **DataOSContext (`src/components/dataos/context/DataOSContext.tsx`)**
    *   Existe um `useReducer` complexo (`dataOSReducer`) responsável por construir e manter o "DataOSApp" (data models, workflows, UI canvas). Contudo, este contexto é mais orientado ao *Builder/Wizard* de métricas e formas, e não parece estar ligado aos Liveboards diários.

## 3. ANÁLISE DE INPUTS (ENTRY SYSTEM)

O sistema de entrada de dados valida pesadamente o input através de funções utilitárias embutidas nos próprios modais.

*   **Validação (Ex: `BulkEntryModal.tsx`):**
    *   A função `validateValue(value, metric)` avalia:
        *   Presença de valor (vazio gera erro).
        *   Tipologia (`numeric` ou `scale` verifica se é `isNaN`).
        *   Limites: Verifica se o valor viola os atributos `scaleMin` e `scaleMax` definidos na métrica.
    *   A validação ocorre em memória (Client-side) e bloqueia o fluxo de UI se houver erros (e.g., highlight a vermelho no grid de inputs).
*   **Transformação Automática:**
    *   Não há evidências de uma transformação complexa automática *on the fly* (ex: conversão implícita lbs -> kg ao digitar).
    *   Para os inputs `type='scale'`, o HTML utiliza `step="0.1"`, mas a lógica restringe-se maioritariamente à validação de limites numéricos, sem mutação pré-save descrita nos modais avaliados (eles enviam o valor da string/número diretamente na função `onSave`).

## 4. DIAGNÓSTICO DE FRICÇÃO (TECH DEBT)

1.  **Lógica de Negócio Misturada com UI (God Components):**
    *   Componentes como `SmartEntryModal.tsx` e `BulkEntryModal.tsx` são imensos (provavelmente centenas de linhas). A lógica de validação (`validateValue`), iteração de passos do wizard, e a filtragem de dados estão implementadas diretamente dentro do componente React, violando a separação de preocupações.
2.  **Mock Data como Fonte da Verdade em Views Críticas:**
    *   As views primárias (`ByAthleteView`, `ByDateView`) no Liveboard dependem de estado inicializado com mock data (`useState<Athlete[]>(mockAthletes)`). Falta uma camada de integração robusta com a API via hooks modernos (SWR/React Query).
3.  **Falta de Tipagem Forte no DataGrid V2:**
    *   O `src/components/shared/v2/DataGrid.tsx` aceita colunas configuradas com `accessor: keyof T | ((row: T) => any)` e lida extensivamente com retornos e renderizações baseadas no tipo `any` (ex: `value: any`, parâmetros nas funções de formatters). Isto enfraquece o autocompleto e abre portas para runtime errors graves quando o modelo de dados subjacente sofrer mutações.
4.  **Estado Partilhado Inconsistente:**
    *   Existem funções `onSave` passadas por props em `SmartEntryModal`. A responsabilidade de comunicar com o backend e atualizar o cache local recai sobre o componente pai, tornando difícil traçar quem invalida a SWR cache e causando possíveis desincronizações (stale data).
