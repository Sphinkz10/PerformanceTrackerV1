/**
 * ATHLETE AVAILABILITY COMPONENT
 * Shows athlete availability status with visual indicators
 */

import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Heart, Moon } from 'lucide-react';
import { AVAILABILITY_STATUS_CONFIG, AvailabilityStatus } from '../utils/statusConfigs';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    container: 'h-6 w-6',
    icon: 'h-3 w-3',
    text: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    container: 'h-8 w-8',
    icon: 'h-4 w-4',
    text: 'text-sm',
    padding: 'px-3 py-1.5',
  },
  lg: {
    container: 'h-10 w-10',
    icon: 'h-5 w-5',
    text: 'text-base',
    padding: 'px-4 py-2',
  },
};

// ============================================================================
// TYPES
// ============================================================================

type AvailabilityStatusType = 'available' | 'unavailable' | 'limited' | 'injured' | 'rest';

interface AthleteAvailabilityProps {
  status: AvailabilityStatusType;
  notes?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AthleteAvailability({
  status,
  notes,
  showLabel = true,
  size = 'md',
}: AthleteAvailabilityProps) {
  const config = AVAILABILITY_STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;
  
  if (!showLabel) {
    // Icon only mode
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`
          ${sizeConfig.container} 
          rounded-full 
          ${config.bg} 
          flex items-center justify-center
          ${config.border} border
        `}
        title={`${config.label}${notes ? `: ${notes}` : ''}`}
      >
        <Icon className={`${sizeConfig.icon} ${config.text}`} />
      </motion.div>
    );
  }
  
  // Badge mode with label
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        inline-flex items-center gap-2 
        ${sizeConfig.padding}
        rounded-full 
        ${config.bg} 
        ${config.border} border
      `}
    >
      <Icon className={`${sizeConfig.icon} ${config.text}`} />
      <span className={`${sizeConfig.text} font-medium ${config.text}`}>
        {config.label}
      </span>
      {notes && (
        <span className={`${sizeConfig.text} ${config.text} opacity-75`}>
          • {notes}
        </span>
      )}
    </motion.div>
  );
}

/**
 * AVAILABILITY SELECTOR
 * Dropdown to select athlete availability
 */
interface AvailabilitySelectorProps {
  value: AvailabilityStatus;
  onChange: (status: AvailabilityStatus) => void;
  disabled?: boolean;
}

export function AvailabilitySelector({
  value,
  onChange,
  disabled = false,
}: AvailabilitySelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AvailabilityStatus)}
        disabled={disabled}
        className={`
          w-full pl-3 pr-10 py-2 text-sm
          border border-slate-200 rounded-xl
          bg-white
          focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300
          transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {Object.entries(AVAILABILITY_STATUS_CONFIG).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * AVAILABILITY INDICATOR (Compact)
 * Small dot indicator for availability
 */
interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  pulse?: boolean;
}

export function AvailabilityIndicator({
  status,
  pulse = false,
}: AvailabilityIndicatorProps) {
  const config = AVAILABILITY_STATUS_CONFIG[status];
  
  return (
    <div className="relative inline-flex">
      <span
        className={`
          h-2.5 w-2.5 rounded-full
          ${config.bg.replace('100', '500')}
          ${pulse ? 'animate-pulse' : ''}
        `}
        title={config.label}
      />
      {pulse && (
        <span
          className={`
            absolute inset-0 h-2.5 w-2.5 rounded-full
            ${config.bg.replace('100', '500')}
            opacity-75 animate-ping
          `}
        />
      )}
    </div>
  );
}