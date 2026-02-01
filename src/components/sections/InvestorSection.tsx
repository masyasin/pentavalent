import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { MiniStockChart } from '../investor/TradingViewWidgets';

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
  const [calendar, setCalendar] = useState<any[]>([]);

  useEffect(() => {
    fetchDocuments();
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const { data, error } = await supabase
        .from('investor_calendar')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true })
        .limit(2);
      if (!error && data) setCalendar(data);
    } catch (err) {
      console.error('Error fetching calendar:', err);
    }
  };

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
    <section id="investors" className="py-24 md:py-48 bg-white relative overflow-hidden">
      {/* Subtle Institutional Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 gap-12">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg mb-8">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                {language === 'id' ? 'Transparansi & Tata Kelola' : 'Transparency & Governance'}
              </span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black mb-0 text-slate-900 tracking-tighter leading-[1.05]">
              {language === 'id' ? 'Hubungan' : 'Investor'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 italic pr-4">{language === 'id' ? 'Investor' : 'Relations'}</span>
            </h2>
          </div>

          <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex items-center gap-8 md:gap-10 group transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <MiniStockChart symbol="PEVE" theme="dark" />
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-all border border-white/10 relative z-10">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div className="relative z-10">
              <div className="text-3xl md:text-4xl font-black text-white leading-none mb-2 tracking-tighter">PEVE</div>
              <div className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">{t('investor.ticker.label')}</div>
            </div>
          </div>
        </div>

        {/* Financial Highlights - Formalized */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { label: t('investor.stats.revenue'), value: '18.4%', desc: 'Annual Growth' },
            { label: t('investor.stats.mcap'), value: '2.4T', desc: 'Market Cap' },
            { label: t('investor.stats.dividen'), value: '4.2%', desc: 'Current Yield' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-10 md:p-14 rounded-[3rem] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{stat.label}</div>
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Resources Grid - Simplified structure */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden group">
            <h3 className="text-4xl font-black text-white mb-10 tracking-tighter">{t('investor.reports.title')}</h3>
            <div className="space-y-4">
              {[
                { title: 'Annual Report 2024', date: 'Jan 2025' },
                { title: 'Financial Statement Q3 2024', date: 'Oct 2024' }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-8 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group/item">
                  <div className="text-left">
                    <div className="font-black tracking-tight text-lg mb-1">{item.title}</div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.date}</div>
                  </div>
                  <div className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover/item:bg-blue-500 group-hover/item:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] p-12 md:p-20 border border-slate-100 shadow-2xl relative">
            <h3 className="text-4xl font-black mb-12 tracking-tighter text-slate-900">{t('investor.calendar.title')}</h3>
            <div className="space-y-10">
              {(calendar.length > 0 ? calendar : [
                { title_id: 'Rilis Hasil Keuangan', title_en: 'Financial Results Release', event_date: '2025-03-15', event_type: 'Earnings' },
                { title_id: 'Rapat Umum Pemegang Saham', title_en: 'Annual General Meeting', event_date: '2025-04-22', event_type: 'Corporate' }
              ]).map((event, i) => (
                <div key={i} className="flex items-center gap-10 group border-b border-slate-50 pb-10 last:border-0 last:pb-0">
                  <div className="text-center w-24">
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                      {new Date(event.event_date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{event.event_type}</div>
                    <div className="text-xl font-bold text-slate-900 leading-tight group-hover:text-slate-600 transition-colors">
                      {language === 'id' ? event.title_id : event.title_en}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Institutional Access */}
        <div className="mt-24 pt-24 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label_id: 'Profil Perusahaan', label_en: 'Company Profile', link: '/about/profile', icon: '🏢' },
              { label_id: 'Laporan Keuangan', label_en: 'Financial Reports', link: '/investor/laporan-keuangan', icon: '📊' },
              { label_id: 'Tata Kelola GCG', label_en: 'Corporate Governance', link: '/about/legality-achievements', icon: '⚖️' },
              { label_id: 'Pusat Berita', label_en: 'Media Center', link: '/news', icon: '📰' }
            ].map((link, i) => (
              <a
                key={i}
                href={link.link}
                className="group p-8 rounded-3xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
              >
                <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{link.icon}</div>
                <div className="text-lg font-black text-slate-900 mb-2">
                  {language === 'id' ? link.label_id : link.label_en}
                </div>
                <div className="w-10 h-1 bg-slate-100 group-hover:w-20 group-hover:bg-slate-900 transition-all duration-500"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorSection;
