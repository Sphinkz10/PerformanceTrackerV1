/**
 * TEMPLATE CARD
 * Individual template card component
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  MapPin,
  Tag,
  Sparkles,
  Star,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { EventTemplate, EVENT_TYPE_COLORS } from '@/types/calendar';

interface TemplateCardProps {
  template: EventTemplate;
  viewMode: 'grid' | 'list';
  index: number;
  onClick: () => void;
  isSelected: boolean;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  workout: 'Treino',
  game: 'Jogo',
  competition: 'Competição',
  rest: 'Descanso',
  meeting: 'Reunião',
  testing: 'Avaliação',
  other: 'Outro',
};

export function TemplateCard({
  template,
  viewMode,
  index,
  onClick,
  isSelected,
}: TemplateCardProps) {
  const typeColors = EVENT_TYPE_COLORS[template.type];
  const isPopular = (template.use_count || 0) > 20;

  if (viewMode === 'list') {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-violet-400 bg-violet-50 shadow-lg'
            : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md'
        }`}
      >
        {/* Color Indicator */}
        <div
          className="h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: template.color || typeColors.bg,
          }}
        >
          <span className="text-2xl">{typeColors.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 truncate">
              {template.name}
            </h4>
            {template.is_system && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                <Sparkles className="h-3 w-3" />
                Sistema
              </span>
            )}
            {isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <TrendingUp className="h-3 w-3" />
                Popular
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 truncate mb-2">
            {template.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {EVENT_TYPE_LABELS[template.type]}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {template.duration_minutes}min
            </span>
            {template.location && (
              <span className="inline-flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3" />
                {template.location}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="text-xs text-slate-500">
            {template.use_count || 0}× usado
          </div>
          {isSelected && (
            <div className="h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </motion.button>
    );
  }

  // Grid View
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative p-4 rounded-2xl border-2 transition-all text-left ${
        isSelected
          ? 'border-violet-400 bg-violet-50 shadow-xl'
          : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg'
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-1">
        {template.is_system && (
          <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center" title="Template do Sistema">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        )}
        {isPopular && (
          <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center" title="Template Popular">
            <Star className="h-3 w-3 text-white" />
          </div>
        )}
        {isSelected && (
          <div className="h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      {/* Icon */}
      <div
        className="h-14 w-14 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"
        style={{
          backgroundColor: template.color || typeColors.bg,
        }}
      >
        <span className="text-3xl">{typeColors.icon}</span>
      </div>

      {/* Title & Description */}
      <h4 className="font-bold text-slate-900 mb-1 truncate pr-12">
        {template.name}
      </h4>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2 min-h-[40px]">
        {template.description}
      </p>

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-500">
              +{template.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Tag className="h-3 w-3" />
          <span>{EVENT_TYPE_LABELS[template.type]}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>{template.duration_minutes} minutos</span>
        </div>
        {template.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{template.location}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Usado {template.use_count || 0}× vezes
        </span>
      </div>
    </motion.button>
  );
}
