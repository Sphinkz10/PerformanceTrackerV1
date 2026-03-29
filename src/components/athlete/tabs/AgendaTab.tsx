import { motion } from 'motion/react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { DrawerType } from '@/types/athlete-profile';

interface AgendaTabProps {
  athleteId: string;
  onOpenDrawer: (drawer: DrawerType, data?: any) => void;
}

export function AgendaTab({ onOpenDrawer }: AgendaTabProps) {
  // Mock agenda
  const upcoming = [
    { id: '1', title: 'Treino Força Superior', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '10:00', duration: 60, location: 'Ginásio' },
    { id: '2', title: 'Avaliação Mensal', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), time: '14:00', duration: 45, location: 'Sala Avaliações' },
    { id: '3', title: 'Treino Cardio', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), time: '16:30', duration: 45, location: 'Exterior' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h3 className="font-bold text-slate-900">Próximas Sessões</h3>

      <div className="space-y-3">
        {upcoming.map((session, index) => (
          <motion.button
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onOpenDrawer('session', session)}
            className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{session.title}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {session.date.toLocaleDateString('pt-PT')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.time} ({session.duration}min)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {session.location}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
