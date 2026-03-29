import { Plus } from 'lucide-react';
import { AvailabilityRule } from '@/types/scheduling';
import { RuleCard } from './RuleCard';

interface AvailabilitySelectorProps {
  type: 'can' | 'cannot';
  rules: AvailabilityRule[];
  onChange: (rules: AvailabilityRule[]) => void;
}

export function AvailabilitySelector({ type, rules, onChange }: AvailabilitySelectorProps) {
  const addRule = () => {
    const newRule: AvailabilityRule = {
      id: `rule-${Date.now()}`,
      type,
      days: [1, 2, 3, 4, 5], // Seg-Sex default
      timeRanges: [{ start: '18:00', end: '21:00' }],
      scope: 'global'
    };

    onChange([...rules, newRule]);
  };

  const updateRule = (ruleId: string, updated: Partial<AvailabilityRule>) => {
    onChange(
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updated } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    onChange(rules.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          index={index}
          onUpdate={(updated) => updateRule(rule.id, updated)}
          onDelete={() => deleteRule(rule.id)}
        />
      ))}

      <button
        onClick={addRule}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${
          type === 'can'
            ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
            : 'border-red-300 text-red-700 hover:bg-red-50'
        }`}
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">
          Adicionar {type === 'can' ? 'Janela' : 'Bloqueio'}
        </span>
      </button>

      {rules.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-2">
          Nenhuma {type === 'can' ? 'janela disponível' : 'bloqueio'} definido
        </p>
      )}
    </div>
  );
}
