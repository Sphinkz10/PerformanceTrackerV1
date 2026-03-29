/**
 * BULK TAG MODAL
 * Add/remove tags to multiple events
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Tag, Plus, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { CalendarEvent } from '@/types/calendar';

interface BulkTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvents: CalendarEvent[];
  workspaceId: string;
  onSuccess?: () => void;
}

// Predefined tags (could come from API in real app)
const PREDEFINED_TAGS = [
  { id: 'tecnica', label: 'Técnica', color: 'sky' },
  { id: 'tatica', label: 'Tática', color: 'violet' },
  { id: 'fisica', label: 'Física', color: 'emerald' },
  { id: 'mental', label: 'Mental', color: 'amber' },
  { id: 'jogo', label: 'Jogo', color: 'red' },
  { id: 'recuperacao', label: 'Recuperação', color: 'blue' },
  { id: 'avaliacao', label: 'Avaliação', color: 'purple' },
  { id: 'competicao', label: 'Competição', color: 'orange' },
];

const TAG_COLORS: Record<string, string> = {
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  violet: 'bg-violet-100 text-violet-700 border-violet-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function BulkTagModal({
  isOpen,
  onClose,
  selectedEvents,
  workspaceId,
  onSuccess,
}: BulkTagModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [action, setAction] = useState<'add' | 'remove' | 'replace'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  const addCustomTag = () => {
    if (newTagInput.trim() && !selectedTags.includes(newTagInput.trim())) {
      setSelectedTags([...selectedTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleApply = async () => {
    if (selectedEvents.length === 0) {
      toast.error('Nenhum evento selecionado');
      return;
    }

    if (selectedTags.length === 0) {
      toast.error('Selecione pelo menos uma tag');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePromises = selectedEvents.map(async (event) => {
        let newTags: string[] = [];

        if (action === 'add') {
          // Add to existing tags
          newTags = [...new Set([...(event.tags || []), ...selectedTags])];
        } else if (action === 'remove') {
          // Remove from existing tags
          newTags = (event.tags || []).filter((t) => !selectedTags.includes(t));
        } else {
          // Replace all tags
          newTags = selectedTags;
        }

        const response = await fetch(`/api/workspaces/${workspaceId}/calendar-events`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            tags: newTags,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar tags do evento: ${event.title}`);
        }

        return response.json();
      });

      await Promise.all(updatePromises);

      const actionText = {
        add: 'adicionadas',
        remove: 'removidas',
        replace: 'substituídas',
      };

      toast.success(
        `Tags ${actionText[action]} em ${selectedEvents.length} evento(s)!`
      );

      // Refresh calendar
      mutate((key) => typeof key === 'string' && key.includes('/calendar-events'));

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Bulk tag error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar tags');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedTags([]);
      setNewTagInput('');
      setAction('add');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Gerir Tags
              </h2>
              <p className="text-sm text-slate-500">
                {selectedEvents.length} evento(s) selecionado(s)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Ação
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setAction('add')}
                disabled={isSubmitting}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                  action === 'add'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                ➕ Adicionar
              </button>
              <button
                onClick={() => setAction('remove')}
                disabled={isSubmitting}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                  action === 'remove'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-red-300'
                }`}
              >
                ➖ Remover
              </button>
              <button
                onClick={() => setAction('replace')}
                disabled={isSubmitting}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                  action === 'replace'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-600 shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                🔄 Substituir
              </button>
            </div>
          </div>

          {/* Predefined Tags */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Tags Predefinidas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PREDEFINED_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  disabled={isSubmitting}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    selectedTags.includes(tag.id)
                      ? TAG_COLORS[tag.color] + ' shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{tag.label}</span>
                  {selectedTags.includes(tag.id) && (
                    <Check className="h-3 w-3 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tag Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Tag Personalizada
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                placeholder="Digite o nome da tag..."
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addCustomTag}
                disabled={isSubmitting || !newTagInput.trim()}
                className="px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-400 hover:to-violet-500 transition-all disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Tags Selecionadas ({selectedTags.length})
              </label>
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                {selectedTags.map((tag) => {
                  const predefined = PREDEFINED_TAGS.find((t) => t.id === tag);
                  const colorClass = predefined
                    ? TAG_COLORS[predefined.color]
                    : 'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${colorClass}`}
                    >
                      {predefined?.label || tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-50 border border-violet-200">
            <AlertCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-violet-900">
                {action === 'add' && 'As tags serão adicionadas aos eventos, mantendo as existentes.'}
                {action === 'remove' && 'As tags selecionadas serão removidas dos eventos.'}
                {action === 'replace' && 'Todas as tags existentes serão substituídas pelas selecionadas.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            disabled={isSubmitting || selectedTags.length === 0 || selectedEvents.length === 0}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl shadow-md hover:from-violet-400 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Aplicando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Aplicar Tags
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
