/**
 * STEP 2: DATE & TIME
 * Data, hora, localização e tipo do evento
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag,
  Palette,
  Info,
  Plus,
  X
} from 'lucide-react';
import { format, addMinutes, differenceInMinutes } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CreateEventFormData, CalendarEventType, CALENDAR_CONSTANTS, EVENT_TYPE_COLORS, RecurrencePattern } from '@/types/calendar';
import { RecurringEventEditor } from '../../recurring/RecurringEventEditor';

interface Step2Props {
  formData: Partial<CreateEventFormData>;
  updateFormData: (updates: Partial<CreateEventFormData>) => void;
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

export function Step2DateTime({ formData, updateFormData }: Step2Props) {
  const [title, setTitle] = useState(formData.title || '');
  const [description, setDescription] = useState(formData.description || '');
  const [startDate, setStartDate] = useState(
    formData.start_date ? format(formData.start_date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState(
    formData.start_date ? format(formData.start_date, 'HH:mm') : '09:00'
  );
  const [duration, setDuration] = useState(60); // minutes
  const [location, setLocation] = useState(formData.location || '');
  const [type, setType] = useState<CalendarEventType>(formData.type || 'workout');
  const [color, setColor] = useState(formData.color || PRESET_COLORS[0].value);
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [newTag, setNewTag] = useState('');
  
  // Calculate end time based on duration
  const endTime = React.useMemo(() => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = addMinutes(start, duration);
      return format(end, 'HH:mm');
    } catch {
      return '10:00';
    }
  }, [startDate, startTime, duration]);
  
  // Update form data when values change
  useEffect(() => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = addMinutes(start, duration);
      
      updateFormData({
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        start_date: start,
        end_date: end,
        location: location.trim() || undefined,
        type,
        color,
        tags: tags.length > 0 ? tags : undefined,
      });
    } catch (error) {
      console.error('Error updating form data:', error);
    }
  }, [title, description, startDate, startTime, duration, location, type, color, tags]);
  
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
          Detalhes do Evento
        </h3>
        <p className="text-sm text-slate-600">
          Configure quando e onde o evento vai acontecer
        </p>
      </div>
      
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Treino de Força - Manhã"
          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
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
          placeholder="Adicione detalhes sobre o evento..."
          rows={3}
          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
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
                  <span className={`text-sm font-semibold ${
                    isSelected ? colors.text : 'text-slate-700'
                  }`}>
                    {eventType.label}
                  </span>
                  {isSelected && (
                    <div className={`ml-auto h-2 w-2 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Data *
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>
          <p className="text-xs text-slate-500">
            {format(new Date(startDate), "EEEE, d 'de' MMMM", { locale: pt })}
          </p>
        </div>
        
        {/* Start Time */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            <Clock className="inline h-4 w-4 mr-1" />
            Hora Início *
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>
      </div>
      
      {/* Duration & End Time */}
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Duração (minutos)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(15, parseInt(e.target.value) || 60))}
                min="15"
                step="15"
                className="flex-1 px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
              <div className="flex gap-1">
                {[30, 60, 90, 120].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDuration(preset)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      duration === preset
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* End Time (calculated) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Hora Fim (calculada)
            </label>
            <div className="px-4 py-2 text-sm font-semibold bg-white border-2 border-slate-200 rounded-xl text-slate-900 flex items-center justify-between">
              <span>{endTime}</span>
              <span className="text-xs text-slate-500">
                ({duration} min)
              </span>
            </div>
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
          placeholder="Ex: Ginásio Principal, Campo 1, Online..."
          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
      </div>
      
      {/* Color Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          <Palette className="inline h-4 w-4 mr-1" />
          Cor (opcional)
        </label>
        <div className="flex items-center gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setColor(preset.value)}
              className={`h-10 w-10 rounded-xl transition-all ${
                color === preset.value
                  ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
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
              className="flex-1 px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Recurring Event Editor */}
      <RecurringEventEditor
        pattern={formData.recurrence_pattern}
        onChange={(pattern) => updateFormData({ recurrence_pattern: pattern })}
      />
      
      {/* Info Box */}
      <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
            <Info className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-sky-800">
            <p className="font-semibold mb-1">Dica</p>
            <p>
              Escolha um título descritivo e adicione tags para facilitar a busca. 
              A cor ajuda a identificar visualmente diferentes tipos de eventos no calendário.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}