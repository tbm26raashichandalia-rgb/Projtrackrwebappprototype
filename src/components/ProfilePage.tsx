import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile, UserProfile } from '../utils/supabase/profile';
import { User, Mail, Camera, Save, Loader } from 'lucide-react';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { profile: profileData, error } = await getProfile();

    if (error) {
      setMessage({ type: 'error', text: error });
      setLoading(false);
      return;
    }

    if (profileData) {
      setProfile(profileData);
      setFormData({
        full_name: profileData.full_name || '',
        avatar_url: profileData.avatar_url || '',
      });
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.accessToken) return;

    setSaving(true);
    setMessage(null);

    const { profile: updatedProfile, error } = await updateProfile(user.accessToken, formData);

    if (error) {
      setMessage({ type: 'error', text: error });
      setSaving(false);
      return;
    }

    if (updatedProfile) {
      setProfile(updatedProfile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh user in auth context
      await refreshUser();
    }

    setSaving(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData({ ...formData, avatar_url: previewUrl });

    // In production, you would upload to Supabase Storage here
    // For now, we'll just use the local preview
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#A7C7E7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#A7C7E7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-blue-900 mb-2">Your Profile</h1>
            <p className="text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Profile avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Profile Photo</h3>
                <p className="text-gray-600 text-sm">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Avatar URL (Optional Manual Input) */}
            <div>
              <label htmlFor="avatar_url" className="block text-gray-700 mb-2">
                Avatar URL <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="url"
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-gray-500 text-sm mt-1">
                Or paste a direct link to your avatar image
              </p>
            </div>

            {/* Profile Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-700 mb-2">Account Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">User ID:</span> {profile?.id}
                </p>
                <p>
                  <span className="font-medium">Member since:</span>{' '}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Implementation Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-blue-900 mb-2">💡 Implementation Note</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              This profile uses <strong>Supabase Auth Metadata</strong> to store your full name
              and avatar URL. Your data is stored securely in the authentication system without
              needing a separate database table. Changes are reflected immediately across the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
