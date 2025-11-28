# User Profiles - Quick Start Guide

## 🚀 What's Implemented

Instead of creating database tables with migrations (not supported in Figma Make), we've implemented user profiles using **Supabase Auth Metadata** - a simpler, zero-config approach.

---

## ✅ Features Available Now

### 1. Enhanced Signup with Full Name
Users can now provide their full name during registration:
```
/signup → Enter full name, email, password
```

### 2. Profile Management Page
Visit `/profile` to:
- Upload/change avatar image
- Edit full name
- View account information
- See user ID and creation date

### 3. Profile Display in Navigation
The navigation bar now shows:
- User's avatar (or default icon)
- Full name
- Clickable link to profile page

---

## 📖 How to Use

### For Users

1. **Sign Up** with your full name at `/signup`
2. **Navigate to Profile** by clicking your name in the top navigation
3. **Upload Avatar**: Click the camera icon on your profile photo
4. **Edit Name**: Update your full name and click "Save Changes"

### For Developers

#### Get Current User Profile
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user.full_name}!</h1>
      {user.avatar_url && <img src={user.avatar_url} alt="Avatar" />}
    </div>
  );
}
```

#### Update Profile
```typescript
import { updateProfile } from './utils/supabase/profile';
import { useAuth } from './contexts/AuthContext';

function ProfileEditor() {
  const { user, refreshUser } = useAuth();
  
  const handleSave = async () => {
    const { profile, error } = await updateProfile(user.accessToken, {
      full_name: 'New Name',
      avatar_url: 'https://example.com/avatar.jpg',
    });
    
    if (!error) {
      await refreshUser(); // Refresh auth context
    }
  };
}
```

#### Access Profile Data
```typescript
// Via Auth Context (recommended)
const { user } = useAuth();
console.log(user.full_name);
console.log(user.avatar_url);

// Via Profile Helper
import { getProfile } from './utils/supabase/profile';
const { profile } = await getProfile();
console.log(profile.full_name);
```

---

## 🗂️ Data Storage

### Primary Method: Auth Metadata
Profile data is stored in Supabase Auth `user_metadata`:

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "user_metadata": {
    "name": "user",
    "full_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

**Benefits:**
- ✅ No database tables needed
- ✅ No migrations required
- ✅ Automatic authorization
- ✅ Works immediately in Figma Make

### Fallback Method: KV Store
For extended profile data (bio, social links, etc.):

```typescript
Key: profile:{user_id}
Value: {
  id, email, full_name, avatar_url,
  bio, location, interests, ...
}
```

Use via server endpoints:
- `GET /make-server-5f69ad58/profile`
- `PUT /make-server-5f69ad58/profile`

---

## 🔧 API Endpoints

### Signup (Enhanced)
```http
POST /make-server-5f69ad58/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

### Get Profile
```http
GET /make-server-5f69ad58/profile
Authorization: Bearer <access_token>

Response: {
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "created_at": "2025-11-28T..."
  }
}
```

### Update Profile
```http
PUT /make-server-5f69ad58/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "Jane Smith",
  "avatar_url": "https://..."
}
```

---

## 🎨 Component Usage

### SignupPage
Now includes full name field:
```typescript
<SignupPage onSignup={async (email, password, full_name) => {
  // Handles signup with profile data
}} />
```

### ProfilePage
Standalone profile management:
```typescript
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### Navigation
Auto-displays user profile:
```typescript
<Navigation user={user} onLogout={handleLogout} />
// Shows avatar, full name, link to /profile
```

---

## 📂 Files Modified

### New Files
- `/utils/supabase/profile.ts` - Profile utility functions
- `/components/ProfilePage.tsx` - Profile management UI
- `/hooks/useCurrentUser.ts` - Profile access hooks
- `/PROFILE_IMPLEMENTATION.md` - Full documentation

### Updated Files
- `/utils/supabase/auth.ts` - Added full_name, avatar_url to AuthUser
- `/contexts/AuthContext.tsx` - Enhanced signUp with full_name
- `/components/SignupPage.tsx` - Added full name field
- `/components/Navigation.tsx` - Shows avatar and profile link
- `/supabase/functions/server/index.tsx` - Profile endpoints
- `/App.tsx` - Added /profile route

---

## 🧪 Testing

1. **Sign up** with a new account and full name
2. **Navigate** to `/profile`
3. **Upload** an avatar (or paste a URL)
4. **Edit** your full name
5. **Save** and verify changes appear in navigation
6. **Refresh** the page and verify data persists

---

## 💡 Why No Migrations?

You asked about creating a `profiles` table with SQL migrations. Here's why we didn't:

### ❌ Table Approach (Not Supported)
```sql
-- This doesn't work in Figma Make
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT
);
```

**Problems:**
- Figma Make only provides `kv_store` table
- Can't run migration files
- Can't modify database schema
- Additional complexity

### ✅ Auth Metadata Approach (Recommended)
```typescript
// This works immediately
await supabase.auth.admin.createUser({
  user_metadata: { full_name, avatar_url }
});
```

**Benefits:**
- Zero setup required
- No migrations to run
- Works in Figma Make
- Simpler codebase
- Automatic security

---

## 🚀 Next Steps

### Extend Your Profile
Add more fields to `user_metadata`:
```typescript
user_metadata: {
  full_name: 'John Doe',
  avatar_url: 'https://...',
  bio: 'Software engineer',
  location: 'San Francisco',
  twitter: '@johndoe',
}
```

### Use KV Store for Complex Data
For queryable or relational data:
```typescript
await saveProfileToKV(accessToken, {
  full_name: 'John Doe',
  interests: ['React', 'TypeScript'],
  projects_completed: 42,
  favorite_tags: ['Personal', 'Academic'],
});
```

### Implement Avatar Upload
For production, upload to Supabase Storage:
```typescript
const { data } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file);
```

---

## 📚 Further Reading

- **Full Documentation**: See `PROFILE_IMPLEMENTATION.md`
- **Supabase Auth**: See `SUPABASE_SETUP.md`
- **Complete Setup**: See `SETUP_COMPLETE.md`

---

## 🎉 Summary

✅ User profiles implemented with **zero database migrations**  
✅ Full name collected during signup  
✅ Profile page for editing name and avatar  
✅ Navigation displays user avatar and name  
✅ Data stored in Supabase Auth metadata  
✅ Fallback to KV store for extended data  
✅ Type-safe with TypeScript  
✅ Fully functional in Figma Make  

**Your profile system is ready to use!**
