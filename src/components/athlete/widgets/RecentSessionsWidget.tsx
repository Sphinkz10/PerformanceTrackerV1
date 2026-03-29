import { motion } from 'motion/react';
import { X, Calendar, Clock, TrendingUp, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { WidgetConfig } from '@/types/athlete-profile';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface RecentSessionsWidgetProps {
  config: WidgetConfig;
  isConfiguring: boolean;
  onRemove: () => void;
}

export function RecentSessionsWidget({ config, isConfiguring, onRemove }: RecentSessionsWidgetProps) {
  // Mock sessions
  const sessions = [
    {
      id: '1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: 'Força Superior',
      duration: 65,
      status: 'completed' as const,
      load: 1250,
      rpe: 7.5
    },
    {
      id: '2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'Cardio HIIT',
      duration: 45,
      status: 'completed' as const,
      load: 850,
      rpe: 8.0
    },
    {
      id: '3',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'Mobilidade',
      duration: 30,
      status: 'completed' as const,
      load: 400,
      rpe: 4.0
    },
    {
      id: '4',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'Força Inferior',
      duration: 70,
      status: 'cancelled' as const,
      load: 0,
      rpe: 0
    },
    {
      id: '5',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      type: 'Técnica',
      duration: 50,
      status: 'completed' as const,
      load: 650,
      rpe: 6.0
    }
  ];

  const statusConfig = {
    completed: { icon: CheckCircle, color: 'emerald', label: 'Completa' },
    cancelled: { icon: XCircle, color: 'red', label: 'Cancelada' },
    scheduled: { icon: Calendar, color: 'sky', label: 'Agendada' }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="h-full relative rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {isConfiguring && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">
          {config.title || 'Sessões Recentes'}
        </h3>
        <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full">
          {sessions.length}
        </span>
      </div>

      {/* Sessions List */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100%-60px)]">
        {sessions.map((session, index) => {
          const StatusIcon = statusConfig[session.status].icon;
          const statusColor = statusConfig[session.status].color;

          return (
            <motion.button
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {/* Status Icon */}
              <div className={`flex-shrink-0 p-2 rounded-lg bg-${statusColor}-100`}>
                <StatusIcon className={`w-4 h-4 text-${statusColor}-600`} />
              </div>

              {/* Info */}
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {session.type}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(session.date, 'd MMM', { locale: pt })}
                  </span>
                  {session.status === 'completed' && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.duration}min
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {session.load} AU
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* RPE Badge */}
              {session.status === 'completed' && (
                <div className="flex-shrink-0 px-2 py-1 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-medium text-slate-600">
                    RPE
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {session.rpe}
                  </p>
                </div>
              )}

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
