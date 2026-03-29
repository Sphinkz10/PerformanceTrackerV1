/**
 * SubmissionAnalytics - FASE 7 EXCEED FEATURE
 * 
 * Analytics dashboard for form submissions impact.
 * 
 * Features:
 * - Impact summary (improvements/declines)
 * - Most improved metrics
 * - Critical alerts
 * - AI-generated recommendations
 * - Trends over time
 * 
 * Usage:
 * <SubmissionAnalytics
 *   submissions={recentSubmissions}
 *   timeRange="7d"
 * />
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Award,
  Lightbulb,
  BarChart3,
  Activity,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface SubmissionImpactData {
  totalSubmissions: number;
  totalMetrics: number;
  metricsImproved: number;
  metricsDeclined: number;
  metricsStable: number;
  criticalAlerts: number;
  decisionsTriggered: number;
  recommendations: string[];
  topImprovedMetrics: Array<{
    metricName: string;
    improvement: number;
    unit: string;
  }>;
  topDeclinedMetrics: Array<{
    metricName: string;
    decline: number;
    unit: string;
  }>;
}

export interface SubmissionAnalyticsProps {
  impactData: SubmissionImpactData;
  timeRange?: '7d' | '30d' | '90d';
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SubmissionAnalytics: React.FC<SubmissionAnalyticsProps> = ({
  impactData,
  timeRange = '7d',
}) => {
  const improvementRate = impactData.totalMetrics > 0
    ? Math.round((impactData.metricsImproved / impactData.totalMetrics) * 100)
    : 0;
  
  const declineRate = impactData.totalMetrics > 0
    ? Math.round((impactData.metricsDeclined / impactData.totalMetrics) * 100)
    : 0;

  const stableRate = 100 - improvementRate - declineRate;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Submissions</p>
          </div>
          <p className="font-semibold text-slate-900">{impactData.totalSubmissions}</p>
          <p className="text-xs text-slate-500">Last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Improved</p>
          </div>
          <p className="font-semibold text-slate-900">{impactData.metricsImproved}</p>
          <p className="text-xs text-emerald-600">↗️ {improvementRate}% of metrics</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-red-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Declined</p>
          </div>
          <p className="font-semibold text-slate-900">{impactData.metricsDeclined}</p>
          <p className="text-xs text-red-600">↘️ {declineRate}% of metrics</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-slate-500">Alerts</p>
          </div>
          <p className="font-semibold text-slate-900">{impactData.criticalAlerts}</p>
          <p className="text-xs text-amber-600">🔴 Require attention</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm">Overall Impact</h3>
          <p className="text-xs text-slate-500">{impactData.totalMetrics} metrics tracked</p>
        </div>
        
        <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
          {improvementRate > 0 && (
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600"
              style={{ width: `${improvementRate}%` }}
              title={`${improvementRate}% improved`}
            />
          )}
          {stableRate > 0 && (
            <div 
              className="bg-slate-300"
              style={{ width: `${stableRate}%` }}
              title={`${stableRate}% stable`}
            />
          )}
          {declineRate > 0 && (
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: `${declineRate}%` }}
              title={`${declineRate}% declined`}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Improved ({improvementRate}%)
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-slate-300"></span>
            Stable ({stableRate}%)
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            Declined ({declineRate}%)
          </span>
        </div>
      </motion.div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Improved */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">Top Improved</h3>
          </div>
          
          <div className="space-y-2">
            {impactData.topImprovedMetrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200">
                <span className="text-sm text-slate-700">{metric.metricName}</span>
                <span className="text-sm font-semibold text-emerald-600">
                  +{metric.improvement}{metric.unit}
                </span>
              </div>
            ))}
            {impactData.topImprovedMetrics.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No improvements yet</p>
            )}
          </div>
        </motion.div>

        {/* Top Declined */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">Needs Attention</h3>
          </div>
          
          <div className="space-y-2">
            {impactData.topDeclinedMetrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white border border-red-200">
                <span className="text-sm text-slate-700">{metric.metricName}</span>
                <span className="text-sm font-semibold text-red-600">
                  {metric.decline}{metric.unit}
                </span>
              </div>
            ))}
            {impactData.topDeclinedMetrics.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">All metrics stable! 🎉</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Recommendations */}
      {impactData.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">AI Recommendations</h3>
          </div>
          
          <div className="space-y-2">
            {impactData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-white border border-violet-200">
                <span className="text-violet-600 shrink-0">💡</span>
                <p className="text-sm text-slate-700">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
