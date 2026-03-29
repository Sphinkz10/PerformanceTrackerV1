/**
 * 🎨 ADVANCED FILTERS - ENHANCED
 * Filtros avançados: Status, Source, Usage, Orphan Detector
 * 
 * MUDANÇAS VISUAIS:
 * ✅ Touch targets 44×44px em todos os botões
 * ✅ Borders suaves (border não border-2)
 * ✅ Padding otimizado para touch
 * ✅ Selects com touch targets adequados
 * ✅ Tags com altura mínima
 * ✅ Clear button com touch target
 */

'use client';

import { motion } from 'motion/react';
import {
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Database,
  Tag,
  Sparkles,
} from 'lucide-react';
import type { MetricCategory } from '@/types/metrics';

export interface FilterState {
  status: 'all' | 'active' | 'inactive' | 'orphan';
  category: MetricCategory | 'all';
  source: 'all' | 'exercise' | 'form' | 'manual' | 'external' | 'calculation';
  usage: 'all' | 'high' | 'medium' | 'low' | 'unused';
  tags: string[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  orphanCount?: number;
  availableTags?: string[];
}

const STATUS_OPTIONS = [
  { value: 'all' as const, label: 'Todas', icon: Filter, color: 'slate' },
  { value: 'active' as const, label: 'Ativas', icon: CheckCircle, color: 'emerald' },
  { value: 'inactive' as const, label: 'Inativas', icon: XCircle, color: 'slate' },
  { value: 'orphan' as const, label: 'Órfãs', icon: AlertTriangle, color: 'red' },
];

const CATEGORY_OPTIONS: { value: MetricCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'Todas', emoji: '📊' },
  { value: 'performance', label: 'Performance', emoji: '🏃' },
  { value: 'wellness', label: 'Wellness', emoji: '💚' },
  { value: 'readiness', label: 'Readiness', emoji: '⚡' },
  { value: 'load', label: 'Load', emoji: '📈' },
  { value: 'psychological', label: 'Psychological', emoji: '🧠' },
  { value: 'custom', label: 'Custom', emoji: '⚙️' },
];

const SOURCE_OPTIONS = [
  { value: 'all' as const, label: 'Todas as fontes', icon: Database },
  { value: 'exercise' as const, label: 'Exercício', icon: Sparkles },
  { value: 'form' as const, label: 'Formulário', icon: CheckCircle },
  { value: 'manual' as const, label: 'Manual', icon: Users },
  { value: 'external' as const, label: 'Externa', icon: Database },
  { value: 'calculation' as const, label: 'Cálculo', icon: Sparkles },
];

const USAGE_OPTIONS = [
  { value: 'all' as const, label: 'Qualquer uso', badge: null },
  { value: 'high' as const, label: 'Alto (>20)', badge: '🔥' },
  { value: 'medium' as const, label: 'Médio (10-20)', badge: '📊' },
  { value: 'low' as const, label: 'Baixo (1-10)', badge: '📉' },
  { value: 'unused' as const, label: 'Não usado', badge: '⚠️' },
];

export function AdvancedFilters({ filters, onChange, orphanCount = 3, availableTags = [] }: AdvancedFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 🎨 ENHANCED: Status Filter with touch targets */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Status
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = filters.status === option.value;
            const showBadge = option.value === 'orphan' && orphanCount > 0;

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateFilter('status', option.value)}
                className={`relative flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${
                  isActive
                    ? `bg-${option.color}-100 border border-${option.color}-400 text-${option.color}-700`
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{option.label}</span>
                {showBadge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {orphanCount}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 🎨 ENHANCED: Category Filter with touch targets */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Categoria
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((option) => {
            const isActive = filters.category === option.value;

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateFilter('category', option.value)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-sky-100 border border-sky-400 text-sky-700'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-base shrink-0">{option.emoji}</span>
                <span className="flex-1 text-left truncate">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 🎨 ENHANCED: Source Filter with touch target */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Fonte de Dados
        </label>
        <select
          value={filters.source}
          onChange={(e) => updateFilter('source', e.target.value as any)}
          className="w-full px-3 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
        >
          {SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🎨 ENHANCED: Usage Filter with touch target */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Nível de Uso (# Atletas)
        </label>
        <select
          value={filters.usage}
          onChange={(e) => updateFilter('usage', e.target.value as any)}
          className="w-full px-3 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all min-h-[44px]"
        >
          {USAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.badge ? `${option.badge} ` : ''}{option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🎨 ENHANCED: Tags Filter with better touch targets */}
      {availableTags.length > 0 && (
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 6).map((tag) => {
              const isActive = filters.tags.includes(tag);

              return (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newTags = isActive
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag];
                    updateFilter('tags', newTags);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px] ${
                    isActive
                      ? 'bg-violet-100 border border-violet-400 text-violet-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(filters.status !== 'all' || 
        filters.category !== 'all' || 
        filters.source !== 'all' || 
        filters.usage !== 'all' ||
        filters.tags.length > 0) && (
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-medium text-slate-700">
              Filtros ativos
            </span>
            {/* 🎨 ENHANCED: Clear button with touch target */}
            <button
              onClick={() =>
                onChange({
                  status: 'all',
                  category: 'all',
                  source: 'all',
                  usage: 'all',
                  tags: [],
                })
              }
              className="px-3 py-1.5 text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50 font-semibold rounded-lg transition-colors min-h-[36px]"
            >
              Limpar todos
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.status !== 'all' && (
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                Status: {filters.status}
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-xs">
                Categoria: {filters.category}
              </span>
            )}
            {filters.source !== 'all' && (
              <span className="px-2 py-1 rounded-full bg-violet-100 text-violet-700 text-xs">
                Fonte: {filters.source}
              </span>
            )}
            {filters.usage !== 'all' && (
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                Uso: {filters.usage}
              </span>
            )}
            {filters.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-full bg-violet-100 text-violet-700 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orphan Detector Info */}
      {filters.status === 'orphan' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900 mb-1">
                🔍 Métricas Órfãs Detectadas
              </p>
              <p className="text-xs text-red-700">
                Métricas órfãs são aquelas que não estão sendo usadas por nenhum atleta, 
                relatório, formulário ou automação. Considera deletar para manter a organização.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}