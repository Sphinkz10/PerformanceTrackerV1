import React from 'react';
import { Bell, MessageSquare, Settings } from 'lucide-react';

interface HeaderProps {
  onSearchOpen?: () => void;
  onNotificationsOpen?: () => void;
  onMessagesOpen?: () => void;
  onWorkspaceSettings?: () => void;
  onCreateWorkspace?: () => void;
  onDataOSOpen?: () => void;
  currentWorkspace?: any;
  workspaces?: any[];
  onWorkspaceChange?: (id: string) => void;
  pendingDecisions?: any[];
}

export function Header({
  onSearchOpen,
  onNotificationsOpen,
  onMessagesOpen,
  onWorkspaceSettings,
  pendingDecisions = []
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-6 gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-slate-900">Performance Tracker</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onSearchOpen}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Search"
        >
          <span className="text-sm text-slate-600">⌘K</span>
        </button>
        <button
          onClick={onNotificationsOpen}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {pendingDecisions && pendingDecisions.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button
          onClick={onMessagesOpen}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5 text-slate-600" />
        </button>
        <button
          onClick={onWorkspaceSettings}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
