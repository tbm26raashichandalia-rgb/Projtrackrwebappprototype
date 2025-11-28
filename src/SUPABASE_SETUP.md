# Supabase Setup Guide for ProjTrackr

## Overview

ProjTrackr uses Supabase for authentication and data persistence. The setup is fully configured and ready to use in the Figma Make environment.

## Architecture

```
Frontend (React + Vite)
    ↓
Supabase Client (/utils/supabase/client.ts)
    ↓
Supabase Auth + Edge Functions
    ↓
Key-Value Store (Database)
```

## Configuration Files

### 1. Client Configuration
**File**: `/utils/supabase/client.ts`

- Creates a singleton Supabase client instance
- Configured with session persistence and auto token refresh
- Uses localStorage for session storage (key: `projtrackr-auth-token`)

```typescript
import { createClient } from './utils/supabase/client';
const supabase = createClient();
```

### 2. Authentication Helpers
**File**: `/utils/supabase/auth.ts`

Provides utility functions for authentication:

- `getCurrentUser()` - Get the currently authenticated user
- `signUp(email, password)` - Register a new user
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `onAuthStateChange(callback)` - Listen to auth state changes

### 3. Auth Context Provider
**File**: `/contexts/AuthContext.tsx`

React context for managing authentication state across the app:

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  // Use auth methods
}
```

### 4. Protected Routes
**File**: `/components/ProtectedRoute.tsx`

Components for route protection:

- `<ProtectedRoute>` - Redirects to /login if not authenticated
- `<PublicRoute>` - Redirects to /dashboard if already authenticated

```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Environment Variables

In Figma Make, environment variables are automatically provided:

- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_ANON_KEY` - Public anonymous key (client-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `SUPABASE_DB_URL` - Database connection URL (server-side)

Access these via:
- **Client-side**: `import { projectId, publicAnonKey } from './utils/supabase/info'`
- **Server-side**: `Deno.env.get('SUPABASE_URL')`

## Authentication Flow

### Sign Up
1. User submits email/password to signup form
2. Request sent to `/supabase/functions/server/index.tsx` `/signup` endpoint
3. Server creates user via Supabase Admin API with `email_confirm: true`
4. User is automatically signed in
5. Session stored in localStorage
6. User redirected to dashboard

### Sign In
1. User submits email/password to login form
2. `signIn()` helper calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials and returns session
4. Session stored in localStorage
5. Auth context updated with user data
6. User redirected to dashboard

### Session Persistence
- Sessions are automatically persisted in localStorage
- Token auto-refresh is enabled
- On page reload, session is restored from localStorage
- Auth state change listener updates context automatically

### Sign Out
1. User clicks logout button
2. `signOut()` helper calls `supabase.auth.signOut()`
3. Session cleared from localStorage
4. Auth context updated (user set to null)
5. User redirected to login page

## API Endpoints

All API routes are defined in `/supabase/functions/server/index.tsx`:

### POST `/make-server-5f69ad58/signup`
Create a new user account
```typescript
Body: { email: string, password: string, name: string }
Response: { user: { id, email, name } }
```

### GET `/make-server-5f69ad58/projects`
Get all projects for authenticated user
```typescript
Headers: { Authorization: Bearer <access_token> }
Response: { projects: Project[] }
```

### POST `/make-server-5f69ad58/projects`
Create a new project
```typescript
Headers: { Authorization: Bearer <access_token> }
Body: { name, email, batch, vibe_link, github_link, tags }
Response: { project: Project }
```

### PUT `/make-server-5f69ad58/projects/:id`
Update an existing project
```typescript
Headers: { Authorization: Bearer <access_token> }
Body: Partial<Project>
Response: { project: Project }
```

### DELETE `/make-server-5f69ad58/projects/:id`
Delete a project
```typescript
Headers: { Authorization: Bearer <access_token> }
Response: { success: true }
```

## Data Storage

Projects are stored in Supabase's key-value store with the key pattern:
```
project:{user_id}:{project_id}
```

This allows for:
- Fast retrieval by user
- Automatic user isolation
- Simple CRUD operations

## Security

### Authentication
- Passwords are hashed by Supabase (not stored in plain text)
- Access tokens are used for API authentication
- Tokens automatically refresh before expiration
- Service role key is only used server-side (never exposed to client)

### Authorization
- All project endpoints verify user authentication
- Users can only access their own projects
- Project data is scoped by user_id

### Best Practices
- ✅ Access tokens passed in Authorization header
- ✅ Service role key only used on server
- ✅ Client uses public anon key only
- ✅ Session storage uses secure localStorage
- ✅ Auto token refresh prevents session expiry

## Usage Examples

### Check if user is logged in
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Hello, {user.name}!</div>;
}
```

### Sign up a new user
```typescript
const { signUp } = useAuth();

const handleSignup = async () => {
  const { success, error } = await signUp('user@example.com', 'password123');
  if (success) {
    // User is now signed in and redirected
  } else {
    console.error(error);
  }
};
```

### Make an authenticated API request
```typescript
const { user } = useAuth();

const fetchData = async () => {
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const data = await response.json();
  return data;
};
```

### Protect a route
```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Troubleshooting

### "Unauthorized" errors
- Check that access token is being sent in Authorization header
- Verify token hasn't expired (should auto-refresh)
- Try signing out and back in

### Session not persisting
- Check browser localStorage for `projtrackr-auth-token`
- Verify `persistSession: true` in client config
- Check for localStorage restrictions (private browsing)

### Sign up fails
- Check password is at least 8 characters
- Verify email format is valid
- Check server logs for detailed error messages

## Notes

- Email confirmation is automatically handled (no email server needed)
- Password reset sends email (requires email server configuration in production)
- Social login (Google, GitHub) can be added via Supabase OAuth
- For production, configure custom email templates in Supabase dashboard
