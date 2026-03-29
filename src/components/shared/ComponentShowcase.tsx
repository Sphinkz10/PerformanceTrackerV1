/**
 * COMPONENT SHOWCASE
 * Demo page showing all shared components in action
 * Use this as reference for implementation
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Calendar,
  Settings,
  User,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  FileText,
  Award,
  Bell,
  MessageCircle,
} from 'lucide-react';

// Import all components
import {
  ResponsiveTabBar,
  CompactTabBar,
  PillTabBar,
  TabItem,
} from './ResponsiveTabBar';
import {
  ResponsiveModal,
  ConfirmationDialog,
} from './ResponsiveModal';
import {
  AdaptiveCard,
  StatCard,
  ActionCard,
  ListCard,
  MediaCard,
} from './AdaptiveCard';

export function ComponentShowcase() {
  // Tab states
  const [activeMainTab, setActiveMainTab] = useState('tabs');
  const [activeDemoTab, setActiveDemoTab] = useState('home');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  const [mobileStyle, setMobileStyle] = useState<'fullscreen' | 'bottomsheet'>('fullscreen');

  // Demo data
  const mainTabs: TabItem[] = [
    { id: 'tabs', label: 'Tab Bars', icon: Home },
    { id: 'modals', label: 'Modals', icon: FileText },
    { id: 'cards', label: 'Cards', icon: Award },
  ];

  const demoTabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: 5 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User, disabled: true },
  ];

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            📚 Component Showcase
          </h1>
          <p className="text-slate-600">
            PerformTrack Design System - Shared Components Demo
          </p>
        </motion.div>

        {/* Main Navigation */}
        <ResponsiveTabBar
          tabs={mainTabs}
          activeTab={activeMainTab}
          onChange={setActiveMainTab}
        />

        {/* Content */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          {/* TAB BARS SECTION */}
          {activeMainTab === 'tabs' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  📱 ResponsiveTabBar
                </h2>
                <p className="text-slate-600 mb-6">
                  Adaptive tab navigation - Desktop shows full tabs, Mobile shows bottom bar
                </p>

                <div className="space-y-6">
                  {/* Default Variant */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Default Variant
                    </h3>
                    <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-slate-50">
                      <ResponsiveTabBar
                        tabs={demoTabs}
                        activeTab={activeDemoTab}
                        onChange={setActiveDemoTab}
                      />
                    </div>
                    <div className="text-sm text-slate-500 bg-slate-100 rounded-lg p-3">
                      💡 <strong>Desktop:</strong> Full tabs with icons + labels<br />
                      💡 <strong>Mobile:</strong> Bottom fixed bar with active indicator
                    </div>
                  </div>

                  {/* Compact Variant */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Compact Variant
                    </h3>
                    <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-slate-50">
                      <CompactTabBar
                        tabs={demoTabs}
                        activeTab={activeDemoTab}
                        onChange={setActiveDemoTab}
                      />
                    </div>
                    <div className="text-sm text-slate-500 bg-slate-100 rounded-lg p-3">
                      💡 Smaller sizing, perfect for secondary navigation
                    </div>
                  </div>

                  {/* Pill Variant */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Pill Variant (iOS-style)
                    </h3>
                    <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-slate-50">
                      <PillTabBar
                        tabs={demoTabs}
                        activeTab={activeDemoTab}
                        onChange={setActiveDemoTab}
                      />
                    </div>
                    <div className="text-sm text-slate-500 bg-slate-100 rounded-lg p-3">
                      💡 Segmented control style, inline layout
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Code Example:
                    </h3>
                    <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
{`import { ResponsiveTabBar, TabItem } from '@/components/shared/ResponsiveTabBar';

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar, badge: 5 },
];

<ResponsiveTabBar
  tabs={tabs}
  activeTab={activeTab}
  onChange={setActiveTab}
/>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODALS SECTION */}
          {activeMainTab === 'modals' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  🪟 ResponsiveModal
                </h2>
                <p className="text-slate-600 mb-6">
                  Adaptive modals - Desktop shows centered modal, Mobile shows fullscreen or bottom sheet
                </p>

                <div className="space-y-6">
                  {/* Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Size
                      </label>
                      <select
                        value={modalSize}
                        onChange={(e) => setModalSize(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="sm">Small (sm)</option>
                        <option value="md">Medium (md)</option>
                        <option value="lg">Large (lg)</option>
                        <option value="xl">Extra Large (xl)</option>
                        <option value="full">Full Width</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mobile Style
                      </label>
                      <select
                        value={mobileStyle}
                        onChange={(e) => setMobileStyle(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="fullscreen">Fullscreen</option>
                        <option value="bottomsheet">Bottom Sheet</option>
                      </select>
                    </div>
                  </div>

                  {/* Demo Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold shadow-md"
                    >
                      Open Standard Modal
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsConfirmOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md"
                    >
                      Open Confirmation Dialog
                    </motion.button>
                  </div>

                  {/* Standard Modal */}
                  <ResponsiveModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Example Modal"
                    subtitle="This is a subtitle"
                    size={modalSize}
                    mobileStyle={mobileStyle}
                    footer={
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold shadow-md"
                        >
                          Confirm
                        </button>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      <p className="text-slate-600">
                        This is a responsive modal that adapts to different screen sizes.
                      </p>
                      <p className="text-slate-600">
                        Try resizing your browser window or opening on mobile to see the different styles.
                      </p>
                      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                        <p className="text-sm text-sky-900 font-semibold">
                          Current settings:
                        </p>
                        <ul className="text-sm text-sky-700 mt-2 space-y-1">
                          <li>• Size: {modalSize}</li>
                          <li>• Mobile Style: {mobileStyle}</li>
                        </ul>
                      </div>
                    </div>
                  </ResponsiveModal>

                  {/* Confirmation Dialog */}
                  <ConfirmationDialog
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleConfirm}
                    title="Confirm Action"
                    message="Are you sure you want to proceed? This will simulate a 2-second loading state."
                    confirmLabel="Yes, proceed"
                    cancelLabel="Cancel"
                    variant="danger"
                    isLoading={isLoading}
                  />

                  {/* Code Example */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Code Example:
                    </h3>
                    <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
{`import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

<ResponsiveModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  subtitle="Subtitle"
  size="md"
  mobileStyle="bottomsheet"
  footer={<div>Footer content</div>}
>
  <div>Your content here</div>
</ResponsiveModal>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CARDS SECTION */}
          {activeMainTab === 'cards' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  🎴 AdaptiveCard
                </h2>
                <p className="text-slate-600 mb-6">
                  Flexible card system with multiple specialized variants
                </p>

                <div className="space-y-8">
                  {/* StatCard */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      StatCard - Statistics Display
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <StatCard
                        icon={Users}
                        label="Total Athletes"
                        value="124"
                        change="+12% this month"
                        changeType="positive"
                        color="sky"
                      />
                      <StatCard
                        icon={Calendar}
                        label="Events"
                        value="45"
                        change="+8 vs last week"
                        changeType="positive"
                        color="emerald"
                      />
                      <StatCard
                        icon={DollarSign}
                        label="Revenue"
                        value="€8,900"
                        change="-5% vs target"
                        changeType="negative"
                        color="amber"
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Growth"
                        value="+23%"
                        changeType="neutral"
                        color="violet"
                      />
                    </div>
                  </div>

                  {/* ActionCard */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      ActionCard - Call to Action
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ActionCard
                        icon={Plus}
                        title="Create New Event"
                        description="Schedule a new training session or match"
                        badge={3}
                        color="emerald"
                        onClick={() => alert('Create event clicked!')}
                      />
                      <ActionCard
                        icon={FileText}
                        title="Generate Report"
                        description="Create detailed analytics report"
                        color="sky"
                        onClick={() => alert('Generate report clicked!')}
                      />
                    </div>
                  </div>

                  {/* ListCard */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      ListCard - List Items
                    </h3>
                    <div className="space-y-3">
                      <ListCard
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                        title="João Silva"
                        subtitle="joão.silva@performtrack.com"
                        badge="Active"
                        badgeColor="emerald"
                        actions={
                          <button className="px-3 py-1 text-sm bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200">
                            View
                          </button>
                        }
                        onClick={() => alert('John clicked!')}
                      />
                      <ListCard
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
                        title="Maria Santos"
                        subtitle="maria.santos@performtrack.com"
                        badge="Pending"
                        badgeColor="amber"
                        actions={
                          <button className="px-3 py-1 text-sm bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200">
                            View
                          </button>
                        }
                      />
                      <ListCard
                        icon={Bell}
                        title="Notifications"
                        subtitle="5 new notifications"
                        badge="5"
                        badgeColor="red"
                      />
                    </div>
                  </div>

                  {/* MediaCard */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      MediaCard - Media Content
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <MediaCard
                        image="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800"
                        title="HIIT Training Session"
                        description="High intensity interval training for advanced athletes"
                        badge="NEW"
                        aspectRatio="16/9"
                        footer={
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">45 min</span>
                            <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                              Start →
                            </button>
                          </div>
                        }
                        onClick={() => alert('Workout clicked!')}
                      />
                      <MediaCard
                        image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800"
                        title="Strength Training"
                        description="Build muscle and improve overall strength"
                        aspectRatio="16/9"
                        footer={
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">60 min</span>
                            <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                              Start →
                            </button>
                          </div>
                        }
                      />
                      <MediaCard
                        image="https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800"
                        title="Yoga & Flexibility"
                        description="Improve flexibility and reduce stress"
                        badge="Popular"
                        aspectRatio="16/9"
                        footer={
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">30 min</span>
                            <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                              Start →
                            </button>
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Code Example:
                    </h3>
                    <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
{`import { StatCard, ActionCard, ListCard, MediaCard } from '@/components/shared/AdaptiveCard';

<StatCard
  icon={TrendingUp}
  label="Revenue"
  value="€12,345"
  change="+15%"
  changeType="positive"
  color="emerald"
/>

<ActionCard
  icon={Plus}
  title="New Event"
  description="Create event"
  onClick={handleCreate}
/>

<ListCard
  avatar="..."
  title="John Doe"
  subtitle="john@example.com"
  badge="Active"
/>

<MediaCard
  image="..."
  title="Workout"
  description="HIIT training"
  footer={<button>Start</button>}
/>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 space-y-2 pb-20 sm:pb-6">
          <p>
            PerformTrack Design System v2.0
          </p>
          <p>
            All components follow 100% Guidelines.md specifications
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>✅ Mobile-first</span>
            <span>✅ TypeScript</span>
            <span>✅ Accessible</span>
            <span>✅ Tested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
