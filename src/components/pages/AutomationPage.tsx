import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Sparkles,
  Package,
  Activity,
  BarChart3,
  Settings,
  Search,
  Plus,
  Command,
  Bell
} from 'lucide-react';
import { WorkflowsList } from '../automation/WorkflowsList';
import { QuickAutomationWizard } from '../automation/QuickAutomationWizard';
import { WorkflowBuilder } from '../automation/WorkflowBuilder';
import { RunsViewer } from '../automation/RunsViewer';
import { AutomationAnalytics } from '../automation/AutomationAnalytics';
import { AutomationPolicies } from '../automation/AutomationPolicies';

type ActiveTab = 'workflows' | 'quick' | 'templates' | 'runs' | 'analytics' | 'policies';

export function AutomationPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workflows');
  const [showWizard, setShowWizard] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const tabs = [
    { id: 'workflows' as const, label: 'Workflows', icon: Zap, badge: '12' },
    { id: 'quick' as const, label: 'Quick Automations', icon: Sparkles },
    { id: 'templates' as const, label: 'Templates & Packs', icon: Package, badge: 'New' },
    { id: 'runs' as const, label: 'Runs', icon: Activity },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'policies' as const, label: 'Policies', icon: Settings }
  ];

  const handleCreateNew = () => {
    setShowWizard(true);
  };

  const handleEditWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setShowBuilder(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    setActiveTab('workflows');
  };

  if (showBuilder) {
    return (
      <WorkflowBuilder
        workflowId={selectedWorkflowId}
        onClose={() => {
          setShowBuilder(false);
          setSelectedWorkflowId(null);
        }}
      />
    );
  }

  if (showWizard) {
    return (
      <QuickAutomationWizard
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg sm:text-xl">Automation Suite</h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Workflows inteligentes sem código
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search / Command Palette */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-sky-300 transition-all text-sm">
              <Search className="w-4 h-4" />
              <span className="text-slate-400">Search...</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Create New */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Automação</span>
              <span className="sm:hidden">Criar</span>
            </motion.button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-700'
                    }
                  `}>
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="min-h-[600px]">
          {activeTab === 'workflows' && (
            <WorkflowsList
              onEdit={handleEditWorkflow}
              onCreateNew={handleCreateNew}
            />
          )}

          {activeTab === 'quick' && (
            <div className="rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-12 text-center">
              <Sparkles className="w-16 h-16 text-sky-400 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900 text-lg mb-2">Quick Automations</h3>
              <p className="text-slate-600 mb-6">
                Criar automações em 60 segundos com templates inteligentes
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Começar Wizard
              </button>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Onboarding Pack', desc: '5 workflows', icon: '🎯', color: 'emerald' },
                { name: 'Payment Reminders', desc: '3 workflows', icon: '💰', color: 'amber' },
                { name: 'Session Follow-ups', desc: '4 workflows', icon: '📅', color: 'sky' },
                { name: 'Re-engagement', desc: '3 workflows', icon: '🔄', color: 'violet' },
                { name: 'Performance Alerts', desc: '6 workflows', icon: '📊', color: 'red' },
                { name: 'Weekly Reports', desc: '2 workflows', icon: '📈', color: 'indigo' }
              ].map((pack, index) => (
                <motion.div
                  key={pack.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${pack.color}-500 to-${pack.color}-600 flex items-center justify-center text-2xl mb-4`}>
                    {pack.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{pack.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{pack.desc}</p>
                  <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                    Instalar Pack →
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'runs' && <RunsViewer />}

          {activeTab === 'analytics' && <AutomationAnalytics />}

          {activeTab === 'policies' && <AutomationPolicies />}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
