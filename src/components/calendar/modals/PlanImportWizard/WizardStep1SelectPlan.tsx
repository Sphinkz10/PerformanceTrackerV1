/**
 * STEP 1: SELECT PLAN
 * Choose which plan to import
 */

import React from 'react';
import { motion } from 'motion/react';
import { DesignStudioPanel } from '../../panels/DesignStudioPanel';
import { CalendarIcon } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description?: string;
  weeks_count?: number;
  sessions_per_week?: number;
  total_sessions?: number;
  goal?: string;
}

interface WizardStep1Props {
  workspaceId: string;
  selectedPlan: Plan | null;
  onSelectPlan: (plan: Plan) => void;
}

export function WizardStep1SelectPlan({ 
  workspaceId, 
  selectedPlan, 
  onSelectPlan 
}: WizardStep1Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Selecionar Plan
        </h3>
        <p className="text-sm text-slate-600">
          Escolha o plano de treino que deseja importar para o calendário
        </p>
      </div>
      
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Procurar plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
        />
      </div>
      
      {/* Plans Browser */}
      <DesignStudioPanel
        type="plan"
        workspaceId={workspaceId}
        searchQuery={searchQuery}
        onSelect={onSelectPlan}
        selectedId={selectedPlan?.id}
      />
      
      {/* Selected Plan Info */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-violet-50 border border-violet-200 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-violet-900 mb-1">
                Plan Selecionado
              </h5>
              <p className="text-sm text-violet-700 mb-2">
                {selectedPlan.name}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedPlan.weeks_count && (
                  <span className="px-2 py-1 rounded-full bg-violet-200 text-violet-800 font-medium">
                    {selectedPlan.weeks_count} semanas
                  </span>
                )}
                {selectedPlan.total_sessions && (
                  <span className="px-2 py-1 rounded-full bg-violet-200 text-violet-800 font-medium">
                    {selectedPlan.total_sessions} sessões
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
