/**
 * DELETE METRIC MODAL
 * Confirmação de apagamento individual de métrica
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X, Trash2, Archive, Users, Zap, Database } from 'lucide-react';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface DeleteMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    id: string;
    name: string;
    historicalEntries: number;
    affectedAthletes: number;
    automations: number;
  };
  onConfirm: (deleteType: 'soft' | 'hard', deleteData: boolean) => void;
}

export function DeleteMetricModal({ isOpen, onClose, metric, onConfirm }: DeleteMetricModalProps) {
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [deleteHistoricalData, setDeleteHistoricalData] = useState(false);

  const handleConfirm = () => {
    onConfirm(deleteType, deleteHistoricalData);
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col h-full min-h-0">
        {/* Header - NUNCA ESCONDE */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold">Apagar Métrica</h2>
                <p className="text-sm text-slate-600">Esta ação pode ser irreversível</p>
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

        {/* Content - SCROLL SE NECESSÁRIO */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
          {/* Metric Info */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              Tem a certeza que deseja apagar:
            </p>
            <p className="text-lg font-semibold text-slate-900">
              "{metric.name}"
            </p>
          </div>

          {/* Impact Summary */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-900">Esta ação irá:</p>
            
            {deleteType === 'soft' ? (
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <Archive className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-900 font-medium">Arquivar a métrica</p>
                    <p className="text-xs text-amber-700 mt-1">
                      A métrica será movida para "Arquivadas" e pode ser restaurada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-50 border border-sky-200">
                  <Database className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-sky-900 font-medium">
                      Manter dados históricos ({metric.historicalEntries} entradas)
                    </p>
                    <p className="text-xs text-sky-700 mt-1">
                      Os dados históricos permanecerão disponíveis
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <Zap className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-900 font-medium">
                      Desativar automações ({metric.automations})
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      As regras de automação serão pausadas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <Users className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-900 font-medium">
                      Afetar {metric.affectedAthletes} atletas
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      A métrica deixará de aparecer para estes atletas
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-900 font-medium">
                      Remover permanentemente a métrica
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Esta ação NÃO PODE ser desfeita!
                    </p>
                  </div>
                </div>

                {deleteHistoricalData && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                    <Database className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-900 font-medium">
                        Apagar {metric.historicalEntries} entradas de dados
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Todos os dados históricos serão perdidos permanentemente
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <Zap className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-900 font-medium">
                      Remover {metric.automations} regras de automação
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      As automações serão permanentemente removidas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <Users className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-900 font-medium">
                      {metric.affectedAthletes} atletas perderão esta métrica
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      Os atletas não terão mais acesso a esta métrica
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Type Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-900">Tipo de apagamento:</p>
            
            <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
              deleteType === 'soft'
                ? 'bg-amber-50 border-2 border-amber-300'
                : 'bg-white border-2 border-slate-200 hover:border-amber-200'
            }`}>
              <input
                type="radio"
                name="deleteType"
                value="soft"
                checked={deleteType === 'soft'}
                onChange={(e) => setDeleteType(e.target.value as 'soft')}
                className="h-5 w-5 text-amber-600 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  ✅ Soft Delete (Arquivar) <span className="text-xs font-normal text-amber-600">(Recomendado)</span>
                </p>
                <p className="text-xs text-slate-600">
                  A métrica será arquivada e pode ser restaurada a qualquer momento. 
                  Dados históricos são mantidos.
                </p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
              deleteType === 'hard'
                ? 'bg-red-50 border-2 border-red-300'
                : 'bg-white border-2 border-slate-200 hover:border-red-200'
            }`}>
              <input
                type="radio"
                name="deleteType"
                value="hard"
                checked={deleteType === 'hard'}
                onChange={(e) => setDeleteType(e.target.value as 'hard')}
                className="h-5 w-5 text-red-600 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  ⚠️ Hard Delete (Permanente)
                </p>
                <p className="text-xs text-slate-600">
                  A métrica será removida permanentemente e não pode ser recuperada. 
                  Use com extrema cautela!
                </p>
              </div>
            </label>
          </div>

          {/* Delete Historical Data Option */}
          {deleteType === 'hard' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteHistoricalData}
                  onChange={(e) => setDeleteHistoricalData(e.target.checked)}
                  className="h-5 w-5 text-red-600 rounded mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Também apagar dados históricos
                  </p>
                  <p className="text-xs text-red-700">
                    {metric.historicalEntries} entradas serão permanentemente removidas
                  </p>
                </div>
              </label>
            </motion.div>
          )}

          {/* Warning for Hard Delete */}
          {deleteType === 'hard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    ⚠️ ATENÇÃO: Ação Irreversível
                  </p>
                  <p className="text-xs text-red-700">
                    Hard Delete é uma ação permanente. Recomendamos usar Soft Delete 
                    para manter a possibilidade de recuperação.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer - SEMPRE VISÍVEL */}
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
              {deleteType === 'soft' ? 'Arquivar Métrica' : 'Apagar Permanentemente'}
            </motion.button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
