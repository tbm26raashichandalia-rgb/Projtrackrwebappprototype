import { Link, useLocation } from 'react-router-dom';
import { AuthUser } from '../utils/supabase/auth';
import { Home, LayoutDashboard, User, LogOut, Sparkles } from 'lucide-react';

interface NavigationProps {
  user: AuthUser | null;
  onLogout?: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
              ProjTrackr
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isActive('/')
                      ? 'bg-pink-50 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isActive('/login')
                      ? 'bg-pink-50 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-6 py-2 bg-[#E60023] text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <span>Get Started</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-pink-50 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isActive('/profile')
                      ? 'bg-pink-50 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {getInitials(user.full_name || user.name)}
                      </div>
                    )}
                    <div className="hidden lg:block">
                      <div className="text-sm font-bold text-gray-900">
                        {user.full_name || user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
