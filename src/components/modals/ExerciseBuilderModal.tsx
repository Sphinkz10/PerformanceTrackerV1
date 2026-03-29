import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Save,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { Exercise, Variable } from "../../lib/DesignStudioTypes";
import { ExerciseStore } from "../../lib/ExerciseStore";

interface ExerciseBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseToEdit?: Exercise | null;
  onSave?: (exercise: Exercise) => void;
}

const VARIABLE_TYPES = [
  { value: 'number', label: 'Número', icon: '🔢', description: 'Valor numérico (peso, reps, etc)' },
  { value: 'text-short', label: 'Texto Curto', icon: '📝', description: 'Texto de linha única' },
  { value: 'text-long', label: 'Texto Longo', icon: '📄', description: 'Texto multi-linha' },
  { value: 'select', label: 'Seleção', icon: '🎯', description: 'Lista de opções' },
  { value: 'multi-select', label: 'Múltipla Seleção', icon: '☑️', description: 'Múltiplas opções' },
  { value: 'scale', label: 'Escala', icon: '⭐', description: 'Escala numérica (RPE, dor, etc)' },
  { value: 'date', label: 'Data', icon: '📅', description: 'Seletor de data' },
  { value: 'duration', label: 'Duração', icon: '⏱️', description: 'Tempo (mm:ss)' },
  { value: 'boolean', label: 'Sim/Não', icon: '✓', description: 'Verdadeiro ou falso' },
  { value: 'url', label: 'URL', icon: '🔗', description: 'Link (vídeo, imagem, etc)' },
];

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

const MUSCLE_GROUPS = [
  "Quadríceps", "Isquiotibiais", "Glúteos", "Gémeos",
  "Peitoral Maior", "Peitoral Menor",
  "Latíssimo", "Trapézio", "Romboides", "Lombar",
  "Deltoides Anterior", "Deltoides Lateral", "Deltoides Posterior",
  "Bíceps", "Tríceps", "Antebraços",
  "Reto Abdominal", "Oblíquos", "Transverso"
];

const EQUIPMENT = [
  "Barbell", "Dumbbells", "Kettlebell", "Banco", "Rack",
  "Pull-up Bar", "Dip Station", "Caixa", "Medicine Ball",
  "Banda Elástica", "TRX", "Roda Abdominal", "Corda",
  "Sem Equipamento"
];

export function ExerciseBuilderModal({
  isOpen,
  onClose,
  exerciseToEdit,
  onSave
}: ExerciseBuilderModalProps) {
  const isEdit = !!exerciseToEdit;
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Quick variables state
  const [quickVars, setQuickVars] = useState({
    series: false,
    reps: false,
    time: false,
    load: false,
    rpe: false
  });

  // Load exercise data if editing
  useEffect(() => {
    if (exerciseToEdit) {
      setName(exerciseToEdit.name);
      setDescription(exerciseToEdit.description || "");
      setCategory(exerciseToEdit.category);
      setMuscleGroups(exerciseToEdit.muscleGroups || []);
      setEquipment(exerciseToEdit.equipment || []);
      setVariables(exerciseToEdit.variables);
      setTags(exerciseToEdit.tags || []);
      
      // Detect quick vars from existing variables
      const hasVar = (names: string[]) => 
        exerciseToEdit.variables.some(v => names.some(n => v.name.toLowerCase().includes(n)));
      
      setQuickVars({
        series: hasVar(['série', 'series', 'set']),
        reps: hasVar(['repetição', 'repetições', 'reps', 'rep']),
        time: hasVar(['tempo', 'duração', 'duration', 'time']),
        load: hasVar(['carga', 'peso', 'load', 'weight']),
        rpe: hasVar(['rpe', 'esforço', 'percepção'])
      });
    } else {
      // Reset to defaults
      setName("");
      setDescription("");
      setCategory("Custom");
      setMuscleGroups([]);
      setEquipment([]);
      setVariables([]);
      setTags([]);
      setQuickVars({
        series: false,
        reps: false,
        time: false,
        load: false,
        rpe: false
      });
    }
  }, [exerciseToEdit, isOpen]);

  const handleToggleQuickVar = (varType: keyof typeof quickVars) => {
    const newValue = !quickVars[varType];
    setQuickVars({ ...quickVars, [varType]: newValue });

    if (newValue) {
      // Add the variable
      let newVar: Variable;
      switch (varType) {
        case 'series':
          newVar = {
            id: `v-${Date.now()}-series`,
            name: 'Séries',
            type: 'number',
            required: true
          };
          break;
        case 'reps':
          newVar = {
            id: `v-${Date.now()}-reps`,
            name: 'Repetições',
            type: 'number',
            required: true
          };
          break;
        case 'time':
          newVar = {
            id: `v-${Date.now()}-time`,
            name: 'Tempo',
            type: 'duration',
            required: true
          };
          break;
        case 'load':
          newVar = {
            id: `v-${Date.now()}-load`,
            name: 'Carga',
            type: 'number',
            unit: 'kg',
            required: true
          };
          break;
        case 'rpe':
          newVar = {
            id: `v-${Date.now()}-rpe`,
            name: 'RPE',
            type: 'scale',
            min: 1,
            max: 10,
            required: false
          };
          break;
      }
      setVariables([...variables, newVar]);
    } else {
      // Remove the variable (by type detection)
      const patterns = {
        series: ['série', 'series', 'set'],
        reps: ['repetição', 'repetições', 'reps', 'rep'],
        time: ['tempo', 'duração', 'duration', 'time'],
        load: ['carga', 'peso', 'load', 'weight'],
        rpe: ['rpe', 'esforço', 'percepção']
      };
      
      setVariables(variables.filter(v => 
        !patterns[varType].some(p => v.name.toLowerCase().includes(p))
      ));
    }
  };

  const handleAddVariable = () => {
    const newVariable: Variable = {
      id: `v-${Date.now()}`,
      name: `Variável ${variables.length + 1}`,
      type: 'number',
      required: false
    };
    setVariables([...variables, newVariable]);
  };

  const handleUpdateVariable = (id: string, updates: Partial<Variable>) => {
    setVariables(variables.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
  };

  const handleRemoveVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleToggleMuscleGroup = (mg: string) => {
    setMuscleGroups(prev => 
      prev.includes(mg) ? prev.filter(m => m !== mg) : [...prev, mg]
    );
  };

  const handleToggleEquipment = (eq: string) => {
    setEquipment(prev => 
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      toast.error("Nome do exercício é obrigatório!");
      return;
    }

    if (variables.length === 0) {
      toast.error("Adicione pelo menos uma variável!");
      return;
    }

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

    if (isEdit && exerciseToEdit) {
      // Update existing
      const updated = ExerciseStore.update(exerciseToEdit.id, exerciseData);
      if (updated) {
        toast.success(`Exercício "${name}" atualizado!`);
        onSave?.(updated);
        onClose();
      }
    } else {
      // Create new
      const created = ExerciseStore.add(exerciseData);
      toast.success(`Exercício "${name}" criado!`);
      onSave?.(created);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-slate-900 mb-1">
              {isEdit ? "Editar Exercício" : "Criar Novo Exercício"}
            </h2>
            <p className="text-sm text-slate-600">
              Configure todas as variáveis que quer registar durante o treino
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">📋</span>
              Informação Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Agachamento Livre"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do exercício..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
              />
            </div>
          </div>

          {/* Muscle Groups */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">💪</span>
              Grupos Musculares
            </h3>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map(mg => (
                <button
                  key={mg}
                  onClick={() => handleToggleMuscleGroup(mg)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    muscleGroups.includes(mg)
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">🏋️</span>
              Equipamento Necessário
            </h3>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT.map(eq => (
                <button
                  key={eq}
                  onClick={() => handleToggleEquipment(eq)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    equipment.includes(eq)
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Variables */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              Variáveis Rápidas
            </h3>
            <p className="text-xs text-slate-600">
              Selecione as variáveis comuns para adicionar automaticamente
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { key: 'series', label: 'Séries', icon: '📊', color: 'emerald' },
                { key: 'reps', label: 'Repetições', icon: '🔢', color: 'sky' },
                { key: 'time', label: 'Tempo', icon: '⏱️', color: 'violet' },
                { key: 'load', label: 'Carga', icon: '🏋️', color: 'amber' },
                { key: 'rpe', label: 'RPE', icon: '⭐', color: 'rose' }
              ].map(qv => {
                const isActive = quickVars[qv.key as keyof typeof quickVars];
                return (
                  <motion.button
                    key={qv.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleQuickVar(qv.key as keyof typeof quickVars)}
                    className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                      isActive
                        ? `border-${qv.color}-400 bg-gradient-to-br from-${qv.color}-50 to-white shadow-md`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{qv.icon}</div>
                    <div className="text-xs font-semibold text-slate-900 mb-1">{qv.label}</div>
                    {isActive && (
                      <div className={`absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-${qv.color}-500 to-${qv.color}-600 flex items-center justify-center`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Variables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg">🧩</span>
                Variáveis ({variables.length})
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddVariable}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Adicionar Variável
              </motion.button>
            </div>

            {variables.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <Sparkles className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-3">
                  Nenhuma variável adicionada ainda
                </p>
                <button
                  onClick={handleAddVariable}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
                >
                  Adicionar Primeira Variável
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <VariableEditor
                    key={variable.id}
                    variable={variable}
                    index={index}
                    onUpdate={(updates) => handleUpdateVariable(variable.id, updates)}
                    onRemove={() => handleRemoveVariable(variable.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              Tags
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Adicionar tag..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-violet-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Campos marcados com * são obrigatórios
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Save className="h-4 w-4" />
              {isEdit ? "Atualizar" : "Criar"} Exercício
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variable Editor Component
interface VariableEditorProps {
  variable: Variable;
  index: number;
  onUpdate: (updates: Partial<Variable>) => void;
  onRemove: () => void;
}

function VariableEditor({ variable, index, onUpdate, onRemove }: VariableEditorProps) {
  const typeInfo = VARIABLE_TYPES.find(t => t.value === variable.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-sky-300 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity pt-2">
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Row 1: Name + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Nome da Variável
              </label>
              <input
                type="text"
                value={variable.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo
              </label>
              <select
                value={variable.type}
                onChange={(e) => onUpdate({ type: e.target.value as Variable['type'] })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              >
                {VARIABLE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Type-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {variable.type === 'number' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Unidade
                </label>
                <input
                  type="text"
                  value={variable.unit || ''}
                  onChange={(e) => onUpdate({ unit: e.target.value })}
                  placeholder="kg, m, s, %, bpm..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
            )}

            {variable.type === 'scale' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Mínimo
                  </label>
                  <input
                    type="number"
                    value={variable.min || 1}
                    onChange={(e) => onUpdate({ min: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Máximo
                  </label>
                  <input
                    type="number"
                    value={variable.max || 10}
                    onChange={(e) => onUpdate({ max: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                  />
                </div>
              </>
            )}

            {(variable.type === 'select' || variable.type === 'multi-select') && (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Opções (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={variable.options?.join(', ') || ''}
                  onChange={(e) => onUpdate({ options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) })}
                  placeholder="Opção 1, Opção 2, Opção 3..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={variable.required || false}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500/30"
                />
                <span className="text-xs font-medium text-slate-700">Obrigatória</span>
              </label>
            </div>
          </div>

          {/* Type description */}
          {typeInfo && (
            <p className="text-xs text-slate-500 italic">
              {typeInfo.description}
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </motion.div>
  );
}