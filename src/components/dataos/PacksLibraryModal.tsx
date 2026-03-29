import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Moon, Activity, Zap, Brain, Shield, Check, Plus, Info } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface MetricPack {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  description: string;
  metricsCount: number;
  targetUsers: string;
  updateFrequency: string;
  isActivated: boolean;
  features: string[];
}

interface PacksLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onActivatePack: (packId: string) => void;
  onViewDetails: (packId: string) => void;
  activatedPackIds?: string[];
}

// ============================================================
// MOCK DATA - 5 PACKS
// ============================================================

const METRIC_PACKS: MetricPack[] = [
  {
    id: 'recovery-pack',
    name: 'Recovery Pack',
    category: 'recovery',
    icon: Moon,
    color: 'emerald',
    description: 'Monitoriza recuperação física e qualidade de sono para otimizar performance e prevenir overtraining.',
    metricsCount: 5,
    targetUsers: 'Todos os coaches',
    updateFrequency: 'Diário',
    isActivated: false,
    features: ['HRV', 'RHR', 'Sleep Quality', 'Subjective Recovery', 'Muscle Soreness'],
  },
  {
    id: 'load-fatigue-pack',
    name: 'Load & Fatigue Pack',
    category: 'load',
    icon: Activity,
    color: 'sky',
    description: 'Monitoriza carga de treino e fadiga acumulada para prevenir overtraining e otimizar periodização.',
    metricsCount: 8,
    targetUsers: 'Coaches intermédios/avançados',
    updateFrequency: 'Por sessão',
    isActivated: false,
    features: ['Total Volume', 'ACWR', 'Training Monotony', 'Training Strain', 'Weekly Load', 'RPE', 'Session Duration', 'High-Intensity Minutes'],
  },
  {
    id: 'readiness-pack',
    name: 'Readiness Pack',
    category: 'readiness',
    icon: Zap,
    color: 'amber',
    description: 'Avalia prontidão mental e física para treinar/competir através de métricas subjetivas.',
    metricsCount: 6,
    targetUsers: 'Todos os coaches',
    updateFrequency: 'Diário',
    isActivated: false,
    features: ['Mental Readiness', 'Physical Energy', 'Motivation', 'Mood', 'Stress Level', 'Focus Quality'],
  },
  {
    id: 'psychological-pack',
    name: 'Psychological Pack',
    category: 'psychological',
    icon: Brain,
    color: 'violet',
    description: 'Monitoriza bem-estar psicológico e saúde mental para suportar atleta holisticamente.',
    metricsCount: 7,
    targetUsers: 'Coaches avançados',
    updateFrequency: 'Diário ou semanal',
    isActivated: false,
    features: ['Overall Mood', 'Anxiety Level', 'Confidence', 'Sleep Problems', 'Appetite', 'Social Connection', 'Life Satisfaction'],
  },
  {
    id: 'injury-risk-pack',
    name: 'Injury Risk Pack',
    category: 'injury',
    icon: Shield,
    color: 'red',
    description: 'Detecta sinais precoces de lesão e factores de risco para prevenir injuries.',
    metricsCount: 6,
    targetUsers: 'Todos os coaches',
    updateFrequency: 'Diário/Semanal',
    isActivated: false,
    features: ['Pain Level', 'Movement Quality', 'Range of Motion', 'Asymmetry', 'Previous Injury', 'Injury History Count'],
  },
];

// ============================================================
// COLOR CONFIGS
// ============================================================

const colorConfig = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    hover: 'hover:border-emerald-400',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    hover: 'hover:border-sky-400',
    iconBg: 'bg-gradient-to-br from-sky-500 to-sky-600',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    hover: 'hover:border-amber-400',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
  },
  violet: {
    gradient: 'from-violet-500 to-violet-600',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    hover: 'hover:border-violet-400',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-700',
    hover: 'hover:border-red-400',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
  },
};

// ============================================================
// PACK CARD COMPONENT
// ============================================================

interface PackCardProps {
  pack: MetricPack;
  isActivated: boolean;
  onActivate: () => void;
  onViewDetails: () => void;
  index: number;
}

const PackCard: React.FC<PackCardProps> = ({ pack, isActivated, onActivate, onViewDetails, index }) => {
  const colors = colorConfig[pack.color];
  const Icon = pack.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 ${colors.hover} hover:shadow-xl transition-all`}
    >
      {/* Icon + Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`h-14 w-14 rounded-xl ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 mb-1">{pack.name}</h3>
          <p className="text-xs text-slate-500">{pack.metricsCount} métricas · {pack.updateFrequency}</p>
        </div>

        {isActivated && (
          <div className="flex-shrink-0">
            <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{pack.description}</p>

      {/* Target Users */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
          {pack.targetUsers}
        </span>
      </div>

      {/* Features Preview */}
      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2">Inclui:</p>
        <div className="flex flex-wrap gap-1">
          {pack.features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="text-xs text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
              {feature}
            </span>
          ))}
          {pack.features.length > 3 && (
            <span className="text-xs text-slate-500 px-2 py-1">
              +{pack.features.length - 3} mais
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isActivated ? (
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
            disabled
          >
            <Check className="h-4 w-4" />
            <span>Ativado</span>
          </button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onActivate}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:shadow-lg transition-all`}
          >
            <Plus className="h-4 w-4" />
            <span>Ativar Pack</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewDetails}
          className="flex items-center justify-center px-3 py-2 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          title="Ver detalhes"
        >
          <Info className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const PacksLibraryModal: React.FC<PacksLibraryModalProps> = ({
  open,
  onClose,
  onActivatePack,
  onViewDetails,
  activatedPackIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter packs
  const filteredPacks = METRIC_PACKS.filter((pack) => {
    const matchesSearch = pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pack.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Check if activated
  const isPackActivated = (packId: string) => activatedPackIds.includes(packId);

  // Stats
  const totalPacks = METRIC_PACKS.length;
  const activatedCount = activatedPackIds.length;
  const totalMetrics = METRIC_PACKS.reduce((sum, pack) => sum + pack.metricsCount, 0);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-slate-900">Biblioteca de Metric Packs</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {activatedCount} de {totalPacks} packs ativados · {totalMetrics} métricas disponíveis
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-6 border-b border-slate-200 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Procurar packs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { value: 'all', label: 'Todos', count: totalPacks },
                { value: 'recovery', label: 'Recovery', count: 1 },
                { value: 'load', label: 'Load', count: 1 },
                { value: 'readiness', label: 'Readiness', count: 1 },
                { value: 'psychological', label: 'Psychological', count: 1 },
                { value: 'injury', label: 'Injury Risk', count: 1 },
              ].map((cat) => (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap ${
                    categoryFilter === cat.value
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs ${categoryFilter === cat.value ? 'text-white/80' : 'text-slate-500'}`}>
                    {cat.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredPacks.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhum pack encontrado</p>
                <p className="text-sm text-slate-400 mt-1">Tenta outro termo de pesquisa</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPacks.map((pack, index) => (
                  <PackCard
                    key={pack.id}
                    pack={pack}
                    isActivated={isPackActivated(pack.id)}
                    onActivate={() => onActivatePack(pack.id)}
                    onViewDetails={() => onViewDetails(pack.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                💡 <strong>Dica:</strong> Cada pack inclui métricas pré-configuradas e forms sugeridos
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PacksLibraryModal;
