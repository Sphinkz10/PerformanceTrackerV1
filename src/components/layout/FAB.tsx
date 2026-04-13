import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onAction?: (action: string) => void;
}

export function FAB({ isOpen, onOpen, onClose, onAction }: FABProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={isOpen ? onClose : onOpen}
        className="h-14 w-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Add new"
      >
        <Plus className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-48">
          <button
            onClick={() => onAction?.('athlete')}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
          >
            Add Athlete
          </button>
          <button
            onClick={() => onAction?.('session')}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
          >
            Schedule Session
          </button>
          <button
            onClick={() => onAction?.('form')}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
          >
            Send Form
          </button>
        </div>
      )}
    </div>
  );
}
