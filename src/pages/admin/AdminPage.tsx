import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
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
import BusinessLineManager from './BusinessLineManager';
import SiteSettingsManager from './SiteSettingsManager';
import HeroSliderManager from './HeroSliderManager';
import SeoManager from './SeoManager';
import CompanyProfileManager from './CompanyProfileManager';
import UserManager from './UserManager';
import ProfilePage from './ProfilePage';
import ApplicationsManager from './ApplicationsManager';
import MenuManager from './MenuManager';
import ChannelsManager from './ChannelsManager';
import FAQManager from './FAQManager';
import AnalyticsManager from './AnalyticsManager';
import LegalDocumentsManager from './LegalDocumentsManager';
import LoginPage from './LoginPage';
import ForgotPasswordPage from './ForgotPasswordPage';

// Main Admin Content with Auth Check
const AdminContent: React.FC = () => {
  const { isAuthenticated, isLoading, canAccessModule } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authView, setAuthView] = useState<'login' | 'forgot'>('login');

  // Show loading state
  if (isLoading) {
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
    return <LoginPage onForgotPassword={() => setAuthView('forgot')} />;
  }

  // Render admin pages based on current page and permissions
  const renderPage = () => {
    // Check if user can access the current page
    if (!canAccessModule(currentPage as any) && currentPage !== 'profile' && currentPage !== 'change_password') {
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

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'news':
        return <NewsManager />;
      case 'messages':
        return <MessagesManager />;
      case 'careers':
        return <CareerManager />;
      case 'investor':
        return <InvestorManager />;
      case 'hero':
        return <HeroSliderManager />;
      case 'seo':
        return <SeoManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'company':
        return <CompanyProfileManager />;
      case 'settings':
        return <SiteSettingsManager />;
      case 'profile':
        return <ProfilePage />;
      case 'users':
        return <UserManager />;
      case 'menus':
        return <MenuManager />;
      case 'applications':
        return <ApplicationsManager />;
      case 'channels':
        return <ChannelsManager />;
      case 'faqs':
        return <FAQManager />;
      case 'legal':
        return <LegalDocumentsManager />;
      case 'change_password':
        return <ProfilePage />; // Already handled in ProfilePage
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
};

// Main Admin Page with Providers
const AdminPage: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AdminContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AdminPage;
