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
    <section id="management" className="py-20 md:py-32 lg:py-32 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-6 border border-primary/10">
            {t('mgmt.title')}
          </span>
          <h2 className="text-fluid-h1 py-2 mb-8 text-slate-900 font-black tracking-tighter">
            {t('mgmt.visionary')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-2 inline-block pr-6">{t('mgmt.governance')}</span>
          </h2>
          <p className="text-fluid-body text-gray-500 max-w-2xl mx-auto">
            {t('mgmt.desc')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {management.map((person) => (
            <div
              key={person.id}
              className="group bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-gray-100 enterprise-shadow transition-all duration-700 hover:-translate-y-4 wow-border-glow relative touch-active active:scale-[0.98]"
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


      </div>
    </section>
  );
};

export default ManagementSection;

