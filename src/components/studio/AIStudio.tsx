import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  Brain,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AIStudioProps {
  onGenerate?: (workout: any) => void;
}

export function AIStudio({ onGenerate }: AIStudioProps) {
  const [aiMode, setAiMode] = useState<'generate' | 'optimize' | 'predict'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);

  const quickPrompts = [
    "Sessão de força para jogador de rugby, 60min, nível avançado",
    "Programa de reabilitação para lesão de joelho, 4 semanas",
    "HIIT para melhorar VO2max, 30 minutos",
    "Plano de hipertrofia para iniciante, 12 semanas",
    "Treino de mobilidade para atleta de CrossFit",
    "Sessão de potência explosiva para sprinter"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Por favor, descreva o treino que quer criar');
      return;
    }

    setIsGenerating(true);

    // Simular chamada à API
    setTimeout(() => {
      const mockWorkout = {
        name: "Sessão de Força - Lower Body",
        type: "strength",
        duration: 75,
        blocks: [
          {
            name: "Aquecimento",
            duration: 10,
            exercises: [
              { name: "Mobilidade de Quadril", sets: 2, reps: "10 cada lado" },
              { name: "Ativação de Glúteo", sets: 2, reps: 15 }
            ]
          },
          {
            name: "Força Principal",
            duration: 45,
            exercises: [
              { name: "Agachamento Livre", sets: 4, reps: "6-8", intensity: "85% 1RM" },
              { name: "Levantamento Terra", sets: 4, reps: "5", intensity: "88% 1RM" },
              { name: "Bulgarian Split Squat", sets: 3, reps: "8 cada", intensity: "Moderada" }
            ]
          },
          {
            name: "Trabalho Acessório",
            duration: 15,
            exercises: [
              { name: "Leg Curl", sets: 3, reps: 12 },
              { name: "Panturrilha em Pé", sets: 3, reps: 15 }
            ]
          }
        ],
        aiInsights: {
          balanceScore: 92,
          injuryRisk: 12,
          adaptationPotential: 87
        }
      };

      setGeneratedWorkout(mockWorkout);
      setIsGenerating(false);
      toast.success('Treino gerado com sucesso pela IA!');
      
      if (onGenerate) {
        onGenerate(mockWorkout);
      }
    }, 2000);
  };

  const modes = [
    { id: 'generate', label: 'Criar', icon: Sparkles, color: 'blue' },
    { id: 'optimize', label: 'Otimizar', icon: Zap, color: 'emerald' },
    { id: 'predict', label: 'Prever', icon: Brain, color: 'violet' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="flex-none p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white">AI Training Coach</h2>
            <p className="text-sm text-slate-400">
              Inteligência artificial para criação científica
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setAiMode(mode.id as any)}
                className={`p-3 rounded-xl transition-all ${
                  aiMode === mode.id
                    ? `bg-${mode.color}-600 shadow-lg`
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <Icon className="h-5 w-5 mx-auto mb-1" />
                <div className="text-xs">{mode.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {aiMode === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Prompt Input */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Descreva o treino que quer criar:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
                  placeholder="Ex: Sessão de força para jogador de rugby com foco em potência e prevenção de lesões no joelho, 60 minutos, nível avançado..."
                />
                
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    ✨ Auto-completar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Gerar Treino
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div>
                <h3 className="text-sm text-slate-300 mb-3">Sugestões Rápidas:</h3>
                <div className="space-y-2">
                  {quickPrompts.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(suggestion)}
                      className="w-full text-left p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Workout Preview */}
              {generatedWorkout && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-slate-800 border border-emerald-500/30 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-white">Treino Gerado</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-400">Nome</div>
                      <div className="text-white">{generatedWorkout.name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400">Duração</div>
                        <div className="text-white">{generatedWorkout.duration} min</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Blocos</div>
                        <div className="text-white">{generatedWorkout.blocks.length}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-400 mb-2">Estrutura</div>
                      <div className="space-y-2">
                        {generatedWorkout.blocks.map((block: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-900 rounded-lg">
                            <div className="text-sm text-white mb-1">{block.name}</div>
                            <div className="text-xs text-slate-400">
                              {block.duration} min • {block.exercises.length} exercícios
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all">
                      Usar Este Treino
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {aiMode === 'optimize' && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Otimização Inteligente</h3>
                <p className="text-slate-400">
                  Melhore treinos existentes com sugestões baseadas em dados
                </p>
              </div>
            </motion.div>
          )}

          {aiMode === 'predict' && (
            <motion.div
              key="predict"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-violet-500 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Previsão de Resultados</h3>
                <p className="text-slate-400">
                  Simule resultados antes de aplicar o treino
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Analysis */}
      <div className="flex-none p-6 border-t border-slate-800">
        <h3 className="text-sm text-slate-300 mb-4">Análise AI em Tempo Real:</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-300">Balanceamento muscular:</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-emerald-400">Ótimo</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-300">Risco de overtraining:</span>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-400">15%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-300">Potencial de adaptação:</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-400">87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}