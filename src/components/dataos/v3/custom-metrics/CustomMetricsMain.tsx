import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Calculator, TrendingUp, Sparkles } from 'lucide-react';
import { CustomMetricBuilder } from './CustomMetricBuilder';

interface CustomMetricsMainProps {
  workspaceId: string;
  workspaceName?: string;
}

export function CustomMetricsMain({ workspaceId, workspaceName }: CustomMetricsMainProps) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomMetrics();
  }, [workspaceId]);

  const fetchCustomMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/custom-metrics?workspace_id=${workspaceId}`);
      const data = await response.json();
      setCustomMetrics(data.customMetrics || []);
    } catch (error) {
      console.error('Error fetching custom metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMetric = async (metricData: any) => {
    try {
      const response = await fetch('/api/custom-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metricData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create metric');
      }

      await fetchCustomMetrics();
      setShowBuilder(false);
    } catch (error: any) {
      alert(`Erro ao criar métrica: ${error.message}`);
      throw error;
    }
  };

  if (showBuilder) {
    return (
      <CustomMetricBuilder
        workspaceId={workspaceId}
        onSave={handleCreateMetric}
        onCancel={() => setShowBuilder(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-violet-50 to-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-xl flex items-center gap-2">
              <Calculator className="w-6 h-6 text-violet-600" />
              Métricas Personalizadas
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Crie métricas calculadas a partir de outras métricas
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBuilder(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md hover:from-violet-400 hover:to-violet-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nova Métrica
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-violet-200">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-medium text-slate-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{customMetrics.length}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-600">Ativas</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {customMetrics.filter(m => m.visibility === 'workspace').length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-sky-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-medium text-slate-600">Privadas</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {customMetrics.filter(m => m.visibility === 'private').length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-600">A carregar métricas...</p>
            </div>
          </div>
        ) : customMetrics.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center max-w-md">
              <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Nenhuma métrica personalizada</h3>
              <p className="text-sm text-slate-600 mb-6">
                Crie métricas calculadas para análises mais profundas dos seus atletas.
              </p>
              <button
                onClick={() => setShowBuilder(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 mx-auto shadow-md hover:from-violet-400 hover:to-violet-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                Criar Primeira Métrica
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {customMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{metric.name}</h3>
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
                        {metric.category}
                      </span>
                    </div>
                    {metric.description && (
                      <p className="text-sm text-slate-600">{metric.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {metric.unit && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg mb-4">
                  <pre className="text-sm text-emerald-400 font-mono overflow-x-auto">
                    {metric.formula}
                  </pre>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-4">
                    <span>Tipo: {metric.formula_type}</span>
                    <span>Visibilidade: {metric.visibility}</span>
                  </div>
                  <span>
                    Criada em {new Date(metric.created_at).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
