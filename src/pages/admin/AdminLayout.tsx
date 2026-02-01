import React, { useState } from 'react';
import { useAuth, AdminModule } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationBadge from '../../components/admin/NotificationBadge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, canAccessModule } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current page ID from URL (e.g. /admin/news -> news)
  const currentPath = location.pathname.split('/')[2] || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: t('admin.menu.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'website', label: t('admin.menu.website'), icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { id: 'company', label: t('admin.menu.company'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'content', label: t('admin.menu.content'), icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: 'recruitment', label: t('admin.menu.recruitment'), icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'investor', label: t('admin.menu.investor'), icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },

    { id: 'messages', label: t('admin.menu.messages'), icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'security_logs', label: t('admin.menu.security_logs'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'audit_logs', label: t('admin.menu.activity_logs'), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'analytics', label: t('admin.menu.analytics'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },

  ];

  const accessibleMenuItems = menuItems.filter(item => canAccessModule(item.id as AdminModule));

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'editor': return 'bg-blue-100 text-blue-700';
      case 'viewer': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[100] bg-gray-900 transition-all duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 lg:w-0 -translate-x-full lg:translate-x-0'
        } overflow-hidden`}>
        <div className="w-64 h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Penta Valent" className="h-8 w-auto brightness-0 invert" />
              <span className="text-white font-black uppercase tracking-tighter italic">Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {accessibleMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/admin/${item.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentPath === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <div className="relative">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span className="text-sm font-bold tracking-wide truncate flex-1 text-left">{item.label}</span>
                {item.id === 'messages' && <NotificationBadge type="messages" />}
                {item.id === 'recruitment' && <NotificationBadge type="applications" />}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-2xl">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate uppercase tracking-tighter italic">{user?.full_name}</p>
                <p className="text-[10px] text-gray-500 truncate font-medium uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for sidebar (mobile only) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[90] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 relative h-screen transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 z-[80]">
          <div className="h-20 flex items-center justify-between px-8">
            <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic">
                {t(`admin.menu.${currentPath}`) || currentPath.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Language Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'id' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  EN
                </button>
              </div>

              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleBadgeColor(user?.role || '')}`}>
                {user?.role?.replace('_', ' ')}
              </span>

              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 group p-1 pr-3 rounded-2xl hover:bg-gray-50 transition-all">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">{user?.full_name}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-widest leading-none">{t('admin.settings')}</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <>
                    {/* Menu Backdrop */}
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />

                    {/* Menu Dropdown */}
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-[100] animate-in fade-in slide-in-from-top-2">
                      <div className="px-6 py-4 border-b border-gray-50">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">{user?.full_name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 truncate">{user?.email}</p>
                      </div>

                      <div className="p-2 space-y-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/profile');
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentPath === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <div className={`p-2 rounded-xl ${currentPath === 'profile' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                          {t('admin.menu.profile')}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/change_password');
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentPath === 'change_password' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <div className={`p-2 rounded-xl ${currentPath === 'change_password' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                          </div>
                          {t('admin.menu.security')}
                        </button>
                      </div>

                      <div className="px-2 pt-2 border-t border-gray-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-red-600 hover:bg-red-50 transition-all text-left"
                        >
                          <div className="p-2 rounded-xl bg-red-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          </div>
                          {t('admin.menu.signout')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 transition-all duration-300 no-scrollbar flex flex-col`}>
          <div className="flex-1">
            {children}
          </div>

          <footer className="mt-8 py-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              &copy; 2026 PT PENTA VALENT TBK
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
