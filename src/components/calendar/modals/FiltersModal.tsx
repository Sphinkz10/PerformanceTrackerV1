/**
 * CALENDAR FILTERS MODAL
 * Advanced filtering options for calendar events
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Filter,
  Calendar,
  Users,
  Tag,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { CalendarFilters } from '@/types/calendar';
import { toast } from 'sonner@2.0.3';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: CalendarFilters;
  onApplyFilters: (filters: CalendarFilters) => void;
}

export function FiltersModal({ 
  isOpen, 
  onClose, 
  currentFilters,
  onApplyFilters 
}: FiltersModalProps) {
  const [filters, setFilters] = useState<CalendarFilters>(currentFilters);
  
  const eventTypes = ['training', 'competition', 'evaluation', 'recovery', 'meeting', 'other'];
  const eventStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'pending'];
  
  const handleApply = () => {
    onApplyFilters(filters);
    toast.success('Filtros aplicados');
    onClose();
  };
  
  const handleClear = () => {
    const emptyFilters: CalendarFilters = {};
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    toast.success('Filtros limpos');
  };
  
  const toggleType = (type: string) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilters({ ...filters, types: newTypes });
  };
  
  const toggleStatus = (status: string) => {
    const currentStatuses = filters.statuses || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    setFilters({ ...filters, statuses: newStatuses });
  };
  
  const activeFilterCount = 
    (filters.types?.length || 0) + 
    (filters.statuses?.length || 0) +
    (filters.athleteIds?.length || 0) +
    (filters.searchQuery ? 1 : 0);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Filtrar Eventos
                  </h2>
                  <p className="text-sm text-slate-600">
                    {activeFilterCount > 0 ? `${activeFilterCount} filtro${activeFilterCount !== 1 ? 's' : ''} ativo${activeFilterCount !== 1 ? 's' : ''}` : 'Nenhum filtro aplicado'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </motion.button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Pesquisar eventos
                </label>
                <input
                  type="text"
                  value={filters.searchQuery || ''}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  placeholder="Nome do evento, descrição..."
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                />
              </div>
              
              {/* Event Types */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tipo de evento
                </label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleType(type)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                        filters.types?.includes(type)
                          ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {type === 'training' && '🏋️ Treino'}
                      {type === 'competition' && '🏆 Competição'}
                      {type === 'evaluation' && '📊 Avaliação'}
                      {type === 'recovery' && '💆 Recuperação'}
                      {type === 'meeting' && '👥 Reunião'}
                      {type === 'other' && '📌 Outro'}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Event Status */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Estado do evento
                </label>
                <div className="flex flex-wrap gap-2">
                  {eventStatuses.map((status) => (
                    <motion.button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleStatus(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                        filters.statuses?.includes(status)
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {status === 'scheduled' && '📅 Agendado'}
                      {status === 'confirmed' && '✅ Confirmado'}
                      {status === 'completed' && '✓ Concluído'}
                      {status === 'cancelled' && '❌ Cancelado'}
                      {status === 'pending' && '⏳ Pendente'}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Quick Filters */}
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Filtros rápidos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilters({ ...filters, dateRange: 'today' })}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all text-left ${
                      filters.dateRange === 'today'
                        ? 'bg-sky-50 border-2 border-sky-500 text-sky-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    📆 Hoje
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilters({ ...filters, dateRange: 'this-week' })}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all text-left ${
                      filters.dateRange === 'this-week'
                        ? 'bg-sky-50 border-2 border-sky-500 text-sky-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    📅 Esta Semana
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilters({ ...filters, dateRange: 'this-month' })}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all text-left ${
                      filters.dateRange === 'this-month'
                        ? 'bg-sky-50 border-2 border-sky-500 text-sky-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    📊 Este Mês
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilters({ ...filters, showOnlyMyEvents: !filters.showOnlyMyEvents })}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all text-left ${
                      filters.showOnlyMyEvents
                        ? 'bg-amber-50 border-2 border-amber-500 text-amber-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
                    }`}
                  >
                    👤 Meus Eventos
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between gap-2 p-6 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
              >
                Limpar Filtros
              </motion.button>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-violet-500 transition-all"
                >
                  Aplicar Filtros
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
