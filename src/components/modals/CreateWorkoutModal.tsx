import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Dumbbell, Plus, Trash2, GripVertical, Library } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ExercisePickerModal } from "./ExercisePickerModal";
import type { Exercise } from "../../lib/DesignStudioTypes";

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: WorkoutData) => void;
}

export interface WorkoutData {
  name: string;
  description: string;
  category: "strength" | "cardio" | "mobility" | "sport" | "recovery";
  blocks: WorkoutBlock[];
  tags: string[];
}

interface WorkoutBlock {
  id: string;
  name: string;
  exercises: Exercise[];
  rest: number;
}

// Counter to ensure unique IDs
let exerciseCounter = 0;

export function CreateWorkoutModal({ isOpen, onClose, onComplete }: CreateWorkoutModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WorkoutData>({
    name: "",
    description: "",
    category: "strength",
    blocks: [],
    tags: []
  });

  const [currentBlock, setCurrentBlock] = useState<WorkoutBlock>({
    id: `block-${Date.now()}`,
    name: "",
    exercises: [],
    rest: 120
  });

  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: `ex-${Date.now()}-${exerciseCounter++}`,
    name: "",
    sets: 3,
    reps: "10",
    load: "BW",
    rest: 60
  });

  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);

  const categories = [
    { id: "strength" as const, name: "Força", color: "sky", emoji: "💪" },
    { id: "cardio" as const, name: "Cardio", color: "red", emoji: "❤️" },
    { id: "mobility" as const, name: "Mobilidade", color: "violet", emoji: "🧘" },
    { id: "sport" as const, name: "Desportivo", color: "emerald", emoji: "⚽" },
    { id: "recovery" as const, name: "Recuperação", color: "amber", emoji: "🌟" }
  ];

  const handleAddExercise = () => {
    if (!currentExercise.name) {
      toast.error("Nome do exercício é obrigatório");
      return;
    }

    setCurrentBlock({
      ...currentBlock,
      exercises: [...currentBlock.exercises, { ...currentExercise, id: `ex-${Date.now()}-${exerciseCounter++}` }]
    });

    setCurrentExercise({
      id: `ex-${Date.now()}-${exerciseCounter++}`,
      name: "",
      sets: 3,
      reps: "10",
      load: "BW",
      rest: 60
    });

    setShowExerciseForm(false);
    toast.success("Exercício adicionado!");
  };

  const handleSelectExerciseFromLibrary = (exercise: any) => {
    // Add exercise from library with default values
    const exerciseForBlock: Exercise = {
      ...exercise,
      id: `ex-${Date.now()}-${exerciseCounter++}`,
      sets: 3,
      reps: "10",
      load: "BW",
      rest: 60
    };

    setCurrentBlock({
      ...currentBlock,
      exercises: [...currentBlock.exercises, exerciseForBlock]
    });

    setIsExercisePickerOpen(false);
    toast.success(`Exercício "${exercise.name}" adicionado!`);
  };

  const handleAddBlock = () => {
    if (!currentBlock.name) {
      toast.error("Nome do bloco é obrigatório");
      return;
    }

    if (currentBlock.exercises.length === 0) {
      toast.error("Adicione pelo menos 1 exercício ao bloco");
      return;
    }

    setFormData({
      ...formData,
      blocks: [...formData.blocks, { ...currentBlock, id: `block-${Date.now()}-${exerciseCounter++}` }]
    });

    setCurrentBlock({
      id: `block-${Date.now()}-${exerciseCounter++}`,
      name: "",
      exercises: [],
      rest: 120
    });

    setStep(2);
    toast.success("Bloco adicionado!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name) {
        toast.error("Nome do treino é obrigatório");
        return;
      }
      setStep(2);
      return;
    }

    if (formData.blocks.length === 0) {
      toast.error("Adicione pelo menos 1 bloco ao treino");
      return;
    }

    onComplete(formData);
    toast.success(`Treino "${formData.name}" criado com sucesso!`);
    onClose();
    
    // Reset
    setStep(1);
    setFormData({
      name: "",
      description: "",
      category: "strength",
      blocks: [],
      tags: []
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-semibold text-slate-900">🏋️ Criar Novo Treino</h2>
              <p className="text-sm text-slate-600">Passo {step} de 2</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Treino *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Full Body A, Upper Body, HIIT 20min..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Objetivo e notas sobre o treino..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Categoria
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const isSelected = formData.category === cat.id;
                      return (
                        <motion.button
                          key={cat.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            isSelected
                              ? `border-${cat.color}-500 bg-${cat.color}-50`
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{cat.emoji}</div>
                          <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Build Blocks */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    {currentBlock.exercises.length > 0 ? "Editar Bloco" : "Criar Bloco"}
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={currentBlock.name}
                      onChange={(e) => setCurrentBlock({ ...currentBlock, name: e.target.value })}
                      placeholder="Nome do bloco (ex: Warm-up, Bloco A, Finisher)"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                    />

                    {/* Exercise List */}
                    {currentBlock.exercises.length > 0 && (
                      <div className="space-y-2">
                        {currentBlock.exercises.map((ex, idx) => (
                          <div key={ex.id} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                            <GripVertical className="h-4 w-4 text-slate-400" />
                            <div className="flex-1">
                              <p className="font-medium text-sm text-slate-900">{ex.name}</p>
                              <p className="text-xs text-slate-600">
                                {ex.sets}x{ex.reps} @ {ex.load} • Rest {ex.rest}s
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCurrentBlock({
                                ...currentBlock,
                                exercises: currentBlock.exercises.filter((_, i) => i !== idx)
                              })}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Exercise Form */}
                    {showExerciseForm ? (
                      <div className="p-4 border border-emerald-200 rounded-xl bg-emerald-50/50 space-y-3">
                        <input
                          type="text"
                          value={currentExercise.name}
                          onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                          placeholder="Nome do exercício *"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={currentExercise.sets}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
                            placeholder="Sets"
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          />
                          <input
                            type="text"
                            value={currentExercise.reps}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                            placeholder="Reps"
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          />
                          <input
                            type="text"
                            value={currentExercise.load}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, load: e.target.value })}
                            placeholder="Load"
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          />
                          <input
                            type="number"
                            value={currentExercise.rest}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, rest: parseInt(e.target.value) })}
                            placeholder="Rest (s)"
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddExercise}
                            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                          >
                            Adicionar Exercício
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowExerciseForm(false)}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIsExercisePickerOpen(true)}
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                        >
                          <Library className="h-4 w-4" />
                          Da Biblioteca
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowExerciseForm(true)}
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Criar Rápido
                        </button>
                      </div>
                    )}

                    {currentBlock.exercises.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAddBlock}
                        className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
                      >
                        ✓ Finalizar Bloco
                      </button>
                    )}
                  </div>
                </div>

                {/* Blocks Added */}
                {formData.blocks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900">Blocos Adicionados ({formData.blocks.length})</h3>
                    {formData.blocks.map((block) => (
                      <div key={block.id} className="p-4 border border-slate-200 rounded-xl bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{block.name}</h4>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              blocks: formData.blocks.filter((b) => b.id !== block.id)
                            })}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-600">{block.exercises.length} exercícios</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </form>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-200">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              {step === 1 ? "Continuar →" : formData.blocks.length > 0 ? "Criar Treino" : "Adicionar Blocos"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        isOpen={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
        onSelect={handleSelectExerciseFromLibrary}
      />
    </AnimatePresence>
  );
}
