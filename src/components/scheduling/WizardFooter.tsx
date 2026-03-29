import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  isLoading?: boolean;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft?: () => void;
  showSaveDraft?: boolean;
}

export function WizardFooter({
  currentStep,
  totalSteps,
  canGoNext,
  isLoading = false,
  onNext,
  onBack,
  onSaveDraft,
  showSaveDraft = false
}: WizardFooterProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        {/* Back Button */}
        {!isFirstStep && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </motion.button>
        )}

        {/* Spacer if first step */}
        {isFirstStep && <div />}

        {/* Center - Save Draft (optional) */}
        <div className="flex-1 flex justify-center">
          {showSaveDraft && onSaveDraft && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSaveDraft}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Guardar Rascunho</span>
              <span className="sm:hidden">Guardar</span>
            </motion.button>
          )}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: canGoNext && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: canGoNext && !isLoading ? 0.98 : 1 }}
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            canGoNext && !isLoading
              ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>A processar...</span>
            </>
          ) : (
            <>
              <span>
                {currentStep === 5
                  ? 'Gerar Horários'
                  : currentStep === 6
                  ? 'Criar Sessões'
                  : 'Seguinte'}
              </span>
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </motion.button>
      </div>

      {/* Help text */}
      {!canGoNext && !isLoading && (
        <p className="text-xs text-amber-600 text-center mt-3 flex items-center justify-center gap-1">
          <span>⚠️</span>
          <span>
            {currentStep === 1 && 'Seleciona pelo menos 1 atleta'}
            {currentStep === 2 && 'Duração mínima: 15 minutos'}
            {currentStep === 3 && 'Define pelo menos uma janela disponível'}
            {currentStep === 5 && 'Gera horários primeiro'}
          </span>
        </p>
      )}
    </div>
  );
}
