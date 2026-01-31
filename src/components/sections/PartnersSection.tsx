import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  partner_type: string;
  website: string;
  description_id: string;
  description_en: string;
}

const PartnerCard: React.FC<{
  partner: Partner;
  index: number;
  partnerColors: string[];
  language: string;
  getPartnerInitials: (name: string) => string;
}> = ({ partner, index, partnerColors, language, getPartnerInitials }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-[2.5rem] p-4 flex flex-col items-center text-center transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 border border-slate-100/80 overflow-hidden"
    >
      {/* Logo Box - Clean & Minimalist */}
      <div className="w-full aspect-[16/10] bg-slate-50/30 rounded-[2rem] flex items-center justify-center relative mb-6 overflow-hidden border border-slate-50 group/logo">
        {partner.logo_url && !imgError ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            onError={() => setImgError(true)}
            className="w-[85%] h-[85%] object-contain relative z-10 transition-all duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`w-14 h-14 ${partnerColors[index % partnerColors.length]} rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md relative z-10`}>
            {getPartnerInitials(partner.name)}
          </div>
        )}
      </div>

      {/* Content - Clean & Proportional */}
      <div className="px-4 pb-6 flex flex-col flex-grow items-center w-full">
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3 uppercase italic tracking-tight leading-tight min-h-[2.5rem] flex items-center justify-center">
          {partner.name}
        </h3>

        <p className="text-slate-400 font-medium text-[13px] leading-relaxed mb-6 line-clamp-3">
          {language === 'id' ? partner.description_id : partner.description_en}
        </p>

        <button
          onClick={() => partner.website && window.open(partner.website, '_blank')}
          className="mt-auto group/btn flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-primary transition-all duration-500"
        >
          DISCOVER MORE
          <svg
            className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>

      {/* Subtle Hover Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const PartnersSection: React.FC = () => {
  const { language } = useLanguage();
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

  // Generate placeholder colors for partners without logos
  const partnerColors = [
    'bg-blue-600', 'bg-cyan-600', 'bg-green-600', 'bg-purple-600',
    'bg-red-600', 'bg-orange-600'
  ];

  const getPartnerInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <section id="partners" className="py-24 md:py-36 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-[11px] font-black tracking-[0.3em] uppercase mb-8 border border-primary/20">
            {t('partners.tagline')}
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter uppercase">
            {t('partners.title.text')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic pr-4">{t('partners.title.italic')}</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            {t('partners.description')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-20">
          <div className="inline-flex bg-white/80 p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 backdrop-blur-xl">
            {[
              { id: 'all', label: t('partners.filter.all') },
              { id: 'principal', label: t('partners.filter.national') },
              { id: 'international', label: t('partners.filter.global') }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeFilter === filter.id
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[3.5rem] h-[550px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPartners.map((partner, index) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                index={index}
                partnerColors={partnerColors}
                language={language}
                getPartnerInitials={getPartnerInitials}
              />
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
