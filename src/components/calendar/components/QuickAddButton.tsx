/**
 * QUICK ADD BUTTON
 * Floating action button for quick event creation
 */

import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface QuickAddButtonProps {
  onClick: () => void;
}

export function QuickAddButton({ onClick }: QuickAddButtonProps) {
  const handleClick = () => {
    onClick();
  };
  
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-2xl shadow-sky-500/50 hover:from-sky-400 hover:to-sky-500 transition-all flex items-center justify-center group"
      aria-label="Criar novo evento"
    >
      <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-2xl bg-sky-400 opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500" />
    </motion.button>
  );
}