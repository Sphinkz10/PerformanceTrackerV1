import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Send, 
  Users, 
  Calendar, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Clock,
  MessageSquare
} from "lucide-react";

interface SendFormWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (formData: FormSendData) => void;
  prefilledAthletes?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

export interface FormSendData {
  formTemplate: string;
  athletes: string[];
  channel: "app" | "email" | "sms";
  schedule: "now" | "scheduled";
  scheduledDate?: string;
  scheduledTime?: string;
  reminder: boolean;
  reminderHours?: number;
  notes?: string;
}

const mockFormTemplates = [
  { id: "1", name: "Readiness Diário", category: "Wellness", questions: 8 },
  { id: "2", name: "Feedback Pós-Treino", category: "Performance", questions: 5 },
  { id: "3", name: "Questionário de Dor", category: "Recovery", questions: 12 },
  { id: "4", name: "Satisfação com Treino", category: "Feedback", questions: 6 },
  { id: "5", name: "Avaliação Nutricional", category: "Wellness", questions: 15 }
];

const mockAthletes = [
  { id: "1", name: "João Silva", avatar: "JS" },
  { id: "2", name: "Maria Santos", avatar: "MS" },
  { id: "3", name: "Pedro Costa", avatar: "PC" },
  { id: "4", name: "Ana Ferreira", avatar: "AF" },
  { id: "5", name: "Carlos Pereira", avatar: "CP" },
  { id: "6", name: "Sofia Oliveira", avatar: "SO" }
];

export function SendFormWizard({ 
  isOpen, 
  onClose, 
  onComplete,
  prefilledAthletes 
}: SendFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>(
    prefilledAthletes?.map(a => a.id) || []
  );
  const [channel, setChannel] = useState<"app" | "email" | "sms">("app");
  const [schedule, setSchedule] = useState<"now" | "scheduled">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [reminder, setReminder] = useState(true);
  const [reminderHours, setReminderHours] = useState("24");
  const [notes, setNotes] = useState("");

  const steps = [
    { id: 0, title: "Formulário", description: "Escolha o template" },
    { id: 1, title: "Atletas", description: "Selecione os destinatários" },
    { id: 2, title: "Canal", description: "Como enviar" },
    { id: 3, title: "Agendamento", description: "Quando enviar" },
    { id: 4, title: "Confirmação", description: "Rever e enviar" }
  ];

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return selectedForm !== "";
      case 1: return selectedAthletes.length > 0;
      case 2: return channel !== "";
      case 3: 
        if (schedule === "now") return true;
        return scheduledDate !== "" && scheduledTime !== "";
      case 4: return true;
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
      formTemplate: selectedForm,
      athletes: selectedAthletes,
      channel,
      schedule,
      scheduledDate: schedule === "scheduled" ? scheduledDate : undefined,
      scheduledTime: schedule === "scheduled" ? scheduledTime : undefined,
      reminder,
      reminderHours: reminder ? parseInt(reminderHours) : undefined,
      notes: notes || undefined
    });

    // Reset
    setCurrentStep(0);
    setSelectedForm("");
    if (!prefilledAthletes) {
      setSelectedAthletes([]);
    }
    setChannel("app");
    setSchedule("now");
    setScheduledDate("");
    setScheduledTime("");
    setReminder(true);
    setReminderHours("24");
    setNotes("");
  };

  const toggleAthlete = (id: string) => {
    setSelectedAthletes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleAllAthletes = () => {
    if (selectedAthletes.length === mockAthletes.length) {
      setSelectedAthletes([]);
    } else {
      setSelectedAthletes(mockAthletes.map(a => a.id));
    }
  };

  const selectedFormData = mockFormTemplates.find(f => f.id === selectedForm);
  const selectedAthletesData = mockAthletes.filter(a => selectedAthletes.includes(a.id));

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
                    <h2 className="font-semibold text-slate-900 mb-1">Enviar Formulário</h2>
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
                        index <= currentStep ? "bg-emerald-500" : "bg-slate-200"
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
                  {/* Step 0: Form Template */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {mockFormTemplates.map((form) => (
                        <motion.button
                          key={form.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedForm(form.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedForm === form.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{form.name}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-600">{form.category}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-600">{form.questions} perguntas</span>
                              </div>
                            </div>
                            {selectedForm === form.id && (
                              <Check className="h-5 w-5 text-emerald-600 ml-3" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 1: Athletes */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {prefilledAthletes && prefilledAthletes.length > 0 ? (
                        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl mb-4">
                          <p className="text-sm font-semibold text-slate-900 mb-2">
                            {prefilledAthletes.length} atleta(s) pré-selecionado(s)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {prefilledAthletes.map((athlete) => (
                              <div key={athlete.id} className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                                  {athlete.avatar || "A"}
                                </div>
                                <span className="text-xs font-medium text-slate-900">{athlete.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-slate-700">
                              {selectedAthletes.length} de {mockAthletes.length} selecionados
                            </span>
                            <button
                              onClick={toggleAllAthletes}
                              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              {selectedAthletes.length === mockAthletes.length ? "Desmarcar todos" : "Selecionar todos"}
                            </button>
                          </div>

                          {mockAthletes.map((athlete) => (
                            <motion.button
                              key={athlete.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => toggleAthlete(athlete.id)}
                              className={`w-full p-4 rounded-xl border-2 transition-all ${
                                selectedAthletes.includes(athlete.id)
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                                  {athlete.avatar}
                                </div>
                                <div className="text-left flex-1">
                                  <p className="text-sm font-semibold text-slate-900">{athlete.name}</p>
                                </div>
                                {selectedAthletes.includes(athlete.id) && (
                                  <Check className="h-5 w-5 text-emerald-600" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Channel */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <button
                        onClick={() => setChannel("app")}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          channel === "app"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">Athlete Portal</h3>
                            <p className="text-xs text-slate-600 mt-1">Notificação in-app (recomendado)</p>
                          </div>
                          {channel === "app" && <Check className="h-5 w-5 text-emerald-600" />}
                        </div>
                      </button>

                      <button
                        onClick={() => setChannel("email")}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          channel === "email"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                            <Send className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">Email</h3>
                            <p className="text-xs text-slate-600 mt-1">Enviar por email</p>
                          </div>
                          {channel === "email" && <Check className="h-5 w-5 text-emerald-600" />}
                        </div>
                      </button>

                      <button
                        onClick={() => setChannel("sms")}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          channel === "sms"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">SMS</h3>
                            <p className="text-xs text-slate-600 mt-1">Mensagem de texto</p>
                          </div>
                          {channel === "sms" && <Check className="h-5 w-5 text-emerald-600" />}
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3: Schedule */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        <button
                          onClick={() => setSchedule("now")}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            schedule === "now"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Send className="h-5 w-5 text-emerald-600" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">Enviar Agora</h3>
                              <p className="text-xs text-slate-600 mt-1">Os atletas receberão imediatamente</p>
                            </div>
                            {schedule === "now" && <Check className="h-5 w-5 text-emerald-600" />}
                          </div>
                        </button>

                        <button
                          onClick={() => setSchedule("scheduled")}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            schedule === "scheduled"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-sky-600" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">Agendar Envio</h3>
                              <p className="text-xs text-slate-600 mt-1">Escolher data e hora</p>
                            </div>
                            {schedule === "scheduled" && <Check className="h-5 w-5 text-emerald-600" />}
                          </div>
                        </button>
                      </div>

                      {schedule === "scheduled" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="grid grid-cols-2 gap-4 mt-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Data *
                            </label>
                            <input
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Hora *
                            </label>
                            <input
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Reminder */}
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-900">Lembrete automático</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={reminder}
                              onChange={(e) => setReminder(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                        {reminder && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Lembrar após (horas)
                            </label>
                            <input
                              type="number"
                              value={reminderHours}
                              onChange={(e) => setReminderHours(e.target.value)}
                              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                              placeholder="24"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl">
                        <h3 className="font-semibold text-slate-900 mb-3">Resumo do Envio</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                              <MessageSquare className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Formulário</p>
                              <p className="text-sm font-medium text-slate-900">{selectedFormData?.name}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                              <Users className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Destinatários</p>
                              <p className="text-sm font-medium text-slate-900">{selectedAthletesData.length} atleta(s)</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                              <Send className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Canal</p>
                              <p className="text-sm font-medium text-slate-900">
                                {channel === "app" && "Athlete Portal"}
                                {channel === "email" && "Email"}
                                {channel === "sms" && "SMS"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                              <Clock className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Agendamento</p>
                              <p className="text-sm font-medium text-slate-900">
                                {schedule === "now" && "Enviar agora"}
                                {schedule === "scheduled" && `${scheduledDate} às ${scheduledTime}`}
                              </p>
                            </div>
                          </div>

                          {reminder && (
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                <Bell className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Lembrete</p>
                                <p className="text-sm font-medium text-slate-900">Após {reminderHours}h</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Mensagem Personalizada (opcional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder="Adicione uma mensagem personalizada para os atletas..."
                          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all resize-none"
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
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Formulário
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
