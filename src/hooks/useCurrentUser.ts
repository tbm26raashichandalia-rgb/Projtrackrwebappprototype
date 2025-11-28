import { useAuth } from '../contexts/AuthContext';
import { AuthUser } from '../utils/supabase/auth';

/**
 * Hook to get the current authenticated user
 * @returns The current user or null if not authenticated
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const user = useCurrentUser();
 *   
 *   if (!user) {
 *     return <div>Please log in</div>;
 *   }
 *   
 *   return <div>Hello, {user.name}!</div>;
 * }
 * ```
 */
export function useCurrentUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is authenticated
 * @returns true if user is logged in, false otherwise
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isAuthenticated = useIsAuthenticated();
 *   
 *   return isAuthenticated ? <Dashboard /> : <Login />;
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  const { user } = useAuth();
  return user !== null;
}

/**
 * Hook to check if auth state is still loading
 * @returns true if loading, false otherwise
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isLoading = useAuthLoading();
 *   
 *   if (isLoading) {
 *     return <Spinner />;
 *   }
 *   
 *   return <Content />;
 * }
 * ```
 */
export function useAuthLoading(): boolean {
  const { loading } = useAuth();
  return loading;
}
