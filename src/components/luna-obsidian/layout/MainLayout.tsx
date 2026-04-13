import React from 'react';
import { Home, Users, BookOpen, Settings } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 border-r border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl flex flex-col items-center py-6 gap-8 z-10 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <span className="font-bold text-lg">P</span>
        </div>

        <nav className="flex flex-col gap-6 w-full items-center flex-1">
          <button className="p-3 rounded-xl bg-zinc-800/80 text-cyan-400 hover:bg-zinc-800 transition-colors relative group">
            <Home className="w-5 h-5" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full" />
          </button>

          <button className="p-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors">
            <Users className="w-5 h-5" />
          </button>

          <button className="p-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors">
            <BookOpen className="w-5 h-5" />
          </button>
        </nav>

        <button className="p-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors mt-auto">
          <Settings className="w-5 h-5" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl flex items-center justify-between px-6 z-10 shrink-0">
          <div className="text-sm font-medium text-zinc-400">Dashboard</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-300">Treinador Silva</span>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
               {/* Mock avatar */}
               <span className="text-xs text-zinc-500">TS</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
