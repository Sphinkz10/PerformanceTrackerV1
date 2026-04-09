import React from 'react';
import { Activity, ChevronDown, Search, Brain, Bell, MessageSquare, Keyboard } from 'lucide-react';
import { toast } from 'sonner';

export function LunaHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-sky_l/10 glass flex items-center justify-between px-6 opacity-0 animate-[fadeUp_0.5s_ease-out_0.15s_forwards]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-orange_l flex items-center justify-center shadow-[0_4px_16px_rgba(255,183,1,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] brand-glow">
            <Activity className="w-4 h-4 text-navy stroke-[2.5]" />
          </div>
          <div className="font-display text-base font-bold text-white tracking-[2px] uppercase">
            LUNA<b className="text-gold">.</b>OS
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/50 border border-sky_l/15 cursor-pointer transition-all duration-250 hover:border-gold/30"
          onClick={() => toast('Workspace selector')}
        >
          <span className="w-2 h-2 rounded-full bg-teal shadow-[0_0_6px_rgba(32,158,187,0.6)]"></span>
          <span className="text-[0.72rem] font-bold text-white">Equipa Principal</span>
          <ChevronDown className="w-3 h-3 text-sky_l stroke-2" />
        </button>
      </div>

      <div
        className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy/60 border border-sky_l/15 w-[280px] cursor-pointer transition-all duration-250 hover:border-gold/30 hidden lg:flex"
        onClick={() => document.getElementById('searchModal')?.classList.add('open')}
      >
        <Search className="w-3.5 h-3.5 text-muted stroke-2" />
        <span className="flex-1 text-[0.72rem] text-muted">Pesquisar atletas, sessões...</span>
        <span className="text-[0.6rem] font-bold text-sky_l bg-sky_l/10 border border-sky_l/20 px-1.5 py-0.5 rounded font-mono">⌘K</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          className="relative w-[38px] h-[38px] rounded-xl bg-navy/50 border border-sky_l/15 flex items-center justify-center text-sky_l cursor-pointer transition-all duration-250 hover:border-gold/30 hover:text-gold hover:-translate-y-[1px]"
          onClick={() => toast('3 decisões AI pendentes')}
        >
          <Brain className="w-4 h-4 stroke-2" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-orange_l text-navy text-[0.55rem] font-extrabold flex items-center justify-center border-2 border-navy">3</span>
        </button>

        <button
          className="relative w-[38px] h-[38px] rounded-xl bg-navy/50 border border-sky_l/15 flex items-center justify-center text-sky_l cursor-pointer transition-all duration-250 hover:border-gold/30 hover:text-gold hover:-translate-y-[1px]"
          onClick={() => document.getElementById('notifModal')?.classList.add('open')}
        >
          <Bell className="w-4 h-4 stroke-2" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-navy text-[0.55rem] font-extrabold flex items-center justify-center border-2 border-navy">5</span>
        </button>

        <button
          className="relative w-[38px] h-[38px] rounded-xl bg-navy/50 border border-sky_l/15 flex items-center justify-center text-sky_l cursor-pointer transition-all duration-250 hover:border-gold/30 hover:text-gold hover:-translate-y-[1px]"
          onClick={() => toast('Mensagens')}
        >
          <MessageSquare className="w-4 h-4 stroke-2" />
        </button>

        <button
          className="relative w-[38px] h-[38px] rounded-xl bg-navy/50 border border-sky_l/15 flex items-center justify-center text-sky_l cursor-pointer transition-all duration-250 hover:border-gold/30 hover:text-gold hover:-translate-y-[1px]"
          onClick={() => document.getElementById('shortcutsModal')?.classList.add('open')}
        >
          <Keyboard className="w-4 h-4 stroke-2" />
        </button>

        <button
          className="flex items-center gap-2.5 py-1 pr-3.5 pl-1 rounded-full bg-navy/50 border border-sky_l/15 cursor-pointer transition-all duration-250 hover:border-gold/30"
          onClick={() => toast('Perfil do utilizador')}
        >
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-gold to-orange_l flex items-center justify-center text-navy text-[0.65rem] font-extrabold">
            TS
          </div>
          <div className="text-left">
            <div className="text-[0.7rem] font-bold text-white leading-none">Treinador Silva</div>
            <div className="text-[0.55rem] text-muted leading-none mt-0.5">Head Coach</div>
          </div>
        </button>
      </div>
    </header>
  );
}
