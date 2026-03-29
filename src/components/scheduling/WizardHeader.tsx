import { motion } from 'motion/react';
import { 
  Users, 
  Settings, 
  Calendar, 
  Shield, 
  Wand2, 
  CheckCircle 
} from 'lucide-react';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { number: 1, label: 'Atletas', icon: Users },
  { number: 2, label: 'Sessão', icon: Settings },
  { number: 3, label: 'Disponibilidade', icon: Calendar },
  { number: 4, label: 'Recursos', icon: Shield },
  { number: 5, label: 'Gerar', icon: Wand2 },
  { number: 6, label: 'Rever', icon: CheckCircle }
];

export function WizardHeader({ currentStep, totalSteps }: WizardHeaderProps) {
  return (
    <div className="px-4 sm:px-6 pb-4">
      {/* Desktop - Horizontal steps */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#10b981'
                      : isActive
                      ? '#8b5cf6'
                      : '#e2e8f0'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isActive
                      ? 'bg-violet-500'
                      : 'bg-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCompleted || isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                </motion.div>
                <p
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? 'text-violet-600'
                      : isCompleted
                      ? 'text-emerald-600'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 relative top-[-16px]">
                  <div className="h-full bg-slate-200">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: currentStep > step.number ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile - Simple progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-violet-600">
            Passo {currentStep} de {totalSteps}
          </span>
          <span className="text-xs text-slate-500">
            {STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-violet-500 to-violet-600"
          />
        </div>
      </div>
    </div>
  );
}
