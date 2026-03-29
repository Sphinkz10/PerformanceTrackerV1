import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Users, Clock, Music, ChevronRight, GripVertical } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ClassData) => void;
}

export interface ClassData {
  name: string;
  description: string;
  type: "group-fitness" | "bootcamp" | "yoga" | "pilates" | "spinning" | "hiit" | "dance" | "martial-arts" | "crossfit" | "other";
  intensity: "low" | "moderate" | "high" | "variable";
  duration: number;
  maxParticipants: number;
  segments: ClassSegment[];
  equipment: string[];
  tags: string[];
}

interface ClassSegment {
  id: string;
  name: string;
  duration: number;
  type: "warmup" | "main" | "cooldown" | "stretch" | "other";
  description: string;
  music: string;
}

export function CreateClassModal({ isOpen, onClose, onComplete }: CreateClassModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ClassData>({
    name: "",
    description: "",
    type: "group-fitness",
    intensity: "moderate",
    duration: 60,
    maxParticipants: 20,
    segments: [],
    equipment: [],
    tags: []
  });

  const [currentSegment, setCurrentSegment] = useState<ClassSegment>({
    id: Date.now().toString(),
    name: "",
    duration: 10,
    type: "warmup",
    description: "",
    music: ""
  });

  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [equipmentInput, setEquipmentInput] = useState("");

  const classTypes = [
    { id: "group-fitness" as const, name: "Fitness em Grupo", emoji: "🏋️", color: "sky", description: "Aula fitness geral" },
    { id: "bootcamp" as const, name: "Bootcamp", emoji: "⚡", color: "red", description: "Treino militar intenso" },
    { id: "yoga" as const, name: "Yoga", emoji: "🧘", color: "purple", description: "Prática de yoga" },
    { id: "pilates" as const, name: "Pilates", emoji: "🤸", color: "pink", description: "Método Pilates" },
    { id: "spinning" as const, name: "Spinning", emoji: "🚴", color: "amber", description: "Ciclismo indoor" },
    { id: "hiit" as const, name: "HIIT", emoji: "🔥", color: "orange", description: "Alta intensidade" },
    { id: "dance" as const, name: "Dança", emoji: "💃", color: "violet", description: "Aulas de dança" },
    { id: "martial-arts" as const, name: "Artes Marciais", emoji: "🥋", color: "emerald", description: "Lutas e defesa" },
    { id: "crossfit" as const, name: "CrossFit", emoji: "🏆", color: "cyan", description: "Functional fitness" },
    { id: "other" as const, name: "Outro", emoji: "🌟", color: "slate", description: "Outro tipo" }
  ];

  const intensityLevels = [
    { id: "low" as const, name: "Baixa", color: "emerald", emoji: "🟢", description: "Leve e suave" },
    { id: "moderate" as const, name: "Moderada", color: "amber", emoji: "🟡", description: "Ritmo médio" },
    { id: "high" as const, name: "Alta", color: "red", emoji: "🔴", description: "Intenso e exigente" },
    { id: "variable" as const, name: "Variável", color: "violet", emoji: "🌈", description: "Muda ao longo da aula" }
  ];

  const segmentTypes = [
    { id: "warmup" as const, name: "Aquecimento", emoji: "🔥", color: "amber" },
    { id: "main" as const, name: "Principal", emoji: "💪", color: "sky" },
    { id: "cooldown" as const, name: "Arrefecimento", emoji: "❄️", color: "cyan" },
    { id: "stretch" as const, name: "Alongamento", emoji: "🧘", color: "purple" },
    { id: "other" as const, name: "Outro", emoji: "⭐", color: "slate" }
  ];

  const handleAddEquipment = () => {
    if (!equipmentInput.trim()) return;
    if (formData.equipment.includes(equipmentInput.trim())) {
      toast.error("Equipamento já adicionado");
      return;
    }
    setFormData({
      ...formData,
      equipment: [...formData.equipment, equipmentInput.trim()]
    });
    setEquipmentInput("");
  };

  const handleRemoveEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_, i) => i !== index)
    });
  };

  const handleAddSegment = () => {
    if (!currentSegment.name) {
      toast.error("Nome do segmento é obrigatório");
      return;
    }

    if (currentSegment.duration <= 0) {
      toast.error("Duração deve ser maior que 0");
      return;
    }

    setFormData({
      ...formData,
      segments: [...formData.segments, { ...currentSegment, id: Date.now().toString() }]
    });

    setCurrentSegment({
      id: Date.now().toString(),
      name: "",
      duration: 10,
      type: "main",
      description: "",
      music: ""
    });

    setShowSegmentForm(false);
    toast.success("Segmento adicionado!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name) {
        toast.error("Nome da aula é obrigatório");
        return;
      }
      if (formData.duration <= 0) {
        toast.error("Duração deve ser maior que 0");
        return;
      }
      setStep(2);
      return;
    }

    if (formData.segments.length === 0) {
      toast.error("Adicione pelo menos 1 segmento à aula");
      return;
    }

    const totalDuration = formData.segments.reduce((sum, seg) => sum + seg.duration, 0);
    if (totalDuration !== formData.duration) {
      toast.warning(`Duração total dos segmentos (${totalDuration}min) difere da duração da aula (${formData.duration}min)`);
    }

    onComplete(formData);
    toast.success(`Aula "${formData.name}" criada com sucesso!`);
    onClose();
    
    // Reset
    setStep(1);
    setFormData({
      name: "",
      description: "",
      type: "group-fitness",
      intensity: "moderate",
      duration: 60,
      maxParticipants: 20,
      segments: [],
      equipment: [],
      tags: []
    });
  };

  if (!isOpen) return null;

  const totalSegmentDuration = formData.segments.reduce((sum, seg) => sum + seg.duration, 0);

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
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Criar Nova Aula
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
                    Nome da Aula *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: HIIT 45min, Yoga Flow, Spinning Sunset..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300"
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
                    placeholder="Objetivo e estilo da aula..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Tipo de Aula
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {classTypes.map((type) => {
                      const isSelected = formData.type === type.id;
                      return (
                        <motion.button
                          key={type.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, type: type.id })}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            isSelected
                              ? `border-${type.color}-500 bg-${type.color}-50`
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.emoji}</div>
                          <p className="text-xs font-semibold text-slate-900">{type.name}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Intensidade
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {intensityLevels.map((level) => {
                      const isSelected = formData.intensity === level.id;
                      return (
                        <motion.button
                          key={level.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, intensity: level.id })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            isSelected
                              ? `border-${level.color}-500 bg-${level.color}-50`
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{level.emoji}</div>
                          <p className="text-sm font-semibold text-slate-900">{level.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{level.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duração (minutos) *
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Participantes Máximos
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Equipamento Necessário
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={equipmentInput}
                        onChange={(e) => setEquipmentInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEquipment())}
                        placeholder="Ex: Tapete, Halteres, Kettlebell..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddEquipment}
                        className="px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {formData.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.equipment.map((eq, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-sm text-slate-700">{eq}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEquipment(idx)}
                              className="p-0.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Build Segments */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    {currentSegment.name ? "Editar Segmento" : "Criar Segmento"}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Segments List */}
                    {formData.segments.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {formData.segments.map((segment, idx) => {
                          const segmentType = segmentTypes.find(t => t.id === segment.type);
                          return (
                            <div key={segment.id} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                              <GripVertical className="h-4 w-4 text-slate-400" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{segmentType?.emoji}</span>
                                  <p className="font-medium text-sm text-slate-900">{segment.name}</p>
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                    {segment.duration}min
                                  </span>
                                </div>
                                {segment.description && (
                                  <p className="text-xs text-slate-600">{segment.description}</p>
                                )}
                                {segment.music && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Music className="h-3 w-3 text-purple-500" />
                                    <span className="text-xs text-purple-600">{segment.music}</span>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData({
                                  ...formData,
                                  segments: formData.segments.filter((_, i) => i !== idx)
                                })}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Segment Form */}
                    {showSegmentForm ? (
                      <div className="p-4 border border-sky-200 rounded-xl bg-sky-50/50 space-y-3">
                        <input
                          type="text"
                          value={currentSegment.name}
                          onChange={(e) => setCurrentSegment({ ...currentSegment, name: e.target.value })}
                          placeholder="Nome do segmento *"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        />

                        <div className="grid grid-cols-5 gap-2">
                          {segmentTypes.map((type) => {
                            const isSelected = currentSegment.type === type.id;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setCurrentSegment({ ...currentSegment, type: type.id })}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? `border-${type.color}-500 bg-${type.color}-50`
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                              >
                                <div className="text-xl mb-1">{type.emoji}</div>
                                <div className="text-xs font-medium text-slate-900">{type.name}</div>
                              </button>
                            );
                          })}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Duração (minutos)</label>
                          <input
                            type="number"
                            value={currentSegment.duration}
                            onChange={(e) => setCurrentSegment({ ...currentSegment, duration: parseInt(e.target.value) || 0 })}
                            min="1"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                          />
                        </div>

                        <textarea
                          value={currentSegment.description}
                          onChange={(e) => setCurrentSegment({ ...currentSegment, description: e.target.value })}
                          placeholder="Descrição (opcional)"
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        />

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            <Music className="h-3 w-3 inline mr-1" />
                            Música / Playlist (opcional)
                          </label>
                          <input
                            type="text"
                            value={currentSegment.music}
                            onChange={(e) => setCurrentSegment({ ...currentSegment, music: e.target.value })}
                            placeholder="Nome da música ou BPM"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddSegment}
                            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors"
                          >
                            Adicionar Segmento
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSegmentForm(false)}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowSegmentForm(true)}
                        className="w-full px-4 py-2 text-sm font-semibold rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-colors"
                      >
                        <Plus className="h-4 w-4 inline mr-2" />
                        Adicionar Segmento
                      </button>
                    )}
                  </div>
                </div>

                {/* Duration Summary */}
                {formData.segments.length > 0 && (
                  <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">Resumo de Duração</h4>
                      <div className={`px-3 py-1 rounded-lg font-semibold ${
                        totalSegmentDuration === formData.duration
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {totalSegmentDuration} / {formData.duration} min
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          totalSegmentDuration === formData.duration
                            ? "bg-emerald-500"
                            : totalSegmentDuration > formData.duration
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.min((totalSegmentDuration / formData.duration) * 100, 100)}%` }}
                      />
                    </div>

                    {totalSegmentDuration !== formData.duration && (
                      <p className="text-xs text-slate-600 mt-2">
                        {totalSegmentDuration < formData.duration
                          ? `Faltam ${formData.duration - totalSegmentDuration} minutos`
                          : `Excede ${totalSegmentDuration - formData.duration} minutos`}
                      </p>
                    )}
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
              className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:from-purple-400 hover:to-pink-400 transition-all"
            >
              {step === 1 ? (
                <>
                  Continuar <ChevronRight className="h-4 w-4 inline ml-1" />
                </>
              ) : formData.segments.length > 0 ? (
                "Criar Aula"
              ) : (
                "Adicionar Segmentos"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
