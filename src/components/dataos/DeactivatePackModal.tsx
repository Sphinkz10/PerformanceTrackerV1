import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertTriangle, Info, Target, FileText, BarChart3, 
  Lightbulb, Trash2, Archive
} from 'lucide-react';
import type { ActivePack, PackMetricsUsage } from '@/types/packs';

// ============================================================
// TYPES
// ============================================================

interface DeactivatePackModalProps {
  open: boolean;
  onClose: () => void;
  pack: ActivePack | null;
  usage?: PackMetricsUsage; // Info sobre onde as métricas são usadas
  onConfirm: (keepMetrics: boolean, deleteData: boolean) => void;
  isDeactivating?: boolean;
}

// ============================================================
// COLOR CONFIGS
// ============================================================

const colorConfig = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const DeactivatePackModal: React.FC<DeactivatePackModalProps> = ({
  open,
  onClose,
  pack,
  usage,
  onConfirm,
  isDeactivating = false,
}) => {
  const [keepMetrics, setKeepMetrics] = useState(true); // default: manter métricas
  const [deleteData, setDeleteData] = useState(false); // default: manter dados

  if (!open || !pack) return null;

  const colors = colorConfig[pack.packColor];
  const hasUsage = usage && (usage.inForms > 0 || usage.inReports > 0 || usage.inDecisions > 0);
  const hasData = pack.hasData || (usage && usage.totalDataPoints > 0);

  // Handlers
  const handleConfirm = () => {
    // BUG FIX: Se keepMetrics é true, deleteData deve ser sempre false
    // (não faz sentido deletar dados se estamos a manter as métricas)
    const finalDeleteData = keepMetrics ? false : deleteData;
    onConfirm(keepMetrics, finalDeleteData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className={`p-6 border-b border-slate-200 ${colors.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">Desativar Pack</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Tens a certeza que queres desativar <strong>{pack.packName}</strong>?
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={isDeactivating}
                className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Pack Info */}
            <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{pack.packIcon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{pack.packName}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {pack.metricsCount} métrica{pack.metricsCount !== 1 ? 's' : ''}
                    </span>
                    {pack.formId && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        1 formulário
                      </span>
                    )}
                    {pack.reportId && (
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        1 report
                      </span>
                    )}
                    {pack.decisionsCount && pack.decisionsCount > 0 && (
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        {pack.decisionsCount} decisõe{pack.decisionsCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning: Has Data */}
            {hasData && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-orange-900 mb-1">
                      Este pack tem dados registados
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      {usage?.totalDataPoints || 'Várias'} entradas de dados foram registadas para métricas deste pack.
                    </p>
                    <p className="text-xs text-orange-600">
                      Recomendamos <strong>manter os dados</strong> para preservar o histórico.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning: In Use */}
            {hasUsage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                      Métricas deste pack estão em uso
                    </h4>
                    <div className="space-y-1 text-sm text-red-700">
                      {usage.inForms > 0 && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{usage.inForms} formulário{usage.inForms !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {usage.inReports > 0 && (
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>{usage.inReports} report{usage.inReports !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {usage.inDecisions > 0 && (
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          <span>{usage.inDecisions} decisõe{usage.inDecisions !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-red-600 mt-2">
                      Recomendamos <strong>manter as métricas</strong> para não quebrar estas integrações.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">O que queres fazer?</h4>

              {/* Option 1: Keep Metrics */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                keepMetrics 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="keepMetrics"
                  checked={keepMetrics}
                  onChange={() => setKeepMetrics(true)}
                  className="mt-1"
                  disabled={isDeactivating}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Archive className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      Manter métricas como independentes
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    As métricas continuarão disponíveis individualmente. Podes geri-las no Metrics Manager.
                  </p>
                  <ul className="text-xs text-slate-500 mt-2 space-y-1">
                    <li>✓ Forms, reports e decisões continuam a funcionar</li>
                    <li>✓ Dados históricos preservados</li>
                    <li>✓ Podes reativar o pack depois</li>
                  </ul>
                </div>
              </label>

              {/* Option 2: Delete Metrics */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !keepMetrics 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="keepMetrics"
                  checked={!keepMetrics}
                  onChange={() => setKeepMetrics(false)}
                  className="mt-1"
                  disabled={isDeactivating}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      Remover métricas completamente
                    </span>
                    {hasUsage && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                        ⚠️ Perigoso
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    As métricas serão permanentemente removidas do workspace.
                  </p>
                  <ul className="text-xs text-red-600 mt-2 space-y-1">
                    <li>⚠️ Forms/reports que usam estas métricas vão quebrar</li>
                    <li>⚠️ Decisões que usam estas métricas vão parar</li>
                    {!deleteData && <li>✓ Dados históricos serão preservados</li>}
                  </ul>
                </div>
              </label>

              {/* Sub-option: Delete Data (only if deleting metrics) */}
              {!keepMetrics && hasData && (
                <div className="ml-10 p-4 rounded-xl bg-red-50 border border-red-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteData}
                      onChange={(e) => setDeleteData(e.target.checked)}
                      className="mt-1"
                      disabled={isDeactivating}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-red-900">
                        Também remover todos os dados históricos
                      </span>
                      <p className="text-xs text-red-700 mt-1">
                        Isto vai apagar permanentemente {usage?.totalDataPoints || 'todas as'} entradas de dados.
                        <strong> Esta ação NÃO pode ser desfeita!</strong>
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 text-sm text-blue-700">
                  <p className="font-medium mb-1">💡 Dica</p>
                  <p>
                    Podes sempre reativar este pack mais tarde através da biblioteca de packs.
                    {keepMetrics && ' As métricas que mantiveres serão automaticamente re-associadas ao pack.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              disabled={isDeactivating}
              className="px-4 py-2 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <div className="flex gap-2">
              <motion.button
                whileHover={!isDeactivating ? { scale: 1.02 } : {}}
                whileTap={!isDeactivating ? { scale: 0.98 } : {}}
                onClick={handleConfirm}
                disabled={isDeactivating}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  keepMetrics
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isDeactivating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A desativar...</span>
                  </>
                ) : (
                  <>
                    {keepMetrics ? <Archive className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                    <span>{keepMetrics ? 'Desativar Pack' : 'Remover Tudo'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeactivatePackModal;