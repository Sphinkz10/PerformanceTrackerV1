/**
 * WIZARD STEP 4: TEMPLATE & DEPLOYMENT
 * Save template and deploy metric
 * 
 * REAPROVEITANDO: CreateMetricModal validation & save logic
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight,
  ChevronLeft,
  Save,
  Rocket,
  Users,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Mail,
  Info,
  Settings
} from 'lucide-react';
import type { 
  AnyMetricSource,
  TriggerConfig,
  AnyAction,
  TemplateConfig,
  DeploymentConfig,
  DeploymentTarget
} from '@/types/wizard';
import type { Metric } from '@/types/metrics';

interface Step4TemplateDeploymentProps {
  source: AnyMetricSource;
  trigger: TriggerConfig;
  actions: AnyAction[];
  metricName: string;
  metricDescription: string;
  template: TemplateConfig;
  deployment: DeploymentConfig;
  onMetricNameChange: (name: string) => void;
  onMetricDescriptionChange: (desc: string) => void;
  onTemplateChange: (template: TemplateConfig) => void;
  onDeploymentChange: (deployment: DeploymentConfig) => void;
  onFinish: () => void;
  onBack: () => void;
  workspaceId: string;
}

// Mock data
const MOCK_GROUPS = [
  { id: 'group-1', name: 'Equipa Principal' },
  { id: 'group-2', name: 'Sub-17' },
  { id: 'group-3', name: 'Formação' },
];

const MOCK_ATHLETES = [
  { id: 'athlete-1', name: 'João Silva #10' },
  { id: 'athlete-2', name: 'Maria Santos #7' },
  { id: 'athlete-3', name: 'Pedro Costa #23' },
  { id: 'athlete-4', name: 'Ana Rodrigues #14' },
];

export function Step4TemplateDeployment({
  source,
  trigger,
  actions,
  metricName,
  metricDescription,
  template,
  deployment,
  onMetricNameChange,
  onMetricDescriptionChange,
  onTemplateChange,
  onDeploymentChange,
  onFinish,
  onBack,
  workspaceId,
}: Step4TemplateDeploymentProps) {
  const [tags, setTags] = useState<string>(template.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTagsChange = (value: string) => {
    setTags(value);
    onTemplateChange({
      ...template,
      tags: value.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    onFinish();
  };

  const canProceed = metricName.trim().length > 0;

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
              Step 4 de 4: Template & Deployment
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="h-1 flex-1 rounded-full bg-sky-500"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
          <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Resumo da configuração:
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-slate-500 w-20">Fonte:</span>
              <span className="text-slate-900">{source.name}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-500 w-20">Trigger:</span>
              <span className="text-slate-900">{trigger.type === 'always' ? 'Sempre' : 'Condicional'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-500 w-20">Ações:</span>
              <span className="text-slate-900">{actions.length} configurada(s)</span>
            </div>
          </div>
        </div>

        {/* Metric Name & Description */}
        <div className="space-y-4">
          <h3 className="text-slate-900">
            1. Informação básica
          </h3>

          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Nome da métrica: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={metricName}
              onChange={(e) => onMetricNameChange(e.target.value)}
              placeholder="Ex: HRV Matinal, Volume Squat Semanal..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
            {metricName.length > 0 && metricName.length < 3 && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Nome muito curto (mínimo 3 caracteres)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Descrição: <span className="text-slate-400 text-xs">(opcional)</span>
            </label>
            <textarea
              value={metricDescription}
              onChange={(e) => onMetricDescriptionChange(e.target.value)}
              placeholder="Descreve o que esta métrica mede..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
            />
          </div>
        </div>

        {/* Template Configuration */}
        <div className="p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <h3 className="text-sm text-purple-900 mb-3 flex items-center gap-2">
            <Save className="h-4 w-4" />
            2. Guardar como template?
          </h3>

          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={template.saveAsTemplate}
              onChange={(e) => onTemplateChange({ ...template, saveAsTemplate: e.target.checked })}
              className="h-4 w-4 text-purple-600 rounded"
            />
            <span className="text-sm text-slate-700">
              Sim, guardar como template reutilizável
            </span>
          </label>

          {template.saveAsTemplate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 mt-4"
            >
              <div>
                <label className="block text-xs text-slate-600 mb-2">Nome do template:</label>
                <input
                  type="text"
                  value={template.templateName || ''}
                  onChange={(e) => onTemplateChange({ ...template, templateName: e.target.value })}
                  placeholder={metricName || 'Ex: HRV Morning Template'}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-2">Tags (separadas por vírgula):</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="recovery, wellness, morning..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.isPublic || false}
                  onChange={(e) => onTemplateChange({ ...template, isPublic: e.target.checked })}
                  className="h-4 w-4 text-purple-600 rounded"
                />
                <span className="text-xs text-slate-700">Partilhar publicamente (outros workspaces podem usar)</span>
              </label>
            </motion.div>
          )}
        </div>

        {/* Deployment Configuration */}
        <div className="p-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <h3 className="text-sm text-emerald-900 mb-3 flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            3. Aplicar a quem?
          </h3>

          <div className="space-y-2">
            {[
              { value: 'all-athletes' as DeploymentTarget, label: 'Todos os atletas', icon: Users },
              { value: 'specific-group' as DeploymentTarget, label: 'Grupo específico', icon: Users },
              { value: 'specific-athletes' as DeploymentTarget, label: 'Atletas específicos', icon: Users },
              { value: 'test-only' as DeploymentTarget, label: 'Apenas teste (não aplicar ainda)', icon: Settings },
            ].map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    deployment.target === option.value
                      ? 'bg-emerald-100 border-2 border-emerald-400'
                      : 'bg-white border border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="deployment-target"
                    value={option.value}
                    checked={deployment.target === option.value}
                    onChange={(e) => onDeploymentChange({ ...deployment, target: e.target.value as DeploymentTarget })}
                    className="h-4 w-4 text-emerald-600"
                  />
                  <Icon className="h-4 w-4 text-slate-600" />
                  <span className="text-sm text-slate-900">{option.label}</span>
                </label>
              );
            })}
          </div>

          {/* Sub-options based on target */}
          {deployment.target === 'specific-group' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <label className="block text-xs text-slate-600 mb-2">Seleciona o grupo:</label>
              <select
                value={deployment.groupId || ''}
                onChange={(e) => onDeploymentChange({ ...deployment, groupId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="">Escolhe um grupo...</option>
                {MOCK_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </motion.div>
          )}

          {deployment.target === 'specific-athletes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <label className="block text-xs text-slate-600 mb-2">Seleciona atletas:</label>
              <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-200 rounded-lg p-2">
                {MOCK_ATHLETES.map((athlete) => (
                  <label key={athlete.id} className="flex items-center gap-2 p-2 hover:bg-emerald-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deployment.athleteIds?.includes(athlete.id) || false}
                      onChange={(e) => {
                        const current = deployment.athleteIds || [];
                        const updated = e.target.checked
                          ? [...current, athlete.id]
                          : current.filter(id => id !== athlete.id);
                        onDeploymentChange({ ...deployment, athleteIds: updated });
                      }}
                      className="h-4 w-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-slate-700">{athlete.name}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Advanced Options (Collapsible) */}
        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Opções avançadas
            <ChevronRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
          </button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deployment.automationEnabled || false}
                  onChange={(e) => onDeploymentChange({ ...deployment, automationEnabled: e.target.checked })}
                  className="h-4 w-4 text-sky-600 rounded"
                />
                <span className="text-sm text-slate-700">Calcular automaticamente (sem input manual)</span>
              </label>

              {deployment.automationEnabled && (
                <div>
                  <label className="block text-xs text-slate-600 mb-2">Quando calcular?</label>
                  <select
                    value={deployment.automationSchedule || 'daily'}
                    onChange={(e) => onDeploymentChange({ ...deployment, automationSchedule: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="after-session">Após cada sessão</option>
                    <option value="daily">Diariamente (08:00)</option>
                    <option value="weekly">Semanalmente (Segunda 08:00)</option>
                    <option value="custom">Custom schedule...</option>
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deployment.notifyOnMissingData || false}
                  onChange={(e) => onDeploymentChange({ ...deployment, notifyOnMissingData: e.target.checked })}
                  className="h-4 w-4 text-sky-600 rounded"
                />
                <span className="text-sm text-slate-700">Notificar quando faltar dados</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deployment.includeInReports || false}
                  onChange={(e) => onDeploymentChange({ ...deployment, includeInReports: e.target.checked })}
                  className="h-4 w-4 text-sky-600 rounded"
                />
                <span className="text-sm text-slate-700">Incluir em relatórios automáticos</span>
              </label>
            </motion.div>
          )}
        </div>

        {/* Final Preview */}
        {canProceed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200"
          >
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-sky-900 mb-1">✓ Pronto para criar!</h4>
                <p className="text-xs text-sky-700">
                  Métrica <strong>"{metricName}"</strong> será {deployment.target === 'test-only' ? 'guardada em modo teste' : `aplicada a ${getDeploymentTargetText(deployment)}`}.
                  {template.saveAsTemplate && ` Template "${template.templateName || metricName}" será guardado.`}
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
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </motion.button>

          <motion.button
            whileHover={canProceed && !loading ? { scale: 1.05 } : {}}
            whileTap={canProceed && !loading ? { scale: 0.95 } : {}}
            onClick={handleSave}
            disabled={!canProceed || loading}
            className={`flex items-center gap-2 px-6 py-3 text-sm rounded-xl transition-all ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
                Criando...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Criar Métrica!
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getDeploymentTargetText(deployment: DeploymentConfig): string {
  switch (deployment.target) {
    case 'all-athletes':
      return 'todos os atletas';
    case 'specific-group':
      return deployment.groupId ? 'grupo selecionado' : 'grupo (seleciona)';
    case 'specific-athletes':
      const count = deployment.athleteIds?.length || 0;
      return count > 0 ? `${count} atleta(s)` : 'atletas (seleciona)';
    case 'test-only':
      return 'modo teste';
    default:
      return '';
  }
}
