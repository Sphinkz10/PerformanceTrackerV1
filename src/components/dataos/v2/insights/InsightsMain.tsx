/**
 * INSIGHTS MAIN - Advanced Analytics Hub
 * Athlete compare, trends, correlations, predictions, custom dashboards
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Users,
  TrendingUp,
  Grid3x3,
  AlertTriangle,
  Layout,
  ChevronRight,
  Sparkles,
  Target,
  Activity,
  Database,
} from 'lucide-react';
import { AthleteCompare } from './AthleteCompare';
import { TrendAnalysis } from './TrendAnalysis';
import { CorrelationMatrix } from './CorrelationMatrix';
import { RiskScores } from './RiskScores';
import { CustomDashboards } from './CustomDashboards';
import { HelpTooltip, InfoBadge } from '@/components/shared/HelpTooltip';

interface InsightsMainProps {
  workspaceId?: string;
  workspaceName?: string;
}

type ViewMode = 'compare' | 'trends' | 'correlation' | 'risk' | 'dashboards';

const VIEW_MODES = [
  {
    id: 'compare' as const,
    label: 'Athlete Compare',
    icon: Users,
    color: 'sky',
    description: 'Compare múltiplos atletas side-by-side',
  },
  {
    id: 'trends' as const,
    label: 'Trend Analysis',
    icon: TrendingUp,
    color: 'emerald',
    description: 'Análise de tendências temporais',
  },
  {
    id: 'correlation' as const,
    label: 'Correlation Matrix',
    icon: Grid3x3,
    color: 'violet',
    description: 'Correlações entre métricas',
  },
  {
    id: 'risk' as const,
    label: 'Risk Scores',
    icon: AlertTriangle,
    color: 'red',
    description: 'Risk scoring & predictions',
  },
  {
    id: 'dashboards' as const,
    label: 'Custom Dashboards',
    icon: Layout,
    color: 'amber',
    description: 'Dashboards personalizados',
  },
];

export function InsightsMain({ workspaceId, workspaceName }: InsightsMainProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('compare');

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-slate-900">
                    Advanced Analytics & Insights
                  </h1>
                  <p className="text-sm text-slate-500">
                    Deep dive into athlete performance data
                  </p>
                </div>
                <HelpTooltip
                  title="Insights - Análise Avançada"
                  content={
                    <>
                      <p>Hub de analytics com 5 ferramentas poderosas:</p>
                      <ul className="mt-2 space-y-2">
                        <li>
                          <strong className="text-sky-300">👥 Athlete Compare</strong>
                          <p className="text-xs text-slate-300">Comparação lado-a-lado de múltiplos atletas</p>
                        </li>
                        <li>
                          <strong className="text-emerald-300">📈 Trend Analysis</strong>
                          <p className="text-xs text-slate-300">Análise de tendências e padrões temporais</p>
                        </li>
                        <li>
                          <strong className="text-violet-300">🔗 Correlation Matrix</strong>
                          <p className="text-xs text-slate-300">Descobre correlações entre métricas</p>
                        </li>
                        <li>
                          <strong className="text-red-300">⚠️ Risk Scores</strong>
                          <p className="text-xs text-slate-300">Predição de riscos e lesões</p>
                        </li>
                        <li>
                          <strong className="text-amber-300">📊 Custom Dashboards</strong>
                          <p className="text-xs text-slate-300">Cria dashboards personalizados</p>
                        </li>
                      </ul>
                    </>
                  }
                  position="bottom"
                  size="md"
                />
                <HelpTooltip
                  title="📊 Origem dos Dados"
                  content={
                    <>
                      <p className="font-semibold mb-2">Insights analisa dados de:</p>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-emerald-300">1. Histórico Completo 📅</p>
                          <p className="text-xs text-slate-300">
                            Todos os valores registados ao longo do tempo
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-sky-300">2. Live Sessions 🏃</p>
                          <p className="text-xs text-slate-300">
                            Dados capturados durante treinos
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-purple-300">3. Forms & Manual Entry 📋</p>
                          <p className="text-xs text-slate-300">
                            Questionários e inserções manuais
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-amber-300">4. Integrações 🔗</p>
                          <p className="text-xs text-slate-300">
                            Wearables, GPS e plataformas externas
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-purple-300 border-t border-slate-700 pt-2">
                        💡 Quanto mais dados, mais precisas as análises
                      </p>
                    </>
                  }
                  position="bottom"
                  size="md"
                />
              </div>
            </div>

            {/* Workspace Info Badge */}
            {workspaceName && (
              <div className="flex items-center gap-2 mt-2">
                <InfoBadge 
                  label={`Workspace: ${workspaceName}`}
                  color="slate"
                  icon={<Database className="h-3 w-3" />}
                />
                <InfoBadge 
                  label="1,234 data points"
                  color="purple"
                  icon={<Activity className="h-3 w-3" />}
                />
                <InfoBadge 
                  label="Últimos 90 dias"
                  color="blue"
                />
              </div>
            )}
          </div>

          {/* View Mode Selector */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {VIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = viewMode === mode.id;

              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r from-${mode.color}-500 to-${mode.color}-600 text-white shadow-lg shadow-${mode.color}-500/30`
                      : `bg-${mode.color}-50 border-2 border-${mode.color}-200 text-${mode.color}-700 hover:border-${mode.color}-400`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {mode.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'compare' && <AthleteCompare />}
        {viewMode === 'trends' && <TrendAnalysis />}
        {viewMode === 'correlation' && <CorrelationMatrix />}
        {viewMode === 'risk' && <RiskScores />}
        {viewMode === 'dashboards' && <CustomDashboards />}
      </div>
    </div>
  );
}