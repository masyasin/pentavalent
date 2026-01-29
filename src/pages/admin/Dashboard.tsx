import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Stats {
  branches: number;
  partners: number;
  news: number;
  careers: number;
  messages: number;
  applications: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    branches: 0,
    partners: 0,
    news: 0,
    careers: 0,
    messages: 0,
    applications: 0,
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
      const [branches, partners, news, careers, messages, applications] = await Promise.all([
        supabase.from('branches').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('careers').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('job_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      setStats({
        branches: branches.count || 0,
        partners: partners.count || 0,
        news: news.count || 0,
        careers: careers.count || 0,
        messages: messages.count || 0,
        applications: applications.count || 0,
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

  const statCards = [
    { label: 'Total Branches', value: stats.branches, icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', color: 'bg-blue-500' },
    { label: 'Partners', value: stats.partners, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-green-500' },
    { label: 'News Articles', value: stats.news, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', color: 'bg-purple-500' },
    { label: 'Active Jobs', value: stats.careers, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-yellow-500' },
    { label: 'Unread Messages', value: stats.messages, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-red-500' },
    { label: 'Pending Applications', value: stats.applications, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : recentMessages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No messages yet</div>
            ) : (
              recentMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{message.name}</span>
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.subject || 'No subject'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Job Applications</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : recentApplications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No applications yet</div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{app.full_name}</span>
                      <p className="text-sm text-gray-600">{app.careers?.title || 'Unknown position'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium text-blue-700">Add News</span>
          </button>
          <button className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
            <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-green-700">Post Job</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors">
            <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-purple-700">Upload Report</span>
          </button>
          <button className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors">
            <svg className="w-8 h-8 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-yellow-700">Add Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
