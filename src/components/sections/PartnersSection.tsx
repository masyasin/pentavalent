import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  partner_type: string;
  website: string;
}

const PartnersSection: React.FC = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = activeFilter === 'all'
    ? partners
    : partners.filter(p => p.partner_type === activeFilter);

  // Generate placeholder logos for partners
  const getPartnerInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const partnerColors = [
    'bg-blue-600', 'bg-cyan-600', 'bg-green-600', 'bg-purple-600',
    'bg-red-600', 'bg-orange-600', 'bg-pink-600', 'bg-indigo-600',
    'bg-teal-600', 'bg-yellow-600', 'bg-emerald-600', 'bg-rose-600'
  ];

  return (
    <section id="partners" className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 uppercase tracking-tight">
          <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] mb-6 border border-primary/10">
            {t('partners.tagline')}
          </span>
          <h2 className="text-fluid-h1 py-2 mb-8 text-slate-900">
            {t('partners.title.text')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block">{t('partners.title.italic')}</span>
          </h2>
          <p className="text-fluid-body text-gray-500">
            {t('partners.description')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 backdrop-blur-sm">
            {[
              { id: 'all', label: t('partners.filter.all') },
              { id: 'principal', label: t('partners.filter.national') },
              { id: 'international', label: t('partners.filter.global') }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === filter.id
                  ? 'wow-button-gradient text-white shadow-xl'
                  : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-slate-600'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white/50 border border-gray-100 rounded-3xl p-8 h-40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredPartners.map((partner, index) => (
              <div
                key={partner.id}
                className="bg-white rounded-[2rem] p-10 flex items-center justify-center hover:shadow-4xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-gray-100 enterprise-shadow relative overflow-hidden touch-active active:scale-[0.98]"
                onClick={() => partner.website && window.open(partner.website, '_blank')}
                aria-label={`Visit ${partner.name} website`}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-20 h-20 ${partnerColors[index % partnerColors.length]} rounded-3xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 group-hover:wow-button-gradient transition-all shadow-lg`}>
                  {getPartnerInitials(partner.name)}
                </div>
                <div className="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <span className="text-[9px] font-black wow-text-primary uppercase tracking-[0.2em]">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partner Stats - Redesigned for Premium Look */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-2">
          {[
            {
              value: '50+',
              label: t('partners.stats.national'),
              icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" />
                </svg>
              ),
              color: 'from-blue-600 to-indigo-600',
              accent: 'blue'
            },
            {
              value: '20+',
              label: t('partners.stats.international'),
              icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'from-cyan-500 to-blue-500',
              accent: 'cyan'
            },
            {
              value: '10K+',
              label: t('partners.stats.skus'),
              icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
              color: 'from-indigo-600 to-purple-600',
              accent: 'indigo'
            }
          ].map((stat, i) => (
            <div key={i} className="group relative bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden flex flex-col items-center text-center">
              {/* Subtle top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

              {/* Animated Background Decor */}
              <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] rounded-full blur-3xl transition-opacity duration-700`}></div>

              {/* Icon Holder */}
              <div className="relative mb-8 p-6 rounded-3xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-all duration-700 border border-slate-50 group-hover:border-slate-100 shadow-inner group-hover:shadow-lg">
                <div className="group-hover:rotate-6 transition-transform duration-700">
                  {stat.icon}
                </div>
              </div>

              {/* Value with dynamic color */}
              <div className={`text-4xl md:text-6xl font-black mb-3 text-slate-900 group-hover:bg-gradient-to-br ${stat.color} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-700 tracking-tighter`}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-[10px] md:text-xs font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-[0.25em] transition-colors leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 md:mt-32">
          <div className="enterprise-gradient rounded-[2rem] md:rounded-[4rem] p-6 sm:p-16 md:p-24 shadow-4xl relative overflow-hidden group">
            {/* Advanced Decorative background circle */}
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-accent opacity-10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="absolute right-0 top-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="inline-block px-5 py-2 bg-white/10 text-accent rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-8 border border-white/10 backdrop-blur-md">
                {t('partners.cta.tagline')}
              </span>
              <h3 className="text-3xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight max-w-4xl">
                {t('partners.cta.title.text')} <br />
                <span className="text-accent italic">{t('partners.cta.title.accent')}</span>
              </h3>
              <p className="text-blue-100/60 mb-12 max-w-2xl text-xl leading-relaxed font-medium">
                {t('partners.cta.description')}
              </p>
              <button
                className="px-14 py-6 wow-button-gradient text-white font-black rounded-[2rem] hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-4 group text-lg hover-move-icon touch-active"
                aria-label={t('partners.cta.button')}
              >
                {t('partners.cta.button')}
                <svg className="w-6 h-6 rotate-animation" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
