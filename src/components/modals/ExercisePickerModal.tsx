import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  Filter,
  Plus,
  Dumbbell,
  Edit,
  Copy,
  Trash2,
  Grid3x3,
  List,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { Exercise } from "../../lib/DesignStudioTypes";
import { ExerciseStore } from "../../lib/ExerciseStore";
import { ExerciseBuilderModal } from "./ExerciseBuilderModal";

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  blockId?: string;
}

export function ExercisePickerModal({
  isOpen,
  onClose,
  onSelect,
  blockId
}: ExercisePickerModalProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Load exercises
  useEffect(() => {
    if (!isOpen) return;
    
    const loadExercises = () => {
      setExercises(ExerciseStore.getAll());
    };

    loadExercises();
    const unsubscribe = ExerciseStore.subscribe(loadExercises);

    return () => unsubscribe();
  }, [isOpen]);

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ex.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ExerciseStore.getCategories();
  const stats = ExerciseStore.getStats();

  const handleSelectExercise = (exercise: Exercise) => {
    onSelect(exercise);
    toast.success(`Exercício "${exercise.name}" adicionado!`);
    onClose();
  };

  const handleCreateNew = () => {
    setEditingExercise(null);
    setShowBuilder(true);
  };

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExercise(exercise);
    setShowBuilder(true);
  };

  const handleDuplicateExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    ExerciseStore.duplicate(exercise.id);
    toast.success(`Exercício "${exercise.name}" duplicado!`);
  };

  const handleDeleteExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja deletar "${exercise.name}"?`)) {
      ExerciseStore.delete(exercise.id);
      toast.success("Exercício deletado!");
    }
  };

  const handleSaveFromBuilder = (exercise: Exercise) => {
    // Exercise already saved in ExerciseStore by ExerciseBuilder
    // Just close the builder
    setShowBuilder(false);
    setEditingExercise(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
            <div>
              <h2 className="font-bold text-slate-900 mb-1">
                🏋️ Biblioteca de Exercícios
              </h2>
              <p className="text-sm text-slate-600">
                Selecione um exercício ou crie um novo personalizado
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Criar Novo
              </motion.button>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-white border-b border-slate-200">
            {[
              { label: "Total", value: stats.total, color: "sky" },
              { label: "Personalizados", value: stats.custom, color: "violet" },
              { label: "Pré-definidos", value: stats.preset, color: "emerald" },
              { label: "Categorias", value: stats.categories, color: "amber" }
            ].map(stat => (
              <div
                key={stat.label}
                className={`rounded-xl border border-slate-200/80 bg-gradient-to-br from-${stat.color}-50/50 to-white/50 p-3`}
              >
                <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 p-4 bg-white border-b border-slate-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Procurar exercícios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas Categorias' : cat}
                </option>
              ))}
            </select>

            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredExercises.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center">
                <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  {searchQuery ? "Nenhum exercício encontrado" : "Nenhum exercício ainda"}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {searchQuery 
                    ? "Tente ajustar os filtros ou criar um novo exercício"
                    : "Crie seu primeiro exercício personalizado"
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateNew}
                  className="px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  Criar Primeiro Exercício
                </motion.button>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
              }>
                {filteredExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelectExercise(exercise)}
                    className="group rounded-2xl border border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-lg p-4 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
                        <Dumbbell className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 truncate">
                          {exercise.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {exercise.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {exercise.category}
                      </span>
                      {exercise.isCustom && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                          Custom
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {exercise.variables.length} var{exercise.variables.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {exercise.muscleGroups.slice(0, 3).map(mg => (
                          <span
                            key={mg}
                            className="px-2 py-0.5 text-xs rounded bg-emerald-50 text-emerald-700"
                          >
                            {mg}
                          </span>
                        ))}
                        {exercise.muscleGroups.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-600">
                            +{exercise.muscleGroups.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditExercise(exercise, e)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </button>
                      <button
                        onClick={(e) => handleDuplicateExercise(exercise, e)}
                        className="flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {exercise.isCustom && (
                        <button
                          onClick={(e) => handleDeleteExercise(exercise, e)}
                          className="flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Exercise Builder Modal */}
      <ExerciseBuilderModal
        isOpen={showBuilder}
        onClose={() => {
          setShowBuilder(false);
          setEditingExercise(null);
        }}
        exerciseToEdit={editingExercise}
        onSave={handleSaveFromBuilder}
      />
    </>
  );
}
