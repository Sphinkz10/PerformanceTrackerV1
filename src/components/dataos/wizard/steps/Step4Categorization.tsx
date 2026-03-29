/**
 * STEP 4: CATEGORIZATION - FASE 4 DIA 13
 * Categoria, Tags, Update Frequency
 * 
 * FEATURES:
 * - Category selection (6 options com emojis)
 * - Tags multiselect com create
 * - Update frequency selector
 * - Validation (category obrigatória)
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Plus, X, Calendar } from 'lucide-react';
import type { MetricCategory } from '@/types/metrics';

interface Step4CategorizationProps {
  data: {
    category: MetricCategory | '';
    tags: string[];
    updateFrequency: 'daily' | 'per-session' | 'weekly' | 'on-demand';
  };
  updateData: (updates: Partial<Step4CategorizationProps['data']>) => void;
  isMobile: boolean;
}

const categories: Array<{ 
  value: MetricCategory; 
  label: string; 
  description: string; 
  icon: string;
  color: string;
}> = [
  {
    value: 'strength',
    label: 'Força',
    description: 'Levantamentos, 1RM, potência',
    icon: '💪',
    color: 'orange',
  },
  {
    value: 'conditioning',
    label: 'Condicionamento',
    description: 'Cardio, resistência, FC',
    icon: '🏃',
    color: 'emerald',
  },
  {
    value: 'wellbeing',
    label: 'Bem-Estar',
    description: 'Sono, stress, recuperação',
    icon: '🧘',
    color: 'sky',
  },
  {
    value: 'body-composition',
    label: 'Composição',
    description: 'Peso, % gordura, medidas',
    icon: '📏',
    color: 'violet',
  },
  {
    value: 'skill',
    label: 'Técnica',
    description: 'Habilidades específicas',
    icon: '🎯',
    color: 'amber',
  },
  {
    value: 'custom',
    label: 'Personalizada',
    description: 'Outra categoria',
    icon: '⭐',
    color: 'slate',
  },
];

const updateFrequencies = [
  {
    value: 'daily' as const,
    label: 'Diariamente',
    description: 'Ex: peso corporal, sono',
    icon: '📅',
  },
  {
    value: 'per-session' as const,
    label: 'Por Sessão',
    description: 'Ex: RPE, carga de treino',
    icon: '🏋️',
  },
  {
    value: 'weekly' as const,
    label: 'Semanalmente',
    description: 'Ex: testes, avaliações',
    icon: '📊',
  },
  {
    value: 'on-demand' as const,
    label: 'Sob Demanda',
    description: 'Quando necessário',
    icon: '⚡',
  },
];

const suggestedTags = [
  'Performance',
  'Saúde',
  'Recuperação',
  'Objetivo',
  'Competição',
  'Teste',
  'Monitorização',
];

export function Step4Categorization({ data, updateData, isMobile }: Step4CategorizationProps) {
  const [newTagInput, setNewTagInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !data.tags.includes(trimmed)) {
      updateData({ tags: [...data.tags, trimmed] });
      setNewTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateData({ tags: data.tags.filter(t => t !== tag) });
  };

  const getCategoryColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      orange: 'border-orange-500 bg-orange-50',
      emerald: 'border-emerald-500 bg-emerald-50',
      sky: 'border-sky-500 bg-sky-50',
      violet: 'border-violet-500 bg-violet-50',
      amber: 'border-amber-500 bg-amber-50',
      slate: 'border-slate-500 bg-slate-50',
    };
    return colorMap[colorName] || 'border-slate-500 bg-slate-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Categorização & Tags</h2>
        <p className="text-sm text-slate-600">
          Organiza a métrica para facilitar a pesquisa e análise
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <span>Categoria</span>
          <span className="text-red-500">*</span>
        </label>
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {categories.map((category, index) => {
            const isSelected = data.category === category.value;
            return (
              <motion.button
                key={category.value}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateData({ category: category.value })}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isMobile ? 'min-h-[100px]' : 'min-h-[110px]'
                } ${
                  isSelected
                    ? getCategoryColor(category.color) + ' shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Icon */}
                <div className="text-3xl mb-2">{category.icon}</div>
                
                {/* Label */}
                <h4 className="font-semibold text-slate-900 text-sm mb-1">
                  {category.label}
                </h4>
                
                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2">
                  {category.description}
                </p>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedCategory"
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      category.color === 'orange' ? 'bg-orange-500' :
                      category.color === 'emerald' ? 'bg-emerald-500' :
                      category.color === 'sky' ? 'bg-sky-500' :
                      category.color === 'violet' ? 'bg-violet-500' :
                      category.color === 'amber' ? 'bg-amber-500' :
                      'bg-slate-500'
                    }`}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Tag className="h-4 w-4" />
          <span>Tags</span>
          <span className="text-xs font-normal text-slate-500">(opcional)</span>
        </label>

        {/* Selected Tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <AnimatePresence>
              {data.tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-sky-200 rounded p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Adicionar tag..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(newTagInput);
              }
            }}
            className={`flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all ${
              isMobile ? 'min-h-[44px]' : ''
            }`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addTag(newTagInput)}
            disabled={!newTagInput.trim()}
            className={`flex items-center justify-center px-4 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isMobile ? 'min-h-[44px] min-w-[44px]' : ''
            }`}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Suggested Tags */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter(tag => !data.tags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:border-sky-300 hover:text-sky-600 transition-all"
                >
                  + {tag}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Update Frequency */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Calendar className="h-4 w-4" />
          <span>Frequência de Atualização</span>
        </label>
        <div className="grid grid-cols-1 gap-3">
          {updateFrequencies.map((freq) => {
            const isSelected = data.updateFrequency === freq.value;
            return (
              <motion.button
                key={freq.value}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => updateData({ updateFrequency: freq.value })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0">{freq.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {freq.label}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {freq.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="text-sky-500 text-xl shrink-0">✓</div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Helper Box */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <div className="flex gap-3">
          <div className="text-2xl shrink-0">💡</div>
          <div>
            <h4 className="font-semibold text-sky-900 text-sm mb-1">
              Dica: Organização facilita análise
            </h4>
            <p className="text-xs text-sky-800 leading-relaxed">
              Categorias e tags ajudam a filtrar métricas rapidamente. 
              A frequência de atualização ajuda a definir lembretes e expectativas.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
