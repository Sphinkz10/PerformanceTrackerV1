### Relatório de Auditoria — Painel Design Studio (Cumprimento Contratual)
**Cliente:** Diretor / PerformTrack
**Auditor:** Agente (Antigravity)
**Alvo da Auditoria:** Design Studio (`src/components/studio/DesignStudio.tsx`)
**Data:** 14 Abril 2026

Este relatório foi gerado em estrito cumprimento das Cláusulas 2 e 3 do Contrato de Auditoria estabelecido. A profundidade da análise foi incrementada em rigor, de modo a mapear integralmente interconexões de base de dados, lógica aplicacional e dependências.

---

### Cláusula 2.1 – Identificação e Listagem
**Página / Painel:** Design Studio (Hub de Criação e Gestão de Conteúdo de Treino)
**Localização Física (URL Interno):** Componente centralizado em `src/components/studio/DesignStudio.tsx`
**Ficheiros Auxiliares Acoplados:**
*   `ExerciseBuilderModal.tsx` & `CreateWorkoutModal.tsx` & `CreatePlanModal.tsx` & `CreateClassModal.tsx` *(os construtores isolados de modal)*
*   `DistributionPanel.tsx` *(Painel lateral interativo para partilha e distribuição do que foi criado)*
*   `ItemPreview.tsx` *(View read-only para visualização do payload montado)*

---

### Cláusula 2.2 – Análise Funcional da Página
**Propósito/Sentido:** O Design Studio é o "motor criativo" da aplicação. Funciona como um estúdio avançado de planeamento de onde os formadores desenham módulos soltos (Exercícios, Workouts, Planos e Aulas). Funciona como um ambiente tipo sandbox manipulando dados pesados em RAM transitória, suportando múltiplos estados interativos (`edit` mode vs `preview` mode) sem originar recargas na página, publicando finalmente para a Supabase de forma otimizada.

**Tabela de Funções Existentes (Detalhada):**

| Função Base / Hook | Descrição Funcional Exaustiva | Natureza / Conexão (DB) |
| :--- | :--- | :--- |
| `useWorkspace` & `useUser` | Obtém contexto global persistente de quem está autenticado no momento. Insere estas chaves de autorização nos pedidos de submissão do DB. | Dependência Local (React Context API) |
| `useCreateWorkout` | Transacionador isolado (SWR ou Fetch) que persiste o schema 'Workout' completo pela API do Backend. | Mapeamento Supabase: Tabela `Workouts` |
| `useUpdateWorkout` | Atualiza (via operação HTTP PATCH/PUT) um bloco de treino pré-existente sem sobrescrever métricas mortas. | Mapeamento Supabase: Atualiza tuplos iterativos |
| `useCreateExercise` | Ferramenta para registar novos movimentos atómicos no dicionário. Permite a arquitetura modular da plataforma. | Mapeamento Supabase: Tabela `Exercises` |
| `handleCreateNew()` | Função semântica de gatilho. Lê qual o módulo ativo (`activeModule`) e força um re-render do React disparando o estado de boolean para o Modal subjacente. | Nativa (Gestão de Estado React - `useState`) |
| `handleUpdate(updates)` | Função callback de transição em Memória RAM. Permite que enquanto o user digite num `<input>` filho dos Modais complexos, ele guarde a sua progressão global transitoriamente. | Nativa (JS de Mutação Imutável) |
| `handleSave()` | O "Cérebro" transacional de toda a página. Inspeciona integridade (ex: validação rígida `"name não está preenchido?"`). Depois ramifica num pipeline pesado construindo mapeamentos de schema para a Base de Dados adequados a Desportos (Workouts vs Exercises) antes de chamar a API. | Mista (Validação Nativa de Payload + Promise API POST) |

---

### Cláusula 2.3 – Teste de Elementos Interactivos e Conexões (Routing & DB)
Foram escrutinados os comportamentos complexos deste estúdio front-end e mapeados contra a camada de Infraestrutura Cloud:

**1. Módulos Master-Nav (Exercícios, Treinos, Planos, Aulas, Biblioteca):**
*   **Ação Esperada:** Seleção das Tabs Superiores com ícones (Framer Motion). Alternância total do contexto de interface do editor, ajustando painéis estatísticos e listagem de templates.
*   **Teste e Conexão:** SUCESSO. Assenta num estado modular que isola cada fluxo. Se mudar para Workouts, as funções POST e o interface alternam de forma a direcionar queries à cloud corretas. Nenhuma chamada acidental à base de dados foi detetada aquando da mudança inócua destas abas.

**2. Botão Master "Salvar" (`handleSave`):**
*   **Ação Esperada:** Transformar Input do Operador => Converter em Schema JSON Seguro => Fazer POST Assíncrono => Alertar Sucesso => Fechar Modal.
*   **Teste e Conexão BD:** SUCESSO COMPLEXO. 
    *   **Pipeline Workouts:** O botão captura a injeção em memória e mapeia-a. Submete `workspaceId`, `name`, `description`. Usa lógica heurística em backend enviando condicionalmente `type` (se for preenchido "elite", o tipo assumido é "strength"), o `difficulty`, `estimatedDurationMinutes`. Transforma ainda uma matriz profunda de Arrays JS mapeando blocos pivotais em `plannedSets`, `plannedReps`, e `coachingCues` antes de chamar async function API.
    *   **Pipeline Exercícios:** O objeto submetido empurra de forma simples mas estrita a `category`, `complexity` (que re-mapeia de *difficulty* das props), `targetMuscles` matriz bruta e `equipment` também em matriz de strings.

**3. View Toggle Switch (Edit vs Preview):**
*   **Ação Esperada:** Renderizar condicionalmente os inputs brutos em formulários limpos read-only antes sequer de gravar.
*   **Teste:** SUCESSO. Isolamento seguro e eficiente onde o motor muda apenas de renderizar `<ExerciseBuilderModal>` para a sub-componente estática `<ItemPreview>` sem que as variáveis temporárias da RAM serem afetadas.

---

### Cláusula 2.4 – Identificação de Dependências e Vulnerabilidades
**Dependências Internas:**
*   **Gestores Contextuais:** `@/contexts/AppContext`
*   **Cloud API Connectors:** Uso robusto da pasta `@/hooks/use-api` atuando como barreira de segurança assíncrona entre estado front-end e o backend nativo.
*   **Painéis Auxiliares Renderizados em Portal/Wrapper:** `<DistributionPanel>`, `<ExerciseBuilderModal>`, etc.

**Dependências Externas:**
*   `framer-motion` (`motion/react`): Totalmente atado a todos os cartões, tabs e hovers. Uma quebra neste pacote inutilizaria os modais, travando processos vitais.
*   `lucide-react`: Toda a navegação por símbolos (Dumbbell, Cérebro, Relógio). A interface perderia o aspeto "Pro" tornando botões ininteligíveis.
*   `sonner@2.0.3`: Crítico para UX. Tratando-se de saves pesados, esta biblioteca emite as notificações que dizem se guardou adequadamente ou não. Falhas sistémicas fariam com que utilizadores perdessem sessões de horas sem perceber que os botões não gravaram nada por não ter ocorrido feedback.

---

### Cláusula 2.5 – Detecção Exaustiva de Sub-Modais e Campos Específicos
Todos os inputs criados desencadeiam conexões com a API nestas componentes de escopo local:

**Modal: Construtor de Exercícios (`<ExerciseBuilderModal>`)**
*   **Contexto de Chamada:** Disparado pelo clique no botão card "Criar do zero" com a abas de "Exercícios" ativa.
*   **Arquitetura do Payload (Onde caem os dados):**
    *   `name`: Obrigatoriedade ativada.
    *   `description`: Caixa flexível para regras técnicas do exercício.
    *   `category` (Select): Desagua num string enumerável exigido pelo BD (ex: *strength*, *cardio*).
    *   `complexity` (Dropdown de Níveis): Traduzido em Backend da chave intermédia *difficulty*.
    *   `targetMuscles` & `equipment`: O UI produz matrizes iterativas que serão guardadas em base de dados em formato de agregação JSON ou Tabelas Associativas.

**Modal: Construtor de Workouts (`<CreateWorkoutModal>`)**
*   **Contexto de Chamada:** Acionado perante o módulo "Workouts". Mais denso.
*   **Arquitetura do Payload (Onde caem os dados):**
    *   `name` & `description`: Metadados globais da sessão.
    *   `difficulty`: Campo avaliador que determina dinâmicas profundas de tipo (Lógica de intersecção elitista transformando arrays de string).
    *   `duration`: Passa o value `minutes` mapeado para o campo Supabase `estimatedDurationMinutes`.
    *   `blocks` (Objeto Array Dinâmico): Este formulário possui lógica complexa que gera n-Exercícios aninhados. Cada iteração recolherá da interface interativamente: `exerciseId`, N.º de Sets do modal, N.º de Reps, Tempos de descanso (`plannedRestSeconds`) e um campo extra livre para o coach ("notes" -> `coachingCues`).

**Painel de Distribuição (`<DistributionPanel>`)**
*   **Contexto de Chamada:** Operado via o botão de ação rápida "Distribuir" situado à direita do header `sticky`.
*   **Funcionalidade Acoplada:** Serve unicamente como condutor. Recebe pela prop `item` ou payload já guardado e invoca permissões de publicação multi-tenant para agendamento efetivo em perfis.

---

### Cláusula 2.6 – Usabilidade Executiva e Matriz de Risco Crítico

✅ **Certificado de Usabilidade "Glass-Tier":** Componente executa design system de Classe A de aspeto sublime. Gradientes (`bg-gradient-to-br`), cores modulares e transições contínuas proporcionam um standard empresarial Elevado digno do apelo "Design Studio". As contagens analíticas em cima ativam gamificação positiva no gestor desportivo.

**Riscos Encontrados Recomendados pelo Auditor (Reporte C-Level):**

🚨 **RISCO CRÍTICO 1 (Corrupção de Relacionalidade em BD - Linha 169):** 
Durante a gravação do modelo Workout, no re-mapeamento em runtime de exercicíos acoplados no código existe uma quebra massiva: `exerciseId: block.exerciseId || 'temp-${index}'`. Ao usar strings temporárias não validadas em UUID, mal a API tentar validar esta Query relacional à tabela originária de *Exercises* não encontrará chaves válidas. Falha de Foreign Key iminente e destrutiva em ambiente produtivo.

🚨 **RISCO ELEVADO 2 (Débitos em Planos e Aulas):**
Foi detetado que a gravação em base de dados nas tabs `classes` e `plans` encontram-se intencionalmente ausentes nas statements. Em seu lugar existe lógica em branco e `toast.info('Salvar ainda não implementado')`. Pelo fluxo UI transparecer uma plataforma final e pronta a usar, o choque emocional entre as promessas gráficas e a ineficácia real da API causará queixas de clientes exigentes em fases "Gold". 

🚨 **RISCO ESTRUTURAL/SCALING 3 (Síndrome Monolítica - "God Component"):**
Toda a página, desde transações de Backend, Hooks, Modelação de Dados à animação CSS encontram-se confinados num único ficheiro de ~1000 linhas de densidade. Dificultará a manutenção futura drasticamente para developers isolados. Separar de imediato as operações de "Data Mapping" e "State Handling" e libertar este ficheiro apenas para alocações visuais front-end.
