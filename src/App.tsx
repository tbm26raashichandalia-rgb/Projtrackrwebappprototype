import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { Navigation } from './components/Navigation';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { projectId } from './utils/supabase/info';

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

function AppContent() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [serverError, setServerError] = useState<boolean>(false);

  // Fetch projects when user logs in
  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setServerError(false);
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setServerError(false);
      } else {
        console.error('Failed to fetch projects:', response.statusText);
        setProjects([]);
        setServerError(true);
      }
    } catch (error) {
      console.error('Fetch projects error:', error);
      // Server might not be deployed yet, use empty array
      setProjects([]);
      setServerError(true);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const { success, error } = await signIn(email, password);
    
    if (!success) {
      alert('Login failed: ' + error);
      return false;
    }
    
    return true;
  };

  const handleSignup = async (email: string, password: string, full_name?: string) => {
    const { success, error } = await signUp(email, password, full_name);
    
    if (!success) {
      alert('Signup failed: ' + error);
      return false;
    }
    
    return true;
  };

  const handleLogout = async () => {
    try {
      await signOut();
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

  return (
    <div className="min-h-screen bg-[#A7C7E7]">
      <Navigation user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignupPage onSignup={handleSignup} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage onLogin={handleLogin} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard 
                user={user!}
                projects={projects}
                onAddProject={addProject}
                onUpdateProject={updateProject}
                onDeleteProject={deleteProject}
                serverError={serverError}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
