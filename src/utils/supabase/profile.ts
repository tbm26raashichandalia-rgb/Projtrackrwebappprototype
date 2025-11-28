import { createClient } from './client';
import { projectId, publicAnonKey } from './info';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5f69ad58`;

/**
 * Get user profile from auth metadata
 * This is the primary method - profiles stored in Supabase Auth
 */
export async function getProfile(): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { profile: null, error: error.message };
    }

    if (!user) {
      return { profile: null, error: 'Not authenticated' };
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at || new Date().toISOString(),
    };

    return { profile, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Update user profile in auth metadata
 * Updates the user's metadata in Supabase Auth
 */
export async function updateProfile(
  accessToken: string,
  updates: { full_name?: string; avatar_url?: string }
): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
      },
    });

    if (error) {
      return { profile: null, error: error.message };
    }

    if (!data.user) {
      return { profile: null, error: 'Failed to update profile' };
    }

    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email || '',
      full_name: data.user.user_metadata?.full_name || '',
      avatar_url: data.user.user_metadata?.avatar_url,
      created_at: data.user.created_at || new Date().toISOString(),
    };

    return { profile, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { profile: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Create or update profile in KV store (fallback method)
 * Use this if you need more complex profile data
 */
export async function saveProfileToKV(
  accessToken: string,
  profile: Omit<UserProfile, 'id' | 'created_at'>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to save profile' };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Save profile to KV error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get profile from KV store (fallback method)
 */
export async function getProfileFromKV(
  accessToken: string
): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { profile: null, error: error.error || 'Failed to get profile' };
    }

    const data = await response.json();
    return { profile: data.profile, error: null };
  } catch (error) {
    console.error('Get profile from KV error:', error);
    return { profile: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Upload avatar image (returns URL)
 * In a real implementation, this would upload to Supabase Storage
 * For now, we'll use a placeholder or external URL
 */
export async function uploadAvatar(
  accessToken: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    // For this prototype, we'll use a placeholder
    // In production, you would upload to Supabase Storage
    
    // Create a local object URL for preview
    const url = URL.createObjectURL(file);
    
    // In production, you would do:
    // const supabase = createClient();
    // const { data, error } = await supabase.storage
    //   .from('avatars')
    //   .upload(`${userId}/${file.name}`, file);
    
    return { url, error: null };
  } catch (error) {
    console.error('Upload avatar error:', error);
    return { url: null, error: 'An unexpected error occurred' };
  }
}
