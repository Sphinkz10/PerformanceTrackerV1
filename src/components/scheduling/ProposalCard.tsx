import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Pin, Clock, MapPin, AlertTriangle, Star } from 'lucide-react';
import { ScheduleProposal } from '@/types/scheduling';

interface ProposalCardProps {
  proposal: ScheduleProposal;
  index: number;
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  showAthlete?: boolean;
  compact?: boolean;
}

export function ProposalCard({
  proposal,
  index,
  onPin,
  onUnpin,
  showAthlete = true,
  compact = false
}: ProposalCardProps) {
  const handlePinToggle = () => {
    if (proposal.isPinned) {
      onUnpin(proposal.id);
    } else {
      onPin(proposal.id);
    }
  };

  // Score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100';
    if (score >= 60) return 'text-sky-600 bg-sky-100';
    if (score >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  // Status badge
  const getStatusBadge = () => {
    if (proposal.isPinned) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-lg">
          <Pin className="w-3 h-3" />
          Fixada
        </span>
      );
    }

    if (proposal.status === 'conflict') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
          <AlertTriangle className="w-3 h-3" />
          Conflito
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg">
        ✓ Disponível
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`p-4 hover:bg-slate-50 transition-all ${
        proposal.isPinned ? 'bg-violet-50/50' : 'bg-white'
      } ${proposal.status === 'conflict' ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Time */}
        <div className="flex-shrink-0">
          <div
            className={`px-3 py-2 rounded-lg text-center ${
              proposal.isPinned
                ? 'bg-violet-500 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <p className="text-xs font-medium">
              {format(proposal.startAt, 'HH:mm')}
            </p>
            <p className="text-xs opacity-75">
              {format(proposal.endAt, 'HH:mm')}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Athlete Name */}
          {showAthlete && (
            <p className="font-semibold text-slate-900 mb-1">
              {proposal.athleteName}
            </p>
          )}

          {/* Details */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.round((proposal.endAt.getTime() - proposal.startAt.getTime()) / 60000)}min
            </span>

            {proposal.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {proposal.location}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Score: {proposal.score}/100
            </span>
          </div>

          {/* Conflict reason */}
          {proposal.conflict && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800">
                <span className="font-semibold">Conflito:</span> {proposal.conflict.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2">
          {/* Status Badge */}
          {getStatusBadge()}

          {/* Pin Button */}
          {proposal.status !== 'conflict' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePinToggle}
              className={`p-2 rounded-lg transition-all ${
                proposal.isPinned
                  ? 'bg-violet-500 text-white hover:bg-violet-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={proposal.isPinned ? 'Desafixar' : 'Fixar sessão'}
            >
              <Pin className="w-4 h-4" />
            </motion.button>
          )}

          {/* Score Badge */}
          {!compact && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-lg ${getScoreColor(
                proposal.score
              )}`}
            >
              {proposal.score}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
