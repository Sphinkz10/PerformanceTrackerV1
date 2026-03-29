/**
 * LIVE PREVIEW - FASE 4 DIA 15 + TESTADOR INTERATIVO
 * Real-time preview of metric configuration + Interactive Tester
 * 
 * FEATURES:
 * - Desktop sidebar only (hidden mobile/tablet)
 * - Shows metric card preview
 * - Zones visualization
 * - Baseline indicator
 * - Updates in real-time
 * - Sticky position
 * - ✨ NEW: Interactive Tester (test values in zones)
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { MetricType, MetricCategory } from '@/types/metrics';

interface LivePreviewProps {
  data: {
    name: string;
    description: string;
    type: MetricType | '';
    unit: string;
    scaleMin?: number;
    scaleMax?: number;
    zones: Array<{
      id: string;
      name: string;
      color: string;
      min: number;
      max: number;
    }>;
    baselineMethod: 'rolling-average' | 'manual' | 'percentile';
    baselinePeriodDays: number;
    baselineManualValue?: number;
    category: MetricCategory | '';
    tags: string[];
    updateFrequency: 'daily' | 'per-session' | 'weekly' | 'on-demand';
  };
}

const typeIcons: Record<string, string> = {
  scale: '📊',
  boolean: '✅',
  duration: '⏱️',
  distance: '📏',
  count: '🔢',
  text: '📝',
};

const categoryIcons: Record<string, string> = {
  strength: '💪',
  conditioning: '🏃',
  wellbeing: '🧘',
  'body-composition': '📏',
  skill: '🎯',
  custom: '⭐',
};

const frequencyIcons: Record<string, string> = {
  daily: '📅',
  'per-session': '🏋️',
  weekly: '📊',
  'on-demand': '⚡',
};

export function LivePreview({ data }: LivePreviewProps) {
  const isComplete = !!(data.name && data.type && data.category);
  const hasZones = data.zones.length > 0;
  const hasBaseline = data.baselineMethod && (
    data.baselineMethod !== 'manual' || data.baselineManualValue !== undefined
  );

  // ✨ NEW: Interactive Tester State
  const [testValue, setTestValue] = useState<string>('');
  const [testResult, setTestResult] = useState<{
    value: number;
    zone: { name: string; color: string } | null;
    percentage?: number;
  } | null>(null);

  // ✨ NEW: Test value in zones
  const handleTestValue = () => {
    const numValue = parseFloat(testValue);
    if (isNaN(numValue)) return;

    // Find matching zone
    const matchingZone = data.zones.find(z => 
      numValue >= z.min && numValue <= z.max
    );

    // Calculate percentage vs baseline (if applicable)
    let percentage: number | undefined;
    if (data.baselineManualValue) {
      percentage = ((numValue - data.baselineManualValue) / data.baselineManualValue) * 100;
    }

    setTestResult({
      value: numValue,
      zone: matchingZone ? { name: matchingZone.name, color: matchingZone.color } : null,
      percentage,
    });
  };

  // Get zone color class
  const getZoneColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500',
      sky: 'bg-sky-500',
      amber: 'bg-amber-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      violet: 'bg-violet-500',
      pink: 'bg-pink-500',
      slate: 'bg-slate-500',
    };
    return colorMap[color] || 'bg-slate-500';
  };

  // Get zone text color class
  const getZoneTextClass = (color: string) => {
    const colorMap: Record<string, string> = {
      emerald: 'text-emerald-700',
      sky: 'text-sky-700',
      amber: 'text-amber-700',
      orange: 'text-orange-700',
      red: 'text-red-700',
      violet: 'text-violet-700',
      pink: 'text-pink-700',
      slate: 'text-slate-700',
    };
    return colorMap[color] || 'text-slate-700';
  };

  // Get zone bg light class
  const getZoneBgClass = (color: string) => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-50',
      sky: 'bg-sky-50',
      amber: 'bg-amber-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
      violet: 'bg-violet-50',
      pink: 'bg-pink-50',
      slate: 'bg-slate-50',
    };
    return colorMap[color] || 'bg-slate-50';
  };

  return (
    <div className="sticky top-0 h-screen overflow-y-auto p-6 space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Preview em Tempo Real</h3>
        <p className="text-xs text-slate-600">
          Visualiza como a métrica ficará
        </p>
      </div>

      {/* Completion Status */}
      <motion.div
        layout
        className={`p-4 rounded-xl border-2 ${
          isComplete 
            ? 'bg-emerald-50 border-emerald-500' 
            : 'bg-amber-50 border-amber-500'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          )}
          <div className="flex-1">
            <p className={`font-semibold text-sm ${
              isComplete ? 'text-emerald-900' : 'text-amber-900'
            }`}>
              {getCompletionPercentage()}% Completo
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {isComplete ? 'Pronto para criar!' : 'Alguns campos em falta'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionPercentage()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${
              isComplete 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                : 'bg-gradient-to-r from-amber-500 to-amber-600'
            }`}
          />
        </div>
      </motion.div>

      {/* Metric Card Preview */}
      <motion.div
        layout
        className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm"
      >
        {/* Icon & Type */}
        <div className="flex items-start gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 flex items-center justify-center text-2xl">
            {data.type ? typeIcons[data.type] : '❓'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 truncate">
              {data.name || 'Nome da Métrica'}
            </h4>
            <p className="text-xs text-slate-500">
              {data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Tipo não definido'}
              {data.unit && ` (${data.unit})`}
            </p>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {data.description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Category */}
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Target className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-500 font-semibold">Categoria</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {data.category ? (
                <span>
                  {categoryIcons[data.category]} {data.category}
                </span>
              ) : (
                <span className="text-slate-400">Não definida</span>
              )}
            </p>
          </div>

          {/* Frequency */}
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-500 font-semibold">Frequência</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {frequencyIcons[data.updateFrequency]} {data.updateFrequency}
            </p>
          </div>
        </div>

        {/* Range (scale only) */}
        {data.type === 'scale' && data.scaleMin !== undefined && data.scaleMax !== undefined && (
          <div className="p-3 bg-gradient-to-br from-sky-50 to-white border border-sky-200 rounded-lg mb-3">
            <p className="text-xs text-slate-600 font-semibold mb-1">Intervalo</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-sky-600">{data.scaleMin}</span>
              <div className="flex-1 mx-3 h-1 bg-sky-200 rounded-full" />
              <span className="text-lg font-bold text-sky-600">{data.scaleMax}</span>
            </div>
            {data.unit && (
              <p className="text-xs text-sky-600 text-center mt-1">{data.unit}</p>
            )}
          </div>
        )}

        {/* Tags */}
        {data.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-500 font-semibold">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Zones Preview */}
      {hasZones && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="text-lg">📊</div>
            <h4 className="font-semibold text-slate-900 text-sm">
              Zonas de Performance
            </h4>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
              {data.zones.length}
            </span>
          </div>

          <div className="space-y-2">
            {data.zones.map((zone) => (
              <div 
                key={zone.id}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
              >
                <div className={`w-3 h-3 rounded ${getZoneColorClass(zone.color)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {zone.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {zone.min} - {zone.max} {data.unit || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Baseline Preview */}
      {hasBaseline && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">
              Baseline
            </h4>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm font-semibold text-emerald-900 mb-1">
              {data.baselineMethod === 'rolling-average' && 'Média Móvel'}
              {data.baselineMethod === 'manual' && 'Valor Manual'}
              {data.baselineMethod === 'percentile' && 'Percentil (P50)'}
            </p>
            <p className="text-xs text-emerald-700">
              {data.baselineMethod === 'rolling-average' && 
                `Últimos ${data.baselinePeriodDays} dias`}
              {data.baselineMethod === 'manual' && data.baselineManualValue !== undefined &&
                `Valor: ${data.baselineManualValue} ${data.unit || ''}`}
              {data.baselineMethod === 'percentile' && 
                'Mediana dos valores históricos'}
            </p>
          </div>
        </motion.div>
      )}

      {/* ✨ NEW: Interactive Tester */}
      {hasZones && (
        <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-lg">📊</div>
            <h4 className="font-semibold text-slate-900 text-sm">
              Testador Interativo
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="Digite um valor"
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
            <button
              onClick={handleTestValue}
              className="p-2 bg-emerald-500 text-white rounded-lg"
            >
              Testar
            </button>
          </div>

          {testResult && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-900">
                Valor Testado: {testResult.value} {data.unit || ''}
              </p>
              {testResult.zone && (
                <div
                  className={`p-2 bg-${getZoneBgClass(testResult.zone.color)} border border-${testResult.zone.color} rounded-lg`}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    Zona: {testResult.zone.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    Cor: {testResult.zone.color}
                  </p>
                </div>
              )}
              {testResult.percentage !== undefined && (
                <p className="text-sm font-semibold text-slate-900 mt-2">
                  Percentual vs Baseline: {testResult.percentage.toFixed(2)}%
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!data.name && !data.type && (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">👈</div>
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Começa a preencher!
          </p>
          <p className="text-xs text-slate-600">
            O preview atualiza em tempo real
          </p>
        </div>
      )}

      {/* Helper */}
      <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
        <p className="text-xs text-sky-800 leading-relaxed">
          💡 <strong>Dica:</strong> Este preview mostra como a métrica aparecerá na biblioteca após ser criada.
        </p>
      </div>
    </div>
  );
}