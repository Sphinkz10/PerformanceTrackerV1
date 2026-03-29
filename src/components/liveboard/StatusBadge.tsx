/**
 * STATUS BADGE - Live Board
 * Badge de status do atleta (🟢/🟡/🔴)
 */

'use client';

import { motion } from 'motion/react';
import { getStatusDisplay, type OverallStatus } from '@/lib/athleteUtils';

interface StatusBadgeProps {
  status: OverallStatus;
  showLabel?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({
  status,
  showLabel = true,
  animated = true,
  size = 'md',
}: StatusBadgeProps) {
  const { emoji, label, color } = getStatusDisplay(status);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    amber: 'bg-amber-100 text-amber-700 border-amber-300',
    red: 'bg-red-100 text-red-700 border-red-300',
  };

  const BadgeContent = (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeClasses[size]} ${colorClasses[color]}`}
    >
      <span className="text-base">{emoji}</span>
      {showLabel && <span>{label}</span>}
    </div>
  );

  if (!animated) {
    return BadgeContent;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-block"
    >
      {BadgeContent}
    </motion.div>
  );
}
