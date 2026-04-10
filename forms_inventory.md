# Inventário Funcional: Forms Center (Deep Scan)

Este documento contém o mapeamento absoluto do sistema de Formulários (Forms Creator) existente atualmente no projeto, focado nas funcionalidades, componentes, hooks, e dívida técnica identificada.

## 1. Componentes Atuais

### Ecrãs e Páginas
- **FormCenter (`src/components/pages/FormCenter.tsx`)**: O ecrã principal que centraliza a listagem, estatísticas e opções de criação de formulários.
- **FormBuilder** (interno em `FormCenter.tsx`): O construtor de formulários que permite arrastar, soltar, e configurar campos. Possui abas de "Build" (Construção), "Logic" (Lógica), "Metrics" (Métricas) e "Settings" (Configurações).
- **FormSubmissionsHistory (`src/components/pages/FormSubmissionsHistory.tsx`)**: Visualização de histórico de respostas.

### Modais e Componentes Auxiliares
- **FormSubmissionModal (`src/components/forms/FormSubmissionModal.tsx`)**: Modal utilizado para os atletas/treinadores preencherem o formulário. Contém pré-visualização, validação de dados, e feedback de sucesso/erro.
- **FieldQuickConfigModal (`src/components/modals/FieldQuickConfigModal.tsx`)**: Modal de configuração rápida das propriedades de um campo (Label, Placeholder, Obrigatoriedade, Ajuda).
- **ConditionalLogicModal (`src/components/modals/ConditionalLogicModal.tsx`)**: Modal para criação de regras lógicas condicionais (se/então) aplicadas entre campos.
- **FormAnalyticsModal (`src/components/modals/FormAnalyticsModal.tsx`)**: Modal que exibe métricas e estatísticas relativas a um formulário específico.
- **EmailTemplateModal (`src/components/modals/EmailTemplateModal.tsx`)**: Modal para configurar e enviar formulários por e-mail para atletas, com templates.
- **SendFormModal / SendFormWizard**: Componentes para o fluxo de envio do formulário.
- **MetricLinkingPanel**, **MetricLinkBadge**, **SmartMetricSuggestion**, **LinkedMetricsPreview**: Componentes dedicados à integração (bind) entre respostas de um formulário e métricas automáticas do sistema.

---

## 2. Tipos de Campos de Input (Criador de Formulários)

O sistema atual suporta uma gama vasta de campos, classificados em três categorias:

### Básicos
- **Texto (`text`)**: Campo de resposta curta (string).
- **Número (`number`)**: Campo numérico para métricas.
- **Email (`email`)**: Validação de formato de e-mail.
- **Telefone (`phone`)**: Formato de contacto.
- **Data (`date`)**: Seleção de datas.
- **Tempo (`time`)**: Formato `HH:MM` ou `HH:MM:SS`.
- **Duração (`duration`)**: Formato `HH:MM:SS` ou total em segundos.

### Seleção
- **Escolha Única (`radio` / `select`)**: Dropdowns ou botões radio.
- **Múltipla Escolha (`checkbox`)**: Caixas de seleção múltiplas ou toggles booleanos (verdadeiro/falso).

### Avançados
- **Avaliação (`rating`)**: Escalas, tipicamente 1-10 ou estrelas.
- **Localização (`location`)**: Captura de local/GPS.
- **Upload (`upload`)**: Anexos de imagem/ficheiro.
- **Assinatura (`signature`)**: Assinatura digital do atleta.
- **Textarea**: Campo nativo no SubmissionModal para respostas de texto longo.

---

## 3. Ações do Utilizador (Botões e Interações)

### Gestão Geral (FormCenter)
- **Criar Formulário (`+`)**: Abre o FormBuilder.
- **Mudar Abas**: Alternar entre "All" (Todos), "Templates", "Responses" (Respostas).
- **Menu Contextual de Formulário (Dropdown)**:
  - Editar (abre builder).
  - Ver Respostas.
  - Pausar / Arquivar.
  - Apagar.

### Construtor de Formulário (FormBuilder)
- **Adicionar Campo**: Clica na lista da barra lateral para inserir um novo campo.
- **Configurar Campo (`Settings/Engrenagem`)**: Abre o modal de quick config.
- **Lógica (`GitBranch` / Tab Lógica)**: Configura regras condicionais.
- **Mover Cima (`↑`) / Mover Baixo (`↓`) / Arrastar (`GripVertical`)**: Reordenação da sequência dos campos.
- **Duplicar Campo (`Copy`)**: Clona a pergunta.
- **Eliminar Campo (`Trash2`)**: Remove do builder.
- **Salvar Formulário**: Guarda como rascunho ou template.
- **Publicar Formulário**: Torna-o ativo/disponível.
- **Copiar Link**: Partilha direta (gera toast "Link copiado!").
- **Enviar (`Mail`)**: Abre o `EmailTemplateModal`.

### Regras de Lógica (ConditionalLogicModal)
- Regras disponíveis: `equals`, `not_equals`, `contains`, `greater_than`, `less_than`.
- Ações dependentes: `show` (mostrar), `hide` (ocultar), `require` (tornar obrigatório), `skip` (saltar).

### Preenchimento (FormSubmissionModal)
- **Cancelar / Fechar (`X`)**.
- **Voltar (Input)**: Para corrigir dados.
- **Submeter / Enviar (`Submit`)**: Dispara a validação e posterior chamada de API.

---

## 4. Motor de Dados (Backend/Hooks)

O ecossistema não utiliza `SWR` globalmente para formulários, assentando no `useState` / `useEffect` com chamadas explícitas de `fetch` usando `AbortController`.

### Hooks Principais
- **`useFormSubmissions.ts`**:
  - `submitForm`: Faz POST para `/app/api/forms/submissions`. (Com payload de `form_id`, `athlete_id`, `responses`, `workspace_id`).
  - `fetchSubmissions`: Faz GET a `/app/api/forms/submissions?workspaceId=...`.
  - `retrySubmission`: Função declarada como "TODO", não implementada ainda.
  - Implementa um simulador local de Transformações (`previewTransformation`) suportando conversões de unidade e fórmulas de mapeamento.
- **`useFormSubmission.ts`**:
  - Gere a validação estrita dos tipos de dados (ex: strings vs numbers, bounds de tempo, limites % etc).
  - Executa as transformações matemáticas pesadas de cada campo (ex: `scale`, `multiply`, `kg_to_lbs`, etc).
  - Extrai as atualizações de métrica (`extractMetricUpdates`).
  - Faz POST em bulk (`submitMetricUpdates`) para `/api/metric-updates` com o objetivo de gerar ou atualizar métricas desportivas nativas, interligadas ao formulário.

### Endpoints (API Routes em `src/app/api/forms/`)
- `GET /api/forms`: Listagem de formulários.
- `POST /api/forms`: Criação de novo template de form.
- `PUT /api/forms`: Atualização estrutural.
- `DELETE /api/forms`: Apagar formulário.
- `POST /api/forms/submissions`: Regista uma nova resposta de atleta.
- `GET /api/forms/submissions`: Histórico de respostas.

---

## 5. Dívida Técnica (Problemas Identificados)

A exploração do código revelou vários "FIXES", pontas soltas, e débitos técnicos prioritários a tratar durante a refatoração:

### Arquitetura / Código "Esparguete"
- **Gestão de Estado em Modais (`FormSubmissionModal.tsx`)**:
  - Existência de "Memory Leaks" por estado atualizado em componentes não montados (marcado como `FIX #3: Track if component is mounted`).
  - Uso intensivo de refs (`onSuccessRef.current`) para evitar "Stale Closures" (`FIX #22`).
  - Lógica misturada: A validação e o mapeamento UI estão intimamente fundidos num componente muito complexo, dificultando manutenção. O `FormSubmissionModal` está a assumir demasiadas responsabilidades (renderização, parse, formatação).

### Validação e Transformações (`useFormSubmission.ts`)
- **Regras de Tempo e Duração (`FIX #9`, `FIX #10`)**: A validação manual com RegEx (ex: `^(\d{2}):(\d{2})(:(\d{2}))?$`) e controlo estrito de horas (0-23)/minutos (0-59) precisa ser standardizada e exportada para utils. Duração rejeita negativos mas não tem uma biblioteca base unificada.
- **Divisão por Zero / Out of Bounds (`FIX #12`, `FIX #7`)**: Foram adicionados `Math.max(params.toMin, Math.min(...))` para clamping e defesas contra Divisão por Zero no scale transform, mas o parse é confuso, assumindo inputs numéricos frágeis. O uso sistemático do transform `none` misturado com operações numéricas pode criar silent errors. O Infinity/Overflow de inputs deve ser gerido centralmente.
- **Erro de Transformação Silencioso (`FIX #6`)**: Quando a submissão de um cálculo falha, o erro volta a enviar o "Raw Value" por defeito. Isto corrompe a base de dados se a unidade esperada do outro lado for diferente (ex: recebe string/texto onde devia receber float).

### Backend / Tipagem
- **Missing SWR**: A busca manual de dados não usa uma cache de resposta padrão do React. Requer recarregar tudo em `fetchSubmissions` e a gestão manual de `AbortSignal`.
- **Implementação "Fake"**: O método `retrySubmission` apenas mostra um toast informando "Feature coming soon".
- **JSON Parsing Centralizado (`FIX #16`)**: Tentativas locais de gerir o parse seguro de `response.json()` no momento de submit (`parseJsonResponse`), em vez de se utilizar o cliente global ou SWR, fragmentando o modelo de fetching da API.
- Falta de tipagem rígida nos logs (`processing_log: any[]` em `FormSubmission`).

---
_Gerado de forma read-only pela Análise Forense JULES._