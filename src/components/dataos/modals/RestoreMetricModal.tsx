/**
 * RESTORE METRIC MODAL
 * Modal para restaurar métrica arquivada
 */

'use client';

import { motion } from 'motion/react';
import { RotateCcw, X, CheckCircle, Database, Users, Zap, AlertTriangle } from 'lucide-react';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface RestoreMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    name: string;
    historicalEntries: number;
    affectedAthletes: number;
    automations: number;
  };
  onConfirm: () => void;
}

export function RestoreMetricModal({ isOpen, onClose, metric, onConfirm }: RestoreMetricModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold">🔄 Restaurar Métrica</h2>
                <p className="text-sm text-slate-600">Reativar métrica arquivada</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
          {/* Metric Info */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
            <p className="text-sm text-emerald-700 mb-2">
              Restaurar a métrica:
            </p>
            <p className="text-lg font-semibold text-emerald-900">
              "{metric.name}"
            </p>
          </div>

          {/* What Will Happen */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-900">
              Ao restaurar esta métrica:
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-emerald-900 font-medium">
                    A métrica aparecerá em "Minhas Métricas"
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Voltará a estar disponível na biblioteca principal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-50 border border-sky-200">
                <Database className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-sky-900 font-medium">
                    {metric.historicalEntries} entradas históricas serão reativadas
                  </p>
                  <p className="text-xs text-sky-700 mt-1">
                    Todos os dados históricos voltam a estar acessíveis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                <Users className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-900 font-medium">
                    Disponível para {metric.affectedAthletes} atletas
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Os atletas voltarão a ter acesso a esta métrica
                  </p>
                </div>
              </div>

              {metric.automations > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <Zap className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-900 font-medium">
                      As automações permanecem desativadas
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Precisas reativar manualmente as {metric.automations} regras de automação
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Automation Warning */}
          {metric.automations > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    ⚠️ Atenção: Automações
                  </p>
                  <p className="text-xs text-amber-700">
                    Esta métrica tinha {metric.automations} regras de automação ativas. 
                    Após restaurar, precisas ir às configurações de automação e reativá-las manualmente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-sky-900 mb-1">
                  ✓ Após Restaurar
                </p>
                <p className="text-xs text-sky-700">
                  A métrica voltará imediatamente a estar disponível e poderás começar 
                  a adicionar novos valores. Todo o histórico estará preservado.
                </p>
              </div>
            </div>
          </div>
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
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" />
              ✅ Restaurar Métrica
            </motion.button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
