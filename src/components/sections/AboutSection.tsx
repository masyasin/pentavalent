import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface TimelineItem {
  id: string;
  year: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
}

interface CorporateValue {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  icon_name: string;
}

interface CompanyInfo {
  tagline_id: string;
  tagline_en: string;
  title_text_id: string;
  title_text_en: string;
  title_italic_id: string;
  title_italic_en: string;
  description_id: string;
  description_en: string;
  stats_years_value: string;
  stats_years_label_id: string;
  stats_years_label_en: string;
  stats_public_value: string;
  stats_public_label_id: string;
  stats_public_label_en: string;
  image_url: string;
  vision_text_id: string;
  vision_text_en: string;
  mission_text_id: string;
  mission_text_en: string;
}

const AboutSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [values, setValues] = useState<CorporateValue[]>([]);
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAboutData = async () => {
    try {
      const [timelineRes, valuesRes, infoRes] = await Promise.all([
        supabase.from('company_timeline').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('corporate_values').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('company_info').select('*').single()
      ]);

      if (timelineRes.data) setTimeline(timelineRes.data);
      if (valuesRes.data) setValues(valuesRes.data);
      if (infoRes.data) setInfo(infoRes.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'shield': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
      case 'zap': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'users': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'award': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
      default: return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  if (loading) return (
    <div className="py-32 flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section id="about" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-20 md:mb-32">
          <div className="lg:w-1/2">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {info ? (language === 'id' ? info.tagline_id : info.tagline_en) : t('about.tagline')}
            </span>
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-6 md:mb-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {info ? (language === 'id' ? info.title_text_id : info.title_text_en) : t('about.title.text')} <br />
              <span className="italic">{info ? (language === 'id' ? info.title_italic_id : info.title_italic_en) : t('about.title.italic')}</span>
            </h2>
            <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed mb-8 md:mb-10">
              {info ? (language === 'id' ? info.description_id : info.description_en) : t('about.description')}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-100">
              <div>
                <div className="text-4xl font-black text-primary mb-1">{info?.stats_years_value || '55+'}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {info ? (language === 'id' ? info.stats_years_label_id : info.stats_years_label_en) : t('about.years.impact')}
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-1">{info?.stats_public_value || 'Tbk'}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {info ? (language === 'id' ? info.stats_public_label_id : info.stats_public_label_en) : t('about.public.listed')}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
            <img
              src={info?.image_url || "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=1000"}
              alt="Corporate Excellence"
              className="relative rounded-[2.5rem] enterprise-shadow border border-gray-100 grayscale hover:grayscale-0 transition-all duration-1000 w-full"
            />
            <div className="absolute -bottom-4 -right-4 md:-bottom-10 md:-right-10 w-36 h-36 md:w-48 md:h-48 bg-gradient-to-r from-primary to-accent rounded-[2rem] md:rounded-[3rem] flex items-center justify-center p-6 md:p-8 text-white shadow-4xl group-hover:-translate-y-4 transition-transform duration-700 hover-lift">
              <div className="text-center font-black leading-tight">
                <div className="text-3xl md:text-4xl">#1</div>
                <div className="text-[8px] md:text-[10px] uppercase tracking-widest mt-2">{t('network.tagline')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Pillars: Vision & Mission - Redesigned for Maximum Impact */}
        <div className="mb-48 relative">
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/[0.01] rounded-[10rem] blur-3xl pointer-events-none"></div>

          <div className="grid lg:grid-cols-2 gap-10 relative z-10">
            {/* Vision Pillar */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative h-full bg-white rounded-[2.5rem] md:rounded-[4.5rem] p-6 sm:p-12 lg:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-cyan-500/20 transition-all duration-700 overflow-hidden flex flex-col justify-between">
                {/* Visual Glow Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-50/50 rounded-bl-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                <div>
                  <div className="flex items-center gap-6 mb-16">
                    <div className="w-24 h-24 bg-white border border-cyan-100 rounded-[2rem] flex items-center justify-center text-cyan-600 shadow-xl shadow-cyan-500/5 group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-500 relative">
                      {/* Glass Reflection */}
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[2rem]"></div>
                      <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-2 block">North Star</span>
                      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                        {language === 'id' ? 'Visi' : 'Our'} <span className="text-cyan-500 italic">{language === 'id' ? 'Kami' : 'Vision'}</span>
                      </h3>
                    </div>
                  </div>

                  <p className="text-xl md:text-3xl font-black text-slate-400 group-hover:text-slate-800 leading-[1.1] transition-colors duration-500 mb-8 italic">
                    "{info ? (language === 'id' ? info.vision_text_id : info.vision_text_en) : t('about.vision.text')}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
                  <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Future Trajectory</span>
                </div>
              </div>
            </div>

            {/* Mission Pillar */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-transparent rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative h-full bg-white rounded-[2.5rem] md:rounded-[4.5rem] p-6 sm:p-12 lg:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-primary/20 transition-all duration-700 overflow-hidden flex flex-col justify-between">
                {/* Visual Glow Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                <div>
                  <div className="flex items-center gap-6 mb-16">
                    <div className="w-24 h-24 bg-white border border-blue-100 rounded-[2rem] flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:rotate-[-10deg] group-hover:scale-110 transition-all duration-500 relative">
                      {/* Glass Reflection */}
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[2rem]"></div>
                      <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">Daily Drive</span>
                      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                        {language === 'id' ? 'Misi' : 'Our'} <span className="text-primary italic">{language === 'id' ? 'Kami' : 'Mission'}</span>
                      </h3>
                    </div>
                  </div>

                  <p className="text-xl md:text-3xl font-black text-slate-400 group-hover:text-slate-800 leading-[1.1] transition-colors duration-500 mb-8 italic">
                    "{info ? (language === 'id' ? info.mission_text_id : info.mission_text_en) : t('about.mission.text')}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
                  <div className="h-[2px] w-20 bg-gradient-to-r from-primary to-transparent"></div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Active commitment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section: Redesigned for Architectural Impact */}
        <div className="mb-48 relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-slate-50/50 rounded-[6rem] -rotate-1 pointer-events-none border border-slate-100/50"></div>

          <div className="relative z-10 px-6 sm:px-12">
            <div className="text-center max-w-3xl mx-auto mb-32">
              <span className="inline-block px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-xl shadow-slate-900/10">
                {t('about.values.tagline')}
              </span>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                {language === 'id' ? 'Filosofi' : 'Philosophy of'} <span className="text-cyan-500 italic">Penta Valent</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <div
                  key={value.id}
                  className="group relative h-full"
                >
                  {/* Outer Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="relative h-full bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-cyan-500/10 transition-all duration-700 overflow-hidden flex flex-col items-center text-center">

                    {/* Massive Background Indicator */}
                    <div className="absolute -top-10 -right-4 text-[12rem] font-black text-slate-50 select-none pointer-events-none group-hover:text-cyan-50/50 transition-colors duration-700">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Icon Strategy */}
                    <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-cyan-500 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative mb-12">
                      {/* Holographic Reflection */}
                      <div className="absolute inset-2 bg-gradient-to-br from-cyan-50 to-transparent rounded-[2rem] opacity-50"></div>
                      <div className="relative z-10 scale-125">
                        {getIcon(value.icon_name)}
                      </div>
                    </div>

                    <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 tracking-tighter uppercase leading-none group-hover:text-cyan-600 transition-colors">
                      {language === 'id' ? value.title_id : value.title_en}
                    </h4>

                    <p className="text-slate-400 font-bold text-xs md:text-sm leading-relaxed group-hover:text-slate-600 transition-colors">
                      {language === 'id' ? value.description_id : value.description_en}
                    </p>

                    {/* Animated Baseline */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="text-center max-w-2xl mx-auto mb-20 md:mb-32">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {t('about.timeline.tagline')}
            </span>
            <h3 className="text-3xl md:text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('about.timeline.title')}
            </h3>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 -translate-x-1/2 rounded-full"></div>

            <div className="space-y-16 md:space-y-32">
              {timeline.map((item, index) => (
                <div key={item.id} className={`relative flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Anchor Point */}
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-white rounded-full border-4 border-primary z-20 -translate-x-1/2 flex items-center justify-center enterprise-shadow">
                    <div className="w-4 h-4 bg-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 md:pl-0 ${index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20 md:text-left'} pl-12 sm:pl-16`}>
                    <div className="group bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 enterprise-shadow hover:-translate-y-2 transition-all duration-700 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                      <div className={`inline-block px-6 py-2 bg-primary text-white text-[10px] font-black rounded-full mb-8 tracking-[0.2em] transform group-hover:scale-110 transition-transform`}>
                        {item.year}
                      </div>

                      <h4 className="text-xl md:text-3xl font-black text-primary mb-4 md:mb-6 tracking-tighter group-hover:text-accent transition-colors leading-tight">
                        {language === 'id' ? item.title_id : item.title_en}
                      </h4>

                      <p className="text-sm md:text-lg text-gray-500 font-bold leading-relaxed">
                        {language === 'id' ? item.description_id : item.description_en}
                      </p>
                    </div>
                  </div>

                  {/* Spacing for layout consistency */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
