import { useState } from "react";
import { motion } from "motion/react";
import { Play, ArrowLeft } from "lucide-react";
import { ExecuteSessionModal } from "./components/modals/ExecuteSessionModal";

export function TestExecuteSession() {
  const [executeOpen, setExecuteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </a>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🧪 Teste: Adicionar Exercícios em Sessão Ao Vivo
          </h1>
          <p className="text-slate-600">
            Clica em "Iniciar Treino de Teste" para abrir o modal de execução e testar a funcionalidade de adicionar exercícios.
          </p>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">📋 Instruções:</h2>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs">1</span>
              <span>Clica no botão <strong>"Iniciar Treino de Teste"</strong> abaixo</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs">2</span>
              <span>No modal que abre, procura o <strong>botão azul "+"</strong> no canto superior direito</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs">3</span>
              <span>Clica no botão "+" para abrir o modal de seleção de exercícios</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs">4</span>
              <span>Pesquisa ou seleciona um exercício (ex: "Push-ups", "Burpees")</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs">5</span>
              <span>O exercício será adicionado ao bloco atual do treino!</span>
            </li>
          </ol>
        </div>

        {/* Features List */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">✨ Funcionalidades Implementadas:</h2>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-sm text-slate-700"><strong>Botão "+"</strong> azul no header para acesso rápido</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-sm text-slate-700"><strong>Campo de pesquisa</strong> com filtro em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-sm text-slate-700"><strong>10 exercícios prontos</strong> (Push-ups, Pull-ups, Burpees, etc.)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-sm text-slate-700"><strong>Adição inteligente</strong> ao bloco atual</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-sm text-slate-700"><strong>Animações suaves</strong> e feedback visual</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-sm text-slate-700"><strong>Toast de confirmação</strong> quando exercício é adicionado</span>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExecuteOpen(true)}
            className="flex items-center gap-3 px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            <Play className="h-5 w-5" />
            Iniciar Treino de Teste
          </motion.button>
        </div>

        {/* Visual Preview */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900 mb-4">🎨 Preview Visual:</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold">+</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Botão "+" Azul</p>
                <p className="text-xs text-slate-600">Aparece no canto superior direito do modal de execução</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-sky-300 bg-sky-50">
              <p className="text-sm text-slate-700 mb-2">
                <strong>🔍 Campo de Pesquisa:</strong> "Procurar exercício..."
              </p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 bg-white">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Push-ups</p>
                    <p className="text-xs text-slate-600">3 séries • 10-15 reps</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 bg-white">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Burpees</p>
                    <p className="text-xs text-slate-600">3 séries • 10 reps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execute Session Modal */}
      <ExecuteSessionModal
        isOpen={executeOpen}
        onClose={() => setExecuteOpen(false)}
        sessionData={{
          id: "test-1",
          title: "Treino de Teste - Adicionar Exercícios",
          time: "15:00",
          athletes: 1,
          template: "Teste de Funcionalidade"
        }}
        mode="template"
      />
    </div>
  );
}
