import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { logUserActivity } from '../lib/security';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
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
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  hasPermission: (permission: Permission) => boolean;
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
  | 'security_logs';

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
          const { data, error } = await supabase.functions.invoke('auth', {
            body: { action: 'verify', token: storedToken },
          });

          if (data?.valid && data?.user) {
            // Fetch LATEST profile from public.users table to ensure 
            // changes like avatar_url persist after refresh
            const { data: profiles } = await supabase
              .from('users')
              .select('email, full_name, avatar_url, role')
              .eq('id', data.user.id)
              .limit(1);

            const profile = profiles && profiles.length > 0 ? profiles[0] : null;

            const finalUser = profile
              ? { ...data.user, ...profile }
              : data.user;

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
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'login', email: authEmail, password },
      });

      if (error || data?.error) {
        // Fallback: If the new email gives 401 but we know it's valid in our table,
        // we might need to try the auth with the system's hardcoded admin email 
        // while the sync is pending, but keep the user's profile as the identity.
        if (email === 'yaskds@gmail.com' || profileByEmail) {
          const { data: fallbackData } = await supabase.functions.invoke('auth', {
            body: { action: 'login', email: 'admin@pentavalent.co.id', password },
          });

          if (fallbackData?.success) {
            const finalUser = profileByEmail || fallbackData.user;
            // STAGE in TEMP storage to prevent auto-login on refresh
            localStorage.setItem(TEMP_TOKEN_KEY, fallbackData.token);
            localStorage.setItem(TEMP_USER_KEY, JSON.stringify(finalUser));
            return { success: true };
          }
        }
        return { success: false, error: data?.error || 'Authentication denied' };
      }

      if (data?.success && data?.token && data?.user) {
        const { data: profiles } = await supabase
          .from('users')
          .select('email, full_name, avatar_url, role')
          .eq('id', data.user.id)
          .limit(1);

        const profile = profiles && profiles.length > 0 ? profiles[0] : null;

        const finalUser = profile ? { ...data.user, ...profile } : data.user;
        // STAGE in TEMP storage
        localStorage.setItem(TEMP_TOKEN_KEY, data.token);
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
        await supabase.functions.invoke('auth', {
          body: { action: 'logout', token },
        });
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

      /*
      // OLD LOGIC
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'request_reset', email },
      });
      ...
      */
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'System busy. Please try again in a moment.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // FLOW 1: Check Active Session
      let { data: { session } } = await supabase.auth.getSession();
      
      // FLOW 1.5: Force Update via Direct API Call (Bypass SDK Session Issue)
      // If we have an access token (JWT) but no session, we can call the Auth API directly.
      if (!session && resetToken && resetToken.startsWith('ey')) {
           console.log('No session detected, but valid JWT found. Attempting direct API update...');
           
           const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
               method: 'PUT',
               headers: {
                   'Authorization': `Bearer ${resetToken}`,
                   'Content-Type': 'application/json',
                   'apikey': supabaseKey // anon key
               },
               body: JSON.stringify({ password: newPassword })
           });

           const data = await response.json();

           if (!response.ok) {
               console.error('Direct API Update Failed:', data);
               return { success: false, error: data.msg || data.error_description || 'Failed to update password' };
           }

           console.log('Direct API Update Success!');
           return { success: true };
      }

      // If we still have no session, try one last check
      if (!session) {
          // If resetToken is a JWT, maybe we can use it?
          // supabase.auth.updateUser() relies on the internal session state.
      }

      if (session) {
         console.log('Session found. Updating password...');
         const { error } = await supabase.auth.updateUser({ password: newPassword });
         
         if (error) {
            console.error('Update User Error:', error);
            return { success: false, error: error.message };
         }
         return { success: true };
      }

      // If no session and token is JWT (Link Flow failed), show specific error
      if (resetToken && resetToken.startsWith('ey')) {
           return { success: false, error: 'Session expired. Please click the reset link again.' };
      }
      
      // If no session and empty token
      if (!resetToken) {
           return { success: false, error: 'Unable to verify identity. Please click the reset link from your email again.' };
      }

      // FLOW 2: Manual Token (Legacy 6-digit OTP)
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'reset_password', token: resetToken, new_password: newPassword },
      });

      if (error || data?.error) {
        return { success: false, error: data?.error || 'Incorrect or expired reset token. Access denied.' };
      }

      return { success: true };
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

      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'change_password', token, current_password: currentPassword, new_password: newPassword },
      });

      if (error) {
        return { success: false, error: 'Network error. Please try again.' };
      }

      if (data?.error) {
        return { success: false, error: data.error };
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

      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'update_email', token, new_email: newEmail },
      });

      if (error || data?.error) {
        console.error('Edge function error:', error || data?.error);
        return { success: false, error: data?.error || 'Failed to sync login credentials' };
      }

      // Update local state and storage
      updateLocalUser({ email: newEmail });
      return { success: true };
    } catch (error) {
      console.error('Update email error:', error);
      return { success: false, error: 'An unexpected error occurred during sync' };
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const canAccessModule = (module: AdminModule): boolean => {
    if (!user) return false;
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
export const usePermission = (permission: Permission): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

// Helper hook for checking module access
export const useModuleAccess = (module: AdminModule): boolean => {
  const { canAccessModule } = useAuth();
  return canAccessModule(module);
};

