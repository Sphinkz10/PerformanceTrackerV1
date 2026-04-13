import React from 'react';

interface ActiveAthletesModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ActiveAthletesModal({ isOpen, onClose }: ActiveAthletesModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Active Athletes</h2>
        <p className="text-slate-600 text-sm mb-4">No active athletes</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
