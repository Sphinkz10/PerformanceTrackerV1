/**
 * CORRELATION MATRIX - Metric correlation heatmap
 * Discover relationships between metrics
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Grid3x3, TrendingUp, AlertCircle, Sparkles, Info } from 'lucide-react';

interface CorrelationData {
  metric1: string;
  metric2: string;
  correlation: number;
  strength: 'very strong' | 'strong' | 'moderate' | 'weak' | 'very weak';
  direction: 'positive' | 'negative';
}

const METRICS = [
  'HRV',
  'Training Load',
  'Sleep Hours',
  'Wellness',
  'Fatigue',
  'Performance',
  'Recovery Score',
  'Stress Level',
];

// Generate correlation matrix (mock data)
const generateCorrelationMatrix = (): number[][] => {
  const matrix: number[][] = [];
  
  for (let i = 0; i < METRICS.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < METRICS.length; j++) {
      if (i === j) {
        matrix[i][j] = 1.0; // Perfect correlation with itself
      } else if (j < i) {
        // Mirror the upper triangle
        matrix[i][j] = matrix[j][i];
      } else {
        // Generate realistic correlations
        let correlation = 0;
        
        // Define some known relationships
        if (
          (METRICS[i] === 'HRV' && METRICS[j] === 'Recovery Score') ||
          (METRICS[i] === 'Sleep Hours' && METRICS[j] === 'Wellness') ||
          (METRICS[i] === 'Wellness' && METRICS[j] === 'Performance')
        ) {
          correlation = 0.7 + Math.random() * 0.2; // Strong positive
        } else if (
          (METRICS[i] === 'Fatigue' && METRICS[j] === 'Performance') ||
          (METRICS[i] === 'Stress Level' && METRICS[j] === 'HRV') ||
          (METRICS[i] === 'Training Load' && METRICS[j] === 'Fatigue')
        ) {
          correlation = -(0.5 + Math.random() * 0.3); // Moderate/strong negative
        } else {
          correlation = (Math.random() - 0.5) * 0.8; // Random weak correlation
        }
        
        matrix[i][j] = Math.round(correlation * 100) / 100;
      }
    }
  }
  
  return matrix;
};

const getCorrelationStrength = (correlation: number): CorrelationData['strength'] => {
  const abs = Math.abs(correlation);
  if (abs >= 0.8) return 'very strong';
  if (abs >= 0.6) return 'strong';
  if (abs >= 0.4) return 'moderate';
  if (abs >= 0.2) return 'weak';
  return 'very weak';
};

const getCorrelationColor = (correlation: number): string => {
  const abs = Math.abs(correlation);
  
  if (correlation > 0) {
    // Positive - emerald scale
    if (abs >= 0.8) return 'bg-emerald-600';
    if (abs >= 0.6) return 'bg-emerald-500';
    if (abs >= 0.4) return 'bg-emerald-400';
    if (abs >= 0.2) return 'bg-emerald-300';
    return 'bg-emerald-100';
  } else {
    // Negative - red scale
    if (abs >= 0.8) return 'bg-red-600';
    if (abs >= 0.6) return 'bg-red-500';
    if (abs >= 0.4) return 'bg-red-400';
    if (abs >= 0.2) return 'bg-red-300';
    return 'bg-red-100';
  }
};

const getTextColor = (correlation: number): string => {
  const abs = Math.abs(correlation);
  return abs >= 0.4 ? 'text-white' : 'text-slate-900';
};

export function CorrelationMatrix() {
  const [selectedCell, setSelectedCell] = useState<{ i: number; j: number } | null>(null);
  const [matrix] = useState(generateCorrelationMatrix());

  // Find strongest correlations
  const correlations: CorrelationData[] = [];
  for (let i = 0; i < METRICS.length; i++) {
    for (let j = i + 1; j < METRICS.length; j++) {
      correlations.push({
        metric1: METRICS[i],
        metric2: METRICS[j],
        correlation: matrix[i][j],
        strength: getCorrelationStrength(matrix[i][j]),
        direction: matrix[i][j] > 0 ? 'positive' : 'negative',
      });
    }
  }

  const strongestPositive = [...correlations]
    .filter((c) => c.correlation > 0)
    .sort((a, b) => b.correlation - a.correlation)
    .slice(0, 5);

  const strongestNegative = [...correlations]
    .filter((c) => c.correlation < 0)
    .sort((a, b) => a.correlation - b.correlation)
    .slice(0, 5);

  const selectedCorrelation = selectedCell
    ? correlations.find(
        (c) =>
          (c.metric1 === METRICS[selectedCell.i] && c.metric2 === METRICS[selectedCell.j]) ||
          (c.metric1 === METRICS[selectedCell.j] && c.metric2 === METRICS[selectedCell.i])
      )
    : null;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Info Card */}
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-violet-900 mb-1">
                How to read this matrix
              </h4>
              <p className="text-xs text-violet-700">
                <strong>Green cells:</strong> Positive correlation (metrics move together) •{' '}
                <strong>Red cells:</strong> Negative correlation (metrics move opposite) •{' '}
                <strong>Darker colors:</strong> Stronger correlation
              </p>
            </div>
          </div>
        </div>

        {/* Correlation Matrix */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 overflow-x-auto">
          <h3 className="font-semibold text-slate-900 mb-4">Correlation Heatmap</h3>

          <div className="inline-block min-w-full">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-32"></th>
                  {METRICS.map((metric, i) => (
                    <th
                      key={i}
                      className="w-24 h-24 p-2 text-xs font-medium text-slate-700 align-bottom"
                    >
                      <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap">
                        {metric}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metricRow, i) => (
                  <tr key={i}>
                    <th className="h-16 px-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">
                      {metricRow}
                    </th>
                    {METRICS.map((metricCol, j) => {
                      const correlation = matrix[i][j];
                      const isSelected =
                        selectedCell?.i === i && selectedCell?.j === j;

                      return (
                        <td
                          key={j}
                          className="relative"
                        >
                          <motion.button
                            whileHover={{ scale: i !== j ? 1.1 : 1 }}
                            whileTap={{ scale: i !== j ? 0.95 : 1 }}
                            onClick={() => i !== j && setSelectedCell({ i, j })}
                            disabled={i === j}
                            className={`w-16 h-16 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                              i === j
                                ? 'bg-slate-100 text-slate-400 cursor-default'
                                : `${getCorrelationColor(correlation)} ${getTextColor(
                                    correlation
                                  )} hover:shadow-lg cursor-pointer`
                            } ${isSelected ? 'ring-4 ring-violet-500 shadow-xl z-10' : ''}`}
                          >
                            {correlation.toFixed(2)}
                          </motion.button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <div className="w-4 h-4 rounded bg-red-400"></div>
                <div className="w-4 h-4 rounded bg-red-200"></div>
              </div>
              <span className="text-xs text-slate-600">Strong Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-100"></div>
              <span className="text-xs text-slate-600">No Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-emerald-200"></div>
                <div className="w-4 h-4 rounded bg-emerald-400"></div>
                <div className="w-4 h-4 rounded bg-emerald-600"></div>
              </div>
              <span className="text-xs text-slate-600">Strong Positive</span>
            </div>
          </div>
        </div>

        {/* Selected Cell Details */}
        {selectedCorrelation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200"
          >
            <h3 className="font-semibold text-violet-900 mb-3">Selected Correlation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-violet-200">
                <p className="text-xs text-slate-500 mb-1">Metrics</p>
                <p className="text-sm font-bold text-slate-900">
                  {selectedCorrelation.metric1} ↔ {selectedCorrelation.metric2}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-violet-200">
                <p className="text-xs text-slate-500 mb-1">Correlation</p>
                <p
                  className={`text-sm font-bold ${
                    selectedCorrelation.correlation > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {selectedCorrelation.correlation.toFixed(2)} (
                  {selectedCorrelation.strength})
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-violet-200">
                <p className="text-xs text-slate-500 mb-1">Direction</p>
                <p className="text-sm font-bold text-slate-900 capitalize">
                  {selectedCorrelation.direction}
                </p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-white border border-violet-200">
              <p className="text-xs text-violet-900">
                💡{' '}
                {selectedCorrelation.direction === 'positive'
                  ? `When ${selectedCorrelation.metric1} increases, ${selectedCorrelation.metric2} tends to increase as well.`
                  : `When ${selectedCorrelation.metric1} increases, ${selectedCorrelation.metric2} tends to decrease.`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Top Correlations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strongest Positive */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Strongest Positive Correlations
            </h3>
            <div className="space-y-2">
              {strongestPositive.map((corr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-xl bg-white border border-emerald-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      {corr.metric1} ↔ {corr.metric2}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {corr.correlation.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 capitalize">{corr.strength}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strongest Negative */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200">
            <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Strongest Negative Correlations
            </h3>
            <div className="space-y-2">
              {strongestNegative.map((corr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-xl bg-white border border-red-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      {corr.metric1} ↔ {corr.metric2}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {corr.correlation.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600"
                      style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 capitalize">{corr.strength}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Key Insights
          </h3>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-white border border-purple-200">
              <p className="text-sm text-purple-900">
                💡 <strong>Recovery patterns:</strong> HRV and Recovery Score show strong positive
                correlation, indicating they move together predictably.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-purple-200">
              <p className="text-sm text-purple-900">
                ⚠️ <strong>Fatigue impact:</strong> High negative correlation between Fatigue and
                Performance suggests fatigue management is critical.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-purple-200">
              <p className="text-sm text-purple-900">
                📊 <strong>Training load:</strong> Training Load correlates negatively with
                Recovery, emphasizing need for balanced programming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
