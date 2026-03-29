/**
 * ATHLETE SELECTOR
 * Multi-select component for choosing event participants
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, X, Check, AlertCircle, UserPlus } from 'lucide-react';

export interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  status?: 'available' | 'busy' | 'unavailable';
  recovery_level?: number; // 0-100
}

interface AthleteSelectorProps {
  athletes: Athlete[];
  selectedAthletes: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  maxParticipants?: number;
  showAvailability?: boolean;
  eventDate?: Date;
  eventDuration?: number;
  disabled?: boolean;
}

export function AthleteSelector({
  athletes,
  selectedAthletes,
  onSelectionChange,
  maxParticipants,
  showAvailability = true,
  eventDate,
  eventDuration,
  disabled = false,
}: AthleteSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Ensure selectedAthletes is always an array
  const safeSelectedAthletes = selectedAthletes || [];

  // Filter athletes by search
  const filteredAthletes = useMemo(() => {
    if (!searchQuery) return athletes;
    
    const query = searchQuery.toLowerCase();
    return athletes.filter(athlete => 
      athlete.name.toLowerCase().includes(query) ||
      athlete.email?.toLowerCase().includes(query)
    );
  }, [athletes, searchQuery]);

  // Get selected athlete objects
  const selectedAthleteObjects = useMemo(() => {
    return athletes.filter(a => safeSelectedAthletes.includes(a.id));
  }, [athletes, safeSelectedAthletes]);

  // Check if limit reached
  const isLimitReached = maxParticipants ? safeSelectedAthletes.length >= maxParticipants : false;

  const toggleAthlete = (athleteId: string) => {
    if (disabled) return;

    if (safeSelectedAthletes.includes(athleteId)) {
      // Remove
      onSelectionChange(safeSelectedAthletes.filter(id => id !== athleteId));
    } else {
      // Add (check limit)
      if (isLimitReached) return;
      onSelectionChange([...safeSelectedAthletes, athleteId]);
    }
  };

  const removeAthlete = (athleteId: string) => {
    if (disabled) return;
    onSelectionChange(safeSelectedAthletes.filter(id => id !== athleteId));
  };

  const clearAll = () => {
    if (disabled) return;
    onSelectionChange([]);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'busy':
        return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
      case 'unavailable':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  const getRecoveryColor = (level?: number) => {
    if (!level) return 'bg-slate-200';
    if (level >= 80) return 'bg-emerald-500';
    if (level >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      {/* Selected Athletes Pills */}
      {selectedAthleteObjects.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Participantes Selecionados ({safeSelectedAthletes.length}
              {maxParticipants ? `/${maxParticipants}` : ''})
            </label>
            <button
              onClick={clearAll}
              disabled={disabled}
              className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpar todos
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedAthleteObjects.map((athlete) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl bg-sky-50 border border-sky-200 hover:border-sky-300 transition-colors"
              >
                {/* Avatar */}
                <div className="relative">
                  {athlete.avatar ? (
                    <img
                      src={athlete.avatar}
                      alt={athlete.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {athlete.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Recovery indicator */}
                  {showAvailability && athlete.recovery_level !== undefined && (
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getRecoveryColor(athlete.recovery_level)}`}
                      title={`Recovery: ${athlete.recovery_level}%`}
                    />
                  )}
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-slate-900">
                  {athlete.name}
                </span>

                {/* Remove button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeAthlete(athlete.id)}
                  disabled={disabled}
                  className="h-5 w-5 rounded-full bg-sky-200 hover:bg-sky-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-3 w-3 text-sky-700" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Limit Warning */}
      {isLimitReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200"
        >
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Limite de {maxParticipants} participantes atingido
          </p>
        </motion.div>
      )}

      {/* Search & Select */}
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="h-4 w-4 text-slate-600" />
          <span className="flex-1 text-left text-slate-700">
            {safeSelectedAthletes.length === 0
              ? 'Adicionar Participantes'
              : 'Adicionar Mais Participantes'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Procurar atletas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={disabled}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Athletes List */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredAthletes.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-500">
                      Nenhum atleta encontrado
                    </div>
                  ) : (
                    filteredAthletes.map((athlete) => {
                      const isSelected = safeSelectedAthletes.includes(athlete.id);
                      const statusColors = getStatusColor(athlete.status);
                      const canSelect = !isSelected && (!isLimitReached || isSelected);

                      return (
                        <motion.button
                          key={athlete.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => toggleAthlete(athlete.id)}
                          disabled={disabled || (!isSelected && isLimitReached)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-sky-100 border-2 border-sky-300'
                              : canSelect
                              ? 'bg-white border-2 border-slate-200 hover:border-sky-200'
                              : 'bg-slate-100 border-2 border-slate-200 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {/* Checkbox */}
                          <div
                            className={`h-5 w-5 rounded flex items-center justify-center border-2 transition-colors ${
                              isSelected
                                ? 'bg-sky-500 border-sky-500'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>

                          {/* Avatar */}
                          <div className="relative">
                            {athlete.avatar ? (
                              <img
                                src={athlete.avatar}
                                alt={athlete.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {athlete.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            {/* Recovery indicator */}
                            {showAvailability && athlete.recovery_level !== undefined && (
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${getRecoveryColor(athlete.recovery_level)}`}
                                title={`Recovery: ${athlete.recovery_level}%`}
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {athlete.name}
                            </p>
                            {athlete.email && (
                              <p className="text-xs text-slate-600 truncate">
                                {athlete.email}
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          {showAvailability && athlete.status && (
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                            >
                              {athlete.status === 'available' && 'Disponível'}
                              {athlete.status === 'busy' && 'Ocupado'}
                              {athlete.status === 'unavailable' && 'Indisponível'}
                            </div>
                          )}

                          {/* Recovery Level */}
                          {showAvailability && athlete.recovery_level !== undefined && (
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getRecoveryColor(athlete.recovery_level)}`}
                                  style={{ width: `${athlete.recovery_level}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-600 min-w-[2rem]">
                                {athlete.recovery_level}%
                              </span>
                            </div>
                          )}
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Footer */}
      {showAvailability && (
        <div className="flex items-center gap-4 text-xs text-slate-600 pt-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>80%+ Recuperado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>50-79% Recuperado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span>&lt;50% Recuperado</span>
          </div>
        </div>
      )}
    </div>
  );
}