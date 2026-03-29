/**
 * TransformationConfigurator Component
 * 
 * Main modal for configuring transformations.
 * Orchestrates all transformation UI components.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Settings } from 'lucide-react';
import type { TransformFunction } from '@/types/metrics';
import type { TransformTemplate } from '@/types/transformations';
import { TransformationPreviewPanel } from './TransformationPreviewPanel';
import { TransformTemplateLibrary } from './TransformTemplateLibrary';
import { UnitConversionBuilder } from './UnitConversionBuilder';
import { CustomFormulaEditor } from './CustomFormulaEditor';

// ============================================================================
// TYPES
// ============================================================================

export interface TransformationConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  fieldId: string;
  fieldName: string;
  fieldType: string;
  metricId: string;
  metricName: string;
  metricType: string;
  currentTransform?: TransformFunction;
  currentParams?: Record<string, any>;
  onSave: (transform: TransformFunction, params?: Record<string, any>) => void;
}

type TabType = 'simple' | 'templates' | 'advanced' | 'units';

// ============================================================================
// COMPONENT
// ============================================================================

export const TransformationConfigurator: React.FC<TransformationConfiguratorProps> = ({
  isOpen,
  onClose,
  fieldId,
  fieldName,
  fieldType,
  metricId,
  metricName,
  metricType,
  currentTransform = 'none',
  currentParams,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [transformFunction, setTransformFunction] = useState<TransformFunction>(currentTransform);
  const [transformParams, setTransformParams] = useState<Record<string, any> | undefined>(currentParams);
  const [customFormula, setCustomFormula] = useState(currentParams?.formula || 'value');
  const [isFormulaValid, setIsFormulaValid] = useState(true);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: TransformTemplate) => {
    setTransformFunction(template.transformFunction);
    setTransformParams(template.transformParams);
    
    if (template.transformFunction === 'custom' && template.transformParams?.formula) {
      setCustomFormula(template.transformParams.formula);
    }
  }, []);

  // Handle unit conversion apply
  const handleUnitConversionApply = useCallback((config: {
    fromUnit: string;
    toUnit: string;
    factor: number;
    formula?: string;
  }) => {
    if (config.formula) {
      setTransformFunction('custom');
      setTransformParams({ formula: config.formula });
      setCustomFormula(config.formula);
    } else {
      setTransformFunction('multiply');
      setTransformParams({ factor: config.factor });
    }
  }, []);

  // Handle custom formula change
  const handleFormulaChange = useCallback((formula: string) => {
    setCustomFormula(formula);
    setTransformFunction('custom');
    setTransformParams({ formula });
  }, []);

  // Handle formula validation
  const handleFormulaValidation = useCallback((isValid: boolean, error?: string) => {
    setIsFormulaValid(isValid);
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    // Validate
    if (transformFunction === 'custom' && !isFormulaValid) {
      return; // Don't save invalid formula
    }

    onSave(transformFunction, transformParams);
    onClose();
  }, [transformFunction, transformParams, isFormulaValid, onSave, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    // Reset to current values
    setTransformFunction(currentTransform);
    setTransformParams(currentParams);
    setCustomFormula(currentParams?.formula || 'value');
    onClose();
  }, [currentTransform, currentParams, onClose]);

  // Check if can save
  const canSave = useMemo(() => {
    if (transformFunction === 'none') {
      return true; // Always can save "none"
    }

    if (transformFunction === 'custom') {
      return isFormulaValid; // Need valid formula
    }

    return true; // Other transforms are always valid if selected
  }, [transformFunction, isFormulaValid]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <h2 className="font-semibold text-slate-900">
                  Configurar Transformação
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                {fieldName} → {metricName}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'templates' as TabType, label: '📚 Templates', icon: null },
              { id: 'simple' as TabType, label: '⚙️ Simples', icon: null },
              { id: 'units' as TabType, label: '🔄 Unidades', icon: null },
              { id: 'advanced' as TabType, label: '🧮 Avançado', icon: null },
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Left Panel - Configuration */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {/* Templates Tab */}
                {activeTab === 'templates' && (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <TransformTemplateLibrary
                      onSelectTemplate={handleTemplateSelect}
                      fieldType={fieldType}
                      metricType={metricType}
                    />
                  </motion.div>
                )}

                {/* Simple Tab */}
                {activeTab === 'simple' && (
                  <motion.div
                    key="simple"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="h-4 w-4 text-sky-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Configuração Simples
                      </h3>
                    </div>

                    {/* Transform Type Selector */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Tipo de Transformação:
                      </label>
                      <select
                        value={transformFunction}
                        onChange={(e) => setTransformFunction(e.target.value as TransformFunction)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      >
                        <option value="none">Sem transformação</option>
                        <optgroup label="Multiplicação/Divisão">
                          <option value="multiply">Multiplicar</option>
                          <option value="divide">Dividir</option>
                          <option value="multiply_by_10">Multiplicar por 10</option>
                          <option value="multiply_by_100">Multiplicar por 100</option>
                          <option value="divide_by_10">Dividir por 10</option>
                        </optgroup>
                        <optgroup label="Escala">
                          <option value="scale">Escalar intervalo</option>
                          <option value="invert">Inverter escala</option>
                        </optgroup>
                        <optgroup label="Outros">
                          <option value="offset">Adicionar offset</option>
                          <option value="round">Arredondar</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Parameters based on selected transform */}
                    {transformFunction === 'multiply' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Factor:
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={transformParams?.factor ?? 1}
                          onChange={(e) => setTransformParams({ factor: parseFloat(e.target.value) || 1 })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    )}

                    {transformFunction === 'divide' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Divisor:
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={transformParams?.divisor ?? 1}
                          onChange={(e) => setTransformParams({ divisor: parseFloat(e.target.value) || 1 })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    )}

                    {transformFunction === 'offset' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Offset:
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={transformParams?.offset ?? 0}
                          onChange={(e) => setTransformParams({ offset: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    )}

                    {transformFunction === 'scale' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                              De Min:
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={transformParams?.fromMin ?? 0}
                              onChange={(e) => setTransformParams({ ...transformParams, fromMin: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                              De Max:
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={transformParams?.fromMax ?? 10}
                              onChange={(e) => setTransformParams({ ...transformParams, fromMax: parseFloat(e.target.value) || 10 })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                              Para Min:
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={transformParams?.toMin ?? 0}
                              onChange={(e) => setTransformParams({ ...transformParams, toMin: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                              Para Max:
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={transformParams?.toMax ?? 100}
                              onChange={(e) => setTransformParams({ ...transformParams, toMax: parseFloat(e.target.value) || 100 })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {transformFunction === 'invert' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Máximo da Escala:
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={transformParams?.max ?? 10}
                          onChange={(e) => setTransformParams({ max: parseFloat(e.target.value) || 10 })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    )}

                    {transformFunction === 'round' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Casas Decimais:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={transformParams?.decimals ?? 0}
                          onChange={(e) => setTransformParams({ decimals: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Units Tab */}
                {activeTab === 'units' && (
                  <motion.div
                    key="units"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <UnitConversionBuilder
                        category="weight"
                        onApply={handleUnitConversionApply}
                      />
                      <UnitConversionBuilder
                        category="distance"
                        onApply={handleUnitConversionApply}
                      />
                      <UnitConversionBuilder
                        category="time"
                        onApply={handleUnitConversionApply}
                      />
                      <UnitConversionBuilder
                        category="temperature"
                        onApply={handleUnitConversionApply}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <CustomFormulaEditor
                      formula={customFormula}
                      onChange={handleFormulaChange}
                      onValidate={handleFormulaValidation}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-80 border-l border-slate-200 p-6 bg-slate-50 overflow-y-auto">
              <TransformationPreviewPanel
                transformFunction={transformFunction}
                transformParams={transformParams}
                fieldType={fieldType}
                metricType={metricType}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </motion.button>

          <motion.button
            whileHover={{ scale: canSave ? 1.05 : 1 }}
            whileTap={{ scale: canSave ? 0.95 : 1 }}
            onClick={handleSave}
            disabled={!canSave}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              canSave
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Aplicar Transformação
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
