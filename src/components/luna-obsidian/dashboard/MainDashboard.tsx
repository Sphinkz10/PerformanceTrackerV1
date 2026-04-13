import React, { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { SessionWithAthlete } from '../../../types/database.v2';

export function MainDashboard() {
  const [sessions, setSessions] = useState<SessionWithAthlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would use the Supabase client:
    // const { data } = await supabase.from('scheduled_sessions').select('*, athletes_profiles(*)').eq('status', 'scheduled')

    // For now, we mock the data to demonstrate the UI
    const mockSessions: SessionWithAthlete[] = [
      {
        id: '1',
        workspace_id: 'ws-1',
        athlete_id: 'ath-1',
        coach_id: 'coach-1',
        scheduled_at: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        status: 'scheduled',
        athlete: {
          first_name: 'João',
          last_name: 'Félix',
        }
      },
      {
        id: '2',
        workspace_id: 'ws-1',
        athlete_id: 'ath-2',
        coach_id: 'coach-1',
        scheduled_at: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
        status: 'scheduled',
        athlete: {
          first_name: 'Bernardo',
          last_name: 'Silva',
        }
      }
    ];

    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Sessões de Hoje</h1>
        <div className="text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
          {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 overflow-hidden flex flex-col shadow-2xl">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Sem sessões agendadas para hoje.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 hover:bg-zinc-800/80 hover:border-zinc-600 transition-all duration-300"
              >
                {/* Time Indicator */}
                <div className="flex flex-col items-center justify-center w-16 shrink-0 border-r border-zinc-700/50 pr-4">
                  <span className="text-lg font-medium text-zinc-200">
                    {new Date(session.scheduled_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Athlete Info */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-medium">
                    {session.athlete.first_name[0]}{session.athlete.last_name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-zinc-100">
                      {session.athlete.first_name} {session.athlete.last_name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Treino de Força
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold rounded-lg transition-colors text-sm shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <Play className="w-4 h-4" />
                    INICIAR
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-lg transition-colors text-sm border border-zinc-700 hover:border-red-500/30">
                    <X className="w-4 h-4" />
                    CANCELAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
