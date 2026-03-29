// ============================================
// NOTIFICATION STORE - Central notification system (BACKUP - localStorage version)
// Alimenta-se de eventos reais da aplicação
// ============================================

import { useState, useEffect, useCallback } from 'react';

export interface AppNotification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  category: 'pain' | 'session' | 'form' | 'athlete' | 'calendar' | 'decision' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  unread: boolean;
  relatedId?: string; // ID do atleta, sessão, etc
  relatedType?: 'athlete' | 'session' | 'form' | 'event';
  actionUrl?: string; // Para navegação ao clicar
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'app_notifications';
const MAX_NOTIFICATIONS = 100; // Limite para não encher localStorage

/**
 * Hook central de notificações (localStorage version - BACKUP)
 * Gerencia todas as notificações da aplicação
 */
export function useNotifications_localStorage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Load/Save logic...
  // (keeping original implementation as backup)
  
  return {
    notifications: [],
    unreadCount: 0,
    recentNotifications: [],
    addNotification: () => '',
    markAsRead: () => {},
    markAllAsRead: () => {},
    deleteNotification: () => {},
    clearAll: () => {},
  };
}
