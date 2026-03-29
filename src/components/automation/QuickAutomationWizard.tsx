import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Users,
  Clock,
  Zap,
  Mail,
  Bell,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Save
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QuickAutomationWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

interface WizardData {
  trigger: string;
  scope: string[];
  timing: string;
  actions: string[];
  name: string;
}

export function QuickAutomationWizard({ onClose, onComplete }: QuickAutomationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    trigger: '',
    scope: [],
    timing: '',
    actions: [],
    name: ''
  });

  const totalSteps = 5;

  const triggers = [
    { id: 'session_scheduled', label: 'Sessão Agendada', icon: Calendar, category: 'Sessions', desc: 'Quando uma nova sessão é criada' },
    { id: 'session_completed', label: 'Sessão Completa', icon: CheckCircle, category: 'Sessions', desc: 'Após conclusão de treino' },
    { id: 'athlete_created', label: 'Atleta Criado', icon: Users, category: 'Athletes', desc: 'Novo atleta no sistema' },
    { id: 'payment_due', label: 'Pagamento Pendente', icon: AlertCircle, category: 'Finance', desc: 'Antes do vencimento' },
    { id: 'athlete_inactive', label: 'Atleta Inativo', icon: Clock, category: 'Engagement', desc: 'X dias sem atividade' }
  ];

  const scopeOptions = [
    { id: 'team_a', label: 'Equipa A', count: 45 },
    { id: 'team_b', label: 'Equipa B', count: 32 },
    { id: 'premium', label: 'Premium', count: 78 },
    { id: 'trial', label: 'Trial', count: 12 },
    { id: 'all', label: 'Todos os atletas', count: 156 }
  ];

  const timingPresets = [
    { id: 'immediate', label: 'Imediato', value: '0h' },
    { id: '2h_after', label: '2 horas depois', value: '2h' },
    { id: '24h_before', label: '24 horas antes', value: '-24h' },
    { id: '3d_before', label: '3 dias antes', value: '-3d' },
    { id: 'custom', label: 'Custom', value: 'custom' }
  ];

  const actions = [
    { id: 'send_email', label: 'Enviar Email', icon: Mail, category: 'Communication' },
    { id: 'send_push', label: 'Enviar Push', icon: Bell, category: 'Communication' },
    { id: 'send_sms', label: 'Enviar SMS', icon: MessageSquare, category: 'Communication' },
    { id: 'create_task', label: 'Criar Tarefa', icon: CheckCircle, category: 'Tasks' },
    { id: 'update_field', label: 'Atualizar Campo', icon: Zap, category: 'Data' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast.success('Workflow criado com sucesso!');
    onComplete();
  };

  const getHumanSummary = () => {
    const triggerLabel = triggers.find(t => t.id === wizardData.trigger)?.label || '';
    const scopeLabels = wizardData.scope.map(s => scopeOptions.find(o => o.id === s)?.label).join(', ');
    const timingLabel = timingPresets.find(t => t.id === wizardData.timing)?.label || '';
    const actionsLabels = wizardData.actions.map(a => actions.find(ac => ac.id === a)?.label).join(' + ');

    return `Quando "${triggerLabel}", para ${scopeLabels || 'todos'}, ${timingLabel}, então ${actionsLabels || 'nenhuma ação'}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-sky-50">
            <div>
              <h2 className="font-bold text-xl text-slate-900">Quick Automation</h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Passo {currentStep} de {totalSteps}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="px-6 pt-4">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: TRIGGER */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-2 mb-4">
                    <h3 className="font-bold text-lg text-slate-900">Escolhe o Trigger</h3>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Info className="w-4 h-4 text-sky-600" title="O evento que inicia a automação" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {triggers.map((trigger) => {
                      const Icon = trigger.icon;
                      return (
                        <button
                          key={trigger.id}
                          onClick={() => setWizardData({ ...wizardData, trigger: trigger.id })}
                          className={`
                            p-4 rounded-xl border-2 transition-all text-left
                            ${wizardData.trigger === trigger.id
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-slate-200 hover:border-sky-300 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              p-2 rounded-lg
                              ${wizardData.trigger === trigger.id ? 'bg-sky-100' : 'bg-slate-100'}
                            `}>
                              <Icon className={`w-5 h-5 ${wizardData.trigger === trigger.id ? 'text-sky-600' : 'text-slate-600'}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm mb-1">{trigger.label}</p>
                              <p className="text-xs text-slate-500">{trigger.desc}</p>
                              <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {trigger.category}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SCOPE */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-2 mb-4">
                    <h3 className="font-bold text-lg text-slate-900">Define o Scope</h3>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Info className="w-4 h-4 text-sky-600" title="Para quem a automação se aplica" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {scopeOptions.map((option) => {
                      const isSelected = wizardData.scope.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            const newScope = isSelected
                              ? wizardData.scope.filter(s => s !== option.id)
                              : [...wizardData.scope, option.id];
                            setWizardData({ ...wizardData, scope: newScope });
                          }}
                          className={`
                            w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                            ${isSelected
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-slate-200 hover:border-sky-300 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center
                              ${isSelected ? 'border-sky-600 bg-sky-600' : 'border-slate-300'}
                            `}>
                              {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <span className="font-semibold text-slate-900">{option.label}</span>
                          </div>
                          <span className="text-sm text-slate-500">{option.count} atletas</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                    <p className="text-sm font-medium text-sky-900">
                      Preview: {wizardData.scope.length > 0
                        ? `${wizardData.scope.map(s => scopeOptions.find(o => o.id === s)?.label).join(' + ')}`
                        : 'Nenhum scope selecionado'
                      }
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: TIMING */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-2 mb-4">
                    <h3 className="font-bold text-lg text-slate-900">Controla o Timing</h3>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Info className="w-4 h-4 text-sky-600" title="Quando a ação acontece" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {timingPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setWizardData({ ...wizardData, timing: preset.id })}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${wizardData.timing === preset.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-emerald-300 bg-white'
                          }
                        `}
                      >
                        <p className="font-semibold text-slate-900 text-sm mb-1">{preset.label}</p>
                        <p className="text-xs text-slate-500">{preset.value}</p>
                      </button>
                    ))}
                  </div>

                  {!showAdvanced && (
                    <button
                      onClick={() => setShowAdvanced(true)}
                      className="text-sm font-medium text-sky-600 hover:text-sky-700"
                    >
                      Mostrar avançado →
                    </button>
                  )}

                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3"
                    >
                      <p className="font-semibold text-sm text-amber-900">⚙️ Opções Avançadas</p>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Quiet Hours
                        </label>
                        <input
                          type="text"
                          placeholder="ex: 22:00 - 08:00"
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Cooldown (dias)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: ACTIONS */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-2 mb-4">
                    <h3 className="font-bold text-lg text-slate-900">Escolhe as Actions</h3>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Info className="w-4 h-4 text-sky-600" title="O que vai acontecer" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      const isSelected = wizardData.actions.includes(action.id);
                      return (
                        <button
                          key={action.id}
                          onClick={() => {
                            const newActions = isSelected
                              ? wizardData.actions.filter(a => a !== action.id)
                              : [...wizardData.actions, action.id];
                            setWizardData({ ...wizardData, actions: newActions });
                          }}
                          className={`
                            p-4 rounded-xl border-2 transition-all text-left
                            ${isSelected
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-emerald-300 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              p-2 rounded-lg
                              ${isSelected ? 'bg-emerald-100' : 'bg-slate-100'}
                            `}>
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-slate-600'}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm mb-1">{action.label}</p>
                              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {action.category}
                              </span>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: REVIEW */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Review & Activate</h3>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome da Automação *
                    </label>
                    <input
                      type="text"
                      value={wizardData.name}
                      onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                      placeholder="ex: Lembrete Sessão 24h"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                    />
                  </div>

                  {/* Human Summary */}
                  <div className="p-4 bg-gradient-to-r from-sky-50 to-violet-50 border border-sky-200 rounded-xl">
                    <p className="text-xs font-semibold text-sky-900 mb-2">📝 RESUMO</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {getHumanSummary()}
                    </p>
                  </div>

                  {/* Risks & Guardrails */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-semibold text-amber-900 mb-2">⚠️ RISCOS & GUARDRAILS</p>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>✓ Anti-spam: máximo 2 mensagens/dia</li>
                      <li>✓ Quiet hours: 22:00 - 08:00</li>
                      <li>✓ Idempotency: ativado</li>
                    </ul>
                  </div>

                  {/* Simulate Button */}
                  <button
                    onClick={() => toast.success('Simulação executada com sucesso!')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 font-semibold hover:bg-sky-100 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Simular (obrigatório 1x)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={currentStep === 1 ? onClose : handleBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Cancelar' : 'Voltar'}
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !wizardData.trigger) ||
                  (currentStep === 2 && wizardData.scope.length === 0) ||
                  (currentStep === 3 && !wizardData.timing) ||
                  (currentStep === 4 && wizardData.actions.length === 0)
                }
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!wizardData.name}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Criar & Ativar
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
