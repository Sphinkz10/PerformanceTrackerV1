import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Dumbbell,
  Activity,
  Heart
} from "lucide-react";

interface CreateEventStepperProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (eventData: EventData) => void;
  prefilledAthlete?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface EventData {
  type: string;
  athleteId: string;
  athleteName: string;
  date: string;
  time: string;
  duration: number;
  template?: string;
  location?: string;
  notes?: string;
}

const eventTypes = [
  { id: "strength", label: "Treino de Força", icon: Dumbbell, color: "from-emerald-500 to-emerald-600" },
  { id: "cardio", label: "Treino Cardiovascular", icon: Activity, color: "from-sky-500 to-sky-600" },
  { id: "assessment", label: "Avaliação", icon: Heart, color: "from-violet-500 to-violet-600" },
  { id: "other", label: "Outro", icon: Users, color: "from-slate-500 to-slate-600" }
];

const mockAthletes = [
  { id: "1", name: "João Silva", avatar: "JS" },
  { id: "2", name: "Maria Santos", avatar: "MS" },
  { id: "3", name: "Pedro Costa", avatar: "PC" },
  { id: "4", name: "Ana Ferreira", avatar: "AF" }
];

const mockTemplates = [
  { id: "1", name: "Treino Full Body A", type: "strength" },
  { id: "2", name: "Treino Upper Body", type: "strength" },
  { id: "3", name: "HIIT 30min", type: "cardio" },
  { id: "4", name: "Avaliação Física Completa", type: "assessment" }
];

const mockLocations = [
  "Sala Principal",
  "Sala de Cardio",
  "Sala de Avaliação",
  "Campo Exterior"
];

export function CreateEventStepper({ 
  isOpen, 
  onClose, 
  onComplete,
  prefilledAthlete 
}: CreateEventStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState(prefilledAthlete?.id || "");
  const [selectedAthleteName, setSelectedAthleteName] = useState(prefilledAthlete?.name || "");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const steps = [
    { id: 0, title: "Tipo de Sessão", description: "Escolha o tipo de treino" },
    { id: 1, title: "Atleta", description: "Selecione o atleta" },
    { id: 2, title: "Template", description: "Escolha um template (opcional)" },
    { id: 3, title: "Data e Hora", description: "Quando será a sessão" },
    { id: 4, title: "Detalhes", description: "Local e notas" }
  ];

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return selectedType !== "";
      case 1: return selectedAthlete !== "";
      case 2: return true; // Template é opcional
      case 3: return date !== "" && time !== "";
      case 4: return true; // Detalhes são opcionais
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete({
      type: eventTypes.find(t => t.id === selectedType)?.label || "",
      athleteId: selectedAthlete,
      athleteName: selectedAthleteName,
      date,
      time,
      duration: parseInt(duration),
      template: selectedTemplate || undefined,
      location: location || undefined,
      notes: notes || undefined
    });

    // Reset
    setCurrentStep(0);
    setSelectedType("");
    if (!prefilledAthlete) {
      setSelectedAthlete("");
      setSelectedAthleteName("");
    }
    setSelectedTemplate("");
    setDate("");
    setTime("");
    setDuration("60");
    setLocation("");
    setNotes("");
  };

  const filteredTemplates = mockTemplates.filter(t => t.type === selectedType);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-slate-900 mb-1">Agendar Sessão</h2>
                    <p className="text-sm text-slate-600">{steps[currentStep].description}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className={`h-2 rounded-full transition-all ${
                        index <= currentStep ? "bg-sky-500" : "bg-slate-200"
                      } flex-1`} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-500">Passo {currentStep + 1} de {steps.length}</span>
                  <span className="text-xs text-slate-500">{steps[currentStep].title}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {/* Step 0: Tipo */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {eventTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              selectedType === type.id
                                ? "border-sky-500 bg-sky-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900">{type.label}</h3>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Step 1: Atleta */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {prefilledAthlete ? (
                        <div className="p-4 bg-sky-50 border-2 border-sky-500 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold">
                              {prefilledAthlete.avatar || "A"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{prefilledAthlete.name}</p>
                              <p className="text-xs text-slate-600">Atleta pré-selecionado</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {mockAthletes.map((athlete) => (
                            <motion.button
                              key={athlete.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => {
                                setSelectedAthlete(athlete.id);
                                setSelectedAthleteName(athlete.name);
                              }}
                              className={`w-full p-4 rounded-xl border-2 transition-all ${
                                selectedAthlete === athlete.id
                                  ? "border-sky-500 bg-sky-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-semibold">
                                  {athlete.avatar}
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-slate-900">{athlete.name}</p>
                                </div>
                                {selectedAthlete === athlete.id && (
                                  <Check className="h-5 w-5 text-sky-600 ml-auto" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Template */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <button
                        onClick={() => setSelectedTemplate("")}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTemplate === ""
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-900">Sem Template</p>
                        <p className="text-xs text-slate-600 mt-1">Criar sessão livre</p>
                      </button>

                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedTemplate === template.id
                              ? "border-sky-500 bg-sky-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-slate-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                            </div>
                            {selectedTemplate === template.id && (
                              <Check className="h-5 w-5 text-sky-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 3: Data e Hora */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Data *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hora *
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Duração (min) *
                          </label>
                          <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Detalhes */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Localização (opcional)
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Selecionar localização</option>
                            {mockLocations.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Notas (opcional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={5}
                          placeholder="Objetivos, observações, preparação necessária..."
                          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-slate-200 flex items-center justify-between gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={currentStep === 0 ? onClose : handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  {currentStep === 0 ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: isStepValid() ? 1.02 : 1 }}
                  whileTap={{ scale: isStepValid() ? 0.98 : 1 }}
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white shadow-md transition-all ${
                    isStepValid()
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Check className="h-4 w-4" />
                      Agendar
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
