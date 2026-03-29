/**
 * BULK ASSIGN MODAL
 * Assign coaches/resources to multiple events
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Users, User, MapPin, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { CalendarEvent } from '@/types/calendar';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvents: CalendarEvent[];
  workspaceId: string;
  onSuccess?: () => void;
}

// Mock data - in real app would come from API
const MOCK_COACHES = [
  { id: 'coach-1', name: 'João Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach1', role: 'Treinador Principal' },
  { id: 'coach-2', name: 'Maria Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach2', role: 'Treinador Adjunto' },
  { id: 'coach-3', name: 'Pedro Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach3', role: 'Preparador Físico' },
  { id: 'coach-4', name: 'Ana Ferreira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach4', role: 'Fisioterapeuta' },
];

const MOCK_RESOURCES = [
  { id: 'resource-1', name: 'Campo Principal', type: 'Espaço', icon: '🏟️' },
  { id: 'resource-2', name: 'Ginásio', type: 'Espaço', icon: '🏋️' },
  { id: 'resource-3', name: 'Piscina', type: 'Espaço', icon: '🏊' },
  { id: 'resource-4', name: 'Sala de Reuniões', type: 'Espaço', icon: '🏢' },
  { id: 'resource-5', name: 'Autocarro', type: 'Transporte', icon: '🚌' },
  { id: 'resource-6', name: 'Kit Médico', type: 'Equipamento', icon: '⚕️' },
];

type AssignType = 'coaches' | 'resources';

export function BulkAssignModal({
  isOpen,
  onClose,
  selectedEvents,
  workspaceId,
  onSuccess,
}: BulkAssignModalProps) {
  const [assignType, setAssignType] = useState<AssignType>('coaches');
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [action, setAction] = useState<'add' | 'replace'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleCoach = (coachId: string) => {
    setSelectedCoaches((prev) =>
      prev.includes(coachId)
        ? prev.filter((c) => c !== coachId)
        : [...prev, coachId]
    );
  };

  const toggleResource = (resourceId: string) => {
    setSelectedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((r) => r !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleApply = async () => {
    if (selectedEvents.length === 0) {
      toast.error('Nenhum evento selecionado');
      return;
    }

    const selectedItems =
      assignType === 'coaches' ? selectedCoaches : selectedResources;

    if (selectedItems.length === 0) {
      toast.error(
        assignType === 'coaches'
          ? 'Selecione pelo menos um treinador'
          : 'Selecione pelo menos um recurso'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePromises = selectedEvents.map(async (event) => {
        let updateData: any = {};

        if (assignType === 'coaches') {
          if (action === 'add') {
            // Add to existing coaches
            const existingCoaches = event.metadata?.assigned_coaches || [];
            updateData.metadata = {
              ...event.metadata,
              assigned_coaches: [...new Set([...existingCoaches, ...selectedCoaches])],
            };
          } else {
            // Replace coaches
            updateData.metadata = {
              ...event.metadata,
              assigned_coaches: selectedCoaches,
            };
          }
        } else {
          if (action === 'add') {
            // Add to existing resources
            const existingResources = event.metadata?.assigned_resources || [];
            updateData.metadata = {
              ...event.metadata,
              assigned_resources: [...new Set([...existingResources, ...selectedResources])],
            };
          } else {
            // Replace resources
            updateData.metadata = {
              ...event.metadata,
              assigned_resources: selectedResources,
            };
          }
        }

        const response = await fetch(`/api/workspaces/${workspaceId}/calendar-events`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            ...updateData,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar evento: ${event.title}`);
        }

        return response.json();
      });

      await Promise.all(updatePromises);

      const itemType = assignType === 'coaches' ? 'treinadores' : 'recursos';
      const actionText = action === 'add' ? 'adicionados' : 'substituídos';

      toast.success(
        `${itemType} ${actionText} em ${selectedEvents.length} evento(s)!`
      );

      // Refresh calendar
      mutate((key) => typeof key === 'string' && key.includes('/calendar-events'));

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Bulk assign error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atribuir');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedCoaches([]);
      setSelectedResources([]);
      setAction('add');
    }
  };

  const selectedItems =
    assignType === 'coaches' ? selectedCoaches : selectedResources;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Atribuir Recursos
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
          {/* Assign Type Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setAssignType('coaches')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                assignType === 'coaches'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
              }`}
            >
              <User className="h-4 w-4" />
              Treinadores
            </button>
            <button
              onClick={() => setAssignType('resources')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                assignType === 'resources'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
              }`}
            >
              <MapPin className="h-4 w-4" />
              Recursos
            </button>
          </div>

          {/* Action Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Ação</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAction('add')}
                disabled={isSubmitting}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                  action === 'add'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-600 shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                ➕ Adicionar aos existentes
              </button>
              <button
                onClick={() => setAction('replace')}
                disabled={isSubmitting}
                className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                  action === 'replace'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                }`}
              >
                🔄 Substituir todos
              </button>
            </div>
          </div>

          {/* Coaches List */}
          {assignType === 'coaches' && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Selecionar Treinadores
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_COACHES.map((coach) => (
                  <button
                    key={coach.id}
                    onClick={() => toggleCoach(coach.id)}
                    disabled={isSubmitting}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCoaches.includes(coach.id)
                        ? 'bg-emerald-50 border-emerald-500 shadow-md'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {coach.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {coach.role}
                      </p>
                    </div>
                    {selectedCoaches.includes(coach.id) && (
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources List */}
          {assignType === 'resources' && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Selecionar Recursos
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_RESOURCES.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => toggleResource(resource.id)}
                    disabled={isSubmitting}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedResources.includes(resource.id)
                        ? 'bg-emerald-50 border-emerald-500 shadow-md'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">
                      {resource.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {resource.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {resource.type}
                      </p>
                    </div>
                    {selectedResources.includes(resource.id) && (
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <AlertCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900">
                {action === 'add'
                  ? 'Os itens selecionados serão adicionados aos eventos, mantendo as atribuições existentes.'
                  : 'Todas as atribuições existentes serão substituídas pelos itens selecionados.'}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                {selectedItems.length} item(ns) selecionado(s) • {selectedEvents.length} evento(s)
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
            disabled={isSubmitting || selectedItems.length === 0 || selectedEvents.length === 0}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Aplicando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Aplicar Atribuições
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
