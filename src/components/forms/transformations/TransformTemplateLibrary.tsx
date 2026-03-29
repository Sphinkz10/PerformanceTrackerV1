/**
 * TransformTemplateLibrary Component
 * 
 * Gallery of pre-configured transformation templates.
 * Users can browse, search, and select templates.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Check } from 'lucide-react';
import type { TransformTemplate, TransformCategory } from '@/types/transformations';
import { TRANSFORM_TEMPLATES, getTemplatesByCategory, getCompatibleTemplates } from './transformTemplates';

// ============================================================================
// TYPES
// ============================================================================

export interface TransformTemplateLibraryProps {
  onSelectTemplate: (template: TransformTemplate) => void;
  selectedTemplateId?: string;
  fieldType?: string;
  metricType?: string;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORY_LABELS: Record<TransformCategory, string> = {
  weight: '⚖️ Peso',
  distance: '📏 Distância',
  time: '⏱️ Tempo',
  temperature: '🌡️ Temperatura',
  scale: '📊 Escala',
  custom: '🧮 Custom',
  other: '🔧 Outros',
};

const CATEGORIES: TransformCategory[] = ['weight', 'distance', 'time', 'temperature', 'scale', 'other', 'custom'];

// ============================================================================
// COMPONENT
// ============================================================================

export const TransformTemplateLibrary: React.FC<TransformTemplateLibraryProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  fieldType,
  metricType,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransformCategory | 'all'>('all');

  // Get compatible templates
  const compatibleTemplates = useMemo(() => {
    return getCompatibleTemplates(fieldType, metricType);
  }, [fieldType, metricType]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let templates = compatibleTemplates;

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    return templates;
  }, [compatibleTemplates, selectedCategory, searchQuery]);

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, TransformTemplate[]> = {};
    
    filteredTemplates.forEach(template => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });

    return groups;
  }, [filteredTemplates]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Biblioteca de Templates
        </h3>
        <span className="text-xs text-slate-500">
          ({filteredTemplates.length} disponíveis)
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Procurar templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            selectedCategory === 'all'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Todos
        </motion.button>

        {CATEGORIES.map(category => {
          const count = compatibleTemplates.filter(t => t.category === category).length;
          if (count === 0) return null;

          return (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {CATEGORY_LABELS[category]} ({count})
            </motion.button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category}>
            {/* Category Header (only show if not filtering by category) */}
            {selectedCategory === 'all' && (
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                {CATEGORY_LABELS[category as TransformCategory]}
              </h4>
            )}

            {/* Templates */}
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template, index) => {
                const isSelected = template.id === selectedTemplateId;

                return (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectTemplate(template)}
                    className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className="text-2xl mb-2">
                      {template.icon}
                    </div>

                    {/* Name */}
                    <h5 className="font-semibold text-sm text-slate-900 mb-1">
                      {template.name}
                    </h5>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Example */}
                    {template.example && (
                      <div className="text-xs text-slate-500 font-mono">
                        {template.example.input} → {template.example.output}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              Nenhum template encontrado
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-sky-600 hover:underline mt-2"
              >
                Limpar pesquisa
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
