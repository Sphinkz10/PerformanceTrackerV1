import React, { useState } from 'react';
import { Play, X, Calendar, Activity, AlertCircle, Clock, CheckCircle2, ChevronRight, FileText, ActivitySquare, ShieldAlert } from 'lucide-react';
import { useAnalyticsDashboard } from '../../../hooks/api/use-analytics-api';
import { useDashboardAlerts } from '../../../hooks/useDashboardAlerts';
import { useCalendarEvents } from '../../../hooks/api/use-calendar-api';

export function MainDashboard() {
  const workspaceId = 'ws-1'; // Mock workspace
  const { data: analytics } = useAnalyticsDashboard(workspaceId);
  const { data: alerts } = useDashboardAlerts(workspaceId);
  const { data: events } = useCalendarEvents(workspaceId, {
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
  });

  const [activeTab, setActiveTab] = useState<'hoje' | 'semana' | 'atencoes'>('hoje');

  // Helper to open modal visually for now
  const openModal = (id: string) => {
    document.getElementById(id)?.classList.add('open');
  };

  return (
    <div className="flex flex-col h-full opacity-0 animate-[fadeUp_0.5s_ease-out_0.35s_forwards]">

      {/* Page header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-white mb-1 leading-tight">Dashboard</h1>
          <p className="text-[0.875rem] text-muted-hi">
            Bem-vindo de volta, <b className="text-gold font-bold">Treinador Silva</b> &middot; {events?.length || 3} sessões agendadas hoje
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/10 border border-gold/25">
          <Calendar className="w-3 h-3 stroke-gold stroke-[2.5]" />
          <span className="text-[0.62rem] font-bold text-gold tracking-[1.2px] uppercase">
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 opacity-0 animate-[fadeUp_0.5s_ease-out_0.45s_forwards]">

        <div
          className="relative overflow-hidden rounded-2xl border border-sky_l/10 p-4.5 cursor-pointer transition-all duration-250 hover:border-gold/25 hover:-translate-y-0.5 glass-strong group before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-teal/50 before:to-transparent"
          onClick={() => openModal('athletesModal')}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[0.62rem] font-bold text-muted uppercase tracking-[1.2px]">Atletas Presentes</span>
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-teal/10 text-teal">
              <UsersIcon className="w-4 h-4 stroke-2" />
            </div>
          </div>
          <div className="font-display text-[1.75rem] font-bold text-white leading-none">
            {analytics?.attendance?.present || 8}<small className="text-[0.875rem] text-sky_l/60 font-medium ml-1">/ {analytics?.attendance?.total || 12}</small>
          </div>
          <div className="text-[0.65rem] mt-1.5 flex items-center gap-1 text-teal">
            {analytics?.attendance?.rate || '66%'} taxa de presença
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-sky_l/10 p-4.5 cursor-pointer transition-all duration-250 hover:border-gold/25 hover:-translate-y-0.5 glass-strong group before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-gold/50 before:to-transparent"
          onClick={() => openModal('todaySessionsModal')}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[0.62rem] font-bold text-muted uppercase tracking-[1.2px]">Sessões</span>
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-gold/10 text-gold">
              <Activity className="w-4 h-4 stroke-2" />
            </div>
          </div>
          <div className="font-display text-[1.75rem] font-bold text-white leading-none">
            {analytics?.sessions?.completed || 2}<small className="text-[0.875rem] text-sky_l/60 font-medium ml-1">/ {events?.length || 3}</small>
          </div>
          <div className="text-[0.65rem] mt-1.5 flex items-center gap-1 text-gold">
            {analytics?.sessions?.completionRate || '66%'} concluídas
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-sky_l/10 p-4.5 cursor-pointer transition-all duration-250 hover:border-gold/25 hover:-translate-y-0.5 glass-strong group before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-orange_l/50 before:to-transparent">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[0.62rem] font-bold text-muted uppercase tracking-[1.2px]">Próxima Sessão</span>
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-orange_l/10 text-orange_l">
              <Clock className="w-4 h-4 stroke-2" />
            </div>
          </div>
          <div className="font-display text-[1.25rem] font-bold text-white leading-none mt-1.5">
            {analytics?.nextSession?.athleteName || 'Maria Costa'}
          </div>
          <div className="text-[0.65rem] mt-2 flex items-center gap-1 text-gold">
            {analytics?.nextSession?.timeUntil || 'em 1h 23min'}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-sky_l/10 p-4.5 cursor-pointer transition-all duration-250 hover:border-gold/25 hover:-translate-y-0.5 glass-strong group before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-danger/50 before:to-transparent"
          onClick={() => openModal('alertsModal')}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[0.62rem] font-bold text-muted uppercase tracking-[1.2px]">Atenções</span>
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-danger/10 text-danger">
              <AlertCircle className="w-4 h-4 stroke-2" />
            </div>
          </div>
          <div className="font-display text-[1.75rem] font-bold text-white leading-none">
            {alerts?.length || 5}
          </div>
          <div className="text-[0.65rem] mt-1.5 flex items-center gap-1 text-danger">
            {alerts?.filter(a => a.severity === 'critical')?.length || 2} críticas
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-full bg-navy/50 border border-sky_l/10 mb-6 w-fit opacity-0 animate-[fadeUp_0.5s_ease-out_0.55s_forwards]">
        <button
          className={`px-5 py-2 rounded-full border-none font-sans text-[0.75rem] font-bold cursor-pointer transition-all duration-250 uppercase tracking-[0.8px] ${activeTab === 'hoje' ? 'bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(255,183,1,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]' : 'bg-transparent text-sky_l hover:text-white'}`}
          onClick={() => setActiveTab('hoje')}
        >
          Hoje
        </button>
        <button
          className={`px-5 py-2 rounded-full border-none font-sans text-[0.75rem] font-bold cursor-pointer transition-all duration-250 uppercase tracking-[0.8px] ${activeTab === 'semana' ? 'bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(255,183,1,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]' : 'bg-transparent text-sky_l hover:text-white'}`}
          onClick={() => setActiveTab('semana')}
        >
          Semana
        </button>
        <button
          className={`px-5 py-2 rounded-full border-none font-sans text-[0.75rem] font-bold cursor-pointer transition-all duration-250 uppercase tracking-[0.8px] ${activeTab === 'atencoes' ? 'bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(255,183,1,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]' : 'bg-transparent text-sky_l hover:text-white'}`}
          onClick={() => setActiveTab('atencoes')}
        >
          Atenções
        </button>
      </div>

      {/* Main grid 70/30 */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 opacity-0 animate-[fadeUp_0.5s_ease-out_0.65s_forwards] pb-20">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Live session monitor */}
          <div className="rounded-[18px] border border-danger/30 bg-gradient-to-br from-danger/10 to-navy/60 p-4.5 mb-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-danger before:to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger shadow-[0_0_12px_rgba(224,85,85,1)] animate-pulse_fast"></div>
                <h3 className="font-display text-[0.875rem] font-bold text-white uppercase tracking-[1px]">Sessão Ao Vivo</h3>
              </div>
              <div className="font-display text-[1.25rem] font-bold text-danger">23:47</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.72rem] shrink-0 border border-sky_l/20 bg-gradient-to-br from-orange_l to-gold text-navy">
                MC
              </div>
              <div className="flex-1">
                <p className="text-[0.8rem] text-white font-semibold">Maria Costa &middot; Cardio HIIT</p>
                <small className="text-[0.65rem] text-muted">Bloco 2/4 &middot; Burpees x 12</small>
              </div>
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-danger border border-white/20 text-white font-sans text-[0.7rem] font-bold uppercase tracking-[0.8px] cursor-pointer transition-all duration-250 shadow-[0_3px_10px_rgba(224,85,85,0.4)] hover:-translate-y-[1px]"
                onClick={() => alert('A retomar sessão...')}
              >
                <Play className="w-3 h-3 fill-current" />
                Retomar
              </button>
            </div>
          </div>

          {/* Agenda card */}
          <div className="rounded-[18px] border border-sky_l/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] glass-strong flex flex-col">
            <div className="h-[2px] animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent 5%, #209EBB 25%, #FFB701 50%, #209EBB 75%, transparent 95%)', backgroundSize: '200% 100%' }}></div>

            <div className="flex items-center justify-between px-5 py-4 border-b border-sky_l/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(255,183,1,0.6)] animate-pulse_fast"></div>
                <h3 className="font-display text-[0.95rem] font-bold text-white">Agenda de Hoje</h3>
                <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-[1px] text-teal bg-teal/10 border border-teal/20">{events?.length || 3} sessões</span>
              </div>
              <button
                className="px-3.5 py-1.5 rounded-full bg-navy/60 border border-sky_l/20 text-sky_l font-sans text-[0.65rem] font-bold uppercase tracking-[0.8px] cursor-pointer transition-all duration-250 hover:border-gold/30 hover:text-gold"
                onClick={() => openModal('todaySessionsModal')}
              >
                Ver tudo
              </button>
            </div>

            <div className="flex flex-col divide-y divide-sky_l/5">

              {/* Session 1 - completed */}
              <div className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors duration-250 hover:bg-sky_l/5 group">
                <div className="w-1 self-stretch rounded bg-success"></div>
                <div className="flex flex-col items-center justify-center min-w-[54px]">
                  <div className="font-display text-[1.05rem] font-bold leading-none text-sky_l">08:00</div>
                  <div className="text-[0.55rem] text-muted uppercase tracking-[1.2px] mt-0.5">60 min</div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.72rem] shrink-0 border border-sky_l/20 bg-gradient-to-br from-teal to-navy-light text-white">JF</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[0.85rem] truncate">João Félix</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.65rem] text-sky_l">Treino de Força</span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-[1px] text-teal bg-teal/10 border border-teal/20">Concluída</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer border transition-all duration-250 bg-success/20 border-success/40 hover:-translate-y-0.5" onClick={() => alert('Ver detalhes')}>
                    <CheckCircle2 className="w-[13px] h-[13px] text-success stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Session 2 - in progress */}
              <div className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors duration-250 hover:bg-sky_l/5 group">
                <div className="w-1 self-stretch rounded bg-danger animate-pulse_fast"></div>
                <div className="flex flex-col items-center justify-center min-w-[54px]">
                  <div className="font-display text-[1.05rem] font-bold leading-none text-danger">10:30</div>
                  <div className="text-[0.55rem] text-muted uppercase tracking-[1.2px] mt-0.5">45 min</div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.72rem] shrink-0 border border-sky_l/20 bg-gradient-to-br from-orange_l to-gold text-navy">MC</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[0.85rem] truncate">Maria Costa</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.65rem] text-sky_l">Cardio HIIT</span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-[1px] text-danger bg-danger/10 border border-danger/25">Ao Vivo</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer border transition-all duration-250 bg-gradient-to-br from-teal to-[#1a7a96] border-sky_l/20 shadow-[0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-gold/40 hover:-translate-y-0.5" onClick={() => alert('Retomar')}>
                    <Play className="w-[13px] h-[13px] text-white fill-current" />
                  </button>
                </div>
              </div>

              {/* Session 3 - next */}
              <div className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors duration-250 hover:bg-sky_l/5 group">
                <div className="w-1 self-stretch rounded bg-gold shadow-[0_0_8px_rgba(255,183,1,0.5)]"></div>
                <div className="flex flex-col items-center justify-center min-w-[54px]">
                  <div className="font-display text-[1.05rem] font-bold leading-none text-gold">12:00</div>
                  <div className="text-[0.55rem] text-muted uppercase tracking-[1.2px] mt-0.5">60 min</div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.72rem] shrink-0 border border-sky_l/20 bg-gradient-to-br from-navy-light to-teal text-white">AR</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[0.85rem] truncate">André Rocha</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.65rem] text-sky_l">Treino de Força</span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-[1px] text-gold bg-gold/10 border border-gold/25">Próxima</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer border transition-all duration-250 bg-gradient-to-br from-teal to-[#1a7a96] border-sky_l/20 shadow-[0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-gold/40 hover:-translate-y-0.5" onClick={() => openModal('executeModal')}>
                    <Play className="w-[13px] h-[13px] text-white fill-current" />
                  </button>
                  <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer border transition-all duration-250 bg-danger/20 border-danger/40 text-danger hover:bg-danger/30 hover:-translate-y-0.5" onClick={() => alert('Cancelar?')}>
                    <X className="w-[13px] h-[13px] stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Quick actions */}
          <div className="rounded-[18px] border border-sky_l/10 p-5 mb-4 glass-strong">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-display text-[0.875rem] font-bold text-white">Ações Rápidas</h3>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="flex items-center gap-3 p-3 rounded-xl bg-navy/40 border border-sky_l/10 border-l-[3px] border-l-gold cursor-pointer transition-all duration-250 text-left font-sans hover:bg-navy/60 hover:-translate-y-0.5 hover:border-gold/30"
                onClick={() => openModal('quickSessionModal')}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-gold/10 text-gold">
                  <ActivitySquare className="w-4 h-4 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78rem] font-bold text-white leading-[1.2]">Sessão Rápida</div>
                  <div className="text-[0.62rem] text-muted mt-0.5">Walk-in / spontaneous</div>
                </div>
              </button>

              <button
                className="flex items-center gap-3 p-3 rounded-xl bg-navy/40 border border-sky_l/10 border-l-[3px] border-l-teal cursor-pointer transition-all duration-250 text-left font-sans hover:bg-navy/60 hover:-translate-y-0.5 hover:border-teal/30"
                onClick={() => openModal('scheduleModal')}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-teal/10 text-teal">
                  <Calendar className="w-4 h-4 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78rem] font-bold text-white leading-[1.2]">Agendar Sessão</div>
                  <div className="text-[0.62rem] text-muted mt-0.5">Para um atleta específico</div>
                </div>
              </button>

              <button
                className="flex items-center gap-3 p-3 rounded-xl bg-navy/40 border border-sky_l/10 border-l-[3px] border-l-orange_l cursor-pointer transition-all duration-250 text-left font-sans hover:bg-navy/60 hover:-translate-y-0.5 hover:border-orange_l/30"
                onClick={() => openModal('workoutModal')}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-orange_l/10 text-orange_l">
                  <FileText className="w-4 h-4 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78rem] font-bold text-white leading-[1.2]">Novo Workout</div>
                  <div className="text-[0.62rem] text-muted mt-0.5">Criar template de treino</div>
                </div>
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-[18px] border border-sky_l/10 p-5 glass-strong">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-display text-[0.875rem] font-bold text-white">Atenções Críticas</h3>
              <span className="text-[0.55rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-[1px] text-danger bg-danger/10 border border-danger/25">2</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-navy/40 border border-sky_l/5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-danger/15 text-danger">
                  <ShieldAlert className="w-3.5 h-3.5 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] text-white font-semibold leading-[1.3]">João Félix reportou dor lombar</p>
                  <small className="text-[0.6rem] text-muted">há 32 minutos &middot; severidade 7/10</small>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-navy/40 border border-sky_l/5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-gold/15 text-gold">
                  <Activity className="w-3.5 h-3.5 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] text-white font-semibold leading-[1.3]">3 formulários wellness pendentes</p>
                  <small className="text-[0.6rem] text-muted">desde ontem</small>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// Inline UsersIcon since lucide-react might not have Users mapped to this exact name depending on version
function UsersIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
