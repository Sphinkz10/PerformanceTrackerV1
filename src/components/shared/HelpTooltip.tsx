/**
 * HELP TOOLTIP COMPONENT
 * Displays contextual help information with ? icon
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  iconClassName?: string;
}

export function HelpTooltip({ 
  content, 
  title,
  position = 'top',
  size = 'sm',
  iconClassName = ''
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const tooltipPositions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1',
  };

  const arrowRotations = {
    top: 'rotate-180',
    bottom: '',
    left: 'rotate-90',
    right: '-rotate-90',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className={`text-slate-400 hover:text-sky-500 transition-colors cursor-help ${iconClassName}`}
      >
        <HelpCircle className={sizeClasses[size]} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${tooltipPositions[position]} pointer-events-none`}
          >
            <div className="w-64 p-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700">
              {title && (
                <div className="font-semibold text-sm mb-1.5 text-sky-400">
                  {title}
                </div>
              )}
              <div className="text-xs leading-relaxed text-slate-200">
                {content}
              </div>
              
              {/* Arrow */}
              <div className={`absolute ${arrowPositions[position]}`}>
                <div className={`w-2 h-2 bg-slate-900 border-slate-700 ${arrowRotations[position]}`} 
                     style={{ 
                       borderLeft: '1px solid rgb(51, 65, 85)',
                       borderTop: '1px solid rgb(51, 65, 85)',
                       transform: `${arrowRotations[position]} rotate(45deg)`
                     }} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * INFO BADGE COMPONENT
 * Small badge with info/tip
 */

interface InfoBadgeProps {
  label: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'slate';
  icon?: React.ReactNode;
  size?: 'xs' | 'sm';
}

export function InfoBadge({ 
  label, 
  color = 'blue',
  icon,
  size = 'xs'
}: InfoBadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${colorClasses[color]} ${sizeClasses[size]}`}>
      {icon}
      {label}
    </span>
  );
}
