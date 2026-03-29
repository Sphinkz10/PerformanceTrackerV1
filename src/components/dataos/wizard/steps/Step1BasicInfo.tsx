/**
 * STEP 1: BASIC INFO - FASE 4 DIA 13
 * Nome, Descrição, Tipo da Métrica
 * 
 * FEATURES:
 * - Nome input (obrigatório)
 * - Descrição textarea (opcional)
 * - Tipo selection grid (6 tipos com emojis)
 * - Responsive (mobile/desktop)
 * - Validação inline
 */

'use client';

import { motion } from 'motion/react';
import type { MetricType } from '@/types/metrics';

interface Step1BasicInfoProps {
  data: {
    name: string;
    description: string;
    type: MetricType | '';
  };
  updateData: (updates: Partial<Step1BasicInfoProps['data']>) => void;
  isMobile: boolean;
}

const metricTypes: Array<{ value: MetricType; label: string; description: string; icon: string }> = [
  { 
    value: 'scale', 
    label: 'Escala Numérica', 
    description: 'Valores numéricos com min/max',
    icon: '📊' 
  },
  { 
    value: 'boolean', 
    label: 'Sim/Não', 
    description: 'Valores binários (verdadeiro/falso)',
    icon: '✅' 
  },
  { 
    value: 'duration', 
    label: 'Duração', 
    description: 'Tempo decorrido (min, horas)',
    icon: '⏱️' 
  },
  { 
    value: 'distance', 
    label: 'Distância', 
    description: 'Comprimento percorrido (km, m)',
    icon: '📏' 
  },
  { 
    value: 'count', 
    label: 'Contagem', 
    description: 'Número de repetições/ocorrências',
    icon: '🔢' 
  },
  { 
    value: 'text', 
    label: 'Texto Livre', 
    description: 'Notas qualitativas abertas',
    icon: '📝' 
  },
];

export function Step1BasicInfo({ data, updateData, isMobile }: Step1BasicInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Informação Básica</h2>
        <p className="text-sm text-slate-600">
          Define o nome e tipo da métrica que vais acompanhar
        </p>
      </div>

      {/* Name Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <span>Nome da Métrica</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="ex: RPE Sessão, Peso Corporal, Horas de Sono..."
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className={`w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all ${
            isMobile ? 'min-h-[44px]' : ''
          }`}
          autoFocus
        />
        <p className="text-xs text-slate-500 mt-1">
          💡 Usa nomes claros e específicos para facilitar a identificação
        </p>
      </div>

      {/* Description Textarea */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <span>Descrição</span>
          <span className="text-xs font-normal text-slate-500">(opcional)</span>
        </label>
        <textarea
          placeholder="Descreve o que esta métrica mede e como deve ser interpretada..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={isMobile ? 3 : 4}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
        />
      </div>

      {/* Type Selection Grid */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <span>Tipo de Dados</span>
          <span className="text-red-500">*</span>
        </label>
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {metricTypes.map((type, index) => {
            const isSelected = data.type === type.value;
            return (
              <motion.button
                key={type.value}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ type: type.value })}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isMobile ? 'min-h-[100px]' : 'min-h-[120px]'
                } ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/50'
                }`}
              >
                {/* Icon */}
                <div className="text-3xl mb-2">{type.icon}</div>
                
                {/* Label */}
                <h4 className="font-semibold text-slate-900 text-sm mb-1">
                  {type.label}
                </h4>
                
                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2">
                  {type.description}
                </p>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedType"
                    className="absolute top-2 right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Helper Box */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <div className="flex gap-3">
          <div className="text-2xl shrink-0">💡</div>
          <div>
            <h4 className="font-semibold text-sky-900 text-sm mb-1">
              Dica: Escolhe o tipo correto
            </h4>
            <p className="text-xs text-sky-800 leading-relaxed">
              O tipo determina como os dados serão validados, agregados e visualizados. 
              Não pode ser alterado depois da criação.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
