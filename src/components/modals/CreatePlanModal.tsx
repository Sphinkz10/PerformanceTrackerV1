import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Calendar, Copy, ChevronRight, Library } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { WorkoutPickerModal } from "./WorkoutPickerModal";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: PlanData) => void;
}

export interface PlanData {
  name: string;
  description: string;
  type: "strength" | "hypertrophy" | "endurance" | "weight-loss" | "sport-specific" | "general-fitness";
  duration: "4-weeks" | "6-weeks" | "8-weeks" | "12-weeks";
  weeks: PlanWeek[];
  tags: string[];
  objectives: string[];
}

interface PlanWeek {
  id: string;
  weekNumber: number;
  name: string;
  sessions: PlanSession[];
}

interface PlanSession {
  id: string;
  dayOfWeek: number; // 0-6 (0=Domingo, 1=Segunda, etc.)
  workoutName: string;
  isRestDay: boolean;
}

export function CreatePlanModal({ isOpen, onClose, onComplete }: CreatePlanModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PlanData>({
    name: "",
    description: "",
    type: "strength",
    duration: "8-weeks",
    weeks: [],
    tags: [],
    objectives: []
  });

  const [currentWeek, setCurrentWeek] = useState<PlanWeek>({
    id: Date.now().toString(),
    weekNumber: 1,
    name: "",
    sessions: []
  });

  const [objective, setObjective] = useState("");
  const [isWorkoutPickerOpen, setIsWorkoutPickerOpen] = useState(false);
  const [selectedDayForPicker, setSelectedDayForPicker] = useState<number | null>(null);

  const planTypes = [
    { id: "strength" as const, name: "Força", color: "sky", emoji: "💪", description: "Ganho de força máxima" },
    { id: "hypertrophy" as const, name: "Hipertrofia", color: "purple", emoji: "💪🏼", description: "Ganho de massa muscular" },
    { id: "endurance" as const, name: "Resistência", color: "red", emoji: "🏃", description: "Condicionamento aeróbico" },
    { id: "weight-loss" as const, name: "Perda de Peso", color: "amber", emoji: "⚖️", description: "Emagrecimento e definição" },
    { id: "sport-specific" as const, name: "Desportivo", color: "emerald", emoji: "⚽", description: "Performance específica" },
    { id: "general-fitness" as const, name: "Fitness Geral", color: "violet", emoji: "🌟", description: "Saúde e bem-estar" }
  ];

  const durations = [
    { id: "4-weeks" as const, name: "4 Semanas", weeks: 4 },
    { id: "6-weeks" as const, name: "6 Semanas", weeks: 6 },
    { id: "8-weeks" as const, name: "8 Semanas", weeks: 8 },
    { id: "12-weeks" as const, name: "12 Semanas", weeks: 12 }
  ];

  const daysOfWeek = [
    { id: 1, name: "Segunda", short: "Seg", emoji: "💼" },
    { id: 2, name: "Terça", short: "Ter", emoji: "🔥" },
    { id: 3, name: "Quarta", short: "Qua", emoji: "⚡" },
    { id: 4, name: "Quinta", short: "Qui", emoji: "💪" },
    { id: 5, name: "Sexta", short: "Sex", emoji: "🎯" },
    { id: 6, name: "Sábado", short: "Sáb", emoji: "🌟" },
    { id: 0, name: "Domingo", short: "Dom", emoji: "🌙" }
  ];

  const handleAddObjective = () => {
    if (!objective.trim()) return;
    setFormData({
      ...formData,
      objectives: [...formData.objectives, objective.trim()]
    });
    setObjective("");
  };

  const handleRemoveObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    });
  };

  const handleToggleDayType = (dayId: number) => {
    const existingSession = currentWeek.sessions.find(s => s.dayOfWeek === dayId);
    
    if (!existingSession) {
      // Create new rest day
      setCurrentWeek({
        ...currentWeek,
        sessions: [...currentWeek.sessions, {
          id: Date.now().toString() + dayId,
          dayOfWeek: dayId,
          workoutName: "Descanso",
          isRestDay: true
        }]
      });
    } else if (existingSession.isRestDay) {
      // Convert rest day to training day (remove it so user can assign workout)
      setCurrentWeek({
        ...currentWeek,
        sessions: currentWeek.sessions.filter(s => s.dayOfWeek !== dayId)
      });
    } else {
      // Convert training to rest
      setCurrentWeek({
        ...currentWeek,
        sessions: currentWeek.sessions.map(s => 
          s.dayOfWeek === dayId 
            ? { ...s, workoutName: "Descanso", isRestDay: true }
            : s
        )
      });
    }
  };

  const handleAssignWorkout = (dayId: number, workoutName: string) => {
    const existingSession = currentWeek.sessions.find(s => s.dayOfWeek === dayId);
    
    if (existingSession) {
      setCurrentWeek({
        ...currentWeek,
        sessions: currentWeek.sessions.map(s => 
          s.dayOfWeek === dayId 
            ? { ...s, workoutName, isRestDay: false }
            : s
        )
      });
    } else {
      setCurrentWeek({
        ...currentWeek,
        sessions: [...currentWeek.sessions, {
          id: Date.now().toString() + dayId,
          dayOfWeek: dayId,
          workoutName,
          isRestDay: false
        }]
      });
    }
  };

  const handleSelectWorkoutFromLibrary = (workout: any) => {
    if (selectedDayForPicker !== null) {
      handleAssignWorkout(selectedDayForPicker, workout.name);
      toast.success(`Treino "${workout.name}" atribuído!`);
    }
    setIsWorkoutPickerOpen(false);
    setSelectedDayForPicker(null);
  };

  const handleAddWeek = () => {
    if (!currentWeek.name) {
      toast.error("Nome da semana é obrigatório");
      return;
    }

    if (currentWeek.sessions.length === 0) {
      toast.error("Configure pelo menos 1 dia da semana");
      return;
    }

    setFormData({
      ...formData,
      weeks: [...formData.weeks, { ...currentWeek, id: Date.now().toString() }]
    });

    const nextWeekNumber = currentWeek.weekNumber + 1;
    setCurrentWeek({
      id: Date.now().toString(),
      weekNumber: nextWeekNumber,
      name: `Semana ${nextWeekNumber}`,
      sessions: []
    });

    toast.success("Semana adicionada!");
  };

  const handleDuplicateWeek = (weekIndex: number) => {
    const weekToCopy = formData.weeks[weekIndex];
    const newWeek = {
      ...weekToCopy,
      id: `week-${Date.now()}-${Math.random()}`,
      weekNumber: formData.weeks.length + 1,
      name: `${weekToCopy.name} (cópia)`,
      sessions: weekToCopy.sessions.map((s, idx) => ({
        ...s,
        id: `session-${Date.now()}-${idx}-${Math.random()}`
      }))
    };

    setFormData({
      ...formData,
      weeks: [...formData.weeks, newWeek]
    });

    toast.success("Semana duplicada!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name) {
        toast.error("Nome do plano é obrigatório");
        return;
      }
      if (formData.objectives.length === 0) {
        toast.error("Adicione pelo menos 1 objetivo");
        return;
      }
      setStep(2);
      return;
    }

    if (formData.weeks.length === 0) {
      toast.error("Adicione pelo menos 1 semana ao plano");
      return;
    }

    onComplete(formData);
    toast.success(`Plano "${formData.name}" criado com sucesso!`);
    onClose();
    
    // Reset
    setStep(1);
    setFormData({
      name: "",
      description: "",
      type: "strength",
      duration: "8-weeks",
      weeks: [],
      tags: [],
      objectives: []
    });
  };

  if (!isOpen) return null;

  const selectedDuration = durations.find(d => d.id === formData.duration);

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
          className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Criar Novo Plano de Treino
              </h2>
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
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Programa de Força 8 Semanas, Hipertrofia Avançada..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300"
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
                    placeholder="Objetivo geral e metodologia do plano..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Tipo de Plano
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {planTypes.map((type) => {
                      const isSelected = formData.type === type.id;
                      return (
                        <motion.button
                          key={type.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, type: type.id })}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? `border-${type.color}-500 bg-${type.color}-50`
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.emoji}</div>
                          <p className="text-sm font-semibold text-slate-900 mb-1">{type.name}</p>
                          <p className="text-xs text-slate-600">{type.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Duração do Plano
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {durations.map((dur) => {
                      const isSelected = formData.duration === dur.id;
                      return (
                        <motion.button
                          key={dur.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, duration: dur.id })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="text-sm font-semibold text-slate-900">{dur.name}</div>
                          <div className="text-xs text-slate-600 mt-1">{dur.weeks} semanas</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Objetivos do Plano *
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                        placeholder="Ex: Aumentar força em 20%"
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddObjective}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {formData.objectives.length > 0 && (
                      <div className="space-y-2">
                        {formData.objectives.map((obj, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                            <span className="flex-1 text-sm text-slate-700">{obj}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveObjective(idx)}
                              className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Build Weeks with Calendar View */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Semana {currentWeek.weekNumber}
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={currentWeek.name}
                      onChange={(e) => setCurrentWeek({ ...currentWeek, name: e.target.value })}
                      placeholder={`Nome da semana ${currentWeek.weekNumber} (ex: Semana Base, Semana de Carga)`}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-medium"
                    />

                    {/* Weekly Calendar Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {daysOfWeek.map((day) => {
                        const session = currentWeek.sessions.find(s => s.dayOfWeek === day.id);
                        const isRestDay = session?.isRestDay;
                        const hasWorkout = session && !session.isRestDay;

                        return (
                          <div key={day.id} className={`rounded-xl border-2 p-4 transition-all ${
                            hasWorkout 
                              ? "border-emerald-400 bg-emerald-50" 
                              : isRestDay 
                                ? "border-amber-300 bg-amber-50"
                                : "border-slate-200 bg-white"
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{day.emoji}</span>
                                <div>
                                  <p className="text-xs font-semibold text-slate-900">{day.name}</p>
                                  <p className="text-xs text-slate-500">{day.short}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleDayType(day.id)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                  isRestDay 
                                    ? "bg-amber-200 text-amber-800 hover:bg-amber-300"
                                    : hasWorkout
                                      ? "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
                                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                }`}
                              >
                                {isRestDay ? "💤 Descanso" : hasWorkout ? "✓ Treino" : "+ Marcar"}
                              </button>
                            </div>

                            {hasWorkout && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-slate-700 break-words">
                                  {session.workoutName}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDayForPicker(day.id);
                                      setIsWorkoutPickerOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg border border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                                  >
                                    <Library className="h-3 w-3" />
                                    Biblioteca
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newName = prompt("Nome do treino:", session.workoutName);
                                      if (newName) handleAssignWorkout(day.id, newName);
                                    }}
                                    className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                                  >
                                    ✏️ Editar
                                  </button>
                                </div>
                              </div>
                            )}

                            {!hasWorkout && !isRestDay && (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDayForPicker(day.id);
                                    setIsWorkoutPickerOpen(true);
                                  }}
                                  className="flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                >
                                  <Library className="h-3 w-3" />
                                  Biblioteca
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const name = prompt("Nome do treino:");
                                    if (name) handleAssignWorkout(day.id, name);
                                  }}
                                  className="px-2 py-2 text-xs font-semibold rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                                >
                                  ✏️ Digitar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {currentWeek.sessions.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAddWeek}
                        className="w-full px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                      >
                        ✓ Finalizar Semana {currentWeek.weekNumber}
                      </button>
                    )}
                  </div>
                </div>

                {/* Weeks Added */}
                {formData.weeks.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">
                        Semanas Adicionadas ({formData.weeks.length}/{selectedDuration?.weeks || 0})
                      </h3>
                    </div>
                    {formData.weeks.map((week, idx) => (
                      <div key={week.id} className="p-4 border border-slate-200 rounded-xl bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                              Semana {week.weekNumber}: {week.name}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {week.sessions.filter(s => !s.isRestDay).length} treinos • {week.sessions.filter(s => s.isRestDay).length} descansos
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDuplicateWeek(idx)}
                              className="p-2 rounded-lg hover:bg-sky-50 text-sky-600 transition-colors"
                              title="Duplicar semana"
                            >
                              <Copy className="h-4 w-4" />
                            </motion.button>
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                weeks: formData.weeks.filter((_, i) => i !== idx)
                              })}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Remover semana"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Session preview - Compact */}
                        <div className="grid grid-cols-7 gap-1">
                          {daysOfWeek.map(day => {
                            const session = week.sessions.find(s => s.dayOfWeek === day.id);
                            return (
                              <div
                                key={day.id}
                                className={`p-2 rounded-lg text-center ${
                                  session
                                    ? session.isRestDay
                                      ? "bg-amber-50 border border-amber-200"
                                      : "bg-emerald-50 border border-emerald-200"
                                    : "bg-slate-50 border border-slate-200"
                                }`}
                                title={session ? (session.isRestDay ? "Descanso" : session.workoutName) : "Sem treino"}
                              >
                                <div className="text-xs font-medium text-slate-600 mb-1">{day.short}</div>
                                {session && (
                                  <div className="text-xs font-semibold text-slate-900">
                                    {session.isRestDay ? "💤" : "✓"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
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
              className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              {step === 1 ? (
                <>
                  Continuar <ChevronRight className="h-4 w-4 inline ml-1" />
                </>
              ) : formData.weeks.length > 0 ? (
                "Criar Plano"
              ) : (
                "Adicionar Semanas"
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Workout Picker Modal */}
      <WorkoutPickerModal
        isOpen={isWorkoutPickerOpen}
        onClose={() => {
          setIsWorkoutPickerOpen(false);
          setSelectedDayForPicker(null);
        }}
        onSelect={handleSelectWorkoutFromLibrary}
      />
    </AnimatePresence>
  );
}