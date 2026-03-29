**Add your own guidelines here**
<!
#### **Especificações:**
- **Border Radius:** `rounded-2xl` (16px)
- **Border:** `border border-slate-200/80` (1px, 80% opacidade)
- **Padding:** `p-4` (16px todos os lados)
- **Shadow:** `shadow-sm` (sombra suave)
- **Ícone Container:** `h-8 w-8 rounded-xl` (32px × 32px, 12px radius)
- **Ícone Size:** `h-4 w-4` (16px)

---

### **2. TABS (Abas de Navegação)**

#### **Container:**
```tsx
<div className="flex gap-2 overflow-x-auto pb-2">
```

#### **Tab Individual:**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => setActiveTab('overview')}
  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
    activeTab === 'overview'
      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
  }`}
>
  <span className="text-lg">📊</span>
  Visão Geral
</motion.button>
```

#### **Estados:**

**Ativo:**
```tsx
className="bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
```
- Gradiente sky
- Texto branco
- Sombra colorida com 30% opacidade

**Inativo:**
```tsx
className="bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300"
```
- Fundo branco
- Borda slate-200
- Texto slate-700
- Hover muda borda para sky-300

#### **Especificações:**
- **Padding:** `px-6 py-3` (24px horizontal, 12px vertical)
- **Border Radius:** `rounded-xl` (12px)
- **Font:** `text-sm font-semibold` (14px, peso 600)
- **Icon Size:** `text-lg` (18px)
- **Whitespace:** `whitespace-nowrap` (sem quebra de linha)
- **Overflow:** Container com `overflow-x-auto` para scroll horizontal em mobile

---

### **3. BOTÕES**

#### **Botão Primário (Ação Principal):**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
>
  <Icon className="h-4 w-4" />
  <span>Ação</span>
</motion.button>
```

**Características:**
- Gradiente emerald
- Texto branco
- Sombra média
- Hover clareia o gradiente
- Animação de escala

#### **Botão Secundário:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
>
  <Icon className="h-4 w-4" />
  <span>Ação</span>
</motion.button>
```

**Características:**
- Borda sky-200
- Fundo sky-50
- Texto sky-700
- Hover escurece fundo

#### **Botão de Alerta/Perigo:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-red-200 hover:bg-red-50 transition-colors"
>
  <Icon className="h-4 w-4" />
  Lembrar
</motion.button>
```

**Características:**
- Borda red-200
- Fundo branco
- Hover red-50

#### **Tamanhos de Botão:**

**Padrão:**
```tsx
className="px-4 py-2"        // 16px horizontal, 8px vertical
```

**Grande:**
```tsx
className="px-6 py-3"        // 24px horizontal, 12px vertical
```

**Pequeno:**
```tsx
className="px-3 py-2"        // 12px horizontal, 8px vertical
```

#### **Icon Size em Botões:**
```tsx
className="h-4 w-4"          // 16px (padrão)
```

---

### **4. QUICK ACTION CARDS**

#### **Estrutura:**
```tsx
<motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="group p-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400 hover:shadow-xl transition-all"
>
  <div className="flex items-center gap-4">
    {/* Icon container */}
    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
      <Icon className="h-7 w-7 text-white" />
    </div>
    
    {/* Content */}
    <div className="flex-1 text-left">
      <h4 className="font-bold text-slate-900 mb-1">Título da Ação</h4>
      <p className="text-xs text-slate-600">Descrição da funcionalidade</p>
    </div>
    
    {/* Badge/Indicador */}
    <div className="shrink-0 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
      3
    </div>
  </div>
</motion.button>
```

**Características:**
- Todo o card é clicável (button)
- Ícone grande (56px × 56px, ícone 28px)
- Ícone escala no hover do card (group-hover)
- Border que muda de cor no hover
- Shadow aumenta no hover

---

### **5. ALERT CARDS (Pagamentos Atrasados)**

#### **Estrutura:**
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
>
  {/* Avatar + Info */}
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-red-300">
      <img src={avatar} alt={name} className="h-full w-full object-cover" />
    </div>
    <div>
      <h4 className="font-semibold text-slate-900">{name}</h4>
      <p className="text-sm text-red-600">Venceu em {date} • €{amount}</p>
    </div>
  </div>
  
  {/* Actions */}
  <div className="flex gap-2">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-red-200 hover:bg-red-50 transition-colors"
    >
      <Send className="h-4 w-4" />
      Lembrar
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all"
    >
      Marcar pago
    </motion.button>
  </div>
</motion.div>
```

**Características:**
- Gradiente red-50 → orange-50
- Borda red-200
- Avatar com borda colorida
- Texto de alerta em red-600
- Botões de ação inline

---

### **6. INPUTS E FORMULÁRIOS**

#### **Input de Pesquisa:**
```tsx
<div className="flex-1 relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
  <input
    type="text"
    placeholder="Procurar atleta..."
    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
  />
</div>
```

**Características:**
- Ícone posicionado absolutamente à esquerda
- Padding-left compensado (`pl-10`)
- Borda slate-200
- Focus ring sky com 30% opacidade
- Background translúcido (white/90)

#### **Select/Dropdown:**
```tsx
<div className="relative flex-1 sm:flex-none sm:w-40">
  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
  <select
    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
  >
    <option value="all">Todos</option>
    <option value="paid">Pagos</option>
    <option value="pending">Pendentes</option>
  </select>
</div>
```

**Características:**
- Ícone à esquerda (pointer-events-none)
- `appearance-none` para remover seta padrão
- `cursor-pointer`
- Mesmos estilos que input

---

### **7. CARDS (Card Component)**

#### **Uso do Componente Card:**
```tsx
<Card 
  title="Título do Card" 
  subtitle="Subtítulo ou descrição"
  accent="bg-gradient-to-br from-slate-50/95 to-white/95"
  action={<ButtonComponent />}  // Opcional
>
  {/* Conteúdo do card */}
</Card>
```

**Características do Card:**
- Border radius grande
- Padding consistente
- Header com título e subtítulo
- Slot para ação (botão) no canto superior direito
- Background gradiente customizável

---

### **8. GRÁFICOS (CHARTS)**

#### **Container de Gráfico:**
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
    <Tooltip contentStyle={{ 
      backgroundColor: 'white', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      fontSize: '12px' 
    }} />
    <Legend wrapperStyle={{ fontSize: '12px' }} />
    <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={3} />
  </LineChart>
</ResponsiveContainer>
```

**Padrões de Gráfico:**
- **Altura:** 300px (padrão)
- **Grid Color:** #e2e8f0 (slate-200)
- **Axis Color:** #64748b (slate-500)
- **Font Size:** 12px
- **Tooltip:** Fundo branco, borda slate-200, border-radius 12px
- **Line Width:** 3px (destaque)

**Cores de Linhas:**
- Verde (Receitas): #10b981 (emerald-500)
- Vermelho (Despesas): #ef4444 (red-500)
- Azul (Lucro): #0ea5e9 (sky-500)

---

## 🎬 **ANIMAÇÕES**

### **Animações com Motion (Framer Motion)**

#### **Fade In + Slide Up (Cards):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
```

**Padrão de Delays:**
- Primeiro card: sem delay ou 0s
- Segundo card: 0.1s
- Terceiro card: 0.2s
- Quarto card: 0.3s
- Etc.

#### **Fade In + Slide From Left (Alerts):**
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

**Stagger:** 0.05s entre cada item da lista

#### **Hover Scale (Botões):**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

**Valores:**
- Hover: `scale: 1.05` (5% maior)
- Tap/Click: `scale: 0.95` (5% menor)

#### **Hover Scale + Lift (Cards Grandes):**
```tsx
<motion.button
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
>
```

**Valores:**
- Hover: 2% maior + 2px para cima
- Tap: 2% menor

#### **Group Hover (Ícone dentro de card):**
```tsx
// No container:
className="group"

// No elemento que anima:
className="group-hover:scale-110 transition-transform"
```

---

## 🖱️ **ESTADOS INTERATIVOS**

### **Hover States**

#### **Botões:**
```tsx
// Primary
hover:from-emerald-400 hover:to-emerald-500

// Secondary
hover:bg-sky-100
hover:border-sky-300

// Card
hover:border-emerald-400 hover:shadow-xl
```

#### **Tabs:**
```tsx
hover:border-sky-300  // Quando inativo
```

### **Active/Focus States**

#### **Inputs:**
```tsx
focus:outline-none 
focus:ring-2 
focus:ring-sky-500/30 
focus:border-sky-300
```

**Características:**
- Remove outline padrão
- Adiciona ring (anel externo) sky com 30% opacidade
- Borda muda para sky-300

### **Disabled State**
```tsx
disabled:opacity-50 
disabled:cursor-not-allowed
```

---

## 📱 **RESPONSIVIDADE**

### **Breakpoints do Tailwind:**
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### **Padrões Responsivos Usados:**

#### **Spacing:**
```tsx
space-y-4 sm:space-y-5        // Vertical spacing
gap-3 sm:gap-4                // Grid gap
p-4 sm:p-5                    // Padding
```

#### **Grid Columns:**
```tsx
grid-cols-2 lg:grid-cols-4    // 2 cols mobile, 4 cols desktop
grid-cols-1 sm:grid-cols-2    // 1 col mobile, 2 cols tablet+
```

#### **Flex Direction:**
```tsx
flex-col sm:flex-row          // Coluna mobile, linha desktop
```

#### **Display:**
```tsx
hidden sm:inline              // Esconde em mobile, mostra em tablet+
hidden sm:block
```

#### **Width:**
```tsx
w-full sm:w-40                // Full width mobile, 160px desktop
flex-1 sm:flex-none           // Flex em mobile, tamanho fixo desktop
```

### **Mobile-First Approach:**

✅ **Sempre começar com mobile:**
```tsx
// ❌ ERRADO (desktop-first)
className="lg:grid-cols-4 grid-cols-2"

// ✅ CERTO (mobile-first)
className="grid-cols-2 lg:grid-cols-4"
```

---

## 📚 **REFERÊNCIA COMPLETA DE CLASSES**

### **Border Radius (Arredondamentos)**
```css
rounded-xl      /* 12px - Botões, inputs, select */
rounded-2xl     /* 16px - Cards, stat cards */
rounded-full    /* 100% - Avatares, badges circulares */
```

### **Shadows (Sombras)**
```css
shadow-sm       /* Sombra muito suave - Stat cards */
shadow-md       /* Sombra média - Botões primários */
shadow-lg       /* Sombra grande - Tabs ativas */
shadow-xl       /* Sombra extra grande - Hover em cards */

/* Shadows coloridas */
shadow-sky-500/30      /* Sombra sky com 30% opacidade */
```

### **Opacity (Opacidade)**
```css
bg-white/90            /* Background branco com 90% opacidade */
border-slate-200/80    /* Border com 80% opacidade */
from-emerald-50/90     /* Gradiente com 90% opacidade */
```

### **Transitions**
```css
transition-all         /* Transição em todas as propriedades */
transition-colors      /* Transição apenas em cores */
transition-transform   /* Transição apenas em transform */
```

**Duração padrão:** 150ms (Tailwind default)

---

## 🎨 **PADRÕES DE GRADIENTE**

### **Background Gradientes (Diagonal - br):**
```css
/* Stat Cards */
bg-gradient-to-br from-emerald-50/90 to-white/90
bg-gradient-to-br from-sky-50/90 to-white/90
bg-gradient-to-br from-amber-50/90 to-white/90
bg-gradient-to-br from-violet-50/90 to-white/90
bg-gradient-to-br from-red-50/30 to-white/90

/* Quick Action Cards */
bg-gradient-to-br from-emerald-50 to-white
bg-gradient-to-br from-sky-50 to-white

/* Ícones */
bg-gradient-to-br from-emerald-500 to-emerald-600
bg-gradient-to-br from-sky-500 to-sky-600
bg-gradient-to-br from-amber-500 to-amber-600
bg-gradient-to-br from-violet-500 to-violet-600
```

### **Botões Gradientes (Horizontal - r):**
```css
/* Primary */
bg-gradient-to-r from-emerald-500 to-emerald-600
hover:from-emerald-400 hover:to-emerald-500

/* Tabs Ativas */
bg-gradient-to-r from-sky-500 to-sky-600

/* Alerts */
bg-gradient-to-r from-red-50 to-orange-50
```

**Nota:** 
- `to-br` = diagonal (bottom-right)
- `to-r` = horizontal (right)

---

## 🔍 **STATUS INDICATORS**

### **Status Config Object:**
```tsx
const statusConfig = {
  paid: { 
    label: 'Pago', 
    color: 'emerald', 
    icon: CheckCircle 
  },
  pending: { 
    label: 'Pendente', 
    color: 'amber', 
    icon: Clock 
  },
  overdue: { 
    label: 'Atrasado', 
    color: 'red', 
    icon: AlertCircle 
  },
}
```

### **Badge de Status:**
```tsx
<span className={`
  inline-flex items-center gap-1 
  px-2 py-1 
  rounded-full 
  text-xs font-medium
  ${status === 'paid' ? 'bg-emerald-100 text-emerald-700' : ''}
  ${status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
  ${status === 'overdue' ? 'bg-red-100 text-red-700' : ''}
`}>
  <Icon className="h-3 w-3" />
  {label}
</span>
```

---

## ✅ **CHECKLIST DE IMPLEMENTAÇÃO**

Ao criar uma nova página/componente baseado na BusinessPage:

### **Estrutura:**
- [ ] Container com `space-y-4 sm:space-y-5`
- [ ] Grids responsivos com `gap-3 sm:gap-4`
- [ ] Mobile-first approach

### **Stat Cards:**
- [ ] Border: `border border-slate-200/80`
- [ ] Radius: `rounded-2xl`
- [ ] Padding: `p-4`
- [ ] Gradiente: `bg-gradient-to-br from-{color}-50/90 to-white/90`
- [ ] Ícone: 32px × 32px, ícone interno 16px
- [ ] Valor: `text-2xl font-semibold text-slate-900`
- [ ] Label: `text-xs font-medium text-slate-500`
- [ ] Animação: `initial={{ opacity: 0, y: 20 }}`

### **Botões:**
- [ ] Primário: Gradiente emerald/sky com sombra
- [ ] Secundário: Border + background suave
- [ ] Padding: `px-4 py-2` ou `px-6 py-3`
- [ ] Font: `text-sm font-semibold`
- [ ] Radius: `rounded-xl`
- [ ] Motion: `whileHover={{ scale: 1.05 }}` `whileTap={{ scale: 0.95 }}`

### **Tabs:**
- [ ] Container com `overflow-x-auto`
- [ ] Ativo: Gradiente sky com shadow colorida
- [ ] Inativo: Branco com borda, hover muda borda
- [ ] Padding: `px-6 py-3`
- [ ] Emoji: `text-lg`

### **Inputs:**
- [ ] Ícone absoluto à esquerda
- [ ] Padding compensado
- [ ] Focus ring: `focus:ring-2 focus:ring-sky-500/30`
- [ ] Border: `border-slate-200`

### **Animações:**
- [ ] Stagger delays (0.1s, 0.2s, 0.3s)
- [ ] Fade in com slide (y: 20 ou x: -20)
- [ ] Hover scale nos botões
- [ ] Group hover onde aplicável

### **Cores:**
- [ ] Sky para ações primárias e tabs
- [ ] Emerald para sucesso e receita
- [ ] Amber para atenção/pendente
- [ ] Red para urgente/atrasado
- [ ] Violet para premium/especial
- [ ] Slate para texto e bordas

---

## 📖 **EXEMPLOS DE USO**

### **Exemplo 1: Criar Novo Stat Card**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
>
  <div className="flex items-center gap-2 mb-2">
    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
      <TrendingUp className="h-4 w-4 text-white" />
    </div>
    <p className="text-xs font-medium text-slate-500">Nova Métrica</p>
  </div>
  <p className="text-2xl font-semibold text-slate-900">1,234</p>
  <p className="text-xs text-emerald-600 font-medium mt-1">+15% vs anterior</p>
</motion.div>
```

### **Exemplo 2: Criar Novo Botão de Ação**

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleAction}
  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
>
  <Plus className="h-4 w-4" />
  Nova Ação
</motion.button>
```

### **Exemplo 3: Criar Nova Tab**

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => setActiveTab('newtab')}
  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
    activeTab === 'newtab'
      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
  }`}
>
  <span className="text-lg">🎯</span>
  Nova Tab
</motion.button>
```

---

## 🎓 **BOAS PRÁTICAS**

### **DO's (Fazer):**
✅ Usar componentes reutilizáveis (Card, StatCard)  
✅ Seguir padrão mobile-first  
✅ Usar classes utilitárias do Tailwind  
✅ Manter consistência de cores (sky, emerald, amber, red, violet)  
✅ Adicionar animações sutis com Motion  
✅ Usar gradientes suaves  
✅ Opacidades em backgrounds (/90, /80)  
✅ Stagger animations em listas  
✅ Focus states em todos os inputs  
✅ Hover states em todos os botões  

### **DON'Ts (Não Fazer):**
❌ Criar tamanhos de fonte custom (usar text-xs, text-sm, text-2xl)  
❌ Usar cores fora da paleta definida  
❌ Desktop-first (começar com lg: em vez de mobile)  
❌ Animações bruscas ou exageradas  
❌ Borders muito grossas (usar 1px ou 2px max)  
❌ Shadows muito pesadas  
❌ Misturar padrões (manter consistência)  
❌ Esquecer estados hover/focus  
❌ Hardcoded values (usar tokens do Tailwind)  

---

## 🔗 **REFERÊNCIAS ADICIONAIS**

- **Design System Completo:** `/DESIGN_SYSTEM.md`
- **Componentes Shared:** `/components/shared/Card.tsx`, `/components/shared/StatCard.tsx`
- **Tailwind Config:** Versão 4.0 (CSS-first)
- **Motion Docs:** https://motion.dev (antiga Framer Motion)

---

## 📊 **RESUMO VISUAL**

### **Paleta de Cores:**
```
🔵 Sky (Primary):     #0ea5e9 → #0284c7
🟢 Emerald (Success): #10b981 → #059669
🟡 Amber (Warning):   #f59e0b → #d97706
🔴 Red (Danger):      #ef4444 → #dc2626
🟣 Violet (Premium):  #8b5cf6 → #7c3aed
⚫ Slate (Neutral):   #64748b → #1e293b
```

### **Spacing Scale:**
```
gap-2     8px
gap-3    12px  ← Mobile default
gap-4    16px  ← Desktop default
p-4      16px  ← Card padding
p-5      20px  ← Larger cards
px-6     24px  ← Button horizontal
py-3     12px  ← Button vertical
```

### **Border Radius:**
```
rounded-xl    12px  ← Botões, inputs
rounded-2xl   16px  ← Cards
rounded-full  100%  ← Avatares
```

### **Font Sizes:**
```
text-xs    12px  ← Labels, subtítulos
text-sm    14px  ← Botões, texto normal
text-2xl   24px  ← Valores grandes
```

---

**📅 Última Atualização:** Dezembro 2024  
**🎨 Baseado em:** BusinessPage Component  
**🏗️ Framework:** React + Tailwind CSS v4 + Motion  
**📱 Abordagem:** Mobile-First, Enterprise-Level