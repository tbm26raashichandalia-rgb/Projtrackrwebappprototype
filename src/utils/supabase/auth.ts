import { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from './client';
import { projectId, publicAnonKey } from './info';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  avatar_url?: string;
  accessToken: string;
}

/**
 * Get the currently authenticated user
 * @returns AuthUser if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Get current user error:', error.message);
      return null;
    }

    if (!session?.user) {
      return null;
    }

    return mapSupabaseUser(session.user, session.access_token);
  } catch (error) {
    console.error('Get current user exception:', error);
    return null;
  }
}

/**
 * Sign up a new user with email and password
 * @param email User's email address
 * @param password User's password (min 8 characters)
 * @param full_name Optional full name for the user
 * @returns AuthUser on success, null on failure
 */
export async function signUp(
  email: string, 
  password: string, 
  full_name?: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    // Create user via server endpoint (which auto-confirms email)
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5f69ad58/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        name: email.split('@')[0],
        full_name: full_name || email.split('@')[0],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: data.error || 'Signup failed' };
    }

    // Now sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { user: null, error: signInError.message };
    }

    if (!signInData.session?.user) {
      return { user: null, error: 'No session created' };
    }

    return {
      user: mapSupabaseUser(signInData.session.user, signInData.session.access_token),
      error: null,
    };
  } catch (error) {
    console.error('Signup exception:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign in an existing user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns AuthUser on success, null on failure
 */
export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.session?.user) {
      return { user: null, error: 'No session created' };
    }

    return {
      user: mapSupabaseUser(data.session.user, data.session.access_token),
      error: null,
    };
  } catch (error) {
    console.error('Sign in exception:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Send a password reset email
 * @param email User's email address
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Reset password exception:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Listen to auth state changes
 * @param callback Function to call when auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const supabase = createClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback(mapSupabaseUser(session.user, session.access_token));
    } else {
      callback(null);
    }
  });

  return subscription;
}

/**
 * Map Supabase user to our AuthUser interface
 */
function mapSupabaseUser(user: SupabaseUser, accessToken: string): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    full_name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    accessToken,
  };
}
