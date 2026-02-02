import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, AdminModule } from '../../contexts/AuthContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import NewsManager from './NewsManager';
import BranchManager from './BranchManager';
import MessagesManager from './MessagesManager';
import CareerManager from './CareerManager';
import PartnerManager from './PartnerManager';
import CertificationManager from './CertificationManager';
import InvestorManager from './InvestorManager';

import WebsiteManager from './WebsiteManager';
import RecruitmentManager from './RecruitmentManager';
import WebsiteContentManager from './WebsiteContentManager';
import SeoManager from './SeoManager';
import CompanyProfileManager from './CompanyProfileManager';
import UserManager from './UserManager';
import ProfilePage from './ProfilePage';
import ApplicationsManager from './ApplicationsManager';
import FAQManager from './FAQManager';
import AnalyticsManager from './AnalyticsManager';

import LoginPage from './LoginPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import NewsletterManager from './NewsletterManager';
import SecurityLogsManager from './SecurityLogsManager';
import UserActivityManager from './UserActivityManager';
import DatabaseBackupManager from './DatabaseBackupManager';

// Admin Pages Component with Auth Check and Routing
const AdminContent: React.FC = () => {
  const { isAuthenticated, isInitializing, canAccessModule } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'reset'>('login');
  const location = useLocation();

  // Check for recovery flow
  useEffect(() => {
    if (location.pathname === '/admin/reset-password') {
      setAuthView('reset');
    }
  }, [location]);
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    if (authView === 'forgot') {
      return <ForgotPasswordPage onBack={() => setAuthView('login')} />;
    }
    if (authView === 'reset') {
       // We reuse ForgotPasswordPage but force it to 'reset' step? 
       // Or better, pass the hash to it.
       return <ForgotPasswordPage onBack={() => setAuthView('login')} initialStep="reset" />;
    }
    return <LoginPage onForgotPassword={() => setAuthView('forgot')} />;
  }

  // Access Control Wrapper
  const ProtectedRoute = ({ module, children }: { module?: AdminModule, children: React.ReactNode }) => {
    if (module && !canAccessModule(module)) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to access this module.</p>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<ProtectedRoute module="dashboard"><Dashboard /></ProtectedRoute>} />
        <Route path="content/*" element={<ProtectedRoute module="content"><WebsiteContentManager /></ProtectedRoute>} />
        <Route path="recruitment/*" element={<ProtectedRoute module="recruitment"><RecruitmentManager /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute module="messages"><MessagesManager /></ProtectedRoute>} />
        <Route path="investor" element={<ProtectedRoute module="investor"><InvestorManager /></ProtectedRoute>} />
        <Route path="security_logs" element={<ProtectedRoute module="security_logs"><SecurityLogsManager /></ProtectedRoute>} />
        <Route path="audit_logs" element={<ProtectedRoute module="audit_logs"><UserActivityManager /></ProtectedRoute>} />
        <Route path="db_backup" element={<ProtectedRoute module="db_backup"><DatabaseBackupManager /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute module="analytics"><AnalyticsManager /></ProtectedRoute>} />


        {/* Company Profile with Sub-routes */}
        <Route path="company/*" element={<ProtectedRoute module="company"><CompanyProfileManager /></ProtectedRoute>} />

        {/* Website Settings with Sub-routes */}
        <Route path="website/*" element={<ProtectedRoute module="website"><WebsiteManager /></ProtectedRoute>} />


        <Route path="profile" element={<ProfilePage />} />
        <Route path="change_password" element={<ProfilePage />} />
        <Route path="reset-password" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Default Redirect from /admin to /admin/dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        {/* Catch all for admin routes */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

// Main Admin Page with Providers
const AdminPage: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* We need to match the parent path structure. App renders this at /admin/* */}
          {/* If AdminPage is rendered, location starts with /admin. */}
          {/* We can use relative paths if we set the basename or use Route nesting correctly. */}
          {/* However, since this component is rendered manually by AppLayout, we should assume the Routes here need to handle the path suffix. */}
          {/* But wait, if we use <Routes> here, and the URL is /admin/dashboard, 'dashboard' path matching might fail if the Router context doesn't know /admin is the base. */}
          {/* To be safe, we route /* here and let the internal Routes handle it relative to where we are? No, Routes matches from root if not in another Route. */}
          {/* So we must use /admin/* prefix for paths. */}
          <Route path="/admin/*" element={<AdminContent />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AdminPage;
