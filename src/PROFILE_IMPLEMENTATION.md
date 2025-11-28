# User Profile Implementation Guide

## Overview

ProjTrackr now supports user profiles with two storage approaches:

1. **Supabase Auth Metadata** (Primary) - Stores profile data directly in the authentication system
2. **KV Store** (Fallback) - Stores extended profile data in the key-value database

This guide explains both approaches and when to use each.

---

## Approach 1: Supabase Auth Metadata (Recommended)

### Why Use Auth Metadata?

✅ **No additional tables needed** - Works with existing Figma Make setup  
✅ **Automatic sync** - Profile data updates immediately with auth state  
✅ **Simple implementation** - No server endpoints required for basic profiles  
✅ **Secure by default** - Protected by Supabase Auth security  
✅ **Perfect for prototyping** - Zero database configuration  

### What Can Be Stored?

The `user_metadata` field in Supabase Auth can store any JSON data:

```typescript
{
  full_name: string,
  avatar_url: string,
  bio: string,
  preferences: object,
  // any custom fields you need
}
```

### Implementation

#### 1. During Signup

When a user signs up, their profile data is stored in `user_metadata`:

```typescript
// Server: /supabase/functions/server/index.tsx
const { data, error } = await supabase.auth.admin.createUser({
  email: 'user@example.com',
  password: 'password123',
  user_metadata: { 
    full_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
  },
  email_confirm: true, // Auto-confirm for Figma Make
});
```

#### 2. Reading Profile Data

Profiles are automatically included when fetching the current user:

```typescript
// Client: /utils/supabase/profile.ts
import { getProfile } from './utils/supabase/profile';

const { profile, error } = await getProfile();

console.log(profile.full_name); // "John Doe"
console.log(profile.avatar_url); // "https://example.com/avatar.jpg"
```

Or via Auth Context:

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

#### 3. Updating Profile Data

Update the user's metadata via Supabase client:

```typescript
// Client: /utils/supabase/profile.ts
import { updateProfile } from './utils/supabase/profile';

const { profile, error } = await updateProfile(accessToken, {
  full_name: 'Jane Smith',
  avatar_url: 'https://example.com/new-avatar.jpg',
});
```

This automatically updates:
- Supabase Auth metadata
- Auth context user state
- All components using `useAuth()`

---

## Approach 2: KV Store (For Extended Profiles)

### When to Use KV Store?

Use the KV store when you need:

- **Complex profile data** that exceeds metadata limits
- **Relationships** to other data entities
- **Queryable fields** (e.g., search by location, interests)
- **Separate versioning** from auth data

### Storage Pattern

```
Key: profile:{user_id}
Value: {
  id: string,
  email: string,
  full_name: string,
  avatar_url: string,
  bio: string,
  location: string,
  interests: string[],
  social_links: object,
  created_at: string,
  updated_at: string,
}
```

### Implementation

#### 1. Save Profile to KV Store

```typescript
// Client: /utils/supabase/profile.ts
import { saveProfileToKV } from './utils/supabase/profile';

const { success, error } = await saveProfileToKV(accessToken, {
  email: 'user@example.com',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Software engineer passionate about web development',
  location: 'San Francisco, CA',
  interests: ['React', 'TypeScript', 'Design'],
});
```

#### 2. Retrieve from KV Store

```typescript
// Client: /utils/supabase/profile.ts
import { getProfileFromKV } from './utils/supabase/profile';

const { profile, error } = await getProfileFromKV(accessToken);

console.log(profile.bio);
console.log(profile.location);
```

#### 3. Server Endpoints

Profile endpoints are defined in `/supabase/functions/server/index.tsx`:

**GET /make-server-5f69ad58/profile**
```typescript
// Returns profile from KV store or auth metadata
Response: { profile: UserProfile }
```

**PUT /make-server-5f69ad58/profile**
```typescript
// Stores/updates profile in KV store
Body: { full_name, avatar_url, bio, ... }
Response: { profile: UserProfile }
```

---

## Hybrid Approach (Best of Both)

For maximum flexibility, use both approaches:

1. **Store basic data in Auth metadata** (full_name, avatar_url)
2. **Store extended data in KV store** (bio, preferences, etc.)

### Example Implementation

```typescript
// During signup - save to Auth metadata
await supabase.auth.admin.createUser({
  email: 'user@example.com',
  password: 'password',
  user_metadata: { 
    full_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
  },
});

// After signup - save extended profile to KV
await saveProfileToKV(accessToken, {
  email: 'user@example.com',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Full stack developer',
  location: 'New York',
  interests: ['React', 'Node.js'],
});
```

### Reading Hybrid Data

```typescript
// Get auth metadata (fast, always available)
const { user } = useAuth();
const basicProfile = {
  full_name: user.full_name,
  avatar_url: user.avatar_url,
};

// Get extended data from KV (when needed)
const { profile } = await getProfileFromKV(user.accessToken);
const extendedProfile = {
  ...basicProfile,
  bio: profile.bio,
  location: profile.location,
};
```

---

## Profile Page Component

A complete profile management UI is available at `/profile`:

### Features

✅ **Avatar upload/preview** - Click camera icon to upload  
✅ **Full name editing** - Text input with validation  
✅ **Email display** - Read-only (cannot change)  
✅ **Avatar URL input** - Manual URL entry option  
✅ **Account info** - User ID and creation date  
✅ **Success/error messages** - Clear user feedback  
✅ **Loading states** - Spinners during save  

### Usage

```typescript
// Navigate to profile page
<Link to="/profile">Edit Profile</Link>

// Or in Navigation (automatically added)
<Navigation user={user} onLogout={handleLogout} />
```

---

## File Structure

```
├── /utils/supabase/
│   ├── profile.ts          # Profile utility functions
│   ├── auth.ts             # Enhanced with profile support
│   └── client.ts           # Supabase client
│
├── /components/
│   ├── ProfilePage.tsx     # Profile management UI
│   ├── SignupPage.tsx      # Updated with full_name field
│   └── Navigation.tsx      # Shows avatar/name, links to profile
│
├── /supabase/functions/server/
│   └── index.tsx           # Profile GET/PUT endpoints
│
└── /contexts/
    └── AuthContext.tsx     # Includes profile data in user object
```

---

## API Reference

### Client Functions

#### `getProfile()`
Get user profile from auth metadata
```typescript
Returns: { profile: UserProfile | null, error: string | null }
```

#### `updateProfile(accessToken, updates)`
Update user profile in auth metadata
```typescript
Parameters:
  - accessToken: string
  - updates: { full_name?: string, avatar_url?: string }
Returns: { profile: UserProfile | null, error: string | null }
```

#### `saveProfileToKV(accessToken, profile)`
Save extended profile to KV store
```typescript
Parameters:
  - accessToken: string
  - profile: Omit<UserProfile, 'id' | 'created_at'>
Returns: { success: boolean, error: string | null }
```

#### `getProfileFromKV(accessToken)`
Get extended profile from KV store
```typescript
Returns: { profile: UserProfile | null, error: string | null }
```

### Server Endpoints

#### `POST /make-server-5f69ad58/signup`
Enhanced with profile metadata
```typescript
Body: {
  email: string,
  password: string,
  name: string,
  full_name: string,
}
Response: {
  user: {
    id: string,
    email: string,
    name: string,
    full_name: string,
  }
}
```

#### `GET /make-server-5f69ad58/profile`
Get profile (KV or auth metadata)
```typescript
Headers: { Authorization: Bearer <access_token> }
Response: { profile: UserProfile }
```

#### `PUT /make-server-5f69ad58/profile`
Update profile in KV store
```typescript
Headers: { Authorization: Bearer <access_token> }
Body: { full_name, avatar_url, bio, ... }
Response: { profile: UserProfile }
```

---

## TypeScript Types

```typescript
// /utils/supabase/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

// /utils/supabase/auth.ts
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  avatar_url?: string;
  accessToken: string;
}
```

---

## Best Practices

### 1. Use Auth Metadata for Essential Data
Store data that's needed on every page load:
- Full name
- Avatar URL
- Display preferences

### 2. Use KV Store for Optional Data
Store data that's loaded on-demand:
- Biography
- Social links
- Extended preferences

### 3. Avatar Upload Strategy

**For Prototypes (Current Implementation):**
```typescript
// Use local object URLs or external URLs
const url = URL.createObjectURL(file);
setAvatarUrl(url);
```

**For Production:**
```typescript
// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file);

const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`);

await updateProfile(accessToken, { avatar_url: publicUrl });
```

### 4. Error Handling

Always handle errors gracefully:
```typescript
const { profile, error } = await updateProfile(accessToken, updates);

if (error) {
  // Show user-friendly message
  setMessage({ type: 'error', text: error });
  return;
}

// Success!
setMessage({ type: 'success', text: 'Profile updated!' });
```

### 5. Optimistic Updates

Update UI immediately, then sync with server:
```typescript
// Update local state first
setLocalProfile(newProfile);

// Then save to server
const { error } = await updateProfile(accessToken, newProfile);

// Rollback on error
if (error) {
  setLocalProfile(oldProfile);
}
```

---

## Migration from Tables Approach

If you were planning to use a `profiles` table with RLS, here's how the auth metadata approach compares:

### With Tables (Not Supported in Figma Make)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
);

-- RLS policies needed
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

### With Auth Metadata (Works in Figma Make)
```typescript
// No tables, no migrations, no RLS policies needed!
await supabase.auth.admin.createUser({
  user_metadata: { full_name, avatar_url }
});
```

**Benefits:**
- ✅ Zero database setup
- ✅ Automatic authorization (can only update own metadata)
- ✅ Works immediately in Figma Make
- ✅ Simpler code, fewer files

---

## Testing Checklist

- [ ] Sign up with full name saves to user_metadata
- [ ] Profile page loads user data correctly
- [ ] Avatar upload creates preview (object URL)
- [ ] Full name updates save to Supabase
- [ ] Navigation shows avatar and name
- [ ] Auth context includes profile fields
- [ ] Profile link navigates to /profile
- [ ] Logout clears profile data
- [ ] Session persistence preserves profile

---

## Troubleshooting

### Profile not updating in UI
**Issue**: Changed profile but UI shows old data  
**Fix**: Call `refreshUser()` after updates
```typescript
const { refreshUser } = useAuth();
await updateProfile(...);
await refreshUser();
```

### Avatar not displaying
**Issue**: Avatar URL returns 404  
**Checklist**:
- Is URL valid and accessible?
- For local uploads, did you create object URL?
- For Supabase Storage, is bucket public?

### Full name not saved
**Issue**: Full name field empty after refresh  
**Debug**:
```typescript
const { user } = useAuth();
console.log('User metadata:', user.user_metadata);
```

---

## Next Steps

### Optional Enhancements

1. **Avatar Upload to Supabase Storage**
   - Create `avatars` bucket
   - Implement file upload endpoint
   - Return signed URLs

2. **Extended Profile Fields**
   - Add bio/description
   - Social media links
   - Location/timezone

3. **Profile Visibility Settings**
   - Public/private toggle
   - Share profile URL

4. **Profile Completeness**
   - Progress bar (e.g., "60% complete")
   - Prompts for missing fields

---

## Summary

✅ **Signup enhanced** with full_name field  
✅ **Profile page** at `/profile` with avatar upload  
✅ **Auth metadata** stores full_name and avatar_url  
✅ **KV store fallback** for extended data  
✅ **Navigation** shows user avatar and name  
✅ **Server endpoints** for profile CRUD  
✅ **Type-safe** with TypeScript interfaces  
✅ **No migrations needed** - works with existing setup  

**Your profile system is ready to use!** 🎉
