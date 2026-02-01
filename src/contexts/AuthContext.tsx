import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; reset_token?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  hasPermission: (permission: Permission) => boolean;
  canAccessModule: (module: AdminModule) => boolean;
  updateLocalUser: (userData: Partial<User>) => void;
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
  | 'newsletter';

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'peve_admin_token';
const USER_KEY = 'peve_admin_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            setToken(storedToken);
            setUser(data.user);
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
      setIsLoading(false);
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
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'login', email, password },
      });

      if (error) {
        return { success: false, error: 'Network error. Please try again.' };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      if (data?.success && data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
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
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string; reset_token?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'request_reset', email },
      });

      if (error) {
        return { success: false, error: 'Network error. Please try again.' };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      return { success: true, reset_token: data?.reset_token };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'reset_password', token: resetToken, new_password: newPassword },
      });

      if (error) {
        return { success: false, error: 'Network error. Please try again.' };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
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

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const canAccessModule = (module: AdminModule): boolean => {
    if (!user) return false;
    return moduleAccess[module]?.includes(user.role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        changePassword,
        hasPermission,
        canAccessModule,
        updateLocalUser,
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
