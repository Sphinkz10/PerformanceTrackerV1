/**
 * WIZARD STEP 2: CONDITIONS BUILDER
 * When/how to analyze the data?
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Zap,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import type { TriggerConfig, TriggerType, Condition, ConditionGroup, ConditionOperator, ConditionLogic, AnyMetricSource } from '@/types/wizard';

interface Step2ConditionsBuilderProps {
  source: AnyMetricSource;
  trigger: TriggerConfig;
  onTriggerChange: (trigger: TriggerConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const TRIGGER_TYPES: Array<{ value: TriggerType; label: string; description: string; icon: any }> = [
  {
    value: 'always',
    label: 'Sempre (sem condição)',
    description: 'Calcular sempre que houver dados',
    icon: Zap,
  },
  {
    value: 'value-threshold',
    label: 'Quando valor está acima/abaixo de X',
    description: 'Ex: HRV < 60ms',
    icon: BarChart3,
  },
  {
    value: 'change-threshold',
    label: 'Quando muda mais de X%',
    description: 'Ex: Load aumenta +20%',
    icon: TrendingUp,
  },
  {
    value: 'outside-average',
    label: 'Quando fora da média (7 dias)',
    description: 'Detecta outliers automaticamente',
    icon: AlertCircle,
  },
  {
    value: 'complex',
    label: 'Combinação (múltiplas condições)',
    description: 'IF X AND Y THEN...',
    icon: Sparkles,
  },
];

const OPERATORS: Array<{ value: ConditionOperator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '==', label: '=' },
  { value: '!=', label: '≠' },
];

export function Step2ConditionsBuilder({
  source,
  trigger,
  onTriggerChange,
  onNext,
  onBack,
}: Step2ConditionsBuilderProps) {
  const [selectedType, setSelectedType] = useState<TriggerType>(trigger.type);

  const handleTypeSelect = (type: TriggerType) => {
    setSelectedType(type);
    
    // Initialize trigger config based on type
    if (type === 'always') {
      onTriggerChange({
        type: 'always',
      });
    } else if (type === 'outside-average') {
      onTriggerChange({
        type: 'outside-average',
        consecutiveDays: 1,
      });
    } else {
      // Keep existing or create empty
      onTriggerChange({
        ...trigger,
        type,
      });
    }
  };

  const canProceed = trigger.type === 'always' || 
                     trigger.type === 'outside-average' ||
                     (trigger.conditionGroup && trigger.conditionGroup.conditions.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900">
              Criar Nova Métrica
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Step 2 de 4: Quando/como analisar?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full ${
                step <= 2 ? 'bg-sky-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Source Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{source.icon}</div>
            <div>
              <p className="text-xs text-slate-500">Fonte selecionada:</p>
              <p className="text-sm text-slate-900">{source.name}</p>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-purple-900 mb-1">
                AI Suggestion
              </h4>
              <p className="text-xs text-purple-700">
                Para a maioria dos casos, <strong>"Sempre"</strong> é a melhor opção. 
                Use condições apenas se quiser filtrar dados específicos.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trigger Type Selection */}
        <div>
          <h3 className="text-slate-900 mb-3">
            Quero analisar QUANDO acontece:
          </h3>

          <div className="space-y-2">
            {TRIGGER_TYPES.map((triggerType, index) => {
              const Icon = triggerType.icon;
              const isSelected = selectedType === triggerType.value;

              return (
                <motion.button
                  key={triggerType.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => handleTypeSelect(triggerType.value)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-2 border-sky-300 shadow-md'
                      : 'bg-white border border-slate-200 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-br from-sky-500 to-sky-600'
                        : 'bg-slate-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm ${isSelected ? 'text-sky-900' : 'text-slate-900'}`}>
                          {triggerType.label}
                        </p>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-sky-500 flex items-center justify-center">
                            <ChevronRight className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {triggerType.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detailed Configuration based on selected type */}
        <AnimatePresence mode="wait">
          {selectedType !== 'always' && (
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
            >
              {selectedType === 'value-threshold' && (
                <ValueThresholdConfig
                  source={source}
                  trigger={trigger}
                  onTriggerChange={onTriggerChange}
                />
              )}

              {selectedType === 'change-threshold' && (
                <ChangeThresholdConfig
                  trigger={trigger}
                  onTriggerChange={onTriggerChange}
                />
              )}

              {selectedType === 'outside-average' && (
                <OutsideAverageConfig
                  trigger={trigger}
                  onTriggerChange={onTriggerChange}
                />
              )}

              {selectedType === 'complex' && (
                <ComplexConditionsConfig
                  trigger={trigger}
                  onTriggerChange={onTriggerChange}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview */}
        {canProceed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200"
          >
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-blue-900 mb-1">💡 Preview:</h4>
                <p className="text-xs text-blue-700">
                  {getPreviewText(selectedType, trigger, source)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </motion.button>

          <motion.button
            whileHover={canProceed ? { scale: 1.05 } : {}}
            whileTap={canProceed ? { scale: 0.95 } : {}}
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-3 text-sm rounded-xl transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS FOR EACH TRIGGER TYPE
// ============================================================

interface ConfigProps {
  trigger: TriggerConfig;
  onTriggerChange: (trigger: TriggerConfig) => void;
  source?: AnyMetricSource;
}

function ValueThresholdConfig({ source, trigger, onTriggerChange }: ConfigProps) {
  const [operator, setOperator] = useState<ConditionOperator>(
    trigger.conditionGroup?.conditions[0]?.operator || '>'
  );
  const [value, setValue] = useState(
    trigger.conditionGroup?.conditions[0]?.value?.toString() || ''
  );
  const [consecutiveDays, setConsecutiveDays] = useState(
    trigger.consecutiveDays || 1
  );

  const handleApply = () => {
    if (!value) return;

    const condition: Condition = {
      id: 'condition-1',
      field: source?.name || 'value',
      operator,
      value: parseFloat(value),
    };

    onTriggerChange({
      type: 'value-threshold',
      conditionGroup: {
        logic: 'AND',
        conditions: [condition],
      },
      consecutiveDays,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm text-emerald-900">
        Configurar limite de valor:
      </h4>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="block text-xs text-slate-600 mb-2">Operador:</label>
          <select
            value={operator}
            onChange={(e) => {
              setOperator(e.target.value as ConditionOperator);
              handleApply();
            }}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {OPERATORS.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-slate-600 mb-2">Valor:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value) handleApply();
            }}
            placeholder="Ex: 60"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">
          Por quantos dias consecutivos?
        </label>
        <input
          type="number"
          value={consecutiveDays}
          onChange={(e) => {
            setConsecutiveDays(parseInt(e.target.value) || 1);
            handleApply();
          }}
          min="1"
          max="30"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <p className="text-xs text-slate-500 mt-1">
          Mínimo: 1 dia (imediato) | Máximo: 30 dias
        </p>
      </div>
    </div>
  );
}

function ChangeThresholdConfig({ trigger, onTriggerChange }: ConfigProps) {
  const [changePercent, setChangePercent] = useState('20');

  const handleApply = () => {
    if (!changePercent) return;

    onTriggerChange({
      type: 'change-threshold',
      conditionGroup: {
        logic: 'AND',
        conditions: [{
          id: 'change-1',
          field: 'change_percentage',
          operator: '>',
          value: parseFloat(changePercent),
        }],
      },
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm text-emerald-900">
        Detectar mudança significativa:
      </h4>

      <div>
        <label className="block text-xs text-slate-600 mb-2">
          Mudança maior que (%):
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={changePercent}
            onChange={(e) => {
              setChangePercent(e.target.value);
              if (e.target.value) handleApply();
            }}
            placeholder="20"
            min="1"
            max="100"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <span className="text-sm text-slate-600">%</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Comparação vs última semana
        </p>
      </div>
    </div>
  );
}

function OutsideAverageConfig({ trigger, onTriggerChange }: ConfigProps) {
  const [consecutiveDays, setConsecutiveDays] = useState(
    trigger.consecutiveDays || 1
  );

  const handleChange = (days: number) => {
    setConsecutiveDays(days);
    onTriggerChange({
      type: 'outside-average',
      consecutiveDays: days,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm text-emerald-900">
        Detectar valores fora da média:
      </h4>

      <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-200">
        <p className="text-xs text-emerald-800">
          ✓ Calcula média dos últimos 7 dias automaticamente
          <br />
          ✓ Detecta valores fora de ±2 desvios padrão
        </p>
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">
          Alertar após quantos dias consecutivos?
        </label>
        <input
          type="number"
          value={consecutiveDays}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          min="1"
          max="7"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>
    </div>
  );
}

function ComplexConditionsConfig({ trigger, onTriggerChange }: ConfigProps) {
  const [conditions, setConditions] = useState<Condition[]>(
    trigger.conditionGroup?.conditions || []
  );
  const [logic, setLogic] = useState<ConditionLogic>(
    trigger.conditionGroup?.logic || 'AND'
  );

  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition-${conditions.length + 1}`,
      field: '',
      operator: '>',
      value: '',
    };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    updateTrigger(newConditions, logic);
  };

  const removeCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);
    updateTrigger(newConditions, logic);
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setConditions(newConditions);
    updateTrigger(newConditions, logic);
  };

  const updateTrigger = (conds: Condition[], logicOp: ConditionLogic) => {
    if (conds.length === 0) return;

    onTriggerChange({
      type: 'complex',
      conditionGroup: {
        logic: logicOp,
        conditions: conds,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-emerald-900">
          Condições múltiplas:
        </h4>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600">Lógica:</span>
          <button
            onClick={() => {
              setLogic('AND');
              updateTrigger(conditions, 'AND');
            }}
            className={`px-3 py-1 rounded ${
              logic === 'AND'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            AND
          </button>
          <button
            onClick={() => {
              setLogic('OR');
              updateTrigger(conditions, 'OR');
            }}
            className={`px-3 py-1 rounded ${
              logic === 'OR'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            OR
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="p-3 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-500">IF:</span>
              {index > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  {logic}
                </span>
              )}
            </div>

            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={condition.field}
                onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                placeholder="Campo (ex: HRV)"
                className="col-span-4 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
              <select
                value={condition.operator}
                onChange={(e) => updateCondition(condition.id, { operator: e.target.value as ConditionOperator })}
                className="col-span-2 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                {OPERATORS.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                placeholder="Valor"
                className="col-span-4 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
              <button
                onClick={() => removeCondition(condition.id)}
                className="col-span-2 flex items-center justify-center text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCondition}
        className="w-full py-2 text-xs rounded-lg border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-3 w-3" />
        Adicionar Condição
      </button>
    </div>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getPreviewText(type: TriggerType, trigger: TriggerConfig, source: AnyMetricSource): string {
  switch (type) {
    case 'always':
      return `Esta métrica será calculada SEMPRE que houver dados de "${source.name}".`;
    
    case 'value-threshold':
      const cond = trigger.conditionGroup?.conditions[0];
      if (!cond) return '';
      const days = trigger.consecutiveDays || 1;
      return `Será calculada quando ${source.name} ${cond.operator} ${cond.value}${days > 1 ? ` por ${days} dias consecutivos` : ''}.`;
    
    case 'change-threshold':
      const changeCond = trigger.conditionGroup?.conditions[0];
      if (!changeCond) return '';
      return `Será calculada quando ${source.name} mudar mais de ${changeCond.value}% vs última semana.`;
    
    case 'outside-average':
      const outsideDays = trigger.consecutiveDays || 1;
      return `Será calculada quando ${source.name} estiver fora da média (7 dias)${outsideDays > 1 ? ` por ${outsideDays} dias consecutivos` : ''}.`;
    
    case 'complex':
      const condCount = trigger.conditionGroup?.conditions.length || 0;
      const logicText = trigger.conditionGroup?.logic || 'AND';
      return `Será calculada quando ${condCount} condições forem satisfeitas (lógica: ${logicText}).`;
    
    default:
      return '';
  }
}
