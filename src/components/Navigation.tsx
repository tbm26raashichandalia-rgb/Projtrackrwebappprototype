import { Link, useLocation } from 'react-router-dom';
import { AuthUser } from '../utils/supabase/auth';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavigationProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isLanding = location.pathname === '/';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white">P</span>
            </div>
            <span className="tracking-tight">ProjTrackr</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {!isDashboard && location.pathname !== '/profile' && (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-100"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <span className="text-sm">{user.full_name || user.name}</span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {!isLanding && (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
