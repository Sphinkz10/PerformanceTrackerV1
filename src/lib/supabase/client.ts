/**
 * Supabase Client - Browser & Server
 * 
 * Provides Supabase client for browser and server-side operations.
 * Uses inline configuration to avoid "process is not defined" errors.
 * 
 * @author PerformTrack Team
 * @since Migration to Real Data - Day 1
 */

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = (() => {
  try {
    // @ts-ignore
    return import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  } catch {
    return '';
  }
})();

const SUPABASE_ANON_KEY = (() => {
  try {
    // @ts-ignore
    return import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  } catch {
    return '';
  }
})();

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  const isConfigured = !!(
    SUPABASE_URL &&
    SUPABASE_URL.includes('supabase.co') &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY.length > 20
  );

  if (!isConfigured && typeof window !== 'undefined') {
    console.warn('⚠️ Supabase not configured - using mock authentication');
    console.warn('To enable real data: configure .env.local with Supabase credentials');
  }

  return isConfigured;
};

/**
 * Create Supabase client (singleton)
 */
let _supabaseClient: SupabaseClient<Database> | null = null;

const getBrowserClient = (): SupabaseClient<Database> => {
  // Prevent multiple instances during development (HMR)
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window._supabaseClient) {
      // @ts-ignore
      return window._supabaseClient;
    }
  }

  if (_supabaseClient) {
    return _supabaseClient;
  }

  const url = SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = SUPABASE_ANON_KEY || 'placeholder-key';

  const client = createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'performtrack-auth',
    },
  });

  _supabaseClient = client;

  if (typeof window !== 'undefined') {
    // @ts-ignore
    window._supabaseClient = client;
  }

  return client;
};

/**
 * Browser Supabase Client
 * Use this in client-side components
 * 
 * Example:
 * ```ts
 * import { supabase } from '@/lib/supabase/client';
 * const { data } = await supabase.from('users').select('*');
 * ```
 */
export const supabase = getBrowserClient();

/**
 * Server Supabase Client (Admin)
 * Use this for server-side operations that need elevated privileges
 * 
 * ⚠️ WARNING: Only use in server-side code (API routes, getServerSideProps)
 * Never expose service key to client!
 * 
 * Example:
 * ```ts
 * // In API route
 * export default async function handler(req, res) {
 *   const supabase = createServerClient();
 *   const { data } = await supabase.from('users').select('*');
 * }
 * ```
 */
export const createServerClient = (): SupabaseClient<Database> => {
  const url = SUPABASE_URL || 'https://placeholder.supabase.co';
  let key = SUPABASE_ANON_KEY || 'placeholder-key';

  // Try to get service key (only available on server)
  if (typeof window === 'undefined') {
    try {
      // @ts-ignore
      const serviceKey = process.env.SUPABASE_SERVICE_KEY;
      if (serviceKey) {
        key = serviceKey;
      }
    } catch {
      // Use anon key as fallback
    }
  }

  return createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

/**
 * Get current session
 * Returns null if Supabase not configured
 * 
 * Example:
 * ```ts
 * const { session, error } = await getSession();
 * if (session) {
 *   console.log('User:', session.user.email);
 * }
 * ```
 */
export const getSession = async () => {
  if (!isSupabaseConfigured()) {
    return { session: null, error: null };
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    console.error('Failed to get session:', error);
    return { session: null, error };
  }
};

/**
 * Get current user
 * Returns null if Supabase not configured
 * 
 * Example:
 * ```ts
 * const { user, error } = await getCurrentUser();
 * if (user) {
 *   console.log('User email:', user.email);
 * }
 * ```
 */
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    return { user: null, error: null };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Failed to get user:', error);
    return { user: null, error };
  }
};
