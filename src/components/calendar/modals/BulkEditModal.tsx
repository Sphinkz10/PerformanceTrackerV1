/**
 * BULK EDIT MODAL
 * 
 * Modal para editar múltiplos eventos de uma vez
 * Permite atualizar campos comuns em lote
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Edit3,
  Clock,
  MapPin,
  Users,
  Tag,
  AlertCircle,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useBulkOperations } from '@/hooks/useBulkOperations';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvents: CalendarEvent[];
  onSuccess: () => void;
}

type EditField = 
  | 'duration' 
  | 'location' 
  | 'event_type' 
  | 'status' 
  | 'notes'
  | 'requires_confirmation';

export function BulkEditModal({
  isOpen,
  onClose,
  selectedEvents,
  onSuccess,
}: BulkEditModalProps) {
  const { bulkEdit, isLoading } = useBulkOperations();
  
  const [selectedFields, setSelectedFields] = useState<Set<EditField>>(new Set());
  const [updates, setUpdates] = useState<Partial<CalendarEvent>>({});

  const eventIds = selectedEvents.map(e => e.id);
  const eventCount = selectedEvents.length;

  const handleFieldToggle = (field: EditField) => {
    setSelectedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
        // Remove from updates when field is deselected
        const newUpdates = { ...updates };
        delete newUpdates[field];
        setUpdates(newUpdates);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const handleUpdate = (field: EditField, value: any) => {
    setUpdates(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (selectedFields.size === 0) {
      return;
    }

    // Filtrar apenas os campos selecionados
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => 
        selectedFields.has(key as EditField)
      )
    );

    const result = await bulkEdit({
      eventIds,
      updates: filteredUpdates,
    });

    if (result.success) {
      onSuccess();
      onClose();
      // Reset state
      setSelectedFields(new Set());
      setUpdates({});
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <Edit3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Edição em Massa
                  </h2>
                  <p className="text-sm text-slate-600">
                    {eventCount} evento{eventCount > 1 ? 's' : ''} selecionado{eventCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Info Banner */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Atenção
                </p>
                <p className="text-xs text-amber-700">
                  Selecione os campos que deseja alterar. Apenas os campos marcados serão atualizados em todos os eventos.
                </p>
              </div>
            </div>

            {/* Fields to Edit */}
            <div className="space-y-4">
              {/* Duration */}
              <EditableField
                field="duration"
                label="Duração"
                icon={Clock}
                isSelected={selectedFields.has('duration')}
                onToggle={() => handleFieldToggle('duration')}
              >
                <input
                  type="number"
                  value={updates.duration || ''}
                  onChange={(e) => handleUpdate('duration', parseInt(e.target.value))}
                  disabled={!selectedFields.has('duration')}
                  placeholder="Minutos"
                  min="1"
                  max="480"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </EditableField>

              {/* Location */}
              <EditableField
                field="location"
                label="Local"
                icon={MapPin}
                isSelected={selectedFields.has('location')}
                onToggle={() => handleFieldToggle('location')}
              >
                <input
                  type="text"
                  value={updates.location || ''}
                  onChange={(e) => handleUpdate('location', e.target.value)}
                  disabled={!selectedFields.has('location')}
                  placeholder="Nome do local"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </EditableField>

              {/* Event Type */}
              <EditableField
                field="event_type"
                label="Tipo de Evento"
                icon={Tag}
                isSelected={selectedFields.has('event_type')}
                onToggle={() => handleFieldToggle('event_type')}
              >
                <select
                  value={updates.event_type || ''}
                  onChange={(e) => handleUpdate('event_type', e.target.value)}
                  disabled={!selectedFields.has('event_type')}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all appearance-none"
                >
                  <option value="">Selecione...</option>
                  <option value="training">Treino</option>
                  <option value="competition">Competição</option>
                  <option value="evaluation">Avaliação</option>
                  <option value="meeting">Reunião</option>
                  <option value="recovery">Recuperação</option>
                  <option value="other">Outro</option>
                </select>
              </EditableField>

              {/* Status */}
              <EditableField
                field="status"
                label="Status"
                icon={CheckCircle}
                isSelected={selectedFields.has('status')}
                onToggle={() => handleFieldToggle('status')}
              >
                <select
                  value={updates.status || ''}
                  onChange={(e) => handleUpdate('status', e.target.value)}
                  disabled={!selectedFields.has('status')}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all appearance-none"
                >
                  <option value="">Selecione...</option>
                  <option value="scheduled">Agendado</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </EditableField>

              {/* Notes */}
              <EditableField
                field="notes"
                label="Notas"
                icon={Edit3}
                isSelected={selectedFields.has('notes')}
                onToggle={() => handleFieldToggle('notes')}
              >
                <textarea
                  value={updates.notes || ''}
                  onChange={(e) => handleUpdate('notes', e.target.value)}
                  disabled={!selectedFields.has('notes')}
                  placeholder="Adicionar notas..."
                  rows={3}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                />
              </EditableField>

              {/* Requires Confirmation */}
              <EditableField
                field="requires_confirmation"
                label="Requer Confirmação"
                icon={CheckCircle}
                isSelected={selectedFields.has('requires_confirmation')}
                onToggle={() => handleFieldToggle('requires_confirmation')}
              >
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      checked={updates.requires_confirmation === true}
                      onChange={() => handleUpdate('requires_confirmation', true)}
                      disabled={!selectedFields.has('requires_confirmation')}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-slate-700">Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      checked={updates.requires_confirmation === false}
                      onChange={() => handleUpdate('requires_confirmation', false)}
                      disabled={!selectedFields.has('requires_confirmation')}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-slate-700">Não</span>
                  </label>
                </div>
              </EditableField>
            </div>

            {/* Selected Events Preview */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                Eventos que serão atualizados:
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedEvents.slice(0, 10).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 text-xs text-slate-600"
                  >
                    <Calendar className="h-3 w-3 text-sky-500" />
                    <span className="font-medium">{event.title}</span>
                    <span className="text-slate-400">•</span>
                    <span>{format(new Date(event.start_time), "dd MMM, HH:mm", { locale: pt })}</span>
                  </div>
                ))}
                {eventCount > 10 && (
                  <p className="text-xs text-slate-500 font-medium">
                    + {eventCount - 10} mais evento{eventCount - 10 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle className="h-4 w-4 text-sky-500" />
              <span>
                {selectedFields.size} campo{selectedFields.size !== 1 ? 's' : ''} selecionado{selectedFields.size !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || selectedFields.size === 0}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Atualizando...</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    <span>Atualizar {eventCount} Evento{eventCount > 1 ? 's' : ''}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Editable Field Component
 */
interface EditableFieldProps {
  field: EditField;
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function EditableField({
  field,
  label,
  icon: Icon,
  isSelected,
  onToggle,
  children,
}: EditableFieldProps) {
  return (
    <div
      className={`
        p-4 rounded-xl border-2 transition-all
        ${isSelected
          ? 'border-sky-300 bg-sky-50/50'
          : 'border-slate-200 bg-white'
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              h-8 w-8 rounded-lg flex items-center justify-center
              ${isSelected
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-500'
              }
            `}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-900">{label}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`
            h-6 w-11 rounded-full transition-all relative
            ${isSelected ? 'bg-sky-500' : 'bg-slate-300'}
          `}
        >
          <motion.div
            animate={{ x: isSelected ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-md"
          />
        </motion.button>
      </div>

      <div className={isSelected ? '' : 'opacity-50 pointer-events-none'}>
        {children}
      </div>
    </div>
  );
}
