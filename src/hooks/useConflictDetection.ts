/**
 * USE CONFLICT DETECTION HOOK
 * 
 * Detects scheduling conflicts for events:
 * - Athlete double-booking
 * - Coach double-booking
 * - Location conflicts
 * - Capacity limits
 * 
 * @module hooks/useConflictDetection
 * @created 18 Janeiro 2026
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { CreateEventFormData } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export interface ConflictEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type: string;
  athlete_ids: string[];
  coach_id: string | null;
  location: string | null;
  conflicting_athletes?: string[];
  conflict_type: 'athlete' | 'coach' | 'location' | 'capacity';
}

// ============================================================================
// MAIN HOOK - Auto-detect conflicts
// ============================================================================

export function useConflictDetection(
  workspaceId: string,
  formData: Partial<CreateEventFormData>
) {
  const [conflicts, setConflicts] = useState<ConflictEvent[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Only check if we have required data
    if (!formData.start_date || !formData.end_date || !formData.athlete_ids?.length) {
      setConflicts([]);
      return;
    }

    const checkConflicts = async () => {
      setIsChecking(true);
      try {
        const queryParams = new URLSearchParams({
          workspaceId,
          startDate: formData.start_date!.toISOString(),
          endDate: formData.end_date!.toISOString(),
          athleteIds: formData.athlete_ids!.join(','),
        });

        if (formData.coach_id) {
          queryParams.append('coachId', formData.coach_id);
        }

        if (formData.location) {
          queryParams.append('location', formData.location);
        }

        const response = await fetch(`/api/calendar-events/conflicts?${queryParams}`);
        const rawText = await response.text();

        let data: any = null;
        try {
          data = rawText ? JSON.parse(rawText) : null;
        } catch {
          data = null;
        }

        if (response.ok) {
          setConflicts(data?.conflicts || []);
        } else {
          setConflicts([]);
        }
      } catch (error) {
        console.error('Error checking conflicts:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the check
    const timeout = setTimeout(checkConflicts, 500);
    return () => clearTimeout(timeout);
  }, [
    workspaceId,
    formData.start_date,
    formData.end_date,
    formData.athlete_ids,
    formData.coach_id,
    formData.location,
  ]);

  return {
    conflictingEvents: conflicts,
    hasConflicts: conflicts.length > 0,
    isChecking,
  };
}