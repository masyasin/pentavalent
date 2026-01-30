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
            <h2 className="text-2xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] py-2 mb-6 md:mb-10 text-slate-900">
              {info ? (language === 'id' ? info.title_text_id : info.title_text_en) : t('about.title.text')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">{info ? (language === 'id' ? info.title_italic_id : info.title_italic_en) : t('about.title.italic')}</span>
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-b from-slate-50/0 via-slate-100/50 to-slate-50/0 rounded-[10rem] blur-3xl pointer-events-none"></div>

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
                      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] py-2">
                        {language === 'id' ? 'Visi' : 'Our'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">{language === 'id' ? 'Kami' : 'Vision'}</span>
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
                      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] py-2">
                        {language === 'id' ? 'Misi' : 'Our'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">{language === 'id' ? 'Kami' : 'Mission'}</span>
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
          {/* Deep Background Pattern */}
          <div className="absolute inset-0 bg-slate-900 rounded-[6rem] -rotate-1 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 px-6 sm:px-12 py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto mb-32">
              <span className="inline-block px-5 py-2 bg-white/10 text-cyan-400 rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 border border-white/10 backdrop-blur-md">
                {t('about.values.tagline')}
              </span>
              <h3 className="text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] py-2">
                {language === 'id' ? 'Filosofi' : 'Philosophy of'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">Penta Valent</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <div
                  key={value.id}
                  className="group relative h-full wow-border-glow border border-white/10 rounded-[3rem]"
                >
                  {/* Outer Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 overflow-hidden group flex flex-col items-center text-center">
                    {/* Visual Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                    {/* Massive Background Indicator */}
                    <div className="absolute -top-10 -right-4 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none group-hover:text-cyan-400/5 transition-colors duration-700 leading-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Icon Strategy */}
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center wow-text-primary shadow-lg group-hover:scale-110 transition-transform duration-500 mb-12">
                      <div className="relative z-10 scale-125">
                        {getIcon(value.icon_name)}
                      </div>
                    </div>

                    <h4 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase leading-tight group-hover:text-cyan-400 transition-colors">
                      {language === 'id' ? value.title_id : value.title_en}
                    </h4>

                    <p className="text-blue-100/40 font-bold text-xs md:text-sm leading-relaxed group-hover:text-blue-100/70 transition-colors">
                      {language === 'id' ? value.description_id : value.description_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Timeline: Redesigned for Immersive Storytelling */}
        <div className="relative mt-32 md:mt-48 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16 py-32 bg-[#051129] overflow-hidden rounded-[4rem] md:rounded-[6rem]">
          {/* Background Ambient Effects */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-24 md:mb-32">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8 transform hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">
                  {t('about.timeline.tagline')}
                </span>
              </div>
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8 py-2">
                {language === 'id' ? (
                  <>Evolusi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic px-4">Strategis</span></>
                ) : (
                  <>Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic px-4">Evolution</span></>
                )}
              </h3>
              <p className="text-blue-100/50 text-lg font-medium leading-relaxed">
                {language === 'id'
                  ? 'Perjalanan transformatif kami dalam mendefinisikan ulang standar distribusi farmasi di Indonesia.'
                  : 'Our transformative journey in redefining pharmaceutical distribution standards in Indonesia.'}
              </p>
            </div>

            <div className="relative max-w-[1400px] mx-auto">
              {/* Central Energy Line */}
              <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent -translate-x-1/2 rounded-full hidden md:block">
                {/* Traveling Glow Point */}
                <div className="absolute top-0 left-[-2px] w-[5px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-infinite-scroll"></div>
              </div>

              {/* Mobile Line */}
              <div className="absolute left-[30px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-cyan-500/50 to-transparent md:hidden"></div>

              <div className="space-y-12 md:space-y-20">
                {timeline.map((item, index) => (
                  <div key={item.id} className={`group relative flex flex-col md:flex-row items-start md:items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                    {/* Year Descriptor - Side Panel */}
                    <div className={`hidden md:flex w-full md:w-1/2 items-center ${index % 2 === 0 ? 'justify-start pl-20' : 'justify-end pr-20'}`}>
                      <div className="text-[12rem] font-black leading-none text-white/[0.03] select-none group-hover:text-blue-500/10 transition-colors duration-700">
                        {item.year}
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-[30px] md:left-1/2 w-14 h-14 bg-[#051129] rounded-2xl border-2 border-white/10 z-20 -translate-x-1/2 flex items-center justify-center group-hover:border-cyan-500/50 transition-all duration-500 group-hover:scale-110">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:scale-125 transition-transform"></div>

                      {/* Connection Branch */}
                      <div className={`hidden md:block absolute top-1/2 w-20 h-px bg-gradient-to-r ${index % 2 === 0 ? 'right-full from-transparent to-blue-500/20' : 'left-full from-blue-500/20 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    </div>

                    {/* Dynamic Card */}
                    <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] transition-all duration-700 group/card overflow-hidden">
                        {/* Interactive Corner Accent */}
                        <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity`}></div>

                        {/* Mobile Year Tag */}
                        <div className="flex md:hidden items-center gap-3 mb-6">
                          <span className="px-4 py-1.5 bg-blue-600 rounded-lg text-xs font-black text-white italic tracking-tighter shadow-lg shadow-blue-900/40">
                            {item.year}
                          </span>
                        </div>

                        <div className={`inline-flex md:hidden items-center gap-2 mb-4 text-[10px] font-black text-blue-400 uppercase tracking-widest ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                          <div className="w-8 h-px bg-blue-500/30"></div>
                          Strategic Milestone
                        </div>

                        <h4 className={`text-2xl md:text-3xl font-black text-white mb-6 tracking-tighter leading-tight group-hover/card:text-cyan-400 transition-colors ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                          {language === 'id' ? item.title_id : item.title_en}
                        </h4>

                        <p className={`text-sm md:text-lg text-blue-100/60 font-medium leading-relaxed ${index % 2 === 0 ? 'md:text-right ml-auto' : ''} max-w-lg`}>
                          {language === 'id' ? item.description_id : item.description_en}
                        </p>

                        {/* Hidden Decorative Index */}
                        <div className={`absolute bottom-8 ${index % 2 === 0 ? 'left-8' : 'right-8'} text-[4rem] font-black text-white/[0.02] italic leading-none`}>
                          #{String(index + 1).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA / Quote */}
            <div className="mt-32 text-center">
              <div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400">
                <div className="px-12 py-10 rounded-[1.5rem] bg-[#051129] text-center">
                  <p className="text-xl md:text-2xl font-black text-white italic mb-2">
                    {language === 'id' ? '"Membangun masa depan kesehatan Indonesia."' : '"Shaping the future of healthcare in Indonesia."'}
                  </p>
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.4em]">Integrated Logistics Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
