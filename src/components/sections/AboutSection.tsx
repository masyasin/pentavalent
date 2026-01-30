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
    <section id="about" className="py-16 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-20 md:mb-32">
          <div className="lg:w-1/2">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {info ? (language === 'id' ? info.tagline_id : info.tagline_en) : t('about.tagline')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] py-2 mb-6 md:mb-10 text-slate-900">
              {info ? (language === 'id' ? info.title_text_id : info.title_text_en) : t('about.title.text')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic md:px-6 inline-block">{info ? (language === 'id' ? info.title_italic_id : info.title_italic_en) : t('about.title.italic')}</span>
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

        {/* Strategic Pillars: Vision & Mission - Next-Gen Premium Design */}
        <div className="mb-12 relative">
          {/* Contained Background with Rounded Corners */}
          <div className="relative mx-auto max-w-[1600px] rounded-3xl md:rounded-[4rem] overflow-hidden shadow-2xl">
            {/* Advanced Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0f1729] to-[#0a0e27]">
              {/* Animated Mesh Gradient */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
              </div>

              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>

              {/* Radial Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0e27]/80"></div>
            </div>

            {/* Border Glow Effect */}
            <div className="absolute inset-0 rounded-[4rem] border border-white/10"></div>

            <div className="relative z-10 px-6 md:px-12 lg:px-16 py-40">
              <div className="max-w-[1400px] mx-auto">
                {/* Premium Section Header */}
                <div className="text-center mb-24 px-4">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/10 mb-8 group hover:bg-white/[0.05] transition-all duration-300">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                    </span>
                    <span className="text-xs font-black text-white/60 uppercase tracking-[0.3em] group-hover:text-white/80 transition-colors">Strategic Foundation</span>
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-xs font-bold text-cyan-400">2024</span>
                  </div>

                  <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-6 px-4">
                    <span className="inline-block hover:scale-105 transition-transform duration-300">{language === 'id' ? 'Fondasi' : 'Our'}</span>{' '}
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic animate-gradient-x hover:scale-105 transition-transform duration-300 pr-2">Strategic</span>
                  </h3>

                  <p className="text-lg text-blue-100/50 font-medium max-w-2xl mx-auto px-4">
                    {language === 'id'
                      ? 'Komitmen kami terhadap keunggulan dan inovasi berkelanjutan'
                      : 'Our commitment to excellence and sustainable innovation'}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 perspective-1000">
                  {/* Vision Card - Ultra Premium */}
                  <div className="group relative transform-gpu hover:scale-[1.02] transition-all duration-700 ease-out">
                    {/* Animated Glow Border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-[3.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 animate-gradient-xy"></div>

                    {/* Main Card */}
                    <div className="relative h-full bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 border border-white/10 overflow-hidden shadow-2xl">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] transform group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px]"></div>
                      </div>

                      {/* Geometric Decorations */}
                      <div className="absolute top-8 right-8 w-32 h-32 border border-blue-500/10 rounded-3xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
                      <div className="absolute bottom-8 left-8 w-24 h-24 border border-cyan-500/10 rounded-2xl -rotate-12 group-hover:-rotate-45 transition-transform duration-700"></div>

                      {/* Floating Particles */}
                      <div className="absolute top-16 right-20 w-2 h-2 bg-blue-400/60 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                      <div className="absolute top-32 right-40 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute bottom-24 left-24 w-2 h-2 bg-blue-300/50 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                      <div className="absolute bottom-40 left-40 w-1 h-1 bg-cyan-300/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>

                      <div className="relative z-10">
                        {/* Premium Icon */}
                        <div className="mb-14 relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"></div>
                          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/10">
                            <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] backdrop-blur-sm"></div>
                            <svg className="w-14 h-14 text-white drop-shadow-2xl relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Label & Title */}
                        <div className="mb-8">
                          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-black text-blue-300 uppercase tracking-[0.3em]">Vision</span>
                          </div>

                          <h4 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-500">
                            {language === 'id' ? 'Visi Kami' : 'Our Vision'}
                          </h4>

                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-cyan-500 to-transparent rounded-full"></div>
                            <div className="h-1 w-16 bg-gradient-to-r from-cyan-500/50 to-transparent rounded-full"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-xl md:text-3xl text-blue-100/70 font-semibold leading-relaxed mb-12 italic group-hover:text-blue-100/90 transition-colors duration-500">
                          "{info ? (language === 'id' ? info.vision_text_id : info.vision_text_en) : t('about.vision.text')}"
                        </p>

                        {/* Footer */}
                        <div className="flex items-center gap-4 pt-10 border-t border-white/5">
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-transparent"></div>
                          <span className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.4em]">Global Standard</span>
                          <div className="flex-1 h-px bg-gradient-to-l from-blue-500/30 via-cyan-500/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mission Card - Ultra Premium */}
                  <div className="group relative transform-gpu hover:scale-[1.02] transition-all duration-700 ease-out">
                    {/* Animated Glow Border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-600 rounded-[3.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 animate-gradient-xy"></div>

                    {/* Main Card */}
                    <div className="relative h-full bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 border border-white/10 overflow-hidden shadow-2xl">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] transform group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px]"></div>
                      </div>

                      {/* Geometric Decorations */}
                      <div className="absolute top-8 left-8 w-32 h-32 border border-emerald-500/10 rounded-3xl -rotate-12 group-hover:-rotate-45 transition-transform duration-700"></div>
                      <div className="absolute bottom-8 right-8 w-24 h-24 border border-cyan-500/10 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>

                      {/* Floating Particles */}
                      <div className="absolute top-16 left-20 w-2 h-2 bg-emerald-400/60 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute top-32 left-40 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                      <div className="absolute bottom-24 right-24 w-2 h-2 bg-emerald-300/50 rounded-full animate-float" style={{ animationDelay: '2.5s' }}></div>
                      <div className="absolute bottom-40 right-40 w-1 h-1 bg-cyan-300/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

                      <div className="relative z-10">
                        {/* Premium Icon */}
                        <div className="mb-14 relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"></div>
                          <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 border border-white/10">
                            <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] backdrop-blur-sm"></div>
                            <svg className="w-14 h-14 text-white drop-shadow-2xl relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Label & Title */}
                        <div className="mb-8">
                          <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-full mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-[0.3em]">Mission</span>
                          </div>

                          <h4 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-500">
                            {language === 'id' ? 'Misi Kami' : 'Our Mission'}
                          </h4>

                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent rounded-full"></div>
                            <div className="h-1 w-16 bg-gradient-to-r from-cyan-500/50 to-transparent rounded-full"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-xl md:text-3xl text-emerald-100/70 font-semibold leading-relaxed mb-12 italic group-hover:text-emerald-100/90 transition-colors duration-500">
                          "{info ? (language === 'id' ? info.mission_text_id : info.mission_text_en) : t('about.mission.text')}"
                        </p>

                        {/* Footer */}
                        <div className="flex items-center gap-4 pt-10 border-t border-white/5">
                          <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-transparent"></div>
                          <span className="text-[10px] font-black text-emerald-300/40 uppercase tracking-[0.4em]">Sustainable Excellence</span>
                          <div className="flex-1 h-px bg-gradient-to-l from-emerald-500/30 via-cyan-500/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Core Values Section: Ultra Premium Redesign */}
        <div className="mb-12 relative">
          {/* Contained Background with Rounded Corners */}
          <div className="relative mx-auto max-w-[1600px] rounded-3xl md:rounded-[4rem] overflow-hidden shadow-2xl">
            {/* Advanced Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0f1729] to-[#0a0e27]">
              {/* Animated Mesh Gradient */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
              </div>

              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}></div>
            </div>

            {/* Border Glow Effect */}
            <div className="absolute inset-0 rounded-[4rem] border border-white/10"></div>

            <div className="relative z-10 px-6 md:px-12 lg:px-16 py-40">
              <div className="max-w-[1600px] mx-auto">
                {/* Premium Header */}
                <div className="text-center max-w-4xl mx-auto mb-24 px-4">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/10 mb-8 group hover:bg-white/[0.05] transition-all duration-300">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                    </span>
                    <span className="text-xs font-black text-white/60 uppercase tracking-[0.3em] group-hover:text-white/80 transition-colors">{t('about.values.tagline')}</span>
                  </div>

                  <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-6 px-4">
                    <span className="inline-block hover:scale-105 transition-transform duration-300">{language === 'id' ? 'Filosofi' : 'Philosophy of'}</span>{' '}
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic animate-gradient-x hover:scale-105 transition-transform duration-300 pr-2">Penta Valent</span>
                  </h3>

                  <p className="text-lg text-blue-100/50 font-medium px-4">
                    {language === 'id'
                      ? 'Nilai-nilai inti yang membentuk identitas dan budaya perusahaan kami'
                      : 'Core values that shape our corporate identity and culture'}
                  </p>
                </div>

                {/* Values Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                  {values.map((value, idx) => {
                    // Define color schemes for each card
                    const colorSchemes = [
                      {
                        // Card 1: Cyan-Blue
                        border: 'from-cyan-600 via-blue-500 to-cyan-600',
                        bgHover: 'bg-cyan-500/10',
                        bgHover2: 'bg-blue-500/10',
                        geometric: 'border-cyan-500/10',
                        badge: 'from-cyan-500/20 to-blue-500/20',
                        badgeText: 'text-cyan-400',
                        particle1: 'bg-cyan-400/50',
                        particle2: 'bg-blue-400/40',
                        iconGlow: 'from-cyan-500 to-blue-500',
                        iconBg: 'from-cyan-500 via-blue-500 to-blue-600',
                        iconShadow: 'shadow-cyan-500/30',
                        titleHover: 'group-hover:from-cyan-400 group-hover:to-blue-400',
                        divider: 'from-cyan-500 to-blue-500',
                        divider2: 'from-blue-500/50',
                        footerDot1: 'bg-cyan-400',
                        footerDot2: 'bg-blue-400',
                        footerText: 'text-cyan-400/40'
                      },
                      {
                        // Card 2: Purple-Pink
                        border: 'from-purple-600 via-pink-500 to-purple-600',
                        bgHover: 'bg-purple-500/10',
                        bgHover2: 'bg-pink-500/10',
                        geometric: 'border-purple-500/10',
                        badge: 'from-purple-500/20 to-pink-500/20',
                        badgeText: 'text-purple-400',
                        particle1: 'bg-purple-400/50',
                        particle2: 'bg-pink-400/40',
                        iconGlow: 'from-purple-500 to-pink-500',
                        iconBg: 'from-purple-500 via-pink-500 to-pink-600',
                        iconShadow: 'shadow-purple-500/30',
                        titleHover: 'group-hover:from-purple-400 group-hover:to-pink-400',
                        divider: 'from-purple-500 to-pink-500',
                        divider2: 'from-pink-500/50',
                        footerDot1: 'bg-purple-400',
                        footerDot2: 'bg-pink-400',
                        footerText: 'text-purple-400/40'
                      },
                      {
                        // Card 3: Emerald-Teal
                        border: 'from-emerald-600 via-teal-500 to-emerald-600',
                        bgHover: 'bg-emerald-500/10',
                        bgHover2: 'bg-teal-500/10',
                        geometric: 'border-emerald-500/10',
                        badge: 'from-emerald-500/20 to-teal-500/20',
                        badgeText: 'text-emerald-400',
                        particle1: 'bg-emerald-400/50',
                        particle2: 'bg-teal-400/40',
                        iconGlow: 'from-emerald-500 to-teal-500',
                        iconBg: 'from-emerald-500 via-teal-500 to-teal-600',
                        iconShadow: 'shadow-emerald-500/30',
                        titleHover: 'group-hover:from-emerald-400 group-hover:to-teal-400',
                        divider: 'from-emerald-500 to-teal-500',
                        divider2: 'from-teal-500/50',
                        footerDot1: 'bg-emerald-400',
                        footerDot2: 'bg-teal-400',
                        footerText: 'text-emerald-400/40'
                      },
                      {
                        // Card 4: Orange-Amber
                        border: 'from-orange-600 via-amber-500 to-orange-600',
                        bgHover: 'bg-orange-500/10',
                        bgHover2: 'bg-amber-500/10',
                        geometric: 'border-orange-500/10',
                        badge: 'from-orange-500/20 to-amber-500/20',
                        badgeText: 'text-orange-400',
                        particle1: 'bg-orange-400/50',
                        particle2: 'bg-amber-400/40',
                        iconGlow: 'from-orange-500 to-amber-500',
                        iconBg: 'from-orange-500 via-amber-500 to-amber-600',
                        iconShadow: 'shadow-orange-500/30',
                        titleHover: 'group-hover:from-orange-400 group-hover:to-amber-400',
                        divider: 'from-orange-500 to-amber-500',
                        divider2: 'from-amber-500/50',
                        footerDot1: 'bg-orange-400',
                        footerDot2: 'bg-amber-400',
                        footerText: 'text-orange-400/40'
                      }
                    ];

                    const colors = colorSchemes[idx % 4];

                    return (
                      <div
                        key={value.id}
                        className="group relative transform-gpu hover:scale-105 transition-all duration-500 ease-out"
                      >
                        {/* Animated Glow Border */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${colors.border} rounded-[3rem] opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500 animate-gradient-x`}></div>

                        {/* Main Card */}
                        <div className="relative h-full bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-12 border border-white/10 overflow-hidden shadow-2xl">
                          {/* Background Effects */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className={`absolute top-0 right-0 w-48 h-48 ${colors.bgHover} rounded-full blur-[60px] transform group-hover:scale-150 transition-transform duration-1000`}></div>
                            <div className={`absolute bottom-0 left-0 w-32 h-32 ${colors.bgHover2} rounded-full blur-[50px]`}></div>
                          </div>

                          {/* Geometric Decoration */}
                          <div className={`absolute top-6 right-6 w-20 h-20 border ${colors.geometric} rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700`}></div>

                          {/* Number Badge */}
                          <div className={`absolute top-8 left-8 w-12 h-12 bg-gradient-to-br ${colors.badge} backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                            <span className={`text-xl font-black ${colors.badgeText}`}>{String(idx + 1).padStart(2, '0')}</span>
                          </div>

                          {/* Floating Particles */}
                          <div className={`absolute top-20 right-12 w-1.5 h-1.5 ${colors.particle1} rounded-full animate-float`} style={{ animationDelay: `${idx * 0.5}s` }}></div>
                          <div className={`absolute bottom-16 left-12 w-1 h-1 ${colors.particle2} rounded-full animate-float`} style={{ animationDelay: `${idx * 0.5 + 1}s` }}></div>

                          <div className="relative z-10 flex flex-col items-center text-center h-full">
                            {/* Premium Icon */}
                            <div className="mb-10 mt-8 relative">
                              <div className={`absolute inset-0 bg-gradient-to-br ${colors.iconGlow} rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500`}></div>
                              <div className={`relative w-24 h-24 bg-gradient-to-br ${colors.iconBg} rounded-[2rem] flex items-center justify-center shadow-2xl ${colors.iconShadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10`}>
                                <div className="absolute inset-0 bg-white/10 rounded-[2rem] backdrop-blur-sm"></div>
                                <div className="relative z-10 text-white scale-125">
                                  {getIcon(value.icon_name)}
                                </div>
                              </div>
                            </div>

                            {/* Title */}
                            <h4 className={`text-2xl md:text-3xl font-black text-white mb-5 tracking-tighter uppercase leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${colors.titleHover} transition-all duration-500`}>
                              {language === 'id' ? value.title_id : value.title_en}
                            </h4>

                            {/* Divider */}
                            <div className="flex items-center gap-2 mb-6">
                              <div className={`h-1 w-12 bg-gradient-to-r ${colors.divider} rounded-full`}></div>
                              <div className={`h-0.5 w-8 bg-gradient-to-r ${colors.divider2} to-transparent rounded-full`}></div>
                            </div>

                            {/* Description */}
                            <p className="text-sm md:text-base text-blue-100/60 font-medium leading-relaxed group-hover:text-blue-100/80 transition-colors duration-500 flex-grow">
                              {language === 'id' ? value.description_id : value.description_en}
                            </p>

                            {/* Footer Accent */}
                            <div className="mt-8 pt-6 border-t border-white/5 w-full">
                              <div className="flex items-center justify-center gap-2">
                                <div className={`w-1.5 h-1.5 ${colors.footerDot1} rounded-full animate-pulse`}></div>
                                <span className={`text-[9px] font-black ${colors.footerText} uppercase tracking-[0.3em]`}>Core Value</span>
                                <div className={`w-1.5 h-1.5 ${colors.footerDot2} rounded-full animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
                              </div>
                            </div>
                          </div>

                          {/* Large Background Number */}
                          <div className="absolute -bottom-8 -right-4 text-[10rem] font-black text-white/[0.01] select-none pointer-events-none leading-none">
                            {idx + 1}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Timeline: Ultra Premium Redesign */}
        <div className="mb-12 relative">
          {/* Contained Background with Rounded Corners */}
          <div className="relative mx-auto max-w-[1600px] rounded-3xl md:rounded-[4rem] overflow-hidden shadow-2xl">
            {/* Advanced Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0f1729] to-[#0a0e27]">
              {/* Animated Mesh Gradient */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
              </div>

              {/* Dot Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            {/* Border Glow Effect */}
            <div className="absolute inset-0 rounded-[4rem] border border-white/10"></div>

            <div className="relative z-10 px-6 md:px-12 lg:px-16 py-40">
              <div className="max-w-[1200px] mx-auto">
                {/* Premium Header */}
                <div className="text-center mb-32 px-4">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/10 mb-8 group hover:bg-white/[0.05] transition-all duration-300">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                    </span>
                    <span className="text-xs font-black text-white/60 uppercase tracking-[0.3em] group-hover:text-white/80 transition-colors">{t('about.timeline.tagline')}</span>
                  </div>

                  <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-6 px-4">
                    {language === 'id' ? (
                      <>
                        <span className="inline-block hover:scale-105 transition-transform duration-300">Evolusi</span>{' '}
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic animate-gradient-x hover:scale-105 transition-transform duration-300 pr-2">Strategis</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-block hover:scale-105 transition-transform duration-300">Strategic</span>{' '}
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic animate-gradient-x hover:scale-105 transition-transform duration-300 pr-2">Evolution</span>
                      </>
                    )}
                  </h3>

                  <p className="text-lg text-blue-100/50 font-medium max-w-2xl mx-auto px-4">
                    {language === 'id'
                      ? 'Perjalanan transformatif kami dalam mendefinisikan ulang standar distribusi farmasi di Indonesia'
                      : 'Our transformative journey in redefining pharmaceutical distribution standards in Indonesia'}
                  </p>
                </div>

                {/* Vertical Timeline */}
                <div className="relative">
                  {/* Animated Central Line */}
                  <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 via-cyan-500/40 to-blue-500/20 -translate-x-1/2 rounded-full">
                    {/* Traveling Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-24 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-infinite-scroll opacity-60"></div>
                  </div>

                  {/* Timeline Items */}
                  <div className="space-y-16">
                    {timeline.map((item, index) => {
                      // Color schemes for each timeline item
                      const colors = [
                        { dot: 'from-blue-500 to-cyan-500', badge: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/50' },
                        { dot: 'from-purple-500 to-pink-500', badge: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/50' },
                        { dot: 'from-emerald-500 to-teal-500', badge: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/50' },
                        { dot: 'from-orange-500 to-amber-500', badge: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/50' },
                      ][index % 4];

                      return (
                        <div key={item.id} className={`group relative flex items-start gap-8 md:gap-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          {/* Timeline Dot */}
                          <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20">
                            <div className="relative">
                              {/* Outer Glow Ring */}
                              <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${colors.dot} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:scale-150`}></div>

                              {/* Dot Container */}
                              <div className="relative w-16 h-16 bg-[#0a0e27] rounded-2xl border-2 border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors.dot} ${colors.glow} shadow-2xl group-hover:scale-110 transition-transform duration-500`}></div>
                              </div>
                            </div>
                          </div>

                          {/* Content Card */}
                          <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            <div className="relative group/card">
                              {/* Year Badge */}
                              <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${colors.badge} rounded-2xl mb-6 shadow-2xl ${colors.glow} group-hover/card:scale-110 transition-all duration-500`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xl font-black text-white tracking-tight">{item.year}</span>
                              </div>

                              {/* Card Content */}
                              <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl group-hover/card:scale-[1.02] group-hover/card:border-white/20 transition-all duration-500">
                                {/* Background Glow */}
                                <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-48 h-48 bg-gradient-to-br ${colors.dot} opacity-0 group-hover/card:opacity-10 blur-[60px] transition-opacity duration-700`}></div>

                                {/* Geometric Decoration */}
                                <div className={`absolute ${index % 2 === 0 ? 'bottom-6 left-6' : 'bottom-6 right-6'} w-24 h-24 border border-white/5 rounded-3xl rotate-12 group-hover/card:rotate-45 transition-transform duration-700`}></div>

                                <div className="relative z-10">
                                  <h4 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-cyan-400 group-hover/card:to-blue-400 transition-all duration-500">
                                    {language === 'id' ? item.title_id : item.title_en}
                                  </h4>

                                  <p className="text-base md:text-lg text-blue-100/60 font-medium leading-relaxed group-hover/card:text-blue-100/80 transition-colors duration-500">
                                    {language === 'id' ? item.description_id : item.description_en}
                                  </p>

                                  {/* Decorative Line */}
                                  <div className={`mt-6 flex items-center gap-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                    <div className={`h-1 w-16 bg-gradient-to-r ${colors.badge} rounded-full`}></div>
                                    <div className={`h-0.5 w-10 bg-gradient-to-r ${colors.badge} opacity-50 to-transparent rounded-full`}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Large Background Year (Desktop Only) */}
                          <div className={`hidden md:block flex-1 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                            <div className={`text-[10rem] font-black text-white/[0.02] select-none leading-none group-hover:text-white/[0.04] transition-colors duration-700 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                              {item.year}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
