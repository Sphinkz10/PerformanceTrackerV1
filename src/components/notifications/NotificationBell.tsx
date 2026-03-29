/**
 * NOTIFICATION BELL COMPONENT
 * 
 * Compact notification icon with badge for header
 * Opens NotificationPanel dropdown
 * 
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNotificationStats } from '../../hooks/useNotifications';
import { NotificationPanel } from './NotificationPanel';

interface NotificationBellProps {
  workspaceId: string;
  userId?: string;
  onNotificationClick?: (notificationId: string) => void;
}

export function NotificationBell({ 
  workspaceId, 
  userId,
  onNotificationClick 
}: NotificationBellProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch stats for unread count
  const { unreadCount, isLoading } = useNotificationStats({
    workspaceId,
    userId,
    enabled: true,
  });

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        panelRef.current &&
        bellRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPanelOpen) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isPanelOpen]);

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        ref={bellRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`relative h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
          isPanelOpen 
            ? 'bg-sky-100 text-sky-600' 
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="Notificações"
        aria-expanded={isPanelOpen}
      >
        <Bell className="h-4 w-4" />
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && !isLoading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation for new notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full bg-red-500 animate-ping opacity-75" />
        )}
      </motion.button>

      {/* Notification Panel Dropdown */}
      <AnimatePresence>
        {isPanelOpen && (
          <div ref={panelRef}>
            <NotificationPanel
              workspaceId={workspaceId}
              userId={userId}
              onClose={() => setIsPanelOpen(false)}
              onNotificationClick={(id) => {
                onNotificationClick?.(id);
                setIsPanelOpen(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
