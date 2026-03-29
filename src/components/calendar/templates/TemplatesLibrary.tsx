/**
 * TEMPLATES LIBRARY
 * Browse and select event templates
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Plus, Sparkles, Filter, Grid, List } from 'lucide-react';
import { EventTemplate, EVENT_TYPE_COLORS } from '@/types/calendar';
import { TemplateCard } from './TemplateCard';
import { TemplatePreview } from './TemplatePreview';

interface TemplatesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: EventTemplate) => void;
  onCreateNew: () => void;
  workspaceId: string;
}

// Mock templates (will be replaced with API)
const MOCK_TEMPLATES: EventTemplate[] = [
  {
    id: '1',
    name: 'Treino de Força',
    description: 'Sessão de treino focada em força muscular',
    type: 'workout',
    duration_minutes: 90,
    location: 'Ginásio Principal',
    color: EVENT_TYPE_COLORS.workout.bg,
    tags: ['força', 'musculação'],
    default_athlete_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'ws-1',
    is_system: false,
    use_count: 45,
  },
  {
    id: '2',
    name: 'Treino Cardio',
    description: 'Sessão de treino cardiovascular de alta intensidade',
    type: 'workout',
    duration_minutes: 60,
    location: 'Pista de Atletismo',
    color: EVENT_TYPE_COLORS.workout.bg,
    tags: ['cardio', 'resistência'],
    default_athlete_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'ws-1',
    is_system: false,
    use_count: 38,
  },
  {
    id: '3',
    name: 'Jogo Oficial',
    description: 'Jogo oficial de campeonato',
    type: 'game',
    duration_minutes: 120,
    location: 'Campo Principal',
    color: EVENT_TYPE_COLORS.game.bg,
    tags: ['competição', 'oficial'],
    default_athlete_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'ws-1',
    is_system: true,
    use_count: 22,
  },
  {
    id: '4',
    name: 'Avaliação Física',
    description: 'Testes físicos e análise de performance',
    type: 'testing',
    duration_minutes: 120,
    location: 'Centro de Avaliação',
    color: EVENT_TYPE_COLORS.testing.bg,
    tags: ['avaliação', 'testes'],
    default_athlete_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'ws-1',
    is_system: true,
    use_count: 15,
  },
  {
    id: '5',
    name: 'Reunião Técnica',
    description: 'Análise tática e estratégia de jogo',
    type: 'meeting',
    duration_minutes: 45,
    location: 'Sala de Reuniões',
    color: EVENT_TYPE_COLORS.meeting.bg,
    tags: ['tática', 'estratégia'],
    default_athlete_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'ws-1',
    is_system: false,
    use_count: 31,
  },
  {
    id: '6',
    name: 'Dia de Recuperação',
    description: 'Descanso ativo e recuperação muscular',
    type: 'rest',
    duration_minutes: 60,
    location: 'Centro de Recuperação',
    color: EVENT_TYPE_COLORS.rest.bg,
    tags: ['recuperação', 'descanso'],
    default_athlete_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'ws-1',
    is_system: true,
    use_count: 12,
  },
];

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'system' | 'custom' | 'popular';

export function TemplatesLibrary({
  isOpen,
  onClose,
  onSelectTemplate,
  onCreateNew,
  workspaceId,
}: TemplatesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = MOCK_TEMPLATES;

    // Filter by type
    if (filterType === 'system') {
      filtered = filtered.filter(t => t.is_system);
    } else if (filterType === 'custom') {
      filtered = filtered.filter(t => !t.is_system);
    } else if (filterType === 'popular') {
      filtered = filtered.filter(t => (t.use_count || 0) > 20);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by use count
    return filtered.sort((a, b) => (b.use_count || 0) - (a.use_count || 0));
  }, [searchQuery, filterType]);

  const handleSelectTemplate = (template: EventTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  const handleClosePreview = () => {
    setSelectedTemplate(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Biblioteca de Templates
                </h2>
                <p className="text-sm text-slate-600">
                  {filteredTemplates.length} templates disponíveis
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-6 border-b border-slate-200 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Procurar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
              />
            </div>

            {/* Create New Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl shadow-md hover:from-violet-400 hover:to-violet-500 transition-all whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Criar Template
            </motion.button>
          </div>

          {/* Filters & View Toggle */}
          <div className="flex items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Todos', icon: Filter },
                { value: 'popular', label: 'Populares', icon: Sparkles },
                { value: 'system', label: 'Sistema', icon: Grid },
                { value: 'custom', label: 'Personalizados', icon: Plus },
              ].map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilterType(filter.value as FilterType)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                      filterType === filter.value
                        ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {filter.label}
                  </motion.button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-violet-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Vista em Grelha"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-violet-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Vista em Lista"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-sm text-slate-600 mb-6 text-center max-w-sm">
                Não encontrámos templates com esses critérios. Tenta ajustar a pesquisa ou cria um novo template.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateNew}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl shadow-md hover:from-violet-400 hover:to-violet-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Template
              </motion.button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-3'
              }
            >
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  index={index}
                  onClick={() => handleSelectTemplate(template)}
                  isSelected={selectedTemplate?.id === template.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500">
            💡 Tip: Templates poupam tempo ao criar eventos recorrentes
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <TemplatePreview
            template={selectedTemplate}
            onClose={handleClosePreview}
            onUse={handleUseTemplate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}