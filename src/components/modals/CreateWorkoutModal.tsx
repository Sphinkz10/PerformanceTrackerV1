import React from 'react';

interface CreateWorkoutModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (data: any) => void;
}

export function CreateWorkoutModal({ isOpen, onClose, onComplete }: CreateWorkoutModalProps) {
  const [name, setName] = React.useState('');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Create Workout</h2>
        <input
          type="text"
          placeholder="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onComplete?.({ name });
              onClose?.();
            }}
            className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
