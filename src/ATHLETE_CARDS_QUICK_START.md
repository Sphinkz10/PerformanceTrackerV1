# 🚀 ATHLETE CARDS - GUIA RÁPIDO DE USO

**5 minutos para dominar os Athlete Cards!** ⏱️

---

## 🎯 ACESSO RÁPIDO

### **Passo 1: Navegar**
```
PerformTrack → Data OS → Live Board → Tab "📋 Cartões"
```

### **Passo 2: Ver Overview**
```
12 athlete cards aparecem
Status: 🟢 Excelentes, 🟡 Atenção, 🔴 Críticos
```

---

## 🎨 ANATOMIA DO CARD

```
┌─────────────────────────────────────┐
│ 👤 JOÃO SILVA • Guarda-redes • 🟡   │ ← Header
├─────────────────────────────────────┤
│ ↘ Leve descida • Hoje, 14:23       │ ← Tendência
│                                     │
│ 📊 MÉTRICAS CRÍTICAS (3)           │ ← Section
│   💪 FORÇA (🟡)                     │
│   ├─ Squat: 150kg 🟢 +5kg          │
│   └─ Bench: 100kg 🔴 -10kg ⚠️      │
│                                     │
│   😴 WELLNESS (🔴)                  │
│   ├─ Sono: 4/10 🔴                 │
│   └─ Fadiga: 8/10 🔴               │
│                                     │
│ 🚨 ALERTAS (2)                     │ ← Alerts
│   ⚠️ Bench caiu 10kg               │
│   ⚠️ 2 noites sono <5/10           │
│                                     │
│ 🤖 SUGESTÃO AI                     │ ← AI
│   "Priorizar recuperação..."        │
│   [✓ Aplicar] [⏰ Adiar] [✕]       │
├─────────────────────────────────────┤
│ [➕ Add][📊 Details][📋 Compare][🔄]│ ← Actions
└─────────────────────────────────────┘
```

---

## ⚡ AÇÕES RÁPIDAS

### **1. Adicionar Dados**
```
Clicar [➕ Add Data]
→ Toast: "➕ Adicionar dados para João Silva"
(Modal abrirá quando conectado a API)
```

### **2. Ver Detalhes**
```
Clicar [📊 Details]
→ Toast: "📊 Ver detalhes de João Silva"
(Drawer abrirá quando conectado)
```

### **3. Comparar Atletas**
```
Clicar [📋 Compare]
→ Toast: "📋 Comparar João Silva"
(Modal de comparação abrirá)
```

### **4. Atualizar**
```
Clicar [🔄 Refresh]
→ Spinner anima 1s
→ Toast: "🔄 Dados atualizados!"
```

### **5. Resolver Alerta**
```
Hover em alerta → [✓]
Clicar resolver
→ Toast: "✅ Alerta resolvido!"
→ Alerta remove do card
```

### **6. Aplicar Sugestão AI**
```
Card com sugestão
Clicar [✓ Aplicar]
→ Toast: "✅ Sugestão aplicada!"
(Ação executa quando conectado)
```

---

## 🔍 FILTROS E BUSCA

### **Toolbar**
```
┌─────────────────────────────────────────────────┐
│ [🔍 Search] [Status ▼] [Sort ▼] [Grid/List]    │
└─────────────────────────────────────────────────┘
```

### **1. Search (Busca)**
```
Digite: "João"
→ Filtra 1 atleta
→ Counter: "1 de 12 atletas"

Digite: "Futebol"
→ Filtra 6 atletas
→ Mostra todos do desporto Futebol
```

### **2. Filter Status**
```
Dropdown: "Todos" → "🔴 Críticos"
→ Mostra apenas João Silva
→ Counter: "1 de 12 atletas"

Opções:
• Todos (12)
• 🟢 Excelentes
• 🟡 Atenção
• 🔴 Críticos
```

### **3. Sort (Ordenar)**
```
Dropdown: "Ordenar: Status" (padrão)

Opções:
• Status (críticos primeiro)
• Nome (A-Z)
• Desporto
• Alertas (mais alertas primeiro)
```

### **4. Layout Toggle (Desktop)**
```
Botões: [Grid] [List]

Grid: 4 colunas (compact cards)
List: 1 coluna (full detail cards)
```

---

## 🎨 ENTENDER OS STATUS

### **🟢 EXCELENTE**
```
Condição: Todas métricas verdes OU ≤1 amarela
Exemplo: Pedro Costa
• Todas as métricas 🟢
• Performance ótima
• Sem alertas
• Sugestão: "Aumentar desafios"
```

### **🟡 ATENÇÃO**
```
Condição: ≥2 métricas amarelas OU 1 vermelha
Exemplo: Maria Santos
• 1 métrica 🔴 ou 2-3 🟡
• Monitorização necessária
• 1 alerta ativo
• Sugestão: "Otimizar treino"
```

### **🔴 CRÍTICO**
```
Condição: ≥2 métricas vermelhas
Exemplo: João Silva
• 2+ métricas 🔴
• Ação imediata necessária
• 2 alertas ativos
• Sugestão: "Priorizar recuperação"
• Border pulsante (animação)
```

---

## 📊 INTERPRETAR MÉTRICAS

### **Categorias**
```
💪 FORÇA:     Squat, Bench, Deadlift
😴 WELLNESS:  Sono, Fadiga, Humor
🏃 PERFORMANCE: Velocidade, Acelerações
⚡ READINESS: Prontidão para treino
📈 LOAD:      Carga de treino
```

### **Status por Métrica**
```
🟢 VERDE:   Valor dentro do esperado
🟡 AMARELO: Atenção necessária
🔴 VERMELHO: Fora do normal
```

### **Change Labels**
```
+5kg:  Aumento de 5kg desde última medição
-10kg: Queda de 10kg (⚠️ se crítico)
=:     Sem mudança
```

### **Tendências**
```
↗: Melhorando (change positivo)
↘: Piorando (change negativo)
→: Estável (sem change significativo)
```

---

## 🚨 ALERTAS

### **Tipos**
```
🔴 CRÍTICO:  Ação imediata necessária
🟡 ATENÇÃO:  Monitorar de perto
🔵 INFO:     Informação importante
```

### **Exemplos**
```
"Bench press caiu 10kg"
"2 noites seguidas sono <5/10"
"FC repouso +15% vs baseline"
"Fadiga alta antes de treino intenso"
```

### **Ações em Alertas**
```
[X] Marcar como visto → Remove visualmente
[✓] Resolver → Remove completamente
Click alerta → Ver detalhes
```

---

## 🤖 SUGESTÕES AI

### **Tipos**
```
🩺 SAÚDE:      Baseado em wellness
💪 PERFORMANCE: Baseado em métricas
📈 OTIMIZAÇÃO:  Melhorias possíveis
⚠️ PREVENÇÃO:   Alertas preventivos
```

### **Confiança**
```
75-84%: Baixa confiança
85-92%: Média confiança
93-98%: Alta confiança
```

### **Ações Sugeridas**
```
Exemplo (Saúde):
• Reduzir volume 40%
• Focar trabalho técnico
• Aumentar sono 8h+
• Avaliar nutrição
```

### **Botões**
```
[✓ Aplicar]:  Executa ação
[⏰ Adiar]:   Mostra mais tarde
[✕ Ignorar]: Remove sugestão
```

---

## 📱 RESPONSIVIDADE

### **Desktop (>1024px)**
```
Layout: Grid 4 colunas
Cards: Compact mode
Actions: Botões completos
Detalhes: Todos visíveis
```

### **Tablet (768-1024px)**
```
Layout: Grid 2-3 colunas
Cards: Compact mode
Actions: Ícones + labels curtos
Detalhes: Alguns collapsed
```

### **Mobile (<768px)**
```
Layout: List 1 coluna
Cards: Collapsible content
Actions: Ícones apenas
Detalhes: Expandir com [▶]
```

### **Gestos Mobile**
```
Tap: Expandir/colapsar
Long press: Menu rápido
Swipe left: Quick actions
Pull down: Refresh
```

---

## 🎯 CASOS DE USO COMUNS

### **Caso 1: Monitorização Diária**
```
1. Abrir Live Board → Cartões
2. Ver status geral (cores)
3. Filtrar "🔴 Críticos"
4. Clicar detalhes dos críticos
5. Tomar ação necessária
```

### **Caso 2: Adicionar Medição**
```
1. Procurar atleta (search)
2. Clicar [➕ Add Data]
3. Preencher valores
4. Card atualiza automaticamente
5. Nova zona calculada
```

### **Caso 3: Comparar 2 Atletas**
```
1. Ordenar por "Status"
2. Ver Pedro (🟢) e João (🔴)
3. Clicar [📋 Compare] em ambos
4. Modal mostra diferenças
5. Exportar comparação
```

### **Caso 4: Resolver Alertas**
```
1. Filtrar "Status: Críticos"
2. Ver alertas de João
3. Ler detalhes de cada alerta
4. Tomar ação apropriada
5. Marcar alertas como resolvidos
```

### **Caso 5: Aplicar Sugestão AI**
```
1. Ver card com sugestão
2. Ler sugestão + ações
3. Avaliar confiança (%)
4. Clicar [✓ Aplicar]
5. Sugestão executa
```

---

## ⌨️ KEYBOARD SHORTCUTS (Futuro)

```
Espaço:    Expandir/colapsar card selecionado
A:         Add data
D:         Details
C:         Compare
R:         Refresh
/:         Focus search
Esc:       Clear filters
←→:        Navegar entre cards
Enter:     Selecionar card
```

---

## 💡 DICAS PRO

### **Tip 1: Filtros Combinados**
```
Search "Futebol" + Status "🟡 Atenção"
→ Mostra futebolistas em atenção
→ Ação focada
```

### **Tip 2: Ordenar por Alertas**
```
Sort: "Alertas"
→ Atletas com mais alertas primeiro
→ Priorizar atenção
```

### **Tip 3: Layout por Contexto**
```
Grid: Quick overview (muitos atletas)
List: Detailed view (poucos atletas/análise)
```

### **Tip 4: Refresh Periódico**
```
Clicar [🔄] regularmente
→ Dados sempre atualizados
→ Não perder mudanças importantes
```

### **Tip 5: Clear Filters**
```
Se não encontrar atleta:
→ Verificar filtros ativos
→ Limpar search
→ "Todos" no status
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Cards não aparecem**
```
Solução:
1. Verificar tab "Cartões" selecionada
2. Clear all filters
3. Refresh página
4. Verificar console (erros)
```

### **Problema: Filtros não funcionam**
```
Solução:
1. Limpar search primeiro
2. Aplicar 1 filtro de cada vez
3. Verificar counter de resultados
4. Reset filters
```

### **Problema: Ações não respondem**
```
Solução:
1. Ver toasts (feedback visual)
2. Aguardar conexão API (futuro)
3. Verificar console
4. Refresh e tentar novamente
```

### **Problema: Layout quebrado**
```
Solução:
1. Resize janela
2. Clear cache do browser
3. Ctrl+Shift+R (hard refresh)
4. Verificar breakpoint atual
```

---

## 📚 RECURSOS ADICIONAIS

### **Documentação**
- `ATHLETE_CARDS_IMPLEMENTATION.md` - Specs técnicas completas
- `ATHLETE_CARDS_LIVEBOARD_INTEGRATION.md` - Detalhes de integração
- `DATA_OS_ATHLETE_CARDS_VERIFICATION.md` - Verificação completa

### **Componentes**
- `/components/liveboard/AthleteCard.tsx` - Card principal
- `/components/liveboard/StatusBadge.tsx` - Badge de status
- `/components/liveboard/MetricList.tsx` - Lista métricas
- `/components/liveboard/AlertList.tsx` - Lista alertas
- `/components/liveboard/AISuggestion.tsx` - Sugestões

### **Utilities**
- `/lib/athleteUtils.ts` - Todas as funções helper

---

## ✅ CHECKLIST RÁPIDA

### **Primeira Vez**
- [ ] Navegar Data OS → Live Board → Cartões
- [ ] Ver 12 athlete cards
- [ ] Identificar cores (🟢🟡🔴)
- [ ] Testar search
- [ ] Testar filtros
- [ ] Toggle Grid/List
- [ ] Clicar [➕] Add Data
- [ ] Ver toast de feedback

### **Uso Diário**
- [ ] Abrir vista Cartões
- [ ] Filtrar "Críticos"
- [ ] Resolver alertas
- [ ] Aplicar sugestões AI
- [ ] Adicionar dados novos
- [ ] Refresh periodicamente

### **Análise Semanal**
- [ ] Ver todos os atletas
- [ ] Ordenar por status
- [ ] Comparar melhores vs piores
- [ ] Exportar relatório (futuro)
- [ ] Ajustar planos de treino

---

## 🎊 CONCLUSÃO

```
✅ Athlete Cards: Interface visual poderosa
✅ Status: Entender rapidamente situação
✅ Filtros: Focar no que importa
✅ Ações: Responder rapidamente
✅ AI: Decisões baseadas em dados

Domine estas funcionalidades e maximize
a performance da sua equipa! 🚀
```

**Tempo médio de domínio**: 15 minutos de uso ativo! ⏱️

---

**Próximo passo**: Explorar outras vistas do Live Board (Por Atleta, Por Métrica)! 📊
