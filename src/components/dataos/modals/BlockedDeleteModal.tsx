/**
 * BLOCKED DELETE MODAL
 * Quando métrica não pode ser apagada (está em uso)
 */

'use client';

import { motion } from 'motion/react';
import { AlertTriangle, X, Zap, Settings } from 'lucide-react';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface BlockedDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    name: string;
  };
  automations: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  onManageAutomations: () => void;
}

export function BlockedDeleteModal({ 
  isOpen, 
  onClose, 
  metric, 
  automations,
  onManageAutomations 
}: BlockedDeleteModalProps) {
  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold">❗ Não é possível apagar</h2>
                <p className="text-sm text-slate-600">Métrica em uso</p>
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
          {/* Metric Info */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-200">
            <p className="text-sm text-orange-700 mb-2">
              A métrica:
            </p>
            <p className="text-lg font-semibold text-orange-900">
              "{metric.name}"
            </p>
            <p className="text-sm text-orange-700 mt-2">
              não pode ser apagada porque está a ser usada por automações ativas.
            </p>
          </div>

          {/* Automations List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold text-slate-900">
                {automations.length} REGRAS DE AUTOMAÇÃO:
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {automation.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Tipo: {automation.type}
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium whitespace-nowrap">
                      Ativa
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
            <p className="text-sm font-semibold text-sky-900 mb-3">
              Para apagar esta métrica:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-sky-600 font-bold shrink-0">1.</span>
                <p className="text-sm text-sky-800">
                  Remova ou edite as regras de automação listadas acima
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sky-600 font-bold shrink-0">2.</span>
                <p className="text-sm text-sky-800">
                  Tente apagar a métrica novamente
                </p>
              </div>
            </div>
          </div>

          {/* Alternative */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              💡 Alternativa:
            </p>
            <p className="text-sm text-purple-700">
              Se não precisas da métrica temporariamente, podes <strong>desativá-la</strong> 
              em vez de apagar. As automações continuarão pausadas mas podem ser reativadas 
              no futuro.
            </p>
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
              ✖ Fechar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onManageAutomations();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500 transition-all min-h-[44px]"
            >
              <Settings className="h-4 w-4" />
              ⚡ Gerir Automações
            </motion.button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
