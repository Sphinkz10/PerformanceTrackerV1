/**
 * UnitConversionBuilder Component
 * 
 * Visual interface for configuring unit conversions.
 * Select from → to units and see preview.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import type { UnitCategory } from '@/types/transformations';
import { UNITS, findConversion } from './transformTemplates';
import { applyTransformation } from '@/utils/transformations';

// ============================================================================
// TYPES
// ============================================================================

export interface UnitConversionBuilderProps {
  category: UnitCategory;
  onApply: (config: {
    fromUnit: string;
    toUnit: string;
    factor: number;
    formula?: string;
  }) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORY_LABELS: Record<UnitCategory, string> = {
  weight: '⚖️ Peso',
  distance: '📏 Distância',
  time: '⏱️ Tempo',
  temperature: '🌡️ Temperatura',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const UnitConversionBuilder: React.FC<UnitConversionBuilderProps> = ({
  category,
  onApply,
  className = '',
}) => {
  const units = UNITS[category] || [];

  const [fromUnit, setFromUnit] = useState(units[0]?.id || '');
  const [toUnit, setToUnit] = useState(units[1]?.id || '');
  const [testValue, setTestValue] = useState(10);

  // Get conversion configuration
  const conversion = useMemo(() => {
    if (!fromUnit || !toUnit || fromUnit === toUnit) {
      return null;
    }

    return findConversion(fromUnit, toUnit, category);
  }, [fromUnit, toUnit, category]);

  // Calculate preview
  const previewResult = useMemo(() => {
    if (!conversion) {
      return null;
    }

    try {
      let result: number;

      if (conversion.formula) {
        // Use custom formula (e.g., temperature conversions)
        result = applyTransformation(testValue, 'custom', { formula: conversion.formula });
      } else {
        // Use multiplication factor
        result = testValue * conversion.factor;
      }

      return result;
    } catch (error) {
      return null;
    }
  }, [conversion, testValue]);

  // Get unit labels
  const fromUnitLabel = units.find(u => u.id === fromUnit)?.symbol || fromUnit;
  const toUnitLabel = units.find(u => u.id === toUnit)?.symbol || toUnit;

  // Handle apply
  const handleApply = () => {
    if (!conversion) return;

    onApply({
      fromUnit,
      toUnit,
      factor: conversion.factor,
      formula: conversion.formula,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          {CATEGORY_LABELS[category]}
        </h3>
        <p className="text-xs text-slate-600">
          Configurar conversão de unidades
        </p>
      </div>

      {/* Unit Selectors */}
      <div className="flex items-center gap-3">
        {/* From Unit */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            De:
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          >
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Arrow */}
        <div className="pt-6">
          <ArrowRight className="h-5 w-5 text-slate-400" />
        </div>

        {/* To Unit */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Para:
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          >
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Same Unit Warning */}
      {fromUnit === toUnit && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-700">
            ⚠️ As unidades origem e destino são iguais. Selecione unidades diferentes.
          </p>
        </div>
      )}

      {/* No Conversion Available */}
      {fromUnit !== toUnit && !conversion && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs text-red-700">
            ❌ Conversão de {fromUnitLabel} para {toUnitLabel} não disponível.
          </p>
        </div>
      )}

      {/* Preview */}
      {conversion && fromUnit !== toUnit && (
        <>
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-700">
              Testar com valor:
            </label>

            <input
              type="number"
              value={testValue}
              onChange={(e) => setTestValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-sky-900">
                    {testValue}
                  </p>
                  <p className="text-xs text-sky-600 mt-1">
                    {fromUnitLabel}
                  </p>
                </div>

                <ArrowRight className="h-6 w-6 text-sky-600" />

                <div className="text-center">
                  <p className="text-2xl font-semibold text-sky-900">
                    {previewResult !== null ? previewResult.toFixed(2) : '—'}
                  </p>
                  <p className="text-xs text-sky-600 mt-1">
                    {toUnitLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Info */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">
              Factor de conversão:
            </p>
            <p className="text-sm font-mono text-slate-900">
              {conversion.formula ? (
                conversion.formula
              ) : (
                `1 ${fromUnitLabel} = ${conversion.factor} ${toUnitLabel}`
              )}
            </p>
          </div>

          {/* Apply Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            <Play className="h-4 w-4" />
            Aplicar Conversão
          </motion.button>
        </>
      )}
    </div>
  );
};
