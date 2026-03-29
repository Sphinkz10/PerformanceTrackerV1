# 🎨 DESIGN STUDIO - CÓDIGO ANTERIOR COMPLETO

**Data**: Agora  
**Encontrado**: ExerciseBuilderModal + DesignStudioPanel ✅

---

## 📁 FICHEIROS ENCONTRADOS

### **1. `/components/modals/ExerciseBuilderModal.tsx`** ✅
**Linhas**: 719 linhas  
**Funcionalidade**: Modal completo para criar/editar exercícios customizados

**Features**:
- ✅ Wizard completo de criação de exercício
- ✅ Informação básica (nome, descrição, categoria)
- ✅ Grupos musculares (19 opções)
- ✅ Equipamento necessário (14 opções)
- ✅ **Variáveis Rápidas** (5 quick vars)
- ✅ **Sistema de Variáveis Customizadas** (10 tipos)
- ✅ Tags personalizadas
- ✅ Validação completa
- ✅ Edit mode (editar existente)
- ✅ LocalStorage persistence (ExerciseStore)

---

### **2. `/components/calendar/panels/DesignStudioPanel.tsx`** ✅
**Linhas**: 480 linhas  
**Funcionalidade**: Painel para importar workouts e planos para o calendário

**Features**:
- ✅ 2 tabs (Workouts, Planos)
- ✅ Search + filtros
- ✅ Preview modal
- ✅ Importação rápida
- ✅ Grid responsivo
- ✅ Mock data completo

---

## 🎯 EXERCISEBUILDERMODAL - ANÁLISE DETALHADA

### **ESTRUTURA GERAL**
```
📋 INFORMAÇÃO BÁSICA
├─ Nome do Exercício *
├─ Categoria (10 opções)
└─ Descrição

💪 GRUPOS MUSCULARES (19)
├─ Quadríceps, Isquiotibiais, Glúteos, Gémeos
├─ Peitoral Maior, Peitoral Menor
├─ Latíssimo, Trapézio, Romboides, Lombar
├─ Deltoides Anterior/Lateral/Posterior
├─ Bíceps, Tríceps, Antebraços
└─ Reto Abdominal, Oblíquos, Transverso

🏋️ EQUIPAMENTO (14)
├─ Barbell, Dumbbells, Kettlebell
├─ Banco, Rack, Pull-up Bar
├─ Dip Station, Caixa, Medicine Ball
├─ Banda Elástica, TRX, Roda Abdominal
├─ Corda
└─ Sem Equipamento

⚡ VARIÁVEIS RÁPIDAS (5)
├─ 📊 Séries (number)
├─ 🔢 Repetições (number)
├─ ⏱️ Tempo (duration)
├─ 🏋️ Carga (number com unidade kg)
└─ ⭐ RPE (scale 1-10)

🧩 VARIÁVEIS CUSTOMIZADAS (10 tipos)
├─ 🔢 Número
├─ 📝 Texto Curto
├─ 📄 Texto Longo
├─ 🎯 Seleção
├─ ☑️ Múltipla Seleção
├─ ⭐ Escala
├─ 📅 Data
├─ ⏱️ Duração
├─ ✓ Sim/Não
└─ 🔗 URL

🏷️ TAGS
└─ Tags personalizadas (input livre)
```

---

### **CATEGORIAS DISPONÍVEIS**
```typescript
const CATEGORIES = [
  "Membros Inferiores",
  "Peito",
  "Costas",
  "Ombros",
  "Braços",
  "Core",
  "Velocidade",
  "Resistência",
  "Mobilidade",
  "Custom"
];
```

---

### **GRUPOS MUSCULARES (19)**
```typescript
const MUSCLE_GROUPS = [
  // Membros Inferiores (4)
  "Quadríceps", "Isquiotibiais", "Glúteos", "Gémeos",
  
  // Peito (2)
  "Peitoral Maior", "Peitoral Menor",
  
  // Costas (4)
  "Latíssimo", "Trapézio", "Romboides", "Lombar",
  
  // Ombros (3)
  "Deltoides Anterior", "Deltoides Lateral", "Deltoides Posterior",
  
  // Braços (3)
  "Bíceps", "Tríceps", "Antebraços",
  
  // Core (3)
  "Reto Abdominal", "Oblíquos", "Transverso"
];
```

---

### **EQUIPAMENTO (14)**
```typescript
const EQUIPMENT = [
  "Barbell",
  "Dumbbells",
  "Kettlebell",
  "Banco",
  "Rack",
  "Pull-up Bar",
  "Dip Station",
  "Caixa",
  "Medicine Ball",
  "Banda Elástica",
  "TRX",
  "Roda Abdominal",
  "Corda",
  "Sem Equipamento"
];
```

---

### **TIPOS DE VARIÁVEIS (10)**
```typescript
const VARIABLE_TYPES = [
  { 
    value: 'number', 
    label: 'Número', 
    icon: '🔢', 
    description: 'Valor numérico (peso, reps, etc)' 
  },
  { 
    value: 'text-short', 
    label: 'Texto Curto', 
    icon: '📝', 
    description: 'Texto de linha única' 
  },
  { 
    value: 'text-long', 
    label: 'Texto Longo', 
    icon: '📄', 
    description: 'Texto multi-linha' 
  },
  { 
    value: 'select', 
    label: 'Seleção', 
    icon: '🎯', 
    description: 'Lista de opções' 
  },
  { 
    value: 'multi-select', 
    label: 'Múltipla Seleção', 
    icon: '☑️', 
    description: 'Múltiplas opções' 
  },
  { 
    value: 'scale', 
    label: 'Escala', 
    icon: '⭐', 
    description: 'Escala numérica (RPE, dor, etc)' 
  },
  { 
    value: 'date', 
    label: 'Data', 
    icon: '📅', 
    description: 'Seletor de data' 
  },
  { 
    value: 'duration', 
    label: 'Duração', 
    icon: '⏱️', 
    description: 'Tempo (mm:ss)' 
  },
  { 
    value: 'boolean', 
    label: 'Sim/Não', 
    icon: '✓', 
    description: 'Verdadeiro ou falso' 
  },
  { 
    value: 'url', 
    label: 'URL', 
    icon: '🔗', 
    description: 'Link (vídeo, imagem, etc)' 
  },
];
```

---

### **VARIÁVEIS RÁPIDAS (5)**

#### **1. Séries**
```typescript
{
  id: `v-${Date.now()}-series`,
  name: 'Séries',
  type: 'number',
  required: true
}
```

#### **2. Repetições**
```typescript
{
  id: `v-${Date.now()}-reps`,
  name: 'Repetições',
  type: 'number',
  required: true
}
```

#### **3. Tempo**
```typescript
{
  id: `v-${Date.now()}-time`,
  name: 'Tempo',
  type: 'duration',
  required: true
}
```

#### **4. Carga**
```typescript
{
  id: `v-${Date.now()}-load`,
  name: 'Carga',
  type: 'number',
  unit: 'kg',
  required: true
}
```

#### **5. RPE**
```typescript
{
  id: `v-${Date.now()}-rpe`,
  name: 'RPE',
  type: 'scale',
  min: 1,
  max: 10,
  required: false
}
```

---

### **INTERFACE VARIABLE**
```typescript
interface Variable {
  id: string;
  name: string;
  type: 'number' | 'text-short' | 'text-long' | 'select' | 'multi-select' 
        | 'scale' | 'date' | 'duration' | 'boolean' | 'url';
  required: boolean;
  unit?: string;        // Para 'number'
  min?: number;         // Para 'scale'
  max?: number;         // Para 'scale'
  options?: string[];   // Para 'select' e 'multi-select'
}
```

---

### **INTERFACE EXERCISE**
```typescript
interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscleGroups?: string[];
  equipment?: string[];
  variables: Variable[];
  tags?: string[];
  isCustom: boolean;
}
```

---

## 🎨 UI/UX COMPLETO

### **LAYOUT**
```
┌─────────────────────────────────────────────┐
│ [X] Criar Novo Exercício                   │
│     Configure todas as variáveis...         │
├─────────────────────────────────────────────┤
│                                             │
│ 📋 INFORMAÇÃO BÁSICA                        │
│ ┌──────────────┬──────────────┐            │
│ │Nome *        │Categoria     │            │
│ └──────────────┴──────────────┘            │
│ ┌──────────────────────────────┐           │
│ │Descrição                     │           │
│ └──────────────────────────────┘           │
│                                             │
│ 💪 GRUPOS MUSCULARES                        │
│ [Quadríceps] [Isquio] [Glúteos] ...        │
│                                             │
│ 🏋️ EQUIPAMENTO NECESSÁRIO                   │
│ [Barbell] [Dumbbells] [Banco] ...          │
│                                             │
│ ⚡ VARIÁVEIS RÁPIDAS                        │
│ ┌──────┬──────┬──────┬──────┬──────┐      │
│ │📊    │🔢    │⏱️    │🏋️    │⭐    │      │
│ │Séries│Reps  │Tempo │Carga │RPE   │      │
│ └──────┴──────┴──────┴──────┴──────┘      │
│                                             │
│ 🧩 VARIÁVEIS (3)        [+ Adicionar]      │
│ ┌─────────────────────────────────────┐   │
│ │ ≡ Nome: Carga  Tipo: Número 🔢      │   │
│ │   Unidade: kg  ☑ Obrigatória     [🗑]│   │
│ └─────────────────────────────────────┘   │
│                                             │
│ 🏷️ TAGS                                     │
│ [Input] [Adicionar]                        │
│ [Tag1] [Tag2] [Tag3]                       │
│                                             │
├─────────────────────────────────────────────┤
│ ⚠️ Campos com * obrigatórios               │
│                     [Cancelar] [💾 Criar]  │
└─────────────────────────────────────────────┘
```

---

### **ESTADOS INTERATIVOS**

#### **Grupos Musculares - Botões Toggle**
```tsx
// Inativo
className="bg-slate-100 text-slate-700 hover:bg-slate-200"

// Ativo
className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
```

#### **Equipamento - Botões Toggle**
```tsx
// Inativo
className="bg-slate-100 text-slate-700 hover:bg-slate-200"

// Ativo
className="bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md"
```

#### **Variáveis Rápidas - Cards**
```tsx
// Inativo
className="border-slate-200 bg-white hover:border-slate-300"

// Ativo (exemplo: Séries = emerald)
className="border-emerald-400 bg-gradient-to-br from-emerald-50 to-white shadow-md"
// + Check badge no canto
<div className="bg-gradient-to-r from-emerald-500 to-emerald-600">✓</div>
```

**Cores por Quick Var**:
- Séries: `emerald`
- Reps: `sky`
- Tempo: `violet`
- Carga: `amber`
- RPE: `rose`

---

### **VARIABLE EDITOR**

#### **Layout**
```
┌─────────────────────────────────────────────┐
│ ≡  [Nome da Variável]  [Tipo: Número 🔢]   │
│    [Unidade: kg]       ☑ Obrigatória    [🗑]│
│    💡 Valor numérico (peso, reps, etc)      │
└─────────────────────────────────────────────┘
```

#### **Campos Específicos por Tipo**

**number**:
- Unidade (text input)
- Checkbox obrigatória

**scale**:
- Mínimo (number input)
- Máximo (number input)
- Checkbox obrigatória

**select / multi-select**:
- Opções (comma-separated input)
- Checkbox obrigatória

**Outros tipos**:
- Apenas checkbox obrigatória

---

## 🔧 FUNCIONALIDADES AVANÇADAS

### **1. Quick Vars - Auto Add/Remove**
```typescript
const handleToggleQuickVar = (varType: keyof typeof quickVars) => {
  const newValue = !quickVars[varType];
  setQuickVars({ ...quickVars, [varType]: newValue });

  if (newValue) {
    // Auto-add variable predefinida
    const newVar = createQuickVar(varType);
    setVariables([...variables, newVar]);
  } else {
    // Auto-remove por pattern matching
    setVariables(variables.filter(v => 
      !patterns[varType].some(p => v.name.toLowerCase().includes(p))
    ));
  }
};
```

**Pattern Matching**:
```typescript
const patterns = {
  series: ['série', 'series', 'set'],
  reps: ['repetição', 'repetições', 'reps', 'rep'],
  time: ['tempo', 'duração', 'duration', 'time'],
  load: ['carga', 'peso', 'load', 'weight'],
  rpe: ['rpe', 'esforço', 'percepção']
};
```

---

### **2. Validação**
```typescript
const handleSave = () => {
  // Nome obrigatório
  if (!name.trim()) {
    toast.error("Nome do exercício é obrigatório!");
    return;
  }

  // Pelo menos 1 variável
  if (variables.length === 0) {
    toast.error("Adicione pelo menos uma variável!");
    return;
  }

  // Criar/Atualizar exercise
  const exerciseData: Omit<Exercise, 'id'> = {
    name: name.trim(),
    description: description.trim() || undefined,
    category,
    muscleGroups: muscleGroups.length > 0 ? muscleGroups : undefined,
    equipment: equipment.length > 0 ? equipment : undefined,
    variables,
    tags: tags.length > 0 ? tags : undefined,
    isCustom: true
  };

  // Save via ExerciseStore
  if (isEdit) {
    ExerciseStore.update(exerciseToEdit.id, exerciseData);
  } else {
    ExerciseStore.add(exerciseData);
  }
};
```

---

### **3. ExerciseStore (LocalStorage)**
```typescript
// Funções usadas
ExerciseStore.add(exerciseData);              // Criar
ExerciseStore.update(id, exerciseData);       // Atualizar
ExerciseStore.getAll();                       // Listar todos
ExerciseStore.getById(id);                    // Por ID
```

---

### **4. Edit Mode**
```typescript
// Detecta automaticamente quick vars de exercício existente
useEffect(() => {
  if (exerciseToEdit) {
    // Carrega dados básicos
    setName(exerciseToEdit.name);
    setDescription(exerciseToEdit.description || "");
    setCategory(exerciseToEdit.category);
    setMuscleGroups(exerciseToEdit.muscleGroups || []);
    setEquipment(exerciseToEdit.equipment || []);
    setVariables(exerciseToEdit.variables);
    setTags(exerciseToEdit.tags || []);
    
    // Auto-detecta quick vars
    const hasVar = (names: string[]) => 
      exerciseToEdit.variables.some(v => 
        names.some(n => v.name.toLowerCase().includes(n))
      );
    
    setQuickVars({
      series: hasVar(['série', 'series', 'set']),
      reps: hasVar(['repetição', 'repetições', 'reps', 'rep']),
      time: hasVar(['tempo', 'duração', 'duration', 'time']),
      load: hasVar(['carga', 'peso', 'load', 'weight']),
      rpe: hasVar(['rpe', 'esforço', 'percepção'])
    });
  }
}, [exerciseToEdit, isOpen]);
```

---

### **5. Tags System**
```typescript
const handleAddTag = () => {
  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  }
};

const handleRemoveTag = (tag: string) => {
  setTags(tags.filter(t => t !== tag));
};

// Enter key support
onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
```

---

## 🎨 DESIGN SYSTEM ALINHAMENTO

### **Cores Principais**
```
Emerald: Grupos musculares ativos, botão criar
Sky: Equipamento ativo, links
Violet: Tags
Slate: Inativo, texto, bordas
```

### **Border Radius**
```
rounded-xl:  12px (cards, botões, inputs)
rounded-2xl: 16px (modal container)
rounded-lg:  8px (variable editor, botões pequenos)
rounded-full: Tags
```

### **Espaçamento**
```
p-6:     Padding modal (24px)
p-4:     Padding variable card (16px)
gap-3:   Gap entre elementos (12px)
space-y-3: Spacing vertical entre seções (12px)
```

### **Typography**
```
h2: font-bold text-slate-900 (títulos)
p: text-sm text-slate-600 (descrições)
label: text-xs font-medium text-slate-600 (labels)
```

### **Animações**
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="..."
>
```

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
```

---

## 📊 DESIGN STUDIO PANEL

### **Features**
```
✅ 2 Tabs (Workouts, Planos)
✅ Search input
✅ Filter por tipo (apenas workouts)
✅ Grid 2 colunas (workouts)
✅ List vertical (planos)
✅ Preview modal
✅ Importar workout/plano
✅ Mock data completo
```

### **Mock Workouts (4)**
```typescript
1. Treino de Força - Upper Body (60min, strength, high)
2. HIIT Cardio 30min (30min, cardio, high)
3. Yoga Recovery (45min, recovery, low)
4. Speed & Agility Drills (40min, skill, medium)
```

### **Mock Plans (2)**
```typescript
1. Plano de Pré-Temporada (8 semanas, 32 treinos)
2. Programa de Hipertrofia (12 semanas, 48 treinos)
```

### **Layout**
```
┌─────────────────────────────────────┐
│ Design Studio                  [X]  │
│ Importar workouts e planos          │
├─────────────────────────────────────┤
│ [Workouts (4)] [Planos (2)]         │
├─────────────────────────────────────┤
│ [🔍 Search] [Filter ▼]             │
├─────────────────────────────────────┤
│ ┌────────────┬────────────┐         │
│ │ Workout 1  │ Workout 2  │         │
│ │ [Preview]  │ [Preview]  │         │
│ │ [Importar] │ [Importar] │         │
│ ├────────────┼────────────┤         │
│ │ Workout 3  │ Workout 4  │         │
│ └────────────┴────────────┘         │
└─────────────────────────────────────┘
```

---

## ✅ COMPARAÇÃO: O QUE FALTA ATUALMENTE?

### **❌ NÃO EXISTE (precisa criar)**
- ExerciseBuilderModal completo
- Sistema de variáveis customizadas
- Quick vars (5 botões)
- Grupos musculares (19)
- Equipamento (14)
- Tags system
- Variable editor completo
- ExerciseStore (LocalStorage)

### **✅ JÁ EXISTE**
- DesignStudioPanel (calendário)
- Integração com calendário
- Mock workouts/planos

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

### **1. Copiar ExerciseBuilderModal** ✅
```bash
# Ficheiro já existe em:
/components/modals/ExerciseBuilderModal.tsx
```

### **2. Integrar no Design Studio** ⚠️
```typescript
// Em /components/studio/DesignStudio.tsx
import { ExerciseBuilderModal } from '@/components/modals/ExerciseBuilderModal';

// Adicionar state
const [showExerciseBuilder, setShowExerciseBuilder] = useState(false);

// Adicionar botão "Criar Exercício"
<button onClick={() => setShowExerciseBuilder(true)}>
  Criar Exercício
</button>

// Renderizar modal
{showExerciseBuilder && (
  <ExerciseBuilderModal
    isOpen={showExerciseBuilder}
    onClose={() => setShowExerciseBuilder(false)}
    onSave={(exercise) => {
      // Handle save
      console.log('Exercise created:', exercise);
    }}
  />
)}
```

### **3. Criar ExerciseStore** ⚠️
```bash
# Precisa criar:
/lib/ExerciseStore.ts
```

**Implementação**:
```typescript
// Funções necessárias
add(data)       // Adicionar
update(id, data) // Atualizar
getAll()        // Listar
getById(id)     // Por ID
delete(id)      // Remover
```

### **4. Tipos TypeScript** ⚠️
```bash
# Precisa criar:
/lib/DesignStudioTypes.ts
```

**Interfaces**:
```typescript
export interface Variable { ... }
export interface Exercise { ... }
export interface Workout { ... }
export interface Plan { ... }
```

---

## 📄 RESUMO EXECUTIVO

```
╔═══════════════════════════════════════╗
║  DESIGN STUDIO - CÓDIGO ENCONTRADO   ║
║                                       ║
║  📁 2 Componentes Principais          ║
║  📝 1200+ Linhas de Código            ║
║  🎨 Sistema Completo de Criação       ║
║  ✅ ExerciseBuilderModal (719 linhas) ║
║  ✅ DesignStudioPanel (480 linhas)    ║
║                                       ║
║  FEATURES:                            ║
║  • 10 Categorias                      ║
║  • 19 Grupos Musculares               ║
║  • 14 Equipamentos                    ║
║  • 5 Quick Vars                       ║
║  • 10 Tipos de Variáveis              ║
║  • Sistema de Tags                    ║
║  • Edit Mode                          ║
║  • Validação Completa                 ║
║  • LocalStorage Persistence           ║
║                                       ║
║  PRONTO PARA INTEGRAR! 🚀             ║
╚═══════════════════════════════════════╝
```

---

**Este é o código mais completo anterior do Design Studio!** 🎨

Quer que eu integre este ExerciseBuilderModal no sistema atual? 😊
