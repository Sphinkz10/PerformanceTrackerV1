/**
 * EDIT EVENT FORM
 * Form to edit event details
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag,
  Palette,
  Plus,
  X
} from 'lucide-react';
import { format, addMinutes, differenceInMinutes } from 'date-fns';
import { CalendarEvent, CalendarEventType, EVENT_TYPE_COLORS } from '@/types/calendar';

interface EditEventFormProps {
  event: CalendarEvent;
  editedData: Partial<CalendarEvent>;
  setEditedData: (data: Partial<CalendarEvent>) => void;
  workspaceId: string;
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

export function EditEventForm({ event, editedData, setEditedData, workspaceId }: EditEventFormProps) {
  const [newTag, setNewTag] = useState('');
  
  const startDate = editedData.start_date 
    ? format(new Date(editedData.start_date), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');
    
  const startTime = editedData.start_date
    ? format(new Date(editedData.start_date), 'HH:mm')
    : '09:00';
    
  const duration = editedData.start_date && editedData.end_date
    ? Math.round((new Date(editedData.end_date).getTime() - new Date(editedData.start_date).getTime()) / 60000)
    : 60;
  
  const endTime = useMemo(() => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = addMinutes(start, duration);
      return format(end, 'HH:mm');
    } catch {
      return '10:00';
    }
  }, [startDate, startTime, duration]);
  
  const handleFieldChange = (field: string, value: any) => {
    setEditedData({ ...editedData, [field]: value });
  };
  
  const handleDateChange = (newDate: string) => {
    const start = new Date(`${newDate}T${startTime}`);
    const end = addMinutes(start, duration);
    setEditedData({
      ...editedData,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    });
  };
  
  const handleTimeChange = (newTime: string) => {
    const start = new Date(`${startDate}T${newTime}`);
    const end = addMinutes(start, duration);
    setEditedData({
      ...editedData,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    });
  };
  
  const handleDurationChange = (newDuration: number) => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = addMinutes(start, newDuration);
    setEditedData({
      ...editedData,
      end_date: end.toISOString(),
    });
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !editedData.tags?.includes(newTag.trim())) {
      setEditedData({
        ...editedData,
        tags: [...(editedData.tags || []), newTag.trim()],
      });
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setEditedData({
      ...editedData,
      tags: editedData.tags?.filter(t => t !== tagToRemove),
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Título *
        </label>
        <input
          type="text"
          value={editedData.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Descrição
        </label>
        <textarea
          value={editedData.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
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
            const isSelected = editedData.type === eventType.value;
            const colors = EVENT_TYPE_COLORS[eventType.value];
            
            return (
              <motion.button
                key={eventType.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFieldChange('type', eventType.value)}
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
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Data *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
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
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>
      </div>
      
      {/* Duration */}
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Duração (minutos)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => handleDurationChange(Math.max(15, parseInt(e.target.value) || 60))}
                min="15"
                step="15"
                className="flex-1 px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
              <div className="flex gap-1">
                {[30, 60, 90, 120].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleDurationChange(preset)}
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
          value={editedData.location || ''}
          onChange={(e) => handleFieldChange('location', e.target.value)}
          placeholder="Ex: Ginásio Principal, Campo 1..."
          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
        />
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
              onClick={() => handleFieldChange('color', preset.value)}
              className={`h-10 w-10 rounded-xl transition-all ${
                editedData.color === preset.value
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
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
          
          {editedData.tags && editedData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {editedData.tags.map((tag) => (
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
    </motion.div>
  );
}