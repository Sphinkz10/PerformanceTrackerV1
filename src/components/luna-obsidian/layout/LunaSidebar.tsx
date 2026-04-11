import React from 'react';
import { Home, Users, Calendar, Beaker, LayoutTemplate, Database, ClipboardList, History, Cpu, Radio, Settings } from 'lucide-react';

export function LunaSidebar() {
  return (
    <aside className="w-[240px] shrink-0 border-r border-sky_l/10 flex flex-col py-5 px-3 opacity-0 animate-fadeRight">
      <div className="flex flex-col gap-[2px]">
        <div className="text-[0.55rem] font-bold text-muted uppercase tracking-[1.5px] px-3 pb-2">
          Navegação
        </div>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 bg-gradient-to-br from-gold/15 to-orange_l/5 !border-l-gold group active">
          <Home className="w-[18px] h-[18px] shrink-0 stroke-[1.8] transition-colors duration-250 stroke-gold text-gold" />
          <span className="text-[0.78rem] font-semibold transition-colors duration-250 text-gold">Home</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <Users className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Atletas</span>
          <span className="ml-auto text-[0.55rem] font-bold px-[7px] py-[2px] rounded-full bg-gold/15 text-gold border border-gold/25">12</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <Calendar className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Calendário</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <Beaker className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Lab</span>
        </button>
      </div>

      <div className="flex flex-col gap-[2px] mt-6">
        <div className="text-[0.55rem] font-bold text-muted uppercase tracking-[1.5px] px-3 pb-2">
          Ferramentas
        </div>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <LayoutTemplate className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Design Studio</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <Database className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Data OS</span>
          <span className="ml-auto text-[0.55rem] font-bold px-[7px] py-[2px] rounded-full bg-gold/15 text-gold border border-gold/25">3</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <ClipboardList className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Form Center</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <History className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Histórico</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <Cpu className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Automation</span>
        </button>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
          <Radio className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
          <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Live Command</span>
          <span className="ml-auto text-[0.55rem] font-bold px-[7px] py-[2px] rounded-full bg-danger/15 text-danger border border-danger/25">1</span>
        </button>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex flex-col gap-[2px]">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-none bg-transparent border-l-2 border-l-transparent cursor-pointer transition-all duration-250 text-left hover:bg-sky_l/5 group">
            <Settings className="w-[18px] h-[18px] shrink-0 stroke-sky_l stroke-[1.8] transition-colors duration-250 group-hover:stroke-sky_l/80" />
            <span className="text-[0.78rem] font-semibold text-sky_l transition-colors duration-250 group-hover:text-sky_l/80">Configurações</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
