/**
 * RESPONSIVE TAB BAR
 * Adaptive tab navigation for mobile and desktop
 * Mobile: Bottom bar with icons only
 * Desktop: Top bar with icons + labels
 */

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
}

interface ResponsiveTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  position?: 'top' | 'bottom'; // Mobile: bottom, Desktop: top
  className?: string;
}

export function ResponsiveTabBar({
  tabs,
  activeTab,
  onChange,
  position = 'top',
  className = '',
}: ResponsiveTabBarProps) {
  return (
    <>
      {/* DESKTOP: Top horizontal tabs with full labels */}
      <div className={`hidden sm:flex gap-2 overflow-x-auto pb-2 ${className}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={tab.disabled ? {} : { scale: 1.02 }}
              whileTap={tab.disabled ? {} : { scale: 0.98 }}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={`
                relative flex items-center gap-2 px-6 py-3 
                text-sm font-semibold rounded-xl transition-all 
                whitespace-nowrap
                ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : tab.disabled
                    ? 'bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>

              {/* Badge */}
              {tab.badge !== undefined && (
                <span
                  className={`
                    ml-1 px-2 py-0.5 text-xs font-bold rounded-full
                    ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-red-500 text-white'
                    }
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* MOBILE: Bottom fixed navigation bar */}
      <div
        className={`
          sm:hidden fixed ${position === 'bottom' ? 'bottom-0' : 'top-0'} 
          left-0 right-0 z-40 
          bg-white border-t border-slate-200 
          shadow-lg
          safe-bottom
        `}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileTap={tab.disabled ? {} : { scale: 0.9 }}
                onClick={() => !tab.disabled && onChange(tab.id)}
                disabled={tab.disabled}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[64px] py-2 px-3 rounded-xl
                  transition-all
                  ${
                    isActive
                      ? 'bg-sky-50'
                      : tab.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : ''
                  }
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    relative
                    ${isActive ? 'text-sky-600' : 'text-slate-600'}
                  `}
                >
                  <Icon className="h-6 w-6" />

                  {/* Badge on icon */}
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {typeof tab.badge === 'number' && tab.badge > 9
                        ? '9+'
                        : tab.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[11px] font-medium mt-1 truncate max-w-[64px]
                    ${isActive ? 'text-sky-600' : 'text-slate-600'}
                  `}
                >
                  {tab.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom fixed bar */}
      {position === 'bottom' && (
        <div className="sm:hidden h-20" aria-hidden="true" />
      )}
    </>
  );
}

// ============================================================================
// VARIANTS

/**
 * Compact variant - smaller tabs for secondary navigation
 */
export function CompactTabBar({
  tabs,
  activeTab,
  onChange,
  className = '',
}: Omit<ResponsiveTabBarProps, 'position'>) {
  return (
    <div className={`flex gap-1 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileHover={tab.disabled ? {} : { scale: 1.05 }}
            whileTap={tab.disabled ? {} : { scale: 0.95 }}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`
              relative flex items-center gap-2 px-4 py-2
              text-xs font-semibold rounded-lg transition-all
              whitespace-nowrap
              ${
                isActive
                  ? 'bg-sky-500 text-white'
                  : tab.disabled
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={`
                  px-1.5 py-0.5 text-[10px] font-bold rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
                `}
              >
                {tab.badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/**
 * Pill variant - iOS-style segmented control
 */
export function PillTabBar({
  tabs,
  activeTab,
  onChange,
  className = '',
}: Omit<ResponsiveTabBarProps, 'position'>) {
  return (
    <div
      className={`
        inline-flex p-1 bg-slate-100 rounded-xl gap-1
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileTap={tab.disabled ? {} : { scale: 0.95 }}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`
              relative flex items-center gap-2 px-4 py-2
              text-sm font-semibold rounded-lg transition-all
              whitespace-nowrap
              ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : tab.disabled
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
