import React from 'react';

interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-[90%]">
        <input
          type="search"
          placeholder="Search..."
          className="w-full px-4 py-3 border-none outline-none rounded-t-lg"
          autoFocus
        />
        <div className="p-4 text-center text-slate-500 text-sm">No results</div>
      </div>
    </div>
  );
}
