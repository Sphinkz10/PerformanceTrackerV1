import React, { useState } from 'react';

interface CreateAthleteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (data: any) => void;
}

export function CreateAthleteModal({ isOpen, onClose, onComplete }: CreateAthleteModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete?.(formData);
    setFormData({ name: '', email: '', phone: '' });
    onClose?.();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Create Athlete</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            required
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
          />
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
