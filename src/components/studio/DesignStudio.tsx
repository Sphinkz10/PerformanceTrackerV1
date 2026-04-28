import { useState } from 'react';
import { 
  Dumbbell, Calendar, BookOpen, Users, Library, 
  ArrowLeft, Save, Eye, Edit, Download, Share2,
  Sparkles, TrendingUp, Target, BarChart3, Zap,
  Plus, Search, Filter, Grid, List, X, ChevronRight,
  FileText, Flame, Star, Clock, Copy, Award, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreateWorkoutModal } from '@/components/modals/CreateWorkoutModal';
import { DistributionPanel } from './distribution/DistributionPanel';
import { ItemPreview } from './preview/ItemPreview';
import { useCreateWorkout, useUpdateWorkout, useCreateExercise } from '@/hooks/use-api';
import { toast } from 'sonner@2.0.3';
import { useWorkspace, useUser } from '@/contexts/AppContext';

// MOCK DELETED MODALS TEMPORARILY
const ExerciseBuilderModal = ({ exercise, onUpdate }: any) => <div className="p-4 bg-white rounded-xl shadow"><h3>Exercise Builder Unavailable</h3><p>This module is being refactored to the new Architecture.</p></div>;
const CreatePlanModal = ({ plan, onUpdate }: any) => <div className="p-4 bg-white rounded-xl shadow"><h3>Plan Builder Unavailable</h3><p>This module is being refactored to the new Architecture.</p></div>;
const CreateClassModal = ({ classData, onUpdate }: any) => <div className="p-4 bg-white rounded-xl shadow"><h3>Class Builder Unavailable</h3><p>This module is being refactored to the new Architecture.</p></div>;

type Module = 'exercises' | 'workouts' | 'plans' | 'classes' | 'library';
type ViewMode = 'edit' | 'preview';

interface DesignStudioProps {
  onBack?: () => void;
}

export function DesignStudio({ onBack }: DesignStudioProps) {
  const [activeModule, setActiveModule] = useState<Module>('exercises');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [isCreating, setIsCreating] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  
  // Modal states for builders
  const [showExerciseBuilder, setShowExerciseBuilder] = useState(false);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);
  const [showClassBuilder, setShowClassBuilder] = useState(false);

  // Get workspace & user from context
  const { workspaceId } = useWorkspace();
  const { userId } = useUser();

  // Backend integration hooks
  const { execute: createWorkout, isLoading: isCreatingWorkout } = useCreateWorkout();
  const { execute: updateWorkout, isLoading: isUpdatingWorkout } = useUpdateWorkout();
  const { execute: createExercise, isLoading: isCreatingExercise } = useCreateExercise();

  const isSaving = isCreatingWorkout || isUpdatingWorkout || isCreatingExercise;

  const modules = [
    {
      id: 'exercises' as Module,
      name: 'Exercícios',
      icon: Dumbbell,
      emoji: '🏋️',
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50/90 to-white/90',
      borderColor: 'border-red-200',
      hoverBorder: 'hover:border-red-400',
      shadowColor: 'shadow-red-500/20',
      description: 'Biblioteca de movimentos e técnicas de treino',
      count: 142,
    },
    {
      id: 'workouts' as Module,
      name: 'Treinos',
      icon: Calendar,
      emoji: '📋',
      color: 'from-sky-500 to-cyan-500',
      bgColor: 'from-sky-50/90 to-white/90',
      borderColor: 'border-sky-200',
      hoverBorder: 'hover:border-sky-400',
      shadowColor: 'shadow-sky-500/20',
      description: 'Sessões completas e templates de treino',
      count: 68,
    },
    {
      id: 'plans' as Module,
      name: 'Planos',
      icon: BookOpen,
      emoji: '📅',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50/90 to-white/90',
      borderColor: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      shadowColor: 'shadow-emerald-500/20',
      description: 'Programação semanal e mesociclos completos',
      count: 24,
    },
    {
      id: 'classes' as Module,
      name: 'Aulas',
      icon: Users,
      emoji: '👥',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50/90 to-white/90',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      shadowColor: 'shadow-purple-500/20',
      description: 'Sessões em grupo e treinos coletivos',
      count: 35,
    },
    {
      id: 'library' as Module,
      name: 'Biblioteca',
      icon: Library,
      emoji: '📚',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50/90 to-white/90',
      borderColor: 'border-amber-200',
      hoverBorder: 'hover:border-amber-400',
      shadowColor: 'shadow-amber-500/20',
      description: 'Todos os conteúdos organizados e filtrados',
      count: 247,
    },
  ];

  const currentModule = modules.find((m) => m.id === activeModule);

  const handleCreateNew = () => {
    // Open the appropriate modal based on active module
    if (activeModule === 'exercises') {
      setShowExerciseBuilder(true);
    } else if (activeModule === 'workouts') {
      setShowWorkoutBuilder(true);
    } else if (activeModule === 'plans') {
      setShowPlanBuilder(true);
    } else if (activeModule === 'classes') {
      setShowClassBuilder(true);
    } else {
      // For plans and classes, use the old inline editors for now
      setSelectedItem(null);
      setIsCreating(true);
      setViewMode('edit');
    }
  };

  const handleUpdate = (updates: any) => {
    setSelectedItem({ ...selectedItem, ...updates });
  };

  const handleSave = async () => {
    if (!selectedItem) {
      toast.error('Nenhum item para salvar');
      return;
    }

    // Validate required fields
    if (!selectedItem.name || selectedItem.name.trim() === '') {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      if (activeModule === 'workouts') {
        // =====================================================
        // SAVE WORKOUT
        // =====================================================
        const workoutData = {
          workspaceId: workspaceId, // Get from context
          name: selectedItem.name,
          description: selectedItem.description || '',
          type: selectedItem.difficulty === 'elite' ? 'strength' : 'mixed',
          difficulty: selectedItem.difficulty || 'intermediate',
          estimatedDurationMinutes: selectedItem.duration || 60,
          tags: selectedItem.tags || [],
          exercises: (selectedItem.blocks || []).map((block: any, index: number) => ({
            exerciseId: block.exerciseId || `temp-${index}`, // TODO: Map to real exerciseId
            orderIndex: index,
            plannedSets: block.sets || 3,
            plannedReps: block.reps || '10',
            plannedRestSeconds: block.rest || 60,
            coachingCues: block.notes || '',
          })),
          createdBy: userId, // Get from auth context
        };

        const result = await createWorkout(workoutData);
        
        toast.success('Workout criado com sucesso!', {
          description: `${result.stats.exercisesCreated} exercícios adicionados`,
        });

        // Return to list
        setSelectedItem(null);
        setIsCreating(false);
        
      } else if (activeModule === 'exercises') {
        // =====================================================
        // SAVE EXERCISE
        // =====================================================
        const exerciseData = {
          workspaceId: workspaceId,
          name: selectedItem.name,
          description: selectedItem.description || '',
          category: selectedItem.category || 'strength',
          complexity: selectedItem.difficulty || 'intermediate',
          targetMuscles: selectedItem.targetMuscles || [],
          equipment: selectedItem.equipment || [],
          createdBy: userId,
        };

        const result = await createExercise(exerciseData);
        
        toast.success('Exercício criado com sucesso!');

        setSelectedItem(null);
        setIsCreating(false);
        
      } else {
        toast.info('Salvar ' + activeModule + ' ainda não implementado');
      }

    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error('Erro ao salvar', {
        description: error.message || 'Tente novamente',
      });
    }
  };

  const stats = [
    {
      label: 'Total de Itens',
      value: currentModule?.count || 0,
      trend: '+12 esta semana',
      icon: FileText,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      progress: 85,
    },
    {
      label: 'Mais Usados',
      value: '34',
      trend: 'últimos 30 dias',
      icon: Flame,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      progress: 68,
    },
    {
      label: 'Favoritos',
      value: '18',
      trend: '6 em destaque',
      icon: Star,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      progress: 45,
    },
  ];

  const recentItems = [
    {
      id: 1,
      name: 'Treino de Força - Upper Body',
      type: 'workout',
      emoji: '💪',
      lastUsed: 'Há 2 horas',
      usageCount: 24,
      isFavorite: true,
      status: 'active',
      tags: ['Força', 'Upper'],
    },
    {
      id: 2,
      name: 'Back Squat Progressivo',
      type: 'exercise',
      emoji: '🏋️',
      lastUsed: 'Ontem',
      usageCount: 45,
      isFavorite: true,
      status: 'active',
      tags: ['Força', 'Lower'],
    },
    {
      id: 3,
      name: 'Plano Semanal - Hipertrofia',
      type: 'plan',
      emoji: '📅',
      lastUsed: 'Há 3 dias',
      usageCount: 12,
      isFavorite: false,
      status: 'draft',
      tags: ['Hipertrofia', '4 semanas'],
    },
    {
      id: 4,
      name: 'Aula de Condicionamento',
      type: 'class',
      emoji: '🔥',
      lastUsed: 'Há 5 dias',
      usageCount: 8,
      isFavorite: false,
      status: 'active',
      tags: ['Cardio', 'Grupo'],
    },
  ];

  const popularTemplates = [
    {
      id: 1,
      name: 'Upper Body Strength',
      downloads: 1243,
      rating: 4.9,
      category: 'Força',
    },
    {
      id: 2,
      name: 'HIIT Cardio Max',
      downloads: 987,
      rating: 4.8,
      category: 'Cardio',
    },
    {
      id: 3,
      name: 'Mobility & Recovery',
      downloads: 756,
      rating: 4.7,
      category: 'Mobilidade',
    },
  ];

  // Se estiver criando ou editando, mostrar o editor fullscreen
  if (selectedItem || isCreating) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {/* Header do Editor */}
        <div className="border-b border-slate-200/60 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 shrink-0 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedItem(null);
                  setIsCreating(false);
                }}
                className="h-9 w-9 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </motion.button>

              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br ${currentModule?.color} flex items-center justify-center shrink-0 shadow-lg ${currentModule?.shadowColor}`}
              >
                {currentModule?.icon && <currentModule.icon className="h-5 w-5 text-white" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-slate-900 truncate flex items-center gap-2">
                  <span>{selectedItem?.name || `Novo ${currentModule?.name.slice(0, -1)}`}</span>
                  {selectedItem?.isFavorite && (
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <div className="text-sm text-slate-600 truncate flex items-center gap-2">
                  <span>{currentModule?.name}</span>
                  {selectedItem?.status && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          selectedItem.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {selectedItem.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* View Toggle */}
              <div className="hidden sm:flex border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    viewMode === 'edit'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    viewMode === 'preview'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👁️ Preview
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDistribution(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-sky-200 bg-sky-50 text-sky-700 rounded-xl text-sm font-medium hover:bg-sky-100 hover:border-sky-300 transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>Distribuir</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: isSaving ? 1 : 1.05 }}
                whileTap={{ scale: isSaving ? 1 : 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition-all ${
                  isSaving
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'edit' && (
            <>
              {activeModule === 'exercises' && (
                <ExerciseBuilderModal exercise={selectedItem} onUpdate={handleUpdate} />
              )}
              {activeModule === 'workouts' && (
                <CreateWorkoutModal workout={selectedItem} onUpdate={handleUpdate} />
              )}
              {activeModule === 'plans' && (
                <CreatePlanModal plan={selectedItem} onUpdate={handleUpdate} />
              )}
              {activeModule === 'classes' && (
                <CreateClassModal classData={selectedItem} onUpdate={handleUpdate} />
              )}
            </>
          )}

          {viewMode === 'preview' && (
            <ItemPreview
              item={selectedItem}
              type={activeModule as 'exercise' | 'workout' | 'plan' | 'class'}
            />
          )}
        </div>

        {/* Distribution Panel */}
        <AnimatePresence>
          {showDistribution && (
            <DistributionPanel
              item={selectedItem}
              itemType={activeModule as 'exercise' | 'workout' | 'plan' | 'class'}
              onClose={() => setShowDistribution(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Vista principal - estilo Labs MELHORADO
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200/60 bg-white/95 backdrop-blur-md shrink-0 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4 flex-col sm:flex-row">
          <div className="flex items-center gap-3">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="h-10 w-10 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </motion.button>
            )}
            <div>
              <h1 className="text-slate-900 flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <span>Design Studio</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Pro
                </span>
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Sistema completo de criação de conteúdo de treino
              </p>
            </div>
          </div>

          {/* Quick Stats Header */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
              <FileText className="h-4 w-4 text-slate-600" />
              <div className="text-left">
                <div className="text-xs text-slate-500">Total</div>
                <div className="text-sm font-semibold text-slate-900">247</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div className="text-left">
                <div className="text-xs text-emerald-600">Crescimento</div>
                <div className="text-sm font-semibold text-emerald-700">+12%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Módulos */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;

            return (
              <motion.button
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModule(module.id)}
                className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 text-sm rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${module.color} text-white shadow-lg ${module.shadowColor}`
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">{module.name}</span>
                <span
                  className={`hidden md:inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {module.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content - Scroll Area */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-20 sm:pb-6">
          {/* Quick Actions - MOVIDO PARA CIMA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateNew}
              className={`group rounded-2xl border-2 ${currentModule?.borderColor} bg-gradient-to-br ${currentModule?.bgColor} p-6 sm:p-8 ${currentModule?.hoverBorder} hover:shadow-2xl transition-all text-left relative overflow-hidden`}
            >
              {/* Decorative element */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${currentModule?.color} opacity-20 group-hover:opacity-30 rounded-full blur-3xl transition-opacity`} />
              
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br ${currentModule?.color} flex items-center justify-center mb-5 shadow-2xl ${currentModule?.shadowColor}`}
                >
                  <Plus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Criar do Zero
                  <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Começar um novo {currentModule?.name.slice(0, -1).toLowerCase()} completamente vazio
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Tempo médio:</span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5-10 min
                  </span>
                </div>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/90 to-pink-50/90 p-6 sm:p-8 hover:border-purple-400 hover:shadow-2xl transition-all text-left relative overflow-hidden"
            >
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 group-hover:opacity-30 rounded-full blur-3xl transition-opacity" />
              
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 shadow-2xl shadow-purple-500/30"
                >
                  <Copy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Usar Template
                  <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Começar a partir de templates profissionais prontos para usar
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Disponíveis:</span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    {popularTemplates.length} templates
                  </span>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Module Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border-2 ${currentModule?.borderColor} bg-gradient-to-br ${currentModule?.bgColor} p-5 sm:p-6 shadow-lg ${currentModule?.shadowColor} relative overflow-hidden`}
          >
            {/* Decorative gradient blob */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentModule?.color} opacity-10 blur-3xl rounded-full`} />
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br ${currentModule?.color} flex items-center justify-center shrink-0 shadow-xl ${currentModule?.shadowColor}`}
                >
                  {currentModule?.icon && <currentModule.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-slate-900 mb-1 flex items-center gap-2">
                    {currentModule?.name}
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-white/50 backdrop-blur-sm ${currentModule?.borderColor}`}>
                      {currentModule?.count} itens
                    </span>
                  </h2>
                  <p className="text-sm text-slate-600">{currentModule?.description}</p>
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-xl border-2 ${stat.color} p-4 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <p className="text-xs font-medium">{stat.label}</p>
                        </div>
                        <TrendingUp className="h-3.5 w-3.5 opacity-50" />
                      </div>
                      <p className="text-2xl font-semibold mb-2">{stat.value}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className="h-full bg-gradient-to-r from-current to-current/80 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium">{stat.progress}%</span>
                      </div>
                      <p className="text-xs opacity-75">{stat.trend}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border-2 border-slate-200/80 bg-white p-5 sm:p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  Itens Recentes
                </h3>
                <p className="text-sm text-slate-600 mt-1">Últimos {recentItems.length} acessados</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
              >
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="space-y-3">
              {recentItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left rounded-xl border-2 border-slate-200 hover:border-sky-300 bg-gradient-to-br from-slate-50/50 to-white p-4 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-2xl shrink-0 border-2 border-slate-200 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-900 mb-1 truncate flex items-center gap-2">
                            {item.name}
                            {item.isFavorite && (
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                          </h4>
                          <p className="text-sm text-slate-600 truncate flex items-center gap-2">
                            <span>{item.lastUsed}</span>
                            <span className="text-slate-400">•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.usageCount}x
                            </span>
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status === 'active' ? '✓ Ativo' : '📝 Draft'}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 mt-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Popular Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border-2 border-slate-200/80 bg-white p-5 sm:p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Templates Populares
                </h3>
                <p className="text-sm text-slate-600 mt-1">Mais baixados da comunidade</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {popularTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold text-slate-900">{template.rating}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {template.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Download className="h-3.5 w-3.5" />
                      <span className="text-xs">{template.downloads.toLocaleString()}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Usar
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Available Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-lg"
          >
            <h3 className="text-slate-900 mb-5 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Funcionalidades Disponíveis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-xl transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Criação Rápida</h4>
                <p className="text-xs text-slate-600 mb-4">
                  Interface intuitiva para criar conteúdo rapidamente
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateNew}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg transition-all"
                >
                  Começar
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-purple-300 hover:shadow-xl transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Templates Pro</h4>
                <p className="text-xs text-slate-600 mb-4">
                  Biblioteca de templates profissionais prontos para usar
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg transition-all"
                >
                  Ver Templates
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-amber-300 hover:shadow-xl transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Biblioteca Completa</h4>
                <p className="text-xs text-slate-600 mb-4">
                  Acesse todos os seus conteúdos organizados e filtrados
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveModule('library')}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:shadow-lg transition-all"
                >
                  Abrir Biblioteca
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <ExerciseBuilderModal
        isOpen={showExerciseBuilder}
        onClose={() => setShowExerciseBuilder(false)}
        onSave={(exercise) => {
          toast.success('Exercício criado com sucesso!');
          setShowExerciseBuilder(false);
          // TODO: Refresh exercise list or show in preview
        }}
      />
      
      <CreateWorkoutModal
        isOpen={showWorkoutBuilder}
        onClose={() => setShowWorkoutBuilder(false)}
        onComplete={(workout) => {
          toast.success('Treino criado com sucesso!');
          setShowWorkoutBuilder(false);
          // TODO: Refresh workout list or show in preview
        }}
      />
      
      <CreatePlanModal
        isOpen={showPlanBuilder}
        onClose={() => setShowPlanBuilder(false)}
        onComplete={(plan) => {
          toast.success('Plano criado com sucesso!');
          setShowPlanBuilder(false);
          // TODO: Refresh plan list or show in preview
        }}
      />
      
      <CreateClassModal
        isOpen={showClassBuilder}
        onClose={() => setShowClassBuilder(false)}
        onComplete={(classData) => {
          toast.success('Aula criada com sucesso!');
          setShowClassBuilder(false);
          // TODO: Refresh class list or show in preview
        }}
      />
    </div>
  );
}