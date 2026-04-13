import React from 'react';

interface SendFormWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (data: any) => void;
}

export function SendFormWizard({ isOpen, onClose, onComplete }: SendFormWizardProps) {
  const [step, setStep] = React.useState(1);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Send Form Wizard</h2>
        <p className="text-slate-600 text-sm mb-4">Step {step} of 3</p>
        <div className="mb-4 h-20 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
          Form Step {step}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                onComplete?.({});
                onClose?.();
              }
            }}
            className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          >
            {step < 3 ? 'Next' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}
