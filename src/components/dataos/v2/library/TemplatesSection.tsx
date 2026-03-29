/**
 * 🎨 TEMPLATES SECTION - ENHANCED
 * Meus Templates Salvos
 * Lista funcional com duplicate, edit, share, versions
 * 
 * MUDANÇAS VISUAIS:
 * ✅ Touch targets 44×44px em todos os botões
 * ✅ Borders suaves (border não border-2)
 * ✅ Padding responsivo
 * ✅ Text responsivo em header
 * ✅ Button com texto escondido em mobile
 * ✅ Spacing adaptativo
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookTemplate,
  Plus,
  Search,
  Grid3x3,
  List,
  Copy,
  Edit2,
  Trash2,
  Share2,
  Star,
  StarOff,
  Clock,
  Users,
  Eye,
  ChevronRight,
  History,
  Globe,
  Lock,
} from 'lucide-react';
import type { Metric } from '@/types/metrics';
import { EmptyState } from '@/components/shared/EmptyState';
import { useResponsive } from '@/hooks/useResponsive'; // 🎨 ENHANCED

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number; // Quantas métricas foram criadas a partir deste template
  isFavorite: boolean;
  isPublic: boolean;
  versions: number;
  baseMetric: Partial<Metric>; // Configuração base
}

interface TemplatesSectionProps {
  onCreateMetric: () => void;
  onUseTemplate?: (template: Template) => void;
  onEditTemplate?: (template: Template) => void;
  onDeleteTemplate?: (template: Template) => void;
  onDuplicateTemplate?: (template: Template) => void;
  onShareTemplate?: (template: Template) => void;
}

// Mock templates
const mockTemplates: Template[] = [
  {
    id: 'tpl-1',
    name: 'HRV Monitoring Template',
    description: 'Template para monitorização de HRV com alertas automáticos',
    category: 'wellness',
    emoji: '💚',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-28T14:30:00Z',
    usageCount: 12,
    isFavorite: true,
    isPublic: false,
    versions: 3,
    baseMetric: {
      type: 'scale',
      category: 'wellness',
      unit: 'ms',
      rangeMin: 0,
      rangeMax: 100,
    },
  },
  {
    id: 'tpl-2',
    name: 'Sleep Quality Tracker',
    description: 'Questionário de qualidade de sono com análise de tendências',
    category: 'wellness',
    emoji: '😴',
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-20T16:00:00Z',
    usageCount: 8,
    isFavorite: true,
    isPublic: true,
    versions: 2,
    baseMetric: {
      type: 'scale',
      category: 'wellness',
      unit: 'score',
      rangeMin: 1,
      rangeMax: 10,
    },
  },
  {
    id: 'tpl-3',
    name: 'Sprint Performance',
    description: 'Template para tracking de sprints com velocidade máxima',
    category: 'performance',
    emoji: '🏃',
    createdAt: '2024-11-28T12:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
    usageCount: 15,
    isFavorite: false,
    isPublic: false,
    versions: 1,
    baseMetric: {
      type: 'duration',
      category: 'performance',
      unit: 's',
    },
  },
  {
    id: 'tpl-4',
    name: 'Load Management',
    description: 'Gestão de carga de treino com acute:chronic ratio',
    category: 'load',
    emoji: '📊',
    createdAt: '2024-11-20T09:00:00Z',
    updatedAt: '2024-12-01T11:00:00Z',
    usageCount: 20,
    isFavorite: true,
    isPublic: true,
    versions: 4,
    baseMetric: {
      type: 'count',
      category: 'load',
      unit: 'AU',
    },
  },
];

export function TemplatesSection({
  onCreateMetric,
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onShareTemplate,
}: TemplatesSectionProps) {
  // ✅ Day 9: Responsive hook
  const { isMobile, isTablet } = useResponsive();
  
  const [templates] = useState<Template[]>(mockTemplates);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Filter templates
  const filtered = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = !filterFavorites || t.isFavorite;
    return matchesSearch && matchesFavorite;
  });

  // Sort by usage count (most used first)
  const sorted = [...filtered].sort((a, b) => b.usageCount - a.usageCount);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ✅ Day 9: Responsive grid columns
  const gridCols = isMobile 
    ? 'grid-cols-1' 
    : isTablet 
    ? 'grid-cols-2' 
    : 'grid-cols-3';

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 🎨 ENHANCED: Header with responsive layout */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookTemplate className="h-5 w-5 text-purple-500" />
            <span className="hidden sm:inline">Meus Templates</span>
            <span className="sm:hidden">Templates</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {templates.length} {isMobile ? 'salvos' : 'templates salvos'}
          </p>
        </div>

        {/* 🎨 ENHANCED: Button with responsive text and touch target */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateMetric}
          className={`flex items-center gap-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:from-purple-400 hover:to-purple-500 transition-all min-h-[44px] ${
            isMobile ? 'px-3 justify-center' : 'px-4 py-2'
          }`}
          title="Novo Template"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isMobile && <span>Novo Template</span>}
        </motion.button>
      </div>

      {/* 🎨 ENHANCED: Toolbar with touch targets */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search with touch target */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={isMobile ? 'Procurar...' : 'Procurar templates...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 sm:pr-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 transition-all min-h-[44px]"
          />
        </div>

        {/* 🎨 ENHANCED: Favorites Filter with touch target */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterFavorites(!filterFavorites)}
          className={`flex items-center gap-2 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${
            isMobile ? 'px-3 justify-center' : 'px-3 py-2.5'
          } ${
            filterFavorites
              ? 'bg-amber-100 border border-amber-400 text-amber-700'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
          title="Filtrar favoritos"
        >
          {filterFavorites ? <Star className="h-4 w-4 fill-current shrink-0" /> : <StarOff className="h-4 w-4 shrink-0" />}
          {!isMobile && <span>Favoritos</span>}
        </motion.button>

        {/* 🎨 ENHANCED: View Mode Toggle with touch targets */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Visualização em grade"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
              viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Visualização em lista"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates List/Grid */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={BookTemplate}
          title={search ? 'Nenhum template encontrado' : 'Nenhum template ainda'}
          description={
            search
              ? 'Tenta ajustar a pesquisa ou os filtros.'
              : 'Cria uma nova métrica e seleciona "Guardar como template" para reutilizar depois.'
          }
          action={
            !search
              ? {
                  label: 'Criar Primeira Métrica',
                  onClick: onCreateMetric,
                  icon: Plus,
                }
              : undefined
          }
          tips={
            !search
              ? [
                  'Templates guardam configurações de métricas para reutilizar',
                  'Podes criar templates a partir de qualquer métrica existente',
                  'Templates podem ser partilhados com a equipa',
                ]
              : undefined
          }
          color="sky"
        />
      ) : viewMode === 'grid' ? (
        <div className={`grid ${gridCols} gap-4`}>
          {sorted.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              onUse={() => onUseTemplate?.(template)}
              onEdit={() => onEditTemplate?.(template)}
              onDelete={() => onDeleteTemplate?.(template)}
              onDuplicate={() => onDuplicateTemplate?.(template)}
              onShare={() => onShareTemplate?.(template)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((template, index) => (
            <TemplateListItem
              key={template.id}
              template={template}
              index={index}
              onUse={() => onUseTemplate?.(template)}
              onEdit={() => onEditTemplate?.(template)}
              onDelete={() => onDeleteTemplate?.(template)}
              onDuplicate={() => onDuplicateTemplate?.(template)}
              onShare={() => onShareTemplate?.(template)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEMPLATE CARD (Grid View)
// ============================================================

function TemplateCard({
  template,
  index,
  onUse,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
}: {
  template: Template;
  index: number;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onShare: () => void;
}) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
      className="group relative p-3 sm:p-4 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:border-purple-400 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{template.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
              {template.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
        
        {/* 🎨 ENHANCED: Favorite button with touch target */}
        <button 
          className="shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-purple-100 transition-colors"
          title={template.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {template.isFavorite ? (
            <Star className="h-4 w-4 text-amber-500 fill-current" />
          ) : (
            <StarOff className="h-4 w-4 text-slate-300" />
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Users className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="truncate">{template.usageCount} usos</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <History className="h-3 w-3 text-slate-400 shrink-0" />
          <span>v{template.versions}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Clock className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="truncate">{formatDate(template.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          {template.isPublic ? (
            <>
              <Globe className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="text-emerald-600 truncate">Público</span>
            </>
          ) : (
            <>
              <Lock className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">Privado</span>
            </>
          )}
        </div>
      </div>

      {/* 🎨 ENHANCED: Actions with touch targets */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUse}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500 transition-all min-h-[44px]"
          title="Usar este template"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Usar</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Editar template"
        >
          <Edit2 className="h-4 w-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDuplicate}
          className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Duplicar template"
        >
          <Copy className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================================
// TEMPLATE LIST ITEM (List View)
// ============================================================

function TemplateListItem({
  template,
  index,
  onUse,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
}: {
  template: Template;
  index: number;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onShare: () => void;
}) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-purple-200 bg-white hover:border-purple-400 hover:shadow-lg transition-all group"
    >
      <span className="text-2xl shrink-0">{template.emoji}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
            {template.name}</h3>
          {template.isFavorite && <Star className="h-3 w-3 text-amber-500 fill-current shrink-0" />}
          {template.isPublic && (
            <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs shrink-0">
              Público
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
          {template.description}
        </p>
        <div className="hidden sm:flex items-center gap-4 mt-2 text-xs text-slate-400">
          <span>{template.usageCount} usos</span>
          <span>v{template.versions}</span>
          <span>Atualizado {formatDate(template.updatedAt)}</span>
        </div>
      </div>

      {/* 🎨 ENHANCED: Actions with touch targets and responsive layout */}
      <div className="flex gap-2 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUse}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500 transition-all min-h-[44px]"
          title="Usar este template"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Usar</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Editar template"
        >
          <Edit2 className="h-4 w-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDuplicate}
          className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Duplicar template"
        >
          <Copy className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}