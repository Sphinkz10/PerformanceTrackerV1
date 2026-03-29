/**
 * RULES LIST - Lista de regras ativas
 * Com toggle, edit, delete, test
 */

'use client';

import { motion } from 'motion/react';
import {
  Play,
  Pause,
  Edit2,
  Trash2,
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Calendar,
  Database,
} from 'lucide-react';
import type { AutomationRule } from './AutomationMain';

interface RulesListProps {
  rules: AutomationRule[];
  onToggle: (ruleId: string) => void;
  onEdit: (rule: AutomationRule) => void;
  onDelete: (ruleId: string) => void;
  onTest: (rule: AutomationRule) => void;
}

const TRIGGER_ICONS = {
  data: TrendingUp,
  time: Clock,
  event: Zap,
};

const TRIGGER_COLORS = {
  data: 'emerald',
  time: 'sky',
  event: 'amber',
};

export function RulesList({ rules, onToggle, onEdit, onDelete, onTest }: RulesListProps) {
  if (rules.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Zap className="h-10 w-10 text-amber-600" />
          </div>
          <h3 className="text-slate-900 mb-2">
            Nenhuma regra ainda
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Cria a tua primeira regra de automação para começar a automatizar ações baseadas em dados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-900">
            Rules ({rules.length})
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Gere as tuas regras de automação
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule, index) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            index={index}
            onToggle={() => onToggle(rule.id)}
            onEdit={() => onEdit(rule)}
            onDelete={() => onDelete(rule.id)}
            onTest={() => onTest(rule)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RULE CARD Component
// ============================================================

function RuleCard({
  rule,
  index,
  onToggle,
  onEdit,
  onDelete,
  onTest,
}: {
  rule: AutomationRule;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
}) {
  const TriggerIcon = TRIGGER_ICONS[rule.triggerType];
  const triggerColor = TRIGGER_COLORS[rule.triggerType];
  const successRate = rule.stats.successRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-2xl border-2 transition-all ${
        rule.isActive
          ? 'bg-white border-emerald-200 shadow-sm'
          : 'bg-slate-50 border-slate-200 opacity-75'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Left: Icon & Toggle */}
        <div className="shrink-0">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${triggerColor}-500 to-${triggerColor}-600 flex items-center justify-center mb-3`}
          >
            <TriggerIcon className="h-6 w-6 text-white" />
          </div>
          
          <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full transition-colors flex items-center ${
              rule.isActive ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                rule.isActive ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Middle: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 truncate mb-1">
                {rule.name}
              </h4>
              <p className="text-sm text-slate-600 line-clamp-2">
                {rule.description}
              </p>
            </div>

            {rule.isActive && (
              <span className="shrink-0 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                <Play className="h-3 w-3" />
                Active
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mt-4 mb-4">
            <div className="p-2 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Triggers</p>
              <p className="text-sm font-semibold text-slate-900">{rule.stats.triggerCount}</p>
            </div>

            <div className="p-2 rounded-lg bg-emerald-50">
              <p className="text-xs text-slate-500 mb-1">Success</p>
              <p className="text-sm font-semibold text-emerald-700">{successRate}%</p>
            </div>

            <div className="p-2 rounded-lg bg-red-50">
              <p className="text-xs text-slate-500 mb-1">False +</p>
              <p className="text-sm font-semibold text-red-700">{rule.stats.falsePositives}</p>
            </div>

            <div className="p-2 rounded-lg bg-sky-50">
              <p className="text-xs text-slate-500 mb-1">Actions</p>
              <p className="text-sm font-semibold text-sky-700">{rule.actions.length}</p>
            </div>
          </div>

          {/* Last Triggered */}
          {rule.stats.lastTriggered && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>
                Último trigger:{' '}
                {new Date(rule.stats.lastTriggered).toLocaleDateString('pt-PT', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* Testing Badge */}
          {rule.tested && rule.testResults && (
            <div className="mt-3 p-2 rounded-lg bg-violet-50 border border-violet-200">
              <div className="flex items-center gap-2 text-xs">
                <Activity className="h-3 w-3 text-violet-600" />
                <span className="font-medium text-violet-900">Tested</span>
                <span className="text-violet-700">
                  · Confidence: {rule.testResults.confidence}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTest}
            className="p-2 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
            title="Test Rule"
          >
            <Activity className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
            title="Edit Rule"
          >
            <Edit2 className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            title="Delete Rule"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Trigger & Actions Preview */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Trigger */}
          <div>
            <p className="font-medium text-slate-700 mb-2 flex items-center gap-1">
              <TriggerIcon className="h-3 w-3" />
              Trigger
            </p>
            <div className={`p-2 rounded-lg bg-${triggerColor}-50 border border-${triggerColor}-200`}>
              <p className={`text-${triggerColor}-900 font-medium`}>
                {rule.triggerType === 'data' && (
                  <>
                    {rule.triggerConfig.condition} {rule.triggerConfig.value}
                    {rule.triggerConfig.consecutiveDays && (
                      <> ({rule.triggerConfig.consecutiveDays}d)</>
                    )}
                  </>
                )}
                {rule.triggerType === 'time' && <>{rule.triggerConfig.schedule}</>}
                {rule.triggerType === 'event' && <>{rule.triggerConfig.event || 'Event'}</>}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div>
            <p className="font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Actions ({rule.actions.length})
            </p>
            <div className="space-y-1">
              {rule.actions.slice(0, 2).map((action) => (
                <div
                  key={action.id}
                  className="px-2 py-1 rounded bg-slate-100 text-slate-700 truncate"
                >
                  {action.type.replace('_', ' ')}
                </div>
              ))}
              {rule.actions.length > 2 && (
                <p className="text-slate-500 text-center">+{rule.actions.length - 2} more</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
