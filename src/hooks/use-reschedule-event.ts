import { useState } from 'react';
import { toast } from 'sonner';

export function useRescheduleEvent() {
  const [isRescheduling, setIsRescheduling] = useState(false);

  const rescheduleEvent = async (
    workspaceId: string,
    eventId: string,
    newStartDate: Date,
    duration: number // in minutes
  ) => {
    setIsRescheduling(true);
    
    try {
      const endDate = new Date(newStartDate.getTime() + duration * 60000);

      const response = await fetch(`/api/calendar-events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          start_date: newStartDate.toISOString(),
          end_date: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reschedule event');
      }

      const data = await response.json();
      return data.event;
    } catch (error: any) {
      console.error('Reschedule error:', error);
      throw error;
    } finally {
      setIsRescheduling(false);
    }
  };

  return {
    rescheduleEvent,
    isRescheduling,
  };
}
