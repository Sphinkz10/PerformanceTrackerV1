import { motion } from 'motion/react';
import { Info, User, MapPin, Package, Shield } from 'lucide-react';
import { WizardStepProps } from '@/types/scheduling';

// Mock coaches/locations (substituir por Supabase)
const MOCK_COACHES = [
  { id: '1', name: 'João Coach' },
  { id: '2', name: 'Maria PT' },
  { id: '3', name: 'Pedro Trainer' }
];

const MOCK_LOCATIONS = [
  'Sala A',
  'Sala B',
  'Área Funcional',
  'Estúdio',
  'Outdoor'
];

export function WizardStep4Resources({ state, onChange }: WizardStepProps) {
  const { resources } = state;

  const updateResources = (updates: Partial<typeof resources>) => {
    onChange({
      resources: {
        ...resources,
        ...updates
      }
    });
  };

  const toggleConstraint = (type: string) => {
    const exists = resources.constraints.some(c => c.type === type);
    
    if (exists) {
      updateResources({
        constraints: resources.constraints.filter(c => c.type !== type)
      });
    } else {
      updateResources({
        constraints: [
          ...resources.constraints,
          { type: type as any, enabled: true }
        ]
      });
    }
  };

  const isConstraintActive = (type: string) => {
    return resources.constraints.some(c => c.type === type && c.enabled);
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
            Define recursos e restrições (Opcional)
          </p>
          <p className="text-xs text-violet-700 mt-1">
            Recursos evitam marcações impossíveis e reduzem conflitos.
          </p>
        </div>
      </div>

      {/* Coach */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Coach / Treinador
          </div>
        </label>
        <select
          value={resources.coach || ''}
          onChange={(e) => updateResources({ coach: e.target.value || undefined })}
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
        >
          <option value="">Sem restrição (qualquer coach)</option>
          {MOCK_COACHES.map(coach => (
            <option key={coach.id} value={coach.id}>
              {coach.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Se selecionares, o sistema evita sobreposições deste coach
        </p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Local / Sala
          </div>
        </label>
        <select
          value={resources.location || ''}
          onChange={(e) => updateResources({ location: e.target.value || undefined })}
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
        >
          <option value="">Sem restrição (qualquer local)</option>
          {MOCK_LOCATIONS.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Se selecionares, o sistema evita sobrelotação deste espaço
        </p>
      </div>

      {/* Equipment (Multi-select) */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Equipamento Necessário
          </div>
        </label>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <p className="text-xs text-slate-500 mb-2">
            Seleciona equipamento específico (opcional)
          </p>
          <div className="flex flex-wrap gap-2">
            {['Rack', 'Barbell', 'Kettlebells', 'TRX', 'Bicicleta', 'Remo'].map(item => {
              const isSelected = resources.equipment?.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => {
                    const current = resources.equipment || [];
                    updateResources({
                      equipment: isSelected
                        ? current.filter(e => e !== item)
                        : [...current, item]
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-violet-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-violet-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Constraints (Rules) */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Regras e Restrições
          </h3>
        </div>

        <div className="space-y-3">
          {/* No Consecutive Days */}
          <label className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all cursor-pointer">
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                Não marcar dias consecutivos
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Deixa pelo menos 1 dia de descanso entre sessões do mesmo atleta
              </p>
            </div>
            <input
              type="checkbox"
              checked={isConstraintActive('no_consecutive_days')}
              onChange={() => toggleConstraint('no_consecutive_days')}
              className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500/30"
            />
          </label>

          {/* Avoid Competition Days */}
          <label className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all cursor-pointer">
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                Evitar dias de competição
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Não agendar no fim de semana (sábado/domingo)
              </p>
            </div>
            <input
              type="checkbox"
              checked={isConstraintActive('avoid_competition_days')}
              onChange={() => toggleConstraint('avoid_competition_days')}
              className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500/30"
            />
          </label>

          {/* Quiet Hours */}
          <label className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-all cursor-pointer">
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                Respeitar horário de descanso
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Não enviar notificações antes das 9h ou depois das 21h
              </p>
            </div>
            <input
              type="checkbox"
              checked={isConstraintActive('respect_quiet_hours')}
              onChange={() => toggleConstraint('respect_quiet_hours')}
              className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500/30"
            />
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <p className="text-xs font-semibold text-sky-900 mb-2">
          📋 Resumo de Recursos:
        </p>
        <div className="space-y-1 text-xs text-sky-800">
          <p>
            • Coach: {resources.coach ? MOCK_COACHES.find(c => c.id === resources.coach)?.name : 'Qualquer'}
          </p>
          <p>
            • Local: {resources.location || 'Qualquer'}
          </p>
          <p>
            • Equipamento: {resources.equipment?.length || 0} item(ns)
          </p>
          <p>
            • Regras ativas: {resources.constraints.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
