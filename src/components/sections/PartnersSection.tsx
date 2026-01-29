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
    <section id="partners" className="py-32 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 uppercase tracking-tight">
          <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] mb-6 border border-primary/10">
            {t('partners.tagline')}
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('partners.title.text')} <br />
            <span className="italic">{t('partners.title.italic')}</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed uppercase-none">
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
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === filter.id
                  ? 'bg-white text-primary shadow-xl ring-1 ring-gray-200'
                  : 'text-gray-400 hover:text-primary'
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
                className="bg-white rounded-[2rem] p-10 flex items-center justify-center hover:shadow-4xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-gray-100 enterprise-shadow relative overflow-hidden"
                onClick={() => partner.website && window.open(partner.website, '_blank')}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-20 h-20 ${partnerColors[index % partnerColors.length]} rounded-3xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                  {getPartnerInitials(partner.name)}
                </div>
                <div className="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partner Stats */}
        <div className="mt-24 grid md:grid-cols-3 gap-12">
          {[
            { value: '50+', label: t('partners.stats.national'), color: 'primary' },
            { value: '20+', label: t('partners.stats.international'), color: 'accent' },
            { value: '10K+', label: t('partners.stats.skus'), color: 'primary' }
          ].map((stat, i) => (
            <div key={i} className={`text-center p-12 bg-white rounded-[3rem] border border-gray-100 enterprise-shadow group hover:bg-${stat.color} transition-all duration-500`}>
              <div className={`text-5xl font-black text-${stat.color} mb-4 group-hover:text-white transition-colors`}>{stat.value}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-white/70 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32">
          <div className="enterprise-gradient rounded-[4rem] p-16 md:p-24 shadow-4xl relative overflow-hidden group">
            {/* Advanced Decorative background circle */}
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-accent opacity-10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="absolute right-0 top-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="inline-block px-5 py-2 bg-white/10 text-accent rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-8 border border-white/10 backdrop-blur-md">
                {t('partners.cta.tagline')}
              </span>
              <h3 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight max-w-4xl">
                {t('partners.cta.title.text')} <br />
                <span className="text-accent italic">{t('partners.cta.title.accent')}</span>
              </h3>
              <p className="text-blue-100/60 mb-12 max-w-2xl text-xl leading-relaxed font-medium">
                {t('partners.cta.description')}
              </p>
              <button className="px-14 py-6 bg-gradient-to-r from-primary to-accent text-white font-black rounded-[2rem] hover:shadow-accent/20 hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-4 group text-lg hover-move-icon">
                {t('partners.cta.button')}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
