/**
 * METRICS & HEALTH TAB - FASE 2 INTEGRATED ✅
 * 
 * Enhanced health tab with:
 * - Physical metrics with inline editing ✅ NEW!
 * - Active metrics cards for the athlete (FROM API)
 * - Decision timeline (AI recommendations history)
 * - Pending forms badge
 * - Injury tracking (existing)
 * 
 * @author PerformTrack Team
 * @since Fase 2 - Profile Integration
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, AlertCircle, CheckCircle, Clock, TrendingUp, TrendingDown, Minus,
  Plus, Activity, Stethoscope, Pill, UserCheck, Calendar, BarChart3, Brain,
  FileText, AlertTriangle, LineChart
} from 'lucide-react';
import { AddInjuryModal } from '@/components/modals/AddInjuryModal';
import { useDecisions } from '@/hooks/useDecisions';
import { useAthleteMetrics } from '@/hooks/use-api';
import { useAthleteInjuries } from '@/hooks/use-api';
import { PhysicalMetricsStrip } from '../PhysicalMetricsStrip';
import { EditPhysicalDrawer } from '../drawers/EditPhysicalDrawer';
import { MetricHistoryChart } from '../charts/MetricHistoryChart';
import { toast } from 'sonner@2.0.3';

interface MetricsHealthTabProps {
  athleteId: string;
}

export function MetricsHealthTab({ athleteId }: MetricsHealthTabProps) {
  const [isAddInjuryOpen, setIsAddInjuryOpen] = useState(false);
  const [isEditPhysicalOpen, setIsEditPhysicalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'recovering' | 'recovered'>('all');
  
  // ✅ NEW DAY 4: History chart state
  const [selectedMetric, setSelectedMetric] = useState<{
    name: string;
    displayName: string;
    unit: string;
    color: string;
    currentValue: number;
  } | null>(null);
  
  // ✅ INTEGRATED: Fetch real metrics from API
  const { metrics: metricsData, isLoading: metricsLoading } = useAthleteMetrics(athleteId);
  
  // ✅ INTEGRATED: Fetch decisions
  const { decisions, isLoading: decisionsLoading } = useDecisions('workspace-demo', {
    athleteId,
    status: 'pending',
    limit: 10
  });

  // ✅ FASE 4: Fetch real injuries from API
  const { injuries: injuriesData, grouped: groupedInjuries, stats: injuryStats, isLoading: injuriesLoading } = useAthleteInjuries(athleteId);

  // Use real injuries data
  const injuries = injuriesData || [];

  // ✅ NEW: Mock physical data (will be replaced with API call)
  const [physicalData, setPhysicalData] = useState({
    age: 28,
    height_cm: 178.5,
    weight_kg: 75.5,
    body_fat_percentage: 12.3,
    lean_mass_kg: 66.2,
    wingspan_cm: 182.0,
    last_updated: new Date().toISOString(),
    source: 'manual' as const
  });

  // ✅ NEW: Mock athlete data (will be replaced with actual athlete)
  const mockAthlete = {
    id: athleteId,
    name: 'João Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + athleteId
  };

  // ✅ NEW: Handle physical data save
  const handleSavePhysical = async (updates: any) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/athletes/${athleteId}/metrics`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      
      // For now, just update local state
      setPhysicalData(prev => ({ ...prev, ...updates }));
      setIsEditPhysicalOpen(false);
      
      toast.success('✅ Dados físicos atualizados!', {
        description: 'As métricas foram guardadas com sucesso.'
      });

      // Refresh metrics
      // mutate();
    } catch (error) {
      toast.error('❌ Erro ao guardar', {
        description: 'Não foi possível atualizar os dados físicos.'
      });
    }
  };
  
  // Helper: Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  // Filter injuries (map API status to UI status)
  const filteredInjuries = activeFilter === 'all' 
    ? injuries 
    : injuries.filter((i: any) => {
        // Map API status to UI recoveryStatus
        if (activeFilter === 'active') return i.status === 'active';
        if (activeFilter === 'recovering') return i.status === 'recovering';
        if (activeFilter === 'recovered') return i.status === 'recovered';
        return true;
      });

  // Convert API metrics to display format
  const iconMap: Record<string, any> = {
    Heart,
    Clock,
    Activity,
    TrendingDown,
    Brain,
    Zap: Activity
  };

  const colorMap: Record<string, string> = {
    emerald: 'emerald',
    sky: 'sky',
    amber: 'amber',
    violet: 'violet',
    red: 'red',
    purple: 'violet'
  };

  const ATHLETE_ACTIVE_METRICS = metricsData?.map((metric: any) => ({
    id: metric.id,
    name: metric.name,
    unit: metric.unit,
    current: metric.current_value,
    baseline: metric.previous_value,
    trend: metric.trend,
    trendPercent: metric.current_value - metric.previous_value,
    zone: metric.status === 'excellent' || metric.status === 'good' ? 'green' : 
          metric.status === 'moderate' ? 'yellow' : 'red',
    lastUpdated: new Date(metric.last_updated).toLocaleDateString('pt-PT'),
    icon: iconMap[metric.icon] || Activity,
    color: colorMap[metric.color] || 'sky'
  })) || [];
  
  // Pending forms count (mock)
  const pendingFormsCount = 2;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'low':
        return {
          label: 'Leve',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        };
      case 'medium':
        return {
          label: 'Média',
          color: 'bg-amber-500',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      case 'high':
        return {
          label: 'Alta',
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'critical':
        return {
          label: 'Crítica',
          color: 'bg-purple-500',
          textColor: 'text-purple-700',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          label: 'Desconhecida',
          color: 'bg-slate-500',
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativa',
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'recovering':
        return {
          label: 'Em Recuperação',
          icon: Activity,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      case 'recovered':
        return {
          label: 'Recuperada',
          icon: CheckCircle,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'green': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
      case 'yellow': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
      case 'red': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
      default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* PENDING FORMS BADGE - NEW */}
      {pendingFormsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {pendingFormsCount} Formulário{pendingFormsCount > 1 ? 's' : ''} Pendente{pendingFormsCount > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-amber-700">Aguardando resposta do atleta</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              Ver Formulários
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ACTIVE METRICS SECTION - NEW */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">📊 Métricas Ativas</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-sky-600 font-medium px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors"
          >
            Ver detalhes
          </motion.button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {ATHLETE_ACTIVE_METRICS.map((metric) => {
            const Icon = metric.icon;
            const zoneColors = getZoneColor(metric.zone);
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border-2 p-4 ${zoneColors.bg} ${zoneColors.border} relative group`}
              >
                {/* ✅ NEW DAY 4: History button */}
                <button
                  onClick={() => setSelectedMetric({
                    name: metric.name.toLowerCase().replace(/\s+/g, '_'),
                    displayName: metric.name,
                    unit: metric.unit,
                    color: metric.color,
                    currentValue: metric.current
                  })}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-white border border-slate-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  title="Ver histórico"
                >
                  <LineChart className="h-3.5 w-3.5 text-slate-600" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-8 w-8 rounded-lg ${metric.color === 'emerald' ? 'bg-emerald-500' : metric.color === 'amber' ? 'bg-amber-500' : 'bg-sky-500'} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xs font-medium text-slate-600">{metric.name}</h3>
                </div>

                <div className="mb-2">
                  <p className="text-2xl font-bold text-slate-900">
                    {metric.current}
                    <span className="text-sm text-slate-600 font-normal ml-1">{metric.unit}</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Baseline: {metric.baseline}{metric.unit}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-600" />}
                    {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {metric.trend === 'stable' && <Minus className="h-3 w-3 text-amber-600" />}
                    <span className={`text-xs font-medium ${
                      metric.trend === 'up' ? 'text-emerald-600' :
                      metric.trend === 'down' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>
                      {metric.trendPercent > 0 ? '+' : ''}{metric.trendPercent.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{metric.lastUpdated}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI DECISIONS TIMELINE - NEW */}
      {decisions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">🤖 Timeline de Decisões IA</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700 font-medium">
              {decisions.length}
            </span>
          </div>

          <div className="space-y-3">
            {decisions.slice(0, 5).map((decision, index) => {
              const priorityColors = {
                critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
                high: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
                medium: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500' },
              };
              const colors = priorityColors[decision.priority];

              return (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border-2 p-4 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex gap-3">
                    <div className={`shrink-0 h-10 w-10 rounded-full ${colors.dot} flex items-center justify-center text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{decision.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{decision.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} font-medium shrink-0 ml-2`}>
                          {decision.priority === 'critical' ? 'Crítico' : decision.priority === 'high' ? 'Alto' : 'Médio'}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        💡 {decision.recommendation}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(decision.triggeredAt).toLocaleString('pt-PT')}</span>
                        <span className="text-slate-400">•</span>
                        <span>Confiança: {(decision.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* INJURIES SECTION (existing) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">🏥 Lesões & Recuperação</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddInjuryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:from-red-400 hover:to-red-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Registar Lesão</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Todas', count: injuries.length },
            { id: 'active', label: 'Ativas', count: injuries.filter((i: any) => i.status === 'active').length },
            { id: 'recovering', label: 'Em Recuperação', count: injuries.filter((i: any) => i.status === 'recovering').length },
            { id: 'recovered', label: 'Recuperadas', count: injuries.filter((i: any) => i.status === 'recovered').length },
          ].map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-red-300'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === filter.id
                  ? 'bg-white/20'
                  : 'bg-slate-100'
              }`}>
                {filter.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Injuries List */}
        {filteredInjuries.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Heart className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>Nenhuma lesão registada neste filtro</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInjuries.map((injury: any, index) => {
              const severityConfig = getSeverityConfig(injury.severity);
              const statusConfig = getStatusConfig(injury.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={injury.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border-2 p-4 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 h-12 w-12 rounded-xl ${severityConfig.bgColor} ${severityConfig.borderColor} border-2 flex items-center justify-center`}>
                      <AlertCircle className={`h-6 w-6 ${severityConfig.textColor}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{injury.body_part}</h3>
                          <p className="text-sm text-slate-600">{injury.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${severityConfig.bgColor} ${severityConfig.textColor}`}>
                            {severityConfig.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 mb-3">{injury.description}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-600">Data da Lesão</p>
                          <p className="text-sm font-medium text-slate-900">{formatDate(injury.injury_date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Recuperação Prevista</p>
                          <p className="text-sm font-medium text-slate-900">
                            {injury.expected_recovery_date ? formatDate(injury.expected_recovery_date) : 'N/A'}
                          </p>
                        </div>
                        {injury.restrictions && injury.restrictions.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-xs text-slate-600 mb-1">Restrições</p>
                            <div className="flex flex-wrap gap-1">
                              {injury.restrictions.slice(0, 2).map((r: string, i: number) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-700">
                                  {r}
                                </span>
                              ))}
                              {injury.restrictions.length > 2 && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                  +{injury.restrictions.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Injury Modal */}
      <AddInjuryModal 
        isOpen={isAddInjuryOpen}
        onClose={() => setIsAddInjuryOpen(false)}
        athleteId={athleteId}
      />

      {/* Edit Physical Drawer */}
      <EditPhysicalDrawer
        isOpen={isEditPhysicalOpen}
        onClose={() => setIsEditPhysicalOpen(false)}
        athleteId={athleteId}
        athleteName={mockAthlete.name}
        athleteAvatar={mockAthlete.avatar}
        physicalData={physicalData}
        onSave={handleSavePhysical}
      />

      {/* Physical Metrics Strip */}
      <PhysicalMetricsStrip
        athleteId={athleteId}
        athleteName={mockAthlete.name}
        athleteAvatar={mockAthlete.avatar}
        physicalData={physicalData}
        onEdit={() => setIsEditPhysicalOpen(true)}
      />

      {/* ✅ NEW DAY 4: Metric History Chart Drawer */}
      {selectedMetric && (
        <MetricHistoryChart
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          athleteId={athleteId}
          metricName={selectedMetric.name}
          metricDisplayName={selectedMetric.displayName}
          metricUnit={selectedMetric.unit}
          metricColor={selectedMetric.color}
          currentValue={selectedMetric.currentValue}
        />
      )}
    </div>
  );
}