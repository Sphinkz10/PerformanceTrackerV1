import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Calendar, 
  AlertCircle,
  Clock,
  PlayCircle,
  Search,
  Target,
  Dumbbell,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Brain,
  CheckCircle,
  X,
  Info
} from "lucide-react";
import { StatCard } from "../shared/StatCard";
import { Card } from "../shared/Card";
import { QuickSessionModal } from "../modals/QuickSessionModal";
import { LiveSessionMonitor } from "../live/LiveSessionMonitor";
import { ExecuteSessionModal } from "../modals/ExecuteSessionModal";
import { toast } from "sonner@2.0.3";
import { useDecisions } from "@/hooks/useDecisions";
import type { Decision } from "@/hooks/useDecisions";
import { CriticalDecisionCard } from "../dashboard/CriticalDecisionCard";

// 🚀 Real data hooks
import { useAnalyticsDashboard, useCalendarEvents } from "@/hooks/use-api";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";

interface DashboardProps {
  onCreateWorkout?: () => void;
  onScheduleSession?: () => void;
  onStartSession?: (sessionId: string) => void;
  onViewActiveAthletes?: () => void;
  onViewTodaySessions?: () => void;
  onViewAlerts?: () => void;
  onNavigate?: (page: string) => void;
}

export function Dashboard({ 
  onCreateWorkout, 
  onScheduleSession, 
  onStartSession,
  onViewActiveAthletes,
  onViewTodaySessions,
  onViewAlerts,
  onNavigate
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"hoje" | "semana" | "atencoes">("hoje");
  const [showQuickSessionModal, setShowQuickSessionModal] = useState(false);
  const [showExecuteSessionModal, setShowExecuteSessionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Decision Engine: Fetch real decisions from API
  const { 
    decisions: criticalDecisions, 
    pending: pendingCount, 
    critical: criticalCount,
    loading: decisionsLoading,
    applyDecision,
    dismissDecision 
  } = useDecisions({
    workspaceId: 'workspace-demo',
    limit: 3,
    status: 'pending',
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
  });

  // Analytics Dashboard: Fetch real KPIs from API
  const { 
    attendance,
    sessions: sessionsKPI,
    nextSession,
    alerts: alertsKPI,
    isLoading: dashboardLoading
  } = useAnalyticsDashboard('workspace-demo');

  // Calendar Events: Fetch today's sessions
  const today = new Date().toISOString().split('T')[0];
  const { 
    events: todayEventsRaw,
    isLoading: todayLoading
  } = useCalendarEvents('workspace-demo', {
    startDate: today,
    endDate: today
  });

  // Calendar Events: Fetch week sessions
  const weekStart = new Date();
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const { 
    events: weekEventsRaw,
    isLoading: weekLoading
  } = useCalendarEvents('workspace-demo', {
    startDate: weekStart.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0]
  });

  // Dashboard Alerts: Fetch real alerts from API
  const { 
    alerts: allAlerts,
    isLoading: alertsLoading
  } = useDashboardAlerts('workspace-demo');

  // Transform API data to component format
  const todaySessions = (todayEventsRaw || []).map((event: any) => {
    const time = new Date(event.start_date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const isInProgress = event.status === 'active';
    const isPast = new Date(event.end_date) < new Date();
    
    return {
      id: event.id,
      time,
      title: event.title,
      athletes: event.athlete_ids?.length || 0,
      status: isPast ? 'completed' : (isInProgress ? 'in-progress' : 'upcoming'),
      template: event.workout?.name || 'Sem template',
      urgency: 'none' as const,
      isNext: false, // Will be set below
    };
  }).sort((a: any, b: any) => a.time.localeCompare(b.time));

  // Mark next session
  const upcomingIndex = todaySessions.findIndex((s: any) => s.status === 'upcoming');
  if (upcomingIndex >= 0) {
    todaySessions[upcomingIndex].isNext = true;
  }

  // Transform week data
  const weekSessions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === today;
    
    const dayName = date.toLocaleDateString('pt-PT', { weekday: 'short' });
    const displayDate = isToday 
      ? `${date.getDate()} Dez (Hoje)` 
      : `${date.getDate()} Dez`;
    
    const daySessions = (weekEventsRaw || [])
      .filter((event: any) => event.start_date.startsWith(dateStr))
      .map((event: any) => ({
        id: event.id,
        time: new Date(event.start_date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        title: event.title,
        athletes: event.athlete_ids?.length || 0,
        status: 'upcoming' as const,
        template: event.workout?.name || 'Sem template',
      }));
    
    weekSessions.push({
      date: displayDate,
      day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      sessions: daySessions,
    });
  }

  // Transform alerts data
  const painAlerts = (allAlerts.pain || []).slice(0, 5).map((alert: any) => ({
    id: alert.id,
    type: 'injury_risk' as const,
    priority: 'critical' as const,
    athleteName: alert.athleteName,
    athleteAvatar: alert.athleteAvatar,
    message: `Reportou dor nível ${alert.painLevel}/10 ${alert.location ? `em ${alert.location}` : ''}`,
    timeAgo: alert.timeAgo,
    action: "Avaliar urgente",
  }));

  // Quick Actions - Ações rápidas do dashboard
  const quickActions = [
    {
      id: "quick-session",
      title: "Criar Sessão Rápida",
      description: "Iniciar treino sem agendamento",
      icon: PlayCircle,
      color: "emerald",
      onClick: () => setShowQuickSessionModal(true),
    },
    {
      id: "schedule",
      title: "Agendar Sessão",
      description: "Planear para hoje ou semana",
      icon: Calendar,
      color: "sky",
      onClick: onScheduleSession,
    },
    {
      id: "create-workout",
      title: "Novo Workout",
      description: "Design Studio - Criar template",
      icon: Dumbbell,
      color: "violet",
      onClick: onCreateWorkout,
    },
  ];

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getSessionCardClasses = (status: string, isNext?: boolean) => {
    if (status === "in-progress") {
      return {
        container: "bg-emerald-50 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
        badgeLabel: "● EM CURSO",
        button: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-md",
        buttonLabel: "Continuar",
      };
    }
    if (isNext) {
      return {
        container: "bg-sky-50 border-sky-200",
        badge: "bg-sky-100 text-sky-700",
        badgeLabel: "▶ PRÓXIMA",
        button: "bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 shadow-md",
        buttonLabel: "Preparar",
      };
    }
    if (status === "upcoming") {
      return {
        container: "bg-white border-slate-200",
        badge: "bg-slate-100 text-slate-700",
        badgeLabel: "",
        button: "border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
        buttonLabel: "Ver Detalhes",
      };
    }
    return {
      container: "bg-slate-50 border-slate-200",
      badge: "bg-slate-100 text-slate-600",
      badgeLabel: "✅ CONCLUÍDA",
      button: "",
      buttonLabel: "",
    };
  };

  const getAlertColors = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          bg: "from-red-50 to-orange-50",
          border: "border-red-200",
          icon: "from-red-500 to-red-600",
          text: "text-red-700",
        };
      case "high":
        return {
          bg: "from-amber-50 to-orange-50",
          border: "border-amber-200",
          icon: "from-amber-500 to-amber-600",
          text: "text-amber-700",
        };
      case "medium":
        return {
          bg: "from-sky-50 to-blue-50",
          border: "border-sky-200",
          icon: "from-sky-500 to-sky-600",
          text: "text-sky-700",
        };
      default:
        return {
          bg: "from-emerald-50 to-green-50",
          border: "border-emerald-200",
          icon: "from-emerald-500 to-emerald-600",
          text: "text-emerald-700",
        };
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleCreateQuickSession = (data: {
    athleteIds: string[];
    templateId?: string;
    duration: number;
  }) => {
    toast.success(`Sessão criada: ${data.athleteIds.length} atletas, ${data.duration}min`);
    setShowQuickSessionModal(false);
    if (onStartSession) {
      onStartSession("quick-session");
    }
  };

  const handleSessionAction = (sessionId: string, action: string) => {
    const session = todaySessions.find(s => s.id === sessionId);
    if (!session) return;

    if (action === "continue") {
      toast.success(`Continuando: ${session.title}`);
      onStartSession?.(sessionId);
    } else if (action === "prepare") {
      toast.info(`Preparando sessão: ${session.title}`);
      setTimeout(() => {
        toast.success("Atletas confirmados! Pronto para iniciar.");
      }, 1000);
    } else if (action === "view") {
      toast.info(`Visualizando detalhes: ${session.title}`);
      onNavigate?.("calendar");
    }
  };

  const handleApplyDecision = async (decisionId: string, action?: string) => {
    try {
      const decision = criticalDecisions.find(d => d.id === decisionId);
      await applyDecision(decisionId, action || decision?.suggestedActions[0]?.type || 'apply');
      toast.success(`Decisão aplicada: ${decision?.athleteName}`, {
        description: decision?.recommendation
      });
    } catch (error) {
      toast.error("Erro ao aplicar decisão");
    }
  };

  const handleDismissDecision = async (decisionId: string) => {
    try {
      await dismissDecision(decisionId);
      toast.info("Decisão ignorada", {
        description: "Esta recomendação foi dispensada"
      });
    } catch (error) {
      toast.error("Erro ao dispensar decisão");
    }
  };

  const handleViewDecisionDetails = (decisionId: string) => {
    toast.info("Ver detalhes completos");
    onNavigate?.("data-os");
  };

  const handleAlertAction = (alertId: string, action: string) => {
    const alert = painAlerts.find(a => a.id === alertId);
    if (!alert) return;

    toast.success(`Ação: ${action} - ${alert.athleteName}`);
    
    if (action === "Avaliar urgente") {
      onNavigate?.("data-os");
    } else if (action === "Contactar") {
      onNavigate?.("athletes");
    } else if (action === "Rever plano") {
      onNavigate?.("calendar");
    } else if (action === "Reenviar") {
      onNavigate?.("form-center");
    } else if (action === "Agendar") {
      onNavigate?.("calendar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/95 to-white/95 pb-24 sm:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Dashboard Title + Quick Stats */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Hoje, 4 Dezembro 2024 • 5 Sessões • 7 Alertas
              </p>
            </div>
            
            {/* Search - Desktop only */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Procurar atleta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            { id: "hoje", label: "Hoje", emoji: "📅" },
            { id: "semana", label: "Semana", emoji: "📆" },
            { id: "atencoes", label: "Atenções", emoji: "⚡" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* KPIs Essenciais - ✅ Day 13: Already responsive 2/4 cols */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              key: "present_athletes",
              label: "Atletas Presentes",
              value: `${attendance.present}/${attendance.total}`,
              percentage: attendance.percentage,
              trend: attendance.trend,
              icon: Users,
              color: "emerald",
              onClick: onViewActiveAthletes,
            },
            {
              key: "completed_sessions",
              label: "Sessões Concluídas",
              value: `${sessionsKPI.completedToday}/${sessionsKPI.totalToday}`,
              percentage: sessionsKPI.completionRate,
              trend: sessionsKPI.trend,
              icon: Calendar,
              color: "sky",
              onClick: onViewTodaySessions,
            },
            {
              key: "next_session",
              label: "Próxima Sessão",
              value: nextSession.time,
              subtext: nextSession.minutesUntil > 0 ? `em ${Math.floor(nextSession.minutesUntil / 60)}h` : nextSession.title || 'Nenhuma',
              icon: Clock,
              color: "violet",
              onClick: () => {
                toast.info(`Próxima sessão: ${nextSession.title || 'Nenhuma agendada'} às ${nextSession.time}`);
              },
            },
            {
              key: "urgent_alerts",
              label: "Atenções Urgentes",
              value: `${alertsKPI.total}`,
              subtext: "Requer ação",
              icon: AlertCircle,
              color: "red",
              onClick: () => setActiveTab("atencoes"),
            },
          ].map((kpi, index) => (
            <StatCard
              key={kpi.key}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend || kpi.subtext}
              trendPositive={kpi.percentage ? kpi.percentage > 50 : true}
              color={kpi.color as any}
              delay={index * 0.1}
              action={kpi.onClick}
            />
          ))}
        </div>

        {/* Tab Content: HOJE - ✅ Day 13: Already responsive 1/3 cols layout */}
        {activeTab === "hoje" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Main Column - 70% */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              
              {/* Live Session Monitor - Only show if there's a session in progress */}
              {todaySessions.some(s => s.status === 'in-progress') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    title="🔴 Sessão Ao Vivo"
                    subtitle="Monitorização em tempo real"
                    action={
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="h-2 w-2 rounded-full bg-red-500"
                        />
                        <span className="text-xs text-red-600 font-medium">LIVE</span>
                      </div>
                    }
                  >
                    <LiveSessionMonitor sessionId={todaySessions.find(s => s.status === 'in-progress')?.id || "2"} />
                  </Card>
                </motion.div>
              )}

              {/* Today's Sessions */}
              <Card
                title="⭐ Agenda de Hoje"
                subtitle={`${todaySessions.length} sessões agendadas`}
                action={
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onViewTodaySessions}
                    className="text-xs text-sky-600 font-medium px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    Ver tudo
                  </motion.button>
                }
              >
                <div className="space-y-3">
                  {todaySessions.map((session, index) => {
                    const classes = getSessionCardClasses(session.status, session.isNext);
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl border ${classes.container} hover:shadow-md transition-all`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-center shrink-0">
                            <div className="text-2xl font-bold text-slate-900">{session.time}</div>
                            {classes.badgeLabel && (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${classes.badge}`}>
                                {classes.badgeLabel}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                              <Dumbbell className="inline h-4 w-4 mr-1 text-sky-600" />
                              {session.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-1">
                              <Target className="inline h-3 w-3 mr-1" />
                              Template: <span className="font-medium">{session.template}</span>
                            </p>
                            <p className="text-xs text-slate-500">
                              <Users className="inline h-3 w-3 mr-1" />
                              {session.athletes} atletas agendados
                            </p>
                          </div>

                          {classes.buttonLabel && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (session.status === "in-progress") {
                                  handleSessionAction(session.id, "continue");
                                } else if (session.isNext) {
                                  handleSessionAction(session.id, "prepare");
                                } else {
                                  handleSessionAction(session.id, "view");
                                }
                              }}
                              className={`shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${classes.button}`}
                            >
                              {session.status === "in-progress" && <PlayCircle className="h-4 w-4" />}
                              <span>{classes.buttonLabel}</span>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Sidebar - 30% */}
            <div className="lg:col-span-1 space-y-4">
              {/* Quick Actions */}
              <Card title="⚡ Ações Rápidas" subtitle="Criar e agendar">
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
                      className={`group w-full p-4 rounded-xl border-2 bg-gradient-to-br hover:shadow-xl transition-all text-left ${
                        action.color === "emerald"
                          ? "border-emerald-200 from-emerald-50 to-white hover:border-emerald-400"
                          : action.color === "sky"
                          ? "border-sky-200 from-sky-50 to-white hover:border-sky-400"
                          : "border-violet-200 from-violet-50 to-white hover:border-violet-400"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                          action.color === "emerald"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                            : action.color === "sky"
                            ? "bg-gradient-to-br from-sky-500 to-sky-600"
                            : "bg-gradient-to-br from-violet-500 to-violet-600"
                        }`}>
                          <action.icon className="h-7 w-7 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 mb-1">{action.title}</h4>
                          <p className="text-xs text-slate-600">{action.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab Content: SEMANA */}
        {activeTab === "semana" && (
          <Card title="📆 Próximos 7 Dias" subtitle="Planeamento semanal">
            <div className="space-y-4">
              {weekSessions.map((day, dayIndex) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-slate-900">{day.day}</div>
                    <div className="text-sm text-slate-500">{day.date}</div>
                    {day.sessions.length === 0 && (
                      <span className="text-xs text-slate-400 ml-2">Sem sessões</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {day.sessions.map((session, index) => {
                      const classes = getSessionCardClasses(session.status);
                      
                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (dayIndex * 0.1) + (index * 0.05) }}
                          className={`p-4 rounded-2xl border ${classes.container} hover:shadow-md transition-all`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-center shrink-0">
                              <div className="text-2xl font-bold text-slate-900">{session.time}</div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-slate-900 mb-1">
                                <Dumbbell className="inline h-4 w-4 mr-1 text-sky-600" />
                                {session.title}
                              </h3>
                              <p className="text-sm text-slate-600 mb-1">
                                <Target className="inline h-3 w-3 mr-1" />
                                Template: <span className="font-medium">{session.template}</span>
                              </p>
                              <p className="text-xs text-slate-500">
                                <Users className="inline h-3 w-3 mr-1" />
                                {session.athletes} atletas agendados
                              </p>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                toast.info(`Visualizando: ${session.title}`);
                                onNavigate?.("calendar");
                              }}
                              className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                            >
                              Ver Detalhes
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab Content: ATENÇÕES */}
        {activeTab === "atencoes" && (
          <div className="space-y-4 sm:space-y-5">
            {/* AI Decisions Section */}
            {criticalDecisions.length > 0 && (
              <Card 
                title="🤖 Decisões IA - Críticas" 
                subtitle={`${criticalDecisions.length} recomendações automáticas`}
                action={
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('data-os');
                      } else {
                        toast.info("Navegar para Data OS");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:from-violet-400 hover:to-violet-500 transition-all"
                  >
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">Ver Data OS</span>
                    <span className="sm:hidden">Ver</span>
                  </motion.button>
                }
              >
                <div className="space-y-3">
                  {criticalDecisions.slice(0, 3).map((decision, index) => (
                    <CriticalDecisionCard
                      key={decision.id}
                      decision={decision}
                      onApply={handleApplyDecision}
                      onDismiss={handleDismissDecision}
                      onViewDetails={handleViewDecisionDetails}
                      index={index}
                    />
                  ))}
                </div>

                {criticalDecisions.length > 3 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.info(`${criticalDecisions.length - 3} decisões adicionais`)}
                    className="w-full mt-3 px-4 py-3 text-sm font-medium rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Ver mais {criticalDecisions.length - 3} decisões IA
                  </motion.button>
                )}
              </Card>
            )}

            {/* Other Alerts */}
            <Card 
              title="⚠️ Outros Alertas" 
              subtitle={`${painAlerts.length} itens requerem atenção`}
            >
              <div className="space-y-3">
                {painAlerts.map((alert, index) => {
                  const colors = getAlertColors(alert.priority);
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl bg-gradient-to-r ${colors.bg} border ${colors.border}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="shrink-0 h-10 w-10 rounded-full overflow-hidden border-2 border-opacity-50">
                          <img src={alert.athleteAvatar} alt={alert.athleteName} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 mb-1">{alert.athleteName}</h4>
                          <p className={`text-xs ${colors.text} mb-2`}>{alert.message}</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              alert.priority === "critical"
                                ? "bg-red-200 text-red-800"
                                : alert.priority === "high"
                                ? "bg-amber-200 text-amber-800"
                                : "bg-sky-200 text-sky-800"
                            }`}>
                              {alert.priority === "critical" ? "🔴 Crítico" : alert.priority === "high" ? "🟠 Urgente" : "🔵 Importante"}
                            </span>
                            <span className="text-xs text-slate-500">{alert.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAlertAction(alert.id, alert.action)}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                            alert.priority === "critical"
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {alert.action}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toast.success("Marcado como visto")}
                          className="px-3 py-2 text-xs font-medium rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          Visto
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Session Modal */}
      <QuickSessionModal
        isOpen={showQuickSessionModal}
        onClose={() => setShowQuickSessionModal(false)}
        onCreateSession={handleCreateQuickSession}
      />

      {/* Execute Session Modal */}
      <ExecuteSessionModal
        isOpen={showExecuteSessionModal}
        onClose={() => setShowExecuteSessionModal(false)}
        sessionData={{
          id: "test-1",
          title: "🧪 TESTE: Adicionar Exercícios",
          time: "15:00",
          athletes: 1,
          template: "Teste de Funcionalidade"
        }}
        mode="template"
      />
    </div>
  );
}