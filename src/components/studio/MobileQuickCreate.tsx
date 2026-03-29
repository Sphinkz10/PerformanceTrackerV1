import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dumbbell,
  Calendar,
  Mic,
  Camera,
  Zap,
  ArrowLeft,
  Check,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type CreateMode = 'select' | 'quick' | 'scan' | 'voice' | 'assistant';
type CreateType = 'exercise' | 'session' | 'plan';

interface MobileQuickCreateProps {
  onBack?: () => void;
  onComplete?: (data: any) => void;
}

export function MobileQuickCreate({ onBack, onComplete }: MobileQuickCreateProps) {
  const [mode, setMode] = useState<CreateMode>('select');
  const [createType, setCreateType] = useState<CreateType | null>(null);
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);

  // Quick Create data
  const [quickData, setQuickData] = useState({
    name: '',
    type: '',
    duration: 60
  });

  const createTypes = [
    {
      id: 'exercise' as CreateType,
      name: 'Exercício Rápido',
      description: 'Criar em 30 segundos',
      icon: Dumbbell,
      color: 'from-emerald-500 to-emerald-600',
      emoji: '🏋️'
    },
    {
      id: 'session' as CreateType,
      name: 'Sessão Inteligente',
      description: 'IA sugere estrutura',
      icon: Calendar,
      color: 'from-sky-500 to-sky-600',
      emoji: '📅'
    },
    {
      id: 'plan' as CreateType,
      name: 'Plano Rápido',
      description: '3 perguntas e pronto',
      icon: Sparkles,
      color: 'from-violet-500 to-violet-600',
      emoji: '⚡'
    },
  ];

  const modes = [
    { id: 'quick', name: 'Rápido', icon: Zap, color: 'text-blue-400' },
    { id: 'scan', name: 'Scanner', icon: Camera, color: 'text-green-400' },
    { id: 'voice', name: 'Voz', icon: Mic, color: 'text-red-400' },
    { id: 'assistant', name: 'AI', icon: Sparkles, color: 'text-purple-400' },
  ];

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Gravação iniciada');
      // Simular reconhecimento de voz
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Treino criado com sucesso!');
        if (onComplete) {
          onComplete({ type: 'voice', data: quickData });
        }
      }, 3000);
    }
  };

  const handleQuickComplete = () => {
    if (!quickData.name) {
      toast.error('Por favor, preencha o nome');
      return;
    }
    toast.success('Criado com sucesso!');
    if (onComplete) {
      onComplete({ type: 'quick', data: quickData });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="flex-none p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          {mode !== 'select' && (
            <button
              onClick={() => setMode('select')}
              className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-white">Criar Novo</h2>
            {createType && (
              <p className="text-sm text-slate-400">
                {createTypes.find(t => t.id === createType)?.name}
              </p>
            )}
          </div>
        </div>
        
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-white"
          >
            Fechar
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Type Selection Screen */}
          {mode === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <h1 className="text-2xl mb-8">O que vamos criar?</h1>
              
              <div className="space-y-4 mb-12">
                {createTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCreateType(type.id);
                        setMode('quick');
                      }}
                      className="w-full p-6 bg-slate-800 rounded-2xl flex items-center gap-4 active:bg-slate-700 transition-colors"
                    >
                      <div className={`h-14 w-14 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white mb-1">{type.name}</div>
                        <div className="text-sm text-slate-400">{type.description}</div>
                      </div>
                      <div className="text-3xl">{type.emoji}</div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="text-center text-slate-500 text-sm mb-4">
                ou escolha um modo especial:
              </div>
            </motion.div>
          )}

          {/* Quick Mode */}
          {mode === 'quick' && (
            <motion.div
              key="quick"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400">Passo {step} de 3</span>
                  <span className="text-slate-400">{Math.round((step / 3) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-4">Como se chama?</h3>
                    <input
                      type="text"
                      value={quickData.name}
                      onChange={(e) => setQuickData({ ...quickData, name: e.target.value })}
                      placeholder="Ex: Treino de Força"
                      className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-4">Qual o objetivo?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Força', 'Hipertrofia', 'Resistência', 'Potência', 'Mobilidade', 'Reabilitação'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setQuickData({ ...quickData, type })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            quickData.type === type
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-slate-700 bg-slate-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-4">Quanto tempo?</h3>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        value={quickData.duration}
                        onChange={(e) => setQuickData({ ...quickData, duration: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-center">
                        <div className="text-4xl mb-2">{quickData.duration}</div>
                        <div className="text-slate-400">minutos</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-800 rounded-xl">
                    <h4 className="text-sm text-slate-300 mb-3">Resumo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nome:</span>
                        <span className="text-white">{quickData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Objetivo:</span>
                        <span className="text-white">{quickData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duração:</span>
                        <span className="text-white">{quickData.duration} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3">
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !quickData.name || step === 2 && !quickData.type}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    onClick={handleQuickComplete}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    Criar Agora
                  </button>
                )}
                
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="w-full py-4 bg-slate-800 text-white rounded-xl"
                  >
                    Voltar
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Voice Mode */}
          {mode === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-8"
            >
              <div className={`text-6xl mb-8 ${isRecording ? 'animate-pulse' : ''}`}>
                🎤
              </div>
              <div className="text-xl mb-4">Fale o treino que quer criar</div>
              <div className="text-slate-400 text-center mb-8 text-sm max-w-sm">
                Ex: "Criar sessão de força para João com foco em pernas, 60 minutos, nível intermediário"
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceRecord}
                className={`h-24 w-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg'
                }`}
              >
                {isRecording ? (
                  <div className="h-12 w-12 bg-white rounded-lg" />
                ) : (
                  <Mic className="h-10 w-10 text-white" />
                )}
              </motion.button>
              
              <div className="mt-6 text-sm text-slate-500">
                {isRecording ? 'Gravando...' : 'Toque e segure para gravar'}
              </div>

              {isRecording && (
                <div className="mt-8 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-red-500 rounded-full"
                      animate={{
                        height: [16, 32, 16],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Scan Mode */}
          {mode === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full bg-slate-900"
            >
              {/* Camera preview simulation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 border-4 border-green-400 rounded-2xl" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-pulse" />
                </div>
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-32 left-0 right-0 text-center px-8">
                <div className="text-xl mb-2">Escaneie um exercício</div>
                <div className="text-slate-400 text-sm">
                  Aponte para um atleta executando
                </div>
              </div>

              {/* Capture button */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <button className="h-16 w-16 bg-white rounded-full border-4 border-green-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Mode Switcher */}
      {mode === 'select' && (
        <div className="flex-none bg-slate-900 border-t border-slate-800 p-4">
          <div className="flex justify-around">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CreateMode)}
                  className="flex flex-col items-center gap-2"
                >
                  <Icon className={`h-6 w-6 ${m.color}`} />
                  <span className="text-xs text-slate-400">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}