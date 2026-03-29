/**
 * TEMPLATE PREVIEW
 * Preview template before using it
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Clock,
  MapPin,
  Tag,
  Users,
  Sparkles,
  CheckCircle,
  Calendar as CalendarIcon,
  TrendingUp,
} from 'lucide-react';
import { EventTemplate, EVENT_TYPE_COLORS } from '@/types/calendar';

interface TemplatePreviewProps {
  template: EventTemplate;
  onClose: () => void;
  onUse: () => void;
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

export function TemplatePreview({
  template,
  onClose,
  onUse,
}: TemplatePreviewProps) {
  const typeColors = EVENT_TYPE_COLORS[template.type];
  const isPopular = (template.use_count || 0) > 20;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-200">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 rounded-t-2xl"
            style={{
              background: `linear-gradient(135deg, ${template.color || typeColors.bg} 0%, transparent 100%)`,
            }}
          />

          <div className="relative flex items-start gap-4">
            {/* Icon */}
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                backgroundColor: template.color || typeColors.bg,
              }}
            >
              <span className="text-4xl">{typeColors.icon}</span>
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 flex-1">
                  {template.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <Tag className="h-3 w-3" />
                  {EVENT_TYPE_LABELS[template.type]}
                </span>
                {template.is_system && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                    <Sparkles className="h-3 w-3" />
                    Template do Sistema
                  </span>
                )}
                {isPopular && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <TrendingUp className="h-3 w-3" />
                    Popular
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          {template.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Descrição
              </h3>
              <p className="text-slate-600">{template.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-700">
                  Duração
                </span>
              </div>
              <p className="font-semibold text-slate-900">
                {template.duration_minutes} minutos
              </p>
            </div>

            {/* Location */}
            {template.location && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    Local
                  </span>
                </div>
                <p className="font-semibold text-slate-900">
                  {template.location}
                </p>
              </div>
            )}

            {/* Use Count */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-700">
                  Utilizado
                </span>
              </div>
              <p className="font-semibold text-slate-900">
                {template.use_count || 0} vezes
              </p>
            </div>

            {/* Athletes */}
            {template.default_athlete_ids && template.default_athlete_ids.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    Participantes Padrão
                  </span>
                </div>
                <p className="font-semibold text-slate-900">
                  {template.default_athlete_ids.length} atletas
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm font-medium rounded-xl bg-slate-100 text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-violet-900 mb-1">
                  Usar Template
                </h4>
                <p className="text-sm text-violet-700">
                  Ao usar este template, todos os campos serão pré-preenchidos.
                  Poderás editar os detalhes antes de criar o evento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Voltar
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUse}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-violet-500 transition-all"
          >
            <CheckCircle className="h-4 w-4" />
            Usar Template
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
