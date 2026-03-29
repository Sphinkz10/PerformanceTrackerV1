import { useState } from 'react';
import { motion } from 'motion/react';
import { Info, Calendar, Ban } from 'lucide-react';
import { WizardStepProps, AvailabilityRule, WEEK_DAYS } from '@/types/scheduling';
import { AvailabilitySelector } from './AvailabilitySelector';

export function WizardStep3Availability({ state, onChange }: WizardStepProps) {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [editingAthleteId, setEditingAthleteId] = useState<string | null>(null);

  const { availability } = state;

  // Update global rules
  const updateGlobalRules = (type: 'can' | 'cannot', rules: AvailabilityRule[]) => {
    onChange({
      availability: {
        ...availability,
        global: [
          ...availability.global.filter(r => r.type !== type),
          ...rules
        ]
      }
    });
  };

  // Update athlete-specific rules
  const updateAthleteRules = (
    athleteId: string,
    type: 'can' | 'cannot',
    rules: AvailabilityRule[]
  ) => {
    const athleteRules = availability.perAthlete.get(athleteId) || [];
    const otherTypeRules = athleteRules.filter(r => r.type !== type);
    
    const newAthleteRules = [...otherTypeRules, ...rules];
    
    const newPerAthlete = new Map(availability.perAthlete);
    newPerAthlete.set(athleteId, newAthleteRules);

    onChange({
      availability: {
        ...availability,
        perAthlete: newPerAthlete
      }
    });
  };

  // Get athlete rules summary
  const getAthleteRulesSummary = (athleteId: string): string => {
    const rules = availability.perAthlete.get(athleteId) || [];
    
    if (rules.length === 0) {
      return 'Usa regras globais';
    }

    const canRules = rules.filter(r => r.type === 'can').length;
    const cannotRules = rules.filter(r => r.type === 'cannot').length;

    const parts: string[] = [];
    if (canRules > 0) parts.push(`${canRules} janela${canRules > 1 ? 's' : ''}`);
    if (cannotRules > 0) parts.push(`${cannotRules} bloqueio${cannotRules > 1 ? 's' : ''}`);

    return parts.join(' • ') || 'Nenhuma regra';
  };

  // Generate human-readable summary
  const generateSummary = (rules: AvailabilityRule[]): string => {
    const canRules = rules.filter(r => r.type === 'can');
    const cannotRules = rules.filter(r => r.type === 'cannot');

    if (canRules.length === 0) {
      return 'Nenhuma janela disponível definida';
    }

    const parts: string[] = [];

    // Summarize "can" rules
    canRules.forEach(rule => {
      const days = rule.days
        .map(d => WEEK_DAYS[d])
        .join(', ');
      const times = rule.timeRanges
        .map(t => `${t.start}-${t.end}`)
        .join(', ');
      
      parts.push(`✅ ${days}: ${times}`);
    });

    // Summarize "cannot" rules
    if (cannotRules.length > 0) {
      cannotRules.forEach(rule => {
        const days = rule.days
          .map(d => WEEK_DAYS[d])
          .join(', ');
        const times = rule.timeRanges
          .map(t => `${t.start}-${t.end}`)
          .join(', ');
        
        parts.push(`🚫 ${days}: ${times}`);
      });
    }

    return parts.join(' • ');
  };

  const canRules = availability.global.filter(r => r.type === 'can');
  const cannotRules = availability.global.filter(r => r.type === 'cannot');

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
            Define quando podes marcar sessões
          </p>
          <p className="text-xs text-violet-700 mt-1">
            Define primeiro global. Depois só ajustas exceções individuais.
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('simple')}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            mode === 'simple'
              ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300'
          }`}
        >
          Regra Global
        </button>
        <button
          onClick={() => setMode('advanced')}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            mode === 'advanced'
              ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300'
          }`}
        >
          Por Atleta
        </button>
      </div>

      {/* Simple Mode - Global Rules */}
      {mode === 'simple' && (
        <div className="space-y-4">
          {/* CAN (Janelas Disponíveis) */}
          <div className="p-4 border-2 border-emerald-200 bg-emerald-50/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">
                  📅 PODE (Janelas Disponíveis)
                </h3>
                <p className="text-xs text-emerald-700">
                  Horários onde podes marcar sessões
                </p>
              </div>
            </div>

            <AvailabilitySelector
              type="can"
              rules={canRules}
              onChange={(rules) => updateGlobalRules('can', rules)}
            />
          </div>

          {/* CANNOT (Bloqueios) */}
          <div className="p-4 border-2 border-red-200 bg-red-50/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-500 rounded-lg">
                <Ban className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">
                  🚫 NÃO PODE (Bloqueios)
                </h3>
                <p className="text-xs text-red-700">
                  Horários onde NÃO podes marcar (ex: reuniões, outras obrigações)
                </p>
              </div>
            </div>

            <AvailabilitySelector
              type="cannot"
              rules={cannotRules}
              onChange={(rules) => updateGlobalRules('cannot', rules)}
            />
          </div>

          {/* Preview Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              📊 Resumo (Regras Globais):
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {generateSummary(availability.global)}
            </p>
          </div>
        </div>
      )}

      {/* Advanced Mode - Per Athlete */}
      {mode === 'advanced' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lista de Atletas */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Atletas ({state.selectedAthletes.length})
            </h3>
            {state.selectedAthletes.map((athlete) => (
              <button
                key={athlete.id}
                onClick={() => setEditingAthleteId(athlete.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  editingAthleteId === athlete.id
                    ? 'bg-violet-100 border-2 border-violet-500'
                    : 'bg-white border-2 border-slate-200 hover:border-violet-300'
                }`}
              >
                <p className="font-semibold text-slate-900 mb-1">
                  {athlete.name}
                </p>
                <p className="text-xs text-slate-600">
                  {getAthleteRulesSummary(athlete.id)}
                </p>
              </button>
            ))}
          </div>

          {/* Editor de Regras */}
          {editingAthleteId && (
            <div className="p-4 border-2 border-violet-200 bg-violet-50/50 rounded-2xl">
              <h3 className="font-semibold text-violet-900 mb-4">
                {state.selectedAthletes.find(a => a.id === editingAthleteId)?.name}
              </h3>

              <div className="space-y-4">
                {/* Athlete CAN */}
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">
                    ✅ Pode (Exceções)
                  </h4>
                  <AvailabilitySelector
                    type="can"
                    rules={(availability.perAthlete.get(editingAthleteId) || []).filter(
                      r => r.type === 'can'
                    )}
                    onChange={(rules) => updateAthleteRules(editingAthleteId, 'can', rules)}
                  />
                </div>

                {/* Athlete CANNOT */}
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-2">
                    🚫 Não Pode (Exceções)
                  </h4>
                  <AvailabilitySelector
                    type="cannot"
                    rules={(availability.perAthlete.get(editingAthleteId) || []).filter(
                      r => r.type === 'cannot'
                    )}
                    onChange={(rules) => updateAthleteRules(editingAthleteId, 'cannot', rules)}
                  />
                </div>
              </div>

              <p className="text-xs text-violet-700 mt-4 p-2 bg-white rounded-lg">
                💡 Estas regras sobrepõem-se às globais para este atleta
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
