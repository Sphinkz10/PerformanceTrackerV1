/**
 * ADAPTIVE CARD
 * Responsive card component with automatic layout adaptation
 * Mobile: Vertical stacked layout
 * Desktop: Horizontal flex layout with more spacing
 */

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AdaptiveCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const SHADOW_CLASSES = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const PADDING_CLASSES = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function AdaptiveCard({
  children,
  onClick,
  className = '',
  hover = true,
  border = true,
  shadow = 'sm',
  padding = 'md',
}: AdaptiveCardProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      {...(onClick && {
        onClick,
        whileHover: hover ? { scale: 1.02, y: -2 } : {},
        whileTap: { scale: 0.98 },
      })}
      className={`
        ${onClick ? 'cursor-pointer' : ''}
        ${border ? 'border border-slate-200/80' : ''}
        ${SHADOW_CLASSES[shadow]}
        ${PADDING_CLASSES[padding]}
        rounded-2xl bg-white
        transition-all
        ${onClick && hover ? 'hover:shadow-xl' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

// ============================================================================
// VARIANTS

/**
 * StatCard - Display statistics with icon, value, and label
 */
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  onClick?: () => void;
}

const COLOR_GRADIENTS = {
  emerald: 'from-emerald-50/90 to-white/90',
  sky: 'from-sky-50/90 to-white/90',
  amber: 'from-amber-50/90 to-white/90',
  violet: 'from-violet-50/90 to-white/90',
  red: 'from-red-50/30 to-white/90',
};

const ICON_GRADIENTS = {
  emerald: 'from-emerald-500 to-emerald-600',
  sky: 'from-sky-500 to-sky-600',
  amber: 'from-amber-500 to-amber-600',
  violet: 'from-violet-500 to-violet-600',
  red: 'from-red-500 to-red-600',
};

const CHANGE_COLORS = {
  positive: 'text-emerald-600',
  negative: 'text-red-600',
  neutral: 'text-slate-600',
};

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
  color = 'emerald',
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...(onClick && {
        onClick,
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      })}
      className={`
        rounded-2xl border border-slate-200/80 
        bg-gradient-to-br ${COLOR_GRADIENTS[color]} 
        p-4 shadow-sm
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        transition-all
      `}
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`
          h-8 w-8 rounded-xl 
          bg-gradient-to-br ${ICON_GRADIENTS[color]} 
          flex items-center justify-center
        `}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold text-slate-900 mb-1">{value}</p>

      {/* Change */}
      {change && (
        <p className={`text-xs font-medium ${CHANGE_COLORS[changeType]}`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}

/**
 * ActionCard - Card with icon, title, description, and call to action
 */
interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string | number;
  color?: 'emerald' | 'sky' | 'amber' | 'violet' | 'red';
  onClick: () => void;
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  badge,
  color = 'emerald',
  onClick,
}: ActionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        group w-full text-left
        p-4 rounded-xl 
        border-2 border-${color}-200 
        bg-gradient-to-br from-${color}-50 to-white 
        hover:border-${color}-400 hover:shadow-xl 
        transition-all
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`
          h-14 w-14 rounded-xl 
          bg-gradient-to-br ${ICON_GRADIENTS[color]} 
          flex items-center justify-center 
          group-hover:scale-110 transition-transform
        `}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 mb-1 truncate">{title}</h4>
          <p className="text-xs text-slate-600 line-clamp-2">{description}</p>
        </div>

        {/* Badge */}
        {badge !== undefined && (
          <div
            className={`
            shrink-0 h-6 w-6 rounded-full 
            bg-${color}-500 text-white 
            flex items-center justify-center 
            text-xs font-bold
          `}
          >
            {badge}
          </div>
        )}
      </div>
    </motion.button>
  );
}

/**
 * ListCard - Card for list items with avatar, title, subtitle, and actions
 */
interface ListCardProps {
  avatar?: string;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'red' | 'sky';
  actions?: ReactNode;
  onClick?: () => void;
}

const BADGE_COLORS = {
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  sky: 'bg-sky-100 text-sky-700',
};

export function ListCard({
  avatar,
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeColor = 'sky',
  actions,
  onClick,
}: ListCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      {...(onClick && {
        onClick,
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
      })}
      className={`
        flex items-center gap-3 sm:gap-4
        p-3 sm:p-4 rounded-xl 
        bg-white border border-slate-200 
        ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''}
        transition-all
      `}
    >
      {/* Avatar or Icon */}
      {avatar && (
        <img
          src={avatar}
          alt={title}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-slate-200 flex-shrink-0"
        />
      )}
      {Icon && !avatar && (
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Badge */}
      {badge && (
        <span
          className={`
          px-2 py-1 text-xs font-medium rounded-full
          ${BADGE_COLORS[badgeColor]}
          whitespace-nowrap flex-shrink-0
        `}
        >
          {badge}
        </span>
      )}

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </motion.div>
  );
}

/**
 * MediaCard - Card with image/video and content
 */
interface MediaCardProps {
  image: string;
  title: string;
  description?: string;
  badge?: string;
  footer?: ReactNode;
  onClick?: () => void;
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

export function MediaCard({
  image,
  title,
  description,
  badge,
  footer,
  onClick,
  aspectRatio = '16/9',
}: MediaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      {...(onClick && {
        onClick,
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
      })}
      className={`
        rounded-2xl border border-slate-200 
        bg-white shadow-sm overflow-hidden
        ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}
        transition-all
      `}
    >
      {/* Image */}
      <div className={`relative w-full bg-slate-100 aspect-[${aspectRatio}]`}>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Badge overlay */}
        {badge && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-900 rounded-full shadow-md">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-slate-900 mb-1 line-clamp-2">{title}</h4>
        {description && (
          <p className="text-sm text-slate-600 line-clamp-3">{description}</p>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100">{footer}</div>
      )}
    </motion.div>
  );
}
