/**
 * NOTIFICATION CENTER
 * Real-time notifications hub for calendar events
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X, Calendar, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';

interface Notification {
  id: string;
  type: 'confirmation' | 'conflict' | 'reminder' | 'update' | 'invite';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  eventId?: string;
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  workspaceId: string;
  userId: string;
}

export function NotificationCenter({ workspaceId, userId }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  
  // Mock notifications (replace with real data from API)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'confirmation',
      title: 'Confirmação Pendente',
      message: 'Sessão de Força - 21 Jan, 10:00',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30min ago
      read: false,
      actionRequired: true,
    },
    {
      id: '2',
      type: 'conflict',
      title: 'Conflito Detectado',
      message: '2 atletas com sobreposição de horário',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1h ago
      read: false,
      actionRequired: true,
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Lembrete',
      message: 'Sessão começa em 1 hora',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2h ago
      read: true,
      actionRequired: false,
    },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle className="h-4 w-4" />;
      case 'conflict':
        return <AlertCircle className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      case 'update':
        return <Calendar className="h-4 w-4" />;
      case 'invite':
        return <Users className="h-4 w-4" />;
    }
  };
  
  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'confirmation':
        return 'text-sky-600 bg-sky-50';
      case 'conflict':
        return 'text-red-600 bg-red-50';
      case 'reminder':
        return 'text-amber-600 bg-amber-50';
      case 'update':
        return 'text-emerald-600 bg-emerald-50';
      case 'invite':
        return 'text-violet-600 bg-violet-50';
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    
    if (minutes < 60) return `Há ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Há ${days}d`;
  };
  
  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
      >
        <Bell className="h-4 w-4" />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold flex items-center justify-center shadow-lg"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>
      
      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-[600px] rounded-xl bg-white border border-slate-200 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Notificações
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      Marcar todas lidas
                    </button>
                  )}
                </div>
                
                {/* Filter tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      filter === 'all'
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      filter === 'unread'
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Não Lidas ({unreadCount})
                  </button>
                </div>
              </div>
              
              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Sem notificações
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tudo em dia! 🎉
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg transition-all ${
                          notification.read
                            ? 'bg-white hover:bg-slate-50'
                            : 'bg-sky-50/50 hover:bg-sky-50 border border-sky-100'
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${getColor(notification.type)}`}>
                            {getIcon(notification.type)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-semibold ${
                                notification.read ? 'text-slate-700' : 'text-slate-900'
                              }`}>
                                {notification.title}
                              </h4>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            
                            <p className="text-xs text-slate-600 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
                                >
                                  <Check className="h-3 w-3" />
                                  Marcar lida
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      // Navigate to full notifications page
                      setIsOpen(false);
                    }}
                    className="w-full py-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Ver todas as notificações
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
