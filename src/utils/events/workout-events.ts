/**
 * Workout Event Helpers - FASE 6 INTEGRATION
 * 
 * Convenience functions for dispatching workout-related events.
 * 
 * @author PerformTrack Team
 * @since Fase 6 - Integration & Automation
 */

import { EventDispatcher } from './dispatcher';

/**
 * Dispatch a workout event
 */
export async function dispatchWorkoutEvent(
  type: 'created' | 'updated' | 'duplicated',
  data: {
    workspaceId: string;
    workoutId: string;
    name: string;
    userId?: string;
    sourceWorkoutId?: string; // For duplicated
  }
): Promise<void> {
  await EventDispatcher.dispatch({
    workspaceId: data.workspaceId,
    eventType: `workout.${type}` as any,
    eventData: data,
    userId: data.userId,
  });
}

/**
 * Dispatch an athlete event
 */
export async function dispatchAthleteEvent(
  type: 'created' | 'updated' | 'deactivated',
  data: {
    workspaceId: string;
    athleteId: string;
    name: string;
    userId?: string;
  }
): Promise<void> {
  await EventDispatcher.dispatch({
    workspaceId: data.workspaceId,
    eventType: `athlete.${type}` as any,
    eventData: data,
    userId: data.userId,
  });
}
