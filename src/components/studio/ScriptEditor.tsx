import { useState } from 'react';
import { Play, Save, FileCode, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ScriptEditorProps {
  onBack?: () => void;
}

export function ScriptEditor({ onBack }: ScriptEditorProps) {
  const [code, setCode] = useState(`// Script de treino inteligente
// Linguagem: PerformanceScript

workout "Periodização Ondulatória" {
  // Configurações básicas
  duration: 8 weeks
  athlete: currentAthlete
  goal: "Increase 1RM by 15%"
  
  // Regras de progressão
  progression: {
    type: "wave"
    intensityWave: [70, 75, 80, 85, 90]
    volumeWave: [4, 5, 3, 6, 2]
    autoAdjust: true
  }
  
  // Estrutura semanal
  weeklyTemplate: [
    day: 1 // Segunda
    focus: "Strength"
    exercises: [
      {
        name: "Back Squat"
        sets: "auto"
        reps: "3-5"
        intensity: "progression.current + 5%"
        rest: "3min"
        
        // Regras especiais
        rules: [
          if: "rpe > 8.5"
          then: "reduce intensity by 5%"
        ]
      }
    ]
  ]
  
  // Sistema de adaptação
  adapt: {
    basedOn: ["fatigue", "readiness", "performance"]
    rules: [
      {
        if: "readiness < 60%"
        then: "reduce volume by 30%"
      },
      {
        if: "performanceIncrease > 10%"
        then: "increase intensity by 5%"
      }
    ]
  }
}`);

  const [output, setOutput] = useState<string[]>([
    '✅ Script compilado com sucesso',
    '📊 Gerado: Plano de 8 semanas',
    '🎯 Objetivo: +15% 1RM',
    '⚠️ Aviso: Considere reduzir volume na semana 3'
  ]);

  const examples = [
    {
      name: 'Periodização Linear',
      code: `workout "Linear Periodization" {
  duration: 12 weeks
  progression: linear
  intensityStart: 65%
  intensityEnd: 95%
}`
    },
    {
      name: 'HIIT Adaptativo',
      code: `session "Adaptive HIIT" {
  warmup: 10min
  mainWork: {
    type: "intervals"
    work: "30s @ max"
    rest: "auto" // baseado em HR recovery
    rounds: "until fatigue > 80%"
  }
}`
    },
    {
      name: 'Auto-regulação',
      code: `workout "Auto-Regulated" {
  adapt: {
    if: "hrv < baseline - 10%"
    then: "switch to recovery session"
  }
}`
    }
  ];

  const runScript = () => {
    toast.success('Script executado com sucesso!');
    setOutput([
      ...output,
      `🚀 Executando script às ${new Date().toLocaleTimeString()}...`,
      '✅ Criadas 8 semanas de treino',
      '📈 24 sessões geradas automaticamente'
    ]);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex-none p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-emerald-500" />
            <h2 className="text-white">Script Editor</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            Exemplos
          </button>
          <button
            onClick={() => toast.success('Script salvo!')}
            className="px-3 py-2 text-sm border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
          <button
            onClick={runScript}
            className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg flex items-center gap-2 hover:from-emerald-700 hover:to-emerald-600 transition-all"
          >
            <Play className="h-4 w-4" />
            Executar Script
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Examples Sidebar */}
        <div className="w-64 border-r border-slate-800 bg-slate-950 p-4 overflow-y-auto">
          <h3 className="text-sm text-slate-400 mb-3">📚 Exemplos</h3>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => setCode(example.code)}
                className="w-full p-3 text-left rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm text-white mb-1">{example.name}</div>
                <div className="text-xs text-slate-400">
                  Clique para carregar
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Dica</span>
            </div>
            <p className="text-xs text-slate-400">
              Use Ctrl+Space para auto-completar comandos
            </p>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-slate-900 text-emerald-400 font-mono text-sm p-6 resize-none focus:outline-none"
            spellCheck={false}
            placeholder="Digite seu script aqui..."
          />

          {/* Console Output */}
          <div className="h-48 border-t border-slate-800 bg-black p-4 overflow-auto font-mono text-sm">
            <div className="text-emerald-400 mb-2">
              $ performtrack-script run
            </div>
            {output.map((line, i) => (
              <div key={i} className="text-emerald-300 mb-1">
                {line}
              </div>
            ))}
            <div className="text-slate-600 mt-2 animate-pulse">▊</div>
          </div>
        </div>

        {/* Help Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-950 p-4 overflow-y-auto">
          <h3 className="text-sm text-slate-400 mb-3">📖 Documentação Rápida</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs text-emerald-400 mb-1">workout</div>
              <p className="text-xs text-slate-400">Define um programa de treino completo</p>
              <code className="text-xs text-slate-500 block mt-1">
                workout "Nome" {'{ ... }'}
              </code>
            </div>

            <div>
              <div className="text-xs text-emerald-400 mb-1">session</div>
              <p className="text-xs text-slate-400">Define uma sessão individual</p>
              <code className="text-xs text-slate-500 block mt-1">
                session "Nome" {'{ ... }'}
              </code>
            </div>

            <div>
              <div className="text-xs text-emerald-400 mb-1">progression</div>
              <p className="text-xs text-slate-400">Sistema de progressão automática</p>
              <code className="text-xs text-slate-500 block mt-1">
                progression: linear | wave | block
              </code>
            </div>

            <div>
              <div className="text-xs text-emerald-400 mb-1">adapt</div>
              <p className="text-xs text-slate-400">Regras de auto-adaptação</p>
              <code className="text-xs text-slate-500 block mt-1">
                adapt: {'{ if: ..., then: ... }'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}