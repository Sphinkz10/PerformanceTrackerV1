import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Target, Calendar, Trash2, Eye, ChevronRight,
  Loader2, Moon, Activity, Zap, Brain, Shield
} from 'lucide-react';
import type { ActivePack } from '@/types/packs';

// ============================================================
// TYPES
// ============================================================

interface ActivePacksSectionProps {
  packs: ActivePack[];
  isLoading?: boolean;
  onViewMetrics: (packId: string, metricIds: string[]) => void;
  onDeactivate: (pack: ActivePack) => void;
}

// ============================================================
// PACK ICONS MAP
// ============================================================

const packIcons = {
  'recovery-pack': Moon,
  'load-fatigue-pack': Activity,
  'readiness-pack': Zap,
  'psychological-pack': Brain,
  'injury-risk-pack': Shield,
};

// ============================================================
// COLOR CONFIGS
// ============================================================

const colorConfig = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    hover: 'hover:border-emerald-400',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    hover: 'hover:border-sky-400',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:border-amber-400',
  },
  violet: {
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    hover: 'hover:border-violet-400',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:border-red-400',
  },
};

// ============================================================
// HELPER: Format Date
// ============================================================

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `Há ${diffMinutes} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
}

// ============================================================
// PACK CARD COMPONENT
// ============================================================

const PackCard: React.FC<{
  pack: ActivePack;
  index: number;
  onViewMetrics: () => void;
  onDeactivate: () => void;
}> = ({ pack, index, onViewMetrics, onDeactivate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorConfig[pack.packColor];
  const PackIcon = packIcons[pack.packId as keyof typeof packIcons] || Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative p-5 rounded-2xl border-2 ${colors.border} bg-gradient-to-br ${colors.bg} to-white transition-all ${colors.hover} hover:shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <PackIcon className="h-7 w-7 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 mb-1 truncate">{pack.packName}</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
              <Target className="h-3 w-3" />
              {pack.metricsCount} métrica{pack.metricsCount !== 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <Calendar className="h-3 w-3" />
              {formatRelativeDate(pack.activatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-4">
        {pack.formId && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Form</span>
          </div>
        )}
        {pack.reportId && (
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span>Report</span>
          </div>
        )}
        {pack.decisionsCount && pack.decisionsCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <span>{pack.decisionsCount} decisõe{pack.decisionsCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {pack.hasData && (
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span>Com dados</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewMetrics}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:shadow-lg transition-all`}
            >
              <Eye className="h-4 w-4" />
              <span>Ver Métricas</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDeactivate}
              className="px-4 py-2 rounded-xl bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle actions when not hovered (mobile) */}
      {!isHovered && (
        <div className="flex gap-2 sm:hidden">
          <button
            onClick={onViewMetrics}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r ${colors.gradient} text-white`}
          >
            <Eye className="h-3 w-3" />
            <span>Ver</span>
          </button>
          <button
            onClick={onDeactivate}
            className="px-3 py-2 rounded-xl bg-white border border-red-200 text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const ActivePacksSection: React.FC<ActivePacksSectionProps> = ({
  packs,
  isLoading,
  onViewMetrics,
  onDeactivate,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Packs Ativos</h3>
            <p className="text-sm text-slate-500">Packs que ativaste neste workspace</p>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 animate-pulse"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl bg-slate-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Packs Ativos</h3>
            <p className="text-sm text-slate-500">Packs que ativaste neste workspace</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-slate-100 mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Nenhum pack ativo</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
            Ativa packs para criar conjuntos de métricas pré-configuradas rapidamente.
          </p>
          <p className="text-xs text-slate-500">
            💡 Clica em "Browse Packs" abaixo para explorar os packs disponíveis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Packs Ativos</h3>
          <p className="text-sm text-slate-500">
            {packs.length} pack{packs.length !== 1 ? 's' : ''} ativo{packs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {packs.map((pack, index) => (
            <PackCard
              key={pack.packId}
              pack={pack}
              index={index}
              onViewMetrics={() => onViewMetrics(pack.packId, pack.metricIds)}
              onDeactivate={() => onDeactivate(pack)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivePacksSection;
