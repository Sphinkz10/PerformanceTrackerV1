/**
 * BULK DELETE MODAL
 * Apagar múltiplas métricas de uma vez
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X, Trash2, Archive, Users, Zap, Database, CheckCircle } from 'lucide-react';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface SelectedMetric {
  id: string;
  name: string;
  historicalEntries: number;
  affectedAthletes: number;
  automations: number;
}

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMetrics: SelectedMetric[];
  onConfirm: (deleteType: 'soft' | 'hard') => void;
}

export function BulkDeleteModal({ isOpen, onClose, selectedMetrics, onConfirm }: BulkDeleteModalProps) {
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');

  // Calculate totals
  const totalEntries = selectedMetrics.reduce((sum, m) => sum + m.historicalEntries, 0);
  const totalAthletes = new Set(selectedMetrics.flatMap(m => Array(m.affectedAthletes).fill(0))).size;
  const totalAutomations = selectedMetrics.reduce((sum, m) => sum + m.automations, 0);

  const handleConfirm = () => {
    onConfirm(deleteType);
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold">
                  Apagar {selectedMetrics.length} Métricas
                </h2>
                <p className="text-sm text-slate-600">Ação em lote</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
            >
              <X className="h-5 w-5 text-slate-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
          {/* Selected Metrics List */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">
              Métricas selecionadas ({selectedMetrics.length}):
            </p>
            <div className="max-h-40 overflow-y-auto space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {selectedMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200"
                >
                  <CheckCircle className="h-4 w-4 text-sky-500 shrink-0" />
                  <span className="text-sm text-slate-900 flex-1">{metric.name}</span>
                  <span className="text-xs text-slate-500">
                    {metric.historicalEntries} entradas
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Impact */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-3">
              Total impactado:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-700">Entradas</p>
                  <p className="text-lg font-bold text-amber-900">{totalEntries}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-700">Atletas</p>
                  <p className="text-lg font-bold text-amber-900">{totalAthletes}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-700">Automações</p>
                  <p className="text-lg font-bold text-amber-900">{totalAutomations}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Type Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-900">Tipo de apagamento:</p>

            <label
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                deleteType === 'soft'
                  ? 'bg-amber-50 border-2 border-amber-300'
                  : 'bg-white border-2 border-slate-200 hover:border-amber-200'
              }`}
            >
              <input
                type="radio"
                name="bulkDeleteType"
                value="soft"
                checked={deleteType === 'soft'}
                onChange={(e) => setDeleteType(e.target.value as 'soft')}
                className="h-5 w-5 text-amber-600 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Archive className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-semibold text-slate-900">
                    Soft Delete (Arquivar)
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  As métricas serão arquivadas e podem ser restauradas. Dados históricos mantidos.
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-500">✓ Métricas movidas para "Arquivadas"</p>
                  <p className="text-xs text-slate-500">✓ Dados históricos preservados</p>
                  <p className="text-xs text-slate-500">✓ Pode ser restaurado a qualquer momento</p>
                  <p className="text-xs text-slate-500">✓ Automações pausadas (não removidas)</p>
                </div>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                deleteType === 'hard'
                  ? 'bg-red-50 border-2 border-red-300'
                  : 'bg-white border-2 border-slate-200 hover:border-red-200'
              }`}
            >
              <input
                type="radio"
                name="bulkDeleteType"
                value="hard"
                checked={deleteType === 'hard'}
                onChange={(e) => setDeleteType(e.target.value as 'hard')}
                className="h-5 w-5 text-red-600 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-semibold text-slate-900">
                    Hard Delete (Permanente)
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    Irreversível
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  As métricas serão removidas permanentemente. Use com extrema cautela!
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-red-600">✗ Métricas removidas permanentemente</p>
                  <p className="text-xs text-red-600">✗ Dados históricos apagados</p>
                  <p className="text-xs text-red-600">✗ Não pode ser recuperado</p>
                  <p className="text-xs text-red-600">✗ Automações removidas</p>
                </div>
              </div>
            </label>
          </div>

          {/* Warning */}
          {deleteType === 'hard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-900 mb-2">
                    ⚠️ ATENÇÃO: AÇÃO IRREVERSÍVEL
                  </p>
                  <p className="text-xs text-red-700 mb-2">
                    Está prestes a apagar permanentemente {selectedMetrics.length} métricas, 
                    afetando {totalEntries} entradas de dados e {totalAthletes} atletas.
                  </p>
                  <p className="text-xs text-red-700 font-semibold">
                    Esta ação NÃO PODE ser desfeita! Recomendamos usar Soft Delete.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              ✖ Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${
                deleteType === 'soft'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:from-red-400 hover:to-red-500'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              {deleteType === 'soft' 
                ? `Arquivar ${selectedMetrics.length} Métricas`
                : `Apagar ${selectedMetrics.length} Métricas`
              }
            </motion.button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
