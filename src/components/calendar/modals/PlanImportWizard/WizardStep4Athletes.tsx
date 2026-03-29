/**
 * STEP 4: ATHLETE ASSIGNMENT
 * Choose which athletes to assign to all events
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, CheckSquare, Square, Loader2, AlertCircle, UserCheck } from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  status?: 'active' | 'inactive';
}

interface WizardStep4Props {
  workspaceId: string;
  selectedAthletes: string[];
  onToggleAthlete: (athleteId: string) => void;
  onSelectAll: (athleteIds: string[]) => void;
  onDeselectAll: () => void;
}

export function WizardStep4Athletes({
  workspaceId,
  selectedAthletes,
  onToggleAthlete,
  onSelectAll,
  onDeselectAll,
}: WizardStep4Props) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchAthletes();
  }, [workspaceId]);
  
  const fetchAthletes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/athletes?workspace_id=${workspaceId}&status=active`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar atletas');
      }
      
      const data = await response.json();
      setAthletes(data || []);
    } catch (err) {
      console.error('Error fetching athletes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredAthletes = athletes.filter(athlete => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      athlete.name?.toLowerCase().includes(query) ||
      athlete.email?.toLowerCase().includes(query)
    );
  });
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader2 className="h-8 w-8 animate-spin text-violet-500 mb-3" />
        <p className="text-sm font-medium text-slate-700">
          A carregar atletas...
        </p>
      </motion.div>
    );
  }
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-sm font-semibold text-slate-900 mb-1">
          Erro ao carregar atletas
        </p>
        <p className="text-xs text-slate-600 mb-4">
          {error}
        </p>
        <button
          onClick={fetchAthletes}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors"
        >
          Tentar novamente
        </button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Atribuir Atletas
        </h3>
        <p className="text-sm text-slate-600">
          Escolha os atletas que participarão em todas as sessões do plano
        </p>
      </div>
      
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Procurar atletas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
        />
      </div>
      
      {/* Selection Controls */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-violet-500" />
          <span className="text-sm font-semibold text-slate-700">
            {selectedAthletes.length} de {filteredAthletes.length} atletas selecionados
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectAll(filteredAthletes.map(a => a.id))}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
          >
            Selecionar Todos
          </button>
          <button
            onClick={onDeselectAll}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
      
      {/* Athletes List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAthletes.map((athlete, index) => {
          const isSelected = selectedAthletes.includes(athlete.id);
          
          return (
            <motion.button
              key={athlete.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggleAthlete(athlete.id)}
              className={`group w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm'
              }`}
            >
              {/* Checkbox */}
              <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'border-violet-500 bg-violet-500'
                  : 'border-slate-300 bg-white group-hover:border-violet-400'
              }`}>
                {isSelected ? (
                  <CheckSquare className="h-4 w-4 text-white" />
                ) : (
                  <Square className="h-4 w-4 text-slate-300" />
                )}
              </div>
              
              {/* Avatar */}
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-gradient-to-br from-violet-500 to-violet-600'
                  : 'bg-violet-100'
              }`}>
                {athlete.avatar_url ? (
                  <img 
                    src={athlete.avatar_url} 
                    alt={athlete.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Users className={`h-5 w-5 ${
                    isSelected ? 'text-white' : 'text-violet-600'
                  }`} />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 text-left min-w-0">
                <h5 className="font-semibold text-slate-900 truncate">
                  {athlete.name}
                </h5>
                {athlete.email && (
                  <p className="text-xs text-slate-600 truncate">
                    {athlete.email}
                  </p>
                )}
              </div>
              
              {/* Status Badge */}
              {athlete.status === 'active' && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isSelected
                    ? 'bg-violet-200 text-violet-800'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  Ativo
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredAthletes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            {searchQuery ? 'Nenhum atleta encontrado' : 'Nenhum atleta ativo'}
          </p>
          <p className="text-xs text-slate-500">
            {searchQuery 
              ? 'Tente ajustar os termos de pesquisa'
              : 'Adicione atletas primeiro no menu Atletas'
            }
          </p>
        </div>
      )}
    </motion.div>
  );
}
