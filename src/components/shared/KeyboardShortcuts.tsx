/**
 * KEYBOARD SHORTCUTS - Global keyboard navigation
 * Ctrl+K command palette, navigation shortcuts
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Command,
  BookOpen,
  Activity,
  Zap,
  Sparkles,
  Plus,
  Database,
  TrendingUp,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';

interface ShortcutAction {
  id: string;
  label: string;
  shortcut: string;
  icon: any;
  action: () => void;
  category: 'navigation' | 'actions' | 'tools';
}

interface KeyboardShortcutsProps {
  onNavigate?: (tab: string) => void;
  onAction?: (action: string) => void;
}

export function KeyboardShortcuts({ onNavigate, onAction }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Define shortcuts
  const shortcuts: ShortcutAction[] = [
    // Navigation
    {
      id: 'nav-library',
      label: 'Go to Library',
      shortcut: 'Ctrl+1',
      icon: BookOpen,
      category: 'navigation',
      action: () => onNavigate?.('library'),
    },
    {
      id: 'nav-liveboard',
      label: 'Go to Live Board',
      shortcut: 'Ctrl+2',
      icon: Activity,
      category: 'navigation',
      action: () => onNavigate?.('liveboard'),
    },
    {
      id: 'nav-automation',
      label: 'Go to Automation',
      shortcut: 'Ctrl+3',
      icon: Zap,
      category: 'navigation',
      action: () => onNavigate?.('automation'),
    },
    {
      id: 'nav-insights',
      label: 'Go to Insights',
      shortcut: 'Ctrl+4',
      icon: Sparkles,
      category: 'navigation',
      action: () => onNavigate?.('insights'),
    },
    {
      id: 'nav-builder',
      label: 'Go to Data Builder',
      shortcut: 'Ctrl+5',
      icon: Database,
      category: 'navigation',
      action: () => onNavigate?.('builder'),
    },
    {
      id: 'nav-quantum',
      label: 'Go to Quantum Forecast',
      shortcut: 'Ctrl+6',
      icon: TrendingUp,
      category: 'navigation',
      action: () => onNavigate?.('quantum'),
    },

    // Actions
    {
      id: 'action-new-metric',
      label: 'Create New Metric',
      shortcut: 'Ctrl+N',
      icon: Plus,
      category: 'actions',
      action: () => onAction?.('create-metric'),
    },
    {
      id: 'action-search',
      label: 'Search',
      shortcut: 'Ctrl+F',
      icon: Search,
      category: 'actions',
      action: () => onAction?.('search'),
    },
    {
      id: 'action-settings',
      label: 'Open Settings',
      shortcut: 'Ctrl+,',
      icon: Settings,
      category: 'tools',
      action: () => onAction?.('settings'),
    },
    {
      id: 'action-help',
      label: 'Show Help',
      shortcut: 'Ctrl+/',
      icon: HelpCircle,
      category: 'tools',
      action: () => onAction?.('help'),
    },
  ];

  // Filter shortcuts based on search
  const filteredShortcuts = search
    ? shortcuts.filter((s) => s.label.toLowerCase().includes(search.toLowerCase()))
    : shortcuts;

  // Group by category
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutAction[]>);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        return;
      }

      // Don't process shortcuts if command palette is open
      if (isOpen) return;

      // Navigation shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const keyMap: Record<string, string> = {
          '1': 'library',
          '2': 'liveboard',
          '3': 'automation',
          '4': 'insights',
          '5': 'builder',
          '6': 'quantum',
        };

        if (keyMap[e.key]) {
          e.preventDefault();
          onNavigate?.(keyMap[e.key]);
          return;
        }

        // Action shortcuts
        if (e.key === 'n') {
          e.preventDefault();
          onAction?.('create-metric');
          return;
        }

        if (e.key === 'f') {
          e.preventDefault();
          onAction?.('search');
          return;
        }

        if (e.key === ',') {
          e.preventDefault();
          onAction?.('settings');
          return;
        }

        if (e.key === '/') {
          e.preventDefault();
          onAction?.('help');
          return;
        }
      }
    },
    [isOpen, onNavigate, onAction]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleShortcutClick = (shortcut: ShortcutAction) => {
    shortcut.action();
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Type a command or search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Shortcuts List */}
              <div className="max-h-[60vh] overflow-y-auto">
                {Object.entries(groupedShortcuts).map(([category, items]) => (
                  <div key={category} className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
                      {category}
                    </p>
                    <div className="space-y-1">
                      {items.map((shortcut) => {
                        const Icon = shortcut.icon;
                        return (
                          <motion.button
                            key={shortcut.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleShortcutClick(shortcut)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                                <Icon className="h-4 w-4 text-slate-600" />
                              </div>
                              <span className="text-sm text-slate-900">{shortcut.label}</span>
                            </div>
                            <kbd className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded border border-slate-200 font-mono">
                              {shortcut.shortcut}
                            </kbd>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredShortcuts.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No shortcuts found</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">esc</kbd>
                    <span>Close</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Command className="h-3 w-3" />
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">K</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// Keyboard Shortcuts Help Modal
// ============================================================

export function KeyboardShortcutsHelp({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const shortcuts = [
    { keys: 'Ctrl + K', description: 'Open command palette' },
    { keys: 'Ctrl + 1-6', description: 'Navigate between tabs' },
    { keys: 'Ctrl + N', description: 'Create new metric' },
    { keys: 'Ctrl + F', description: 'Search' },
    { keys: 'Ctrl + ,', description: 'Open settings' },
    { keys: 'Ctrl + /', description: 'Show help' },
    { keys: 'Esc', description: 'Close modal/dialog' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-900">Keyboard Shortcuts</h2>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                  >
                    <span className="text-sm text-slate-700">{shortcut.description}</span>
                    <kbd className="px-3 py-1.5 text-sm bg-white text-slate-900 rounded-lg border border-slate-200 font-mono">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-6 text-center">
                Press <kbd className="px-2 py-1 bg-slate-100 rounded">Ctrl + K</kbd> anytime to open
                the command palette
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
