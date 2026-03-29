/**
 * METRIC CARD ENHANCED - FASE 2 DIA 6
 * MetricCard com informações completas e ações responsivas
 * 
 * FEATURES:
 * - Baseline indicator
 * - Last update timestamp
 * - Usage count (# athletes)
 * - Actions menu (mobile: dropdown, desktop: buttons)
 * - Badge colorido por tipo
 * - Hover effects
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Calendar,
  Copy,
  Archive,
  Star,
  Download,
  Eye,
  Zap,
} from 'lucide-react';
import type { Metric } from '@/types/metrics';

type ViewMode = 'grid' | 'list';

interface MetricCardEnhancedProps {
  metric: Metric;
  viewMode: ViewMode;
  index: number;
  onEdit?: (metric: Metric) => void;
  onDelete?: (metric: Metric) => void;
  onViewHistory?: (metric: Metric) => void;
  onDuplicate?: (metric: Metric) => void;
  onArchive?: (metric: Metric) => void;
  onExport?: (metric: Metric) => void;
  isMobile: boolean;
  // Extended data (from API)
  usageCount?: number;
  lastValue?: number;
  lastUpdated?: string;
  trendDirection?: 'up' | 'down' | 'stable';
}

export function MetricCardEnhanced({
  metric,
  viewMode,
  index,
  onEdit,
  onDelete,
  onViewHistory,
  onDuplicate,
  onArchive,
  onExport,
  isMobile,
  usageCount = 0,
  lastValue,
  lastUpdated,
  trendDirection = 'stable',
}: MetricCardEnhancedProps) {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const isTemplate = metric.isTemplate;
  const isFromPack = metric.isFromPack;

  // ============================================================================
  // BADGE CONFIG
  // ============================================================================
  
  const getBadgeColor = () => {
    if (isTemplate) return 'bg-sky-100 text-sky-700 border-sky-300';
    if (isFromPack) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (metric.isActive) return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getBadgeLabel = () => {
    if (isTemplate) return '🎯 Template';
    if (isFromPack) return '🛒 Store';
    if (metric.isActive) return '✅ Ativa';
    return '📦 Arquivo';
  };

  // ============================================================================
  // CATEGORY EMOJI
  // ============================================================================
  
  const getCategoryEmoji = () => {
    switch (metric.category) {
      case 'performance': return '🏃';
      case 'wellness': return '💚';
      case 'readiness': return '⚡';
      case 'load': return '📈';
      case 'psychological': return '🧠';
      case 'strength': return '💪';
      case 'custom': return '⚙️';
      default: return '📊';
    }
  };

  // ============================================================================
  // TREND INDICATOR
  // ============================================================================
  
  const getTrendIcon = () => {
    if (trendDirection === 'up') return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    if (trendDirection === 'down') return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return null;
  };

  // ============================================================================
  // FORMAT DATE
  // ============================================================================
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  };

  // ============================================================================
  // ACTIONS MENU
  // ============================================================================
  
  const actions = [
    { icon: Eye, label: 'Ver Histórico', onClick: onViewHistory, color: 'sky' },
    { icon: Edit, label: 'Editar', onClick: onEdit, color: 'slate' },
    { icon: Copy, label: 'Duplicar', onClick: onDuplicate, color: 'slate' },
    { icon: Download, label: 'Exportar', onClick: onExport, color: 'slate' },
    { icon: Archive, label: 'Arquivar', onClick: onArchive, color: 'amber' },
    { icon: Trash2, label: 'Deletar', onClick: onDelete, color: 'red' },
  ].filter((action) => action.onClick); // Only show actions with handlers

  // ============================================================================
  // LIST VIEW
  // ============================================================================
  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="relative group p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-lg shrink-0">{getCategoryEmoji()}</span>
              <h3 className="font-bold text-slate-900 truncate">{metric.name}</h3>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getBadgeColor()}`}>
                {getBadgeLabel()}
              </span>
            </div>

            {metric.description && (
              <p className="text-sm text-slate-600 mb-2 line-clamp-1">{metric.description}</p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span className="font-medium">Tipo:</span>
                <span>{metric.type}</span>
              </div>
              {metric.unit && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Unidade:</span>
                  <span>{metric.unit}</span>
                </div>
              )}
              {usageCount > 0 && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <Users className="h-3 w-3" />
                  <span className="font-semibold">{usageCount} atletas</span>
                </div>
              )}
              {lastUpdated && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(lastUpdated)}</span>
                </div>
              )}
            </div>

            {/* Last Value (if available) */}
            {lastValue !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">Último valor:</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-900">
                    {lastValue} {metric.unit}
                  </span>
                  {getTrendIcon()}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions (Desktop only) */}
          {!isMobile && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onViewHistory && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewHistory(metric)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Histórico</span>
                </motion.button>
              )}
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(metric)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </motion.button>
              )}

              {/* More actions dropdown */}
              {actions.length > 2 && (
                <div className="relative">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-slate-600" />
                  </button>

                  <AnimatePresence>
                    {showActionsMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActionsMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                          {actions.slice(2).map((action, i) => {
                            const Icon = action.icon;
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  action.onClick?.(metric);
                                  setShowActionsMenu(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left hover:bg-slate-50 transition-colors ${
                                  action.color === 'red' ? 'text-red-600 hover:bg-red-50' :
                                  action.color === 'amber' ? 'text-amber-600 hover:bg-amber-50' :
                                  'text-slate-700'
                                }`}
                              >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{action.label}</span>
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Mobile: Actions menu button */}
          {isMobile && actions.length > 0 && (
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
            >
              <MoreVertical className="h-5 w-5 text-slate-600" />
            </button>
          )}
        </div>

        {/* Mobile: Actions Menu Dropdown */}
        <AnimatePresence>
          {isMobile && showActionsMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActionsMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-4 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {actions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        action.onClick?.(metric);
                        setShowActionsMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left hover:bg-slate-50 transition-colors min-h-[44px] ${
                        action.color === 'red' ? 'text-red-600 hover:bg-red-50' :
                        action.color === 'amber' ? 'text-amber-600 hover:bg-amber-50' :
                        action.color === 'sky' ? 'text-sky-600 hover:bg-sky-50' :
                        'text-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ============================================================================
  // GRID VIEW (Mobile-friendly)
  // ============================================================================

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 hover:border-sky-300 hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Category badge ribbon */}
      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold border-l border-b ${getBadgeColor()}`}>
        {getBadgeLabel()}
      </div>

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            {getCategoryEmoji()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate pr-16">{metric.name}</h3>
            {metric.description && (
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">{metric.description}</p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1 text-slate-600">
            <span className="font-medium">Tipo:</span>
            <span className="text-slate-900 font-semibold">{metric.type}</span>
          </div>
          {metric.unit && (
            <div className="flex items-center gap-1 text-slate-600">
              <span className="font-medium">Unidade:</span>
              <span className="text-slate-900 font-semibold">{metric.unit}</span>
            </div>
          )}
        </div>

        {/* Last Value + Usage (if available) */}
        {(lastValue !== undefined || usageCount > 0) && (
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
            {lastValue !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Último:</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-900">
                    {lastValue} {metric.unit}
                  </span>
                  {getTrendIcon()}
                </div>
              </div>
            )}
            {usageCount > 0 && (
              <div className="flex items-center gap-1 text-emerald-600">
                <Users className="h-3 w-3" />
                <span className="text-xs font-bold">{usageCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-2">
          {onViewHistory && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewHistory(metric)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Ver</span>
            </motion.button>
          )}
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(metric)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 shadow-md transition-all"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </motion.button>
          )}

          {/* More actions menu button */}
          {actions.length > 2 && (
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="p-2 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-slate-600" />
              </button>

              <AnimatePresence>
                {showActionsMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowActionsMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-20 overflow-hidden"
                    >
                      {actions.slice(2).map((action, i) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              action.onClick?.(metric);
                              setShowActionsMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left hover:bg-slate-50 transition-colors ${
                              action.color === 'red' ? 'text-red-600 hover:bg-red-50' :
                              action.color === 'amber' ? 'text-amber-600 hover:bg-amber-50' :
                              'text-slate-700'
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{action.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Last updated footer */}
        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-slate-400 pt-2 border-t border-slate-100">
            <Calendar className="h-3 w-3" />
            <span>Atualizado {formatDate(lastUpdated)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}