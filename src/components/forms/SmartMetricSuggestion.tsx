/**
 * SmartMetricSuggestion Component
 * 
 * AI-like smart suggestions for creating metrics from form fields.
 * Analyzes field type, label, and config to suggest optimal metric configuration.
 * 
 * Features:
 * - Auto-detect field intent (e.g., "Sleep Quality" → wellness metric)
 * - Suggest metric type, category, unit, zones
 * - One-click metric creation with pre-filled config
 * - Duplicate detection (warns if similar metric exists)
 * - Template matching (offers common templates)
 * 
 * Usage:
 * <SmartMetricSuggestion
 *   field={formField}
 *   existingMetrics={allMetrics}
 *   onCreateMetric={(config) => handleCreate(config)}
 *   onUseDuplicate={(metricId) => handleLink(metricId)}
 * />
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Heart,
  Activity,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import type { FormField, Metric, MetricCategory, MetricType } from '@/types/metrics';

// ============================================================================
// TYPES
// ============================================================================

export interface SuggestedMetricConfig {
  name: string;
  type: MetricType;
  category: MetricCategory;
  unit?: string;
  scaleMin?: number;
  scaleMax?: number;
  zones?: Array<{ min: number; max: number; label: string; color: string }>;
  baseline?: number;
  confidence: number; // 0-100
  reasoning: string[];
}

export interface SmartMetricSuggestionProps {
  field: FormField;
  existingMetrics: Metric[];
  onCreateMetric: (config: SuggestedMetricConfig) => void;
  onUseDuplicate: (metricId: string) => void;
  onDismiss: () => void;
}

// ============================================================================
// SMART ANALYZER (The AI-like magic!)
// ============================================================================

function analyzeField(field: FormField, existingMetrics: Metric[]): {
  suggestions: SuggestedMetricConfig[];
  duplicates: Metric[];
} {
  const label = field.fieldLabel.toLowerCase();
  const fieldType = field.fieldType;
  
  // Pattern matching keywords
  const patterns = {
    sleep: /sleep|sono|descanso|rest/i,
    pain: /pain|dor|soreness|lesão|injury/i,
    energy: /energy|energia|fadiga|fatigue|cansaço/i,
    mood: /mood|humor|motivação|motivation/i,
    stress: /stress|ansiedade|anxiety/i,
    hrv: /hrv|heart rate variability|variabilidade/i,
    rpe: /rpe|esforço|exertion|percep/i,
    weight: /weight|peso|mass|kg/i,
    load: /load|carga|volume|tonnage/i,
    speed: /speed|velocidade|pace|ritmo/i,
  };

  const suggestions: SuggestedMetricConfig[] = [];
  const reasoning: string[] = [];

  // 🔥 SMART DETECTION LOGIC

  // Sleep Quality Detection
  if (patterns.sleep.test(label)) {
    if (fieldType === 'number' && (label.includes('hour') || label.includes('hora'))) {
      suggestions.push({
        name: 'Sleep Duration',
        type: 'numeric',
        category: 'wellness',
        unit: 'hours',
        zones: [
          { min: 0, max: 5, label: 'Insufficient', color: 'red' },
          { min: 5, max: 7, label: 'Below Optimal', color: 'amber' },
          { min: 7, max: 9, label: 'Optimal', color: 'emerald' },
          { min: 9, max: 24, label: 'Excessive', color: 'amber' },
        ],
        baseline: 8,
        confidence: 95,
        reasoning: [
          'Field contains "sleep" + "hours"',
          'Numeric type perfect for duration',
          'Standard sleep zones applied (7-9h optimal)',
        ],
      });
    } else {
      suggestions.push({
        name: 'Sleep Quality',
        type: 'scale',
        category: 'wellness',
        scaleMin: 1,
        scaleMax: 10,
        zones: [
          { min: 1, max: 4, label: 'Poor', color: 'red' },
          { min: 5, max: 6, label: 'Fair', color: 'amber' },
          { min: 7, max: 8, label: 'Good', color: 'emerald' },
          { min: 9, max: 10, label: 'Excellent', color: 'emerald' },
        ],
        baseline: 7,
        confidence: 90,
        reasoning: [
          'Field label contains "sleep"',
          'Scale type ideal for subjective quality',
          '1-10 scale is standard for wellness metrics',
        ],
      });
    }
  }

  // Pain/Soreness Detection
  if (patterns.pain.test(label)) {
    suggestions.push({
      name: field.fieldLabel.includes('knee') || field.fieldLabel.includes('joelho') 
        ? 'Knee Pain Level'
        : 'Pain Level',
      type: 'scale',
      category: 'wellness',
      scaleMin: 0,
      scaleMax: 10,
      zones: [
        { min: 0, max: 2, label: 'Minimal', color: 'emerald' },
        { min: 3, max: 5, label: 'Moderate', color: 'amber' },
        { min: 6, max: 8, label: 'High', color: 'orange' },
        { min: 9, max: 10, label: 'Critical', color: 'red' },
      ],
      baseline: 2,
      confidence: 92,
      reasoning: [
        'Field indicates pain/soreness',
        '0-10 pain scale is medical standard',
        'Lower values = better (inverted metric)',
      ],
    });
  }

  // HRV Detection
  if (patterns.hrv.test(label)) {
    suggestions.push({
      name: 'HRV (Heart Rate Variability)',
      type: 'numeric',
      category: 'performance',
      unit: 'ms',
      zones: [
        { min: 0, max: 40, label: 'Critical', color: 'red' },
        { min: 40, max: 60, label: 'Below Baseline', color: 'amber' },
        { min: 60, max: 80, label: 'Optimal', color: 'emerald' },
        { min: 80, max: 200, label: 'Excellent', color: 'emerald' },
      ],
      baseline: 65,
      confidence: 98,
      reasoning: [
        'HRV detected - key recovery metric',
        'Milliseconds (ms) is standard unit',
        'Typical athlete baseline: 60-80ms',
      ],
    });
  }

  // RPE Detection
  if (patterns.rpe.test(label)) {
    suggestions.push({
      name: 'RPE (Rate of Perceived Exertion)',
      type: 'scale',
      category: 'performance',
      scaleMin: 1,
      scaleMax: 10,
      zones: [
        { min: 1, max: 3, label: 'Light', color: 'emerald' },
        { min: 4, max: 6, label: 'Moderate', color: 'amber' },
        { min: 7, max: 8, label: 'Hard', color: 'orange' },
        { min: 9, max: 10, label: 'Maximal', color: 'red' },
      ],
      baseline: 6,
      confidence: 96,
      reasoning: [
        'RPE/Exertion detected',
        'Borg CR-10 scale (1-10)',
        'Standard in sports science',
      ],
    });
  }

  // Weight Detection
  if (patterns.weight.test(label) && fieldType === 'number') {
    suggestions.push({
      name: 'Body Weight',
      type: 'numeric',
      category: 'wellness',
      unit: 'kg',
      confidence: 94,
      reasoning: [
        'Weight/Peso detected',
        'Numeric field with "kg" unit',
        'Common anthropometric metric',
      ],
    });
  }

  // Load Detection
  if (patterns.load.test(label) && fieldType === 'number') {
    suggestions.push({
      name: 'Training Load',
      type: 'numeric',
      category: 'load',
      unit: 'AU', // Arbitrary Units
      zones: [
        { min: 0, max: 300, label: 'Low', color: 'emerald' },
        { min: 300, max: 600, label: 'Moderate', color: 'amber' },
        { min: 600, max: 900, label: 'High', color: 'orange' },
        { min: 900, max: 10000, label: 'Very High', color: 'red' },
      ],
      confidence: 88,
      reasoning: [
        'Load/Carga detected',
        'Numeric field suitable for load tracking',
        'AU (Arbitrary Units) standard',
      ],
    });
  }

  // Generic fallback based on field type
  if (suggestions.length === 0) {
    if (fieldType === 'number') {
      suggestions.push({
        name: field.fieldLabel,
        type: 'numeric',
        category: 'custom',
        confidence: 60,
        reasoning: [
          'Numeric field detected',
          'No specific pattern matched',
          'Generic numeric metric suggested',
        ],
      });
    } else if (fieldType === 'select' || fieldType === 'checkbox') {
      suggestions.push({
        name: field.fieldLabel,
        type: 'scale',
        category: 'custom',
        scaleMin: 1,
        scaleMax: 5,
        confidence: 55,
        reasoning: [
          'Select/Checkbox field',
          'Scale metric works for ordinal data',
          'Default 1-5 scale',
        ],
      });
    }
  }

  // 🔍 DUPLICATE DETECTION
  const duplicates = existingMetrics.filter(metric => {
    const metricName = metric.name.toLowerCase();
    const similarity = 
      label.includes(metricName) || 
      metricName.includes(label) ||
      (metric.type === suggestions[0]?.type && metric.category === suggestions[0]?.category);
    return similarity;
  });

  return { suggestions, duplicates };
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SmartMetricSuggestion: React.FC<SmartMetricSuggestionProps> = ({
  field,
  existingMetrics,
  onCreateMetric,
  onUseDuplicate,
  onDismiss,
}) => {
  const analysis = useMemo(
    () => analyzeField(field, existingMetrics),
    [field, existingMetrics]
  );

  const { suggestions, duplicates } = analysis;
  const topSuggestion = suggestions[0];

  if (!topSuggestion) return null;

  const getCategoryIcon = (category: MetricCategory) => {
    switch (category) {
      case 'performance': return Activity;
      case 'wellness': return Heart;
      case 'load': return Zap;
      default: return Target;
    }
  };

  const CategoryIcon = getCategoryIcon(topSuggestion.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900 text-sm">Smart Suggestion</h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              {topSuggestion.confidence}% confidence
            </span>
          </div>
          <p className="text-xs text-slate-600">
            We detected this field could map to a metric
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Duplicate Warning */}
      {duplicates.length > 0 && (
        <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-900 mb-1">
                Similar metric{duplicates.length > 1 ? 's' : ''} already exist{duplicates.length === 1 ? 's' : ''}
              </p>
              <div className="space-y-1">
                {duplicates.slice(0, 2).map(dup => (
                  <div key={dup.id} className="flex items-center justify-between">
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">{dup.name}</span>
                      <span className="text-amber-600"> • {dup.category}</span>
                    </p>
                    <button
                      onClick={() => onUseDuplicate(dup.id)}
                      className="text-xs font-medium text-amber-700 hover:text-amber-900 hover:underline"
                    >
                      Use this
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Metric */}
      <div className="mb-3 p-3 rounded-lg bg-white border-2 border-violet-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <CategoryIcon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-slate-900 text-sm">{topSuggestion.name}</h5>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="capitalize">{topSuggestion.type}</span>
              <span>•</span>
              <span className="capitalize">{topSuggestion.category}</span>
              {topSuggestion.unit && (
                <>
                  <span>•</span>
                  <span>{topSuggestion.unit}</span>
                </>
              )}
              {topSuggestion.scaleMin !== undefined && (
                <>
                  <span>•</span>
                  <span>{topSuggestion.scaleMin}-{topSuggestion.scaleMax}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Zones Preview */}
        {topSuggestion.zones && topSuggestion.zones.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700 mb-1">Auto-configured zones:</p>
            <div className="flex gap-1">
              {topSuggestion.zones.map((zone, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-6 rounded text-[10px] font-medium text-white flex items-center justify-center"
                  style={{
                    backgroundColor:
                      zone.color === 'emerald' ? '#10b981' :
                      zone.color === 'amber' ? '#f59e0b' :
                      zone.color === 'orange' ? '#f97316' :
                      zone.color === 'red' ? '#ef4444' : '#64748b'
                  }}
                >
                  {zone.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reasoning */}
      <div className="mb-3 space-y-1">
        <p className="text-xs font-medium text-slate-700">Why this suggestion?</p>
        {topSuggestion.reasoning.map((reason, idx) => (
          <p key={idx} className="text-xs text-slate-600 flex items-start gap-2">
            <span className="text-violet-500">•</span>
            <span>{reason}</span>
          </p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCreateMetric(topSuggestion)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Create & Link Metric
          <ArrowRight className="h-4 w-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDismiss}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
        >
          Dismiss
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPACT VARIANT (for inline suggestions)
// ============================================================================

export const SmartMetricSuggestionCompact: React.FC<SmartMetricSuggestionProps> = ({
  field,
  existingMetrics,
  onCreateMetric,
  onDismiss,
}) => {
  const analysis = useMemo(
    () => analyzeField(field, existingMetrics),
    [field, existingMetrics]
  );

  const topSuggestion = analysis.suggestions[0];
  if (!topSuggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 border border-violet-200"
    >
      <Sparkles className="h-4 w-4 text-violet-600" />
      <p className="text-xs text-slate-700">
        <span className="font-medium">Suggestion:</span> {topSuggestion.name}
      </p>
      <button
        onClick={() => onCreateMetric(topSuggestion)}
        className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
      >
        Create
      </button>
      <button
        onClick={onDismiss}
        className="h-5 w-5 rounded hover:bg-violet-100 flex items-center justify-center text-violet-400 hover:text-violet-600 transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
};
