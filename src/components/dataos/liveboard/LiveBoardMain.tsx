/**
 * LIVEBOARD MAIN - FASE 5 DIA 16-17
 * Container principal com toggle entre vistas
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { ByAthleteView } from './ByAthleteView';
import { ByDateView } from './ByDateView';

type LiveBoardView = 'by-athlete' | 'by-date';

interface LiveBoardMainProps {
  workspaceId?: string;
}

export function LiveBoardMain({ workspaceId }: LiveBoardMainProps) {
  const { isMobile } = useResponsive();
  const [activeView, setActiveView] = useState<LiveBoardView>('by-athlete');

  return (
    <div className="h-full flex flex-col">
      {/* View Toggle */}
      <div className={`bg-white border-b border-slate-200 ${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('by-athlete')}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg transition-all ${
              isMobile ? 'py-3 min-h-[44px]' : 'py-2.5'
            } ${
              activeView === 'by-athlete'
                ? 'bg-white shadow-sm text-sky-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Por Atleta</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('by-date')}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg transition-all ${
              isMobile ? 'py-3 min-h-[44px]' : 'py-2.5'
            } ${
              activeView === 'by-date'
                ? 'bg-white shadow-sm text-sky-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Por Data</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'by-athlete' ? (
          <ByAthleteView workspaceId={workspaceId} />
        ) : (
          <ByDateView workspaceId={workspaceId} />
        )}
      </div>
    </div>
  );
}
