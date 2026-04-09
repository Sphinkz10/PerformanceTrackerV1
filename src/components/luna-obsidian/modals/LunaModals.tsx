import React, { useEffect, useState } from 'react';
import { X, Search as SearchIcon, FileText, Calendar, Activity, ActivitySquare, ShieldAlert, ChevronRight, CheckCircle2, Play } from 'lucide-react';
import { toast } from 'sonner';

// A single file to hold all visual shells for Phase 3 since they are just UI components for now
// and will be integrated with the DB in Phase 4.

const ModalBackdrop = ({ id, children, isOpen, onClose }: { id: string, children: React.ReactNode, isOpen: boolean, onClose: () => void }) => {
  // Setup keyboard listener for escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // We still use the id and class 'open' for the legacy imperative openModal/closeModal calls from the HTML conversion
  // but we also support react state driven opening
  return (
    <div
      id={id}
      className={`fixed inset-0 z-[100] bg-[#02141e]/75 backdrop-blur-md flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-250 modal-backdrop ${isOpen ? 'open !opacity-100 !pointer-events-auto' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-[24px] border border-sky_l/15 shadow-[0_30px_80px_rgba(0,0,0,0.5)] transform scale-95 translate-y-5 transition-transform duration-300 relative bg-navy/65 backdrop-blur-[50px] saturate-[1.3] custom-scrollbar modal">
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ title, onClose }: { title: string, onClose: () => void }) => (
  <div className="flex items-center justify-between px-6 py-5 border-b border-sky_l/10">
    <h2 className="font-display text-[1.1rem] font-bold text-white">{title}</h2>
    <button
      className="w-8 h-8 rounded-lg bg-sky_l/5 border border-sky_l/15 text-sky_l cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-danger/15 hover:border-danger/30 hover:text-danger"
      onClick={onClose}
    >
      <X className="w-3.5 h-3.5 stroke-[2.5]" />
    </button>
  </div>
);

// We will expose a global way to open these modals for the legacy code in MainDashboard to work
// In a real refactor, we would lift the state up or use a context.
export function LunaModals() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // Expose openModal/closeModal to window for the onclick handlers in the HTML to work
    (window as any).openModal = (id: string) => {
      document.getElementById(id)?.classList.add('open');
    };
    (window as any).closeModal = (id: string) => {
      document.getElementById(id)?.classList.remove('open');
    };

    // Handle cmd+k
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !e.shiftKey) {
        e.preventDefault();
        (window as any).openModal('searchModal');
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        (window as any).openModal('shortcutsModal');
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  return (
    <>
      <SearchModal />
      <NotifModal />
      <AthleteModal />
      <ScheduleModal />
      <QuickSessionModal />
      <WorkoutModal />
      <ExecuteModal />
      <TodaySessionsModal />
      <AthletesModal />
      <AlertsModal />
      <ShortcutsModal />
    </>
  );
}

// 1. Search Modal
function SearchModal() {
  return (
    <ModalBackdrop id="searchModal" isOpen={false} onClose={() => (window as any).closeModal('searchModal')}>
      <div className="max-w-[600px] w-full mx-auto bg-navy/65 backdrop-blur-[50px] saturate-[1.3] rounded-[24px]">
        <div className="flex items-center gap-3 px-6 py-[18px] border-b border-sky_l/10">
          <SearchIcon className="w-[18px] h-[18px] stroke-sky_l stroke-2" />
          <input
            type="text"
            placeholder="Pesquisar atletas, sessões, exercícios..."
            className="flex-1 bg-transparent border-none outline-none text-white font-sans text-base font-medium placeholder:text-muted"
          />
          <button
            className="w-8 h-8 rounded-lg bg-sky_l/5 border border-sky_l/15 text-sky_l cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-danger/15 hover:border-danger/30 hover:text-danger"
            onClick={() => (window as any).closeModal('searchModal')}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
        <div className="py-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="px-6 py-2">
            <div className="text-[0.55rem] font-bold text-muted uppercase tracking-[1.5px] mb-2">Ações Rápidas</div>
          </div>
          <div className="flex items-center gap-3 px-6 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-sky_l/5" onClick={() => { (window as any).closeModal('searchModal'); (window as any).openModal('athleteModal'); }}>
            <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center"><ActivitySquare className="w-3.5 h-3.5 stroke-2" /></div>
            <div className="flex-1">
              <div className="text-[0.8rem] font-semibold text-white">Criar Novo Atleta</div>
              <div className="text-[0.62rem] text-muted">Adicionar perfil ao sistema</div>
            </div>
            <span className="text-[0.55rem] text-muted font-mono">⌘N</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-sky_l/5" onClick={() => { (window as any).closeModal('searchModal'); (window as any).openModal('scheduleModal'); }}>
            <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center"><Calendar className="w-3.5 h-3.5 stroke-2" /></div>
            <div className="flex-1">
              <div className="text-[0.8rem] font-semibold text-white">Agendar Sessão</div>
              <div className="text-[0.62rem] text-muted">Marcar treino futuro</div>
            </div>
            <span className="text-[0.55rem] text-muted font-mono">⌘S</span>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 2. Notifications Modal
function NotifModal() {
  return (
    <ModalBackdrop id="notifModal" isOpen={false} onClose={() => (window as any).closeModal('notifModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Notificações" onClose={() => (window as any).closeModal('notifModal')} />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-3 p-3 rounded-[10px] border border-sky_l/10 cursor-pointer transition-all duration-200 hover:bg-sky_l/5 hover:border-gold/20 border-l-[3px] border-l-gold">
              <div className="w-8 h-8 rounded-full bg-danger/15 text-danger flex items-center justify-center shrink-0"><ShieldAlert className="w-3.5 h-3.5 stroke-2" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.78rem] text-white font-semibold">João Félix reportou dor lombar</p>
                <small className="text-[0.62rem] text-muted">há 32 minutos</small>
              </div>
            </div>
            {/* Add more notifications based on HTML... */}
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 3. Athlete Modal
function AthleteModal() {
  return (
    <ModalBackdrop id="athleteModal" isOpen={false} onClose={() => (window as any).closeModal('athleteModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Novo Atleta" onClose={() => (window as any).closeModal('athleteModal')} />
        <div className="p-5 md:p-6">
          <div className="text-[0.65rem] font-bold text-gold uppercase tracking-[1.5px] mb-2.5 flex items-center gap-1.5 before:content-[''] before:w-[3px] before:h-3 before:bg-gold before:rounded-sm">
            Informação Básica
          </div>
          <div className="mb-3.5">
            <label className="block text-[0.62rem] font-bold text-muted-hi uppercase tracking-[1px] mb-1.5">Nome Completo</label>
            <input type="text" className="w-full px-3.5 py-3 bg-navy/60 border border-sky_l/15 border-l-[3px] border-l-teal rounded-[10px] text-white font-sans text-[0.82rem] font-medium outline-none transition-all duration-250 focus:border-gold/40 focus:border-l-gold focus:shadow-[0_0_0_3px_rgba(255,183,1,0.08)] placeholder:text-muted" placeholder="Ex: João Félix" />
          </div>
          {/* Add more fields based on HTML... */}
        </div>
        <div className="px-6 py-4 border-t border-sky_l/10 flex items-center justify-end gap-2.5">
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-navy/60 border border-sky_l/20 text-sky_l hover:border-gold/30 hover:text-gold cursor-pointer" onClick={() => (window as any).closeModal('athleteModal')}>Cancelar</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-px cursor-pointer" onClick={() => { (window as any).closeModal('athleteModal'); toast('Atleta criado com sucesso'); }}>Criar Atleta</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 4. Schedule Session Modal
function ScheduleModal() {
  return (
    <ModalBackdrop id="scheduleModal" isOpen={false} onClose={() => (window as any).closeModal('scheduleModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Agendar Sessão" onClose={() => (window as any).closeModal('scheduleModal')} />
        <div className="p-5 md:p-6">
          <div className="mb-3.5">
            <label className="block text-[0.62rem] font-bold text-muted-hi uppercase tracking-[1px] mb-1.5">Título da Sessão</label>
            <input type="text" className="w-full px-3.5 py-3 bg-navy/60 border border-sky_l/15 border-l-[3px] border-l-teal rounded-[10px] text-white font-sans text-[0.82rem] font-medium outline-none transition-all duration-250 focus:border-gold/40 focus:border-l-gold focus:shadow-[0_0_0_3px_rgba(255,183,1,0.08)] placeholder:text-muted" placeholder="Ex: Treino de Força - Bloco 3" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-sky_l/10 flex items-center justify-end gap-2.5">
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-navy/60 border border-sky_l/20 text-sky_l hover:border-gold/30 hover:text-gold cursor-pointer" onClick={() => (window as any).closeModal('scheduleModal')}>Cancelar</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-px cursor-pointer" onClick={() => { (window as any).closeModal('scheduleModal'); toast('Sessão agendada'); }}>Agendar</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 5. Quick Session Modal
function QuickSessionModal() {
  return (
    <ModalBackdrop id="quickSessionModal" isOpen={false} onClose={() => (window as any).closeModal('quickSessionModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Sessão Rápida" onClose={() => (window as any).closeModal('quickSessionModal')} />
        <div className="p-5 md:p-6">
          <div className="text-[0.65rem] font-bold text-gold uppercase tracking-[1.5px] mb-2.5 flex items-center gap-1.5 before:content-[''] before:w-[3px] before:h-3 before:bg-gold before:rounded-sm">Selecionar Atletas</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br from-gold/15 to-orange_l/5 border border-gold cursor-pointer transition-all duration-250">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.7rem] font-bold bg-gradient-to-br from-teal to-navy-light text-white">JF</div>
              <div className="text-[0.62rem] text-white font-semibold text-center">João</div>
            </div>
            {/* Add more athletes */}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-sky_l/10 flex items-center justify-end gap-2.5">
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-navy/60 border border-sky_l/20 text-sky_l hover:border-gold/30 hover:text-gold cursor-pointer" onClick={() => (window as any).closeModal('quickSessionModal')}>Cancelar</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-px cursor-pointer" onClick={() => { (window as any).closeModal('quickSessionModal'); toast('A iniciar Live Command...'); }}>Iniciar Sessão</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 6. Workout Modal
function WorkoutModal() {
  return (
    <ModalBackdrop id="workoutModal" isOpen={false} onClose={() => (window as any).closeModal('workoutModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Criar Workout" onClose={() => (window as any).closeModal('workoutModal')} />
        <div className="p-5 md:p-6">
          <div className="mb-3.5">
            <label className="block text-[0.62rem] font-bold text-muted-hi uppercase tracking-[1px] mb-1.5">Nome do Treino</label>
            <input type="text" className="w-full px-3.5 py-3 bg-navy/60 border border-sky_l/15 border-l-[3px] border-l-teal rounded-[10px] text-white font-sans text-[0.82rem] font-medium outline-none transition-all duration-250 focus:border-gold/40 focus:border-l-gold focus:shadow-[0_0_0_3px_rgba(255,183,1,0.08)] placeholder:text-muted" placeholder="Ex: Força Avançada - Tronco Superior" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-sky_l/10 flex items-center justify-end gap-2.5">
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-navy/60 border border-sky_l/20 text-sky_l hover:border-gold/30 hover:text-gold cursor-pointer" onClick={() => (window as any).closeModal('workoutModal')}>Cancelar</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-px cursor-pointer" onClick={() => { (window as any).closeModal('workoutModal'); toast('Próximo: construtor de blocos'); }}>Continuar &rarr;</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 7. Execute Modal
function ExecuteModal() {
  return (
    <ModalBackdrop id="executeModal" isOpen={false} onClose={() => (window as any).closeModal('executeModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Executar Sessão" onClose={() => (window as any).closeModal('executeModal')} />
        <div className="p-5 md:p-6">
          <div className="text-center py-5">
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-navy-light to-teal text-white flex items-center justify-center font-bold text-base mx-auto mb-3">AR</div>
            <h3 className="font-display text-white text-[1.1rem] mb-1">André Rocha</h3>
            <p className="text-muted text-[0.78rem]">Treino de Força &middot; 60 minutos</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-sky_l/10 flex items-center justify-end gap-2.5">
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-navy/60 border border-sky_l/20 text-sky_l hover:border-gold/30 hover:text-gold cursor-pointer" onClick={() => (window as any).closeModal('executeModal')}>Cancelar</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[0.75rem] font-bold uppercase tracking-[0.8px] transition-all duration-250 bg-gradient-to-br from-gold to-orange_l text-navy shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-px cursor-pointer" onClick={() => { (window as any).closeModal('executeModal'); toast('Live Command iniciado'); }}>Iniciar Live</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 8. Today Sessions Modal
function TodaySessionsModal() {
  return (
    <ModalBackdrop id="todaySessionsModal" isOpen={false} onClose={() => (window as any).closeModal('todaySessionsModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Sessões de Hoje" onClose={() => (window as any).closeModal('todaySessionsModal')} />
        <div className="p-0">
          <div className="flex flex-col divide-y divide-sky_l/5">
            <div className="flex items-center gap-3.5 px-5 py-3.5">
              <div className="w-1 self-stretch rounded bg-success"></div>
              <div className="flex flex-col items-center justify-center min-w-[54px]"><div className="font-display text-[1.05rem] font-bold leading-none text-sky_l">08:00</div></div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.72rem] shrink-0 border border-sky_l/20 bg-gradient-to-br from-teal to-navy-light text-white">JF</div>
              <div className="flex-1 min-w-0"><div className="font-bold text-white text-[0.85rem] truncate">João Félix</div><div className="text-[0.65rem] text-sky_l mt-0.5">Força</div></div>
            </div>
            {/* Add more */}
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 9. Athletes Modal
function AthletesModal() {
  return (
    <ModalBackdrop id="athletesModal" isOpen={false} onClose={() => (window as any).closeModal('athletesModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Atletas Ativos" onClose={() => (window as any).closeModal('athletesModal')} />
        <div className="p-5 md:p-6">
          {/* Mock content */}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 10. Alerts Modal
function AlertsModal() {
  return (
    <ModalBackdrop id="alertsModal" isOpen={false} onClose={() => (window as any).closeModal('alertsModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Central de Alertas" onClose={() => (window as any).closeModal('alertsModal')} />
        <div className="p-5 md:p-6">
          {/* Mock content */}
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 11. Shortcuts Modal
function ShortcutsModal() {
  return (
    <ModalBackdrop id="shortcutsModal" isOpen={false} onClose={() => (window as any).closeModal('shortcutsModal')}>
      <div className="max-w-[520px] w-full mx-auto">
        <ModalHeader title="Atalhos de Teclado" onClose={() => (window as any).closeModal('shortcutsModal')} />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-navy/40 border border-sky_l/5">
              <span className="text-[0.78rem] text-white">Pesquisa Global</span>
              <div className="flex items-center gap-1">
                <span className="text-[0.65rem] font-bold text-gold bg-gold/10 border border-gold/25 px-2 py-1 rounded-[5px] font-mono shadow-[0_2px_0_rgba(255,183,1,0.2)]">⌘</span>
                <span className="text-[0.65rem] font-bold text-gold bg-gold/10 border border-gold/25 px-2 py-1 rounded-[5px] font-mono shadow-[0_2px_0_rgba(255,183,1,0.2)]">K</span>
              </div>
            </div>
            {/* Add more */}
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
