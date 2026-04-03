# Relatório "State of the Nation" - Auditoria de Arquitetura

🟢 **Status de Compilação:**
Falha. O build atual (via `npm run type-check`) tem múltiplos erros relacionados com TypeScript. O principal problema encontra-se no ficheiro `src/components/athlete/drawers/SessionDetailsDrawer.tsx`, que contém numerosos erros de sintaxe graves (`TS1127: Invalid character`, `TS1005: ',' expected`, etc.), indicando código corrompido. A aplicação não compilaria com sucesso para gerar um APK/Build neste momento.

🗺️ **Mapa de Rotas Principal:**
O routing no entry point (`src/App.tsx`) é baseado em estados (`currentPage`) dentro de componentes, em vez de uma biblioteca de routing formal (ex: react-router).
Na rota raiz (`/`), é renderizada a lógica do `AuthenticatedApp`, que por sua vez decide se mostra a interface antiga (dependendo se é treinador ou atleta) ou redireciona para a página de Login (`LoginPage` antigo). O novo ecrã `LunaLoginScreen` (denominado `LoginV2`) não está ligado na raiz; apenas atua como um teste isolado acessível através da rota "hardcoded" `/login-v2`.

🔐 **Motor de Auth:**
A aplicação usa o Supabase Auth (configurado no `src/contexts/AppContext.tsx`).
O sistema de rotas protegidas está ativo e funcional. O `AuthenticatedApp` assegura que os utilizadores sem uma sessão de login válida não consigam aceder à plataforma principal, encaminhando-os para as páginas de login/registo antigas.

🏗️ **Dívida de UI Pendurada:**
Existem vários ecrãs e dashboards antigos, carregados via lazy loading na rota principal (`App.tsx`), que ainda estão oficiais e ativos, tais como:
1. `FormCenter`
2. `ReportBuilderV2`
3. `DataOS`
4. `AutomationPage`

🎯 **Diagnóstico do Arquiteto:**
Para que o novo fluxo de Login Luna Obsidian funcione de ponta a ponta, é necessário:
1. **Ligar o novo ecrã:** Alterar o `AuthenticatedApp` no `App.tsx` para apresentar o componente `LoginV2` (em vez de `LoginPage` ou `RegisterPage` antigos) quando o utilizador não está autenticado.
2. **Integração do motor de Auth:** No `LoginV2`, as ações de submissão do formulário (`onSubmit={(e) => e.preventDefault()}`) precisam ser ligadas às funções reais de autenticação (`login`, `register`, métodos de login social) disponibilizadas pelo `useApp()` (AppContext).
3. **Gestão do idioma:** O `LoginV2` tem o seu próprio `I18nProvider` injetado diretamente no `App.tsx` na rota de teste. Isto precisa de ser integrado de forma global para garantir consistência em toda a aplicação.
4. **Remover "bypass":** Retirar o código de teste "hardcoded" `if (window.location.pathname === '/login-v2')` no ficheiro `App.tsx`.
5. **Resolver Erros de Build:** É essencial corrigir de imediato os problemas de sintaxe que bloqueiam a compilação, particularmente em `SessionDetailsDrawer.tsx`.