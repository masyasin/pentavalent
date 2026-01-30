import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface ManagementMember {
  id: string;
  name: string;
  position_id: string;
  position_en: string;
  bio_id: string;
  bio_en: string;
  image_url: string;
}

const ManagementSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [management, setManagement] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManagement = async () => {
    try {
      const { data, error } = await supabase
        .from('management')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setManagement(data || []);
    } catch (error) {
      console.error('Error fetching management:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagement();
  }, []);

  if (loading || management.length === 0) return null;

  return (
    <section id="management" className="py-16 md:py-32 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="text-center mb-24">
          <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
            {t('mgmt.title')}
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1] py-2 mb-10 text-slate-900">
            {t('mgmt.visionary')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">{t('mgmt.governance')}</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-3xl mx-auto">
            {t('mgmt.desc')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {management.map((person) => (
            <div
              key={person.id}
              className="group bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-gray-100 enterprise-shadow transition-all duration-700 hover:-translate-y-4 wow-border-glow relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 group/img">
                {/* Background Floating Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-[3] wow-button-gradient"></div>

                <img
                  src={person.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                  alt={person.name}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1 grayscale-[0.2] group-hover:grayscale-0 contrast-[1.05]"
                />

                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                {/* Subtitle Bio - Slides up elegantly */}
                <div className="absolute inset-x-0 bottom-0 p-10 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) delay-100">
                  <div className="w-8 h-[2px] wow-button-gradient mb-4"></div>
                  <p className="text-white text-[12px] leading-relaxed font-bold line-clamp-4 italic opacity-80">
                    {language === 'id' ? person.bio_id : person.bio_en}
                  </p>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-all duration-700 delay-300"></div>
              </div>

              <div className="p-6 sm:p-10 text-center relative bg-white">
                {/* Dynamic Horizon Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-1 wow-button-gradient group-hover:w-32 transition-all duration-700 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>

                <div className="mb-4">
                  <h4 className="text-2xl font-black text-slate-900 group-hover:text-cyan-500 inline-block transition-colors duration-500 tracking-tighter uppercase leading-none">
                    {person.name}
                  </h4>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-4 bg-slate-200"></div>
                  <span className="wow-text-primary text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
                    {language === 'id' ? person.position_id : person.position_en}
                  </span>
                  <div className="h-px w-4 bg-slate-200"></div>
                </div>
              </div>

              {/* Decorative background number/letter */}
              <div className="absolute bottom-2 right-6 text-[8rem] font-black text-slate-50 leading-none select-none -z-10 group-hover:text-cyan-50/50 transition-colors duration-700">
                {String(management.indexOf(person) + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Governance Commitment */}
        <div className="mt-20 md:mt-32 p-8 md:p-12 bg-white rounded-[3.5rem] border border-gray-100 enterprise-shadow text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h3 className="text-2xl font-black text-primary tracking-tighter mb-2">{t('gcg.title')}</h3>
              <p className="text-gray-400 font-bold text-sm">We strictly adhere to the highest standards of transparency and institutional ethics.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary/20 group-hover:text-cyan-500 transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
              </div>
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary/20 group-hover:text-cyan-500 transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementSection;

