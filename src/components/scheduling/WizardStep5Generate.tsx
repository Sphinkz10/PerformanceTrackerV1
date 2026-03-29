import { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, AlertCircle, TrendingUp, Calendar, AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import { WizardStepProps } from '@/types/scheduling';
import { SchedulingEngine, estimateGenerationTime } from '@/lib/scheduling-engine';
import { ScheduleTimeline } from './ScheduleTimeline';
import { differenceInDays } from 'date-fns';

export function WizardStep5Generate({ state, onChange }: WizardStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'athlete'>('timeline');
  const [strategy, setStrategy] = useState<'greedy' | 'balanced' | 'optimized'>('balanced');

  const hasGenerated = state.proposals.length > 0;

  /**
   * Gerar horários usando o motor
   */
  const handleGenerate = async (keepPinned = false) => {
    setIsGenerating(true);

    try {
      // Proposals pinned (se regenerar)
      const pinnedProposals = keepPinned
        ? state.proposals.filter(p => p.isPinned)
        : [];

      // Estimar tempo
      const daysRange = differenceInDays(
        state.sessionDefaults.dateRange.end,
        state.sessionDefaults.dateRange.start
      );
      const estimatedTime = estimateGenerationTime(state.selectedAthletes.length, daysRange);

      // Simular delay (para UX feedback)
      await new Promise(resolve => setTimeout(resolve, Math.min(estimatedTime, 2000)));

      // Chamar motor
      const result = await SchedulingEngine.generate({
        athletes: state.selectedAthletes,
        defaults: state.sessionDefaults,
        availability: state.availability,
        resources: state.resources,
        pinnedProposals,
        strategy
      });

      // Atualizar estado
      onChange({
        proposals: result.proposals,
        conflicts: result.conflicts,
        coverage: result.coverage,
        isGenerating: false
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
      onChange({
        error: 'Erro ao gerar horários. Verifica as regras e tenta novamente.',
        isGenerating: false
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePin = (proposalId: string) => {
    onChange({
      proposals: state.proposals.map(p =>
        p.id === proposalId
          ? { ...p, isPinned: true, status: 'pinned' as const }
          : p
      )
    });
  };

  const handleUnpin = (proposalId: string) => {
    onChange({
      proposals: state.proposals.map(p =>
        p.id === proposalId
          ? { ...p, isPinned: false, status: 'proposed' as const }
          : p
      )
    });
  };

  // Empty state (antes de gerar)
  if (!hasGenerated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center py-12">
          <motion.div
            animate={{
              rotate: isGenerating ? 360 : 0,
              scale: isGenerating ? [1, 1.1, 1] : 1
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="inline-block"
          >
            <div className="p-6 bg-gradient-to-br from-violet-100 to-violet-50 rounded-2xl mb-6">
              <Wand2 className="w-16 h-16 text-violet-600 mx-auto" />
            </div>
          </motion.div>

          <h3 className="font-bold text-slate-900 text-lg mb-2">
            {isGenerating ? 'Gerando horários...' : 'Pronto para gerar horários'}
          </h3>
          <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto">
            {isGenerating
              ? 'O motor está a encaixar os atletas respeitando todas as regras definidas.'
              : `O motor vai tentar encaixar ${state.selectedAthletes.length} atleta(s) respeitando todas as regras.`}
          </p>

          {!isGenerating && (
            <>
              {/* Strategy Selector */}
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Estratégia de Otimização
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'greedy', label: 'Rápido', desc: '~1s' },
                    { value: 'balanced', label: 'Balanceado', desc: '~2s' },
                    { value: 'optimized', label: 'Otimizado', desc: '~5s' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setStrategy(opt.value as any)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        strategy === opt.value
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-slate-200 bg-white hover:border-violet-300'
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGenerate(false)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Wand2 className="w-5 h-5" />
                ✨ Gerar Horário
              </motion.button>
            </>
          )}

          {isGenerating && (
            <div className="max-w-md mx-auto">
              <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-600"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                A processar {state.selectedAthletes.length} atleta(s)...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Generated state (mostra resultados)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-600">Cobertura</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {state.coverage}%
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {state.proposals.filter(p => p.status !== 'skipped').length} sessões
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-sky-500 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-600">Sessões</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {state.proposals.filter(p => p.status !== 'skipped').length}
          </p>
          <p className="text-xs text-sky-600 font-medium mt-1">
            {state.proposals.filter(p => p.isPinned).length} fixadas
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-amber-500 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-600">Conflitos</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {state.conflicts.length}
          </p>
          <p className="text-xs text-amber-600 font-medium mt-1">
            {state.conflicts.filter(c => c.severity >= 8).length} críticos
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-violet-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-violet-500 rounded-lg">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-600">Score Médio</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {Math.round(
              state.proposals.reduce((sum, p) => sum + p.score, 0) / state.proposals.length
            )}
            /100
          </p>
          <p className="text-xs text-violet-600 font-medium mt-1">
            Qualidade
          </p>
        </div>
      </div>

      {/* Conflicts Alert */}
      {state.conflicts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                {state.conflicts.length} conflito(s) encontrado(s)
              </p>
              <ul className="text-xs text-amber-800 mt-1 space-y-1">
                {state.conflicts.slice(0, 3).map((c) => (
                  <li key={c.id}>• {c.description}</li>
                ))}
              </ul>
              {state.conflicts.length > 3 && (
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  + {state.conflicts.length - 3} mais...
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              viewMode === 'timeline'
                ? 'bg-violet-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Por Dia
          </button>
          <button
            onClick={() => setViewMode('athlete')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              viewMode === 'athlete'
                ? 'bg-violet-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Por Atleta
          </button>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerate(true)}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-white text-violet-700 hover:bg-violet-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerar (mantém fixadas)
          </motion.button>
        </div>
      </div>

      {/* Timeline/Athlete View */}
      <ScheduleTimeline
        proposals={state.proposals}
        viewMode={viewMode}
        athletes={state.selectedAthletes}
        onPin={handlePin}
        onUnpin={handleUnpin}
      />

      {/* Info tooltip */}
      <div className="flex items-start gap-2 p-3 bg-sky-50 rounded-xl">
        <AlertCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sky-800">
          💡 <strong>Dica:</strong> Fixa sessões importantes (📌) antes de regenerar para mantê-las no lugar.
        </p>
      </div>
    </motion.div>
  );
}
