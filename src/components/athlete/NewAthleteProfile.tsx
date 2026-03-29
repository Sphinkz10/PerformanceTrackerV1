/**
 * ATHLETE PROFILE - MASTER PLAN INTEGRATION ✅
 * 
 * Perfil completo do atleta com dados REAIS da API
 * NO MORE MOCK FALLBACKS!
 * ✅ Day 11: Responsive refinements
 * 
 * @since Master Plan - Step 1.2
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Play, FileText, MoreVertical,
  Activity, TrendingUp, Zap, Brain, Heart, History, Settings,
  AlertCircle
} from 'lucide-react';
import { useAthlete, useAthleteMetrics } from '@/hooks/use-api';
import { useResponsive } from '@/hooks/useResponsive'; // ✅ Day 11
import { AthleteHeader } from './profile/AthleteHeader';
import { SmartKPIStrip } from './profile/SmartKPIStrip';
import { BiologicalState } from './profile/BiologicalState';
import { RecordsPanel } from './profile/RecordsPanel';
import { WidgetDashboard } from './profile/WidgetDashboard';
import { SessionsTab } from './tabs/SessionsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { HealthTab } from './tabs/HealthTab';
import { MetricsHealthTab } from './tabs/MetricsHealthTab';
import { HistoryTab } from './tabs/HistoryTab';

interface NewAthleteProfileProps {
  athleteId?: string;
  onBack?: () => void;
  isSelfView?: boolean; // ✅ New prop for athlete self-view mode
}

type ProfileSection = 'overview' | 'sessions' | 'reports' | 'health' | 'history';

export function NewAthleteProfile({ athleteId = 'athlete-1', onBack, isSelfView = false }: NewAthleteProfileProps) {
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');

  // ✅ MASTER PLAN: Use real API hooks WITHOUT fallback
  const { athlete, isLoading: athleteLoading, error: athleteError } = useAthlete(athleteId);
  const { metrics, grouped, isLoading: metricsLoading, error: metricsError } = useAthleteMetrics(athleteId);

  // ✅ NEW: real biological metrics in the format expected by BiologicalState
  const [biologicalMetrics, setBiologicalMetrics] = useState<any[]>([]);
  const [bioLoading, setBioLoading] = useState(false);

  useEffect(() => {
    async function loadBiologicalMetrics() {
      const workspaceId = (athlete as any)?.workspace_id;

      if (!athleteId || !workspaceId) {
        setBiologicalMetrics([]);
        return;
      }

      try {
        setBioLoading(true);

        const { supabase } = await import('@/lib/supabase/client');

        // 1) find relevant metrics for this workspace
        const { data: workspaceMetrics, error: metricsError } = await supabase
          .from('metrics')
          .select('id, name')
          .eq('workspace_id', workspaceId)
          .in('name', ['stress', 'readiness', 'motivation', 'sleep_quality']);

        if (metricsError) throw metricsError;

        if (!workspaceMetrics || workspaceMetrics.length === 0) {
          setBiologicalMetrics([]);
          return;
        }

        const metricIds = workspaceMetrics.map((m) => m.id);

        // 2) fetch latest updates for this athlete
        const { data: updates, error: updatesError } = await supabase
          .from('metric_updates')
          .select('metric_id, value, recorded_at')
          .eq('athlete_id', athleteId)
          .in('metric_id', metricIds)
          .order('recorded_at', { ascending: false });

        if (updatesError) throw updatesError;

        // 3) keep only the latest update per metric
        const latestByMetricId = new Map<string, any>();
        for (const row of updates || []) {
          if (!latestByMetricId.has(row.metric_id)) {
            latestByMetricId.set(row.metric_id, row);
          }
        }

        // 4) map to BiologicalState expected format
        const mapped = workspaceMetrics.map((m) => ({
          metric_id: m.name, // BiologicalState expects 'stress', 'readiness', etc.
          current_value: latestByMetricId.get(m.id)?.value ?? null,
        }));

        setBiologicalMetrics(mapped);
      } catch (err) {
        console.error('Error loading biological metrics:', err);
        setBiologicalMetrics([]);
      } finally {
        setBioLoading(false);
      }
    }

    loadBiologicalMetrics();
  }, [athleteId, (athlete as any)?.workspace_id]);

  // ✅ LOADING STATE
  if (athleteLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">A carregar perfil do atleta...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (athleteError || !athlete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="p-4 rounded-full bg-red-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Atleta não encontrado</h2>
          <p className="text-slate-600 mb-6">
            Não foi possível carregar os dados do atleta. Verifique se o ID está correto.
          </p>
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="inline h-5 w-5 mr-2" />
              Voltar aos Atletas
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview' as ProfileSection, label: 'Visão Geral', icon: Activity },
    { id: 'sessions' as ProfileSection, label: 'Sessões', icon: Zap },
    { id: 'reports' as ProfileSection, label: 'Relatórios', icon: FileText },
    { id: 'health' as ProfileSection, label: 'Métricas & Saúde', icon: Heart },
    { id: 'history' as ProfileSection, label: 'Histórico', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <AthleteHeader athlete={athlete} onBack={onBack} />

      {/* KPIs Strip */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4">
        <SmartKPIStrip athleteId={athleteId} />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap text-sm font-semibold ${isActive
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna 1: Health & Records */}
              <div className="space-y-6">
                <BiologicalState metrics={biologicalMetrics} />
                <RecordsPanel athleteId={athleteId} />
              </div>

              {/* Coluna 2: Widgets */}
              <div>
                <WidgetDashboard athleteId={athleteId} />
              </div>
            </div>
          )}

          {activeSection === 'sessions' && (
            <SessionsTab athleteId={athleteId} />
          )}

          {activeSection === 'reports' && (
            <ReportsTab athleteId={athleteId} />
          )}

          {activeSection === 'health' && (
            <MetricsHealthTab athleteId={athleteId} />
          )}

          {activeSection === 'history' && (
            <HistoryTab athleteId={athleteId} />
          )}
        </motion.div>
      </div>
    </div>
  );
}