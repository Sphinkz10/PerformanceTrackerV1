# Luna Forms Center - Inventário Funcional

## 1. Componentes
O módulo Luna Forms está localizado em `src/components/studio/luna/forms/` e é composto pelos seguintes componentes React:
- `LunaFormsApp`: O ponto de entrada principal da aplicação que encapsula tudo no `LunaFormsProvider` e renderiza `FormsSidebar`, `FormsWorkspace` e `FormsPropertiesPanel`.
- `FormsSidebar`: Uma barra lateral para navegar, pesquisar e gerir formulários (separadores para 'todos', 'modelos', 'respostas'). Gere ações como pré-visualizar, editar, duplicar, publicar e apagar através de um menu de contexto.
- `FormsWorkspace`: A área central para editar o título, descrição e campos de um formulário. Utiliza `@dnd-kit/sortable` para reordenação drag-and-drop do `SortableFieldCard`.
- `SortableFieldCard`: Um componente ordenável que representa um único campo de formulário com pega de arrastamento, entrada de etiqueta, crachá de tipo de campo e ações (duplicar, apagar).
- `FormsPropertiesPanel`: O painel do lado direito para editar propriedades de campos, regras de lógica do formulário e transformações de dados. Contém separadores para 'propriedades', 'lógica' e 'transformações'.
- `LunaSubmissionModal`: Um modal para pré-visualizar e submeter um formulário. Renderiza os campos do formulário e lida com alterações de entrada, validação (campos obrigatórios) e submissão.
- `DrawerBackdrop`: Um componente de fundo para capacidade de resposta móvel para fechar as gavetas laterais quando clicadas.

## 2. Contexto e Gestão de Estado
- `LunaFormsContext`: Fornece estado global usando React Context. Gere a lista de formulários, o formulário atualmente selecionado, o campo selecionado, os estados das gavetas (móvel) e o formulário de pré-visualização.
- **Integração SWR**: Utiliza `useSWR` para obter os dados iniciais do formulário a partir de `/api/forms`.
- As mutações de estado (criar, atualizar, apagar) são efetuadas através de chamadas de API em `lunaFormsApi.ts` seguidas de uma mutação SWR `mutate` para atualizar os dados.

## 3. Campos de Entrada e Tipos
O sistema suporta os seguintes tipos de campos definidos em `SortableFieldCard.tsx`:
- `text`: Texto curto.
- `textarea`: Texto longo.
- `number`: Número.
- `email`: Endereço de email.
- `phone`: Número de telefone.
- `date`: Data.
- `time`: Hora.
- `duration`: Duração.
- `select`: Lista suspensa.
- `radio`: Escolha única.
- `checkbox`: Múltipla escolha.
- `rating`: Avaliação de 1 a 10.
- `location`: Localização.
- `upload`: Upload de ficheiros.
- `signature`: Assinatura.

## 4. Ações e Interações do Utilizador
- **Barra Lateral (Sidebar)**: Criar um novo formulário, alternar entre separadores (Todos, Modelos, Respostas), pesquisar formulários, usar o menu de contexto nos formulários (Pré-visualizar, Editar, Duplicar, Publicar/Arquivar, Apagar).
- **Espaço de Trabalho (Workspace)**: Editar o título/descrição do formulário, adicionar um novo campo, arrastar e soltar para reordenar os campos, selecionar um campo para editar as propriedades, duplicar um campo, apagar um campo, guardar o formulário.
- **Painel de Propriedades (Properties Panel)**: Editar a etiqueta do campo, o texto de espaço reservado (placeholder), o status de obrigatoriedade, as opções (separadas por vírgula). Editar as regras lógicas do formulário (campo, condição, valor, ação, campo alvo). Editar as transformações do campo (tipo, multiplicador).
- **Modal de Submissão**: Preencher os campos do formulário e submeter as respostas.

## 5. Motor de Dados e Transformações
- **Transformações**: Os campos podem ter uma propriedade de `transform` definida em `formsTypes.ts` com os tipos: `none`, `kg_to_lbs`, `lbs_to_kg`, `scale`, `percentage`. Os tipos `scale` e `percentage` utilizam um `multiplier`.
- **Regras de Lógica**: Os formulários podem ter `logicRules` definidas por `fieldId`, `condition` ('equals', 'not_equals', 'contains', 'greater', 'less'), `value`, `action` ('show', 'hide', 'require') e `targetFieldId`.
- A aplicação real destas transformações e regras lógicas durante a submissão está prevista na arquitetura (como documentado na memória técnica), mas os cálculos matemáticos dependem dos parâmetros definidos.

## 6. Atalhos e Wireframes
- **Wireframes**: Não existem ficheiros de wireframe explícitos no código fonte; no entanto, o layout está estruturado em três colunas principais: Sidebar (à esquerda), Workspace (ao centro) e Painel de Propriedades (à direita).
- **Atalhos**: Não foram encontrados atalhos de teclado (keyboard shortcuts) implementados globalmente no módulo Luna Forms. Todas as interações dependem de cliques no rato ou toques no ecrã.

## 7. Dívida Técnica e Observações
- As regras lógicas são definidas na interface do utilizador, mas não há um mecanismo de validação complexo ou de avaliação em tempo de execução explicitamente visível em `LunaSubmissionModal.tsx` para mostrar/ocultar dinamicamente os campos com base nestas regras durante o preenchimento do formulário. O modal simplesmente renderiza todos os campos.
- As transformações de dados estão definidas na UI, mas a lógica de transformação de dados efetiva antes da submissão da API não está totalmente implementada no modal do frontend (`LunaSubmissionModal`). Como nota técnica, o motor deverá aplicar as operações matemáticas específicas antes da submissão, mas isso pode estar a ocorrer no lado do backend ou faltar neste excerto de código do frontend.
- O menu de contexto em `FormsSidebar` utiliza estilos em linha (inline styles) rígidos para o posicionamento, o que pode não ser perfeitamente robusto em todos os tamanhos de ecrã.
- O método `saveForm` no Context tem comentários que indicam um tratamento simplista de formulários novos vs existentes (assumindo que falha no PUT se for novo, confiando em updateLunaForm).
