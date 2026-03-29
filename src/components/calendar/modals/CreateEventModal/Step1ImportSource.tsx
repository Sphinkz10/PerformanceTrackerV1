/**
 * STEP 1: IMPORT SOURCE
 * Escolher: Manual, Workout, Plan ou Class
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PenTool, 
  Dumbbell, 
  Calendar as CalendarIcon, 
  Users, 
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CreateEventFormData } from '@/types/calendar';
import { DesignStudioPanel } from '../../panels/DesignStudioPanel';
import { PlanImportWizard } from '../PlanImportWizard/PlanImportWizard';

interface Step1Props {
  formData: Partial<CreateEventFormData>;
  updateFormData: (updates: Partial<CreateEventFormData>) => void;
  workspaceId: string;
  onOpenTemplates?: () => void;
}

type SourceOption = 'manual' | 'workout' | 'plan' | 'class';

const SOURCE_OPTIONS = [
  {
    id: 'manual' as SourceOption,
    title: 'Criar Manualmente',
    description: 'Evento personalizado do zero',
    icon: PenTool,
    color: 'sky',
  },
  {
    id: 'workout' as SourceOption,
    title: 'Importar Workout',
    description: 'Usar workout do Design Studio',
    icon: Dumbbell,
    color: 'emerald',
  },
  {
    id: 'plan' as SourceOption,
    title: 'Importar Plan',
    description: 'Criar série de eventos',
    icon: CalendarIcon,
    color: 'violet',
    badge: 'Avançado',
  },
  {
    id: 'class' as SourceOption,
    title: 'Importar Class',
    description: 'Aula em grupo com vagas',
    icon: Users,
    color: 'amber',
  },
] as const;

export function Step1ImportSource({ formData, updateFormData, workspaceId, onOpenTemplates }: Step1Props) {
  const [selectedSource, setSelectedSource] = useState<SourceOption>(
    (formData.source as SourceOption) || 'manual'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlanWizard, setShowPlanWizard] = useState(false);
  
  const handleSelectSource = (source: SourceOption) => {
    setSelectedSource(source);
    updateFormData({ 
      source,
      // Reset related fields
      workout_id: undefined,
      plan_id: undefined,
      class_id: undefined,
    });
  };
  
  const handleSelectItem = (item: any) => {
    // Update form data based on selected source
    if (selectedSource === 'workout') {
      updateFormData({ 
        workout_id: item.id,
        title: item.name,
        description: item.description,
        duration_minutes: item.duration_minutes,
      });
    } else if (selectedSource === 'plan') {
      // Open Plan Import Wizard instead of single event
      setShowPlanWizard(true);
      updateFormData({ 
        plan_id: item.id,
      });
    } else if (selectedSource === 'class') {
      updateFormData({ 
        class_id: item.id,
        title: item.name,
        description: item.description,
        duration_minutes: item.duration_minutes,
        max_participants: item.max_participants,
      });
    }
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Como quer criar este evento?
            </h3>
            <p className="text-sm text-slate-600">
              Escolha criar manualmente ou importar do Design Studio
            </p>
          </div>
          
          {/* Templates Button */}
          {onOpenTemplates && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTemplates}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-violet-500 transition-all whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4" />
              Usar Template
            </motion.button>
          )}
        </div>
        
        {/* Source Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOURCE_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedSource === option.id;
            
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSource(option.id)}
                className={`group relative p-6 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? `border-${option.color}-400 bg-gradient-to-br from-${option.color}-50 to-white shadow-lg`
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Badge */}
                {option.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full bg-${option.color}-100 text-${option.color}-700`}>
                      {option.badge}
                    </span>
                  </div>
                )}
                
                {/* Icon */}
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? `bg-gradient-to-br from-${option.color}-500 to-${option.color}-600`
                    : `bg-${option.color}-100`
                }`}>
                  <Icon className={`h-7 w-7 ${
                    isSelected ? 'text-white' : `text-${option.color}-600`
                  }`} />
                </div>
                
                {/* Content */}
                <div className="mb-3">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    {option.title}
                    {isSelected && (
                      <div className={`h-5 w-5 rounded-full bg-${option.color}-500 flex items-center justify-center`}>
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {option.description}
                  </p>
                </div>
                
                {/* Arrow */}
                {isSelected && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-sky-600">
                    Selecionado
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Design Studio Browser (if workout/plan/class selected) */}
        {selectedSource !== 'manual' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6"
          >
            <h4 className="font-bold text-slate-900 mb-4">
              {selectedSource === 'workout' && 'Selecionar Workout'}
              {selectedSource === 'plan' && 'Selecionar Plan'}
              {selectedSource === 'class' && 'Selecionar Class'}
            </h4>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Procurar ${selectedSource}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>
            
            {/* Design Studio Panel */}
            <DesignStudioPanel
              type={selectedSource}
              workspaceId={workspaceId}
              searchQuery={searchQuery}
              onSelect={handleSelectItem}
              selectedId={
                selectedSource === 'workout' ? formData.workout_id :
                selectedSource === 'plan' ? formData.plan_id :
                formData.class_id
              }
            />
          </motion.div>
        )}
        
        {/* Manual Creation Info */}
        {selectedSource === 'manual' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-sky-50 border border-sky-200 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
                <PenTool className="h-4 w-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-sky-900 mb-1">
                  Criação Manual
                </h5>
                <p className="text-sm text-sky-700">
                  Preencha os detalhes do evento nos próximos passos. Perfeito para eventos únicos e personalizados.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Plan Import Wizard */}
      {showPlanWizard && (
        <PlanImportWizard
          isOpen={showPlanWizard}
          onClose={() => setShowPlanWizard(false)}
          workspaceId={workspaceId}
          onSuccess={() => {
            setShowPlanWizard(false);
            // Parent modal should close too
          }}
        />
      )}
    </>
  );
}