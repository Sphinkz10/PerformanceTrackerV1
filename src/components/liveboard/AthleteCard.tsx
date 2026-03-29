/**
 * ATHLETE CARD - Live Board
 * Card completo do atleta com métricas, alertas e ações
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  BarChart3,
  GitCompare,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  User,
  Clock,
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { StatusBadge } from './StatusBadge';
import { MetricList } from './MetricList';
import { AlertList } from './AlertList';
import { AISuggestionComponent } from './AISuggestion';
import {
  calculateOverallStatus,
  calculateTrend,
  getTrendIcon,
  getActiveAlerts,
  formatRelativeDate,
  type AthleteMetric,
  type Alert,
  type AISuggestion,
  type OverallStatus,
} from '@/lib/athleteUtils';

export interface AthleteCardData {
  id: string;
  name: string;
  photo?: string;
  position: string;
  metrics: AthleteMetric[];
  alerts: Alert[];
  aiSuggestion?: AISuggestion;
  lastUpdate: string;
  isOffline?: boolean;
}

interface AthleteCardProps {
  athlete: AthleteCardData;
  viewMode?: 'full' | 'compact' | 'minimal';
  onAddData?: (athleteId: string, metricId?: string) => void;
  onViewDetails?: (athleteId: string) => void;
  onCompare?: (athleteId: string) => void;
  onRefresh?: (athleteId: string) => void;
  onApplySuggestion?: (suggestionId: string) => void;
  onIgnoreSuggestion?: (suggestionId: string) => void;
  onResolveAlert?: (alertId: string) => void;
  index?: number;
}

export function AthleteCard({
  athlete,
  viewMode = 'full',
  onAddData,
  onViewDetails,
  onCompare,
  onRefresh,
  onApplySuggestion,
  onIgnoreSuggestion,
  onResolveAlert,
  index = 0,
}: AthleteCardProps) {
  const { isMobile, isTablet } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate status
  const overallStatus = calculateOverallStatus(athlete.metrics);
  const trend = calculateTrend(athlete.metrics);
  const activeAlerts = getActiveAlerts(athlete.alerts);

  // Auto-adjust view mode for mobile
  const effectiveViewMode = isMobile ? 'compact' : viewMode;
  const isCompact = effectiveViewMode === 'compact' || effectiveViewMode === 'minimal';

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.(athlete.id);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Status-based border color
  const borderColors: Record<OverallStatus, string> = {
    excellent: 'border-emerald-200 hover:border-emerald-300',
    attention: 'border-amber-200 hover:border-amber-300',
    critical: 'border-red-200 hover:border-red-300',
  };

  // Pulsing animation for critical status
  const shouldPulse = overallStatus === 'critical' && activeAlerts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={`relative ${athlete.isOffline ? 'opacity-60' : ''}`}
    >
      <div
        className={`rounded-2xl border-2 bg-white shadow-sm hover:shadow-lg transition-all ${
          borderColors[overallStatus]
        } ${shouldPulse ? 'animate-pulse-border' : ''}`}
      >
        {/* Offline Indicator */}
        {athlete.isOffline && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            ⚫ Offline
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="shrink-0">
              {athlete.photo ? (
                <img
                  src={athlete.photo}
                  alt={athlete.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center ring-2 ring-slate-100">
                  <User className="h-6 w-6 text-sky-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onViewDetails?.(athlete.id)}
                className="text-left group"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                  {athlete.name}
                </h3>
                <p className="text-sm text-slate-500">{athlete.position}</p>
              </button>
            </div>

            {/* Status Badge */}
            <StatusBadge status={overallStatus} showLabel={!isMobile} />

            {/* Actions Menu */}
            <button className="shrink-0 h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Trend & Last Update */}
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <span>{getTrendIcon(trend.direction)}</span>
              <span>{trend.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeDate(athlete.lastUpdate)}</span>
            </div>
          </div>
        </div>

        {/* Content - Collapsible on mobile */}
        <AnimatePresence>
          {(isExpanded || !isMobile) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Metrics */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-700">
                      📊 Métricas Críticas
                    </h4>
                    <span className="text-xs text-slate-400">
                      {athlete.metrics.filter((m) => m.status !== 'green').length} preocupantes
                    </span>
                  </div>
                  
                  <MetricList
                    metrics={athlete.metrics}
                    limit={isCompact ? 3 : undefined}
                    groupByCategory={!isCompact}
                    collapsible={!isCompact}
                    onAddValue={(metricId) => onAddData?.(athlete.id, metricId)}
                  />
                </div>

                {/* Active Alerts */}
                {activeAlerts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-slate-700">
                        🚨 Alertas Ativos
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        {activeAlerts.length}
                      </span>
                    </div>
                    
                    <AlertList
                      alerts={activeAlerts}
                      onResolve={onResolveAlert}
                      compact={isCompact}
                    />
                  </div>
                )}

                {/* AI Suggestion */}
                {athlete.aiSuggestion && !isCompact && (
                  <div>
                    <AISuggestionComponent
                      suggestion={athlete.aiSuggestion}
                      onApply={() => onApplySuggestion?.(athlete.aiSuggestion!.id)}
                      onIgnore={() => onIgnoreSuggestion?.(athlete.aiSuggestion!.id)}
                      compact={isCompact}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer - Quick Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {/* Add Data */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddData?.(athlete.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              {!isMobile && <span>Add Data</span>}
            </motion.button>

            {/* Details */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewDetails?.(athlete.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              {!isMobile && <span>Details</span>}
            </motion.button>

            {/* Compare */}
            {onCompare && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCompare(athlete.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <GitCompare className="h-4 w-4" />
                {!isMobile && <span>Compare</span>}
              </motion.button>
            )}

            {/* Refresh */}
            {onRefresh && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            )}

            {/* Expand/Collapse (Mobile only) */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 flex items-center justify-center transition-all"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Pulse border animation styles */}
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgb(254 202 202);
          }
          50% {
            border-color: rgb(239 68 68);
          }
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
}
