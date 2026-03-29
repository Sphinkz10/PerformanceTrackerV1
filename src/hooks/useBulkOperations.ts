/**
 * useBulkOperations Hook
 * 
 * Gerencia operações em lote no calendário:
 * - Bulk edit
 * - Bulk delete
 * - Bulk duplicate
 * - Copy week
 * - Bulk status update
 * - Batch participant management
 */

import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { toast } from 'sonner@2.0.3';

export interface BulkOperationResult {
  success: boolean;
  count: number;
  errors?: string[];
}

export interface CopyWeekOptions {
  sourceWeekStart: Date;
  targetWeekStart: Date;
  workspaceId: string;
  includeParticipants?: boolean;
  includeConfirmations?: boolean;
}

export interface BulkEditOptions {
  eventIds: string[];
  updates: Partial<CalendarEvent>;
}

export function useBulkOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Bulk Delete Events
   */
  const bulkDelete = useCallback(async (
    eventIds: string[]
  ): Promise<BulkOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar-events/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete events');
      }

      const result = await response.json();
      
      toast.success(`${result.count} evento(s) excluído(s) com sucesso! 🗑️`);
      
      return {
        success: true,
        count: result.count,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao excluir eventos';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Bulk Edit Events
   */
  const bulkEdit = useCallback(async (
    options: BulkEditOptions
  ): Promise<BulkOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar-events/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('Failed to update events');
      }

      const result = await response.json();
      
      toast.success(`${result.count} evento(s) atualizado(s)! ✏️`);
      
      return {
        success: true,
        count: result.count,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao atualizar eventos';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Bulk Duplicate Events
   */
  const bulkDuplicate = useCallback(async (
    eventIds: string[],
    offsetDays: number = 7 // Default: duplicate 1 week later
  ): Promise<BulkOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar-events/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds, offsetDays }),
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate events');
      }

      const result = await response.json();
      
      toast.success(`${result.count} evento(s) duplicado(s)! 📋`);
      
      return {
        success: true,
        count: result.count,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao duplicar eventos';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Copy Week
   * Copia todos os eventos de uma semana para outra
   */
  const copyWeek = useCallback(async (
    options: CopyWeekOptions
  ): Promise<BulkOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar-events/copy-week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('Failed to copy week');
      }

      const result = await response.json();
      
      toast.success(`Semana copiada! ${result.count} evento(s) criado(s). 📅`);
      
      return {
        success: true,
        count: result.count,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao copiar semana';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Bulk Update Status
   */
  const bulkUpdateStatus = useCallback(async (
    eventIds: string[],
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  ): Promise<BulkOperationResult> => {
    return bulkEdit({
      eventIds,
      updates: { status },
    });
  }, [bulkEdit]);

  /**
   * Bulk Add Participants
   */
  const bulkAddParticipants = useCallback(async (
    eventIds: string[],
    athleteIds: string[]
  ): Promise<BulkOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar-events/bulk-participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds, athleteIds, action: 'add' }),
      });

      if (!response.ok) {
        throw new Error('Failed to add participants');
      }

      const result = await response.json();
      
      toast.success(`Participantes adicionados a ${result.count} evento(s)! 👥`);
      
      return {
        success: true,
        count: result.count,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao adicionar participantes';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Bulk Remove Participants
   */
  const bulkRemoveParticipants = useCallback(async (
    eventIds: string[],
    athleteIds: string[]
  ): Promise<BulkOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar-events/bulk-participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds, athleteIds, action: 'remove' }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove participants');
      }

      const result = await response.json();
      
      toast.success(`Participantes removidos de ${result.count} evento(s)! 👥`);
      
      return {
        success: true,
        count: result.count,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao remover participantes';
      setError(errorMsg);
      toast.error(errorMsg);
      
      return {
        success: false,
        count: 0,
        errors: [errorMsg],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    bulkDelete,
    bulkEdit,
    bulkDuplicate,
    copyWeek,
    bulkUpdateStatus,
    bulkAddParticipants,
    bulkRemoveParticipants,
    isLoading,
    error,
  };
}
