import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { createClient } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';

export interface User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  email: string;
  batch: string;
  vibe_link: string;
  github_link: string;
  tags: string[];
  created_at: string;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5f69ad58`;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize - check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            accessToken: session.access_token,
          };
          setUser(userData);
          await fetchProjects(session.access_token);
        }
      } catch (error) {
        console.error('Init auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchProjects = async (accessToken: string) => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Fetch projects error:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
        return false;
      }

      if (data.session?.user) {
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
          accessToken: data.session.access_token,
        };
        setUser(userData);
        await fetchProjects(data.session.access_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login exception:', error);
      alert('Login failed. Please try again.');
      return false;
    }
  };

  const handleSignup = async (email: string, password: string) => {
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
          name: email.split('@')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Signup error:', data.error);
        alert('Signup failed: ' + data.error);
        return false;
      }

      // Auto-login after signup
      return await handleLogin(email, password);
    } catch (error) {
      console.error('Signup exception:', error);
      alert('Signup failed. Please try again.');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProjects([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects([...projects, data.project]);
      } else {
        const error = await response.json();
        console.error('Add project error:', error);
        alert('Failed to add project: ' + error.error);
      }
    } catch (error) {
      console.error('Add project exception:', error);
      alert('Failed to add project. Please try again.');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(projects.map(p => p.id === id ? data.project : p));
      } else {
        const error = await response.json();
        console.error('Update project error:', error);
        alert('Failed to update project: ' + error.error);
      }
    } catch (error) {
      console.error('Update project exception:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        const error = await response.json();
        console.error('Delete project error:', error);
        alert('Failed to delete project: ' + error.error);
      }
    } catch (error) {
      console.error('Delete project exception:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#A7C7E7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#A7C7E7]">
        <Navigation user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/signup" 
            element={
              user ? <Navigate to="/dashboard" /> : <SignupPage onSignup={handleSignup} />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard 
                  user={user}
                  projects={projects}
                  onAddProject={addProject}
                  onUpdateProject={updateProject}
                  onDeleteProject={deleteProject}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
