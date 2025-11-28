import { Link, useLocation } from 'react-router-dom';
import { User } from '../App';
import { LogOut } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            <span className="tracking-tight">ProjTrackr</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {!isDashboard && (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
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
          </div>
        </div>
      </div>
    </nav>
  );
}
