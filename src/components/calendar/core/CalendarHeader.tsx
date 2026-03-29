/**
 * CALENDAR HEADER
 * Navigation, view selector, filters, and actions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Download,
  Settings,
  Upload,
  BarChart3,
  Repeat,
  Edit,
  Trash2,
  BellRing,
  ChevronDown,
  Dumbbell,
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useCalendar } from './CalendarProvider';
import { CalendarView } from '@/types/calendar';
import { NotificationCenter } from '../components/NotificationCenter';

export function CalendarHeader() {
  const {
    view,
    setView,
    currentDate,
    goToToday,
    goToPrevious,
    goToNext,
    setIsCreateModalOpen,
    setIsSettingsModalOpen,
    setIsExportModalOpen,
    setIsFiltersModalOpen,
    setIsDesignStudioOpen, // Add this
    // NEW states
    setIsImportModalOpen,
    setIsExportV2ModalOpen,
    setIsRecurringModalOpen,
    setIsBulkEditModalOpen,
    setIsBulkDeleteModalOpen,
    setIsPendingConfirmationsOpen,
    setIsAnalyticsOpen,
    setIsAthleteAvailabilityOpen,
    selectedEvents,
  } = useCalendar();
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Format date based on view
  const getDateLabel = () => {
    switch (view) {
      case 'day':
        return format(currentDate, "d 'de' MMMM, yyyy", { locale: pt });
      case 'week':
        return `Semana ${format(currentDate, 'w, MMMM yyyy', { locale: pt })}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: pt });
      case 'agenda':
        return 'Agenda';
      case 'team':
        return 'Equipa';
      default:
        return '';
    }
  };
  
  const views: { id: CalendarView; label: string; emoji: string }[] = [
    { id: 'week', label: 'Semana', emoji: '📅' },
    { id: 'agenda', label: 'Agenda', emoji: '📋' },
    { id: 'day', label: 'Dia', emoji: '📆' },
    { id: 'month', label: 'Mês', emoji: '📊' },
    { id: 'team', label: 'Equipa', emoji: '👥' },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Top row: Title + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Calendário
            </h1>
            <p className="text-sm text-slate-600">
              Gerir sessões e eventos
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* NotificationCenter */}
          <NotificationCenter 
            workspaceId="workspace-demo" 
            userId="user-demo"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Evento
          </motion.button>
          
          {/* Mobile: Just icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
          >
            <Plus className="h-5 w-5" />
          </motion.button>
          
          {/* Design Studio Button - HIGH PRIORITY */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDesignStudioOpen(true)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white text-violet-700 hover:border-violet-400 hover:shadow-lg transition-all"
          >
            <Dumbbell className="h-4 w-4" />
            <span className="hidden lg:inline">Design Studio</span>
          </motion.button>
          
          {/* Dropdown "Mais" */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Mais</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            {/* Dropdown menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl z-50"
                  >
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setIsImportModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Importar Eventos
                      </button>
                      <button
                        onClick={() => {
                          setIsExportV2ModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Exportar Avançado
                      </button>
                      <button
                        onClick={() => {
                          setIsRecurringModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Repeat className="h-4 w-4" />
                        Evento Recorrente
                      </button>
                      <button
                        onClick={() => {
                          setIsPendingConfirmationsOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <BellRing className="h-4 w-4" />
                        Confirmações Pendentes
                      </button>
                      <button
                        onClick={() => {
                          setIsAnalyticsOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Analytics Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsAthleteAvailabilityOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        Disponibilidade Atletas
                      </button>
                      
                      {selectedEvents.length > 0 && (
                        <>
                          <div className="h-px bg-slate-200 my-1" />
                          <button
                            onClick={() => {
                              setIsBulkEditModalOpen(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            Editar Selecionados ({selectedEvents.length})
                          </button>
                          <button
                            onClick={() => {
                              setIsBulkDeleteModalOpen(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar Selecionados ({selectedEvents.length})
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center justify-center h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
          >
            <Settings className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Bottom row: Navigation + View selector + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            className="flex items-center justify-center h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToToday}
            className="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all min-w-[200px] text-center"
          >
            {getDateLabel()}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="flex items-center justify-center h-10 w-10 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToToday}
            className="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
          >
            Hoje
          </motion.button>
        </div>
        
        {/* View selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {views.map((v) => (
            <motion.button
              key={v.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                view === v.id
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <span className="text-lg">{v.emoji}</span>
              {v.label}
            </motion.button>
          ))}
        </div>
        
        {/* Filters button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFiltersModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 transition-all"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </motion.button>
      </div>
    </motion.div>
  );
}