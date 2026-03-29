/**
 * HARD DELETE CONFIRMATION MODAL
 * Confirmação dupla para hard delete (requer digitar "APAGAR")
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X, Trash2, Users, Database, Zap } from 'lucide-react';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface HardDeleteConfirmationProps {
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

export function HardDeleteConfirmation({ isOpen, onClose, metric, onConfirm }: HardDeleteConfirmationProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText.toUpperCase() === 'APAGAR';

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      onClose();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="flex flex-col h-full min-h-0">
        {/* Header - Red theme for danger */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-red-900 font-bold">⚠️ APAGAMENTO PERMANENTE</h2>
                <p className="text-sm text-red-700 font-medium">Confirmação final necessária</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <X className="h-5 w-5 text-red-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
          {/* Main Warning */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 border-2 border-red-300">
            <p className="text-base font-bold text-red-900 mb-2 text-center">
              ESTÁ PRESTES A APAGAR PERMANENTEMENTE:
            </p>
            <p className="text-xl font-bold text-red-900 text-center">
              "{metric.name}"
            </p>
          </div>

          {/* Irreversible Warning */}
          <div className="p-4 rounded-xl bg-red-900 text-white">
            <p className="text-center font-bold text-lg mb-2">
              ❌ Esta ação NÃO PODE ser desfeita! ❌
            </p>
            <p className="text-center text-sm text-red-100">
              Todos os dados serão perdidos permanentemente
            </p>
          </div>

          {/* Impact Details */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">Impacto desta ação:</p>

            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <Database className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    {metric.historicalEntries} entradas de dados serão perdidas
                  </p>
                  <p className="text-xs text-red-700">
                    Histórico completo removido permanentemente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Users className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-900">
                    {metric.affectedAthletes} atletas perderão esta métrica
                  </p>
                  <p className="text-xs text-orange-700">
                    Os atletas não terão mais acesso a este tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                <Zap className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-purple-900">
                    {metric.automations} regras de automação serão removidas
                  </p>
                  <p className="text-xs text-purple-700">
                    Todas as regras associadas serão apagadas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                Para confirmar, escreva exatamente:
              </p>
              <p className="text-center text-2xl font-bold text-amber-900 py-3 px-4 bg-white rounded-lg border-2 border-amber-300 font-mono">
                APAGAR
              </p>
            </div>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite APAGAR para confirmar..."
              className={`w-full px-4 py-3 text-center text-lg font-mono border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                confirmText === ''
                  ? 'border-slate-200 focus:ring-sky-500/30 focus:border-sky-300'
                  : isConfirmed
                  ? 'border-red-300 bg-red-50 focus:ring-red-500/30 focus:border-red-400 text-red-900 font-bold'
                  : 'border-orange-300 bg-orange-50 focus:ring-orange-500/30 focus:border-orange-400 text-orange-900'
              }`}
            />

            {confirmText && !isConfirmed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-orange-600 text-center font-medium"
              >
                ⚠️ Texto incorreto. Digite exatamente "APAGAR"
              </motion.p>
            )}

            {isConfirmed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 text-center font-bold"
              >
                ✓ Confirmação válida. Pode prosseguir com o apagamento.
              </motion.p>
            )}
          </div>

          {/* Final Warning */}
          <div className="p-4 rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">
                <strong>Última oportunidade:</strong> Recomendamos usar "Soft Delete" (Arquivar) 
                em vez de apagamento permanente. Métricas arquivadas podem ser restauradas 
                a qualquer momento.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-red-200 bg-red-50">
          <div className="flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="px-6 py-2 text-sm font-semibold rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors min-h-[44px]"
            >
              ✓ Cancelar (Recomendado)
            </motion.button>

            <motion.button
              whileHover={isConfirmed ? { scale: 1.02 } : {}}
              whileTap={isConfirmed ? { scale: 0.98 } : {}}
              onClick={handleConfirm}
              disabled={!isConfirmed}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-xl transition-all min-h-[44px] ${
                isConfirmed
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50 hover:from-red-500 hover:to-red-600 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              🗑️ Confirmar Apagamento
            </motion.button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
