import { motion } from 'motion/react';
import { format, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ScheduleProposal, Athlete } from '@/types/scheduling';
import { ProposalCard } from './ProposalCard';

interface ScheduleTimelineProps {
  proposals: ScheduleProposal[];
  viewMode: 'timeline' | 'athlete';
  athletes: Athlete[];
  onPin: (proposalId: string) => void;
  onUnpin: (proposalId: string) => void;
}

export function ScheduleTimeline({
  proposals,
  viewMode,
  athletes,
  onPin,
  onUnpin
}: ScheduleTimelineProps) {
  if (viewMode === 'timeline') {
    return <TimelineView proposals={proposals} onPin={onPin} onUnpin={onUnpin} />;
  }

  return (
    <AthleteView
      proposals={proposals}
      athletes={athletes}
      onPin={onPin}
      onUnpin={onUnpin}
    />
  );
}

/**
 * Timeline View (por dia)
 */
function TimelineView({
  proposals,
  onPin,
  onUnpin
}: {
  proposals: ScheduleProposal[];
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
}) {
  // Agrupar por dia
  const proposalsByDay = new Map<string, ScheduleProposal[]>();

  proposals.forEach(proposal => {
    if (proposal.status === 'skipped') return;

    const dayKey = format(proposal.startAt, 'yyyy-MM-dd');
    if (!proposalsByDay.has(dayKey)) {
      proposalsByDay.set(dayKey, []);
    }
    proposalsByDay.get(dayKey)!.push(proposal);
  });

  // Ordenar dias
  const sortedDays = Array.from(proposalsByDay.keys()).sort();

  if (sortedDays.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <p className="text-slate-500">Nenhuma sessão gerada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDays.map((dayKey, dayIndex) => {
        const dayProposals = proposalsByDay.get(dayKey)!;
        const date = new Date(dayKey);

        // Ordenar por hora
        dayProposals.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

        return (
          <motion.div
            key={dayKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.05 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            {/* Day Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {format(date, "EEEE, d 'de' MMMM", { locale: pt })}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {dayProposals.length} sessão/sessões
                  </p>
                </div>
                <div className="flex gap-1">
                  {dayProposals.filter(p => p.isPinned).length > 0 && (
                    <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-lg">
                      {dayProposals.filter(p => p.isPinned).length} fixada(s)
                    </span>
                  )}
                  {dayProposals.filter(p => p.status === 'conflict').length > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
                      {dayProposals.filter(p => p.status === 'conflict').length} conflito(s)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Proposals */}
            <div className="divide-y divide-slate-100">
              {dayProposals.map((proposal, index) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  index={index}
                  onPin={onPin}
                  onUnpin={onUnpin}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Athlete View (por atleta)
 */
function AthleteView({
  proposals,
  athletes,
  onPin,
  onUnpin
}: {
  proposals: ScheduleProposal[];
  athletes: Athlete[];
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {athletes.map((athlete, athleteIndex) => {
        const athleteProposals = proposals.filter(
          p => p.athleteId === athlete.id && p.status !== 'skipped'
        );

        return (
          <motion.div
            key={athlete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: athleteIndex * 0.05 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            {/* Athlete Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-sky-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold text-sm">
                    {athlete.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{athlete.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {athleteProposals.length} sessão/sessões
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {athleteProposals.filter(p => p.isPinned).length > 0 && (
                    <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-lg">
                      {athleteProposals.filter(p => p.isPinned).length} fixada(s)
                    </span>
                  )}
                  {athleteProposals.filter(p => p.status === 'conflict').length > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
                      {athleteProposals.filter(p => p.status === 'conflict').length} conflito(s)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Proposals */}
            {athleteProposals.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  Nenhuma sessão agendada para este atleta
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {athleteProposals
                  .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
                  .map((proposal, index) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      index={index}
                      onPin={onPin}
                      onUnpin={onUnpin}
                      showAthlete={false}
                    />
                  ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
