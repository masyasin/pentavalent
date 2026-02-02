import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { logUserActivity } from '../lib/security';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  permissions?: Record<string, PermissionAction[]>;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; reset_token?: string }>;
  resetPassword: (token: string, newPassword: string, refreshToken?: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  hasPermission: (permission: Permission | PermissionAction, module?: AdminModule | 'all') => boolean;
  canAccessModule: (module: AdminModule) => boolean;
  updateLocalUser: (userData: Partial<User>) => void;
  updateEmail: (newEmail: string) => Promise<{ success: boolean; error?: string }>;
  finalizeLogin: () => void;
  resendOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  sendEmailOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
}

export type Permission =
  | 'view_dashboard'
  | 'manage_content'
  | 'create_content'
  | 'edit_content'
  | 'delete_content'
  | 'manage_users'
  | 'create_users'
  | 'edit_users'
  | 'delete_users'
  | 'manage_settings'
  | 'view_audit_logs';

export type AdminModule =
  | 'dashboard'
  | 'menus'
  | 'pages'
  | 'news'
  | 'careers'
  | 'branches'
  | 'partners'
  | 'certifications'
  | 'investor'
  | 'messages'
  | 'applications'
  | 'users'
  | 'settings'
  | 'audit_logs'
  | 'hero'
  | 'page_banners'
  | 'seo'
  | 'company'
  | 'channels'
  | 'analytics'
  | 'faqs'
  | 'legal'
  | 'calendar'
  | 'newsletter'
  | 'website'
  | 'recruitment'
  | 'content'
  | 'security_logs'
  | 'db_backup';

// Role-based permissions matrix
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_dashboard',
    'manage_content',
    'create_content',
    'edit_content',
    'delete_content',
    'manage_users',
    'create_users',
    'edit_users',
    'delete_users',
    'manage_settings',
    'view_audit_logs',
  ],
  admin: [
    'view_dashboard',
    'manage_content',
    'create_content',
    'edit_content',
    'delete_content',
    'manage_users',
    'create_users',
    'edit_users',
    'delete_users',
    'view_audit_logs',
  ],
  editor: [
    'view_dashboard',
    'manage_content',
    'create_content',
    'edit_content',
  ],
  viewer: [
    'view_dashboard',
  ],
};

// Module access by role
const moduleAccess: Record<AdminModule, UserRole[]> = {
  dashboard: ['super_admin', 'admin', 'editor', 'viewer'],
  menus: ['super_admin', 'admin'],
  pages: ['super_admin', 'admin', 'editor'],
  news: ['super_admin', 'admin', 'editor'],
  careers: ['super_admin', 'admin', 'editor'],
  branches: ['super_admin', 'admin', 'editor'],
  partners: ['super_admin', 'admin', 'editor'],
  certifications: ['super_admin', 'admin', 'editor'],
  investor: ['super_admin', 'admin', 'editor'],
  messages: ['super_admin', 'admin', 'editor', 'viewer'],
  applications: ['super_admin', 'admin', 'editor', 'viewer'],
  users: ['super_admin', 'admin'],
  settings: ['super_admin'],
  website: ['super_admin', 'admin'],
  recruitment: ['super_admin', 'admin', 'editor'],
  content: ['super_admin', 'admin', 'editor'],
  audit_logs: ['super_admin', 'admin'],
  hero: ['super_admin', 'admin', 'editor'],
  page_banners: ['super_admin', 'admin', 'editor'],
  seo: ['super_admin', 'admin', 'editor'],
  company: ['super_admin', 'admin', 'editor'],
  channels: ['super_admin', 'admin', 'editor'],
  analytics: ['super_admin', 'admin', 'viewer'],
  faqs: ['super_admin', 'admin', 'editor'],
  legal: ['super_admin', 'admin', 'editor'],
  calendar: ['super_admin', 'admin', 'editor'],
  newsletter: ['super_admin', 'admin', 'editor', 'viewer'],
  security_logs: ['super_admin', 'admin'],
  db_backup: ['super_admin'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'peve_admin_token';
const USER_KEY = 'peve_admin_user';
const TEMP_TOKEN_KEY = 'peve_admin_temp_token';
const TEMP_USER_KEY = 'peve_admin_temp_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        // Verify token is still valid
        try {
          const { data: { user: authUser }, error } = await supabase.auth.getUser(storedToken);

          if (authUser && !error) {
            // Fetch LATEST profile from public.users table using EMAIL
            const { data: profiles } = await supabase
              .from('users')
              .select('id, email, full_name, avatar_url, role, permissions')
              .eq('email', authUser.email)
              .limit(1);

            const profile = profiles && profiles.length > 0 ? profiles[0] : null;

            const finalUser = profile
              ? { ...authUser, ...profile }
              : (JSON.parse(storedUser) as User); 

            // If profile found but ID mismatched, update the local object with profile role
            if (profile && !finalUser.role) {
                finalUser.role = profile.role;
            }

            setToken(storedToken);
            setUser(finalUser);
            localStorage.setItem(USER_KEY, JSON.stringify(finalUser));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  // Idle Timer Logic - Auto logout after 30 minutes of inactivity
  useEffect(() => {
    if (!user || !token) return;

    let idleTimer: NodeJS.Timeout;
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const handleIdle = () => {
      console.log('User idle for 30 minutes, logging out...');
      logout();
    };

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(handleIdle, IDLE_TIMEOUT);
    };

    // Events that count as activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keydown',
      'scroll', 'touchstart', 'click'
    ];

    // Initialize timer
    resetTimer();

    // Add activity listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // 1. PHASE 1: PRE-AUTH PROFILE CHECK
      let profileByEmail = null;
      try {
        const { data: profiles } = await supabase
          .from('users')
          .select('id, email, full_name, role')
          .eq('email', email)
          .limit(1);

        if (profiles && profiles.length > 0) {
          profileByEmail = profiles[0];
        }
      } catch (e) {
        console.error('Profile check error:', e);
      }

      // STRICT SECURITY: Only allow login if email exists in our user profile table
      if (!profileByEmail) {
        return { success: false, error: 'Authorization failed: This email is not registered in our system.' };
      }

      const authEmail = email;

      // 2. PHASE 2: INTERNAL AUTHENTICATION
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password
      });

      if (error || !data.user || !data.session) {
        console.error('Supabase auth error:', error);
        return { success: false, error: error?.message || 'Authentication denied' };
      }

      if (data.user && data.session) {
        // Fetch profile using EMAIL as primary key during login for better reliability
        // because the ID in public.users might not match the Auth ID yet if they were 
        // created separately or imported.
        const { data: profiles } = await supabase
          .from('users')
          .select('id, email, full_name, avatar_url, role, permissions')
          .eq('email', data.user.email)
          .limit(1);

        const profile = profiles && profiles.length > 0 ? profiles[0] : null;

        // Construct final user, prioritizing profile data (especially role)
        const finalUser = profile 
            ? { ...data.user, ...profile } 
            : { ...data.user, role: 'admin' as UserRole }; // Fallback to admin if profile missing but auth passed

        // STAGE in TEMP storage
        localStorage.setItem(TEMP_TOKEN_KEY, data.session.access_token);
        localStorage.setItem(TEMP_USER_KEY, JSON.stringify(finalUser));
        
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Connection failure. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (user) {
        logUserActivity('LOGOUT', 'AUTH', `User logged out: ${user.full_name}`, user.email);
      }
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string; reset_token?: string }> => {
    try {
      // 1. PHASE 1: PRE-CHECK PROFILE
      const { data: profiles } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (!profiles || profiles.length === 0) {
        return { success: false, error: 'Authorization failed: This email is not registered in our system.' };
      }

      // 2. PHASE 2: INVOKE RESET (Using our own API)
      const response = await fetch('/api/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to request password reset' };
      }

      // Success! The email has been sent by our API.
      // We return a dummy token just to satisfy the UI state transition,
      // or we can update the UI to just say "Check your email for the link".
      return { success: true, reset_token: 'CHECK_EMAIL_LINK' };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'System busy. Please try again in a moment.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string, refreshToken?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // FASTEST WAY: FORCE SESSION SET
      if (resetToken && refreshToken) {
          console.log('Using Access+Refresh Token to force session...');
          const { error: sessionError } = await supabase.auth.setSession({
              access_token: resetToken,
              refresh_token: refreshToken
          });

          if (sessionError) {
              console.error('Set Session Error:', sessionError);
              // Fallback to Admin API if session set fails
          } else {
              console.log('Session Set Success! Updating password...');
              const { error } = await supabase.auth.updateUser({ password: newPassword });
              if (!error) return { success: true };
              console.error('Update User Error:', error);
          }
      }

      // FLOW 1.5: Proxy to Admin API (The "Nuclear Option")
       // If we have ANY token but no session, we ask our server (Super Admin) to do it.
       if (!session && resetToken) {
            console.log('No session detected. Delegating to Admin API (api/confirm-reset)...');
            
            const response = await fetch('/api/confirm-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, newPassword: newPassword })
            });
 
            const data = await response.json();
 
            if (!response.ok) {
                console.error('Admin API Update Failed:', data);
                return { success: false, error: data.error || 'Failed to update password' };
            }
 
            console.log('Admin API Update Success!');
            return { success: true };
       }

      // Check if session exists (it might have been set by FASTEST WAY above or by background listener)
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
         console.log('Session found. Updating password...');
         const { error } = await supabase.auth.updateUser({ password: newPassword });
         
         if (error) {
            console.error('Update User Error:', error);
            return { success: false, error: error.message };
         }
         return { success: true };
      }
      
      // If no session and empty token
      if (!resetToken) {
           return { success: false, error: 'Unable to verify identity. Please click the reset link from your email again.' };
      }

      return { success: false, error: 'Unexpected state during reset.' };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Transmission error during reset. Try again.' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const updateLocalUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateEmail = async (newEmail: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!token) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        console.error('Update email error:', error);
        return { success: false, error: error.message };
      }

      // Update local state and storage
      updateLocalUser({ email: newEmail });
      return { success: true };
    } catch (error) {
      console.error('Update email error:', error);
      return { success: false, error: 'An unexpected error occurred during sync' };
    }
  };

  const hasPermission = (permission: Permission | PermissionAction, module: AdminModule | 'all' = 'all'): boolean => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;

    // Check dynamic permissions first (Strict Mode)
    // If permissions object exists and is not empty, it's the source of truth
    if (user.permissions && Object.keys(user.permissions).length > 0) {
      // Check for global 'all' permissions
      if (user.permissions.all?.includes(permission as PermissionAction)) return true;
      
      // Check for module-specific permissions
      if (module !== 'all' && user.permissions[module]?.includes(permission as PermissionAction)) return true;

      // If we have dynamic permissions but haven't returned true yet, 
      // it means this specific action is denied.
      return false;
    }

    // Fallback to static role-based permissions only if no dynamic permissions exist
    if (typeof permission === 'string' && permission.includes('_')) {
        return rolePermissions[user.role]?.includes(permission as Permission) || false;
    }

    return false;
  };

  const canAccessModule = (module: AdminModule): boolean => {
    if (!user) return false;
    
    // Super admin has access to everything
    if (user.role === 'super_admin') return true;

    // Check dynamic permissions first (Strict Mode)
    if (user.permissions && Object.keys(user.permissions).length > 0) {
        // If module exists in permissions and has 'view' (or any action), user can access it
        if (user.permissions[module] && user.permissions[module].length > 0) return true;
        
        // Or if user has global view access
        if (user.permissions.all?.includes('view')) return true;

        // If dynamic permissions exist but module is not found, deny access
        return false;
    }

    // Fallback to static module access only if no dynamic permissions exist
    return moduleAccess[module]?.includes(user.role) || false;
  };
  const finalizeLogin = () => {
    const tempToken = localStorage.getItem(TEMP_TOKEN_KEY);
    const tempUser = localStorage.getItem(TEMP_USER_KEY);

    if (tempToken && tempUser) {
      const userData = JSON.parse(tempUser);
      setToken(tempToken);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, tempToken);
      localStorage.setItem(USER_KEY, tempUser);
      localStorage.removeItem(TEMP_TOKEN_KEY);
      localStorage.removeItem(TEMP_USER_KEY);
      logUserActivity('LOGIN', 'AUTH', `User logged in: ${userData.full_name}`, userData.email);
    }
  };

  const resendOtp = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    return sendEmailOtp(email, code);
  };

  const sendEmailOtp = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok || data.error) {
          return { success: false, error: data.error || `Error ${response.status}: Failed to send email`, details: data.details };
        }
        return { success: true };
      } else {
        // Likely a 404 HTML page or other non-JSON response
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 100));
        return { success: false, error: `Server configuration error (Non-JSON). Are you running with 'vercel dev'?` };
      }
    } catch (err) {
      console.error('OTP Send Error:', err);
      return { success: false, error: 'Network error: Email service is unreachable.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isInitializing,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        changePassword,
        hasPermission,
        canAccessModule,
        updateLocalUser,
        updateEmail,
        finalizeLogin,
        resendOtp,
        sendEmailOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for checking permissions
export const usePermission = (permission: Permission | PermissionAction, module?: AdminModule | 'all'): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(permission, module);
};

// Helper hook for checking module access
export const useModuleAccess = (module: AdminModule): boolean => {
  const { canAccessModule } = useAuth();
  return canAccessModule(module);
};

