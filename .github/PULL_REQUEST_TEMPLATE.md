---
name: Pull Request
about: Proposta de alteração ao código
---

## 📋 Descrição

<!-- Descreve o que esta PR faz e porquê -->

## 🔗 Issue Relacionada

<!-- Fecha #XXX (se aplicável) -->

## 🧪 Tipo de Alteração

- [ ] 🐛 Bug fix (alteração não-breaking que resolve um problema)
- [ ] ✨ Nova funcionalidade (alteração não-breaking que adiciona funcionalidade)
- [ ] 💥 Breaking change (fix ou feature que altera comportamento existente)
- [ ] 🔒 Segurança (resolve uma vulnerabilidade)
- [ ] 📚 Documentação
- [ ] ♻️ Refactor
- [ ] 🎨 UI/UX
- [ ] ⚡ Performance

## ✅ Checklist

### Código
- [ ] O código segue os padrões do projecto (ESLint sem erros)
- [ ] TypeScript sem erros (`npx tsc --noEmit`)
- [ ] Sem `any` desnecessários introduzidos
- [ ] Sem `console.log` de debug deixados

### Segurança
- [ ] Sem credenciais, tokens ou secrets no código
- [ ] Sem `new Function()` ou `eval()`
- [ ] Inputs do utilizador estão validados/sanitizados
- [ ] `dangerouslySetInnerHTML` não foi adicionado sem sanitização

### Testes
- [ ] Testes existentes continuam a passar (`npm test`)
- [ ] Novos testes adicionados para a funcionalidade (se aplicável)
- [ ] Testes de acessibilidade passam (`axe`)

### Compliance
- [ ] Dados pessoais tratados com base legal válida (se aplicável)
- [ ] Novas colunas de dados de saúde encriptadas (se aplicável)

## 📸 Screenshots / Vídeo

<!-- Se houver alterações de UI, inclui screenshots do antes e depois -->

## 🗒️ Notas para o Revisor

<!-- Algo que o revisor deve saber ou verificar com especial atenção -->
