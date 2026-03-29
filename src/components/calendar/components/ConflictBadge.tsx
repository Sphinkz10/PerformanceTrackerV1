/**
 * CONFLICT BADGE
 * Visual indicator for event conflicts
 */

import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Users, Clock } from 'lucide-react';

export type ConflictSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ConflictBadgeProps {
  severity: ConflictSeverity;
  conflictCount: number;
  sharedAthletes?: number;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const SEVERITY_CONFIG = {
  low: {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-700',
    icon: 'text-amber-600',
    gradient: 'from-amber-50 to-orange-50',
  },
  medium: {
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    text: 'text-orange-700',
    icon: 'text-orange-600',
    gradient: 'from-orange-50 to-red-50',
  },
  high: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-700',
    icon: 'text-red-600',
    gradient: 'from-red-50 to-red-100',
  },
  critical: {
    bg: 'bg-red-200',
    border: 'border-red-400',
    text: 'text-red-900',
    icon: 'text-red-700',
    gradient: 'from-red-100 to-red-200',
  },
};

const SIZE_CONFIG = {
  sm: {
    container: 'px-2 py-1',
    icon: 'h-3 w-3',
    text: 'text-xs',
    badge: 'h-4 w-4 text-[10px]',
  },
  md: {
    container: 'px-3 py-1.5',
    icon: 'h-4 w-4',
    text: 'text-sm',
    badge: 'h-5 w-5 text-xs',
  },
  lg: {
    container: 'px-4 py-2',
    icon: 'h-5 w-5',
    text: 'text-base',
    badge: 'h-6 w-6 text-sm',
  },
};

/**
 * Calculate severity based on conflict count
 */
export function calculateSeverity(conflictCount: number): ConflictSeverity {
  if (conflictCount >= 5) return 'critical';
  if (conflictCount >= 3) return 'high';
  if (conflictCount >= 2) return 'medium';
  return 'low';
}

export function ConflictBadge({
  severity,
  conflictCount,
  sharedAthletes,
  onClick,
  size = 'md',
  showDetails = false,
}: ConflictBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const sizeConfig = SIZE_CONFIG[size];

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 
        ${sizeConfig.container}
        ${config.bg} 
        border ${config.border}
        ${config.text}
        rounded-full font-semibold
        ${onClick ? 'cursor-pointer hover:shadow-md transition-all' : ''}
      `}
    >
      <AlertTriangle className={`${sizeConfig.icon} ${config.icon}`} />
      
      {showDetails ? (
        <div className="flex items-center gap-2">
          <span className={sizeConfig.text}>
            {conflictCount} {conflictCount === 1 ? 'conflito' : 'conflitos'}
          </span>
          {sharedAthletes && sharedAthletes > 0 && (
            <>
              <div className="h-3 w-px bg-current opacity-30" />
              <div className="flex items-center gap-1">
                <Users className={`${sizeConfig.icon} opacity-70`} />
                <span className={sizeConfig.text}>{sharedAthletes}</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <span 
          className={`
            ${sizeConfig.badge} 
            rounded-full bg-white 
            flex items-center justify-center 
            font-bold
          `}
        >
          {conflictCount}
        </span>
      )}
    </Component>
  );
}

/**
 * Compact version for grid/list views
 */
export function ConflictBadgeCompact({
  conflictCount,
  onClick,
}: {
  conflictCount: number;
  onClick?: () => void;
}) {
  const severity = calculateSeverity(conflictCount);
  const config = SEVERITY_CONFIG[severity];

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        h-6 w-6 rounded-full 
        ${config.bg} 
        border-2 ${config.border}
        flex items-center justify-center
        font-bold ${config.text}
        text-xs
        hover:shadow-lg transition-all
      `}
      title={`${conflictCount} conflito${conflictCount > 1 ? 's' : ''}`}
    >
      {conflictCount}
    </motion.button>
  );
}

/**
 * Pulse animation badge for critical conflicts
 */
export function ConflictBadgePulse({
  conflictCount,
  onClick,
}: {
  conflictCount: number;
  onClick?: () => void;
}) {
  const severity = calculateSeverity(conflictCount);
  const config = SEVERITY_CONFIG[severity];

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative
        h-8 w-8 rounded-full 
        bg-gradient-to-br ${config.gradient}
        border-2 ${config.border}
        flex items-center justify-center
        shadow-lg
      `}
    >
      {/* Pulse ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border-2 ${config.border}`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      
      {/* Icon + Count */}
      <div className="relative flex items-center justify-center">
        <AlertTriangle className={`h-4 w-4 ${config.icon}`} />
        <span 
          className={`
            absolute -top-1 -right-1 
            h-4 w-4 rounded-full 
            bg-white ${config.text}
            flex items-center justify-center 
            text-[10px] font-bold
            border ${config.border}
          `}
        >
          {conflictCount}
        </span>
      </div>
    </motion.button>
  );
}
