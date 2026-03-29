import { useState, useMemo } from 'react';

interface CalendarFilters {
  search: string;
  types: string[];
  statuses: string[];
  athleteIds: string[];
}

export function useCalendarFilters(events: any[] = []) {
  const [filters, setFilters] = useState<CalendarFilters>({
    search: '',
    types: [],
    statuses: [],
    athleteIds: []
  });

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    let result = [...events];

    // Filtro de busca (título, descrição, localização)
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(event => 
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de tipo
    if (filters.types.length > 0) {
      result = result.filter(event => 
        filters.types.includes(event.type)
      );
    }

    // Filtro de status
    if (filters.statuses.length > 0) {
      result = result.filter(event => 
        filters.statuses.includes(event.status)
      );
    }

    // Filtro de atleta
    if (filters.athleteIds.length > 0) {
      result = result.filter(event => {
        if (!event.athlete_ids || event.athlete_ids.length === 0) return false;
        return filters.athleteIds.some(id => event.athlete_ids.includes(id));
      });
    }

    return result;
  }, [events, filters]);

  // Handlers
  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const setTypes = (types: string[]) => {
    setFilters(prev => ({ ...prev, types }));
  };

  const setStatuses = (statuses: string[]) => {
    setFilters(prev => ({ ...prev, statuses }));
  };

  const setAthleteIds = (athleteIds: string[]) => {
    setFilters(prev => ({ ...prev, athleteIds }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      types: [],
      statuses: [],
      athleteIds: []
    });
  };

  const hasActiveFilters = 
    filters.search.trim() !== '' ||
    filters.types.length > 0 ||
    filters.statuses.length > 0 ||
    filters.athleteIds.length > 0;

  return {
    filters,
    filteredEvents,
    setSearch,
    setTypes,
    setStatuses,
    setAthleteIds,
    clearFilters,
    hasActiveFilters
  };
}
