import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, Newspaper, Briefcase,
  MessageSquare, FileText, Globe, Award,
  ArrowRight, Clock, CheckCircle2, AlertCircle,
  TrendingUp, ExternalLink, RefreshCw, Layers,
  MapPin, Building2
} from 'lucide-react';

interface Stats {
  branches: number;
  partners: number;
  news: number;
  careers: number;
  messages: number;
  applications: number;
  divisions: number;
  certs: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { canAccessModule } = useAuth();
  const [stats, setStats] = useState<Stats>({
    branches: 0,
    partners: 0,
    news: 0,
    careers: 0,
    messages: 0,
    applications: 0,
    divisions: 0,
    certs: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [branches, partners, news, careers, messages, applications, divisions, certs] = await Promise.all([
        supabase.from('branches').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('careers').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('job_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('business_lines').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        branches: branches.count || 0,
        partners: partners.count || 0,
        news: news.count || 0,
        careers: careers.count || 0,
        messages: messages.count || 0,
        applications: applications.count || 0,
        divisions: divisions.count || 0,
        certs: certs.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [messagesData, applicationsData] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('job_applications').select('*, careers(title)').order('created_at', { ascending: false }).limit(5),
      ]);

      setRecentMessages(messagesData.data || []);
      setRecentApplications(applicationsData.data || []);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allStatCards = [
    {
      id: 'content',
      label: t('admin.dashboard.stat.news'),
      value: stats.news,
      icon: Newspaper,
      color: 'from-blue-600 to-indigo-600',
      lightColor: 'bg-blue-50 text-blue-600',
      description: t('admin.dashboard.stat.news_desc') || 'Published updates',
      path: '/admin/content/news'
    },
    {
      id: 'messages',
      label: t('admin.dashboard.stat.messages'),
      value: stats.messages,
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      lightColor: 'bg-amber-50 text-amber-600',
      description: t('admin.dashboard.stat.messages_desc') || 'Unread inquiries',
      path: '/admin/messages'
    },
    {
      id: 'recruitment',
      label: t('admin.dashboard.stat.applications'),
      value: stats.applications,
      icon: FileText,
      color: 'from-emerald-500 to-teal-600',
      lightColor: 'bg-emerald-50 text-emerald-600',
      description: t('admin.dashboard.stat.applications_desc') || 'Pending review',
      path: '/admin/recruitment/applications'
    },
    {
      id: 'recruitment',
      label: t('admin.dashboard.stat.active_jobs'),
      value: stats.careers,
      icon: Briefcase,
      color: 'from-purple-500 to-fuchsia-600',
      lightColor: 'bg-purple-50 text-purple-600',
      description: t('admin.dashboard.stat.jobs_desc') || 'Open positions',
      path: '/admin/recruitment/careers'
    },
    {
      id: 'company',
      label: t('admin.dashboard.stat.partners'),
      value: stats.partners,
      icon: Users,
      color: 'from-rose-500 to-red-600',
      lightColor: 'bg-rose-50 text-rose-600',
      description: t('admin.dashboard.stat.partners_desc') || 'Business network',
      path: '/admin/company/partners'
    },
    {
      id: 'investor',
      label: t('admin.dashboard.stat.investor'),
      value: stats.certs,
      icon: TrendingUp,
      color: 'from-cyan-500 to-sky-600',
      lightColor: 'bg-cyan-50 text-cyan-600',
      description: t('admin.dashboard.stat.investor_desc') || 'Financial reports',
      path: '/admin/investor'
    },
  ];

  const statCards = allStatCards.filter(card => canAccessModule(card.id as any));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <RefreshCw className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700 max-md:space-y-6 max-md:pb-10 max-md:overflow-x-hidden">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl max-md:rounded-[2rem] max-md:p-6">
        <div className="relative z-10 md:flex items-center justify-between">
          <div className="space-y-4 text-left max-md:space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <Clock size={14} className="text-blue-400 max-md:shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">{t('admin.dashboard.system_overview')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none max-md:text-3xl">
              {t('admin.dashboard.welcome')} <br />
              <span className="text-blue-400">Penta Valent</span>
            </h2>
            <p className="text-gray-400 max-w-md font-medium max-md:text-sm">
              {t('admin.dashboard.subtitle')}
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex gap-4 max-md:flex-col max-md:gap-3">
            <div className="px-8 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-center min-w-[140px] group hover:bg-white/10 transition-all cursor-pointer max-md:px-4 max-md:py-4 max-md:rounded-2xl max-md:w-full" onClick={() => navigate('/admin/company/branches')}>
              <p className="text-3xl font-black text-blue-400 mb-1 max-md:text-2xl">{stats.branches}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('admin.dashboard.stat.branches')}</p>
            </div>
            <div className="px-8 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-center min-w-[140px] group hover:bg-white/10 transition-all cursor-pointer max-md:px-4 max-md:py-4 max-md:rounded-2xl max-md:w-full" onClick={() => navigate('/admin/company/certifications')}>
              <p className="text-3xl font-black text-emerald-400 mb-1 max-md:text-2xl">{stats.certs}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('admin.dashboard.stat.certs')}</p>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[100%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[100%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-md:gap-4 max-md:grid-cols-2">
        {statCards.map((stat) => (
          <button
            key={stat.id}
            onClick={() => navigate(stat.path)}
            className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 text-center relative overflow-hidden active:scale-95 max-md:rounded-3xl max-md:p-5 max-md:w-full max-md:min-h-auto"
          >
            <div className="flex flex-col h-full justify-between items-center space-y-4 max-md:space-y-2">
              <div className={`p-4 rounded-2xl ${stat.lightColor} group-hover:scale-110 transition-transform max-md:p-3 max-md:rounded-xl`}>
                <stat.icon size={24} className="max-md:w-5 max-md:h-5 max-md:shrink-0" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 leading-none mb-1 max-md:text-xl">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest max-md:text-[8px]">{stat.label}</p>
              </div>
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-blue-500 transition-colors max-md:hidden">
                {stat.description}
              </p>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity max-md:hidden">
              <ArrowRight size={16} className="text-blue-500" />
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${stat.color} transition-all duration-700`} />
          </button>
        ))}
      </div>

      {/* Content & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-md:gap-6">
        {/* Recent Messages */}
        {canAccessModule('messages') && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden text-left max-md:rounded-[2rem]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between max-md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 max-md:shrink-0">
                  <MessageSquare size={20} className="max-md:w-5 max-md:h-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic max-md:text-base">{t('admin.dashboard.recent_messages')}</h3>
              </div>
              <button
                onClick={() => navigate('/admin/messages')}
                className="text-amber-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 font-bold max-md:min-h-[44px]"
              >
                {t('admin.dashboard.view_all')} <ArrowRight size={12} className="max-md:shrink-0" />
              </button>
            </div>
            <div className="p-4 space-y-1 max-md:p-2">
              {recentMessages.length === 0 ? (
                <div className="py-20 text-center max-md:py-10">
                  <MessageSquare className="mx-auto text-gray-100 mb-4 max-md:w-10 max-md:h-10" size={48} />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('admin.dashboard.no_messages')}</p>
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => navigate('/admin/messages')}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-2xl transition-all flex items-start justify-between group max-md:p-3"
                  >
                    <div className="flex gap-4 max-md:gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black shrink-0 relative max-md:w-10 max-md:h-10">
                        {msg.name.charAt(0)}
                        {!msg.is_read && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic max-md:text-xs">{msg.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px] max-md:max-w-[150px] max-md:text-[10px]">{msg.subject}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-medium max-md:text-[8px]">
                          {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 max-md:opacity-100">
                      <ExternalLink size={14} className="text-blue-500 max-md:w-3 max-md:h-3" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {canAccessModule('recruitment') && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden text-left max-md:rounded-[2rem]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between max-md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 max-md:shrink-0">
                  <FileText size={20} className="max-md:w-5 max-md:h-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic max-md:text-base">{t('admin.dashboard.talent_pipeline')}</h3>
              </div>
              <button
                onClick={() => navigate('/admin/applications')}
                className="text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 font-bold max-md:min-h-[44px]"
              >
                {t('admin.dashboard.view_all')} <ArrowRight size={12} className="max-md:shrink-0" />
              </button>
            </div>
            <div className="p-4 space-y-1 max-md:p-2">
              {recentApplications.length === 0 ? (
                <div className="py-20 text-center max-md:py-10">
                  <FileText className="mx-auto text-gray-100 mb-4 max-md:w-10 max-md:h-10" size={48} />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('admin.dashboard.no_apps')}</p>
                </div>
              ) : (
                recentApplications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => navigate('/admin/applications')}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-2xl transition-all flex items-start justify-between group max-md:p-3"
                  >
                    <div className="flex gap-4 max-md:gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black shrink-0 max-md:w-10 max-md:h-10">
                        {app.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic max-md:text-xs">{app.full_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Briefcase size={10} className="text-emerald-400 max-md:shrink-0" />
                          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter max-md:text-[9px] truncate max-md:max-w-[100px]">{app.careers?.title}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-medium max-md:text-[8px]">
                          {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest h-fit max-md:px-1.5 max-md:py-0.5 ${app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-rose-100 text-rose-700'
                      }`}>
                      {app.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-md:gap-3 max-md:grid-cols-1">
        {canAccessModule('settings') && (
          <button onClick={() => navigate('/admin/settings')} className="bg-white p-6 rounded-[2.2rem] border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group active:scale-95 max-md:p-4 max-md:rounded-2xl max-md:w-full max-md:min-h-[44px]">
            <div className="w-12 h-12 bg-blue-50 rounded-[1.25rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner max-md:w-10 max-md:h-10 max-md:shrink-0">
              <RefreshCw size={24} className="max-md:w-5 max-md:h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-md:text-[8px]">{t('admin.dashboard.identity')}</p>
              <p className="text-xs font-bold text-gray-800 max-md:text-[10px]">{t('admin.menu.settings')}</p>
            </div>
          </button>
        )}
        {canAccessModule('website') && (
          <button onClick={() => navigate('/admin/hero')} className="bg-white p-6 rounded-[2.2rem] border border-gray-100 hover:border-rose-200 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group active:scale-95 max-md:p-4 max-md:rounded-2xl max-md:w-full max-md:min-h-[44px]">
            <div className="w-12 h-12 bg-rose-50 rounded-[1.25rem] flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner max-md:w-10 max-md:h-10 max-md:shrink-0">
              <LayoutDashboard size={24} className="max-md:w-5 max-md:h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-md:text-[8px]">{t('admin.dashboard.media')}</p>
              <p className="text-xs font-bold text-gray-800 max-md:text-[10px]">{t('admin.menu.hero')}</p>
            </div>
          </button>
        )}
        {canAccessModule('company') && (
          <button onClick={() => navigate('/admin/company')} className="bg-white p-6 rounded-[2.2rem] border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group active:scale-95 max-md:p-4 max-md:rounded-2xl max-md:w-full max-md:min-h-[44px]">
            <div className="w-12 h-12 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner max-md:w-10 max-md:h-10 max-md:shrink-0">
              <Building2 size={24} className="max-md:w-5 max-md:h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-md:text-[8px]">{t('admin.dashboard.identity')}</p>
              <p className="text-xs font-bold text-gray-800 max-md:text-[10px]">Corp Identity</p>
            </div>
          </button>
        )}
        {canAccessModule('seo') && (
          <button onClick={() => navigate('/admin/seo')} className="bg-white p-6 rounded-[2.2rem] border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group active:scale-95 max-md:p-4 max-md:rounded-2xl max-md:w-full max-md:min-h-[44px]">
            <div className="w-12 h-12 bg-emerald-50 rounded-[1.25rem] flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner max-md:w-10 max-md:h-10 max-md:shrink-0">
              <Globe size={24} className="max-md:w-5 max-md:h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-md:text-[8px]">{t('admin.dashboard.marketing')}</p>
              <p className="text-xs font-bold text-gray-800 max-md:text-[10px]">{t('admin.menu.seo')}</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
