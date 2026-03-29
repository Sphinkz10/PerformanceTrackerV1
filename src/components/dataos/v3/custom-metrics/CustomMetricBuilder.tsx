import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

interface CustomMetricBuilderProps {
  onSave: (metric: any) => Promise<void>;
  onCancel: () => void;
  workspaceId: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: 'Info', description: 'Nome e categoria' },
  { id: 2, title: 'Formula', description: 'Definir cálculo' },
  { id: 3, title: 'Preview', description: 'Testar resultado' },
  { id: 4, title: 'Display', description: 'Visualização' }
];

export function CustomMetricBuilder({ onSave, onCancel, workspaceId }: CustomMetricBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: '',
    category: 'custom',
    formula: '',
    formulaType: 'simple' as 'simple' | 'aggregate' | 'composite',
    displayConfig: {
      chartType: 'line' as 'line' | 'bar' | 'area',
      colorScheme: 'emerald',
      showBaseline: false,
      showTrend: true,
      decimals: 2
    },
    visibility: 'workspace' as 'workspace' | 'private'
  });

  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.trim() !== '' && formData.category !== '';
    }
    if (currentStep === 2) {
      return formData.formula.trim() !== '' && validation?.isValid;
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleValidateFormula = async () => {
    if (!formData.formula.trim()) return;

    try {
      const response = await fetch('/api/custom-metrics/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          formula: formData.formula
        })
      });

      const result = await response.json();
      setValidation({
        isValid: result.isValid,
        errors: result.errors?.map((e: any) => e.message) || [],
        warnings: result.warnings?.map((w: any) => w.message) || []
      });
    } catch (error) {
      console.error('Validation error:', error);
      setValidation({
        isValid: false,
        errors: ['Erro ao validar fórmula'],
        warnings: []
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        workspace_id: workspaceId,
        ...formData
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="font-bold text-slate-900 text-xl mb-2">Criar Métrica Personalizada</h2>
        <p className="text-sm text-slate-600">Configure uma nova métrica calculada</p>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step.id < currentStep
                    ? 'bg-emerald-500 text-white'
                    : step.id === currentStep
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-600">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${
                  step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nome da Métrica *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Força Relativa"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o que esta métrica mede..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Unidade
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="ex: kg, kg/kg, %"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                >
                  <option value="custom">Custom</option>
                  <option value="strength">Strength</option>
                  <option value="power">Power</option>
                  <option value="endurance">Endurance</option>
                  <option value="speed">Speed</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Formula */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Tipo de Fórmula
              </label>
              <div className="flex gap-2">
                {(['simple', 'aggregate', 'composite'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, formulaType: type })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      formData.formulaType === type
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'simple' && 'Simples'}
                    {type === 'aggregate' && 'Agregação'}
                    {type === 'composite' && 'Composta'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Fórmula *
              </label>
              <textarea
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                onBlur={handleValidateFormula}
                placeholder="ex: metric_1rm_squat / metric_bodyweight"
                rows={4}
                className="w-full px-4 py-2 font-mono text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
              />
            </div>

            {/* Validation Result */}
            {validation && (
              <div className={`p-4 rounded-xl border-2 ${
                validation.isValid 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {validation.isValid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    validation.isValid ? 'text-emerald-900' : 'text-red-900'
                  }`}>
                    {validation.isValid ? 'Fórmula válida!' : 'Erros encontrados'}
                  </span>
                </div>

                {validation.errors.length > 0 && (
                  <ul className="space-y-1 text-sm text-red-700">
                    {validation.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                )}

                {validation.warnings.length > 0 && (
                  <ul className="space-y-1 text-sm text-amber-700 mt-2">
                    {validation.warnings.map((warning, i) => (
                      <li key={i}>⚠️ {warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Helper */}
            <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
              <p className="text-sm font-semibold text-sky-900 mb-2">💡 Dicas:</p>
              <ul className="text-sm text-sky-800 space-y-1">
                <li>• Use <code className="bg-sky-100 px-1 rounded">metric_nome</code> para referenciar métricas</li>
                <li>• Operadores: <code className="bg-sky-100 px-1 rounded">+ - * /</code></li>
                <li>• Funções: <code className="bg-sky-100 px-1 rounded">SUM(metric, "7d")</code>, <code className="bg-sky-100 px-1 rounded">AVG(metric, "30d")</code></li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-2xl border border-violet-200">
              <h3 className="font-bold text-slate-900 mb-4">Preview da Métrica</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Nome:</span>
                    <p className="font-semibold text-slate-900">{formData.name || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Categoria:</span>
                    <p className="font-semibold text-slate-900">{formData.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Unidade:</span>
                    <p className="font-semibold text-slate-900">{formData.unit || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Tipo:</span>
                    <p className="font-semibold text-slate-900">{formData.formulaType}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-600 text-sm">Fórmula:</span>
                  <pre className="mt-1 p-3 bg-slate-900 text-emerald-400 rounded-lg text-sm font-mono overflow-x-auto">
                    {formData.formula || '(vazia)'}
                  </pre>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-900">
                    ℹ️ A métrica será calculada para todos os atletas do workspace ao ser criada.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Display Config */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Tipo de Gráfico
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['line', 'bar', 'area'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({
                      ...formData,
                      displayConfig: { ...formData.displayConfig, chartType: type }
                    })}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      formData.displayConfig.chartType === type
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'line' && 'Linha'}
                    {type === 'bar' && 'Barras'}
                    {type === 'area' && 'Área'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.displayConfig.showBaseline}
                    onChange={(e) => setFormData({
                      ...formData,
                      displayConfig: { ...formData.displayConfig, showBaseline: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Mostrar baseline</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.displayConfig.showTrend}
                    onChange={(e) => setFormData({
                      ...formData,
                      displayConfig: { ...formData.displayConfig, showTrend: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Mostrar tendência</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Casas Decimais
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={formData.displayConfig.decimals}
                onChange={(e) => setFormData({
                  ...formData,
                  displayConfig: { ...formData.displayConfig, decimals: parseInt(e.target.value) || 0 }
                })}
                className="w-32 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancelar
        </button>

        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-400 hover:to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSaving ? 'A guardar...' : 'Criar Métrica'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
