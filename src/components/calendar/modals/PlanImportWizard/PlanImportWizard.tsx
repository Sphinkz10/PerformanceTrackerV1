/**
 * PLAN IMPORT WIZARD
 * Bulk create events from a Design Studio Plan
 * Game-changer feature: Create 8+ weeks of training in < 2 minutes!
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { format, addDays, addWeeks } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from 'sonner@2.0.3';

// Steps
import { WizardStep1SelectPlan } from './WizardStep1SelectPlan';
import { WizardStep2DateRange } from './WizardStep2DateRange';
import { WizardStep3SessionSelection } from './WizardStep3SessionSelection';
import { WizardStep4Athletes } from './WizardStep4Athletes';
import { WizardStep5Review } from './WizardStep5Review';

// Types
interface Plan {
  id: string;
  name: string;
  description?: string;
  weeks_count?: number;
  sessions_per_week?: number;
  total_sessions?: number;
  goal?: string;
  sessions?: PlanSession[];
}

interface PlanSession {
  id: string;
  week_number: number;
  day_of_week: number;
  workout_id?: string;
  workout_name?: string;
  duration_minutes?: number;
  order_index: number;
}

interface EventToCreate {
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  workout_id?: string;
  athlete_ids: string[];
  week_number: number;
  day_of_week: number;
  session_id: string;
}

interface PlanImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess?: () => void;
}

const TOTAL_STEPS = 5;

export function PlanImportWizard({ isOpen, onClose, workspaceId, onSuccess }: PlanImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Wizard State
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [defaultTime, setDefaultTime] = useState('09:00');
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [eventsToCreate, setEventsToCreate] = useState<EventToCreate[]>([]);
  
  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedPlan(null);
        setStartDate(new Date());
        setDefaultTime('09:00');
        setSelectedSessions(new Set());
        setSelectedAthletes([]);
        setEventsToCreate([]);
      }, 300);
    }
  }, [isOpen]);
  
  // Generate events when moving to review step
  useEffect(() => {
    if (currentStep === 5 && selectedPlan && selectedSessions.size > 0) {
      generateEvents();
    }
  }, [currentStep]);
  
  const generateEvents = () => {
    if (!selectedPlan?.sessions) return;
    
    const events: EventToCreate[] = [];
    const [hours, minutes] = defaultTime.split(':').map(Number);
    
    selectedPlan.sessions.forEach(session => {
      if (!selectedSessions.has(session.id)) return;
      
      // Calculate date: start_date + (week_number - 1) weeks + (day_of_week - 1) days
      const weekOffset = (session.week_number - 1) * 7;
      const dayOffset = session.day_of_week - 1;
      const eventDate = addDays(startDate, weekOffset + dayOffset);
      
      const startTime = new Date(eventDate);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (session.duration_minutes || 60));
      
      events.push({
        title: session.workout_name || `${selectedPlan.name} - Semana ${session.week_number}`,
        description: selectedPlan.description,
        start_time: startTime,
        end_time: endTime,
        workout_id: session.workout_id,
        athlete_ids: selectedAthletes,
        week_number: session.week_number,
        day_of_week: session.day_of_week,
        session_id: session.id,
      });
    });
    
    // Sort by date
    events.sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
    setEventsToCreate(events);
  };
  
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Bulk create events
      const response = await fetch('/api/calendar-events/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          events: eventsToCreate.map(event => ({
            title: event.title,
            description: event.description,
            start_time: event.start_time.toISOString(),
            end_time: event.end_time.toISOString(),
            event_type: 'workout',
            workout_id: event.workout_id,
            plan_id: selectedPlan?.id,
            status: 'scheduled',
            participant_ids: event.athlete_ids,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar eventos');
      }
      
      const data = await response.json();
      
      // Success toast with confetti!
      toast.success(
        `🎉 ${eventsToCreate.length} eventos criados com sucesso!`,
        {
          description: `Plan "${selectedPlan?.name}" importado para o calendário`,
          duration: 5000,
        }
      );
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating events:', error);
      toast.error('Erro ao criar eventos', {
        description: 'Tente novamente ou contacte o suporte',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPlan !== null;
      case 2:
        return startDate !== null && defaultTime !== '';
      case 3:
        return selectedSessions.size > 0;
      case 4:
        return selectedAthletes.length > 0;
      case 5:
        return eventsToCreate.length > 0;
      default:
        return false;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Importar Plan
              </h2>
              <p className="text-sm text-violet-100">
                Criar múltiplos eventos automaticamente
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    step <= currentStep
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`}
                />
                {step < TOTAL_STEPS && (
                  <div className="w-1" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Step Counter */}
          <p className="text-xs text-violet-100 mt-2 text-center">
            Passo {currentStep} de {TOTAL_STEPS}
          </p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <WizardStep1SelectPlan
                key="step1"
                workspaceId={workspaceId}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
              />
            )}
            
            {currentStep === 2 && (
              <WizardStep2DateRange
                key="step2"
                plan={selectedPlan!}
                startDate={startDate}
                defaultTime={defaultTime}
                onStartDateChange={setStartDate}
                onDefaultTimeChange={setDefaultTime}
              />
            )}
            
            {currentStep === 3 && (
              <WizardStep3SessionSelection
                key="step3"
                plan={selectedPlan!}
                selectedSessions={selectedSessions}
                onToggleSession={(sessionId) => {
                  setSelectedSessions(prev => {
                    const next = new Set(prev);
                    if (next.has(sessionId)) {
                      next.delete(sessionId);
                    } else {
                      next.add(sessionId);
                    }
                    return next;
                  });
                }}
                onSelectAll={() => {
                  if (selectedPlan?.sessions) {
                    setSelectedSessions(new Set(selectedPlan.sessions.map(s => s.id)));
                  }
                }}
                onDeselectAll={() => {
                  setSelectedSessions(new Set());
                }}
              />
            )}
            
            {currentStep === 4 && (
              <WizardStep4Athletes
                key="step4"
                workspaceId={workspaceId}
                selectedAthletes={selectedAthletes}
                onToggleAthlete={(athleteId) => {
                  setSelectedAthletes(prev =>
                    prev.includes(athleteId)
                      ? prev.filter(id => id !== athleteId)
                      : [...prev, athleteId]
                  );
                }}
                onSelectAll={(athleteIds) => {
                  setSelectedAthletes(athleteIds);
                }}
                onDeselectAll={() => {
                  setSelectedAthletes([]);
                }}
              />
            )}
            
            {currentStep === 5 && (
              <WizardStep5Review
                key="step5"
                plan={selectedPlan!}
                eventsToCreate={eventsToCreate}
                selectedAthletes={selectedAthletes}
                startDate={startDate}
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            
            {/* Progress Info */}
            <div className="text-center">
              {currentStep === 5 && (
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-violet-600">
                    {eventsToCreate.length} eventos
                  </span>
                  {' '}prontos para criar
                </p>
              )}
            </div>
            
            {/* Next/Submit Button */}
            {currentStep < TOTAL_STEPS ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-violet-500'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl transition-all ${
                  canProceed() && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    A criar...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Criar {eventsToCreate.length} Eventos
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
