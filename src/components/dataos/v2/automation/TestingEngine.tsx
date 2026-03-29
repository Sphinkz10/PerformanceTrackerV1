/**
 * TESTING ENGINE
 * Test rules against historical data
 * False positive detection, confidence scoring
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Database,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import type { AutomationRule } from './AutomationMain';
import type { Metric } from '@/types/metrics';

interface TestingEngineProps {
  rules: AutomationRule[];
  metrics: Metric[];
}

interface TestResult {
  ruleId: string;
  ruleName: string;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  confidence: number;
  precision: number;
  recall: number;
  f1Score: number;
  testedAt: string;
}

// Mock test generator
const generateTestResults = (rule: AutomationRule): TestResult => {
  // Simulate testing with random but realistic results
  const tp = Math.floor(Math.random() * 30) + 10; // 10-40
  const fp = Math.floor(Math.random() * 10); // 0-10
  const tn = Math.floor(Math.random() * 100) + 50; // 50-150
  const fn = Math.floor(Math.random() * 5); // 0-5

  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1Score = 2 * ((precision * recall) / (precision + recall));
  const confidence = ((tp + tn) / (tp + fp + tn + fn)) * 100;

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    truePositives: tp,
    falsePositives: fp,
    trueNegatives: tn,
    falseNegatives: fn,
    confidence: Math.round(confidence),
    precision: Math.round(precision * 100),
    recall: Math.round(recall * 100),
    f1Score: Math.round(f1Score * 100),
    testedAt: new Date().toISOString(),
  };
};

export function TestingEngine({ rules, metrics }: TestingEngineProps) {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(
    rules.length > 0 ? rules[0].id : null
  );
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Map<string, TestResult>>(new Map());

  const selectedRule = rules.find((r) => r.id === selectedRuleId);
  const selectedResult = selectedRuleId ? testResults.get(selectedRuleId) : undefined;

  const handleTest = async (ruleId: string) => {
    setIsTesting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const rule = rules.find((r) => r.id === ruleId)!;
    const result = generateTestResults(rule);

    setTestResults((prev) => {
      const newMap = new Map(prev);
      newMap.set(ruleId, result);
      return newMap;
    });

    setIsTesting(false);
  };

  // Confusion matrix data
  const confusionData = selectedResult
    ? [
        { name: 'True Positive', value: selectedResult.truePositives, color: '#10b981' },
        { name: 'False Positive', value: selectedResult.falsePositives, color: '#f59e0b' },
        { name: 'True Negative', value: selectedResult.trueNegatives, color: '#0ea5e9' },
        { name: 'False Negative', value: selectedResult.falseNegatives, color: '#ef4444' },
      ]
    : [];

  // Metrics data
  const metricsData = selectedResult
    ? [
        { name: 'Precision', value: selectedResult.precision },
        { name: 'Recall', value: selectedResult.recall },
        { name: 'F1 Score', value: selectedResult.f1Score },
        { name: 'Confidence', value: selectedResult.confidence },
      ]
    : [];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-slate-900 mb-1">
            Testing Engine
          </h2>
          <p className="text-sm text-slate-500">
            Test rules against historical data to detect false positives
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Rules List */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-2xl bg-white border-2 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">
                Select Rule to Test
              </h3>

              <div className="space-y-2">
                {rules.map((rule) => {
                  const isSelected = selectedRuleId === rule.id;
                  const hasResult = testResults.has(rule.id);

                  return (
                    <motion.button
                      key={rule.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRuleId(rule.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-violet-100 border-2 border-violet-400'
                          : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 text-sm truncate">
                            {rule.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {rule.actions.length} actions
                          </p>
                        </div>

                        {hasResult && (
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Test Results */}
          <div className="lg:col-span-2">
            {selectedRule ? (
              <div className="space-y-6">
                {/* Rule Info */}
                <div className="p-5 rounded-2xl bg-white border-2 border-violet-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {selectedRule.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {selectedRule.description}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTest(selectedRule.id)}
                      disabled={isTesting}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg hover:from-violet-400 hover:to-violet-500 transition-all disabled:opacity-50"
                    >
                      <Play className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
                      {isTesting ? 'Testing...' : 'Run Test'}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <p className="text-slate-500 mb-1">Trigger</p>
                      <p className="font-medium text-slate-900">{selectedRule.triggerType}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <p className="text-slate-500 mb-1">Actions</p>
                      <p className="font-medium text-slate-900">{selectedRule.actions.length}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <p className="text-slate-500 mb-1">Status</p>
                      <p className={`font-medium ${selectedRule.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {selectedRule.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                {selectedResult ? (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <p className="text-xs text-slate-500">Confidence</p>
                        </div>
                        <p className="text-2xl font-semibold text-emerald-900">
                          {selectedResult.confidence}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-sky-600" />
                          <p className="text-xs text-slate-500">Precision</p>
                        </div>
                        <p className="text-2xl font-semibold text-sky-900">
                          {selectedResult.precision}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-violet-600" />
                          <p className="text-xs text-slate-500">Recall</p>
                        </div>
                        <p className="text-2xl font-semibold text-violet-900">
                          {selectedResult.recall}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-amber-600" />
                          <p className="text-xs text-slate-500">F1 Score</p>
                        </div>
                        <p className="text-2xl font-semibold text-amber-900">
                          {selectedResult.f1Score}%
                        </p>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Confusion Matrix */}
                      <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Confusion Matrix
                        </h3>

                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={confusionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {confusionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                            <p className="text-xs text-emerald-700 mb-1">True Positive</p>
                            <p className="text-sm font-semibold text-emerald-900">
                              {selectedResult.truePositives}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                            <p className="text-xs text-amber-700 mb-1">False Positive</p>
                            <p className="text-sm font-semibold text-amber-900">
                              {selectedResult.falsePositives}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-sky-50 border border-sky-200">
                            <p className="text-xs text-sky-700 mb-1">True Negative</p>
                            <p className="text-sm font-semibold text-sky-900">
                              {selectedResult.trueNegatives}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-xs text-red-700 mb-1">False Negative</p>
                            <p className="text-sm font-semibold text-red-900">
                              {selectedResult.falseNegatives}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Performance Metrics
                        </h3>

                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#64748b" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '12px',
                              }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                              {metricsData.map((entry, index) => {
                                const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'];
                                return <Cell key={`cell-${index}`} fill={colors[index]} />;
                              })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200">
                      <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Recommendations
                      </h3>

                      <div className="space-y-2">
                        {selectedResult.confidence >= 85 && (
                          <div className="p-3 rounded-xl bg-white border border-emerald-200">
                            <p className="text-sm text-emerald-900">
                              ✅ <strong>Excellent confidence!</strong> This rule is production-ready.
                            </p>
                          </div>
                        )}

                        {selectedResult.confidence >= 70 && selectedResult.confidence < 85 && (
                          <div className="p-3 rounded-xl bg-white border border-amber-200">
                            <p className="text-sm text-amber-900">
                              ⚠️ <strong>Good confidence.</strong> Consider monitoring false positives.
                            </p>
                          </div>
                        )}

                        {selectedResult.confidence < 70 && (
                          <div className="p-3 rounded-xl bg-white border border-red-200">
                            <p className="text-sm text-red-900">
                              ❌ <strong>Low confidence.</strong> Adjust trigger conditions before deploying.
                            </p>
                          </div>
                        )}

                        {selectedResult.falsePositives > 5 && (
                          <div className="p-3 rounded-xl bg-white border border-amber-200">
                            <p className="text-sm text-amber-900">
                              💡 High false positives detected. Consider tightening the trigger threshold.
                            </p>
                          </div>
                        )}

                        {selectedResult.falseNegatives > 3 && (
                          <div className="p-3 rounded-xl bg-white border border-red-200">
                            <p className="text-sm text-red-900">
                              💡 Missed cases detected. Consider lowering the trigger threshold.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tested At */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Tested at:{' '}
                        {new Date(selectedResult.testedAt).toLocaleString('pt-PT')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-12 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center">
                    <Database className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-slate-900 mb-2">No test results yet</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Click "Run Test" to test this rule against historical data
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-white border-2 border-slate-200 text-center">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-900 mb-2">Select a rule to test</h3>
                <p className="text-sm text-slate-500">
                  Choose a rule from the list to run tests
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
