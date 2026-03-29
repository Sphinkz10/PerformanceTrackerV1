/**
 * Notifications Drawer - View all notifications
 * 
 * Features:
 * - Slide-in drawer from right
 * - Filter: All, Unread, Workouts, Messages
 * - Mark as read/unread
 * - Clear all
 * - Icons by type
 * - Time ago formatting
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Phase 4
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  CheckCircle,
  MessageCircle,
  Calendar,
  AlertCircle,
  Trophy,
  Check,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'workout' | 'message' | 'achievement' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

type NotificationFilter = 'all' | 'unread' | 'workouts' | 'messages';

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Treino Agendado',
      description: 'Upper Body Strength amanhã às 10:00',
      timestamp: 'Há 5 minutos',
      isRead: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'Nova mensagem do Coach',
      description: 'João Silva: "Excelente progresso esta semana! 💪"',
      timestamp: 'Há 1 hora',
      isRead: false,
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Novo Record Pessoal! 🎉',
      description: 'Agachamento: 120kg (anterior: 110kg)',
      timestamp: 'Há 2 horas',
      isRead: true,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Lembrete: Responder Formulário',
      description: 'Bem-estar Semanal pendente',
      timestamp: 'Há 5 horas',
      isRead: true,
    },
    {
      id: '5',
      type: 'workout',
      title: 'Treino Completado',
      description: 'Lower Body B - 1h 15min',
      timestamp: 'Ontem',
      isRead: true,
    },
  ]);

  const filters = [
    { id: 'all' as NotificationFilter, label: 'Todas', icon: Bell },
    { id: 'unread' as NotificationFilter, label: 'Não Lidas', icon: AlertCircle },
    { id: 'workouts' as NotificationFilter, label: 'Treinos', icon: Calendar },
    { id: 'messages' as NotificationFilter, label: 'Mensagens', icon: MessageCircle },
  ];

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'workouts':
        return notifications.filter((n) => n.type === 'workout');
      case 'messages':
        return notifications.filter((n) => n.type === 'message');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'workout':
        return Calendar;
      case 'message':
        return MessageCircle;
      case 'achievement':
        return Trophy;
      case 'alert':
        return AlertCircle;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'workout':
        return 'sky';
      case 'message':
        return 'emerald';
      case 'achievement':
        return 'violet';
      case 'alert':
        return 'amber';
    }
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Todas as notificações marcadas como lidas');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('Todas as notificações removidas');
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Notificações</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-slate-600">
                      {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((f) => {
                  const Icon = f.icon;
                  const isActive = filter === f.id;

                  return (
                    <motion.button
                      key={f.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter(f.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {f.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">Nenhuma notificação</p>
                  <p className="text-sm text-slate-600">
                    {filter === 'all'
                      ? 'Estás em dia!'
                      : `Nenhuma notificação em "${
                          filters.find((f) => f.id === filter)?.label
                        }"`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredNotifications.map((notification, idx) => {
                    const Icon = getNotificationIcon(notification.type);
                    const color = getNotificationColor(notification.type);

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 hover:bg-slate-50 transition-colors ${
                          !notification.isRead ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`h-10 w-10 rounded-full bg-${color}-100 flex items-center justify-center shrink-0`}
                          >
                            <Icon className={`h-5 w-5 text-${color}-600`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {notification.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-500">{notification.timestamp}</p>
                              <button
                                onClick={() => handleToggleRead(notification.id)}
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                              >
                                {notification.isRead ? 'Marcar não lida' : 'Marcar lida'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="h-4 w-4" />
                    Marcar Todas Lidas
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearAll}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
