/**
 * EMPTY STATE
 * Component for when there are no events
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({ 
  title, 
  description, 
  onAction, 
  actionLabel = 'Criar Evento' 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
        <Calendar className="h-10 w-10 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-slate-600 text-center max-w-md mb-6">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
