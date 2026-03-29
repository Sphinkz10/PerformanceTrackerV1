/**
 * RULE BUILDER - Visual IF-THEN Builder
 * Drag & drop style, real-time preview
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Flag,
  Ban,
  Download,
  Webhook,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { Metric } from '@/types/metrics';
import type { AutomationRule, AutomationAction } from './AutomationMain';

interface RuleBuilderProps {
  rule: AutomationRule | null;
  metrics: Metric[];
  onSave: (rule: AutomationRule) => void;
  onCancel: () => void;
}

const TRIGGER_TYPES = [
  {
    value: 'data' as const,
    label: 'Data-Based',
    icon: TrendingUp,
    description: 'Trigger when metric value meets condition',
    color: 'emerald',
  },
  {
    value: 'time' as const,
    label: 'Time-Based',
    icon: Clock,
    description: 'Trigger at scheduled times',
    color: 'sky',
  },
  {
    value: 'event' as const,
    label: 'Event-Based',
    icon: Zap,
    description: 'Trigger on system events',
    color: 'amber',
  },
];

const CONDITIONS = [
  { value: 'above' as const, label: 'Above', icon: TrendingUp, symbol: '>' },
  { value: 'below' as const, label: 'Below', icon: TrendingDown, symbol: '<' },
  { value: 'equals' as const, label: 'Equals', icon: Minus, symbol: '=' },
  { value: 'change' as const, label: 'Change by', icon: TrendingUp, symbol: 'Δ' },
  { value: 'outside_range' as const, label: 'Outside Range', icon: AlertCircle, symbol: '⚠' },
];

const ACTION_TYPES = [
  {
    value: 'notification' as const,
    label: 'Send Notification',
    icon: Bell,
    description: 'Email, Push, Slack, SMS',
    color: 'sky',
  },
  {
    value: 'athlete_action' as const,
    label: 'Athlete Action',
    icon: Flag,
    description: 'Flag, Message, Block Training',
    color: 'amber',
  },
  {
    value: 'data_action' as const,
    label: 'Data Action',
    icon: Download,
    description: 'Snapshot, Export, Webhook',
    color: 'violet',
  },
  {
    value: 'smart_action' as const,
    label: 'Smart Action (AI)',
    icon: Sparkles,
    description: 'Auto-adjust, Predict, Suggest',
    color: 'purple',
  },
];

export function RuleBuilder({ rule, metrics, onSave, onCancel }: RuleBuilderProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AutomationRule>>({
    id: rule?.id || `rule-${Date.now()}`,
    name: rule?.name || '',
    description: rule?.description || '',
    isActive: rule?.isActive ?? true,
    triggerType: rule?.triggerType || 'data',
    triggerConfig: rule?.triggerConfig || {},
    actions: rule?.actions || [],
    stats: rule?.stats || {
      triggerCount: 0,
      successRate: 100,
      falsePositives: 0,
    },
    createdAt: rule?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Nome obrigatório';
    if (!formData.triggerType) newErrors.triggerType = 'Tipo de trigger obrigatório';
    if (formData.actions?.length === 0) newErrors.actions = 'Adiciona pelo menos 1 ação';

    // Trigger-specific validation
    if (formData.triggerType === 'data') {
      if (!formData.triggerConfig?.metricId) newErrors.metric = 'Seleciona uma métrica';
      if (!formData.triggerConfig?.condition) newErrors.condition = 'Seleciona uma condição';
      if (formData.triggerConfig?.value === undefined) newErrors.value = 'Define um valor';
    } else if (formData.triggerType === 'time') {
      if (!formData.triggerConfig?.schedule) newErrors.schedule = 'Define um schedule';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      alert('❌ Preenche todos os campos obrigatórios');
      return;
    }

    onSave(formData as AutomationRule);
  };

  const addAction = (type: AutomationAction['type']) => {
    const newAction: AutomationAction = {
      id: `action-${Date.now()}`,
      type,
      config: {},
    };

    setFormData((prev) => ({
      ...prev,
      actions: [...(prev.actions || []), newAction],
    }));
  };

  const removeAction = (actionId: string) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions?.filter((a) => a.id !== actionId) || [],
    }));
  };

  const updateAction = (actionId: string, config: Partial<AutomationAction['config']>) => {
    setFormData((prev) => ({
      ...prev,
      actions:
        prev.actions?.map((a) => (a.id === actionId ? { ...a, config: { ...a.config, ...config } } : a)) || [],
    }));
  };

  const selectedMetric = metrics.find((m) => m.id === formData.triggerConfig?.metricId);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900">
              {rule ? 'Edit Rule' : 'New Automation Rule'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Cria regras IF-THEN para automatizar ações
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
            >
              <X className="h-4 w-4" />
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Rule
            </motion.button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">1. Basic Info</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Overtraining Alert"
                className={`w-full px-4 py-2 text-sm border-2 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                  errors.name ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreve o que esta regra faz..."
                rows={3}
                className="w-full px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">Ativar regra imediatamente</span>
              </label>
            </div>
          </div>
        </div>

        {/* Trigger Configuration */}
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-amber-500" />
            2. IF (Trigger)
          </h3>

          {/* Trigger Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {TRIGGER_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.triggerType === type.value;

              return (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      triggerType: type.value,
                      triggerConfig: {},
                    }))
                  }
                  className={`p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? `bg-${type.color}-100 border-2 border-${type.color}-400`
                      : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 mb-2 ${
                      isSelected ? `text-${type.color}-600` : 'text-slate-400'
                    }`}
                  />
                  <h4 className={`font-semibold mb-1 ${isSelected ? `text-${type.color}-900` : 'text-slate-900'}`}>
                    {type.label}
                  </h4>
                  <p className="text-xs text-slate-600">{type.description}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Data-Based Config */}
          {formData.triggerType === 'data' && (
            <div className="space-y-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Metric *
                </label>
                <select
                  value={formData.triggerConfig?.metricId || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, metricId: e.target.value },
                    }))
                  }
                  className={`w-full px-4 py-2 text-sm border-2 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                    errors.metric ? 'border-red-300' : 'border-emerald-200'
                  }`}
                >
                  <option value="">Seleciona uma métrica...</option>
                  {metrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name} ({metric.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Condition *
                  </label>
                  <select
                    value={formData.triggerConfig?.condition || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        triggerConfig: { ...prev.triggerConfig, condition: e.target.value as any },
                      }))
                    }
                    className={`w-full px-4 py-2 text-sm border-2 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                      errors.condition ? 'border-red-300' : 'border-emerald-200'
                    }`}
                  >
                    <option value="">Seleciona...</option>
                    {CONDITIONS.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.symbol} {cond.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Value *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.triggerConfig?.value ?? ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          triggerConfig: { ...prev.triggerConfig, value: Number(e.target.value) },
                        }))
                      }
                      placeholder="Ex: 60"
                      className={`w-full px-4 py-2 text-sm border-2 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                        errors.value ? 'border-red-300' : 'border-emerald-200'
                      }`}
                    />
                    {selectedMetric?.unit && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {selectedMetric.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Consecutive Days (opcional)
                </label>
                <input
                  type="number"
                  value={formData.triggerConfig?.consecutiveDays ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      triggerConfig: {
                        ...prev.triggerConfig,
                        consecutiveDays: e.target.value ? Number(e.target.value) : undefined,
                      },
                    }))
                  }
                  placeholder="Ex: 3"
                  className="w-full px-4 py-2 text-sm border-2 border-emerald-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Trigger só dispara se a condição se mantiver por X dias consecutivos
                </p>
              </div>

              {/* Preview */}
              {formData.triggerConfig?.metricId && formData.triggerConfig?.condition && formData.triggerConfig?.value !== undefined && (
                <div className="p-4 rounded-xl bg-white border border-emerald-300">
                  <p className="text-sm font-medium text-slate-700 mb-2">📋 Preview:</p>
                  <p className="text-sm text-slate-900">
                    <strong>IF</strong> {selectedMetric?.name}{' '}
                    {CONDITIONS.find((c) => c.value === formData.triggerConfig?.condition)?.label.toLowerCase()}{' '}
                    <strong>{formData.triggerConfig?.value} {selectedMetric?.unit || ''}</strong>
                    {formData.triggerConfig?.consecutiveDays && (
                      <> por <strong>{formData.triggerConfig.consecutiveDays} dias consecutivos</strong></>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Time-Based Config */}
          {formData.triggerType === 'time' && (
            <div className="space-y-4 p-4 rounded-xl bg-sky-50 border border-sky-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Schedule (Cron Expression) *
                </label>
                <input
                  type="text"
                  value={formData.triggerConfig?.schedule || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, schedule: e.target.value },
                    }))
                  }
                  placeholder="Ex: 0 9 * * 1 (Every Monday at 9AM)"
                  className="w-full px-4 py-2 text-sm border-2 border-sky-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Formato: minuto hora dia mês dia-da-semana
                </p>
              </div>

              {/* Common presets */}
              <div>
                <p className="text-xs font-medium text-slate-700 mb-2">Presets:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Daily 9AM', value: '0 9 * * *' },
                    { label: 'Weekly Monday', value: '0 9 * * 1' },
                    { label: 'Monthly 1st', value: '0 9 1 * *' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          triggerConfig: { ...prev.triggerConfig, schedule: preset.value },
                        }))
                      }
                      className="px-3 py-1.5 text-xs rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Event-Based Config */}
          {formData.triggerType === 'event' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-700">
                🚧 Event-based triggers coming soon! Stay tuned.
              </p>
            </div>
          )}
        </div>

        {/* Actions Configuration */}
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            3. THEN (Actions)
          </h3>

          {/* Action Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {ACTION_TYPES.map((type) => {
              const Icon = type.icon;

              return (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addAction(type.value)}
                  className={`p-4 rounded-xl text-left bg-${type.color}-50 border-2 border-${type.color}-200 hover:border-${type.color}-400 transition-all`}
                >
                  <Icon className={`h-5 w-5 mb-2 text-${type.color}-600`} />
                  <h4 className={`text-sm font-semibold mb-1 text-${type.color}-900`}>
                    {type.label}
                  </h4>
                  <p className="text-xs text-slate-600">{type.description}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Actions List */}
          {formData.actions && formData.actions.length > 0 ? (
            <div className="space-y-3">
              {formData.actions.map((action, index) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  index={index}
                  onUpdate={(config) => updateAction(action.id, config)}
                  onRemove={() => removeAction(action.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 text-center">
              <p className="text-sm text-slate-500">
                Nenhuma ação adicionada. Clica num tipo acima para adicionar.
              </p>
            </div>
          )}

          {errors.actions && <p className="text-xs text-red-600 mt-2">{errors.actions}</p>}
        </div>

        {/* Save Button (bottom) */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-3 text-sm rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-6 py-3 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            <Save className="h-4 w-4 inline mr-2" />
            Save Rule
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ACTION CARD Component
// ============================================================

function ActionCard({
  action,
  index,
  onUpdate,
  onRemove,
}: {
  action: AutomationAction;
  index: number;
  onUpdate: (config: Partial<AutomationAction['config']>) => void;
  onRemove: () => void;
}) {
  const actionType = ACTION_TYPES.find((t) => t.value === action.type);
  const Icon = actionType?.icon || Bell;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl bg-${actionType?.color}-50 border-2 border-${actionType?.color}-200`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 text-${actionType?.color}-600`} />
          <h4 className="font-semibold text-slate-900">{actionType?.label}</h4>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Notification Config */}
      {action.type === 'notification' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Channel
            </label>
            <select
              value={action.config.channel || 'email'}
              onChange={(e) => onUpdate({ channel: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white"
            >
              <option value="email">📧 Email</option>
              <option value="push">📱 Push Notification</option>
              <option value="slack">💬 Slack</option>
              <option value="sms">📲 SMS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Message
            </label>
            <textarea
              value={action.config.message || ''}
              onChange={(e) => onUpdate({ message: e.target.value })}
              placeholder="Use {athlete_name}, {metric_name}, {value}..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white resize-none"
            />
          </div>
        </div>
      )}

      {/* Athlete Action Config */}
      {action.type === 'athlete_action' && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Action
          </label>
          <select
            value={action.config.athleteAction || 'flag'}
            onChange={(e) => onUpdate({ athleteAction: e.target.value as any })}
            className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
          >
            <option value="flag">🚩 Flag Athlete</option>
            <option value="message">💬 Send Message</option>
            <option value="block_training">🚫 Block Training</option>
            <option value="reduce_load">📉 Reduce Load</option>
          </select>
        </div>
      )}

      {/* Data Action Config */}
      {action.type === 'data_action' && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Action
          </label>
          <select
            value={action.config.dataAction || 'snapshot'}
            onChange={(e) => onUpdate({ dataAction: e.target.value as any })}
            className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white"
          >
            <option value="snapshot">📸 Take Snapshot</option>
            <option value="export">📥 Export Data</option>
            <option value="webhook">🔗 Call Webhook</option>
          </select>

          {action.config.dataAction === 'webhook' && (
            <input
              type="url"
              value={action.config.webhookUrl || ''}
              onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
              placeholder="https://your-webhook-url.com"
              className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white mt-2"
            />
          )}
        </div>
      )}

      {/* Smart Action Config */}
      {action.type === 'smart_action' && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            AI Action
          </label>
          <select
            value={action.config.smartAction || 'auto_adjust_load'}
            onChange={(e) => onUpdate({ smartAction: e.target.value as any })}
            className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg bg-white"
          >
            <option value="auto_adjust_load">⚙️ Auto-Adjust Load</option>
            <option value="suggest_recovery">💤 Suggest Recovery</option>
            <option value="predict_injury">⚠️ Predict Injury Risk</option>
          </select>
        </div>
      )}
    </motion.div>
  );
}