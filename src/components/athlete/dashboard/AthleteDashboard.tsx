/**
 * Athlete Dashboard - Main Dashboard for Athletes
 * 
 * Features:
 * - Welcome section with personalized greeting
 * - Upcoming workouts list
 * - Quick actions (4 buttons)
 * - Week stats (4 stat cards)
 * - Recent activity feed
 * - PHASE 4: Export reports button, View history link
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Dashboard + Phase 4
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  XCircle,
  Clock,
  CalendarX,
  CheckCircle,
  Activity,
  TrendingUp,
  Dumbbell,
  Calendar,
  Send,
  Download,
  History,
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface AthleteDashboardProps {
  onReportPain: () => void;
  onCancelWorkout: () => void;
  onRequestChange: () => void;
  onMarkUnavailable: () => void;
  onExportReports?: () => void;
  onViewHistory?: () => void;
  onViewWorkout?: (workout: any) => void;
}

export function AthleteDashboard({
  onReportPain,
  onCancelWorkout,
  onRequestChange,
  onMarkUnavailable,
  onExportReports,
  onViewHistory,
  onViewWorkout,
}: AthleteDashboardProps) {
  const { user } = useApp();

  // Mock data - In production, this would come from API
  const upcomingWorkouts = [
    {
      id: '1',
      date: 'Hoje',
      time: '18:00',
      title: 'Upper Body Strength',
      coach: 'João Silva',
      isToday: true,
    },
    {
      id: '2',
      date: 'Amanhã',
      time: '10:00',
      title: 'Lower Body + Core',
      coach: 'João Silva',
      isToday: false,
    },
    {
      id: '3',
      date: '15 Fev',
      time: '18:00',
      title: 'Full Body Strength',
      coach: 'João Silva',
      isToday: false,
    },
  ];

  const weekStats = {
    workoutsCompleted: 4,
    totalVolume: '12,450',
    newPRs: 2,
    totalTime: '4h 35min',
  };

  const recentActivities = [
    {
      id: '1',
      type: 'workout',
      title: 'Completou Upper Body A',
      time: 'Hoje às 18:00',
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      id: '2',
      type: 'form',
      title: 'Respondeu "Bem-estar Semanal"',
      time: 'Há 2 horas',
      icon: CheckCircle,
      color: 'sky',
    },
    {
      id: '3',
      type: 'pain',
      title: 'Reportou dor no ombro direito',
      time: 'Ontem às 14:30',
      icon: AlertCircle,
      color: 'red',
    },
    {
      id: '4',
      type: 'workout',
      title: 'Completou Lower Body B',
      time: 'Ontem às 10:00',
      icon: CheckCircle,
      color: 'emerald',
    },
  ];

  const quickActions = [
    {
      id: 'pain',
      title: 'Reportar Dor',
      description: 'Lesão ou desconforto',
      icon: AlertCircle,
      color: 'red',
      onClick: onReportPain,
    },
    {
      id: 'cancel',
      title: 'Cancelar',
      description: 'Cancelar treino',
      icon: XCircle,
      color: 'amber',
      onClick: onCancelWorkout,
    },
    {
      id: 'change',
      title: 'Mudar Hora',
      description: 'Pedir alteração',
      icon: Clock,
      color: 'violet',
      onClick: onRequestChange,
    },
    {
      id: 'unavailable',
      title: 'Indisponível',
      description: 'Marcar férias/viagem',
      icon: CalendarX,
      color: 'sky',
      onClick: onMarkUnavailable,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-3xl">
            👋
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Olá, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-sm text-slate-600">
              Bem-vindo de volta. Tens {upcomingWorkouts.length} treinos agendados esta semana.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Workouts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">📅 Próximos Treinos</h2>
          <button className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors">
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {upcomingWorkouts.map((workout, idx) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workout.isToday
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {workout.date}
                    </span>
                    <span className="text-sm text-slate-600">{workout.time}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 mb-1">{workout.title}</h3>
                  <p className="text-sm text-slate-600">Coach: {workout.coach}</p>
                </div>

                {/* Right: Actions */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewWorkout?.(workout)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  Ver Treino
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">⚡ Ações Rápidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`p-4 rounded-xl border-2 border-${action.color}-200 bg-gradient-to-br from-${action.color}-50 to-white hover:border-${action.color}-400 hover:shadow-xl transition-all group`}
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{action.title}</h4>
                <p className="text-xs text-slate-600">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Week Stats */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">📊 Esta Semana</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Treinos Completados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Treinos</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{weekStats.workoutsCompleted}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Completados</p>
          </motion.div>

          {/* Volume Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Volume</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{weekStats.totalVolume}kg</p>
            <p className="text-xs text-sky-600 font-medium mt-1">+12% vs semana passada</p>
          </motion.div>

          {/* Novos PRs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Novos PRs</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{weekStats.newPRs}</p>
            <p className="text-xs text-violet-600 font-medium mt-1">Parabéns! 🎉</p>
          </motion.div>

          {/* Tempo Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-slate-500">Tempo</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{weekStats.totalTime}</p>
            <p className="text-xs text-amber-600 font-medium mt-1">De treino ativo</p>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <h3 className="font-bold text-slate-900 mb-4">🕐 Últimas Atividades</h3>

        <div className="space-y-3">
          {recentActivities.map((activity, idx) => {
            const Icon = activity.icon;
            const colorMap = {
              emerald: 'bg-emerald-100',
              sky: 'bg-sky-100',
              red: 'bg-red-100',
              amber: 'bg-amber-100',
            };

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    colorMap[activity.color as keyof typeof colorMap]
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-600">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* PHASE 4: Export reports button, View history link */}
      <div className="space-y-3">
        <button
          onClick={onExportReports}
          className="p-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400 hover:shadow-xl transition-all group"
        >
          <div
            className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto"
          >
            <Download className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Exportar Relatórios</h4>
          <p className="text-xs text-slate-600">Baixe seus dados de treino</p>
        </button>

        <a
          href="#"
          onClick={onViewHistory}
          className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
        >
          Ver Histórico
        </a>
      </div>
    </div>
  );
}