import React from 'react';

interface KeyboardShortcutsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2 text-sm">
          <div><span className="font-mono bg-slate-100 px-2 py-1 rounded">⌘K</span> - Search</div>
          <div><span className="font-mono bg-slate-100 px-2 py-1 rounded">⌘⇧K</span> - Shortcuts</div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
