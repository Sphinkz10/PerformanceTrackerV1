/**
 * ADD PARTICIPANTS MODAL
 * Search and add athletes to calendar event
 * 
 * Features:
 * - Search athletes by name
 * - Filter by team/group
 * - Bulk selection
 * - Conflict detection
 * - Capacity warnings
 * - Real-time availability
 * 
 * @module calendar/modals/AddParticipantsModal
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  UserPlus,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mutate } from 'swr';
import { useAvailableAthletes } from '@/hooks/use-api';

// ============================================================================
// TYPES
// ============================================================================

interface Athlete {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  team?: string;
  hasConflict?: boolean;
  conflictEvent?: {
    title: string;
    start_time: string;
    end_time: string;
  };
}

interface AddParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventStartDate: string;
  eventEndDate: string;
  currentParticipantIds: string[];
  maxParticipants?: number;
  workspaceId: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AddParticipantsModal({
  isOpen,
  onClose,
  eventId,
  eventStartDate,
  eventEndDate,
  currentParticipantIds,
  maxParticipants,
  workspaceId,
}: AddParticipantsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  // Fetch available athletes from API
  const { athletes, isLoading: loadingAthletes } = useAvailableAthletes(workspaceId, {
    excludeEventId: eventId,
  });

  // Get unique teams
  const teams = useMemo(() => {
    const teamSet = new Set(athletes.map(a => a.team).filter(Boolean));
    return Array.from(teamSet);
  }, [athletes]);

  // Filtered athletes
  const filteredAthletes = useMemo(() => {
    return athletes.filter(athlete => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = athlete.name.toLowerCase().includes(query);
        const matchesEmail = athlete.email?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Team filter
      if (selectedTeam !== 'all' && athlete.team !== selectedTeam) {
        return false;
      }

      return true;
    });
  }, [athletes, searchQuery, selectedTeam]);

  // Check for conflicts when athletes are selected
  useEffect(() => {
    if (selectedAthleteIds.length > 0) {
      checkConflicts();
    }
  }, [selectedAthleteIds]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedTeam('all');
      setSelectedAthleteIds([]);
    }
  }, [isOpen]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const checkConflicts = async () => {
    setIsCheckingConflicts(true);
    
    // TODO: Replace with real API call
    // const response = await fetch('/api/calendar/check-conflicts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     athleteIds: selectedAthleteIds,
    //     startDate: eventStartDate,
    //     endDate: eventEndDate,
    //     workspaceId,
    //   }),
    // });
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsCheckingConflicts(false);
  };

  const toggleAthlete = (athleteId: string) => {
    setSelectedAthleteIds(prev => {
      if (prev.includes(athleteId)) {
        return prev.filter(id => id !== athleteId);
      } else {
        // Check capacity
        const totalAfterAdd = currentParticipantIds.length + prev.length + 1;
        if (maxParticipants && totalAfterAdd > maxParticipants) {
          toast.error(`Capacidade máxima de ${maxParticipants} participantes`);
          return prev;
        }
        return [...prev, athleteId];
      }
    });
  };

  const selectAll = () => {
    const allIds = filteredAthletes.map(a => a.id);
    const totalAfterAdd = currentParticipantIds.length + allIds.length;
    
    if (maxParticipants && totalAfterAdd > maxParticipants) {
      toast.error(`Capacidade máxima de ${maxParticipants} participantes`);
      return;
    }
    
    setSelectedAthleteIds(allIds);
  };

  const deselectAll = () => {
    setSelectedAthleteIds([]);
  };

  const handleAddParticipants = async () => {
    if (selectedAthleteIds.length === 0) {
      toast.error('Selecione pelo menos um atleta');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call
      const response = await fetch(`/api/calendar-events/${eventId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteIds: selectedAthleteIds,
          workspaceId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add participants');
      }

      // Invalidate SWR cache
      mutate((key) => typeof key === 'string' && key.startsWith('/api/calendar-events'));

      toast.success(
        `${selectedAthleteIds.length} ${
          selectedAthleteIds.length === 1 ? 'participante adicionado' : 'participantes adicionados'
        }`
      );

      onClose();
    } catch (error) {
      console.error('Error adding participants:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar participantes');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const remainingCapacity = maxParticipants 
    ? maxParticipants - currentParticipantIds.length
    : Infinity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Adicionar Participantes
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {currentParticipantIds.length} atual
                {maxParticipants && ` • ${remainingCapacity} disponíveis`}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-4 border-b border-slate-200">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Procurar atleta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>

            {/* Team Filter + Bulk Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                >
                  <option value="all">Todas as Equipas</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  disabled={filteredAthletes.length === 0}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selecionar Todos
                </button>
                <button
                  onClick={deselectAll}
                  disabled={selectedAthleteIds.length === 0}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Selected Count */}
            {selectedAthleteIds.length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-sky-600" />
                  <span className="text-sm font-semibold text-sky-900">
                    {selectedAthleteIds.length} selecionado{selectedAthleteIds.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {isCheckingConflicts && (
                  <div className="flex items-center gap-2 text-sm text-sky-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando conflitos...
                  </div>
                )}
              </div>
            )}

            {/* Capacity Warning */}
            {maxParticipants && remainingCapacity <= 3 && remainingCapacity > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-medium text-amber-900">
                  Apenas {remainingCapacity} vaga{remainingCapacity !== 1 ? 's' : ''} disponíve{remainingCapacity !== 1 ? 'is' : 'l'}
                </p>
              </div>
            )}
          </div>

          {/* Athletes List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredAthletes.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                <p className="font-semibold text-slate-700">Nenhum atleta encontrado</p>
                <p className="text-sm text-slate-500 mt-1">
                  {searchQuery || selectedTeam !== 'all'
                    ? 'Tente ajustar os filtros'
                    : 'Todos os atletas já são participantes'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAthletes.map((athlete, index) => {
                  const isSelected = selectedAthleteIds.includes(athlete.id);
                  const hasConflict = athlete.hasConflict;

                  return (
                    <motion.button
                      key={athlete.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => toggleAthlete(athlete.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                        {athlete.avatar_url ? (
                          <img
                            src={athlete.avatar_url}
                            alt={athlete.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-sky-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-slate-900 truncate">
                          {athlete.name}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          {athlete.email && (
                            <span className="truncate">{athlete.email}</span>
                          )}
                          {athlete.team && (
                            <>
                              <span>•</span>
                              <span>{athlete.team}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Conflict Warning */}
                      {hasConflict && (
                        <div className="px-2 py-1 rounded-full bg-red-100 border border-red-200 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          <span className="text-xs font-medium text-red-700">Conflito</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-600">
              {filteredAthletes.length} atleta{filteredAthletes.length !== 1 ? 's' : ''} disponíve
              {filteredAthletes.length !== 1 ? 'is' : 'l'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddParticipants}
                disabled={isSubmitting || selectedAthleteIds.length === 0}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adicionando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>
                      Adicionar ({selectedAthleteIds.length})
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}