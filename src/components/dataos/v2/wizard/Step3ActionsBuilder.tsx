/**
 * WIZARD STEP 3: ACTIONS BUILDER
 * What to do with the data?
 * 
 * REAPROVEITANDO: CreateMetricModal Step 2 & 3 logic
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Info,
  Sparkles,
  BarChart3,
  Zap,
  Bell,
  Eye,
  Settings,
  TrendingUp,
  Calculator
} from 'lucide-react';
import type { 
  AnyAction, 
  CalculateStatisticAction,
  TransformAction,
  CreateAlertAction,
  VisualizeAction,
  StatisticType,
  TransformationType,
  ChartType,
  AnyMetricSource,
  TriggerConfig
} from '@/types/wizard';
import type { 
  MetricAggregationMethod, 
  MetricBaselineMethod 
} from '@/types/metrics';

// REAPROVEITANDO do CreateMetricModal.tsx
const AGGREGATION_METHODS: { value: MetricAggregationMethod; label: string; description: string }[] = [
  { value: 'latest', label: 'Latest', description: 'Use most recent value' },
  { value: 'average', label: 'Average', description: 'Average all values' },
  { value: 'sum', label: 'Sum', description: 'Sum all values (for load/volume)' },
  { value: 'max', label: 'Maximum', description: 'Maximum value (for RPE, HRV)' },
  { value: 'min', label: 'Minimum', description: 'Minimum value (for RHR)' },
];

const BASELINE_METHODS: { value: MetricBaselineMethod; label: string; description: string }[] = [
  { value: 'rolling-average', label: 'Rolling Average', description: 'Auto-calculate from recent data' },
  { value: 'percentile', label: 'Median (50th percentile)', description: 'Use median value' },
  { value: 'manual', label: 'Manual', description: 'Set baseline manually' },
];

const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
  { value: 'line', label: 'Line Chart', icon: '📈' },
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'area', label: 'Area Chart', icon: '📉' },
  { value: 'gauge', label: 'Gauge', icon: '⏱️' },
  { value: 'scatter', label: 'Scatter', icon: '🔵' },
];

interface Step3ActionsBuilderProps {
  source: AnyMetricSource;
  trigger: TriggerConfig;
  actions: AnyAction[];
  onActionsChange: (actions: AnyAction[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3ActionsBuilder({
  source,
  trigger,
  actions,
  onActionsChange,
  onNext,
  onBack,
}: Step3ActionsBuilderProps) {
  const [selectedActionType, setSelectedActionType] = useState<'calculate' | 'transform' | 'alert' | 'visualize'>('calculate');

  // Extract existing actions
  const calculateAction = actions.find(a => a.type === 'calculate-statistic') as CalculateStatisticAction | undefined;
  const transformAction = actions.find(a => a.type === 'transform') as TransformAction | undefined;
  const alertAction = actions.find(a => a.type === 'create-alert') as CreateAlertAction | undefined;
  const visualizeAction = actions.find(a => a.type === 'visualize') as VisualizeAction | undefined;

  const updateAction = (action: AnyAction) => {
    const filtered = actions.filter(a => a.type !== action.type);
    onActionsChange([...filtered, action]);
  };

  const removeAction = (type: string) => {
    onActionsChange(actions.filter(a => a.type !== type));
  };

  const canProceed = actions.length > 0;

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
              Step 3 de 4: O que fazer com os dados?
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full ${
                step <= 3 ? 'bg-sky-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Source & Trigger Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Fonte:</p>
            <p className="text-sm text-slate-900">{source.name}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Trigger:</p>
            <p className="text-sm text-slate-900">{trigger.type === 'always' ? 'Sempre' : 'Condicional'}</p>
          </div>
        </div>

        {/* AI Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-purple-900 mb-1">
                AI Recommendation
              </h4>
              <p className="text-xs text-purple-700">
                Recomendamos começar com <strong>Calcular Estatística</strong> (ex: média, soma). 
                Podes adicionar múltiplas ações!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Type Tabs */}
        <div>
          <h3 className="text-slate-900 mb-3">
            Ações disponíveis:
          </h3>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { type: 'calculate' as const, label: 'Calcular', icon: Calculator, color: 'emerald' },
              { type: 'transform' as const, label: 'Transformar', icon: Zap, color: 'amber' },
              { type: 'alert' as const, label: 'Alertas', icon: Bell, color: 'red' },
              { type: 'visualize' as const, label: 'Visualizar', icon: Eye, color: 'purple' },
            ].map((actionType) => {
              const Icon = actionType.icon;
              const isSelected = selectedActionType === actionType.type;
              const hasAction = actions.some(a => 
                a.type === `${actionType.type === 'calculate' ? 'calculate-statistic' : actionType.type === 'alert' ? 'create-alert' : actionType.type}`
              );

              return (
                <motion.button
                  key={actionType.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedActionType(actionType.type)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap relative ${
                    isSelected
                      ? `bg-gradient-to-r from-${actionType.color}-500 to-${actionType.color}-600 text-white shadow-lg`
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {actionType.label}
                  {hasAction && (
                    <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                      isSelected ? 'bg-white' : `bg-${actionType.color}-500`
                    }`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Builders */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedActionType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
          >
            {selectedActionType === 'calculate' && (
              <CalculateBuilder
                currentAction={calculateAction}
                onSave={(action) => updateAction(action)}
                onRemove={() => removeAction('calculate-statistic')}
              />
            )}

            {selectedActionType === 'transform' && (
              <TransformBuilder
                currentAction={transformAction}
                onSave={(action) => updateAction(action)}
                onRemove={() => removeAction('transform')}
              />
            )}

            {selectedActionType === 'alert' && (
              <AlertBuilder
                currentAction={alertAction}
                onSave={(action) => updateAction(action)}
                onRemove={() => removeAction('create-alert')}
              />
            )}

            {selectedActionType === 'visualize' && (
              <VisualizeBuilder
                currentAction={visualizeAction}
                onSave={(action) => updateAction(action)}
                onRemove={() => removeAction('visualize')}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Active Actions Summary */}
        {actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200"
          >
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-blue-900 mb-2">✓ Ações configuradas ({actions.length}):</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {actions.map((action, i) => (
                    <li key={i}>• {getActionSummary(action)}</li>
                  ))}
                </ul>
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
// ACTION BUILDERS (Sub-components)
// ============================================================

interface BuilderProps<T> {
  currentAction: T | undefined;
  onSave: (action: T) => void;
  onRemove: () => void;
}

// CALCULATE STATISTIC BUILDER
function CalculateBuilder({ currentAction, onSave, onRemove }: BuilderProps<CalculateStatisticAction>) {
  const [statistic, setStatistic] = useState<StatisticType>(currentAction?.statistic || 'average');
  const [periodDays, setPeriodDays] = useState(currentAction?.periodDays || 7);
  const [baselineMethod, setBaselineMethod] = useState(currentAction?.baselineMethod || 'rolling-average');

  const handleApply = () => {
    onSave({
      type: 'calculate-statistic',
      statistic,
      periodDays,
      baselineMethod,
      baselinePeriodDays: 28,
      outputType: 'absolute',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-emerald-900 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Calcular Estatística
        </h4>
        {currentAction && (
          <button
            onClick={onRemove}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Remover
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">Estatística:</label>
        <select
          value={statistic}
          onChange={(e) => {
            setStatistic(e.target.value as StatisticType);
            handleApply();
          }}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="average">Média (Average)</option>
          <option value="sum">Soma (Sum)</option>
          <option value="max">Máximo</option>
          <option value="min">Mínimo</option>
          <option value="trend">Tendência (Slope)</option>
          <option value="vs-baseline">vs Baseline</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">
          Período de análise (dias):
        </label>
        <input
          type="number"
          value={periodDays}
          onChange={(e) => {
            setPeriodDays(parseInt(e.target.value) || 7);
            handleApply();
          }}
          min="1"
          max="90"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      {statistic === 'vs-baseline' && (
        <div>
          <label className="block text-xs text-slate-600 mb-2">Método baseline:</label>
          <select
            value={baselineMethod}
            onChange={(e) => {
              setBaselineMethod(e.target.value as MetricBaselineMethod);
              handleApply();
            }}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {BASELINE_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleApply}
        className="w-full py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
      >
        ✓ Aplicar
      </button>
    </div>
  );
}

// TRANSFORM BUILDER
function TransformBuilder({ currentAction, onSave, onRemove }: BuilderProps<TransformAction>) {
  const [transformation, setTransformation] = useState<TransformationType>(
    currentAction?.transformation || 'normalize'
  );

  const handleApply = () => {
    onSave({
      type: 'transform',
      transformation,
      targetScale: transformation === 'normalize' ? [0, 100] : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-amber-900 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Transformar Dados
        </h4>
        {currentAction && (
          <button onClick={onRemove} className="text-xs text-red-600 hover:text-red-700">
            Remover
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">Transformação:</label>
        <select
          value={transformation}
          onChange={(e) => {
            setTransformation(e.target.value as TransformationType);
            handleApply();
          }}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          <option value="normalize">Normalizar (0-100)</option>
          <option value="percentage-of-max">% do máximo</option>
          <option value="convert-units">Converter unidades</option>
          <option value="composite-score">Composite score</option>
          <option value="custom-formula">Fórmula custom</option>
        </select>
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
      >
        ✓ Aplicar
      </button>
    </div>
  );
}

// ALERT BUILDER
function AlertBuilder({ currentAction, onSave, onRemove }: BuilderProps<CreateAlertAction>) {
  const [highThreshold, setHighThreshold] = useState(currentAction?.highThreshold?.toString() || '');
  const [lowThreshold, setLowThreshold] = useState(currentAction?.lowThreshold?.toString() || '');
  const [notifyEmail, setNotifyEmail] = useState(currentAction?.notifyEmail || '');
  const [notifyPush, setNotifyPush] = useState(currentAction?.notifyPush || false);

  const handleApply = () => {
    onSave({
      type: 'create-alert',
      highThreshold: highThreshold ? parseFloat(highThreshold) : undefined,
      lowThreshold: lowThreshold ? parseFloat(lowThreshold) : undefined,
      notifyEmail: notifyEmail || undefined,
      notifyPush,
      autoSuggestAction: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-red-900 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Configurar Alertas
        </h4>
        {currentAction && (
          <button onClick={onRemove} className="text-xs text-red-600 hover:text-red-700">
            Remover
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-600 mb-2">Limite alto:</label>
          <input
            type="number"
            value={highThreshold}
            onChange={(e) => setHighThreshold(e.target.value)}
            placeholder="Ex: 100"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-2">Limite baixo:</label>
          <input
            type="number"
            value={lowThreshold}
            onChange={(e) => setLowThreshold(e.target.value)}
            placeholder="Ex: 60"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">Email para notificar:</label>
        <input
          type="email"
          value={notifyEmail}
          onChange={(e) => setNotifyEmail(e.target.value)}
          placeholder="coach@example.com"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={notifyPush}
          onChange={(e) => setNotifyPush(e.target.checked)}
          className="h-4 w-4 text-red-600 rounded"
        />
        <span className="text-sm text-slate-700">Push notification (mobile)</span>
      </label>

      <button
        onClick={handleApply}
        className="w-full py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        ✓ Aplicar
      </button>
    </div>
  );
}

// VISUALIZE BUILDER
function VisualizeBuilder({ currentAction, onSave, onRemove }: BuilderProps<VisualizeAction>) {
  const [chartType, setChartType] = useState<ChartType>(currentAction?.chartType || 'line');
  const [showZones, setShowZones] = useState(currentAction?.showZones || false);

  const handleApply = () => {
    onSave({
      type: 'visualize',
      chartType,
      showBaseline: true,
      showZones,
      color: '#0ea5e9',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-purple-900 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Configurar Visualização
        </h4>
        {currentAction && (
          <button onClick={onRemove} className="text-xs text-red-600 hover:text-red-700">
            Remover
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-2">Tipo de gráfico:</label>
        <div className="grid grid-cols-2 gap-2">
          {CHART_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setChartType(type.value);
                handleApply();
              }}
              className={`p-3 rounded-lg text-sm transition-all ${
                chartType === type.value
                  ? 'bg-purple-100 border-2 border-purple-400'
                  : 'bg-white border border-slate-200 hover:border-purple-200'
              }`}
            >
              <span className="text-lg block mb-1">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showZones}
          onChange={(e) => {
            setShowZones(e.target.checked);
            handleApply();
          }}
          className="h-4 w-4 text-purple-600 rounded"
        />
        <span className="text-sm text-slate-700">Mostrar zonas (verde/amarelo/vermelho)</span>
      </label>

      <button
        onClick={handleApply}
        className="w-full py-2 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
      >
        ✓ Aplicar
      </button>
    </div>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getActionSummary(action: AnyAction): string {
  switch (action.type) {
    case 'calculate-statistic':
      return `Calcular ${action.statistic} (${action.periodDays} dias)`;
    case 'transform':
      return `Transformar: ${action.transformation}`;
    case 'create-alert':
      return `Alertas configurados (${action.notifyEmail ? 'email' : ''}${action.notifyPush ? ' + push' : ''})`;
    case 'visualize':
      return `Visualizar como ${action.chartType}`;
    default:
      return 'Ação desconhecida';
  }
}
