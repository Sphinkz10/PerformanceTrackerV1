# Relatório de Auditoria de Reconhecimento do Repositório (Read-Only)

Este relatório apresenta a fotografia exata do estado atual do repositório remoto e local, antes de qualquer operação de limpeza. Nenhuma alteração foi realizada.

## 1. Lista das Branches

### Total de Branches
* Foram identificadas **80** branches no total (79 remotas, 1 local, com 1 remote associada à main).

### Agrupamento de Branches
* **Branches Main/Master:** `main` (remoto e local).
* **Branches Dependabot:** 8 branches.
  * `dependabot/npm_and_yarn/react-resizable-panels-4.9.0`
  * `dependabot/npm_and_yarn/sentry/nextjs-10.47.0`
  * `dependabot/npm_and_yarn/sentry/react-10.47.0`
  * `dependabot/npm_and_yarn/supabase-eff79acc02`
  * `dependabot/npm_and_yarn/testing-d170324582`
  * `dependabot/npm_and_yarn/types/node-25.5.2`
  * `dependabot/npm_and_yarn/vite-8.0.4`
* **Branches de Feature/Feat (Novas funcionalidades):** 11 branches.
* **Branches de Fix (Correções):** 6 branches.
* **Branches de Chore/Perf/Docs/Refactor:** 8 branches.
* **Branches de Auditoria/Scan/Report:** 11 branches.
* **Branches Jules (Tarefas automatizadas/agentes):** 11 branches.
* **Branches Luna OS/Override (Fase 2 e 3):** 13 branches.
* **Outras branches variadas (V2 Manager, Sentinel, etc.):** 11 branches.

## 2. Estado da Main

A branch inspecionada é a `main`.

### Último Commit
* **Hash:** `b90a60b7911c2c642edda1153ab0aa423d7b7771`
* **Mensagem:** `Merge pull request #81 from Sphinkz10/luna-login-pixel-perfect-17748696536142549840`

### Ficheiro `src/components/luna-obsidian/auth/LunaLogin.tsx`
* **Existe na main?** Sim.
* **Tamanho aproximado:** 232 linhas. (Confirmando a versão "pixel-perfect" que foi injetada recentemente).

## 3. O Fantasma do "LoginV2"

Uma procura ativa foi realizada em todos os commits e branches pelo ficheiro `src/components/auth/LoginV2.tsx` e por referências à rota `/login-v2` no `src/App.tsx`.

* **Ficheiro Localizado:** O ficheiro `LoginV2.tsx` ainda existe em dezenas de branches que não foram apagadas após os merges ou abandonadas.
* **Rota no App.tsx:** A referência `window.location.pathname === '/login-v2'` ainda se encontra escondida em branches antigas.
* **Branch Escondida:** Uma das branches mais notáveis e isoladas onde o fantasma ainda reside intacto é a branch remota:
  * `origin/jules-11744655603352955328-edbb4356`

Esta branch possui as referências intactas no `src/App.tsx` para `/login-v2` e o próprio componente de ficheiro. A confusão no relatório anterior decorreu de inspeções acidentais ao histórico ou a estados presentes em branches secundárias que não acompanharam a purga feita na branch principal.
