import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  FileCode,
  Database,
  Activity,
  Heart,
  BarChart3,
  FolderOpen,
  Shield
} from 'lucide-react';
import { AthleteTab, DrawerType } from '@/types/athlete-profile';
import { CockpitTab } from './tabs/CockpitTab';
import { AgendaTab } from './tabs/AgendaTab';
import { SessionsTab } from './tabs/SessionsTab';
import { TrainingsTab } from './tabs/TrainingsTab';
import { DataTab } from './tabs/DataTab';
import { AssessmentsTab } from './tabs/AssessmentsTab';
import { RecoveryTab } from './tabs/RecoveryTab';
import { ReportsTab } from './tabs/ReportsTab';
import { DocsTab } from './tabs/DocsTab';
import { AuditTab } from './tabs/AuditTab';

interface ProfileTabsProps {
  activeTab: AthleteTab;
  athleteId: string;
  onTabChange: (tab: AthleteTab) => void;
  onOpenDrawer: (drawer: DrawerType, data?: any) => void;
}

export function ProfileTabs({
  activeTab,
  athleteId,
  onTabChange,
  onOpenDrawer
}: ProfileTabsProps) {
  const tabs = [
    { key: 'cockpit', label: 'Cockpit', icon: LayoutDashboard, emoji: '🎯' },
    { key: 'agenda', label: 'Agenda', icon: Calendar, emoji: '📅' },
    { key: 'sessions', label: 'Sessões', icon: Dumbbell, emoji: '💪' },
    { key: 'trainings', label: 'Treinos', icon: FileCode, emoji: '📋' },
    { key: 'data', label: 'Data OS', icon: Database, emoji: '📊' },
    { key: 'assessments', label: 'Avaliações', icon: Activity, emoji: '📈' },
    { key: 'recovery', label: 'Recuperação', icon: Heart, emoji: '❤️' },
    { key: 'reports', label: 'Relatórios', icon: BarChart3, emoji: '📊' },
    { key: 'docs', label: 'Documentos', icon: FolderOpen, emoji: '📁' },
    { key: 'audit', label: 'Audit', icon: Shield, emoji: '🔒' }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      {/* Tabs Navigation - ✅ Day 11: Already responsive with scroll + hidden labels mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(tab.key as AthleteTab)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'cockpit' && (
          <CockpitTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'agenda' && (
          <AgendaTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'sessions' && (
          <SessionsTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'trainings' && (
          <TrainingsTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'data' && (
          <DataTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'assessments' && (
          <AssessmentsTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'recovery' && (
          <RecoveryTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'docs' && (
          <DocsTab athleteId={athleteId} onOpenDrawer={onOpenDrawer} />
        )}

        {activeTab === 'audit' && (
          <AuditTab athleteId={athleteId} />
        )}
      </div>
    </motion.div>
  );
}