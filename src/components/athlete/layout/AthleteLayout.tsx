/**
 * Athlete Layout - Navigation & Structure
 * 
 * Features:
 * - Simplified navbar (3 tabs: Minha Área, Perfil, Lab)
 * - Header with logout
 * - Bottom nav for mobile
 * - Responsive design
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Dashboard
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Home, User, MessageCircle, Calendar, LogOut, Bell, Menu } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface AthleteLayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'profile' | 'chat' | 'calendar' | 'history' | 'wearables';
  onNavigate: (page: 'dashboard' | 'profile' | 'chat' | 'calendar' | 'history' | 'wearables') => void;
  onNotificationsClick?: () => void;
}

export function AthleteLayout({ children, currentPage, onNavigate, onNotificationsClick }: AthleteLayoutProps) {
  const { user, logout } = useApp();

  const navItems = [
    { id: 'dashboard' as const, label: 'Minha Área', icon: Home },
    { id: 'profile' as const, label: 'Perfil', icon: User },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'calendar' as const, label: 'Calendário', icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Sessão terminada. Até breve! 👋');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40">
        <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-lg">💪</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900">PerformTrack</h1>
              <p className="text-xs text-slate-600">Atleta</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications (future) */}
            <button
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 transition-colors relative"
              onClick={onNotificationsClick}
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
            </button>

            {/* Avatar & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600">Atleta</p>
              </div>
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=athlete'}
                alt={user?.name}
                className="h-10 w-10 rounded-full border-2 border-emerald-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-6 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 pb-safe">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 active:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}