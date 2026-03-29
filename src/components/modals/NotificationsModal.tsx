import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, CheckCircle, Info, TrendingUp, Calendar, Users } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
  workspaceId?: string;
  userId?: string;
}

export function NotificationsModal({ 
  isOpen, 
  onClose, 
  onNavigate,
  workspaceId = 'workspace-demo',
  userId = 'user-demo'
}: NotificationsModalProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications({
    workspaceId,
    userId,
    limit: 50,
    enabled: isOpen, // Only fetch when modal is open
  });

  // ============================================
  // HELPERS
  // ============================================

  const getIconAndColor = (type: string, category: string) => {
    // Priority: category-specific icons
    if (category === 'pain') return { icon: AlertCircle, color: 'red' as const };
    if (category === 'session') return { icon: CheckCircle, color: 'emerald' as const };
    if (category === 'calendar') return { icon: Calendar, color: 'sky' as const };
    if (category === 'athlete') return { icon: Users, color: 'violet' as const };
    if (category === 'decision') return { icon: TrendingUp, color: 'amber' as const };

    // Fallback: type-based
    if (type === 'alert') return { icon: AlertCircle, color: 'red' as const };
    if (type === 'success') return { icon: CheckCircle, color: 'emerald' as const };
    if (type === 'warning') return { icon: TrendingUp, color: 'amber' as const };
    
    return { icon: Info, color: 'sky' as const };
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (notification.unread) {
      markAsRead(notification.id);
    }

    // Navigate if URL provided
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
      onClose();
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    
    return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  };

  // ============================================
  // RENDER
  // ============================================

  const colorClasses = {
    red: "from-red-500 to-red-600",
    emerald: "from-emerald-500 to-emerald-600",
    sky: "from-sky-500 to-sky-600",
    amber: "from-amber-500 to-amber-600",
    violet: "from-violet-500 to-violet-600",
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
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 sm:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h2 className="font-semibold text-slate-900 text-sm">Notificações</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="text-xs text-sky-600 font-medium px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    Marcar todas
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Tudo limpo!</h3>
                  <p className="text-sm text-slate-600">Não tens notificações novas</p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const { icon: Icon, color } = getIconAndColor(notification.type, notification.category);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                        notification.actionUrl ? 'cursor-pointer' : ''
                      } ${notification.unread ? 'bg-sky-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                            {notification.unread && (
                              <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-slate-400">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer - only show if there are notifications */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-center text-slate-500">
                  {notifications.length} notificação{notifications.length !== 1 ? 'ões' : ''} total
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}