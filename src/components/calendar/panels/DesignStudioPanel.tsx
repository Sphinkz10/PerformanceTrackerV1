/**
 * DESIGN STUDIO PANEL
 * Browse and import workouts/plans from Design Studio into Calendar
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Calendar,
  Plus,
  Download,
  Eye,
  Clock,
  Target,
  TrendingUp,
  X,
  ChevronRight,
} from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  type: 'strength' | 'cardio' | 'flexibility' | 'skill' | 'recovery';
  intensity: 'low' | 'medium' | 'high';
  equipment: string[];
  created_at: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  workouts_count: number;
  workouts: Workout[];
  created_at: string;
}

interface DesignStudioPanelProps {
  workspaceId: string;
  onImportWorkout: (workout: Workout, date?: Date) => void;
  onImportPlan: (plan: Plan) => void;
  onClose: () => void;
}

export function DesignStudioPanel({ 
  workspaceId, 
  onImportWorkout, 
  onImportPlan,
  onClose 
}: DesignStudioPanelProps) {
  const [activeTab, setActiveTab] = useState<'workouts' | 'plans'>('workouts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Workout | Plan | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mock data - Replace with real API calls
  const mockWorkouts: Workout[] = [
    {
      id: '1',
      name: 'Treino de Força - Upper Body',
      description: 'Treino focado em membros superiores com ênfase em hipertrofia',
      duration: 60,
      type: 'strength',
      intensity: 'high',
      equipment: ['Barbell', 'Dumbbells', 'Bench'],
      created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'HIIT Cardio 30min',
      description: 'Treino intervalado de alta intensidade para resistência',
      duration: 30,
      type: 'cardio',
      intensity: 'high',
      equipment: [],
      created_at: '2026-01-14T14:00:00Z',
    },
    {
      id: '3',
      name: 'Yoga Recovery',
      description: 'Sessão de recuperação ativa com foco em mobilidade',
      duration: 45,
      type: 'recovery',
      intensity: 'low',
      equipment: ['Mat'],
      created_at: '2026-01-13T09:00:00Z',
    },
    {
      id: '4',
      name: 'Speed & Agility Drills',
      description: 'Exercícios de velocidade e agilidade para atletas',
      duration: 40,
      type: 'skill',
      intensity: 'medium',
      equipment: ['Cones', 'Ladder'],
      created_at: '2026-01-12T16:00:00Z',
    },
  ];

  const mockPlans: Plan[] = [
    {
      id: '1',
      name: 'Plano de Pré-Temporada',
      description: '8 semanas de preparação física para início de temporada',
      duration_weeks: 8,
      workouts_count: 32,
      workouts: mockWorkouts,
      created_at: '2026-01-10T10:00:00Z',
    },
    {
      id: '2',
      name: 'Programa de Hipertrofia',
      description: '12 semanas focadas em ganho de massa muscular',
      duration_weeks: 12,
      workouts_count: 48,
      workouts: mockWorkouts.slice(0, 2),
      created_at: '2026-01-05T14:00:00Z',
    },
  ];

  const typeColors = {
    strength: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
    cardio: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
    flexibility: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    skill: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    recovery: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  };

  const intensityColors = {
    low: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700' },
    high: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const filteredWorkouts = mockWorkouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || workout.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredPlans = mockPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handlePreview = (item: Workout | Plan) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Design Studio</h2>
              <p className="text-sm text-slate-600 mt-1">
                Importar workouts e planos para o calendário
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('workouts')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'workouts'
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <Target className="h-4 w-4" />
              Workouts ({mockWorkouts.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Planos ({mockPlans.length})
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-slate-200 p-4 bg-slate-50">
          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Procurar ${activeTab === 'workouts' ? 'workouts' : 'planos'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            {/* Type Filter (only for workouts) */}
            {activeTab === 'workouts' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="strength">Força</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibilidade</option>
                  <option value="skill">Técnica</option>
                  <option value="recovery">Recuperação</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {activeTab === 'workouts' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-sky-300 hover:shadow-lg transition-all"
                >
                  {/* Workout Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`h-12 w-12 rounded-xl ${typeColors[workout.type].bg} ${typeColors[workout.type].border} border-2 flex items-center justify-center flex-shrink-0`}>
                      <Target className={`h-6 w-6 ${typeColors[workout.type].text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{workout.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{workout.description}</p>
                    </div>
                  </div>

                  {/* Workout Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration}min
                    </div>
                    <div className={`px-2 py-1 rounded-full ${intensityColors[workout.intensity].bg} ${intensityColors[workout.intensity].text} font-medium`}>
                      {workout.intensity === 'low' ? 'Baixa' : workout.intensity === 'medium' ? 'Média' : 'Alta'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePreview(workout)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onImportWorkout(workout)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Importar
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Plan Icon */}
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-7 w-7 text-white" />
                    </div>

                    {/* Plan Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{plan.name}</h3>
                      <p className="text-sm text-slate-600 mb-3">{plan.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {plan.duration_weeks} semanas
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {plan.workouts_count} treinos
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePreview(plan)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onImportPlan(plan)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-400 hover:to-violet-500 transition-all"
                      >
                        <Download className="h-4 w-4" />
                        Importar Plano
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === 'workouts' && filteredWorkouts.length === 0) ||
            (activeTab === 'plans' && filteredPlans.length === 0)) && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Nenhum {activeTab === 'workouts' ? 'workout' : 'plano'} encontrado
              </h3>
              <p className="text-sm text-slate-600">
                Tente ajustar os filtros ou pesquisa
              </p>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {isPreviewOpen && selectedItem && (
            <div className="fixed inset-0 bg-slate-900/50 z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{selectedItem.name}</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPreviewOpen(false)}
                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <X className="h-4 w-4 text-slate-600" />
                    </motion.button>
                  </div>
                  <p className="text-sm text-slate-600">{selectedItem.description}</p>
                </div>

                <div className="p-6">
                  {'type' in selectedItem ? (
                    // Workout Preview
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-600 mb-1">Duração</p>
                          <p className="font-semibold text-slate-900">{selectedItem.duration} minutos</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-600 mb-1">Intensidade</p>
                          <p className="font-semibold text-slate-900">
                            {selectedItem.intensity === 'low' ? 'Baixa' : selectedItem.intensity === 'medium' ? 'Média' : 'Alta'}
                          </p>
                        </div>
                      </div>
                      {selectedItem.equipment.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-600 mb-2">Equipamento Necessário</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.equipment.map((item, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Plan Preview
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-600 mb-1">Duração</p>
                          <p className="font-semibold text-slate-900">{selectedItem.duration_weeks} semanas</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-600 mb-1">Total de Treinos</p>
                          <p className="font-semibold text-slate-900">{selectedItem.workouts_count}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-2">Workouts Incluídos</p>
                        <div className="space-y-2">
                          {selectedItem.workouts.slice(0, 5).map((workout) => (
                            <div key={workout.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                              <div className={`h-8 w-8 rounded-lg ${typeColors[workout.type].bg} flex items-center justify-center`}>
                                <Target className={`h-4 w-4 ${typeColors[workout.type].text}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{workout.name}</p>
                                <p className="text-xs text-slate-600">{workout.duration}min</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
