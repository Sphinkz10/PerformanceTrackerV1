/**
 * NOTIFICATION PREFERENCES HOOK
 * 
 * Custom hook for fetching and updating user notification preferences
 * Uses SWR for caching and optimistic updates
 * 
 * @module hooks/useNotificationPreferences
 * @created 20 Janeiro 2026
 * @version 1.0.0
 */

import useSWR from 'swr';
import { useState } from 'react';
import type { NotificationPreferences, CategorySettings, QuietHours } from '@/types/notifications';

// ============================================================================
// TYPES
// ============================================================================

interface UseNotificationPreferencesOptions {
  workspaceId: string;
  userId: string;
  enabled?: boolean;
}

interface UpdatePreferencesPayload {
  enabled?: boolean;
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  categorySettings?: Partial<CategorySettings>;
  quietHours?: QuietHours;
  digestEnabled?: boolean;
  digestFrequency?: 'hourly' | 'daily' | 'weekly';
  digestTime?: string;
}

// ============================================================================
// FETCHER
// ============================================================================

const fetcher = async (url: string): Promise<NotificationPreferences> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch notification preferences');
  }
  
  const data = await response.json();
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    workspaceId: data.workspace_id,
    userId: data.user_id,
    enabled: data.enabled,
    inAppEnabled: data.in_app_enabled,
    emailEnabled: data.email_enabled,
    pushEnabled: data.push_enabled,
    categorySettings: data.category_settings,
    quietHours: data.quiet_hours,
    digestEnabled: data.digest_enabled,
    digestFrequency: data.digest_frequency,
    digestTime: data.digest_time,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook to fetch and manage user notification preferences
 * 
 * @example
 * ```tsx
 * const { preferences, isLoading, updatePreferences } = useNotificationPreferences({
 *   workspaceId: 'workspace-123',
 *   userId: 'user-456',
 * });
 * 
 * // Toggle email notifications
 * await updatePreferences({ emailEnabled: true });
 * 
 * // Update category settings
 * await updatePreferences({
 *   categorySettings: { pain: false, session: true }
 * });
 * ```
 */
export function useNotificationPreferences(options: UseNotificationPreferencesOptions) {
  const { workspaceId, userId, enabled = true } = options;
  const [isUpdating, setIsUpdating] = useState(false);

  // Build API URL
  const url = enabled
    ? `/api/notifications/preferences?workspaceId=${workspaceId}&userId=${userId}`
    : null;

  // Fetch preferences with SWR
  const {
    data: preferences,
    error,
    isLoading,
    mutate,
  } = useSWR<NotificationPreferences>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000, // 30 seconds
  });

  /**
   * Update notification preferences
   */
  const updatePreferences = async (updates: UpdatePreferencesPayload) => {
    if (!preferences) return;

    setIsUpdating(true);

    try {
      // Optimistic update
      const optimisticData: NotificationPreferences = {
        ...preferences,
        ...updates,
        categorySettings: {
          ...preferences.categorySettings,
          ...(updates.categorySettings || {}),
        },
        quietHours: updates.quietHours || preferences.quietHours,
        updatedAt: new Date(),
      };

      // Update locally first
      await mutate(optimisticData, false);

      // Transform camelCase to snake_case for API
      const payload = {
        workspaceId,
        userId,
        enabled: updates.enabled,
        in_app_enabled: updates.inAppEnabled,
        email_enabled: updates.emailEnabled,
        push_enabled: updates.pushEnabled,
        category_settings: updates.categorySettings,
        quiet_hours: updates.quietHours,
        digest_enabled: updates.digestEnabled,
        digest_frequency: updates.digestFrequency,
        digest_time: updates.digestTime,
      };

      // Remove undefined fields
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      // Send to API
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const data = await response.json();

      // Revalidate with server response
      await mutate(fetcher(`/api/notifications/preferences?workspaceId=${workspaceId}&userId=${userId}`));
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Revert optimistic update
      await mutate();
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Toggle a specific category
   */
  const toggleCategory = async (category: keyof CategorySettings) => {
    if (!preferences) return;

    await updatePreferences({
      categorySettings: {
        [category]: !preferences.categorySettings[category],
      },
    });
  };

  /**
   * Toggle global notifications
   */
  const toggleNotifications = async () => {
    if (!preferences) return;

    await updatePreferences({
      enabled: !preferences.enabled,
    });
  };

  /**
   * Toggle email notifications
   */
  const toggleEmail = async () => {
    if (!preferences) return;

    await updatePreferences({
      emailEnabled: !preferences.emailEnabled,
    });
  };

  /**
   * Toggle push notifications
   */
  const togglePush = async () => {
    if (!preferences) return;

    await updatePreferences({
      pushEnabled: !preferences.pushEnabled,
    });
  };

  /**
   * Update quiet hours
   */
  const updateQuietHours = async (quietHours: QuietHours) => {
    await updatePreferences({ quietHours });
  };

  return {
    preferences,
    isLoading,
    isUpdating,
    error,
    updatePreferences,
    toggleCategory,
    toggleNotifications,
    toggleEmail,
    togglePush,
    updateQuietHours,
    refetch: mutate,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default useNotificationPreferences;
