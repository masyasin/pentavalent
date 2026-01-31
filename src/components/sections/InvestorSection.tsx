import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface InvestorDocument {
  id: string;
  title_id: string;
  title_en: string;
  document_type: string;
  year: number;
  quarter: string | null;
  file_url: string;
  published_at: string;
}

const InvestorSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('investor_documents')
        .select('*')
        .eq('is_published', true)
        .order('year', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = activeTab === 'all'
    ? documents
    : documents.filter(d => d.document_type === activeTab);

  const documentTypeLabels: { [key: string]: string } = {
    'annual_report': 'Laporan Tahunan',
    'quarterly_report': 'Laporan Kuartalan',
    'prospectus': 'Prospektus',
  };

  const documentTypeIcons: { [key: string]: JSX.Element } = {
    'annual_report': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'quarterly_report': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'prospectus': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };

  return (
    <section id="investors" className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
      {/* Dynamic background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {t('investor.tagline')}
            </span>
            <h2 className="text-fluid-h1 py-2 mb-10 text-slate-900 border-l-8 border-cyan-500 pl-6 md:pl-10">
              {t('investor.title.text')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block pr-4">{t('investor.title.italic')}</span>
            </h2>
            <p className="text-fluid-body text-gray-500 max-w-3xl">
              {t('investor.description')}
            </p>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] enterprise-shadow border-white/60 flex items-center gap-8 group hover:wow-border-glow transition-all duration-500">
            <div className="w-16 h-16 rounded-3xl wow-button-gradient flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 group-hover:scale-110 transition-all">
              <svg className="w-8 h-8 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <div className="text-3xl font-black wow-text-primary inline-block transition-colors leading-none mb-1">PEVE</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{t('investor.ticker.label')}</div>
            </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { label: t('investor.stats.revenue'), value: '18.4%', color: 'accent' },
            { label: t('investor.stats.mcap'), value: '2.4T', color: 'primary' },
            { label: t('investor.stats.dividen'), value: '4.2%', color: 'primary' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 sm:p-12 rounded-[2rem] md:rounded-[3rem] enterprise-shadow border border-gray-100 group wow-border-glow transition-all text-center">
              <div className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 group-hover:wow-text-primary transition-colors">{stat.label}</div>
              <div className={`text-5xl font-black wow-text-primary inline-block mb-6 tracking-tighter group-hover:scale-110 transition-transform`}>{stat.value}</div>
              <div className="flex items-center justify-center gap-2 wow-text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <span className="text-xs font-black uppercase tracking-widest">{t('investor.stats.growth')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="enterprise-gradient rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            </div>
            <h3 className="text-4xl font-black text-white mb-8 tracking-tighter leading-tight">{t('investor.reports.title')}</h3>
            <p className="text-blue-100/60 mb-12 text-xl font-medium leading-relaxed max-w-sm">
              {t('investor.reports.desc')}
            </p>
            <div className="space-y-4">
              {['Annual Report 2024', 'Quarterly Presentation Q3', 'Consolidated Financials'].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/5 transition-all group">
                  <span className="font-bold tracking-tight">{item}</span>
                  <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-20 border border-gray-100 enterprise-shadow relative group">
            <div className="flex items-start justify-between mb-12">
              <div className="w-16 h-16 wow-button-gradient text-white rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('investor.calendar.upcoming')}</div>
                <div className="text-lg font-black wow-text-primary">AGMS FY2024</div>
              </div>
            </div>
            <h3 className="text-4xl font-black mb-8 tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-4 pr-6">{t('investor.calendar.title')}</h3>
            <div className="space-y-8">
              {[
                { date: 'MAR 15', label: 'FY2024 Financial Results Release', type: 'Earnings' },
                { date: 'APR 22', label: 'Annual General Meeting (AGMS)', type: 'Corporate' },
                { date: 'MAY 10', label: 'Quarterly Filing - Q1 2025', type: 'Earnings' }
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-8 group cursor-pointer">
                  <div className="text-center w-20">
                    <div className="text-sm font-black wow-text-primary uppercase tracking-widest">{event.date.split(' ')[0]}</div>
                    <div className="text-2xl font-black text-slate-900 group-hover:wow-text-primary inline-block transition-colors">{event.date.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1 pb-8 border-b border-gray-50 group-last:border-0">
                    <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:wow-text-primary transition-colors">{event.type}</div>
                    <div className="text-lg font-bold text-slate-900 group-hover:wow-text-primary inline-block group-hover:translate-x-2 transition-all duration-300">{event.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorSection;
