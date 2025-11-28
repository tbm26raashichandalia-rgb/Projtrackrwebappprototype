import { projectId, publicAnonKey } from './supabase/info';
import { Project } from '../App';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5f69ad58`;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Fetch all projects for the authenticated user
 */
export async function fetchProjects(accessToken: string): Promise<ApiResponse<Project[]>> {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to fetch projects' };
    }

    const data = await response.json();
    return { data: data.projects || [], error: null };
  } catch (error) {
    console.error('Fetch projects error:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new project
 */
export async function createProject(
  accessToken: string,
  project: Omit<Project, 'id' | 'user_id' | 'created_at'>
): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to create project' };
    }

    const data = await response.json();
    return { data: data.project, error: null };
  } catch (error) {
    console.error('Create project error:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  accessToken: string,
  projectId: string,
  updates: Partial<Project>
): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to update project' };
    }

    const data = await response.json();
    return { data: data.project, error: null };
  } catch (error) {
    console.error('Update project error:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(
  accessToken: string,
  projectId: string
): Promise<ApiResponse<boolean>> {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to delete project' };
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('Delete project error:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign up a new user (creates account via server endpoint)
 */
export async function signUpUser(
  email: string,
  password: string,
  name?: string
): Promise<ApiResponse<{ id: string; email: string; name: string }>> {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        name: name || email.split('@')[0],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to sign up' };
    }

    const data = await response.json();
    return { data: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}
