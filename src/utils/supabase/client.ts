import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create a singleton Supabase client instance
 * Configured with session persistence and auto token refresh
 */
export function createClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = `https://${projectId}.supabase.co`;
  
  if (!supabaseUrl || !publicAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing');
  }
  
  supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'projtrackr-auth-token',
    },
  });

  return supabaseInstance;
}

/**
 * Get the current Supabase client instance
 * @throws Error if client hasn't been initialized
 */
export function getClient(): SupabaseClient {
  if (!supabaseInstance) {
    return createClient();
  }
  return supabaseInstance;
}
