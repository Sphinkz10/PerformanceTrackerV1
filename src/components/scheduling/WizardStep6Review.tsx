import { motion } from 'motion/react';
import { Info, CheckCircle, Bell, Clock, Dumbbell, AlertCircle } from 'lucide-react';
import { WizardStepProps } from '@/types/scheduling';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ConflictResolver } from './ConflictResolver';
import { ProposalCard } from './ProposalCard';

interface WizardStep6ReviewProps extends WizardStepProps {
  onCommit: () => void;
}

export function WizardStep6Review({ state, onChange, onCommit }: WizardStep6ReviewProps) {
  const { commitOptions } = state;

  const updateCommitOptions = (updates: Partial<typeof commitOptions>) => {
    onChange({
      commitOptions: {
        ...commitOptions,
        ...updates
      }
    });
  };

  const validProposals = state.proposals.filter(p => p.status !== 'skipped' && p.status !== 'conflict');
  const conflictProposals = state.proposals.filter(p => p.status === 'conflict');
  const skippedProposals = state.proposals.filter(p => p.status === 'skipped');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">
            Quase lá! Revê e confirma
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Após criar, terás 30 segundos para desfazer caso seja necessário.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-6 bg-gradient-to-br from-violet-50 to-white border-2 border-violet-200 rounded-2xl">
        <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Resumo do Plano
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-600 mb-1">Atletas</p>
            <p className="text-2xl font-bold text-slate-900">
              {state.selectedAthletes.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-600 mb-1">Sessões</p>
            <p className="text-2xl font-bold text-emerald-600">
              {validProposals.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-600 mb-1">Período</p>
            <p className="text-sm font-bold text-slate-900">
              {format(state.sessionDefaults.dateRange.start, 'dd MMM', { locale: pt })}
              {' - '}
              {format(state.sessionDefaults.dateRange.end, 'dd MMM', { locale: pt })}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-600 mb-1">Cobertura</p>
            <p className="text-2xl font-bold text-violet-600">
              {state.coverage}%
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-violet-200 text-xs text-slate-600 space-y-1">
          <p>
            • Duração: {state.sessionDefaults.duration}min + {state.sessionDefaults.buffer}min buffer
          </p>
          <p>
            • Tipo: {state.sessionDefaults.type === 'session' ? 'Sessão PT' : state.sessionDefaults.type === 'class' ? 'Aula/Grupo' : 'Avaliação'}
          </p>
          {state.resources.coach && (
            <p>
              • Coach: {state.resources.coach}
            </p>
          )}
          {state.resources.location && (
            <p>
              • Local: {state.resources.location}
            </p>
          )}
        </div>
      </div>

      {/* Conflicts (se houver) */}
      {state.conflicts.length > 0 && (
        <ConflictResolver
          conflicts={state.conflicts}
          proposals={state.proposals}
          onResolve={(resolved) => onChange({ proposals: resolved })}
        />
      )}

      {/* Skipped Athletes Warning */}
      {skippedProposals.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                {skippedProposals.length} atleta(s) sem horário
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Não foi possível encontrar horário disponível para:{' '}
                {skippedProposals.map(p => p.athleteName).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Commit Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Opções de Criação
        </h3>

        {/* Notify Athletes */}
        <label className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                commitOptions.notifyAthletes ? 'bg-violet-500' : 'bg-slate-100'
              }`}
            >
              <Bell className={`w-5 h-5 ${commitOptions.notifyAthletes ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Notificar Atletas
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Enviar confirmação por email/SMS aos atletas
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={commitOptions.notifyAthletes}
            onChange={(e) => updateCommitOptions({ notifyAthletes: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500/30"
          />
        </label>

        {/* Create as Pending */}
        <label className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                commitOptions.createAsPending ? 'bg-amber-500' : 'bg-slate-100'
              }`}
            >
              <Clock className={`w-5 h-5 ${commitOptions.createAsPending ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Criar como Pendente
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Marcar sessões como "pendente" até confirmação
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={commitOptions.createAsPending}
            onChange={(e) => updateCommitOptions({ createAsPending: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-2 focus:ring-amber-500/30"
          />
        </label>

        {/* Attach Template */}
        <label className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                commitOptions.attachTemplate ? 'bg-emerald-500' : 'bg-slate-100'
              }`}
            >
              <Dumbbell className={`w-5 h-5 ${commitOptions.attachTemplate ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Associar Template de Treino
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Cada sessão terá um treino pré-definido
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={commitOptions.attachTemplate}
            onChange={(e) => updateCommitOptions({ attachTemplate: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>

        {/* Template Selector (se attachTemplate = true) */}
        {commitOptions.attachTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4"
          >
            <select
              value={commitOptions.templateId || ''}
              onChange={(e) => updateCommitOptions({ templateId: e.target.value || undefined })}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
            >
              <option value="">Seleciona um template...</option>
              <option value="template-1">Força Geral</option>
              <option value="template-2">Hipertrofia</option>
              <option value="template-3">Mobilidade</option>
              <option value="template-4">Condicionamento</option>
            </select>
          </motion.div>
        )}
      </div>

      {/* Preview List (Collapsible) */}
      <details className="border border-slate-200 rounded-xl overflow-hidden">
        <summary className="px-4 py-3 bg-slate-50 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors">
          Ver todas as sessões ({validProposals.length})
        </summary>
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {validProposals.map((proposal, index) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              index={index}
              onPin={() => {}}
              onUnpin={() => {}}
              compact
            />
          ))}
        </div>
      </details>

      {/* Final Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange({ currentStep: 5 })}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
        >
          ← Voltar e Ajustar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCommit}
          disabled={validProposals.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          ✅ Criar {validProposals.length} Sessão/Sessões
        </motion.button>
      </div>
    </motion.div>
  );
}
