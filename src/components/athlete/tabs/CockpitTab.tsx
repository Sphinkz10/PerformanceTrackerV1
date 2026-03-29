import { motion } from 'motion/react';
import { TrendingUp, Calendar, Trophy, AlertCircle, Target, Zap } from 'lucide-react';
import { DrawerType } from '@/types/athlete-profile';

interface CockpitTabProps {
  athleteId: string;
  onOpenDrawer: (drawer: DrawerType, data?: any) => void;
}

export function CockpitTab({ athleteId, onOpenDrawer }: CockpitTabProps) {
  // Mock cockpit data (resumo executivo)
  const cockpit = {
    quickStats: [
      { label: 'Próxima Sessão', value: 'Amanhã 10h', icon: Calendar, color: 'sky' },
      { label: 'Streak Atual', value: '4 semanas', icon: TrendingUp, color: 'emerald' },
      { label: 'Último Recorde', value: 'Há 3 dias', icon: Trophy, color: 'amber' },
      { label: 'Prontidão', value: '85%', icon: Zap, color: 'violet' }
    ],
    alerts: [
      {
        type: 'info',
        title: 'Avaliação Mensal Agendada',
        description: 'Próxima sexta-feira às 14h',
        icon: Calendar,
        color: 'sky'
      },
      {
        type: 'success',
        title: 'Novo Recorde Pessoal!',
        description: 'Back Squat 1RM: 150kg (+5%)',
        icon: Trophy,
        color: 'emerald'
      }
    ],
    goals: [
      { name: 'Atingir 160kg no Squat', progress: 93.75, target: '160kg', current: '150kg' },
      { name: 'Reduzir % Gordura para 10%', progress: 80, target: '10%', current: '12.5%' },
      { name: '3 sessões por semana', progress: 100, target: '12/mês', current: '12/mês' }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Quick Stats */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Resumo Rápido</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cockpit.quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 border-${stat.color}-200 bg-gradient-to-br from-${stat.color}-50 to-white`}
              >
                <div className={`inline-flex p-2 rounded-lg bg-${stat.color}-500 mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Alertas & Notificações</h3>
        <div className="space-y-3">
          {cockpit.alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 rounded-xl border-2 border-${alert.color}-200 bg-gradient-to-r from-${alert.color}-50 to-white`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-${alert.color}-500 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 mb-1">
                      {alert.title}
                    </p>
                    <p className="text-sm text-slate-600">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Goals Progress */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Objetivos Ativos</h3>
        <div className="space-y-3">
          {cockpit.goals.map((goal, index) => (
            <motion.div
              key={goal.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-xl border-2 border-slate-200 bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-violet-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {goal.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Atual: <span className="font-semibold text-slate-700">{goal.current}</span>
                      {' '}/{' '}
                      Meta: <span className="font-semibold text-violet-600">{goal.target}</span>
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  goal.progress >= 90 ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {goal.progress.toFixed(0)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${
                    goal.progress >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-r from-violet-500 to-violet-600'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenDrawer('session')}
            className="p-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400 hover:shadow-lg transition-all text-left"
          >
            <Calendar className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="font-semibold text-slate-900 text-sm">
              Nova Sessão
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenDrawer('report')}
            className="p-4 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400 hover:shadow-lg transition-all text-left"
          >
            <TrendingUp className="w-6 h-6 text-violet-600 mb-2" />
            <p className="font-semibold text-slate-900 text-sm">
              Gerar Relatório
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenDrawer('edit_physical')}
            className="p-4 rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:border-sky-400 hover:shadow-lg transition-all text-left"
          >
            <AlertCircle className="w-6 h-6 text-sky-600 mb-2" />
            <p className="font-semibold text-slate-900 text-sm">
              Atualizar Dados
            </p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
