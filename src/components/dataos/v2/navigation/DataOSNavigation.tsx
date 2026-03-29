/**
 * DATA OS NAVIGATION - RESPONSIVE
 * Mobile: Just Top Bar with tabs (no bottom nav - using app's bottom nav)
 * Tablet: Logo + 3 visible tabs + "More" dropdown
 * Desktop: Logo + 5 horizontal tabs
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  BookTemplate,
  Activity,
  Zap,
  Sparkles,
  PlusCircle,
  ChevronDown,
  User,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

export type DataOSTab = 'library' | 'liveboard' | 'automation' | 'insights' | 'entry';

interface DataOSNavigationProps {
  activeTab: DataOSTab;
  onTabChange: (tab: DataOSTab) => void;
  userName?: string;
  userAvatar?: string;
}

const tabs = [
  { id: 'library' as DataOSTab, label: 'Library', icon: BookTemplate, color: 'sky' },
  { id: 'liveboard' as DataOSTab, label: 'Live Board', icon: Activity, color: 'emerald' },
  { id: 'automation' as DataOSTab, label: 'Automation', icon: Zap, color: 'indigo' },
  { id: 'insights' as DataOSTab, label: 'Insights', icon: Sparkles, color: 'pink' },
  { id: 'entry' as DataOSTab, label: 'Manual Entry', icon: PlusCircle, color: 'blue' },
];

export function DataOSNavigation({
  activeTab,
  onTabChange,
  userName = 'User',
  userAvatar,
}: DataOSNavigationProps) {
  const { isMobile, isTablet } = useResponsive();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // MOBILE: Just Top Bar with tabs (no bottom nav - using app's bottom nav)
  if (isMobile) {
    return (
      <>
        {/* Top Bar with Title and Tabs */}
        <div className="flex-none bg-white border-b border-slate-200 shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="font-bold text-slate-900">📊 Data OS</h1>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          {/* Horizontal scrollable tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/30`
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // TABLET: 3 Visible Tabs + Dropdown
  if (isTablet) {
    const visibleTabs = tabs.slice(0, 3);
    const hiddenTabs = tabs.slice(3);

    return (
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 shrink-0">
            <span className="text-2xl">📊</span>
            <span>PerformTrack</span>
          </h1>

          <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  hiddenTabs.some(t => t.id === activeTab)
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <>
                    {/* Overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setMoreDropdownOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 w-56 bg-white border-2 border-slate-200 rounded-xl shadow-xl p-2 z-40"
                    >
                      {hiddenTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              onTabChange(tab.id);
                              setMoreDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-sky-50 text-sky-600'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="font-semibold">{tab.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold shrink-0">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP: All 5 Tabs Horizontal
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 shrink-0">
          <span className="text-3xl">📊</span>
          <span>PerformTrack</span>
        </h1>

        <div className="flex items-center gap-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold shrink-0 cursor-pointer hover:shadow-lg transition-shadow">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </div>
  );
}