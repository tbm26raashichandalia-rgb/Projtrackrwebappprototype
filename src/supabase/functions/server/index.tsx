import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check endpoint
app.get('/make-server-5f69ad58/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Signup endpoint
app.post('/make-server-5f69ad58/signup', async (c) => {
  try {
    const { email, password, name, full_name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user with Supabase Auth with profile metadata
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: name || email.split('@')[0],
        full_name: full_name || name || email.split('@')[0],
      },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        full_name: data.user.user_metadata.full_name,
      }
    });
  } catch (error) {
    console.log(`Signup exception: ${error}`);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Get user's projects
app.get('/make-server-5f69ad58/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in get projects: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get projects from KV store
    const projects = await kv.getByPrefix(`project:${user.id}:`);
    
    return c.json({ projects: projects || [] });
  } catch (error) {
    console.log(`Get projects error: ${error}`);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Create project
app.post('/make-server-5f69ad58/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in create project: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectData = await c.req.json();
    const projectId = crypto.randomUUID();
    
    const project = {
      id: projectId,
      user_id: user.id,
      ...projectData,
      created_at: new Date().toISOString(),
    };

    // Store in KV
    await kv.set(`project:${user.id}:${projectId}`, project);
    
    return c.json({ project });
  } catch (error) {
    console.log(`Create project error: ${error}`);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Update project
app.put('/make-server-5f69ad58/projects/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in update project: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('id');
    const updates = await c.req.json();
    
    // Get existing project
    const existingProject = await kv.get(`project:${user.id}:${projectId}`);
    
    if (!existingProject) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const updatedProject = {
      ...existingProject,
      ...updates,
      id: projectId,
      user_id: user.id,
    };

    await kv.set(`project:${user.id}:${projectId}`, updatedProject);
    
    return c.json({ project: updatedProject });
  } catch (error) {
    console.log(`Update project error: ${error}`);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project
app.delete('/make-server-5f69ad58/projects/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in delete project: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('id');
    
    await kv.del(`project:${user.id}:${projectId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete project error: ${error}`);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// Get user profile from KV store (fallback method)
app.get('/make-server-5f69ad58/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in get profile: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get profile from KV store
    const profile = await kv.get(`profile:${user.id}`);
    
    if (!profile) {
      // Return basic profile from auth metadata
      return c.json({ 
        profile: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at,
        }
      });
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile in KV store (fallback method)
app.put('/make-server-5f69ad58/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in update profile: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    
    const profile = {
      id: user.id,
      email: user.email,
      full_name: updates.full_name,
      avatar_url: updates.avatar_url,
      created_at: user.created_at,
    };

    // Store in KV
    await kv.set(`profile:${user.id}`, profile);
    
    return c.json({ profile });
  } catch (error) {
    console.log(`Update profile error: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

Deno.serve(app.fetch);
