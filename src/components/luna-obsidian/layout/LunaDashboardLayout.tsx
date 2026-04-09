import React from 'react';
import { LunaSidebar } from './LunaSidebar';
import { LunaHeader } from './LunaHeader';
import { FAB } from './FAB';
import { LunaModals } from '../modals/LunaModals';

interface LunaDashboardLayoutProps {
  children: React.ReactNode;
}

export function LunaDashboardLayout({ children }: LunaDashboardLayoutProps) {
  return (
    <div className="relative min-h-screen bg-navy overflow-x-hidden font-sans text-white">
      {/* Background Layers */}
      <canvas id="pts" className="fixed inset-0 z-1 pointer-events-none"></canvas>
      <div className="bg-base fixed inset-0 z-0"></div>
      <div className="bg-grad fixed inset-0 z-2"></div>
      <div className="vignette fixed inset-0 z-3 pointer-events-none"></div>

      {/* App Container */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <LunaHeader />

        <div className="flex flex-1 min-h-0 w-full">
          <LunaSidebar />

          <main className="flex-1 overflow-y-auto p-6 min-w-0 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>

      <FAB />

      {/* Global Modals for Dashboard */}
      <LunaModals />
    </div>
  );
}
