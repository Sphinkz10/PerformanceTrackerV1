/**
 * useEventSelection Hook
 * 
 * Gerencia a seleção múltipla de eventos no calendário
 * Usado para operações em lote (bulk operations)
 */

import { useState, useCallback, useMemo } from 'react';
import { CalendarEvent } from '@/types/calendar';

export function useEventSelection() {
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());

  /**
   * Toggle selection de um evento individual
   */
  const toggleEvent = useCallback((eventId: string) => {
    setSelectedEventIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  /**
   * Selecionar múltiplos eventos de uma vez
   */
  const selectEvents = useCallback((eventIds: string[]) => {
    setSelectedEventIds(prev => {
      const newSet = new Set(prev);
      eventIds.forEach(id => newSet.add(id));
      return newSet;
    });
  }, []);

  /**
   * Desselecionar múltiplos eventos
   */
  const deselectEvents = useCallback((eventIds: string[]) => {
    setSelectedEventIds(prev => {
      const newSet = new Set(prev);
      eventIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  }, []);

  /**
   * Selecionar todos os eventos de uma lista
   */
  const selectAll = useCallback((events: CalendarEvent[]) => {
    const allIds = events.map(e => e.id);
    setSelectedEventIds(new Set(allIds));
  }, []);

  /**
   * Limpar toda a seleção
   */
  const clearSelection = useCallback(() => {
    setSelectedEventIds(new Set());
  }, []);

  /**
   * Verificar se um evento está selecionado
   */
  const isSelected = useCallback((eventId: string) => {
    return selectedEventIds.has(eventId);
  }, [selectedEventIds]);

  /**
   * Obter array de IDs selecionados
   */
  const selectedIds = useMemo(() => {
    return Array.from(selectedEventIds);
  }, [selectedEventIds]);

  /**
   * Obter eventos selecionados de uma lista
   */
  const getSelectedEvents = useCallback((allEvents: CalendarEvent[]) => {
    return allEvents.filter(event => selectedEventIds.has(event.id));
  }, [selectedEventIds]);

  /**
   * Número de eventos selecionados
   */
  const selectedCount = selectedEventIds.size;

  /**
   * Verificar se há eventos selecionados
   */
  const hasSelection = selectedCount > 0;

  /**
   * Verificar se todos os eventos estão selecionados
   */
  const isAllSelected = useCallback((events: CalendarEvent[]) => {
    if (events.length === 0) return false;
    return events.every(event => selectedEventIds.has(event.id));
  }, [selectedEventIds]);

  /**
   * Verificar se alguns (mas não todos) eventos estão selecionados
   */
  const isSomeSelected = useCallback((events: CalendarEvent[]) => {
    if (events.length === 0) return false;
    const selectedInList = events.filter(event => selectedEventIds.has(event.id)).length;
    return selectedInList > 0 && selectedInList < events.length;
  }, [selectedEventIds]);

  /**
   * Toggle select all
   */
  const toggleSelectAll = useCallback((events: CalendarEvent[]) => {
    if (isAllSelected(events)) {
      const eventIds = events.map(e => e.id);
      deselectEvents(eventIds);
    } else {
      selectAll(events);
    }
  }, [isAllSelected, deselectEvents, selectAll]);

  /**
   * Selecionar eventos por filtro
   */
  const selectByFilter = useCallback((
    events: CalendarEvent[],
    predicate: (event: CalendarEvent) => boolean
  ) => {
    const filtered = events.filter(predicate);
    selectAll(filtered);
  }, [selectAll]);

  /**
   * Selecionar eventos de um dia específico
   */
  const selectByDate = useCallback((
    events: CalendarEvent[],
    date: Date
  ) => {
    const dateStr = date.toISOString().split('T')[0];
    selectByFilter(events, event => {
      const eventDate = new Date(event.start_time).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  }, [selectByFilter]);

  /**
   * Selecionar eventos de um tipo específico
   */
  const selectByType = useCallback((
    events: CalendarEvent[],
    eventType: string
  ) => {
    selectByFilter(events, event => event.event_type === eventType);
  }, [selectByFilter]);

  /**
   * Selecionar eventos com um atleta específico
   */
  const selectByAthlete = useCallback((
    events: CalendarEvent[],
    athleteId: string
  ) => {
    selectByFilter(events, event => 
      event.athlete_ids?.includes(athleteId) ?? false
    );
  }, [selectByFilter]);

  return {
    // State
    selectedEventIds: selectedIds,
    selectedCount,
    hasSelection,
    
    // Single selection
    toggleEvent,
    isSelected,
    
    // Multiple selection
    selectEvents,
    deselectEvents,
    selectAll,
    clearSelection,
    
    // Select all logic
    isAllSelected,
    isSomeSelected,
    toggleSelectAll,
    
    // Get selected
    getSelectedEvents,
    
    // Smart selection
    selectByFilter,
    selectByDate,
    selectByType,
    selectByAthlete,
  };
}

/**
 * Type for the hook return value
 */
export type EventSelectionState = ReturnType<typeof useEventSelection>;
