/**
 * USE TEAM GROUPS HOOK
 * Hook for managing team groups and bulk operations
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import type { TeamGroup, TeamAnalytics, BulkTeamOperation } from '@/types/team';

interface UseTeamGroupsReturn {
  // State
  groups: TeamGroup[];
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  createGroup: (group: Partial<TeamGroup>) => Promise<TeamGroup>;
  updateGroup: (id: string, updates: Partial<TeamGroup>) => Promise<TeamGroup>;
  deleteGroup: (id: string) => Promise<void>;
  getGroupAnalytics: (groupId: string, dateRange: { start: string; end: string }) => Promise<TeamAnalytics>;
  bulkSchedule: (operation: BulkTeamOperation) => Promise<{ success: number; failed: number; conflicts: number; created_events: string[] }>;
  
  // Utils
  refreshGroups: () => Promise<void>;
}

export function useTeamGroups(workspaceId: string): UseTeamGroupsReturn {
  const [groups, setGroups] = useState<TeamGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch all groups
  const refreshGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/calendar/team-groups?workspace_id=${workspaceId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch team groups');
      }
      
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      toast.error('Erro ao carregar grupos');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);
  
  // Create new group
  const createGroup = useCallback(async (group: Partial<TeamGroup>): Promise<TeamGroup> => {
    try {
      const response = await fetch('/api/calendar/team-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...group,
          workspace_id: workspaceId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create team group');
      }
      
      const { group: newGroup } = await response.json();
      
      setGroups(prev => [...prev, newGroup]);
      toast.success(`Grupo "${newGroup.name}" criado com sucesso!`);
      
      return newGroup;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('Erro ao criar grupo');
      throw error;
    }
  }, [workspaceId]);
  
  // Update existing group
  const updateGroup = useCallback(async (
    id: string,
    updates: Partial<TeamGroup>
  ): Promise<TeamGroup> => {
    try {
      const response = await fetch(`/api/calendar/team-groups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update team group');
      }
      
      const { group: updatedGroup } = await response.json();
      
      setGroups(prev => prev.map(g => g.id === id ? updatedGroup : g));
      toast.success('Grupo atualizado com sucesso!');
      
      return updatedGroup;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('Erro ao atualizar grupo');
      throw error;
    }
  }, []);
  
  // Delete group
  const deleteGroup = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/calendar/team-groups/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team group');
      }
      
      setGroups(prev => prev.filter(g => g.id !== id));
      toast.success('Grupo eliminado com sucesso!');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('Erro ao eliminar grupo');
      throw error;
    }
  }, []);
  
  // Get analytics for a group
  const getGroupAnalytics = useCallback(async (
    groupId: string,
    dateRange: { start: string; end: string }
  ): Promise<TeamAnalytics> => {
    try {
      const params = new URLSearchParams({
        start_date: dateRange.start,
        end_date: dateRange.end,
      });
      
      const response = await fetch(
        `/api/calendar/team-groups/${groupId}/analytics?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const { analytics } = await response.json();
      return analytics;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('Erro ao carregar analytics');
      throw error;
    }
  }, []);
  
  // Bulk schedule events
  const bulkSchedule = useCallback(async (
    operation: BulkTeamOperation
  ): Promise<{ success: number; failed: number; conflicts: number; created_events: string[] }> => {
    try {
      const response = await fetch('/api/calendar/team-groups/bulk-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation),
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk schedule events');
      }
      
      const result = await response.json();
      
      toast.success(
        `${result.success} eventos criados com sucesso!`,
        {
          description: result.conflicts > 0
            ? `${result.conflicts} conflitos ignorados`
            : undefined
        }
      );
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('Erro ao criar eventos em massa');
      throw error;
    }
  }, []);
  
  // Auto-fetch on mount
  React.useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);
  
  return {
    groups,
    isLoading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupAnalytics,
    bulkSchedule,
    refreshGroups,
  };
}
