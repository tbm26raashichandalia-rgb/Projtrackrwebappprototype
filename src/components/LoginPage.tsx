import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = onLogin(email, password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      return;
    }
    
    // Simulate sending reset email
    setResetSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetEmail('');
      setResetSent(false);
    }, 3000);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-blue-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Login to access your projects</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Remember Me</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-blue-900">Reset Password</h2>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!resetSent ? (
              <form onSubmit={handleForgotPassword}>
                <p className="text-gray-600 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <div className="mb-4">
                  <label htmlFor="resetEmail" className="block text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-green-700 mb-2">Email Sent!</h3>
                <p className="text-gray-600">
                  Check your inbox for password reset instructions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
