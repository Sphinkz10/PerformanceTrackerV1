/**
 * BY ATHLETE VIEW - FASE 5 DIA 16-17
 * Layouts COMPLETAMENTE diferentes por dispositivo
 * 
 * MOBILE:   Cards empilhados com swipe
 * TABLET:   Tabela com scroll horizontal
 * DESKTOP:  Grid completo (mantido)
 */

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

interface AthleteMetric {
  metricId: string;
  metricName: string;
  unit: string;
  currentValue: number;
  previousValue?: number;
  baseline?: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  zone?: {
    name: string;
    color: string;
  };
}

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  metrics: AthleteMetric[];
  totalMetrics: number;
  updatedToday: number;
}

interface ByAthleteViewProps {
  workspaceId?: string;
}

// Mock data
const mockAthletes: Athlete[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: undefined,
    totalMetrics: 12,
    updatedToday: 8,
    metrics: [
      {
        metricId: 'm1',
        metricName: 'Squat 1RM',
        unit: 'kg',
        currentValue: 150,
        previousValue: 145,
        baseline: 140,
        lastUpdated: '2h atrás',
        trend: 'up',
        zone: { name: 'Zona Verde', color: 'emerald' },
      },
      {
        metricId: 'm2',
        metricName: 'FC Repouso',
        unit: 'bpm',
        currentValue: 58,
        previousValue: 60,
        lastUpdated: '5h atrás',
        trend: 'down',
      },
      {
        metricId: 'm3',
        metricName: 'Peso Corporal',
        unit: 'kg',
        currentValue: 75.3,
        previousValue: 75.5,
        baseline: 75,
        lastUpdated: 'Hoje',
        trend: 'stable',
      },
    ],
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatar: undefined,
    totalMetrics: 10,
    updatedToday: 5,
    metrics: [
      {
        metricId: 'm1',
        metricName: 'Squat 1RM',
        unit: 'kg',
        currentValue: 120,
        previousValue: 118,
        baseline: 115,
        lastUpdated: '1h atrás',
        trend: 'up',
        zone: { name: 'Zona Verde', color: 'emerald' },
      },
      {
        metricId: 'm2',
        metricName: 'FC Repouso',
        unit: 'bpm',
        currentValue: 62,
        previousValue: 61,
        lastUpdated: '3h atrás',
        trend: 'up',
      },
      {
        metricId: 'm3',
        metricName: 'Peso Corporal',
        unit: 'kg',
        currentValue: 62.8,
        previousValue: 62.8,
        baseline: 63,
        lastUpdated: 'Hoje',
        trend: 'stable',
      },
    ],
  },
  {
    id: '3',
    name: 'Pedro Costa',
    avatar: undefined,
    totalMetrics: 15,
    updatedToday: 12,
    metrics: [
      {
        metricId: 'm1',
        metricName: 'Squat 1RM',
        unit: 'kg',
        currentValue: 180,
        previousValue: 182,
        baseline: 175,
        lastUpdated: '30min atrás',
        trend: 'down',
        zone: { name: 'Zona Amarela', color: 'amber' },
      },
      {
        metricId: 'm2',
        metricName: 'FC Repouso',
        unit: 'bpm',
        currentValue: 55,
        previousValue: 56,
        lastUpdated: '1h atrás',
        trend: 'down',
      },
      {
        metricId: 'm3',
        metricName: 'Peso Corporal',
        unit: 'kg',
        currentValue: 82.1,
        previousValue: 82.1,
        baseline: 82,
        lastUpdated: 'Hoje',
        trend: 'stable',
      },
    ],
  },
];

export function ByAthleteView({ workspaceId }: ByAthleteViewProps) {
  const { isMobile, isTablet } = useResponsive();
  const [athletes] = useState<Athlete[]>(mockAthletes);
  const [currentAthleteIndex, setCurrentAthleteIndex] = useState(0);

  // Mobile: render swipeable cards
  if (isMobile) {
    return (
      <MobileAthleteCards
        athletes={athletes}
        currentIndex={currentAthleteIndex}
        onIndexChange={setCurrentAthleteIndex}
      />
    );
  }

  // Tablet: render table with horizontal scroll
  if (isTablet) {
    return <TabletAthleteTable athletes={athletes} />;
  }

  // Desktop: render full grid
  return <DesktopAthleteGrid athletes={athletes} />;
}

// ============================================================================
// MOBILE: SWIPEABLE CARDS
// ============================================================================

interface MobileAthleteCardsProps {
  athletes: Athlete[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

function MobileAthleteCards({
  athletes,
  currentIndex,
  onIndexChange,
}: MobileAthleteCardsProps) {
  const currentAthlete = athletes[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < athletes.length - 1) {
      onIndexChange(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header com navegação */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Atletas</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSwipe('right')}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border-2 border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-600 min-w-[60px] text-center">
              {currentIndex + 1} / {athletes.length}
            </span>
            <button
              onClick={() => handleSwipe('left')}
              disabled={currentIndex === athletes.length - 1}
              className="p-2 rounded-lg border-2 border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {athletes.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-sky-500'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipeable Card */}
      <div className="flex-1 overflow-hidden p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="h-full overflow-y-auto">
              <AthleteCard athlete={currentAthlete} isMobile />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      <div className="p-4 bg-white border-t border-slate-200">
        <p className="text-center text-xs text-slate-500">
          👈 Desliza para navegar entre atletas 👉
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// TABLET: TABLE WITH HORIZONTAL SCROLL
// ============================================================================

interface TabletAthleteTableProps {
  athletes: Athlete[];
}

function TabletAthleteTable({ athletes }: TabletAthleteTableProps) {
  const [expandedAthleteId, setExpandedAthleteId] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-5 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Por Atleta</h2>
            <p className="text-sm text-slate-600 mt-1">
              {athletes.length} atletas • Vista em tabela
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold">
              {athletes.reduce((sum, a) => sum + a.updatedToday, 0)} atualizações hoje
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-5">
        <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm sticky left-0 bg-slate-50 z-10 min-w-[180px]">
                    Atleta
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm min-w-[150px]">
                    Squat 1RM
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm min-w-[150px]">
                    FC Repouso
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm min-w-[150px]">
                    Peso Corporal
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700 text-sm min-w-[100px]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete, index) => {
                  const isExpanded = expandedAthleteId === athlete.id;
                  return (
                    <motion.tr
                      key={athlete.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* Athlete Name */}
                      <td className="px-4 py-4 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold shrink-0">
                            {athlete.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{athlete.name}</p>
                            <p className="text-xs text-slate-500">
                              {athlete.updatedToday}/{athlete.totalMetrics} hoje
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Metrics */}
                      {athlete.metrics.map((metric) => (
                        <td key={metric.metricId} className="px-4 py-4">
                          <MetricCell metric={metric} />
                        </td>
                      ))}

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <Edit2 className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-xl">
          <p className="text-xs text-sky-800 text-center">
            👉 Desliza horizontalmente para ver mais métricas
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DESKTOP: FULL GRID
// ============================================================================

interface DesktopAthleteGridProps {
  athletes: Athlete[];
}

function DesktopAthleteGrid({ athletes }: DesktopAthleteGridProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Por Atleta</h2>
            <p className="text-sm text-slate-600 mt-1">
              {athletes.length} atletas monitorados • {athletes.reduce((sum, a) => sum + a.totalMetrics, 0)} métricas ativas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm">
              {athletes.reduce((sum, a) => sum + a.updatedToday, 0)} atualizações hoje
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold shadow-lg shadow-sky-500/30"
            >
              + Adicionar Atleta
            </motion.button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {athletes.map((athlete, index) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AthleteCard athlete={athlete} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHARED: ATHLETE CARD
// ============================================================================

interface AthleteCardProps {
  athlete: Athlete;
  isMobile?: boolean;
}

function AthleteCard({ athlete, isMobile = false }: AthleteCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg">
              {athlete.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{athlete.name}</h3>
              <p className="text-xs text-slate-500">
                {athlete.updatedToday}/{athlete.totalMetrics} métricas hoje
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-slate-600" />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-slate-200 rounded-xl shadow-xl p-2 z-20"
                >
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-semibold">
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-semibold">
                    <Edit2 className="h-4 w-4" />
                    Editar
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm font-semibold">
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Metrics List */}
      <div className="p-4 space-y-3">
        {athlete.metrics.map((metric) => (
          <div
            key={metric.metricId}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">{metric.metricName}</p>
                <p className="text-xs text-slate-500">{metric.lastUpdated}</p>
              </div>
              <TrendIndicator trend={metric.trend} />
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {metric.currentValue}
                  <span className="text-sm font-semibold text-slate-500 ml-1">
                    {metric.unit}
                  </span>
                </p>
                {metric.previousValue !== undefined && (
                  <p className="text-xs text-slate-600">
                    vs {metric.previousValue} {metric.unit}
                  </p>
                )}
              </div>

              {metric.zone && (
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  metric.zone.color === 'emerald'
                    ? 'bg-emerald-100 text-emerald-700'
                    : metric.zone.color === 'amber'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.zone.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SHARED: METRIC CELL (for table)
// ============================================================================

interface MetricCellProps {
  metric: AthleteMetric;
}

function MetricCell({ metric }: MetricCellProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-lg font-bold text-slate-900">
          {metric.currentValue}
          <span className="text-xs font-semibold text-slate-500 ml-1">
            {metric.unit}
          </span>
        </p>
        <TrendIndicator trend={metric.trend} size="sm" />
      </div>
      <p className="text-xs text-slate-500">{metric.lastUpdated}</p>
      {metric.zone && (
        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
          metric.zone.color === 'emerald'
            ? 'bg-emerald-100 text-emerald-700'
            : metric.zone.color === 'amber'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {metric.zone.name}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// SHARED: TREND INDICATOR
// ============================================================================

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md';
}

function TrendIndicator({ trend, size = 'md' }: TrendIndicatorProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  if (trend === 'up') {
    return (
      <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
        <TrendingUp className={`${iconSize} text-emerald-600`} />
      </div>
    );
  }

  if (trend === 'down') {
    return (
      <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
        <TrendingDown className={`${iconSize} text-red-600`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full">
      <Minus className={`${iconSize} text-slate-600`} />
    </div>
  );
}
