/**
 * CREATE TEMPLATE MODAL
 * Modal para criar/editar templates de eventos
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Sparkles,
  Save,
  Tag,
  Clock,
  MapPin,
  Users,
  Palette,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { EventTemplate, CalendarEventType, EVENT_TYPE_COLORS } from '@/types/calendar';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Partial<EventTemplate>) => void;
  workspaceId: string;
  initialTemplate?: EventTemplate;
}

const EVENT_TYPES: { value: CalendarEventType; label: string; icon: string }[] = [
  { value: 'workout', label: 'Treino', icon: '💪' },
  { value: 'game', label: 'Jogo', icon: '⚽' },
  { value: 'competition', label: 'Competição', icon: '🏆' },
  { value: 'rest', label: 'Descanso', icon: '😴' },
  { value: 'meeting', label: 'Reunião', icon: '📋' },
  { value: 'testing', label: 'Avaliação', icon: '📊' },
  { value: 'other', label: 'Outro', icon: '📌' },
];

const PRESET_COLORS = [
  { value: '#0ea5e9', label: 'Sky' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ef4444', label: 'Red' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#64748b', label: 'Slate' },
];

export function CreateTemplateModal({
  isOpen,
  onClose,
  onSave,
  workspaceId,
  initialTemplate,
}: CreateTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CalendarEventType>('workout');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0].value);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load initial template if editing
  useEffect(() => {
    if (initialTemplate) {
      setName(initialTemplate.name);
      setDescription(initialTemplate.description || '');
      setType(initialTemplate.type);
      setDuration(initialTemplate.duration_minutes);
      setLocation(initialTemplate.location || '');
      setColor(initialTemplate.color || PRESET_COLORS[0].value);
      setTags(initialTemplate.tags || []);
    } else {
      // Reset form
      setName('');
      setDescription('');
      setType('workout');
      setDuration(60);
      setLocation('');
      setColor(PRESET_COLORS[0].value);
      setTags([]);
    }
  }, [initialTemplate, isOpen]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('O nome do template é obrigatório');
      return;
    }

    setIsSaving(true);

    try {
      const template: Partial<EventTemplate> = {
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        duration_minutes: duration,
        location: location.trim() || undefined,
        color,
        tags: tags.length > 0 ? tags : undefined,
        workspace_id: workspaceId,
        is_system: false,
      };

      onSave(template);
      
      toast.success(
        initialTemplate
          ? `Template "${name}" atualizado!`
          : `Template "${name}" criado!`
      );
      
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao guardar template');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

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
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {initialTemplate ? 'Editar Template' : 'Criar Template'}
              </h2>
              <p className="text-sm text-slate-600">
                Guarda configurações para reutilizar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Nome do Template *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Treino de Força - Manhã"
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreve o tipo de evento..."
              rows={3}
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all resize-none"
            />
          </div>

          {/* Type Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Tipo de Evento *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EVENT_TYPES.map((eventType) => {
                const isSelected = type === eventType.value;
                const colors = EVENT_TYPE_COLORS[eventType.value];

                return (
                  <motion.button
                    key={eventType.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType(eventType.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? `${colors.border} ${colors.background} shadow-md`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{eventType.icon}</span>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? colors.text : 'text-slate-700'
                        }`}
                      >
                        {eventType.label}
                      </span>
                      {isSelected && (
                        <div
                          className={`ml-auto h-2 w-2 rounded-full ${colors.text.replace(
                            'text-',
                            'bg-'
                          )}`}
                        />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Duration & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                <Clock className="inline h-4 w-4 mr-1" />
                Duração (minutos) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) =>
                    setDuration(Math.max(15, parseInt(e.target.value) || 60))
                  }
                  min="15"
                  step="15"
                  className="flex-1 px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                />
                <div className="flex gap-1">
                  {[30, 60, 90, 120].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDuration(preset)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        duration === preset
                          ? 'bg-violet-500 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                <MapPin className="inline h-4 w-4 mr-1" />
                Localização
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Ginásio Principal"
                className="w-full px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              <Palette className="inline h-4 w-4 mr-1" />
              Cor
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  className={`h-10 w-10 rounded-xl transition-all ${
                    color === preset.value
                      ? 'ring-2 ring-offset-2 ring-violet-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.label}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              <Tag className="inline h-4 w-4 mr-1" />
              Tags
            </label>
            <div className="space-y-2">
              {/* Tag Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Adicionar tag..."
                  className="flex-1 px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="p-2 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Tags List */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-700 text-sm font-medium rounded-full"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-violet-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-violet-900 mb-1">
                  Templates poupam tempo
                </h5>
                <p className="text-sm text-violet-700">
                  Cria templates para eventos que repetes frequentemente. Ao usar
                  o template, todos os campos serão pré-preenchidos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                A guardar...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {initialTemplate ? 'Atualizar' : 'Criar'} Template
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
