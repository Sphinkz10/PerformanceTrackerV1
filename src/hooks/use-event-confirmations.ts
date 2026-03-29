import useSWR from 'swr';
import { 
  getEventConfirmations, 
  getEventConfirmationStats,
  updateConfirmationStatus,
  markReminderSent,
  type EventConfirmation,
  type ConfirmationStats
} from '@/lib/api/calendar-confirmations';

// Hook para buscar confirmações de um evento
export function useEventConfirmations(eventId: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    eventId ? `event-confirmations-${eventId}` : null,
    () => eventId ? getEventConfirmations(eventId) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );

  return {
    confirmations: data as EventConfirmation[] | undefined,
    isLoading,
    error,
    mutate
  };
}

// Hook para estatísticas de confirmação
export function useConfirmationStats(eventId: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    eventId ? `event-confirmation-stats-${eventId}` : null,
    () => eventId ? getEventConfirmationStats(eventId) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }
  );

  return {
    stats: data as ConfirmationStats | undefined,
    isLoading,
    error,
    mutate
  };
}

// Hook com ações
export function useConfirmationActions(eventId: string | null) {
  const { mutate } = useEventConfirmations(eventId);
  const { mutate: mutateStats } = useConfirmationStats(eventId);

  const updateStatus = async (
    confirmationId: string,
    status: 'pending' | 'confirmed' | 'declined' | 'maybe',
    note?: string
  ) => {
    try {
      await updateConfirmationStatus(confirmationId, status, note);
      await mutate();
      await mutateStats();
      return true;
    } catch (error) {
      console.error('Error updating confirmation status:', error);
      throw error;
    }
  };

  const sendReminder = async (confirmationId: string) => {
    try {
      await markReminderSent(confirmationId);
      await mutate();
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  };

  return {
    updateStatus,
    sendReminder
  };
}
