/**
 * STEP 3: ZONES & BASELINE - FASE 4 DIA 13
 * Performance Zones + Baseline Configuration
 * 
 * FEATURES:
 * - Add/remove zones
 * - Zone configurator (name, color, range)
 * - Baseline method selector
 * - Period days (rolling average)
 * - Manual value (manual baseline)
 * - All optional (pode saltar)
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, TrendingUp, Calendar } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  color: string;
  min: number;
  max: number;
}

interface Step3ZonesBaselineProps {
  data: {
    type: string;
    unit: string;
    scaleMin?: number;
    scaleMax?: number;
    zones: Zone[];
    baselineMethod: 'rolling-average' | 'manual' | 'percentile';
    baselinePeriodDays: number;
    baselineManualValue?: number;
  };
  updateData: (updates: Partial<Step3ZonesBaselineProps['data']>) => void;
  isMobile: boolean;
}

const zoneColors = [
  { value: 'emerald', label: 'Verde', class: 'bg-emerald-500', borderClass: 'border-emerald-500' },
  { value: 'sky', label: 'Azul', class: 'bg-sky-500', borderClass: 'border-sky-500' },
  { value: 'amber', label: 'Amarelo', class: 'bg-amber-500', borderClass: 'border-amber-500' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-500', borderClass: 'border-orange-500' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-500', borderClass: 'border-red-500' },
  { value: 'violet', label: 'Roxo', class: 'bg-violet-500', borderClass: 'border-violet-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500', borderClass: 'border-pink-500' },
  { value: 'slate', label: 'Cinza', class: 'bg-slate-500', borderClass: 'border-slate-500' },
];

export function Step3ZonesBaseline({ data, updateData, isMobile }: Step3ZonesBaselineProps) {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);

  const addZone = () => {
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: `Zona ${data.zones.length + 1}`,
      color: zoneColors[data.zones.length % zoneColors.length].value,
      min: 0,
      max: 100,
    };
    updateData({ zones: [...data.zones, newZone] });
    setExpandedZoneId(newZone.id);
  };

  const removeZone = (zoneId: string) => {
    updateData({ zones: data.zones.filter(z => z.id !== zoneId) });
    if (expandedZoneId === zoneId) {
      setExpandedZoneId(null);
    }
  };

  const updateZone = (zoneId: string, updates: Partial<Zone>) => {
    updateData({
      zones: data.zones.map(z => z.id === zoneId ? { ...z, ...updates } : z)
    });
  };

  const getColorClass = (colorValue: string) => {
    return zoneColors.find(c => c.value === colorValue)?.class || 'bg-slate-500';
  };

  const getBorderClass = (colorValue: string) => {
    return zoneColors.find(c => c.value === colorValue)?.borderClass || 'border-slate-500';
  };

  const showZones = data.type === 'scale';
  const showBaseline = data.type === 'scale' || data.type === 'count';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Zonas & Baseline</h2>
        <p className="text-sm text-slate-600">
          Configura zonas de performance e baseline (opcional)
        </p>
      </div>

      {/* Performance Zones */}
      {showZones && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span>📊</span>
                <span>Zonas de Performance</span>
                <span className="text-xs font-normal text-slate-500">(opcional)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Define intervalos que representam níveis de performance
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addZone}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all ${
                isMobile ? 'min-h-[44px]' : ''
              }`}
            >
              <Plus className="h-4 w-4" />
              {!isMobile && <span>Adicionar</span>}
            </motion.button>
          </div>

          {/* Zones List */}
          <AnimatePresence>
            {data.zones.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center"
              >
                <p className="text-sm text-slate-500">
                  Sem zonas definidas. Clica em "Adicionar" para criar uma zona.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {data.zones.map((zone, index) => {
                  const isExpanded = expandedZoneId === zone.id;
                  
                  return (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        getBorderClass(zone.color)
                      } bg-white`}
                    >
                      {/* Zone Header */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${getColorClass(zone.color)} shrink-0`} />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{zone.name}</p>
                          <p className="text-xs text-slate-600">
                            {zone.min} - {zone.max} {data.unit || ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setExpandedZoneId(isExpanded ? null : zone.id)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <span className="text-sm">{isExpanded ? '▲' : '▼'}</span>
                          </button>
                          
                          <button
                            onClick={() => removeZone(zone.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Zone Editor (expanded) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-200 space-y-3"
                          >
                            {/* Name */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Nome
                              </label>
                              <input
                                type="text"
                                value={zone.name}
                                onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                              />
                            </div>

                            {/* Color */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-2">
                                Cor
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {zoneColors.map((color) => (
                                  <button
                                    key={color.value}
                                    onClick={() => updateZone(zone.id, { color: color.value })}
                                    className={`w-8 h-8 rounded-lg ${color.class} transition-all ${
                                      zone.color === color.value
                                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                                        : 'hover:scale-105'
                                    }`}
                                    title={color.label}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Range */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                  Mínimo
                                </label>
                                <input
                                  type="number"
                                  value={zone.min}
                                  onChange={(e) => updateZone(zone.id, { 
                                    min: parseFloat(e.target.value) || 0 
                                  })}
                                  step="0.1"
                                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                  Máximo
                                </label>
                                <input
                                  type="number"
                                  value={zone.max}
                                  onChange={(e) => updateZone(zone.id, { 
                                    max: parseFloat(e.target.value) || 0 
                                  })}
                                  step="0.1"
                                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Baseline Configuration */}
      {showBaseline && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>Baseline de Referência</span>
              <span className="text-xs font-normal text-slate-500">(opcional)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Define como calcular o valor de referência para comparações
            </p>

            {/* Method Selector */}
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ baselineMethod: 'rolling-average' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  data.baselineMethod === 'rolling-average'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 bg-white hover:border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📊</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      Média Móvel (Rolling Average)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Calcula a média dos últimos X dias automaticamente
                    </p>
                  </div>
                  {data.baselineMethod === 'rolling-average' && (
                    <div className="text-sky-500 text-xl">✓</div>
                  )}
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ baselineMethod: 'manual' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  data.baselineMethod === 'manual'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 bg-white hover:border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✏️</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      Valor Manual
                    </h4>
                    <p className="text-xs text-slate-600">
                      Define um valor fixo como referência
                    </p>
                  </div>
                  {data.baselineMethod === 'manual' && (
                    <div className="text-sky-500 text-xl">✓</div>
                  )}
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ baselineMethod: 'percentile' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  data.baselineMethod === 'percentile'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 bg-white hover:border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📈</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      Percentil (P50)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Usa a mediana dos valores históricos
                    </p>
                  </div>
                  {data.baselineMethod === 'percentile' && (
                    <div className="text-sky-500 text-xl">✓</div>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Period Days (rolling-average only) */}
          {data.baselineMethod === 'rolling-average' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Período (dias)</span>
              </label>
              <input
                type="number"
                value={data.baselinePeriodDays}
                onChange={(e) => updateData({ 
                  baselinePeriodDays: parseInt(e.target.value) || 28 
                })}
                min="7"
                max="365"
                className={`w-full px-4 py-3 text-lg font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all ${
                  isMobile ? 'min-h-[44px]' : ''
                }`}
              />
              <p className="text-xs text-slate-500 mt-1">
                Média dos últimos {data.baselinePeriodDays} dias (recomendado: 28 dias)
              </p>
            </motion.div>
          )}

          {/* Manual Value (manual only) */}
          {data.baselineMethod === 'manual' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span>Valor de Referência</span>
              </label>
              <input
                type="number"
                placeholder="ex: 150"
                value={data.baselineManualValue ?? ''}
                onChange={(e) => updateData({ 
                  baselineManualValue: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                step="0.1"
                className={`w-full px-4 py-3 text-lg font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all ${
                  isMobile ? 'min-h-[44px]' : ''
                }`}
              />
              <p className="text-xs text-slate-500 mt-1">
                Este valor será usado como baseline fixo {data.unit ? `(${data.unit})` : ''}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Skip Message */}
      {(!showZones && !showBaseline) && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div className="text-4xl mb-3">⏩</div>
          <h4 className="font-semibold text-slate-900 mb-2">
            Zonas não aplicáveis a este tipo
          </h4>
          <p className="text-sm text-slate-600">
            Podes avançar para o próximo passo.
          </p>
        </div>
      )}

      {/* Helper Box */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <div className="flex gap-3">
          <div className="text-2xl shrink-0">💡</div>
          <div>
            <h4 className="font-semibold text-sky-900 text-sm mb-1">
              Dica: Zonas & Baseline são opcionais
            </h4>
            <p className="text-xs text-sky-800 leading-relaxed">
              Podes saltar esta configuração e adicioná-la mais tarde. 
              Zonas ajudam a visualizar performance em intervalos (ex: Zona Verde, Amarela, Vermelha).
              Baseline permite comparar valores atuais com uma referência.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
