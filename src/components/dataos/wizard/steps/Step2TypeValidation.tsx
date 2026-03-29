/**
 * STEP 2: TYPE VALIDATION - FASE 4 DIA 13
 * Unit, Scale Range, Validação específica do tipo
 * 
 * FEATURES:
 * - Conditional fields baseado no tipo
 * - Unit input (scale, distance, duration)
 * - Scale min/max (scale only)
 * - Validation inline
 * - Helper texts dinâmicos
 */

'use client';

import { motion } from 'motion/react';
import { Hash, Ruler } from 'lucide-react';
import type { MetricType } from '@/types/metrics';

interface Step2TypeValidationProps {
  data: {
    type: MetricType | '';
    unit: string;
    scaleMin?: number;
    scaleMax?: number;
  };
  updateData: (updates: Partial<Step2TypeValidationProps['data']>) => void;
  isMobile: boolean;
}

export function Step2TypeValidation({ data, updateData, isMobile }: Step2TypeValidationProps) {
  const showUnitField = data.type === 'scale' || data.type === 'distance' || data.type === 'duration';
  const showScaleRange = data.type === 'scale';

  const getUnitPlaceholder = (): string => {
    switch (data.type) {
      case 'scale':
        return 'ex: kg, RPE, bpm, %, watts...';
      case 'distance':
        return 'ex: km, m, mi...';
      case 'duration':
        return 'ex: min, h, s...';
      default:
        return '';
    }
  };

  const getUnitHelperText = (): string => {
    switch (data.type) {
      case 'scale':
        return 'A unidade será exibida junto aos valores (ex: 150 kg, RPE 8)';
      case 'distance':
        return 'Usa unidades de comprimento padrão (km, metros, milhas)';
      case 'duration':
        return 'Usa unidades de tempo (minutos, horas, segundos)';
      default:
        return '';
    }
  };

  // Validation
  const scaleRangeError = 
    showScaleRange && 
    data.scaleMin !== undefined && 
    data.scaleMax !== undefined && 
    data.scaleMin >= data.scaleMax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Validação & Unidades</h2>
        <p className="text-sm text-slate-600">
          Define as regras de validação para esta métrica
        </p>
      </div>

      {/* Type Summary */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {data.type === 'scale' && '📊'}
            {data.type === 'boolean' && '✅'}
            {data.type === 'duration' && '⏱️'}
            {data.type === 'distance' && '📏'}
            {data.type === 'count' && '🔢'}
            {data.type === 'text' && '📝'}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Tipo Selecionado</p>
            <p className="text-sm font-semibold text-slate-900">
              {data.type === 'scale' && 'Escala Numérica'}
              {data.type === 'boolean' && 'Sim/Não'}
              {data.type === 'duration' && 'Duração'}
              {data.type === 'distance' && 'Distância'}
              {data.type === 'count' && 'Contagem'}
              {data.type === 'text' && 'Texto Livre'}
            </p>
          </div>
        </div>
      </div>

      {/* Unit Field (conditional) */}
      {showUnitField && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Ruler className="h-4 w-4" />
            <span>Unidade de Medida</span>
            {data.type === 'scale' && <span className="text-red-500">*</span>}
            {data.type !== 'scale' && (
              <span className="text-xs font-normal text-slate-500">(opcional)</span>
            )}
          </label>
          <input
            type="text"
            placeholder={getUnitPlaceholder()}
            value={data.unit}
            onChange={(e) => updateData({ unit: e.target.value })}
            className={`w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all ${
              isMobile ? 'min-h-[44px]' : ''
            }`}
          />
          <p className="text-xs text-slate-500 mt-1">
            {getUnitHelperText()}
          </p>
        </motion.div>
      )}

      {/* Scale Range (scale type only) */}
      {showScaleRange && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Hash className="h-4 w-4" />
              <span>Intervalo de Valores</span>
              <span className="text-red-500">*</span>
            </label>
            
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {/* Min */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Valor Mínimo
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={data.scaleMin ?? ''}
                  onChange={(e) => updateData({ 
                    scaleMin: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  step="0.1"
                  className={`w-full px-4 py-3 text-lg font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all ${
                    scaleRangeError ? 'border-red-300 bg-red-50' : ''
                  } ${isMobile ? 'min-h-[44px]' : ''}`}
                />
              </div>

              {/* Max */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Valor Máximo
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={data.scaleMax ?? ''}
                  onChange={(e) => updateData({ 
                    scaleMax: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  step="0.1"
                  className={`w-full px-4 py-3 text-lg font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all ${
                    scaleRangeError ? 'border-red-300 bg-red-50' : ''
                  } ${isMobile ? 'min-h-[44px]' : ''}`}
                />
              </div>
            </div>

            {/* Error Message */}
            {scaleRangeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-xs text-red-600 font-semibold">
                  ⚠️ O valor mínimo deve ser menor que o valor máximo
                </p>
              </motion.div>
            )}

            {/* Range Preview */}
            {!scaleRangeError && data.scaleMin !== undefined && data.scaleMax !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <p className="text-xs text-emerald-700 font-semibold">
                  ✅ Valores aceites: {data.scaleMin} - {data.scaleMax} {data.unit || ''}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Boolean/Count/Text Types - No validation needed */}
      {!showUnitField && !showScaleRange && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
        >
          <div className="text-4xl mb-3">✅</div>
          <h4 className="font-semibold text-emerald-900 mb-2">
            Sem validação adicional necessária
          </h4>
          <p className="text-sm text-emerald-800">
            {data.type === 'boolean' && 'Valores binários não requerem configuração adicional.'}
            {data.type === 'count' && 'Contagens aceitam qualquer número inteiro positivo.'}
            {data.type === 'text' && 'Texto livre aceita qualquer input textual.'}
          </p>
        </motion.div>
      )}

      {/* Helper Box */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <div className="flex gap-3">
          <div className="text-2xl shrink-0">💡</div>
          <div>
            <h4 className="font-semibold text-sky-900 text-sm mb-1">
              Dica: Validação ajuda na qualidade dos dados
            </h4>
            <p className="text-xs text-sky-800 leading-relaxed">
              Definir limites adequados previne erros de entrada e garante dados consistentes.
              {showScaleRange && ' Por exemplo: RPE vai de 0 a 10, não faz sentido aceitar valores negativos ou acima de 10.'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
