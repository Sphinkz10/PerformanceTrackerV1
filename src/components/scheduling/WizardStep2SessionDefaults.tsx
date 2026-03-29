import { motion } from 'motion/react';
import { Info, Dumbbell, Users, Target, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { WizardStepProps, SESSION_TYPES, PRIORITY_OPTIONS } from '@/types/scheduling';
import { format } from 'date-fns';

export function WizardStep2SessionDefaults({ state, onChange }: WizardStepProps) {
  const { sessionDefaults } = state;

  const updateDefaults = (updates: Partial<typeof sessionDefaults>) => {
    onChange({
      sessionDefaults: {
        ...sessionDefaults,
        ...updates
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <Info className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-violet-900">
            Define as características base das sessões
          </p>
          <p className="text-xs text-violet-700 mt-1">
            Estas configurações serão aplicadas a todos os{' '}
            {state.selectedAthletes.length} atleta(s) selecionado(s).
          </p>
        </div>
      </div>

      {/* Tipo de Sessão */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Tipo de Sessão *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SESSION_TYPES.map(type => {
            const Icon = type.icon === 'Dumbbell' ? Dumbbell : type.icon === 'Users' ? Users : Target;
            const isActive = sessionDefaults.type === type.value;

            return (
              <button
                key={type.value}
                onClick={() => updateDefaults({ type: type.value })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isActive
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 bg-white hover:border-violet-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-violet-500'
                        : 'bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <span className="font-semibold text-slate-900">{type.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duração & Buffer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Duração (minutos) *
          </label>
          <div className="flex gap-2 flex-wrap">
            {[30, 45, 60, 75, 90, 120].map(duration => (
              <button
                key={duration}
                onClick={() => updateDefaults({ duration })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sessionDefaults.duration === duration
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {duration}min
              </button>
            ))}
          </div>
          <input
            type="number"
            value={sessionDefaults.duration}
            onChange={(e) => updateDefaults({ duration: Number(e.target.value) })}
            min="15"
            max="240"
            className="mt-2 w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Buffer (minutos)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[0, 5, 10, 15].map(buffer => (
              <button
                key={buffer}
                onClick={() => updateDefaults({ buffer })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sessionDefaults.buffer === buffer
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {buffer}min
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Tempo entre sessões (para logística)
          </p>
        </div>
      </div>

      {/* Período */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Período de Agendamento *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Data Início</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={format(sessionDefaults.dateRange.start, 'yyyy-MM-dd')}
                onChange={(e) =>
                  updateDefaults({
                    dateRange: {
                      ...sessionDefaults.dateRange,
                      start: new Date(e.target.value)
                    }
                  })
                }
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Data Fim</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={format(sessionDefaults.dateRange.end, 'yyyy-MM-dd')}
                onChange={(e) =>
                  updateDefaults({
                    dateRange: {
                      ...sessionDefaults.dateRange,
                      end: new Date(e.target.value)
                    }
                  })
                }
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Opções Avançadas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sessões por Semana */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Sessões por Semana
            </label>
            <input
              type="number"
              value={sessionDefaults.sessionsPerWeek || 2}
              onChange={(e) => updateDefaults({ sessionsPerWeek: Number(e.target.value) })}
              min="1"
              max="7"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">
              Quantas sessões tentar marcar por atleta/semana
            </p>
          </div>

          {/* Max por Dia */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Máx Sessões/Dia (Coach)
            </label>
            <input
              type="number"
              value={sessionDefaults.maxPerDay || 8}
              onChange={(e) => updateDefaults({ maxPerDay: Number(e.target.value) })}
              min="1"
              max="20"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">
              Limite de sessões por dia (tua capacidade)
            </p>
          </div>
        </div>

        {/* Priorização */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Critério de Priorização
          </label>
          <div className="space-y-2">
            {PRIORITY_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => updateDefaults({ priority: option.value })}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  sessionDefaults.priority === option.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 bg-white hover:border-violet-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {option.label}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                  {sessionDefaults.priority === option.value && (
                    <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
