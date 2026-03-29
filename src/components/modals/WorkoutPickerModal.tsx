import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Search,
  Filter,
  Plus,
  Calendar,
  Edit,
  Copy,
  Trash2,
  Grid3x3,
  List,
  Sparkles,
  Clock,
  Dumbbell
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Workout {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  blocks: any[];
  tags: string[];
  isCustom?: boolean;
}

interface WorkoutPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (workout: Workout) => void;
}

// Mock data - substituir por dados reais
const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    description: "Treino de força para membros superiores",
    category: "strength",
    duration: 60,
    blocks: [
      { name: "Warm-up", exercises: 2 },
      { name: "Main Block", exercises: 5 },
      { name: "Finisher", exercises: 2 }
    ],
    tags: ["Força", "Upper"],
    isCustom: false
  },
  {
    id: "2",
    name: "Lower Body Power",
    description: "Desenvolvimento de potência nos membros inferiores",
    category: "strength",
    duration: 75,
    blocks: [
      { name: "Activation", exercises: 3 },
      { name: "Strength", exercises: 4 },
      { name: "Accessories", exercises: 3 }
    ],
    tags: ["Força", "Lower", "Power"],
    isCustom: false
  },
  {
    id: "3",
    name: "HIIT Cardio",
    description: "Alta intensidade intervalar",
    category: "cardio",
    duration: 30,
    blocks: [
      { name: "Warm-up", exercises: 1 },
      { name: "Intervals", exercises: 6 },
      { name: "Cool-down", exercises: 1 }
    ],
    tags: ["Cardio", "HIIT"],
    isCustom: false
  },
  {
    id: "4",
    name: "Full Body Mobility",
    description: "Mobilidade e flexibilidade completa",
    category: "mobility",
    duration: 45,
    blocks: [
      { name: "Upper Body", exercises: 4 },
      { name: "Lower Body", exercises: 4 },
      { name: "Core", exercises: 3 }
    ],
    tags: ["Mobilidade", "Flexibilidade"],
    isCustom: false
  },
  {
    id: "5",
    name: "Push Day",
    description: "Treino de empurrão (peito, ombros, tríceps)",
    category: "strength",
    duration: 70,
    blocks: [
      { name: "Compound", exercises: 3 },
      { name: "Isolation", exercises: 4 }
    ],
    tags: ["Força", "Push", "Upper"],
    isCustom: true
  }
];

const CATEGORIES = [
  { id: "all", name: "Todos" },
  { id: "strength", name: "Força", emoji: "💪", color: "sky" },
  { id: "cardio", name: "Cardio", emoji: "❤️", color: "red" },
  { id: "mobility", name: "Mobilidade", emoji: "🧘", color: "violet" },
  { id: "sport", name: "Desportivo", emoji: "⚽", color: "emerald" },
  { id: "recovery", name: "Recuperação", emoji: "🌟", color: "amber" }
];

export function WorkoutPickerModal({
  isOpen,
  onClose,
  onSelect
}: WorkoutPickerModalProps) {
  const [workouts] = useState<Workout[]>(MOCK_WORKOUTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter workouts
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: workouts.length,
    custom: workouts.filter(w => w.isCustom).length,
    preset: workouts.filter(w => !w.isCustom).length,
    categories: new Set(workouts.map(w => w.category)).size
  };

  const handleSelectWorkout = (workout: Workout) => {
    onSelect(workout);
    toast.success(`Treino "${workout.name}" adicionado!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
              📋 Biblioteca de Treinos
            </h2>
            <p className="text-sm text-slate-600">
              Selecione um treino para adicionar ao plano
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
              placeholder="Procurar treinos..."
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
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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

        {/* Workout List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredWorkouts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center">
              <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">
                {searchQuery ? "Nenhum treino encontrado" : "Nenhum treino ainda"}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {searchQuery 
                  ? "Tente ajustar os filtros"
                  : "Crie treinos no Design Studio primeiro"
                }
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {filteredWorkouts.map((workout, index) => {
                const category = CATEGORIES.find(c => c.id === workout.category);
                const totalExercises = workout.blocks.reduce((sum, b) => sum + (b.exercises || 0), 0);
                
                return (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelectWorkout(workout)}
                    className="group rounded-2xl border border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-lg p-4 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${category?.color}-500 to-${category?.color}-600 flex items-center justify-center shrink-0 shadow-md`}>
                        <span className="text-2xl">{category?.emoji || "📋"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 truncate">
                          {workout.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {workout.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{workout.duration}min</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-3 w-3" />
                        <span>{totalExercises} exercícios</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span>{workout.blocks.length} blocos</span>
                    </div>

                    {/* Blocks Preview */}
                    <div className="space-y-1 mb-3">
                      {workout.blocks.slice(0, 3).map((block, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="h-1 w-1 rounded-full bg-sky-500" />
                          <span className="font-medium">{block.name}</span>
                          <span className="text-slate-400">({block.exercises} ex)</span>
                        </div>
                      ))}
                      {workout.blocks.length > 3 && (
                        <div className="text-xs text-slate-500 ml-3">
                          +{workout.blocks.length - 3} blocos
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${category?.color}-100 text-${category?.color}-700`}>
                        {category?.name}
                      </span>
                      {workout.isCustom && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                          Custom
                        </span>
                      )}
                    </div>

                    {workout.tags && workout.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {workout.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {workout.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-600">
                            +{workout.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
