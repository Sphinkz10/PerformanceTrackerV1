import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Conflict, ScheduleProposal } from '@/types/scheduling';

interface ConflictResolverProps {
  conflicts: Conflict[];
  proposals: ScheduleProposal[];
  onResolve: (resolvedProposals: ScheduleProposal[]) => void;
}

export function ConflictResolver({ conflicts, proposals, onResolve }: ConflictResolverProps) {
  /**
   * Skip conflicted proposals
   */
  const handleSkipAll = () => {
    const resolved = proposals.map(p => {
      const hasConflict = conflicts.some(c => c.proposalIds.includes(p.id));
      return hasConflict ? { ...p, status: 'skipped' as const } : p;
    });
    onResolve(resolved);
  };

  /**
   * Keep only first proposal per conflict group
   */
  const handleKeepFirst = () => {
    const conflictGroups = new Map<string, string[]>();
    
    conflicts.forEach(conflict => {
      conflict.proposalIds.forEach(pId => {
        if (!conflictGroups.has(conflict.id)) {
          conflictGroups.set(conflict.id, []);
        }
        conflictGroups.get(conflict.id)!.push(pId);
      });
    });

    const resolved = proposals.map(p => {
      // Check if this proposal is in a conflict
      for (const [conflictId, proposalIds] of conflictGroups) {
        if (proposalIds.includes(p.id)) {
          // Keep first, skip rest
          return proposalIds[0] === p.id
            ? { ...p, status: 'proposed' as const }
            : { ...p, status: 'skipped' as const };
        }
      }
      return p;
    });

    onResolve(resolved);
  };

  /**
   * Try alternative slots (mock - in real app would regenerate)
   */
  const handleFindAlternatives = () => {
    // Mock: marca como "resolved"
    const resolved = proposals.map(p => ({
      ...p,
      status: p.status === 'conflict' ? ('proposed' as const) : p.status
    }));
    onResolve(resolved);
  };

  if (conflicts.length === 0) {
    return null;
  }

  // Agrupar conflitos por severidade
  const criticalConflicts = conflicts.filter(c => c.severity >= 8);
  const warningConflicts = conflicts.filter(c => c.severity >= 5 && c.severity < 8);
  const minorConflicts = conflicts.filter(c => c.severity < 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-red-200 bg-red-50 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-red-100 border-b border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-900">
              Resolver Conflitos ({conflicts.length})
            </h3>
          </div>
          <div className="flex gap-1">
            {criticalConflicts.length > 0 && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg">
                {criticalConflicts.length} crítico(s)
              </span>
            )}
            {warningConflicts.length > 0 && (
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-lg">
                {warningConflicts.length} moderado(s)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {conflicts.map((conflict, index) => (
          <motion.div
            key={conflict.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border-2 ${
              conflict.severity >= 8
                ? 'border-red-300 bg-red-100'
                : conflict.severity >= 5
                ? 'border-amber-300 bg-amber-100'
                : 'border-yellow-300 bg-yellow-100'
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle
                className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  conflict.severity >= 8
                    ? 'text-red-600'
                    : conflict.severity >= 5
                    ? 'text-amber-600'
                    : 'text-yellow-600'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {conflict.description}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Afeta {conflict.athleteIds.length} atleta(s) • Severidade: {conflict.severity}/10
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-white border-t border-red-200">
        <p className="text-xs text-slate-600 mb-3">
          Escolhe como resolver os conflitos:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Skip All */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSkipAll}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 transition-all"
          >
            <XCircle className="w-4 h-4" />
            Saltar Todos
          </motion.button>

          {/* Keep First */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleKeepFirst}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 border-amber-200 bg-white text-amber-700 hover:bg-amber-50 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Manter Primeiro
          </motion.button>

          {/* Find Alternatives */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFindAlternatives}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            Tentar Alternativas
          </motion.button>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-500 mt-3 p-2 bg-slate-50 rounded-lg">
          💡 <strong>Dica:</strong> "Manter Primeiro" resolve automaticamente mantendo a primeira sessão de cada grupo de conflito.
        </p>
      </div>
    </motion.div>
  );
}
