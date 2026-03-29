import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Users, CheckCircle, X, Info } from 'lucide-react';
import { WizardStepProps, Athlete } from '@/types/scheduling';

// Mock athletes (substituir por Supabase fetch)
const MOCK_ATHLETES: Athlete[] = [
  { id: '1', name: 'João Silva', status: 'active', priority: 9, segment: 'Premium', plan_type: 'PT 3x/week', risk_level: 'low' },
  { id: '2', name: 'Maria Santos', status: 'active', priority: 8, segment: 'Premium', plan_type: 'PT 2x/week', risk_level: 'low' },
  { id: '3', name: 'Pedro Costa', status: 'active', priority: 7, segment: 'Standard', plan_type: 'PT 2x/week', risk_level: 'medium' },
  { id: '4', name: 'Ana Rodrigues', status: 'active', priority: 6, segment: 'Standard', plan_type: 'PT 1x/week', risk_level: 'low' },
  { id: '5', name: 'Carlos Ferreira', status: 'active', priority: 8, segment: 'Premium', plan_type: 'PT 3x/week', risk_level: 'high' },
  { id: '6', name: 'Sofia Alves', status: 'active', priority: 5, segment: 'Basic', plan_type: 'Aulas', risk_level: 'low' },
  { id: '7', name: 'Rui Pereira', status: 'active', priority: 7, segment: 'Standard', plan_type: 'PT 2x/week', risk_level: 'medium' },
  { id: '8', name: 'Isabel Martins', status: 'on_hold', priority: 4, segment: 'Basic', plan_type: 'PT 1x/week', risk_level: 'low' },
];

export function WizardStep1SelectAthletes({ state, onChange }: WizardStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const selectedIds = new Set(state.selectedAthletes.map(a => a.id));

  // Filtrar atletas
  const filteredAthletes = MOCK_ATHLETES.filter(athlete => {
    const matchesSearch =
      searchQuery === '' ||
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSegment =
      filterSegment === 'all' || athlete.segment === filterSegment;

    const matchesStatus =
      filterStatus === 'all' || athlete.status === filterStatus;

    return matchesSearch && matchesSegment && matchesStatus;
  });

  // Toggle seleção
  const toggleAthlete = (athlete: Athlete) => {
    const isSelected = selectedIds.has(athlete.id);

    if (isSelected) {
      onChange({
        selectedAthletes: state.selectedAthletes.filter(a => a.id !== athlete.id)
      });
    } else {
      onChange({
        selectedAthletes: [...state.selectedAthletes, athlete]
      });
    }
  };

  // Selecionar todos visíveis
  const selectAll = () => {
    const newSelected = [...state.selectedAthletes];
    
    filteredAthletes.forEach(athlete => {
      if (!selectedIds.has(athlete.id)) {
        newSelected.push(athlete);
      }
    });

    onChange({ selectedAthletes: newSelected });
  };

  // Limpar seleção
  const clearSelection = () => {
    onChange({ selectedAthletes: [] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Info Card */}
      <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <Info className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-violet-900">
            Seleciona os atletas para agendar
          </p>
          <p className="text-xs text-violet-700 mt-1">
            Podes selecionar múltiplos atletas. O sistema vai tentar encaixar todos respeitando as regras que defines nos próximos passos.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Procurar atleta..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
          />
        </div>

        {/* Filter Segment */}
        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value)}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
        >
          <option value="all">Todos segmentos</option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
          <option value="Basic">Basic</option>
        </select>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
        >
          <option value="all">Todos estados</option>
          <option value="active">Ativos</option>
          <option value="on_hold">Em Pausa</option>
        </select>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {state.selectedAthletes.length > 0 ? (
            <>
              <span className="font-semibold text-violet-600">
                {state.selectedAthletes.length}
              </span>{' '}
              atleta{state.selectedAthletes.length > 1 ? 's' : ''} selecionado{state.selectedAthletes.length > 1 ? 's' : ''}
            </>
          ) : (
            'Nenhum atleta selecionado'
          )}
        </p>

        <div className="flex gap-2">
          {state.selectedAthletes.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Limpar
            </button>
          )}
          <button
            onClick={selectAll}
            className="text-xs text-violet-600 font-medium px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
          >
            Selecionar visíveis ({filteredAthletes.length})
          </button>
        </div>
      </div>

      {/* Athletes List */}
      <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
        {filteredAthletes.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Nenhum atleta encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAthletes.map((athlete, index) => {
              const isSelected = selectedIds.has(athlete.id);

              return (
                <motion.button
                  key={athlete.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleAthlete(athlete)}
                  className={`w-full p-4 text-left transition-all ${
                    isSelected
                      ? 'bg-violet-50 hover:bg-violet-100'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-violet-500 border-violet-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        isSelected
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white'
                          : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700'
                      }`}
                    >
                      {athlete.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {athlete.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-600">
                          {athlete.plan_type}
                        </span>
                        {athlete.segment && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span
                              className={`text-xs font-medium ${
                                athlete.segment === 'Premium'
                                  ? 'text-violet-600'
                                  : athlete.segment === 'Standard'
                                  ? 'text-sky-600'
                                  : 'text-slate-500'
                              }`}
                            >
                              {athlete.segment}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          athlete.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {athlete.status === 'active' ? 'Ativo' : 'Em Pausa'}
                      </span>
                      {athlete.risk_level && athlete.risk_level !== 'low' && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            athlete.risk_level === 'high'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          Risco: {athlete.risk_level === 'high' ? 'Alto' : 'Médio'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
