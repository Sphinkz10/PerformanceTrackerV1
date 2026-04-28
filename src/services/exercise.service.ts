import type { ExerciseDraft, ExerciseVersion } from '../domain/exercise/entities'
import { buildFieldMap } from '../domain/semantic/registry'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory fallback when Supabase is not configured
const localDrafts = new Map<string, ExerciseDraft>()
const localVersions: ExerciseVersion[] = []

export const exerciseService = {
  /**
   * Save exercise draft — persists to Supabase `exercise_drafts` table,
   * falls back to in-memory store when Supabase is not configured.
   */
  async saveDraft(draft: ExerciseDraft): Promise<{ id: string }> {
    const id = draft.id || crypto.randomUUID()

    if (isSupabaseConfigured()) {
      const payload = {
        id,
        name: draft.identity.name,
        category: draft.identity.category || 'other',
        primary_muscle: draft.identity.primaryMuscle,
        secondary_muscles: draft.identity.secondaryMuscles,
        equipment: draft.identity.equipment,
        icon: draft.identity.icon,
        description: draft.identity.description,
        difficulty: draft.difficulty,
        base_fields: draft.baseFields as any,
        custom_fields: draft.customFields as any,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('exercise_drafts')
        .upsert(payload, { onConflict: 'id' })

      if (error) {
        console.error('[ExerciseService] Supabase saveDraft error:', error)
        // Fallback to local
        localDrafts.set(id, { ...draft, id })
        return { id }
      }
    } else {
      await delay(300)
      localDrafts.set(id, { ...draft, id })
    }

    return { id }
  },

  /**
   * Publish exercise — creates an immutable ExerciseVersion in Supabase
   * `exercise_versions` table with a frozen fieldMap for runtime consumption.
   */
  async publish(draft: ExerciseDraft): Promise<{ exerciseId: string; versionId: string }> {
    const exerciseId = draft.id || crypto.randomUUID()
    const versionId = crypto.randomUUID()

    const version: ExerciseVersion = {
      id: versionId,
      exerciseId,
      baseFields: draft.baseFields,
      customFields: draft.customFields,
      fieldMap: buildFieldMap(draft.baseFields, draft.customFields),
      createdAt: new Date(),
    }

    if (isSupabaseConfigured()) {
      const payload = {
        id: versionId,
        exercise_id: exerciseId,
        base_fields: version.baseFields as any,
        custom_fields: version.customFields as any,
        field_map: version.fieldMap as any,
        created_at: version.createdAt.toISOString(),
      }

      const { error } = await supabase
        .from('exercise_versions')
        .insert(payload)

      if (error) {
        console.error('[ExerciseService] Supabase publish error:', error)
        localVersions.push(version)
      }
    } else {
      await delay(500)
      localVersions.push(version)
    }

    return { exerciseId, versionId }
  },

  /**
   * Get a specific published version.
   */
  async getVersion(versionId: string): Promise<ExerciseVersion | undefined> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('exercise_versions')
        .select('*')
        .eq('id', versionId)
        .maybeSingle()

      if (error || !data) {
        return localVersions.find(v => v.id === versionId)
      }

      return {
        id: data.id,
        exerciseId: data.exercise_id,
        baseFields: data.base_fields as any,
        customFields: data.custom_fields as any,
        fieldMap: data.field_map as any,
        createdAt: new Date(data.created_at),
      }
    }

    return localVersions.find(v => v.id === versionId)
  },

  /**
   * List all exercise drafts for the current user.
   */
  async listDrafts(): Promise<ExerciseDraft[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('exercise_drafts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('[ExerciseService] listDrafts error:', error)
        return Array.from(localDrafts.values())
      }

      return (data || []).map(row => ({
        id: row.id,
        identity: {
          name: row.name,
          category: row.category,
          primaryMuscle: row.primary_muscle,
          secondaryMuscles: row.secondary_muscles || [],
          equipment: row.equipment || [],
          icon: row.icon || '🏋️',
          description: row.description || '',
        },
        difficulty: row.difficulty || 3,
        baseFields: row.base_fields as any || [],
        customFields: row.custom_fields as any || [],
      }))
    }

    return Array.from(localDrafts.values())
  },

  /**
   * Delete an exercise draft.
   */
  async deleteDraft(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('exercise_drafts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[ExerciseService] deleteDraft error:', error)
      }
    }

    localDrafts.delete(id)
  },
}
