/**
 * TEAM GROUP MODAL
 * Create and edit team groups for organizing athletes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Plus, Trash2, Save, Palette } from 'lucide-react';
import type { TeamGroup } from '@/types/team';

interface TeamGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Partial<TeamGroup>) => Promise<void>;
  existingGroup?: TeamGroup;
  athletes: { id: string; name: string; }[];
  coaches: { id: string; name: string; }[];
}

const PRESET_COLORS = [
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const CATEGORIES = [
  'U12', 'U14', 'U16', 'U18', 'U21',
  'Senior', 'Elite', 'Amateur',
  'Beginner', 'Intermediate', 'Advanced'
];

export function TeamGroupModal({
  isOpen,
  onClose,
  onSave,
  existingGroup,
  athletes,
  coaches
}: TeamGroupModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState(existingGroup?.name || '');
  const [description, setDescription] = useState(existingGroup?.description || '');
  const [color, setColor] = useState(existingGroup?.color || PRESET_COLORS[0]);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>(
    existingGroup?.athlete_ids || []
  );
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>(
    existingGroup?.coach_ids || []
  );
  const [category, setCategory] = useState(existingGroup?.meta?.category || '');
  
  const handleSave = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave({
        id: existingGroup?.id,
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        athlete_ids: selectedAthleteIds,
        coach_ids: selectedCoachIds,
        meta: {
          category: category || undefined,
        }
      });
      onClose();
    } catch (error) {
      console.error('Error saving team group:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleAthlete = (athleteId: string) => {
    setSelectedAthleteIds(prev =>
      prev.includes(athleteId)
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    );
  };
  
  const toggleCoach = (coachId: string) => {
    setSelectedCoachIds(prev =>
      prev.includes(coachId)
        ? prev.filter(id => id !== coachId)
        : [...prev, coachId]
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-slate-200 bg-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {existingGroup ? 'Editar Grupo' : 'Novo Grupo'}
                </h2>
                <p className="text-sm text-slate-600">
                  {existingGroup ? 'Atualizar grupo de atletas' : 'Criar grupo de atletas'}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="h-8 w-8 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all"
            >
              <X className="h-4 w-4 text-slate-700" />
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Informação Básica</h3>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Equipa Sub-21"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição do grupo..."
                  rows={2}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                >
                  <option value="">Selecionar categoria...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cor de Identificação
                </label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map(presetColor => (
                    <motion.button
                      key={presetColor}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setColor(presetColor)}
                      className={`h-10 w-10 rounded-xl transition-all ${
                        color === presetColor
                          ? 'ring-2 ring-offset-2 ring-slate-400'
                          : 'hover:ring-2 hover:ring-offset-2 hover:ring-slate-300'
                      }`}
                      style={{ backgroundColor: presetColor }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Athletes Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Atletas ({selectedAthleteIds.length})
                </h3>
                {selectedAthleteIds.length > 0 && (
                  <button
                    onClick={() => setSelectedAthleteIds([])}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Limpar seleção
                  </button>
                )}
              </div>
              
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-2">
                {athletes.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nenhum atleta disponível
                  </p>
                ) : (
                  athletes.map(athlete => (
                    <label
                      key={athlete.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAthleteIds.includes(athlete.id)}
                        onChange={() => toggleAthlete(athlete.id)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700">{athlete.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            
            {/* Coaches Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Treinadores ({selectedCoachIds.length})
                </h3>
                {selectedCoachIds.length > 0 && (
                  <button
                    onClick={() => setSelectedCoachIds([])}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Limpar seleção
                  </button>
                )}
              </div>
              
              <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-2">
                {coaches.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nenhum treinador disponível
                  </p>
                ) : (
                  coaches.map(coach => (
                    <label
                      key={coach.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCoachIds.includes(coach.id)}
                        onChange={() => toggleCoach(coach.id)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700">{coach.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-2 p-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancelar
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'A guardar...' : existingGroup ? 'Atualizar' : 'Criar Grupo'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
