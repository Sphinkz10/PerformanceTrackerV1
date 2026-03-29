/**
 * Floating Chat Button - Quick access to coach chat
 * 
 * Features:
 * - Floating button fixed bottom-right
 * - Badge with unread count
 * - Opens chat drawer
 * - Pulse animation when new messages
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Phase 4
 */

import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

export function FloatingChatButton({ onClick, unreadCount = 0 }: FloatingChatButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-2xl shadow-emerald-500/40 flex items-center justify-center text-white hover:shadow-emerald-500/60 transition-all"
    >
      <MessageCircle className="h-6 w-6" />
      
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-2 border-white shadow-lg"
        >
          <span className="text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
        </motion.div>
      )}

      {/* Pulse ring when unread */}
      {unreadCount > 0 && (
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
      )}
    </motion.button>
  );
}
